let eventMixin = require(LIBS + 'eventMixin');

let Image = function(options) {
    this.elem = options.elem;
    this.viewModel = options.viewModel;
    this.isEmbedded = options.isEmbedded || false;

    this.post = this.elem.querySelector('.image__image-post');
    this.imgElem = this.elem.querySelector('img.image__img-element');
    this.description = this.elem.querySelector('.image__description');
    this.date = this.elem.querySelector('.image__post-date');
    this.imageWrapper = this.elem.querySelector('.image__image-wrapper');
    this.sideBar = this.elem.querySelector('.image__sidebar');

    this.imgElem.onload = e => {
        this.resize();
        this.imgElemActivate();
    };

    this.elem.onclick = e => {
        if (e.target.matches('.image__control-prev'))
            this.trigger('image_prev-clicked');

        if (e.target.matches('.image__control-next'))
            this.trigger('image_next-clicked');

        if (e.target.matches('.image__close-space') || e.target.matches('.image__close-button'))
            if (!this.isEmbedded)
                window.location = this.elem.dataset.authorUrl;
            else
                this.deactivate();

    };

    if (options.isLogged) {
        let CommentSection = require(BLOCKS + 'comment-section');
        let LikeButton = require(BLOCKS + 'like-button');

        this.commentSection = new CommentSection({
            elem: document.querySelector('.comment-section'),
            commentSenderElem: document.querySelector('.comment-send'),
            imageId: this.viewModel._id
        });

        this.commentSection.on('comment-section_changed', e => {
            this.trigger('image_changed');
        });

        this.likeButton = new LikeButton({
            elem: document.querySelector('.like-button'),
            imageId: this.viewModel._id
        });

        this.likeButton.on('like-button_changed', e => {
            this.trigger('image_changed');
        });

        let topSideButton = document.querySelector('.image__top-side-button');
        if (this.viewModel.isOwnImage) {
            let DeleteImageButton = require(BLOCKS + 'delete-image-button');
            this.delete = new DeleteImageButton({
                elem: topSideButton,
                imageId: this.viewModel._id
            });

            this.delete.on('delete-image-button_image-deleted', e => {
                window.location = e.detail.url || '/';
            });
        } else {
            let SubscribeButton = require(BLOCKS + 'subscribe-button');
            this.subscribe = new SubscribeButton({
                elem: topSideButton,
                imageId: this.viewModel._id
            });
        }
    }

};

Image.prototype.activate = function() {
    this.elem.classList.remove('image_invisible');
};

Image.prototype.deactivate = function() {
    this.elem.classList.add('image_invisible');
};

Image.prototype.resize = function() {
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
};

Image.prototype.imgElemDeactivate = function() {
    this.elem.classList.add('image_img-element-invisible');
};

Image.prototype.imgElemActivate = function() {
    this.elem.classList.remove('image_img-element-invisible');
};


Image.prototype.setViewModel = function(viewModel) {
    this.viewModel = viewModel;

    this.imgElemDeactivate();
    this.imgElem.setAttribute('src', viewModel.imgUrl);

    this.likeButton.set(viewModel.likes.length, viewModel.isLiked, viewModel._id);

    this.description.textContent = viewModel.description;
    this.date.textContent = viewModel.createDateStr;

    this.commentSection.set(viewModel.comments, viewModel._id);
};

for (let key in eventMixin)
    Image.prototype[key] = eventMixin[key];


module.exports = Image;
