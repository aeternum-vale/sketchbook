module.exports = function(req, res, next) {
	if (!req.session.userId)
		next(401);
	else
		next();
};