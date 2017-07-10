let eventMixin = require(LIBS + 'eventMixin');
let Modal = require(BLOCKS + 'modal');

let Spinner = function (options) {
    Modal.apply(this, arguments);
    this.elemId = 'spinner';
    this.host = null;

};
Spinner.prototype = Object.create(Modal.prototype);
Spinner.prototype.constructor = Spinner;

Spinner.prototype.setElem = function () {
    if (!this.elem)
        this.elem = this.renderWindow(`<div id="spinner" class="spinner"></div>`);
};

Spinner.prototype.show = function () {
    Modal.prototype.show.apply(this);

    if (!this.elem)
        this.setElem();
    this.setListeners();

    this.elem.classList.remove('spinner_invisible');
};

Spinner.prototype.deactivate = function (options) {
    this.elem.classList.add('spinner_invisible');
    Modal.prototype.deactivate.apply(this, arguments);
};

Spinner.prototype.onHostLoaded = function (host, options) {
    this.trigger('spinner_host-loaded', {
        host,
        options
    });
};

for (let key in eventMixin)
    Spinner.prototype[key] = eventMixin[key];

module.exports = Spinner;