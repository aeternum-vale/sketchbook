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

Modal.setBackdrop = function (status) {
    if (status === Modal.statuses.MINOR) {
        Modal.minorBackdrop = document.getElementById('backdrop_minor');
        if (!Modal.minorBackdrop)
            Modal.minorBackdrop = Modal.renderBackdrop('minor');
    } else {
        Modal.majorBackdrop = document.getElementById('backdrop_major');
        if (!Modal.majorBackdrop)
            Modal.majorBackdrop = Modal.renderBackdrop('major');
    }

};


Modal.setWrapper = function (status) {
    if (status === Modal.statuses.MINOR) {
        Modal.minorWrapper = document.getElementById('modal-wrapper-minor');
        if (!Modal.minorWrapper)
            Modal.minorWrapper = Modal.renderWrapper('minor');
        Modal.minorWrapper.onclick = e => {
            console.log('i am trying 1');
            if (e.target && !e.target.classList.contains('modal-wrapper_minor')) return;
            console.log('i am trying 2');
            if (Modal.minorActive)
                Modal.minorQueue[0].deactivate();
        };
    } else {
        Modal.majorWrapper = document.getElementById('modal-wrapper-major');
        if (!Modal.majorWrapper)
            Modal.majorWrapper = Modal.renderWrapper('major');
        Modal.majorWrapper.onclick = e => {
            if (e.target && !e.target.classList.contains('modal-wrapper_major')) return;
            if (Modal.majorActive)
                Modal.majorQueue[0].deactivate();
        };
    }
};

Modal.renderBackdrop = function (type) {
    let backdrop = document.createElement('DIV');
    backdrop.className = 'backdrop backdrop_invisible';
    backdrop.classList.add(`backdrop_${type}`);
    backdrop.id = `backdrop-${type}`;
    document.body.appendChild(backdrop);
    return backdrop;
};

Modal.renderWrapper = function (type) {
    let wrapper = document.createElement('DIV');
    wrapper.className = 'modal-wrapper modal-wrapper_invisible';
    wrapper.classList.add(`modal-wrapper_${type}`);
    wrapper.id = `modal-wrapper-${type}`;
    document.body.appendChild(wrapper);
    return wrapper;
};

Modal.prototype.renderWindow = function (innerHTML) {
    let parent = document.createElement('DIV');
    parent.innerHTML = innerHTML;
    let wnd = parent.firstElementChild;
    if (this.status === Modal.statuses.MINOR)
        Modal.minorWrapper.appendChild(wnd);
    else
        Modal.majorWrapper.appendChild(wnd);
    return wnd;
};

Modal.prototype.show = function () {
    if (this.status === Modal.statuses.MINOR) {
        if (!Modal.minorBackdrop)
            Modal.setBackdrop(Modal.statuses.MINOR);

        if (!Modal.minorWrapper)
            Modal.setWrapper(Modal.statuses.MINOR);

        Modal.minorWrapper.classList.remove('modal-wrapper_invisible');
        Modal.minorBackdrop.classList.remove('backdrop_invisible');

    } else {
        if (!Modal.majorBackdrop)
            Modal.setBackdrop(Modal.statuses.MAJOR);

        if (!Modal.majorWrapper)
            Modal.setWrapper(Modal.statuses.MAJOR);

        Modal.majorWrapper.classList.remove('modal-wrapper_invisible');
        Modal.majorBackdrop.classList.remove('backdrop_invisible');
    }

    this.active = true;

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

        Modal.minorWrapper.classList.add('modal-wrapper_invisible');
        Modal.minorBackdrop.classList.add('backdrop_invisible');

        Modal.minorQueue.shift();
        Modal.minorShow();
    }
    else if (this.status === Modal.statuses.MAJOR) {

        Modal.majorWrapper.classList.add('modal-wrapper_invisible');
        Modal.majorBackdrop.classList.add('backdrop_invisible');

        Modal.majorQueue.shift();
        Modal.majorShow();
    }

    this.active = false;
    this.trigger('modal-window_deactivated');
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
