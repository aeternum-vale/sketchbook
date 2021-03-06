let eventMixin = require(LIBS + 'eventMixin');
let ClientError = require(LIBS + 'componentErrors').ClientError;
let ImageNotFound = require(LIBS + 'componentErrors').ImageNotFound;
let Modal = require(BLOCKS + 'modal');
let SwitchButton = require(BLOCKS + 'switch-button');
let getCorrectNounForm = require(LIBS + 'getCorrectNounForm');

let Gallery = function (options) {
    Modal.apply(this, arguments);
    this.status = Modal.statuses.MAJOR;

    this.gallery = options.gallery;
    this.elem = options.elem;
    this.isLogged = options.isLogged;
    this.preloadEntityCount = options.preloadEntityCount;
    this.isFeed = options.isFeed || false;
    this.userSubscribeButton = options.userSubscribeButton;

    this.viewModels = {};
    this.galleryArray = null;
    this.currentImageId = null;

    this.loggedUserViewModel = null;
    this.isEmbedded = !!this.gallery;
    this.preloadedImages = {};

    Object.defineProperty(this, 'currentViewModel', {
        get: () => this.viewModels[this.currentImageId]
    });


    for (let i = 1; i <= this.preloadEntityCount; i++) {
        this.preloadedImages[i] = new Image();
        this.preloadedImages[-i] = new Image();
    }

    window.addEventListener('popstate', e => {
        this.onPopState(e.state);
    }, false);

    window.addEventListener('resize', e => {
        this.onResize();
    });


    this.pushGalleryState();

    if (this.isEmbedded)
        this.setGallery(options);
    else
        this.show(+this.elem.dataset.id).catch((err) => {
            this.error(err);
        });
};

Gallery.prototype = Object.create(Modal.prototype);
Gallery.prototype.constructor = Gallery;

Gallery.prototype.onResize = function () {
    // const GLOBAL_SMALL_SCREEN_WIDTH = 700;
    // if (document.documentElement.clientWidth <= GLOBAL_SMALL_SCREEN_WIDTH)
    //     this.elem.classList.add('image_small');
    // else
    //     this.elem.classList.remove('image_small');
    //
    // this.resizeImage();
    this.commentSection && this.commentSection.update();
};

Gallery.prototype.onGalleryClick = function (e) {
    let target;
    if (!(target = e.target.closest('.image-preview'))) return;

    e.preventDefault();
    let imageId = +target.dataset.id;

    return this.activate({imageId});
};


Gallery.prototype.setGallery = function (options) {
    this.publicationsStatElem = options.publicationsStatElem;
    this.imagePreviewGhost = this.gallery.querySelector('.image-preview');
    this.galleryWrapper = this.gallery.querySelector('.gallery__wrapper');

    this.gallery.onclick = e => {
        this.onGalleryClick(e);
    };
};

//TODO ALERT IF IT DOESN'T ABLE TO DOWNLOAD MODAL MESSAGE WINDOW

