let SwitchButton = require(BLOCKS + 'switch-button');
let getCorrectNounForm = require(LIBS + 'getCorrectNounForm');

let SubscribeButton = function (options) {

    this.outerStatElem = options.outerStatElem;

    this.counterElem = this.outerStatElem && this.outerStatElem.querySelector('.stat__number');
    this.counterDesignationElem = this.outerStatElem && this.outerStatElem.querySelector('.stat__caption');

    this.subscribersAmount = 0;
    if (this.counterElem)
        this.subscribersAmount = +this.counterElem.textContent;

    this.url = '/subscribe';
    this.activeText = 'subscribed';
    this.inactiveText = 'subscribe';

    SwitchButton.apply(this, arguments);
};
SubscribeButton.prototype = Object.create(SwitchButton.prototype);
SubscribeButton.prototype.constructor = SubscribeButton;

SubscribeButton.prototype.setAmount = function (subscribersAmount) {
    this.subscribersAmount = subscribersAmount;
    if (this.counterElem)
        this.counterElem.textContent = subscribersAmount;

    if (this.counterDesignationElem)
        this.counterDesignationElem.textContent = getCorrectNounForm('subscriber', subscribersAmount);
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
