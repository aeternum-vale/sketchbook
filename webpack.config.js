'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');
const path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HandlebarsPlugin = require('handlebars-webpack-plugin');
var config = require('./config');

module.exports = {
  context: path.resolve(__dirname, 'frontend', 'pages'),

  entry: {
    authorization: './authorization/script',
    user: './user/script',
    'logged-user': './user/logged-script',
    image: './image/script',
    'logged-image': './image/logged-script',
    'feed': './feed/script',
    'settings': './settings/script',
    home: './home/script',
    'logged-home': './home/logged-script'
  },

  output: {
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
    filename: "[name].js"
  },

  watch: NODE_ENV == 'development',

  watchOptions: {
    aggregateTimeout: 100
  },

  devtool: NODE_ENV == 'development' ? "cheap-inline-module-source-map" : null,

  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js']
  },

  resolveLoader: {
    modulesDirectories: ['node_modules'],
    moduleTemplates: ['*-loader', '*'],
    extensions: ['', '.js']
  },

  // node: {
  //   __dirname: true
  // },

  module: {
    loaders: [{
      test: /\.js$/,
      loader: "babel",
      exclude: [/node_modules/, /public/]
    }, {
      test: /\.css$/,
      loader: "style!css!autoprefixer",
      exclude: [/node_modules/, /public/]
    }, {
      test: /\.less$/,
      loader: 'style-loader!css-loader!autoprefixer-loader!less',
      //loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader!less'),
      exclude: [/node_modules/, /public/]
    }, {
      test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
      loader: 'url?limit=4096'
        //loader: 'file?name=[path][name].[ext]&limit=4096'
    }]
  },

  plugins: [
    //new ExtractTextPlugin('[name].css'),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV),
      LANG: JSON.stringify('en'),
      BASE: JSON.stringify(__dirname + '/'),
      BLOCKS: JSON.stringify(__dirname + '/frontend/blocks/'),
      LIBS: JSON.stringify(__dirname + '/libs/'),
      PUBLIC: JSON.stringify(__dirname + '/public/'),
      PRELOAD_IMAGE_COUNT: JSON.stringify(config.get('image:preloadEntityCount'))
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'common-user',
      chunks: ['user', 'logged-user']
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common-image',
      chunks: ['image', 'logged-image']
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common-home',
      chunks: ['home', 'logged-home']
    })
  ]

};


// module.exports.plugins.push(
//   new HandlebarsPlugin({
//     entry: path.join(__dirname, "frontend", "blocks", "*", "*.handlebars"),
//     partials: [
//       path.join(__dirname, "views", "partials", "*.handlebars")
//     ]
//   })
// );


if (NODE_ENV == 'production') {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        // don't show unreachable variables etc
        warnings: false,
        drop_console: true,
        unsafe: true
      }
    })
  );
}
