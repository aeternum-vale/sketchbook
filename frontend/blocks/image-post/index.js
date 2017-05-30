let ImagePost = function(options) {
	this.elem = options.elem;
	this.image = this.elem.querySelector('.image-post__image');
	this.imageWrapper = this.elem.querySelector('.image-post__image-wrapper');
	this.sideBar = this.elem.querySelector('.image-post__sidebar');

};

ImagePost.prototype.resizeImage = function() {
	this.image.removeAttribute('width');
	this.image.removeAttribute('height');

	if (this.image.offsetWidth >= this.image.offsetHeight) {
		if (this.imageWrapper.offsetHeight < this.image.offsetHeight)
			this.image.height = this.imageWrapper.offsetHeight;

		if (this.elem.scrollWidth > this.elem.offsetWidth) {
			this.image.removeAttribute('height');
			this.image.width = this.elem.offsetWidth - this.sideBar.offsetWidth;
		}
	} else {
		if (this.elem.scrollWidth > this.elem.offsetWidth)
			this.image.width = this.elem.offsetWidth - this.sideBar.offsetWidth;

		if (this.imageWrapper.offsetHeight < this.image.offsetHeight) {
			this.image.removeAttribute('width');
			this.image.height = this.imageWrapper.offsetHeight;
		}
	}
};

module.exports = ImagePost;