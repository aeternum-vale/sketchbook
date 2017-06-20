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

    'non-empty': {
        checks: [
            checks.nonEmpty()
        ]
    },

    'email': {
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
            checks.nonEmpty('re-enter [property]'), {
                errorMessage: 'passwords do not match',
                test: function(value, dataChunk, data) {
					let originalPass = dataChunk.password;
					if (!originalPass)
						throw new Error('no original password reference');

					for (let i = 0; i < data.length; i++)
						if (data[i].property === originalPass)
							return (value === data[i].value);

					throw new Error('no orginal password data');
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
    },

    'comment': {
        checks: [
            checks.nonEmpty(),
            checks.max(255)
        ]
    }

};



function getErrorArray(data) {

	if (!Array.isArray(data)) {
		let correctData = [];
		for (let key in data) {
			correctData.push({
				property: key,
				value: data[key]
			});
		}
		data = correctData;
	}

    let result = [];

    for (let i = 0; i < data.length; i++) {
		let key = data[i].validator;
		if (!key)
			key = data[i].property;

        if (!validators[key])
            throw new Error('no validator for this property: ' + key);

        validators[key].checks.forEach(check => {
            if (!check.test(data[i].value, data[i], data))
                result.push({
                    property: data[i].property,
                    message: computeErrorMessage(check.errorMessage, data[i].alias || data[i].property || key)
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
