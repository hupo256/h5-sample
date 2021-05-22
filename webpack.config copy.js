const path = require('path')
const webpack = require('webpack')
const { ModuleFederationPlugin } = require('webpack').container
const HtmlWebPackPlugin = require('html-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ip = require('ip')
const resolve = (dir) => path.join(__dirname, dir)
const project = require('./project.config.js')
const { thePublicPath, sourcemaps, env, staticImgPath, MODULE, imgUrl } = project
const isProduction = env === 'prod'

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
        loader: 'babel-loader',
      },
      // {
      //   test: /\.(ts|tsx)$/,
      //   exclude: /node_modules/,
      //   loader: ['babel-loader?cacheDirectory', 'ts-loader'],
      // },
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
      // name: 'att',
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
      IS_ENV: JSON.stringify(env),
    }),
    new ModuleFederationPlugin({
      name: 'h5sample',
      filename: 'remoteEntry.js',
      // exposes: {
      //   './showTex': './src/routes/egg/showTex',
      // },
      remotes: {
        fdTest: 'fdTest@http://localhost:3004/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'react-router-dom'],
    }),
  ],
  devtool: sourcemaps ? 'eval-source-map' : 'source-map',
  devServer: {
    hot: true,
    // host: `${ip.address()}`,
    port: 8081,
    historyApiFallback: true,
    contentBase: './static',
    inline: true,
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
