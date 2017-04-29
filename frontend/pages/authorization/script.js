import './style.less';

let content = document.getElementsByClassName("window__content")[0];

addEventListener('focus', function(e) {
	if (e.target.classList && e.target.classList.contains('textbox__field')) {
		let tb = e.target.closest('.textbox');
		if (tb)
			tb.classList.add('textbox_focus');
	}
}, true);

addEventListener('blur', function(e) {
	if (e.target.classList && e.target.classList.contains('textbox__field')) {
		let tb = e.target.closest('.textbox');
		if (tb)
			tb.classList.remove('textbox_focus');
	}
}, true);


let props = {

	username: {
		re: {
			value: /^[A-Z0-9-_]+$/i,
			msg: 'must only contain alphanumeric symbols'
		},
		min: 4,
		max: 30
	},
	email: {
		re: {
			value: /^(\w+[-\.]??)+@[\w.-]+\w\.\w{2,5}$/i,
			msg: 'incorrect e-mail address'
		},
		min: 6,
		max: 100
	},

	password: {
		re: {
			value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/,
			msg: 'your password is too weak'
		},
		min: 6,
		max: 32
	}
};


document.forms.auth.onsubmit = function(e) {

	e.preventDefault();

	let err = false;
	let body = '';

	for (let key in props) {
		let errorTextBox = document.forms.auth[key].parentElement.querySelector('.textbox__error');
		let fieldValue = document.forms.auth[key].value;

		errorTextBox.textContent = '';

		if (fieldValue.length === 0) {
			errorTextBox.textContent = "this field can't be empty";
			err = true;
		} else
		if (props[key].min && fieldValue.length < props[key].min) {
			errorTextBox.textContent = `${key} must be greater than ${props[key].min - 1} symbols`;
			err = true;
		} else
		if (props[key].max && fieldValue.length > props[key].max) {
			errorTextBox.textContent = `${key} must be lower than ${props[key].max + 1} symbols`;
			err = true;
		} else
		if (props[key].re && !props[key].re.value.test(fieldValue)) {
			errorTextBox.textContent = props[key].re.msg;
			err = true;
		}
		//body +=
	}

	var xhr = new XMLHttpRequest();
	xhr.open("POST", '/submit', true)
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')

	xhr.onreadystatechange = function() {
		if (this.readyState != 4) return;
		// по окончании запроса доступны:
		// status, statusText
		// responseText, responseXML (при content-type: text/xml)
		if (this.status != 200) {
			alert('ошибка: ' + (this.status ? this.statusText :
				'запрос не удался'));
			return;
		}
		// получить результат из this.responseText или this.responseXML
	};

	if (!err)
		xhr.send(body);
};