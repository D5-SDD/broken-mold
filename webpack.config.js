var path = require('path');
var webpack = require('webpack');
var validate = require('webpack-validator');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports =  validate({
  cache: true,
  entry: ['babel-polyfill', './src/app.js'],
  output: {
    path: path.join(__dirname, 'bin'),
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {
        test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
        loader: 'url'
      },
      {
        test: /\.(jpg|png)$/,
        loader: 'url?limit=25000',
        include: path.resolve(__dirname, 'src/assets/images')
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css!sass')
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'lib'),
          path.resolve(__dirname, 'node_modules/react-tree-menu/src')
        ],
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new ExtractTextPlugin('bundle.css', {
      allChunks: true
    })
  ],

  resolve: {
    extensions: ['', '.js', '.scss', '.json'],
    packageMains: [
      'webpack',
      'browser',
      'web',
      'browserify',
      ['jam', 'main'],
      'main'
    ]
  },

  target: 'electron-renderer'
});
