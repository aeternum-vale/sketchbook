// let CommentSection = require(BLOCKS + 'comment-section');
// let CommentSend = require(BLOCKS + 'comment-send');
// let commentSection = new CommentSection({
// 	elem: document.getElementById('comment-section')
// });
// let commentSend = new CommentSend({
// 	elem: document.getElementById('comment-send')
// });
// commentSend.on('post', e => {
// 	commentSection.insertNewComment(e.detail.text, e.detail.id);
// });
//
// let DeleteImageButton = require(BLOCKS + 'delete-image-button');
// let deleteImageButtonElem = document.getElementById('delete-image-button');
// let deleteImageButton;
// if (deleteImageButtonElem) {
// 	deleteImageButton = new DeleteImageButton({
// 		elem: deleteImageButtonElem
// 	});
//
// 	deleteImageButton.on('deleted', e => {
// 		window.location = e.detail.url || '/';
// 	});
// }
//
// let LikeButton = require(BLOCKS + 'like-button');
// let likeButton = new LikeButton({
// 	elem: document.getElementById('like')
// });
//
// let subscribeButtonElem;
// if (subscribeButtonElem = document.getElementById('subscribe-button')) {
// 	let SubscribeButton = require(BLOCKS + 'subscribe-button');
// 	let subscribeButton = new SubscribeButton({
// 		elem: subscribeButtonElem
// 	});
// }
