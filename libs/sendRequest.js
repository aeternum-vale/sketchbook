let ServerError = require(LIBS + 'componentErrors').ServerError;

module.exports = function(body, method, url, cb) {
	let xhr = new XMLHttpRequest();
	xhr.open(method, url, true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

	xhr.onreadystatechange = function() {
		if (this.readyState != 4) return;

		let response;
		let message = 'Server is not responding';

		if (this.status != 200) {

			if (this.responseText) {
				response = JSON.parse(this.responseText);
				message = response.message
			}

			cb(new ServerError(message), response);
			return;
		}

		response = JSON.parse(this.responseText);
		if (response.success)
			cb(null, response);
		else
			cb(new ServerError(response.message), response);

	};

	xhr.send(body);
};