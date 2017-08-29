let config = require('config');
let path = require('path');
let rp = require('request-promise');

let debug = require('debug')('app:imagePath');
let getTemporaryLink = require('libs/imageServer').getTemporaryLink;


function getImageFileNameById(id) {
    return `${config.get('userdata:image:prefix')}${id}.${config.get('userdata:image:ext')}`;
}

function getImagePreviewFileNameById(id) {
    return `${config.get('userdata:image:prefix')}${id}${config.get('userdata:preview:postfix')}.${config.get('userdata:preview:ext')}`;
}

function getImageFileNameByPath(path) {
    return path.substring(path.lastIndexOf('\\') + 1);
}

function getAvatarPathsById(id) {
    let uploadDir = path.resolve(config.get('userdata:dir'));

    let big = path.join(uploadDir, `${config.get('userdata:avatar:prefix')}${id}${config.get('userdata:avatar:big:postfix')}.${config.get('userdata:avatar:ext')}`);
    let medium = path.join(uploadDir, `${config.get('userdata:avatar:prefix')}${id}${config.get('userdata:avatar:medium:postfix')}.${config.get('userdata:avatar:ext')}`);
    let small = path.join(uploadDir, `${config.get('userdata:avatar:prefix')}${id}${config.get('userdata:avatar:small:postfix')}.${config.get('userdata:avatar:ext')}`);

    return {
        big,
        medium,
        small
    }
}

function getAvatarFileNamesById(id) {

    let big = `${config.get('userdata:avatar:prefix')}${id}${config.get('userdata:avatar:big:postfix')}.${config.get('userdata:avatar:ext')}`;
    let medium = `${config.get('userdata:avatar:prefix')}${id}${config.get('userdata:avatar:medium:postfix')}.${config.get('userdata:avatar:ext')}`;
    let small = `${config.get('userdata:avatar:prefix')}${id}${config.get('userdata:avatar:small:postfix')}.${config.get('userdata:avatar:ext')}`;

    return {
        big,
        medium,
        small
    }
}

function getAvatarUrls(id) {
    let avatarFileNames = getAvatarFileNamesById(id);
    return Promise.all([
        getTemporaryLink(avatarFileNames.big, config.get('static:anonAvatarUrl')),
        getTemporaryLink(avatarFileNames.medium, config.get('static:anonAvatarUrl')),
        getTemporaryLink(avatarFileNames.small, config.get('static:anonAvatarUrl'))
    ]).then(links => {
        return {
            big: links[0],
            medium: links[1],
            small: links[2]
        }
    });
}

function getImageUrl(id) {
    return getTemporaryLink(getImageFileNameById(id));
}

function getImagePreviewUrl(id) {
    return getTemporaryLink(getImagePreviewFileNameById(id));
}

module.exports = {
    getImageFileNameById,
    getImagePreviewFileNameById,
    getImageFileNameByPath,
    getAvatarPathsById,
    getAvatarFileNamesById,
    getImageUrl,
    getImagePreviewUrl,
    getAvatarUrls
};
