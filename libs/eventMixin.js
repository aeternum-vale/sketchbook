module.exports = {

	on: function(eventName, cb) {
		this.elem.addEventListener(eventName, cb);
	},

	trigger: function(eventName, detail) {

		this.elem.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true,
			cancelable: true,
			detail: detail
		}));
	},

	error: function(err) {

		this.elem.dispatchEvent(new CustomEvent('error', {
			bubbles: true,
			cancelable: true,
			detail: err
		}));

	}


};