let mongoose = require('libs/mongoose');
let autoIncrement = require('mongoose-auto-increment');
let Schema = mongoose.Schema;

let co = require('co');
let config = require('config');
let path = require('path');

let debug = require('debug')('app:comment:model');


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

    let db = mongoose.connection.db;

    co(function*() {
		debug('save: %o', doc);

		yield new Promise((resolve, reject) => {
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

		yield new Promise((resolve, reject) => {
			db.collection('users').update({
				_id: doc.author
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
    let db = mongoose.connection.db;


    co(function*() {
		debug('remove: %o', doc);

		yield new Promise((resolve, reject) => {
			db.collection('images').update({
				_id: doc.image
			}, {
				$pull: {
					comments: doc._id
				}
			}, err => {
				if (err) reject(err);
				resolve();
			})
		});

		yield new Promise((resolve, reject) => {
			db.collection('users').update({
				_id: doc.author
			}, {
				$pull: {
					comments: doc._id
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
Comment.ensure = Comment.ensureIndexes;

module.exports = Comment;
