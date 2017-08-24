let mongoose = require('libs/mongoose');
let autoIncrement = require('mongoose-auto-increment');
let Schema = mongoose.Schema;

let co = require('co');
let fs = require('fs');
let config = require('config');
let path = require('path');

let debug = require('debug')('app:image:model');
let imagePaths = require('libs/imagePaths');

let db = mongoose.connection.db;

let imageSchema = new Schema({

	description: {
		type: String,
		max: 255
	},

	created: {
		type: Date,
		default: Date.now
	},

	author: {
		type: Number,
		ref: 'User',
		required: true
	},

	comments: [{
		type: Number,
		ref: 'Comment'
	}],

	likes: [{
		type: Number,
		ref: 'User'
	}]

}, {
	autoIndex: false
});


imageSchema.plugin(autoIncrement.plugin, {
	model: 'Image',
	startAt: 1
});

imageSchema.post('save', function(doc) {
	debug('save: %o', doc);

	co(function*() {

        mongoose.connection.on('open', ()=>{
            return new Promise((resolve, reject) => {
                db.collection('users').update({
                    _id: doc.author
                }, {
                    $addToSet: {
                        images: doc._id
                    }
                }, err => {
                    if (err) reject(err);
                    resolve();
                })
            });
        });



	}).catch(err => {
		debug(err);
		throw err;
	});
});

imageSchema.post('remove', function(doc) {
	debug('remove: %o', doc);

	co(function*() {


		for (let i = 0; i < doc.likes.length; i++) {

			yield new Promise((resolve, reject) => {
				db.collection('users').update({
					_id: doc.likes[i]
				}, {
					$pull: {
						likes: doc._id
					}
				}, err => {
					if (err) reject(err);
					resolve();
				});
			});
		}

		for (let i = 0; i < doc.comments.length; i++) {

			let comment = yield new Promise((resolve, reject) => {
				db.collection('comment').find({
					_id: doc.comments[i]
				}, (err, comment) => {
					if (err) reject(err);
					resolve(comment);
				});
			});

			yield new Promise((resolve, reject) => {
				db.collection('users').update({
					_id: comment.author
				}, {
					$pull: {
						comments: doc.comments[i]
					}
				}, err => {
					if (err) reject(err);
					resolve();
				});
			});

		}


		yield new Promise((resolve, reject) => {
			db.collection('comments').remove({
				_id: {
					$in: doc.comments
				}
			}, err => {
				if (err) reject(err);
				resolve();
			});
		});



		yield new Promise((resolve, reject) => {
			db.collection('users').update({
				_id: doc.author
			}, {
				$pull: {
					images: doc._id
				}
			}, err => {
				if (err) reject(err);
				resolve();
			});
		});


		let imageFileName = imagePaths.getImageFileNameById(doc._id.toString());
		let imagePreviewFileName = imagePaths.getImagePreviewFileNameById(doc._id.toString());
		let imagePath = path.join(config.get('userdata:dir'), imageFileName);
		let imagePreviewPath = path.join(config.get('userdata:dir'), imagePreviewFileName);

		let hasImage = new Promise((resolve, reject) => {
			fs.stat(imagePath, (err) => {
				if (err) reject(err);
				resolve(true);
			});
		});

		if (hasImage)
			yield new Promise((resolve, reject) => {
				fs.unlink(imagePath, (err) => {
					if (err) reject(err);
					resolve();
				});
			});

		let hasPreview = new Promise((resolve, reject) => {
			fs.stat(imagePreviewPath, (err) => {
				if (err) reject(err);
				resolve(true);
			});
		});

		if (hasPreview)
			yield new Promise((resolve, reject) => {
				fs.unlink(imagePreviewPath, (err) => {
					if (err) reject(err);
					resolve();
				});
			});

	}).then(() => {
		debug('succesful removing');
	}).catch(err => {
		debug(err);
		throw err;
	});
});



let Image = mongoose.model('Image', imageSchema);
Image.ensure = Image.ensureIndexes;

module.exports = Image;
