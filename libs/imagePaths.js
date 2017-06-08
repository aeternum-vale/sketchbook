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

function getAvatarFileNamesByStringId(id){
	let big = `${config.get('userdata:avatar:prefix')}${id}${config.get('userdata:avatar:big:postfix')}${config.get('userdata:avatar:ext')}`;
	let medium = `${config.get('userdata:avatar:prefix')}${id}${config.get('userdata:avatar:medium:postfix')}${config.get('userdata:avatar:ext')}`;
	let small = `${config.get('userdata:avatar:prefix')}${id}${config.get('userdata:avatar:small:postfix')}${config.get('userdata:avatar:ext')}`;

	return {
		big,
		medium,
		small
	}
}

module.exports = {
	getImageFileNameByStringId,
	getImagePreviewFileNameByStringId,
	getImageFileNameByPath,
	getAvatarFileNamesByStringId
}