let User = require('models/user');
let userViewModel = require('viewModels/user');
let co = require('co');
let checkUserData = require('libs/checkUserData');
let PropertyError = require('error').PropertyError;
let duplicatingUniquePropertyError = require('error').duplicatingUniquePropertyError;
let LoginError = require('error').LoginError;
let HttpError = require('error').HttpError;
let config = require('config');
let debug = require('debug')('app:user');

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
		next(err);
	});
}

function userProfileRequestListener(req, res, next) {
	co(function*() {

		if (!User.indexesEnsured)
			yield User.ensureIndexes();

		let loggedUser;
		if (req.session.userId)
			loggedUser = yield User.findById(req.session.userId).exec();

		let pageUser = yield User.findOne({
			username: req.params.username
		}).populate('images').exec();

		if (!pageUser)
			throw new HttpError(404, 'this user doesn\'t exist');

		return {
			loggedUser,
			pageUser
		};


	}).then(result => {
		res.locals = result;

		if (result.loggedUser && result.pageUser)
			res.locals.ownPage = (result.loggedUser._id.toString() === result.pageUser._id.toString());
		res.locals.page = 'user';



		res.locals.imagePrefix = config.get('userdata:image:prefix');
		res.locals.imagePostfix = config.get('userdata:image:postfix');
		res.locals.previewPostfix = config.get('userdata:imagePreview:postfix');

		debug(res.locals);
		res.render('user');
	}).catch(err => {
		next(err);
	});
}

function joinRequestListener(req, res, next) {
	debug('recieved registration request: %o', req.body);

	if (req.xhr || req.accepts('json,html') === 'json') {
		co(function*() {
			//console.log(mongoose.connection.readyState);
			let userData = {
				username: req.body.username,
				password: req.body.password,
				email: req.body.email
			};

			let result = checkUserData(userData);

			debug('data validation completed: %o', result);

			if (result.success) {
				if (!User.indexesEnsured)
					yield User.ensureIndexes();

				let oldUser = yield User.findOne({
					username: userData.username
				}).exec();
				if (oldUser) throw new DuplicatingUniquePropertyError('username', 'this username is already taken');

				oldUser = yield User.findOne({
					email: userData.email
				}).exec();
				if (oldUser) throw new DuplicatingUniquePropertyError('email', 'this e-mail is already registered');

				let newUser = new User(userData).save();

				return newUser;

			} else {
				throw new PropertyError(result.errors[0].property, result.errors[0].message);
			}

		}).then((user) => {
			debug('registration is successful. User id: %s', user._id);
			req.session.userId = user._id;

			res.json({
				success: true,
				url: '/'
			});
		}).catch(err => {

			if (err instanceof PropertyError)
				res.json({
					success: false,
					property: err.property,
					message: err.message
				});
			else
				next(err);
		});
	} else
		res.redirect(303, '/');
}

function loginRequestListener(req, res, next) {
	debug('recieved login request: %o', req.body);
	let loginUser = req.body;

	if (req.xhr || req.accepts('json,html') === 'json') {
		co(function*() {

			if (!User.indexesEnsured)
				yield User.ensureIndexes();

			user = yield User.findOne({
				username: loginUser.username
			}).exec();

			if (!user) throw new LoginError('no such user');

			if (!user.checkPassword(loginUser.password)) throw new LoginError('invalid password');

			return user;


		}).then((user) => {
			debug('login is successful. User id: %s', user._id);
			req.session.userId = user._id;

			res.json({
				success: true,
				url: '/'
			});
		}).catch(err => {

			if (err instanceof LoginError)
				res.json({
					success: false,
					message: 'Invalid login data'
				});
			else
				next(err);
		});
	} else
		res.redirect(303, '/');
}

function logoutRequestListener(req, res, next) {
	if (req.session.userId)
		delete req.session.userId;

	res.clearCookie(config.get('cookie:session:key'));
	res.redirect(303, '/');
}

exports.registerRoutes = function(app) {
	app.post('/join', joinRequestListener);
	app.post('/login', loginRequestListener);
	app.get('/logout', logoutRequestListener);
	app.get('/users', usersListRequestListener);
	app.get('/user/:username', userProfileRequestListener);
};