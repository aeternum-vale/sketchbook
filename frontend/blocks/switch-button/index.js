let eventMixin = require(LIBS + 'eventMixin');

let SwitchButton = function (options) {
    this.elem = options.elem;
    this.data = options.data;
    this.dataStr = options.dataStr || 'imageId';

    SwitchButton.prototype.set.call(this, {active: !!this.elem.dataset.active});
    console.log('switch button active:', !!this.elem.dataset.active);
    this.available = true;

    this.elem.onclick = e => this.onClick(e);
};

SwitchButton.prototype.onClick = function(e) {
    let involvedData = this.data;

    if (this.available) {

        this.available = false;
        this.toggle();

        require(LIBS + 'sendRequest')({
            [this.dataStr]: involvedData
        }, 'POST', this.url, (err, response) => {

            if (!err) {

                this.set(response);
                this.available = true;
                this.trigger('switch-button_changed', {
                    [this.dataStr]: involvedData,
                    response
                });
            } else {
                this.error(err);

                if (this.data === involvedData) {
                    this.available = true;
                    this.toggle();
                }
            }
        });
    }
};


SwitchButton.setRelation = function (switchButton1, switchButton2) {
    switchButton1.on('switch-button_changed', e => {
        switchButton2.set(e.detail.response);
    });

    switchButton2.on('switch-button_changed', e => {
        switchButton1.set(e.detail.response);
    });
};

SwitchButton.prototype.set = function (options) {
    if (options.active)
        this._activate();
    else
        this._deactivate();
};

SwitchButton.prototype.toggle = function () {
    if (this.active)
        this.set({active: false});
    else
        this.set({active: true});
};

SwitchButton.prototype._activate = function () {
    this.elem.classList.add('button_active');
    this.active = true;
};

SwitchButton.prototype._deactivate = function () {
    this.elem.classList.remove('button_active');
    this.active = false;
};

SwitchButton.prototype.setImageId = function (imageId) {
    this.data = imageId;
};

for (let key in eventMixin)
    SwitchButton.prototype[key] = eventMixin[key];

module.exports = SwitchButton;