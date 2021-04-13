let env = IS_ENV === 'production' || IS_ENV === 'pre' ? '' : IS_ENV
const port = window.location.protocol || 'http:'
// 接口host
let baseHost = `//devapi.dnatime.com/`
// 域名地址
const hostName = `${port}//${env}wechatshop.dnatime.com`
// 测试环境
// baseHost = '//api.dnatime.com'
// baseHost = '//testapi.dnatime.com'
// baseHost = '//devapi.dnatime.com'

// 本地环境
baseHost = '//10.1.4.58:8291/'
// baseHost = '//10.88.27.196:8093'
// baseHost ='//10.88.24.137:3000/api/'

if (IS_ENV !== 'local') {
  baseHost = location.origin.replace('wechatshop', 'api') + '/'
}
const ssoUrl = `//host${env}.test.com/#/logout`
let host = baseHost // + '/api'
export default {
  baseHost,
  host,
  ssoUrl,
  hostName,
}
