let url = require('url');

module.exports = function (referer) {
	let pathname = url.parse(referer).pathname;
	return pathname.substring(pathname.lastIndexOf('/') + 1);
}