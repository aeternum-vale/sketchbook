
module.exports = function(id, commentSection) {

	function insertNewComment(text, id) {
		let newComment = commentGhost.cloneNode(true);
		newComment.classList.remove('comment_ghost');
		newComment.querySelector('.comment__text').textContent = text;
		newComment.dataset.id = id;
		commentSection.appendChild(newComment);
	}

	let elem = document.getElementById(id);
	let commentSendButton = elem.querySelector('.comment-send__send-button');
	let commentSendTextarea = elem.querySelector('.comment-send__textarea');
	let commentGhost = commentSection.querySelector('.comment_ghost');

	commentSendButton.onclick = function() {
		let text = commentSendTextarea.value;
		let body = `text=${encodeURIComponent(text)}`;

		require(LIBS + 'sendXHR')(body, 'POST', '/comment', function(response) {
			if (response.success) {
				commentSendTextarea.value = '';
				insertNewComment(text, response.commentId);
			} else alert('Server error. Please retry later.');
		});
	};

};