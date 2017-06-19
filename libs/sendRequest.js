let ServerError = require(LIBS + 'componentErrors').ServerError;
let ClientError = require(LIBS + 'componentErrors').ClientError;

module.exports = function(bodyObj, method, url, cb) {

    let body = '';
    if (!(bodyObj instanceof String)) {
        for (let key in bodyObj)
            body += (body === '' ? '' : '&') +
            key + '=' + encodeURIComponent(bodyObj[key]);
    } else
        body = bodyObj;


	


    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;

        let response;

        if (this.responseText)
            response = JSON.parse(this.responseText);
        else {
            cb(new ServerError('Server is not responding'));
            return;
        }

        if (this.status != 200) {
            cb(new ServerError(response.message));
            return;
        }

        if (response.success)
            cb(null, response);
        else
            cb(new ClientError(response.message), response);
    };

    xhr.send(body);
};
