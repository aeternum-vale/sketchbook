let GlobalErrorHandler = function (options) {
    document.addEventListener('error', e => {
        let error = e.detail;
        call(error);
    });
};

GlobalErrorHandler.prototype.call = function (error) {
    require.ensure([LIBS + 'componentErrors', BLOCKS + 'message-modal-window'], function (require) {
        let ComponentError = require(LIBS + 'componentErrors').ComponentError;
        let MessageModalWindow = require(BLOCKS + 'message-modal-window');

        if (error instanceof ComponentError) {

            if (error.status === 401) {
                localStorage.setItem('redirected_url', window.location.href);
                window.location = '/authorization';
            } else {
                let messageModalWindow = new MessageModalWindow({message: error.message});
                messageModalWindow.activate();
            }

        } else
            throw error;
    });
};

module.exports = GlobalErrorHandler;