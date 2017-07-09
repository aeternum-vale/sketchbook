"use strict";

import './style.less';

let Gallery = require(BLOCKS + 'gallery');
let gallery = new Gallery({
	elem: document.getElementById('image'),
	isLogged: window.isLogged,
	preloadEntityCount: PRELOAD_IMAGE_COUNT,
	isEmbedded: false
});

require(LIBS + 'setGlobalErrorCatcher')();
