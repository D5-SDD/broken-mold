var path = require('path');
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
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css!sass')
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin('style.css', {
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
