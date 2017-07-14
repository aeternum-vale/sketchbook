"use strict";

import './style.less';

let Dropdown = require(BLOCKS + 'dropdown');
let Modal = require(BLOCKS + 'modal');
let ModalSpinner = require(BLOCKS + 'modal-spinner');

let linksDropdown = new Dropdown({
    elem: document.getElementById('links-dropdown'),
    className: 'links-dropdown'
});

let uploadImageModalWindowCaller;
let uploadImageModalWindow;

if (uploadImageModalWindowCaller = document.getElementById('upload-window-caller')) {
    uploadImageModalWindowCaller.onclick = function () {

        if (!uploadImageModalWindow) {

            let spinner = new ModalSpinner({
                status: Modal.statuses.MAJOR
            });
            spinner.activate();

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

                spinner.onHostLoaded(uploadImageModalWindow);
            });
        } else
            uploadImageModalWindow.activate();
    };
}



let gallery;
let galleryElem = document.getElementById('gallery');
galleryElem.onclick = function (e) {
    let spinner = new ModalSpinner({
        status: Modal.statuses.MAJOR
    });
    spinner.activate();
    if (!e.target.matches('.image-preview')) return;
    e.preventDefault();

    let imageId = +e.target.dataset.id;
    createGallery().then(() => {
        spinner.onHostLoaded(gallery, {
            imageId
        });
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

//let messageModalWindow = require(BLOCKS + 'message-modal-window');
// let count = 0;
// setInterval(() => {
//     let message = new messageModalWindow({message: ++count});
//     message.activate();
//
// }, 5000);
//

require(LIBS + 'setGlobalErrorCatcher')();
