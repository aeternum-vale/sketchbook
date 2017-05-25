"use strict";

import './style.less';

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

let image = document.getElementById('image');
let imageWrapper = document.getElementById('image-wrapper');
let imagePost = document.getElementById('image-post');
let sideBar = document.getElementById('side-bar');

let imgOriginalW = image.offsetWidth;
let imgOriginalH = image.offsetHeight;

window.onload = function(e) {
	resizeImage();
}


window.addEventListener('resize', e => {
	resizeImage();
});

function resizeImage() {
	image.removeAttribute('width');
	image.removeAttribute('height');

	if (image.offsetWidth >= image.offsetHeight) {
		if (imageWrapper.offsetHeight < image.offsetHeight)
			image.\ = imageWrapper.offsetHeight;

		if (imagePost.scrollWidth > imagePost.offsetWidth) {
			image.removeAttribute('height');
			image.width = imagePost.offsetWidth - sideBar.offsetWidth;
		}
	} else {
		if (imagePost.scrollWidth > imagePost.offsetWidth)
			image.width = imagePost.offsetWidth - sideBar.offsetWidth;

		if (imageWrapper.offsetHeight < image.offsetHeight) {
			image.removeAttribute('width');
			image.height = imageWrapper.offsetHeight;
		}
	}

	// 	console.log(
	// `image.width:${image.width}
	// image.height:${image.height}
	// imagePost.scrollWidth:${imagePost.scrollWidth}
	// imagePost.offsetWidth:${imagePost.offsetWidth}
	// sideBar.scrollWidth:${sideBar.scrollWidth}
	// sideBar.offsetWidth:${sideBar.offsetWidth}`);
}