Gallery.prototype.setElem = function () {

    return new Promise((resolve, reject) => {


        this.isElemSetted = true;

        if (!this.elem)
            this.elem = this.renderWindow(require(`html-loader!./window`));

        this.setListeners();

        this.imgElem = this.elem.querySelector('img.image__img-element');
        this.description = this.elem.querySelector('.image__description');
        this.date = this.elem.querySelector('.image__post-date');
        this.imageWrapper = this.elem.querySelector('.image__image-wrapper');
        this.sideBar = this.elem.querySelector('.image__sidebar');
        this.deleteButtonElem = this.elem.querySelector('.image__delete-button');
        this.subscribeButtonElem = this.elem.querySelector('.image__subscribe-button');
        this.avatar = this.elem.querySelector('.image__avatar');
        this.username = this.elem.querySelector('.image__username');
        this.headerLeftSide = this.elem.querySelector('.image__header-left-side');
        this.fullscreenButton = this.elem.querySelector('.image__control-full');


        this.imgElem.onload = e => {
            this.resizeImage();
            this.showImgElem();
        };

        this.elem.onclick = e => {

            this.onElemClick(e);

            if (e.target.matches('.image__modal-close-button-wrapper'))
                this.deactivate();

            if (e.target.matches('.image__control-prev'))
                this.switchToPrev();

            if (e.target.matches('.image__control-next'))
                this.switchToNext();

            if (e.target === this.fullscreenButton)
                this.switchFullscreen();

            if (e.target.matches('.image__close-space') || e.target.matches('.image__close-button'))
                this.deactivate();
        };


        let CommentSection = require(BLOCKS + 'image-comment-section');
        let LikeButton = require(BLOCKS + 'like-button');

        this.commentSection = new CommentSection({
            elem: this.elem.querySelector('.comment-section'),
            commentSenderElem: this.elem.querySelector('.comment-send'),
            imageId: this.currentImageId,
            loggedUserViewModel: this.loggedUserViewModel,

            commentSectionWrapper: this.elem.querySelector('.image__comment-section-wrapper'),
            infoBoard: this.elem.querySelector('.image__info-board'),
            scrollbarWrapper: this.elem.querySelector('.image__comment-section-scrollbar-wrapper')
        });

        this.commentSection.on('comment-section_changed', e => {
            let imageId = e.detail.imageId;
            this.deleteViewModel(imageId);
            this.requestViewModel(imageId).then(() => {
                this.updateComments(imageId);
            });
        });

        this.likeButton = new LikeButton({
            elem: this.elem.querySelector('.like-button'),
            data: this.currentImageId
        });

        this.likeButton.on('switch-button_changed', e => {
            let imageId = e.detail.imageId;
            this.deleteViewModel(imageId);
            this.requestViewModel(imageId).then(() => {
                this.updateLikes(imageId);
            });
        });

        this.onResize();

        if (this.isLogged) {
            if (this.currentViewModel.isOwnImage) {
                this.setDeleteButton();
                require.ensure([BLOCKS + 'delete-image-button'], require => {
                    let DeleteImageButton = require(BLOCKS + 'delete-image-button');
                    this.deleteButton = new DeleteImageButton({
                        elem: this.deleteButtonElem,
                        imageId: this.currentImageId
                    });
                    this.deleteButton.on('delete-image-button_image-deleted', e => {
                        let involvedImageId = e.detail.imageId;
                        this.deleteViewModel(involvedImageId);
                        this.removeFromGalleryArray(involvedImageId);
                        this.deleteImagePreview(involvedImageId);
                        if (this.currentImageId === involvedImageId)
                            this.switchToNext();
                    });
                    resolve();
                });
            } else {
                require.ensure([BLOCKS + 'subscribe-button'], require => {
                    let SubscribeButton = require(BLOCKS + 'subscribe-button');
                    this.subscribeButton = new SubscribeButton({
                        elem: this.subscribeButtonElem,
                        data: this.currentImageId
                    });

                    if (this.userSubscribeButton)
                        SwitchButton.setRelation(this.subscribeButton, this.userSubscribeButton);

                    this.subscribeButton.on('switch-button_changed', e => {
                        let involvedImageId = e.detail.imageId;

                        if (this.isFeed && involvedImageId === this.currentImageId)
                            this.viewModels = {};

                    });

                    this.setSubscribeButton();
                    this.subscribeButton.set({active: this.currentViewModel.author.isNarrator});
                    resolve();
                });
            }

        } else {
            this.subscribeButtonElem.onclick = e => {
                this.error(new ClientError(null, null, 401));
            };

            resolve();
        }

    });

};


Gallery.prototype.switchFullscreen = function () {

    function goFullscreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        }
    }

    function cancelFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
    }


    if (!this.isFullscreen) {
        goFullscreen(this.imageWrapper);
        this.isFullscreen = true;
        this.fullscreenButton.classList.remove('icon-arrow-maximise');
        this.fullscreenButton.classList.add('icon-arrow-minimise');

    } else {
        cancelFullscreen();
        this.isFullscreen = false;
        this.fullscreenButton.classList.add('icon-arrow-maximise');
        this.fullscreenButton.classList.remove('icon-arrow-minimise');
    }

};


Gallery.prototype.setDeleteButton = function () {
    this.deleteButtonElem.classList.remove('button_invisible');
    this.subscribeButtonElem.classList.add('button_invisible');
};

Gallery.prototype.setSubscribeButton = function () {
    this.subscribeButtonElem.classList.remove('button_invisible');
    this.deleteButtonElem.classList.add('button_invisible');
};

Gallery.prototype.updatePreloadedImagesArray = function () {
    for (let i = 1; i <= this.preloadEntityCount; i++) {
        let nextId = this.getNextImageId(i);
        let prevId = this.getNextImageId(-i);

        if (this.viewModels[nextId])
            this.preloadedImages[i].setAttribute('src', this.viewModels[nextId].imgUrl);
        if (this.viewModels[prevId])
            this.preloadedImages[-i].setAttribute('src', this.viewModels[prevId].imgUrl);
    }
};


