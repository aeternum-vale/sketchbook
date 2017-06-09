let eventMixin = require(LIBS + 'eventMixin');

let DeleteImageButton = function(options) {
	this.elem = options.elem;

	this.elem.onclick = e => {
		require(LIBS + 'sendRequest')(null, 'DELETE', '/image', (err, response) => {
			if (err) {
				this.error(err);
				return;
			}

			this.trigger('deleted', {
				url: response.url
			});
			
		});
	};
}

for (let key in eventMixin) {
	DeleteImageButton.prototype[key] = eventMixin[key];
}


module.exports = DeleteImageButton;