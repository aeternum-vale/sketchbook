module.exports = function() {
	document.addEventListener('error', e => {
        require.ensure([LIBS + 'componentErrors', BLOCKS + 'message-modal-window'], function (require) {
            let ComponentError = require(LIBS + 'componentErrors').ComponentError;
            let MessageModalWindow = require(BLOCKS + 'message-modal-window');

            let error = e.detail;
            if (error instanceof ComponentError) {
                let messageModalWindow = new MessageModalWindow({message: error.message});
                messageModalWindow.show();
            } else
                throw error;
        });
	});
};