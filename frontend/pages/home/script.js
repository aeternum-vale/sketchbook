"use strict";

import './style.less';

let GlobalErrorHandler = require(BLOCKS + 'global-error-handler');
let globalErrorHandler = new GlobalErrorHandler();
let ClientError = require(LIBS + 'componentErrors').ClientError;
let subscribeButtonsArray = [];
let SubscribeButton;

if (window.isLogged) {

    require.ensure([BLOCKS + 'dropdown', BLOCKS + 'subscribe-button'], function (require) {
        let Dropdown = require(BLOCKS + 'dropdown');

        let userMenuDropdown = new Dropdown({
            elem: document.getElementById('user-menu'),
            className: 'header-element'
        });

        let subscribeButtonElemsArray = document
            .getElementsByClassName('cutaway__subscribe-button');


        SubscribeButton = require(BLOCKS + 'subscribe-button');

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
    this.ghostCutaway = this.elem.querySelector('.home__cutaway');

    this.isAvailable = true;
    this.reportedCutaways = Array.prototype.map
        .call(this.elem.querySelectorAll('.home__cutaway'),
            item => +item.dataset.userId);

    this.noMoreCutaways = !this.ghostCutaway;

    this.timerId = setInterval(() => {
        if (!this.noMoreCutaways) {
            if (this.isAvailable)
                if (document.body.scrollHeight === document.body.offsetHeight)
                    this.getNewCutaway();
        } else
            clearInterval(this.timerId);
    }, 3000);


    window.onscroll = e => {
        if (this.isAvailable && !this.noMoreCutaways)
            if (document.body.scrollHeight === document.body.scrollTop +
                document.body.offsetHeight)
                this.getNewCutaway();
    };

};

Home.prototype.getNewCutaway = function () {
    this.spinner.classList.remove('spinner_invisible');
    this.isAvailable = false;

    require(LIBS + 'sendRequest')({
            reportedCutaways: this.reportedCutaways
        }, 'POST', '/cutaway', (err, response) => {
            if (err) {
                globalErrorHandler.call(err);
                return;
            }

            console.log('response:', response);

            if (response.isLastSet || response.cutaways.length === 0)
                this.noMoreCutaways = true;

            response.cutaways.forEach(cutaway => {
                this.reportedCutaways.push(cutaway.user._id);
                this.cutawaysWrapper.appendChild(this.getCutawayElem(cutaway));
            });


            this.spinner.classList.add('spinner_invisible');
            this.isAvailable = true;

        }
    );

};

Home.prototype.getCutawayElem = function (cutaway) {
    let cutawayElem = this.ghostCutaway.cloneNode(true);
    cutawayElem.dataset.userId = cutaway.user._id;
    cutawayElem.querySelector('.cutaway__header-left-side')
        .href = cutaway.user.url;
    cutawayElem.querySelector('.cutaway__username')
        .textContent = cutaway.user.username;
    cutawayElem.querySelector('.cutaway__avatar')
        .style.backgroundImage = `url('${cutaway.user.avatarUrls.medium}')`;

    let subscribeButton = cutawayElem.querySelector('.cutaway__subscribe-button');

    subscribeButton.dataset.username = cutaway.user.username;

    console.log('isNarrator', cutaway.user.isNarrator);
    if (cutaway.user.isNarrator)
        subscribeButton.dataset.active = 'true';
    else
        subscribeButton.removeAttribute('data-active');

    if (SubscribeButton)
        subscribeButtonsArray.push(new SubscribeButton({
            elem: subscribeButton,
            data: cutaway.user.username,
            dataStr: 'username'
        }));

    let cutawayTop = cutawayElem.querySelector('.cutaway__top');
    let cutawayBottom = cutawayElem.querySelector('.cutaway__bottom');

    for (let i = 0; i < cutawayTop.children.length; i++)
        cutawayTop.children[i].style.backgroundImage =
            `url('${cutaway.imagesTop[i].previewUrl}')`;

    for (let i = 0; i < cutawayBottom.children.length; i++)
        cutawayBottom.children[i].style.backgroundImage =
            `url('${cutaway.imagesBottom[i].previewUrl}')`;

    return cutawayElem;

};

let home = new Home({
    elem: document.getElementById('home')
});
