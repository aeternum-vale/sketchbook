"use strict";

import './style.less';

let UserMenu = require(BLOCKS + 'user-menu');
let userMenu = new UserMenu('user-menu');

let linkListSwitch = document.getElementsByClassName('link-list-switch')[0];

linkListSwitch.onclick = function(e) {
	this.classList.toggle('link-list-switch_active');
};