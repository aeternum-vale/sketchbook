let User = require('models/user');
let userViewModel = require('viewModels/user');
let co = require('co');

module.exports = function(req, res, next) {
	if (req.session.userId)
		co(function*() {

			if (!User.indexesEnsured)
				yield User.ensureIndexes();

			return User.findById(req.session.userId).exec();

			
			
		}).then(rawUser => {

			let user = userViewModel(rawUser);

			res.locals.loggedUser = user;
			res.loggedUser = rawUser;

			next();
		}).catch(err => {
			next(err);
		});
	else
		next();
};