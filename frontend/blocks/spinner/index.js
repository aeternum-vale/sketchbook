let Spinner = function (options) {
    this.elem = document.getElementById('spinner');
};

Spinner.innerHtml = require(`html-loader!./markup`); //TODO МОЖЕТ БЫТЬ ВСЕ РАЗМЕТКИ ДОЛЖНЫ БЫТЬ СТАТИЧНЫМИ ?

Spinner.prototype.show = function () {
    this.elem.classList.remove('spinner_invisible');
};

Spinner.prototype.hide = function () {
    this.elem.classList.add('spinner_invisible');
};

module.exports = Spinner;