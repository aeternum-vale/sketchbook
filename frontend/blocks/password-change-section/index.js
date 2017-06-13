let eventMixin = require(LIBS + 'eventMixin');
let ClientError = require(LIBS + 'componentErrors').ClientError;

let PasswordChangeSection = function(options) {
    this.elem = options.elem;
    this.saveButton = this.elem.querySelector('.button');


    this.elem.onclick = e => {
        if (e.target !== this.saveButton) return;

        let errors = require(LIBS + 'checkUserData')
            .getErrorArray([{
                property: 'new',
                validator: 'password',
                alias: 'new password',
                value: this.elem['new'].value
            }, {
                property: 'new-again',
                validator: 'password-again',
                alias: 'new password',
                value: this.elem['new-again'].value,
                password: 'new'
            }]);

        if (errors.length === 0) {

        } else
            errors.forEach(item => {
                this.setPropertyError(item.property, item.message);
            });
    };
};

PasswordChangeSection.prototype.setPropertyError = function(property, message) {
    this.getErrorTextBox(property).textContent = message;
};


PasswordChangeSection.prototype.getErrorTextBox = function(fieldName) {
    return this.elem[fieldName].parentElement.querySelector('.textbox__error');
};


PasswordChangeSection.prototype.sendPassword = function(password) {
    let body = `password=${encodeURIComponent(password)}`;
    require(LIBS + 'sendRequest')(body, 'POST', '/settings', (err, response) => {
        if (err) {
            this.error(err);
            return;
        }

        this.trigger('uploaded');
    });
};

for (let key in eventMixin) {
    PasswordChangeSection.prototype[key] = eventMixin[key];
}

module.exports = PasswordChangeSection;
