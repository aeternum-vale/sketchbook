let ModalWindow = require(BLOCKS + 'modal-window');
let FilePicker = require(BLOCKS + 'file-picker');
let ClientError = require(LIBS + 'componentErrors').ClientError;


let UploadImageModalWindow = function (options) {
    ModalWindow.apply(this, arguments);
};
UploadImageModalWindow.prototype = Object.create(ModalWindow.prototype);
UploadImageModalWindow.prototype.constructor = UploadImageModalWindow;


UploadImageModalWindow.prototype.setElem = function () {
    this.elem = document.getElementById('upload-image-modal-window');
    if (!this.elem)
        this.elem = this.renderWindow(this.wrapper, require(`html-loader!./window`));

    this.uploadButton = this.elem.querySelector('.upload-image-modal-window__button');

    this.uploadImageFilePicker = new FilePicker({
        elem: this.elem.querySelector('.file-picker')
    });

    this.imageDescription = this.elem.querySelector('textarea.textbox__field');
    this.uploadErrorMessage = this.elem.querySelector('.window__error-message');

    this.elem.onclick = e => {
        if (e.target === this.uploadButton) {
            let file = this.uploadImageFilePicker.getFile();
            if (file)
                this.uploadImage(file, this.imageDescription.value);
        }
    };

    this.setListeners();
};

UploadImageModalWindow.prototype.uploadImage = function (file, description) {
    var formData = new FormData();
    formData.append("image", file);
    formData.append("description", description);

    require(LIBS + 'sendFormData')("/image", formData, (err, response) => {

        if (err) {
            if (err instanceof ClientError)
                this.setError(err.message);
            else
                this.error(err);
            return;
        }

        this.trigger('upload-image-modal-window__image-uploaded', {
            imageId: response.imageId,
            previewUrl: response.previewUrl
        });
        this.deactivate();

    });
};

UploadImageModalWindow.prototype.show = function () {
    ModalWindow.prototype.show.apply(this);

    if (!this.elem)
        this.setElem();

    this.clear();

    this.elem.classList.remove('window_invisible');
};

UploadImageModalWindow.prototype.deactivate = function () {
    this.elem.classList.add('window_invisible');
    ModalWindow.prototype.deactivate.apply(this);
};

UploadImageModalWindow.prototype.clear = function () {
    this.uploadImageFilePicker.clear();
    this.imageDescription.value = '';
    this.setError('');
};

UploadImageModalWindow.prototype.setError = function (error) {
    this.uploadErrorMessage.textContent = error;
};

module.exports = UploadImageModalWindow;
