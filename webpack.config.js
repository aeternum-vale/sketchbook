'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');
var ExtractTextPlugin = require ('extract-text-webpack-plugin');


module.exports = {
  entry:  "./frontend/js/script.js",
  output: {
    path: __dirname + '/public',
    filename: "bundle.js"
  },

  watch: true,//NODE_ENV == 'development',

  // watchOptions: {
  //   aggregateTimeout: 100
  // },

  //devtool: NODE_ENV == 'development' ? "cheap-inline-module-source-map" : null,

  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV),
      LANG:     JSON.stringify('en')
    })
  ],

  resolve: {
    modulesDirectories: ['node_modules'],
    extensions:         ['', '.js']
  },

  resolveLoader: {
    modulesDirectories: ['node_modules'],
    moduleTemplates:    ['*-loader', '*'],
    extensions:         ['', '.js']
  },


  module: {

    loaders: [

    {
        test: /\.js$/,
        loader: "babel",
        exclude: [/node_modules/, /public/] 
    },

    {
      test:   /\.less$/,
      loader: ExtractTextPlugin.extract('style-loader','css-loader') + "!autoprefixer-loader!less",
      exclude: [/node_modules/, /public/]
    }]

  },

  plugins: [
    new ExtractTextPlugin('bundle.css')
  ]

};


if (NODE_ENV == 'production') {
  module.exports.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          // don't show unreachable variables etc
          warnings:     false,
          drop_console: true,
          unsafe:       true
        }
      })
  );
}