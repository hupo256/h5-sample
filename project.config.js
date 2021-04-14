/* eslint-disable max-len */
let NODE_ENV = process.env.NODE_ENV
let MODULE = process.env.MODULE
let imgUrl = ''
let thePublicPath = NODE_ENV === 'local' ? '/' : '/'
let staticImgPath = NODE_ENV === 'local' ? '/' : `https://andall-dev.oss-cn-hangzhou.aliyuncs.com/static/${NODE_ENV}/sample/`
if (NODE_ENV === 'prod' || NODE_ENV === 'pre') staticImgPath = 'https://qd-img.andall.com/static/sample/'
if (NODE_ENV === 'bundle') {
  NODE_ENV = 'prod'
  thePublicPath = `/mkt/${MODULE}/`
  staticImgPath = ''
  imgUrl = 'images/'
}
module.exports = {
  env: NODE_ENV,
  thePublicPath,
  staticImgPath,
  imgUrl,
  MODULE,
  sourcemaps: NODE_ENV === 'local' || NODE_ENV.includes('dev'),
  vendors: ['react', 'react-dom', 'react-router-dom'],
}
