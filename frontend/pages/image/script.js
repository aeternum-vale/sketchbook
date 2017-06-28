"use strict";

import './style.less';

let gallery = new Gallery({
	isLogged: window.isLogged,
	preloadEntityCount: PRELOAD_IMAGE_COUNT,
	isEmbedded: false
});


window.onload = e => {
	image.resize();
};

window.addEventListener('resize', e => {
	image.resize();
});

require(LIBS + 'setGlobalErrorCatcher')();
