"use strict";

import './style.less';

let Dropdown = require(BLOCKS + 'dropdown');
let SocialCollection = require(BLOCKS + 'social-collection');
let UploadAvatarSection = require(BLOCKS + 'upload-avatar-section');

let userMenuDropdown = new Dropdown({
	elem: document.getElementById('user-menu'),
	className: 'header-element'
});

let socialCollection = new SocialCollection({
	elem: document.getElementById('social-collection')
});

let uploadAvatarSection = new UploadAvatarSection({
	elem: document.getElementById('upload-avatar-section')
});


uploadAvatarSection.on('uploaded', e => {
	alert(e.detail.url);
});




require(LIBS + 'setGlobalErrorCatcher')();