let Dropdown = function (options) {

    this.elem = options.elem;
    this.itemList = this.elem.querySelector('.dropdown__item-list');
    this.className = options.className;

    this.active = false;

    // this.elem.onclick = e => {
    //     this.toggle();
    // };

    document.body.addEventListener('click', e => {

        if (!this.itemList.contains(e.target)) {
            if (this.elem.contains(e.target))
                this.toggle();
            else if (this.active)
                this.deactivate();
        }

    }, false);


    this.AEHandler = this.AEHandler.bind(this);

};

Dropdown.prototype.show = function () {
    this.elem.classList.remove('dropdown_invisible');
    this.elem.classList.add(`${this.className}_active`);
    this.active = true;
};

Dropdown.prototype.deactivate = function () {
    this.itemList.addEventListener('animationend', this.AEHandler, false);
    this.elem.classList.add('dropdown_fading-out');
};

Dropdown.prototype.AEHandler = function () {
    this.elem.classList.remove('dropdown_fading-out');
    this.elem.classList.add('dropdown_invisible');
    this.elem.classList.remove(`${this.className}_active`);
    this.active = false;
    this.itemList.removeEventListener('animationend', this.AEHandler);
};

Dropdown.prototype.toggle = function () {
    if (this.active)
        this.deactivate();
    else
        this.show();
};

module.exports = Dropdown;