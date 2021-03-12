module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 37.5,
      propWhiteList: [],
      selectorBlackList: [/^html$/, 'am-'],
      minPixelValue: 2
    },
    autoprefixer: ['iOS >= 8', 'Android >= 4']
  }
}
