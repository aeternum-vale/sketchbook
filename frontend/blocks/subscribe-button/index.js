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

			require(LIBS + 'sendXHR')(null, 'POST', '/subscribe', (err, response) => {
				if (err) {
					this.trigger('error', new ServerError(err));
					this.elem.dispatchEvent(new CustomEvent('error', {
						bubbles: true,
						detail: new ServerError(err)
					}));
					this.toggle();
					this.available = true;
					return;
				}

				if (response.success) {
					this.available = true;
				} else {
					this.toggle();
					this.available = true;
					this.trigger('error', new ServerError(response.message));
					this.elem.dispatchEvent(new CustomEvent('error', {
						bubbles: true,
						detail: new ServerError(response.message)
					}));
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