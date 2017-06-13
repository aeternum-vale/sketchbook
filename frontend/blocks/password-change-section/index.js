let eventMixin = require(LIBS + 'eventMixin');
let ClientError = require(LIBS + 'componentErrors').ClientError;

let PasswordChangeSection = function(options) {
    this.elem = options.elem;
    this.saveButton = this.elem.querySelector('.button');
    this.old = this.elem.old;
    this.new = this.elem.new;
    this.newAgain = this.elem['new-again'];

    this.elem.onclick = e => {
        if (e.target !== this.saveButton) return;

        let errors = require(LIBS + 'checkUserData')
            .getErrorArray({
                'password': this.new.value,
                'password-again': this.old.value
            });

        if (errors.length === 0) {

        } else
            this.error(new ClientError(errors[0].message));
        
    };
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
