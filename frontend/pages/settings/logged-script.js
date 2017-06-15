"use strict";

import './style.less';

let Dropdown = require(BLOCKS + 'dropdown');
let SocialCollection = require(BLOCKS + 'social-collection');
let UploadAvatarSection = require(BLOCKS + 'upload-avatar-section');
let DescriptionAddSection = require(BLOCKS + 'description-add-section');
let Form = require(BLOCKS + 'form');
let MessageModalWindow = require(BLOCKS + 'message-modal-window');

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

let passwordChangeForm = new Form({
    elem: document.forms['change-password'],
    fields: {
        'old-password': {
            validator: 'non-empty',
            alias: 'old password',
        },

        'new-password': {
            validator: 'password',
            alias: 'new password',
        },

        'new-again': {
            validator: 'password-again',
            alias: 'new password',
            password: 'new-password',
            extra: true
        }
    },
    url: '/settings'
});

let messageModalWindow = new MessageModalWindow();
passwordChangeForm.on('success', e => {
    messageModalWindow.activate('password successfully changed');
});

uploadAvatarSection.on('uploaded', e => {
    alert(e.detail.url);
});

require(LIBS + 'setGlobalErrorCatcher')();
