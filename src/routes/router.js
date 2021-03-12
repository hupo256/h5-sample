import React from 'react'
import PropTypes from 'prop-types'
import andall from '@src/common/utils/andall-sdk'
import sensors from '@src/common/utils/sensors'
import fun from '@src/common/utils'
import ua from '@src/common/utils/ua'
import userApi from '@src/common/api/userApi'
import publicApi from '@src/common/api/publicApi'
import wx from 'weixin-js-sdk'

const { isWechat, isIos, isAndall } = ua
const { setSession, getSession, getParams, togetPageIds, isTheAppVersion } = fun

class Router extends React.Component {
  state = {
    bool: false,
  }
  componentDidMount() {
    // this.setState({ bool: true1 })
    // return
    const obj = getParams()
    if (isWechat() && obj.token) {
      wx.miniProgram.getEnv(res => {
        if (res.miniprogram) {
          if (obj.token) {
            window.localStorage.setItem('token', obj.token)
            window.localStorage.setItem('wxMiniprogramTokenSample', obj.token)
          }
          setTimeout(() => {}, 500)
          this.init(1)
          return
        }
      })
    }

    if (isAndall()) {
      andall.config({
        jsApiList: ['setManualQR', 'reportDetailChangeIndex', 'onVisibleChanged', 'closeDialog']
      })
      andall.on('onVisibleChanged', (res) => {
        res.visibility && togetPageIds()
      })
    }
    this.getUserToken()
  }

  // 获取初始化数据
  init = (n) => {
    if (isTheAppVersion('1.6.8')) {
      setTimeout(() => {
        let pageInfo = getSession('pageInfo')
        andall.invoke('touchPageId', pageInfo, res => {
          setSession('pageInfo', res)
          this.setState({ bool: true })
        })
      }, 200)
      return
    }
    // alert(n)
    this.setState({ bool: true })
    this.flow()
  }

  getSourceInfo = () => {
    const obj = getParams()
    const { code, state } = obj
    let { history, location } = window
    let { search, pathname } = location
    search = search.substring(0, search.indexOf('code') - 1) || ''
    let name = pathname
    if (search) {
      name += search
    }
    if (code && state && pathname === '/') {
      history.replaceState({}, null, name)
      const { href } = location
      localStorage.setItem('iosUrl111', href)
    }
  }

  // 获取用户token
  getUserToken() {
    const { code, state, source = 'wechat', medium = 'guanfang', channelCode} = getParams()
    let token = localStorage.getItem('token')
    source && localStorage.setItem('source', source)
    medium && localStorage.setItem('medium', medium)
    channelCode && localStorage.setItem('channelCode', channelCode)
    localStorage.setItem('iosUrl', location.href)
    if (isAndall()) {
      setTimeout(() => {
        andall.invoke('token', {}, res => {
          res.result.token && localStorage.setItem('token', res.result.token)
        })
      }, 200)
    }
    if (token && !isAndall()) {
      userApi.myInfo({ noloading: 1, clientType : isWechat() ? 'WeChat' : 'H5' }).then(res => {
        // 神策保存userId
        if (res.code) {
          //localStorage.removeItem('token')
          token = null
          if (isWechat()) {
            this.getWechatToken(state, code)
            return
          }
        } else {
          if (isWechat() && !res.data.openId) {
            //localStorage.removeItem('token')
            token = null
            this.getWechatToken(state, code)
            return
          }
        }
      })
    } else {
      if (isWechat() ) {
        this.getWechatToken(state, code)
        return
      }
    }
    this.init(4)
  }
  getWechatToken = (state, code) => {
    isIos() && this.getSourceInfo()
    if (code && state) {
      publicApi.publicauth({ code, mobileMode: 'oppo', noloading:1 }).then(res => {
        console.log('publicauth: ' + res.data.token)
        if (res.data) {
          localStorage.setItem('token', res.data.token)
          this.init(3)
        }
      })
    } else {
      const url = encodeURIComponent(location.href.split('#')[0])
      publicApi.publicauthurl({ url, noloading:1 }).then(res => {
        console.log('publicauthurl: ' + res.data.snsapiUrl)
        const { code, data } = res
        code || window.location.replace(data.snsapiUrl)
      })
    }
  }

  // 创建clab script 保存用户userId
  createTrackPointScript = () => {
    let convertLabUrl = location.host.indexOf('wechatshop') === 0
      ? '//cbejd.convertlab.com/cbe/collect?tid=1690894073&at=0&h=web' // 生产 1690894073
      : '//cbejd.convertlab.com/cbe/collect?tid=1790465370&at=0&h=web' // 测试 1790465370
    let d = document
    let g = d.createElement('script')
    let s = d.getElementsByTagName('script')[0]
    g.type = 'text/javascript'
    g.src = convertLabUrl
    s.parentNode.insertBefore(g, s)
    userApi.myInfo({ noloading: 1 }).then(data => {
      // 神策保存userId
      sensors.login(data.userId)
      // cLab保存userId
      window.clab_tracker &&
      window.clab_tracker.ready(function () {
        this.push({
          pageType: 'web',
          identityType: 'c_userid',
          identityValue: data.userId,
          identityType2: 'wechat',
          identityValue2: data.openId,
          identityType3: 'wechat-unionid',
          identityValue3: data.unionId
        })
        this.track('open_page', {})
      })
    })
  }

  // 流量统计 埋点
  flow = () => {
    // 神策和clab埋点保存userId
    // this.createTrackPointScript()
    if (IS_ENV !== 'production') return false
    const hm = document.createElement('script')
    hm.src = 'https://hm.baidu.com/hm.js?0f35e75c45bf76329fda1ead9f9981de'
    const s = document.getElementsByTagName('script')[0]
    s.parentNode.insertBefore(hm, s)
  }

  render() {
    const { bool } = this.state
    return (
      <React.Fragment>{bool ? this.props.children : ''}</React.Fragment>
    )
  }
}
Router.propTypes = {
  children: PropTypes.object,
  upLindManId: PropTypes.func
}

export default Router
