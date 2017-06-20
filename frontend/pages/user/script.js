"use strict";

import './style.less';

let Dropdown = require(BLOCKS + 'dropdown');
let Gallery = require(BLOCKS + 'gallery');

let linksDropdown = new Dropdown({
	elem: document.getElementById('links-dropdown'),
	className: 'links-dropdown'
});

let gallery = new Gallery({
	elem: document.getElementById('gallery'),
	isLogged: window.isLogged
});


require(LIBS + 'setGlobalErrorCatcher')();
