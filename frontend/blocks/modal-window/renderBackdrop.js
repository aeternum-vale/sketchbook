module.exports = function() {
	let backdrop = document.createElement('DIV');
	backdrop.className = 'backdrop backdrop_invisible';
	backdrop.id = 'backdrop';
	document.body.appendChild(backdrop);
	return backdrop;
};