Gallery.prototype.show = function (options) {

    document.body.style.overflow = 'hidden'; // :\


    let imageId;
    let noPushState;

    if (arguments.length === 1 && typeof arguments[0] === 'number') {
        imageId = arguments[0];
    } else {
        imageId = options && options.imageId;
        noPushState = options && options.noPushState || false;
    }

    return new Promise((resolve, reject) => {

        if (this.isEmbedded)
            Modal.prototype.show.apply(this);

        this.requestViewModel(imageId).then(() => {
            this.currentImageId = imageId;

            if (!this.isElemSetted)
                this.setElem().then(() => {

                    console.log(this.elem);
                    this.trigger('gallery_shown');

                    this.updateCurrentView(imageId);

                    this.elem.classList.remove('image_invisible');
                    if (!noPushState && imageId === this.currentImageId)
                        this.pushImageState();
                    resolve();
                    this.requestAllNecessaryViewModels().then(() => {
                        this.updatePreloadedImagesArray();
                    });
                });
            else {
                this.trigger('gallery_shown');
                this.updateCurrentView(imageId);

                this.elem.classList.remove('image_invisible');
                if (!noPushState && imageId === this.currentImageId)
                    this.pushImageState();
                resolve();
                this.requestAllNecessaryViewModels().then(() => {
                    this.updatePreloadedImagesArray();
                });
            }


            this.onResize();
        }).catch(err => {
            reject(err);
        });

    });
};

Gallery.prototype.hide = function (options) {

    document.body.style.overflow = 'auto';
    this.trigger('gallery_hided');


    let noPushState = options && options.noPushState;
    if (!this.isEmbedded)
        window.location = this.elem.dataset.authorUrl;
    else {
        Modal.prototype.hide.apply(this);

        this.elem.classList.add('image_invisible');

        if (!noPushState)
            this.pushGalleryState();
    }
};

Gallery.prototype.hideImgElem = function () {
    this.elem.classList.add('image_img-element-invisible');
};

Gallery.prototype.showImgElem = function () {
    this.elem.classList.remove('image_img-element-invisible');
};

Gallery.prototype.resizeImage = function () {
    // if (this.elem) {
    //
    //     this.imgElem.removeAttribute('width');
    //     this.imgElem.removeAttribute('height');
    //
    //     if (!this.elem.classList.contains('image_small')) {
    //
    //         if (this.imgElem.offsetWidth >= this.imgElem.offsetHeight) {
    //             if (this.imageWrapper.offsetHeight < this.imgElem.offsetHeight)
    //                 this.imgElem.height = this.imageWrapper.offsetHeight;
    //
    //             if (this.imageWrapper.offsetWidth > this.elem.offsetWidth) {
    //                 this.imgElem.removeAttribute('height');
    //                 this.imgElem.width = this.elem.offsetWidth - this.sideBar.offsetWidth;
    //             }
    //         } else {
    //             if (this.imageWrapper.offsetWidth > this.elem.offsetWidth)
    //                 this.imgElem.width = this.elem.offsetWidth - this.sideBar.offsetWidth;
    //
    //             if (this.imageWrapper.offsetHeight < this.imgElem.offsetHeight) {
    //                 this.imgElem.removeAttribute('width');
    //                 this.imgElem.height = this.imageWrapper.offsetHeight;
    //             }
    //         }
    //     } else {
    //         if (this.imageWrapper.offsetWidth > this.elem.offsetWidth) {
    //             this.imgElem.removeAttribute('height');
    //             this.imgElem.width = this.elem.offsetWidth;
    //         }
    //     }
    //
    //
    // }
};

Gallery.prototype.requestViewModel = function (id) {
    return new Promise((resolve, reject) => {

        if (this.viewModels[id]) {
            resolve();
            return;
        }

        let body = {
            id,
            isFeed: this.isFeed
        };

        if (this.isLogged && !this.loggedUserViewModel)
            body.requireUserViewModel = true;

        require(LIBS + 'sendRequest')(body, 'POST', '/gallery', (err, response) => {
            if (err) {
                if (err instanceof ClientError) {
                    if (this.galleryArray) {
                        this.removeFromGalleryArray(id);
                        this.updateGallery();
                    }
                    return reject(new ImageNotFound());
                }
                else
                    return this.error(err);
            }

            console.log(response);
            this.galleryArray = response.gallery;
            this.updateGallery();

            if (this.isLogged && !this.loggedUserViewModel && response.loggedUserViewModel)
                this.loggedUserViewModel = response.loggedUserViewModel;


            let provided = false;
            for (let key in response.viewModels) {
                if (key == id)
                    provided = true;

                this.viewModels[key] = response.viewModels[key];
            }
            if (provided)
                resolve(response);
            else {
                if (this.galleryArray) {
                    this.removeFromGalleryArray(id);
                    this.updateGallery();
                }
                reject(new ImageNotFound());
            }
        });
    });
};

