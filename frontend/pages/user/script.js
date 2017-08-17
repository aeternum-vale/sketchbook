"use strict";

import './style.less';

let GlobalErrorHandler = require(BLOCKS + 'global-error-handler');
let globalErrorHandler = new GlobalErrorHandler();

let ClientError = require(LIBS + 'componentErrors').ClientError;
let Dropdown = require(BLOCKS + 'dropdown');
let Modal = require(BLOCKS + 'modal');
let ModalSpinner = require(BLOCKS + 'modal-spinner');
let eventMixin = require(LIBS + 'eventMixin');


// let linksDropdown = new Dropdown({
//     elem: document.getElementById('links-dropdown'),
//     className: 'links-dropdown'
// });

let subscribeButtonElem;
let subscribeButton;

if (subscribeButtonElem = document.getElementById('subscribe-button')) {
    if (window.isLogged) {
        require.ensure([BLOCKS + 'subscribe-button'], function (require) {
            let SubscribeButton = require(BLOCKS + 'subscribe-button');
            subscribeButton = new SubscribeButton({
                elem: subscribeButtonElem,
                counterElem: document.getElementById('subscribers-number')
            });
        });
    } else
        subscribeButtonElem.onclick = e => {
            globalErrorHandler.call(new ClientError(null, null, 401));
        };
}


let uploadImageModalWindowCaller;
let uploadImageModalWindow;
if (uploadImageModalWindowCaller = document.getElementById('upload-window-caller')) {
    uploadImageModalWindowCaller.onclick = function () {
        if (!uploadImageModalWindow) {

            let spinner = new ModalSpinner({
                status: Modal.statuses.MAJOR
            });
            spinner.activate();
            require.ensure([BLOCKS + 'upload-image-modal-window'],
                function (require) {
                    let UploadImageModalWindow = require(BLOCKS +
                        'upload-image-modal-window');
                    uploadImageModalWindow = new UploadImageModalWindow();

                    uploadImageModalWindow.on('upload-image-modal-window__image-uploaded',
                        e => {
                            if (gallery)
                                gallery.insertNewImagePreview(e.detail.imageId,
                                    e.detail.previewUrl);
                            else {
                                createGallery().then(() => {
                                    gallery.insertNewImagePreview(e.detail.imageId,
                                        e.detail.previewUrl);
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
    let target;
    if (!(target = e.target.closest('.image-preview'))) return;

    let spinner = new ModalSpinner({
        status: Modal.statuses.MAJOR
    });
    spinner.activate();

    e.preventDefault();

    let imageId = +target.dataset.id;
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
                publicationNumberElem: document.getElementById('publication-number'),
                userSubscribeButton: subscribeButton
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


if (window.isLogged) {
    let userMenuDropdown = new Dropdown({
        elem: document.getElementById('user-menu'),
        className: 'header-element'
    });
}



