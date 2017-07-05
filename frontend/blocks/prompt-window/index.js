let MessageModalWindow = require(BLOCKS + 'message-modal-window');

let PromptWindow = function(options) {
    MessageModalWindow.apply(this, arguments);

    this.elemId = 'prompt-window';
    this.defaultCaption = options && options.defaultCaption || 'decide';
    this.defaultMessage = options && options.defaultMessage || 'Are you sure?';
};
PromptWindow.prototype = Object.create(MessageModalWindow.prototype);
PromptWindow.prototype.constructor = PromptWindow;

PromptWindow.prototype.setWindowInnerHtml = function() {
    this.windowInnerHtml = require(`html-loader!./window`);
};

PromptWindow.prototype.setElem = function() {
    MessageModalWindow.prototype.setElem.apply(this, arguments);

    this.elem.onclick = e => {
        if (!e.target.matches('.prompt-window__button')) return;

        if (e.target.matches('.prompt-window__yes'))
            this.trigger('prompt_accepted');

        this.deactivate();
    };
};

module.exports = PromptWindow;
