let eventMixin = require(LIBS + 'eventMixin');
let Modal = require(BLOCKS + 'modal');
let Spinner = require(BLOCKS + 'spinner');

let ModalSpinner = function (options) {
    Spinner.apply(this, arguments);
    Modal.apply(this, arguments);
    this.elemId = 'spinner';
    this.host = null;

};
ModalSpinner.prototype = Object.create(Modal.prototype);
ModalSpinner.prototype.constructor = ModalSpinner;

for (let key in Spinner.prototype)
    ModalSpinner.prototype[key] = Spinner.prototype[key];


ModalSpinner.prototype.setElem = function() {
    if (!this.elem)
        this.elem = document.getElementById('spinner');
    if (!this.elem)
        this.elem = this.renderWindow(Spinner.innerHtml);
};

ModalSpinner.prototype.show = function () {
    Modal.prototype.show.apply(this);

    if (!this.elem)
        this.setElem();

    this.setListeners();

    Spinner.prototype.show.apply(this);
};

ModalSpinner.prototype.hide = function () {
    Modal.prototype.hide.apply(this, arguments);
    Spinner.prototype.hide.apply(this, arguments);
};


ModalSpinner.prototype.deactivate = function (options) {
    Modal.prototype.deactivate.apply(this, arguments);
};

ModalSpinner.prototype.onHostLoaded = function (host, options) {
    this.trigger('spinner_host-loaded', {
        host,
        options
    });
};



for (let key in eventMixin)
    ModalSpinner.prototype[key] = eventMixin[key];

module.exports = ModalSpinner;