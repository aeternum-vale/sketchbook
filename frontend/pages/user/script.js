"use strict";

import './style.less';

let Dropdown = require(BLOCKS + 'dropdown');

let linksDropdown = new Dropdown({
    elem: document.getElementById('links-dropdown'),
    className: 'links-dropdown'
});

let uploadImageModalWindowCaller;
let uploadImageModalWindow;

if (uploadImageModalWindowCaller = document.getElementById('upload-window-caller')) {
    uploadImageModalWindowCaller.onclick = function () {
        if (!uploadImageModalWindow) {
            require.ensure([BLOCKS + 'upload-image-modal-window'], function (require) {
                let UploadImageModalWindow = require(BLOCKS + 'upload-image-modal-window');
                uploadImageModalWindow = new UploadImageModalWindow();

                uploadImageModalWindow.on('upload-image-modal-window__image-uploaded', e => {
                    if (gallery)
                        gallery.insertNewImagePreview(e.detail.imageId, e.detail.previewUrl);
                    else {
                        createGallery().then(() => {
                            gallery.insertNewImagePreview(e.detail.imageId, e.detail.previewUrl);
                        });
                    }
                });

                uploadImageModalWindow.activate();
            });
        } else
            uploadImageModalWindow.activate();
    };
}

let gallery;
let galleryElem = document.getElementById('gallery');
galleryElem.onclick = function (e) {
    if (!e.target.matches('.image-preview')) return;
    e.preventDefault();
    createGallery().then(() => {
        gallery.onGalleryClick(e);
    });
};

function createGallery() {
    return new Promise((resolve, reject) => {
        require.ensure([BLOCKS + 'gallery'], function (require) {
            let Gallery = require(BLOCKS + 'gallery');
            gallery = new Gallery({
                gallery: galleryElem,
                isLogged: window.isLogged,
                preloadEntityCount: PRELOAD_IMAGE_COUNT,
                isEmbedded: true,
                publicationNumberElem: document.getElementById('publication-number')
            });
            resolve();
        });

    });
}

let PromptWindow = require(BLOCKS + 'prompt-window');

setTimeout(() => {
    let prompt = new PromptWindow();
    prompt.activate();

}, 2000);


require(LIBS + 'setGlobalErrorCatcher')();
