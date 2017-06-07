let SocialCollection = function(options) {

	this.elem = options.elem;
	this.socialList = this.elem.querySelector('.social-collection__social-list');
	this.textbox = this.elem.querySelector('.textbox__field');

	this.elem.onclick = e => {
		if (!e.target.matches('.textbox-button__button')) return;

		if (this.textbox.value)
			this.insertNewSocial(this.textbox.value);
	};

}


SocialCollection.prototype.insertNewSocial = function(link) {
	let social = require(LIBS + 'renderElement')(require('html-loader!./social'));
	social.querySelector('.social-collection__link').textContent = `/${link}`;
	this.socialList.appendChild(social);
};

module.exports = SocialCollection;