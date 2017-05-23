let mongoose = require('libs/mongoose');
let autoIncrement = require('mongoose-auto-increment');
let Schema = mongoose.Schema;

let co = require('co');
let config = require('config');
let path = require('path');

let debug = require('debug')('app:comment:model');

let db = mongoose.connection.db;

let commentSchema = new Schema({

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
	},

	text: {
		type: String,
		required: true
	}

}, {
	autoIndex: false
});

commentSchema.plugin(autoIncrement.plugin, {
	model: 'Comment',
	startAt: 1
});

commentSchema.post('save', function(doc) {
	co(function*() {
		debug('save: %o', doc);

		return new Promise((resolve, reject) => {
			db.collection('images').update({
				_id: doc.image
			}, {
				$addToSet: {
					comments: doc._id
				}
			}, err => {
				if (err) reject(err);
				resolve();
			})
		});

	}).catch(err => {
		debug(err);
		throw err;
	});
});

commentSchema.post('remove', function(doc) {
	co(function*() {
		debug('remove: %o', doc);

		return new Promise((resolve, reject) => {
			db.collection('users').update({
				_id: doc.image
			}, {
				$pop: {
					comments: {
						_id: doc._id
					}
				}
			}, err => {
				if (err) reject(err);
				resolve();
			})
		});

	}).catch(err => {
		throw err;
	});
});



let Comment = mongoose.model('Comment', commentSchema);
Comment.ensureIndexes().then(() => {
	Comment.indexesEnsured = true;
}).catch(err => {
	throw err;
});

module.exports = Comment;