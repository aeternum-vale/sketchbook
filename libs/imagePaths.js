let config = require('config');
let path = require('path');
let rp = require('request-promise');

function getTemporaryLink(fileName) {
    const accessToken = config.get('userdata:accessToken');
    let options = {
        method: 'POST',
        uri: 'https://api.dropboxapi.com/2/files/get_temporary_link',
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: {
            path: `/${fileName}`
        },
        json: true
    };

    return rp(options).then(response => {
        return response.link;
    });
}

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

function getImageUrl(id) {

    return getTemporaryLink(getImageFileNameById(id));
    //return `/${getImageFileNameById(id)}`;
}

function getImagePreviewUrl(id) {
    return getTemporaryLink(getImagePreviewFileNameById(id));
   // return `/${getImagePreviewFileNameById(id)}`;
}

module.exports = {
    getImageFileNameById,
    getImagePreviewFileNameById,
    getImageFileNameByPath,
    getAvatarPathsById,
    getAvatarFileNamesById,
    getImageUrl,
    getImagePreviewUrl
};
