let SwitchButton = require(BLOCKS + 'switch-button');

let SubscribeButton = function (options) {
    SwitchButton.apply(this, arguments);

    this.counterElem = options.counterElem;
    this.subscribersAmount = 0;
    if (this.counterElem)
        this.subscribersAmount = +this.counterElem.textContent;

    this.url = '/subscribe';
};
SubscribeButton.prototype = Object.create(SwitchButton.prototype);
SubscribeButton.prototype.constructor = SubscribeButton;

SubscribeButton.prototype.setAmount = function (subscribersAmount) {
    this.subscribersAmount = subscribersAmount;
    if (this.counterElem)
        this.counterElem.textContent = subscribersAmount;
};

SubscribeButton.prototype.set = function (options) {
    this.setAmount(options.subscribersAmount);
    SwitchButton.prototype.set.call(this, options);
};

SubscribeButton.prototype.toggle = function () {
    if (this.active)
        this.set({active: false, subscribersAmount: this.subscribersAmount - 1});
    else
        this.set({active: true, subscribersAmount: this.subscribersAmount + 1});
};

module.exports = SubscribeButton;
