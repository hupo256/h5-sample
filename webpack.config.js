const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ip = require('ip')
const resolve = (dir) => path.join(__dirname, dir)
const project = require('./project.config.js')
const { thePublicPath, sourcemaps, env, staticImgPath, MODULE, imgUrl } = project
const isProduction = env === 'production'

const webpackConfig = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    main: './src/index',
    common: ['react', 'react-dom', 'react-router-dom', 'mobx'],
  },
  output: {
    filename: 'js/[name].[hash:8].js',
    path: resolve(MODULE || 'dist'),
    publicPath: thePublicPath,
    chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
  },
  resolve: {
    alias: {
      '@src': resolve('./src'),
      '@static': resolve('./static/sample'),
      '@images': resolve('./static'),
    },
    extensions: ['.js', '.jsx', '.scss', '.less'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader?cacheDirectory=true',
      },
      {
        test: /\.(c|sa|sc)ss$/,
        use: [
          isProduction
            ? {
                loader: MiniCssExtractPlugin.loader,
                options: { publicPath: '../' },
              }
            : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              sourceMap: sourcemaps,
              localIdentName: isProduction ? 'H[hash:base64:6]' : '[path][name]-[local]',
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /antd.*\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: sourcemaps,
            },
          },
          'postcss-loader',
          'less-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif)/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            publicPath: staticImgPath,
            // name: `[name].[ext]`
            name: `${imgUrl}[name].[ext]`,
          },
        },
      },
      {
        test: /\.(svg|eot|woff|woff2|ttf)/,
        use: {
          loader: 'file-loader',
          options: {
            limit: 8192,
            outputPath: 'fonts/',
            publicPath: isProduction ? thePublicPath + 'fonts/' : '../fonts/',
            name: '[name]-[hash].[ext]',
          },
        },
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new CleanWebpackPlugin(['' + MODULE, 'dist']),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      minify: {
        caseSensitive: false, //是否大小写敏感
        collapseBooleanAttributes: true, //是否简写boolean格式的属性如：disabled="disabled" 简写为disabled
        collapseWhitespace: true, //是否去除空格
        removeComments: true, //去掉注释
      },
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new MiniCssExtractPlugin({
      filename: 'css/main.[chunkhash:5].css',
      chunkFilename: 'css/main.[contenthash:5].css',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env), // 引入的React的产品版本
      },
      IS_ENV: JSON.stringify(env),
    }),
  ],
  devtool: sourcemaps ? 'eval-source-map' : 'source-map',
  devServer: {
    hot: true,
    host: `${ip.address()}`,
    port: 8081,
    historyApiFallback: true,
    contentBase: './static',
    inline: true,
    proxy: [
      {
        context: ['/user', '/feapi'], //使用context属性，可以把多个代理到同一个target下
        target: 'https://www.dianrong.com/', //把用 user 和 apis 开头的接口代理到 https://rsp.jd.com/域名下
        secure: true, //默认不支持运行在https上，且使用了无效证书的后端服务器，这里设置为true，可以支持
        changeOrigin: true, //如果接口跨域，需要进行这个参数配置
        pathRewrite: { '^/apis': '' }, //由于apis开头的路径，是人为添加方便区分哪些接口要代理的，所以这里去掉apis
        //设置请求头
        headers: {
          origin: 'https://www.dianrong.com', //请求接口限制来源，所以要改动请求源
          host: 'dianrong.com', //设置请求头的host
          referer: 'https://www.dianrong.com/index', //设置请求头的referer，因为后端接口会有限制
        },
      },
    ],
  },
}

const Uglify = [
  new ParallelUglifyPlugin({
    cacheDir: '.cache/',
    uglifyJS: {
      output: {
        beautify: false,
        comments: false,
      },
      compress: {
        drop_console: true,
        drop_debugger: true, //去掉debugger
        collapse_vars: true,
        reduce_vars: true,
        global_defs: {
          '@alert': 'console.log', // 去掉alert
        },
      },
      warnings: false,
    },
  }),
  new OptimizeCSSAssetsPlugin({}),
  new webpack.optimize.ModuleConcatenationPlugin(),
]

if (!sourcemaps) {
  const pluginsArr = webpackConfig.plugins
  webpackConfig.plugins = [...pluginsArr, ...Uglify]
}

module.exports = webpackConfig
