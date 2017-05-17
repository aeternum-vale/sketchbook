let Image = require('models/image');
let User = require('models/User');
let co = require('co');
let config = require('config');
let debug = require('debug')('app:image:controller');
let HttpError = require('error').HttpError;
let fs = require('fs');
let http = require('http');
let formidable = require('formidable');
let path = require('path');
let imageManipulation = require('libs/imageManipulation');
let isAuth = require('middleware/isAuth');

let form = new formidable.IncomingForm();
let uploadDir = path.resolve(config.get('userdata:dir'));
form.uploadDir = uploadDir;

function uploadImageListRequestListener(req, res, next) {
	debug('The file is ready to be uploaded');

	if (!req.xhr) next();

	co(function*() {

		if (!Image.indexesEnsured)
			yield Image.ensureIndexes();


		let formData = yield new Promise((resolve, reject) => {
			form.parse(req, function(err, fields, files) {
				if (err) reject(303);

				resolve({
					files,
					fields
				});

			});
		});

		debug(formData);

		let newImage = yield new Image({
			author: req.session.userId,
			description: formData.fields.description
		}).save();

		let imageFile = `${config.get('userdata:image:prefix')}${
			newImage._id.toString()
			}${config.get('userdata:image:postfix')}`;
		let imagePath = path.join(uploadDir, imageFile);

		yield new Promise((resolve, reject) => {
			fs.rename(formData.files.image.path, imagePath, function(err) {
				if (err) reject(err);
				resolve();
			});
		});

		yield imageManipulation.resize(imagePath, config.get('userdata:imagePreview:postfix'), 300);
		return imageFile + config.get('userdata:imagePreview:postfix');

	}).then((imageFile) => {
		debug('added new image');
		res.json({
			success: true,
			path: imageFile
		});
	}).catch(err => {
		next(err);
	});

}


function imageListRequestListener(req, res, next) {
	co(function*() {



		if (!Image.indexesEnsured)
			yield Image.ensureIndexes();

		// let delImg = yield Image.findById("5919924d1dfac21d689d964d").exec();
		// if (delImg)
		// 	yield delImg.remove();

		return new Promise((resolve, reject) => {
			Image.find({}, function(err, images) {
				if (err) reject(err);
				resolve(images);
			});
		});
	}).then(result => {
		res.json(result);
	}).catch(err => {
		next(err);
	});
}

exports.registerRoutes = function(app) {
	app.post('/upload', isAuth, uploadImageListRequestListener);
	app.get('/images', imageListRequestListener);
};