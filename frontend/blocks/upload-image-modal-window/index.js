let ModalWindow = require(BLOCKS + 'modal-window');
let FilePicker = require(BLOCKS + 'file-picker');


let UploadImageModalWindow = function(options) {
	ModalWindow.apply(this, arguments);

	this.uploadButton = this.elem.querySelector('.upload-image-button');

	this.uploadImageFilePicker = new FilePicker({
		elem: this.elem.querySelector('.file-picker')
	});

	this.imageDescription = this.elem.querySelector('.window__textarea');
	this.uploadErrorMessage = this.elem.querySelector('.window__error-message');


	this.elem.onclick = e => {
		if (e.target === this.uploadButton) {
			let file = this.uploadImageFilePicker.getFile();
			if (file)
				this.uploadImage(file, this.imageDescription.value);
			return;
		}
	};

};
UploadImageModalWindow.prototype = Object.create(ModalWindow.prototype);
UploadImageModalWindow.prototype.constructor = UploadImageModalWindow;



UploadImageModalWindow.prototype.uploadImage = function(file, description) {
	var xhr = new XMLHttpRequest();
	let self = this;

	xhr.upload.onprogress = event => {
		//console.log(event.loaded + ' / ' + event.total);
	};

	xhr.onload = xhr.onerror = function () {
		if (this.status == 200) {
			let response = JSON.parse(this.responseText);
			if (response.success) {
				self.trigger('uploaded', {
					imageId: response.imageId,
					previewUrl: response.previewUrl
				});
				self.deactivate();
			} else
			if (response.message)
				self.setError(response.message);
			else
				self.trigger('error');
		} else
			self.trigger('error');
	};

	xhr.open("POST", "/image", true);
	xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	var formData = new FormData();
	formData.append("image", file);
	formData.append("description", description);
	xhr.send(formData);
};

UploadImageModalWindow.prototype.activate = function() {
	this.clear();
	ModalWindow.prototype.activate.apply(this);
};

UploadImageModalWindow.prototype.clear = function() {
	this.uploadImageFilePicker.clear();
	this.imageDescription.value = '';
	this.setError('');
};

UploadImageModalWindow.prototype.setError = function(error) {
	this.uploadErrorMessage.textContent = error;
};


module.exports = UploadImageModalWindow;