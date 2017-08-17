let imagePaths = require('libs/imagePaths');
let getDateString = require('libs/getDateString');

module.exports = function(image) {
	return {
		_id: image._id,
		author: image.author,
		comments: image.comments,
		likes: image.likes,
		previewUrl: imagePaths.getImagePreviewUrl(image._id),
        createDateStr: getDateString(image.created)
	};
};