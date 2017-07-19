let SwitchButton = require(BLOCKS + 'switch-button');

let SubscribeButton = function (options) {
    SwitchButton.apply(this, arguments);

    this.counterElem = options.counterElem;
    this.url = '/subscribe';
};
SubscribeButton.prototype = Object.create(SwitchButton.prototype);
SubscribeButton.prototype.constructor = SubscribeButton;

SubscribeButton.prototype.activate = function () {
    SwitchButton.prototype.activate.call(this);
    if (this.counterElem)
        this.counterElem.textContent = +this.counterElem.textContent + 1;
};

SubscribeButton.prototype.deactivate = function () {
    SwitchButton.prototype.deactivate.call(this);
    if (this.counterElem)
        this.counterElem.textContent = +this.counterElem.textContent - 1;
};

module.exports = SubscribeButton;
