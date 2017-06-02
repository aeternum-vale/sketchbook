let UploadImageModalWindow = require(BLOCKS + 'upload-image-modal-window');

let galleryWrapper = document.getElementsByClassName('gallery__wrapper')[0];
let imagePreviewGhost = document.getElementsByClassName('image-preview')[0];
let publicationNumber = document.getElementById('publication-number');
let subscribeButtonElem;
let uploadWindowCaller;

if (uploadWindowCaller = document.getElementById('upload-window-caller')) {
	uploadWindowCaller.onclick = function() {
		uploadImageModalWindow.activate();
	};
}

let uploadImageModalWindow = new UploadImageModalWindow();

uploadImageModalWindow.on('uploaded', e => {
	insertNewImagePreview(e.detail.imageId, e.detail.previewUrl);
});


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