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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDRlNTUyYWFhNzJjZWQzNThjZjU/OWJiMyoqKiIsIndlYnBhY2s6Ly8vLi9zZXR0aW5ncy9zY3JpcHQuanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9nbG9iYWwtZXJyb3ItaGFuZGxlci9pbmRleC5qcz9iMDE2KioqIiwid2VicGFjazovLy9EOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9jb21wb25lbnRFcnJvcnMuanM/YWNiNSoqIiwid2VicGFjazovLy8uLi9ibG9ja3MvbWVzc2FnZS1tb2RhbC13aW5kb3cvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9tb2RhbC9pbmRleC5qcz85YzQ2KiIsIndlYnBhY2s6Ly8vRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvZXZlbnRNaXhpbi5qcz8zY2JjKioiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9zcGlubmVyL2luZGV4LmpzPzA0OTIqIiwid2VicGFjazovLy8uLi9ibG9ja3Mvc3Bpbm5lci9tYXJrdXA/NDdkNyoiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9tZXNzYWdlLW1vZGFsLXdpbmRvdy93aW5kb3ciLCJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2NoZWNrVXNlckRhdGEuanM/ZmYyMCIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2Zvcm0vaW5kZXguanM/MGFlMiIsIndlYnBhY2s6Ly8vRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvc2VuZFJlcXVlc3QuanM/OGEyNyoqIiwid2VicGFjazovLy8uLi9ibG9ja3MvZHJvcGRvd24vaW5kZXguanM/NWUyOSIsIndlYnBhY2s6Ly8vLi9zZXR0aW5ncy9zdHlsZS5sZXNzIiwid2VicGFjazovLy8uLi9ibG9ja3Mvc29jaWFsLWNvbGxlY3Rpb24vaW5kZXguanMiLCJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL3JlbmRlckVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9zb2NpYWwtY29sbGVjdGlvbi9zb2NpYWwiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy91cGxvYWQtYXZhdGFyLXNlY3Rpb24vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9maWxlLXBpY2tlci9pbmRleC5qcyIsIndlYnBhY2s6Ly8vRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvc2VuZEZvcm1EYXRhLmpzIiwid2VicGFjazovLy8uLi9ibG9ja3MvZGVzY3JpcHRpb24tYWRkLXNlY3Rpb24vaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG4gXHR2YXIgcGFyZW50SnNvbnBGdW5jdGlvbiA9IHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXTtcbiBcdHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXSA9IGZ1bmN0aW9uIHdlYnBhY2tKc29ucENhbGxiYWNrKGNodW5rSWRzLCBtb3JlTW9kdWxlcykge1xuIFx0XHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcbiBcdFx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG4gXHRcdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDAsIGNhbGxiYWNrcyA9IFtdO1xuIFx0XHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcbiBcdFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pXG4gXHRcdFx0XHRjYWxsYmFja3MucHVzaC5hcHBseShjYWxsYmFja3MsIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSk7XG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcbiBcdFx0fVxuIFx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGlmKHBhcmVudEpzb25wRnVuY3Rpb24pIHBhcmVudEpzb25wRnVuY3Rpb24oY2h1bmtJZHMsIG1vcmVNb2R1bGVzKTtcbiBcdFx0d2hpbGUoY2FsbGJhY2tzLmxlbmd0aClcbiBcdFx0XHRjYWxsYmFja3Muc2hpZnQoKS5jYWxsKG51bGwsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHR9O1xuXG4gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuIFx0Ly8gXCIwXCIgbWVhbnMgXCJhbHJlYWR5IGxvYWRlZFwiXG4gXHQvLyBBcnJheSBtZWFucyBcImxvYWRpbmdcIiwgYXJyYXkgY29udGFpbnMgY2FsbGJhY2tzXG4gXHR2YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuIFx0XHQ5OjAsXG4gXHRcdDE6MFxuIFx0fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG4gXHQvLyBUaGlzIGZpbGUgY29udGFpbnMgb25seSB0aGUgZW50cnkgY2h1bmsuXG4gXHQvLyBUaGUgY2h1bmsgbG9hZGluZyBmdW5jdGlvbiBmb3IgYWRkaXRpb25hbCBjaHVua3NcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZSA9IGZ1bmN0aW9uIHJlcXVpcmVFbnN1cmUoY2h1bmtJZCwgY2FsbGJhY2spIHtcbiBcdFx0Ly8gXCIwXCIgaXMgdGhlIHNpZ25hbCBmb3IgXCJhbHJlYWR5IGxvYWRlZFwiXG4gXHRcdGlmKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMClcbiBcdFx0XHRyZXR1cm4gY2FsbGJhY2suY2FsbChudWxsLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBhbiBhcnJheSBtZWFucyBcImN1cnJlbnRseSBsb2FkaW5nXCIuXG4gXHRcdGlmKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSAhPT0gdW5kZWZpbmVkKSB7XG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdLnB1c2goY2FsbGJhY2spO1xuIFx0XHR9IGVsc2Uge1xuIFx0XHRcdC8vIHN0YXJ0IGNodW5rIGxvYWRpbmdcbiBcdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSBbY2FsbGJhY2tdO1xuIFx0XHRcdHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiBcdFx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gXHRcdFx0c2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcbiBcdFx0XHRzY3JpcHQuY2hhcnNldCA9ICd1dGYtOCc7XG4gXHRcdFx0c2NyaXB0LmFzeW5jID0gdHJ1ZTtcblxuIFx0XHRcdHNjcmlwdC5zcmMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgY2h1bmtJZCArIFwiLlwiICsgKHt9W2NodW5rSWRdfHxjaHVua0lkKSArIFwiLmpzXCI7XG4gXHRcdFx0aGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA0NGU1NTJhYWE3MmNlZDM1OGNmNSIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICcuL3N0eWxlLmxlc3MnO1xyXG5cclxubGV0IEdsb2JhbEVycm9ySGFuZGxlciA9IHJlcXVpcmUoQkxPQ0tTICsgJ2dsb2JhbC1lcnJvci1oYW5kbGVyJyk7XHJcbmxldCBnbG9iYWxFcnJvckhhbmRsZXIgPSBuZXcgR2xvYmFsRXJyb3JIYW5kbGVyKCk7XHJcblxyXG5sZXQgRHJvcGRvd24gPSByZXF1aXJlKEJMT0NLUyArICdkcm9wZG93bicpO1xyXG5sZXQgU29jaWFsQ29sbGVjdGlvbiA9IHJlcXVpcmUoQkxPQ0tTICsgJ3NvY2lhbC1jb2xsZWN0aW9uJyk7XHJcbmxldCBVcGxvYWRBdmF0YXJTZWN0aW9uID0gcmVxdWlyZShCTE9DS1MgKyAndXBsb2FkLWF2YXRhci1zZWN0aW9uJyk7XHJcbmxldCBEZXNjcmlwdGlvbkFkZFNlY3Rpb24gPSByZXF1aXJlKEJMT0NLUyArICdkZXNjcmlwdGlvbi1hZGQtc2VjdGlvbicpO1xyXG5sZXQgRm9ybSA9IHJlcXVpcmUoQkxPQ0tTICsgJ2Zvcm0nKTtcclxubGV0IE1lc3NhZ2VNb2RhbFdpbmRvdyA9IHJlcXVpcmUoQkxPQ0tTICsgJ21lc3NhZ2UtbW9kYWwtd2luZG93Jyk7XHJcblxyXG5sZXQgdXNlck1lbnVEcm9wZG93biA9IG5ldyBEcm9wZG93bih7XHJcbiAgICBlbGVtOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlci1tZW51JyksXHJcbiAgICBjbGFzc05hbWU6ICdoZWFkZXItZWxlbWVudCdcclxufSk7XHJcblxyXG5sZXQgc29jaWFsQ29sbGVjdGlvbiA9IG5ldyBTb2NpYWxDb2xsZWN0aW9uKHtcclxuICAgIGVsZW06IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzb2NpYWwtY29sbGVjdGlvbicpXHJcbn0pO1xyXG5cclxubGV0IHVwbG9hZEF2YXRhclNlY3Rpb24gPSBuZXcgVXBsb2FkQXZhdGFyU2VjdGlvbih7XHJcbiAgICBlbGVtOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXBsb2FkLWF2YXRhci1zZWN0aW9uJylcclxufSk7XHJcblxyXG5sZXQgZGVzY3JpcHRpb25BZGRTZWN0aW9uID0gbmV3IERlc2NyaXB0aW9uQWRkU2VjdGlvbih7XHJcbiAgICBlbGVtOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVzY3JpcHRpb24tYWRkLXNlY3Rpb24nKVxyXG59KTtcclxuXHJcbmxldCBwYXNzd29yZENoYW5nZUZvcm0gPSBuZXcgRm9ybSh7XHJcbiAgICBlbGVtOiBkb2N1bWVudC5mb3Jtc1snY2hhbmdlLXBhc3N3b3JkJ10sXHJcbiAgICBmaWVsZHM6IHtcclxuICAgICAgICAnb2xkLXBhc3N3b3JkJzoge1xyXG4gICAgICAgICAgICB2YWxpZGF0b3I6ICdub24tZW1wdHknLFxyXG4gICAgICAgICAgICBhbGlhczogJ29sZCBwYXNzd29yZCcsXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgJ25ldy1wYXNzd29yZCc6IHtcclxuICAgICAgICAgICAgdmFsaWRhdG9yOiAncGFzc3dvcmQnLFxyXG4gICAgICAgICAgICBhbGlhczogJ25ldyBwYXNzd29yZCcsXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgJ25ldy1hZ2Fpbic6IHtcclxuICAgICAgICAgICAgdmFsaWRhdG9yOiAncGFzc3dvcmQtYWdhaW4nLFxyXG4gICAgICAgICAgICBhbGlhczogJ25ldyBwYXNzd29yZCcsXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiAnbmV3LXBhc3N3b3JkJyxcclxuICAgICAgICAgICAgZXh0cmE6IHRydWVcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgdXJsOiAnL3NldHRpbmdzJ1xyXG59KTtcclxuXHJcbnBhc3N3b3JkQ2hhbmdlRm9ybS5vbignZm9ybV9zZW50JywgZSA9PiB7XHJcbiAgICBsZXQgbWVzc2FnZU1vZGFsV2luZG93ID0gbmV3IE1lc3NhZ2VNb2RhbFdpbmRvdyh7bWVzc2FnZTogJ1Bhc3N3b3JkIGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSBjaGFuZ2VkJ30pO1xyXG4gICAgbWVzc2FnZU1vZGFsV2luZG93LnNob3coKTtcclxufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2V0dGluZ3Mvc2NyaXB0LmpzIiwibGV0IEdsb2JhbEVycm9ySGFuZGxlciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGUgPT4ge1xyXG4gICAgICAgIGxldCBlcnJvciA9IGUuZGV0YWlsO1xyXG4gICAgICAgIHRoaXMuY2FsbChlcnJvcik7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbkdsb2JhbEVycm9ySGFuZGxlci5wcm90b3R5cGUuY2FsbCA9IGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgcmVxdWlyZS5lbnN1cmUoW0xJQlMgKyAnY29tcG9uZW50RXJyb3JzJywgQkxPQ0tTICsgJ21lc3NhZ2UtbW9kYWwtd2luZG93J10sIGZ1bmN0aW9uIChyZXF1aXJlKSB7XHJcbiAgICAgICAgbGV0IENvbXBvbmVudEVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLkNvbXBvbmVudEVycm9yO1xyXG4gICAgICAgIGxldCBNZXNzYWdlTW9kYWxXaW5kb3cgPSByZXF1aXJlKEJMT0NLUyArICdtZXNzYWdlLW1vZGFsLXdpbmRvdycpO1xyXG5cclxuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBDb21wb25lbnRFcnJvcikge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzID09PSA0MDEpIHtcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWRpcmVjdGVkX3VybCcsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9ICcvYXV0aG9yaXphdGlvbic7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWVzc2FnZU1vZGFsV2luZG93ID0gbmV3IE1lc3NhZ2VNb2RhbFdpbmRvdyh7bWVzc2FnZTogZXJyb3IubWVzc2FnZX0pO1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZU1vZGFsV2luZG93LmFjdGl2YXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdsb2JhbEVycm9ySGFuZGxlcjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL2dsb2JhbC1lcnJvci1oYW5kbGVyL2luZGV4LmpzIiwiZnVuY3Rpb24gQ3VzdG9tRXJyb3IobWVzc2FnZSkge1xyXG5cdHRoaXMubmFtZSA9IFwiQ3VzdG9tRXJyb3JcIjtcclxuXHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG5cclxuXHRpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpXHJcblx0XHRFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBDdXN0b21FcnJvcik7XHJcblx0ZWxzZVxyXG5cdFx0dGhpcy5zdGFjayA9IChuZXcgRXJyb3IoKSkuc3RhY2s7XHJcbn1cclxuQ3VzdG9tRXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpO1xyXG5DdXN0b21FcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDdXN0b21FcnJvcjtcclxuXHJcblxyXG5mdW5jdGlvbiBDb21wb25lbnRFcnJvcihtZXNzYWdlLCBzdGF0dXMpIHtcclxuXHRDdXN0b21FcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ0FuIGVycm9yIGhhcyBvY2N1cnJlZCcgKTtcclxuXHR0aGlzLm5hbWUgPSBcIkNvbXBvbmVudEVycm9yXCI7XHJcblx0dGhpcy5zdGF0dXMgPSBzdGF0dXM7XHJcbn1cclxuQ29tcG9uZW50RXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDdXN0b21FcnJvci5wcm90b3R5cGUpO1xyXG5Db21wb25lbnRFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDb21wb25lbnRFcnJvcjtcclxuXHJcbmZ1bmN0aW9uIENsaWVudEVycm9yKG1lc3NhZ2UsIGRldGFpbCwgc3RhdHVzKSB7XHJcblx0Q29tcG9uZW50RXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlIHx8ICdBbiBlcnJvciBoYXMgb2NjdXJyZWQuIENoZWNrIGlmIGphdmFzY3JpcHQgaXMgZW5hYmxlZCcsIHN0YXR1cyk7XHJcblx0dGhpcy5uYW1lID0gXCJDbGllbnRFcnJvclwiO1xyXG5cdHRoaXMuZGV0YWlsID0gZGV0YWlsO1xyXG59XHJcbkNsaWVudEVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29tcG9uZW50RXJyb3IucHJvdG90eXBlKTtcclxuQ2xpZW50RXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ2xpZW50RXJyb3I7XHJcblxyXG5cclxuZnVuY3Rpb24gSW1hZ2VOb3RGb3VuZChtZXNzYWdlKSB7XHJcbiAgICBDbGllbnRFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ0ltYWdlIG5vdCBmb3VuZC4gSXQgcHJvYmFibHkgaGFzIGJlZW4gcmVtb3ZlZCcsIG51bGwsIDQwNCk7XHJcbiAgICB0aGlzLm5hbWUgPSBcIkltYWdlTm90Rm91bmRcIjtcclxufVxyXG5JbWFnZU5vdEZvdW5kLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ2xpZW50RXJyb3IucHJvdG90eXBlKTtcclxuSW1hZ2VOb3RGb3VuZC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBJbWFnZU5vdEZvdW5kO1xyXG5cclxuZnVuY3Rpb24gU2VydmVyRXJyb3IobWVzc2FnZSwgc3RhdHVzKSB7XHJcblx0Q29tcG9uZW50RXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlIHx8ICdUaGVyZSBpcyBzb21lIGVycm9yIG9uIHRoZSBzZXJ2ZXIgc2lkZScsIHN0YXR1cyk7XHJcblx0dGhpcy5uYW1lID0gXCJTZXJ2ZXJFcnJvclwiO1xyXG59XHJcblNlcnZlckVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29tcG9uZW50RXJyb3IucHJvdG90eXBlKTtcclxuU2VydmVyRXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2VydmVyRXJyb3I7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRDb21wb25lbnRFcnJvcixcclxuXHRDbGllbnRFcnJvcixcclxuICAgIEltYWdlTm90Rm91bmQsXHJcblx0U2VydmVyRXJyb3JcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2NvbXBvbmVudEVycm9ycy5qcyIsImxldCBNb2RhbCA9IHJlcXVpcmUoQkxPQ0tTICsgJ21vZGFsJyk7XHJcblxyXG5sZXQgTWVzc2FnZU1vZGFsV2luZG93ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIE1vZGFsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICB0aGlzLmVsZW0gPSBudWxsO1xyXG4gICAgdGhpcy5lbGVtSWQgPSAnbWVzc2FnZS1tb2RhbC13aW5kb3cnO1xyXG4gICAgdGhpcy5jYXB0aW9uID0gb3B0aW9ucyAmJiBvcHRpb25zLmNhcHRpb24gfHwgJ21lc3NhZ2UnO1xyXG4gICAgdGhpcy5tZXNzYWdlID0gb3B0aW9ucyAmJiBvcHRpb25zLm1lc3NhZ2UgfHwgJ1lvdSB3ZXJlIG5vdCBzdXBwb3NlIHRvIHNlZSB0aGlzISBTZWVtcyBsaWtlIHNvbWV0aGluZyBpcyBicm9rZW4gOignO1xyXG5cclxufTtcclxuTWVzc2FnZU1vZGFsV2luZG93LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoTW9kYWwucHJvdG90eXBlKTtcclxuTWVzc2FnZU1vZGFsV2luZG93LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IE1lc3NhZ2VNb2RhbFdpbmRvdztcclxuXHJcbk1lc3NhZ2VNb2RhbFdpbmRvdy5wcm90b3R5cGUuc2V0RWxlbSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuc2V0V2luZG93SHRtbCgpO1xyXG4gICAgdGhpcy5lbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5lbGVtSWQpO1xyXG4gICAgaWYgKCF0aGlzLmVsZW0pXHJcbiAgICAgICAgdGhpcy5lbGVtID0gdGhpcy5yZW5kZXJXaW5kb3codGhpcy53aW5kb3dIdG1sKTtcclxuICAgIHRoaXMuc2V0TGlzdGVuZXJzKCk7XHJcbiAgICB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmhlYWRlcicpLnRleHRDb250ZW50ID0gdGhpcy5jYXB0aW9uO1xyXG4gICAgdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5tZXNzYWdlLW1vZGFsLXdpbmRvd19fbWVzc2FnZScpLnRleHRDb250ZW50ID0gdGhpcy5tZXNzYWdlO1xyXG5cclxuICAgIHRoaXMuZWxlbS5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgdGhpcy5vbkVsZW1DbGljayhlKTtcclxuICAgICAgICBpZiAoZS50YXJnZXQubWF0Y2hlcygnLm1lc3NhZ2UtbW9kYWwtd2luZG93X19vay1idXR0b24nKSlcclxuICAgICAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XHJcbiAgICB9O1xyXG59O1xyXG5cclxuTWVzc2FnZU1vZGFsV2luZG93LnByb3RvdHlwZS5zZXRXaW5kb3dIdG1sID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy53aW5kb3dIdG1sID0gcmVxdWlyZShgaHRtbC1sb2FkZXIhLi93aW5kb3dgKTtcclxufTtcclxuXHJcbk1lc3NhZ2VNb2RhbFdpbmRvdy5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIE1vZGFsLnByb3RvdHlwZS5zaG93LmFwcGx5KHRoaXMpO1xyXG5cclxuICAgIGlmICghdGhpcy5lbGVtKVxyXG4gICAgICAgIHRoaXMuc2V0RWxlbSgpO1xyXG5cclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3dfaW52aXNpYmxlJyk7XHJcbn07XHJcblxyXG5NZXNzYWdlTW9kYWxXaW5kb3cucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBNb2RhbC5wcm90b3R5cGUuaGlkZS5hcHBseSh0aGlzKTtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCd3aW5kb3dfaW52aXNpYmxlJyk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lc3NhZ2VNb2RhbFdpbmRvdztcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9tZXNzYWdlLW1vZGFsLXdpbmRvdy9pbmRleC5qcyIsImxldCBldmVudE1peGluID0gcmVxdWlyZShMSUJTICsgJ2V2ZW50TWl4aW4nKTtcclxubGV0IFNwaW5uZXIgPSByZXF1aXJlKEJMT0NLUyArICdzcGlubmVyJyk7XHJcblxyXG5sZXQgTW9kYWwgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuICAgIHRoaXMubGlzdGVuZXJzID0gW107XHJcbiAgICB0aGlzLnN0YXR1cyA9IG9wdGlvbnMgJiYgb3B0aW9ucy5zdGF0dXMgfHwgTW9kYWwuc3RhdHVzZXMuTUlOT1I7XHJcbn07XHJcblxyXG5Nb2RhbC5zdGF0dXNlcyA9IHtcclxuICAgIE1BSk9SOiAxLFxyXG4gICAgTUlOT1I6IDJcclxufTtcclxuXHJcbk1vZGFsLnByb3RvdHlwZS5vbkVsZW1DbGljayA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICBpZiAoZS50YXJnZXQubWF0Y2hlcygnLm1vZGFsLWNsb3NlLWJ1dHRvbicpKVxyXG4gICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xyXG59O1xyXG5cclxuTW9kYWwucHJvdG90eXBlLnNldExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMubGlzdGVuZXJzLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgdGhpcy5lbGVtLmFkZEV2ZW50TGlzdGVuZXIoaXRlbS5ldmVudE5hbWUsIGl0ZW0uY2IpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5Nb2RhbC5zZXRCYWNrZHJvcCA9IGZ1bmN0aW9uIChzdGF0dXMpIHtcclxuICAgIGlmIChzdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKSB7XHJcbiAgICAgICAgTW9kYWwubWlub3JCYWNrZHJvcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrZHJvcF9taW5vcicpO1xyXG4gICAgICAgIGlmICghTW9kYWwubWlub3JCYWNrZHJvcClcclxuICAgICAgICAgICAgTW9kYWwubWlub3JCYWNrZHJvcCA9IE1vZGFsLnJlbmRlckJhY2tkcm9wKCdtaW5vcicpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBNb2RhbC5tYWpvckJhY2tkcm9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tkcm9wX21ham9yJyk7XHJcbiAgICAgICAgaWYgKCFNb2RhbC5tYWpvckJhY2tkcm9wKVxyXG4gICAgICAgICAgICBNb2RhbC5tYWpvckJhY2tkcm9wID0gTW9kYWwucmVuZGVyQmFja2Ryb3AoJ21ham9yJyk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5Nb2RhbC5zZXRXcmFwcGVyID0gZnVuY3Rpb24gKHN0YXR1cykge1xyXG4gICAgaWYgKHN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpIHtcclxuICAgICAgICBNb2RhbC5taW5vcldyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtd3JhcHBlci1taW5vcicpO1xyXG4gICAgICAgIGlmICghTW9kYWwubWlub3JXcmFwcGVyKVxyXG4gICAgICAgICAgICBNb2RhbC5taW5vcldyYXBwZXIgPSBNb2RhbC5yZW5kZXJXcmFwcGVyKCdtaW5vcicpO1xyXG4gICAgICAgIE1vZGFsLm1pbm9yV3JhcHBlci5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldCAmJiAhZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2RhbC13cmFwcGVyX21pbm9yJykpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKE1vZGFsLm1pbm9yQWN0aXZlKVxyXG4gICAgICAgICAgICAgICAgTW9kYWwubWlub3JRdWV1ZVswXS5kZWFjdGl2YXRlKCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgTW9kYWwubWFqb3JXcmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLXdyYXBwZXItbWFqb3InKTtcclxuICAgICAgICBpZiAoIU1vZGFsLm1ham9yV3JhcHBlcilcclxuICAgICAgICAgICAgTW9kYWwubWFqb3JXcmFwcGVyID0gTW9kYWwucmVuZGVyV3JhcHBlcignbWFqb3InKTtcclxuICAgICAgICBNb2RhbC5tYWpvcldyYXBwZXIub25jbGljayA9IGUgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZS50YXJnZXQgJiYgIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbW9kYWwtd3JhcHBlcl9tYWpvcicpKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChNb2RhbC5tYWpvckFjdGl2ZSlcclxuICAgICAgICAgICAgICAgIE1vZGFsLm1ham9yUXVldWVbMF0uZGVhY3RpdmF0ZSgpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn07XHJcblxyXG5Nb2RhbC5yZW5kZXJCYWNrZHJvcCA9IGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICBsZXQgYmFja2Ryb3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKTtcclxuICAgIGJhY2tkcm9wLmNsYXNzTmFtZSA9ICdiYWNrZHJvcCBiYWNrZHJvcF9pbnZpc2libGUnO1xyXG4gICAgYmFja2Ryb3AuY2xhc3NMaXN0LmFkZChgYmFja2Ryb3BfJHt0eXBlfWApO1xyXG4gICAgYmFja2Ryb3AuaWQgPSBgYmFja2Ryb3AtJHt0eXBlfWA7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGJhY2tkcm9wKTtcclxuICAgIHJldHVybiBiYWNrZHJvcDtcclxufTtcclxuXHJcbk1vZGFsLnJlbmRlcldyYXBwZXIgPSBmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgbGV0IHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKTtcclxuICAgIHdyYXBwZXIuY2xhc3NOYW1lID0gJ21vZGFsLXdyYXBwZXIgbW9kYWwtd3JhcHBlcl9pbnZpc2libGUnO1xyXG4gICAgd3JhcHBlci5jbGFzc0xpc3QuYWRkKGBtb2RhbC13cmFwcGVyXyR7dHlwZX1gKTtcclxuICAgIHdyYXBwZXIuaWQgPSBgbW9kYWwtd3JhcHBlci0ke3R5cGV9YDtcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQod3JhcHBlcik7XHJcbiAgICByZXR1cm4gd3JhcHBlcjtcclxufTtcclxuXHJcbk1vZGFsLnByb3RvdHlwZS5yZW5kZXJXaW5kb3cgPSBmdW5jdGlvbiAoaHRtbCkge1xyXG5cclxuICAgIGxldCBwYXJlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKTtcclxuICAgIHBhcmVudC5pbm5lckhUTUwgPSBodG1sO1xyXG4gICAgbGV0IHduZCA9IHBhcmVudC5maXJzdEVsZW1lbnRDaGlsZDtcclxuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpXHJcbiAgICAgICAgTW9kYWwubWlub3JXcmFwcGVyLmFwcGVuZENoaWxkKHduZCk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgTW9kYWwubWFqb3JXcmFwcGVyLmFwcGVuZENoaWxkKHduZCk7XHJcblxyXG4gICAgcGFyZW50LnJlbW92ZSgpO1xyXG4gICAgcmV0dXJuIHduZDtcclxufTtcclxuXHJcbk1vZGFsLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUikge1xyXG4gICAgICAgIGlmICghTW9kYWwubWlub3JCYWNrZHJvcClcclxuICAgICAgICAgICAgTW9kYWwuc2V0QmFja2Ryb3AoTW9kYWwuc3RhdHVzZXMuTUlOT1IpO1xyXG5cclxuICAgICAgICBpZiAoIU1vZGFsLm1pbm9yV3JhcHBlcilcclxuICAgICAgICAgICAgTW9kYWwuc2V0V3JhcHBlcihNb2RhbC5zdGF0dXNlcy5NSU5PUik7XHJcblxyXG4gICAgICAgIE1vZGFsLm1pbm9yV3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC13cmFwcGVyX2ludmlzaWJsZScpO1xyXG4gICAgICAgIE1vZGFsLm1pbm9yQmFja2Ryb3AuY2xhc3NMaXN0LnJlbW92ZSgnYmFja2Ryb3BfaW52aXNpYmxlJyk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoIU1vZGFsLm1ham9yQmFja2Ryb3ApXHJcbiAgICAgICAgICAgIE1vZGFsLnNldEJhY2tkcm9wKE1vZGFsLnN0YXR1c2VzLk1BSk9SKTtcclxuXHJcbiAgICAgICAgaWYgKCFNb2RhbC5tYWpvcldyYXBwZXIpXHJcbiAgICAgICAgICAgIE1vZGFsLnNldFdyYXBwZXIoTW9kYWwuc3RhdHVzZXMuTUFKT1IpO1xyXG5cclxuICAgICAgICBNb2RhbC5tYWpvcldyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtd3JhcHBlcl9pbnZpc2libGUnKTtcclxuICAgICAgICBNb2RhbC5tYWpvckJhY2tkcm9wLmNsYXNzTGlzdC5yZW1vdmUoJ2JhY2tkcm9wX2ludmlzaWJsZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcclxuXHJcbn07XHJcblxyXG5cclxuTW9kYWwucHJvdG90eXBlLmFjdGl2YXRlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICBpZiAodGhpcy5lbGVtSWQgPT09ICdzcGlubmVyJykge1xyXG4gICAgICAgIGxldCBzcGlubmVyID0gdGhpcztcclxuICAgICAgICB0aGlzLm9uKCdzcGlubmVyX2hvc3QtbG9hZGVkJywgZSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBuZXdIb3N0ID0gZS5kZXRhaWwuaG9zdDtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpXHJcbiAgICAgICAgICAgICAgICBNb2RhbC5taW5vclF1ZXVlLnNwbGljZShNb2RhbC5taW5vclF1ZXVlLmluZGV4T2Yoc3Bpbm5lcikgKyAxLCAwLCBuZXdIb3N0KTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgTW9kYWwubWFqb3JRdWV1ZS5zcGxpY2UoTW9kYWwubWFqb3JRdWV1ZS5pbmRleE9mKHNwaW5uZXIpICsgMSwgMCwgbmV3SG9zdCk7XHJcblxyXG4gICAgICAgICAgICBzcGlubmVyLmRlYWN0aXZhdGUoZS5kZXRhaWwub3B0aW9ucyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKSB7XHJcbiAgICAgICAgICAgIE1vZGFsLm1pbm9yUXVldWUucHVzaCh0aGlzKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coTW9kYWwubWlub3JRdWV1ZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKE1vZGFsLm1ham9yUXVldWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFNb2RhbC5taW5vckFjdGl2ZSlcclxuICAgICAgICAgICAgICAgIE1vZGFsLm1pbm9yU2hvdyhvcHRpb25zKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgTW9kYWwubWFqb3JRdWV1ZS5wdXNoKHRoaXMpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhNb2RhbC5taW5vclF1ZXVlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coTW9kYWwubWFqb3JRdWV1ZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIU1vZGFsLm1ham9yQWN0aXZlKVxyXG5cclxuICAgICAgICAgICAgICAgIE1vZGFsLm1ham9yU2hvdyhvcHRpb25zKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59O1xyXG5cclxuTW9kYWwucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5zdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKSB7XHJcbiAgICAgICAgLy9UT0RPIG5vdCBuZWNjZXNzYXJ5IGlmIHF1ZXVlIGlzIG5vdCBlbXB0eVxyXG4gICAgICAgIE1vZGFsLm1pbm9yV3JhcHBlci5jbGFzc0xpc3QuYWRkKCdtb2RhbC13cmFwcGVyX2ludmlzaWJsZScpO1xyXG4gICAgICAgIE1vZGFsLm1pbm9yQmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgnYmFja2Ryb3BfaW52aXNpYmxlJyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBNb2RhbC5tYWpvcldyYXBwZXIuY2xhc3NMaXN0LmFkZCgnbW9kYWwtd3JhcHBlcl9pbnZpc2libGUnKTtcclxuICAgICAgICBNb2RhbC5tYWpvckJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoJ2JhY2tkcm9wX2ludmlzaWJsZScpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcbk1vZGFsLnByb3RvdHlwZS5kZWFjdGl2YXRlID0gZnVuY3Rpb24gKG5leHRXaW5kb3dPcHRpb25zLCBoaWRlT3B0aW9ucykge1xyXG5cclxuICAgIHRoaXMuaGlkZShoaWRlT3B0aW9ucyk7XHJcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUikge1xyXG4gICAgICAgIE1vZGFsLm1pbm9yQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgTW9kYWwubWlub3JRdWV1ZS5zaGlmdCgpO1xyXG4gICAgICAgIE1vZGFsLm1pbm9yU2hvdyhuZXh0V2luZG93T3B0aW9ucyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIE1vZGFsLm1ham9yQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgTW9kYWwubWFqb3JRdWV1ZS5zaGlmdCgpO1xyXG4gICAgICAgIE1vZGFsLm1ham9yU2hvdyhuZXh0V2luZG93T3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnRyaWdnZXIoJ21vZGFsLXdpbmRvd19kZWFjdGl2YXRlZCcpO1xyXG59O1xyXG5cclxuTW9kYWwubWlub3JBY3RpdmUgPSBmYWxzZTtcclxuTW9kYWwubWFqb3JBY3RpdmUgPSBmYWxzZTtcclxuTW9kYWwubWlub3JRdWV1ZSA9IFtdO1xyXG5Nb2RhbC5tYWpvclF1ZXVlID0gW107XHJcblxyXG5Nb2RhbC5zcGlubmVyID0gbmV3IFNwaW5uZXIoKTtcclxuTW9kYWwuc3Bpbm5lci5zdGF0dXMgPSBNb2RhbC5zdGF0dXNlcy5NQUpPUjtcclxuXHJcbk1vZGFsLnNob3dTcGlubmVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgTW9kYWwucHJvdG90eXBlLnNob3cuY2FsbChNb2RhbC5zcGlubmVyKTtcclxuXHJcbiAgICBpZiAoIU1vZGFsLnNwaW5uZXIuZWxlbSlcclxuICAgICAgICBNb2RhbC5zcGlubmVyLmVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bpbm5lcicpO1xyXG4gICAgaWYgKCFNb2RhbC5zcGlubmVyLmVsZW0pXHJcbiAgICAgICAgTW9kYWwuc3Bpbm5lci5lbGVtID0gTW9kYWwucHJvdG90eXBlLnJlbmRlcldpbmRvdy5jYWxsKE1vZGFsLnNwaW5uZXIsIFNwaW5uZXIuaHRtbCk7XHJcblxyXG4gICAgTW9kYWwuc3Bpbm5lci5zaG93KCk7XHJcbn07XHJcblxyXG5Nb2RhbC5oaWRlU3Bpbm5lciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIE1vZGFsLnNwaW5uZXIuaGlkZSgpO1xyXG59O1xyXG5cclxuXHJcbk1vZGFsLm1pbm9yU2hvdyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBsZXQgbmV4dE1vZGFsV2luZG93ID0gTW9kYWwubWlub3JRdWV1ZVswXTtcclxuICAgIGlmIChuZXh0TW9kYWxXaW5kb3cpIHtcclxuICAgICAgICBsZXQgcHJvbWlzZSA9IG5leHRNb2RhbFdpbmRvdy5zaG93KG9wdGlvbnMpO1xyXG4gICAgICAgIGlmIChwcm9taXNlKVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIE1vZGFsLm1pbm9yQWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIE1vZGFsLm1pbm9yQWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIE1vZGFsLm1pbm9yQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuTW9kYWwubWFqb3JTaG93ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICBsZXQgbmV4dE1vZGFsV2luZG93ID0gTW9kYWwubWFqb3JRdWV1ZVswXTtcclxuXHJcbiAgICBpZiAobmV4dE1vZGFsV2luZG93KSB7XHJcblxyXG4gICAgICAgIE1vZGFsLnNob3dTcGlubmVyKCk7XHJcbiAgICAgICAgbGV0IHByb21pc2UgPSBuZXh0TW9kYWxXaW5kb3cuc2hvdyhvcHRpb25zKTtcclxuXHJcbiAgICAgICAgaWYgKHByb21pc2UpXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgTW9kYWwubWFqb3JBY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgTW9kYWwuaGlkZVNwaW5uZXIoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIE1vZGFsLm1ham9yQWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgTW9kYWwuaGlkZVNwaW5uZXIoKTtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIE1vZGFsLm1ham9yQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZm9yIChsZXQga2V5IGluIGV2ZW50TWl4aW4pXHJcbiAgICBNb2RhbC5wcm90b3R5cGVba2V5XSA9IGV2ZW50TWl4aW5ba2V5XTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGFsO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL21vZGFsL2luZGV4LmpzIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG5cdG9uOiBmdW5jdGlvbihldmVudE5hbWUsIGNiKSB7XHJcblx0XHRpZiAodGhpcy5lbGVtKVxyXG5cdFx0XHR0aGlzLmVsZW0uYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNiKTtcclxuXHRcdGVsc2VcclxuXHRcdFx0dGhpcy5saXN0ZW5lcnMucHVzaCh7XHJcblx0XHRcdFx0ZXZlbnROYW1lLFxyXG5cdFx0XHRcdGNiXHJcblx0XHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdHRyaWdnZXI6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZGV0YWlsKSB7XHJcblx0XHR0aGlzLmVsZW0uZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7XHJcblx0XHRcdGJ1YmJsZXM6IHRydWUsXHJcblx0XHRcdGNhbmNlbGFibGU6IHRydWUsXHJcblx0XHRcdGRldGFpbDogZGV0YWlsXHJcblx0XHR9KSk7XHJcblx0fSxcclxuXHJcblx0ZXJyb3I6IGZ1bmN0aW9uKGVycikge1xyXG5cdFx0dGhpcy5lbGVtLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdlcnJvcicsIHtcclxuXHRcdFx0YnViYmxlczogdHJ1ZSxcclxuXHRcdFx0Y2FuY2VsYWJsZTogdHJ1ZSxcclxuXHRcdFx0ZGV0YWlsOiBlcnJcclxuXHRcdH0pKTtcclxuXHR9XHJcblxyXG5cclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2V2ZW50TWl4aW4uanMiLCJsZXQgU3Bpbm5lciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLmVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bpbm5lcicpO1xyXG59O1xyXG5cclxuU3Bpbm5lci5odG1sID0gcmVxdWlyZShgaHRtbC1sb2FkZXIhLi9tYXJrdXBgKTtcclxuXHJcblNwaW5uZXIucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnc3Bpbm5lcl9pbnZpc2libGUnKTtcclxufTtcclxuXHJcblNwaW5uZXIucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnc3Bpbm5lcl9pbnZpc2libGUnKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3Bpbm5lcjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL3NwaW5uZXIvaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBpZD1cXFwic3Bpbm5lclxcXCIgY2xhc3M9XFxcInNwaW5uZXJcXFwiPlxcclxcblxcclxcbjwvZGl2PlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9+L2h0bWwtbG9hZGVyIS4uL2Jsb2Nrcy9zcGlubmVyL21hcmt1cFxuLy8gbW9kdWxlIGlkID0gMjBcbi8vIG1vZHVsZSBjaHVua3MgPSAxIDIgOCA5IDEwIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxkaXYgY2xhc3M9J3dpbmRvdyBtb2RhbCB3aW5kb3dfaW52aXNpYmxlIG1vZGFsLXdpbmRvdyBtZXNzYWdlLW1vZGFsLXdpbmRvdycgaWQ9J21lc3NhZ2UtbW9kYWwtd2luZG93Jz5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiaGVhZGVyIHdpbmRvd19faGVhZGVyXFxcIj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcInBhbmVsIHdpbmRvd19fcGFuZWxcXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwibWVzc2FnZS1tb2RhbC13aW5kb3dfX21lc3NhZ2VcXFwiPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b24gbWVzc2FnZS1tb2RhbC13aW5kb3dfX29rLWJ1dHRvblxcXCI+T0s8L2Rpdj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImljb24tY3Jvc3MgbW9kYWwtY2xvc2UtYnV0dG9uXFxcIj48L2Rpdj48L2Rpdj5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svfi9odG1sLWxvYWRlciEuLi9ibG9ja3MvbWVzc2FnZS1tb2RhbC13aW5kb3cvd2luZG93XG4vLyBtb2R1bGUgaWQgPSAyMVxuLy8gbW9kdWxlIGNodW5rcyA9IDEgNCA5IiwiLy9sZXQgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdhcHA6Y2hlY2tVc2VyZERhdGEnKTtcclxuXHJcbmNvbnN0IFBST1BFUlRZX1NZTUJPTCA9ICdbcHJvcGVydHldJztcclxuXHJcbmxldCBtZXNzYWdlcyA9IHtcclxuICAgIHBsYWluOiAnaW5jb3JyZWN0IFtwcm9wZXJ0eV0nLFxyXG4gICAgZW1wdHk6ICdbcHJvcGVydHldIG11c3Qgbm90IGJlIGVtcHR5JyxcclxuICAgIHRvb0JpZzogdmFsdWUgPT4ge1xyXG4gICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICAgICAgcmV0dXJuIGBbcHJvcGVydHldIG11c3QgYmUgbG93ZXIgdGhhbiAke3ZhbHVlICsgMX0gc3ltYm9sc2A7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gJ1twcm9wZXJ0eV0gaXMgdG9vIGJpZyc7XHJcbiAgICB9LFxyXG4gICAgdG9vU21hbGw6IHZhbHVlID0+IHtcclxuICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAgICAgIHJldHVybiBgW3Byb3BlcnR5XSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAke3ZhbHVlIC0gMX0gc3ltYm9sc2A7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gJ1twcm9wZXJ0eV0gaXMgdG9vIHNob3J0JztcclxuICAgIH1cclxufTtcclxuXHJcbmxldCB0ZXN0cyA9IHtcclxuICAgIHJlZ0V4cDogKHJlZ0V4cCwgdmFsdWUpID0+IHJlZ0V4cC50ZXN0KHZhbHVlKSxcclxuICAgIG1heDogKG1heCwgdmFsdWUpID0+ICh2YWx1ZS5sZW5ndGggPD0gbWF4KSxcclxuICAgIG1pbjogKG1pbiwgdmFsdWUpID0+ICh2YWx1ZS5sZW5ndGggPj0gbWluKSxcclxuICAgIG5vbkVtcHR5OiAodmFsdWUpID0+ICh2YWx1ZS5sZW5ndGggPiAwKVxyXG5cclxufTtcclxuXHJcblxyXG5sZXQgY2hlY2tzID0ge1xyXG4gICAgbWF4OiAodmFsdWUsIGVycm9yTWVzc2FnZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZXJyb3JNZXNzYWdlIHx8IG1lc3NhZ2VzLnRvb0JpZyh2YWx1ZSksXHJcbiAgICAgICAgICAgIHRlc3Q6IHRlc3RzLm1heC5iaW5kKG51bGwsIHZhbHVlKVxyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG5cclxuICAgIG1pbjogKHZhbHVlLCBlcnJvck1lc3NhZ2UpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGVycm9yTWVzc2FnZSB8fCBtZXNzYWdlcy50b29TbWFsbCh2YWx1ZSksXHJcbiAgICAgICAgICAgIHRlc3Q6IHRlc3RzLm1pbi5iaW5kKG51bGwsIHZhbHVlKVxyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG5cclxuICAgIG5vbkVtcHR5OiAoZXJyb3JNZXNzYWdlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlcnJvck1lc3NhZ2UgfHwgbWVzc2FnZXMuZW1wdHksXHJcbiAgICAgICAgICAgIHRlc3Q6IHRlc3RzLm5vbkVtcHR5XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufTtcclxuXHJcbmZ1bmN0aW9uIGNvbXB1dGVFcnJvck1lc3NhZ2UodGVtcGxhdGUsIHByb3BlcnR5KSB7XHJcbiAgICBsZXQgcG9zO1xyXG4gICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZSB8fCBtZXNzYWdlcy5wbGFpbjtcclxuICAgIHByb3BlcnR5ID0gcHJvcGVydHkgfHwgJ3RoaXMgcHJvcGVydHknO1xyXG4gICAgd2hpbGUgKH4ocG9zID0gdGVtcGxhdGUuaW5kZXhPZihQUk9QRVJUWV9TWU1CT0wpKSlcclxuICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLnN1YnN0cmluZygwLCBwb3MpICsgcHJvcGVydHkgKyB0ZW1wbGF0ZS5zdWJzdHJpbmcocG9zICsgUFJPUEVSVFlfU1lNQk9MLmxlbmd0aCk7XHJcbiAgICByZXR1cm4gdGVtcGxhdGU7XHJcbn1cclxuXHJcbmxldCB2YWxpZGF0b3JzID0ge1xyXG5cclxuICAgICdub24tZW1wdHknOiB7XHJcbiAgICAgICAgY2hlY2tzOiBbXHJcbiAgICAgICAgICAgIGNoZWNrcy5ub25FbXB0eSgpXHJcbiAgICAgICAgXVxyXG4gICAgfSxcclxuXHJcbiAgICAnZW1haWwnOiB7XHJcbiAgICAgICAgY2hlY2tzOiBbXHJcbiAgICAgICAgICAgIGNoZWNrcy5ub25FbXB0eSgpLFxyXG4gICAgICAgICAgICBjaGVja3MubWF4KDEwMCwgbWVzc2FnZXMudG9vQmlnKCkpLFxyXG4gICAgICAgICAgICBjaGVja3MubWluKDYsIG1lc3NhZ2VzLnRvb1NtYWxsKCkpLCB7XHJcbiAgICAgICAgICAgICAgICB0ZXN0OiB0ZXN0cy5yZWdFeHAuYmluZChudWxsLCAvXihcXHcrWy1cXC5dPz8pK0BbXFx3Li1dK1xcd1xcLlxcd3syLDV9JC9pKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgJ3VzZXJuYW1lJzoge1xyXG4gICAgICAgIGNoZWNrczogW1xyXG4gICAgICAgICAgICBjaGVja3Mubm9uRW1wdHkoKSxcclxuICAgICAgICAgICAgY2hlY2tzLm1heCgxNiksXHJcbiAgICAgICAgICAgIGNoZWNrcy5taW4oNSksIHtcclxuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogJ211c3Qgb25seSBjb250YWluIGFscGhhbnVtZXJpYyBzeW1ib2xzJyxcclxuICAgICAgICAgICAgICAgIHRlc3Q6IHRlc3RzLnJlZ0V4cC5iaW5kKG51bGwsIC9eW0EtWjAtOS1dKyQvaSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgIH0sXHJcblxyXG5cclxuICAgICdwYXNzd29yZCc6IHtcclxuICAgICAgICBjaGVja3M6IFtcclxuICAgICAgICAgICAgY2hlY2tzLm5vbkVtcHR5KCksXHJcbiAgICAgICAgICAgIGNoZWNrcy5tYXgoMzApLFxyXG4gICAgICAgICAgICBjaGVja3MubWluKDUpLCB7XHJcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6ICdbcHJvcGVydHldIGlzIHRvbyB3ZWFrJyxcclxuICAgICAgICAgICAgICAgIHRlc3Q6IHRlc3RzLnJlZ0V4cC5iaW5kKG51bGwsIC8oPz0uKlxcZCkoPz0uKlthLXpdKSg/PS4qW0EtWl0pLns2LH0vKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIF1cclxuICAgIH0sXHJcblxyXG5cclxuICAgICdwYXNzd29yZC1hZ2Fpbic6IHtcclxuICAgICAgICBjaGVja3M6IFtcclxuICAgICAgICAgICAgY2hlY2tzLm5vbkVtcHR5KCdyZS1lbnRlciBbcHJvcGVydHldJyksIHtcclxuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogJ3Bhc3N3b3JkcyBkbyBub3QgbWF0Y2gnLFxyXG4gICAgICAgICAgICAgICAgdGVzdDogZnVuY3Rpb24odmFsdWUsIGRhdGFDaHVuaywgZGF0YSkge1xyXG5cdFx0XHRcdFx0bGV0IG9yaWdpbmFsUGFzcyA9IGRhdGFDaHVuay5wYXNzd29yZDtcclxuXHRcdFx0XHRcdGlmICghb3JpZ2luYWxQYXNzKVxyXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ25vIG9yaWdpbmFsIHBhc3N3b3JkIHJlZmVyZW5jZScpO1xyXG5cclxuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKylcclxuXHRcdFx0XHRcdFx0aWYgKGRhdGFbaV0ucHJvcGVydHkgPT09IG9yaWdpbmFsUGFzcylcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKHZhbHVlID09PSBkYXRhW2ldLnZhbHVlKTtcclxuXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ25vIG9yZ2luYWwgcGFzc3dvcmQgZGF0YScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIF1cclxuICAgIH0sXHJcblxyXG5cclxuICAgICd1cmwnOiB7XHJcbiAgICAgICAgY2hlY2tzOiBbe1xyXG4gICAgICAgICAgICB0ZXN0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHVybFJlZ2V4ID0gJ14oPyFtYWlsdG86KSg/Oig/Omh0dHB8aHR0cHMpOi8vKSg/OlxcXFxTKyg/OjpcXFxcUyopP0ApPyg/Oig/Oig/OlsxLTldXFxcXGQ/fDFcXFxcZFxcXFxkfDJbMDFdXFxcXGR8MjJbMC0zXSkoPzpcXFxcLig/OjE/XFxcXGR7MSwyfXwyWzAtNF1cXFxcZHwyNVswLTVdKSl7Mn0oPzpcXFxcLig/OlswLTldXFxcXGQ/fDFcXFxcZFxcXFxkfDJbMC00XVxcXFxkfDI1WzAtNF0pKXwoPzooPzpbYS16XFxcXHUwMGExLVxcXFx1ZmZmZjAtOV0rLT8pKlthLXpcXFxcdTAwYTEtXFxcXHVmZmZmMC05XSspKD86XFxcXC4oPzpbYS16XFxcXHUwMGExLVxcXFx1ZmZmZjAtOV0rLT8pKlthLXpcXFxcdTAwYTEtXFxcXHVmZmZmMC05XSspKig/OlxcXFwuKD86W2EtelxcXFx1MDBhMS1cXFxcdWZmZmZdezIsfSkpKXxsb2NhbGhvc3QpKD86OlxcXFxkezIsNX0pPyg/OigvfFxcXFw/fCMpW15cXFxcc10qKT8kJztcclxuICAgICAgICAgICAgICAgIGxldCB1cmwgPSBuZXcgUmVnRXhwKHVybFJlZ2V4LCAnaScpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA8IDIwODMgJiYgdXJsLnRlc3QodmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfV1cclxuICAgIH0sXHJcblxyXG5cclxuICAgICdkZXNjcmlwdGlvbic6IHtcclxuICAgICAgICBjaGVja3M6IFtcclxuICAgICAgICAgICAgY2hlY2tzLm1heCgyNTUpXHJcbiAgICAgICAgXVxyXG4gICAgfSxcclxuXHJcbiAgICAnY29tbWVudCc6IHtcclxuICAgICAgICBjaGVja3M6IFtcclxuICAgICAgICAgICAgY2hlY2tzLm5vbkVtcHR5KCksXHJcbiAgICAgICAgICAgIGNoZWNrcy5tYXgoMjU1KVxyXG4gICAgICAgIF1cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEVycm9yQXJyYXkoZGF0YSkge1xyXG5cclxuXHRpZiAoIUFycmF5LmlzQXJyYXkoZGF0YSkpIHtcclxuXHRcdGxldCBjb3JyZWN0RGF0YSA9IFtdO1xyXG5cdFx0Zm9yIChsZXQga2V5IGluIGRhdGEpIHtcclxuXHRcdFx0Y29ycmVjdERhdGEucHVzaCh7XHJcblx0XHRcdFx0cHJvcGVydHk6IGtleSxcclxuXHRcdFx0XHR2YWx1ZTogZGF0YVtrZXldXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0ZGF0YSA9IGNvcnJlY3REYXRhO1xyXG5cdH1cclxuXHJcbiAgICBsZXQgcmVzdWx0ID0gW107XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRsZXQga2V5ID0gZGF0YVtpXS52YWxpZGF0b3I7XHJcblx0XHRpZiAoIWtleSlcclxuXHRcdFx0a2V5ID0gZGF0YVtpXS5wcm9wZXJ0eTtcclxuXHJcbiAgICAgICAgaWYgKCF2YWxpZGF0b3JzW2tleV0pXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm8gdmFsaWRhdG9yIGZvciB0aGlzIHByb3BlcnR5OiAnICsga2V5KTtcclxuXHJcbiAgICAgICAgdmFsaWRhdG9yc1trZXldLmNoZWNrcy5mb3JFYWNoKGNoZWNrID0+IHtcclxuICAgICAgICAgICAgaWYgKCFjaGVjay50ZXN0KGRhdGFbaV0udmFsdWUsIGRhdGFbaV0sIGRhdGEpKVxyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5OiBkYXRhW2ldLnByb3BlcnR5LFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNvbXB1dGVFcnJvck1lc3NhZ2UoY2hlY2suZXJyb3JNZXNzYWdlLCBkYXRhW2ldLmFsaWFzIHx8IGRhdGFbaV0ucHJvcGVydHkgfHwga2V5KVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZnVuY3Rpb24gdGVzdFByb3BlcnR5KG5hbWUsIHZhbHVlKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gdHJ1ZTtcclxuICAgIHZhbGlkYXRvcnNbbmFtZV0uY2hlY2tzLmZvckVhY2goY2hlY2sgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIWNoZWNrLnRlc3QodmFsdWUpKVxyXG4gICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBnZXRFcnJvckFycmF5LFxyXG4gICAgdGVzdFByb3BlcnR5XHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9jaGVja1VzZXJEYXRhLmpzIiwibGV0IGV2ZW50TWl4aW4gPSByZXF1aXJlKExJQlMgKyAnZXZlbnRNaXhpbicpO1xyXG5sZXQgZ2V0RXJyb3JBcnJheSA9IHJlcXVpcmUoTElCUyArICdjaGVja1VzZXJEYXRhJykuZ2V0RXJyb3JBcnJheTtcclxubGV0IENsaWVudEVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLkNsaWVudEVycm9yO1xyXG5cclxubGV0IEZvcm0gPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcbiAgICB0aGlzLmVsZW0gPSBvcHRpb25zLmVsZW07XHJcbiAgICB0aGlzLmZpZWxkcyA9IG9wdGlvbnMuZmllbGRzO1xyXG4gICAgdGhpcy51cmwgPSBvcHRpb25zLnVybDtcclxuICAgIHRoaXMuaXNBdmFpbGFibGUgPSB0cnVlO1xyXG5cclxuICAgIHRoaXMuc2F2ZUJ1dHRvbiA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuc2F2ZS1idXR0b24nKTtcclxuXHJcbiAgICB0aGlzLmVsZW0ub25jbGljayA9IGUgPT4ge1xyXG4gICAgICAgIGlmICghdGhpcy5pc0F2YWlsYWJsZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAoZS50YXJnZXQgIT09IHRoaXMuc2F2ZUJ1dHRvbikgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLmNsZWFyRXJyb3JCb3hlcygpO1xyXG4gICAgICAgIGxldCBlcnJvcnMgPSB0aGlzLmdldEVycm9ycygpO1xyXG4gICAgICAgIGlmIChlcnJvcnMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICB0aGlzLnNlbmQodGhpcy5nZXRCb2R5KCkpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5zZXRFcnJvcnMoZXJyb3JzKTtcclxuICAgIH07XHJcbn07XHJcblxyXG5Gb3JtLnByb3RvdHlwZS5zZXRQcm9wZXJ0eUVycm9yID0gZnVuY3Rpb24ocHJvcGVydHksIG1lc3NhZ2UpIHtcclxuICAgIHRoaXMuZ2V0RXJyb3JCb3gocHJvcGVydHkpLnRleHRDb250ZW50ID0gbWVzc2FnZTtcclxufTtcclxuXHJcbkZvcm0ucHJvdG90eXBlLmdldEVycm9yQm94ID0gZnVuY3Rpb24oZmllbGROYW1lKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lbGVtW2ZpZWxkTmFtZV0ucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudGV4dGJveF9fZXJyb3InKTtcclxufTtcclxuXHJcbkZvcm0ucHJvdG90eXBlLnNldEF2YWlsYWJsZSA9IGZ1bmN0aW9uKGlzQXZhaWxhYmxlKSB7XHJcbiAgICB0aGlzLmlzQXZhaWxhYmxlID0gaXNBdmFpbGFibGU7XHJcbn07XHJcblxyXG5Gb3JtLnByb3RvdHlwZS5nZXREYXRhT2JqID0gZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgb3B0aW9ucyA9IFtdO1xyXG5cclxuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmZpZWxkcykge1xyXG4gICAgICAgIGxldCBjaHVuayA9IHRoaXMuZmllbGRzW2tleV07XHJcbiAgICAgICAgaWYgKCFjaHVuay5ub1ZhbGlkYXRpb24pIHtcclxuICAgICAgICAgICAgaWYgKCFjaHVuay5wcm9wZXJ0eSlcclxuICAgICAgICAgICAgICAgIGNodW5rLnByb3BlcnR5ID0ga2V5O1xyXG4gICAgICAgICAgICBjaHVuay52YWx1ZSA9IHRoaXMuZWxlbVtrZXldLnZhbHVlO1xyXG4gICAgICAgICAgICBvcHRpb25zLnB1c2goY2h1bmspO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gb3B0aW9ucztcclxufTtcclxuXHJcbkZvcm0ucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbihib2R5KSB7XHJcbiAgICByZXF1aXJlKExJQlMgKyAnc2VuZFJlcXVlc3QnKShib2R5LCAnUE9TVCcsIHRoaXMudXJsLCAoZXJyLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIENsaWVudEVycm9yICYmIGVyci5kZXRhaWwpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFByb3BlcnR5RXJyb3IoZXJyLmRldGFpbC5wcm9wZXJ0eSwgZXJyLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLnRyaWdnZXIoJ2Zvcm1fc2VudCcsIHtcclxuICAgICAgICAgICAgcmVzcG9uc2VcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuXHJcbkZvcm0ucHJvdG90eXBlLmNsZWFyRXJyb3JCb3hlcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuZmllbGRzKVxyXG4gICAgICAgIHRoaXMuZ2V0RXJyb3JCb3goa2V5KS50ZXh0Q29udGVudCA9ICcnO1xyXG59O1xyXG5cclxuRm9ybS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuY2xlYXJFcnJvckJveGVzKCk7XHJcbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5maWVsZHMpXHJcbiAgICAgICAgdGhpcy5lbGVtW2tleV0udmFsdWUgPSAnJztcclxufTtcclxuXHJcbkZvcm0ucHJvdG90eXBlLmdldEVycm9ycyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIGdldEVycm9yQXJyYXkodGhpcy5nZXREYXRhT2JqKCkpO1xyXG59O1xyXG5cclxuXHJcbkZvcm0ucHJvdG90eXBlLnNldEVycm9ycyA9IGZ1bmN0aW9uKGVycm9ycykge1xyXG4gICAgdGhpcy5jbGVhckVycm9yQm94ZXMoKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXJyb3JzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGlmICh0aGlzLmdldEVycm9yQm94KGVycm9yc1tpXS5wcm9wZXJ0eSkudGV4dENvbnRlbnQgPT0gJycpXHJcbiAgICAgICAgICAgIHRoaXMuc2V0UHJvcGVydHlFcnJvcihlcnJvcnNbaV0ucHJvcGVydHksIGVycm9yc1tpXS5tZXNzYWdlKTtcclxufTtcclxuXHJcbkZvcm0ucHJvdG90eXBlLmdldEJvZHkgPSBmdW5jdGlvbigpIHtcclxuICAgIGxldCBib2R5ID0gJyc7XHJcblxyXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuZmllbGRzKVxyXG4gICAgICAgIGlmICghdGhpcy5maWVsZHNba2V5XS5leHRyYSlcclxuICAgICAgICAgICAgYm9keSArPSAoYm9keSA9PT0gJycgPyAnJyA6ICcmJykgK1xyXG4gICAgICAgICAgICBrZXkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodGhpcy5lbGVtW2tleV0udmFsdWUpO1xyXG4gICAgcmV0dXJuIGJvZHk7XHJcbn07XHJcblxyXG5mb3IgKGxldCBrZXkgaW4gZXZlbnRNaXhpbikge1xyXG4gICAgRm9ybS5wcm90b3R5cGVba2V5XSA9IGV2ZW50TWl4aW5ba2V5XTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGb3JtO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL2Zvcm0vaW5kZXguanMiLCJsZXQgU2VydmVyRXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuU2VydmVyRXJyb3I7XHJcbmxldCBDbGllbnRFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5DbGllbnRFcnJvcjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJvZHlPYmosIG1ldGhvZCwgdXJsLCBjYikge1xyXG5cclxuXHJcbiAgICBsZXQgYm9keSA9ICcnO1xyXG4gICAgaWYgKCEodHlwZW9mIGJvZHlPYmogPT09ICdzdHJpbmcnKSkge1xyXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBib2R5T2JqKSB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICBpZiAoYm9keU9ialtrZXldKVxyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBrZXkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoKHR5cGVvZiBib2R5T2JqW2tleV0gPT09ICdvYmplY3QnKSA/IEpTT04uc3RyaW5naWZ5KGJvZHlPYmpba2V5XSkgOiBib2R5T2JqW2tleV0pO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAgICAgICAgICBib2R5ICs9IChib2R5ID09PSAnJyA/ICcnIDogJyYnKSArIHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZVxyXG4gICAgICAgIGJvZHkgPSBib2R5T2JqO1xyXG5cclxuXHJcbiAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICB4aHIub3BlbihtZXRob2QsIHVybCwgdHJ1ZSk7XHJcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xyXG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJYLVJlcXVlc3RlZC1XaXRoXCIsIFwiWE1MSHR0cFJlcXVlc3RcIik7XHJcblxyXG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlICE9IDQpIHJldHVybjtcclxuXHJcbiAgICAgICAgbGV0IHJlc3BvbnNlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5yZXNwb25zZVRleHQpXHJcbiAgICAgICAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNiKG5ldyBTZXJ2ZXJFcnJvcignU2VydmVyIGlzIG5vdCByZXNwb25kaW5nJykpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwKVxyXG4gICAgICAgICAgICBjYihudWxsLCByZXNwb25zZSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSA0MDAgJiYgdGhpcy5zdGF0dXMgPCA1MDApXHJcbiAgICAgICAgICAgIGNiKG5ldyBDbGllbnRFcnJvcihyZXNwb25zZS5tZXNzYWdlLCByZXNwb25zZS5kZXRhaWwsIHRoaXMuc3RhdHVzKSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSA1MDApXHJcbiAgICAgICAgICAgIGNiKG5ldyBTZXJ2ZXJFcnJvcihyZXNwb25zZS5tZXNzYWdlLCB0aGlzLnN0YXR1cykpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhgc2VuZGluZyBuZXh0IHJlcXVlc3Q6ICR7Ym9keX1gKTtcclxuICAgIHhoci5zZW5kKGJvZHkpO1xyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvc2VuZFJlcXVlc3QuanMiLCJsZXQgRHJvcGRvd24gPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgIHRoaXMuZWxlbSA9IG9wdGlvbnMuZWxlbTtcclxuICAgIHRoaXMuaXRlbUxpc3QgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmRyb3Bkb3duX19pdGVtLWxpc3QnKTtcclxuICAgIHRoaXMuY2xhc3NOYW1lID0gb3B0aW9ucy5jbGFzc05hbWU7XHJcblxyXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuXHJcbiAgICAvLyB0aGlzLmVsZW0ub25jbGljayA9IGUgPT4ge1xyXG4gICAgLy8gICAgIHRoaXMudG9nZ2xlKCk7XHJcbiAgICAvLyB9O1xyXG5cclxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLml0ZW1MaXN0LmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5lbGVtLmNvbnRhaW5zKGUudGFyZ2V0KSlcclxuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlKCk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuYWN0aXZlKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sIGZhbHNlKTtcclxuXHJcblxyXG4gICAgdGhpcy5BRUhhbmRsZXIgPSB0aGlzLkFFSGFuZGxlci5iaW5kKHRoaXMpO1xyXG5cclxufTtcclxuXHJcbkRyb3Bkb3duLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3Bkb3duX2ludmlzaWJsZScpO1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoYCR7dGhpcy5jbGFzc05hbWV9X2FjdGl2ZWApO1xyXG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xyXG59O1xyXG5cclxuRHJvcGRvd24ucHJvdG90eXBlLmRlYWN0aXZhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLml0ZW1MaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbmVuZCcsIHRoaXMuQUVIYW5kbGVyLCBmYWxzZSk7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnZHJvcGRvd25fZmFkaW5nLW91dCcpO1xyXG59O1xyXG5cclxuRHJvcGRvd24ucHJvdG90eXBlLkFFSGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdkcm9wZG93bl9mYWRpbmctb3V0Jyk7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnZHJvcGRvd25faW52aXNpYmxlJyk7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZShgJHt0aGlzLmNsYXNzTmFtZX1fYWN0aXZlYCk7XHJcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5pdGVtTGlzdC5yZW1vdmVFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCB0aGlzLkFFSGFuZGxlcik7XHJcbn07XHJcblxyXG5Ecm9wZG93bi5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuYWN0aXZlKVxyXG4gICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHRoaXMuc2hvdygpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEcm9wZG93bjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL2Ryb3Bkb3duL2luZGV4LmpzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NldHRpbmdzL3N0eWxlLmxlc3Ncbi8vIG1vZHVsZSBpZCA9IDQ0XG4vLyBtb2R1bGUgY2h1bmtzID0gOSIsImxldCBldmVudE1peGluID0gcmVxdWlyZShMSUJTICsgJ2V2ZW50TWl4aW4nKTtcclxubGV0IFNvY2lhbENvbGxlY3Rpb24gPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblxyXG4gICAgdGhpcy5lbGVtID0gb3B0aW9ucy5lbGVtO1xyXG4gICAgdGhpcy5zb2NpYWxMaXN0ID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5zb2NpYWwtY29sbGVjdGlvbl9fc29jaWFsLWxpc3QnKTtcclxuICAgIHRoaXMudGV4dGJveCA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcudGV4dGJveF9fZmllbGQnKTtcclxuXHJcbiAgICB0aGlzLmVsZW0ub25jbGljayA9IGUgPT4ge1xyXG5cclxuICAgICAgICBpZiAoZS50YXJnZXQubWF0Y2hlcygnLnRleHRib3gtYnV0dG9uX19idXR0b24nKSAmJiB0aGlzLnRleHRib3gudmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5zZW5kU29jaWFsKHRoaXMudGV4dGJveC52YWx1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChlLnRhcmdldC5tYXRjaGVzKCcuc29jaWFsX19jbG9zZScpKVxyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZVNvY2lhbChlLnRhcmdldC5jbG9zZXN0KCcuc29jaWFsJykpO1xyXG4gICAgfTtcclxufTtcclxuXHJcbi8vVE9ETyBtYWtlIGNoZWNraW5nIHVzZXIncyBkYXRhIG9uIGNsaWVudCBzaWRlXHJcblxyXG5Tb2NpYWxDb2xsZWN0aW9uLnByb3RvdHlwZS5zZW5kU29jaWFsID0gZnVuY3Rpb24obGluaykge1xyXG4gICAgcmVxdWlyZShMSUJTICsgJ3NlbmRSZXF1ZXN0Jykoe1xyXG4gICAgICAgIGxpbmtcclxuICAgIH0sICdQT1NUJywgJy9zZXR0aW5ncycsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcblxyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmluc2VydE5ld1NvY2lhbChyZXNwb25zZS5saW5rT2JqKTtcclxuICAgICAgICB0aGlzLnRleHRib3gudmFsdWUgPSAnJztcclxuICAgIH0pO1xyXG5cclxufTtcclxuXHJcblNvY2lhbENvbGxlY3Rpb24ucHJvdG90eXBlLmRlbGV0ZVNvY2lhbCA9IGZ1bmN0aW9uKHNvY2lhbCkge1xyXG4gICAgcmVxdWlyZShMSUJTICsgJ3NlbmRSZXF1ZXN0Jykoe1xyXG4gICAgICAgIGxpbms6IHNvY2lhbC5kYXRhc2V0LmxpbmtcclxuICAgIH0sICdERUxFVEUnLCAnL3NldHRpbmdzJywgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuXHJcbiAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNvY2lhbC5yZW1vdmUoKTtcclxuICAgIH0pO1xyXG5cclxufTtcclxuXHJcblNvY2lhbENvbGxlY3Rpb24ucHJvdG90eXBlLmluc2VydE5ld1NvY2lhbCA9IGZ1bmN0aW9uKGxpbmtPYmopIHtcclxuICAgIGxldCBzb2NpYWwgPSByZXF1aXJlKExJQlMgKyAncmVuZGVyRWxlbWVudCcpKHJlcXVpcmUoJ2h0bWwtbG9hZGVyIS4vc29jaWFsJykpO1xyXG4gICAgc29jaWFsLmRhdGFzZXQubGluayA9IGxpbmtPYmouaHJlZjtcclxuICAgIHNvY2lhbC5xdWVyeVNlbGVjdG9yKCcuc29jaWFsX19saW5rJykuc2V0QXR0cmlidXRlKCdocmVmJywgbGlua09iai5ocmVmKTtcclxuICAgIHNvY2lhbC5xdWVyeVNlbGVjdG9yKCcuc29jaWFsX19ob3N0JykudGV4dENvbnRlbnQgPSBsaW5rT2JqLmhvc3Q7XHJcbiAgICB0aGlzLnNvY2lhbExpc3QuYXBwZW5kQ2hpbGQoc29jaWFsKTtcclxufTtcclxuXHJcbmZvciAobGV0IGtleSBpbiBldmVudE1peGluKSB7XHJcbiAgICBTb2NpYWxDb2xsZWN0aW9uLnByb3RvdHlwZVtrZXldID0gZXZlbnRNaXhpbltrZXldO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNvY2lhbENvbGxlY3Rpb247XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3Mvc29jaWFsLWNvbGxlY3Rpb24vaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1hcmt1cCkge1xyXG5cdGxldCBwYXJlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKTtcclxuXHRwYXJlbnQuaW5uZXJIVE1MID0gbWFya3VwOyBcclxuXHRsZXQgZWxlbWVudCA9IHBhcmVudC5maXJzdEVsZW1lbnRDaGlsZDtcclxuXHRyZXR1cm4gZWxlbWVudDtcclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvcmVuZGVyRWxlbWVudC5qcyIsIm1vZHVsZS5leHBvcnRzID0gXCI8ZGl2IGNsYXNzPVxcXCJzb2NpYWwtY29sbGVjdGlvbl9fc29jaWFsIHNvY2lhbFxcXCIgZGF0YS1saW5rPVxcXCJcXFwiPlxcclxcbiAgICA8YSBjbGFzcz1cXFwic29jaWFsX19saW5rXFxcIiBocmVmPVxcXCJcXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwic29jaWFsX19pY29uIGljb24tc3BoZXJlXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgIDxzcGFuIGNsYXNzPVxcXCJzb2NpYWxfX2hvc3RcXFwiPjwvc3Bhbj5cXHJcXG4gICAgPC9hPlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJzb2NpYWxfX2Nsb3NlIGljb24tY3Jvc3NcXFwiPjwvZGl2PlxcclxcbjwvZGl2PlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9+L2h0bWwtbG9hZGVyIS4uL2Jsb2Nrcy9zb2NpYWwtY29sbGVjdGlvbi9zb2NpYWxcbi8vIG1vZHVsZSBpZCA9IDQ4XG4vLyBtb2R1bGUgY2h1bmtzID0gOSIsImxldCBldmVudE1peGluID0gcmVxdWlyZShMSUJTICsgJ2V2ZW50TWl4aW4nKTtcclxubGV0IEZpbGVQaWNrZXIgPSByZXF1aXJlKEJMT0NLUyArICdmaWxlLXBpY2tlcicpO1xyXG5cclxubGV0IENsaWVudEVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLkNsaWVudEVycm9yO1xyXG5cclxubGV0IFVwbG9hZEF2YXRhclNlY3Rpb24gPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgdGhpcy5lbGVtID0gb3B0aW9ucy5lbGVtO1xyXG4gICAgdGhpcy51cGxvYWRCdXR0b24gPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLnVwbG9hZC1hdmF0YXItc2VjdGlvbl9fdXBsb2FkLWJ1dHRvbicpO1xyXG4gICAgdGhpcy5kZWxldGVCdXR0b24gPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLnVwbG9hZC1hdmF0YXItc2VjdGlvbl9fZGVsZXRlLWJ1dHRvbicpO1xyXG4gICAgdGhpcy5maWxlUGlja2VyID0gbmV3IEZpbGVQaWNrZXIoe1xyXG4gICAgICAgIGVsZW06IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuZmlsZS1waWNrZXInKVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5hdmF0YXIgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLnVwbG9hZC1hdmF0YXItc2VjdGlvbl9fYXZhdGFyJyk7XHJcblxyXG4gICAgdGhpcy5lbGVtLm9uY2xpY2sgPSBlID0+IHtcclxuXHJcbiAgICAgICAgaWYgKGUudGFyZ2V0ID09PSB0aGlzLnVwbG9hZEJ1dHRvbikge1xyXG4gICAgICAgICAgICBsZXQgZmlsZSA9IHRoaXMuZmlsZVBpY2tlci5nZXRGaWxlKCk7XHJcbiAgICAgICAgICAgIGlmIChmaWxlKVxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGxvYWRBdmF0YXIoZmlsZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZS50YXJnZXQgPT09IHRoaXMuZGVsZXRlQnV0dG9uKVxyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZUF2YXRhcigpO1xyXG4gICAgfVxyXG5cclxufTtcclxuXHJcblxyXG5VcGxvYWRBdmF0YXJTZWN0aW9uLnByb3RvdHlwZS5kZWxldGVBdmF0YXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXF1aXJlKExJQlMgKyAnc2VuZFJlcXVlc3QnKShudWxsLCAnREVMRVRFJywgJy9hdmF0YXInLCAoZXJyLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYXZhdGFyLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJyR7QU5PTl9BVkFUQVJfVVJMfScpYDtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuVXBsb2FkQXZhdGFyU2VjdGlvbi5wcm90b3R5cGUudXBsb2FkQXZhdGFyID0gZnVuY3Rpb24gKGZpbGUpIHtcclxuICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgZm9ybURhdGEuYXBwZW5kKFwiYXZhdGFyXCIsIGZpbGUpO1xyXG5cclxuICAgIHJlcXVpcmUoTElCUyArICdzZW5kRm9ybURhdGEnKShcIi9hdmF0YXJcIiwgZm9ybURhdGEsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hdmF0YXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgnJHtyZXNwb25zZS51cmx9PyR7bmV3IERhdGUoKS5nZXRUaW1lKCl9JylgO1xyXG5cclxuICAgIH0pO1xyXG59O1xyXG5cclxuZm9yIChsZXQga2V5IGluIGV2ZW50TWl4aW4pIHtcclxuICAgIFVwbG9hZEF2YXRhclNlY3Rpb24ucHJvdG90eXBlW2tleV0gPSBldmVudE1peGluW2tleV07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVXBsb2FkQXZhdGFyU2VjdGlvbjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL3VwbG9hZC1hdmF0YXItc2VjdGlvbi9pbmRleC5qcyIsImNvbnN0IERFRkFVTFRfVkFMVUUgPSAnbm8gZmlsZSBjaG9zZW4nO1xyXG5jb25zdCBERUZBVUxUX0ZOX0xFTkdUSCA9IERFRkFVTFRfVkFMVUUubGVuZ3RoO1xyXG5cclxubGV0IEZpbGVQaWNrZXIgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgIHRoaXMuZmlsZU5hbWVMZW5ndGggPSBvcHRpb25zLmZpbGVOYW1lTGVuZ3RoIHx8IERFRkFVTFRfRk5fTEVOR1RIO1xyXG5cclxuICAgIHRoaXMudXBsb2FkSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG4gICAgdGhpcy51cGxvYWRJbnB1dC50eXBlID0gXCJmaWxlXCI7XHJcbiAgICB0aGlzLnVwbG9hZElucHV0LmFjY2VwdCA9IFwiaW1hZ2UvKlwiO1xyXG5cclxuICAgIHRoaXMuZWxlbSA9IG9wdGlvbnMuZWxlbTtcclxuICAgIHRoaXMuZnBCdXR0b24gPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmZpbGUtcGlja2VyX19idXR0b24nKTtcclxuICAgIHRoaXMuZnBGaWxlTmFtZSA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuZmlsZS1waWNrZXJfX2ZpbGVuYW1lJyk7XHJcblxyXG4gICAgdGhpcy5mcEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICAgIHRoaXMudXBsb2FkSW5wdXQuY2xpY2soKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMudXBsb2FkSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZXRWaXNpYmxlRmlsZU5hbWUoKTtcclxuICAgIH0pO1xyXG5cclxufTtcclxuXHJcbkZpbGVQaWNrZXIucHJvdG90eXBlLnNldFZpc2libGVGaWxlTmFtZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBmaWxlbmFtZSA9IHRoaXMudXBsb2FkSW5wdXQudmFsdWUuc3Vic3RyaW5nKHRoaXMudXBsb2FkSW5wdXQudmFsdWUubGFzdEluZGV4T2YoJ1xcXFwnKSArIDEpO1xyXG5cclxuICAgIGxldCB2aXNpYmxlRmlsZU5hbWU7XHJcbiAgICBsZXQgcGFydFNpemUgPSB+figodGhpcy5maWxlTmFtZUxlbmd0aCAtIDEpIC8gMik7XHJcblxyXG4gICAgaWYgKGZpbGVuYW1lLmxlbmd0aCA9PT0gMClcclxuICAgICAgICB2aXNpYmxlRmlsZU5hbWUgPSBERUZBVUxUX1ZBTFVFO1xyXG4gICAgZWxzZSBpZiAoZmlsZW5hbWUubGVuZ3RoIDw9IHRoaXMuZmlsZU5hbWVMZW5ndGgpIHtcclxuICAgICAgICB0aGlzLmZwRmlsZU5hbWUudGl0bGUgPSAnJztcclxuICAgICAgICB2aXNpYmxlRmlsZU5hbWUgPSBmaWxlbmFtZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5mcEZpbGVOYW1lLnRpdGxlID0gZmlsZW5hbWU7XHJcbiAgICAgICAgdmlzaWJsZUZpbGVOYW1lID0gZmlsZW5hbWUuc2xpY2UoMCwgcGFydFNpemUpICsgJ+KApicgKyBmaWxlbmFtZS5zbGljZSgtcGFydFNpemUpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZnBGaWxlTmFtZS50ZXh0Q29udGVudCA9IHZpc2libGVGaWxlTmFtZTtcclxufTtcclxuXHJcbkZpbGVQaWNrZXIucHJvdG90eXBlLmdldEZpbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gdGhpcy51cGxvYWRJbnB1dC5maWxlc1swXTtcclxufTtcclxuXHJcbkZpbGVQaWNrZXIucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy51cGxvYWRJbnB1dC52YWx1ZSA9ICcnO1xyXG4gICAgdGhpcy5mcEZpbGVOYW1lLnRleHRDb250ZW50ID0gREVGQVVMVF9WQUxVRTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRmlsZVBpY2tlcjtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9maWxlLXBpY2tlci9pbmRleC5qcyIsImxldCBTZXJ2ZXJFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5TZXJ2ZXJFcnJvcjtcclxubGV0IENsaWVudEVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLkNsaWVudEVycm9yO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1cmwsIGZvcm1EYXRhLCBjYikge1xyXG5cdHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHR4aHIudXBsb2FkLm9ucHJvZ3Jlc3MgPSBldmVudCA9PiB7XHJcblx0XHQvL2NvbnNvbGUubG9nKGV2ZW50LmxvYWRlZCArICcgLyAnICsgZXZlbnQudG90YWwpO1xyXG5cdH07XHJcblxyXG5cdHhoci5vbmxvYWQgPSB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0bGV0IHJlc3BvbnNlO1xyXG5cclxuXHRcdGlmICh0aGlzLnJlc3BvbnNlVGV4dClcclxuXHRcdFx0cmVzcG9uc2UgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KTtcclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRjYihuZXcgU2VydmVyRXJyb3IoJ1NlcnZlciBpcyBub3QgcmVzcG9uZGluZycpKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRpZiAodGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwKVxyXG4gICAgICAgICAgICBjYihudWxsLCByZXNwb25zZSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSA0MDAgJiYgdGhpcy5zdGF0dXMgPCA1MDApXHJcbiAgICAgICAgICAgIGNiKG5ldyBDbGllbnRFcnJvcihyZXNwb25zZS5tZXNzYWdlKSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSA1MDApXHJcbiAgICAgICAgICAgIGNiKG5ldyBTZXJ2ZXJFcnJvcihyZXNwb25zZS5tZXNzYWdlKSk7XHJcblx0XHRcclxuXHR9O1xyXG5cclxuXHR4aHIub3BlbihcIlBPU1RcIiwgdXJsLCB0cnVlKTtcclxuXHR4aHIuc2V0UmVxdWVzdEhlYWRlcignWC1SZXF1ZXN0ZWQtV2l0aCcsICdYTUxIdHRwUmVxdWVzdCcpO1xyXG5cdHhoci5zZW5kKGZvcm1EYXRhKTtcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL3NlbmRGb3JtRGF0YS5qcyIsImxldCBldmVudE1peGluID0gcmVxdWlyZShMSUJTICsgJ2V2ZW50TWl4aW4nKTtcclxubGV0IENsaWVudEVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLkNsaWVudEVycm9yO1xyXG5sZXQgTWVzc2FnZU1vZGFsV2luZG93ID0gcmVxdWlyZShCTE9DS1MgKyAnbWVzc2FnZS1tb2RhbC13aW5kb3cnKTtcclxuXHJcblxyXG5sZXQgRGVzY3JpcHRpb25BZGRTZWN0aW9uID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuZWxlbSA9IG9wdGlvbnMuZWxlbTtcclxuICAgIHRoaXMuc2F2ZUJ1dHRvbiA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuYnV0dG9uJyk7XHJcbiAgICB0aGlzLnRleHRhcmVhID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy50ZXh0YXJlYSB0ZXh0YXJlYScpO1xyXG5cclxuICAgIHRoaXMuZWxlbS5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgaWYgKGUudGFyZ2V0ICE9PSB0aGlzLnNhdmVCdXR0b24pIHJldHVybjtcclxuICAgICAgICBsZXQgZGVzY3JpcHRpb24gPSB0aGlzLnRleHRhcmVhLnZhbHVlO1xyXG4gICAgICAgIGxldCBlcnJvcnMgPSByZXF1aXJlKExJQlMgKyAnY2hlY2tVc2VyRGF0YScpLmdldEVycm9yQXJyYXkoe1xyXG4gICAgICAgICAgICBkZXNjcmlwdGlvblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoZXJyb3JzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgdGhpcy5zZW5kRGVzY3JpcHRpb24odGhpcy50ZXh0YXJlYS52YWx1ZSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmVycm9yKG5ldyBDbGllbnRFcnJvcihlcnJvcnNbMF0ubWVzc2FnZSkpO1xyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5EZXNjcmlwdGlvbkFkZFNlY3Rpb24ucHJvdG90eXBlLnNlbmREZXNjcmlwdGlvbiA9IGZ1bmN0aW9uIChkZXNjcmlwdGlvbikge1xyXG4gICAgcmVxdWlyZShMSUJTICsgJ3NlbmRSZXF1ZXN0Jykoe1xyXG4gICAgICAgIGRlc2NyaXB0aW9uXHJcbiAgICB9LCAnUE9TVCcsICcvc2V0dGluZ3MnLCAoZXJyLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbWVzc2FnZU1vZGFsV2luZG93ID0gbmV3IE1lc3NhZ2VNb2RhbFdpbmRvdyh7bWVzc2FnZTogJ0Rlc2NyaXB0aW9uIGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSBjaGFuZ2VkJ30pO1xyXG4gICAgICAgIG1lc3NhZ2VNb2RhbFdpbmRvdy5zaG93KCk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbmZvciAobGV0IGtleSBpbiBldmVudE1peGluKSB7XHJcbiAgICBEZXNjcmlwdGlvbkFkZFNlY3Rpb24ucHJvdG90eXBlW2tleV0gPSBldmVudE1peGluW2tleV07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRGVzY3JpcHRpb25BZGRTZWN0aW9uO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL2Rlc2NyaXB0aW9uLWFkZC1zZWN0aW9uL2luZGV4LmpzIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6REE7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBOzs7QUFFQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBOzs7Ozs7OztBQ3RRQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7OztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDYkE7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFHQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBZEE7QUFBQTtBQWVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQzFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQy9DQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3JEQTs7Ozs7Ozs7O0FDQUE7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOzs7QUFHQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNKQTs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBRUE7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Iiwic291cmNlUm9vdCI6IiJ9