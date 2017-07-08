let eventMixin = require(LIBS + 'eventMixin');

let Modal = function () {
    this.active = false;
    this.backdrop = null;
    this.wrapper = null;
    this.listeners = [];
};

Modal.prototype.onElemClick = function(e) {
    if (e.target.matches('.modal-close-button'))
        this.deactivate();
};

Modal.prototype.setListeners = function () {
    this.listeners.forEach(item => {
        this.elem.addEventListener(item.eventName, item.cb);
    });
};

Modal.prototype.setBackdrop = function () {
    this.backdrop = document.getElementById('backdrop');
    if (!this.backdrop)
        this.backdrop = this.renderBackdrop();
};

Modal.prototype.setWrapper = function () {
    this.wrapper = document.getElementById('modal-wrapper');

    if (!this.wrapper)
        this.wrapper = this.renderWrapper();

    this.wrapper.onclick = e => {
        if (e.target && !e.target.classList.contains('modal-wrapper')) return;
        this.deactivate();
    };
};

Modal.prototype.renderBackdrop = function() {
    let backdrop = document.createElement('DIV');
    backdrop.className = 'backdrop backdrop_invisible';
    backdrop.id = 'backdrop';
    document.body.appendChild(backdrop);
    return backdrop;
};

Modal.prototype.renderWrapper = function() {
    let wrapper = document.createElement('DIV');
    wrapper.className = 'modal-wrapper modal-wrapper_invisible';
    wrapper.id = 'modal-wrapper';
    document.body.appendChild(wrapper);
    return wrapper;
};

Modal.prototype.renderWindow = function (wrapper, innerHTML) {
    let parent = document.createElement('DIV');
    parent.innerHTML = innerHTML;
    let wnd = parent.firstElementChild;
    wrapper.appendChild(wnd);
    return wnd;
};

Modal.prototype.show = function () {
    if (!this.backdrop)
        this.setBackdrop();

    if (!this.wrapper)
        this.setWrapper();

    this.active = true;

    this.backdrop.classList.remove('backdrop_invisible');
    this.wrapper.classList.remove('modal-wrapper_invisible');
};

Modal.prototype.activate = function () {
    Modal.modalsQueue.push(this);

    if (!Modal.active)
        Modal.show();
};

Modal.prototype.deactivate = function () {
    this.active = false;

    this.backdrop.classList.add('backdrop_invisible');
    this.wrapper.classList.add('modal-wrapper_invisible');

    this.trigger('modal-window_deactivated');

    Modal.modalsQueue.shift();
    Modal.show();
};

Modal.active = false;
Modal.modalsQueue = [];
Modal.show = function () {
    let nextModalWindow = Modal.modalsQueue[0];
    if (nextModalWindow) {
        nextModalWindow.show();
        Modal.active = true;
    } else
        Modal.active = false;
};

for (let key in eventMixin)
    Modal.prototype[key] = eventMixin[key];

module.exports = Modal;
