let eventMixin = require(LIBS + 'eventMixin');

let SubscribeButton = function (options) {

    this.elem = options.elem;
    this.imageId = options.imageId;

    this.active = !!this.elem.dataset.active;
    this.available = true;
    this.counterElem = options.counterElem;

    if (this.counterElem)
        this.counterDefaultValue = parseInt(this.counterElem.textContent) - +this.active;

    this.elem.onclick = e => {

        let involvedImageId = this.imageId;

            if (this.available) {

                this.available = false;
                this.toggle();

                require(LIBS + 'sendRequest')({
                    id: involvedImageId
                }, 'POST', '/subscribe', (err, response) => {

                    if (!err) {
                        this.available = true;
                        this.trigger('subscribe-button_changed', {
                            involvedImageId
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

    }
};

SubscribeButton.prototype.toggle = function () {
    if (this.active) {
        this.elem.classList.remove('button_active');
        this.active = false;

        if (this.counterElem)
            this.counterElem.textContent = this.counterDefaultValue;
    } else {
        this.elem.classList.add('button_active');
        this.active = true;

        if (this.counterElem)
            this.counterElem.textContent = this.counterDefaultValue + 1;
    }
};

SubscribeButton.prototype.setImageId = function (id) {
    this.imageId = id;
};

for (let key in eventMixin)
    SubscribeButton.prototype[key] = eventMixin[key];

module.exports = SubscribeButton;
