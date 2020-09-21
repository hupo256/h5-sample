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
// baseHost = '//dev02api.dnatime.com'
// 本地环境
// baseHost = '//10.88.10.3:8088'
// baseHost = '//10.88.27.196:8093'
// baseHost ='//10.88.24.137:3000/api/'
// 志凯
// baseHost = '//10.88.27.55:8088/'
// 陈凯
// baseHost = '//10.88.27.49:8088/'
// 顶哥
// baseHost = 'http://10.88.27.19:8088'
// 高闯
// baseHost = 'http://10.88.27.38:8088'
// 本地环境
// 胡斌
// baseHost = 'http://10.88.27.15:8088/'
// baseHost = '//10.88.27.127:8088/'
// 杨春杰
// baseHost="http://10.88.27.160:8088/"

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
