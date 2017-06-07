module.exports = function(markup) {
	let parent = document.createElement('DIV');
	parent.innerHTML = markup; 
	let element = parent.firstElementChild;
	return element;
};