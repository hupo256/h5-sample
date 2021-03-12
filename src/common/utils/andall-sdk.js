/* eslint-disable no-undef */
let ua = navigator.userAgent
let info = {}
info.isAndall = /andall/.test(ua.toLowerCase())
info.isWx = /micromessenger/.test(ua.toLowerCase())
info.isIos = /ios/.test(ua.toLowerCase())
info.isAndroid = /android/.test(ua.toLowerCase())
if (info.isAndall) {
  const nav = ua.split('/')
  info.deviceName = nav[2] // 设备名称
  info.deviceID = nav[3] // 设备id
  info.version = nav[4] // 版本号
  info.buildVersion = nav[5] // 小版本号
  info.systemVersion = nav[6]// 系统版本
  info.appBundle = nav[7] // 应用包名
  info.channel = nav[8]// 渠道号
}

let andall = {
  cached: {},
  handlers: {},
  on: function (type, handler) {
    if (typeof handler !== 'function') return

    if (typeof this.handlers[type] === 'undefined') {
      this.handlers[type] = []
    }
    this.handlers[type].push(handler)

    if (this.cached[type] instanceof Array) {
      handler.apply(null, this.cached[type])
    }
  },
  remove: function (type, handler) {
    var events = this.handlers[type]
    for (var i = 0, len = events.length; i < len; i++) {
      if (events[i] == handler) {
        events.splice(i, 1)
        break
      }
    }
  },
  trigger: function (type) {
    if (this.handlers[type] instanceof Array) {
      var handlers = this.handlers[type]
      var args = Array.prototype.slice.call(arguments, 1)
      for (var i = 0, len = handlers.length; i < len; i++) {
        handlers[i].apply(null, args)
      }
    }
    this.cached[type] = Array.prototype.slice.call(arguments, 1)
  },
  info: info,
  config: function (obj) {
    let that = this
    this.connect(function (bridge) {
      info.isAndall && info.isAndroid && bridge.init(function (message, responseCallback) {
        console.log('js获取消息', message)
        responseCallback()
      })
      obj.jsApiList.forEach(methodName => {
        bridge && bridge.registerHandler(methodName, function (data) {
          that.trigger(methodName, data)
        })
      })
    })
  },
  invoke: function (methodName, params, callback) {
    if (window.WebViewJavascriptBridge) {
      window.WebViewJavascriptBridge.callHandler(methodName, params, function (res) {
        if (info.isAndall && info.isAndroid && typeof res === 'string' && res) {
          res = JSON.parse(res.replace(/\r\n|\r|\n/g, ''))
        }
        callback(res)
      })
    }
  },
  connect: function (callback) {
    if (info.isAndall && info.isAndroid) {
      if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge)
      } else {
        document.addEventListener(
          'WebViewJavascriptBridgeReady'
          , function () {
            callback(WebViewJavascriptBridge)
          },
          false
        )
      }
      return
    }
    if (info.isAndall && info.isIos) {
      if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge) }
      if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback) }
      window.WVJBCallbacks = [callback]
      var WVJBIframe = document.createElement('iframe')
      WVJBIframe.style.display = 'none'
      WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'
      document.documentElement.appendChild(WVJBIframe)
      setTimeout(function () { document.documentElement.removeChild(WVJBIframe) }, 0)
    }
  }
}
window.andall = andall
export default andall
