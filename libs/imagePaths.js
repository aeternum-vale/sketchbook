let config = require('config');

function getImageFileNameByStringId(id) {
	return `${config.get('userdata:image:prefix')}${id}.${config.get('userdata:image:ext')}`;
}

function getImagePreviewFileNameByStringId(id) {
	return `${config.get('userdata:image:prefix')}${id}${config.get('userdata:preview:postfix')}.${config.get('userdata:preview:ext')}`;
}

function getImageFileNameByPath(path) {
	return path.substring(path.lastIndexOf('\\') + 1);
}

module.exports = {
	getImageFileNameByStringId,
	getImagePreviewFileNameByStringId,
	getImageFileNameByPath
}