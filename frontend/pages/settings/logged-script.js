"use strict";

import './style.less';

let Dropdown = require(BLOCKS + 'dropdown');
let FilePicker = require(BLOCKS + 'file-picker');
let SocialCollection = require(BLOCKS + 'social-collection');

let userMenuDropdown = new Dropdown({
	elem: document.getElementById('user-menu'),
	className: 'header-element'
});

let filePicker = new FilePicker({
	elem: document.getElementById('file-picker')
});

let socialCollection = new SocialCollection({
	elem: document.getElementById('social-collection')
});

require(LIBS + 'setGlobalErrorCatcher')();