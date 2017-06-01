let eventMixin = require(LIBS + 'eventMixin');

let ModalWindow = function(options) {
	this.elem = options.elem;
	this.wrapper = this.elem.closest('.modal-window-wrapper');
	this.backdrop = this.wrapper.previousElementSibling;

	if (!this.backdrop.matches('.backdrop'))
		throw new Error('Incorrect backdrop');

	this.active = false;

	this.wrapper.onclick = e => {
		if (!e.target.classList.contains('modal-window-wrapper')) return;
		this.deactivate();
	};

};


ModalWindow.prototype.activate = function() {
	this.active = true;

	this.elem.classList.remove('window_invisible');
	this.backdrop.classList.remove('backdrop_invisible');
	this.wrapper.classList.remove('modal-window-wrapper_invisible');
};

ModalWindow.prototype.deactivate = function() {
	this.active = false;

	this.elem.classList.add('window_invisible');
	this.backdrop.classList.add('backdrop_invisible');
	this.wrapper.classList.add('modal-window-wrapper_invisible');
};

for (let key in eventMixin) {
	ModalWindow.prototype[key] = eventMixin[key];
}

module.exports = ModalWindow;