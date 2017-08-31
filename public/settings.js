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
		ComponentError.call(this, message || 'An error has occurred. Check if javascript is enabled', status);
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
		ComponentError.call(this, message || 'There is some error on the server side', status);
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
	            errorMessage: 'must only contain alphanumeric symbols',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zZXR0aW5ncy9zY3JpcHQuanMiLCJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2NvbXBvbmVudEVycm9ycy5qcz9hY2I1Iiwid2VicGFjazovLy8uLi9ibG9ja3MvbWVzc2FnZS1tb2RhbC13aW5kb3cvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9tb2RhbC9pbmRleC5qcz85YzQ2Iiwid2VicGFjazovLy9EOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9ldmVudE1peGluLmpzPzNjYmMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9zcGlubmVyL2luZGV4LmpzPzA0OTIiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9zcGlubmVyL21hcmt1cD80N2Q3Iiwid2VicGFjazovLy8uLi9ibG9ja3MvbWVzc2FnZS1tb2RhbC13aW5kb3cvd2luZG93Iiwid2VicGFjazovLy9EOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9jaGVja1VzZXJEYXRhLmpzIiwid2VicGFjazovLy8uLi9ibG9ja3MvZm9ybS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvc2VuZFJlcXVlc3QuanM/OGEyNyIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2Ryb3Bkb3duL2luZGV4LmpzPzVlMjkiLCJ3ZWJwYWNrOi8vLy4vc2V0dGluZ3Mvc3R5bGUubGVzcyIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL3NvY2lhbC1jb2xsZWN0aW9uL2luZGV4LmpzIiwid2VicGFjazovLy9EOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9yZW5kZXJFbGVtZW50LmpzIiwid2VicGFjazovLy8uLi9ibG9ja3Mvc29jaWFsLWNvbGxlY3Rpb24vc29jaWFsIiwid2VicGFjazovLy8uLi9ibG9ja3MvdXBsb2FkLWF2YXRhci1zZWN0aW9uL2luZGV4LmpzIiwid2VicGFjazovLy8uLi9ibG9ja3MvZmlsZS1waWNrZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL3NlbmRGb3JtRGF0YS5qcyIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2Rlc2NyaXB0aW9uLWFkZC1zZWN0aW9uL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICcuL3N0eWxlLmxlc3MnO1xyXG5cclxubGV0IEdsb2JhbEVycm9ySGFuZGxlciA9IHJlcXVpcmUoQkxPQ0tTICsgJ2dsb2JhbC1lcnJvci1oYW5kbGVyJyk7XHJcbmxldCBnbG9iYWxFcnJvckhhbmRsZXIgPSBuZXcgR2xvYmFsRXJyb3JIYW5kbGVyKCk7XHJcblxyXG5sZXQgRHJvcGRvd24gPSByZXF1aXJlKEJMT0NLUyArICdkcm9wZG93bicpO1xyXG5sZXQgU29jaWFsQ29sbGVjdGlvbiA9IHJlcXVpcmUoQkxPQ0tTICsgJ3NvY2lhbC1jb2xsZWN0aW9uJyk7XHJcbmxldCBVcGxvYWRBdmF0YXJTZWN0aW9uID0gcmVxdWlyZShCTE9DS1MgKyAndXBsb2FkLWF2YXRhci1zZWN0aW9uJyk7XHJcbmxldCBEZXNjcmlwdGlvbkFkZFNlY3Rpb24gPSByZXF1aXJlKEJMT0NLUyArICdkZXNjcmlwdGlvbi1hZGQtc2VjdGlvbicpO1xyXG5sZXQgRm9ybSA9IHJlcXVpcmUoQkxPQ0tTICsgJ2Zvcm0nKTtcclxubGV0IE1lc3NhZ2VNb2RhbFdpbmRvdyA9IHJlcXVpcmUoQkxPQ0tTICsgJ21lc3NhZ2UtbW9kYWwtd2luZG93Jyk7XHJcblxyXG5sZXQgdXNlck1lbnVEcm9wZG93biA9IG5ldyBEcm9wZG93bih7XHJcbiAgICBlbGVtOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlci1tZW51JyksXHJcbiAgICBjbGFzc05hbWU6ICdoZWFkZXItZWxlbWVudCdcclxufSk7XHJcblxyXG5sZXQgc29jaWFsQ29sbGVjdGlvbiA9IG5ldyBTb2NpYWxDb2xsZWN0aW9uKHtcclxuICAgIGVsZW06IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzb2NpYWwtY29sbGVjdGlvbicpXHJcbn0pO1xyXG5cclxubGV0IHVwbG9hZEF2YXRhclNlY3Rpb24gPSBuZXcgVXBsb2FkQXZhdGFyU2VjdGlvbih7XHJcbiAgICBlbGVtOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXBsb2FkLWF2YXRhci1zZWN0aW9uJylcclxufSk7XHJcblxyXG5sZXQgZGVzY3JpcHRpb25BZGRTZWN0aW9uID0gbmV3IERlc2NyaXB0aW9uQWRkU2VjdGlvbih7XHJcbiAgICBlbGVtOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVzY3JpcHRpb24tYWRkLXNlY3Rpb24nKVxyXG59KTtcclxuXHJcbmxldCBwYXNzd29yZENoYW5nZUZvcm0gPSBuZXcgRm9ybSh7XHJcbiAgICBlbGVtOiBkb2N1bWVudC5mb3Jtc1snY2hhbmdlLXBhc3N3b3JkJ10sXHJcbiAgICBmaWVsZHM6IHtcclxuICAgICAgICAnb2xkLXBhc3N3b3JkJzoge1xyXG4gICAgICAgICAgICB2YWxpZGF0b3I6ICdub24tZW1wdHknLFxyXG4gICAgICAgICAgICBhbGlhczogJ29sZCBwYXNzd29yZCcsXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgJ25ldy1wYXNzd29yZCc6IHtcclxuICAgICAgICAgICAgdmFsaWRhdG9yOiAncGFzc3dvcmQnLFxyXG4gICAgICAgICAgICBhbGlhczogJ25ldyBwYXNzd29yZCcsXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgJ25ldy1hZ2Fpbic6IHtcclxuICAgICAgICAgICAgdmFsaWRhdG9yOiAncGFzc3dvcmQtYWdhaW4nLFxyXG4gICAgICAgICAgICBhbGlhczogJ25ldyBwYXNzd29yZCcsXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiAnbmV3LXBhc3N3b3JkJyxcclxuICAgICAgICAgICAgZXh0cmE6IHRydWVcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgdXJsOiAnL3NldHRpbmdzJ1xyXG59KTtcclxuXHJcbnBhc3N3b3JkQ2hhbmdlRm9ybS5vbignZm9ybV9zZW50JywgZSA9PiB7XHJcbiAgICBsZXQgbWVzc2FnZU1vZGFsV2luZG93ID0gbmV3IE1lc3NhZ2VNb2RhbFdpbmRvdyh7bWVzc2FnZTogJ1Bhc3N3b3JkIGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSBjaGFuZ2VkJ30pO1xyXG4gICAgbWVzc2FnZU1vZGFsV2luZG93LnNob3coKTtcclxufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2V0dGluZ3Mvc2NyaXB0LmpzIiwiZnVuY3Rpb24gQ3VzdG9tRXJyb3IobWVzc2FnZSkge1xyXG5cdHRoaXMubmFtZSA9IFwiQ3VzdG9tRXJyb3JcIjtcclxuXHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG5cclxuXHRpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpXHJcblx0XHRFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBDdXN0b21FcnJvcik7XHJcblx0ZWxzZVxyXG5cdFx0dGhpcy5zdGFjayA9IChuZXcgRXJyb3IoKSkuc3RhY2s7XHJcbn1cclxuQ3VzdG9tRXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpO1xyXG5DdXN0b21FcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDdXN0b21FcnJvcjtcclxuXHJcblxyXG5mdW5jdGlvbiBDb21wb25lbnRFcnJvcihtZXNzYWdlLCBzdGF0dXMpIHtcclxuXHRDdXN0b21FcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ0FuIGVycm9yIGhhcyBvY2N1cnJlZCcgKTtcclxuXHR0aGlzLm5hbWUgPSBcIkNvbXBvbmVudEVycm9yXCI7XHJcblx0dGhpcy5zdGF0dXMgPSBzdGF0dXM7XHJcbn1cclxuQ29tcG9uZW50RXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDdXN0b21FcnJvci5wcm90b3R5cGUpO1xyXG5Db21wb25lbnRFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDb21wb25lbnRFcnJvcjtcclxuXHJcbmZ1bmN0aW9uIENsaWVudEVycm9yKG1lc3NhZ2UsIGRldGFpbCwgc3RhdHVzKSB7XHJcblx0Q29tcG9uZW50RXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlIHx8ICdBbiBlcnJvciBoYXMgb2NjdXJyZWQuIENoZWNrIGlmIGphdmFzY3JpcHQgaXMgZW5hYmxlZCcsIHN0YXR1cyk7XHJcblx0dGhpcy5uYW1lID0gXCJDbGllbnRFcnJvclwiO1xyXG5cdHRoaXMuZGV0YWlsID0gZGV0YWlsO1xyXG59XHJcbkNsaWVudEVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29tcG9uZW50RXJyb3IucHJvdG90eXBlKTtcclxuQ2xpZW50RXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ2xpZW50RXJyb3I7XHJcblxyXG5cclxuZnVuY3Rpb24gSW1hZ2VOb3RGb3VuZChtZXNzYWdlKSB7XHJcbiAgICBDbGllbnRFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ0ltYWdlIG5vdCBmb3VuZC4gSXQgcHJvYmFibHkgaGFzIGJlZW4gcmVtb3ZlZCcsIG51bGwsIDQwNCk7XHJcbiAgICB0aGlzLm5hbWUgPSBcIkltYWdlTm90Rm91bmRcIjtcclxufVxyXG5JbWFnZU5vdEZvdW5kLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ2xpZW50RXJyb3IucHJvdG90eXBlKTtcclxuSW1hZ2VOb3RGb3VuZC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBJbWFnZU5vdEZvdW5kO1xyXG5cclxuZnVuY3Rpb24gU2VydmVyRXJyb3IobWVzc2FnZSwgc3RhdHVzKSB7XHJcblx0Q29tcG9uZW50RXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlIHx8ICdUaGVyZSBpcyBzb21lIGVycm9yIG9uIHRoZSBzZXJ2ZXIgc2lkZScsIHN0YXR1cyk7XHJcblx0dGhpcy5uYW1lID0gXCJTZXJ2ZXJFcnJvclwiO1xyXG59XHJcblNlcnZlckVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29tcG9uZW50RXJyb3IucHJvdG90eXBlKTtcclxuU2VydmVyRXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2VydmVyRXJyb3I7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRDb21wb25lbnRFcnJvcixcclxuXHRDbGllbnRFcnJvcixcclxuICAgIEltYWdlTm90Rm91bmQsXHJcblx0U2VydmVyRXJyb3JcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2NvbXBvbmVudEVycm9ycy5qcyIsImxldCBNb2RhbCA9IHJlcXVpcmUoQkxPQ0tTICsgJ21vZGFsJyk7XHJcblxyXG5sZXQgTWVzc2FnZU1vZGFsV2luZG93ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIE1vZGFsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICB0aGlzLmVsZW0gPSBudWxsO1xyXG4gICAgdGhpcy5lbGVtSWQgPSAnbWVzc2FnZS1tb2RhbC13aW5kb3cnO1xyXG4gICAgdGhpcy5jYXB0aW9uID0gb3B0aW9ucyAmJiBvcHRpb25zLmNhcHRpb24gfHwgJ21lc3NhZ2UnO1xyXG4gICAgdGhpcy5tZXNzYWdlID0gb3B0aW9ucyAmJiBvcHRpb25zLm1lc3NhZ2UgfHwgJ1lvdSB3ZXJlIG5vdCBzdXBwb3NlIHRvIHNlZSB0aGlzISBTZWVtcyBsaWtlIHNvbWV0aGluZyBpcyBicm9rZW4gOignO1xyXG5cclxufTtcclxuTWVzc2FnZU1vZGFsV2luZG93LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoTW9kYWwucHJvdG90eXBlKTtcclxuTWVzc2FnZU1vZGFsV2luZG93LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IE1lc3NhZ2VNb2RhbFdpbmRvdztcclxuXHJcbk1lc3NhZ2VNb2RhbFdpbmRvdy5wcm90b3R5cGUuc2V0RWxlbSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuc2V0V2luZG93SHRtbCgpO1xyXG4gICAgdGhpcy5lbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5lbGVtSWQpO1xyXG4gICAgaWYgKCF0aGlzLmVsZW0pXHJcbiAgICAgICAgdGhpcy5lbGVtID0gdGhpcy5yZW5kZXJXaW5kb3codGhpcy53aW5kb3dIdG1sKTtcclxuICAgIHRoaXMuc2V0TGlzdGVuZXJzKCk7XHJcbiAgICB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmhlYWRlcicpLnRleHRDb250ZW50ID0gdGhpcy5jYXB0aW9uO1xyXG4gICAgdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5tZXNzYWdlLW1vZGFsLXdpbmRvd19fbWVzc2FnZScpLnRleHRDb250ZW50ID0gdGhpcy5tZXNzYWdlO1xyXG5cclxuICAgIHRoaXMuZWxlbS5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgdGhpcy5vbkVsZW1DbGljayhlKTtcclxuICAgICAgICBpZiAoZS50YXJnZXQubWF0Y2hlcygnLm1lc3NhZ2UtbW9kYWwtd2luZG93X19vay1idXR0b24nKSlcclxuICAgICAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XHJcbiAgICB9O1xyXG59O1xyXG5cclxuTWVzc2FnZU1vZGFsV2luZG93LnByb3RvdHlwZS5zZXRXaW5kb3dIdG1sID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy53aW5kb3dIdG1sID0gcmVxdWlyZShgaHRtbC1sb2FkZXIhLi93aW5kb3dgKTtcclxufTtcclxuXHJcbk1lc3NhZ2VNb2RhbFdpbmRvdy5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIE1vZGFsLnByb3RvdHlwZS5zaG93LmFwcGx5KHRoaXMpO1xyXG5cclxuICAgIGlmICghdGhpcy5lbGVtKVxyXG4gICAgICAgIHRoaXMuc2V0RWxlbSgpO1xyXG5cclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3dfaW52aXNpYmxlJyk7XHJcbn07XHJcblxyXG5NZXNzYWdlTW9kYWxXaW5kb3cucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBNb2RhbC5wcm90b3R5cGUuaGlkZS5hcHBseSh0aGlzKTtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCd3aW5kb3dfaW52aXNpYmxlJyk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lc3NhZ2VNb2RhbFdpbmRvdztcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9tZXNzYWdlLW1vZGFsLXdpbmRvdy9pbmRleC5qcyIsImxldCBldmVudE1peGluID0gcmVxdWlyZShMSUJTICsgJ2V2ZW50TWl4aW4nKTtcclxubGV0IFNwaW5uZXIgPSByZXF1aXJlKEJMT0NLUyArICdzcGlubmVyJyk7XHJcblxyXG5sZXQgTW9kYWwgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuICAgIHRoaXMubGlzdGVuZXJzID0gW107XHJcbiAgICB0aGlzLnN0YXR1cyA9IG9wdGlvbnMgJiYgb3B0aW9ucy5zdGF0dXMgfHwgTW9kYWwuc3RhdHVzZXMuTUlOT1I7XHJcbn07XHJcblxyXG5Nb2RhbC5zdGF0dXNlcyA9IHtcclxuICAgIE1BSk9SOiAxLFxyXG4gICAgTUlOT1I6IDJcclxufTtcclxuXHJcbk1vZGFsLnByb3RvdHlwZS5vbkVsZW1DbGljayA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICBpZiAoZS50YXJnZXQubWF0Y2hlcygnLm1vZGFsLWNsb3NlLWJ1dHRvbicpKVxyXG4gICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xyXG59O1xyXG5cclxuTW9kYWwucHJvdG90eXBlLnNldExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMubGlzdGVuZXJzLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgdGhpcy5lbGVtLmFkZEV2ZW50TGlzdGVuZXIoaXRlbS5ldmVudE5hbWUsIGl0ZW0uY2IpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5Nb2RhbC5zZXRCYWNrZHJvcCA9IGZ1bmN0aW9uIChzdGF0dXMpIHtcclxuICAgIGlmIChzdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKSB7XHJcbiAgICAgICAgTW9kYWwubWlub3JCYWNrZHJvcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrZHJvcF9taW5vcicpO1xyXG4gICAgICAgIGlmICghTW9kYWwubWlub3JCYWNrZHJvcClcclxuICAgICAgICAgICAgTW9kYWwubWlub3JCYWNrZHJvcCA9IE1vZGFsLnJlbmRlckJhY2tkcm9wKCdtaW5vcicpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBNb2RhbC5tYWpvckJhY2tkcm9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tkcm9wX21ham9yJyk7XHJcbiAgICAgICAgaWYgKCFNb2RhbC5tYWpvckJhY2tkcm9wKVxyXG4gICAgICAgICAgICBNb2RhbC5tYWpvckJhY2tkcm9wID0gTW9kYWwucmVuZGVyQmFja2Ryb3AoJ21ham9yJyk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5Nb2RhbC5zZXRXcmFwcGVyID0gZnVuY3Rpb24gKHN0YXR1cykge1xyXG4gICAgaWYgKHN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpIHtcclxuICAgICAgICBNb2RhbC5taW5vcldyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtd3JhcHBlci1taW5vcicpO1xyXG4gICAgICAgIGlmICghTW9kYWwubWlub3JXcmFwcGVyKVxyXG4gICAgICAgICAgICBNb2RhbC5taW5vcldyYXBwZXIgPSBNb2RhbC5yZW5kZXJXcmFwcGVyKCdtaW5vcicpO1xyXG4gICAgICAgIE1vZGFsLm1pbm9yV3JhcHBlci5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldCAmJiAhZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2RhbC13cmFwcGVyX21pbm9yJykpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKE1vZGFsLm1pbm9yQWN0aXZlKVxyXG4gICAgICAgICAgICAgICAgTW9kYWwubWlub3JRdWV1ZVswXS5kZWFjdGl2YXRlKCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgTW9kYWwubWFqb3JXcmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLXdyYXBwZXItbWFqb3InKTtcclxuICAgICAgICBpZiAoIU1vZGFsLm1ham9yV3JhcHBlcilcclxuICAgICAgICAgICAgTW9kYWwubWFqb3JXcmFwcGVyID0gTW9kYWwucmVuZGVyV3JhcHBlcignbWFqb3InKTtcclxuICAgICAgICBNb2RhbC5tYWpvcldyYXBwZXIub25jbGljayA9IGUgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZS50YXJnZXQgJiYgIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbW9kYWwtd3JhcHBlcl9tYWpvcicpKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChNb2RhbC5tYWpvckFjdGl2ZSlcclxuICAgICAgICAgICAgICAgIE1vZGFsLm1ham9yUXVldWVbMF0uZGVhY3RpdmF0ZSgpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn07XHJcblxyXG5Nb2RhbC5yZW5kZXJCYWNrZHJvcCA9IGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICBsZXQgYmFja2Ryb3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKTtcclxuICAgIGJhY2tkcm9wLmNsYXNzTmFtZSA9ICdiYWNrZHJvcCBiYWNrZHJvcF9pbnZpc2libGUnO1xyXG4gICAgYmFja2Ryb3AuY2xhc3NMaXN0LmFkZChgYmFja2Ryb3BfJHt0eXBlfWApO1xyXG4gICAgYmFja2Ryb3AuaWQgPSBgYmFja2Ryb3AtJHt0eXBlfWA7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGJhY2tkcm9wKTtcclxuICAgIHJldHVybiBiYWNrZHJvcDtcclxufTtcclxuXHJcbk1vZGFsLnJlbmRlcldyYXBwZXIgPSBmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgbGV0IHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKTtcclxuICAgIHdyYXBwZXIuY2xhc3NOYW1lID0gJ21vZGFsLXdyYXBwZXIgbW9kYWwtd3JhcHBlcl9pbnZpc2libGUnO1xyXG4gICAgd3JhcHBlci5jbGFzc0xpc3QuYWRkKGBtb2RhbC13cmFwcGVyXyR7dHlwZX1gKTtcclxuICAgIHdyYXBwZXIuaWQgPSBgbW9kYWwtd3JhcHBlci0ke3R5cGV9YDtcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQod3JhcHBlcik7XHJcbiAgICByZXR1cm4gd3JhcHBlcjtcclxufTtcclxuXHJcbk1vZGFsLnByb3RvdHlwZS5yZW5kZXJXaW5kb3cgPSBmdW5jdGlvbiAoaHRtbCkge1xyXG5cclxuICAgIGxldCBwYXJlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKTtcclxuICAgIHBhcmVudC5pbm5lckhUTUwgPSBodG1sO1xyXG4gICAgbGV0IHduZCA9IHBhcmVudC5maXJzdEVsZW1lbnRDaGlsZDtcclxuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpXHJcbiAgICAgICAgTW9kYWwubWlub3JXcmFwcGVyLmFwcGVuZENoaWxkKHduZCk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgTW9kYWwubWFqb3JXcmFwcGVyLmFwcGVuZENoaWxkKHduZCk7XHJcblxyXG4gICAgcGFyZW50LnJlbW92ZSgpO1xyXG4gICAgcmV0dXJuIHduZDtcclxufTtcclxuXHJcbk1vZGFsLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUikge1xyXG4gICAgICAgIGlmICghTW9kYWwubWlub3JCYWNrZHJvcClcclxuICAgICAgICAgICAgTW9kYWwuc2V0QmFja2Ryb3AoTW9kYWwuc3RhdHVzZXMuTUlOT1IpO1xyXG5cclxuICAgICAgICBpZiAoIU1vZGFsLm1pbm9yV3JhcHBlcilcclxuICAgICAgICAgICAgTW9kYWwuc2V0V3JhcHBlcihNb2RhbC5zdGF0dXNlcy5NSU5PUik7XHJcblxyXG4gICAgICAgIE1vZGFsLm1pbm9yV3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC13cmFwcGVyX2ludmlzaWJsZScpO1xyXG4gICAgICAgIE1vZGFsLm1pbm9yQmFja2Ryb3AuY2xhc3NMaXN0LnJlbW92ZSgnYmFja2Ryb3BfaW52aXNpYmxlJyk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoIU1vZGFsLm1ham9yQmFja2Ryb3ApXHJcbiAgICAgICAgICAgIE1vZGFsLnNldEJhY2tkcm9wKE1vZGFsLnN0YXR1c2VzLk1BSk9SKTtcclxuXHJcbiAgICAgICAgaWYgKCFNb2RhbC5tYWpvcldyYXBwZXIpXHJcbiAgICAgICAgICAgIE1vZGFsLnNldFdyYXBwZXIoTW9kYWwuc3RhdHVzZXMuTUFKT1IpO1xyXG5cclxuICAgICAgICBNb2RhbC5tYWpvcldyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtd3JhcHBlcl9pbnZpc2libGUnKTtcclxuICAgICAgICBNb2RhbC5tYWpvckJhY2tkcm9wLmNsYXNzTGlzdC5yZW1vdmUoJ2JhY2tkcm9wX2ludmlzaWJsZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcclxuXHJcbn07XHJcblxyXG5cclxuTW9kYWwucHJvdG90eXBlLmFjdGl2YXRlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICBpZiAodGhpcy5lbGVtSWQgPT09ICdzcGlubmVyJykge1xyXG4gICAgICAgIGxldCBzcGlubmVyID0gdGhpcztcclxuICAgICAgICB0aGlzLm9uKCdzcGlubmVyX2hvc3QtbG9hZGVkJywgZSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBuZXdIb3N0ID0gZS5kZXRhaWwuaG9zdDtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpXHJcbiAgICAgICAgICAgICAgICBNb2RhbC5taW5vclF1ZXVlLnNwbGljZShNb2RhbC5taW5vclF1ZXVlLmluZGV4T2Yoc3Bpbm5lcikgKyAxLCAwLCBuZXdIb3N0KTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgTW9kYWwubWFqb3JRdWV1ZS5zcGxpY2UoTW9kYWwubWFqb3JRdWV1ZS5pbmRleE9mKHNwaW5uZXIpICsgMSwgMCwgbmV3SG9zdCk7XHJcblxyXG4gICAgICAgICAgICBzcGlubmVyLmRlYWN0aXZhdGUoZS5kZXRhaWwub3B0aW9ucyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKSB7XHJcbiAgICAgICAgICAgIE1vZGFsLm1pbm9yUXVldWUucHVzaCh0aGlzKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coTW9kYWwubWlub3JRdWV1ZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKE1vZGFsLm1ham9yUXVldWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFNb2RhbC5taW5vckFjdGl2ZSlcclxuICAgICAgICAgICAgICAgIE1vZGFsLm1pbm9yU2hvdyhvcHRpb25zKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgTW9kYWwubWFqb3JRdWV1ZS5wdXNoKHRoaXMpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhNb2RhbC5taW5vclF1ZXVlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coTW9kYWwubWFqb3JRdWV1ZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIU1vZGFsLm1ham9yQWN0aXZlKVxyXG5cclxuICAgICAgICAgICAgICAgIE1vZGFsLm1ham9yU2hvdyhvcHRpb25zKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59O1xyXG5cclxuTW9kYWwucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5zdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKSB7XHJcbiAgICAgICAgLy9UT0RPIG5vdCBuZWNjZXNzYXJ5IGlmIHF1ZXVlIGlzIG5vdCBlbXB0eVxyXG4gICAgICAgIE1vZGFsLm1pbm9yV3JhcHBlci5jbGFzc0xpc3QuYWRkKCdtb2RhbC13cmFwcGVyX2ludmlzaWJsZScpO1xyXG4gICAgICAgIE1vZGFsLm1pbm9yQmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgnYmFja2Ryb3BfaW52aXNpYmxlJyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBNb2RhbC5tYWpvcldyYXBwZXIuY2xhc3NMaXN0LmFkZCgnbW9kYWwtd3JhcHBlcl9pbnZpc2libGUnKTtcclxuICAgICAgICBNb2RhbC5tYWpvckJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoJ2JhY2tkcm9wX2ludmlzaWJsZScpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcbk1vZGFsLnByb3RvdHlwZS5kZWFjdGl2YXRlID0gZnVuY3Rpb24gKG5leHRXaW5kb3dPcHRpb25zLCBoaWRlT3B0aW9ucykge1xyXG5cclxuICAgIHRoaXMuaGlkZShoaWRlT3B0aW9ucyk7XHJcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUikge1xyXG4gICAgICAgIE1vZGFsLm1pbm9yQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgTW9kYWwubWlub3JRdWV1ZS5zaGlmdCgpO1xyXG4gICAgICAgIE1vZGFsLm1pbm9yU2hvdyhuZXh0V2luZG93T3B0aW9ucyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIE1vZGFsLm1ham9yQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgTW9kYWwubWFqb3JRdWV1ZS5zaGlmdCgpO1xyXG4gICAgICAgIE1vZGFsLm1ham9yU2hvdyhuZXh0V2luZG93T3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnRyaWdnZXIoJ21vZGFsLXdpbmRvd19kZWFjdGl2YXRlZCcpO1xyXG59O1xyXG5cclxuTW9kYWwubWlub3JBY3RpdmUgPSBmYWxzZTtcclxuTW9kYWwubWFqb3JBY3RpdmUgPSBmYWxzZTtcclxuTW9kYWwubWlub3JRdWV1ZSA9IFtdO1xyXG5Nb2RhbC5tYWpvclF1ZXVlID0gW107XHJcblxyXG5Nb2RhbC5zcGlubmVyID0gbmV3IFNwaW5uZXIoKTtcclxuTW9kYWwuc3Bpbm5lci5zdGF0dXMgPSBNb2RhbC5zdGF0dXNlcy5NQUpPUjtcclxuXHJcbk1vZGFsLnNob3dTcGlubmVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgTW9kYWwucHJvdG90eXBlLnNob3cuY2FsbChNb2RhbC5zcGlubmVyKTtcclxuXHJcbiAgICBpZiAoIU1vZGFsLnNwaW5uZXIuZWxlbSlcclxuICAgICAgICBNb2RhbC5zcGlubmVyLmVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bpbm5lcicpO1xyXG4gICAgaWYgKCFNb2RhbC5zcGlubmVyLmVsZW0pXHJcbiAgICAgICAgTW9kYWwuc3Bpbm5lci5lbGVtID0gTW9kYWwucHJvdG90eXBlLnJlbmRlcldpbmRvdy5jYWxsKE1vZGFsLnNwaW5uZXIsIFNwaW5uZXIuaHRtbCk7XHJcblxyXG4gICAgTW9kYWwuc3Bpbm5lci5zaG93KCk7XHJcbn07XHJcblxyXG5Nb2RhbC5oaWRlU3Bpbm5lciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIE1vZGFsLnNwaW5uZXIuaGlkZSgpO1xyXG59O1xyXG5cclxuXHJcbk1vZGFsLm1pbm9yU2hvdyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBsZXQgbmV4dE1vZGFsV2luZG93ID0gTW9kYWwubWlub3JRdWV1ZVswXTtcclxuICAgIGlmIChuZXh0TW9kYWxXaW5kb3cpIHtcclxuICAgICAgICBsZXQgcHJvbWlzZSA9IG5leHRNb2RhbFdpbmRvdy5zaG93KG9wdGlvbnMpO1xyXG4gICAgICAgIGlmIChwcm9taXNlKVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIE1vZGFsLm1pbm9yQWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIE1vZGFsLm1pbm9yQWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIE1vZGFsLm1pbm9yQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuTW9kYWwubWFqb3JTaG93ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICBsZXQgbmV4dE1vZGFsV2luZG93ID0gTW9kYWwubWFqb3JRdWV1ZVswXTtcclxuXHJcbiAgICBpZiAobmV4dE1vZGFsV2luZG93KSB7XHJcblxyXG4gICAgICAgIE1vZGFsLnNob3dTcGlubmVyKCk7XHJcbiAgICAgICAgbGV0IHByb21pc2UgPSBuZXh0TW9kYWxXaW5kb3cuc2hvdyhvcHRpb25zKTtcclxuXHJcbiAgICAgICAgaWYgKHByb21pc2UpXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgTW9kYWwubWFqb3JBY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgTW9kYWwuaGlkZVNwaW5uZXIoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIE1vZGFsLm1ham9yQWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgTW9kYWwuaGlkZVNwaW5uZXIoKTtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIE1vZGFsLm1ham9yQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZm9yIChsZXQga2V5IGluIGV2ZW50TWl4aW4pXHJcbiAgICBNb2RhbC5wcm90b3R5cGVba2V5XSA9IGV2ZW50TWl4aW5ba2V5XTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGFsO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL21vZGFsL2luZGV4LmpzIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG5cdG9uOiBmdW5jdGlvbihldmVudE5hbWUsIGNiKSB7XHJcblx0XHRpZiAodGhpcy5lbGVtKVxyXG5cdFx0XHR0aGlzLmVsZW0uYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNiKTtcclxuXHRcdGVsc2VcclxuXHRcdFx0dGhpcy5saXN0ZW5lcnMucHVzaCh7XHJcblx0XHRcdFx0ZXZlbnROYW1lLFxyXG5cdFx0XHRcdGNiXHJcblx0XHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdHRyaWdnZXI6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZGV0YWlsKSB7XHJcblx0XHR0aGlzLmVsZW0uZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7XHJcblx0XHRcdGJ1YmJsZXM6IHRydWUsXHJcblx0XHRcdGNhbmNlbGFibGU6IHRydWUsXHJcblx0XHRcdGRldGFpbDogZGV0YWlsXHJcblx0XHR9KSk7XHJcblx0fSxcclxuXHJcblx0ZXJyb3I6IGZ1bmN0aW9uKGVycikge1xyXG5cdFx0dGhpcy5lbGVtLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdlcnJvcicsIHtcclxuXHRcdFx0YnViYmxlczogdHJ1ZSxcclxuXHRcdFx0Y2FuY2VsYWJsZTogdHJ1ZSxcclxuXHRcdFx0ZGV0YWlsOiBlcnJcclxuXHRcdH0pKTtcclxuXHR9XHJcblxyXG5cclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2V2ZW50TWl4aW4uanMiLCJsZXQgU3Bpbm5lciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLmVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bpbm5lcicpO1xyXG59O1xyXG5cclxuU3Bpbm5lci5odG1sID0gcmVxdWlyZShgaHRtbC1sb2FkZXIhLi9tYXJrdXBgKTtcclxuXHJcblNwaW5uZXIucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnc3Bpbm5lcl9pbnZpc2libGUnKTtcclxufTtcclxuXHJcblNwaW5uZXIucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnc3Bpbm5lcl9pbnZpc2libGUnKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3Bpbm5lcjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL3NwaW5uZXIvaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBpZD1cXFwic3Bpbm5lclxcXCIgY2xhc3M9XFxcInNwaW5uZXJcXFwiPlxcclxcblxcclxcbjwvZGl2PlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9+L2h0bWwtbG9hZGVyIS4uL2Jsb2Nrcy9zcGlubmVyL21hcmt1cFxuLy8gbW9kdWxlIGlkID0gMjdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIDIgOSAxMCAxMSIsIm1vZHVsZS5leHBvcnRzID0gXCI8ZGl2IGNsYXNzPSd3aW5kb3cgbW9kYWwgd2luZG93X2ludmlzaWJsZSBtb2RhbC13aW5kb3cgbWVzc2FnZS1tb2RhbC13aW5kb3cnIGlkPSdtZXNzYWdlLW1vZGFsLXdpbmRvdyc+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImhlYWRlciB3aW5kb3dfX2hlYWRlclxcXCI+XFxyXFxuICAgIDwvZGl2PlxcclxcblxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJwYW5lbCB3aW5kb3dfX3BhbmVsXFxcIj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcIm1lc3NhZ2UtbW9kYWwtd2luZG93X19tZXNzYWdlXFxcIj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uIG1lc3NhZ2UtbW9kYWwtd2luZG93X19vay1idXR0b25cXFwiPk9LPC9kaXY+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJpY29uLWNyb3NzIG1vZGFsLWNsb3NlLWJ1dHRvblxcXCI+PC9kaXY+PC9kaXY+XCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL34vaHRtbC1sb2FkZXIhLi4vYmxvY2tzL21lc3NhZ2UtbW9kYWwtd2luZG93L3dpbmRvd1xuLy8gbW9kdWxlIGlkID0gMjhcbi8vIG1vZHVsZSBjaHVua3MgPSAxIDQgMTAiLCIvL2xldCBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ2FwcDpjaGVja1VzZXJkRGF0YScpO1xyXG5cclxuY29uc3QgUFJPUEVSVFlfU1lNQk9MID0gJ1twcm9wZXJ0eV0nO1xyXG5cclxubGV0IG1lc3NhZ2VzID0ge1xyXG4gICAgcGxhaW46ICdpbmNvcnJlY3QgW3Byb3BlcnR5XScsXHJcbiAgICBlbXB0eTogJ1twcm9wZXJ0eV0gbXVzdCBub3QgYmUgZW1wdHknLFxyXG4gICAgdG9vQmlnOiB2YWx1ZSA9PiB7XHJcbiAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgICAgICByZXR1cm4gYFtwcm9wZXJ0eV0gbXVzdCBiZSBsb3dlciB0aGFuICR7dmFsdWUgKyAxfSBzeW1ib2xzYDtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiAnW3Byb3BlcnR5XSBpcyB0b28gYmlnJztcclxuICAgIH0sXHJcbiAgICB0b29TbWFsbDogdmFsdWUgPT4ge1xyXG4gICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICAgICAgcmV0dXJuIGBbcHJvcGVydHldIG11c3QgYmUgZ3JlYXRlciB0aGFuICR7dmFsdWUgLSAxfSBzeW1ib2xzYDtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiAnW3Byb3BlcnR5XSBpcyB0b28gc2hvcnQnO1xyXG4gICAgfVxyXG59O1xyXG5cclxubGV0IHRlc3RzID0ge1xyXG4gICAgcmVnRXhwOiAocmVnRXhwLCB2YWx1ZSkgPT4gcmVnRXhwLnRlc3QodmFsdWUpLFxyXG4gICAgbWF4OiAobWF4LCB2YWx1ZSkgPT4gKHZhbHVlLmxlbmd0aCA8PSBtYXgpLFxyXG4gICAgbWluOiAobWluLCB2YWx1ZSkgPT4gKHZhbHVlLmxlbmd0aCA+PSBtaW4pLFxyXG4gICAgbm9uRW1wdHk6ICh2YWx1ZSkgPT4gKHZhbHVlLmxlbmd0aCA+IDApXHJcblxyXG59O1xyXG5cclxuXHJcbmxldCBjaGVja3MgPSB7XHJcbiAgICBtYXg6ICh2YWx1ZSwgZXJyb3JNZXNzYWdlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlcnJvck1lc3NhZ2UgfHwgbWVzc2FnZXMudG9vQmlnKHZhbHVlKSxcclxuICAgICAgICAgICAgdGVzdDogdGVzdHMubWF4LmJpbmQobnVsbCwgdmFsdWUpXHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcblxyXG4gICAgbWluOiAodmFsdWUsIGVycm9yTWVzc2FnZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZXJyb3JNZXNzYWdlIHx8IG1lc3NhZ2VzLnRvb1NtYWxsKHZhbHVlKSxcclxuICAgICAgICAgICAgdGVzdDogdGVzdHMubWluLmJpbmQobnVsbCwgdmFsdWUpXHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcblxyXG4gICAgbm9uRW1wdHk6IChlcnJvck1lc3NhZ2UpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGVycm9yTWVzc2FnZSB8fCBtZXNzYWdlcy5lbXB0eSxcclxuICAgICAgICAgICAgdGVzdDogdGVzdHMubm9uRW1wdHlcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59O1xyXG5cclxuZnVuY3Rpb24gY29tcHV0ZUVycm9yTWVzc2FnZSh0ZW1wbGF0ZSwgcHJvcGVydHkpIHtcclxuICAgIGxldCBwb3M7XHJcbiAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlIHx8IG1lc3NhZ2VzLnBsYWluO1xyXG4gICAgcHJvcGVydHkgPSBwcm9wZXJ0eSB8fCAndGhpcyBwcm9wZXJ0eSc7XHJcbiAgICB3aGlsZSAofihwb3MgPSB0ZW1wbGF0ZS5pbmRleE9mKFBST1BFUlRZX1NZTUJPTCkpKVxyXG4gICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUuc3Vic3RyaW5nKDAsIHBvcykgKyBwcm9wZXJ0eSArIHRlbXBsYXRlLnN1YnN0cmluZyhwb3MgKyBQUk9QRVJUWV9TWU1CT0wubGVuZ3RoKTtcclxuICAgIHJldHVybiB0ZW1wbGF0ZTtcclxufVxyXG5cclxubGV0IHZhbGlkYXRvcnMgPSB7XHJcblxyXG4gICAgJ25vbi1lbXB0eSc6IHtcclxuICAgICAgICBjaGVja3M6IFtcclxuICAgICAgICAgICAgY2hlY2tzLm5vbkVtcHR5KClcclxuICAgICAgICBdXHJcbiAgICB9LFxyXG5cclxuICAgICdlbWFpbCc6IHtcclxuICAgICAgICBjaGVja3M6IFtcclxuICAgICAgICAgICAgY2hlY2tzLm5vbkVtcHR5KCksXHJcbiAgICAgICAgICAgIGNoZWNrcy5tYXgoMTAwLCBtZXNzYWdlcy50b29CaWcoKSksXHJcbiAgICAgICAgICAgIGNoZWNrcy5taW4oNiwgbWVzc2FnZXMudG9vU21hbGwoKSksIHtcclxuICAgICAgICAgICAgICAgIHRlc3Q6IHRlc3RzLnJlZ0V4cC5iaW5kKG51bGwsIC9eKFxcdytbLVxcLl0/PykrQFtcXHcuLV0rXFx3XFwuXFx3ezIsNX0kL2kpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAndXNlcm5hbWUnOiB7XHJcbiAgICAgICAgY2hlY2tzOiBbXHJcbiAgICAgICAgICAgIGNoZWNrcy5ub25FbXB0eSgpLFxyXG4gICAgICAgICAgICBjaGVja3MubWF4KDE2KSxcclxuICAgICAgICAgICAgY2hlY2tzLm1pbig1KSwge1xyXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiAnbXVzdCBvbmx5IGNvbnRhaW4gYWxwaGFudW1lcmljIHN5bWJvbHMnLFxyXG4gICAgICAgICAgICAgICAgdGVzdDogdGVzdHMucmVnRXhwLmJpbmQobnVsbCwgL15bQS1aMC05LV0rJC9pKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgJ3Bhc3N3b3JkJzoge1xyXG4gICAgICAgIGNoZWNrczogW1xyXG4gICAgICAgICAgICBjaGVja3Mubm9uRW1wdHkoKSxcclxuICAgICAgICAgICAgY2hlY2tzLm1heCgzMCksXHJcbiAgICAgICAgICAgIGNoZWNrcy5taW4oNSksIHtcclxuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogJ1twcm9wZXJ0eV0gaXMgdG9vIHdlYWsnLFxyXG4gICAgICAgICAgICAgICAgdGVzdDogdGVzdHMucmVnRXhwLmJpbmQobnVsbCwgLyg/PS4qXFxkKSg/PS4qW2Etel0pKD89LipbQS1aXSkuezYsfS8pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgXVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgJ3Bhc3N3b3JkLWFnYWluJzoge1xyXG4gICAgICAgIGNoZWNrczogW1xyXG4gICAgICAgICAgICBjaGVja3Mubm9uRW1wdHkoJ3JlLWVudGVyIFtwcm9wZXJ0eV0nKSwge1xyXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiAncGFzc3dvcmRzIGRvIG5vdCBtYXRjaCcsXHJcbiAgICAgICAgICAgICAgICB0ZXN0OiBmdW5jdGlvbih2YWx1ZSwgZGF0YUNodW5rLCBkYXRhKSB7XHJcblx0XHRcdFx0XHRsZXQgb3JpZ2luYWxQYXNzID0gZGF0YUNodW5rLnBhc3N3b3JkO1xyXG5cdFx0XHRcdFx0aWYgKCFvcmlnaW5hbFBhc3MpXHJcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignbm8gb3JpZ2luYWwgcGFzc3dvcmQgcmVmZXJlbmNlJyk7XHJcblxyXG5cdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKVxyXG5cdFx0XHRcdFx0XHRpZiAoZGF0YVtpXS5wcm9wZXJ0eSA9PT0gb3JpZ2luYWxQYXNzKVxyXG5cdFx0XHRcdFx0XHRcdHJldHVybiAodmFsdWUgPT09IGRhdGFbaV0udmFsdWUpO1xyXG5cclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignbm8gb3JnaW5hbCBwYXNzd29yZCBkYXRhJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgXVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgJ3VybCc6IHtcclxuICAgICAgICBjaGVja3M6IFt7XHJcbiAgICAgICAgICAgIHRlc3Q6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdXJsUmVnZXggPSAnXig/IW1haWx0bzopKD86KD86aHR0cHxodHRwcyk6Ly8pKD86XFxcXFMrKD86OlxcXFxTKik/QCk/KD86KD86KD86WzEtOV1cXFxcZD98MVxcXFxkXFxcXGR8MlswMV1cXFxcZHwyMlswLTNdKSg/OlxcXFwuKD86MT9cXFxcZHsxLDJ9fDJbMC00XVxcXFxkfDI1WzAtNV0pKXsyfSg/OlxcXFwuKD86WzAtOV1cXFxcZD98MVxcXFxkXFxcXGR8MlswLTRdXFxcXGR8MjVbMC00XSkpfCg/Oig/OlthLXpcXFxcdTAwYTEtXFxcXHVmZmZmMC05XSstPykqW2EtelxcXFx1MDBhMS1cXFxcdWZmZmYwLTldKykoPzpcXFxcLig/OlthLXpcXFxcdTAwYTEtXFxcXHVmZmZmMC05XSstPykqW2EtelxcXFx1MDBhMS1cXFxcdWZmZmYwLTldKykqKD86XFxcXC4oPzpbYS16XFxcXHUwMGExLVxcXFx1ZmZmZl17Mix9KSkpfGxvY2FsaG9zdCkoPzo6XFxcXGR7Miw1fSk/KD86KC98XFxcXD98IylbXlxcXFxzXSopPyQnO1xyXG4gICAgICAgICAgICAgICAgbGV0IHVybCA9IG5ldyBSZWdFeHAodXJsUmVnZXgsICdpJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUubGVuZ3RoIDwgMjA4MyAmJiB1cmwudGVzdCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgJ2Rlc2NyaXB0aW9uJzoge1xyXG4gICAgICAgIGNoZWNrczogW1xyXG4gICAgICAgICAgICBjaGVja3MubWF4KDI1NSlcclxuICAgICAgICBdXHJcbiAgICB9LFxyXG5cclxuICAgICdjb21tZW50Jzoge1xyXG4gICAgICAgIGNoZWNrczogW1xyXG4gICAgICAgICAgICBjaGVja3Mubm9uRW1wdHkoKSxcclxuICAgICAgICAgICAgY2hlY2tzLm1heCgyNTUpXHJcbiAgICAgICAgXVxyXG4gICAgfVxyXG5cclxufTtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0RXJyb3JBcnJheShkYXRhKSB7XHJcblxyXG5cdGlmICghQXJyYXkuaXNBcnJheShkYXRhKSkge1xyXG5cdFx0bGV0IGNvcnJlY3REYXRhID0gW107XHJcblx0XHRmb3IgKGxldCBrZXkgaW4gZGF0YSkge1xyXG5cdFx0XHRjb3JyZWN0RGF0YS5wdXNoKHtcclxuXHRcdFx0XHRwcm9wZXJ0eToga2V5LFxyXG5cdFx0XHRcdHZhbHVlOiBkYXRhW2tleV1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRkYXRhID0gY29ycmVjdERhdGE7XHJcblx0fVxyXG5cclxuICAgIGxldCByZXN1bHQgPSBbXTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcclxuXHRcdGxldCBrZXkgPSBkYXRhW2ldLnZhbGlkYXRvcjtcclxuXHRcdGlmICgha2V5KVxyXG5cdFx0XHRrZXkgPSBkYXRhW2ldLnByb3BlcnR5O1xyXG5cclxuICAgICAgICBpZiAoIXZhbGlkYXRvcnNba2V5XSlcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyB2YWxpZGF0b3IgZm9yIHRoaXMgcHJvcGVydHk6ICcgKyBrZXkpO1xyXG5cclxuICAgICAgICB2YWxpZGF0b3JzW2tleV0uY2hlY2tzLmZvckVhY2goY2hlY2sgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWNoZWNrLnRlc3QoZGF0YVtpXS52YWx1ZSwgZGF0YVtpXSwgZGF0YSkpXHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHk6IGRhdGFbaV0ucHJvcGVydHksXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY29tcHV0ZUVycm9yTWVzc2FnZShjaGVjay5lcnJvck1lc3NhZ2UsIGRhdGFbaV0uYWxpYXMgfHwgZGF0YVtpXS5wcm9wZXJ0eSB8fCBrZXkpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5mdW5jdGlvbiB0ZXN0UHJvcGVydHkobmFtZSwgdmFsdWUpIHtcclxuICAgIGxldCByZXN1bHQgPSB0cnVlO1xyXG4gICAgdmFsaWRhdG9yc1tuYW1lXS5jaGVja3MuZm9yRWFjaChjaGVjayA9PiB7XHJcblxyXG4gICAgICAgIGlmICghY2hlY2sudGVzdCh2YWx1ZSkpXHJcbiAgICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGdldEVycm9yQXJyYXksXHJcbiAgICB0ZXN0UHJvcGVydHlcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2NoZWNrVXNlckRhdGEuanMiLCJsZXQgZXZlbnRNaXhpbiA9IHJlcXVpcmUoTElCUyArICdldmVudE1peGluJyk7XHJcbmxldCBnZXRFcnJvckFycmF5ID0gcmVxdWlyZShMSUJTICsgJ2NoZWNrVXNlckRhdGEnKS5nZXRFcnJvckFycmF5O1xyXG5sZXQgQ2xpZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ2xpZW50RXJyb3I7XHJcblxyXG5sZXQgRm9ybSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuZWxlbSA9IG9wdGlvbnMuZWxlbTtcclxuICAgIHRoaXMuZmllbGRzID0gb3B0aW9ucy5maWVsZHM7XHJcbiAgICB0aGlzLnVybCA9IG9wdGlvbnMudXJsO1xyXG4gICAgdGhpcy5pc0F2YWlsYWJsZSA9IHRydWU7XHJcblxyXG4gICAgdGhpcy5zYXZlQnV0dG9uID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5zYXZlLWJ1dHRvbicpO1xyXG5cclxuICAgIHRoaXMuZWxlbS5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzQXZhaWxhYmxlKSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmIChlLnRhcmdldCAhPT0gdGhpcy5zYXZlQnV0dG9uKSByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMuY2xlYXJFcnJvckJveGVzKCk7XHJcbiAgICAgICAgbGV0IGVycm9ycyA9IHRoaXMuZ2V0RXJyb3JzKCk7XHJcbiAgICAgICAgaWYgKGVycm9ycy5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIHRoaXMuc2VuZCh0aGlzLmdldEJvZHkoKSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLnNldEVycm9ycyhlcnJvcnMpO1xyXG4gICAgfTtcclxufTtcclxuXHJcbkZvcm0ucHJvdG90eXBlLnNldFByb3BlcnR5RXJyb3IgPSBmdW5jdGlvbihwcm9wZXJ0eSwgbWVzc2FnZSkge1xyXG4gICAgdGhpcy5nZXRFcnJvckJveChwcm9wZXJ0eSkudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xyXG59O1xyXG5cclxuRm9ybS5wcm90b3R5cGUuZ2V0RXJyb3JCb3ggPSBmdW5jdGlvbihmaWVsZE5hbWUpIHtcclxuICAgIHJldHVybiB0aGlzLmVsZW1bZmllbGROYW1lXS5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZXh0Ym94X19lcnJvcicpO1xyXG59O1xyXG5cclxuRm9ybS5wcm90b3R5cGUuc2V0QXZhaWxhYmxlID0gZnVuY3Rpb24oaXNBdmFpbGFibGUpIHtcclxuICAgIHRoaXMuaXNBdmFpbGFibGUgPSBpc0F2YWlsYWJsZTtcclxufTtcclxuXHJcbkZvcm0ucHJvdG90eXBlLmdldERhdGFPYmogPSBmdW5jdGlvbigpIHtcclxuICAgIGxldCBvcHRpb25zID0gW107XHJcblxyXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuZmllbGRzKSB7XHJcbiAgICAgICAgbGV0IGNodW5rID0gdGhpcy5maWVsZHNba2V5XTtcclxuICAgICAgICBpZiAoIWNodW5rLm5vVmFsaWRhdGlvbikge1xyXG4gICAgICAgICAgICBpZiAoIWNodW5rLnByb3BlcnR5KVxyXG4gICAgICAgICAgICAgICAgY2h1bmsucHJvcGVydHkgPSBrZXk7XHJcbiAgICAgICAgICAgIGNodW5rLnZhbHVlID0gdGhpcy5lbGVtW2tleV0udmFsdWU7XHJcbiAgICAgICAgICAgIG9wdGlvbnMucHVzaChjaHVuayk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcHRpb25zO1xyXG59O1xyXG5cclxuRm9ybS5wcm90b3R5cGUuc2VuZCA9IGZ1bmN0aW9uKGJvZHkpIHtcclxuICAgIHJlcXVpcmUoTElCUyArICdzZW5kUmVxdWVzdCcpKGJvZHksICdQT1NUJywgdGhpcy51cmwsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgQ2xpZW50RXJyb3IgJiYgZXJyLmRldGFpbClcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0UHJvcGVydHlFcnJvcihlcnIuZGV0YWlsLnByb3BlcnR5LCBlcnIubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMudHJpZ2dlcignZm9ybV9zZW50Jywge1xyXG4gICAgICAgICAgICByZXNwb25zZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5cclxuRm9ybS5wcm90b3R5cGUuY2xlYXJFcnJvckJveGVzID0gZnVuY3Rpb24oKSB7XHJcbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5maWVsZHMpXHJcbiAgICAgICAgdGhpcy5nZXRFcnJvckJveChrZXkpLnRleHRDb250ZW50ID0gJyc7XHJcbn07XHJcblxyXG5Gb3JtLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5jbGVhckVycm9yQm94ZXMoKTtcclxuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmZpZWxkcylcclxuICAgICAgICB0aGlzLmVsZW1ba2V5XS52YWx1ZSA9ICcnO1xyXG59O1xyXG5cclxuRm9ybS5wcm90b3R5cGUuZ2V0RXJyb3JzID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gZ2V0RXJyb3JBcnJheSh0aGlzLmdldERhdGFPYmooKSk7XHJcbn07XHJcblxyXG5cclxuRm9ybS5wcm90b3R5cGUuc2V0RXJyb3JzID0gZnVuY3Rpb24oZXJyb3JzKSB7XHJcbiAgICB0aGlzLmNsZWFyRXJyb3JCb3hlcygpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlcnJvcnMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0RXJyb3JCb3goZXJyb3JzW2ldLnByb3BlcnR5KS50ZXh0Q29udGVudCA9PSAnJylcclxuICAgICAgICAgICAgdGhpcy5zZXRQcm9wZXJ0eUVycm9yKGVycm9yc1tpXS5wcm9wZXJ0eSwgZXJyb3JzW2ldLm1lc3NhZ2UpO1xyXG59O1xyXG5cclxuRm9ybS5wcm90b3R5cGUuZ2V0Qm9keSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGJvZHkgPSAnJztcclxuXHJcbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5maWVsZHMpXHJcbiAgICAgICAgaWYgKCF0aGlzLmZpZWxkc1trZXldLmV4dHJhKVxyXG4gICAgICAgICAgICBib2R5ICs9IChib2R5ID09PSAnJyA/ICcnIDogJyYnKSArXHJcbiAgICAgICAgICAgIGtleSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh0aGlzLmVsZW1ba2V5XS52YWx1ZSk7XHJcbiAgICByZXR1cm4gYm9keTtcclxufTtcclxuXHJcbmZvciAobGV0IGtleSBpbiBldmVudE1peGluKSB7XHJcbiAgICBGb3JtLnByb3RvdHlwZVtrZXldID0gZXZlbnRNaXhpbltrZXldO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvZm9ybS9pbmRleC5qcyIsImxldCBTZXJ2ZXJFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5TZXJ2ZXJFcnJvcjtcclxubGV0IENsaWVudEVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLkNsaWVudEVycm9yO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYm9keU9iaiwgbWV0aG9kLCB1cmwsIGNiKSB7XHJcblxyXG5cclxuICAgIGxldCBib2R5ID0gJyc7XHJcbiAgICBpZiAoISh0eXBlb2YgYm9keU9iaiA9PT0gJ3N0cmluZycpKSB7XHJcbiAgICAgICAgZm9yIChsZXQga2V5IGluIGJvZHlPYmopIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgIGlmIChib2R5T2JqW2tleV0pXHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGtleSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCgodHlwZW9mIGJvZHlPYmpba2V5XSA9PT0gJ29iamVjdCcpID8gSlNPTi5zdHJpbmdpZnkoYm9keU9ialtrZXldKSA6IGJvZHlPYmpba2V5XSk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICAgICAgICAgIGJvZHkgKz0gKGJvZHkgPT09ICcnID8gJycgOiAnJicpICsgdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlXHJcbiAgICAgICAgYm9keSA9IGJvZHlPYmo7XHJcblxyXG5cclxuICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgIHhoci5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKTtcclxuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XHJcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIlgtUmVxdWVzdGVkLVdpdGhcIiwgXCJYTUxIdHRwUmVxdWVzdFwiKTtcclxuXHJcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgIT0gNCkgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgcmVzcG9uc2U7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnJlc3BvbnNlVGV4dClcclxuICAgICAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY2IobmV3IFNlcnZlckVycm9yKCdTZXJ2ZXIgaXMgbm90IHJlc3BvbmRpbmcnKSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCAzMDApXHJcbiAgICAgICAgICAgIGNiKG51bGwsIHJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDQwMCAmJiB0aGlzLnN0YXR1cyA8IDUwMClcclxuICAgICAgICAgICAgY2IobmV3IENsaWVudEVycm9yKHJlc3BvbnNlLm1lc3NhZ2UsIHJlc3BvbnNlLmRldGFpbCwgdGhpcy5zdGF0dXMpKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDUwMClcclxuICAgICAgICAgICAgY2IobmV3IFNlcnZlckVycm9yKHJlc3BvbnNlLm1lc3NhZ2UsIHRoaXMuc3RhdHVzKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnNvbGUubG9nKGBzZW5kaW5nIG5leHQgcmVxdWVzdDogJHtib2R5fWApO1xyXG4gICAgeGhyLnNlbmQoYm9keSk7XHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9zZW5kUmVxdWVzdC5qcyIsImxldCBEcm9wZG93biA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgdGhpcy5lbGVtID0gb3B0aW9ucy5lbGVtO1xyXG4gICAgdGhpcy5pdGVtTGlzdCA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuZHJvcGRvd25fX2l0ZW0tbGlzdCcpO1xyXG4gICAgdGhpcy5jbGFzc05hbWUgPSBvcHRpb25zLmNsYXNzTmFtZTtcclxuXHJcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG5cclxuICAgIC8vIHRoaXMuZWxlbS5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAvLyAgICAgdGhpcy50b2dnbGUoKTtcclxuICAgIC8vIH07XHJcblxyXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaXRlbUxpc3QuY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW0uY29udGFpbnMoZS50YXJnZXQpKVxyXG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGUoKTtcclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5hY3RpdmUpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSwgZmFsc2UpO1xyXG5cclxuXHJcbiAgICB0aGlzLkFFSGFuZGxlciA9IHRoaXMuQUVIYW5kbGVyLmJpbmQodGhpcyk7XHJcblxyXG59O1xyXG5cclxuRHJvcGRvd24ucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnZHJvcGRvd25faW52aXNpYmxlJyk7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZChgJHt0aGlzLmNsYXNzTmFtZX1fYWN0aXZlYCk7XHJcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XHJcbn07XHJcblxyXG5Ecm9wZG93bi5wcm90b3R5cGUuZGVhY3RpdmF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuaXRlbUxpc3QuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgdGhpcy5BRUhhbmRsZXIsIGZhbHNlKTtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdkcm9wZG93bl9mYWRpbmctb3V0Jyk7XHJcbn07XHJcblxyXG5Ecm9wZG93bi5wcm90b3R5cGUuQUVIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3Bkb3duX2ZhZGluZy1vdXQnKTtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdkcm9wZG93bl9pbnZpc2libGUnKTtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKGAke3RoaXMuY2xhc3NOYW1lfV9hY3RpdmVgKTtcclxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XHJcbiAgICB0aGlzLml0ZW1MaXN0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbmVuZCcsIHRoaXMuQUVIYW5kbGVyKTtcclxufTtcclxuXHJcbkRyb3Bkb3duLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5hY3RpdmUpXHJcbiAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5zaG93KCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERyb3Bkb3duO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvZHJvcGRvd24vaW5kZXguanMiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc2V0dGluZ3Mvc3R5bGUubGVzc1xuLy8gbW9kdWxlIGlkID0gNTJcbi8vIG1vZHVsZSBjaHVua3MgPSAxMCIsImxldCBldmVudE1peGluID0gcmVxdWlyZShMSUJTICsgJ2V2ZW50TWl4aW4nKTtcclxubGV0IFNvY2lhbENvbGxlY3Rpb24gPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblxyXG4gICAgdGhpcy5lbGVtID0gb3B0aW9ucy5lbGVtO1xyXG4gICAgdGhpcy5zb2NpYWxMaXN0ID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5zb2NpYWwtY29sbGVjdGlvbl9fc29jaWFsLWxpc3QnKTtcclxuICAgIHRoaXMudGV4dGJveCA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcudGV4dGJveF9fZmllbGQnKTtcclxuXHJcbiAgICB0aGlzLmVsZW0ub25jbGljayA9IGUgPT4ge1xyXG5cclxuICAgICAgICBpZiAoZS50YXJnZXQubWF0Y2hlcygnLnRleHRib3gtYnV0dG9uX19idXR0b24nKSAmJiB0aGlzLnRleHRib3gudmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5zZW5kU29jaWFsKHRoaXMudGV4dGJveC52YWx1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChlLnRhcmdldC5tYXRjaGVzKCcuc29jaWFsX19jbG9zZScpKVxyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZVNvY2lhbChlLnRhcmdldC5jbG9zZXN0KCcuc29jaWFsJykpO1xyXG4gICAgfTtcclxufTtcclxuXHJcbi8vVE9ETyBtYWtlIGNoZWNraW5nIHVzZXIncyBkYXRhIG9uIGNsaWVudCBzaWRlXHJcblxyXG5Tb2NpYWxDb2xsZWN0aW9uLnByb3RvdHlwZS5zZW5kU29jaWFsID0gZnVuY3Rpb24obGluaykge1xyXG4gICAgcmVxdWlyZShMSUJTICsgJ3NlbmRSZXF1ZXN0Jykoe1xyXG4gICAgICAgIGxpbmtcclxuICAgIH0sICdQT1NUJywgJy9zZXR0aW5ncycsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcblxyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmluc2VydE5ld1NvY2lhbChyZXNwb25zZS5saW5rT2JqKTtcclxuICAgICAgICB0aGlzLnRleHRib3gudmFsdWUgPSAnJztcclxuICAgIH0pO1xyXG5cclxufTtcclxuXHJcblNvY2lhbENvbGxlY3Rpb24ucHJvdG90eXBlLmRlbGV0ZVNvY2lhbCA9IGZ1bmN0aW9uKHNvY2lhbCkge1xyXG4gICAgcmVxdWlyZShMSUJTICsgJ3NlbmRSZXF1ZXN0Jykoe1xyXG4gICAgICAgIGxpbms6IHNvY2lhbC5kYXRhc2V0LmxpbmtcclxuICAgIH0sICdERUxFVEUnLCAnL3NldHRpbmdzJywgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuXHJcbiAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNvY2lhbC5yZW1vdmUoKTtcclxuICAgIH0pO1xyXG5cclxufTtcclxuXHJcblNvY2lhbENvbGxlY3Rpb24ucHJvdG90eXBlLmluc2VydE5ld1NvY2lhbCA9IGZ1bmN0aW9uKGxpbmtPYmopIHtcclxuICAgIGxldCBzb2NpYWwgPSByZXF1aXJlKExJQlMgKyAncmVuZGVyRWxlbWVudCcpKHJlcXVpcmUoJ2h0bWwtbG9hZGVyIS4vc29jaWFsJykpO1xyXG4gICAgc29jaWFsLmRhdGFzZXQubGluayA9IGxpbmtPYmouaHJlZjtcclxuICAgIHNvY2lhbC5xdWVyeVNlbGVjdG9yKCcuc29jaWFsX19saW5rJykuc2V0QXR0cmlidXRlKCdocmVmJywgbGlua09iai5ocmVmKTtcclxuICAgIHNvY2lhbC5xdWVyeVNlbGVjdG9yKCcuc29jaWFsX19ob3N0JykudGV4dENvbnRlbnQgPSBsaW5rT2JqLmhvc3Q7XHJcbiAgICB0aGlzLnNvY2lhbExpc3QuYXBwZW5kQ2hpbGQoc29jaWFsKTtcclxufTtcclxuXHJcbmZvciAobGV0IGtleSBpbiBldmVudE1peGluKSB7XHJcbiAgICBTb2NpYWxDb2xsZWN0aW9uLnByb3RvdHlwZVtrZXldID0gZXZlbnRNaXhpbltrZXldO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNvY2lhbENvbGxlY3Rpb247XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3Mvc29jaWFsLWNvbGxlY3Rpb24vaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1hcmt1cCkge1xyXG5cdGxldCBwYXJlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKTtcclxuXHRwYXJlbnQuaW5uZXJIVE1MID0gbWFya3VwOyBcclxuXHRsZXQgZWxlbWVudCA9IHBhcmVudC5maXJzdEVsZW1lbnRDaGlsZDtcclxuXHRyZXR1cm4gZWxlbWVudDtcclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvcmVuZGVyRWxlbWVudC5qcyIsIm1vZHVsZS5leHBvcnRzID0gXCI8ZGl2IGNsYXNzPVxcXCJzb2NpYWwtY29sbGVjdGlvbl9fc29jaWFsIHNvY2lhbFxcXCIgZGF0YS1saW5rPVxcXCJcXFwiPlxcclxcbiAgICA8YSBjbGFzcz1cXFwic29jaWFsX19saW5rXFxcIiBocmVmPVxcXCJcXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwic29jaWFsX19pY29uIGljb24tc3BoZXJlXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgIDxzcGFuIGNsYXNzPVxcXCJzb2NpYWxfX2hvc3RcXFwiPjwvc3Bhbj5cXHJcXG4gICAgPC9hPlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJzb2NpYWxfX2Nsb3NlIGljb24tY3Jvc3NcXFwiPjwvZGl2PlxcclxcbjwvZGl2PlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9+L2h0bWwtbG9hZGVyIS4uL2Jsb2Nrcy9zb2NpYWwtY29sbGVjdGlvbi9zb2NpYWxcbi8vIG1vZHVsZSBpZCA9IDU2XG4vLyBtb2R1bGUgY2h1bmtzID0gMTAiLCJsZXQgZXZlbnRNaXhpbiA9IHJlcXVpcmUoTElCUyArICdldmVudE1peGluJyk7XHJcbmxldCBGaWxlUGlja2VyID0gcmVxdWlyZShCTE9DS1MgKyAnZmlsZS1waWNrZXInKTtcclxuXHJcbmxldCBDbGllbnRFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5DbGllbnRFcnJvcjtcclxuXHJcbmxldCBVcGxvYWRBdmF0YXJTZWN0aW9uID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuZWxlbSA9IG9wdGlvbnMuZWxlbTtcclxuICAgIHRoaXMudXBsb2FkQnV0dG9uID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy51cGxvYWQtYXZhdGFyLXNlY3Rpb25fX3VwbG9hZC1idXR0b24nKTtcclxuICAgIHRoaXMuZGVsZXRlQnV0dG9uID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy51cGxvYWQtYXZhdGFyLXNlY3Rpb25fX2RlbGV0ZS1idXR0b24nKTtcclxuICAgIHRoaXMuZmlsZVBpY2tlciA9IG5ldyBGaWxlUGlja2VyKHtcclxuICAgICAgICBlbGVtOiB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmZpbGUtcGlja2VyJylcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuYXZhdGFyID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy51cGxvYWQtYXZhdGFyLXNlY3Rpb25fX2F2YXRhcicpO1xyXG5cclxuICAgIHRoaXMuZWxlbS5vbmNsaWNrID0gZSA9PiB7XHJcblxyXG4gICAgICAgIGlmIChlLnRhcmdldCA9PT0gdGhpcy51cGxvYWRCdXR0b24pIHtcclxuICAgICAgICAgICAgbGV0IGZpbGUgPSB0aGlzLmZpbGVQaWNrZXIuZ2V0RmlsZSgpO1xyXG4gICAgICAgICAgICBpZiAoZmlsZSlcclxuICAgICAgICAgICAgICAgIHRoaXMudXBsb2FkQXZhdGFyKGZpbGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGUudGFyZ2V0ID09PSB0aGlzLmRlbGV0ZUJ1dHRvbilcclxuICAgICAgICAgICAgdGhpcy5kZWxldGVBdmF0YXIoKTtcclxuICAgIH1cclxuXHJcbn07XHJcblxyXG5cclxuVXBsb2FkQXZhdGFyU2VjdGlvbi5wcm90b3R5cGUuZGVsZXRlQXZhdGFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmVxdWlyZShMSUJTICsgJ3NlbmRSZXF1ZXN0JykobnVsbCwgJ0RFTEVURScsICcvYXZhdGFyJywgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmF2YXRhci5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCcke0FOT05fQVZBVEFSX1VSTH0nKWA7XHJcbiAgICB9KTtcclxufTtcclxuXHJcblVwbG9hZEF2YXRhclNlY3Rpb24ucHJvdG90eXBlLnVwbG9hZEF2YXRhciA9IGZ1bmN0aW9uIChmaWxlKSB7XHJcbiAgICBsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgIGZvcm1EYXRhLmFwcGVuZChcImF2YXRhclwiLCBmaWxlKTtcclxuXHJcbiAgICByZXF1aXJlKExJQlMgKyAnc2VuZEZvcm1EYXRhJykoXCIvYXZhdGFyXCIsIGZvcm1EYXRhLCAoZXJyLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYXZhdGFyLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJyR7cmVzcG9uc2UudXJsfT8ke25ldyBEYXRlKCkuZ2V0VGltZSgpfScpYDtcclxuXHJcbiAgICB9KTtcclxufTtcclxuXHJcbmZvciAobGV0IGtleSBpbiBldmVudE1peGluKSB7XHJcbiAgICBVcGxvYWRBdmF0YXJTZWN0aW9uLnByb3RvdHlwZVtrZXldID0gZXZlbnRNaXhpbltrZXldO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFVwbG9hZEF2YXRhclNlY3Rpb247XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy91cGxvYWQtYXZhdGFyLXNlY3Rpb24vaW5kZXguanMiLCJjb25zdCBERUZBVUxUX1ZBTFVFID0gJ25vIGZpbGUgY2hvc2VuJztcclxuY29uc3QgREVGQVVMVF9GTl9MRU5HVEggPSBERUZBVUxUX1ZBTFVFLmxlbmd0aDtcclxuXHJcbmxldCBGaWxlUGlja2VyID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICB0aGlzLmZpbGVOYW1lTGVuZ3RoID0gb3B0aW9ucy5maWxlTmFtZUxlbmd0aCB8fCBERUZBVUxUX0ZOX0xFTkdUSDtcclxuXHJcbiAgICB0aGlzLnVwbG9hZElucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICAgIHRoaXMudXBsb2FkSW5wdXQudHlwZSA9IFwiZmlsZVwiO1xyXG4gICAgdGhpcy51cGxvYWRJbnB1dC5hY2NlcHQgPSBcImltYWdlLypcIjtcclxuXHJcbiAgICB0aGlzLmVsZW0gPSBvcHRpb25zLmVsZW07XHJcbiAgICB0aGlzLmZwQnV0dG9uID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5maWxlLXBpY2tlcl9fYnV0dG9uJyk7XHJcbiAgICB0aGlzLmZwRmlsZU5hbWUgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmZpbGUtcGlja2VyX19maWxlbmFtZScpO1xyXG5cclxuICAgIHRoaXMuZnBCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgICAgICB0aGlzLnVwbG9hZElucHV0LmNsaWNrKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnVwbG9hZElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGUgPT4ge1xyXG4gICAgICAgIHRoaXMuc2V0VmlzaWJsZUZpbGVOYW1lKCk7XHJcbiAgICB9KTtcclxuXHJcbn07XHJcblxyXG5GaWxlUGlja2VyLnByb3RvdHlwZS5zZXRWaXNpYmxlRmlsZU5hbWUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgZmlsZW5hbWUgPSB0aGlzLnVwbG9hZElucHV0LnZhbHVlLnN1YnN0cmluZyh0aGlzLnVwbG9hZElucHV0LnZhbHVlLmxhc3RJbmRleE9mKCdcXFxcJykgKyAxKTtcclxuXHJcbiAgICBsZXQgdmlzaWJsZUZpbGVOYW1lO1xyXG4gICAgbGV0IHBhcnRTaXplID0gfn4oKHRoaXMuZmlsZU5hbWVMZW5ndGggLSAxKSAvIDIpO1xyXG5cclxuICAgIGlmIChmaWxlbmFtZS5sZW5ndGggPT09IDApXHJcbiAgICAgICAgdmlzaWJsZUZpbGVOYW1lID0gREVGQVVMVF9WQUxVRTtcclxuICAgIGVsc2UgaWYgKGZpbGVuYW1lLmxlbmd0aCA8PSB0aGlzLmZpbGVOYW1lTGVuZ3RoKSB7XHJcbiAgICAgICAgdGhpcy5mcEZpbGVOYW1lLnRpdGxlID0gJyc7XHJcbiAgICAgICAgdmlzaWJsZUZpbGVOYW1lID0gZmlsZW5hbWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuZnBGaWxlTmFtZS50aXRsZSA9IGZpbGVuYW1lO1xyXG4gICAgICAgIHZpc2libGVGaWxlTmFtZSA9IGZpbGVuYW1lLnNsaWNlKDAsIHBhcnRTaXplKSArICfigKYnICsgZmlsZW5hbWUuc2xpY2UoLXBhcnRTaXplKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmZwRmlsZU5hbWUudGV4dENvbnRlbnQgPSB2aXNpYmxlRmlsZU5hbWU7XHJcbn07XHJcblxyXG5GaWxlUGlja2VyLnByb3RvdHlwZS5nZXRGaWxlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudXBsb2FkSW5wdXQuZmlsZXNbMF07XHJcbn07XHJcblxyXG5GaWxlUGlja2VyLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMudXBsb2FkSW5wdXQudmFsdWUgPSAnJztcclxuICAgIHRoaXMuZnBGaWxlTmFtZS50ZXh0Q29udGVudCA9IERFRkFVTFRfVkFMVUU7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZpbGVQaWNrZXI7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvZmlsZS1waWNrZXIvaW5kZXguanMiLCJsZXQgU2VydmVyRXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuU2VydmVyRXJyb3I7XHJcbmxldCBDbGllbnRFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5DbGllbnRFcnJvcjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHVybCwgZm9ybURhdGEsIGNiKSB7XHJcbiAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAvLyB4aHIudXBsb2FkLm9ucHJvZ3Jlc3MgPSBldmVudCA9PiB7XHJcbiAgICAvLyBcdCAgIGNvbnNvbGUubG9nKGV2ZW50LmxvYWRlZCArICcgLyAnICsgZXZlbnQudG90YWwpO1xyXG4gICAgLy8gfTtcclxuXHJcbiAgICB4aHIub25sb2FkID0geGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbGV0IHJlc3BvbnNlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5yZXNwb25zZVRleHQpXHJcbiAgICAgICAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNiKG5ldyBTZXJ2ZXJFcnJvcignU2VydmVyIGlzIG5vdCByZXNwb25kaW5nJykpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMClcclxuICAgICAgICAgICAgY2IobnVsbCwgcmVzcG9uc2UpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPj0gNDAwICYmIHRoaXMuc3RhdHVzIDwgNTAwKVxyXG4gICAgICAgICAgICBjYihuZXcgQ2xpZW50RXJyb3IocmVzcG9uc2UubWVzc2FnZSkpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPj0gNTAwKVxyXG4gICAgICAgICAgICBjYihuZXcgU2VydmVyRXJyb3IocmVzcG9uc2UubWVzc2FnZSkpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgeGhyLm9wZW4oXCJQT1NUXCIsIHVybCwgdHJ1ZSk7XHJcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignWC1SZXF1ZXN0ZWQtV2l0aCcsICdYTUxIdHRwUmVxdWVzdCcpO1xyXG4gICAgeGhyLnNlbmQoZm9ybURhdGEpO1xyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvc2VuZEZvcm1EYXRhLmpzIiwibGV0IGV2ZW50TWl4aW4gPSByZXF1aXJlKExJQlMgKyAnZXZlbnRNaXhpbicpO1xyXG5sZXQgQ2xpZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ2xpZW50RXJyb3I7XHJcbmxldCBNZXNzYWdlTW9kYWxXaW5kb3cgPSByZXF1aXJlKEJMT0NLUyArICdtZXNzYWdlLW1vZGFsLXdpbmRvdycpO1xyXG5cclxuXHJcbmxldCBEZXNjcmlwdGlvbkFkZFNlY3Rpb24gPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgdGhpcy5lbGVtID0gb3B0aW9ucy5lbGVtO1xyXG4gICAgdGhpcy5zYXZlQnV0dG9uID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5idXR0b24nKTtcclxuICAgIHRoaXMudGV4dGFyZWEgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLnRleHRhcmVhIHRleHRhcmVhJyk7XHJcblxyXG4gICAgdGhpcy5lbGVtLm9uY2xpY2sgPSBlID0+IHtcclxuICAgICAgICBpZiAoZS50YXJnZXQgIT09IHRoaXMuc2F2ZUJ1dHRvbikgcmV0dXJuO1xyXG4gICAgICAgIGxldCBkZXNjcmlwdGlvbiA9IHRoaXMudGV4dGFyZWEudmFsdWU7XHJcbiAgICAgICAgbGV0IGVycm9ycyA9IHJlcXVpcmUoTElCUyArICdjaGVja1VzZXJEYXRhJykuZ2V0RXJyb3JBcnJheSh7XHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChlcnJvcnMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICB0aGlzLnNlbmREZXNjcmlwdGlvbih0aGlzLnRleHRhcmVhLnZhbHVlKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IobmV3IENsaWVudEVycm9yKGVycm9yc1swXS5tZXNzYWdlKSk7XHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcbkRlc2NyaXB0aW9uQWRkU2VjdGlvbi5wcm90b3R5cGUuc2VuZERlc2NyaXB0aW9uID0gZnVuY3Rpb24gKGRlc2NyaXB0aW9uKSB7XHJcbiAgICByZXF1aXJlKExJQlMgKyAnc2VuZFJlcXVlc3QnKSh7XHJcbiAgICAgICAgZGVzY3JpcHRpb25cclxuICAgIH0sICdQT1NUJywgJy9zZXR0aW5ncycsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBtZXNzYWdlTW9kYWxXaW5kb3cgPSBuZXcgTWVzc2FnZU1vZGFsV2luZG93KHttZXNzYWdlOiAnRGVzY3JpcHRpb24gaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IGNoYW5nZWQnfSk7XHJcbiAgICAgICAgbWVzc2FnZU1vZGFsV2luZG93LnNob3coKTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuZm9yIChsZXQga2V5IGluIGV2ZW50TWl4aW4pIHtcclxuICAgIERlc2NyaXB0aW9uQWRkU2VjdGlvbi5wcm90b3R5cGVba2V5XSA9IGV2ZW50TWl4aW5ba2V5XTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEZXNjcmlwdGlvbkFkZFNlY3Rpb247XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvZGVzY3JpcHRpb24tYWRkLXNlY3Rpb24vaW5kZXguanMiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTs7O0FBRUE7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBR0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTs7Ozs7Ozs7QUN0UUE7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ2JBOzs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQWRBO0FBQUE7QUFlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUMxTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUMvQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDckRBOzs7Ozs7Ozs7QUNBQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7OztBQUdBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ0pBOzs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFFQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OzsiLCJzb3VyY2VSb290IjoiIn0=