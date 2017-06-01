let Dropdown = function(options) {

	this.elem = options.elem;
	this.className = options.className;

	this.active = false;

	this.elem.onclick = e => {
		this.toggle();
	};

}

Dropdown.prototype.activate = function() {
	this.elem.classList.add('dropdown_active');
	this.elem.classList.add(`${this.className}_active`);
	this.active = true;
};

Dropdown.prototype.deactivate = function() {
	this.elem.classList.remove('dropdown_active');
	this.elem.classList.remove(`${this.className}_active`);
	this.active = false;
};

Dropdown.prototype.toggle = function() {
	if (this.active) 
		this.deactivate();
	else
		this.activate();
};

module.exports = Dropdown;