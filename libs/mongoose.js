
var mongoose = require('mongoose');
var config = require('config');
mongoose.connect(config.get('mongo:uri'), config.get('mongo:options'));

var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

// if (config.get('env') === 'development')
// 	mongoose.set('debug', true);

mongoose.Promise = global.Promise;
module.exports = mongoose;