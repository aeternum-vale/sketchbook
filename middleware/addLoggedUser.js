let User = require('models/User');
let co = require('co');

module.exports = function(req, res, next) {
	if (req.session.userId)
		co(function*() {

			if (!User.indexesEnsured)
				yield User.ensureIndexes();

			return User.findById(req.session.userId).exec();
			
		}).then(user => {
			res.locals.loggedUser = user;
			res.loggedUser = user;
			next();
		}).catch(err => {
			next(err);
		});
	else
		next();
};