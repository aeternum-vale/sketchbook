const DEFAULT_FN_LENGTH = 23;
const DEFAULT_VALUE = 'no file chosen';

module.exports = function(id, fileNameLength) {
	fileNameLength = fileNameLength || DEFAULT_FN_LENGTH;

	let uploadInput = document.createElement('input');
	uploadInput.type = "file";
	uploadInput.accept = "image/*";

	let filePicker = document.getElementById(id);
	let fpButton = filePicker.querySelector('.file-picker__button');
	let fpFileName = filePicker.querySelector('.file-picker__filename');

	fpButton.addEventListener('click', e => {
		uploadInput.click();
	});

	uploadInput.addEventListener('change', e => {
		
		let filename = uploadInput.value.substring(uploadInput.value.lastIndexOf('\\') + 1);

		let visibleFileName;
		let partSize = ~~((fileNameLength - 1) / 2);

		if (filename.length === 0)
			visibleFileName = DEFAULT_VALUE;
		else if (filename.length <= fileNameLength) {
			fpFileName.title = '';
			visibleFileName = filename;
		} else {
			fpFileName.title = filename;
			visibleFileName = filename.slice(0, partSize) + '…' + filename.slice(-partSize);
		}

		fpFileName.textContent = visibleFileName;

	});

	this.getFile = function() {
		return uploadInput.files[0];
	};

	this.clear = function() {
		fpFileName.textContent = DEFAULT_VALUE;
	}

};