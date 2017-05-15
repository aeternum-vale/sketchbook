let Image = require('models/image');
let User = require('models/User');
let co = require('co');
let config = require('config');
let debug = require('debug')('app:image');
let HttpError = require('error').HttpError;
let fs = require('fs');
let http = require('http');
let formidable = require('formidable');
let path = require('path');
let imageManipulation = require('libs/imageManipulation');

let form = new formidable.IncomingForm();

let uploadDir = path.resolve(config.get('userdata:dir')); //path.join(__dirname, 'userdata');

form.uploadDir = uploadDir;

function uploadImageListRequestListener(req, res, next) {
	debug('The file is ready to be uploaded');

	let userId;
	if (req.session.userId)
		userId = req.session.userId;
	else
		next(401);

	if (!req.xhr) 
		next(500);

	co(function*() {

		if (!Image.indexesEnsured)
			yield Image.ensureIndexes();


		let files = yield new Promise((resolve, reject) => {
			form.parse(req, function(err, fields, files) {
				if (err) reject(303);
				resolve(files);
				debug(files);
			});
		});

		let newImage = yield new Image({
			author: userId
		}).save();

		

		// let user = yield User.findById(userId).exec();
		// user.images.push(newImage);
		// yield user.save();

		let imagePath = path.join(uploadDir,
			`${config.get('userdata:image:prefix')}${
				newImage._id.toString()
			}${config.get('userdata:image:postfix')}`);

		yield new Promise((resolve, reject) => {
			fs.rename(files.image.path, imagePath, function(err) {
				if (err) reject(err);
				resolve();
			});
		});

		yield imageManipulation.resize(imagePath, config.get('userdata:imagePreview:postfix'), 300);

	}).then((result) => {
		res.json({
			success: true
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
	app.post('/upload', uploadImageListRequestListener);
	app.get('/images', imageListRequestListener);
};