const webpack = require('webpack')
const path = require('path')
const ip = require('ip')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const { ModuleFederationPlugin } = webpack.container
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const project = require('./project.config.js')
const { thePublicPath, sourcemaps, env, staticImgPath, MODULE, imgUrl } = project
const isProduction = env === 'prod'
const resolve = (dir) => path.join(__dirname, dir)

module.exports = {
  devtool: false,
  entry: './src/index',
  mode: 'development',
  devServer: {
    hot: true,
    // host: `${ip.address()}`,
    port: 8081,
    historyApiFallback: true,
    contentBase: './static',
    // inline: true,
  },
  output: {
    // filename: 'js/[name].[hash:8].js',
    // path: resolve(MODULE || 'dist'),
    // publicPath: thePublicPath,
    publicPath: 'http://localhost:8081/',
    // chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-react'],
        },
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
              sourceMap: isProduction,
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
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/main.[chunkhash:5].css',
      chunkFilename: 'css/main.[contenthash:5].css',
    }),
    new webpack.DefinePlugin({
      IS_ENV: JSON.stringify(env),
    }),
    new ModuleFederationPlugin({
      name: 'sample',
      filename: 'remoteEntry.js',
      exposes: {
        './showTex': './src/routes/egg/showTex',
      },
      remotes: {
        fdTest: 'fdTest@http://localhost:3004/remoteEntry.js',
        app1: 'app1@http://localhost:3001/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'react-router-dom'],
    }),
  ],
  resolve: {
    alias: {
      '@src': resolve('./src'),
      '@static': resolve('./static/sample'),
      '@images': resolve('./static'),
    },
    extensions: ['.js', '.jsx', '.scss', '.less'],
  },
}
