module.exports = function(id) {

	let elem = document.getElementById(id);

	if (elem)
		elem.onclick = function(e) {
			this.classList.toggle('user-menu_active');
			this.classList.toggle('header-element_active');
		};

};