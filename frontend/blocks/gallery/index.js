let eventMixin = require(LIBS + 'eventMixin');
let ClientError = require(LIBS + 'componentErrors').ClientError;

let Gallery = function(options) {

    this.elem = options.elem;
    this.image = options.image;

    this.isLogged = options.isLogged;

    this.preloadEntityCount = options.preloadEntityCount;

    this.viewModels = {};
    this.gallery = [];
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

    this.isEmbedded = !!this.elem;

    if (this.isEmbedded)
        this.setGallery(options);
    else {
        this.currentImageId = +this.image.dataset.id;
        this.requestViewModel(this.currentImageId).then(() => {
            this.setImage();
            this.pushImageState();

            this.requestAllNecessaryViewModels().then(() => {
                this.updatePreloadedImagesArray();
            });

            this.activateImgElem();
        })
    }
};

Gallery.prototype.onElemClick = function(e) {
    if (!e.target.matches('.image-preview')) return;
    e.preventDefault();
    let imageId = +e.target.dataset.id;

    if (!this.image) {
        this.currentImageId = imageId;
        this.renderImageElem().then(() => {
            this.setImage();
            this.requestAllNecessaryViewModels().then(() => {
                this.updatePreloadedImagesArray();
            });
        });
        this.pushImageState();
    } else
        this.updateCurrentView(imageId).then(() => {
            this.activateImage();
        });
};

Gallery.prototype.setGallery = function(options) {
    this.publicationNumberElem = options.publicationNumberElem;
    this.imagePreviewGhost = this.elem.querySelector('.image-preview');
    this.galleryWrapper = this.elem.querySelector('.gallery__wrapper');

    this.elem.onclick = e => {
        this.onElemClick(e);
    };
};

Gallery.prototype.setImage = function() {
    this.post = this.image.querySelector('.image__image-post');
    this.imgElem = this.image.querySelector('img.image__img-element');
    this.description = this.image.querySelector('.image__description');
    this.date = this.image.querySelector('.image__post-date');
    this.imageWrapper = this.image.querySelector('.image__image-wrapper');
    this.sideBar = this.image.querySelector('.image__sidebar');

    this.imgElem.onload = e => {
        this.resizeImage();
        this.activateImgElem();
    };

    this.image.onclick = e => {
        if (e.target.matches('.image__control-prev'))
            this.switchToPrev();

        if (e.target.matches('.image__control-next'))
            this.switchToNext();

        if (e.target.matches('.image__close-space') || e.target.matches('.image__close-button'))
            this.deactivateImage();
    };

    if (this.isLogged) {
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
            });;
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

        let topSideButton = document.querySelector('.image__top-side-button');
        if (this.currentViewModel.isOwnImage) {
            let DeleteImageButton = require(BLOCKS + 'delete-image-button');
            this.deleteButton = new DeleteImageButton({
                elem: topSideButton,
                imageId: this.currentImageId
            });

            this.deleteButton.on('delete-image-button_image-deleted', e => {
                this.deleteViewModel(e.detail.imageId);
                this.deleteImagePreview(e.detail.imageId);
                this.switchToNext();
            });
        } else {
            let SubscribeButton = require(BLOCKS + 'subscribe-button');
            this.subscribe = new SubscribeButton({
                elem: topSideButton,
                imageId: this.currentImageId
            });
        }
    }

};

Gallery.prototype.updatePreloadedImagesArray = function() {
    for (let i = 1; i <= this.preloadEntityCount; i++) {
        let nextId = this.getNextImageId(i);
        let prevId = this.getNextImageId(-i);

        if (this.viewModels[nextId])
            this.preloadedImages[i].setAttribute('src', this.viewModels[nextId].imgUrl);
        if (this.viewModels[prevId])
            this.preloadedImages[-i].setAttribute('src', this.viewModels[prevId].imgUrl);
    }
};

Gallery.prototype.activateImage = function() {
    this.image.classList.remove('image_invisible');
};

Gallery.prototype.deactivateImage = function(noPushState) {
    if (!this.isEmbedded)
        window.location = this.image.dataset.authorUrl;

    this.image.classList.add('image_invisible');

    if (!noPushState)
        this.pushUserState();
};

