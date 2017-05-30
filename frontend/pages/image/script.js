"use strict";

import './style.less';

let ImagePost = require(BLOCKS + 'image-post');
let imagePost = new ImagePost({
	elem: document.getElementById('image-post')
})

window.onload = e => {
	imagePost.resizeImage();
}

window.addEventListener('resize', e => {
	imagePost.resizeImage();
});