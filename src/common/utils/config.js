let env = IS_ENV === 'production' || IS_ENV === 'pre' ? '' : IS_ENV
const port = window.location.protocol || 'http:'
// 接口host
let baseHost = `//devapi.dnatime.com/`
// 域名地址
const hostName = `${port}//${env}wechatshop.dnatime.com`
// 测试环境
// baseHost = '//api.dnatime.com'
baseHost = '//testapi.dnatime.com'
// baseHost = '//test02api.dnatime.com'
// baseHost = '//devapi.dnatime.com'
// 本地环境

// 科成
// baseHost = '//10.88.27.119:8088/'
// 海波
// baseHost = 'http://192.168.3.208:8088/'
// 建军
// baseHost = 'http://192.168.3.221:8088/'
// 顶哥
// baseHost = 'http://192.168.3.

// baseHost = 'http://192.168.1.142:8088/'
// 宁哥
// baseHost = 'http://192.168.3.34:8088/'
// 海平
// baseHost = 'http://192.168.1.211:8088'
// 王世杰
// sso url
// baseHost = 'http://192.168.1.128:8088/'
// 曹友园
// baseHost = 'http://192.168.3.244:8088/'

if (IS_ENV !== 'local') {
  baseHost = location.origin.replace('wechatshop', 'api') + '/'
}
const ssoUrl = `//host${env}.test.com/#/logout`
let host = baseHost // + '/api'
export default {
  baseHost,
  host,
  ssoUrl,
  hostName
}
