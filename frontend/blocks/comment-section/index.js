let eventMixin = require(LIBS + 'eventMixin');

let CommentSection = function(options) {

	this.elem = options.elem;
	this._commentGhost = this.elem.querySelector('.comment_ghost');

	this.elem.onclick = e => {
		if (!e.target.classList.contains('comment__close-button')) return;

		let comment = e.target.closest('.comment');

		let body = `commentId=${encodeURIComponent(comment.dataset.id)}`;
		require(LIBS + 'sendXHR')(body, 'DELETE', '/comment', (err, response) => {

			if (err) {
				this.error(err);
				return;
			}

			comment.remove();

		});
	};

};

for (let key in eventMixin) {
	CommentSection.prototype[key] = eventMixin[key];
}

CommentSection.prototype.insertNewComment = function(text, id) {
	let newComment = this._commentGhost.cloneNode(true);
	newComment.classList.remove('comment_ghost');
	newComment.querySelector('.comment__text').textContent = text;
	newComment.dataset.id = id;
	this.elem.appendChild(newComment);
}

module.exports = CommentSection;