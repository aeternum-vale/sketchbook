"use strict";

import './style.less';

let Dropdown = require(BLOCKS + 'dropdown');
let SocialCollection = require(BLOCKS + 'social-collection');
let UploadAvatarSection = require(BLOCKS + 'upload-avatar-section');
let DescriptionAddSection = require(BLOCKS + 'description-add-section');
let PasswordChangeSection = require(BLOCKS + 'password-change-section');

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

let descriptionAddSection = new DescriptionAddSection({
    elem: document.getElementById('description-add-section')
});

let passwordChangeSection = new PasswordChangeSection({
    elem: document.forms['change-password']
});


uploadAvatarSection.on('uploaded', e => {
    alert(e.detail.url);
});

require(LIBS + 'setGlobalErrorCatcher')();