"use strict";

import './style.less';

let Dropdown = require(BLOCKS + 'dropdown');

let linksDropdown = new Dropdown({
    elem: document.getElementById('links-dropdown'),
    className: 'links-dropdown'
});

let uploadWindowCaller;
let uploadImageModalWindow;

if (uploadWindowCaller = document.getElementById('upload-window-caller')) {
    uploadWindowCaller.onclick = function () {
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
    let imageId = +e.target.dataset.id;
    createGallery().then(() => {
        gallery.onElemClick(e);
    });
};

function createGallery() {
    return new Promise((resolve, reject) => {
        require.ensure([BLOCKS + 'gallery'], function (require) {
            let Gallery = require(BLOCKS + 'gallery');
            gallery = new Gallery({
                elem: galleryElem,
                isLogged: window.isLogged,
                preloadEntityCount: PRELOAD_IMAGE_COUNT,
                isEmbedded: true,
                publicationNumberElem: document.getElementById('publication-number')
            });
            resolve();
        });

    });
}

require(LIBS + 'setGlobalErrorCatcher')();
