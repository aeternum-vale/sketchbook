let checkUserData = require(LIBS + 'checkUserData');
let eventMixin = require(LIBS + 'eventMixin');
let ClientError = require(LIBS + 'componentErrors').ClientError;
let Form = require(BLOCKS + 'form');

let AuthWindow = function (options) {
    this.elem = options.elem;
    this.isLoginFormActive = options.isLoginFormActive;
    this.isAvailable = true;
    this.headerElem = this.elem.querySelector('.window__header');

    this.panel = this.elem.querySelector('div.window__panel');
    this.loginFormElem = this.elem.querySelector('form[name="login"]');
    this.joinFormElem = this.elem.querySelector('form[name="join"]');

    this.setJoinAEHandler = this.setJoinAEHandler.bind(this);
    this.setLoginAEHandler = this.setLoginAEHandler.bind(this);


    this.joinForm = new Form({
        elem: this.joinFormElem,
        fields: {
            'username': {},
            'email': {
                alias: 'e-mail'
            },
            'password': {},
            'password-again': {
                extra: true,
                password: 'password',
                alias: 'password'
            }
        },
        url: '/join'
    });

    this.loginForm = new Form({
        elem: this.loginFormElem,
        fields: {
            'username': {
                validator: 'non-empty'
            },
            'password': {
                validator: 'non-empty'
            }
        },
        url: '/login'
    });


    this.loginForm.on('form_sent', e => {
        this.redirect();
    });
    this.joinForm.on('form_sent', e => {
        this.redirect();
    });

    if (!this.isLoginFormActive)
        this.setJoinAEHandler();
    else
        this.setLoginAEHandler();

    this.elem.onclick = e => {

        if (this.isAvailable)
            if (e.target.matches('.window__message .ref'))
                this.toggle();
    };

    this.elem.addEventListener('focus', e => {
        if (e.target.classList && e.target.classList.contains('textbox__field')) {
            let tb = e.target.closest('.textbox');
            if (tb)
                tb.classList.add('textbox_focus');
        }
    }, true);

    this.elem.addEventListener('blur', e => {
        if (e.target.classList && e.target.classList.contains('textbox__field')) {
            let tb = e.target.closest('.textbox');
            if (tb)
                tb.classList.remove('textbox_focus');
        }
    }, true);
};

AuthWindow.prototype.redirect = function () {
    let url = '/';
    url = localStorage.getItem('redirected_url') || url;
    localStorage.removeItem('redirected_url');
    window.location = url;
};

AuthWindow.prototype.setJoin = function (isPopState) {
    this.joinForm.clear();
    this.isAvailable = false;
    this.loginForm.setAvailable(false);
    this.loginFormElem.classList.add('auth-window__form-fading-out');

    console.log('setJoin ' + isPopState);

    this.trigger('auth-window_switched', {
        isLoginFormActive: false,
        isPopState
    });

    this.loginFormElem.addEventListener('animationend', this.setJoinAEHandler, false);
};

AuthWindow.prototype.setJoinAEHandler = function () {
    this.headerElem.textContent = 'signing up';

    this.isAvailable = true;
    this.loginForm.setAvailable(true);
    this.loginFormElem.classList.remove('auth-window__form-fading-out');
    this.loginFormElem.classList.add('auth-window__form_invisible');
    this.joinFormElem.classList.remove('auth-window__form_invisible');
    this.joinFormElemHeight = this.joinFormElemHeight || this.joinFormElem.scrollHeight;
    this.panel.style.height = `${this.joinFormElemHeight}px`;
    this.isLoginFormActive = false;
    this.loginFormElem.removeEventListener('animationend', this.setJoinAEHandler);



};

AuthWindow.prototype.setLogin = function (isPopState) {
    this.loginForm.clear();
    this.isAvailable = false;
    this.joinForm.setAvailable(false);
    this.joinFormElem.classList.add('auth-window__form-fading-out');

    console.log('setLogin ' + isPopState);

    this.trigger('auth-window_switched', {
        isLoginFormActive: true,
        isPopState
    });

    this.joinFormElem.addEventListener('animationend', this.setLoginAEHandler, false);
};

AuthWindow.prototype.setLoginAEHandler = function () {
    this.headerElem.textContent = 'logging in';

    this.isAvailable = true;
    this.joinForm.setAvailable(true);
    this.joinFormElem.classList.remove('auth-window__form-fading-out');
    this.joinFormElem.classList.add('auth-window__form_invisible');
    this.loginFormElem.classList.remove('auth-window__form_invisible');
    this.loginFormElemHeight = this.loginFormElemHeight || this.loginFormElem.scrollHeight;
    this.panel.style.height = `${this.loginFormElemHeight}px`;
    this.isLoginFormActive = true;
    this.joinFormElem.removeEventListener('animationend', this.setLoginAEHandler);


};

AuthWindow.prototype.toggle = function () {
    if (this.isLoginFormActive)
        this.setJoin();
    else
        this.setLogin();
};

for (let key in eventMixin) {
    AuthWindow.prototype[key] = eventMixin[key];
}

module.exports = AuthWindow;
