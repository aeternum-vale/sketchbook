let url = require('url');

module.exports = function(req, res, next) {
	if (req.headers.referer) {

		let pathname = url.parse(req.headers.referer).pathname;
		let arrParams = pathname.split('/');

		req.refererParams = {
			field: arrParams[1],
			value: arrParams[2]
		}
		next();
	} else
		return next(500);
};