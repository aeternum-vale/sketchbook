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

let uploadDir = path.resolve('./userdata'); //path.join(__dirname, 'userdata');

form.uploadDir = uploadDir;

function uploadImageListRequestListener(req, res, next) {
	debug('The file is ready to be uploaded');

	let userId;
	if (req.session.userId)
		userId = req.session.userId;
	else {
		res.json({
			success: false
		});
		return;
	}

	co(function*() {

		if (!Image.indexesEnsured)
			yield Image.ensureIndexes();

		let newImage = yield new Image({
			author: userId
		}).save();

		let files = yield new Promise((resolve, reject) => {
			form.parse(req, function(err, fields, files) {
				if (err) reject(new HttpError(303));
				resolve(files);
				debug(files);
			});
		});

		let user = yield User.findById(userId).exec();

		user.images.push(newImage);
		yield user.save();

		let imagePath = path.join(uploadDir, newImage._id.toString());
		yield new Promise((resolve, reject) => {
			fs.rename(files.image.path, imagePath, function(err) {
				if (err) reject(err);
				resolve();
			});
		});

		yield imageManipulation.resize(imagePath, '_preview', 300, 300);

	}).then((result) => {
		debug('ok');
		res.json({
			success: true
		});
	}).catch(err => {
		debug(err);
		res.json({
			success: false
		});
	});

	/*	req.setEncoding('binary');

		let length = 0;
		let data = '';

		req.on('data', function(chunk) {


			debug(typeof chunk);

			length += chunk.length;
			data += chunk.toString('binary');
			//ws.write(data);
			if (length > 50 * 1024 * 1024) {
				next(new HttpError(413, 'Too big image size'));
			}

		}).on('end', function() {

			fs.writeFile('D:/image.jpg', data, {
				encoding: 'binary'
			}, (err) => {
				if (err) throw err;
				debug('The file has been saved!');

				res.send({
					success: true
				});
			});

		});*/
}


function imageListRequestListener(req, res, next) {
	co(function*() {

		if (!Image.indexesEnsured)
			yield Image.ensureIndexes();

		return new Promise((resolve, reject) => {
			Image.find({}, function(err, images) {
				if (err) reject(err);
				resolve(images);
			});
		});
	}).then(result => {
		res.json(result);
	}).catch(err => {
		return next(err);
	});
}

exports.registerRoutes = function(app) {
	app.post('/upload', uploadImageListRequestListener);
	app.get('/images', imageListRequestListener);
};