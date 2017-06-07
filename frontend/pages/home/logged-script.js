"use strict";

let Dropdown = require(BLOCKS + 'dropdown');

let userMenuDropdown = new Dropdown({
	elem: document.getElementById('user-menu'),
	className: 'header-element'
});

require(LIBS + 'setGlobalErrorCatcher')();