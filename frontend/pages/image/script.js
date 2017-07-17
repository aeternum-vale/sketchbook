"use strict";

import './style.less';

let GlobalErrorHandler = require(BLOCKS + 'global-error-handler');
let globalErrorHandler = new GlobalErrorHandler();

let Gallery = require(BLOCKS + 'gallery');
let gallery = new Gallery({
	elem: document.getElementById('image'),
	isLogged: window.isLogged,
	preloadEntityCount: PRELOAD_IMAGE_COUNT
});

