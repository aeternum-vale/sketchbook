const DEFAULT_FN_LENGTH = 23;
const DEFAULT_VALUE = 'no file chosen';


let FilePicker = function(options) {

	this.fileNameLength = options.fileNameLength || DEFAULT_FN_LENGTH;

	this.uploadInput = document.createElement('input');
	this.uploadInput.type = "file";
	this.uploadInput.accept = "image/*";

	this.elem = options.elem;
	this.fpButton = this.elem.querySelector('.file-picker__button');
	this.fpFileName = this.elem.querySelector('.file-picker__filename');

	this.fpButton.addEventListener('click', e => {
		this.uploadInput.click();
	});


	this.uploadInput.addEventListener('change', e => {
		this.setVisibleFileName();
	});

};

FilePicker.prototype.setVisibleFileName = function() {
	let filename = this.uploadInput.value.substring(this.uploadInput.value.lastIndexOf('\\') + 1);

	let visibleFileName;
	let partSize = ~~((this.fileNameLength - 1) / 2);

	if (filename.length === 0)
		visibleFileName = DEFAULT_VALUE;
	else if (filename.length <= this.fileNameLength) {
		this.fpFileName.title = '';
		visibleFileName = filename;
	} else {
		this.fpFileName.title = filename;
		visibleFileName = filename.slice(0, partSize) + '…' + filename.slice(-partSize);
	}

	this.fpFileName.textContent = visibleFileName;
};

FilePicker.prototype.getFile = function() {
	return this.uploadInput.files[0];
};

FilePicker.prototype.clear = function() {
	this.uploadInput.value = '';
	this.fpFileName.textContent = DEFAULT_VALUE;
}

module.exports = FilePicker;
