import wx from 'weixin-js-sdk'
import { API, ua, config, fun } from '@src/common/app'
import logo from '@static/wxlogo.jpg'
const imgUrl = logo.substring(2, logo.length)
const { protocol } = window.location
const shareImgUrl = IS_ENV === 'production' ? protocol + logo : config.hostName + imgUrl
const { isIos, isWechat, isAndroid } = ua
const { location } = window
const { getParams } = fun

/***
 * 微信分享配置
 * @param {title 标题、imgUrl 图片、desc 描述、link 链接} obj
 */

const wxShareParams = (obj) => {
  let link = location.href
  const { code, state } = getParams()
  const len = link.indexOf('code')
  if (code && state) {
    link = link.substring(0, len - 1)
  }
  return {
    title: '安我基因商城',
    link,
    imgUrl: shareImgUrl,
    desc: '生活因我安好'
  }
}

/***
  * 微信版本是否大于6.3.31
  * @type {Function}
  */

const weixinVersion = () => {
  const str = window.navigator.userAgent
  let v0 = [6, 3, 31]
  let regExp = /MicroMessenger\/([\d|\.]+)/
  if (regExp.exec(str) === null) { return }
  let v1 = regExp.exec(str)[1].split('.')
  if (v1.length >= 4) {
    v1 = v1.slice(0, 3)
  }
  v1 = v1.map(v => parseInt(v, 10))
  if (v1[0] > v0[0]) {
    return true
  }
  if (v1[0] === v0[0] && v1[1] > v0[1]) {
    return true
  }
  if (v1[0] === v0[0] && v1[1] === v0[1] && v1[2] >= v0[2]) {
    return true
  }
  return false
}

/**
 * 安卓微信版本小于6.3
 * @param {} option
 */

const versionStatus = () => (isAndroid() && !weixinVersion())

const wxconfig = (option = {}) => {
  if (!isWechat()) return
  const { showMenu, params = {} } = option
  let hosturl = location.href
  const href = hosturl
  const iosUrl = localStorage.getItem('iosUrl')
  let url = versionStatus() || isIos() ? iosUrl || href : href
  if (window.IOS_STATUS) {
    const wxParams = wxShareParams()
    const configData = {
      ...wxParams,
      ...params
    }
    if (showMenu) {
      wx.showAllNonBaseMenuItem()
      wx.onMenuShareTimeline(configData)
      wx.onMenuShareAppMessage(configData)
    } else {
      wx.hideAllNonBaseMenuItem()
    }
    return
  }
  API.createJsapiSignature({ url: decodeURIComponent(url.split('#')[0]) }).then(res => {
    const { code, data } = res
    if (code) return
    const { appId, timestamp, nonceStr, signature } = data
    wx.config({
      // debug: true,
      debug: false,
      appId,
      timestamp,
      nonceStr,
      signature,
      jsApiList: [
        'previewImage',
        'getLocalImgData',
        'chooseImage',
        'scanQRCode',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'chooseWXPay',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem'
      ]
    })
    wx.ready(() => {
      const wxParams = wxShareParams()
      const configData = {
        ...wxParams,
        ...params
      }
      if (showMenu) {
        wx.showAllNonBaseMenuItem()
        wx.onMenuShareTimeline(configData)
        wx.onMenuShareAppMessage(configData)
      } else {
        wx.hideAllNonBaseMenuItem()
      }
      if (isIos() || versionStatus()) {
        window.IOS_STATUS = true
      }
    })

    wx.error(res => {

    })
  }).catch(error => {
    console.log(error)
  })
}

export default wxconfig
