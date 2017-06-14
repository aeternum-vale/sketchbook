let checkUserData = require(LIBS + 'checkUserData');
let eventMixin = require(LIBS + 'eventMixin');
let ClientError = require(LIBS + 'componentErrors').ClientError;

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



let AuthWidget = function(options) {
	this.elem = options.elem;

	this.joinForm = this.elem.querySelector('form[name="join"]');
	this.loginForm = this.elem.querySelector('form[name="login"]');

	this.joinWindow = this.elem.querySelector('.join-window');
	this.loginWindow = this.elem.querySelector('.login-window');

	this.loginWindowActive = true;

	this.elem.onclick = e => {

		if (e.target.matches('.window__message .ref')) {
			this.toggle();
			this.trigger('switch', {
				loginWindowActive: this.loginWindowActive
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

	require(LIBS + 'sendRequest')(body, 'POST', '/login', (err, response) => {

		if (err) {
			this.error(err);
			return;
		}

		this.trigger('authorized', {
			url: response.url
		});

	});
};

AuthWidget.prototype.submitJoinForm = function() {
	let errors = checkUserData.getErrorArray(this.getOptionsObj());

	if (errors.length === 0) {

		let body = '';

		fields.forEach(item => {
			if (!item.extra)
				body += (body === '' ? '' : '&') +
				item.name + '=' + encodeURIComponent(this.joinForm[item.name].value);
		});


		require(LIBS + 'sendRequest')(body, 'POST', '/join', (err, response) => {

			if (err) {
				if (err instanceof ClientError)
					this.setPropertyError(response.property, response.message);
				else
					this.error(err);
				return;
			}

			this.trigger('authorized', {
				url: response.url
			});

		});

	} else {
		this.clearJoin();
		for (let i = 0; i < errors.length; i++)
			if (this.getJoinErrorTextBox(errors[i].property).textContent == '')
				this.setPropertyError(errors[i].property, errors[i].message);
	}


};

AuthWidget.prototype.getOptionsObj = function() {
	let options = [];
	fields.forEach(item => {
		let dataChunk = {
			property: item.name,
			value: this.joinForm[item.name].value
		};
		if (item.name == 'password-again') {
			dataChunk.password = 'password';
			dataChunk.alias = 'password';
		}

		options.push(dataChunk);
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


AuthWidget.prototype.clearJoin = function() {
	fields.forEach(item => {
		this.getJoinErrorTextBox(item.name).textContent = '';
	});
};

AuthWidget.prototype.setJoin = function() {
	this.clearJoin();

	this.loginWindow.classList.add('window_invisible');
	this.joinWindow.classList.remove('window_invisible');

	this.loginWindowActive = false;
};

AuthWidget.prototype.setLogin = function() {
	this.joinWindow.classList.add('window_invisible');
	this.loginWindow.classList.remove('window_invisible');

	this.loginWindowActive = true;
};

AuthWidget.prototype.toggle = function() {
	if (this.loginWindowActive)
		this.setJoin();
	else
		this.setLogin();
};

for (let key in eventMixin) {
	AuthWidget.prototype[key] = eventMixin[key];
}

module.exports = AuthWidget;
