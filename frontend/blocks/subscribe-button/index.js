let eventMixin = require(LIBS + 'eventMixin');

let SubscribeButton = function(options) {

	this.elem = options.elem;

	this.checked = !!this.elem.dataset.checked;
	this.available = true;

	this.elem.onclick = e => {

		if (this.available) {

			this.available = false;
			this.toggle();

			require(LIBS + 'sendXHR')(null, 'POST', '/subscribe', (err, response) => {
				if (err) {
					this.trigger('error', err);
				}

				if (response.success) {
					this.available = true;
				} else {
					this.toggle();
					this.available = true;
					this.trigger('error');
				}
			});

		}
	}
};

SubscribeButton.prototype.toggle = function() {
	if (this.checked) {
		this.elem.classList.remove('button_active');
		this.checked = false;
	} else {
		this.elem.classList.add('button_active');
		this.checked = true;
	}

	this.trigger('change');
};


for (let key in eventMixin) {
 	SubscribeButton.prototype[key] = eventMixin[key];
}

module.exports = SubscribeButton;