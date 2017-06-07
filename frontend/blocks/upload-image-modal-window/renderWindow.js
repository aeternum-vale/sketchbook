module.exports = function(wrapper) {
	let uplWindow = document.createElement('DIV');
	uplWindow.className = 'window window_invisible modal-window upload-image-modal-window';
	uplWindow.id = 'upload-image-modal-window';
	uplWindow.innerHTML = require('./template.handlebars');

	wrapper.appendChild(uplWindow);
	return uplWindow;
};