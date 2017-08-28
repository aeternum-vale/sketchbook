let SwitchButton = require(BLOCKS + 'switch-button');

let LikeButton = function (options) {
    SwitchButton.apply(this, arguments);

    this.likeAmount = +this.elem.dataset.likeAmount;
    this.likeAmountElem = this.elem.querySelector('.like-button__like-amount');


    this.url = '/like';



};
LikeButton.prototype = Object.create(SwitchButton.prototype);
LikeButton.prototype.constructor = LikeButton;

LikeButton.prototype.setAmount = function (likeAmount) {
    this.likeAmount = likeAmount;
    this.likeAmountElem.textContent = likeAmount;
};

LikeButton.prototype.set = function (options) {
    this.setAmount(options.likeAmount);
    SwitchButton.prototype.set.call(this, options);
};

LikeButton.prototype.toggle = function () {
    if (this.active)
        this.set({active: false, likeAmount: this.likeAmount - 1});
    else
        this.set({active: true, likeAmount: this.likeAmount + 1});
};

module.exports = LikeButton;
