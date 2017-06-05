"use strict";

import './style.less';

let Dropdown = require(BLOCKS + 'dropdown');

let linksDropdown = new Dropdown({
	elem: document.getElementById('links-dropdown'),
	className: 'links-dropdown'
});

require(LIBS + 'setGlobalErrorCatcher')();