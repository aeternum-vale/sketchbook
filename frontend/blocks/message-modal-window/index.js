let ModalWindow = require(BLOCKS + 'modal-window');

let MessageModalWindow = function(options) {
	ModalWindow.apply(this, arguments);
	this.elem = null;
	this.defaultCaption = 'message';
	this.defaultMessage = 'You are not supposed to see this! It means something broken :(';
	this.elemId = 'message-modal-window';
};
MessageModalWindow.prototype = Object.create(ModalWindow.prototype);
MessageModalWindow.prototype.constructor = MessageModalWindow;

MessageModalWindow.prototype.setElem = function() {
	this.setWindowInnerHtml();
	this.elem = document.getElementById(this.elemId);
	if (!this.elem)
		this.elem = this.renderWindow(this.wrapper, this.windowInnerHtml);

	this.setListeners();
};

MessageModalWindow.prototype.setWindowInnerHtml = function() {
	this.windowInnerHtml = require(`html-loader!./window`);
};

MessageModalWindow.prototype.activate = function(message, caption) {
	ModalWindow.prototype.activate.apply(this);

	if (!this.elem)
		this.setElem();

	this.elem.querySelector('.header').textContent = caption || this.defaultCaption;
	this.elem.querySelector('.message-modal-window__message').textContent = message || this.defaultMessage;
	this.elem.classList.remove('window_invisible');
};

MessageModalWindow.prototype.deactivate = function() {
	ModalWindow.prototype.deactivate.apply(this);
	this.elem.classList.add('window_invisible');
};

module.exports = MessageModalWindow;
