let eventMixin = require(LIBS + 'eventMixin');

let ModalWindow = function () {

    this.active = false;
    this.backdrop = null;
    this.wrapper = null;

    this.listeners = [];

};

ModalWindow.prototype.setListeners = function () {
    this.listeners.forEach(item => {
        this.elem.addEventListener(item.eventName, item.cb);
    });
};

ModalWindow.prototype.setBackdrop = function () {
    this.backdrop = document.getElementById('backdrop');
    if (!this.backdrop)
        this.backdrop = this.renderBackdrop();
};

ModalWindow.prototype.setWrapper = function () {
    this.wrapper = document.getElementById('modal-window-wrapper');

    if (!this.wrapper)
        this.wrapper = this.renderWrapper();

    this.wrapper.onclick = e => {
        if (e.target && !e.target.classList.contains('modal-window-wrapper')) return;
        this.deactivate();
    };
};

ModalWindow.prototype.renderBackdrop = function() {
    let backdrop = document.createElement('DIV');
    backdrop.className = 'backdrop backdrop_invisible';
    backdrop.id = 'backdrop';
    document.body.appendChild(backdrop);
    return backdrop;
};

ModalWindow.prototype.renderWrapper = function() {
    let wrapper = document.createElement('DIV');
    wrapper.className = 'modal-window-wrapper modal-window-wrapper_invisible';
    wrapper.id = 'modal-window-wrapper';
    document.body.appendChild(wrapper);
    return wrapper;
};

ModalWindow.prototype.renderWindow = function (wrapper, innerHTML) {
    let parent = document.createElement('DIV');
    parent.innerHTML = innerHTML;
    let wnd = parent.firstElementChild;
    wrapper.appendChild(wnd);
    return wnd;
};

ModalWindow.prototype.show = function () {
    if (!this.backdrop)
        this.setBackdrop();

    if (!this.wrapper)
        this.setWrapper();

    this.active = true;

    this.backdrop.classList.remove('backdrop_invisible');
    this.wrapper.classList.remove('modal-window-wrapper_invisible');
};

ModalWindow.prototype.activate = function () {
    ModalWindow.modalWindowsQueue.push(this);

    if (!ModalWindow.active)
        ModalWindow.show();
};

ModalWindow.prototype.deactivate = function () {
    this.active = false;

    this.backdrop.classList.add('backdrop_invisible');
    this.wrapper.classList.add('modal-window-wrapper_invisible');

    this.trigger('modal-window_deactivated');

    ModalWindow.modalWindowsQueue.shift();
    ModalWindow.show();
};

ModalWindow.active = false;
ModalWindow.modalWindowsQueue = [];
ModalWindow.show = function () {
    let nextModalWindow = ModalWindow.modalWindowsQueue[0];
    if (nextModalWindow) {
        nextModalWindow.show();
        ModalWindow.active = true;
    } else
        ModalWindow.active = false;
};

for (let key in eventMixin)
    ModalWindow.prototype[key] = eventMixin[key];

module.exports = ModalWindow;
