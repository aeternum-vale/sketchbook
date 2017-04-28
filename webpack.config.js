'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');
const path = require('path');
var ExtractTextPlugin = require ('extract-text-webpack-plugin');


module.exports = {
  context: path.resolve(__dirname, 'frontend', 'pages'),

  entry:  {
    authorization: './authorization/script'
  },

  output: {
    path: path.resolve(__dirname, 'public'),
    filename: "[name].js"
  },

  watch: NODE_ENV == 'development',

  watchOptions: {
    aggregateTimeout: 100
  },

  devtool: NODE_ENV == 'development' ? "cheap-inline-module-source-map" : null,

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
        test: /\.css$/,
        loader: "style!css!autoprefixer",
        exclude: [/node_modules/, /public/]
    },

    {
        test:   /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader','css-loader') + "!autoprefixer-loader!less",
        //loader: "style!css!autoprefixer!less",
        exclude: [/node_modules/, /public/]
    }]

  },

   plugins: [
     new ExtractTextPlugin('[name].css')
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