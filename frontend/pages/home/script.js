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

let Home = function (options) {
    this.elem = options.elem;
    this.cutawaysWrapper = this.elem.querySelector('.home__cutaways-wrapper');
    this.spinner = this.elem.querySelector('.home__spinner');
    this.testCutaway = this.elem.querySelector('.home__cutaway');

    this.isAvailable = true;

    window.onscroll = e => {
        if (this.isAvailable)
            if (document.body.scrollHeight === document.body.scrollTop + document.body.offsetHeight)
                this.getNewCutaway();

    };

};

Home.prototype.getNewCutaway = function () {
    this.spinner.classList.remove('spinner_invisible');
    this.isAvailable = false;

    setTimeout(() => {
        this.spinner.classList.add('spinner_invisible');
        this.isAvailable = true;

        let newCutaway = this.testCutaway.cloneNode(true);
        newCutaway.classList.add('cutaway_new');
        let newCutaway2 = this.testCutaway.cloneNode(true);
        newCutaway2.classList.add('cutaway_new');
        this.cutawaysWrapper.appendChild(newCutaway);
        this.cutawaysWrapper.appendChild(newCutaway2);
    }, 2000);
};

let home = new Home({
    elem: document.getElementById('home')
});
