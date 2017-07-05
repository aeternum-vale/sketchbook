let ModalWindow = require(BLOCKS + 'modal-window');

let MessageModalWindow = function (options) {
    ModalWindow.apply(this, arguments);
    this.elem = null;
    this.elemId = 'message-modal-window';
    this.caption = options && options.caption || 'message';
    this.message = options && options.message || 'You were not suppose to see this! Seems like something is broken :(';
};
MessageModalWindow.prototype = Object.create(ModalWindow.prototype);
MessageModalWindow.prototype.constructor = MessageModalWindow;

MessageModalWindow.prototype.setElem = function () {
    this.setWindowInnerHtml();
    this.elem = document.getElementById(this.elemId);
    if (!this.elem)
        this.elem = this.renderWindow(this.wrapper, this.windowInnerHtml);
    this.setListeners();

    this.elem.onclick = e => {
        if (!e.target.matches('.message-modal-window__ok-button')) return;
        this.deactivate();
    };
};

MessageModalWindow.prototype.setWindowInnerHtml = function () {
    this.windowInnerHtml =
        `<div class='window window_invisible modal-window message-modal-window' id='message-modal-window'>
            <div class="header window__header">
            </div>
        
            <div class="panel window__panel">
                <div class="message-modal-window__message">
                </div>
                <div class="button message-modal-window__ok-button">OK</div>
            </div>
        </div>`;
};

MessageModalWindow.prototype.show = function () {
    ModalWindow.prototype.show.apply(this);

    if (!this.elem)
        this.setElem();

    this.elem.querySelector('.header').textContent = this.caption;
    this.elem.querySelector('.message-modal-window__message').textContent = this.message;
    this.elem.classList.remove('window_invisible');
};

MessageModalWindow.prototype.deactivate = function () {
    this.elem.classList.add('window_invisible');
    ModalWindow.prototype.deactivate.apply(this);
};

module.exports = MessageModalWindow;
