"use strict";

import './style.less';

let GlobalErrorHandler = require(BLOCKS + 'global-error-handler');
let globalErrorHandler = new GlobalErrorHandler();

let AuthWindow = require(BLOCKS + 'auth-window');

let authWindow = new AuthWindow({
    elem: document.getElementById('auth-window'),
    isLoginFormActive: true
});

// window.onpopstate = e => {
//     if (e.state)
//         if (e.state.type === 'join')
//             authWidget.setJoin();
//         else
//             authWidget.setLogin();
// };

// authWidget.on('switch', e => {
//    if (e.detail.loginWindowActive)
//
//       history.pushState({
//       type: 'login'
//    }, "login", "?login");
//    else
//       history.pushState({
//          type: 'join'
//       }, "join", "?join");
//
// });


// if ((history.state && history.state.type === 'join') || window.location.search === '?join') {
//    history.pushState({
//       type: 'join'
//    }, "join", "?join");
//    authWidget.setJoin();
// } else
//    history.replaceState({
//       type: 'login'
//    }, "login", "?login");


let Authorization = function (options) {
    this.elem = options.elem;
    this.wrapper = this.elem.querySelector('.authorization__background-wrapper');

    this.leftPic1 = this.wrapper.querySelector('.authorization__left-pic:nth-child(1)');
    this.leftPic2 = this.wrapper.querySelector('.authorization__left-pic:nth-child(2)');
    this.rightPic1 = this.wrapper.querySelector('.authorization__right-pic:nth-child(1)');
    this.rightPic2 = this.wrapper.querySelector('.authorization__right-pic:nth-child(2)');

    this.currentLeftPic1Index = -1;
    this.currentLeftPic2Index = -1;
    this.currentRightPic1Index = -1;
    this.currentRightPic2Index = -1;
    this.currentLeftPic = 1;
    this.currentRightPic = 1;

    let imageUrls = JSON.parse(this.wrapper.dataset.images);
    this.images = [];

    for (let i = 0; i < imageUrls.length; i++) {
        let preloadedImg = new Image();

        this.images[i] = {
            index: i,
            url: imageUrls[i],
            preloadedImg,
            loaded: false
        };

        preloadedImg.onload = e => {
            this.images[i].loaded = true;

            if (this.currentLeftPic1Index === -1 && this.currentLeftPic === 1) {
                //TODO backdrop should decrease its opacity now
                this.setLeftPicImage(1, this.images[i]);
                return;
            }

            if (this.currentLeftPic2Index === -1 && this.currentLeftPic === 2) {
                this.setLeftPicImage(2, this.images[i]);
                return;
            }

            if (this.currentRightPic1Index === -1 && this.currentRightPic === 1) {
                this.setRightPicImage(1, this.images[i]);
                return;
            }

            if (this.currentRightPic2Index === -1 && this.currentRightPic === 2) {
                this.setRightPicImage(2, this.images[i]);
                return;
            }

        };
        preloadedImg.src = imageUrls[i];
    }

    this.leftPic2.addEventListener('animationstart', e => {
        this.setLeftPicImage(2, this.getNextLeftImage());
    }, false);

    this.leftPic1.addEventListener('animationiteration', e => {
        this.setLeftPicImage(1, this.getNextLeftImage());
    }, false);

    this.leftPic2.addEventListener('animationiteration', e => {
        this.setLeftPicImage(2, this.getNextLeftImage());
    }, false);


    this.rightPic2.addEventListener('animationstart', e => {
        this.setRightPicImage(2, this.getNextRightImage());
    }, false);

    this.rightPic1.addEventListener('animationiteration', e => {
        this.setRightPicImage(1, this.getNextRightImage());
    }, false);

    this.rightPic2.addEventListener('animationiteration', e => {
        this.setRightPicImage(2, this.getNextRightImage());
    }, false);

};

Authorization.prototype.getNextLeftImage = function () {
    let currentVisibleIndex = (this.currentLeftPic === 1) ? this.currentLeftPic1Index : this.currentLeftPic2Index;
    let currentRightIndex = (this.currentRightPic === 1) ? this.currentRightPic1Index : this.currentRightPic2Index;

    let i = (currentVisibleIndex + 1) % this.images.length;
    do {
        if (this.images[i].loaded === true && i !== currentRightIndex)
            return this.images[i];
        i = (i + 1) % this.images.length;
    }
    while (i !== currentVisibleIndex);

    if (this.images[currentRightIndex])
        return this.images[currentRightIndex];

    return null;
};

Authorization.prototype.getNextRightImage = function () {
    let currentVisibleIndex = (this.currentRightPic === 1) ? this.currentRightPic1Index : this.currentRightPic2Index;
    let currentLeftIndex = (this.currentLeftPic === 1) ? this.currentLeftPic1Index : this.currentLeftPic2Index;

    let i = currentVisibleIndex - 1;
    if (i < 0)
        i = this.images.length - 1;

    do {
        if (this.images[i].loaded === true && i !== currentLeftIndex)
            return this.images[i];

        i -= 1;
        if (i === -1)
            i = this.images.length - 1;
    }
    while (i !== currentVisibleIndex);

    if (this.images[currentLeftIndex])
        return this.images[currentLeftIndex];

    return null;
};

Authorization.prototype.setLeftPicImage = function (pic, image) {

    this.currentLeftPic = pic;

    if (pic === 1) {
        if (image) {
            this.currentLeftPic1Index = image.index;
            this.setUrl(this.leftPic1, image.url);
        } else
            this.setUrl(this.leftPic1, null);
    } else if (pic === 2) {
        if (image) {
            this.currentLeftPic2Index = image.index;
            this.setUrl(this.leftPic2, image.url);
        } else
            this.setUrl(this.leftPic2, null);
    }
};


Authorization.prototype.setRightPicImage = function (pic, image) {
    this.currentRightPic = pic;

    if (pic === 1) {
        if (image) {
            this.currentRightPic1Index = image.index;
            this.setUrl(this.rightPic1, image.url);
        } else
            this.setUrl(this.rightPic1, null);
    } else if (pic === 2) {
        if (image) {
            this.currentRightPic2Index = image.index;
            this.setUrl(this.rightPic2, image.url);
        } else
            this.setUrl(this.rightPic2, null);
    }
};

Authorization.prototype.setUrl = function (elem, url) {
    if (url)
        elem.style.backgroundImage = `url('${url}')`;
    else
        elem.style.backgroundImage = 'none';
};

let page = new Authorization({
    elem: document.getElementById('authorization')
});