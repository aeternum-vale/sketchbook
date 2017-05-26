let Like = require('models/like');
let Image = require('models/image');
let co = require('co');
let config = require('config');
let debug = require('debug')('app:like:controller');
let HttpError = require('error').HttpError;

let isAuth = require('middleware/isAuth');
let addLoggedUser = require('middleware/addLoggedUser');

let url = require('url');

function recieveLikeRequestListener(req, res, next) {
	if (!req.xhr) next();

	let imageId;
	if (req.headers.referer)
		imageId = require('libs/getImageIdByReferer')(req.headers.referer);
	else
		next(500);

	debug('liking image #' + imageId);


	co(function*() {
		if (!Like.indexesEnsured)
			yield Like.ensureIndexes();

		let image = yield Image


		return new Like({
			author: req.session.userId,
			image: imageId
		}).save();

	}).then(like => {
		debug('created like #' + like._id);

	}).catch(err => {
		next(err);
	});

}


exports.registerRoutes = function(app) {
	app.post('/like', isAuth, recieveLikeRequestListener);
};