Gallery.prototype.deactivateImgElem = function() {
    this.image.classList.add('image_img-element-invisible');
};

Gallery.prototype.activateImgElem = function() {
    this.image.classList.remove('image_img-element-invisible');
};


Gallery.prototype.resizeImage = function() {
    if (this.image) {

        this.imgElem.removeAttribute('width');
        this.imgElem.removeAttribute('height');

        if (this.imgElem.offsetWidth >= this.imgElem.offsetHeight) {
            if (this.imageWrapper.offsetHeight < this.imgElem.offsetHeight)
                this.imgElem.height = this.imageWrapper.offsetHeight;

            if (this.post.scrollWidth > this.post.offsetWidth) {
                this.imgElem.removeAttribute('height');
                this.imgElem.width = this.post.offsetWidth - this.sideBar.offsetWidth;
            }
        } else {
            if (this.post.scrollWidth > this.post.offsetWidth)
                this.imgElem.width = this.post.offsetWidth - this.sideBar.offsetWidth;

            if (this.imageWrapper.offsetHeight < this.imgElem.offsetHeight) {
                this.imgElem.removeAttribute('width');
                this.imgElem.height = this.imageWrapper.offsetHeight;
            }
        }
    }
};

Gallery.prototype.renderImageElem = function() {
    return this.requestViewModel(this.currentImageId, true).then(response => {
        let parent = document.createElement('DIV');
        parent.innerHTML = response.html;
        this.image = parent.firstElementChild;
        document.body.insertBefore(this.image, document.body.firstElementChild);
    });
};

Gallery.prototype.requestViewModel = function(id, requireHtml) {
    return new Promise((resolve, reject) => {

        if (this.viewModels[id]) {
            resolve();
            return;
        }

        require(LIBS + 'sendRequest')(
            (!requireHtml) ? {
                id
            } : {
                id,
                requireHtml
            }, 'POST', '/gallery', (err, response) => {

                if (err) {
                    if (err instanceof ClientError)
                        return reject();
                    else
                        return this.error(err);
                }

                console.log(response);
                this.gallery = response.gallery;
                let provided = false;

                for (let key in response.viewModels) {
                    if (key == id)
                        provided = true;

                    this.viewModels[key] = response.viewModels[key];
                }

                if (provided)
                    resolve(response);
                else
                    reject();
            });
    });
};

Gallery.prototype.getImagePreviewById = function(id) {
    return this.elem.querySelector(`.image-preview[data-id="${id}"]`);
};

Gallery.prototype.updateImagePreviewText = function(id) {
    let likeAmount = this.viewModels[id].likes.length;
    let commentAmount = this.viewModels[id].comments.length;
    let previewImageElem = this.getImagePreviewById(id);
    previewImageElem.dataset.likeAmount = likeAmount;
    previewImageElem.dataset.commentAmount = commentAmount;
    previewImageElem.querySelector('.image-preview__text').textContent = `${commentAmount} comments ${likeAmount} likes`;
};

Gallery.prototype.deleteImagePreview = function(id) {
    let elem = this.getImagePreviewById(id);

    if (this.publicationNumberElem)
        this.publicationNumberElem.textContent = +this.publicationNumberElem.textContent - 1;

    if (elem)
        elem.remove();
};

Gallery.prototype.insertNewImagePreview = function(imageId, previewUrl) {
    let newImagePreview = this.imagePreviewGhost.cloneNode(true);
    newImagePreview.classList.remove('image-preview_ghost');

    newImagePreview.dataset.id = imageId;
    newImagePreview.href = `/image/${imageId}`;
    newImagePreview.style.backgroundImage = `url('/${previewUrl}')`;

    newImagePreview.querySelector('.image-preview__text')
        .textContent = '0 comments 0 likes';

    this.galleryWrapper.appendChild(newImagePreview);

    if (this.publicationNumberElem)
        this.publicationNumberElem.textContent = +this.publicationNumberElem.textContent + 1;
};

