let eventMixin = require(LIBS + 'eventMixin');

let LikeButton = function (options) {

    this.elem = options.elem;
    this.imageId = options.imageId;

    this.likeAmount = +this.elem.dataset.likeAmount;
    this.active = !!this.elem.dataset.active;
    this.available = true;

    this.elem.onclick = e => {

        let involvedImageId = this.imageId;

            if (this.available) {

                this.available = false;
                this.toggle();

                require(LIBS + 'sendRequest')({
                    id: involvedImageId
                }, 'POST', '/like', (err, response) => {


                    if (!err) {
                        this.available = true;
                        this.trigger('like-button_changed', {
                            imageId: involvedImageId,
                            likeAmount: response.likeAmount
                        });
                    } else {
                        this.error(err);

                        if (this.imageId === involvedImageId) {
                            this.available = true;
                            this.toggle();
                        }
                    }


                });

            }


    };

};

LikeButton.prototype.setImageId = function (imageId) {
    this.imageId = imageId;
};

LikeButton.prototype.set = function (likeAmount, active) {
    this.setAmount(likeAmount);
    if (active)
        this.activate();
    else
        this.deactivate();
};

LikeButton.prototype.toggle = function () {
    if (this.active)
        this.set(this.likeAmount - 1, false);
    else
        this.set(this.likeAmount + 1, true);
};

LikeButton.prototype.setAmount = function (likeAmount) {
    this.likeAmount = likeAmount;
    this.elem.textContent = `like ${this.likeAmount}`;
};

LikeButton.prototype.activate = function () {
    this.elem.classList.add('button_active');
    this.active = true;
};

LikeButton.prototype.deactivate = function () {
    this.elem.classList.remove('button_active');
    this.active = false;
};

for (let key in eventMixin)
    LikeButton.prototype[key] = eventMixin[key];

module.exports = LikeButton;
