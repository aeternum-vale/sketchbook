let MessageModalWindow = require(BLOCKS + 'message-modal-window');

let PromptWindow = function() {
    MessageModalWindow.apply(this, arguments);
    this.defaultCaption = 'decide';
	this.defaultMessage = 'Are you sure?';
    this.elemId = 'prompt-window';

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
            this.trigger('accept');

        this.deactivate();
    };
};

module.exports = PromptWindow;
