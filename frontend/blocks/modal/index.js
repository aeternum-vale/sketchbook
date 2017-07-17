let eventMixin = require(LIBS + 'eventMixin');
let Spinner = require(BLOCKS + 'spinner');

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
            if (e.target && !e.target.classList.contains('modal-wrapper_minor')) return;
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

Modal.prototype.renderWindow = function (innerHTML) { //TODO this can't be right
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


Modal.prototype.activate = function (options) {

    if (this.elemId === 'spinner') {
        let spinner = this;
        this.on('spinner_host-loaded', e => {
            let newHost = e.detail.host;

            if (this.status === Modal.statuses.MINOR)
                Modal.minorQueue.splice(Modal.minorQueue.indexOf(spinner) + 1, 0, newHost);
            else
                Modal.majorQueue.splice(Modal.majorQueue.indexOf(spinner) + 1, 0, newHost);

            spinner.deactivate(e.detail.options);
        });
    }

    return new Promise((resolve, reject) => {
        if (this.status === Modal.statuses.MINOR) {
            Modal.minorQueue.push(this);
            console.log(Modal.minorQueue);
            console.log(Modal.majorQueue);

            if (!Modal.minorActive)
                Modal.minorShow(options).then(() => {
                    resolve();
                });
            else
                resolve();
        }
        else {
            Modal.majorQueue.push(this);
            console.log(Modal.minorQueue);
            console.log(Modal.majorQueue);

            if (!Modal.majorActive)

                Modal.majorShow(options).then(() => {
                    resolve();
                });
            else
                resolve();
        }
    });
};

Modal.prototype.hide = function () {
    if (this.status === Modal.statuses.MINOR) {
        //TODO not neccessary if queue is not empty
        Modal.minorWrapper.classList.add('modal-wrapper_invisible');
        Modal.minorBackdrop.classList.add('backdrop_invisible');
    }
    else {
        Modal.majorWrapper.classList.add('modal-wrapper_invisible');
        Modal.majorBackdrop.classList.add('backdrop_invisible');
    }
};


Modal.prototype.deactivate = function (nextWindowOptions, hideOptions) {

    this.hide(hideOptions);
    this.active = false;
    if (this.status === Modal.statuses.MINOR) {
        Modal.minorActive = false;
        Modal.minorQueue.shift();
        Modal.minorShow(nextWindowOptions);
    } else {
        Modal.majorActive = false;
        Modal.majorQueue.shift();
        Modal.majorShow(nextWindowOptions);
    }
    this.trigger('modal-window_deactivated');
};

Modal.minorActive = false;
Modal.majorActive = false;
Modal.minorQueue = [];
Modal.majorQueue = [];

Modal.spinner = new Spinner();
Modal.spinner.status = Modal.statuses.MAJOR;

Modal.showSpinner = function () {
    Modal.prototype.show.call(Modal.spinner);

    if (!Modal.spinner.elem)
        Modal.spinner.elem = document.getElementById('spinner');
    if (!Modal.spinner.elem)
        Modal.spinner.elem = Modal.prototype.renderWindow.call(Modal.spinner, Spinner.innerHtml);

    Modal.spinner.show();
};

Modal.hideSpinner = function () {
    Modal.spinner.hide();
};


Modal.minorShow = function (options) {
    let nextModalWindow = Modal.minorQueue[0];
    if (nextModalWindow) {
        let promise = nextModalWindow.show(options);
        if (promise)
            return promise.then(() => {
                Modal.minorActive = true;
            });
        else {
            Modal.minorActive = true;
            return Promise.resolve();
        }
    } else {

        Modal.minorActive = false;
        return Promise.resolve();
    }
};

Modal.majorShow = function (options) {

    let nextModalWindow = Modal.majorQueue[0];

    if (nextModalWindow) {

        Modal.showSpinner();
        let promise = nextModalWindow.show(options);

        if (promise)
            return promise.then(() => {
                Modal.majorActive = true;
                Modal.hideSpinner();
            });
        else {
            Modal.majorActive = true;
            Modal.hideSpinner();
            return Promise.resolve();
        }

    } else {
        Modal.majorActive = false;
        return Promise.resolve();
    }
};

for (let key in eventMixin)
    Modal.prototype[key] = eventMixin[key];


module.exports = Modal;
