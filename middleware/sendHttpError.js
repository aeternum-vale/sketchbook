let debug = require('debug')('app:middleware');

module.exports = function(req, res, next) {

	res.sendHttpError = function(error) {

		res.status(error.status);
		if (req.xhr)
			res.json({
				succes: false,
				message: error.message,
			});
		else
			res.render("error", {
				message: error.message,
				error: error
			});
	};

	next();
};