let User = require('models/user');
let userViewModel = require('viewModels/user');

let co = require('co');

function usersListRequestListener(req, res, next) {

	co(function*() {

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
		res.json(userViewModel(result));
	}).catch(err => {
		return next(err);
	});
}

function joinRequestListener(req, res, next) {
	console.log(req.body);

	if (req.xhr || req.accepts('json,html') === 'json') {
		co(function*() {
			//console.log(mongoose.connection.readyState);
			yield User.ensureIndexes();

			let newUser = new User({
				username: req.body.username,
				password: req.body.password,
				email: req.body.email
			}).save();

			return newUser;
		}).then(() => {
			res.json({
				success: true,
				url: '/'
			});
		}).catch(err => {
			res.json({
				success: false
			})
		});
	} else
		res.redirect(303, '/');
}

exports.registerRoutes = function(app) {
	app.post('/join', joinRequestListener);
	app.get('/users', usersListRequestListener);
	app.get('/user/:username', userProfileRequestListener);
};