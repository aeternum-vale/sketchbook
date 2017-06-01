let eventMixin = require(LIBS + 'eventMixin');

let DeleteImageButton = function(options) {
	this.elem = options.elem;

	this.elem .onclick = function(e) {
		require(LIBS + 'sendXHR')(null, 'DELETE', '/image', (err, response) => {
			if (err) {
				this.trigger('error', err);
			}

			if (response.success) {
				if (response.url)
					window.location = response.url;
			} else
				this.trigger('error');
		});
	};
}

for (let key in eventMixin) {
	DeleteImageButton.prototype[key] = eventMixin[key];
}


module.exports = DeleteImageButton;