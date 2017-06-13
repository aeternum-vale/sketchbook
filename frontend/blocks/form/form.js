let eventMixin = require(LIBS + 'eventMixin');
let ClientError = require(LIBS + 'componentErrors').ClientError;

let Form = function(options) {
    this.elem = options.elem;
    this.fields = null;
};

Form.prototype.setPropertyError = function(property, message) {
    this.getErrorBox(property).textContent = message;
};

Form.prototype.getErrorBox = function(fieldName) {
    return this.elem[fieldName].parentElement.querySelector('.textbox__error');
};

Form.prototype.getOptionsObj = function() {
	let options = [];

    for (let key in this.fields) {
        let chunk = this.fields[key];
        chunk.value = this.elem[chunk.property].value
        options.push(chunk);
    }

	return options;
};

Form.prototype.clearErrorBoxes = function() {
	this.fields.forEach(item => {
		this.getErrorBox(item.name).textContent = '';
	});
};


for (let key in eventMixin) {
    Form.prototype[key] = eventMixin[key];
}

module.exports = Form;
