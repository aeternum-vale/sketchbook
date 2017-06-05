let imagePaths = require('libs/imagePaths');

module.exports = function(image) {
	return {
		_id: image._id,
		author: image.author,
		comments: image.comments,
		likes: image.likes,
		previewUrl: imagePaths.getImagePreviewFileNameByStringId(image._id)
	};
}