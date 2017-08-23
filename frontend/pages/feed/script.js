"use strict";

import './style.less';

let GlobalErrorHandler = require(BLOCKS + 'global-error-handler');
let globalErrorHandler = new GlobalErrorHandler();

let Dropdown = require(BLOCKS + 'dropdown');
let Modal = require(BLOCKS + 'modal');
let ModalSpinner = require(BLOCKS + 'modal-spinner');

let userMenuDropdown = new Dropdown({
	elem: document.getElementById('user-menu'),
	className: 'header-element'
});


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
                isFeed: true
            });
            resolve();
        });

    });
}


// let PromptWindow = require(BLOCKS + 'prompt-window');
// let prompt = new PromptWindow();
// prompt.activate();
