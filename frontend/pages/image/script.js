"use strict";

import './style.less';

let Image = require(BLOCKS + 'image');
let image = new Image({
	elem: document.getElementById('image'),
	isLoggedUser: document.body.hasAttribute('data-is-logged-user')
});




window.onload = e => {
	image.resizeImage();
};

window.addEventListener('resize', e => {
	image.resizeImage();
});

require(LIBS + 'setGlobalErrorCatcher')();
