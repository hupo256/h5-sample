import React from 'react'
import PropTypes from 'prop-types'
import wx from 'weixin-js-sdk'
import andall from '@src/common/utils/andall-sdk'
import { API, fun, ua } from '@src/common/app'
import { LNDIMAN_WHITE } from '@src/common/api/white'
import { observer, inject } from 'mobx-react'

const { isWechat, isIos, isAndall } = ua

@inject('user')
@observer
class Router extends React.Component {
  state = {
    bool: false,
    isToken: true
  }
  componentDidMount() {
    // this.setState({ bool: true })
    // return
    if (isWechat()) {
      wx.miniProgram.getEnv(res => {
        if (res.miniprogram) {
          const obj = fun.getParams()
          if (obj.token) {
            window.localStorage.setItem('token', obj.token)
            window.localStorage.setItem('wxMiniprogramTokenSample', obj.token)
          }
          this.init()
          return
        }
        this.getUserToken()
      })
    }
    if (isAndall()) {
      andall.config({
        jsApiList: ['setManualQR']
      })
    }
    this.getUserToken()
  }

  // 本地开发环境
  localEnv = () => {
    // 本地开发环境
    const obj = fun.getParams()
    obj.token && window.localStorage.setItem('token', obj.token)
    this.getLastUserLindManId()
    // 测试埋点
  }

  // 获取初始化数据
  init = () => {
    this.getLastUserLindManId()
  }

  getSourceInfo = () => {
    const obj = fun.getParams()
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
      localStorage.setItem('iosUrl', href)
    }
  }

  // 获取用户token
  getUserToken() {
    const obj = fun.getParams()
    const { code, state, source = 'wechat', medium = 'guanfang', channelCode } = obj
    let token = localStorage.getItem('token')
    const { location } = window
    source && localStorage.setItem('source', source)
    medium && localStorage.setItem('medium', medium)
    channelCode && localStorage.setItem('channelCode', channelCode)
    localStorage.setItem('iosUrl', location.href)
    let that = this
    isAndall() && setTimeout(() => {
      andall.invoke('token', {}, function (res) {
        if (res.result.token) {
          window.localStorage.setItem('token', res.result.token)
          that.init()
        } else {
          that.setState({
            isToken: false
          }, () => {
            that.init()
          })
        }
      })
    }, 500)
    if (isAndall()) return

    if (!token && isWechat()) {
      isIos() && this.getSourceInfo()
      if (code && state) {
        API.publicauth({ code, mobileMode: 'oppo' }).then(res => {
          console.log('publicauth: ' + res.data.token)
          if (res.data) {
            localStorage.setItem('token', res.data.token)
            this.init()
          }
        })
        return
      } else {
        const url = encodeURIComponent(location.href.split('#')[0])
        API.publicauthurl({ url }).then(res => {
          console.log('publicauthurl: ' + res.data.snsapiUrl)
          const { code, data } = res
          code || (location.href = data.snsapiUrl)
        })
        return
      }
    }
    this.init()
  }

  /**
   * 获取最后一次切换用户的关系人ID
   * */
  getLastUserLindManId = () => {
    const { isToken } = this.state
    const { user: { getLastUserLindManId } } = this.props
    let { pathname } = window.location
    pathname = pathname.split('/andall-sample')
    // let linkMan = localStorage.getItem('linkMan')
    // if (linkMan) {
    //   this.props.upLindManId(JSON.parse(linkMan))
    //   this.setState({ bool: true })
    //   return
    // }
    if (!isToken) {
      this.setState({ bool: true })
      return
    }
    if (LNDIMAN_WHITE.indexOf(pathname[1]) >= 0) {
      console.log('LNDIMAN_WHITE')
      this.setState({ bool: true })
      return
    }
    getLastUserLindManId().then(res => {
      console.log('LindManId')
      this.setState({ bool: true })
    })
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
  getLastUserLindManId: PropTypes.func,
  upLindManId: PropTypes.func
}

export default Router
