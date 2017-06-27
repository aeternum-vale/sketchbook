let eventMixin = require(LIBS + 'eventMixin');

let CommentSender = function(options) {

	this.elem = options.elem;
	this.imageId = options.imageId;

	this.commentSendTextarea = this.elem.querySelector('.comment-send__textarea');

	this.elem.onclick = e => {
		if (!e.target.classList.contains('comment-send__send-button')) return;
		let text = this.commentSendTextarea.value;
		let imageId = this.imageId;

		require(LIBS + 'sendRequest')({
			id: imageId,
			text
		}, 'POST', '/comment', (err, response) => {

			if (err) {
				this.error(err);
				return;
			}

			this.commentSendTextarea.value = '';
			this.trigger('comment-sender_comment-posted', {
				viewModel: response.viewModel,
				imageId
			});

		});
	};
};

CommentSender.prototype.setImageId = function(id) {
	this.imageId = id;
};

for (let key in eventMixin)
	CommentSender.prototype[key] = eventMixin[key];

module.exports = CommentSender;
