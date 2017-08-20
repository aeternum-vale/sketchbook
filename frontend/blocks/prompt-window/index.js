let MessageModalWindow = require(BLOCKS + 'message-modal-window');

let PromptWindow = function (options) {
    MessageModalWindow.apply(this, arguments);

    this.elemId = 'prompt-window';
    this.caption = options && options.caption || 'decide';
    this.message = options && options.message || 'Are you sure?';

};
PromptWindow.prototype = Object.create(MessageModalWindow.prototype);
PromptWindow.prototype.constructor = PromptWindow;

PromptWindow.prototype.setWindowHtml = function () {
    this.windowHtml = require(`html-loader!./window`);
};


PromptWindow.prototype.setElem = function () {
    MessageModalWindow.prototype.setElem.apply(this, arguments);

    this.elem.onclick = e => {
        this.onElemClick(e);

        if (!e.target.matches('.prompt-window__button')) return;

        if (e.target.matches('.prompt-window__yes'))
            this.trigger('prompt_accepted');

        this.deactivate();
    };
};

module.exports = PromptWindow;
