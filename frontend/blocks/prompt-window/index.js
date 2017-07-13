let MessageModalWindow = require(BLOCKS + 'message-modal-window');

let PromptWindow = function (options) {
    MessageModalWindow.apply(this, arguments);

    this.elemId = 'prompt-window';
    this.caption = options && options.caption || 'decide';
    this.message = options && options.message || 'Are you sure?';

};
PromptWindow.prototype = Object.create(MessageModalWindow.prototype);
PromptWindow.prototype.constructor = PromptWindow;

PromptWindow.prototype.setWindowInnerHtml = function () {
    this.windowInnerHtml =
        `<div class='window window_invisible modal-window message-modal-window prompt-window' id='prompt'>
            <div class="header window__header">
            </div>
        
            <div class="panel window__panel">
                <div class="message-modal-window__message">
                </div>
        
                <div class="prompt-window__buttons">
                    <div class="button prompt-window__button prompt-window__yes">yes</div>
                    <div class="button prompt-window__button prompt-window__no">no</div>
                </div>
            </div>
        </div>`;
};



PromptWindow.prototype.setElem = function () {
    MessageModalWindow.prototype.setElem.apply(this, arguments);

    this.elem.onclick = e => {
        if (!e.target.matches('.prompt-window__button')) return;

        if (e.target.matches('.prompt-window__yes'))
            this.trigger('prompt_accepted');

        this.deactivate();
    };
};

module.exports = PromptWindow;
