'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');
const path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HandlebarsPlugin = require("handlebars-webpack-plugin");

module.exports = {
  context: path.resolve(__dirname, 'frontend', 'pages'),

  entry: {
    authorization: './authorization/script',
    'logged-authorization': './authorization/logged-script',
    user: './user/script',
    'logged-user': './user/logged-script',
    image: './image/script',
    'logged-image': './image/logged-script',
    'feed': './feed/logged-script',
    'settings': './settings/logged-script',
    home: './home/script',
    'logged-home': './home/logged-script'
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

  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js']
  },

  resolveLoader: {
    modulesDirectories: ['node_modules'],
    moduleTemplates: ['*-loader', '*'],
    extensions: ['', '.js']
  },

  externals: [{
    'handlebars/runtime': {
      root: 'Handlebars',
      amd: 'handlebars/runtime',
      commonjs2: 'handlebars/runtime',
      commonjs: 'handlebars/runtime'
    }
  }],

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
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader!less'),
      exclude: [/node_modules/, /public/]
    }, {
      test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
      loader: 'url?limit=4096'
        //loader: 'file?name=[path][name].[ext]&limit=4096'
    }, {
      test: /\.handlebars$/,
      loader: "handlebars?runtime=handlebars/runtime"
    }]
  },

  plugins: [
    new ExtractTextPlugin('[name].css'),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV),
      LANG: JSON.stringify('en'),
      BASE: JSON.stringify(__dirname + '/'),
      BLOCKS: JSON.stringify(__dirname + '/frontend/blocks/'),
      LIBS: JSON.stringify(__dirname + '/libs/')
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'common-user',
      chunks: ['user', 'logged-user']
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common-authorization',
      chunks: ['authorization', 'logged-authorization']
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common-image',
      chunks: ['image', 'logged-image']
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common-home',
      chunks: ['home', 'logged-home']
    }),

    new HandlebarsPlugin({
      // path to hbs entry file(s)
      entry: path.join(__dirname, "app", "src", "*.handlebars"),
      // output path and filename(s)
      // if ommited, the input filepath stripped of its extension will be used
      output: path.join(__dirname, "build", "[name].html"),
      // data passed to main hbs template: `main-template(data)`
      data: require("./app/data/project.json"),

      // globbed path to partials, where folder/filename is unique
      partials: [
        path.join(__dirname, "app", "src", "components", "*", "*.handlebars")
      ],

      // register custom helpers. May be either a function or a glob-pattern
      helpers: {
        nameOfHbsHelper: Function.prototype,
        projectHelpers: path.join(__dirname, "app", "helpers", "*.helper.js")
      },

      // hooks
      onBeforeSetup: function(Handlebars) {},
      onBeforeAddPartials: function(Handlebars, partialsMap) {},
      onBeforeCompile: function(Handlebars, templateContent) {},
      onBeforeRender: function(Handlebars, data) {},
      onBeforeSave: function(Handlebars, resultHtml, filename) {},
      onDone: function(Handlebars, filename) {}
    })
  ]

};

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