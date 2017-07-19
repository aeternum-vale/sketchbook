let SwitchButton = require(BLOCKS + 'switch-button');

let LikeButton = function (options) {
    SwitchButton.apply(this, arguments);

    this.likeAmount = +this.elem.dataset.likeAmount;
    this.url = '/like';

};
LikeButton.prototype = Object.create(SwitchButton.prototype);
LikeButton.prototype.constructor = LikeButton;

LikeButton.prototype.setAmount = function (likeAmount) {
    this.likeAmount = likeAmount;
    this.elem.textContent = `like ${this.likeAmount}`;
};

LikeButton.prototype.set = function (active, likeAmount) {
    this.setAmount(likeAmount);
    SwitchButton.prototype.set.call(this, active);
};

LikeButton.prototype.toggle = function () {
    if (this.active)
        this.set(false, this.likeAmount - 1);
    else
        this.set(true, this.likeAmount + 1);
};

module.exports = LikeButton;
