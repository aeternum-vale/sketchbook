"use strict";

import './style.less';

let Dropdown = require(BLOCKS + 'dropdown');
let Gallery = require(BLOCKS + 'gallery');

let linksDropdown = new Dropdown({
	elem: document.getElementById('links-dropdown'),
	className: 'links-dropdown'
});


let gallery = new Gallery({
	elem: document.getElementById('gallery'),
	isLogged: window.isLogged,
	preloadEntityCount: PRELOAD_IMAGE_COUNT,
	isEmbedded: true,
	publicationNumberElem: document.getElementById('publication-number')
});


window.addEventListener('resize', e => {
	gallery.resizeImage();
});

let UploadImageModalWindow = require(BLOCKS + 'upload-image-modal-window');
let uploadImageModalWindow = new UploadImageModalWindow();
let uploadWindowCaller;

if (uploadWindowCaller = document.getElementById('upload-window-caller')) {
	uploadWindowCaller.onclick = function() {
		uploadImageModalWindow.activate();
	};
}

uploadImageModalWindow.on('upload-image-modal-window__image-uploaded', e => {
	gallery.insertNewImagePreview(e.detail.imageId, e.detail.previewUrl);
});







require(LIBS + 'setGlobalErrorCatcher')();
