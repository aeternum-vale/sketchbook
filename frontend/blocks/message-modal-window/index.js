
let ModalWindow = require(BLOCKS + 'modal-window');

const DEFAULT_CAPTION = 'message';

let MessageModalWindow = function(options) {
	ModalWindow.apply(this, arguments);
};
MessageModalWindow.prototype = Object.create(ModalWindow.prototype);
MessageModalWindow.prototype.constructor = MessageModalWindow;

MessageModalWindow.prototype.show = function(message, caption) {
	this.elem.querySelector('.header').textContent = caption || DEFAULT_CAPTION;
	this.elem.querySelector('.message-modal-window__message').textContent = message;
	this.activate();
};


module.exports = MessageModalWindow;