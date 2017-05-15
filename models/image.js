let mongoose = require('libs/mongoose');
let Schema = mongoose.Schema;

let User = require('models/user');
let co = require('co');
let fs = require('fs');
let config = require('config');
let path = require('path');

let debug = require('debug')('app:models-image');



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
		type: Schema.Types.ObjectId,
		ref: 'User'
	},

	comments: [{
		type: Schema.Types.ObjectId,
		ref: 'Comment'
	}],

	likes: [{
		type: Schema.Types.ObjectId,
		ref: 'Like'
	}]

}, {
	autoIndex: false
});

imageSchema.post('save', function(doc) {
	debug('trying to change user\'s images');

	co(function*() {

		let user = yield User.findById(doc.author).exec();
		user.images.push(doc);
		yield user.save();



	}).catch(err => {
		throw err;
	});
});

imageSchema.post('remove', function(doc) {
	debug('trying to remove user\'s images');

	co(function*() {

		yield User.findOneAndUpdate({
			_id: doc.author
		}, {
			$pop: {
				images: {
					_id: doc._id
				}
			}
		}).exec();


		let imgPath = path.join(path.resolve(config.get('userdata:dir')),
			`${config.get('userdata:image:prefix')}${
				doc._id.toString()
			}${config.get('userdata:image:postfix')}`);

		let hasImage = new Promise((resolve, reject) => {
			fs.stat(imgPath, (err) => {
				if (err) reject(err);
				resolve(true);
			});
		});

		if (hasImage)
			yield new Promise((resolve, reject) => {
				fs.unlink(imgPath, (err) => {
					if (err) reject(err);
					resolve();
				});
			});

		let previewPath = imgPath + config.get('userdata:imagePreview:postfix');

		let hasPreview = new Promise((resolve, reject) => {
			fs.stat(previewPath, (err) => {
				if (err) reject(err);
				resolve(true);
			});
		});

		if (hasPreview)
			yield new Promise((resolve, reject) => {
				fs.unlink(previewPath, (err) => {
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
Image.ensureIndexes().then(() => {
	Image.indexesEnsured = true;
}).catch(err => {
	throw err;
});

module.exports = Image;