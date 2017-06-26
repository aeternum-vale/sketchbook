let eventMixin = require(LIBS + 'eventMixin');

let LikeButton = function(options) {

    this.elem = options.elem;
    this.imageId = options.imageId;

    this.likeAmount = +this.elem.dataset.likeAmount;
    this.active = !!this.elem.dataset.active;
    this.available = true;

    this.changed = false;

    this.elem.onclick = e => {

        if (this.available) {

            this.changed = false;
            this.available = false;
            this.toggle();

            require(LIBS + 'sendRequest')({
                id: this.imageId
            }, 'POST', '/like', (err, response) => {

                this.available = true;

                if (err) {
                    this.toggle();
                    this.error(err);
                } else
                    if (!this.changed)
                        this.trigger('like-button_changed');
            });

        }

    };

};

LikeButton.prototype.set = function(likeAmount, active, imageId) {
    if (imageId){
        this.imageId = imageId;
        this.changed = true;
    }

    this.setAmount(likeAmount);
    if (active)
        this.activate();
    else
        this.deactivate();
};

LikeButton.prototype.toggle = function() {
    if (this.active)
        this.set(this.likeAmount - 1, false);
    else
        this.set(this.likeAmount + 1, true);
};

LikeButton.prototype.setAmount = function(likeAmount) {
    this.likeAmount = likeAmount;
    this.elem.textContent = `like ${this.likeAmount}`;
};

LikeButton.prototype.activate = function() {
    this.elem.classList.add('button_active');
    this.active = true;
};

LikeButton.prototype.deactivate = function() {
    this.elem.classList.remove('button_active');
    this.active = false;
};

for (let key in eventMixin)
    LikeButton.prototype[key] = eventMixin[key];

module.exports = LikeButton;
