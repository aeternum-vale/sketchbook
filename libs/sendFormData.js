let ServerError = require(LIBS + 'componentErrors').ServerError;
let ClientError = require(LIBS + 'componentErrors').ClientError;

module.exports = function(url, formData, cb) {
	var xhr = new XMLHttpRequest();
	xhr.upload.onprogress = event => {
		//console.log(event.loaded + ' / ' + event.total);
	};

	xhr.onload = xhr.onerror = function() {
		let response;

		if (this.responseText)
			response = JSON.parse(this.responseText);
		else {
			cb(new ServerError('Server is not responding'));
			return;
		}

		if (this.status == 200) {
			if (response.success)
				cb(null, response);
			else
				cb(new ClientError(response.message), response);
		} else
			cb(new ServerError(response.message));
	};

	xhr.open("POST", url, true);
	xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	xhr.send(formData);
};