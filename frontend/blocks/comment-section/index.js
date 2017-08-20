let eventMixin = require(LIBS + 'eventMixin');

let CommentSection = function (options) {

    this.elem = options.elem;
    this.commentsWrapper = options.elem.querySelector('.comment-section__comments-wrapper');
    this.imageId = options.imageId;
    this.loggedUserViewModel = options.loggedUserViewModel;

    this.commentSenderElem = options.commentSenderElem;
    this.commentSendTextarea = this.commentSenderElem.querySelector('.comment-send__textarea');

    this.ghost = this.commentsWrapper.querySelector('.comment');

    if (this.loggedUserViewModel) {
        this.commentSenderElem.querySelector('.comment__avatar').style.backgroundImage = `url('${this.loggedUserViewModel.avatarUrls.medium}')`;
        this.commentSenderElem.querySelector('.comment__username').textContent = this.loggedUserViewModel.username;
    }

    this.commentSenderElem.onclick = e => {
        if (!e.target.classList.contains('comment-send__send-button')) return;

        let involvedImageId = this.imageId;
        let text = this.commentSendTextarea.value;
        if (text.length) {

            require(LIBS + 'sendRequest')({
                id: involvedImageId,
                text
            }, 'POST', '/comment', (err, response) => {

                if (err) {
                    this.error(err);
                    return;
                }

                this.commentSendTextarea.value = '';
                if (this.imageId === involvedImageId) {
                    this.insertNewComment(response.viewModel);
                    this.scrollToBottom();
                }

                this.trigger('comment-section_changed', {
                    imageId: involvedImageId
                });

            });
        }
    };

    this.elem.onclick = e => {
        if (!e.target.classList.contains('comment__close-button')) return;

        let comment = e.target.closest('.comment');
        let commentId = comment.dataset.id;
        let involvedImageId = this.imageId;

        require(LIBS + 'sendRequest')({
            id: commentId
        }, 'DELETE', '/comment', (err, response) => {
            if (err) {
                this.error(err);
                return;
            }

            this.trigger('comment-section_changed', {
                imageId: involvedImageId
            });
            comment.remove();
        });
    };

};

CommentSection.prototype.scrollToBottom = function () {
    this.commentsWrapper.scrollTop = this.commentsWrapper.scrollHeight;
};

CommentSection.prototype.insertNewComment = function (viewModel) {
    let newComment = this.ghost.cloneNode(true);
    newComment.classList.remove('comment_ghost');
    newComment.dataset.id = viewModel._id;
    newComment.querySelector('.comment__ref').setAttribute('href', viewModel.commentator.url);
    newComment.querySelector('.comment__avatar').style.backgroundImage =
        `url('${viewModel.commentator.avatarUrls.medium}')`;
    newComment.querySelector('.comment__username').textContent = viewModel.commentator.username;
    newComment.querySelector('.comment__date').textContent = viewModel.createDateStr;

    if (!viewModel.isOwnComment)
        newComment.classList.add('comment_not-own');
    else
        newComment.classList.remove('comment_not-own');

    newComment.querySelector('.comment__text').textContent = viewModel.text;
    this.commentsWrapper.appendChild(newComment);
};


CommentSection.prototype.setImageId = function (imageId) {
    this.imageId = imageId;
};

CommentSection.prototype.set = function (viewModels) {
    this.clear();

    viewModels.forEach(viewModel => {
        this.insertNewComment(viewModel);
    });
};

CommentSection.prototype.clear = function () {
    this.commentsWrapper.innerHTML = '';
};


for (let key in eventMixin)
    CommentSection.prototype[key] = eventMixin[key];

module.exports = CommentSection;
