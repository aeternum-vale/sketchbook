let eventMixin = require(LIBS + 'eventMixin');

let Modal = function (options) {
    this.active = false;
    this.listeners = [];
    this.status = options && options.status || Modal.statuses.MINOR;
};

Modal.statuses = {
    MAJOR: 1,
    MINOR: 2
};

Modal.prototype.onElemClick = function (e) {
    if (e.target.matches('.modal-close-button'))
        this.deactivate();
};

Modal.prototype.setListeners = function () {
    this.listeners.forEach(item => {
        this.elem.addEventListener(item.eventName, item.cb);
    });
};

Modal.setBackdrop = function () {
    Modal.backdrop = document.getElementById('backdrop');
    if (!Modal.backdrop)
        Modal.backdrop = Modal.renderBackdrop();
};

Modal.setWrapper = function () {
    Modal.wrapper = document.getElementById('modal-wrapper');

    if (!Modal.wrapper)
        Modal.wrapper = Modal.renderWrapper();

    Modal.wrapper.onclick = e => {
        if (e.target && !e.target.classList.contains('modal-wrapper')) return;
        this.deactivate();
    };
};

Modal.renderBackdrop = function () {
    let backdrop = document.createElement('DIV');
    backdrop.className = 'backdrop backdrop_invisible';
    backdrop.id = 'backdrop';
    document.body.appendChild(backdrop);
    return backdrop;
};

Modal.renderWrapper = function () {
    let wrapper = document.createElement('DIV');
    wrapper.className = 'modal-wrapper modal-wrapper_invisible';
    wrapper.id = 'modal-wrapper';
    document.body.appendChild(wrapper);
    return wrapper;
};

Modal.prototype.renderWindow = function (innerHTML) {
    let parent = document.createElement('DIV');
    parent.innerHTML = innerHTML;
    let wnd = parent.firstElementChild;
    Modal.wrapper.appendChild(wnd);
    return wnd;
};

Modal.prototype.show = function () {
    if (!Modal.backdrop)
        Modal.setBackdrop();

    if (!Modal.wrapper)
        Modal.setWrapper();

    this.active = true;

    Modal.backdrop.classList.remove('backdrop_invisible');
    Modal.wrapper.classList.remove('modal-wrapper_invisible');
};

Modal.prototype.activate = function () {


    return new Promise((resolve, reject) => {
        if (this.status === Modal.statuses.MINOR) {
            Modal.minorQueue.push(this);
            console.log(Modal.minorQueue);
            console.log(Modal.majorQueue);

            if (!Modal.minorActive)
                Modal.minorShow().then(() => {
                    resolve();
                });
            else
                resolve();
        }
        else if (this.status === Modal.statuses.MAJOR) {
            Modal.majorQueue.push(this);
            console.log(Modal.minorQueue);
            console.log(Modal.majorQueue);

            if (!Modal.majorActive)
                Modal.majorShow().then(() => {
                    resolve();
                });
            else
                resolve();
        }
    });
};

Modal.prototype.deactivate = function () {


    if (this.status === Modal.statuses.MINOR) {

        if (!Modal.majorActive) {
            Modal.backdrop.classList.add('backdrop_invisible');
            Modal.wrapper.classList.add('modal-wrapper_invisible');
        }

        this.active = false;
        this.trigger('modal-window_deactivated');

        Modal.minorQueue.shift();
        Modal.minorShow();
    }
    else if (this.status === Modal.statuses.MAJOR) {

        if (!Modal.minorActive) {
            Modal.backdrop.classList.add('backdrop_invisible');
            Modal.wrapper.classList.add('modal-wrapper_invisible');
        }

        Modal.majorQueue.shift();
        Modal.majorShow();
    }

};

Modal.minorActive = false;
Modal.majorActive = false;
Modal.minorQueue = [];
Modal.majorQueue = [];


Modal.minorShow = function () {
    let nextModalWindow = Modal.minorQueue[0];
    if (nextModalWindow) {
        Modal.minorActive = true;
        let promise = nextModalWindow.show();
        if (promise)
            return promise;
        else
            return Promise.resolve();
    } else {

        Modal.minorActive = false;
        return Promise.resolve();
    }
};

Modal.majorShow = function () {
    let nextModalWindow = Modal.majorQueue[0];
    if (nextModalWindow) {
        Modal.majorActive = true;
        let promise = nextModalWindow.show();
        if (promise)
            return promise;
        else
            return Promise.resolve();
    } else {
        Modal.majorActive = false;
        return Promise.resolve();
    }
};

for (let key in eventMixin)
    Modal.prototype[key] = eventMixin[key];

module.exports = Modal;
