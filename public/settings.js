webpackJsonp([10,1],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	__webpack_require__(52);

	var GlobalErrorHandler = __webpack_require__(21);
	var globalErrorHandler = new GlobalErrorHandler();

	var Dropdown = __webpack_require__(35);
	var SocialCollection = __webpack_require__(54);
	var UploadAvatarSection = __webpack_require__(57);
	var DescriptionAddSection = __webpack_require__(60);
	var Form = __webpack_require__(31);
	var MessageModalWindow = __webpack_require__(23);

	var userMenuDropdown = new Dropdown({
	    elem: document.getElementById('user-menu'),
	    className: 'header-element'
	});

	var socialCollection = new SocialCollection({
	    elem: document.getElementById('social-collection')
	});

	var uploadAvatarSection = new UploadAvatarSection({
	    elem: document.getElementById('upload-avatar-section')
	});

	var descriptionAddSection = new DescriptionAddSection({
	    elem: document.getElementById('description-add-section')
	});

	var passwordChangeForm = new Form({
	    elem: document.forms['change-password'],
	    fields: {
	        'old-password': {
	            validator: 'non-empty',
	            alias: 'old password'
	        },

	        'new-password': {
	            validator: 'password',
	            alias: 'new password'
	        },

	        'new-again': {
	            validator: 'password-again',
	            alias: 'new password',
	            password: 'new-password',
	            extra: true
	        }
	    },
	    url: '/settings'
	});

	passwordChangeForm.on('form_sent', function (e) {
	    var messageModalWindow = new MessageModalWindow({ message: 'Password has been successfully changed' });
	    messageModalWindow.show();
	});

/***/ }),
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */
/***/ (function(module, exports) {

	"use strict";

	function CustomError(message) {
		this.name = "CustomError";
		this.message = message;

		if (Error.captureStackTrace) Error.captureStackTrace(this, CustomError);else this.stack = new Error().stack;
	}
	CustomError.prototype = Object.create(Error.prototype);
	CustomError.prototype.constructor = CustomError;

	function ComponentError(message, status) {
		CustomError.call(this, message || 'An error has occurred');
		this.name = "ComponentError";
		this.status = status;
	}
	ComponentError.prototype = Object.create(CustomError.prototype);
	ComponentError.prototype.constructor = ComponentError;

	function ClientError(message, detail, status) {
		ComponentError.call(this, message || 'An error has occurred. Retry later', status);
		this.name = "ClientError";
		this.detail = detail;
	}
	ClientError.prototype = Object.create(ComponentError.prototype);
	ClientError.prototype.constructor = ClientError;

	function ImageNotFound(message) {
		ClientError.call(this, message || 'Image not found. It probably has been removed', null, 404);
		this.name = "ImageNotFound";
	}
	ImageNotFound.prototype = Object.create(ClientError.prototype);
	ImageNotFound.prototype.constructor = ImageNotFound;

	function ServerError(message, status) {
		ComponentError.call(this, message || 'There is some error on the server side. Retry later', status);
		this.name = "ServerError";
	}
	ServerError.prototype = Object.create(ComponentError.prototype);
	ServerError.prototype.constructor = ServerError;

	module.exports = {
		ComponentError: ComponentError,
		ClientError: ClientError,
		ImageNotFound: ImageNotFound,
		ServerError: ServerError
	};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var Modal = __webpack_require__(24);

	var MessageModalWindow = function MessageModalWindow(options) {
	    Modal.apply(this, arguments);
	    this.elem = null;
	    this.elemId = 'message-modal-window';
	    this.caption = options && options.caption || 'message';
	    this.message = options && options.message || 'You were not suppose to see this! Seems like something is broken :(';
	};
	MessageModalWindow.prototype = Object.create(Modal.prototype);
	MessageModalWindow.prototype.constructor = MessageModalWindow;

	MessageModalWindow.prototype.setElem = function () {
	    var _this = this;

	    this.setWindowHtml();
	    this.elem = document.getElementById(this.elemId);
	    if (!this.elem) this.elem = this.renderWindow(this.windowHtml);
	    this.setListeners();
	    this.elem.querySelector('.header').textContent = this.caption;
	    this.elem.querySelector('.message-modal-window__message').textContent = this.message;

	    this.elem.onclick = function (e) {
	        _this.onElemClick(e);
	        if (e.target.matches('.message-modal-window__ok-button')) _this.deactivate();
	    };
	};

	MessageModalWindow.prototype.setWindowHtml = function () {
	    this.windowHtml = __webpack_require__(28);
	};

	MessageModalWindow.prototype.show = function () {
	    Modal.prototype.show.apply(this);

	    if (!this.elem) this.setElem();

	    this.elem.classList.remove('window_invisible');
	};

	MessageModalWindow.prototype.hide = function () {
	    Modal.prototype.hide.apply(this);
	    this.elem.classList.add('window_invisible');
	};

	module.exports = MessageModalWindow;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var eventMixin = __webpack_require__(25);
	var Spinner = __webpack_require__(26);

	var Modal = function Modal(options) {
	    this.active = false;
	    this.listeners = [];
	    this.status = options && options.status || Modal.statuses.MINOR;
	};

	Modal.statuses = {
	    MAJOR: 1,
	    MINOR: 2
	};

	Modal.prototype.onElemClick = function (e) {
	    if (e.target.matches('.modal-close-button')) this.deactivate();
	};

	Modal.prototype.setListeners = function () {
	    var _this = this;

	    this.listeners.forEach(function (item) {
	        _this.elem.addEventListener(item.eventName, item.cb);
	    });
	};

	Modal.setBackdrop = function (status) {
	    if (status === Modal.statuses.MINOR) {
	        Modal.minorBackdrop = document.getElementById('backdrop_minor');
	        if (!Modal.minorBackdrop) Modal.minorBackdrop = Modal.renderBackdrop('minor');
	    } else {
	        Modal.majorBackdrop = document.getElementById('backdrop_major');
	        if (!Modal.majorBackdrop) Modal.majorBackdrop = Modal.renderBackdrop('major');
	    }
	};

	Modal.setWrapper = function (status) {
	    if (status === Modal.statuses.MINOR) {
	        Modal.minorWrapper = document.getElementById('modal-wrapper-minor');
	        if (!Modal.minorWrapper) Modal.minorWrapper = Modal.renderWrapper('minor');
	        Modal.minorWrapper.onclick = function (e) {
	            if (e.target && !e.target.classList.contains('modal-wrapper_minor')) return;
	            if (Modal.minorActive) Modal.minorQueue[0].deactivate();
	        };
	    } else {
	        Modal.majorWrapper = document.getElementById('modal-wrapper-major');
	        if (!Modal.majorWrapper) Modal.majorWrapper = Modal.renderWrapper('major');
	        Modal.majorWrapper.onclick = function (e) {
	            if (e.target && !e.target.classList.contains('modal-wrapper_major')) return;
	            if (Modal.majorActive) Modal.majorQueue[0].deactivate();
	        };
	    }
	};

	Modal.renderBackdrop = function (type) {
	    var backdrop = document.createElement('DIV');
	    backdrop.className = 'backdrop backdrop_invisible';
	    backdrop.classList.add('backdrop_' + type);
	    backdrop.id = 'backdrop-' + type;
	    document.body.appendChild(backdrop);
	    return backdrop;
	};

	Modal.renderWrapper = function (type) {
	    var wrapper = document.createElement('DIV');
	    wrapper.className = 'modal-wrapper modal-wrapper_invisible';
	    wrapper.classList.add('modal-wrapper_' + type);
	    wrapper.id = 'modal-wrapper-' + type;
	    document.body.appendChild(wrapper);
	    return wrapper;
	};

	Modal.prototype.renderWindow = function (html) {

	    var parent = document.createElement('DIV');
	    parent.innerHTML = html;
	    var wnd = parent.firstElementChild;
	    if (this.status === Modal.statuses.MINOR) Modal.minorWrapper.appendChild(wnd);else Modal.majorWrapper.appendChild(wnd);

	    parent.remove();
	    return wnd;
	};

	Modal.prototype.show = function () {
	    if (this.status === Modal.statuses.MINOR) {
	        if (!Modal.minorBackdrop) Modal.setBackdrop(Modal.statuses.MINOR);

	        if (!Modal.minorWrapper) Modal.setWrapper(Modal.statuses.MINOR);

	        Modal.minorWrapper.classList.remove('modal-wrapper_invisible');
	        Modal.minorBackdrop.classList.remove('backdrop_invisible');
	    } else {
	        if (!Modal.majorBackdrop) Modal.setBackdrop(Modal.statuses.MAJOR);

	        if (!Modal.majorWrapper) Modal.setWrapper(Modal.statuses.MAJOR);

	        Modal.majorWrapper.classList.remove('modal-wrapper_invisible');
	        Modal.majorBackdrop.classList.remove('backdrop_invisible');
	    }

	    this.active = true;
	};

	Modal.prototype.activate = function (options) {
	    var _this2 = this;

	    if (this.elemId === 'spinner') {
	        (function () {
	            var spinner = _this2;
	            _this2.on('spinner_host-loaded', function (e) {
	                var newHost = e.detail.host;

	                if (_this2.status === Modal.statuses.MINOR) Modal.minorQueue.splice(Modal.minorQueue.indexOf(spinner) + 1, 0, newHost);else Modal.majorQueue.splice(Modal.majorQueue.indexOf(spinner) + 1, 0, newHost);

	                spinner.deactivate(e.detail.options);
	            });
	        })();
	    }

	    return new Promise(function (resolve, reject) {
	        if (_this2.status === Modal.statuses.MINOR) {
	            Modal.minorQueue.push(_this2);
	            console.log(Modal.minorQueue);
	            console.log(Modal.majorQueue);

	            if (!Modal.minorActive) Modal.minorShow(options).then(function () {
	                resolve();
	            });else resolve();
	        } else {
	            Modal.majorQueue.push(_this2);
	            console.log(Modal.minorQueue);
	            console.log(Modal.majorQueue);

	            if (!Modal.majorActive) Modal.majorShow(options).then(function () {
	                resolve();
	            });else resolve();
	        }
	    });
	};

	Modal.prototype.hide = function () {
	    if (this.status === Modal.statuses.MINOR) {
	        //TODO not neccessary if queue is not empty
	        Modal.minorWrapper.classList.add('modal-wrapper_invisible');
	        Modal.minorBackdrop.classList.add('backdrop_invisible');
	    } else {
	        Modal.majorWrapper.classList.add('modal-wrapper_invisible');
	        Modal.majorBackdrop.classList.add('backdrop_invisible');
	    }
	};

	Modal.prototype.deactivate = function (nextWindowOptions, hideOptions) {

	    this.hide(hideOptions);
	    this.active = false;
	    if (this.status === Modal.statuses.MINOR) {
	        Modal.minorActive = false;
	        Modal.minorQueue.shift();
	        Modal.minorShow(nextWindowOptions);
	    } else {
	        Modal.majorActive = false;
	        Modal.majorQueue.shift();
	        Modal.majorShow(nextWindowOptions);
	    }
	    this.trigger('modal-window_deactivated');
	};

	Modal.minorActive = false;
	Modal.majorActive = false;
	Modal.minorQueue = [];
	Modal.majorQueue = [];

	Modal.spinner = new Spinner();
	Modal.spinner.status = Modal.statuses.MAJOR;

	Modal.showSpinner = function () {
	    Modal.prototype.show.call(Modal.spinner);

	    if (!Modal.spinner.elem) Modal.spinner.elem = document.getElementById('spinner');
	    if (!Modal.spinner.elem) Modal.spinner.elem = Modal.prototype.renderWindow.call(Modal.spinner, Spinner.html);

	    Modal.spinner.show();
	};

	Modal.hideSpinner = function () {
	    Modal.spinner.hide();
	};

	Modal.minorShow = function (options) {
	    var nextModalWindow = Modal.minorQueue[0];
	    if (nextModalWindow) {
	        var promise = nextModalWindow.show(options);
	        if (promise) return promise.then(function () {
	            Modal.minorActive = true;
	        });else {
	            Modal.minorActive = true;
	            return Promise.resolve();
	        }
	    } else {

	        Modal.minorActive = false;
	        return Promise.resolve();
	    }
	};

	Modal.majorShow = function (options) {

	    var nextModalWindow = Modal.majorQueue[0];

	    if (nextModalWindow) {

	        Modal.showSpinner();
	        var promise = nextModalWindow.show(options);

	        if (promise) return promise.then(function () {
	            Modal.majorActive = true;
	            Modal.hideSpinner();
	        });else {
	            Modal.majorActive = true;
	            Modal.hideSpinner();
	            return Promise.resolve();
	        }
	    } else {
	        Modal.majorActive = false;
	        return Promise.resolve();
	    }
	};

	for (var key in eventMixin) {
	    Modal.prototype[key] = eventMixin[key];
		}module.exports = Modal;

/***/ }),
/* 25 */
/***/ (function(module, exports) {

	'use strict';

	module.exports = {

		on: function on(eventName, cb) {
			if (this.elem) this.elem.addEventListener(eventName, cb);else this.listeners.push({
				eventName: eventName,
				cb: cb
			});
		},

		trigger: function trigger(eventName, detail) {
			this.elem.dispatchEvent(new CustomEvent(eventName, {
				bubbles: true,
				cancelable: true,
				detail: detail
			}));
		},

		error: function error(err) {
			this.elem.dispatchEvent(new CustomEvent('error', {
				bubbles: true,
				cancelable: true,
				detail: err
			}));
		}

		};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var Spinner = function Spinner(options) {
	    this.elem = document.getElementById('spinner');
	};

	Spinner.html = __webpack_require__(27);

	Spinner.prototype.show = function () {
	    this.elem.classList.remove('spinner_invisible');
	};

	Spinner.prototype.hide = function () {
	    this.elem.classList.add('spinner_invisible');
	};

	module.exports = Spinner;

/***/ }),
/* 27 */
/***/ (function(module, exports) {

	module.exports = "<div id=\"spinner\" class=\"spinner\">\r\n\r\n</div>";

/***/ }),
/* 28 */
/***/ (function(module, exports) {

	module.exports = "<div class='window modal window_invisible modal-window message-modal-window' id='message-modal-window'>\r\n    <div class=\"header window__header\">\r\n    </div>\r\n\r\n    <div class=\"panel window__panel\">\r\n        <div class=\"message-modal-window__message\">\r\n        </div>\r\n        <div class=\"button message-modal-window__ok-button\">OK</div>\r\n    </div>\r\n    <div class=\"icon-cross modal-close-button\"></div></div>";

/***/ }),
/* 29 */,
/* 30 */
/***/ (function(module, exports) {

	//let debug = require('debug')('app:checkUserdData');

	'use strict';

	var PROPERTY_SYMBOL = '[property]';

	var messages = {
	    plain: 'incorrect [property]',
	    empty: '[property] must not be empty',
	    tooBig: function tooBig(value) {
	        if (value) return '[property] must be lower than ' + (value + 1) + ' symbols';else return '[property] is too big';
	    },
	    tooSmall: function tooSmall(value) {
	        if (value) return '[property] must be greater than ' + (value - 1) + ' symbols';else return '[property] is too short';
	    }
	};

	var tests = {
	    regExp: function regExp(_regExp, value) {
	        return _regExp.test(value);
	    },
	    max: function max(_max, value) {
	        return value.length <= _max;
	    },
	    min: function min(_min, value) {
	        return value.length >= _min;
	    },
	    nonEmpty: function nonEmpty(value) {
	        return value.length > 0;
	    }

	};

	var checks = {
	    max: function max(value, errorMessage) {
	        return {
	            errorMessage: errorMessage || messages.tooBig(value),
	            test: tests.max.bind(null, value)
	        };
	    },

	    min: function min(value, errorMessage) {
	        return {
	            errorMessage: errorMessage || messages.tooSmall(value),
	            test: tests.min.bind(null, value)
	        };
	    },

	    nonEmpty: function nonEmpty(errorMessage) {
	        return {
	            errorMessage: errorMessage || messages.empty,
	            test: tests.nonEmpty
	        };
	    }
	};

	function computeErrorMessage(template, property) {
	    var pos = undefined;
	    template = template || messages.plain;
	    property = property || 'this property';
	    while (~(pos = template.indexOf(PROPERTY_SYMBOL))) template = template.substring(0, pos) + property + template.substring(pos + PROPERTY_SYMBOL.length);
	    return template;
	}

	var validators = {

	    'non-empty': {
	        checks: [checks.nonEmpty()]
	    },

	    'email': {
	        checks: [checks.nonEmpty(), checks.max(100, messages.tooBig()), checks.min(6, messages.tooSmall()), {
	            test: tests.regExp.bind(null, /^(\w+[-\.]??)+@[\w.-]+\w\.\w{2,5}$/i)
	        }]
	    },

	    'username': {
	        checks: [checks.nonEmpty(), checks.max(16), checks.min(5), {
	            errorMessage: 'must only contain alphanumeric symbols and -',
	            test: tests.regExp.bind(null, /^[A-Z0-9-]+$/i)
	        }]
	    },

	    'password': {
	        checks: [checks.nonEmpty(), checks.max(30), checks.min(5), {
	            errorMessage: '[property] is too weak',
	            test: tests.regExp.bind(null, /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/)
	        }]
	    },

	    'password-again': {
	        checks: [checks.nonEmpty('re-enter [property]'), {
	            errorMessage: 'passwords do not match',
	            test: function test(value, dataChunk, data) {
	                var originalPass = dataChunk.password;
	                if (!originalPass) throw new Error('no original password reference');

	                for (var i = 0; i < data.length; i++) {
	                    if (data[i].property === originalPass) return value === data[i].value;
	                }throw new Error('no orginal password data');
	            }
	        }]
	    },

	    'url': {
	        checks: [{
	            test: function test(value) {
	                var urlRegex = '^(?!mailto:)(?:(?:http|https)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
	                var url = new RegExp(urlRegex, 'i');
	                return value.length < 2083 && url.test(value);
	            }
	        }]
	    },

	    'description': {
	        checks: [checks.max(255)]
	    },

	    'comment': {
	        checks: [checks.nonEmpty(), checks.max(255)]
	    }

	};

	function getErrorArray(data) {

	    if (!Array.isArray(data)) {
	        var correctData = [];
	        for (var key in data) {
	            correctData.push({
	                property: key,
	                value: data[key]
	            });
	        }
	        data = correctData;
	    }

	    var result = [];

	    var _loop = function (i) {
	        var key = data[i].validator;
	        if (!key) key = data[i].property;

	        if (!validators[key]) throw new Error('no validator for this property: ' + key);

	        validators[key].checks.forEach(function (check) {
	            if (!check.test(data[i].value, data[i], data)) result.push({
	                property: data[i].property,
	                message: computeErrorMessage(check.errorMessage, data[i].alias || data[i].property || key)
	            });
	        });
	    };

	    for (var i = 0; i < data.length; i++) {
	        _loop(i);
	    }

	    return result;
	}

	function testProperty(name, value) {
	    var result = true;
	    validators[name].checks.forEach(function (check) {

	        if (!check.test(value)) result = false;
	    });
	    return result;
	}

	module.exports = {
	    getErrorArray: getErrorArray,
	    testProperty: testProperty
	};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var eventMixin = __webpack_require__(25);
	var getErrorArray = __webpack_require__(30).getErrorArray;
	var ClientError = __webpack_require__(22).ClientError;

	var Form = function Form(options) {
	    var _this = this;

	    this.elem = options.elem;
	    this.fields = options.fields;
	    this.url = options.url;
	    this.isAvailable = true;

	    this.saveButton = this.elem.querySelector('.save-button');

	    this.elem.onclick = function (e) {
	        if (!_this.isAvailable) return;

	        if (e.target !== _this.saveButton) return;

	        _this.clearErrorBoxes();
	        var errors = _this.getErrors();
	        if (errors.length === 0) _this.send(_this.getBody());else _this.setErrors(errors);
	    };
	};

	Form.prototype.setPropertyError = function (property, message) {
	    this.getErrorBox(property).textContent = message;
	};

	Form.prototype.getErrorBox = function (fieldName) {
	    return this.elem[fieldName].parentElement.querySelector('.textbox__error');
	};

	Form.prototype.setAvailable = function (isAvailable) {
	    this.isAvailable = isAvailable;
	};

	Form.prototype.getDataObj = function () {
	    var options = [];

	    for (var key in this.fields) {
	        var chunk = this.fields[key];
	        if (!chunk.noValidation) {
	            if (!chunk.property) chunk.property = key;
	            chunk.value = this.elem[key].value;
	            options.push(chunk);
	        }
	    }

	    return options;
	};

	Form.prototype.send = function (body) {
	    var _this2 = this;

	    __webpack_require__(32)(body, 'POST', this.url, function (err, response) {
	        if (err) {
	            if (err instanceof ClientError && err.detail) _this2.setPropertyError(err.detail.property, err.message);else _this2.error(err);
	            return;
	        }

	        _this2.clear();
	        _this2.trigger('form_sent', {
	            response: response
	        });
	    });
	};

	Form.prototype.clearErrorBoxes = function () {
	    for (var key in this.fields) {
	        this.getErrorBox(key).textContent = '';
	    }
	};

	Form.prototype.clear = function () {
	    this.clearErrorBoxes();
	    for (var key in this.fields) {
	        this.elem[key].value = '';
	    }
	};

	Form.prototype.getErrors = function () {
	    return getErrorArray(this.getDataObj());
	};

	Form.prototype.setErrors = function (errors) {
	    this.clearErrorBoxes();
	    for (var i = 0; i < errors.length; i++) {
	        if (this.getErrorBox(errors[i].property).textContent == '') this.setPropertyError(errors[i].property, errors[i].message);
	    }
	};

	Form.prototype.getBody = function () {
	    var body = '';

	    for (var key in this.fields) {
	        if (!this.fields[key].extra) body += (body === '' ? '' : '&') + key + '=' + encodeURIComponent(this.elem[key].value);
	    }return body;
	};

	for (var key in eventMixin) {
	    Form.prototype[key] = eventMixin[key];
	}

	module.exports = Form;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var ServerError = __webpack_require__(22).ServerError;
	var ClientError = __webpack_require__(22).ClientError;

	module.exports = function (bodyObj, method, url, cb) {

	    var body = '';
	    if (!(typeof bodyObj === 'string')) {
	        for (var key in bodyObj) {
	            var value = '';
	            if (bodyObj[key]) value = key + '=' + encodeURIComponent(typeof bodyObj[key] === 'object' ? JSON.stringify(bodyObj[key]) : bodyObj[key]);
	            if (value) body += (body === '' ? '' : '&') + value;
	        }
	    } else body = bodyObj;

	    var xhr = new XMLHttpRequest();
	    xhr.open(method, url, true);
	    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

	    xhr.onreadystatechange = function () {
	        if (this.readyState != 4) return;

	        var response = undefined;

	        if (this.responseText) response = JSON.parse(this.responseText);else {
	            cb(new ServerError('Server is not responding'));
	            return;
	        }

	        if (this.status >= 200 && this.status < 300) cb(null, response);

	        if (this.status >= 400 && this.status < 500) cb(new ClientError(response.message, response.detail, this.status));

	        if (this.status >= 500) cb(new ServerError(response.message, this.status));
	    };

	    console.log('sending next request: ' + body);
	    xhr.send(body);
	};

/***/ }),
/* 33 */,
/* 34 */,
/* 35 */
/***/ (function(module, exports) {

	'use strict';

	var Dropdown = function Dropdown(options) {
	    var _this = this;

	    this.elem = options.elem;
	    this.itemList = this.elem.querySelector('.dropdown__item-list');
	    this.className = options.className;

	    this.active = false;

	    // this.elem.onclick = e => {
	    //     this.toggle();
	    // };

	    document.body.addEventListener('click', function (e) {

	        if (!_this.itemList.contains(e.target)) {
	            if (_this.elem.contains(e.target)) _this.toggle();else if (_this.active) _this.deactivate();
	        }
	    }, false);

	    this.AEHandler = this.AEHandler.bind(this);
	};

	Dropdown.prototype.show = function () {
	    this.elem.classList.remove('dropdown_invisible');
	    this.elem.classList.add(this.className + '_active');
	    this.active = true;
	};

	Dropdown.prototype.deactivate = function () {
	    this.itemList.addEventListener('animationend', this.AEHandler, false);
	    this.elem.classList.add('dropdown_fading-out');
	};

	Dropdown.prototype.AEHandler = function () {
	    this.elem.classList.remove('dropdown_fading-out');
	    this.elem.classList.add('dropdown_invisible');
	    this.elem.classList.remove(this.className + '_active');
	    this.active = false;
	    this.itemList.removeEventListener('animationend', this.AEHandler);
	};

	Dropdown.prototype.toggle = function () {
	    if (this.active) this.deactivate();else this.show();
	};

	module.exports = Dropdown;

/***/ }),
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }),
/* 53 */,
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var eventMixin = __webpack_require__(25);
	var SocialCollection = function SocialCollection(options) {
	    var _this = this;

	    this.elem = options.elem;
	    this.socialList = this.elem.querySelector('.social-collection__social-list');
	    this.textbox = this.elem.querySelector('.textbox__field');

	    this.elem.onclick = function (e) {

	        if (e.target.matches('.textbox-button__button') && _this.textbox.value) {
	            _this.sendSocial(_this.textbox.value);
	            return;
	        }

	        if (e.target.matches('.social__close')) _this.deleteSocial(e.target.closest('.social'));
	    };
	};

	//TODO make checking user's data on client side

	SocialCollection.prototype.sendSocial = function (link) {
	    var _this2 = this;

	    __webpack_require__(32)({
	        link: link
	    }, 'POST', '/settings', function (err, response) {

	        if (err) {
	            _this2.error(err);
	            return;
	        }

	        _this2.insertNewSocial(response.linkObj);
	        _this2.textbox.value = '';
	    });
	};

	SocialCollection.prototype.deleteSocial = function (social) {
	    var _this3 = this;

	    __webpack_require__(32)({
	        link: social.dataset.link
	    }, 'DELETE', '/settings', function (err, response) {

	        if (err) {
	            _this3.error(err);
	            return;
	        }

	        social.remove();
	    });
	};

	SocialCollection.prototype.insertNewSocial = function (linkObj) {
	    var social = __webpack_require__(55)(__webpack_require__(56));
	    social.dataset.link = linkObj.href;
	    social.querySelector('.social__link').setAttribute('href', linkObj.href);
	    social.querySelector('.social__host').textContent = linkObj.host;
	    this.socialList.appendChild(social);
	};

	for (var key in eventMixin) {
	    SocialCollection.prototype[key] = eventMixin[key];
	}

	module.exports = SocialCollection;

