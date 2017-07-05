let eventMixin = require(LIBS + 'eventMixin');
let PromptWindow = require(BLOCKS + 'prompt-window');
let MessageModalWindow = require(BLOCKS + 'message-modal-window');

let DeleteImageButton = function(options) {
    this.elem = options.elem;
    this.imageId = options.imageId;

    let _imageId = null;

    this.prompt = new PromptWindow({
        message: 'Are you sure you want to delete this image? All the likes and comments will be permanently lost.'
    });

    this.successMessage = new MessageModalWindow({
        message: 'Image has been successfully deleted'
    });

    this.successMessage.on('modal-window_deactivated', e => {
        this.trigger('delete-image-button_image-deleted', {
            url: this.url,
            imageId: this.imageId
        });
    });

    this.prompt.on('prompt_accepted', e => {
        require(LIBS + 'sendRequest')({
            id: _imageId
        }, 'DELETE', '/image', (err, response) => {
            if (err) {
                this.error(err);
                return;
            }
            this.url = response.url;
            this.successMessage.activate();
        });
    });

    this.elem.onclick = e => {
        this.prompt.activate();
        _imageId = this.imageId;
    };
};

DeleteImageButton.prototype.setImageId = function(id) {
    this.imageId = id;
};

for (let key in eventMixin)
    DeleteImageButton.prototype[key] = eventMixin[key];

module.exports = DeleteImageButton;
