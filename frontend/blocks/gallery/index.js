let eventMixin = require(LIBS + 'eventMixin');
let ClientError = require(LIBS + 'componentErrors').ClientError;
let ImageNotFound = require(LIBS + 'componentErrors').ImageNotFound;
let Modal = require(BLOCKS + 'modal');

let Gallery = function (options) {
    Modal.apply(this, arguments);
    this.status = Modal.statuses.MAJOR;


    this.gallery = options.gallery;
    this.elem = options.elem;

    this.isLogged = options.isLogged;

    this.preloadEntityCount = options.preloadEntityCount;

    this.viewModels = {};
    this.galleryArray = null;
    this.currentImageId = null;
    Object.defineProperty(this, 'currentViewModel', {
        get: () => this.viewModels[this.currentImageId]
    });

    this.preloadedImages = {};
    for (let i = 1; i <= this.preloadEntityCount; i++) {
        this.preloadedImages[i] = new Image();
        this.preloadedImages[-i] = new Image();
    }

    window.addEventListener('popstate', e => {
        this.onPopState(e.state);
    }, false);

    window.addEventListener('resize', e => {
        this.resizeImage();
    });

    this.pushUserState();


    this.isEmbedded = !!this.gallery;

    if (this.isEmbedded)
        this.setGallery(options);
    else {
        this.currentImageId = +this.elem.dataset.id;
        this.requestViewModel(this.currentImageId).then(() => {
            this.setElem().then(() => {
                this.pushImageState();

                this.requestAllNecessaryViewModels().then(() => {
                    this.updatePreloadedImagesArray();
                });

                this.activateImgElem();
            });
        }).catch((err) => {
            this.error(err);
        });
    }
};

Gallery.prototype = Object.create(Modal.prototype);
Gallery.prototype.constructor = Gallery;

Gallery.prototype.onGalleryClick = function (e) {
    if (!e.target.matches('.image-preview')) return;
    e.preventDefault();
    let imageId = +e.target.dataset.id;

    this.currentImageId = imageId;
    this.requestViewModel(imageId).then(() => {
        this.activate().then(() => {
            this.updateCurrentView(imageId);
            this.pushImageState();
            this.requestAllNecessaryViewModels().then(() => {
                this.updatePreloadedImagesArray();
            });
        });
    }).catch((err) => {
        if (err instanceof ImageNotFound) {
            this.deleteImagePreview(imageId);
            this.error(err);
        }
    });

};


Gallery.prototype.setGallery = function (options) {
    this.publicationNumberElem = options.publicationNumberElem;
    this.imagePreviewGhost = this.gallery.querySelector('.image-preview');
    this.galleryWrapper = this.gallery.querySelector('.gallery__wrapper');

    this.gallery.onclick = e => {
        this.onGalleryClick(e);
    };
};

Gallery.prototype.setElem = function () {

    return new Promise((resolve, reject) => {

        if (!this.elem)
            this.elem = this.renderWindow(require(`html-loader!./window`));

        this.imgElem = this.elem.querySelector('img.image__img-element');
        this.description = this.elem.querySelector('.image__description');
        this.date = this.elem.querySelector('.image__post-date');
        this.imageWrapper = this.elem.querySelector('.image__image-wrapper');
        this.sideBar = this.elem.querySelector('.image__sidebar');
        this.deleteButtonElem = document.querySelector('.image__delete-button');
        this.subscribeButtonElem = document.querySelector('.image__subscribe-button');


        this.imgElem.onload = e => {
            this.resizeImage();
            this.activateImgElem();
        };

        this.elem.onclick = e => {
            this.onElemClick(e);

            if (e.target.matches('.image__control-prev'))
                this.switchToPrev();

            if (e.target.matches('.image__control-next'))
                this.switchToNext();

            if (e.target.matches('.image__close-space') || e.target.matches('.image__close-button'))
                this.deactivate();
        };

        if (this.isLogged) {
            require.ensure([
                BLOCKS + 'comment-section',
                BLOCKS + 'like-button'
            ], require => {
                let CommentSection = require(BLOCKS + 'comment-section');
                let LikeButton = require(BLOCKS + 'like-button');

                this.commentSection = new CommentSection({
                    elem: document.querySelector('.comment-section'),
                    commentSenderElem: document.querySelector('.comment-send'),
                    imageId: this.currentImageId
                });

                this.commentSection.on('comment-section_changed', e => {
                    let imageId = e.detail.imageId;
                    this.deleteViewModel(imageId);
                    this.requestViewModel(imageId).then(() => {
                        this.updateComments(imageId);
                    });
                });

                this.likeButton = new LikeButton({
                    elem: document.querySelector('.like-button'),
                    imageId: this.currentImageId
                });

                this.likeButton.on('like-button_changed', e => {
                    let imageId = e.detail.imageId;
                    this.deleteViewModel(imageId);
                    this.requestViewModel(imageId).then(() => {
                        this.updateLikes(imageId);
                    });
                });


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
                    this.setSubscribeButton();
                    require.ensure([BLOCKS + 'subscribe-button'], require => {
                        let SubscribeButton = require(BLOCKS + 'subscribe-button');
                        this.subscribeButton = new SubscribeButton({
                            elem: this.subscribeButtonElem,
                            imageId: this.currentImageId
                        });
                        resolve();
                    });
                }

            });
        } else
            resolve();
    });

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


Gallery.prototype.show = function () {
    Modal.prototype.show.apply(this);
    return new Promise((resolve, reject) => {

        if (!this.elem)
            this.setElem().then(() => {
                this.elem.classList.remove('image_invisible');
                resolve();
            });
        else {
            this.elem.classList.remove('image_invisible');
            resolve();
        }
    });

};

