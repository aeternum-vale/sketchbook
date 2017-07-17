let eventMixin = require(LIBS + 'eventMixin');
let ClientError = require(LIBS + 'componentErrors').ClientError;
let MessageModalWindow = require(BLOCKS + 'message-modal-window');


let DescriptionAddSection = function (options) {
    this.elem = options.elem;
    this.saveButton = this.elem.querySelector('.button');
    this.textarea = this.elem.querySelector('.textarea textarea');

    this.elem.onclick = e => {
        if (e.target !== this.saveButton) return;
        let description = this.textarea.value;
        let errors = require(LIBS + 'checkUserData').getErrorArray({
            description
        });

        if (errors.length === 0)
            this.sendDescription(this.textarea.value);
        else
            this.error(new ClientError(errors[0].message));
    };
};


DescriptionAddSection.prototype.sendDescription = function (description) {
    require(LIBS + 'sendRequest')({
        description
    }, 'POST', '/settings', (err, response) => {
        if (err) {
            this.error(err);
            return;
        }

        let messageModalWindow = new MessageModalWindow({message: 'Description has been successfully changed'});
        messageModalWindow.show();
    });
};

for (let key in eventMixin) {
    DescriptionAddSection.prototype[key] = eventMixin[key];
}

module.exports = DescriptionAddSection;
