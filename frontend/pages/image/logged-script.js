let CommentSend = require(BLOCKS + 'comment-send');
let CommentsSection = require(BLOCKS + 'comments-section');

let commentsSection = new CommentsSection('comments-section');
let commentSend = new CommentSend('comment-send', commentsSection.elem);

//------------------------------

let deleteImage = document.getElementById('delete-image-button');

if (deleteImage)
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


let LikeButton = require(BLOCKS + 'like-button');
let likeButton = new LikeButton({
	elem: document.getElementById('like')
});

//------------------------------
let subscribeButtonElem;
if (subscribeButtonElem = document.getElementById('subscribe-button')) {
	let SubscribeButton = require(BLOCKS + 'subscribe-button');
	let subscribeButton = new SubscribeButton({
		elem: subscribeButtonElem
	});
}