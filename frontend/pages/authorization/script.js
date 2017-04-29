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


let joinButton = document.getElementById('join');



joinButton.onclick = function(e) {
	var xhr = new XMLHttpRequest();

	let username = document.getElementById('username').value;
	let email = document.getElementById('email').value;

	var body = 'username=' + encodeURIComponent(username) +
		'&email=' + encodeURIComponent(email);

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

		alert(this.responseText);

	};

	xhr.send(body);
};