let checkUserData = require(LIBS + 'checkUserData');
let eventMixin = require(LIBS + 'eventMixin');

let fields = [{
	name: 'username'
}, {
	name: 'email'
}, {
	name: 'password'
}, {
	name: 'password-again',
	extra: true
}];

let loginWindowActive = true;

let AuthWidget = function(options) {
	this.elem = options.elem;

	this.joinForm = this.elem.querySelector('form[name="join"]');
	this.loginForm = this.elem.querySelector('form[name="login"]');

	this.joinWindow = this.elem.querySelector('.join-window');
	this.loginWindow = this.elem.querySelector('.login-window');

	this.elem.onclick = e => {

		if (e.target.matches('.window__message .ref')) {
			this.toggle();
			this.trigger('change', {
				loginWindowActive
			});
		}

	};

	this.elem.onsubmit = e => {
		e.preventDefault();

		if (e.target === this.joinForm)
			this.submitJoinForm();
		else if (e.target === this.loginForm)
			this.submitLoginForm();
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


AuthWidget.prototype.submitLoginForm = function() {
	let body = `username=${
      		encodeURIComponent(this.loginForm['username'].value)}&password=${
         	encodeURIComponent(this.loginForm['password'].value)}`;

	require(LIBS + 'sendXHR')(body, 'POST', '/login', (err, response) => {

		if (err) {
			this.error(err);
			return;
		}

		this.trigger('submit', {
			url: response.url
		});

	});
};

AuthWidget.prototype.submitJoinForm = function() {
	let result = checkUserData(this.getOptionsObj());
	let body = '';

	if (!result.success)
		for (let i = 0; i < result.errors.length; i++)
			this.setPropertyError(result.errors[i].property, result.errors[i].message);
	else
		fields.forEach(item => {
			if (!item.extra)
				body += (body === '' ? '' : '&') + item.name + '=' + encodeURIComponent(joinForm[item.name].value);
		});


	if (result.success)
		require(LIBS + 'sendXHR')(body, 'POST', '/join', (err, response) => {

			if (err) {
				if (response || response.property) {
					this.setPropertyError(response.property, response.message);
					return;
				}
				this.error(err);
				return;
			}

			this.trigger('submit', {
				url: response.url
			});

		});
};

AuthWidget.prototype.getOptionsObj = function(property, message) {
	let options = {};
	fields.forEach(item => {
		options[item.name] = this.joinForm[item.name].value;
		this.getJoinErrorTextBox(item.name).textContent = '';
	});

	return options;
};


AuthWidget.prototype.setPropertyError = function(property, message) {
	this.getJoinErrorTextBox(property).textContent = message;
};


AuthWidget.prototype.getJoinErrorTextBox = function(fieldName) {
	return this.joinForm[fieldName].parentElement.querySelector('.textbox__error');
};

AuthWidget.prototype.setJoin = function() {
	fields.forEach(item => {
		this.getJoinErrorTextBox(item.name).textContent = '';
	});

	this.loginWindow.classList.add('window_invisible');
	this.joinWindow.classList.remove('window_invisible');

	loginWindowActive = false;
};

AuthWidget.prototype.setLogin = function() {
	this.joinWindow.classList.add('window_invisible');
	this.loginWindow.classList.remove('window_invisible');

	loginWindowActive = true;
};

AuthWidget.prototype.toggle = function() {
	if (loginWindowActive)
		this.setJoin();
	else
		this.setLogin();
};

for (let key in eventMixin) {
	AuthWidget.prototype[key] = eventMixin[key];
}

module.exports = AuthWidget;