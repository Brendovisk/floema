const path = require('path')
const webpack = require('webpack')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev'
const dirApp = path.join(__dirname, 'app')
const dirShared = path.join(__dirname, 'shared')
const dirStyles = path.join(__dirname, 'styles')
const dirNode = 'node_modules'

module.exports = {
  entry: [path.join(dirApp, 'index.js'), path.join(dirStyles, 'index.scss')],

  resolve: {
    modules: [dirApp, dirShared, dirStyles, dirNode]
  },

  plugins: [
    // set the environment variable that will be available in all the modules
    new webpack.DefinePlugin({
      IS_DEVELOPMENT
    }),

    // clean the public folder before building
    new CleanWebpackPlugin(),

    // copy static files placed inside the shared folder to public folder
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './shared',
          to: ''
        }
      ]
    }),

    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: '[contenthash].css',
      chunkFilename: '[contenthash].css'
    })
  ],

  module: {
    rules: [
      // load and compile js with babel
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        }
      },

      // load and compile scss with multiple loaders
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: ''
            }
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      },

      // load images and fonts
      {
        test: /\.(png|jpe?g|gif|svg|ttf|woff|woff2|webp)$/,
        loader: 'file-loader',
        options: {
          name: '[contenthash].[ext]' // compile into hashname.fileextension
        }
      },

      // set the shaders
      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'raw-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'glslify-loader',
        exclude: /node_modules/
      }
    ]
  },

  // optimize images and files
  optimization: {
    minimize: true,
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }]
            ]
          }
        }
      }),
      new TerserPlugin()
    ]
  }
}
