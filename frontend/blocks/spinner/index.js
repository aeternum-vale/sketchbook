let Spinner = function (options) {
    this.elem = document.getElementById('spinner');
};

Spinner.innerHtml = `<div id="spinner" class="spinner"></div>`; //TODO МОЖЕТ БЫТЬ ВСЕ РАЗМЕТКИ ДОЛЖНЫ БЫТЬ СТАТИЧНЫМИ ?

Spinner.prototype.show = function () {
    this.elem.classList.remove('spinner_invisible');
};

Spinner.prototype.hide = function () {
    this.elem.classList.add('spinner_invisible');
};

module.exports = Spinner;