Gallery.prototype.deleteViewModel = function(id) {
    delete this.viewModels[id];
    console.log('delete #' + id);
};

Gallery.prototype.requestAllNecessaryViewModels = function() {
    return Promise.all([
        this.requestNextViewModels(),
        this.requestPrevViewModels()
    ]);
};

Gallery.prototype.requestNextViewModels = function() {
    let promises = []
    for (let i = 0; i < this.preloadEntityCount; i++)
        promises.push(this.requestViewModel(this.getNextImageId(i)));
    return Promise.all(promises);
};

Gallery.prototype.requestPrevViewModels = function() {
    let promises = []
    for (let i = 0; i < this.preloadEntityCount; i++)
        promises.push(this.requestViewModel(this.getPrevImageId(i)));
    return Promise.all(promises);
};

Gallery.prototype.switchToNext = function() {
    this.updateCurrentView(this.getNextImageId()).catch(() => {
        this.deactivateImage();
    });
    this.requestNextViewModels().then(() => {
        this.updatePreloadedImagesArray();
    }).catch(() => {

    });
};

Gallery.prototype.switchToPrev = function() {
    this.updateCurrentView(this.getPrevImageId());
    this.requestPrevViewModels().then(() => {
        this.updatePreloadedImagesArray();
    });
};

Gallery.prototype.getNextImageId = function(offset) {
    offset = offset || 1;
    let index = this.gallery.indexOf(this.currentImageId);

    return this.gallery[(index + offset) % this.gallery.length];
};

Gallery.prototype.getPrevImageId = function(offset) {
    offset = offset || 1;

    let index = this.gallery.indexOf(this.currentImageId);

    if (~index && this.gallery.length === 1)
        return this.gallery[0];

    let galleryPrevIndex = index - offset;
    if (galleryPrevIndex < 0) {
        galleryPrevIndex %= this.gallery.length;
        galleryPrevIndex = this.gallery.length + galleryPrevIndex;
    }

    return this.gallery[galleryPrevIndex];
};


Gallery.prototype.updateCurrentView = function(imageId, noPushState) {
    imageId = imageId || this.currentImageId;
    this.currentImageId = imageId;
    this.deactivateImgElem();

    return this.requestViewModel(imageId).then(() => {

        if (imageId === this.currentImageId) {
            this.imgElem.setAttribute('src', this.currentViewModel.imgUrl);

            this.likeButton.setImageId(imageId);
            this.updateLikes(imageId);

            this.commentSection.setImageId(imageId);
            this.updateComments(imageId);

            this.description.textContent = this.currentViewModel.description;
            this.date.textContent = this.currentViewModel.createDateStr;

            this.deleteButton.setImageId(imageId);

            if (!noPushState)
                this.pushImageState();
        }
    });
};

Gallery.prototype.updateLikes = function(imageId) {
    if (this.currentImageId === imageId)
        this.likeButton.set(this.currentViewModel.likes.length, this.currentViewModel.isLiked);
    if (this.elem)
        this.updateImagePreviewText(imageId);
};

Gallery.prototype.updateComments = function(imageId) {
    if (this.currentImageId === imageId)
        this.commentSection.set(this.currentViewModel.comments);
    if (this.elem)
        this.updateImagePreviewText(imageId);
};

Gallery.prototype.pushImageState = function() {
    history.pushState({
        type: 'image',
        id: this.currentImageId
    }, 'image #' + this.currentImageId, '/image/' + this.currentImageId);
};

Gallery.prototype.pushUserState = function() {
    let url = '';
    if (this.image)
        url = this.image.dataset.authorUrl;
    // if (this.currentViewModel)
    //     url = '/user/' + this.currentViewModelauthor.authorUrl;

    history.pushState({
        type: 'user'
    }, '', url);
};

Gallery.prototype.onPopState = function(state) {
    if (state && state.type)
        switch (state.type) {
            case 'image':
                this.activateImage();
                this.updateCurrentView(state.id, true);
                break;

            case 'user':
                this.deactivateImage(true);
                break;
        }
};

for (let key in eventMixin)
    Gallery.prototype[key] = eventMixin[key];

module.exports = Gallery;
