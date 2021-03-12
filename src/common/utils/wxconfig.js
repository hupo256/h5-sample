import wx from 'weixin-js-sdk'
import publicApi from '@src/common/api/publicApi'
import ua from '@src/common/utils/ua'
const { isIos, isWechat, isAndroid } = ua
const { location } = window

/***
 * 微信分享配置
 * @param {title 标题、imgUrl 图片、desc 描述、link 链接} obj
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
    const configData = {
      ...params
    }
    console.log(2);
    
    if (showMenu) {
      console.log(3);
      
      wx.showAllNonBaseMenuItem()
      wx.onMenuShareTimeline(configData)
      wx.onMenuShareAppMessage(configData)
    } else {
      console.log(4);
      
      wx.hideAllNonBaseMenuItem()
    }
    return
  }
  publicApi.createJsapiSignature({ url: decodeURIComponent(url.split('#')[0]) }).then(res => {
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
        'chooseWXPay',
        'onMenuShareWeibo',
        'onMenuShareQZone',
        'openLocation',
        'getLocation',
        'hideOptionMenu',
        'showOptionMenu',
        'updateAppMessageShareData',
        'updateTimelineShareData',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'showMenuItems',
      ]
    })
    wx.ready(() => {
      const configData = {
        ...params
      }
      if (showMenu) {
        console.log(5);
        wx.showMenuItems({
          menuList: [
            'menuItem:share:appMessage', 
            'menuItem:share:timeline',
            'menuItem:share:qq',
            'menuItem:favorite',
            'menuItem:copyUrl',
            'menuItem:originPage',
            'menuItem:openWithQQBrowse',
          ] 
        });

        // wx.showAllNonBaseMenuItem()
        wx.updateAppMessageShareData(configData)
        wx.updateTimelineShareData(configData)
      } else {
        console.log(6);
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