Gallery.prototype.removeFromGalleryArray = function (id) {

    this.galleryArray && ~this.galleryArray.indexOf(id) &&
    this.galleryArray.splice(this.galleryArray.indexOf(id), 1);
};

Gallery.prototype.addToGalleryArray = function (id) {
    this.galleryArray && this.galleryArray.push(id);
};

Gallery.prototype.updateGallery = function () {
    if (this.galleryArray && this.gallery) {
        let imagePreviews = this.gallery.querySelectorAll('.image-preview');
        for (let i = 0; i < imagePreviews.length; i++) {
            if (!~this.galleryArray.indexOf(+imagePreviews[i].dataset.id))
                imagePreviews[i].remove();
        }
        this.setPublicationNumber(this.galleryArray.length);
    }
};

Gallery.prototype.getImagePreviewById = function (id) {
    return this.gallery.querySelector(`.image-preview[data-id="${id}"]`);
};

Gallery.prototype.updateImagePreviewText = function (id) {
    let likeAmount = this.viewModels[id].likes.length;
    let commentAmount = this.viewModels[id].comments.length;
    let previewImageElem = this.getImagePreviewById(id);
    previewImageElem.dataset.likeAmount = likeAmount;
    previewImageElem.dataset.commentAmount = commentAmount;

    previewImageElem.querySelector('.image-preview__comment-number').textContent = commentAmount;
    previewImageElem.querySelector('.image-preview__like-number').textContent = likeAmount;

    previewImageElem.querySelector('.image-preview__comment-section .image-preview__designation-text')
        .textContent = getCorrectNounForm('comment', commentAmount);
    previewImageElem.querySelector('.image-preview__like-section .image-preview__designation-text')
        .textContent = getCorrectNounForm('like', likeAmount);
};

Gallery.prototype.deleteImagePreview = function (id) {
    let elem = this.getImagePreviewById(id);
    if (elem) {
        elem.remove();
        this.setPublicationNumber(-1, true);
    }
};

Gallery.prototype.insertNewImagePreview = function (imageId, previewUrl) {
    let newImagePreview = this.imagePreviewGhost.cloneNode(true);
    newImagePreview.classList.remove('image-preview_ghost');

    newImagePreview.dataset.id = imageId;
    newImagePreview.href = `/image/${imageId}`;
    newImagePreview.querySelector('.image-preview__picture').style.backgroundImage = `url('/${previewUrl}')`;

    newImagePreview.querySelector('.image-preview__comment-number').textContent = 0;
    newImagePreview.querySelector('.image-preview__like-number').textContent = 0;

    newImagePreview.querySelector('.image-preview__comment-section .image-preview__designation-text')
        .textContent = 'comments';
    newImagePreview.querySelector('.image-preview__like-section .image-preview__designation-text')
        .textContent = 'likes';

    newImagePreview.querySelector('.image-preview__upload-date-text').textContent = 'a few seconds ago';

    this.galleryWrapper.appendChild(newImagePreview);

    this.setPublicationNumber(1, true);
    this.addToGalleryArray(imageId);
};

Gallery.prototype.setPublicationNumber = function (value, relative) {
    if (this.publicationsStatElem) {
        let publicationNumberElem = this.publicationsStatElem.querySelector('.stat__number');
        let publicationTextElem = this.publicationsStatElem.querySelector('.stat__caption');
        let newValue = (relative && publicationNumberElem) ? (+publicationNumberElem.textContent + value) : value;

        publicationNumberElem.textContent = newValue;
        publicationTextElem.textContent = getCorrectNounForm('publication', newValue);
    }
};

Gallery.prototype.deleteViewModel = function (id) {
    delete this.viewModels[id];
    console.log('delete #' + id);
};

Gallery.prototype.requestAllNecessaryViewModels = function () {
    return Promise.all([
        this.requestNextViewModels(),
        this.requestPrevViewModels()
    ]);
};

Gallery.prototype.requestNextViewModels = function () {

    if (this.galleryArray && this.galleryArray.length === 0)
        return Promise.reject(new ImageNotFound());

    let promises = [];
    for (let i = 0; i < this.preloadEntityCount; i++)
        promises.push(this.requestViewModel(this.getNextImageId(i)));
    return Promise.all(promises);
};

