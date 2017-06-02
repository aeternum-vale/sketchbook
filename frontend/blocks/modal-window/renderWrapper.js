module.exports = function() {
	let wrapper = document.createElement('DIV');
	wrapper.className = 'modal-window-wrapper modal-window-wrapper_invisible';
	wrapper.id = 'modal-window-wrapper';
	document.body.appendChild(wrapper);
	return wrapper;
};