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