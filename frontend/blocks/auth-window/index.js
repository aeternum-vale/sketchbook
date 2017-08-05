let checkUserData = require(LIBS + 'checkUserData');
let eventMixin = require(LIBS + 'eventMixin');
let ClientError = require(LIBS + 'componentErrors').ClientError;
let Form = require(BLOCKS + 'form');

let AuthWindow = function(options) {
    this.elem = options.elem;
    this.isLoginFormActive = options.isLoginFormActive;


    this.panel = this.elem.querySelector('div.window__panel');
    this.loginFormElem = this.elem.querySelector('form[name="login"]');
    this.joinFormElem = this.elem.querySelector('form[name="join"]');




    if (!this.isLoginFormActive)
        this.setJoin();
    else
        this.setLogin();



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

    this.joinForm.on('form_sent', e => {
        this.redirect();
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



    this.elem.onclick = e => {

        if (e.target.matches('.window__message .ref')) {
            this.toggle();
            this.trigger('switch', {
                isLoginFormActive: this.isLoginFormActive
            });
        }

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

AuthWindow.prototype.redirect = function() {
    let url = '/';
    url = localStorage.getItem('redirected_url') || url;
    localStorage.removeItem('redirected_url');
    window.location = url;
};

AuthWindow.prototype.setJoin = function() {
    //this.joinForm.clear();

    this.joinFormElem.classList.remove('auth-window__form_invisible');
    this.loginFormElem.classList.add('auth-window__form_invisible');
    this.joinFormElemHeight = this.joinFormElemHeight || this.joinFormElem.scrollHeight;
    this.panel.style.height = `${this.joinFormElemHeight}px`;

    this.isLoginFormActive = false;
};

AuthWindow.prototype.setLogin = function() {
    //this.loginForm.clear();

    this.loginFormElem.classList.remove('auth-window__form_invisible');
    this.joinFormElem.classList.add('auth-window__form_invisible');
    this.loginFormElemHeight = this.loginFormElemHeight || this.loginFormElem.scrollHeight;
    this.panel.style.height = `${this.loginFormElemHeight}px`;

    this.isLoginFormActive = true;
};

AuthWindow.prototype.toggle = function() {
    if (this.isLoginFormActive)
        this.setJoin();
    else
        this.setLogin();
};

for (let key in eventMixin) {
    AuthWindow.prototype[key] = eventMixin[key];
}

module.exports = AuthWindow;
