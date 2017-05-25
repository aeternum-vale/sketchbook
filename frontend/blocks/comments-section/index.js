module.exports = function(commentSectionId) {

	this.elem = document.getElementById(commentSectionId);

	this.elem.onclick = function(e) {
		if (!e.target.classList.contains('comment__close-button')) return;

		let comment = e.target.closest('.comment');

		let body = `commentId=${encodeURIComponent(comment.dataset.id)}`;
		require(LIBS + 'sendXHR')(body, 'DELETE', '/comment', function(response) {
			if (response.success) {
				comment.remove();

			} else alert('Server error. Please retry later.');
		});
	}



};