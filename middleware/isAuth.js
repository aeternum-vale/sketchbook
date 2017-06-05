module.exports = function(req, res, next) {
	if (!req.session.userId) {
		if (req.xhr)
			next(401);
		else
			res.redirect('/authorization', 302);
	} else
		next();
};