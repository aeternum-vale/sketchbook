module.exports = function(body, method, url, cb) {
	let xhr = new XMLHttpRequest();
	xhr.open(method, url, true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

	xhr.onreadystatechange = function() {
		if (this.readyState != 4) return;
		if (this.status != 200) {

			let message = 'Server is not responding';

			if (this.responseText) {
				let response = JSON.parse(this.responseText);
				message = response.message
			}

			cb(message);
			return;
		}

		let response = JSON.parse(this.responseText);
		cb(null, response);
	};

	xhr.send(body);
}