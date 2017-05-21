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
let imagePaths = require('libs/imagePaths');
let isAuth = require('middleware/isAuth');
let addLoggedUser = require('middleware/addLoggedUser');
let InvalidImage = require('error').InvalidImage;
let moment = require('moment');

let form = new formidable.IncomingForm();
let uploadDir = path.resolve(config.get('userdata:dir'));
form.uploadDir = uploadDir;

function imageRequestListener(req, res, next) {
	//req.params.id

	co(function*() {

		if (!Image.indexesEnsured)
			yield Image.ensureIndexes();

		let image = yield Image.findById(req.params.id).exec();
		let author = yield User.findById(image.author).exec();


		return {
			image,
			author
		};

	}).then(result => {

		let created = moment(result.image.created);
		let daysPassed = moment().diff(created, 'days', true);

		let createDateStr;
		if (daysPassed >= config.get('image:relativeTimeLimitDays'))
			createDateStr = created.format("MMM Do YY");
		else
			createDateStr = created.fromNow();

		res.locals.image = result.image;
		res.locals.author = result.author;
		res.locals.image.createDateStr = createDateStr;
		res.locals.page = 'image';
		res.render('image');
	}).catch(err => {
		next(err);
	});



}

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

		let formPath = formData.files.image.path;
		let tempImagePath = `${formPath}.${config.get('userdata:image:ext')}`;
		let tempImagePreviewPath = `${formPath}${
			config.get('userdata:preview:postfix')
			}.${config.get('userdata:preview:ext')}`;

		yield imageManipulation.copy(formPath, tempImagePath,
			config.get('userdata:image:minWidth'), config.get('userdata:image:minHeight'));

		yield new Promise((resolve, reject) => {
			fs.unlink(formPath, function(err) {
				if (err) reject(err);
				resolve();
			});
		});

		yield imageManipulation.resize(tempImagePath,
			tempImagePreviewPath, config.get('userdata:preview:size'));

		let newImage = yield new Image({
			author: req.session.userId,
			description: formData.fields.description
		}).save();

		let imageFileName = imagePaths
			.getImageFileNameByStringId(newImage._id.toString());
		let imagePreviewFileName = imagePaths
			.getImagePreviewFileNameByStringId(newImage._id.toString());
		let imagePath = path.join(uploadDir, imageFileName);
		let imagePreviewPath = path.join(uploadDir, imagePreviewFileName);

		yield new Promise((resolve, reject) => {
			fs.rename(tempImagePath, imagePath, function(err) {
				if (err) reject(err);
				resolve();
			});
		});

		yield new Promise((resolve, reject) => {
			fs.rename(tempImagePreviewPath, imagePreviewPath, function(err) {
				if (err) reject(err);
				resolve();
			});
		});

		return imagePreviewFileName;

	}).then(imageFile => {
		debug('added new image');
		res.json({
			success: true,
			path: imageFile
		});
	}).catch(err => {
		if (err instanceof InvalidImage) {
			debug('Invalid image');
			res.json({
				success: false,
				message: err.message
			});
		} else
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
	app.get('/image/:id', addLoggedUser, imageRequestListener);
};