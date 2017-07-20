let eventMixin = require(LIBS + 'eventMixin');

let SwitchButton = function (options) {
    this.elem = options.elem;
    this.imageId = options.imageId;

    this.active = !!this.elem.dataset.active;
    this.available = true;

    this.elem.onclick = e => {

        let involvedImageId = this.imageId;

        if (this.available) {

            this.available = false;
            this.toggle();

            require(LIBS + 'sendRequest')({
                id: involvedImageId
            }, 'POST', this.url, (err, response) => {

                if (!err) {
                    console.log(response);

                    this.set(response);
                    this.available = true;
                    this.trigger('switch-button_changed', {
                        imageId: involvedImageId,
                        response
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


SwitchButton.prototype.set = function (options) {
    if (options.active)
        this.activate();
    else
        this.deactivate();
};

SwitchButton.prototype.toggle = function () {
    if (this.active)
        this.set({active: false});
    else
        this.set({active: true});
};

SwitchButton.prototype.activate = function () {
    this.elem.classList.add('button_active');
    this.active = true;
};

SwitchButton.prototype.deactivate = function () {
    this.elem.classList.remove('button_active');
    this.active = false;
};

SwitchButton.prototype.setImageId = function (id) {
    this.imageId = id;
};

for (let key in eventMixin)
    SwitchButton.prototype[key] = eventMixin[key];

module.exports = SwitchButton;