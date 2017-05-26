let CommentSend = require(BLOCKS + 'comment-send');
let CommentsSection = require(BLOCKS + 'comments-section');

let commentsSection = new CommentsSection('comments-section');
let commentSend = new CommentSend('comment-send', commentsSection.elem);

//------------------------------

let deleteImage = document.getElementById('delete-image-button');

deleteImage.onclick = function(e) {
	require(LIBS + 'sendXHR')(null, 'DELETE', '/image', function(response) {
		if (response.success) {
			if (response.url)
				window.location = response.url;
		} else
			alert('Server error. Please retry later.')
	});
};

//------------------------------

let like = document.getElementById('like');

like.onclick = function(e) {
	require(LIBS + 'sendXHR')(null, 'POST', '/like', function(response) {
		if (response.success) {
			console.log('it is liked!');
		} else
			alert('Server error. Please retry later.')
	});
};