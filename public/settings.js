/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, callbacks = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId])
/******/ 				callbacks.push.apply(callbacks, installedChunks[chunkId]);
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules);
/******/ 		while(callbacks.length)
/******/ 			callbacks.shift().call(null, __webpack_require__);

/******/ 	};

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// object to store loaded and loading chunks
/******/ 	// "0" means "already loaded"
/******/ 	// Array means "loading", array contains callbacks
/******/ 	var installedChunks = {
/******/ 		9:0,
/******/ 		1:0
/******/ 	};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}

/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId, callback) {
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] === 0)
/******/ 			return callback.call(null, __webpack_require__);

/******/ 		// an array means "currently loading".
/******/ 		if(installedChunks[chunkId] !== undefined) {
/******/ 			installedChunks[chunkId].push(callback);
/******/ 		} else {
/******/ 			// start chunk loading
/******/ 			installedChunks[chunkId] = [callback];
/******/ 			var head = document.getElementsByTagName('head')[0];
/******/ 			var script = document.createElement('script');
/******/ 			script.type = 'text/javascript';
/******/ 			script.charset = 'utf-8';
/******/ 			script.async = true;

/******/ 			script.src = __webpack_require__.p + "" + chunkId + "." + ({}[chunkId]||chunkId) + ".js";
/******/ 			head.appendChild(script);
/******/ 		}
/******/ 	};

/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	__webpack_require__(44);

	var GlobalErrorHandler = __webpack_require__(14);
	var globalErrorHandler = new GlobalErrorHandler();

	var Dropdown = __webpack_require__(28);
	var SocialCollection = __webpack_require__(46);
	var UploadAvatarSection = __webpack_require__(49);
	var DescriptionAddSection = __webpack_require__(52);
	var Form = __webpack_require__(24);
	var MessageModalWindow = __webpack_require__(16);

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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var GlobalErrorHandler = function GlobalErrorHandler(options) {
	    var _this = this;

	    document.addEventListener('error', function (e) {
	        var error = e.detail;
	        _this.call(error);
	    });
	};

	GlobalErrorHandler.prototype.call = function (error) {
	    __webpack_require__.e/* nsure */(1, function (require) {
	        var ComponentError = __webpack_require__(15).ComponentError;
	        var MessageModalWindow = __webpack_require__(16);

	        if (error instanceof ComponentError) {
	            if (error.status === 401) {
	                localStorage.setItem('redirected_url', window.location.href);
	                window.location = '/authorization';
	            } else {
	                var messageModalWindow = new MessageModalWindow({ message: error.message });
	                messageModalWindow.activate();
	            }
	        } else throw error;
	    });
	};

	module.exports = GlobalErrorHandler;

/***/ }),
/* 15 */
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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var Modal = __webpack_require__(17);

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
	    this.windowHtml = __webpack_require__(21);
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
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var eventMixin = __webpack_require__(18);
	var Spinner = __webpack_require__(19);

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
/* 18 */
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
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var Spinner = function Spinner(options) {
	    this.elem = document.getElementById('spinner');
	};

	Spinner.html = __webpack_require__(20);

	Spinner.prototype.show = function () {
	    this.elem.classList.remove('spinner_invisible');
	};

	Spinner.prototype.hide = function () {
	    this.elem.classList.add('spinner_invisible');
	};

	module.exports = Spinner;

