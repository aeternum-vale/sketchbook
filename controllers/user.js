let User = require('models/user');
let userViewModel = require('viewModels/user');

let co = require('co');
let checkUserData = require('libs/checkUserData');
let PropertyError = require('error').PropertyError;
let duplicatingUniquePropertyError = require('error').duplicatingUniquePropertyError;
let HttpError = require('error').HttpError;

function usersListRequestListener(req, res, next) {

	co(function*() {

		if (!User.indexesEnsured)
			yield User.ensureIndexes();

		return new Promise((resolve, reject) => {
			User.find({}, function(err, users) {
				if (err) reject(err);
				resolve(users);
			});
		});
	}).then(result => {
		res.json(result);
	}).catch(err => {
		return next(err);
	});

}

function userProfileRequestListener(req, res, next) {
	co(function*() {

		if (!User.indexesEnsured)
			yield User.ensureIndexes();

		return new Promise((resolve, reject) => {
			User.findOne({
				username: req.params.username
			}, function(err, user) {
				if (err) reject(err);
				resolve(user);
			});
		});

	}).then(result => {
		res.locals = userViewModel(result);


		res.render('user', {
			page: 'user'
		});
	}).catch(err => {
		next(new HttpError(404, 'this user doesn\'t exist'));
	});
}

function joinRequestListener(req, res, next) {
	console.log(req.body);

	if (req.xhr || req.accepts('json,html') === 'json') {
		co(function*() {
			//console.log(mongoose.connection.readyState);
			let userData = {
				username: req.body.username,
				password: req.body.password,
				email: req.body.email
			};

			let result = checkUserData(userData);

			console.log(result);

			if (result.success) {
				if (!User.indexesEnsured)
					yield User.ensureIndexes();

				let oldUser = yield User.findOne({
					username: userData.username
				}).exec();
				if (oldUser) throw new duplicatingUniquePropertyError('username', 'this username is already taken');

				oldUser = yield User.findOne({
					email: userData.email
				}).exec();
				if (oldUser) throw new duplicatingUniquePropertyError('email', 'this e-mail is already registered');

				let newUser = new User(userData).save();

				return newUser;
			} else {
				throw new PropertyError(result.errors[0].property, result.errors[0].message);
			}

		}).then(() => {
			res.json({
				success: true,
				url: '/'
			});
		}).catch(err => {
			console.log(err);

			if (err instanceof PropertyError)
				res.json({
					success: false,
					property: err.property,
					message: err.message
				});
			else
				res.json({
					success: false
				});
		});
	} else
		res.redirect(303, '/');
}

exports.registerRoutes = function(app) {
	app.post('/join', joinRequestListener);
	app.get('/users', usersListRequestListener);
	app.get('/user/:username', userProfileRequestListener);
};