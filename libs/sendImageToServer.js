let debug = require('debug')('app:sendImageToServer');
let config = require('config');
let fs = require('fs');
let rp = require('request-promise');

module.exports = function(filePath, fileName) {
    const accessToken = config.get('userdata:accessToken');

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

    return rp(options)
        .then(function (response) {
            debug('uploading to image server responsed:', response);
        })
        .catch(function (err) {
            debug('uploading to image server failed');
        });

};


