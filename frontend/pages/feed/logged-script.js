"use strict";

import './style.less';

let Dropdown = require(BLOCKS + 'dropdown');

let userMenuDropdown = new Dropdown({
	elem: document.getElementById('user-menu'),
	className: 'header-element'
});


let PromptWindow = require(BLOCKS + 'prompt-window');
let prompt = new PromptWindow();
prompt.activate();



require(LIBS + 'setGlobalErrorCatcher')();