/***/ }),
/* 55 */
/***/ (function(module, exports) {

	'use strict';

	module.exports = function (markup) {
		var parent = document.createElement('DIV');
		parent.innerHTML = markup;
		var element = parent.firstElementChild;
		return element;
	};

/***/ }),
/* 56 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"social-collection__social social\" data-link=\"\">\r\n    <a class=\"social__link\" href=\"\">\r\n        <div class=\"social__icon icon-sphere\"></div>\r\n        <span class=\"social__host\"></span>\r\n    </a>\r\n    <div class=\"social__close icon-cross\"></div>\r\n</div>";

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var eventMixin = __webpack_require__(25);
	var FilePicker = __webpack_require__(58);

	var ClientError = __webpack_require__(22).ClientError;

	var UploadAvatarSection = function UploadAvatarSection(options) {
	    var _this = this;

	    this.elem = options.elem;
	    this.uploadButton = this.elem.querySelector('.upload-avatar-section__upload-button');
	    this.deleteButton = this.elem.querySelector('.upload-avatar-section__delete-button');
	    this.filePicker = new FilePicker({
	        elem: this.elem.querySelector('.file-picker')
	    });

	    this.avatar = this.elem.querySelector('.upload-avatar-section__avatar');

	    this.elem.onclick = function (e) {

	        if (e.target === _this.uploadButton) {
	            var file = _this.filePicker.getFile();
	            if (file) _this.uploadAvatar(file);
	        }

	        if (e.target === _this.deleteButton) _this.deleteAvatar();
	    };
	};

	UploadAvatarSection.prototype.deleteAvatar = function () {
	    var _this2 = this;

	    __webpack_require__(32)(null, 'DELETE', '/avatar', function (err, response) {
	        if (err) {
	            _this2.error(err);
	            return;
	        }
	        _this2.avatar.style.backgroundImage = 'url(\'' + ("/anon.svg") + '\')';
	    });
	};

	UploadAvatarSection.prototype.uploadAvatar = function (file) {
	    var _this3 = this;

	    var formData = new FormData();
	    formData.append("avatar", file);

	    __webpack_require__(59)("/avatar", formData, function (err, response) {
	        if (err) {
	            _this3.error(err);
	            return;
	        }
	        _this3.avatar.style.backgroundImage = 'url(\'' + response.url + '?' + new Date().getTime() + '\')';
	    });
	};

	for (var key in eventMixin) {
	    UploadAvatarSection.prototype[key] = eventMixin[key];
	}

	module.exports = UploadAvatarSection;

/***/ }),
/* 58 */
/***/ (function(module, exports) {

	'use strict';

	var DEFAULT_VALUE = 'no file chosen';
	var DEFAULT_FN_LENGTH = DEFAULT_VALUE.length;

	var FilePicker = function FilePicker(options) {
	    var _this = this;

	    this.fileNameLength = options.fileNameLength || DEFAULT_FN_LENGTH;

	    this.uploadInput = document.createElement('input');
	    this.uploadInput.type = "file";
	    this.uploadInput.accept = "image/*";

	    this.elem = options.elem;
	    this.fpButton = this.elem.querySelector('.file-picker__button');
	    this.fpFileName = this.elem.querySelector('.file-picker__filename');

	    this.fpButton.addEventListener('click', function (e) {
	        _this.uploadInput.click();
	    });

	    this.uploadInput.addEventListener('change', function (e) {
	        _this.setVisibleFileName();
	    });
	};

	FilePicker.prototype.setVisibleFileName = function () {
	    var filename = this.uploadInput.value.substring(this.uploadInput.value.lastIndexOf('\\') + 1);

	    var visibleFileName = undefined;
	    var partSize = ~ ~((this.fileNameLength - 1) / 2);

	    if (filename.length === 0) visibleFileName = DEFAULT_VALUE;else if (filename.length <= this.fileNameLength) {
	        this.fpFileName.title = '';
	        visibleFileName = filename;
	    } else {
	        this.fpFileName.title = filename;
	        visibleFileName = filename.slice(0, partSize) + '…' + filename.slice(-partSize);
	    }

	    this.fpFileName.textContent = visibleFileName;
	};

	FilePicker.prototype.getFile = function () {
	    return this.uploadInput.files[0];
	};

	FilePicker.prototype.clear = function () {
	    this.uploadInput.value = '';
	    this.fpFileName.textContent = DEFAULT_VALUE;
	};

	module.exports = FilePicker;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var ServerError = __webpack_require__(22).ServerError;
	var ClientError = __webpack_require__(22).ClientError;

	module.exports = function (url, formData, cb) {
	    var xhr = new XMLHttpRequest();
	    // xhr.upload.onprogress = event => {
	    // 	   console.log(event.loaded + ' / ' + event.total);
	    // };

	    xhr.onload = xhr.onerror = function () {
	        var response = undefined;

	        if (this.responseText) response = JSON.parse(this.responseText);else {
	            cb(new ServerError('Server is not responding'));
	            return;
	        }

	        if (this.status >= 200 && this.status < 300) cb(null, response);

	        if (this.status >= 400 && this.status < 500) cb(new ClientError(response.message));

	        if (this.status >= 500) cb(new ServerError(response.message));
	    };

	    xhr.open("POST", url, true);
	    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	    xhr.send(formData);
	};

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var eventMixin = __webpack_require__(25);
	var ClientError = __webpack_require__(22).ClientError;
	var MessageModalWindow = __webpack_require__(23);

	var DescriptionAddSection = function DescriptionAddSection(options) {
	    var _this = this;

	    this.elem = options.elem;
	    this.saveButton = this.elem.querySelector('.button');
	    this.textarea = this.elem.querySelector('.textarea textarea');

	    this.elem.onclick = function (e) {
	        if (e.target !== _this.saveButton) return;
	        var description = _this.textarea.value;
	        var errors = __webpack_require__(30).getErrorArray({
	            description: description
	        });

	        if (errors.length === 0) _this.sendDescription(_this.textarea.value);else _this.error(new ClientError(errors[0].message));
	    };
	};

	DescriptionAddSection.prototype.sendDescription = function (description) {
	    var _this2 = this;

	    __webpack_require__(32)({
	        description: description
	    }, 'POST', '/settings', function (err, response) {
	        if (err) {
	            _this2.error(err);
	            return;
	        }

	        var messageModalWindow = new MessageModalWindow({ message: 'Description has been successfully changed' });
	        messageModalWindow.show();
	    });
	};

	for (var key in eventMixin) {
	    DescriptionAddSection.prototype[key] = eventMixin[key];
	}

	module.exports = DescriptionAddSection;

/***/ })
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zZXR0aW5ncy9zY3JpcHQuanMiLCJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2NvbXBvbmVudEVycm9ycy5qcz9hY2I1KioqKiIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL21lc3NhZ2UtbW9kYWwtd2luZG93L2luZGV4LmpzPzA2NzQqIiwid2VicGFjazovLy8uLi9ibG9ja3MvbW9kYWwvaW5kZXguanM/OWM0NioqIiwid2VicGFjazovLy9EOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9ldmVudE1peGluLmpzPzNjYmMqKioqIiwid2VicGFjazovLy8uLi9ibG9ja3Mvc3Bpbm5lci9pbmRleC5qcz8wNDkyKioiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9zcGlubmVyL21hcmt1cD80N2Q3KioiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9tZXNzYWdlLW1vZGFsLXdpbmRvdy93aW5kb3c/MGY5OSoiLCJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2NoZWNrVXNlckRhdGEuanM/ZmYyMCIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2Zvcm0vaW5kZXguanM/MGFlMiIsIndlYnBhY2s6Ly8vRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvc2VuZFJlcXVlc3QuanM/OGEyNyoqKiIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2Ryb3Bkb3duL2luZGV4LmpzPzVlMjkqIiwid2VicGFjazovLy8uL3NldHRpbmdzL3N0eWxlLmxlc3MiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9zb2NpYWwtY29sbGVjdGlvbi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvcmVuZGVyRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL3NvY2lhbC1jb2xsZWN0aW9uL3NvY2lhbCIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL3VwbG9hZC1hdmF0YXItc2VjdGlvbi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2ZpbGUtcGlja2VyL2luZGV4LmpzIiwid2VicGFjazovLy9EOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9zZW5kRm9ybURhdGEuanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9kZXNjcmlwdGlvbi1hZGQtc2VjdGlvbi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAnLi9zdHlsZS5sZXNzJztcclxuXHJcbmxldCBHbG9iYWxFcnJvckhhbmRsZXIgPSByZXF1aXJlKEJMT0NLUyArICdnbG9iYWwtZXJyb3ItaGFuZGxlcicpO1xyXG5sZXQgZ2xvYmFsRXJyb3JIYW5kbGVyID0gbmV3IEdsb2JhbEVycm9ySGFuZGxlcigpO1xyXG5cclxubGV0IERyb3Bkb3duID0gcmVxdWlyZShCTE9DS1MgKyAnZHJvcGRvd24nKTtcclxubGV0IFNvY2lhbENvbGxlY3Rpb24gPSByZXF1aXJlKEJMT0NLUyArICdzb2NpYWwtY29sbGVjdGlvbicpO1xyXG5sZXQgVXBsb2FkQXZhdGFyU2VjdGlvbiA9IHJlcXVpcmUoQkxPQ0tTICsgJ3VwbG9hZC1hdmF0YXItc2VjdGlvbicpO1xyXG5sZXQgRGVzY3JpcHRpb25BZGRTZWN0aW9uID0gcmVxdWlyZShCTE9DS1MgKyAnZGVzY3JpcHRpb24tYWRkLXNlY3Rpb24nKTtcclxubGV0IEZvcm0gPSByZXF1aXJlKEJMT0NLUyArICdmb3JtJyk7XHJcbmxldCBNZXNzYWdlTW9kYWxXaW5kb3cgPSByZXF1aXJlKEJMT0NLUyArICdtZXNzYWdlLW1vZGFsLXdpbmRvdycpO1xyXG5cclxubGV0IHVzZXJNZW51RHJvcGRvd24gPSBuZXcgRHJvcGRvd24oe1xyXG4gICAgZWxlbTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXItbWVudScpLFxyXG4gICAgY2xhc3NOYW1lOiAnaGVhZGVyLWVsZW1lbnQnXHJcbn0pO1xyXG5cclxubGV0IHNvY2lhbENvbGxlY3Rpb24gPSBuZXcgU29jaWFsQ29sbGVjdGlvbih7XHJcbiAgICBlbGVtOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc29jaWFsLWNvbGxlY3Rpb24nKVxyXG59KTtcclxuXHJcbmxldCB1cGxvYWRBdmF0YXJTZWN0aW9uID0gbmV3IFVwbG9hZEF2YXRhclNlY3Rpb24oe1xyXG4gICAgZWxlbTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VwbG9hZC1hdmF0YXItc2VjdGlvbicpXHJcbn0pO1xyXG5cclxubGV0IGRlc2NyaXB0aW9uQWRkU2VjdGlvbiA9IG5ldyBEZXNjcmlwdGlvbkFkZFNlY3Rpb24oe1xyXG4gICAgZWxlbTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rlc2NyaXB0aW9uLWFkZC1zZWN0aW9uJylcclxufSk7XHJcblxyXG5sZXQgcGFzc3dvcmRDaGFuZ2VGb3JtID0gbmV3IEZvcm0oe1xyXG4gICAgZWxlbTogZG9jdW1lbnQuZm9ybXNbJ2NoYW5nZS1wYXNzd29yZCddLFxyXG4gICAgZmllbGRzOiB7XHJcbiAgICAgICAgJ29sZC1wYXNzd29yZCc6IHtcclxuICAgICAgICAgICAgdmFsaWRhdG9yOiAnbm9uLWVtcHR5JyxcclxuICAgICAgICAgICAgYWxpYXM6ICdvbGQgcGFzc3dvcmQnLFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgICduZXctcGFzc3dvcmQnOiB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRvcjogJ3Bhc3N3b3JkJyxcclxuICAgICAgICAgICAgYWxpYXM6ICduZXcgcGFzc3dvcmQnLFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgICduZXctYWdhaW4nOiB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRvcjogJ3Bhc3N3b3JkLWFnYWluJyxcclxuICAgICAgICAgICAgYWxpYXM6ICduZXcgcGFzc3dvcmQnLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogJ25ldy1wYXNzd29yZCcsXHJcbiAgICAgICAgICAgIGV4dHJhOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHVybDogJy9zZXR0aW5ncydcclxufSk7XHJcblxyXG5wYXNzd29yZENoYW5nZUZvcm0ub24oJ2Zvcm1fc2VudCcsIGUgPT4ge1xyXG4gICAgbGV0IG1lc3NhZ2VNb2RhbFdpbmRvdyA9IG5ldyBNZXNzYWdlTW9kYWxXaW5kb3coe21lc3NhZ2U6ICdQYXNzd29yZCBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgY2hhbmdlZCd9KTtcclxuICAgIG1lc3NhZ2VNb2RhbFdpbmRvdy5zaG93KCk7XHJcbn0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NldHRpbmdzL3NjcmlwdC5qcyIsImZ1bmN0aW9uIEN1c3RvbUVycm9yKG1lc3NhZ2UpIHtcclxuXHR0aGlzLm5hbWUgPSBcIkN1c3RvbUVycm9yXCI7XHJcblx0dGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuXHJcblx0aWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKVxyXG5cdFx0RXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgQ3VzdG9tRXJyb3IpO1xyXG5cdGVsc2VcclxuXHRcdHRoaXMuc3RhY2sgPSAobmV3IEVycm9yKCkpLnN0YWNrO1xyXG59XHJcbkN1c3RvbUVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcclxuQ3VzdG9tRXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ3VzdG9tRXJyb3I7XHJcblxyXG5cclxuZnVuY3Rpb24gQ29tcG9uZW50RXJyb3IobWVzc2FnZSwgc3RhdHVzKSB7XHJcblx0Q3VzdG9tRXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlIHx8ICdBbiBlcnJvciBoYXMgb2NjdXJyZWQnICk7XHJcblx0dGhpcy5uYW1lID0gXCJDb21wb25lbnRFcnJvclwiO1xyXG5cdHRoaXMuc3RhdHVzID0gc3RhdHVzO1xyXG59XHJcbkNvbXBvbmVudEVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ3VzdG9tRXJyb3IucHJvdG90eXBlKTtcclxuQ29tcG9uZW50RXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ29tcG9uZW50RXJyb3I7XHJcblxyXG5mdW5jdGlvbiBDbGllbnRFcnJvcihtZXNzYWdlLCBkZXRhaWwsIHN0YXR1cykge1xyXG5cdENvbXBvbmVudEVycm9yLmNhbGwodGhpcywgbWVzc2FnZSB8fCAnQW4gZXJyb3IgaGFzIG9jY3VycmVkLiBSZXRyeSBsYXRlcicsIHN0YXR1cyk7XHJcblx0dGhpcy5uYW1lID0gXCJDbGllbnRFcnJvclwiO1xyXG5cdHRoaXMuZGV0YWlsID0gZGV0YWlsO1xyXG59XHJcbkNsaWVudEVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29tcG9uZW50RXJyb3IucHJvdG90eXBlKTtcclxuQ2xpZW50RXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ2xpZW50RXJyb3I7XHJcblxyXG5cclxuZnVuY3Rpb24gSW1hZ2VOb3RGb3VuZChtZXNzYWdlKSB7XHJcbiAgICBDbGllbnRFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ0ltYWdlIG5vdCBmb3VuZC4gSXQgcHJvYmFibHkgaGFzIGJlZW4gcmVtb3ZlZCcsIG51bGwsIDQwNCk7XHJcbiAgICB0aGlzLm5hbWUgPSBcIkltYWdlTm90Rm91bmRcIjtcclxufVxyXG5JbWFnZU5vdEZvdW5kLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ2xpZW50RXJyb3IucHJvdG90eXBlKTtcclxuSW1hZ2VOb3RGb3VuZC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBJbWFnZU5vdEZvdW5kO1xyXG5cclxuZnVuY3Rpb24gU2VydmVyRXJyb3IobWVzc2FnZSwgc3RhdHVzKSB7XHJcblx0Q29tcG9uZW50RXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlIHx8ICdUaGVyZSBpcyBzb21lIGVycm9yIG9uIHRoZSBzZXJ2ZXIgc2lkZS4gUmV0cnkgbGF0ZXInLCBzdGF0dXMpO1xyXG5cdHRoaXMubmFtZSA9IFwiU2VydmVyRXJyb3JcIjtcclxufVxyXG5TZXJ2ZXJFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbXBvbmVudEVycm9yLnByb3RvdHlwZSk7XHJcblNlcnZlckVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNlcnZlckVycm9yO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0Q29tcG9uZW50RXJyb3IsXHJcblx0Q2xpZW50RXJyb3IsXHJcbiAgICBJbWFnZU5vdEZvdW5kLFxyXG5cdFNlcnZlckVycm9yXHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9jb21wb25lbnRFcnJvcnMuanMiLCJsZXQgTW9kYWwgPSByZXF1aXJlKEJMT0NLUyArICdtb2RhbCcpO1xyXG5cclxubGV0IE1lc3NhZ2VNb2RhbFdpbmRvdyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBNb2RhbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgdGhpcy5lbGVtID0gbnVsbDtcclxuICAgIHRoaXMuZWxlbUlkID0gJ21lc3NhZ2UtbW9kYWwtd2luZG93JztcclxuICAgIHRoaXMuY2FwdGlvbiA9IG9wdGlvbnMgJiYgb3B0aW9ucy5jYXB0aW9uIHx8ICdtZXNzYWdlJztcclxuICAgIHRoaXMubWVzc2FnZSA9IG9wdGlvbnMgJiYgb3B0aW9ucy5tZXNzYWdlIHx8ICdZb3Ugd2VyZSBub3Qgc3VwcG9zZSB0byBzZWUgdGhpcyEgU2VlbXMgbGlrZSBzb21ldGhpbmcgaXMgYnJva2VuIDooJztcclxuXHJcbn07XHJcbk1lc3NhZ2VNb2RhbFdpbmRvdy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKE1vZGFsLnByb3RvdHlwZSk7XHJcbk1lc3NhZ2VNb2RhbFdpbmRvdy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBNZXNzYWdlTW9kYWxXaW5kb3c7XHJcblxyXG5NZXNzYWdlTW9kYWxXaW5kb3cucHJvdG90eXBlLnNldEVsZW0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLnNldFdpbmRvd0h0bWwoKTtcclxuICAgIHRoaXMuZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZWxlbUlkKTtcclxuICAgIGlmICghdGhpcy5lbGVtKVxyXG4gICAgICAgIHRoaXMuZWxlbSA9IHRoaXMucmVuZGVyV2luZG93KHRoaXMud2luZG93SHRtbCk7XHJcbiAgICB0aGlzLnNldExpc3RlbmVycygpO1xyXG4gICAgdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXInKS50ZXh0Q29udGVudCA9IHRoaXMuY2FwdGlvbjtcclxuICAgIHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcubWVzc2FnZS1tb2RhbC13aW5kb3dfX21lc3NhZ2UnKS50ZXh0Q29udGVudCA9IHRoaXMubWVzc2FnZTtcclxuXHJcbiAgICB0aGlzLmVsZW0ub25jbGljayA9IGUgPT4ge1xyXG4gICAgICAgIHRoaXMub25FbGVtQ2xpY2soZSk7XHJcbiAgICAgICAgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoJy5tZXNzYWdlLW1vZGFsLXdpbmRvd19fb2stYnV0dG9uJykpXHJcbiAgICAgICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xyXG4gICAgfTtcclxufTtcclxuXHJcbk1lc3NhZ2VNb2RhbFdpbmRvdy5wcm90b3R5cGUuc2V0V2luZG93SHRtbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMud2luZG93SHRtbCA9IHJlcXVpcmUoYGh0bWwtbG9hZGVyIS4vd2luZG93YCk7XHJcbn07XHJcblxyXG5NZXNzYWdlTW9kYWxXaW5kb3cucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBNb2RhbC5wcm90b3R5cGUuc2hvdy5hcHBseSh0aGlzKTtcclxuXHJcbiAgICBpZiAoIXRoaXMuZWxlbSlcclxuICAgICAgICB0aGlzLnNldEVsZW0oKTtcclxuXHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnd2luZG93X2ludmlzaWJsZScpO1xyXG59O1xyXG5cclxuTWVzc2FnZU1vZGFsV2luZG93LnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgTW9kYWwucHJvdG90eXBlLmhpZGUuYXBwbHkodGhpcyk7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnd2luZG93X2ludmlzaWJsZScpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZXNzYWdlTW9kYWxXaW5kb3c7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvbWVzc2FnZS1tb2RhbC13aW5kb3cvaW5kZXguanMiLCJsZXQgZXZlbnRNaXhpbiA9IHJlcXVpcmUoTElCUyArICdldmVudE1peGluJyk7XHJcbmxldCBTcGlubmVyID0gcmVxdWlyZShCTE9DS1MgKyAnc3Bpbm5lcicpO1xyXG5cclxubGV0IE1vZGFsID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XHJcbiAgICB0aGlzLmxpc3RlbmVycyA9IFtdO1xyXG4gICAgdGhpcy5zdGF0dXMgPSBvcHRpb25zICYmIG9wdGlvbnMuc3RhdHVzIHx8IE1vZGFsLnN0YXR1c2VzLk1JTk9SO1xyXG59O1xyXG5cclxuTW9kYWwuc3RhdHVzZXMgPSB7XHJcbiAgICBNQUpPUjogMSxcclxuICAgIE1JTk9SOiAyXHJcbn07XHJcblxyXG5Nb2RhbC5wcm90b3R5cGUub25FbGVtQ2xpY2sgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoJy5tb2RhbC1jbG9zZS1idXR0b24nKSlcclxuICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcclxufTtcclxuXHJcbk1vZGFsLnByb3RvdHlwZS5zZXRMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmxpc3RlbmVycy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgIHRoaXMuZWxlbS5hZGRFdmVudExpc3RlbmVyKGl0ZW0uZXZlbnROYW1lLCBpdGVtLmNiKTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuTW9kYWwuc2V0QmFja2Ryb3AgPSBmdW5jdGlvbiAoc3RhdHVzKSB7XHJcbiAgICBpZiAoc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUikge1xyXG4gICAgICAgIE1vZGFsLm1pbm9yQmFja2Ryb3AgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja2Ryb3BfbWlub3InKTtcclxuICAgICAgICBpZiAoIU1vZGFsLm1pbm9yQmFja2Ryb3ApXHJcbiAgICAgICAgICAgIE1vZGFsLm1pbm9yQmFja2Ryb3AgPSBNb2RhbC5yZW5kZXJCYWNrZHJvcCgnbWlub3InKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgTW9kYWwubWFqb3JCYWNrZHJvcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrZHJvcF9tYWpvcicpO1xyXG4gICAgICAgIGlmICghTW9kYWwubWFqb3JCYWNrZHJvcClcclxuICAgICAgICAgICAgTW9kYWwubWFqb3JCYWNrZHJvcCA9IE1vZGFsLnJlbmRlckJhY2tkcm9wKCdtYWpvcicpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuTW9kYWwuc2V0V3JhcHBlciA9IGZ1bmN0aW9uIChzdGF0dXMpIHtcclxuICAgIGlmIChzdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKSB7XHJcbiAgICAgICAgTW9kYWwubWlub3JXcmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLXdyYXBwZXItbWlub3InKTtcclxuICAgICAgICBpZiAoIU1vZGFsLm1pbm9yV3JhcHBlcilcclxuICAgICAgICAgICAgTW9kYWwubWlub3JXcmFwcGVyID0gTW9kYWwucmVuZGVyV3JhcHBlcignbWlub3InKTtcclxuICAgICAgICBNb2RhbC5taW5vcldyYXBwZXIub25jbGljayA9IGUgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZS50YXJnZXQgJiYgIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbW9kYWwtd3JhcHBlcl9taW5vcicpKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChNb2RhbC5taW5vckFjdGl2ZSlcclxuICAgICAgICAgICAgICAgIE1vZGFsLm1pbm9yUXVldWVbMF0uZGVhY3RpdmF0ZSgpO1xyXG4gICAgICAgIH07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIE1vZGFsLm1ham9yV3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC13cmFwcGVyLW1ham9yJyk7XHJcbiAgICAgICAgaWYgKCFNb2RhbC5tYWpvcldyYXBwZXIpXHJcbiAgICAgICAgICAgIE1vZGFsLm1ham9yV3JhcHBlciA9IE1vZGFsLnJlbmRlcldyYXBwZXIoJ21ham9yJyk7XHJcbiAgICAgICAgTW9kYWwubWFqb3JXcmFwcGVyLm9uY2xpY2sgPSBlID0+IHtcclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0ICYmICFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ21vZGFsLXdyYXBwZXJfbWFqb3InKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAoTW9kYWwubWFqb3JBY3RpdmUpXHJcbiAgICAgICAgICAgICAgICBNb2RhbC5tYWpvclF1ZXVlWzBdLmRlYWN0aXZhdGUoKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59O1xyXG5cclxuTW9kYWwucmVuZGVyQmFja2Ryb3AgPSBmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgbGV0IGJhY2tkcm9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyk7XHJcbiAgICBiYWNrZHJvcC5jbGFzc05hbWUgPSAnYmFja2Ryb3AgYmFja2Ryb3BfaW52aXNpYmxlJztcclxuICAgIGJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoYGJhY2tkcm9wXyR7dHlwZX1gKTtcclxuICAgIGJhY2tkcm9wLmlkID0gYGJhY2tkcm9wLSR7dHlwZX1gO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChiYWNrZHJvcCk7XHJcbiAgICByZXR1cm4gYmFja2Ryb3A7XHJcbn07XHJcblxyXG5Nb2RhbC5yZW5kZXJXcmFwcGVyID0gZnVuY3Rpb24gKHR5cGUpIHtcclxuICAgIGxldCB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyk7XHJcbiAgICB3cmFwcGVyLmNsYXNzTmFtZSA9ICdtb2RhbC13cmFwcGVyIG1vZGFsLXdyYXBwZXJfaW52aXNpYmxlJztcclxuICAgIHdyYXBwZXIuY2xhc3NMaXN0LmFkZChgbW9kYWwtd3JhcHBlcl8ke3R5cGV9YCk7XHJcbiAgICB3cmFwcGVyLmlkID0gYG1vZGFsLXdyYXBwZXItJHt0eXBlfWA7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHdyYXBwZXIpO1xyXG4gICAgcmV0dXJuIHdyYXBwZXI7XHJcbn07XHJcblxyXG5Nb2RhbC5wcm90b3R5cGUucmVuZGVyV2luZG93ID0gZnVuY3Rpb24gKGh0bWwpIHtcclxuXHJcbiAgICBsZXQgcGFyZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyk7XHJcbiAgICBwYXJlbnQuaW5uZXJIVE1MID0gaHRtbDtcclxuICAgIGxldCB3bmQgPSBwYXJlbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcbiAgICBpZiAodGhpcy5zdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKVxyXG4gICAgICAgIE1vZGFsLm1pbm9yV3JhcHBlci5hcHBlbmRDaGlsZCh3bmQpO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIE1vZGFsLm1ham9yV3JhcHBlci5hcHBlbmRDaGlsZCh3bmQpO1xyXG5cclxuICAgIHBhcmVudC5yZW1vdmUoKTtcclxuICAgIHJldHVybiB3bmQ7XHJcbn07XHJcblxyXG5Nb2RhbC5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpIHtcclxuICAgICAgICBpZiAoIU1vZGFsLm1pbm9yQmFja2Ryb3ApXHJcbiAgICAgICAgICAgIE1vZGFsLnNldEJhY2tkcm9wKE1vZGFsLnN0YXR1c2VzLk1JTk9SKTtcclxuXHJcbiAgICAgICAgaWYgKCFNb2RhbC5taW5vcldyYXBwZXIpXHJcbiAgICAgICAgICAgIE1vZGFsLnNldFdyYXBwZXIoTW9kYWwuc3RhdHVzZXMuTUlOT1IpO1xyXG5cclxuICAgICAgICBNb2RhbC5taW5vcldyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtd3JhcHBlcl9pbnZpc2libGUnKTtcclxuICAgICAgICBNb2RhbC5taW5vckJhY2tkcm9wLmNsYXNzTGlzdC5yZW1vdmUoJ2JhY2tkcm9wX2ludmlzaWJsZScpO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKCFNb2RhbC5tYWpvckJhY2tkcm9wKVxyXG4gICAgICAgICAgICBNb2RhbC5zZXRCYWNrZHJvcChNb2RhbC5zdGF0dXNlcy5NQUpPUik7XHJcblxyXG4gICAgICAgIGlmICghTW9kYWwubWFqb3JXcmFwcGVyKVxyXG4gICAgICAgICAgICBNb2RhbC5zZXRXcmFwcGVyKE1vZGFsLnN0YXR1c2VzLk1BSk9SKTtcclxuXHJcbiAgICAgICAgTW9kYWwubWFqb3JXcmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLXdyYXBwZXJfaW52aXNpYmxlJyk7XHJcbiAgICAgICAgTW9kYWwubWFqb3JCYWNrZHJvcC5jbGFzc0xpc3QucmVtb3ZlKCdiYWNrZHJvcF9pbnZpc2libGUnKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XHJcblxyXG59O1xyXG5cclxuXHJcbk1vZGFsLnByb3RvdHlwZS5hY3RpdmF0ZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgaWYgKHRoaXMuZWxlbUlkID09PSAnc3Bpbm5lcicpIHtcclxuICAgICAgICBsZXQgc3Bpbm5lciA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5vbignc3Bpbm5lcl9ob3N0LWxvYWRlZCcsIGUgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbmV3SG9zdCA9IGUuZGV0YWlsLmhvc3Q7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKVxyXG4gICAgICAgICAgICAgICAgTW9kYWwubWlub3JRdWV1ZS5zcGxpY2UoTW9kYWwubWlub3JRdWV1ZS5pbmRleE9mKHNwaW5uZXIpICsgMSwgMCwgbmV3SG9zdCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIE1vZGFsLm1ham9yUXVldWUuc3BsaWNlKE1vZGFsLm1ham9yUXVldWUuaW5kZXhPZihzcGlubmVyKSArIDEsIDAsIG5ld0hvc3QpO1xyXG5cclxuICAgICAgICAgICAgc3Bpbm5lci5kZWFjdGl2YXRlKGUuZGV0YWlsLm9wdGlvbnMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUikge1xyXG4gICAgICAgICAgICBNb2RhbC5taW5vclF1ZXVlLnB1c2godGhpcyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKE1vZGFsLm1pbm9yUXVldWUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhNb2RhbC5tYWpvclF1ZXVlKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghTW9kYWwubWlub3JBY3RpdmUpXHJcbiAgICAgICAgICAgICAgICBNb2RhbC5taW5vclNob3cob3B0aW9ucykudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIE1vZGFsLm1ham9yUXVldWUucHVzaCh0aGlzKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coTW9kYWwubWlub3JRdWV1ZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKE1vZGFsLm1ham9yUXVldWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFNb2RhbC5tYWpvckFjdGl2ZSlcclxuXHJcbiAgICAgICAgICAgICAgICBNb2RhbC5tYWpvclNob3cob3B0aW9ucykudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufTtcclxuXHJcbk1vZGFsLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUikge1xyXG4gICAgICAgIC8vVE9ETyBub3QgbmVjY2Vzc2FyeSBpZiBxdWV1ZSBpcyBub3QgZW1wdHlcclxuICAgICAgICBNb2RhbC5taW5vcldyYXBwZXIuY2xhc3NMaXN0LmFkZCgnbW9kYWwtd3JhcHBlcl9pbnZpc2libGUnKTtcclxuICAgICAgICBNb2RhbC5taW5vckJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoJ2JhY2tkcm9wX2ludmlzaWJsZScpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgTW9kYWwubWFqb3JXcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ21vZGFsLXdyYXBwZXJfaW52aXNpYmxlJyk7XHJcbiAgICAgICAgTW9kYWwubWFqb3JCYWNrZHJvcC5jbGFzc0xpc3QuYWRkKCdiYWNrZHJvcF9pbnZpc2libGUnKTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5Nb2RhbC5wcm90b3R5cGUuZGVhY3RpdmF0ZSA9IGZ1bmN0aW9uIChuZXh0V2luZG93T3B0aW9ucywgaGlkZU9wdGlvbnMpIHtcclxuXHJcbiAgICB0aGlzLmhpZGUoaGlkZU9wdGlvbnMpO1xyXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpIHtcclxuICAgICAgICBNb2RhbC5taW5vckFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIE1vZGFsLm1pbm9yUXVldWUuc2hpZnQoKTtcclxuICAgICAgICBNb2RhbC5taW5vclNob3cobmV4dFdpbmRvd09wdGlvbnMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBNb2RhbC5tYWpvckFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIE1vZGFsLm1ham9yUXVldWUuc2hpZnQoKTtcclxuICAgICAgICBNb2RhbC5tYWpvclNob3cobmV4dFdpbmRvd09wdGlvbnMpO1xyXG4gICAgfVxyXG4gICAgdGhpcy50cmlnZ2VyKCdtb2RhbC13aW5kb3dfZGVhY3RpdmF0ZWQnKTtcclxufTtcclxuXHJcbk1vZGFsLm1pbm9yQWN0aXZlID0gZmFsc2U7XHJcbk1vZGFsLm1ham9yQWN0aXZlID0gZmFsc2U7XHJcbk1vZGFsLm1pbm9yUXVldWUgPSBbXTtcclxuTW9kYWwubWFqb3JRdWV1ZSA9IFtdO1xyXG5cclxuTW9kYWwuc3Bpbm5lciA9IG5ldyBTcGlubmVyKCk7XHJcbk1vZGFsLnNwaW5uZXIuc3RhdHVzID0gTW9kYWwuc3RhdHVzZXMuTUFKT1I7XHJcblxyXG5Nb2RhbC5zaG93U3Bpbm5lciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIE1vZGFsLnByb3RvdHlwZS5zaG93LmNhbGwoTW9kYWwuc3Bpbm5lcik7XHJcblxyXG4gICAgaWYgKCFNb2RhbC5zcGlubmVyLmVsZW0pXHJcbiAgICAgICAgTW9kYWwuc3Bpbm5lci5lbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwaW5uZXInKTtcclxuICAgIGlmICghTW9kYWwuc3Bpbm5lci5lbGVtKVxyXG4gICAgICAgIE1vZGFsLnNwaW5uZXIuZWxlbSA9IE1vZGFsLnByb3RvdHlwZS5yZW5kZXJXaW5kb3cuY2FsbChNb2RhbC5zcGlubmVyLCBTcGlubmVyLmh0bWwpO1xyXG5cclxuICAgIE1vZGFsLnNwaW5uZXIuc2hvdygpO1xyXG59O1xyXG5cclxuTW9kYWwuaGlkZVNwaW5uZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBNb2RhbC5zcGlubmVyLmhpZGUoKTtcclxufTtcclxuXHJcblxyXG5Nb2RhbC5taW5vclNob3cgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgbGV0IG5leHRNb2RhbFdpbmRvdyA9IE1vZGFsLm1pbm9yUXVldWVbMF07XHJcbiAgICBpZiAobmV4dE1vZGFsV2luZG93KSB7XHJcbiAgICAgICAgbGV0IHByb21pc2UgPSBuZXh0TW9kYWxXaW5kb3cuc2hvdyhvcHRpb25zKTtcclxuICAgICAgICBpZiAocHJvbWlzZSlcclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2UudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBNb2RhbC5taW5vckFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBNb2RhbC5taW5vckFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICBNb2RhbC5taW5vckFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH1cclxufTtcclxuXHJcbk1vZGFsLm1ham9yU2hvdyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgbGV0IG5leHRNb2RhbFdpbmRvdyA9IE1vZGFsLm1ham9yUXVldWVbMF07XHJcblxyXG4gICAgaWYgKG5leHRNb2RhbFdpbmRvdykge1xyXG5cclxuICAgICAgICBNb2RhbC5zaG93U3Bpbm5lcigpO1xyXG4gICAgICAgIGxldCBwcm9taXNlID0gbmV4dE1vZGFsV2luZG93LnNob3cob3B0aW9ucyk7XHJcblxyXG4gICAgICAgIGlmIChwcm9taXNlKVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIE1vZGFsLm1ham9yQWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIE1vZGFsLmhpZGVTcGlubmVyKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBNb2RhbC5tYWpvckFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIE1vZGFsLmhpZGVTcGlubmVyKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBNb2RhbC5tYWpvckFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH1cclxufTtcclxuXHJcbmZvciAobGV0IGtleSBpbiBldmVudE1peGluKVxyXG4gICAgTW9kYWwucHJvdG90eXBlW2tleV0gPSBldmVudE1peGluW2tleV07XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNb2RhbDtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9tb2RhbC9pbmRleC5qcyIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuXHRvbjogZnVuY3Rpb24oZXZlbnROYW1lLCBjYikge1xyXG5cdFx0aWYgKHRoaXMuZWxlbSlcclxuXHRcdFx0dGhpcy5lbGVtLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYik7XHJcblx0XHRlbHNlXHJcblx0XHRcdHRoaXMubGlzdGVuZXJzLnB1c2goe1xyXG5cdFx0XHRcdGV2ZW50TmFtZSxcclxuXHRcdFx0XHRjYlxyXG5cdFx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHR0cmlnZ2VyOiBmdW5jdGlvbihldmVudE5hbWUsIGRldGFpbCkge1xyXG5cdFx0dGhpcy5lbGVtLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwge1xyXG5cdFx0XHRidWJibGVzOiB0cnVlLFxyXG5cdFx0XHRjYW5jZWxhYmxlOiB0cnVlLFxyXG5cdFx0XHRkZXRhaWw6IGRldGFpbFxyXG5cdFx0fSkpO1xyXG5cdH0sXHJcblxyXG5cdGVycm9yOiBmdW5jdGlvbihlcnIpIHtcclxuXHRcdHRoaXMuZWxlbS5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnZXJyb3InLCB7XHJcblx0XHRcdGJ1YmJsZXM6IHRydWUsXHJcblx0XHRcdGNhbmNlbGFibGU6IHRydWUsXHJcblx0XHRcdGRldGFpbDogZXJyXHJcblx0XHR9KSk7XHJcblx0fVxyXG5cclxuXHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9ldmVudE1peGluLmpzIiwibGV0IFNwaW5uZXIgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgdGhpcy5lbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwaW5uZXInKTtcclxufTtcclxuXHJcblNwaW5uZXIuaHRtbCA9IHJlcXVpcmUoYGh0bWwtbG9hZGVyIS4vbWFya3VwYCk7XHJcblxyXG5TcGlubmVyLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3NwaW5uZXJfaW52aXNpYmxlJyk7XHJcbn07XHJcblxyXG5TcGlubmVyLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ3NwaW5uZXJfaW52aXNpYmxlJyk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNwaW5uZXI7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9zcGlubmVyL2luZGV4LmpzIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxkaXYgaWQ9XFxcInNwaW5uZXJcXFwiIGNsYXNzPVxcXCJzcGlubmVyXFxcIj5cXHJcXG5cXHJcXG48L2Rpdj5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svfi9odG1sLWxvYWRlciEuLi9ibG9ja3Mvc3Bpbm5lci9tYXJrdXBcbi8vIG1vZHVsZSBpZCA9IDI3XG4vLyBtb2R1bGUgY2h1bmtzID0gMSAyIDkgMTAgMTEiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBjbGFzcz0nd2luZG93IG1vZGFsIHdpbmRvd19pbnZpc2libGUgbW9kYWwtd2luZG93IG1lc3NhZ2UtbW9kYWwtd2luZG93JyBpZD0nbWVzc2FnZS1tb2RhbC13aW5kb3cnPlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJoZWFkZXIgd2luZG93X19oZWFkZXJcXFwiPlxcclxcbiAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwicGFuZWwgd2luZG93X19wYW5lbFxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJtZXNzYWdlLW1vZGFsLXdpbmRvd19fbWVzc2FnZVxcXCI+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbiBtZXNzYWdlLW1vZGFsLXdpbmRvd19fb2stYnV0dG9uXFxcIj5PSzwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiaWNvbi1jcm9zcyBtb2RhbC1jbG9zZS1idXR0b25cXFwiPjwvZGl2PjwvZGl2PlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9+L2h0bWwtbG9hZGVyIS4uL2Jsb2Nrcy9tZXNzYWdlLW1vZGFsLXdpbmRvdy93aW5kb3dcbi8vIG1vZHVsZSBpZCA9IDI4XG4vLyBtb2R1bGUgY2h1bmtzID0gMSA0IDEwIiwiLy9sZXQgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdhcHA6Y2hlY2tVc2VyZERhdGEnKTtcclxuXHJcbmNvbnN0IFBST1BFUlRZX1NZTUJPTCA9ICdbcHJvcGVydHldJztcclxuXHJcbmxldCBtZXNzYWdlcyA9IHtcclxuICAgIHBsYWluOiAnaW5jb3JyZWN0IFtwcm9wZXJ0eV0nLFxyXG4gICAgZW1wdHk6ICdbcHJvcGVydHldIG11c3Qgbm90IGJlIGVtcHR5JyxcclxuICAgIHRvb0JpZzogdmFsdWUgPT4ge1xyXG4gICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICAgICAgcmV0dXJuIGBbcHJvcGVydHldIG11c3QgYmUgbG93ZXIgdGhhbiAke3ZhbHVlICsgMX0gc3ltYm9sc2A7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gJ1twcm9wZXJ0eV0gaXMgdG9vIGJpZyc7XHJcbiAgICB9LFxyXG4gICAgdG9vU21hbGw6IHZhbHVlID0+IHtcclxuICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAgICAgIHJldHVybiBgW3Byb3BlcnR5XSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAke3ZhbHVlIC0gMX0gc3ltYm9sc2A7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gJ1twcm9wZXJ0eV0gaXMgdG9vIHNob3J0JztcclxuICAgIH1cclxufTtcclxuXHJcbmxldCB0ZXN0cyA9IHtcclxuICAgIHJlZ0V4cDogKHJlZ0V4cCwgdmFsdWUpID0+IHJlZ0V4cC50ZXN0KHZhbHVlKSxcclxuICAgIG1heDogKG1heCwgdmFsdWUpID0+ICh2YWx1ZS5sZW5ndGggPD0gbWF4KSxcclxuICAgIG1pbjogKG1pbiwgdmFsdWUpID0+ICh2YWx1ZS5sZW5ndGggPj0gbWluKSxcclxuICAgIG5vbkVtcHR5OiAodmFsdWUpID0+ICh2YWx1ZS5sZW5ndGggPiAwKVxyXG5cclxufTtcclxuXHJcblxyXG5sZXQgY2hlY2tzID0ge1xyXG4gICAgbWF4OiAodmFsdWUsIGVycm9yTWVzc2FnZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZXJyb3JNZXNzYWdlIHx8IG1lc3NhZ2VzLnRvb0JpZyh2YWx1ZSksXHJcbiAgICAgICAgICAgIHRlc3Q6IHRlc3RzLm1heC5iaW5kKG51bGwsIHZhbHVlKVxyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG5cclxuICAgIG1pbjogKHZhbHVlLCBlcnJvck1lc3NhZ2UpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGVycm9yTWVzc2FnZSB8fCBtZXNzYWdlcy50b29TbWFsbCh2YWx1ZSksXHJcbiAgICAgICAgICAgIHRlc3Q6IHRlc3RzLm1pbi5iaW5kKG51bGwsIHZhbHVlKVxyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG5cclxuICAgIG5vbkVtcHR5OiAoZXJyb3JNZXNzYWdlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlcnJvck1lc3NhZ2UgfHwgbWVzc2FnZXMuZW1wdHksXHJcbiAgICAgICAgICAgIHRlc3Q6IHRlc3RzLm5vbkVtcHR5XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufTtcclxuXHJcbmZ1bmN0aW9uIGNvbXB1dGVFcnJvck1lc3NhZ2UodGVtcGxhdGUsIHByb3BlcnR5KSB7XHJcbiAgICBsZXQgcG9zO1xyXG4gICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZSB8fCBtZXNzYWdlcy5wbGFpbjtcclxuICAgIHByb3BlcnR5ID0gcHJvcGVydHkgfHwgJ3RoaXMgcHJvcGVydHknO1xyXG4gICAgd2hpbGUgKH4ocG9zID0gdGVtcGxhdGUuaW5kZXhPZihQUk9QRVJUWV9TWU1CT0wpKSlcclxuICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLnN1YnN0cmluZygwLCBwb3MpICsgcHJvcGVydHkgKyB0ZW1wbGF0ZS5zdWJzdHJpbmcocG9zICsgUFJPUEVSVFlfU1lNQk9MLmxlbmd0aCk7XHJcbiAgICByZXR1cm4gdGVtcGxhdGU7XHJcbn1cclxuXHJcbmxldCB2YWxpZGF0b3JzID0ge1xyXG5cclxuICAgICdub24tZW1wdHknOiB7XHJcbiAgICAgICAgY2hlY2tzOiBbXHJcbiAgICAgICAgICAgIGNoZWNrcy5ub25FbXB0eSgpXHJcbiAgICAgICAgXVxyXG4gICAgfSxcclxuXHJcbiAgICAnZW1haWwnOiB7XHJcbiAgICAgICAgY2hlY2tzOiBbXHJcbiAgICAgICAgICAgIGNoZWNrcy5ub25FbXB0eSgpLFxyXG4gICAgICAgICAgICBjaGVja3MubWF4KDEwMCwgbWVzc2FnZXMudG9vQmlnKCkpLFxyXG4gICAgICAgICAgICBjaGVja3MubWluKDYsIG1lc3NhZ2VzLnRvb1NtYWxsKCkpLCB7XHJcbiAgICAgICAgICAgICAgICB0ZXN0OiB0ZXN0cy5yZWdFeHAuYmluZChudWxsLCAvXihcXHcrWy1cXC5dPz8pK0BbXFx3Li1dK1xcd1xcLlxcd3syLDV9JC9pKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgJ3VzZXJuYW1lJzoge1xyXG4gICAgICAgIGNoZWNrczogW1xyXG4gICAgICAgICAgICBjaGVja3Mubm9uRW1wdHkoKSxcclxuICAgICAgICAgICAgY2hlY2tzLm1heCgxNiksXHJcbiAgICAgICAgICAgIGNoZWNrcy5taW4oNSksIHtcclxuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogJ211c3Qgb25seSBjb250YWluIGFscGhhbnVtZXJpYyBzeW1ib2xzIGFuZCAtJyxcclxuICAgICAgICAgICAgICAgIHRlc3Q6IHRlc3RzLnJlZ0V4cC5iaW5kKG51bGwsIC9eW0EtWjAtOS1dKyQvaSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgIH0sXHJcblxyXG5cclxuICAgICdwYXNzd29yZCc6IHtcclxuICAgICAgICBjaGVja3M6IFtcclxuICAgICAgICAgICAgY2hlY2tzLm5vbkVtcHR5KCksXHJcbiAgICAgICAgICAgIGNoZWNrcy5tYXgoMzApLFxyXG4gICAgICAgICAgICBjaGVja3MubWluKDUpLCB7XHJcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6ICdbcHJvcGVydHldIGlzIHRvbyB3ZWFrJyxcclxuICAgICAgICAgICAgICAgIHRlc3Q6IHRlc3RzLnJlZ0V4cC5iaW5kKG51bGwsIC8oPz0uKlxcZCkoPz0uKlthLXpdKSg/PS4qW0EtWl0pLns2LH0vKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIF1cclxuICAgIH0sXHJcblxyXG5cclxuICAgICdwYXNzd29yZC1hZ2Fpbic6IHtcclxuICAgICAgICBjaGVja3M6IFtcclxuICAgICAgICAgICAgY2hlY2tzLm5vbkVtcHR5KCdyZS1lbnRlciBbcHJvcGVydHldJyksIHtcclxuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogJ3Bhc3N3b3JkcyBkbyBub3QgbWF0Y2gnLFxyXG4gICAgICAgICAgICAgICAgdGVzdDogZnVuY3Rpb24odmFsdWUsIGRhdGFDaHVuaywgZGF0YSkge1xyXG5cdFx0XHRcdFx0bGV0IG9yaWdpbmFsUGFzcyA9IGRhdGFDaHVuay5wYXNzd29yZDtcclxuXHRcdFx0XHRcdGlmICghb3JpZ2luYWxQYXNzKVxyXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ25vIG9yaWdpbmFsIHBhc3N3b3JkIHJlZmVyZW5jZScpO1xyXG5cclxuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKylcclxuXHRcdFx0XHRcdFx0aWYgKGRhdGFbaV0ucHJvcGVydHkgPT09IG9yaWdpbmFsUGFzcylcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKHZhbHVlID09PSBkYXRhW2ldLnZhbHVlKTtcclxuXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ25vIG9yZ2luYWwgcGFzc3dvcmQgZGF0YScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIF1cclxuICAgIH0sXHJcblxyXG5cclxuICAgICd1cmwnOiB7XHJcbiAgICAgICAgY2hlY2tzOiBbe1xyXG4gICAgICAgICAgICB0ZXN0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHVybFJlZ2V4ID0gJ14oPyFtYWlsdG86KSg/Oig/Omh0dHB8aHR0cHMpOi8vKSg/OlxcXFxTKyg/OjpcXFxcUyopP0ApPyg/Oig/Oig/OlsxLTldXFxcXGQ/fDFcXFxcZFxcXFxkfDJbMDFdXFxcXGR8MjJbMC0zXSkoPzpcXFxcLig/OjE/XFxcXGR7MSwyfXwyWzAtNF1cXFxcZHwyNVswLTVdKSl7Mn0oPzpcXFxcLig/OlswLTldXFxcXGQ/fDFcXFxcZFxcXFxkfDJbMC00XVxcXFxkfDI1WzAtNF0pKXwoPzooPzpbYS16XFxcXHUwMGExLVxcXFx1ZmZmZjAtOV0rLT8pKlthLXpcXFxcdTAwYTEtXFxcXHVmZmZmMC05XSspKD86XFxcXC4oPzpbYS16XFxcXHUwMGExLVxcXFx1ZmZmZjAtOV0rLT8pKlthLXpcXFxcdTAwYTEtXFxcXHVmZmZmMC05XSspKig/OlxcXFwuKD86W2EtelxcXFx1MDBhMS1cXFxcdWZmZmZdezIsfSkpKXxsb2NhbGhvc3QpKD86OlxcXFxkezIsNX0pPyg/OigvfFxcXFw/fCMpW15cXFxcc10qKT8kJztcclxuICAgICAgICAgICAgICAgIGxldCB1cmwgPSBuZXcgUmVnRXhwKHVybFJlZ2V4LCAnaScpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA8IDIwODMgJiYgdXJsLnRlc3QodmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfV1cclxuICAgIH0sXHJcblxyXG5cclxuICAgICdkZXNjcmlwdGlvbic6IHtcclxuICAgICAgICBjaGVja3M6IFtcclxuICAgICAgICAgICAgY2hlY2tzLm1heCgyNTUpXHJcbiAgICAgICAgXVxyXG4gICAgfSxcclxuXHJcbiAgICAnY29tbWVudCc6IHtcclxuICAgICAgICBjaGVja3M6IFtcclxuICAgICAgICAgICAgY2hlY2tzLm5vbkVtcHR5KCksXHJcbiAgICAgICAgICAgIGNoZWNrcy5tYXgoMjU1KVxyXG4gICAgICAgIF1cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEVycm9yQXJyYXkoZGF0YSkge1xyXG5cclxuXHRpZiAoIUFycmF5LmlzQXJyYXkoZGF0YSkpIHtcclxuXHRcdGxldCBjb3JyZWN0RGF0YSA9IFtdO1xyXG5cdFx0Zm9yIChsZXQga2V5IGluIGRhdGEpIHtcclxuXHRcdFx0Y29ycmVjdERhdGEucHVzaCh7XHJcblx0XHRcdFx0cHJvcGVydHk6IGtleSxcclxuXHRcdFx0XHR2YWx1ZTogZGF0YVtrZXldXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0ZGF0YSA9IGNvcnJlY3REYXRhO1xyXG5cdH1cclxuXHJcbiAgICBsZXQgcmVzdWx0ID0gW107XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRsZXQga2V5ID0gZGF0YVtpXS52YWxpZGF0b3I7XHJcblx0XHRpZiAoIWtleSlcclxuXHRcdFx0a2V5ID0gZGF0YVtpXS5wcm9wZXJ0eTtcclxuXHJcbiAgICAgICAgaWYgKCF2YWxpZGF0b3JzW2tleV0pXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm8gdmFsaWRhdG9yIGZvciB0aGlzIHByb3BlcnR5OiAnICsga2V5KTtcclxuXHJcbiAgICAgICAgdmFsaWRhdG9yc1trZXldLmNoZWNrcy5mb3JFYWNoKGNoZWNrID0+IHtcclxuICAgICAgICAgICAgaWYgKCFjaGVjay50ZXN0KGRhdGFbaV0udmFsdWUsIGRhdGFbaV0sIGRhdGEpKVxyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5OiBkYXRhW2ldLnByb3BlcnR5LFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNvbXB1dGVFcnJvck1lc3NhZ2UoY2hlY2suZXJyb3JNZXNzYWdlLCBkYXRhW2ldLmFsaWFzIHx8IGRhdGFbaV0ucHJvcGVydHkgfHwga2V5KVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZnVuY3Rpb24gdGVzdFByb3BlcnR5KG5hbWUsIHZhbHVlKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gdHJ1ZTtcclxuICAgIHZhbGlkYXRvcnNbbmFtZV0uY2hlY2tzLmZvckVhY2goY2hlY2sgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIWNoZWNrLnRlc3QodmFsdWUpKVxyXG4gICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBnZXRFcnJvckFycmF5LFxyXG4gICAgdGVzdFByb3BlcnR5XHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9jaGVja1VzZXJEYXRhLmpzIiwibGV0IGV2ZW50TWl4aW4gPSByZXF1aXJlKExJQlMgKyAnZXZlbnRNaXhpbicpO1xyXG5sZXQgZ2V0RXJyb3JBcnJheSA9IHJlcXVpcmUoTElCUyArICdjaGVja1VzZXJEYXRhJykuZ2V0RXJyb3JBcnJheTtcclxubGV0IENsaWVudEVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLkNsaWVudEVycm9yO1xyXG5cclxubGV0IEZvcm0gPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcbiAgICB0aGlzLmVsZW0gPSBvcHRpb25zLmVsZW07XHJcbiAgICB0aGlzLmZpZWxkcyA9IG9wdGlvbnMuZmllbGRzO1xyXG4gICAgdGhpcy51cmwgPSBvcHRpb25zLnVybDtcclxuICAgIHRoaXMuaXNBdmFpbGFibGUgPSB0cnVlO1xyXG5cclxuICAgIHRoaXMuc2F2ZUJ1dHRvbiA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuc2F2ZS1idXR0b24nKTtcclxuXHJcbiAgICB0aGlzLmVsZW0ub25jbGljayA9IGUgPT4ge1xyXG4gICAgICAgIGlmICghdGhpcy5pc0F2YWlsYWJsZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAoZS50YXJnZXQgIT09IHRoaXMuc2F2ZUJ1dHRvbikgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLmNsZWFyRXJyb3JCb3hlcygpO1xyXG4gICAgICAgIGxldCBlcnJvcnMgPSB0aGlzLmdldEVycm9ycygpO1xyXG4gICAgICAgIGlmIChlcnJvcnMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICB0aGlzLnNlbmQodGhpcy5nZXRCb2R5KCkpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5zZXRFcnJvcnMoZXJyb3JzKTtcclxuICAgIH07XHJcbn07XHJcblxyXG5Gb3JtLnByb3RvdHlwZS5zZXRQcm9wZXJ0eUVycm9yID0gZnVuY3Rpb24ocHJvcGVydHksIG1lc3NhZ2UpIHtcclxuICAgIHRoaXMuZ2V0RXJyb3JCb3gocHJvcGVydHkpLnRleHRDb250ZW50ID0gbWVzc2FnZTtcclxufTtcclxuXHJcbkZvcm0ucHJvdG90eXBlLmdldEVycm9yQm94ID0gZnVuY3Rpb24oZmllbGROYW1lKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lbGVtW2ZpZWxkTmFtZV0ucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudGV4dGJveF9fZXJyb3InKTtcclxufTtcclxuXHJcbkZvcm0ucHJvdG90eXBlLnNldEF2YWlsYWJsZSA9IGZ1bmN0aW9uKGlzQXZhaWxhYmxlKSB7XHJcbiAgICB0aGlzLmlzQXZhaWxhYmxlID0gaXNBdmFpbGFibGU7XHJcbn07XHJcblxyXG5Gb3JtLnByb3RvdHlwZS5nZXREYXRhT2JqID0gZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgb3B0aW9ucyA9IFtdO1xyXG5cclxuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmZpZWxkcykge1xyXG4gICAgICAgIGxldCBjaHVuayA9IHRoaXMuZmllbGRzW2tleV07XHJcbiAgICAgICAgaWYgKCFjaHVuay5ub1ZhbGlkYXRpb24pIHtcclxuICAgICAgICAgICAgaWYgKCFjaHVuay5wcm9wZXJ0eSlcclxuICAgICAgICAgICAgICAgIGNodW5rLnByb3BlcnR5ID0ga2V5O1xyXG4gICAgICAgICAgICBjaHVuay52YWx1ZSA9IHRoaXMuZWxlbVtrZXldLnZhbHVlO1xyXG4gICAgICAgICAgICBvcHRpb25zLnB1c2goY2h1bmspO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gb3B0aW9ucztcclxufTtcclxuXHJcbkZvcm0ucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbihib2R5KSB7XHJcbiAgICByZXF1aXJlKExJQlMgKyAnc2VuZFJlcXVlc3QnKShib2R5LCAnUE9TVCcsIHRoaXMudXJsLCAoZXJyLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIENsaWVudEVycm9yICYmIGVyci5kZXRhaWwpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFByb3BlcnR5RXJyb3IoZXJyLmRldGFpbC5wcm9wZXJ0eSwgZXJyLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLnRyaWdnZXIoJ2Zvcm1fc2VudCcsIHtcclxuICAgICAgICAgICAgcmVzcG9uc2VcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuXHJcbkZvcm0ucHJvdG90eXBlLmNsZWFyRXJyb3JCb3hlcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuZmllbGRzKVxyXG4gICAgICAgIHRoaXMuZ2V0RXJyb3JCb3goa2V5KS50ZXh0Q29udGVudCA9ICcnO1xyXG59O1xyXG5cclxuRm9ybS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuY2xlYXJFcnJvckJveGVzKCk7XHJcbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5maWVsZHMpXHJcbiAgICAgICAgdGhpcy5lbGVtW2tleV0udmFsdWUgPSAnJztcclxufTtcclxuXHJcbkZvcm0ucHJvdG90eXBlLmdldEVycm9ycyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIGdldEVycm9yQXJyYXkodGhpcy5nZXREYXRhT2JqKCkpO1xyXG59O1xyXG5cclxuXHJcbkZvcm0ucHJvdG90eXBlLnNldEVycm9ycyA9IGZ1bmN0aW9uKGVycm9ycykge1xyXG4gICAgdGhpcy5jbGVhckVycm9yQm94ZXMoKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXJyb3JzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGlmICh0aGlzLmdldEVycm9yQm94KGVycm9yc1tpXS5wcm9wZXJ0eSkudGV4dENvbnRlbnQgPT0gJycpXHJcbiAgICAgICAgICAgIHRoaXMuc2V0UHJvcGVydHlFcnJvcihlcnJvcnNbaV0ucHJvcGVydHksIGVycm9yc1tpXS5tZXNzYWdlKTtcclxufTtcclxuXHJcbkZvcm0ucHJvdG90eXBlLmdldEJvZHkgPSBmdW5jdGlvbigpIHtcclxuICAgIGxldCBib2R5ID0gJyc7XHJcblxyXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuZmllbGRzKVxyXG4gICAgICAgIGlmICghdGhpcy5maWVsZHNba2V5XS5leHRyYSlcclxuICAgICAgICAgICAgYm9keSArPSAoYm9keSA9PT0gJycgPyAnJyA6ICcmJykgK1xyXG4gICAgICAgICAgICBrZXkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodGhpcy5lbGVtW2tleV0udmFsdWUpO1xyXG4gICAgcmV0dXJuIGJvZHk7XHJcbn07XHJcblxyXG5mb3IgKGxldCBrZXkgaW4gZXZlbnRNaXhpbikge1xyXG4gICAgRm9ybS5wcm90b3R5cGVba2V5XSA9IGV2ZW50TWl4aW5ba2V5XTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGb3JtO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL2Zvcm0vaW5kZXguanMiLCJsZXQgU2VydmVyRXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuU2VydmVyRXJyb3I7XHJcbmxldCBDbGllbnRFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5DbGllbnRFcnJvcjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJvZHlPYmosIG1ldGhvZCwgdXJsLCBjYikge1xyXG5cclxuXHJcbiAgICBsZXQgYm9keSA9ICcnO1xyXG4gICAgaWYgKCEodHlwZW9mIGJvZHlPYmogPT09ICdzdHJpbmcnKSkge1xyXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBib2R5T2JqKSB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICBpZiAoYm9keU9ialtrZXldKVxyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBrZXkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoKHR5cGVvZiBib2R5T2JqW2tleV0gPT09ICdvYmplY3QnKSA/IEpTT04uc3RyaW5naWZ5KGJvZHlPYmpba2V5XSkgOiBib2R5T2JqW2tleV0pO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAgICAgICAgICBib2R5ICs9IChib2R5ID09PSAnJyA/ICcnIDogJyYnKSArIHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZVxyXG4gICAgICAgIGJvZHkgPSBib2R5T2JqO1xyXG5cclxuXHJcbiAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICB4aHIub3BlbihtZXRob2QsIHVybCwgdHJ1ZSk7XHJcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xyXG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJYLVJlcXVlc3RlZC1XaXRoXCIsIFwiWE1MSHR0cFJlcXVlc3RcIik7XHJcblxyXG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlICE9IDQpIHJldHVybjtcclxuXHJcbiAgICAgICAgbGV0IHJlc3BvbnNlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5yZXNwb25zZVRleHQpXHJcbiAgICAgICAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNiKG5ldyBTZXJ2ZXJFcnJvcignU2VydmVyIGlzIG5vdCByZXNwb25kaW5nJykpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwKVxyXG4gICAgICAgICAgICBjYihudWxsLCByZXNwb25zZSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSA0MDAgJiYgdGhpcy5zdGF0dXMgPCA1MDApXHJcbiAgICAgICAgICAgIGNiKG5ldyBDbGllbnRFcnJvcihyZXNwb25zZS5tZXNzYWdlLCByZXNwb25zZS5kZXRhaWwsIHRoaXMuc3RhdHVzKSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSA1MDApXHJcbiAgICAgICAgICAgIGNiKG5ldyBTZXJ2ZXJFcnJvcihyZXNwb25zZS5tZXNzYWdlLCB0aGlzLnN0YXR1cykpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhgc2VuZGluZyBuZXh0IHJlcXVlc3Q6ICR7Ym9keX1gKTtcclxuICAgIHhoci5zZW5kKGJvZHkpO1xyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvc2VuZFJlcXVlc3QuanMiLCJsZXQgRHJvcGRvd24gPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgIHRoaXMuZWxlbSA9IG9wdGlvbnMuZWxlbTtcclxuICAgIHRoaXMuaXRlbUxpc3QgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmRyb3Bkb3duX19pdGVtLWxpc3QnKTtcclxuICAgIHRoaXMuY2xhc3NOYW1lID0gb3B0aW9ucy5jbGFzc05hbWU7XHJcblxyXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuXHJcbiAgICAvLyB0aGlzLmVsZW0ub25jbGljayA9IGUgPT4ge1xyXG4gICAgLy8gICAgIHRoaXMudG9nZ2xlKCk7XHJcbiAgICAvLyB9O1xyXG5cclxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLml0ZW1MaXN0LmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5lbGVtLmNvbnRhaW5zKGUudGFyZ2V0KSlcclxuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlKCk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuYWN0aXZlKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sIGZhbHNlKTtcclxuXHJcblxyXG4gICAgdGhpcy5BRUhhbmRsZXIgPSB0aGlzLkFFSGFuZGxlci5iaW5kKHRoaXMpO1xyXG5cclxufTtcclxuXHJcbkRyb3Bkb3duLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3Bkb3duX2ludmlzaWJsZScpO1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoYCR7dGhpcy5jbGFzc05hbWV9X2FjdGl2ZWApO1xyXG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xyXG59O1xyXG5cclxuRHJvcGRvd24ucHJvdG90eXBlLmRlYWN0aXZhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLml0ZW1MaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbmVuZCcsIHRoaXMuQUVIYW5kbGVyLCBmYWxzZSk7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnZHJvcGRvd25fZmFkaW5nLW91dCcpO1xyXG59O1xyXG5cclxuRHJvcGRvd24ucHJvdG90eXBlLkFFSGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdkcm9wZG93bl9mYWRpbmctb3V0Jyk7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnZHJvcGRvd25faW52aXNpYmxlJyk7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZShgJHt0aGlzLmNsYXNzTmFtZX1fYWN0aXZlYCk7XHJcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5pdGVtTGlzdC5yZW1vdmVFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCB0aGlzLkFFSGFuZGxlcik7XHJcbn07XHJcblxyXG5Ecm9wZG93bi5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuYWN0aXZlKVxyXG4gICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHRoaXMuc2hvdygpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEcm9wZG93bjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL2Ryb3Bkb3duL2luZGV4LmpzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NldHRpbmdzL3N0eWxlLmxlc3Ncbi8vIG1vZHVsZSBpZCA9IDUyXG4vLyBtb2R1bGUgY2h1bmtzID0gMTAiLCJsZXQgZXZlbnRNaXhpbiA9IHJlcXVpcmUoTElCUyArICdldmVudE1peGluJyk7XHJcbmxldCBTb2NpYWxDb2xsZWN0aW9uID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cclxuICAgIHRoaXMuZWxlbSA9IG9wdGlvbnMuZWxlbTtcclxuICAgIHRoaXMuc29jaWFsTGlzdCA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuc29jaWFsLWNvbGxlY3Rpb25fX3NvY2lhbC1saXN0Jyk7XHJcbiAgICB0aGlzLnRleHRib3ggPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLnRleHRib3hfX2ZpZWxkJyk7XHJcblxyXG4gICAgdGhpcy5lbGVtLm9uY2xpY2sgPSBlID0+IHtcclxuXHJcbiAgICAgICAgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoJy50ZXh0Ym94LWJ1dHRvbl9fYnV0dG9uJykgJiYgdGhpcy50ZXh0Ym94LnZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZFNvY2lhbCh0aGlzLnRleHRib3gudmFsdWUpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZS50YXJnZXQubWF0Y2hlcygnLnNvY2lhbF9fY2xvc2UnKSlcclxuICAgICAgICAgICAgdGhpcy5kZWxldGVTb2NpYWwoZS50YXJnZXQuY2xvc2VzdCgnLnNvY2lhbCcpKTtcclxuICAgIH07XHJcbn07XHJcblxyXG4vL1RPRE8gbWFrZSBjaGVja2luZyB1c2VyJ3MgZGF0YSBvbiBjbGllbnQgc2lkZVxyXG5cclxuU29jaWFsQ29sbGVjdGlvbi5wcm90b3R5cGUuc2VuZFNvY2lhbCA9IGZ1bmN0aW9uKGxpbmspIHtcclxuICAgIHJlcXVpcmUoTElCUyArICdzZW5kUmVxdWVzdCcpKHtcclxuICAgICAgICBsaW5rXHJcbiAgICB9LCAnUE9TVCcsICcvc2V0dGluZ3MnLCAoZXJyLCByZXNwb25zZSkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbnNlcnROZXdTb2NpYWwocmVzcG9uc2UubGlua09iaik7XHJcbiAgICAgICAgdGhpcy50ZXh0Ym94LnZhbHVlID0gJyc7XHJcbiAgICB9KTtcclxuXHJcbn07XHJcblxyXG5Tb2NpYWxDb2xsZWN0aW9uLnByb3RvdHlwZS5kZWxldGVTb2NpYWwgPSBmdW5jdGlvbihzb2NpYWwpIHtcclxuICAgIHJlcXVpcmUoTElCUyArICdzZW5kUmVxdWVzdCcpKHtcclxuICAgICAgICBsaW5rOiBzb2NpYWwuZGF0YXNldC5saW5rXHJcbiAgICB9LCAnREVMRVRFJywgJy9zZXR0aW5ncycsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcblxyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzb2NpYWwucmVtb3ZlKCk7XHJcbiAgICB9KTtcclxuXHJcbn07XHJcblxyXG5Tb2NpYWxDb2xsZWN0aW9uLnByb3RvdHlwZS5pbnNlcnROZXdTb2NpYWwgPSBmdW5jdGlvbihsaW5rT2JqKSB7XHJcbiAgICBsZXQgc29jaWFsID0gcmVxdWlyZShMSUJTICsgJ3JlbmRlckVsZW1lbnQnKShyZXF1aXJlKCdodG1sLWxvYWRlciEuL3NvY2lhbCcpKTtcclxuICAgIHNvY2lhbC5kYXRhc2V0LmxpbmsgPSBsaW5rT2JqLmhyZWY7XHJcbiAgICBzb2NpYWwucXVlcnlTZWxlY3RvcignLnNvY2lhbF9fbGluaycpLnNldEF0dHJpYnV0ZSgnaHJlZicsIGxpbmtPYmouaHJlZik7XHJcbiAgICBzb2NpYWwucXVlcnlTZWxlY3RvcignLnNvY2lhbF9faG9zdCcpLnRleHRDb250ZW50ID0gbGlua09iai5ob3N0O1xyXG4gICAgdGhpcy5zb2NpYWxMaXN0LmFwcGVuZENoaWxkKHNvY2lhbCk7XHJcbn07XHJcblxyXG5mb3IgKGxldCBrZXkgaW4gZXZlbnRNaXhpbikge1xyXG4gICAgU29jaWFsQ29sbGVjdGlvbi5wcm90b3R5cGVba2V5XSA9IGV2ZW50TWl4aW5ba2V5XTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTb2NpYWxDb2xsZWN0aW9uO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL3NvY2lhbC1jb2xsZWN0aW9uL2luZGV4LmpzIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtYXJrdXApIHtcclxuXHRsZXQgcGFyZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyk7XHJcblx0cGFyZW50LmlubmVySFRNTCA9IG1hcmt1cDsgXHJcblx0bGV0IGVsZW1lbnQgPSBwYXJlbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcblx0cmV0dXJuIGVsZW1lbnQ7XHJcbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL3JlbmRlckVsZW1lbnQuanMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBjbGFzcz1cXFwic29jaWFsLWNvbGxlY3Rpb25fX3NvY2lhbCBzb2NpYWxcXFwiIGRhdGEtbGluaz1cXFwiXFxcIj5cXHJcXG4gICAgPGEgY2xhc3M9XFxcInNvY2lhbF9fbGlua1xcXCIgaHJlZj1cXFwiXFxcIj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcInNvY2lhbF9faWNvbiBpY29uLXNwaGVyZVxcXCI+PC9kaXY+XFxyXFxuICAgICAgICA8c3BhbiBjbGFzcz1cXFwic29jaWFsX19ob3N0XFxcIj48L3NwYW4+XFxyXFxuICAgIDwvYT5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwic29jaWFsX19jbG9zZSBpY29uLWNyb3NzXFxcIj48L2Rpdj5cXHJcXG48L2Rpdj5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svfi9odG1sLWxvYWRlciEuLi9ibG9ja3Mvc29jaWFsLWNvbGxlY3Rpb24vc29jaWFsXG4vLyBtb2R1bGUgaWQgPSA1NlxuLy8gbW9kdWxlIGNodW5rcyA9IDEwIiwibGV0IGV2ZW50TWl4aW4gPSByZXF1aXJlKExJQlMgKyAnZXZlbnRNaXhpbicpO1xyXG5sZXQgRmlsZVBpY2tlciA9IHJlcXVpcmUoQkxPQ0tTICsgJ2ZpbGUtcGlja2VyJyk7XHJcblxyXG5sZXQgQ2xpZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ2xpZW50RXJyb3I7XHJcblxyXG5sZXQgVXBsb2FkQXZhdGFyU2VjdGlvbiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLmVsZW0gPSBvcHRpb25zLmVsZW07XHJcbiAgICB0aGlzLnVwbG9hZEJ1dHRvbiA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcudXBsb2FkLWF2YXRhci1zZWN0aW9uX191cGxvYWQtYnV0dG9uJyk7XHJcbiAgICB0aGlzLmRlbGV0ZUJ1dHRvbiA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcudXBsb2FkLWF2YXRhci1zZWN0aW9uX19kZWxldGUtYnV0dG9uJyk7XHJcbiAgICB0aGlzLmZpbGVQaWNrZXIgPSBuZXcgRmlsZVBpY2tlcih7XHJcbiAgICAgICAgZWxlbTogdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5maWxlLXBpY2tlcicpXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmF2YXRhciA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcudXBsb2FkLWF2YXRhci1zZWN0aW9uX19hdmF0YXInKTtcclxuXHJcbiAgICB0aGlzLmVsZW0ub25jbGljayA9IGUgPT4ge1xyXG5cclxuICAgICAgICBpZiAoZS50YXJnZXQgPT09IHRoaXMudXBsb2FkQnV0dG9uKSB7XHJcbiAgICAgICAgICAgIGxldCBmaWxlID0gdGhpcy5maWxlUGlja2VyLmdldEZpbGUoKTtcclxuICAgICAgICAgICAgaWYgKGZpbGUpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwbG9hZEF2YXRhcihmaWxlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChlLnRhcmdldCA9PT0gdGhpcy5kZWxldGVCdXR0b24pXHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlQXZhdGFyKCk7XHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuXHJcblVwbG9hZEF2YXRhclNlY3Rpb24ucHJvdG90eXBlLmRlbGV0ZUF2YXRhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJlcXVpcmUoTElCUyArICdzZW5kUmVxdWVzdCcpKG51bGwsICdERUxFVEUnLCAnL2F2YXRhcicsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hdmF0YXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgnJHtBTk9OX0FWQVRBUl9VUkx9JylgO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5VcGxvYWRBdmF0YXJTZWN0aW9uLnByb3RvdHlwZS51cGxvYWRBdmF0YXIgPSBmdW5jdGlvbiAoZmlsZSkge1xyXG4gICAgbGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoXCJhdmF0YXJcIiwgZmlsZSk7XHJcblxyXG4gICAgcmVxdWlyZShMSUJTICsgJ3NlbmRGb3JtRGF0YScpKFwiL2F2YXRhclwiLCBmb3JtRGF0YSwgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmF2YXRhci5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCcke3Jlc3BvbnNlLnVybH0/JHtuZXcgRGF0ZSgpLmdldFRpbWUoKX0nKWA7XHJcblxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5mb3IgKGxldCBrZXkgaW4gZXZlbnRNaXhpbikge1xyXG4gICAgVXBsb2FkQXZhdGFyU2VjdGlvbi5wcm90b3R5cGVba2V5XSA9IGV2ZW50TWl4aW5ba2V5XTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBVcGxvYWRBdmF0YXJTZWN0aW9uO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvdXBsb2FkLWF2YXRhci1zZWN0aW9uL2luZGV4LmpzIiwiY29uc3QgREVGQVVMVF9WQUxVRSA9ICdubyBmaWxlIGNob3Nlbic7XHJcbmNvbnN0IERFRkFVTFRfRk5fTEVOR1RIID0gREVGQVVMVF9WQUxVRS5sZW5ndGg7XHJcblxyXG5sZXQgRmlsZVBpY2tlciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgdGhpcy5maWxlTmFtZUxlbmd0aCA9IG9wdGlvbnMuZmlsZU5hbWVMZW5ndGggfHwgREVGQVVMVF9GTl9MRU5HVEg7XHJcblxyXG4gICAgdGhpcy51cGxvYWRJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICB0aGlzLnVwbG9hZElucHV0LnR5cGUgPSBcImZpbGVcIjtcclxuICAgIHRoaXMudXBsb2FkSW5wdXQuYWNjZXB0ID0gXCJpbWFnZS8qXCI7XHJcblxyXG4gICAgdGhpcy5lbGVtID0gb3B0aW9ucy5lbGVtO1xyXG4gICAgdGhpcy5mcEJ1dHRvbiA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuZmlsZS1waWNrZXJfX2J1dHRvbicpO1xyXG4gICAgdGhpcy5mcEZpbGVOYW1lID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5maWxlLXBpY2tlcl9fZmlsZW5hbWUnKTtcclxuXHJcbiAgICB0aGlzLmZwQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgdGhpcy51cGxvYWRJbnB1dC5jbGljaygpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy51cGxvYWRJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBlID0+IHtcclxuICAgICAgICB0aGlzLnNldFZpc2libGVGaWxlTmFtZSgpO1xyXG4gICAgfSk7XHJcblxyXG59O1xyXG5cclxuRmlsZVBpY2tlci5wcm90b3R5cGUuc2V0VmlzaWJsZUZpbGVOYW1lID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGZpbGVuYW1lID0gdGhpcy51cGxvYWRJbnB1dC52YWx1ZS5zdWJzdHJpbmcodGhpcy51cGxvYWRJbnB1dC52YWx1ZS5sYXN0SW5kZXhPZignXFxcXCcpICsgMSk7XHJcblxyXG4gICAgbGV0IHZpc2libGVGaWxlTmFtZTtcclxuICAgIGxldCBwYXJ0U2l6ZSA9IH5+KCh0aGlzLmZpbGVOYW1lTGVuZ3RoIC0gMSkgLyAyKTtcclxuXHJcbiAgICBpZiAoZmlsZW5hbWUubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIHZpc2libGVGaWxlTmFtZSA9IERFRkFVTFRfVkFMVUU7XHJcbiAgICBlbHNlIGlmIChmaWxlbmFtZS5sZW5ndGggPD0gdGhpcy5maWxlTmFtZUxlbmd0aCkge1xyXG4gICAgICAgIHRoaXMuZnBGaWxlTmFtZS50aXRsZSA9ICcnO1xyXG4gICAgICAgIHZpc2libGVGaWxlTmFtZSA9IGZpbGVuYW1lO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmZwRmlsZU5hbWUudGl0bGUgPSBmaWxlbmFtZTtcclxuICAgICAgICB2aXNpYmxlRmlsZU5hbWUgPSBmaWxlbmFtZS5zbGljZSgwLCBwYXJ0U2l6ZSkgKyAn4oCmJyArIGZpbGVuYW1lLnNsaWNlKC1wYXJ0U2l6ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5mcEZpbGVOYW1lLnRleHRDb250ZW50ID0gdmlzaWJsZUZpbGVOYW1lO1xyXG59O1xyXG5cclxuRmlsZVBpY2tlci5wcm90b3R5cGUuZ2V0RmlsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB0aGlzLnVwbG9hZElucHV0LmZpbGVzWzBdO1xyXG59O1xyXG5cclxuRmlsZVBpY2tlci5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLnVwbG9hZElucHV0LnZhbHVlID0gJyc7XHJcbiAgICB0aGlzLmZwRmlsZU5hbWUudGV4dENvbnRlbnQgPSBERUZBVUxUX1ZBTFVFO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGaWxlUGlja2VyO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL2ZpbGUtcGlja2VyL2luZGV4LmpzIiwibGV0IFNlcnZlckVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLlNlcnZlckVycm9yO1xyXG5sZXQgQ2xpZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ2xpZW50RXJyb3I7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1cmwsIGZvcm1EYXRhLCBjYikge1xyXG4gICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgLy8geGhyLnVwbG9hZC5vbnByb2dyZXNzID0gZXZlbnQgPT4ge1xyXG4gICAgLy8gXHQgICBjb25zb2xlLmxvZyhldmVudC5sb2FkZWQgKyAnIC8gJyArIGV2ZW50LnRvdGFsKTtcclxuICAgIC8vIH07XHJcblxyXG4gICAgeGhyLm9ubG9hZCA9IHhoci5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGxldCByZXNwb25zZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucmVzcG9uc2VUZXh0KVxyXG4gICAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjYihuZXcgU2VydmVyRXJyb3IoJ1NlcnZlciBpcyBub3QgcmVzcG9uZGluZycpKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCAzMDApXHJcbiAgICAgICAgICAgIGNiKG51bGwsIHJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDQwMCAmJiB0aGlzLnN0YXR1cyA8IDUwMClcclxuICAgICAgICAgICAgY2IobmV3IENsaWVudEVycm9yKHJlc3BvbnNlLm1lc3NhZ2UpKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDUwMClcclxuICAgICAgICAgICAgY2IobmV3IFNlcnZlckVycm9yKHJlc3BvbnNlLm1lc3NhZ2UpKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHhoci5vcGVuKFwiUE9TVFwiLCB1cmwsIHRydWUpO1xyXG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtUmVxdWVzdGVkLVdpdGgnLCAnWE1MSHR0cFJlcXVlc3QnKTtcclxuICAgIHhoci5zZW5kKGZvcm1EYXRhKTtcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL3NlbmRGb3JtRGF0YS5qcyIsImxldCBldmVudE1peGluID0gcmVxdWlyZShMSUJTICsgJ2V2ZW50TWl4aW4nKTtcclxubGV0IENsaWVudEVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLkNsaWVudEVycm9yO1xyXG5sZXQgTWVzc2FnZU1vZGFsV2luZG93ID0gcmVxdWlyZShCTE9DS1MgKyAnbWVzc2FnZS1tb2RhbC13aW5kb3cnKTtcclxuXHJcblxyXG5sZXQgRGVzY3JpcHRpb25BZGRTZWN0aW9uID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuZWxlbSA9IG9wdGlvbnMuZWxlbTtcclxuICAgIHRoaXMuc2F2ZUJ1dHRvbiA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuYnV0dG9uJyk7XHJcbiAgICB0aGlzLnRleHRhcmVhID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy50ZXh0YXJlYSB0ZXh0YXJlYScpO1xyXG5cclxuICAgIHRoaXMuZWxlbS5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgaWYgKGUudGFyZ2V0ICE9PSB0aGlzLnNhdmVCdXR0b24pIHJldHVybjtcclxuICAgICAgICBsZXQgZGVzY3JpcHRpb24gPSB0aGlzLnRleHRhcmVhLnZhbHVlO1xyXG4gICAgICAgIGxldCBlcnJvcnMgPSByZXF1aXJlKExJQlMgKyAnY2hlY2tVc2VyRGF0YScpLmdldEVycm9yQXJyYXkoe1xyXG4gICAgICAgICAgICBkZXNjcmlwdGlvblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoZXJyb3JzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgdGhpcy5zZW5kRGVzY3JpcHRpb24odGhpcy50ZXh0YXJlYS52YWx1ZSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmVycm9yKG5ldyBDbGllbnRFcnJvcihlcnJvcnNbMF0ubWVzc2FnZSkpO1xyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5EZXNjcmlwdGlvbkFkZFNlY3Rpb24ucHJvdG90eXBlLnNlbmREZXNjcmlwdGlvbiA9IGZ1bmN0aW9uIChkZXNjcmlwdGlvbikge1xyXG4gICAgcmVxdWlyZShMSUJTICsgJ3NlbmRSZXF1ZXN0Jykoe1xyXG4gICAgICAgIGRlc2NyaXB0aW9uXHJcbiAgICB9LCAnUE9TVCcsICcvc2V0dGluZ3MnLCAoZXJyLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbWVzc2FnZU1vZGFsV2luZG93ID0gbmV3IE1lc3NhZ2VNb2RhbFdpbmRvdyh7bWVzc2FnZTogJ0Rlc2NyaXB0aW9uIGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSBjaGFuZ2VkJ30pO1xyXG4gICAgICAgIG1lc3NhZ2VNb2RhbFdpbmRvdy5zaG93KCk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbmZvciAobGV0IGtleSBpbiBldmVudE1peGluKSB7XHJcbiAgICBEZXNjcmlwdGlvbkFkZFNlY3Rpb24ucHJvdG90eXBlW2tleV0gPSBldmVudE1peGluW2tleV07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRGVzY3JpcHRpb25BZGRTZWN0aW9uO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL2Rlc2NyaXB0aW9uLWFkZC1zZWN0aW9uL2luZGV4LmpzIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7OztBQUVBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUdBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7Ozs7Ozs7O0FDdFFBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNiQTs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7O0FDRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUdBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFkQTtBQUFBO0FBZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDMU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDL0NBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3JEQTs7Ozs7Ozs7O0FDQUE7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOzs7QUFHQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNKQTs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBRUE7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Iiwic291cmNlUm9vdCI6IiJ9