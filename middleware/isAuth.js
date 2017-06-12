module.exports = function(req, res, next) {
	if (!req.session.userId) {
		if (req.xhr)
			next(401);
		else
			res.redirect(302, '/authorization');
	} else
		next();
};