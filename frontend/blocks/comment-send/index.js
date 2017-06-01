let eventMixin = require(LIBS + 'eventMixin');

let CommentSendForm = function(options) {

	this.elem = options.elem;
	this.commentSendTextarea = this.elem.querySelector('.comment-send__textarea');

	this.elem.onclick = e => {

		if (!e.target.classList.contains('comment-send__send-button')) return;

		let text = this.commentSendTextarea.value;
		let body = `text=${encodeURIComponent(text)}`;

		require(LIBS + 'sendXHR')(body, 'POST', '/comment', (err, response) => {
			if (err) {
				this.trigger('error', err);
				return;
			}

			if (response.success) {
				this.commentSendTextarea.value = '';
				this.trigger('post', {
					text,
					id: response.commentId
				});
			} else this.trigger('error');
		});
	};

};

for (let key in eventMixin) {
	CommentSendForm.prototype[key] = eventMixin[key];
}

module.exports = CommentSendForm;