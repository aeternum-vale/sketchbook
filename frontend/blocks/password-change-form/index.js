let Form = require(BLOCKS + 'form');

let PasswordChangeForm = function(options) {
    Form.apply(this, arguments);

    this.fields = {

        'old-password': {
            validator: 'non-empty',
            alias: 'old password',
        },

        'new-password': {
            validator: 'password',
            alias: 'new password',
        },

        'new-again': {
            validator: 'password-again',
            alias: 'new password',
            password: 'new-password',
            extra: true
        }

    };

    this.url = '/settings';

};
PasswordChangeForm.prototype = Object.create(Form.prototype);
PasswordChangeForm.prototype.constructor = PasswordChangeForm;


module.exports = PasswordChangeForm;
