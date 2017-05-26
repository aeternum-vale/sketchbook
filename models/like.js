let mongoose = require('libs/mongoose');
let autoIncrement = require('mongoose-auto-increment');
let Schema = mongoose.Schema;

let co = require('co');
let config = require('config');
let path = require('path');

let debug = require('debug')('app:like:model');

let db = mongoose.connection.db;

let likeSchema = new Schema({

	author: {
		type: Number,
		ref: 'User',
		requred: true
	},

	image: {
		type: Number,
		ref: 'Image',
		required: true
	},

	created: {
		type: Date,
		default: Date.now
	}

}, {
	autoIndex: false
});

likeSchema.plugin(autoIncrement.plugin, {
	model: 'Like',
	startAt: 1
});

likeSchema.post('save', function(doc) {
	// co(function*() {
	// 	debug('save: %o', doc);

	// 	return new Promise((resolve, reject) => {
	// 		db.collection('images').update({
	// 			_id: doc.image
	// 		}, {
	// 			$addToSet: {
	// 				comments: doc._id
	// 			}
	// 		}, err => {
	// 			if (err) reject(err);
	// 			resolve();
	// 		})
	// 	});

	// }).catch(err => {
	// 	debug(err);
	// 	throw err;
	// });
});

likeSchema.post('remove', function(doc) {
	// co(function*() {
	// 	debug('remove: %o', doc);

	// 	yield new Promise((resolve, reject) => {
	// 		db.collection('images').update({
	// 			_id: doc.image
	// 		}, {
	// 			$pull: {
	// 				comments: doc._id
	// 			}
	// 		}, err => {
	// 			if (err) reject(err);
	// 			resolve();
	// 		})
	// 	});

	// }).catch(err => {
	// 	throw err;
	// });
});



let Like = mongoose.model('Like', likeSchema);
Like.ensureIndexes().then(() => {
	Like.indexesEnsured = true;
}).catch(err => {
	throw err;
});

module.exports = Like;