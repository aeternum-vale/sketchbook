let Modal = require(BLOCKS + 'modal');

let MessageModalWindow = function (options) {
    Modal.apply(this, arguments);
    this.elem = null;
    this.elemId = 'message-modal-window';
    this.caption = options && options.caption || 'message';
    this.message = options && options.message || 'You were not suppose to see this! Seems like something is broken :(';

};
MessageModalWindow.prototype = Object.create(Modal.prototype);
MessageModalWindow.prototype.constructor = MessageModalWindow;

MessageModalWindow.prototype.setElem = function () {
    this.setWindowHtml();
    this.elem = document.getElementById(this.elemId);
    if (!this.elem)
        this.elem = this.renderWindow(this.windowHtml);
    this.setListeners();
    this.elem.querySelector('.header').textContent = this.caption;
    this.elem.querySelector('.message-modal-window__message').textContent = this.message;

    this.elem.onclick = e => {
        this.onElemClick(e);
        if (e.target.matches('.message-modal-window__ok-button'))
            this.deactivate();
    };
};

MessageModalWindow.prototype.setWindowHtml = function () {
    this.windowHtml = require(`html-loader!./window`);
};

MessageModalWindow.prototype.show = function () {
    Modal.prototype.show.apply(this);

    if (!this.elem)
        this.setElem();

    this.elem.classList.remove('window_invisible');
};

MessageModalWindow.prototype.hide = function () {
    Modal.prototype.hide.apply(this);
    this.elem.classList.add('window_invisible');
};

module.exports = MessageModalWindow;
