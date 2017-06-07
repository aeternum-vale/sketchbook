
module.exports = function(wrapper) {
	let parent = document.createElement('DIV');
	parent.innerHTML = require('html-loader!./upload-image-modal-window');
	let uplWindow = parent.firstElementChild;
	wrapper.appendChild(uplWindow);
	return uplWindow;
};