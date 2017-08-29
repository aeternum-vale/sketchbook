let debug = require('debug')('app:imageServer');
let config = require('config');
let fs = require('fs');
let rp = require('request-promise');

const accessToken = config.get('userdata:accessToken');
const TEMPORARY_LINK_EXISTENCE_TIME_MS = 3.95 * 60 * 60 * 1000;
let temporaryLinkCache = {}; //{date, link}

function getTemporaryLink(fileName, defaultValue) {

    if (temporaryLinkCache[fileName] &&
        (temporaryLinkCache[fileName].date + TEMPORARY_LINK_EXISTENCE_TIME_MS > Date.now()))
        return Promise.resolve(temporaryLinkCache[fileName].link);
    else
        delete temporaryLinkCache[fileName];


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

        temporaryLinkCache[fileName] = {
            date: Date.now(),
            link: response.link
        };

        return response.link;
    }).catch(() => {
        return defaultValue || '/egg.png';
    });
}


function add(filePath, fileName) {
    let parameters = {
        "path": `/${fileName}`,
        "mode": "overwrite",
        "autorename": true,
        "mute": true
    };

    let options = {
        method: 'POST',
        uri: 'https://content.dropboxapi.com/2/files/upload',
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Dropbox-API-Arg": JSON.stringify(parameters),
            "Content-Type": "application/octet-stream"
        },
        body: fs.createReadStream(filePath)
    };
    return rp(options);
}


function remove(fileName) {
    let options = {
        method: 'POST',
        uri: 'https://api.dropboxapi.com/2/files/delete_v2',
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: {
            path: `/${fileName}`
        },
        json: true
    };

    return rp(options);
}

module.exports = {
    add,
    remove,
    getTemporaryLink
};