Gallery.prototype.deactivate = function (noPushState) {
    if (!this.isEmbedded)
        window.location = this.elem.dataset.authorUrl;
    else {
        this.elem.classList.add('image_invisible');

        if (!noPushState)
            this.pushUserState();

        Modal.prototype.deactivate.apply(this);
    }

};

Gallery.prototype.deactivateImgElem = function () {
    this.elem.classList.add('image_img-element-invisible');
};

Gallery.prototype.activateImgElem = function () {
    this.elem.classList.remove('image_img-element-invisible');
};


Gallery.prototype.resizeImage = function () {
    if (this.elem) {

        this.imgElem.removeAttribute('width');
        this.imgElem.removeAttribute('height');

        if (this.imgElem.offsetWidth >= this.imgElem.offsetHeight) {
            if (this.imageWrapper.offsetHeight < this.imgElem.offsetHeight)
                this.imgElem.height = this.imageWrapper.offsetHeight;

            if (this.imageWrapper.offsetWidth > this.elem.offsetWidth) {
                this.imgElem.removeAttribute('height');
                this.imgElem.width = this.elem.offsetWidth - this.sideBar.offsetWidth;
            }
        } else {
            if (this.imageWrapper.offsetWidth > this.elem.offsetWidth)
                this.imgElem.width = this.elem.offsetWidth - this.sideBar.offsetWidth;

            if (this.imageWrapper.offsetHeight < this.imgElem.offsetHeight) {
                this.imgElem.removeAttribute('width');
                this.imgElem.height = this.imageWrapper.offsetHeight;
            }
        }
    }
};

Gallery.prototype.renderImageElem = function () {
    return this.requestViewModel(this.currentImageId, true).then(response => {
        let parent = document.createElement('DIV');
        parent.innerHTML = response.html;
        this.elem = parent.firstElementChild;
        document.body.insertBefore(this.elem, document.body.firstElementChild);
    });
};

Gallery.prototype.requestViewModel = function (id) {
    return new Promise((resolve, reject) => {

        if (this.viewModels[id]) {
            resolve();
            return;
        }

        require(LIBS + 'sendRequest')({
            id
        }, 'POST', '/gallery', (err, response) => {
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
    this.galleryArray && this.galleryArray.splice(this.galleryArray.indexOf(id), 1);
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
    previewImageElem.querySelector('.image-preview__text').textContent = `${commentAmount} comments ${likeAmount} likes`;
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
    newImagePreview.style.backgroundImage = `url('/${previewUrl}')`;

    newImagePreview.querySelector('.image-preview__text')
        .textContent = '0 comments 0 likes';

    this.galleryWrapper.appendChild(newImagePreview);

    this.setPublicationNumber(1, true);
    this.addToGalleryArray(imageId);
};

Gallery.prototype.setPublicationNumber = function (value, relative) {
    if (this.publicationNumberElem)
        if (relative)
            this.publicationNumberElem.textContent = +this.publicationNumberElem.textContent + value;
        else
            this.publicationNumberElem.textContent = value;
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
    this.updateCurrentView(nextImageId).then(() => {
        this.requestNextViewModels().then(() => {
            this.updatePreloadedImagesArray();
        }).catch((err) => {
            if (!(err instanceof ImageNotFound))
                this.error(err);

        });
    }).catch((err) => {
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
    this.updateCurrentView(prevImageId).then(() => {
        this.requestPrevViewModels().then(() => {
            this.updatePreloadedImagesArray();
        }).catch((err) => {
            if (!(err instanceof ImageNotFound))
                this.error(err);
        });
    }).catch((err) => {
        if (err instanceof ImageNotFound) {
            if (this.galleryArray && this.galleryArray.length)
                this.switchToPrev();
            else
                this.deactivate();
        } else
            throw err;
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

Gallery.prototype.updateCurrentView = function (newCurrentImageId, noPushState) {
    newCurrentImageId = newCurrentImageId || this.currentImageId;
    this.currentImageId = newCurrentImageId;
    this.deactivateImgElem();

    return this.requestViewModel(newCurrentImageId).then(() => {

        if (newCurrentImageId === this.currentImageId) {
            this.imgElem.setAttribute('src', this.currentViewModel.imgUrl);

            this.likeButton.setImageId(newCurrentImageId);
            this.updateLikes(newCurrentImageId);

            this.commentSection.setImageId(newCurrentImageId);
            this.updateComments(newCurrentImageId);

            this.description.textContent = this.currentViewModel.description;
            this.date.textContent = this.currentViewModel.createDateStr;

            if (this.currentViewModel.isOwnImage) {
                this.setDeleteButton();
                this.deleteButton.setImageId(newCurrentImageId);
            }

            //TODO avatar change

            if (!noPushState)
                this.pushImageState();
        }
    });
};

Gallery.prototype.updateLikes = function (imageId) {
    if (this.currentImageId === imageId)
        this.likeButton.set(this.currentViewModel.likes.length, this.currentViewModel.isLiked);
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

Gallery.prototype.pushUserState = function () {
    let url = '';
    if (this.currentViewModel)
        url = this.currentViewModel.author.url;

    history.pushState({
        type: 'user'
    }, '', url);
};

Gallery.prototype.onPopState = function (state) {
    if (state && state.type)
        switch (state.type) {
            case 'image':
                this.show();
                this.updateCurrentView(state.id, true);
                break;

            case 'user':
                this.deactivate(true);
                break;
        }
};

for (let key in eventMixin)
    Gallery.prototype[key] = eventMixin[key];

module.exports = Gallery;
