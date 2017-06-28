"use strict";

import './style.less';

let Dropdown = require(BLOCKS + 'dropdown');
let UploadImageModalWindow = require(BLOCKS + 'upload-image-modal-window');

let linksDropdown = new Dropdown({
    elem: document.getElementById('links-dropdown'),
    className: 'links-dropdown'
});


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

let galleryElem = document.getElementById('gallery');
galleryElem.onclick = function(e) {
    if (!e.target.matches('.image-preview')) return;
    e.preventDefault();
    let imageId = +e.target.dataset.id;

    require.ensure([BLOCKS + 'gallery'], function(require) {
        let Gallery = require(BLOCKS + 'gallery');
        let gallery = new Gallery({
            elem: galleryElem,
            isLogged: window.isLogged,
            preloadEntityCount: PRELOAD_IMAGE_COUNT,
            isEmbedded: true,
            publicationNumberElem: document.getElementById('publication-number')
        });

        gallery.onElemClick(e);
    });
};

require(LIBS + 'setGlobalErrorCatcher')();
