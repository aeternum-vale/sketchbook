"use strict";

import './style.less';

let GlobalErrorHandler = require(BLOCKS + 'global-error-handler');
let globalErrorHandler = new GlobalErrorHandler();

if (window.isLogged) {
    require.ensure([BLOCKS + 'dropdown'], function (require) {
        let Dropdown = require(BLOCKS + 'dropdown');

        let userMenuDropdown = new Dropdown({
            elem: document.getElementById('user-menu'),
            className: 'header-element'
        });
    });
}