/***/ }),
/* 20 */
/***/ (function(module, exports) {

	module.exports = "<div id=\"spinner\" class=\"spinner\">\r\n\r\n</div>";

/***/ }),
/* 21 */
/***/ (function(module, exports) {

	module.exports = "<div class='window modal window_invisible modal-window message-modal-window' id='message-modal-window'>\r\n    <div class=\"header window__header\">\r\n    </div>\r\n\r\n    <div class=\"panel window__panel\">\r\n        <div class=\"message-modal-window__message\">\r\n        </div>\r\n        <div class=\"button message-modal-window__ok-button\">OK</div>\r\n    </div>\r\n    <div class=\"icon-cross modal-close-button\"></div></div>";

/***/ }),
/* 22 */,
/* 23 */
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
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var eventMixin = __webpack_require__(18);
	var getErrorArray = __webpack_require__(23).getErrorArray;
	var ClientError = __webpack_require__(15).ClientError;

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

	    __webpack_require__(25)(body, 'POST', this.url, function (err, response) {
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
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var ServerError = __webpack_require__(15).ServerError;
	var ClientError = __webpack_require__(15).ClientError;

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
/* 26 */,
/* 27 */,
/* 28 */
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
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }),
/* 45 */,
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var eventMixin = __webpack_require__(18);
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

	    __webpack_require__(25)({
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

	    __webpack_require__(25)({
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
	    var social = __webpack_require__(47)(__webpack_require__(48));
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
/* 47 */
/***/ (function(module, exports) {

	'use strict';

	module.exports = function (markup) {
		var parent = document.createElement('DIV');
		parent.innerHTML = markup;
		var element = parent.firstElementChild;
		return element;
	};

/***/ }),
/* 48 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"social-collection__social social\" data-link=\"\">\r\n    <a class=\"social__link\" href=\"\">\r\n        <div class=\"social__icon icon-sphere\"></div>\r\n        <span class=\"social__host\"></span>\r\n    </a>\r\n    <div class=\"social__close icon-cross\"></div>\r\n</div>";

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var eventMixin = __webpack_require__(18);
	var FilePicker = __webpack_require__(50);

	var ClientError = __webpack_require__(15).ClientError;

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

	    __webpack_require__(25)(null, 'DELETE', '/avatar', function (err, response) {
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

	    __webpack_require__(51)("/avatar", formData, function (err, response) {
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
/* 50 */
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
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var ServerError = __webpack_require__(15).ServerError;
	var ClientError = __webpack_require__(15).ClientError;

	module.exports = function (url, formData, cb) {
		var xhr = new XMLHttpRequest();
		xhr.upload.onprogress = function (event) {
			//console.log(event.loaded + ' / ' + event.total);
		};

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
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var eventMixin = __webpack_require__(18);
	var ClientError = __webpack_require__(15).ClientError;
	var MessageModalWindow = __webpack_require__(16);

	var DescriptionAddSection = function DescriptionAddSection(options) {
	    var _this = this;

	    this.elem = options.elem;
	    this.saveButton = this.elem.querySelector('.button');
	    this.textarea = this.elem.querySelector('.textarea textarea');

	    this.elem.onclick = function (e) {
	        if (e.target !== _this.saveButton) return;
	        var description = _this.textarea.value;
	        var errors = __webpack_require__(23).getErrorArray({
	            description: description
	        });

	        if (errors.length === 0) _this.sendDescription(_this.textarea.value);else _this.error(new ClientError(errors[0].message));
	    };
	};

	DescriptionAddSection.prototype.sendDescription = function (description) {
	    var _this2 = this;

	    __webpack_require__(25)({
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
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZTBjMTNlYmI2NWY4NDA3N2VhYWE/ODViMyoiLCJ3ZWJwYWNrOi8vLy4vc2V0dGluZ3Mvc2NyaXB0LmpzIiwid2VicGFjazovLy8uLi9ibG9ja3MvZ2xvYmFsLWVycm9yLWhhbmRsZXIvaW5kZXguanM/YjAxNioiLCJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2NvbXBvbmVudEVycm9ycy5qcz9hY2I1Iiwid2VicGFjazovLy8uLi9ibG9ja3MvbWVzc2FnZS1tb2RhbC13aW5kb3cvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9tb2RhbC9pbmRleC5qcz85YzQ2Iiwid2VicGFjazovLy9EOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9ldmVudE1peGluLmpzPzNjYmMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9zcGlubmVyL2luZGV4LmpzPzA0OTIiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9zcGlubmVyL21hcmt1cD80N2Q3Iiwid2VicGFjazovLy8uLi9ibG9ja3MvbWVzc2FnZS1tb2RhbC13aW5kb3cvd2luZG93Iiwid2VicGFjazovLy9EOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9jaGVja1VzZXJEYXRhLmpzIiwid2VicGFjazovLy8uLi9ibG9ja3MvZm9ybS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvc2VuZFJlcXVlc3QuanM/OGEyNyIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2Ryb3Bkb3duL2luZGV4LmpzPzVlMjkiLCJ3ZWJwYWNrOi8vLy4vc2V0dGluZ3Mvc3R5bGUubGVzcyIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL3NvY2lhbC1jb2xsZWN0aW9uL2luZGV4LmpzIiwid2VicGFjazovLy9EOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9yZW5kZXJFbGVtZW50LmpzIiwid2VicGFjazovLy8uLi9ibG9ja3Mvc29jaWFsLWNvbGxlY3Rpb24vc29jaWFsIiwid2VicGFjazovLy8uLi9ibG9ja3MvdXBsb2FkLWF2YXRhci1zZWN0aW9uL2luZGV4LmpzIiwid2VicGFjazovLy8uLi9ibG9ja3MvZmlsZS1waWNrZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL3NlbmRGb3JtRGF0YS5qcyIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2Rlc2NyaXB0aW9uLWFkZC1zZWN0aW9uL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xuIFx0dmFyIHBhcmVudEpzb25wRnVuY3Rpb24gPSB3aW5kb3dbXCJ3ZWJwYWNrSnNvbnBcIl07XG4gXHR3aW5kb3dbXCJ3ZWJwYWNrSnNvbnBcIl0gPSBmdW5jdGlvbiB3ZWJwYWNrSnNvbnBDYWxsYmFjayhjaHVua0lkcywgbW9yZU1vZHVsZXMpIHtcbiBcdFx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG4gXHRcdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuIFx0XHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwLCBjYWxsYmFja3MgPSBbXTtcbiBcdFx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG4gXHRcdFx0aWYoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKVxuIFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2guYXBwbHkoY2FsbGJhY2tzLCBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pO1xuIFx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG4gXHRcdH1cbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRpZihwYXJlbnRKc29ucEZ1bmN0aW9uKSBwYXJlbnRKc29ucEZ1bmN0aW9uKGNodW5rSWRzLCBtb3JlTW9kdWxlcyk7XG4gXHRcdHdoaWxlKGNhbGxiYWNrcy5sZW5ndGgpXG4gXHRcdFx0Y2FsbGJhY2tzLnNoaWZ0KCkuY2FsbChudWxsLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0fTtcblxuIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3NcbiBcdC8vIFwiMFwiIG1lYW5zIFwiYWxyZWFkeSBsb2FkZWRcIlxuIFx0Ly8gQXJyYXkgbWVhbnMgXCJsb2FkaW5nXCIsIGFycmF5IGNvbnRhaW5zIGNhbGxiYWNrc1xuIFx0dmFyIGluc3RhbGxlZENodW5rcyA9IHtcbiBcdFx0OTowLFxuIFx0XHQxOjBcbiBcdH07XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuIFx0Ly8gVGhpcyBmaWxlIGNvbnRhaW5zIG9ubHkgdGhlIGVudHJ5IGNodW5rLlxuIFx0Ly8gVGhlIGNodW5rIGxvYWRpbmcgZnVuY3Rpb24gZm9yIGFkZGl0aW9uYWwgY2h1bmtzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmUgPSBmdW5jdGlvbiByZXF1aXJlRW5zdXJlKGNodW5rSWQsIGNhbGxiYWNrKSB7XG4gXHRcdC8vIFwiMFwiIGlzIHRoZSBzaWduYWwgZm9yIFwiYWxyZWFkeSBsb2FkZWRcIlxuIFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApXG4gXHRcdFx0cmV0dXJuIGNhbGxiYWNrLmNhbGwobnVsbCwgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gYW4gYXJyYXkgbWVhbnMgXCJjdXJyZW50bHkgbG9hZGluZ1wiLlxuIFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gIT09IHVuZGVmaW5lZCkge1xuIFx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXS5wdXNoKGNhbGxiYWNrKTtcbiBcdFx0fSBlbHNlIHtcbiBcdFx0XHQvLyBzdGFydCBjaHVuayBsb2FkaW5nXG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gW2NhbGxiYWNrXTtcbiBcdFx0XHR2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gXHRcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuIFx0XHRcdHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gXHRcdFx0c2NyaXB0LmNoYXJzZXQgPSAndXRmLTgnO1xuIFx0XHRcdHNjcmlwdC5hc3luYyA9IHRydWU7XG5cbiBcdFx0XHRzY3JpcHQuc3JjID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGNodW5rSWQgKyBcIi5cIiArICh7fVtjaHVua0lkXXx8Y2h1bmtJZCkgKyBcIi5qc1wiO1xuIFx0XHRcdGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZTBjMTNlYmI2NWY4NDA3N2VhYWEiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAnLi9zdHlsZS5sZXNzJztcclxuXHJcbmxldCBHbG9iYWxFcnJvckhhbmRsZXIgPSByZXF1aXJlKEJMT0NLUyArICdnbG9iYWwtZXJyb3ItaGFuZGxlcicpO1xyXG5sZXQgZ2xvYmFsRXJyb3JIYW5kbGVyID0gbmV3IEdsb2JhbEVycm9ySGFuZGxlcigpO1xyXG5cclxubGV0IERyb3Bkb3duID0gcmVxdWlyZShCTE9DS1MgKyAnZHJvcGRvd24nKTtcclxubGV0IFNvY2lhbENvbGxlY3Rpb24gPSByZXF1aXJlKEJMT0NLUyArICdzb2NpYWwtY29sbGVjdGlvbicpO1xyXG5sZXQgVXBsb2FkQXZhdGFyU2VjdGlvbiA9IHJlcXVpcmUoQkxPQ0tTICsgJ3VwbG9hZC1hdmF0YXItc2VjdGlvbicpO1xyXG5sZXQgRGVzY3JpcHRpb25BZGRTZWN0aW9uID0gcmVxdWlyZShCTE9DS1MgKyAnZGVzY3JpcHRpb24tYWRkLXNlY3Rpb24nKTtcclxubGV0IEZvcm0gPSByZXF1aXJlKEJMT0NLUyArICdmb3JtJyk7XHJcbmxldCBNZXNzYWdlTW9kYWxXaW5kb3cgPSByZXF1aXJlKEJMT0NLUyArICdtZXNzYWdlLW1vZGFsLXdpbmRvdycpO1xyXG5cclxubGV0IHVzZXJNZW51RHJvcGRvd24gPSBuZXcgRHJvcGRvd24oe1xyXG4gICAgZWxlbTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXItbWVudScpLFxyXG4gICAgY2xhc3NOYW1lOiAnaGVhZGVyLWVsZW1lbnQnXHJcbn0pO1xyXG5cclxubGV0IHNvY2lhbENvbGxlY3Rpb24gPSBuZXcgU29jaWFsQ29sbGVjdGlvbih7XHJcbiAgICBlbGVtOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc29jaWFsLWNvbGxlY3Rpb24nKVxyXG59KTtcclxuXHJcbmxldCB1cGxvYWRBdmF0YXJTZWN0aW9uID0gbmV3IFVwbG9hZEF2YXRhclNlY3Rpb24oe1xyXG4gICAgZWxlbTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VwbG9hZC1hdmF0YXItc2VjdGlvbicpXHJcbn0pO1xyXG5cclxubGV0IGRlc2NyaXB0aW9uQWRkU2VjdGlvbiA9IG5ldyBEZXNjcmlwdGlvbkFkZFNlY3Rpb24oe1xyXG4gICAgZWxlbTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rlc2NyaXB0aW9uLWFkZC1zZWN0aW9uJylcclxufSk7XHJcblxyXG5sZXQgcGFzc3dvcmRDaGFuZ2VGb3JtID0gbmV3IEZvcm0oe1xyXG4gICAgZWxlbTogZG9jdW1lbnQuZm9ybXNbJ2NoYW5nZS1wYXNzd29yZCddLFxyXG4gICAgZmllbGRzOiB7XHJcbiAgICAgICAgJ29sZC1wYXNzd29yZCc6IHtcclxuICAgICAgICAgICAgdmFsaWRhdG9yOiAnbm9uLWVtcHR5JyxcclxuICAgICAgICAgICAgYWxpYXM6ICdvbGQgcGFzc3dvcmQnLFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgICduZXctcGFzc3dvcmQnOiB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRvcjogJ3Bhc3N3b3JkJyxcclxuICAgICAgICAgICAgYWxpYXM6ICduZXcgcGFzc3dvcmQnLFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgICduZXctYWdhaW4nOiB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRvcjogJ3Bhc3N3b3JkLWFnYWluJyxcclxuICAgICAgICAgICAgYWxpYXM6ICduZXcgcGFzc3dvcmQnLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogJ25ldy1wYXNzd29yZCcsXHJcbiAgICAgICAgICAgIGV4dHJhOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHVybDogJy9zZXR0aW5ncydcclxufSk7XHJcblxyXG5wYXNzd29yZENoYW5nZUZvcm0ub24oJ2Zvcm1fc2VudCcsIGUgPT4ge1xyXG4gICAgbGV0IG1lc3NhZ2VNb2RhbFdpbmRvdyA9IG5ldyBNZXNzYWdlTW9kYWxXaW5kb3coe21lc3NhZ2U6ICdQYXNzd29yZCBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgY2hhbmdlZCd9KTtcclxuICAgIG1lc3NhZ2VNb2RhbFdpbmRvdy5zaG93KCk7XHJcbn0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NldHRpbmdzL3NjcmlwdC5qcyIsImxldCBHbG9iYWxFcnJvckhhbmRsZXIgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBlID0+IHtcclxuICAgICAgICBsZXQgZXJyb3IgPSBlLmRldGFpbDtcclxuICAgICAgICB0aGlzLmNhbGwoZXJyb3IpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5HbG9iYWxFcnJvckhhbmRsZXIucHJvdG90eXBlLmNhbGwgPSBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgIHJlcXVpcmUuZW5zdXJlKFtMSUJTICsgJ2NvbXBvbmVudEVycm9ycycsIEJMT0NLUyArICdtZXNzYWdlLW1vZGFsLXdpbmRvdyddLCBmdW5jdGlvbiAocmVxdWlyZSkge1xyXG4gICAgICAgIGxldCBDb21wb25lbnRFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5Db21wb25lbnRFcnJvcjtcclxuICAgICAgICBsZXQgTWVzc2FnZU1vZGFsV2luZG93ID0gcmVxdWlyZShCTE9DS1MgKyAnbWVzc2FnZS1tb2RhbC13aW5kb3cnKTtcclxuXHJcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgQ29tcG9uZW50RXJyb3IpIHtcclxuICAgICAgICAgICAgaWYgKGVycm9yLnN0YXR1cyA9PT0gNDAxKSB7XHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkaXJlY3RlZF91cmwnLCB3aW5kb3cubG9jYXRpb24uaHJlZik7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSAnL2F1dGhvcml6YXRpb24nO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IG1lc3NhZ2VNb2RhbFdpbmRvdyA9IG5ldyBNZXNzYWdlTW9kYWxXaW5kb3coe21lc3NhZ2U6IGVycm9yLm1lc3NhZ2V9KTtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2VNb2RhbFdpbmRvdy5hY3RpdmF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcclxuICAgIH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHbG9iYWxFcnJvckhhbmRsZXI7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9nbG9iYWwtZXJyb3ItaGFuZGxlci9pbmRleC5qcyIsImZ1bmN0aW9uIEN1c3RvbUVycm9yKG1lc3NhZ2UpIHtcclxuXHR0aGlzLm5hbWUgPSBcIkN1c3RvbUVycm9yXCI7XHJcblx0dGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuXHJcblx0aWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKVxyXG5cdFx0RXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgQ3VzdG9tRXJyb3IpO1xyXG5cdGVsc2VcclxuXHRcdHRoaXMuc3RhY2sgPSAobmV3IEVycm9yKCkpLnN0YWNrO1xyXG59XHJcbkN1c3RvbUVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcclxuQ3VzdG9tRXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ3VzdG9tRXJyb3I7XHJcblxyXG5cclxuZnVuY3Rpb24gQ29tcG9uZW50RXJyb3IobWVzc2FnZSwgc3RhdHVzKSB7XHJcblx0Q3VzdG9tRXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlIHx8ICdBbiBlcnJvciBoYXMgb2NjdXJyZWQnICk7XHJcblx0dGhpcy5uYW1lID0gXCJDb21wb25lbnRFcnJvclwiO1xyXG5cdHRoaXMuc3RhdHVzID0gc3RhdHVzO1xyXG59XHJcbkNvbXBvbmVudEVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ3VzdG9tRXJyb3IucHJvdG90eXBlKTtcclxuQ29tcG9uZW50RXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ29tcG9uZW50RXJyb3I7XHJcblxyXG5mdW5jdGlvbiBDbGllbnRFcnJvcihtZXNzYWdlLCBkZXRhaWwsIHN0YXR1cykge1xyXG5cdENvbXBvbmVudEVycm9yLmNhbGwodGhpcywgbWVzc2FnZSB8fCAnQW4gZXJyb3IgaGFzIG9jY3VycmVkLiBDaGVjayBpZiBqYXZhc2NyaXB0IGlzIGVuYWJsZWQnLCBzdGF0dXMpO1xyXG5cdHRoaXMubmFtZSA9IFwiQ2xpZW50RXJyb3JcIjtcclxuXHR0aGlzLmRldGFpbCA9IGRldGFpbDtcclxufVxyXG5DbGllbnRFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbXBvbmVudEVycm9yLnByb3RvdHlwZSk7XHJcbkNsaWVudEVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENsaWVudEVycm9yO1xyXG5cclxuXHJcbmZ1bmN0aW9uIEltYWdlTm90Rm91bmQobWVzc2FnZSkge1xyXG4gICAgQ2xpZW50RXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlIHx8ICdJbWFnZSBub3QgZm91bmQuIEl0IHByb2JhYmx5IGhhcyBiZWVuIHJlbW92ZWQnLCBudWxsLCA0MDQpO1xyXG4gICAgdGhpcy5uYW1lID0gXCJJbWFnZU5vdEZvdW5kXCI7XHJcbn1cclxuSW1hZ2VOb3RGb3VuZC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENsaWVudEVycm9yLnByb3RvdHlwZSk7XHJcbkltYWdlTm90Rm91bmQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gSW1hZ2VOb3RGb3VuZDtcclxuXHJcbmZ1bmN0aW9uIFNlcnZlckVycm9yKG1lc3NhZ2UsIHN0YXR1cykge1xyXG5cdENvbXBvbmVudEVycm9yLmNhbGwodGhpcywgbWVzc2FnZSB8fCAnVGhlcmUgaXMgc29tZSBlcnJvciBvbiB0aGUgc2VydmVyIHNpZGUnLCBzdGF0dXMpO1xyXG5cdHRoaXMubmFtZSA9IFwiU2VydmVyRXJyb3JcIjtcclxufVxyXG5TZXJ2ZXJFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbXBvbmVudEVycm9yLnByb3RvdHlwZSk7XHJcblNlcnZlckVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNlcnZlckVycm9yO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0Q29tcG9uZW50RXJyb3IsXHJcblx0Q2xpZW50RXJyb3IsXHJcbiAgICBJbWFnZU5vdEZvdW5kLFxyXG5cdFNlcnZlckVycm9yXHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9jb21wb25lbnRFcnJvcnMuanMiLCJsZXQgTW9kYWwgPSByZXF1aXJlKEJMT0NLUyArICdtb2RhbCcpO1xyXG5cclxubGV0IE1lc3NhZ2VNb2RhbFdpbmRvdyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBNb2RhbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgdGhpcy5lbGVtID0gbnVsbDtcclxuICAgIHRoaXMuZWxlbUlkID0gJ21lc3NhZ2UtbW9kYWwtd2luZG93JztcclxuICAgIHRoaXMuY2FwdGlvbiA9IG9wdGlvbnMgJiYgb3B0aW9ucy5jYXB0aW9uIHx8ICdtZXNzYWdlJztcclxuICAgIHRoaXMubWVzc2FnZSA9IG9wdGlvbnMgJiYgb3B0aW9ucy5tZXNzYWdlIHx8ICdZb3Ugd2VyZSBub3Qgc3VwcG9zZSB0byBzZWUgdGhpcyEgU2VlbXMgbGlrZSBzb21ldGhpbmcgaXMgYnJva2VuIDooJztcclxuXHJcbn07XHJcbk1lc3NhZ2VNb2RhbFdpbmRvdy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKE1vZGFsLnByb3RvdHlwZSk7XHJcbk1lc3NhZ2VNb2RhbFdpbmRvdy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBNZXNzYWdlTW9kYWxXaW5kb3c7XHJcblxyXG5NZXNzYWdlTW9kYWxXaW5kb3cucHJvdG90eXBlLnNldEVsZW0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLnNldFdpbmRvd0h0bWwoKTtcclxuICAgIHRoaXMuZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZWxlbUlkKTtcclxuICAgIGlmICghdGhpcy5lbGVtKVxyXG4gICAgICAgIHRoaXMuZWxlbSA9IHRoaXMucmVuZGVyV2luZG93KHRoaXMud2luZG93SHRtbCk7XHJcbiAgICB0aGlzLnNldExpc3RlbmVycygpO1xyXG4gICAgdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXInKS50ZXh0Q29udGVudCA9IHRoaXMuY2FwdGlvbjtcclxuICAgIHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcubWVzc2FnZS1tb2RhbC13aW5kb3dfX21lc3NhZ2UnKS50ZXh0Q29udGVudCA9IHRoaXMubWVzc2FnZTtcclxuXHJcbiAgICB0aGlzLmVsZW0ub25jbGljayA9IGUgPT4ge1xyXG4gICAgICAgIHRoaXMub25FbGVtQ2xpY2soZSk7XHJcbiAgICAgICAgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoJy5tZXNzYWdlLW1vZGFsLXdpbmRvd19fb2stYnV0dG9uJykpXHJcbiAgICAgICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xyXG4gICAgfTtcclxufTtcclxuXHJcbk1lc3NhZ2VNb2RhbFdpbmRvdy5wcm90b3R5cGUuc2V0V2luZG93SHRtbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMud2luZG93SHRtbCA9IHJlcXVpcmUoYGh0bWwtbG9hZGVyIS4vd2luZG93YCk7XHJcbn07XHJcblxyXG5NZXNzYWdlTW9kYWxXaW5kb3cucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBNb2RhbC5wcm90b3R5cGUuc2hvdy5hcHBseSh0aGlzKTtcclxuXHJcbiAgICBpZiAoIXRoaXMuZWxlbSlcclxuICAgICAgICB0aGlzLnNldEVsZW0oKTtcclxuXHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnd2luZG93X2ludmlzaWJsZScpO1xyXG59O1xyXG5cclxuTWVzc2FnZU1vZGFsV2luZG93LnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgTW9kYWwucHJvdG90eXBlLmhpZGUuYXBwbHkodGhpcyk7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnd2luZG93X2ludmlzaWJsZScpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZXNzYWdlTW9kYWxXaW5kb3c7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvbWVzc2FnZS1tb2RhbC13aW5kb3cvaW5kZXguanMiLCJsZXQgZXZlbnRNaXhpbiA9IHJlcXVpcmUoTElCUyArICdldmVudE1peGluJyk7XHJcbmxldCBTcGlubmVyID0gcmVxdWlyZShCTE9DS1MgKyAnc3Bpbm5lcicpO1xyXG5cclxubGV0IE1vZGFsID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XHJcbiAgICB0aGlzLmxpc3RlbmVycyA9IFtdO1xyXG4gICAgdGhpcy5zdGF0dXMgPSBvcHRpb25zICYmIG9wdGlvbnMuc3RhdHVzIHx8IE1vZGFsLnN0YXR1c2VzLk1JTk9SO1xyXG59O1xyXG5cclxuTW9kYWwuc3RhdHVzZXMgPSB7XHJcbiAgICBNQUpPUjogMSxcclxuICAgIE1JTk9SOiAyXHJcbn07XHJcblxyXG5Nb2RhbC5wcm90b3R5cGUub25FbGVtQ2xpY2sgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoJy5tb2RhbC1jbG9zZS1idXR0b24nKSlcclxuICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcclxufTtcclxuXHJcbk1vZGFsLnByb3RvdHlwZS5zZXRMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmxpc3RlbmVycy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgIHRoaXMuZWxlbS5hZGRFdmVudExpc3RlbmVyKGl0ZW0uZXZlbnROYW1lLCBpdGVtLmNiKTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuTW9kYWwuc2V0QmFja2Ryb3AgPSBmdW5jdGlvbiAoc3RhdHVzKSB7XHJcbiAgICBpZiAoc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUikge1xyXG4gICAgICAgIE1vZGFsLm1pbm9yQmFja2Ryb3AgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja2Ryb3BfbWlub3InKTtcclxuICAgICAgICBpZiAoIU1vZGFsLm1pbm9yQmFja2Ryb3ApXHJcbiAgICAgICAgICAgIE1vZGFsLm1pbm9yQmFja2Ryb3AgPSBNb2RhbC5yZW5kZXJCYWNrZHJvcCgnbWlub3InKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgTW9kYWwubWFqb3JCYWNrZHJvcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrZHJvcF9tYWpvcicpO1xyXG4gICAgICAgIGlmICghTW9kYWwubWFqb3JCYWNrZHJvcClcclxuICAgICAgICAgICAgTW9kYWwubWFqb3JCYWNrZHJvcCA9IE1vZGFsLnJlbmRlckJhY2tkcm9wKCdtYWpvcicpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuTW9kYWwuc2V0V3JhcHBlciA9IGZ1bmN0aW9uIChzdGF0dXMpIHtcclxuICAgIGlmIChzdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKSB7XHJcbiAgICAgICAgTW9kYWwubWlub3JXcmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLXdyYXBwZXItbWlub3InKTtcclxuICAgICAgICBpZiAoIU1vZGFsLm1pbm9yV3JhcHBlcilcclxuICAgICAgICAgICAgTW9kYWwubWlub3JXcmFwcGVyID0gTW9kYWwucmVuZGVyV3JhcHBlcignbWlub3InKTtcclxuICAgICAgICBNb2RhbC5taW5vcldyYXBwZXIub25jbGljayA9IGUgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZS50YXJnZXQgJiYgIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbW9kYWwtd3JhcHBlcl9taW5vcicpKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChNb2RhbC5taW5vckFjdGl2ZSlcclxuICAgICAgICAgICAgICAgIE1vZGFsLm1pbm9yUXVldWVbMF0uZGVhY3RpdmF0ZSgpO1xyXG4gICAgICAgIH07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIE1vZGFsLm1ham9yV3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC13cmFwcGVyLW1ham9yJyk7XHJcbiAgICAgICAgaWYgKCFNb2RhbC5tYWpvcldyYXBwZXIpXHJcbiAgICAgICAgICAgIE1vZGFsLm1ham9yV3JhcHBlciA9IE1vZGFsLnJlbmRlcldyYXBwZXIoJ21ham9yJyk7XHJcbiAgICAgICAgTW9kYWwubWFqb3JXcmFwcGVyLm9uY2xpY2sgPSBlID0+IHtcclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0ICYmICFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ21vZGFsLXdyYXBwZXJfbWFqb3InKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAoTW9kYWwubWFqb3JBY3RpdmUpXHJcbiAgICAgICAgICAgICAgICBNb2RhbC5tYWpvclF1ZXVlWzBdLmRlYWN0aXZhdGUoKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59O1xyXG5cclxuTW9kYWwucmVuZGVyQmFja2Ryb3AgPSBmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgbGV0IGJhY2tkcm9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyk7XHJcbiAgICBiYWNrZHJvcC5jbGFzc05hbWUgPSAnYmFja2Ryb3AgYmFja2Ryb3BfaW52aXNpYmxlJztcclxuICAgIGJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoYGJhY2tkcm9wXyR7dHlwZX1gKTtcclxuICAgIGJhY2tkcm9wLmlkID0gYGJhY2tkcm9wLSR7dHlwZX1gO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChiYWNrZHJvcCk7XHJcbiAgICByZXR1cm4gYmFja2Ryb3A7XHJcbn07XHJcblxyXG5Nb2RhbC5yZW5kZXJXcmFwcGVyID0gZnVuY3Rpb24gKHR5cGUpIHtcclxuICAgIGxldCB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyk7XHJcbiAgICB3cmFwcGVyLmNsYXNzTmFtZSA9ICdtb2RhbC13cmFwcGVyIG1vZGFsLXdyYXBwZXJfaW52aXNpYmxlJztcclxuICAgIHdyYXBwZXIuY2xhc3NMaXN0LmFkZChgbW9kYWwtd3JhcHBlcl8ke3R5cGV9YCk7XHJcbiAgICB3cmFwcGVyLmlkID0gYG1vZGFsLXdyYXBwZXItJHt0eXBlfWA7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHdyYXBwZXIpO1xyXG4gICAgcmV0dXJuIHdyYXBwZXI7XHJcbn07XHJcblxyXG5Nb2RhbC5wcm90b3R5cGUucmVuZGVyV2luZG93ID0gZnVuY3Rpb24gKGh0bWwpIHtcclxuXHJcbiAgICBsZXQgcGFyZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyk7XHJcbiAgICBwYXJlbnQuaW5uZXJIVE1MID0gaHRtbDtcclxuICAgIGxldCB3bmQgPSBwYXJlbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcbiAgICBpZiAodGhpcy5zdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKVxyXG4gICAgICAgIE1vZGFsLm1pbm9yV3JhcHBlci5hcHBlbmRDaGlsZCh3bmQpO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIE1vZGFsLm1ham9yV3JhcHBlci5hcHBlbmRDaGlsZCh3bmQpO1xyXG5cclxuICAgIHBhcmVudC5yZW1vdmUoKTtcclxuICAgIHJldHVybiB3bmQ7XHJcbn07XHJcblxyXG5Nb2RhbC5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpIHtcclxuICAgICAgICBpZiAoIU1vZGFsLm1pbm9yQmFja2Ryb3ApXHJcbiAgICAgICAgICAgIE1vZGFsLnNldEJhY2tkcm9wKE1vZGFsLnN0YXR1c2VzLk1JTk9SKTtcclxuXHJcbiAgICAgICAgaWYgKCFNb2RhbC5taW5vcldyYXBwZXIpXHJcbiAgICAgICAgICAgIE1vZGFsLnNldFdyYXBwZXIoTW9kYWwuc3RhdHVzZXMuTUlOT1IpO1xyXG5cclxuICAgICAgICBNb2RhbC5taW5vcldyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtd3JhcHBlcl9pbnZpc2libGUnKTtcclxuICAgICAgICBNb2RhbC5taW5vckJhY2tkcm9wLmNsYXNzTGlzdC5yZW1vdmUoJ2JhY2tkcm9wX2ludmlzaWJsZScpO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKCFNb2RhbC5tYWpvckJhY2tkcm9wKVxyXG4gICAgICAgICAgICBNb2RhbC5zZXRCYWNrZHJvcChNb2RhbC5zdGF0dXNlcy5NQUpPUik7XHJcblxyXG4gICAgICAgIGlmICghTW9kYWwubWFqb3JXcmFwcGVyKVxyXG4gICAgICAgICAgICBNb2RhbC5zZXRXcmFwcGVyKE1vZGFsLnN0YXR1c2VzLk1BSk9SKTtcclxuXHJcbiAgICAgICAgTW9kYWwubWFqb3JXcmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLXdyYXBwZXJfaW52aXNpYmxlJyk7XHJcbiAgICAgICAgTW9kYWwubWFqb3JCYWNrZHJvcC5jbGFzc0xpc3QucmVtb3ZlKCdiYWNrZHJvcF9pbnZpc2libGUnKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XHJcblxyXG59O1xyXG5cclxuXHJcbk1vZGFsLnByb3RvdHlwZS5hY3RpdmF0ZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgaWYgKHRoaXMuZWxlbUlkID09PSAnc3Bpbm5lcicpIHtcclxuICAgICAgICBsZXQgc3Bpbm5lciA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5vbignc3Bpbm5lcl9ob3N0LWxvYWRlZCcsIGUgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbmV3SG9zdCA9IGUuZGV0YWlsLmhvc3Q7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKVxyXG4gICAgICAgICAgICAgICAgTW9kYWwubWlub3JRdWV1ZS5zcGxpY2UoTW9kYWwubWlub3JRdWV1ZS5pbmRleE9mKHNwaW5uZXIpICsgMSwgMCwgbmV3SG9zdCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIE1vZGFsLm1ham9yUXVldWUuc3BsaWNlKE1vZGFsLm1ham9yUXVldWUuaW5kZXhPZihzcGlubmVyKSArIDEsIDAsIG5ld0hvc3QpO1xyXG5cclxuICAgICAgICAgICAgc3Bpbm5lci5kZWFjdGl2YXRlKGUuZGV0YWlsLm9wdGlvbnMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUikge1xyXG4gICAgICAgICAgICBNb2RhbC5taW5vclF1ZXVlLnB1c2godGhpcyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKE1vZGFsLm1pbm9yUXVldWUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhNb2RhbC5tYWpvclF1ZXVlKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghTW9kYWwubWlub3JBY3RpdmUpXHJcbiAgICAgICAgICAgICAgICBNb2RhbC5taW5vclNob3cob3B0aW9ucykudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIE1vZGFsLm1ham9yUXVldWUucHVzaCh0aGlzKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coTW9kYWwubWlub3JRdWV1ZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKE1vZGFsLm1ham9yUXVldWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFNb2RhbC5tYWpvckFjdGl2ZSlcclxuXHJcbiAgICAgICAgICAgICAgICBNb2RhbC5tYWpvclNob3cob3B0aW9ucykudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufTtcclxuXHJcbk1vZGFsLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUikge1xyXG4gICAgICAgIC8vVE9ETyBub3QgbmVjY2Vzc2FyeSBpZiBxdWV1ZSBpcyBub3QgZW1wdHlcclxuICAgICAgICBNb2RhbC5taW5vcldyYXBwZXIuY2xhc3NMaXN0LmFkZCgnbW9kYWwtd3JhcHBlcl9pbnZpc2libGUnKTtcclxuICAgICAgICBNb2RhbC5taW5vckJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoJ2JhY2tkcm9wX2ludmlzaWJsZScpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgTW9kYWwubWFqb3JXcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ21vZGFsLXdyYXBwZXJfaW52aXNpYmxlJyk7XHJcbiAgICAgICAgTW9kYWwubWFqb3JCYWNrZHJvcC5jbGFzc0xpc3QuYWRkKCdiYWNrZHJvcF9pbnZpc2libGUnKTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5Nb2RhbC5wcm90b3R5cGUuZGVhY3RpdmF0ZSA9IGZ1bmN0aW9uIChuZXh0V2luZG93T3B0aW9ucywgaGlkZU9wdGlvbnMpIHtcclxuXHJcbiAgICB0aGlzLmhpZGUoaGlkZU9wdGlvbnMpO1xyXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpIHtcclxuICAgICAgICBNb2RhbC5taW5vckFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIE1vZGFsLm1pbm9yUXVldWUuc2hpZnQoKTtcclxuICAgICAgICBNb2RhbC5taW5vclNob3cobmV4dFdpbmRvd09wdGlvbnMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBNb2RhbC5tYWpvckFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIE1vZGFsLm1ham9yUXVldWUuc2hpZnQoKTtcclxuICAgICAgICBNb2RhbC5tYWpvclNob3cobmV4dFdpbmRvd09wdGlvbnMpO1xyXG4gICAgfVxyXG4gICAgdGhpcy50cmlnZ2VyKCdtb2RhbC13aW5kb3dfZGVhY3RpdmF0ZWQnKTtcclxufTtcclxuXHJcbk1vZGFsLm1pbm9yQWN0aXZlID0gZmFsc2U7XHJcbk1vZGFsLm1ham9yQWN0aXZlID0gZmFsc2U7XHJcbk1vZGFsLm1pbm9yUXVldWUgPSBbXTtcclxuTW9kYWwubWFqb3JRdWV1ZSA9IFtdO1xyXG5cclxuTW9kYWwuc3Bpbm5lciA9IG5ldyBTcGlubmVyKCk7XHJcbk1vZGFsLnNwaW5uZXIuc3RhdHVzID0gTW9kYWwuc3RhdHVzZXMuTUFKT1I7XHJcblxyXG5Nb2RhbC5zaG93U3Bpbm5lciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIE1vZGFsLnByb3RvdHlwZS5zaG93LmNhbGwoTW9kYWwuc3Bpbm5lcik7XHJcblxyXG4gICAgaWYgKCFNb2RhbC5zcGlubmVyLmVsZW0pXHJcbiAgICAgICAgTW9kYWwuc3Bpbm5lci5lbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwaW5uZXInKTtcclxuICAgIGlmICghTW9kYWwuc3Bpbm5lci5lbGVtKVxyXG4gICAgICAgIE1vZGFsLnNwaW5uZXIuZWxlbSA9IE1vZGFsLnByb3RvdHlwZS5yZW5kZXJXaW5kb3cuY2FsbChNb2RhbC5zcGlubmVyLCBTcGlubmVyLmh0bWwpO1xyXG5cclxuICAgIE1vZGFsLnNwaW5uZXIuc2hvdygpO1xyXG59O1xyXG5cclxuTW9kYWwuaGlkZVNwaW5uZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBNb2RhbC5zcGlubmVyLmhpZGUoKTtcclxufTtcclxuXHJcblxyXG5Nb2RhbC5taW5vclNob3cgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgbGV0IG5leHRNb2RhbFdpbmRvdyA9IE1vZGFsLm1pbm9yUXVldWVbMF07XHJcbiAgICBpZiAobmV4dE1vZGFsV2luZG93KSB7XHJcbiAgICAgICAgbGV0IHByb21pc2UgPSBuZXh0TW9kYWxXaW5kb3cuc2hvdyhvcHRpb25zKTtcclxuICAgICAgICBpZiAocHJvbWlzZSlcclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2UudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBNb2RhbC5taW5vckFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBNb2RhbC5taW5vckFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICBNb2RhbC5taW5vckFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH1cclxufTtcclxuXHJcbk1vZGFsLm1ham9yU2hvdyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgbGV0IG5leHRNb2RhbFdpbmRvdyA9IE1vZGFsLm1ham9yUXVldWVbMF07XHJcblxyXG4gICAgaWYgKG5leHRNb2RhbFdpbmRvdykge1xyXG5cclxuICAgICAgICBNb2RhbC5zaG93U3Bpbm5lcigpO1xyXG4gICAgICAgIGxldCBwcm9taXNlID0gbmV4dE1vZGFsV2luZG93LnNob3cob3B0aW9ucyk7XHJcblxyXG4gICAgICAgIGlmIChwcm9taXNlKVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIE1vZGFsLm1ham9yQWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIE1vZGFsLmhpZGVTcGlubmVyKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBNb2RhbC5tYWpvckFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIE1vZGFsLmhpZGVTcGlubmVyKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBNb2RhbC5tYWpvckFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH1cclxufTtcclxuXHJcbmZvciAobGV0IGtleSBpbiBldmVudE1peGluKVxyXG4gICAgTW9kYWwucHJvdG90eXBlW2tleV0gPSBldmVudE1peGluW2tleV07XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNb2RhbDtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9tb2RhbC9pbmRleC5qcyIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuXHRvbjogZnVuY3Rpb24oZXZlbnROYW1lLCBjYikge1xyXG5cdFx0aWYgKHRoaXMuZWxlbSlcclxuXHRcdFx0dGhpcy5lbGVtLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYik7XHJcblx0XHRlbHNlXHJcblx0XHRcdHRoaXMubGlzdGVuZXJzLnB1c2goe1xyXG5cdFx0XHRcdGV2ZW50TmFtZSxcclxuXHRcdFx0XHRjYlxyXG5cdFx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHR0cmlnZ2VyOiBmdW5jdGlvbihldmVudE5hbWUsIGRldGFpbCkge1xyXG5cdFx0dGhpcy5lbGVtLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwge1xyXG5cdFx0XHRidWJibGVzOiB0cnVlLFxyXG5cdFx0XHRjYW5jZWxhYmxlOiB0cnVlLFxyXG5cdFx0XHRkZXRhaWw6IGRldGFpbFxyXG5cdFx0fSkpO1xyXG5cdH0sXHJcblxyXG5cdGVycm9yOiBmdW5jdGlvbihlcnIpIHtcclxuXHRcdHRoaXMuZWxlbS5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnZXJyb3InLCB7XHJcblx0XHRcdGJ1YmJsZXM6IHRydWUsXHJcblx0XHRcdGNhbmNlbGFibGU6IHRydWUsXHJcblx0XHRcdGRldGFpbDogZXJyXHJcblx0XHR9KSk7XHJcblx0fVxyXG5cclxuXHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9ldmVudE1peGluLmpzIiwibGV0IFNwaW5uZXIgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgdGhpcy5lbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwaW5uZXInKTtcclxufTtcclxuXHJcblNwaW5uZXIuaHRtbCA9IHJlcXVpcmUoYGh0bWwtbG9hZGVyIS4vbWFya3VwYCk7XHJcblxyXG5TcGlubmVyLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3NwaW5uZXJfaW52aXNpYmxlJyk7XHJcbn07XHJcblxyXG5TcGlubmVyLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ3NwaW5uZXJfaW52aXNpYmxlJyk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNwaW5uZXI7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9zcGlubmVyL2luZGV4LmpzIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxkaXYgaWQ9XFxcInNwaW5uZXJcXFwiIGNsYXNzPVxcXCJzcGlubmVyXFxcIj5cXHJcXG5cXHJcXG48L2Rpdj5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svfi9odG1sLWxvYWRlciEuLi9ibG9ja3Mvc3Bpbm5lci9tYXJrdXBcbi8vIG1vZHVsZSBpZCA9IDIwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSAyIDggOSAxMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8ZGl2IGNsYXNzPSd3aW5kb3cgbW9kYWwgd2luZG93X2ludmlzaWJsZSBtb2RhbC13aW5kb3cgbWVzc2FnZS1tb2RhbC13aW5kb3cnIGlkPSdtZXNzYWdlLW1vZGFsLXdpbmRvdyc+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImhlYWRlciB3aW5kb3dfX2hlYWRlclxcXCI+XFxyXFxuICAgIDwvZGl2PlxcclxcblxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJwYW5lbCB3aW5kb3dfX3BhbmVsXFxcIj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcIm1lc3NhZ2UtbW9kYWwtd2luZG93X19tZXNzYWdlXFxcIj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uIG1lc3NhZ2UtbW9kYWwtd2luZG93X19vay1idXR0b25cXFwiPk9LPC9kaXY+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJpY29uLWNyb3NzIG1vZGFsLWNsb3NlLWJ1dHRvblxcXCI+PC9kaXY+PC9kaXY+XCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL34vaHRtbC1sb2FkZXIhLi4vYmxvY2tzL21lc3NhZ2UtbW9kYWwtd2luZG93L3dpbmRvd1xuLy8gbW9kdWxlIGlkID0gMjFcbi8vIG1vZHVsZSBjaHVua3MgPSAxIDQgOSIsIi8vbGV0IGRlYnVnID0gcmVxdWlyZSgnZGVidWcnKSgnYXBwOmNoZWNrVXNlcmREYXRhJyk7XHJcblxyXG5jb25zdCBQUk9QRVJUWV9TWU1CT0wgPSAnW3Byb3BlcnR5XSc7XHJcblxyXG5sZXQgbWVzc2FnZXMgPSB7XHJcbiAgICBwbGFpbjogJ2luY29ycmVjdCBbcHJvcGVydHldJyxcclxuICAgIGVtcHR5OiAnW3Byb3BlcnR5XSBtdXN0IG5vdCBiZSBlbXB0eScsXHJcbiAgICB0b29CaWc6IHZhbHVlID0+IHtcclxuICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAgICAgIHJldHVybiBgW3Byb3BlcnR5XSBtdXN0IGJlIGxvd2VyIHRoYW4gJHt2YWx1ZSArIDF9IHN5bWJvbHNgO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuICdbcHJvcGVydHldIGlzIHRvbyBiaWcnO1xyXG4gICAgfSxcclxuICAgIHRvb1NtYWxsOiB2YWx1ZSA9PiB7XHJcbiAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgICAgICByZXR1cm4gYFtwcm9wZXJ0eV0gbXVzdCBiZSBncmVhdGVyIHRoYW4gJHt2YWx1ZSAtIDF9IHN5bWJvbHNgO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuICdbcHJvcGVydHldIGlzIHRvbyBzaG9ydCc7XHJcbiAgICB9XHJcbn07XHJcblxyXG5sZXQgdGVzdHMgPSB7XHJcbiAgICByZWdFeHA6IChyZWdFeHAsIHZhbHVlKSA9PiByZWdFeHAudGVzdCh2YWx1ZSksXHJcbiAgICBtYXg6IChtYXgsIHZhbHVlKSA9PiAodmFsdWUubGVuZ3RoIDw9IG1heCksXHJcbiAgICBtaW46IChtaW4sIHZhbHVlKSA9PiAodmFsdWUubGVuZ3RoID49IG1pbiksXHJcbiAgICBub25FbXB0eTogKHZhbHVlKSA9PiAodmFsdWUubGVuZ3RoID4gMClcclxuXHJcbn07XHJcblxyXG5cclxubGV0IGNoZWNrcyA9IHtcclxuICAgIG1heDogKHZhbHVlLCBlcnJvck1lc3NhZ2UpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGVycm9yTWVzc2FnZSB8fCBtZXNzYWdlcy50b29CaWcodmFsdWUpLFxyXG4gICAgICAgICAgICB0ZXN0OiB0ZXN0cy5tYXguYmluZChudWxsLCB2YWx1ZSlcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuXHJcbiAgICBtaW46ICh2YWx1ZSwgZXJyb3JNZXNzYWdlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlcnJvck1lc3NhZ2UgfHwgbWVzc2FnZXMudG9vU21hbGwodmFsdWUpLFxyXG4gICAgICAgICAgICB0ZXN0OiB0ZXN0cy5taW4uYmluZChudWxsLCB2YWx1ZSlcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuXHJcbiAgICBub25FbXB0eTogKGVycm9yTWVzc2FnZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZXJyb3JNZXNzYWdlIHx8IG1lc3NhZ2VzLmVtcHR5LFxyXG4gICAgICAgICAgICB0ZXN0OiB0ZXN0cy5ub25FbXB0eVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn07XHJcblxyXG5mdW5jdGlvbiBjb21wdXRlRXJyb3JNZXNzYWdlKHRlbXBsYXRlLCBwcm9wZXJ0eSkge1xyXG4gICAgbGV0IHBvcztcclxuICAgIHRlbXBsYXRlID0gdGVtcGxhdGUgfHwgbWVzc2FnZXMucGxhaW47XHJcbiAgICBwcm9wZXJ0eSA9IHByb3BlcnR5IHx8ICd0aGlzIHByb3BlcnR5JztcclxuICAgIHdoaWxlICh+KHBvcyA9IHRlbXBsYXRlLmluZGV4T2YoUFJPUEVSVFlfU1lNQk9MKSkpXHJcbiAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5zdWJzdHJpbmcoMCwgcG9zKSArIHByb3BlcnR5ICsgdGVtcGxhdGUuc3Vic3RyaW5nKHBvcyArIFBST1BFUlRZX1NZTUJPTC5sZW5ndGgpO1xyXG4gICAgcmV0dXJuIHRlbXBsYXRlO1xyXG59XHJcblxyXG5sZXQgdmFsaWRhdG9ycyA9IHtcclxuXHJcbiAgICAnbm9uLWVtcHR5Jzoge1xyXG4gICAgICAgIGNoZWNrczogW1xyXG4gICAgICAgICAgICBjaGVja3Mubm9uRW1wdHkoKVxyXG4gICAgICAgIF1cclxuICAgIH0sXHJcblxyXG4gICAgJ2VtYWlsJzoge1xyXG4gICAgICAgIGNoZWNrczogW1xyXG4gICAgICAgICAgICBjaGVja3Mubm9uRW1wdHkoKSxcclxuICAgICAgICAgICAgY2hlY2tzLm1heCgxMDAsIG1lc3NhZ2VzLnRvb0JpZygpKSxcclxuICAgICAgICAgICAgY2hlY2tzLm1pbig2LCBtZXNzYWdlcy50b29TbWFsbCgpKSwge1xyXG4gICAgICAgICAgICAgICAgdGVzdDogdGVzdHMucmVnRXhwLmJpbmQobnVsbCwgL14oXFx3K1stXFwuXT8/KStAW1xcdy4tXStcXHdcXC5cXHd7Miw1fSQvaSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgIH0sXHJcblxyXG5cclxuICAgICd1c2VybmFtZSc6IHtcclxuICAgICAgICBjaGVja3M6IFtcclxuICAgICAgICAgICAgY2hlY2tzLm5vbkVtcHR5KCksXHJcbiAgICAgICAgICAgIGNoZWNrcy5tYXgoMTYpLFxyXG4gICAgICAgICAgICBjaGVja3MubWluKDUpLCB7XHJcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6ICdtdXN0IG9ubHkgY29udGFpbiBhbHBoYW51bWVyaWMgc3ltYm9scycsXHJcbiAgICAgICAgICAgICAgICB0ZXN0OiB0ZXN0cy5yZWdFeHAuYmluZChudWxsLCAvXltBLVowLTktXSskL2kpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAncGFzc3dvcmQnOiB7XHJcbiAgICAgICAgY2hlY2tzOiBbXHJcbiAgICAgICAgICAgIGNoZWNrcy5ub25FbXB0eSgpLFxyXG4gICAgICAgICAgICBjaGVja3MubWF4KDMwKSxcclxuICAgICAgICAgICAgY2hlY2tzLm1pbig1KSwge1xyXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiAnW3Byb3BlcnR5XSBpcyB0b28gd2VhaycsXHJcbiAgICAgICAgICAgICAgICB0ZXN0OiB0ZXN0cy5yZWdFeHAuYmluZChudWxsLCAvKD89LipcXGQpKD89LipbYS16XSkoPz0uKltBLVpdKS57Nix9LylcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICBdXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAncGFzc3dvcmQtYWdhaW4nOiB7XHJcbiAgICAgICAgY2hlY2tzOiBbXHJcbiAgICAgICAgICAgIGNoZWNrcy5ub25FbXB0eSgncmUtZW50ZXIgW3Byb3BlcnR5XScpLCB7XHJcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6ICdwYXNzd29yZHMgZG8gbm90IG1hdGNoJyxcclxuICAgICAgICAgICAgICAgIHRlc3Q6IGZ1bmN0aW9uKHZhbHVlLCBkYXRhQ2h1bmssIGRhdGEpIHtcclxuXHRcdFx0XHRcdGxldCBvcmlnaW5hbFBhc3MgPSBkYXRhQ2h1bmsucGFzc3dvcmQ7XHJcblx0XHRcdFx0XHRpZiAoIW9yaWdpbmFsUGFzcylcclxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdubyBvcmlnaW5hbCBwYXNzd29yZCByZWZlcmVuY2UnKTtcclxuXHJcblx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspXHJcblx0XHRcdFx0XHRcdGlmIChkYXRhW2ldLnByb3BlcnR5ID09PSBvcmlnaW5hbFBhc3MpXHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuICh2YWx1ZSA9PT0gZGF0YVtpXS52YWx1ZSk7XHJcblxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdubyBvcmdpbmFsIHBhc3N3b3JkIGRhdGEnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICBdXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAndXJsJzoge1xyXG4gICAgICAgIGNoZWNrczogW3tcclxuICAgICAgICAgICAgdGVzdDogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGxldCB1cmxSZWdleCA9ICdeKD8hbWFpbHRvOikoPzooPzpodHRwfGh0dHBzKTovLykoPzpcXFxcUysoPzo6XFxcXFMqKT9AKT8oPzooPzooPzpbMS05XVxcXFxkP3wxXFxcXGRcXFxcZHwyWzAxXVxcXFxkfDIyWzAtM10pKD86XFxcXC4oPzoxP1xcXFxkezEsMn18MlswLTRdXFxcXGR8MjVbMC01XSkpezJ9KD86XFxcXC4oPzpbMC05XVxcXFxkP3wxXFxcXGRcXFxcZHwyWzAtNF1cXFxcZHwyNVswLTRdKSl8KD86KD86W2EtelxcXFx1MDBhMS1cXFxcdWZmZmYwLTldKy0/KSpbYS16XFxcXHUwMGExLVxcXFx1ZmZmZjAtOV0rKSg/OlxcXFwuKD86W2EtelxcXFx1MDBhMS1cXFxcdWZmZmYwLTldKy0/KSpbYS16XFxcXHUwMGExLVxcXFx1ZmZmZjAtOV0rKSooPzpcXFxcLig/OlthLXpcXFxcdTAwYTEtXFxcXHVmZmZmXXsyLH0pKSl8bG9jYWxob3N0KSg/OjpcXFxcZHsyLDV9KT8oPzooL3xcXFxcP3wjKVteXFxcXHNdKik/JCc7XHJcbiAgICAgICAgICAgICAgICBsZXQgdXJsID0gbmV3IFJlZ0V4cCh1cmxSZWdleCwgJ2knKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5sZW5ndGggPCAyMDgzICYmIHVybC50ZXN0KHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1dXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAnZGVzY3JpcHRpb24nOiB7XHJcbiAgICAgICAgY2hlY2tzOiBbXHJcbiAgICAgICAgICAgIGNoZWNrcy5tYXgoMjU1KVxyXG4gICAgICAgIF1cclxuICAgIH0sXHJcblxyXG4gICAgJ2NvbW1lbnQnOiB7XHJcbiAgICAgICAgY2hlY2tzOiBbXHJcbiAgICAgICAgICAgIGNoZWNrcy5ub25FbXB0eSgpLFxyXG4gICAgICAgICAgICBjaGVja3MubWF4KDI1NSlcclxuICAgICAgICBdXHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRFcnJvckFycmF5KGRhdGEpIHtcclxuXHJcblx0aWYgKCFBcnJheS5pc0FycmF5KGRhdGEpKSB7XHJcblx0XHRsZXQgY29ycmVjdERhdGEgPSBbXTtcclxuXHRcdGZvciAobGV0IGtleSBpbiBkYXRhKSB7XHJcblx0XHRcdGNvcnJlY3REYXRhLnB1c2goe1xyXG5cdFx0XHRcdHByb3BlcnR5OiBrZXksXHJcblx0XHRcdFx0dmFsdWU6IGRhdGFba2V5XVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdGRhdGEgPSBjb3JyZWN0RGF0YTtcclxuXHR9XHJcblxyXG4gICAgbGV0IHJlc3VsdCA9IFtdO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG5cdFx0bGV0IGtleSA9IGRhdGFbaV0udmFsaWRhdG9yO1xyXG5cdFx0aWYgKCFrZXkpXHJcblx0XHRcdGtleSA9IGRhdGFbaV0ucHJvcGVydHk7XHJcblxyXG4gICAgICAgIGlmICghdmFsaWRhdG9yc1trZXldKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIHZhbGlkYXRvciBmb3IgdGhpcyBwcm9wZXJ0eTogJyArIGtleSk7XHJcblxyXG4gICAgICAgIHZhbGlkYXRvcnNba2V5XS5jaGVja3MuZm9yRWFjaChjaGVjayA9PiB7XHJcbiAgICAgICAgICAgIGlmICghY2hlY2sudGVzdChkYXRhW2ldLnZhbHVlLCBkYXRhW2ldLCBkYXRhKSlcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eTogZGF0YVtpXS5wcm9wZXJ0eSxcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjb21wdXRlRXJyb3JNZXNzYWdlKGNoZWNrLmVycm9yTWVzc2FnZSwgZGF0YVtpXS5hbGlhcyB8fCBkYXRhW2ldLnByb3BlcnR5IHx8IGtleSlcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRlc3RQcm9wZXJ0eShuYW1lLCB2YWx1ZSkge1xyXG4gICAgbGV0IHJlc3VsdCA9IHRydWU7XHJcbiAgICB2YWxpZGF0b3JzW25hbWVdLmNoZWNrcy5mb3JFYWNoKGNoZWNrID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFjaGVjay50ZXN0KHZhbHVlKSlcclxuICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgZ2V0RXJyb3JBcnJheSxcclxuICAgIHRlc3RQcm9wZXJ0eVxyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvY2hlY2tVc2VyRGF0YS5qcyIsImxldCBldmVudE1peGluID0gcmVxdWlyZShMSUJTICsgJ2V2ZW50TWl4aW4nKTtcclxubGV0IGdldEVycm9yQXJyYXkgPSByZXF1aXJlKExJQlMgKyAnY2hlY2tVc2VyRGF0YScpLmdldEVycm9yQXJyYXk7XHJcbmxldCBDbGllbnRFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5DbGllbnRFcnJvcjtcclxuXHJcbmxldCBGb3JtID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG4gICAgdGhpcy5lbGVtID0gb3B0aW9ucy5lbGVtO1xyXG4gICAgdGhpcy5maWVsZHMgPSBvcHRpb25zLmZpZWxkcztcclxuICAgIHRoaXMudXJsID0gb3B0aW9ucy51cmw7XHJcbiAgICB0aGlzLmlzQXZhaWxhYmxlID0gdHJ1ZTtcclxuXHJcbiAgICB0aGlzLnNhdmVCdXR0b24gPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLnNhdmUtYnV0dG9uJyk7XHJcblxyXG4gICAgdGhpcy5lbGVtLm9uY2xpY2sgPSBlID0+IHtcclxuICAgICAgICBpZiAoIXRoaXMuaXNBdmFpbGFibGUpIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKGUudGFyZ2V0ICE9PSB0aGlzLnNhdmVCdXR0b24pIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy5jbGVhckVycm9yQm94ZXMoKTtcclxuICAgICAgICBsZXQgZXJyb3JzID0gdGhpcy5nZXRFcnJvcnMoKTtcclxuICAgICAgICBpZiAoZXJyb3JzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgdGhpcy5zZW5kKHRoaXMuZ2V0Qm9keSgpKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuc2V0RXJyb3JzKGVycm9ycyk7XHJcbiAgICB9O1xyXG59O1xyXG5cclxuRm9ybS5wcm90b3R5cGUuc2V0UHJvcGVydHlFcnJvciA9IGZ1bmN0aW9uKHByb3BlcnR5LCBtZXNzYWdlKSB7XHJcbiAgICB0aGlzLmdldEVycm9yQm94KHByb3BlcnR5KS50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XHJcbn07XHJcblxyXG5Gb3JtLnByb3RvdHlwZS5nZXRFcnJvckJveCA9IGZ1bmN0aW9uKGZpZWxkTmFtZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuZWxlbVtmaWVsZE5hbWVdLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignLnRleHRib3hfX2Vycm9yJyk7XHJcbn07XHJcblxyXG5Gb3JtLnByb3RvdHlwZS5zZXRBdmFpbGFibGUgPSBmdW5jdGlvbihpc0F2YWlsYWJsZSkge1xyXG4gICAgdGhpcy5pc0F2YWlsYWJsZSA9IGlzQXZhaWxhYmxlO1xyXG59O1xyXG5cclxuRm9ybS5wcm90b3R5cGUuZ2V0RGF0YU9iaiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IG9wdGlvbnMgPSBbXTtcclxuXHJcbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5maWVsZHMpIHtcclxuICAgICAgICBsZXQgY2h1bmsgPSB0aGlzLmZpZWxkc1trZXldO1xyXG4gICAgICAgIGlmICghY2h1bmsubm9WYWxpZGF0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmICghY2h1bmsucHJvcGVydHkpXHJcbiAgICAgICAgICAgICAgICBjaHVuay5wcm9wZXJ0eSA9IGtleTtcclxuICAgICAgICAgICAgY2h1bmsudmFsdWUgPSB0aGlzLmVsZW1ba2V5XS52YWx1ZTtcclxuICAgICAgICAgICAgb3B0aW9ucy5wdXNoKGNodW5rKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG9wdGlvbnM7XHJcbn07XHJcblxyXG5Gb3JtLnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24oYm9keSkge1xyXG4gICAgcmVxdWlyZShMSUJTICsgJ3NlbmRSZXF1ZXN0JykoYm9keSwgJ1BPU1QnLCB0aGlzLnVybCwgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBDbGllbnRFcnJvciAmJiBlcnIuZGV0YWlsKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRQcm9wZXJ0eUVycm9yKGVyci5kZXRhaWwucHJvcGVydHksIGVyci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy50cmlnZ2VyKCdmb3JtX3NlbnQnLCB7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcblxyXG5Gb3JtLnByb3RvdHlwZS5jbGVhckVycm9yQm94ZXMgPSBmdW5jdGlvbigpIHtcclxuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmZpZWxkcylcclxuICAgICAgICB0aGlzLmdldEVycm9yQm94KGtleSkudGV4dENvbnRlbnQgPSAnJztcclxufTtcclxuXHJcbkZvcm0ucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmNsZWFyRXJyb3JCb3hlcygpO1xyXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuZmllbGRzKVxyXG4gICAgICAgIHRoaXMuZWxlbVtrZXldLnZhbHVlID0gJyc7XHJcbn07XHJcblxyXG5Gb3JtLnByb3RvdHlwZS5nZXRFcnJvcnMgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBnZXRFcnJvckFycmF5KHRoaXMuZ2V0RGF0YU9iaigpKTtcclxufTtcclxuXHJcblxyXG5Gb3JtLnByb3RvdHlwZS5zZXRFcnJvcnMgPSBmdW5jdGlvbihlcnJvcnMpIHtcclxuICAgIHRoaXMuY2xlYXJFcnJvckJveGVzKCk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVycm9ycy5sZW5ndGg7IGkrKylcclxuICAgICAgICBpZiAodGhpcy5nZXRFcnJvckJveChlcnJvcnNbaV0ucHJvcGVydHkpLnRleHRDb250ZW50ID09ICcnKVxyXG4gICAgICAgICAgICB0aGlzLnNldFByb3BlcnR5RXJyb3IoZXJyb3JzW2ldLnByb3BlcnR5LCBlcnJvcnNbaV0ubWVzc2FnZSk7XHJcbn07XHJcblxyXG5Gb3JtLnByb3RvdHlwZS5nZXRCb2R5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgYm9keSA9ICcnO1xyXG5cclxuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmZpZWxkcylcclxuICAgICAgICBpZiAoIXRoaXMuZmllbGRzW2tleV0uZXh0cmEpXHJcbiAgICAgICAgICAgIGJvZHkgKz0gKGJvZHkgPT09ICcnID8gJycgOiAnJicpICtcclxuICAgICAgICAgICAga2V5ICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMuZWxlbVtrZXldLnZhbHVlKTtcclxuICAgIHJldHVybiBib2R5O1xyXG59O1xyXG5cclxuZm9yIChsZXQga2V5IGluIGV2ZW50TWl4aW4pIHtcclxuICAgIEZvcm0ucHJvdG90eXBlW2tleV0gPSBldmVudE1peGluW2tleV07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRm9ybTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9mb3JtL2luZGV4LmpzIiwibGV0IFNlcnZlckVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLlNlcnZlckVycm9yO1xyXG5sZXQgQ2xpZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ2xpZW50RXJyb3I7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChib2R5T2JqLCBtZXRob2QsIHVybCwgY2IpIHtcclxuXHJcblxyXG4gICAgbGV0IGJvZHkgPSAnJztcclxuICAgIGlmICghKHR5cGVvZiBib2R5T2JqID09PSAnc3RyaW5nJykpIHtcclxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gYm9keU9iaikge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSAnJztcclxuICAgICAgICAgICAgaWYgKGJvZHlPYmpba2V5XSlcclxuICAgICAgICAgICAgICAgIHZhbHVlID0ga2V5ICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KCh0eXBlb2YgYm9keU9ialtrZXldID09PSAnb2JqZWN0JykgPyBKU09OLnN0cmluZ2lmeShib2R5T2JqW2tleV0pIDogYm9keU9ialtrZXldKTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgYm9keSArPSAoYm9keSA9PT0gJycgPyAnJyA6ICcmJykgKyB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2VcclxuICAgICAgICBib2R5ID0gYm9keU9iajtcclxuXHJcblxyXG4gICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgeGhyLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xyXG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcclxuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiWC1SZXF1ZXN0ZWQtV2l0aFwiLCBcIlhNTEh0dHBSZXF1ZXN0XCIpO1xyXG5cclxuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSAhPSA0KSByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCByZXNwb25zZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucmVzcG9uc2VUZXh0KVxyXG4gICAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjYihuZXcgU2VydmVyRXJyb3IoJ1NlcnZlciBpcyBub3QgcmVzcG9uZGluZycpKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMClcclxuICAgICAgICAgICAgY2IobnVsbCwgcmVzcG9uc2UpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPj0gNDAwICYmIHRoaXMuc3RhdHVzIDwgNTAwKVxyXG4gICAgICAgICAgICBjYihuZXcgQ2xpZW50RXJyb3IocmVzcG9uc2UubWVzc2FnZSwgcmVzcG9uc2UuZGV0YWlsLCB0aGlzLnN0YXR1cykpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPj0gNTAwKVxyXG4gICAgICAgICAgICBjYihuZXcgU2VydmVyRXJyb3IocmVzcG9uc2UubWVzc2FnZSwgdGhpcy5zdGF0dXMpKTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc29sZS5sb2coYHNlbmRpbmcgbmV4dCByZXF1ZXN0OiAke2JvZHl9YCk7XHJcbiAgICB4aHIuc2VuZChib2R5KTtcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL3NlbmRSZXF1ZXN0LmpzIiwibGV0IERyb3Bkb3duID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICB0aGlzLmVsZW0gPSBvcHRpb25zLmVsZW07XHJcbiAgICB0aGlzLml0ZW1MaXN0ID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5kcm9wZG93bl9faXRlbS1saXN0Jyk7XHJcbiAgICB0aGlzLmNsYXNzTmFtZSA9IG9wdGlvbnMuY2xhc3NOYW1lO1xyXG5cclxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XHJcblxyXG4gICAgLy8gdGhpcy5lbGVtLm9uY2xpY2sgPSBlID0+IHtcclxuICAgIC8vICAgICB0aGlzLnRvZ2dsZSgpO1xyXG4gICAgLy8gfTtcclxuXHJcbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5pdGVtTGlzdC5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZWxlbS5jb250YWlucyhlLnRhcmdldCkpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZSgpO1xyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmFjdGl2ZSlcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LCBmYWxzZSk7XHJcblxyXG5cclxuICAgIHRoaXMuQUVIYW5kbGVyID0gdGhpcy5BRUhhbmRsZXIuYmluZCh0aGlzKTtcclxuXHJcbn07XHJcblxyXG5Ecm9wZG93bi5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdkcm9wZG93bl9pbnZpc2libGUnKTtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKGAke3RoaXMuY2xhc3NOYW1lfV9hY3RpdmVgKTtcclxuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcclxufTtcclxuXHJcbkRyb3Bkb3duLnByb3RvdHlwZS5kZWFjdGl2YXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5pdGVtTGlzdC5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCB0aGlzLkFFSGFuZGxlciwgZmFsc2UpO1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ2Ryb3Bkb3duX2ZhZGluZy1vdXQnKTtcclxufTtcclxuXHJcbkRyb3Bkb3duLnByb3RvdHlwZS5BRUhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnZHJvcGRvd25fZmFkaW5nLW91dCcpO1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ2Ryb3Bkb3duX2ludmlzaWJsZScpO1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoYCR7dGhpcy5jbGFzc05hbWV9X2FjdGl2ZWApO1xyXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuICAgIHRoaXMuaXRlbUxpc3QucmVtb3ZlRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgdGhpcy5BRUhhbmRsZXIpO1xyXG59O1xyXG5cclxuRHJvcGRvd24ucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLmFjdGl2ZSlcclxuICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcclxuICAgIGVsc2VcclxuICAgICAgICB0aGlzLnNob3coKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRHJvcGRvd247XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9kcm9wZG93bi9pbmRleC5qcyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zZXR0aW5ncy9zdHlsZS5sZXNzXG4vLyBtb2R1bGUgaWQgPSA0NFxuLy8gbW9kdWxlIGNodW5rcyA9IDkiLCJsZXQgZXZlbnRNaXhpbiA9IHJlcXVpcmUoTElCUyArICdldmVudE1peGluJyk7XHJcbmxldCBTb2NpYWxDb2xsZWN0aW9uID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cclxuICAgIHRoaXMuZWxlbSA9IG9wdGlvbnMuZWxlbTtcclxuICAgIHRoaXMuc29jaWFsTGlzdCA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuc29jaWFsLWNvbGxlY3Rpb25fX3NvY2lhbC1saXN0Jyk7XHJcbiAgICB0aGlzLnRleHRib3ggPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLnRleHRib3hfX2ZpZWxkJyk7XHJcblxyXG4gICAgdGhpcy5lbGVtLm9uY2xpY2sgPSBlID0+IHtcclxuXHJcbiAgICAgICAgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoJy50ZXh0Ym94LWJ1dHRvbl9fYnV0dG9uJykgJiYgdGhpcy50ZXh0Ym94LnZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZFNvY2lhbCh0aGlzLnRleHRib3gudmFsdWUpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZS50YXJnZXQubWF0Y2hlcygnLnNvY2lhbF9fY2xvc2UnKSlcclxuICAgICAgICAgICAgdGhpcy5kZWxldGVTb2NpYWwoZS50YXJnZXQuY2xvc2VzdCgnLnNvY2lhbCcpKTtcclxuICAgIH07XHJcbn07XHJcblxyXG4vL1RPRE8gbWFrZSBjaGVja2luZyB1c2VyJ3MgZGF0YSBvbiBjbGllbnQgc2lkZVxyXG5cclxuU29jaWFsQ29sbGVjdGlvbi5wcm90b3R5cGUuc2VuZFNvY2lhbCA9IGZ1bmN0aW9uKGxpbmspIHtcclxuICAgIHJlcXVpcmUoTElCUyArICdzZW5kUmVxdWVzdCcpKHtcclxuICAgICAgICBsaW5rXHJcbiAgICB9LCAnUE9TVCcsICcvc2V0dGluZ3MnLCAoZXJyLCByZXNwb25zZSkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbnNlcnROZXdTb2NpYWwocmVzcG9uc2UubGlua09iaik7XHJcbiAgICAgICAgdGhpcy50ZXh0Ym94LnZhbHVlID0gJyc7XHJcbiAgICB9KTtcclxuXHJcbn07XHJcblxyXG5Tb2NpYWxDb2xsZWN0aW9uLnByb3RvdHlwZS5kZWxldGVTb2NpYWwgPSBmdW5jdGlvbihzb2NpYWwpIHtcclxuICAgIHJlcXVpcmUoTElCUyArICdzZW5kUmVxdWVzdCcpKHtcclxuICAgICAgICBsaW5rOiBzb2NpYWwuZGF0YXNldC5saW5rXHJcbiAgICB9LCAnREVMRVRFJywgJy9zZXR0aW5ncycsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcblxyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzb2NpYWwucmVtb3ZlKCk7XHJcbiAgICB9KTtcclxuXHJcbn07XHJcblxyXG5Tb2NpYWxDb2xsZWN0aW9uLnByb3RvdHlwZS5pbnNlcnROZXdTb2NpYWwgPSBmdW5jdGlvbihsaW5rT2JqKSB7XHJcbiAgICBsZXQgc29jaWFsID0gcmVxdWlyZShMSUJTICsgJ3JlbmRlckVsZW1lbnQnKShyZXF1aXJlKCdodG1sLWxvYWRlciEuL3NvY2lhbCcpKTtcclxuICAgIHNvY2lhbC5kYXRhc2V0LmxpbmsgPSBsaW5rT2JqLmhyZWY7XHJcbiAgICBzb2NpYWwucXVlcnlTZWxlY3RvcignLnNvY2lhbF9fbGluaycpLnNldEF0dHJpYnV0ZSgnaHJlZicsIGxpbmtPYmouaHJlZik7XHJcbiAgICBzb2NpYWwucXVlcnlTZWxlY3RvcignLnNvY2lhbF9faG9zdCcpLnRleHRDb250ZW50ID0gbGlua09iai5ob3N0O1xyXG4gICAgdGhpcy5zb2NpYWxMaXN0LmFwcGVuZENoaWxkKHNvY2lhbCk7XHJcbn07XHJcblxyXG5mb3IgKGxldCBrZXkgaW4gZXZlbnRNaXhpbikge1xyXG4gICAgU29jaWFsQ29sbGVjdGlvbi5wcm90b3R5cGVba2V5XSA9IGV2ZW50TWl4aW5ba2V5XTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTb2NpYWxDb2xsZWN0aW9uO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL3NvY2lhbC1jb2xsZWN0aW9uL2luZGV4LmpzIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtYXJrdXApIHtcclxuXHRsZXQgcGFyZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyk7XHJcblx0cGFyZW50LmlubmVySFRNTCA9IG1hcmt1cDsgXHJcblx0bGV0IGVsZW1lbnQgPSBwYXJlbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcblx0cmV0dXJuIGVsZW1lbnQ7XHJcbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL3JlbmRlckVsZW1lbnQuanMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBjbGFzcz1cXFwic29jaWFsLWNvbGxlY3Rpb25fX3NvY2lhbCBzb2NpYWxcXFwiIGRhdGEtbGluaz1cXFwiXFxcIj5cXHJcXG4gICAgPGEgY2xhc3M9XFxcInNvY2lhbF9fbGlua1xcXCIgaHJlZj1cXFwiXFxcIj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcInNvY2lhbF9faWNvbiBpY29uLXNwaGVyZVxcXCI+PC9kaXY+XFxyXFxuICAgICAgICA8c3BhbiBjbGFzcz1cXFwic29jaWFsX19ob3N0XFxcIj48L3NwYW4+XFxyXFxuICAgIDwvYT5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwic29jaWFsX19jbG9zZSBpY29uLWNyb3NzXFxcIj48L2Rpdj5cXHJcXG48L2Rpdj5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svfi9odG1sLWxvYWRlciEuLi9ibG9ja3Mvc29jaWFsLWNvbGxlY3Rpb24vc29jaWFsXG4vLyBtb2R1bGUgaWQgPSA0OFxuLy8gbW9kdWxlIGNodW5rcyA9IDkiLCJsZXQgZXZlbnRNaXhpbiA9IHJlcXVpcmUoTElCUyArICdldmVudE1peGluJyk7XHJcbmxldCBGaWxlUGlja2VyID0gcmVxdWlyZShCTE9DS1MgKyAnZmlsZS1waWNrZXInKTtcclxuXHJcbmxldCBDbGllbnRFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5DbGllbnRFcnJvcjtcclxuXHJcbmxldCBVcGxvYWRBdmF0YXJTZWN0aW9uID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuZWxlbSA9IG9wdGlvbnMuZWxlbTtcclxuICAgIHRoaXMudXBsb2FkQnV0dG9uID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy51cGxvYWQtYXZhdGFyLXNlY3Rpb25fX3VwbG9hZC1idXR0b24nKTtcclxuICAgIHRoaXMuZGVsZXRlQnV0dG9uID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy51cGxvYWQtYXZhdGFyLXNlY3Rpb25fX2RlbGV0ZS1idXR0b24nKTtcclxuICAgIHRoaXMuZmlsZVBpY2tlciA9IG5ldyBGaWxlUGlja2VyKHtcclxuICAgICAgICBlbGVtOiB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmZpbGUtcGlja2VyJylcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuYXZhdGFyID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy51cGxvYWQtYXZhdGFyLXNlY3Rpb25fX2F2YXRhcicpO1xyXG5cclxuICAgIHRoaXMuZWxlbS5vbmNsaWNrID0gZSA9PiB7XHJcblxyXG4gICAgICAgIGlmIChlLnRhcmdldCA9PT0gdGhpcy51cGxvYWRCdXR0b24pIHtcclxuICAgICAgICAgICAgbGV0IGZpbGUgPSB0aGlzLmZpbGVQaWNrZXIuZ2V0RmlsZSgpO1xyXG4gICAgICAgICAgICBpZiAoZmlsZSlcclxuICAgICAgICAgICAgICAgIHRoaXMudXBsb2FkQXZhdGFyKGZpbGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGUudGFyZ2V0ID09PSB0aGlzLmRlbGV0ZUJ1dHRvbilcclxuICAgICAgICAgICAgdGhpcy5kZWxldGVBdmF0YXIoKTtcclxuICAgIH1cclxuXHJcbn07XHJcblxyXG5cclxuVXBsb2FkQXZhdGFyU2VjdGlvbi5wcm90b3R5cGUuZGVsZXRlQXZhdGFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmVxdWlyZShMSUJTICsgJ3NlbmRSZXF1ZXN0JykobnVsbCwgJ0RFTEVURScsICcvYXZhdGFyJywgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmF2YXRhci5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCcke0FOT05fQVZBVEFSX1VSTH0nKWA7XHJcbiAgICB9KTtcclxufTtcclxuXHJcblVwbG9hZEF2YXRhclNlY3Rpb24ucHJvdG90eXBlLnVwbG9hZEF2YXRhciA9IGZ1bmN0aW9uIChmaWxlKSB7XHJcbiAgICBsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgIGZvcm1EYXRhLmFwcGVuZChcImF2YXRhclwiLCBmaWxlKTtcclxuXHJcbiAgICByZXF1aXJlKExJQlMgKyAnc2VuZEZvcm1EYXRhJykoXCIvYXZhdGFyXCIsIGZvcm1EYXRhLCAoZXJyLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYXZhdGFyLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJyR7cmVzcG9uc2UudXJsfT8ke25ldyBEYXRlKCkuZ2V0VGltZSgpfScpYDtcclxuXHJcbiAgICB9KTtcclxufTtcclxuXHJcbmZvciAobGV0IGtleSBpbiBldmVudE1peGluKSB7XHJcbiAgICBVcGxvYWRBdmF0YXJTZWN0aW9uLnByb3RvdHlwZVtrZXldID0gZXZlbnRNaXhpbltrZXldO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFVwbG9hZEF2YXRhclNlY3Rpb247XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy91cGxvYWQtYXZhdGFyLXNlY3Rpb24vaW5kZXguanMiLCJjb25zdCBERUZBVUxUX1ZBTFVFID0gJ25vIGZpbGUgY2hvc2VuJztcclxuY29uc3QgREVGQVVMVF9GTl9MRU5HVEggPSBERUZBVUxUX1ZBTFVFLmxlbmd0aDtcclxuXHJcbmxldCBGaWxlUGlja2VyID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICB0aGlzLmZpbGVOYW1lTGVuZ3RoID0gb3B0aW9ucy5maWxlTmFtZUxlbmd0aCB8fCBERUZBVUxUX0ZOX0xFTkdUSDtcclxuXHJcbiAgICB0aGlzLnVwbG9hZElucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICAgIHRoaXMudXBsb2FkSW5wdXQudHlwZSA9IFwiZmlsZVwiO1xyXG4gICAgdGhpcy51cGxvYWRJbnB1dC5hY2NlcHQgPSBcImltYWdlLypcIjtcclxuXHJcbiAgICB0aGlzLmVsZW0gPSBvcHRpb25zLmVsZW07XHJcbiAgICB0aGlzLmZwQnV0dG9uID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5maWxlLXBpY2tlcl9fYnV0dG9uJyk7XHJcbiAgICB0aGlzLmZwRmlsZU5hbWUgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmZpbGUtcGlja2VyX19maWxlbmFtZScpO1xyXG5cclxuICAgIHRoaXMuZnBCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgICAgICB0aGlzLnVwbG9hZElucHV0LmNsaWNrKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnVwbG9hZElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGUgPT4ge1xyXG4gICAgICAgIHRoaXMuc2V0VmlzaWJsZUZpbGVOYW1lKCk7XHJcbiAgICB9KTtcclxuXHJcbn07XHJcblxyXG5GaWxlUGlja2VyLnByb3RvdHlwZS5zZXRWaXNpYmxlRmlsZU5hbWUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgZmlsZW5hbWUgPSB0aGlzLnVwbG9hZElucHV0LnZhbHVlLnN1YnN0cmluZyh0aGlzLnVwbG9hZElucHV0LnZhbHVlLmxhc3RJbmRleE9mKCdcXFxcJykgKyAxKTtcclxuXHJcbiAgICBsZXQgdmlzaWJsZUZpbGVOYW1lO1xyXG4gICAgbGV0IHBhcnRTaXplID0gfn4oKHRoaXMuZmlsZU5hbWVMZW5ndGggLSAxKSAvIDIpO1xyXG5cclxuICAgIGlmIChmaWxlbmFtZS5sZW5ndGggPT09IDApXHJcbiAgICAgICAgdmlzaWJsZUZpbGVOYW1lID0gREVGQVVMVF9WQUxVRTtcclxuICAgIGVsc2UgaWYgKGZpbGVuYW1lLmxlbmd0aCA8PSB0aGlzLmZpbGVOYW1lTGVuZ3RoKSB7XHJcbiAgICAgICAgdGhpcy5mcEZpbGVOYW1lLnRpdGxlID0gJyc7XHJcbiAgICAgICAgdmlzaWJsZUZpbGVOYW1lID0gZmlsZW5hbWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuZnBGaWxlTmFtZS50aXRsZSA9IGZpbGVuYW1lO1xyXG4gICAgICAgIHZpc2libGVGaWxlTmFtZSA9IGZpbGVuYW1lLnNsaWNlKDAsIHBhcnRTaXplKSArICfigKYnICsgZmlsZW5hbWUuc2xpY2UoLXBhcnRTaXplKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmZwRmlsZU5hbWUudGV4dENvbnRlbnQgPSB2aXNpYmxlRmlsZU5hbWU7XHJcbn07XHJcblxyXG5GaWxlUGlja2VyLnByb3RvdHlwZS5nZXRGaWxlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudXBsb2FkSW5wdXQuZmlsZXNbMF07XHJcbn07XHJcblxyXG5GaWxlUGlja2VyLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMudXBsb2FkSW5wdXQudmFsdWUgPSAnJztcclxuICAgIHRoaXMuZnBGaWxlTmFtZS50ZXh0Q29udGVudCA9IERFRkFVTFRfVkFMVUU7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZpbGVQaWNrZXI7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvZmlsZS1waWNrZXIvaW5kZXguanMiLCJsZXQgU2VydmVyRXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuU2VydmVyRXJyb3I7XHJcbmxldCBDbGllbnRFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5DbGllbnRFcnJvcjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXJsLCBmb3JtRGF0YSwgY2IpIHtcclxuXHR2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0eGhyLnVwbG9hZC5vbnByb2dyZXNzID0gZXZlbnQgPT4ge1xyXG5cdFx0Ly9jb25zb2xlLmxvZyhldmVudC5sb2FkZWQgKyAnIC8gJyArIGV2ZW50LnRvdGFsKTtcclxuXHR9O1xyXG5cclxuXHR4aHIub25sb2FkID0geGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcclxuXHRcdGxldCByZXNwb25zZTtcclxuXHJcblx0XHRpZiAodGhpcy5yZXNwb25zZVRleHQpXHJcblx0XHRcdHJlc3BvbnNlID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlVGV4dCk7XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y2IobmV3IFNlcnZlckVycm9yKCdTZXJ2ZXIgaXMgbm90IHJlc3BvbmRpbmcnKSk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0aWYgKHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMClcclxuICAgICAgICAgICAgY2IobnVsbCwgcmVzcG9uc2UpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPj0gNDAwICYmIHRoaXMuc3RhdHVzIDwgNTAwKVxyXG4gICAgICAgICAgICBjYihuZXcgQ2xpZW50RXJyb3IocmVzcG9uc2UubWVzc2FnZSkpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPj0gNTAwKVxyXG4gICAgICAgICAgICBjYihuZXcgU2VydmVyRXJyb3IocmVzcG9uc2UubWVzc2FnZSkpO1xyXG5cdFx0XHJcblx0fTtcclxuXHJcblx0eGhyLm9wZW4oXCJQT1NUXCIsIHVybCwgdHJ1ZSk7XHJcblx0eGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtUmVxdWVzdGVkLVdpdGgnLCAnWE1MSHR0cFJlcXVlc3QnKTtcclxuXHR4aHIuc2VuZChmb3JtRGF0YSk7XHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9zZW5kRm9ybURhdGEuanMiLCJsZXQgZXZlbnRNaXhpbiA9IHJlcXVpcmUoTElCUyArICdldmVudE1peGluJyk7XHJcbmxldCBDbGllbnRFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5DbGllbnRFcnJvcjtcclxubGV0IE1lc3NhZ2VNb2RhbFdpbmRvdyA9IHJlcXVpcmUoQkxPQ0tTICsgJ21lc3NhZ2UtbW9kYWwtd2luZG93Jyk7XHJcblxyXG5cclxubGV0IERlc2NyaXB0aW9uQWRkU2VjdGlvbiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLmVsZW0gPSBvcHRpb25zLmVsZW07XHJcbiAgICB0aGlzLnNhdmVCdXR0b24gPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmJ1dHRvbicpO1xyXG4gICAgdGhpcy50ZXh0YXJlYSA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcudGV4dGFyZWEgdGV4dGFyZWEnKTtcclxuXHJcbiAgICB0aGlzLmVsZW0ub25jbGljayA9IGUgPT4ge1xyXG4gICAgICAgIGlmIChlLnRhcmdldCAhPT0gdGhpcy5zYXZlQnV0dG9uKSByZXR1cm47XHJcbiAgICAgICAgbGV0IGRlc2NyaXB0aW9uID0gdGhpcy50ZXh0YXJlYS52YWx1ZTtcclxuICAgICAgICBsZXQgZXJyb3JzID0gcmVxdWlyZShMSUJTICsgJ2NoZWNrVXNlckRhdGEnKS5nZXRFcnJvckFycmF5KHtcclxuICAgICAgICAgICAgZGVzY3JpcHRpb25cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKGVycm9ycy5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIHRoaXMuc2VuZERlc2NyaXB0aW9uKHRoaXMudGV4dGFyZWEudmFsdWUpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5lcnJvcihuZXcgQ2xpZW50RXJyb3IoZXJyb3JzWzBdLm1lc3NhZ2UpKTtcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuRGVzY3JpcHRpb25BZGRTZWN0aW9uLnByb3RvdHlwZS5zZW5kRGVzY3JpcHRpb24gPSBmdW5jdGlvbiAoZGVzY3JpcHRpb24pIHtcclxuICAgIHJlcXVpcmUoTElCUyArICdzZW5kUmVxdWVzdCcpKHtcclxuICAgICAgICBkZXNjcmlwdGlvblxyXG4gICAgfSwgJ1BPU1QnLCAnL3NldHRpbmdzJywgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG1lc3NhZ2VNb2RhbFdpbmRvdyA9IG5ldyBNZXNzYWdlTW9kYWxXaW5kb3coe21lc3NhZ2U6ICdEZXNjcmlwdGlvbiBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgY2hhbmdlZCd9KTtcclxuICAgICAgICBtZXNzYWdlTW9kYWxXaW5kb3cuc2hvdygpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5mb3IgKGxldCBrZXkgaW4gZXZlbnRNaXhpbikge1xyXG4gICAgRGVzY3JpcHRpb25BZGRTZWN0aW9uLnByb3RvdHlwZVtrZXldID0gZXZlbnRNaXhpbltrZXldO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERlc2NyaXB0aW9uQWRkU2VjdGlvbjtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9kZXNjcmlwdGlvbi1hZGQtc2VjdGlvbi9pbmRleC5qcyJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekRBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTs7O0FBRUE7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBR0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTs7Ozs7Ozs7QUN0UUE7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ2JBOzs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQWRBO0FBQUE7QUFlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUMxTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUMvQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyREE7Ozs7Ozs7OztBQ0FBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDSkE7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDekRBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUVBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OyIsInNvdXJjZVJvb3QiOiIifQ==