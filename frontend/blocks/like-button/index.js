let eventMixin = require(LIBS + 'eventMixin');

let LikeButton = function(options) {

	this.elem = options.elem;

	this.likeAmount = +this.elem.dataset.likeAmount;
	this.active = !!this.elem.dataset.active;
	this.available = true;

	this.elem.onclick = e => {

		if (this.available) {
			this.available = false;
			this.toggle();

			require(LIBS + 'sendXHR')(null, 'POST', '/like', (err, response) => {
				if (err) {
					this.trigger('error', err);
					return;
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

	};

};

LikeButton.prototype.setLike = function() {
	this.elem.textContent = `like ${this.likeAmount}`;
};

LikeButton.prototype.toggle = function() {
	if (this.active) {
		this.elem.classList.remove('button_active');
		this.likeAmount--;
		this.active = false;
	} else {
		this.elem.classList.add('button_active');
		this.likeAmount++;
		this.active = true;
	}
	this.setLike();
};

for (let key in eventMixin) {
	LikeButton.prototype[key] = eventMixin[key];
}

module.exports = LikeButton;