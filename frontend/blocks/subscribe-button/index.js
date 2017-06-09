let eventMixin = require(LIBS + 'eventMixin');
let componentErrors = require(LIBS + 'componentErrors');
let ClientError = componentErrors.ClientError;
let ServerError = componentErrors.ServerError;

let SubscribeButton = function(options) {

	this.elem = options.elem;

	this.checked = !!this.elem.dataset.checked;
	this.available = true;

	this.elem.onclick = e => {

		if (this.available) {

			this.available = false;
			this.toggle();

			require(LIBS + 'sendRequest')(null, 'POST', '/subscribe', (err, response) => {

				this.available = true;

				if (err) {
					this.toggle();
					this.error(err);
					return;
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