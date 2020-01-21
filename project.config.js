/* eslint-disable max-len */
const NODE_ENV = process.env.NODE_ENV
const thePublicPath = NODE_ENV === 'local' ? '/' : '/andall-sample/'
let staticImgPath = NODE_ENV === 'local' ? '/' : `https://dnatime-dev.oss-cn-hangzhou.aliyuncs.com/static/${NODE_ENV}/sample/`
if (NODE_ENV === 'production' || NODE_ENV === 'pre') staticImgPath = 'https://qd-img.dnatime.com/static/sample/'
module.exports = {
  env: NODE_ENV,
  thePublicPath,
  staticImgPath,
  sourcemaps: NODE_ENV === 'local',
  vendors: [
    'react',
    'react-dom',
    'react-router-dom'
  ]
}
