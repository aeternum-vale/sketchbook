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
	        checks: [checks.nonEmpty(), checks.max(30), checks.min(5), {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMjNiZTJmOTkwZDQwYzAyYWU1M2IiLCJ3ZWJwYWNrOi8vLy4vc2V0dGluZ3Mvc2NyaXB0LmpzIiwid2VicGFjazovLy8uLi9ibG9ja3MvZ2xvYmFsLWVycm9yLWhhbmRsZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2NvbXBvbmVudEVycm9ycy5qcyIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL21lc3NhZ2UtbW9kYWwtd2luZG93L2luZGV4LmpzIiwid2VicGFjazovLy8uLi9ibG9ja3MvbW9kYWwvaW5kZXguanMiLCJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2V2ZW50TWl4aW4uanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9zcGlubmVyL2luZGV4LmpzIiwid2VicGFjazovLy8uLi9ibG9ja3Mvc3Bpbm5lci9tYXJrdXAiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9tZXNzYWdlLW1vZGFsLXdpbmRvdy93aW5kb3ciLCJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2NoZWNrVXNlckRhdGEuanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9mb3JtL2luZGV4LmpzIiwid2VicGFjazovLy9EOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9zZW5kUmVxdWVzdC5qcyIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2Ryb3Bkb3duL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NldHRpbmdzL3N0eWxlLmxlc3MiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9zb2NpYWwtY29sbGVjdGlvbi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvcmVuZGVyRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL3NvY2lhbC1jb2xsZWN0aW9uL3NvY2lhbCIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL3VwbG9hZC1hdmF0YXItc2VjdGlvbi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2ZpbGUtcGlja2VyL2luZGV4LmpzIiwid2VicGFjazovLy9EOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9zZW5kRm9ybURhdGEuanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9kZXNjcmlwdGlvbi1hZGQtc2VjdGlvbi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbiBcdHZhciBwYXJlbnRKc29ucEZ1bmN0aW9uID0gd2luZG93W1wid2VicGFja0pzb25wXCJdO1xuIFx0d2luZG93W1wid2VicGFja0pzb25wXCJdID0gZnVuY3Rpb24gd2VicGFja0pzb25wQ2FsbGJhY2soY2h1bmtJZHMsIG1vcmVNb2R1bGVzKSB7XG4gXHRcdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuIFx0XHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcbiBcdFx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMCwgY2FsbGJhY2tzID0gW107XG4gXHRcdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuIFx0XHRcdGlmKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSlcbiBcdFx0XHRcdGNhbGxiYWNrcy5wdXNoLmFwcGx5KGNhbGxiYWNrcywgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKTtcbiBcdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuIFx0XHR9XG4gXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG4gXHRcdFx0XHRtb2R1bGVzW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHR9XG4gXHRcdH1cbiBcdFx0aWYocGFyZW50SnNvbnBGdW5jdGlvbikgcGFyZW50SnNvbnBGdW5jdGlvbihjaHVua0lkcywgbW9yZU1vZHVsZXMpO1xuIFx0XHR3aGlsZShjYWxsYmFja3MubGVuZ3RoKVxuIFx0XHRcdGNhbGxiYWNrcy5zaGlmdCgpLmNhbGwobnVsbCwgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdH07XG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4gXHQvLyBcIjBcIiBtZWFucyBcImFscmVhZHkgbG9hZGVkXCJcbiBcdC8vIEFycmF5IG1lYW5zIFwibG9hZGluZ1wiLCBhcnJheSBjb250YWlucyBjYWxsYmFja3NcbiBcdHZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG4gXHRcdDk6MCxcbiBcdFx0MTowXG4gXHR9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cbiBcdC8vIFRoaXMgZmlsZSBjb250YWlucyBvbmx5IHRoZSBlbnRyeSBjaHVuay5cbiBcdC8vIFRoZSBjaHVuayBsb2FkaW5nIGZ1bmN0aW9uIGZvciBhZGRpdGlvbmFsIGNodW5rc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5lID0gZnVuY3Rpb24gcmVxdWlyZUVuc3VyZShjaHVua0lkLCBjYWxsYmFjaykge1xuIFx0XHQvLyBcIjBcIiBpcyB0aGUgc2lnbmFsIGZvciBcImFscmVhZHkgbG9hZGVkXCJcbiBcdFx0aWYoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKVxuIFx0XHRcdHJldHVybiBjYWxsYmFjay5jYWxsKG51bGwsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIGFuIGFycmF5IG1lYW5zIFwiY3VycmVudGx5IGxvYWRpbmdcIi5cbiBcdFx0aWYoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdICE9PSB1bmRlZmluZWQpIHtcbiBcdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0ucHVzaChjYWxsYmFjayk7XG4gXHRcdH0gZWxzZSB7XG4gXHRcdFx0Ly8gc3RhcnQgY2h1bmsgbG9hZGluZ1xuIFx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IFtjYWxsYmFja107XG4gXHRcdFx0dmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuIFx0XHRcdHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiBcdFx0XHRzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuIFx0XHRcdHNjcmlwdC5jaGFyc2V0ID0gJ3V0Zi04JztcbiBcdFx0XHRzY3JpcHQuYXN5bmMgPSB0cnVlO1xuXG4gXHRcdFx0c2NyaXB0LnNyYyA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIFwiXCIgKyBjaHVua0lkICsgXCIuXCIgKyAoe31bY2h1bmtJZF18fGNodW5rSWQpICsgXCIuanNcIjtcbiBcdFx0XHRoZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDIzYmUyZjk5MGQ0MGMwMmFlNTNiIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgJy4vc3R5bGUubGVzcyc7XHJcblxyXG5sZXQgR2xvYmFsRXJyb3JIYW5kbGVyID0gcmVxdWlyZShCTE9DS1MgKyAnZ2xvYmFsLWVycm9yLWhhbmRsZXInKTtcclxubGV0IGdsb2JhbEVycm9ySGFuZGxlciA9IG5ldyBHbG9iYWxFcnJvckhhbmRsZXIoKTtcclxuXHJcbmxldCBEcm9wZG93biA9IHJlcXVpcmUoQkxPQ0tTICsgJ2Ryb3Bkb3duJyk7XHJcbmxldCBTb2NpYWxDb2xsZWN0aW9uID0gcmVxdWlyZShCTE9DS1MgKyAnc29jaWFsLWNvbGxlY3Rpb24nKTtcclxubGV0IFVwbG9hZEF2YXRhclNlY3Rpb24gPSByZXF1aXJlKEJMT0NLUyArICd1cGxvYWQtYXZhdGFyLXNlY3Rpb24nKTtcclxubGV0IERlc2NyaXB0aW9uQWRkU2VjdGlvbiA9IHJlcXVpcmUoQkxPQ0tTICsgJ2Rlc2NyaXB0aW9uLWFkZC1zZWN0aW9uJyk7XHJcbmxldCBGb3JtID0gcmVxdWlyZShCTE9DS1MgKyAnZm9ybScpO1xyXG5sZXQgTWVzc2FnZU1vZGFsV2luZG93ID0gcmVxdWlyZShCTE9DS1MgKyAnbWVzc2FnZS1tb2RhbC13aW5kb3cnKTtcclxuXHJcbmxldCB1c2VyTWVudURyb3Bkb3duID0gbmV3IERyb3Bkb3duKHtcclxuICAgIGVsZW06IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2VyLW1lbnUnKSxcclxuICAgIGNsYXNzTmFtZTogJ2hlYWRlci1lbGVtZW50J1xyXG59KTtcclxuXHJcbmxldCBzb2NpYWxDb2xsZWN0aW9uID0gbmV3IFNvY2lhbENvbGxlY3Rpb24oe1xyXG4gICAgZWxlbTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NvY2lhbC1jb2xsZWN0aW9uJylcclxufSk7XHJcblxyXG5sZXQgdXBsb2FkQXZhdGFyU2VjdGlvbiA9IG5ldyBVcGxvYWRBdmF0YXJTZWN0aW9uKHtcclxuICAgIGVsZW06IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1cGxvYWQtYXZhdGFyLXNlY3Rpb24nKVxyXG59KTtcclxuXHJcbmxldCBkZXNjcmlwdGlvbkFkZFNlY3Rpb24gPSBuZXcgRGVzY3JpcHRpb25BZGRTZWN0aW9uKHtcclxuICAgIGVsZW06IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZXNjcmlwdGlvbi1hZGQtc2VjdGlvbicpXHJcbn0pO1xyXG5cclxubGV0IHBhc3N3b3JkQ2hhbmdlRm9ybSA9IG5ldyBGb3JtKHtcclxuICAgIGVsZW06IGRvY3VtZW50LmZvcm1zWydjaGFuZ2UtcGFzc3dvcmQnXSxcclxuICAgIGZpZWxkczoge1xyXG4gICAgICAgICdvbGQtcGFzc3dvcmQnOiB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRvcjogJ25vbi1lbXB0eScsXHJcbiAgICAgICAgICAgIGFsaWFzOiAnb2xkIHBhc3N3b3JkJyxcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAnbmV3LXBhc3N3b3JkJzoge1xyXG4gICAgICAgICAgICB2YWxpZGF0b3I6ICdwYXNzd29yZCcsXHJcbiAgICAgICAgICAgIGFsaWFzOiAnbmV3IHBhc3N3b3JkJyxcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAnbmV3LWFnYWluJzoge1xyXG4gICAgICAgICAgICB2YWxpZGF0b3I6ICdwYXNzd29yZC1hZ2FpbicsXHJcbiAgICAgICAgICAgIGFsaWFzOiAnbmV3IHBhc3N3b3JkJyxcclxuICAgICAgICAgICAgcGFzc3dvcmQ6ICduZXctcGFzc3dvcmQnLFxyXG4gICAgICAgICAgICBleHRyYTogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICB1cmw6ICcvc2V0dGluZ3MnXHJcbn0pO1xyXG5cclxucGFzc3dvcmRDaGFuZ2VGb3JtLm9uKCdmb3JtX3NlbnQnLCBlID0+IHtcclxuICAgIGxldCBtZXNzYWdlTW9kYWxXaW5kb3cgPSBuZXcgTWVzc2FnZU1vZGFsV2luZG93KHttZXNzYWdlOiAnUGFzc3dvcmQgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IGNoYW5nZWQnfSk7XHJcbiAgICBtZXNzYWdlTW9kYWxXaW5kb3cuc2hvdygpO1xyXG59KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zZXR0aW5ncy9zY3JpcHQuanMiLCJsZXQgR2xvYmFsRXJyb3JIYW5kbGVyID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZSA9PiB7XHJcbiAgICAgICAgbGV0IGVycm9yID0gZS5kZXRhaWw7XHJcbiAgICAgICAgdGhpcy5jYWxsKGVycm9yKTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuR2xvYmFsRXJyb3JIYW5kbGVyLnByb3RvdHlwZS5jYWxsID0gZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICByZXF1aXJlLmVuc3VyZShbTElCUyArICdjb21wb25lbnRFcnJvcnMnLCBCTE9DS1MgKyAnbWVzc2FnZS1tb2RhbC13aW5kb3cnXSwgZnVuY3Rpb24gKHJlcXVpcmUpIHtcclxuICAgICAgICBsZXQgQ29tcG9uZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ29tcG9uZW50RXJyb3I7XHJcbiAgICAgICAgbGV0IE1lc3NhZ2VNb2RhbFdpbmRvdyA9IHJlcXVpcmUoQkxPQ0tTICsgJ21lc3NhZ2UtbW9kYWwtd2luZG93Jyk7XHJcblxyXG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIENvbXBvbmVudEVycm9yKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvci5zdGF0dXMgPT09IDQwMSkge1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZGlyZWN0ZWRfdXJsJywgd2luZG93LmxvY2F0aW9uLmhyZWYpO1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gJy9hdXRob3JpemF0aW9uJztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBtZXNzYWdlTW9kYWxXaW5kb3cgPSBuZXcgTWVzc2FnZU1vZGFsV2luZG93KHttZXNzYWdlOiBlcnJvci5tZXNzYWdlfSk7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlTW9kYWxXaW5kb3cuYWN0aXZhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2xvYmFsRXJyb3JIYW5kbGVyO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvZ2xvYmFsLWVycm9yLWhhbmRsZXIvaW5kZXguanMiLCJmdW5jdGlvbiBDdXN0b21FcnJvcihtZXNzYWdlKSB7XHJcblx0dGhpcy5uYW1lID0gXCJDdXN0b21FcnJvclwiO1xyXG5cdHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcblxyXG5cdGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSlcclxuXHRcdEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIEN1c3RvbUVycm9yKTtcclxuXHRlbHNlXHJcblx0XHR0aGlzLnN0YWNrID0gKG5ldyBFcnJvcigpKS5zdGFjaztcclxufVxyXG5DdXN0b21FcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XHJcbkN1c3RvbUVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEN1c3RvbUVycm9yO1xyXG5cclxuXHJcbmZ1bmN0aW9uIENvbXBvbmVudEVycm9yKG1lc3NhZ2UsIHN0YXR1cykge1xyXG5cdEN1c3RvbUVycm9yLmNhbGwodGhpcywgbWVzc2FnZSB8fCAnQW4gZXJyb3IgaGFzIG9jY3VycmVkJyApO1xyXG5cdHRoaXMubmFtZSA9IFwiQ29tcG9uZW50RXJyb3JcIjtcclxuXHR0aGlzLnN0YXR1cyA9IHN0YXR1cztcclxufVxyXG5Db21wb25lbnRFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEN1c3RvbUVycm9yLnByb3RvdHlwZSk7XHJcbkNvbXBvbmVudEVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENvbXBvbmVudEVycm9yO1xyXG5cclxuZnVuY3Rpb24gQ2xpZW50RXJyb3IobWVzc2FnZSwgZGV0YWlsLCBzdGF0dXMpIHtcclxuXHRDb21wb25lbnRFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ0FuIGVycm9yIGhhcyBvY2N1cnJlZC4gQ2hlY2sgaWYgamF2YXNjcmlwdCBpcyBlbmFibGVkJywgc3RhdHVzKTtcclxuXHR0aGlzLm5hbWUgPSBcIkNsaWVudEVycm9yXCI7XHJcblx0dGhpcy5kZXRhaWwgPSBkZXRhaWw7XHJcbn1cclxuQ2xpZW50RXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb21wb25lbnRFcnJvci5wcm90b3R5cGUpO1xyXG5DbGllbnRFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDbGllbnRFcnJvcjtcclxuXHJcblxyXG5mdW5jdGlvbiBJbWFnZU5vdEZvdW5kKG1lc3NhZ2UpIHtcclxuICAgIENsaWVudEVycm9yLmNhbGwodGhpcywgbWVzc2FnZSB8fCAnSW1hZ2Ugbm90IGZvdW5kLiBJdCBwcm9iYWJseSBoYXMgYmVlbiByZW1vdmVkJywgbnVsbCwgNDA0KTtcclxuICAgIHRoaXMubmFtZSA9IFwiSW1hZ2VOb3RGb3VuZFwiO1xyXG59XHJcbkltYWdlTm90Rm91bmQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDbGllbnRFcnJvci5wcm90b3R5cGUpO1xyXG5JbWFnZU5vdEZvdW5kLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEltYWdlTm90Rm91bmQ7XHJcblxyXG5mdW5jdGlvbiBTZXJ2ZXJFcnJvcihtZXNzYWdlLCBzdGF0dXMpIHtcclxuXHRDb21wb25lbnRFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ1RoZXJlIGlzIHNvbWUgZXJyb3Igb24gdGhlIHNlcnZlciBzaWRlJywgc3RhdHVzKTtcclxuXHR0aGlzLm5hbWUgPSBcIlNlcnZlckVycm9yXCI7XHJcbn1cclxuU2VydmVyRXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb21wb25lbnRFcnJvci5wcm90b3R5cGUpO1xyXG5TZXJ2ZXJFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTZXJ2ZXJFcnJvcjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdENvbXBvbmVudEVycm9yLFxyXG5cdENsaWVudEVycm9yLFxyXG4gICAgSW1hZ2VOb3RGb3VuZCxcclxuXHRTZXJ2ZXJFcnJvclxyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvY29tcG9uZW50RXJyb3JzLmpzIiwibGV0IE1vZGFsID0gcmVxdWlyZShCTE9DS1MgKyAnbW9kYWwnKTtcclxuXHJcbmxldCBNZXNzYWdlTW9kYWxXaW5kb3cgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgTW9kYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgIHRoaXMuZWxlbSA9IG51bGw7XHJcbiAgICB0aGlzLmVsZW1JZCA9ICdtZXNzYWdlLW1vZGFsLXdpbmRvdyc7XHJcbiAgICB0aGlzLmNhcHRpb24gPSBvcHRpb25zICYmIG9wdGlvbnMuY2FwdGlvbiB8fCAnbWVzc2FnZSc7XHJcbiAgICB0aGlzLm1lc3NhZ2UgPSBvcHRpb25zICYmIG9wdGlvbnMubWVzc2FnZSB8fCAnWW91IHdlcmUgbm90IHN1cHBvc2UgdG8gc2VlIHRoaXMhIFNlZW1zIGxpa2Ugc29tZXRoaW5nIGlzIGJyb2tlbiA6KCc7XHJcblxyXG59O1xyXG5NZXNzYWdlTW9kYWxXaW5kb3cucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShNb2RhbC5wcm90b3R5cGUpO1xyXG5NZXNzYWdlTW9kYWxXaW5kb3cucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTWVzc2FnZU1vZGFsV2luZG93O1xyXG5cclxuTWVzc2FnZU1vZGFsV2luZG93LnByb3RvdHlwZS5zZXRFbGVtID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5zZXRXaW5kb3dIdG1sKCk7XHJcbiAgICB0aGlzLmVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmVsZW1JZCk7XHJcbiAgICBpZiAoIXRoaXMuZWxlbSlcclxuICAgICAgICB0aGlzLmVsZW0gPSB0aGlzLnJlbmRlcldpbmRvdyh0aGlzLndpbmRvd0h0bWwpO1xyXG4gICAgdGhpcy5zZXRMaXN0ZW5lcnMoKTtcclxuICAgIHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyJykudGV4dENvbnRlbnQgPSB0aGlzLmNhcHRpb247XHJcbiAgICB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLm1lc3NhZ2UtbW9kYWwtd2luZG93X19tZXNzYWdlJykudGV4dENvbnRlbnQgPSB0aGlzLm1lc3NhZ2U7XHJcblxyXG4gICAgdGhpcy5lbGVtLm9uY2xpY2sgPSBlID0+IHtcclxuICAgICAgICB0aGlzLm9uRWxlbUNsaWNrKGUpO1xyXG4gICAgICAgIGlmIChlLnRhcmdldC5tYXRjaGVzKCcubWVzc2FnZS1tb2RhbC13aW5kb3dfX29rLWJ1dHRvbicpKVxyXG4gICAgICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcclxuICAgIH07XHJcbn07XHJcblxyXG5NZXNzYWdlTW9kYWxXaW5kb3cucHJvdG90eXBlLnNldFdpbmRvd0h0bWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLndpbmRvd0h0bWwgPSByZXF1aXJlKGBodG1sLWxvYWRlciEuL3dpbmRvd2ApO1xyXG59O1xyXG5cclxuTWVzc2FnZU1vZGFsV2luZG93LnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgTW9kYWwucHJvdG90eXBlLnNob3cuYXBwbHkodGhpcyk7XHJcblxyXG4gICAgaWYgKCF0aGlzLmVsZW0pXHJcbiAgICAgICAgdGhpcy5zZXRFbGVtKCk7XHJcblxyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3dpbmRvd19pbnZpc2libGUnKTtcclxufTtcclxuXHJcbk1lc3NhZ2VNb2RhbFdpbmRvdy5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIE1vZGFsLnByb3RvdHlwZS5oaWRlLmFwcGx5KHRoaXMpO1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ3dpbmRvd19pbnZpc2libGUnKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVzc2FnZU1vZGFsV2luZG93O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL21lc3NhZ2UtbW9kYWwtd2luZG93L2luZGV4LmpzIiwibGV0IGV2ZW50TWl4aW4gPSByZXF1aXJlKExJQlMgKyAnZXZlbnRNaXhpbicpO1xyXG5sZXQgU3Bpbm5lciA9IHJlcXVpcmUoQkxPQ0tTICsgJ3NwaW5uZXInKTtcclxuXHJcbmxldCBNb2RhbCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcclxuICAgIHRoaXMuc3RhdHVzID0gb3B0aW9ucyAmJiBvcHRpb25zLnN0YXR1cyB8fCBNb2RhbC5zdGF0dXNlcy5NSU5PUjtcclxufTtcclxuXHJcbk1vZGFsLnN0YXR1c2VzID0ge1xyXG4gICAgTUFKT1I6IDEsXHJcbiAgICBNSU5PUjogMlxyXG59O1xyXG5cclxuTW9kYWwucHJvdG90eXBlLm9uRWxlbUNsaWNrID0gZnVuY3Rpb24gKGUpIHtcclxuICAgIGlmIChlLnRhcmdldC5tYXRjaGVzKCcubW9kYWwtY2xvc2UtYnV0dG9uJykpXHJcbiAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XHJcbn07XHJcblxyXG5Nb2RhbC5wcm90b3R5cGUuc2V0TGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5saXN0ZW5lcnMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICB0aGlzLmVsZW0uYWRkRXZlbnRMaXN0ZW5lcihpdGVtLmV2ZW50TmFtZSwgaXRlbS5jYik7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbk1vZGFsLnNldEJhY2tkcm9wID0gZnVuY3Rpb24gKHN0YXR1cykge1xyXG4gICAgaWYgKHN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpIHtcclxuICAgICAgICBNb2RhbC5taW5vckJhY2tkcm9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tkcm9wX21pbm9yJyk7XHJcbiAgICAgICAgaWYgKCFNb2RhbC5taW5vckJhY2tkcm9wKVxyXG4gICAgICAgICAgICBNb2RhbC5taW5vckJhY2tkcm9wID0gTW9kYWwucmVuZGVyQmFja2Ryb3AoJ21pbm9yJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIE1vZGFsLm1ham9yQmFja2Ryb3AgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja2Ryb3BfbWFqb3InKTtcclxuICAgICAgICBpZiAoIU1vZGFsLm1ham9yQmFja2Ryb3ApXHJcbiAgICAgICAgICAgIE1vZGFsLm1ham9yQmFja2Ryb3AgPSBNb2RhbC5yZW5kZXJCYWNrZHJvcCgnbWFqb3InKTtcclxuICAgIH1cclxufTtcclxuXHJcbk1vZGFsLnNldFdyYXBwZXIgPSBmdW5jdGlvbiAoc3RhdHVzKSB7XHJcbiAgICBpZiAoc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUikge1xyXG4gICAgICAgIE1vZGFsLm1pbm9yV3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC13cmFwcGVyLW1pbm9yJyk7XHJcbiAgICAgICAgaWYgKCFNb2RhbC5taW5vcldyYXBwZXIpXHJcbiAgICAgICAgICAgIE1vZGFsLm1pbm9yV3JhcHBlciA9IE1vZGFsLnJlbmRlcldyYXBwZXIoJ21pbm9yJyk7XHJcbiAgICAgICAgTW9kYWwubWlub3JXcmFwcGVyLm9uY2xpY2sgPSBlID0+IHtcclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0ICYmICFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ21vZGFsLXdyYXBwZXJfbWlub3InKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAoTW9kYWwubWlub3JBY3RpdmUpXHJcbiAgICAgICAgICAgICAgICBNb2RhbC5taW5vclF1ZXVlWzBdLmRlYWN0aXZhdGUoKTtcclxuICAgICAgICB9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBNb2RhbC5tYWpvcldyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtd3JhcHBlci1tYWpvcicpO1xyXG4gICAgICAgIGlmICghTW9kYWwubWFqb3JXcmFwcGVyKVxyXG4gICAgICAgICAgICBNb2RhbC5tYWpvcldyYXBwZXIgPSBNb2RhbC5yZW5kZXJXcmFwcGVyKCdtYWpvcicpO1xyXG4gICAgICAgIE1vZGFsLm1ham9yV3JhcHBlci5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldCAmJiAhZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2RhbC13cmFwcGVyX21ham9yJykpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKE1vZGFsLm1ham9yQWN0aXZlKVxyXG4gICAgICAgICAgICAgICAgTW9kYWwubWFqb3JRdWV1ZVswXS5kZWFjdGl2YXRlKCk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufTtcclxuXHJcbk1vZGFsLnJlbmRlckJhY2tkcm9wID0gZnVuY3Rpb24gKHR5cGUpIHtcclxuICAgIGxldCBiYWNrZHJvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xyXG4gICAgYmFja2Ryb3AuY2xhc3NOYW1lID0gJ2JhY2tkcm9wIGJhY2tkcm9wX2ludmlzaWJsZSc7XHJcbiAgICBiYWNrZHJvcC5jbGFzc0xpc3QuYWRkKGBiYWNrZHJvcF8ke3R5cGV9YCk7XHJcbiAgICBiYWNrZHJvcC5pZCA9IGBiYWNrZHJvcC0ke3R5cGV9YDtcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYmFja2Ryb3ApO1xyXG4gICAgcmV0dXJuIGJhY2tkcm9wO1xyXG59O1xyXG5cclxuTW9kYWwucmVuZGVyV3JhcHBlciA9IGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICBsZXQgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xyXG4gICAgd3JhcHBlci5jbGFzc05hbWUgPSAnbW9kYWwtd3JhcHBlciBtb2RhbC13cmFwcGVyX2ludmlzaWJsZSc7XHJcbiAgICB3cmFwcGVyLmNsYXNzTGlzdC5hZGQoYG1vZGFsLXdyYXBwZXJfJHt0eXBlfWApO1xyXG4gICAgd3JhcHBlci5pZCA9IGBtb2RhbC13cmFwcGVyLSR7dHlwZX1gO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcclxuICAgIHJldHVybiB3cmFwcGVyO1xyXG59O1xyXG5cclxuTW9kYWwucHJvdG90eXBlLnJlbmRlcldpbmRvdyA9IGZ1bmN0aW9uIChodG1sKSB7XHJcblxyXG4gICAgbGV0IHBhcmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xyXG4gICAgcGFyZW50LmlubmVySFRNTCA9IGh0bWw7XHJcbiAgICBsZXQgd25kID0gcGFyZW50LmZpcnN0RWxlbWVudENoaWxkO1xyXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUilcclxuICAgICAgICBNb2RhbC5taW5vcldyYXBwZXIuYXBwZW5kQ2hpbGQod25kKTtcclxuICAgIGVsc2VcclxuICAgICAgICBNb2RhbC5tYWpvcldyYXBwZXIuYXBwZW5kQ2hpbGQod25kKTtcclxuXHJcbiAgICBwYXJlbnQucmVtb3ZlKCk7XHJcbiAgICByZXR1cm4gd25kO1xyXG59O1xyXG5cclxuTW9kYWwucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5zdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKSB7XHJcbiAgICAgICAgaWYgKCFNb2RhbC5taW5vckJhY2tkcm9wKVxyXG4gICAgICAgICAgICBNb2RhbC5zZXRCYWNrZHJvcChNb2RhbC5zdGF0dXNlcy5NSU5PUik7XHJcblxyXG4gICAgICAgIGlmICghTW9kYWwubWlub3JXcmFwcGVyKVxyXG4gICAgICAgICAgICBNb2RhbC5zZXRXcmFwcGVyKE1vZGFsLnN0YXR1c2VzLk1JTk9SKTtcclxuXHJcbiAgICAgICAgTW9kYWwubWlub3JXcmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLXdyYXBwZXJfaW52aXNpYmxlJyk7XHJcbiAgICAgICAgTW9kYWwubWlub3JCYWNrZHJvcC5jbGFzc0xpc3QucmVtb3ZlKCdiYWNrZHJvcF9pbnZpc2libGUnKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICghTW9kYWwubWFqb3JCYWNrZHJvcClcclxuICAgICAgICAgICAgTW9kYWwuc2V0QmFja2Ryb3AoTW9kYWwuc3RhdHVzZXMuTUFKT1IpO1xyXG5cclxuICAgICAgICBpZiAoIU1vZGFsLm1ham9yV3JhcHBlcilcclxuICAgICAgICAgICAgTW9kYWwuc2V0V3JhcHBlcihNb2RhbC5zdGF0dXNlcy5NQUpPUik7XHJcblxyXG4gICAgICAgIE1vZGFsLm1ham9yV3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC13cmFwcGVyX2ludmlzaWJsZScpO1xyXG4gICAgICAgIE1vZGFsLm1ham9yQmFja2Ryb3AuY2xhc3NMaXN0LnJlbW92ZSgnYmFja2Ryb3BfaW52aXNpYmxlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xyXG5cclxufTtcclxuXHJcblxyXG5Nb2RhbC5wcm90b3R5cGUuYWN0aXZhdGUgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgIGlmICh0aGlzLmVsZW1JZCA9PT0gJ3NwaW5uZXInKSB7XHJcbiAgICAgICAgbGV0IHNwaW5uZXIgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMub24oJ3NwaW5uZXJfaG9zdC1sb2FkZWQnLCBlID0+IHtcclxuICAgICAgICAgICAgbGV0IG5ld0hvc3QgPSBlLmRldGFpbC5ob3N0O1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUilcclxuICAgICAgICAgICAgICAgIE1vZGFsLm1pbm9yUXVldWUuc3BsaWNlKE1vZGFsLm1pbm9yUXVldWUuaW5kZXhPZihzcGlubmVyKSArIDEsIDAsIG5ld0hvc3QpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBNb2RhbC5tYWpvclF1ZXVlLnNwbGljZShNb2RhbC5tYWpvclF1ZXVlLmluZGV4T2Yoc3Bpbm5lcikgKyAxLCAwLCBuZXdIb3N0KTtcclxuXHJcbiAgICAgICAgICAgIHNwaW5uZXIuZGVhY3RpdmF0ZShlLmRldGFpbC5vcHRpb25zKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpIHtcclxuICAgICAgICAgICAgTW9kYWwubWlub3JRdWV1ZS5wdXNoKHRoaXMpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhNb2RhbC5taW5vclF1ZXVlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coTW9kYWwubWFqb3JRdWV1ZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIU1vZGFsLm1pbm9yQWN0aXZlKVxyXG4gICAgICAgICAgICAgICAgTW9kYWwubWlub3JTaG93KG9wdGlvbnMpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBNb2RhbC5tYWpvclF1ZXVlLnB1c2godGhpcyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKE1vZGFsLm1pbm9yUXVldWUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhNb2RhbC5tYWpvclF1ZXVlKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghTW9kYWwubWFqb3JBY3RpdmUpXHJcblxyXG4gICAgICAgICAgICAgICAgTW9kYWwubWFqb3JTaG93KG9wdGlvbnMpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5Nb2RhbC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpIHtcclxuICAgICAgICAvL1RPRE8gbm90IG5lY2Nlc3NhcnkgaWYgcXVldWUgaXMgbm90IGVtcHR5XHJcbiAgICAgICAgTW9kYWwubWlub3JXcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ21vZGFsLXdyYXBwZXJfaW52aXNpYmxlJyk7XHJcbiAgICAgICAgTW9kYWwubWlub3JCYWNrZHJvcC5jbGFzc0xpc3QuYWRkKCdiYWNrZHJvcF9pbnZpc2libGUnKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIE1vZGFsLm1ham9yV3JhcHBlci5jbGFzc0xpc3QuYWRkKCdtb2RhbC13cmFwcGVyX2ludmlzaWJsZScpO1xyXG4gICAgICAgIE1vZGFsLm1ham9yQmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgnYmFja2Ryb3BfaW52aXNpYmxlJyk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuTW9kYWwucHJvdG90eXBlLmRlYWN0aXZhdGUgPSBmdW5jdGlvbiAobmV4dFdpbmRvd09wdGlvbnMsIGhpZGVPcHRpb25zKSB7XHJcblxyXG4gICAgdGhpcy5oaWRlKGhpZGVPcHRpb25zKTtcclxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XHJcbiAgICBpZiAodGhpcy5zdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKSB7XHJcbiAgICAgICAgTW9kYWwubWlub3JBY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICBNb2RhbC5taW5vclF1ZXVlLnNoaWZ0KCk7XHJcbiAgICAgICAgTW9kYWwubWlub3JTaG93KG5leHRXaW5kb3dPcHRpb25zKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgTW9kYWwubWFqb3JBY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICBNb2RhbC5tYWpvclF1ZXVlLnNoaWZ0KCk7XHJcbiAgICAgICAgTW9kYWwubWFqb3JTaG93KG5leHRXaW5kb3dPcHRpb25zKTtcclxuICAgIH1cclxuICAgIHRoaXMudHJpZ2dlcignbW9kYWwtd2luZG93X2RlYWN0aXZhdGVkJyk7XHJcbn07XHJcblxyXG5Nb2RhbC5taW5vckFjdGl2ZSA9IGZhbHNlO1xyXG5Nb2RhbC5tYWpvckFjdGl2ZSA9IGZhbHNlO1xyXG5Nb2RhbC5taW5vclF1ZXVlID0gW107XHJcbk1vZGFsLm1ham9yUXVldWUgPSBbXTtcclxuXHJcbk1vZGFsLnNwaW5uZXIgPSBuZXcgU3Bpbm5lcigpO1xyXG5Nb2RhbC5zcGlubmVyLnN0YXR1cyA9IE1vZGFsLnN0YXR1c2VzLk1BSk9SO1xyXG5cclxuTW9kYWwuc2hvd1NwaW5uZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBNb2RhbC5wcm90b3R5cGUuc2hvdy5jYWxsKE1vZGFsLnNwaW5uZXIpO1xyXG5cclxuICAgIGlmICghTW9kYWwuc3Bpbm5lci5lbGVtKVxyXG4gICAgICAgIE1vZGFsLnNwaW5uZXIuZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGlubmVyJyk7XHJcbiAgICBpZiAoIU1vZGFsLnNwaW5uZXIuZWxlbSlcclxuICAgICAgICBNb2RhbC5zcGlubmVyLmVsZW0gPSBNb2RhbC5wcm90b3R5cGUucmVuZGVyV2luZG93LmNhbGwoTW9kYWwuc3Bpbm5lciwgU3Bpbm5lci5odG1sKTtcclxuXHJcbiAgICBNb2RhbC5zcGlubmVyLnNob3coKTtcclxufTtcclxuXHJcbk1vZGFsLmhpZGVTcGlubmVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgTW9kYWwuc3Bpbm5lci5oaWRlKCk7XHJcbn07XHJcblxyXG5cclxuTW9kYWwubWlub3JTaG93ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIGxldCBuZXh0TW9kYWxXaW5kb3cgPSBNb2RhbC5taW5vclF1ZXVlWzBdO1xyXG4gICAgaWYgKG5leHRNb2RhbFdpbmRvdykge1xyXG4gICAgICAgIGxldCBwcm9taXNlID0gbmV4dE1vZGFsV2luZG93LnNob3cob3B0aW9ucyk7XHJcbiAgICAgICAgaWYgKHByb21pc2UpXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgTW9kYWwubWlub3JBY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgTW9kYWwubWlub3JBY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgTW9kYWwubWlub3JBY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5Nb2RhbC5tYWpvclNob3cgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgIGxldCBuZXh0TW9kYWxXaW5kb3cgPSBNb2RhbC5tYWpvclF1ZXVlWzBdO1xyXG5cclxuICAgIGlmIChuZXh0TW9kYWxXaW5kb3cpIHtcclxuXHJcbiAgICAgICAgTW9kYWwuc2hvd1NwaW5uZXIoKTtcclxuICAgICAgICBsZXQgcHJvbWlzZSA9IG5leHRNb2RhbFdpbmRvdy5zaG93KG9wdGlvbnMpO1xyXG5cclxuICAgICAgICBpZiAocHJvbWlzZSlcclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2UudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBNb2RhbC5tYWpvckFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBNb2RhbC5oaWRlU3Bpbm5lcigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgTW9kYWwubWFqb3JBY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICBNb2RhbC5oaWRlU3Bpbm5lcigpO1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgTW9kYWwubWFqb3JBY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5mb3IgKGxldCBrZXkgaW4gZXZlbnRNaXhpbilcclxuICAgIE1vZGFsLnByb3RvdHlwZVtrZXldID0gZXZlbnRNaXhpbltrZXldO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTW9kYWw7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvbW9kYWwvaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcblx0b246IGZ1bmN0aW9uKGV2ZW50TmFtZSwgY2IpIHtcclxuXHRcdGlmICh0aGlzLmVsZW0pXHJcblx0XHRcdHRoaXMuZWxlbS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2IpO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHR0aGlzLmxpc3RlbmVycy5wdXNoKHtcclxuXHRcdFx0XHRldmVudE5hbWUsXHJcblx0XHRcdFx0Y2JcclxuXHRcdFx0fSk7XHJcblx0fSxcclxuXHJcblx0dHJpZ2dlcjogZnVuY3Rpb24oZXZlbnROYW1lLCBkZXRhaWwpIHtcclxuXHRcdHRoaXMuZWxlbS5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChldmVudE5hbWUsIHtcclxuXHRcdFx0YnViYmxlczogdHJ1ZSxcclxuXHRcdFx0Y2FuY2VsYWJsZTogdHJ1ZSxcclxuXHRcdFx0ZGV0YWlsOiBkZXRhaWxcclxuXHRcdH0pKTtcclxuXHR9LFxyXG5cclxuXHRlcnJvcjogZnVuY3Rpb24oZXJyKSB7XHJcblx0XHR0aGlzLmVsZW0uZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2Vycm9yJywge1xyXG5cdFx0XHRidWJibGVzOiB0cnVlLFxyXG5cdFx0XHRjYW5jZWxhYmxlOiB0cnVlLFxyXG5cdFx0XHRkZXRhaWw6IGVyclxyXG5cdFx0fSkpO1xyXG5cdH1cclxuXHJcblxyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvZXZlbnRNaXhpbi5qcyIsImxldCBTcGlubmVyID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGlubmVyJyk7XHJcbn07XHJcblxyXG5TcGlubmVyLmh0bWwgPSByZXF1aXJlKGBodG1sLWxvYWRlciEuL21hcmt1cGApO1xyXG5cclxuU3Bpbm5lci5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdzcGlubmVyX2ludmlzaWJsZScpO1xyXG59O1xyXG5cclxuU3Bpbm5lci5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdzcGlubmVyX2ludmlzaWJsZScpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTcGlubmVyO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3Mvc3Bpbm5lci9pbmRleC5qcyIsIm1vZHVsZS5leHBvcnRzID0gXCI8ZGl2IGlkPVxcXCJzcGlubmVyXFxcIiBjbGFzcz1cXFwic3Bpbm5lclxcXCI+XFxyXFxuXFxyXFxuPC9kaXY+XCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL34vaHRtbC1sb2FkZXIhLi4vYmxvY2tzL3NwaW5uZXIvbWFya3VwXG4vLyBtb2R1bGUgaWQgPSAyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDEgMiA4IDkgMTAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBjbGFzcz0nd2luZG93IG1vZGFsIHdpbmRvd19pbnZpc2libGUgbW9kYWwtd2luZG93IG1lc3NhZ2UtbW9kYWwtd2luZG93JyBpZD0nbWVzc2FnZS1tb2RhbC13aW5kb3cnPlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJoZWFkZXIgd2luZG93X19oZWFkZXJcXFwiPlxcclxcbiAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwicGFuZWwgd2luZG93X19wYW5lbFxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJtZXNzYWdlLW1vZGFsLXdpbmRvd19fbWVzc2FnZVxcXCI+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbiBtZXNzYWdlLW1vZGFsLXdpbmRvd19fb2stYnV0dG9uXFxcIj5PSzwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiaWNvbi1jcm9zcyBtb2RhbC1jbG9zZS1idXR0b25cXFwiPjwvZGl2PjwvZGl2PlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9+L2h0bWwtbG9hZGVyIS4uL2Jsb2Nrcy9tZXNzYWdlLW1vZGFsLXdpbmRvdy93aW5kb3dcbi8vIG1vZHVsZSBpZCA9IDIxXG4vLyBtb2R1bGUgY2h1bmtzID0gMSA0IDkiLCIvL2xldCBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ2FwcDpjaGVja1VzZXJkRGF0YScpO1xyXG5cclxuY29uc3QgUFJPUEVSVFlfU1lNQk9MID0gJ1twcm9wZXJ0eV0nO1xyXG5cclxubGV0IG1lc3NhZ2VzID0ge1xyXG4gICAgcGxhaW46ICdpbmNvcnJlY3QgW3Byb3BlcnR5XScsXHJcbiAgICBlbXB0eTogJ1twcm9wZXJ0eV0gbXVzdCBub3QgYmUgZW1wdHknLFxyXG4gICAgdG9vQmlnOiB2YWx1ZSA9PiB7XHJcbiAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgICAgICByZXR1cm4gYFtwcm9wZXJ0eV0gbXVzdCBiZSBsb3dlciB0aGFuICR7dmFsdWUgKyAxfSBzeW1ib2xzYDtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiAnW3Byb3BlcnR5XSBpcyB0b28gYmlnJztcclxuICAgIH0sXHJcbiAgICB0b29TbWFsbDogdmFsdWUgPT4ge1xyXG4gICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICAgICAgcmV0dXJuIGBbcHJvcGVydHldIG11c3QgYmUgZ3JlYXRlciB0aGFuICR7dmFsdWUgLSAxfSBzeW1ib2xzYDtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiAnW3Byb3BlcnR5XSBpcyB0b28gc2hvcnQnO1xyXG4gICAgfVxyXG59O1xyXG5cclxubGV0IHRlc3RzID0ge1xyXG4gICAgcmVnRXhwOiAocmVnRXhwLCB2YWx1ZSkgPT4gcmVnRXhwLnRlc3QodmFsdWUpLFxyXG4gICAgbWF4OiAobWF4LCB2YWx1ZSkgPT4gKHZhbHVlLmxlbmd0aCA8PSBtYXgpLFxyXG4gICAgbWluOiAobWluLCB2YWx1ZSkgPT4gKHZhbHVlLmxlbmd0aCA+PSBtaW4pLFxyXG4gICAgbm9uRW1wdHk6ICh2YWx1ZSkgPT4gKHZhbHVlLmxlbmd0aCA+IDApXHJcblxyXG59O1xyXG5cclxuXHJcbmxldCBjaGVja3MgPSB7XHJcbiAgICBtYXg6ICh2YWx1ZSwgZXJyb3JNZXNzYWdlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlcnJvck1lc3NhZ2UgfHwgbWVzc2FnZXMudG9vQmlnKHZhbHVlKSxcclxuICAgICAgICAgICAgdGVzdDogdGVzdHMubWF4LmJpbmQobnVsbCwgdmFsdWUpXHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcblxyXG4gICAgbWluOiAodmFsdWUsIGVycm9yTWVzc2FnZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZXJyb3JNZXNzYWdlIHx8IG1lc3NhZ2VzLnRvb1NtYWxsKHZhbHVlKSxcclxuICAgICAgICAgICAgdGVzdDogdGVzdHMubWluLmJpbmQobnVsbCwgdmFsdWUpXHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcblxyXG4gICAgbm9uRW1wdHk6IChlcnJvck1lc3NhZ2UpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGVycm9yTWVzc2FnZSB8fCBtZXNzYWdlcy5lbXB0eSxcclxuICAgICAgICAgICAgdGVzdDogdGVzdHMubm9uRW1wdHlcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59O1xyXG5cclxuZnVuY3Rpb24gY29tcHV0ZUVycm9yTWVzc2FnZSh0ZW1wbGF0ZSwgcHJvcGVydHkpIHtcclxuICAgIGxldCBwb3M7XHJcbiAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlIHx8IG1lc3NhZ2VzLnBsYWluO1xyXG4gICAgcHJvcGVydHkgPSBwcm9wZXJ0eSB8fCAndGhpcyBwcm9wZXJ0eSc7XHJcbiAgICB3aGlsZSAofihwb3MgPSB0ZW1wbGF0ZS5pbmRleE9mKFBST1BFUlRZX1NZTUJPTCkpKVxyXG4gICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUuc3Vic3RyaW5nKDAsIHBvcykgKyBwcm9wZXJ0eSArIHRlbXBsYXRlLnN1YnN0cmluZyhwb3MgKyBQUk9QRVJUWV9TWU1CT0wubGVuZ3RoKTtcclxuICAgIHJldHVybiB0ZW1wbGF0ZTtcclxufVxyXG5cclxubGV0IHZhbGlkYXRvcnMgPSB7XHJcblxyXG4gICAgJ25vbi1lbXB0eSc6IHtcclxuICAgICAgICBjaGVja3M6IFtcclxuICAgICAgICAgICAgY2hlY2tzLm5vbkVtcHR5KClcclxuICAgICAgICBdXHJcbiAgICB9LFxyXG5cclxuICAgICdlbWFpbCc6IHtcclxuICAgICAgICBjaGVja3M6IFtcclxuICAgICAgICAgICAgY2hlY2tzLm5vbkVtcHR5KCksXHJcbiAgICAgICAgICAgIGNoZWNrcy5tYXgoMTAwLCBtZXNzYWdlcy50b29CaWcoKSksXHJcbiAgICAgICAgICAgIGNoZWNrcy5taW4oNiwgbWVzc2FnZXMudG9vU21hbGwoKSksIHtcclxuICAgICAgICAgICAgICAgIHRlc3Q6IHRlc3RzLnJlZ0V4cC5iaW5kKG51bGwsIC9eKFxcdytbLVxcLl0/PykrQFtcXHcuLV0rXFx3XFwuXFx3ezIsNX0kL2kpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAndXNlcm5hbWUnOiB7XHJcbiAgICAgICAgY2hlY2tzOiBbXHJcbiAgICAgICAgICAgIGNoZWNrcy5ub25FbXB0eSgpLFxyXG4gICAgICAgICAgICBjaGVja3MubWF4KDMwKSxcclxuICAgICAgICAgICAgY2hlY2tzLm1pbig1KSwge1xyXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiAnbXVzdCBvbmx5IGNvbnRhaW4gYWxwaGFudW1lcmljIHN5bWJvbHMnLFxyXG4gICAgICAgICAgICAgICAgdGVzdDogdGVzdHMucmVnRXhwLmJpbmQobnVsbCwgL15bQS1aMC05LV0rJC9pKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgJ3Bhc3N3b3JkJzoge1xyXG4gICAgICAgIGNoZWNrczogW1xyXG4gICAgICAgICAgICBjaGVja3Mubm9uRW1wdHkoKSxcclxuICAgICAgICAgICAgY2hlY2tzLm1heCgzMCksXHJcbiAgICAgICAgICAgIGNoZWNrcy5taW4oNSksIHtcclxuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogJ1twcm9wZXJ0eV0gaXMgdG9vIHdlYWsnLFxyXG4gICAgICAgICAgICAgICAgdGVzdDogdGVzdHMucmVnRXhwLmJpbmQobnVsbCwgLyg/PS4qXFxkKSg/PS4qW2Etel0pKD89LipbQS1aXSkuezYsfS8pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgXVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgJ3Bhc3N3b3JkLWFnYWluJzoge1xyXG4gICAgICAgIGNoZWNrczogW1xyXG4gICAgICAgICAgICBjaGVja3Mubm9uRW1wdHkoJ3JlLWVudGVyIFtwcm9wZXJ0eV0nKSwge1xyXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiAncGFzc3dvcmRzIGRvIG5vdCBtYXRjaCcsXHJcbiAgICAgICAgICAgICAgICB0ZXN0OiBmdW5jdGlvbih2YWx1ZSwgZGF0YUNodW5rLCBkYXRhKSB7XHJcblx0XHRcdFx0XHRsZXQgb3JpZ2luYWxQYXNzID0gZGF0YUNodW5rLnBhc3N3b3JkO1xyXG5cdFx0XHRcdFx0aWYgKCFvcmlnaW5hbFBhc3MpXHJcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignbm8gb3JpZ2luYWwgcGFzc3dvcmQgcmVmZXJlbmNlJyk7XHJcblxyXG5cdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKVxyXG5cdFx0XHRcdFx0XHRpZiAoZGF0YVtpXS5wcm9wZXJ0eSA9PT0gb3JpZ2luYWxQYXNzKVxyXG5cdFx0XHRcdFx0XHRcdHJldHVybiAodmFsdWUgPT09IGRhdGFbaV0udmFsdWUpO1xyXG5cclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignbm8gb3JnaW5hbCBwYXNzd29yZCBkYXRhJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgXVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgJ3VybCc6IHtcclxuICAgICAgICBjaGVja3M6IFt7XHJcbiAgICAgICAgICAgIHRlc3Q6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdXJsUmVnZXggPSAnXig/IW1haWx0bzopKD86KD86aHR0cHxodHRwcyk6Ly8pKD86XFxcXFMrKD86OlxcXFxTKik/QCk/KD86KD86KD86WzEtOV1cXFxcZD98MVxcXFxkXFxcXGR8MlswMV1cXFxcZHwyMlswLTNdKSg/OlxcXFwuKD86MT9cXFxcZHsxLDJ9fDJbMC00XVxcXFxkfDI1WzAtNV0pKXsyfSg/OlxcXFwuKD86WzAtOV1cXFxcZD98MVxcXFxkXFxcXGR8MlswLTRdXFxcXGR8MjVbMC00XSkpfCg/Oig/OlthLXpcXFxcdTAwYTEtXFxcXHVmZmZmMC05XSstPykqW2EtelxcXFx1MDBhMS1cXFxcdWZmZmYwLTldKykoPzpcXFxcLig/OlthLXpcXFxcdTAwYTEtXFxcXHVmZmZmMC05XSstPykqW2EtelxcXFx1MDBhMS1cXFxcdWZmZmYwLTldKykqKD86XFxcXC4oPzpbYS16XFxcXHUwMGExLVxcXFx1ZmZmZl17Mix9KSkpfGxvY2FsaG9zdCkoPzo6XFxcXGR7Miw1fSk/KD86KC98XFxcXD98IylbXlxcXFxzXSopPyQnO1xyXG4gICAgICAgICAgICAgICAgbGV0IHVybCA9IG5ldyBSZWdFeHAodXJsUmVnZXgsICdpJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUubGVuZ3RoIDwgMjA4MyAmJiB1cmwudGVzdCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgJ2Rlc2NyaXB0aW9uJzoge1xyXG4gICAgICAgIGNoZWNrczogW1xyXG4gICAgICAgICAgICBjaGVja3MubWF4KDI1NSlcclxuICAgICAgICBdXHJcbiAgICB9LFxyXG5cclxuICAgICdjb21tZW50Jzoge1xyXG4gICAgICAgIGNoZWNrczogW1xyXG4gICAgICAgICAgICBjaGVja3Mubm9uRW1wdHkoKSxcclxuICAgICAgICAgICAgY2hlY2tzLm1heCgyNTUpXHJcbiAgICAgICAgXVxyXG4gICAgfVxyXG5cclxufTtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0RXJyb3JBcnJheShkYXRhKSB7XHJcblxyXG5cdGlmICghQXJyYXkuaXNBcnJheShkYXRhKSkge1xyXG5cdFx0bGV0IGNvcnJlY3REYXRhID0gW107XHJcblx0XHRmb3IgKGxldCBrZXkgaW4gZGF0YSkge1xyXG5cdFx0XHRjb3JyZWN0RGF0YS5wdXNoKHtcclxuXHRcdFx0XHRwcm9wZXJ0eToga2V5LFxyXG5cdFx0XHRcdHZhbHVlOiBkYXRhW2tleV1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRkYXRhID0gY29ycmVjdERhdGE7XHJcblx0fVxyXG5cclxuICAgIGxldCByZXN1bHQgPSBbXTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcclxuXHRcdGxldCBrZXkgPSBkYXRhW2ldLnZhbGlkYXRvcjtcclxuXHRcdGlmICgha2V5KVxyXG5cdFx0XHRrZXkgPSBkYXRhW2ldLnByb3BlcnR5O1xyXG5cclxuICAgICAgICBpZiAoIXZhbGlkYXRvcnNba2V5XSlcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyB2YWxpZGF0b3IgZm9yIHRoaXMgcHJvcGVydHk6ICcgKyBrZXkpO1xyXG5cclxuICAgICAgICB2YWxpZGF0b3JzW2tleV0uY2hlY2tzLmZvckVhY2goY2hlY2sgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWNoZWNrLnRlc3QoZGF0YVtpXS52YWx1ZSwgZGF0YVtpXSwgZGF0YSkpXHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHk6IGRhdGFbaV0ucHJvcGVydHksXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY29tcHV0ZUVycm9yTWVzc2FnZShjaGVjay5lcnJvck1lc3NhZ2UsIGRhdGFbaV0uYWxpYXMgfHwgZGF0YVtpXS5wcm9wZXJ0eSB8fCBrZXkpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5mdW5jdGlvbiB0ZXN0UHJvcGVydHkobmFtZSwgdmFsdWUpIHtcclxuICAgIGxldCByZXN1bHQgPSB0cnVlO1xyXG4gICAgdmFsaWRhdG9yc1tuYW1lXS5jaGVja3MuZm9yRWFjaChjaGVjayA9PiB7XHJcblxyXG4gICAgICAgIGlmICghY2hlY2sudGVzdCh2YWx1ZSkpXHJcbiAgICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGdldEVycm9yQXJyYXksXHJcbiAgICB0ZXN0UHJvcGVydHlcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2NoZWNrVXNlckRhdGEuanMiLCJsZXQgZXZlbnRNaXhpbiA9IHJlcXVpcmUoTElCUyArICdldmVudE1peGluJyk7XHJcbmxldCBnZXRFcnJvckFycmF5ID0gcmVxdWlyZShMSUJTICsgJ2NoZWNrVXNlckRhdGEnKS5nZXRFcnJvckFycmF5O1xyXG5sZXQgQ2xpZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ2xpZW50RXJyb3I7XHJcblxyXG5sZXQgRm9ybSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuZWxlbSA9IG9wdGlvbnMuZWxlbTtcclxuICAgIHRoaXMuZmllbGRzID0gb3B0aW9ucy5maWVsZHM7XHJcbiAgICB0aGlzLnVybCA9IG9wdGlvbnMudXJsO1xyXG4gICAgdGhpcy5pc0F2YWlsYWJsZSA9IHRydWU7XHJcblxyXG4gICAgdGhpcy5zYXZlQnV0dG9uID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5zYXZlLWJ1dHRvbicpO1xyXG5cclxuICAgIHRoaXMuZWxlbS5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzQXZhaWxhYmxlKSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmIChlLnRhcmdldCAhPT0gdGhpcy5zYXZlQnV0dG9uKSByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMuY2xlYXJFcnJvckJveGVzKCk7XHJcbiAgICAgICAgbGV0IGVycm9ycyA9IHRoaXMuZ2V0RXJyb3JzKCk7XHJcbiAgICAgICAgaWYgKGVycm9ycy5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIHRoaXMuc2VuZCh0aGlzLmdldEJvZHkoKSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLnNldEVycm9ycyhlcnJvcnMpO1xyXG4gICAgfTtcclxufTtcclxuXHJcbkZvcm0ucHJvdG90eXBlLnNldFByb3BlcnR5RXJyb3IgPSBmdW5jdGlvbihwcm9wZXJ0eSwgbWVzc2FnZSkge1xyXG4gICAgdGhpcy5nZXRFcnJvckJveChwcm9wZXJ0eSkudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xyXG59O1xyXG5cclxuRm9ybS5wcm90b3R5cGUuZ2V0RXJyb3JCb3ggPSBmdW5jdGlvbihmaWVsZE5hbWUpIHtcclxuICAgIHJldHVybiB0aGlzLmVsZW1bZmllbGROYW1lXS5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZXh0Ym94X19lcnJvcicpO1xyXG59O1xyXG5cclxuRm9ybS5wcm90b3R5cGUuc2V0QXZhaWxhYmxlID0gZnVuY3Rpb24oaXNBdmFpbGFibGUpIHtcclxuICAgIHRoaXMuaXNBdmFpbGFibGUgPSBpc0F2YWlsYWJsZTtcclxufTtcclxuXHJcbkZvcm0ucHJvdG90eXBlLmdldERhdGFPYmogPSBmdW5jdGlvbigpIHtcclxuICAgIGxldCBvcHRpb25zID0gW107XHJcblxyXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuZmllbGRzKSB7XHJcbiAgICAgICAgbGV0IGNodW5rID0gdGhpcy5maWVsZHNba2V5XTtcclxuICAgICAgICBpZiAoIWNodW5rLm5vVmFsaWRhdGlvbikge1xyXG4gICAgICAgICAgICBpZiAoIWNodW5rLnByb3BlcnR5KVxyXG4gICAgICAgICAgICAgICAgY2h1bmsucHJvcGVydHkgPSBrZXk7XHJcbiAgICAgICAgICAgIGNodW5rLnZhbHVlID0gdGhpcy5lbGVtW2tleV0udmFsdWU7XHJcbiAgICAgICAgICAgIG9wdGlvbnMucHVzaChjaHVuayk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcHRpb25zO1xyXG59O1xyXG5cclxuRm9ybS5wcm90b3R5cGUuc2VuZCA9IGZ1bmN0aW9uKGJvZHkpIHtcclxuICAgIHJlcXVpcmUoTElCUyArICdzZW5kUmVxdWVzdCcpKGJvZHksICdQT1NUJywgdGhpcy51cmwsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgQ2xpZW50RXJyb3IgJiYgZXJyLmRldGFpbClcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0UHJvcGVydHlFcnJvcihlcnIuZGV0YWlsLnByb3BlcnR5LCBlcnIubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMudHJpZ2dlcignZm9ybV9zZW50Jywge1xyXG4gICAgICAgICAgICByZXNwb25zZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5cclxuRm9ybS5wcm90b3R5cGUuY2xlYXJFcnJvckJveGVzID0gZnVuY3Rpb24oKSB7XHJcbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5maWVsZHMpXHJcbiAgICAgICAgdGhpcy5nZXRFcnJvckJveChrZXkpLnRleHRDb250ZW50ID0gJyc7XHJcbn07XHJcblxyXG5Gb3JtLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5jbGVhckVycm9yQm94ZXMoKTtcclxuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmZpZWxkcylcclxuICAgICAgICB0aGlzLmVsZW1ba2V5XS52YWx1ZSA9ICcnO1xyXG59O1xyXG5cclxuRm9ybS5wcm90b3R5cGUuZ2V0RXJyb3JzID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gZ2V0RXJyb3JBcnJheSh0aGlzLmdldERhdGFPYmooKSk7XHJcbn07XHJcblxyXG5cclxuRm9ybS5wcm90b3R5cGUuc2V0RXJyb3JzID0gZnVuY3Rpb24oZXJyb3JzKSB7XHJcbiAgICB0aGlzLmNsZWFyRXJyb3JCb3hlcygpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlcnJvcnMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0RXJyb3JCb3goZXJyb3JzW2ldLnByb3BlcnR5KS50ZXh0Q29udGVudCA9PSAnJylcclxuICAgICAgICAgICAgdGhpcy5zZXRQcm9wZXJ0eUVycm9yKGVycm9yc1tpXS5wcm9wZXJ0eSwgZXJyb3JzW2ldLm1lc3NhZ2UpO1xyXG59O1xyXG5cclxuRm9ybS5wcm90b3R5cGUuZ2V0Qm9keSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGJvZHkgPSAnJztcclxuXHJcbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5maWVsZHMpXHJcbiAgICAgICAgaWYgKCF0aGlzLmZpZWxkc1trZXldLmV4dHJhKVxyXG4gICAgICAgICAgICBib2R5ICs9IChib2R5ID09PSAnJyA/ICcnIDogJyYnKSArXHJcbiAgICAgICAgICAgIGtleSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh0aGlzLmVsZW1ba2V5XS52YWx1ZSk7XHJcbiAgICByZXR1cm4gYm9keTtcclxufTtcclxuXHJcbmZvciAobGV0IGtleSBpbiBldmVudE1peGluKSB7XHJcbiAgICBGb3JtLnByb3RvdHlwZVtrZXldID0gZXZlbnRNaXhpbltrZXldO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvZm9ybS9pbmRleC5qcyIsImxldCBTZXJ2ZXJFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5TZXJ2ZXJFcnJvcjtcclxubGV0IENsaWVudEVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLkNsaWVudEVycm9yO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYm9keU9iaiwgbWV0aG9kLCB1cmwsIGNiKSB7XHJcblxyXG5cclxuICAgIGxldCBib2R5ID0gJyc7XHJcbiAgICBpZiAoISh0eXBlb2YgYm9keU9iaiA9PT0gJ3N0cmluZycpKSB7XHJcbiAgICAgICAgZm9yIChsZXQga2V5IGluIGJvZHlPYmopIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgIGlmIChib2R5T2JqW2tleV0pXHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGtleSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCgodHlwZW9mIGJvZHlPYmpba2V5XSA9PT0gJ29iamVjdCcpID8gSlNPTi5zdHJpbmdpZnkoYm9keU9ialtrZXldKSA6IGJvZHlPYmpba2V5XSk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICAgICAgICAgIGJvZHkgKz0gKGJvZHkgPT09ICcnID8gJycgOiAnJicpICsgdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlXHJcbiAgICAgICAgYm9keSA9IGJvZHlPYmo7XHJcblxyXG5cclxuICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgIHhoci5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKTtcclxuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XHJcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIlgtUmVxdWVzdGVkLVdpdGhcIiwgXCJYTUxIdHRwUmVxdWVzdFwiKTtcclxuXHJcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgIT0gNCkgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgcmVzcG9uc2U7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnJlc3BvbnNlVGV4dClcclxuICAgICAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY2IobmV3IFNlcnZlckVycm9yKCdTZXJ2ZXIgaXMgbm90IHJlc3BvbmRpbmcnKSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCAzMDApXHJcbiAgICAgICAgICAgIGNiKG51bGwsIHJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDQwMCAmJiB0aGlzLnN0YXR1cyA8IDUwMClcclxuICAgICAgICAgICAgY2IobmV3IENsaWVudEVycm9yKHJlc3BvbnNlLm1lc3NhZ2UsIHJlc3BvbnNlLmRldGFpbCwgdGhpcy5zdGF0dXMpKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDUwMClcclxuICAgICAgICAgICAgY2IobmV3IFNlcnZlckVycm9yKHJlc3BvbnNlLm1lc3NhZ2UsIHRoaXMuc3RhdHVzKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnNvbGUubG9nKGBzZW5kaW5nIG5leHQgcmVxdWVzdDogJHtib2R5fWApO1xyXG4gICAgeGhyLnNlbmQoYm9keSk7XHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9zZW5kUmVxdWVzdC5qcyIsImxldCBEcm9wZG93biA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgdGhpcy5lbGVtID0gb3B0aW9ucy5lbGVtO1xyXG4gICAgdGhpcy5pdGVtTGlzdCA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuZHJvcGRvd25fX2l0ZW0tbGlzdCcpO1xyXG4gICAgdGhpcy5jbGFzc05hbWUgPSBvcHRpb25zLmNsYXNzTmFtZTtcclxuXHJcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG5cclxuICAgIC8vIHRoaXMuZWxlbS5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAvLyAgICAgdGhpcy50b2dnbGUoKTtcclxuICAgIC8vIH07XHJcblxyXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaXRlbUxpc3QuY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW0uY29udGFpbnMoZS50YXJnZXQpKVxyXG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGUoKTtcclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5hY3RpdmUpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSwgZmFsc2UpO1xyXG5cclxuXHJcbiAgICB0aGlzLkFFSGFuZGxlciA9IHRoaXMuQUVIYW5kbGVyLmJpbmQodGhpcyk7XHJcblxyXG59O1xyXG5cclxuRHJvcGRvd24ucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnZHJvcGRvd25faW52aXNpYmxlJyk7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZChgJHt0aGlzLmNsYXNzTmFtZX1fYWN0aXZlYCk7XHJcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XHJcbn07XHJcblxyXG5Ecm9wZG93bi5wcm90b3R5cGUuZGVhY3RpdmF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuaXRlbUxpc3QuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgdGhpcy5BRUhhbmRsZXIsIGZhbHNlKTtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdkcm9wZG93bl9mYWRpbmctb3V0Jyk7XHJcbn07XHJcblxyXG5Ecm9wZG93bi5wcm90b3R5cGUuQUVIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3Bkb3duX2ZhZGluZy1vdXQnKTtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdkcm9wZG93bl9pbnZpc2libGUnKTtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKGAke3RoaXMuY2xhc3NOYW1lfV9hY3RpdmVgKTtcclxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XHJcbiAgICB0aGlzLml0ZW1MaXN0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbmVuZCcsIHRoaXMuQUVIYW5kbGVyKTtcclxufTtcclxuXHJcbkRyb3Bkb3duLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5hY3RpdmUpXHJcbiAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5zaG93KCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERyb3Bkb3duO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvZHJvcGRvd24vaW5kZXguanMiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc2V0dGluZ3Mvc3R5bGUubGVzc1xuLy8gbW9kdWxlIGlkID0gNDRcbi8vIG1vZHVsZSBjaHVua3MgPSA5IiwibGV0IGV2ZW50TWl4aW4gPSByZXF1aXJlKExJQlMgKyAnZXZlbnRNaXhpbicpO1xyXG5sZXQgU29jaWFsQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHJcbiAgICB0aGlzLmVsZW0gPSBvcHRpb25zLmVsZW07XHJcbiAgICB0aGlzLnNvY2lhbExpc3QgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLnNvY2lhbC1jb2xsZWN0aW9uX19zb2NpYWwtbGlzdCcpO1xyXG4gICAgdGhpcy50ZXh0Ym94ID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy50ZXh0Ym94X19maWVsZCcpO1xyXG5cclxuICAgIHRoaXMuZWxlbS5vbmNsaWNrID0gZSA9PiB7XHJcblxyXG4gICAgICAgIGlmIChlLnRhcmdldC5tYXRjaGVzKCcudGV4dGJveC1idXR0b25fX2J1dHRvbicpICYmIHRoaXMudGV4dGJveC52YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNlbmRTb2NpYWwodGhpcy50ZXh0Ym94LnZhbHVlKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoJy5zb2NpYWxfX2Nsb3NlJykpXHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlU29jaWFsKGUudGFyZ2V0LmNsb3Nlc3QoJy5zb2NpYWwnKSk7XHJcbiAgICB9O1xyXG59O1xyXG5cclxuLy9UT0RPIG1ha2UgY2hlY2tpbmcgdXNlcidzIGRhdGEgb24gY2xpZW50IHNpZGVcclxuXHJcblNvY2lhbENvbGxlY3Rpb24ucHJvdG90eXBlLnNlbmRTb2NpYWwgPSBmdW5jdGlvbihsaW5rKSB7XHJcbiAgICByZXF1aXJlKExJQlMgKyAnc2VuZFJlcXVlc3QnKSh7XHJcbiAgICAgICAgbGlua1xyXG4gICAgfSwgJ1BPU1QnLCAnL3NldHRpbmdzJywgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuXHJcbiAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaW5zZXJ0TmV3U29jaWFsKHJlc3BvbnNlLmxpbmtPYmopO1xyXG4gICAgICAgIHRoaXMudGV4dGJveC52YWx1ZSA9ICcnO1xyXG4gICAgfSk7XHJcblxyXG59O1xyXG5cclxuU29jaWFsQ29sbGVjdGlvbi5wcm90b3R5cGUuZGVsZXRlU29jaWFsID0gZnVuY3Rpb24oc29jaWFsKSB7XHJcbiAgICByZXF1aXJlKExJQlMgKyAnc2VuZFJlcXVlc3QnKSh7XHJcbiAgICAgICAgbGluazogc29jaWFsLmRhdGFzZXQubGlua1xyXG4gICAgfSwgJ0RFTEVURScsICcvc2V0dGluZ3MnLCAoZXJyLCByZXNwb25zZSkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc29jaWFsLnJlbW92ZSgpO1xyXG4gICAgfSk7XHJcblxyXG59O1xyXG5cclxuU29jaWFsQ29sbGVjdGlvbi5wcm90b3R5cGUuaW5zZXJ0TmV3U29jaWFsID0gZnVuY3Rpb24obGlua09iaikge1xyXG4gICAgbGV0IHNvY2lhbCA9IHJlcXVpcmUoTElCUyArICdyZW5kZXJFbGVtZW50JykocmVxdWlyZSgnaHRtbC1sb2FkZXIhLi9zb2NpYWwnKSk7XHJcbiAgICBzb2NpYWwuZGF0YXNldC5saW5rID0gbGlua09iai5ocmVmO1xyXG4gICAgc29jaWFsLnF1ZXJ5U2VsZWN0b3IoJy5zb2NpYWxfX2xpbmsnKS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBsaW5rT2JqLmhyZWYpO1xyXG4gICAgc29jaWFsLnF1ZXJ5U2VsZWN0b3IoJy5zb2NpYWxfX2hvc3QnKS50ZXh0Q29udGVudCA9IGxpbmtPYmouaG9zdDtcclxuICAgIHRoaXMuc29jaWFsTGlzdC5hcHBlbmRDaGlsZChzb2NpYWwpO1xyXG59O1xyXG5cclxuZm9yIChsZXQga2V5IGluIGV2ZW50TWl4aW4pIHtcclxuICAgIFNvY2lhbENvbGxlY3Rpb24ucHJvdG90eXBlW2tleV0gPSBldmVudE1peGluW2tleV07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU29jaWFsQ29sbGVjdGlvbjtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9zb2NpYWwtY29sbGVjdGlvbi9pbmRleC5qcyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obWFya3VwKSB7XHJcblx0bGV0IHBhcmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xyXG5cdHBhcmVudC5pbm5lckhUTUwgPSBtYXJrdXA7IFxyXG5cdGxldCBlbGVtZW50ID0gcGFyZW50LmZpcnN0RWxlbWVudENoaWxkO1xyXG5cdHJldHVybiBlbGVtZW50O1xyXG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9yZW5kZXJFbGVtZW50LmpzIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxkaXYgY2xhc3M9XFxcInNvY2lhbC1jb2xsZWN0aW9uX19zb2NpYWwgc29jaWFsXFxcIiBkYXRhLWxpbms9XFxcIlxcXCI+XFxyXFxuICAgIDxhIGNsYXNzPVxcXCJzb2NpYWxfX2xpbmtcXFwiIGhyZWY9XFxcIlxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzb2NpYWxfX2ljb24gaWNvbi1zcGhlcmVcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgPHNwYW4gY2xhc3M9XFxcInNvY2lhbF9faG9zdFxcXCI+PC9zcGFuPlxcclxcbiAgICA8L2E+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcInNvY2lhbF9fY2xvc2UgaWNvbi1jcm9zc1xcXCI+PC9kaXY+XFxyXFxuPC9kaXY+XCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL34vaHRtbC1sb2FkZXIhLi4vYmxvY2tzL3NvY2lhbC1jb2xsZWN0aW9uL3NvY2lhbFxuLy8gbW9kdWxlIGlkID0gNDhcbi8vIG1vZHVsZSBjaHVua3MgPSA5IiwibGV0IGV2ZW50TWl4aW4gPSByZXF1aXJlKExJQlMgKyAnZXZlbnRNaXhpbicpO1xyXG5sZXQgRmlsZVBpY2tlciA9IHJlcXVpcmUoQkxPQ0tTICsgJ2ZpbGUtcGlja2VyJyk7XHJcblxyXG5sZXQgQ2xpZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ2xpZW50RXJyb3I7XHJcblxyXG5sZXQgVXBsb2FkQXZhdGFyU2VjdGlvbiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLmVsZW0gPSBvcHRpb25zLmVsZW07XHJcbiAgICB0aGlzLnVwbG9hZEJ1dHRvbiA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcudXBsb2FkLWF2YXRhci1zZWN0aW9uX191cGxvYWQtYnV0dG9uJyk7XHJcbiAgICB0aGlzLmRlbGV0ZUJ1dHRvbiA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcudXBsb2FkLWF2YXRhci1zZWN0aW9uX19kZWxldGUtYnV0dG9uJyk7XHJcbiAgICB0aGlzLmZpbGVQaWNrZXIgPSBuZXcgRmlsZVBpY2tlcih7XHJcbiAgICAgICAgZWxlbTogdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5maWxlLXBpY2tlcicpXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmF2YXRhciA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcudXBsb2FkLWF2YXRhci1zZWN0aW9uX19hdmF0YXInKTtcclxuXHJcbiAgICB0aGlzLmVsZW0ub25jbGljayA9IGUgPT4ge1xyXG5cclxuICAgICAgICBpZiAoZS50YXJnZXQgPT09IHRoaXMudXBsb2FkQnV0dG9uKSB7XHJcbiAgICAgICAgICAgIGxldCBmaWxlID0gdGhpcy5maWxlUGlja2VyLmdldEZpbGUoKTtcclxuICAgICAgICAgICAgaWYgKGZpbGUpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwbG9hZEF2YXRhcihmaWxlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChlLnRhcmdldCA9PT0gdGhpcy5kZWxldGVCdXR0b24pXHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlQXZhdGFyKCk7XHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuXHJcblVwbG9hZEF2YXRhclNlY3Rpb24ucHJvdG90eXBlLmRlbGV0ZUF2YXRhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJlcXVpcmUoTElCUyArICdzZW5kUmVxdWVzdCcpKG51bGwsICdERUxFVEUnLCAnL2F2YXRhcicsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hdmF0YXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgnJHtBTk9OX0FWQVRBUl9VUkx9JylgO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5VcGxvYWRBdmF0YXJTZWN0aW9uLnByb3RvdHlwZS51cGxvYWRBdmF0YXIgPSBmdW5jdGlvbiAoZmlsZSkge1xyXG4gICAgbGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoXCJhdmF0YXJcIiwgZmlsZSk7XHJcblxyXG4gICAgcmVxdWlyZShMSUJTICsgJ3NlbmRGb3JtRGF0YScpKFwiL2F2YXRhclwiLCBmb3JtRGF0YSwgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmF2YXRhci5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCcke3Jlc3BvbnNlLnVybH0/JHtuZXcgRGF0ZSgpLmdldFRpbWUoKX0nKWA7XHJcblxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5mb3IgKGxldCBrZXkgaW4gZXZlbnRNaXhpbikge1xyXG4gICAgVXBsb2FkQXZhdGFyU2VjdGlvbi5wcm90b3R5cGVba2V5XSA9IGV2ZW50TWl4aW5ba2V5XTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBVcGxvYWRBdmF0YXJTZWN0aW9uO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvdXBsb2FkLWF2YXRhci1zZWN0aW9uL2luZGV4LmpzIiwiY29uc3QgREVGQVVMVF9WQUxVRSA9ICdubyBmaWxlIGNob3Nlbic7XHJcbmNvbnN0IERFRkFVTFRfRk5fTEVOR1RIID0gREVGQVVMVF9WQUxVRS5sZW5ndGg7XHJcblxyXG5sZXQgRmlsZVBpY2tlciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgdGhpcy5maWxlTmFtZUxlbmd0aCA9IG9wdGlvbnMuZmlsZU5hbWVMZW5ndGggfHwgREVGQVVMVF9GTl9MRU5HVEg7XHJcblxyXG4gICAgdGhpcy51cGxvYWRJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICB0aGlzLnVwbG9hZElucHV0LnR5cGUgPSBcImZpbGVcIjtcclxuICAgIHRoaXMudXBsb2FkSW5wdXQuYWNjZXB0ID0gXCJpbWFnZS8qXCI7XHJcblxyXG4gICAgdGhpcy5lbGVtID0gb3B0aW9ucy5lbGVtO1xyXG4gICAgdGhpcy5mcEJ1dHRvbiA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuZmlsZS1waWNrZXJfX2J1dHRvbicpO1xyXG4gICAgdGhpcy5mcEZpbGVOYW1lID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5maWxlLXBpY2tlcl9fZmlsZW5hbWUnKTtcclxuXHJcbiAgICB0aGlzLmZwQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgdGhpcy51cGxvYWRJbnB1dC5jbGljaygpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy51cGxvYWRJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBlID0+IHtcclxuICAgICAgICB0aGlzLnNldFZpc2libGVGaWxlTmFtZSgpO1xyXG4gICAgfSk7XHJcblxyXG59O1xyXG5cclxuRmlsZVBpY2tlci5wcm90b3R5cGUuc2V0VmlzaWJsZUZpbGVOYW1lID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGZpbGVuYW1lID0gdGhpcy51cGxvYWRJbnB1dC52YWx1ZS5zdWJzdHJpbmcodGhpcy51cGxvYWRJbnB1dC52YWx1ZS5sYXN0SW5kZXhPZignXFxcXCcpICsgMSk7XHJcblxyXG4gICAgbGV0IHZpc2libGVGaWxlTmFtZTtcclxuICAgIGxldCBwYXJ0U2l6ZSA9IH5+KCh0aGlzLmZpbGVOYW1lTGVuZ3RoIC0gMSkgLyAyKTtcclxuXHJcbiAgICBpZiAoZmlsZW5hbWUubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIHZpc2libGVGaWxlTmFtZSA9IERFRkFVTFRfVkFMVUU7XHJcbiAgICBlbHNlIGlmIChmaWxlbmFtZS5sZW5ndGggPD0gdGhpcy5maWxlTmFtZUxlbmd0aCkge1xyXG4gICAgICAgIHRoaXMuZnBGaWxlTmFtZS50aXRsZSA9ICcnO1xyXG4gICAgICAgIHZpc2libGVGaWxlTmFtZSA9IGZpbGVuYW1lO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmZwRmlsZU5hbWUudGl0bGUgPSBmaWxlbmFtZTtcclxuICAgICAgICB2aXNpYmxlRmlsZU5hbWUgPSBmaWxlbmFtZS5zbGljZSgwLCBwYXJ0U2l6ZSkgKyAn4oCmJyArIGZpbGVuYW1lLnNsaWNlKC1wYXJ0U2l6ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5mcEZpbGVOYW1lLnRleHRDb250ZW50ID0gdmlzaWJsZUZpbGVOYW1lO1xyXG59O1xyXG5cclxuRmlsZVBpY2tlci5wcm90b3R5cGUuZ2V0RmlsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB0aGlzLnVwbG9hZElucHV0LmZpbGVzWzBdO1xyXG59O1xyXG5cclxuRmlsZVBpY2tlci5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLnVwbG9hZElucHV0LnZhbHVlID0gJyc7XHJcbiAgICB0aGlzLmZwRmlsZU5hbWUudGV4dENvbnRlbnQgPSBERUZBVUxUX1ZBTFVFO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGaWxlUGlja2VyO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL2ZpbGUtcGlja2VyL2luZGV4LmpzIiwibGV0IFNlcnZlckVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLlNlcnZlckVycm9yO1xyXG5sZXQgQ2xpZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ2xpZW50RXJyb3I7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVybCwgZm9ybURhdGEsIGNiKSB7XHJcblx0dmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdHhoci51cGxvYWQub25wcm9ncmVzcyA9IGV2ZW50ID0+IHtcclxuXHRcdC8vY29uc29sZS5sb2coZXZlbnQubG9hZGVkICsgJyAvICcgKyBldmVudC50b3RhbCk7XHJcblx0fTtcclxuXHJcblx0eGhyLm9ubG9hZCA9IHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XHJcblx0XHRsZXQgcmVzcG9uc2U7XHJcblxyXG5cdFx0aWYgKHRoaXMucmVzcG9uc2VUZXh0KVxyXG5cdFx0XHRyZXNwb25zZSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpO1xyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGNiKG5ldyBTZXJ2ZXJFcnJvcignU2VydmVyIGlzIG5vdCByZXNwb25kaW5nJykpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGlmICh0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCAzMDApXHJcbiAgICAgICAgICAgIGNiKG51bGwsIHJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDQwMCAmJiB0aGlzLnN0YXR1cyA8IDUwMClcclxuICAgICAgICAgICAgY2IobmV3IENsaWVudEVycm9yKHJlc3BvbnNlLm1lc3NhZ2UpKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDUwMClcclxuICAgICAgICAgICAgY2IobmV3IFNlcnZlckVycm9yKHJlc3BvbnNlLm1lc3NhZ2UpKTtcclxuXHRcdFxyXG5cdH07XHJcblxyXG5cdHhoci5vcGVuKFwiUE9TVFwiLCB1cmwsIHRydWUpO1xyXG5cdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLVJlcXVlc3RlZC1XaXRoJywgJ1hNTEh0dHBSZXF1ZXN0Jyk7XHJcblx0eGhyLnNlbmQoZm9ybURhdGEpO1xyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvc2VuZEZvcm1EYXRhLmpzIiwibGV0IGV2ZW50TWl4aW4gPSByZXF1aXJlKExJQlMgKyAnZXZlbnRNaXhpbicpO1xyXG5sZXQgQ2xpZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ2xpZW50RXJyb3I7XHJcbmxldCBNZXNzYWdlTW9kYWxXaW5kb3cgPSByZXF1aXJlKEJMT0NLUyArICdtZXNzYWdlLW1vZGFsLXdpbmRvdycpO1xyXG5cclxuXHJcbmxldCBEZXNjcmlwdGlvbkFkZFNlY3Rpb24gPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgdGhpcy5lbGVtID0gb3B0aW9ucy5lbGVtO1xyXG4gICAgdGhpcy5zYXZlQnV0dG9uID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5idXR0b24nKTtcclxuICAgIHRoaXMudGV4dGFyZWEgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLnRleHRhcmVhIHRleHRhcmVhJyk7XHJcblxyXG4gICAgdGhpcy5lbGVtLm9uY2xpY2sgPSBlID0+IHtcclxuICAgICAgICBpZiAoZS50YXJnZXQgIT09IHRoaXMuc2F2ZUJ1dHRvbikgcmV0dXJuO1xyXG4gICAgICAgIGxldCBkZXNjcmlwdGlvbiA9IHRoaXMudGV4dGFyZWEudmFsdWU7XHJcbiAgICAgICAgbGV0IGVycm9ycyA9IHJlcXVpcmUoTElCUyArICdjaGVja1VzZXJEYXRhJykuZ2V0RXJyb3JBcnJheSh7XHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChlcnJvcnMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICB0aGlzLnNlbmREZXNjcmlwdGlvbih0aGlzLnRleHRhcmVhLnZhbHVlKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IobmV3IENsaWVudEVycm9yKGVycm9yc1swXS5tZXNzYWdlKSk7XHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcbkRlc2NyaXB0aW9uQWRkU2VjdGlvbi5wcm90b3R5cGUuc2VuZERlc2NyaXB0aW9uID0gZnVuY3Rpb24gKGRlc2NyaXB0aW9uKSB7XHJcbiAgICByZXF1aXJlKExJQlMgKyAnc2VuZFJlcXVlc3QnKSh7XHJcbiAgICAgICAgZGVzY3JpcHRpb25cclxuICAgIH0sICdQT1NUJywgJy9zZXR0aW5ncycsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBtZXNzYWdlTW9kYWxXaW5kb3cgPSBuZXcgTWVzc2FnZU1vZGFsV2luZG93KHttZXNzYWdlOiAnRGVzY3JpcHRpb24gaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IGNoYW5nZWQnfSk7XHJcbiAgICAgICAgbWVzc2FnZU1vZGFsV2luZG93LnNob3coKTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuZm9yIChsZXQga2V5IGluIGV2ZW50TWl4aW4pIHtcclxuICAgIERlc2NyaXB0aW9uQWRkU2VjdGlvbi5wcm90b3R5cGVba2V5XSA9IGV2ZW50TWl4aW5ba2V5XTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEZXNjcmlwdGlvbkFkZFNlY3Rpb247XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvZGVzY3JpcHRpb24tYWRkLXNlY3Rpb24vaW5kZXguanMiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3pEQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7OztBQUVBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUdBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7Ozs7Ozs7O0FDdFFBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNiQTs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7O0FDRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUdBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFkQTtBQUFBO0FBZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDMU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDL0NBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDckRBOzs7Ozs7Ozs7QUNBQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7OztBQUdBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ0pBOzs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFFQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OzsiLCJzb3VyY2VSb290IjoiIn0=