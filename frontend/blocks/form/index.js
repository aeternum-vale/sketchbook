let eventMixin = require(LIBS + 'eventMixin');
let getErrorArray = require(LIBS + 'checkUserData').getErrorArray;
let ClientError = require(LIBS + 'componentErrors').ClientError;

let Form = function(options) {
    this.elem = options.elem;
    this.fields = options.fields;
    this.url = options.url;
    this.isAvailable = true;

    this.saveButton = this.elem.querySelector('.save-button');

    this.elem.onclick = e => {
        if (!this.isAvailable) return;

        if (e.target !== this.saveButton) return;

        this.clearErrorBoxes();
        let errors = this.getErrors();
        if (errors.length === 0)
            this.send(this.getBody());
        else
            this.setErrors(errors);
    };
};

Form.prototype.setPropertyError = function(property, message) {
    this.getErrorBox(property).textContent = message;
};

Form.prototype.getErrorBox = function(fieldName) {
    return this.elem[fieldName].parentElement.querySelector('.textbox__error');
};

Form.prototype.setAvailable = function(isAvailable) {
    this.isAvailable = isAvailable;
};

Form.prototype.getDataObj = function() {
    let options = [];

    for (let key in this.fields) {
        let chunk = this.fields[key];
        if (!chunk.noValidation) {
            if (!chunk.property)
                chunk.property = key;
            chunk.value = this.elem[key].value;
            options.push(chunk);
        }
    }

    return options;
};

Form.prototype.send = function(body) {
    require(LIBS + 'sendRequest')(body, 'POST', this.url, (err, response) => {
        if (err) {
            if (err instanceof ClientError && err.detail)
                this.setPropertyError(err.detail.property, err.message);
            else
                this.error(err);
            return;
        }

        this.clear();
        this.trigger('form_sent', {
            response
        });
    });
};


Form.prototype.clearErrorBoxes = function() {
    for (let key in this.fields)
        this.getErrorBox(key).textContent = '';
};

Form.prototype.clear = function() {
    this.clearErrorBoxes();
    for (let key in this.fields)
        this.elem[key].value = '';
};

Form.prototype.getErrors = function() {
    return getErrorArray(this.getDataObj());
};


Form.prototype.setErrors = function(errors) {
    this.clearErrorBoxes();
    for (let i = 0; i < errors.length; i++)
        if (this.getErrorBox(errors[i].property).textContent == '')
            this.setPropertyError(errors[i].property, errors[i].message);
};

Form.prototype.getBody = function() {
    let body = '';

    for (let key in this.fields)
        if (!this.fields[key].extra)
            body += (body === '' ? '' : '&') +
            key + '=' + encodeURIComponent(this.elem[key].value);
    return body;
};

for (let key in eventMixin) {
    Form.prototype[key] = eventMixin[key];
}

module.exports = Form;
