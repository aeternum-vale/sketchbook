let ComponentError = require(LIBS + 'componentErrors').ComponentError;

let MessageModalWindow = require(BLOCKS + 'message-modal-window');
let messageModalWindow = new MessageModalWindow();

module.exports = function() {
	document.addEventListener('error', e => {
		let error = e.detail;
		if (error instanceof ComponentError)
			messageModalWindow.show(error.message);
	});
};