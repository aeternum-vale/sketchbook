let eventMixin = require(LIBS + 'eventMixin');
let FilePicker = require(BLOCKS + 'file-picker');

let ClientError = require(LIBS + 'componentErrors').ClientError;

let UploadAvatarSection = function (options) {
    this.elem = options.elem;
    this.uploadButton = this.elem.querySelector('.upload-avatar-section__upload-button');
    this.deleteButton = this.elem.querySelector('.upload-avatar-section__delete-button');
    this.filePicker = new FilePicker({
        elem: this.elem.querySelector('.file-picker')
    });

    this.avatar = this.elem.querySelector('.upload-avatar-section__avatar');

    this.elem.onclick = e => {

        if (e.target === this.uploadButton) {
            let file = this.filePicker.getFile();
            if (file)
                this.uploadAvatar(file);
        }

        if (e.target === this.deleteButton)
            this.deleteAvatar();
    }

};


UploadAvatarSection.prototype.deleteAvatar = function () {
    require(LIBS + 'sendRequest')(null, 'DELETE', '/avatar', (err, response) => {
        if (err) {
            this.error(err);
            return;
        }
        this.avatar.style.backgroundImage = '';
    });
};

UploadAvatarSection.prototype.uploadAvatar = function (file) {
    var formData = new FormData();
    formData.append("avatar", file);

    require(LIBS + 'sendFormData')("/avatar", formData, (err, response) => {
        if (err) {
            this.error(err);
            return;
        }
        console.log('done');

        this.avatar.style.backgroundImage = `url('${response.url}?${new Date().getTime()}')`;

    });
};

for (let key in eventMixin) {
    UploadAvatarSection.prototype[key] = eventMixin[key];
}

module.exports = UploadAvatarSection;