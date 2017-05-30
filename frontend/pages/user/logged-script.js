let FilePicker = require(BLOCKS + 'file-picker');
let uploadImageFilePicker = new FilePicker({
	elem: document.getElementById('upload-image-fp')
});

let uploadWindowCaller = document.getElementById('upload-window-caller');
let uploadButton = document.getElementById('upload-button');

let imageDescription = document.getElementById('upload_description');

let backdrop = document.getElementsByClassName('backdrop')[0];
let uploadWindowWrapper = document.getElementsByClassName('upload-window-wrapper')[0];


let galleryWrapper = document.getElementsByClassName('gallery__wrapper')[0];
let imagePreviewGhost = document.getElementsByClassName('image-preview')[0];

let uploadErrorMessage = uploadWindowWrapper.querySelector('.window__error-message');
let publicationNumber = document.getElementById('publication-number');


uploadButton.onclick = function(e) {
	let file = uploadImageFilePicker.getFile();
	if (file)
		uploadImage(file, imageDescription.value);
};

function uploadImage(file, description) {

	var xhr = new XMLHttpRequest();
	xhr.upload.onprogress = event => {
		console.log(event.loaded + ' / ' + event.total);
	};

	xhr.onload = xhr.onerror = function() {
		if (this.status == 200) {
			let response = JSON.parse(this.responseText);
			console.log(response);
			if (response.success) {
				insertNewImagePreview(response.imageId, response.previewUrl);
				closeUploadDialog();
			} else if (response.message)
				uploadErrorMessage.textContent = response.message;
		} else
			console.log("error " + this.status);
	};

	xhr.open("POST", "/image", true);

	xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	//xhr.setRequestHeader('Content-Type', 'multipart/form-data');

	var formData = new FormData();
	formData.append("image", file);
	formData.append("description", description);

	xhr.send(formData);

}

function openUploadDialog() {
	clearUploadDialog();
	backdrop.classList.remove('backdrop_invisible');
	uploadWindowWrapper.classList.remove('upload-window-wrapper_invisible');
}

function closeUploadDialog() {
	backdrop.classList.add('backdrop_invisible');
	uploadWindowWrapper.classList.add('upload-window-wrapper_invisible');
}

function clearUploadDialog() {
	uploadImageFilePicker.clear();
	imageDescription.value = '';
	uploadErrorMessage.textContent = '';
}

if (uploadWindowCaller)
	uploadWindowCaller.onclick = function(e) {
		openUploadDialog();
	};

uploadWindowWrapper.onmousedown = function(e) {
	//e.preventDefault();
}

uploadWindowWrapper.onclick = function(e) {
	if (e.target !== uploadWindowWrapper) return;
	closeUploadDialog();
}


function insertNewImagePreview(imageId, previewUrl) {
	let newImagePreview = imagePreviewGhost.cloneNode(true);
	newImagePreview.classList.remove('image-preview_ghost');

	newImagePreview.href = `/image/${imageId}`;
	newImagePreview.style.backgroundImage = `url('/${previewUrl}')`;

	newImagePreview.querySelector('.image-preview__text')
		.textContent = '0 comments 0 likes';

	galleryWrapper.appendChild(newImagePreview);

	publicationNumber.textContent = +publicationNumber.textContent + 1;
}


//------

let subscribeButtonElem;
if (subscribeButtonElem = document.getElementById('subscribe-button')) {
	let SubscribeButton = require(BLOCKS + 'subscribe-button');
	let subscribeButton = new SubscribeButton({
		elem: subscribeButtonElem
	});

	let subscribersNumberElem = document.getElementById('subscribers-number');
	let subscribersNumber = +subscribersNumberElem.textContent;

	subscribeButton.on('change', function() {
		if (subscribeButton.checked)
			subscribersNumberElem.textContent = ++subscribersNumber;
		else
			subscribersNumberElem.textContent = --subscribersNumber;
	});
}