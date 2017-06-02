let ModalWindow = require(BLOCKS + 'modal-window');

const DEFAULT_CAPTION = 'message';

let MessageModalWindow = function(options) {
	ModalWindow.apply(this, arguments);
	this.elem = null;

};
MessageModalWindow.prototype = Object.create(ModalWindow.prototype);
MessageModalWindow.prototype.constructor = MessageModalWindow;

MessageModalWindow.prototype.setElem = function() {
	this.elem = document.getElementById('message-modal-window');
	if (!this.elem)
		this.elem = this.renderWindow(this.wrapper);

	this.setListeners();
};

MessageModalWindow.prototype.activate = function(message, caption) {
	ModalWindow.prototype.activate.apply(this);

	if (!this.elem)
		this.setElem();

	this.elem.querySelector('.header').textContent = caption || DEFAULT_CAPTION;
	this.elem.querySelector('.message-modal-window__message').textContent = message;
	this.elem.classList.remove('window_invisible');
};

MessageModalWindow.prototype.deactivate = function(message, caption) {
	ModalWindow.prototype.deactivate.apply(this);
	this.elem.classList.add('window_invisible');
};

MessageModalWindow.prototype.renderWindow = function(wrapper) {
	return require('./renderWindow')(wrapper);
};


module.exports = MessageModalWindow;