Gallery.prototype.requestPrevViewModels = function () {
    if (this.galleryArray && this.galleryArray.length === 0)
        return Promise.reject(new ImageNotFound());
    let promises = [];
    for (let i = 0; i < this.preloadEntityCount; i++)
        promises.push(this.requestViewModel(this.getPrevImageId(i)));
    return Promise.all(promises);
};

Gallery.prototype.switchToNext = function () {
    if (this.galleryArray && !this.galleryArray.length) {
        this.deactivate();
        return;
    }

    let nextImageId = this.getNextImageId();
    this.show(nextImageId).catch(err => {
        if (err instanceof ImageNotFound) {
            if (this.galleryArray && this.galleryArray.length)
                this.switchToNext();
            else
                this.deactivate();
        } else
            this.error(err);
    });
};

Gallery.prototype.switchToPrev = function () {

    if (this.galleryArray && !this.galleryArray.length) {
        this.deactivate();
        return;
    }

    let prevImageId = this.getPrevImageId();
    this.show(prevImageId).catch(err => {
        if (err instanceof ImageNotFound) {
            if (this.galleryArray && this.galleryArray.length)
                this.switchToPrev();
            else
                this.deactivate();
        } else
            this.error(err);
    });
};

Gallery.prototype.getNextImageId = function (offset) {
    offset = offset || 1;
    let index = this.galleryArray.indexOf(this.currentImageId);

    return this.galleryArray[(index + offset) % this.galleryArray.length];
};

Gallery.prototype.getPrevImageId = function (offset) {
    offset = offset || 1;

    let index = this.galleryArray.indexOf(this.currentImageId);

    if (~index && this.galleryArray.length === 1)
        return this.galleryArray[0];

    let galleryPrevIndex = index - offset;
    if (galleryPrevIndex < 0) {
        galleryPrevIndex %= this.galleryArray.length;
        galleryPrevIndex = this.galleryArray.length + galleryPrevIndex;
    }

    return this.galleryArray[galleryPrevIndex];
};

Gallery.prototype.updateCurrentView = function (involvedImageId) {

    if (involvedImageId === this.currentImageId) {
        this.hideImgElem();

        this.imgElem.setAttribute('src', this.currentViewModel.imgUrl);

        this.likeButton.setImageId(this.currentImageId);
        this.updateLikes(this.currentImageId);

        this.commentSection.setImageId(this.currentImageId);
        this.updateComments(this.currentImageId);

        this.description.textContent = this.currentViewModel.description;
        if (this.description.textContent === '')
            this.elem.classList.add('image_no-description');
        else
            this.elem.classList.remove('image_no-description');

        this.date.textContent = this.currentViewModel.createDateStr;

        if (this.isLogged)
            if (this.currentViewModel.isOwnImage)
                this.deleteButton.setImageId(this.currentImageId);
            else
                this.subscribeButton.setImageId(this.currentImageId);

        if (this.isFeed)
            this.subscribeButton.set({active: true});

        this.avatar.style.backgroundImage = `url('${this.currentViewModel.author.avatarUrls.medium}')`;
        this.username.textContent = this.currentViewModel.author.username;

        this.headerLeftSide.setAttribute('href', this.currentViewModel.author.url);


    }

};

Gallery.prototype.updateLikes = function (imageId) {
    if (this.currentImageId === imageId)
        this.likeButton.set({
            active: this.currentViewModel.isLiked,
            likeAmount: this.currentViewModel.likes.length
        });
    if (this.gallery)
        this.updateImagePreviewText(imageId);
};

Gallery.prototype.updateComments = function (imageId) {
    if (this.currentImageId === imageId)
        this.commentSection.set(this.currentViewModel.comments);
    if (this.gallery)
        this.updateImagePreviewText(imageId);
};

Gallery.prototype.pushImageState = function () {
    history.pushState({
        type: 'image',
        id: this.currentImageId
    }, 'image #' + this.currentImageId, '/image/' + this.currentImageId);
};

Gallery.prototype.pushGalleryState = function () {

    let url = '';
    if (!this.isFeed)
        url = this.currentViewModel && this.currentViewModel.author.url;
    else
        url = '/feed';

    history.pushState({
        type: 'gallery'
    }, '', url);
};

Gallery.prototype.onPopState = function (state) {

    if (state && state.type)
        switch (state.type) {
            case 'image':
                this.show({
                    imageId: state.id,
                    noPushState: true
                });
                break;

            case 'gallery':
                this.deactivate(null, {
                    noPushState: true
                });
                break;
        }
};

for (let key in eventMixin)
    Gallery.prototype[key] = eventMixin[key];

module.exports = Gallery;
