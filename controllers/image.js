let Image = require('models/image');
let User = require('models/user');

let imagePreviewViewModel = require('viewModels/imagePreview');
let userViewModel = require('viewModels/user');

let co = require('co');
let config = require('config');
let debug = require('debug')('app:image:controller');
let HttpError = require('error').HttpError;
let fs = require('fs');
let http = require('http');
let path = require('path');
let imageManipulation = require('libs/imageManipulation');
let imagePaths = require('libs/imagePaths');
let getDateString = require('libs/getDateString');
let isAuth = require('middleware/isAuth');
let addLoggedUser = require('middleware/addLoggedUser');
let addRefererParams = require('middleware/addRefererParams');
let InvalidImage = require('error').InvalidImage;

let formidable = require('formidable');
let form = new formidable.IncomingForm();

let uploadDir = path.resolve(config.get('userdata:dir'));
form.uploadDir = uploadDir;

function imageRequestListener(req, res, next) {
	co(function*() {

		if (!Image.indexesEnsured)
			yield Image.ensureIndexes();

		let image = yield Image.findById(req.params.id).populate('comments').exec();

		if (!image)
			throw new HttpError(404, "Image not found");

		for (let i = 0; i < image.comments.length; i++) {
			image.comments[i].commentator = userViewModel(yield User.findById(image.comments[i].author).exec());

			image.comments[i].createDateStr = getDateString(image.comments[i].created);

			if (image.comments[i].author === req.session.userId)
				image.comments[i].ownComment = true;
		}

		let author = yield User.findById(image.author).exec();

		return {
			image,
			author
		};

	}).then(result => {

		if (res.locals.loggedUser) {
			if (res.locals.loggedUser._id === result.author._id)
				res.locals.ownImage = true;

			debug(res.locals.ownImage);


			if (~result.image.likes.indexOf(res.loggedUser._id))
				res.locals.isLiked = true;
		}

		res.locals.author = userViewModel(result.author);
		res.locals.image = result.image;
		res.locals.image.createDateStr = getDateString(result.image.created);
		res.locals.page = 'image';

		res.render('image');
	}).catch(err => {
		next(err);
	});
}

function uploadImageListRequestListener(req, res, next) {
	debug('The file is ready to be uploaded');

	if (!req.xhr) return next(404);

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
			tempImagePreviewPath, config.get('userdata:preview:size'), config.get('userdata:preview:quality'));

		let newImage = yield new Image({
			author: req.session.userId,
			description: formData.fields.description
		}).save();

		let imageFileName = imagePaths
			.getImageFileNameById(newImage._id);
		let imagePreviewFileName = imagePaths
			.getImagePreviewFileNameById(newImage._id);
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

		return {
			imagePreviewFileName,
			id: newImage._id
		};

	}).then(result => {
		debug('added new image');
		res.json({
			success: true,
			previewUrl: result.imagePreviewFileName,
			imageId: result.id
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

function imageDeleteListRequestListener(req, res, next) {

	let imageId = req.refererParams.value;

	debug('deleting image #' + imageId);

	if (!req.xhr) return next(404);

	co(function*() {
		let image = yield Image.findById(imageId).exec();
		yield image.remove();

	}).then(() => {
		debug('successful deleting');
		res.json({
			success: true,
			url: `/user/${res.loggedUser.username}`
		});
	}).catch(err => {
		next(err);
	});
}

function likeRequestListener(req, res, next) {
	if (!req.xhr) return next(404);

	if (req.refererParams.field !== 'image') return next(404);

	let imageId = req.refererParams.value;

	co(function*() {

		let image = yield Image.findById(imageId).exec();
		let userId = res.loggedUser._id;

		let index;
		if (~(index = image.likes.indexOf(userId)))
			image.likes.splice(index);
		else
			image.likes.push(userId);

		yield image.save();

		yield res.loggedUser.update({
			$addToSet: {
				likes: imageId
			}
		}).exec();

		return {
			isLiked: !~index,
			likeAmount: image.likes.length
		};

	}).then(result => {

		res.json({
			success: true,
			isLiked: result.isLiked,
			likeAmount: result.likeAmount
		});

	}).catch(err => {
		next(err);
	});
}


function feedRequestListener(req, res, next) {

	co(function*() {
		let feed = [];

		let subs = res.loggedUser.subscriptions;

		for (let i = 0; i < subs.length; i++) {
			let imageIds = (yield User.findById(subs[i], {
				images: true
			}).exec()).images;

			for (let j = 0; j < imageIds.length; j++) {
				let image = yield Image.findById(imageIds[j]).exec();
				if (image)
					feed.push(image);
			}
		}

		feed.sort((a, b) => {
			if (a.created > b.created)
				return 1;
			else if (a.created < b.created)
				return -1;
			return 0;
		});

		return feed;

	}).then(rawFeed => {

		res.locals.page = 'feed';

		let feed = [];
		rawFeed.forEach(item => {
			feed.push(imagePreviewViewModel(item));
		});

		res.locals.feed = feed;
		res.render('feed');

	}).catch(err => {
		next(err);
	});
}


exports.registerRoutes = function(app) {
	app.post('/image', isAuth, uploadImageListRequestListener);
	app.delete('/image', isAuth, addLoggedUser, addRefererParams, imageDeleteListRequestListener);
	app.get('/images', imageListRequestListener);
	app.get('/image/:id', addLoggedUser, imageRequestListener);
	app.post('/like', isAuth, addLoggedUser, addRefererParams, likeRequestListener);
	app.get('/feed', isAuth, addLoggedUser, feedRequestListener);
};