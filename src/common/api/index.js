import axios from 'axios'
import { Toast } from 'antd-mobile'
import wx from 'weixin-js-sdk'
import config from '../utils/config'
import UA from '../utils/ua'
// 接口模块
import order from './order'
import publice from './public'
import user from './user'
import milv from './milv'
import home from './home'
import sampling from './sampling'
import report from './report'
import questionnaire from './questionnaire'
import account from './account'
import card from './card'
import member from './member'
import active from './active'
import salebox from './salebox'
import activContent from './activContent' // 首页2.0详情页
import app from './app'
import height from './height' // 身高小工具
import andall from '@src/common/utils/andall-sdk'
import { LNDIMAN_WHITE } from '@src/common/api/white'
import skinSearch from './skinSearch'

const { isWechat, isAndall, isIos } = UA
// 小程序token
let num = 0
const { host } = config
const loadinList = []

// 获取token
const getToken = () => {
  let token = window.localStorage.getItem('token')
  if (isWechat()) {
    wx.miniProgram.getEnv(res => {
      const key = res.miniprogram ? 'wxMiniprogramTokenSample' : 'token'
      token = window.localStorage.getItem(key) || token
    })
  } else if (isAndall()) {
    token ||
      setTimeout(() => {
        andall.invoke('token', {}, function(res) {
          window.localStorage.setItem('token', res.result.token)
          token = res.result.token
        })
      }, 200)
  }
  return token
}
// 实例化 ajax请求对象
const ajaxinstance = axios.create({
  baseURL: host,
  timeout: 20000,
  headers: {
    responseType: 'json'
  }
})

// 请求拦截器
ajaxinstance.interceptors.request.use(
  request => {
    const token = getToken()
    const { data = {}, params = {} } = request
    if (!data.noloading && !params.noloading) {
      loadinList.push(1)
      // Toast.hide()
      // setTimeout(Toast.hide, 20)
      Toast.loading(data.loadingTit || params.loadingTit || '加载中...', 20)
    }
    token && (request.headers['Token'] = token) // (location.href = '/#/')
    return request
  },
  error => {
    Toast.hide()
    console.log(error)
  }
)

// 响应拦截器
ajaxinstance.interceptors.response.use(
  response => {
    const { config, data } = response
    const { code, result, msg } = data
    let { pathname } = window.location
    pathname = pathname.split('/andall-sample')
    const isWhite = LNDIMAN_WHITE.indexOf(pathname[1]) >= 0

    loadinList.length === 1 && Toast.hide()
    loadinList.splice(0, 1)
    if (+code) {
      const { data = {}, params = {} } = config
      if (!data.nomsg && !params.nomsg) {
        if (!config.data || ((!JSON.parse(config.data).withoutBack) && +code !== 100001)) {
          !isWhite && Toast.fail(msg, 2)
        }
      }
      if (+code === 100001) {
        // 判断是否时微信环境
        if (isWechat()) {
          // 判断是否是小程序环境
          wx.miniProgram.getEnv(res => {
            if (res.miniprogram) {
              if (num) return
              window.localStorage.setItem('wxMiniprogramTokenSample', '')
              ++num
              const path = '/pages/index/index'
              // 通过JSSDK的api使小程序跳转到指定的小程序首页
              num === 1 && wx.miniProgram.navigateTo({
                url: path,
                success: function (res) {
                  let n = 1
                  const dowrnTime = () => {
                    if (n < 15) {
                      setTimeout(() => {
                        let newToken = window.localStorage.getItem('wxMiniprogramTokenSample')
                        if (newToken) {
                          window.localStorage.setItem('wxMiniprogramTokenSample', newToken)
                          window.location.reload()
                          return
                        }
                        n++
                      }, 200)
                    }
                  }
                  dowrnTime()
                }
              })
              return
            }
            localStorage.setItem('token', '')
            window.location.reload()
          })
        }
        if (isAndall() && !isWhite) {
          window.localStorage.setItem('token', '')
          if (isIos()) {
            if (!config.data || !JSON.parse(config.data).withoutBack) {
              andall.invoke('back')
            }
            andall.invoke('login', {}, (res) => {
              window.localStorage.setItem('token', res.result.token)
              window.location.reload()
            })
          } else {
            andall.invoke('login', {}, (res) => {
              window.localStorage.setItem('token', res.result.token)
              window.location.reload()
            })
            if (!config.data || !JSON.parse(config.data).withoutBack) {
              andall.invoke('back')
            }
          }
        }
      }
    }
    return { data: result, code, msg }
  },
  error => {
    Toast.hide()
    return console.log(error)
  }
)

/**
 * [API api接口封装]
 * @type {Object}
 */
const API = {
  ...order(ajaxinstance),
  ...home(ajaxinstance),
  ...publice(ajaxinstance),
  ...sampling(ajaxinstance),
  ...user(ajaxinstance),
  ...report(ajaxinstance),
  ...questionnaire(ajaxinstance),
  ...account(ajaxinstance),
  ...card(ajaxinstance),
  ...member(ajaxinstance),
  ...active(ajaxinstance),
  ...salebox(ajaxinstance),
  ...activContent(ajaxinstance),
  ...milv(ajaxinstance),
  ...app(ajaxinstance),
  ...skinSearch(ajaxinstance),
  ...height(ajaxinstance)
}

export default API
