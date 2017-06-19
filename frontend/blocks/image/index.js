let eventMixin = require(LIBS + 'eventMixin');

let Image = function(options) {

    this.elem = options.elem;
    this.post = this.elem.querySelector('.image__image-post');
    this.image = this.elem.querySelector('img.image__img-element');
    this.imageWrapper = this.elem.querySelector('.image__image-wrapper');
    this.sideBar = this.elem.querySelector('.image__sidebar');

    this.elem.onclick = e => {
        if (!(e.target.matches('.image__close-space') || e.target.matches('.image__close-button'))) return;

        window.location = this.elem.dataset.authorUrl;
    };



    if (options.isLoggedUser) {

        let CommentSection = require(BLOCKS + 'comment-section');
        let CommentSend = require(BLOCKS + 'comment-send');
        let LikeButton = require(BLOCKS + 'like-button');

        this.commentSection = new CommentSection({
            elem: document.querySelector('.comment-section')
        });
        this.commentSend = new CommentSend({
            elem: document.querySelector('.comment-send')
        });
        this.commentSend.on('post', e => {
            this.commentSection.insertNewComment(e.detail.text, e.detail.id);
        });
        this.like = new LikeButton({
            elem: document.querySelector('.like-button')
        });


        let topSideButton = document.querySelector('.image__top-side-button');
        if (this.elem.hasAttribute('data-is-own-image')) {
            let DeleteImageButton = require(BLOCKS + 'delete-image-button');
            this.delete = new DeleteImageButton({
                elem: topSideButton
            });

            this.delete.on('deleted', e => {
            	window.location = e.detail.url || '/';
            });
        } else {
            let SubscribeButton = require(BLOCKS + 'subscribe-button');
            this.subscribe = new SubscribeButton({
                elem: topSideButton
            });
        }
    }

};

Image.prototype.resizeImage = function() {
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

for (let key in eventMixin) {
    Image.prototype[key] = eventMixin[key];
}

module.exports = Image;
