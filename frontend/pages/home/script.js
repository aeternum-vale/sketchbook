"use strict";

import './style.less';

let GlobalErrorHandler = require(BLOCKS + 'global-error-handler');
let globalErrorHandler = new GlobalErrorHandler();
let ClientError = require(LIBS + 'componentErrors').ClientError;


if (window.isLogged) {

    require.ensure([BLOCKS + 'dropdown', BLOCKS + 'subscribe-button'], function (require) {
        let Dropdown = require(BLOCKS + 'dropdown');

        let userMenuDropdown = new Dropdown({
            elem: document.getElementById('user-menu'),
            className: 'header-element'
        });

        let subscribeButtonElemsArray = document.getElementsByClassName('cutaway__subscribe-button');
        let subscribeButtonsArray = [];

        let SubscribeButton = require(BLOCKS + 'subscribe-button');

        Array.prototype.forEach.call(subscribeButtonElemsArray, button => {
            subscribeButtonsArray.push(new SubscribeButton({
                elem: button,
                data: button.dataset.username,
                dataStr: 'username'
            }));
        });
    });
} else {
    document.body.addEventListener('click', e => {
        if (e.target.matches('.cutaway__subscribe-button'))
            globalErrorHandler.call(new ClientError(null, null, 401));
    });
}