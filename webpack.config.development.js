const { merge } = require('webpack-merge')
const path = require('path')
const config = require('./webpack.config.js')

module.exports = merge(config, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    port: 8080,
    devMiddleware: {
      writeToDisk: true
    }
  },
  output: {
    path: path.resolve(__dirname, 'public')
  }
})
