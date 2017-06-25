let eventMixin = require(LIBS + 'eventMixin');

let Image = function(options) {
    this.elem = options.elem;
    this.viewModel = options.viewModel;

    this.post = this.elem.querySelector('.image__image-post');
    this.image = this.elem.querySelector('img.image__img-element');
    this.description = this.elem.querySelector('.image__description');
    this.date = this.elem.querySelector('.image__post-date');

    this.image.onload = e => {
        this.resize();
    };

    this.imageWrapper = this.elem.querySelector('.image__image-wrapper');
    this.sideBar = this.elem.querySelector('.image__sidebar');

    this.elem.onclick = e => {
        if (e.target.matches('.image__control-prev'))
            this.trigger('image_prev-clicked');

        if (e.target.matches('.image__control-next'))
            this.trigger('image_next-clicked');

        if (e.target.matches('.image__close-space') || e.target.matches('.image__close-button'))
            window.location = this.elem.dataset.authorUrl;
    };

    if (options.isLogged) {
        let CommentSection = require(BLOCKS + 'comment-section');
        let LikeButton = require(BLOCKS + 'like-button');

        this.commentSection = new CommentSection({
            elem: document.querySelector('.comment-section'),
            commentSenderElem: document.querySelector('.comment-send'),
            id: this.viewModel._id
        });

        this.likeButton = new LikeButton({
            elem: document.querySelector('.like-button'),
            id: this.viewModel._id
        });

        let topSideButton = document.querySelector('.image__top-side-button');
        if (this.viewModel.isOwnImage) {
            let DeleteImageButton = require(BLOCKS + 'delete-image-button');
            this.delete = new DeleteImageButton({
                elem: topSideButton,
                id: this.viewModel._id
            });

            this.delete.on('deleted', e => {
                window.location = e.detail.url || '/';
            });
        } else {
            let SubscribeButton = require(BLOCKS + 'subscribe-button');
            this.subscribe = new SubscribeButton({
                elem: topSideButton,
                id: this.viewModel._id
            });
        }
    }

};

Image.prototype.resize = function() {
    this.image.removeAttribute('width');
    this.image.removeAttribute('height');

    if (this.image.offsetWidth >= this.image.offsetHeight) {
        if (this.imageWrapper.offsetHeight < this.image.offsetHeight)
            this.image.height = this.imageWrapper.offsetHeight;

        if (this.post.scrollWidth > this.post.offsetWidth) {
            this.image.removeAttribute('height');
            this.image.width = this.post.offsetWidth - this.sideBar.offsetWidth;
        }
    } else {
        if (this.post.scrollWidth > this.post.offsetWidth)
            this.image.width = this.post.offsetWidth - this.sideBar.offsetWidth;

        if (this.imageWrapper.offsetHeight < this.image.offsetHeight) {
            this.image.removeAttribute('width');
            this.image.height = this.imageWrapper.offsetHeight;
        }
    }
};

Image.prototype.setViewModel = function(viewModel) {
    this.id = viewModel._id;
    this.image.setAttribute('src', viewModel.imgUrl);

    this.likeButton.set(viewModel.likes.length, viewModel.isLiked, this.id);

    this.description.textContent = viewModel.description;
    this.date.textContent = viewModel.createDateStr;
};



for (let key in eventMixin) {
    Image.prototype[key] = eventMixin[key];
}

module.exports = Image;
