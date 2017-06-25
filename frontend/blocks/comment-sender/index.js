let eventMixin = require(LIBS + 'eventMixin');

let CommentSender = function(options) {

	this.elem = options.elem;
	this.id = options.id;

	this.commentSendTextarea = this.elem.querySelector('.comment-send__textarea');


	this.elem.onclick = e => {
		if (!e.target.classList.contains('comment-send__send-button')) return;
		let text = this.commentSendTextarea.value;

		require(LIBS + 'sendRequest')({
			id: this.id,
			text
		}, 'POST', '/comment', (err, response) => {

			if (err) {
				this.error(err);
				return;
			}
			
			this.commentSendTextarea.value = '';
			this.trigger('comment-sender_comment-posted', {
				viewModel: response.viewModel
			});

		});
	};

};

for (let key in eventMixin)
	CommentSender.prototype[key] = eventMixin[key];

module.exports = CommentSender;
