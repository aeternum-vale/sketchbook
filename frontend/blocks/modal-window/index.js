let eventMixin = require(LIBS + 'eventMixin');

let ModalWindow = function() {

    this.active = false;
    this.backdrop = null;
    this.wrapper = null;

    this.listeners = [];
};

ModalWindow.prototype.setListeners = function() {
    this.listeners.forEach(item => {
        this.elem.addEventListener(item.eventName, item.cb);
    });
};

ModalWindow.prototype.setBackdrop = function() {
    this.backdrop = document.getElementById('backdrop');
    if (!this.backdrop)
        this.backdrop = this.renderBackdrop();
};

ModalWindow.prototype.setWrapper = function() {
    this.wrapper = document.getElementById('modal-window-wrapper');

    if (!this.wrapper)
        this.wrapper = this.renderWrapper();

    this.wrapper.onclick = e => {
        if (e.target && !e.target.classList.contains('modal-window-wrapper')) return;
        this.deactivate();
    };
};

ModalWindow.prototype.renderBackdrop = function() {
    return require('./renderBackdrop')();
};

ModalWindow.prototype.renderWrapper = function() {
    return require('./renderWrapper')();
};

ModalWindow.prototype.renderWindow = function(wrapper, innerHTML) {
    let parent = document.createElement('DIV');
    parent.innerHTML = innerHTML; //require(`html-loader!./window`);
    let wnd = parent.firstElementChild;
    wrapper.appendChild(wnd);
    return wnd;
}

ModalWindow.prototype.activate = function() {
    if (!this.backdrop)
        this.setBackdrop();

    if (!this.wrapper)
        this.setWrapper();

    this.active = true;

    this.backdrop.classList.remove('backdrop_invisible');
    this.wrapper.classList.remove('modal-window-wrapper_invisible');
};

ModalWindow.prototype.deactivate = function() {
    this.active = false;

    this.backdrop.classList.add('backdrop_invisible');
    this.wrapper.classList.add('modal-window-wrapper_invisible');

	this.trigger('modal-window_deactivated');
};


for (let key in eventMixin) {
    ModalWindow.prototype[key] = eventMixin[key];
}

module.exports = ModalWindow;
