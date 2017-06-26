let eventMixin = require(LIBS + 'eventMixin');

let CommentSender = require(BLOCKS + 'comment-sender');

let CommentSection = function(options) {

    this.elem = options.elem;
    this.commentSender = new CommentSender({
        elem: options.commentSenderElem,
        imageId: options.imageId
    });

    this.ghost = this.elem.querySelector('.comment.comment_ghost');

    this.commentSender.on('comment-sender_comment-posted', e => {
        this.insertNewComment(e.detail.viewModel);
        this.trigger('comment-section_changed');
    });

    this.elem.onclick = e => {
        if (!e.target.classList.contains('comment__close-button')) return;

        let comment = e.target.closest('.comment');
        let commentId = comment.dataset.id;

        require(LIBS + 'sendRequest')({
            id: commentId
        }, 'DELETE', '/comment', (err, response) => {
            if (err) {
                this.error(err);
                return;
            }

            this.trigger('comment-section_changed');
            comment.remove();
        });
    };

};


CommentSection.prototype.insertNewComment = function(viewModel) {
    let newComment = this.ghost.cloneNode(true);
    newComment.classList.remove('comment_ghost');
    newComment.dataset.id = viewModel._id;
    newComment.querySelector('.comment__ref').setAttribute('href', viewModel.commentator.url);
    newComment.querySelector('.comment__avatar').style.backgroundImage =
        `url('${viewModel.commentator.avatarUrls.medium}')`;
    newComment.querySelector('.comment__username').textContent = viewModel.commentator.username;
    newComment.querySelector('.comment__date').textContent = viewModel.createDateStr;

    if (!viewModel.isOwnComment)
        newComment.querySelector('.comment__close-button').remove();

    newComment.querySelector('.comment__text').textContent = viewModel.text;
    this.elem.appendChild(newComment);
};

CommentSection.prototype.set = function(viewModels, id) {
    this.commentSender.setImageId(id);
    this.clear();

    viewModels.forEach(viewModel => {
        this.insertNewComment(viewModel);
    });
};

CommentSection.prototype.clear = function() {
    this.elem.innerHTML = '';
};


for (let key in eventMixin)
    CommentSection.prototype[key] = eventMixin[key];


module.exports = CommentSection;
