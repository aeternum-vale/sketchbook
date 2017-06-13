//let debug = require('debug')('app:checkUserdData');

const PROPERTY_SYMBOL = '[property]';

let messages = {
    plain: 'incorrect [property]',
    empty: '[property] must not be empty',
    tooBig: value => {
        if (value)
            return `[property] must be lower than ${value + 1} symbols`;
        else
            return '[property] is too big';
    },
    tooSmall: value => {
        if (value)
            return `[property] must be greater than ${value - 1} symbols`;
        else
            return '[property] is too short';
    }
};

let tests = {
    regExp: (regExp, value) => regExp.test(value),
    max: (max, value) => (value.length <= max),
    min: (min, value) => (value.length >= min),
    nonEmpty: (value) => (value.length > 0)
};


let checks = {
    max: (value, errorMessage) => {
        return {
            errorMessage: errorMessage || messages.tooBig(value),
            test: tests.max.bind(null, value)
        };
    },

    min: (value, errorMessage) => {
        return {
            errorMessage: errorMessage || messages.tooSmall(value),
            test: tests.min.bind(null, value)
        };
    },

    nonEmpty: (errorMessage) => {
        return {
            errorMessage: errorMessage || messages.empty,
            test: tests.nonEmpty
        };
    }
};

function computeErrorMessage(template, property) {
    let pos;
    template = template || messages.plain;
    property = property || 'this property';
    while (~(pos = template.indexOf(PROPERTY_SYMBOL)))
        template = template.substring(0, pos) + property + template.substring(pos + PROPERTY_SYMBOL.length);
    return template;
}

let validators = {

    'email': {
        alias: 'e-mail',
        checks: [
            checks.nonEmpty(),
            checks.max(100, messages.tooBig()),
            checks.min(6, messages.tooSmall()), {
                test: tests.regExp.bind(null, /^(\w+[-\.]??)+@[\w.-]+\w\.\w{2,5}$/i)
            }
        ]
    },


    'username': {
        checks: [
            checks.nonEmpty(),
            checks.max(30),
            checks.min(5), {
                errorMessage: 'must only contain alphanumeric symbols',
                test: tests.regExp.bind(null, /^[A-Z0-9-]+$/i)
            }
        ]
    },


    'password': {
        checks: [
            checks.nonEmpty(),
            checks.max(30),
            checks.min(5), {
                errorMessage: '[property] is too weak',
                test: tests.regExp.bind(null, /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/)
            }

        ]
    },


    'password-again': {
        checks: [
            checks.nonEmpty('re-enter your password'), {
                errorMessage: 'passwords do not match',
                test: function(value, data) {
                    return (value === data['password']);
                }
            }

        ]
    },


    'url': {
        checks: [{
            test: function(value) {
                let urlRegex = '^(?!mailto:)(?:(?:http|https)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
                let url = new RegExp(urlRegex, 'i');
                return value.length < 2083 && url.test(value);
            }
        }]
    },


    'description': {
        checks: [
            checks.max(255)
        ]
    }

};



function getErrorArray(data) {
    let result = [];

    for (let key in data) {

        if (!validators[key])
            throw new Error('no validator for this property');

        validators[key].checks.forEach(check => {
            if (!check.test(data[key], data))
                result.push({
                    property: key,
                    message: computeErrorMessage(check.errorMessage, validators[key].alias || key)
                });
        });
    }

    return result;
}

function testProperty(name, value) {
		let result = true;
    validators[name].checks.forEach(check => {

        if (!check.test(value))
            result = false;
    });
    return result;
}

module.exports = {
    getErrorArray,
    testProperty
};
