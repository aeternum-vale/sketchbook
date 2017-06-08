let eventMixin = require(LIBS + 'eventMixin');
let FilePicker = require(BLOCKS + 'file-picker');

let ClientError = require(LIBS + 'componentErrors').ClientError;

let UploadAvatarSection = function(options) {
	this.elem = options.elem;
	this.uploadButton = this.elem.querySelector('.upload-avatar-section__upload-button');
	this.filePicker = new FilePicker({
		elem: this.elem.querySelector('.file-picker')
	});

	this.elem.onclick = e => {

		if (e.target === this.uploadButton) {

			let file = this.filePicker.getFile();
			if (file)
				this.uploadAvatar(file);
		}
	}

};


UploadAvatarSection.prototype.uploadAvatar = function(file) {
	var formData = new FormData();
	formData.append("avatar", file);

	require(LIBS + 'sendFormData')("/avatar", formData, (err, response) => {
		if (err) {
			this.error(err);
			return;
		}

		this.trigger('uploaded', {
			url: response.url
		});

	});
};

for (let key in eventMixin) {
	UploadAvatarSection.prototype[key] = eventMixin[key];
}


module.exports = UploadAvatarSection;