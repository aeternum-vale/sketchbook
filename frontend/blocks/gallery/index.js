let Image = require(BLOCKS + 'image');

let eventMixin = require(LIBS + 'eventMixin');

let Gallery = function(options) {

    this.elem = options.elem;
    this.isLogged = options.isLogged;
    this.isEmbedded = options.isEmbedded || false;
    this.preloadEntityCount = options.preloadEntityCount;

    this.viewModels = {};
    console.log(this.viewModels);

    this.gallery = [];
    this.currentImageId = null;
    Object.defineProperty(this, 'currentViewModel', {
        get: () => this.viewModels[this.currentImageId]
    });



    this.elem.onclick = e => {
        if (!e.target.matches('.image-preview')) return;
        e.preventDefault();
        let imageId = +e.target.dataset.id;

        if (!this.image) {
            this.currentImageId = imageId;
            this.renderImageElem(imageId);
        } else
            this.setCurrentViewModel(imageId).then(() => {
                this.activateImage();
            });
    };


};


Gallery.prototype.activateImage = function() {
    this.image.classList.remove('image_invisible');
};

Gallery.prototype.deactivateImage = function() {
    this.image.classList.add('image_invisible');
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


Gallery.prototype.renderImageElem = function(id) {
    this.requestViewModel(id).then(response => {
        let parent = document.createElement('DIV');
        parent.innerHTML = response.html;
        this.image = parent.firstElementChild;
        document.body.insertBefore(this.image, document.body.firstElementChild);
        this.setImage();
    });
};

Gallery.prototype.requestViewModel = function(id) {
    return new Promise((resolve, reject) => {

        if (this.viewModels[id]) {
            resolve();
            return;
        }

        require(LIBS + 'sendRequest')(
            this.image ? {
                id
            } : {
                id,
                requireHtml: true
            }, 'POST', '/gallery', (err, response) => {

                if (err) {
                    this.error(err);
                    return;
                }

                console.log(response);
                this.gallery = response.gallery;
                for (let key in response.viewModels)
                    this.viewModels[key] = response.viewModels[key];

                resolve(response);
            });
    });
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
            if (!this.isEmbedded)
                window.location = this.image.dataset.authorUrl;
            else
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
            this.deleteViewModel(e.detail.imageId);
        });

        this.likeButton = new LikeButton({
            elem: document.querySelector('.like-button'),
            imageId: this.currentImageId
        });

        this.likeButton.on('like-button_changed', e => {
            this.deleteViewModel(e.detail.imageId);
        });

        let topSideButton = document.querySelector('.image__top-side-button');
        if (this.currentViewModel.isOwnImage) {
            let DeleteImageButton = require(BLOCKS + 'delete-image-button');
            this.delete = new DeleteImageButton({
                elem: topSideButton,
                imageId: this.currentImageId
            });

            this.delete.on('delete-image-button_image-deleted', e => {
                window.location = e.detail.url || '/';
            });
        } else {
            let SubscribeButton = require(BLOCKS + 'subscribe-button');
            this.subscribe = new SubscribeButton({
                elem: topSideButton,
                imageId: this.currentImageId
            });
        }
    }

    this.setCurrentViewModel();
    this.requestAllNecessaryViewModels();
};

Gallery.prototype.deleteViewModel = function(id) {
    delete this.viewModels[id];
    console.log('delete #' + id);
};


Gallery.prototype.requestAllNecessaryViewModels = function() {
    this.requestNextViewModels();
    this.requestPrevViewModels();
};

Gallery.prototype.requestNextViewModels = function() {
    for (let i = 0; i < this.preloadEntityCount; i++)
        this.requestViewModel(this.getNextImageId());
};

Gallery.prototype.requestPrevViewModels = function() {
    for (let i = 0; i < this.preloadEntityCount; i++)
        this.requestViewModel(this.getPrevImageId());
};

Gallery.prototype.switchToNext = function() {
    this.setCurrentViewModel(this.getNextImageId());
    this.requestNextViewModels();
};

Gallery.prototype.switchToPrev = function() {
    this.setCurrentViewModel(this.getPrevImageId());
    this.requestPrevViewModels();
};

Gallery.prototype.getNextImageId = function() {
    let index = this.gallery.indexOf(this.currentImageId);
    return this.gallery[(index + 1) % this.gallery.length];
};

Gallery.prototype.getPrevImageId = function() {
    let index = this.gallery.indexOf(this.currentImageId);

    let galleryPrevIndex = index - 1;
    if (galleryPrevIndex < 0) {
        galleryPrevIndex %= this.gallery.length;
        galleryPrevIndex = this.gallery.length + galleryPrevIndex;
    }

    return this.gallery[galleryPrevIndex];
};


Gallery.prototype.setCurrentViewModel = function(id) {
    id = id || this.currentImageId;
    this.currentImageId = id;
    this.deactivateImgElem();

    return this.requestViewModel(id).then(() => {
        this.imgElem.setAttribute('src', this.currentViewModel.imgUrl);
        this.likeButton.set(this.currentViewModel.likes.length, this.currentViewModel.isLiked, id);
        this.description.textContent = this.currentViewModel.description;
        this.date.textContent = this.currentViewModel.createDateStr;
        this.commentSection.set(this.currentViewModel.comments, id);
    });
};

for (let key in eventMixin)
    Gallery.prototype[key] = eventMixin[key];

module.exports = Gallery;
