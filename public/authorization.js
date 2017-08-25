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
/******/ 		0:0
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

	__webpack_require__(1);

	var GlobalErrorHandler = __webpack_require__(14);
	var globalErrorHandler = new GlobalErrorHandler();

	var AuthWindow = __webpack_require__(22);

	//TODO this logic should be in Auth class

	var isLoginFormActive = true;
	if (!history.state && window.location.search === '?join') isLoginFormActive = false;

	var authWindow = new AuthWindow({
	    elem: document.getElementById('auth-window'),
	    isLoginFormActive: isLoginFormActive
	});

	var state = isLoginFormActive ? 'login' : 'join';

	history.replaceState({
	    type: state
	}, state, '?' + state);

	window.onpopstate = function (e) {

	    if (e.state) if (e.state.type === 'join') authWindow.setJoin(true);else authWindow.setLogin(true);
	};

	authWindow.on('auth-window_switched', function (e) {

	    if (!e.detail.isPopState) {
	        console.log('пушстейтим!');

	        if (e.detail.isLoginFormActive) {
	            history.pushState({
	                type: 'login'
	            }, 'login', '?login');
	        } else history.pushState({
	            type: 'join'
	        }, 'join', '?join');
	    }
	});

	var Authorization = function Authorization(options) {
	    var _this = this;

	    this.elem = options.elem;
	    this.wrapper = this.elem.querySelector('.authorization__background-wrapper');

	    this.leftPic1 = this.wrapper.querySelector('.authorization__left-pic:nth-child(1)');
	    this.leftPic2 = this.wrapper.querySelector('.authorization__left-pic:nth-child(2)');
	    this.rightPic1 = this.wrapper.querySelector('.authorization__right-pic:nth-child(1)');
	    this.rightPic2 = this.wrapper.querySelector('.authorization__right-pic:nth-child(2)');

	    this.currentLeftPic1Index = -1;
	    this.currentLeftPic2Index = -1;
	    this.currentRightPic1Index = -1;
	    this.currentRightPic2Index = -1;
	    this.currentLeftPic = 1;
	    this.currentRightPic = 1;

	    var imageUrls = JSON.parse(this.wrapper.dataset.images);
	    this.images = [];

	    var _loop = function (i) {
	        var preloadedImg = new Image();

	        _this.images[i] = {
	            index: i,
	            url: imageUrls[i],
	            preloadedImg: preloadedImg,
	            loaded: false
	        };

	        preloadedImg.onload = function (e) {
	            _this.images[i].loaded = true;

	            if (_this.currentLeftPic1Index === -1 && _this.currentLeftPic === 1) {
	                //TODO backdrop should decrease its opacity now
	                _this.setLeftPicImage(1, _this.images[i]);
	                return;
	            }

	            if (_this.currentLeftPic2Index === -1 && _this.currentLeftPic === 2) {
	                _this.setLeftPicImage(2, _this.images[i]);
	                return;
	            }

	            if (_this.currentRightPic1Index === -1 && _this.currentRightPic === 1) {
	                _this.setRightPicImage(1, _this.images[i]);
	                return;
	            }

	            if (_this.currentRightPic2Index === -1 && _this.currentRightPic === 2) {
	                _this.setRightPicImage(2, _this.images[i]);
	                return;
	            }
	        };
	        preloadedImg.src = imageUrls[i];
	    };

	    for (var i = 0; i < imageUrls.length; i++) {
	        _loop(i);
	    }

	    this.leftPic2.addEventListener('animationstart', function (e) {
	        _this.setLeftPicImage(2, _this.getNextLeftImage());
	    }, false);

	    this.leftPic1.addEventListener('animationiteration', function (e) {
	        _this.setLeftPicImage(1, _this.getNextLeftImage());
	    }, false);

	    this.leftPic2.addEventListener('animationiteration', function (e) {
	        _this.setLeftPicImage(2, _this.getNextLeftImage());
	    }, false);

	    this.rightPic2.addEventListener('animationstart', function (e) {
	        _this.setRightPicImage(2, _this.getNextRightImage());
	    }, false);

	    this.rightPic1.addEventListener('animationiteration', function (e) {
	        _this.setRightPicImage(1, _this.getNextRightImage());
	    }, false);

	    this.rightPic2.addEventListener('animationiteration', function (e) {
	        _this.setRightPicImage(2, _this.getNextRightImage());
	    }, false);
	};

	Authorization.prototype.getNextLeftImage = function () {
	    var currentVisibleIndex = this.currentLeftPic === 1 ? this.currentLeftPic1Index : this.currentLeftPic2Index;
	    var currentRightIndex = this.currentRightPic === 1 ? this.currentRightPic1Index : this.currentRightPic2Index;

	    var i = (currentVisibleIndex + 1) % this.images.length;
	    do {
	        if (this.images[i].loaded === true && i !== currentRightIndex) return this.images[i];
	        i = (i + 1) % this.images.length;
	    } while (i !== currentVisibleIndex);

	    if (this.images[currentRightIndex]) return this.images[currentRightIndex];

	    return null;
	};

	Authorization.prototype.getNextRightImage = function () {
	    var currentVisibleIndex = this.currentRightPic === 1 ? this.currentRightPic1Index : this.currentRightPic2Index;
	    var currentLeftIndex = this.currentLeftPic === 1 ? this.currentLeftPic1Index : this.currentLeftPic2Index;

	    var i = currentVisibleIndex - 1;
	    if (i < 0) i = this.images.length - 1;

	    do {
	        if (this.images[i].loaded === true && i !== currentLeftIndex) return this.images[i];

	        i -= 1;
	        if (i === -1) i = this.images.length - 1;
	    } while (i !== currentVisibleIndex);

	    if (this.images[currentLeftIndex]) return this.images[currentLeftIndex];

	    return null;
	};

	Authorization.prototype.setLeftPicImage = function (pic, image) {

	    this.currentLeftPic = pic;

	    if (pic === 1) {
	        if (image) {
	            this.currentLeftPic1Index = image.index;
	            this.setUrl(this.leftPic1, image.url);
	        } else this.setUrl(this.leftPic1, null);
	    } else if (pic === 2) {
	        if (image) {
	            this.currentLeftPic2Index = image.index;
	            this.setUrl(this.leftPic2, image.url);
	        } else this.setUrl(this.leftPic2, null);
	    }
	};

	Authorization.prototype.setRightPicImage = function (pic, image) {
	    this.currentRightPic = pic;

	    if (pic === 1) {
	        if (image) {
	            this.currentRightPic1Index = image.index;
	            this.setUrl(this.rightPic1, image.url);
	        } else this.setUrl(this.rightPic1, null);
	    } else if (pic === 2) {
	        if (image) {
	            this.currentRightPic2Index = image.index;
	            this.setUrl(this.rightPic2, image.url);
	        } else this.setUrl(this.rightPic2, null);
	    }
	};

	Authorization.prototype.setUrl = function (elem, url) {
	    if (url) elem.style.backgroundImage = 'url(\'' + url + '\')';else elem.style.backgroundImage = 'none';
	};

	var page = new Authorization({
	    elem: document.getElementById('authorization')
	});

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }),
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
/* 16 */,
/* 17 */,
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
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var checkUserData = __webpack_require__(23);
	var eventMixin = __webpack_require__(18);
	var ClientError = __webpack_require__(15).ClientError;
	var Form = __webpack_require__(24);

	var AuthWindow = function AuthWindow(options) {
	    var _this = this;

	    this.elem = options.elem;
	    this.isLoginFormActive = options.isLoginFormActive;
	    this.isAvailable = true;
	    this.headerElem = this.elem.querySelector('.window__header');

	    this.panel = this.elem.querySelector('div.window__panel');
	    this.loginFormElem = this.elem.querySelector('form[name="login"]');
	    this.joinFormElem = this.elem.querySelector('form[name="join"]');

	    this.setJoinAEHandler = this.setJoinAEHandler.bind(this);
	    this.setLoginAEHandler = this.setLoginAEHandler.bind(this);

	    this.joinForm = new Form({
	        elem: this.joinFormElem,
	        fields: {
	            'username': {},
	            'email': {
	                alias: 'e-mail'
	            },
	            'password': {},
	            'password-again': {
	                extra: true,
	                password: 'password',
	                alias: 'password'
	            }
	        },
	        url: '/join'
	    });

	    this.loginForm = new Form({
	        elem: this.loginFormElem,
	        fields: {
	            'username': {
	                validator: 'non-empty'
	            },
	            'password': {
	                validator: 'non-empty'
	            }
	        },
	        url: '/login'
	    });

	    this.loginForm.on('form_sent', function (e) {
	        _this.redirect();
	    });
	    this.joinForm.on('form_sent', function (e) {
	        _this.redirect();
	    });

	    if (!this.isLoginFormActive) this.setJoinAEHandler();else this.setLoginAEHandler();

	    this.elem.onclick = function (e) {

	        if (_this.isAvailable) if (e.target.matches('.window__message .ref')) _this.toggle();
	    };

	    this.elem.addEventListener('focus', function (e) {
	        if (e.target.classList && e.target.classList.contains('textbox__field')) {
	            var tb = e.target.closest('.textbox');
	            if (tb) tb.classList.add('textbox_focus');
	        }
	    }, true);

	    this.elem.addEventListener('blur', function (e) {
	        if (e.target.classList && e.target.classList.contains('textbox__field')) {
	            var tb = e.target.closest('.textbox');
	            if (tb) tb.classList.remove('textbox_focus');
	        }
	    }, true);
	};

	AuthWindow.prototype.redirect = function () {
	    var url = '/';
	    url = localStorage.getItem('redirected_url') || url;
	    localStorage.removeItem('redirected_url');
	    window.location = url;
	};

	AuthWindow.prototype.setJoin = function (isPopState) {
	    this.joinForm.clear();
	    this.isAvailable = false;
	    this.loginForm.setAvailable(false);
	    this.loginFormElem.classList.add('auth-window__form-fading-out');

	    console.log('setJoin ' + isPopState);

	    this.trigger('auth-window_switched', {
	        isLoginFormActive: false,
	        isPopState: isPopState
	    });

	    this.loginFormElem.addEventListener('animationend', this.setJoinAEHandler, false);
	};

	AuthWindow.prototype.setJoinAEHandler = function () {
	    this.headerElem.textContent = 'signing up';

	    this.isAvailable = true;
	    this.loginForm.setAvailable(true);
	    this.loginFormElem.classList.remove('auth-window__form-fading-out');
	    this.loginFormElem.classList.add('auth-window__form_invisible');
	    this.joinFormElem.classList.remove('auth-window__form_invisible');
	    this.joinFormElemHeight = this.joinFormElemHeight || this.joinFormElem.scrollHeight;
	    this.panel.style.height = this.joinFormElemHeight + 'px';
	    this.isLoginFormActive = false;
	    this.loginFormElem.removeEventListener('animationend', this.setJoinAEHandler);
	};

	AuthWindow.prototype.setLogin = function (isPopState) {
	    this.loginForm.clear();
	    this.isAvailable = false;
	    this.joinForm.setAvailable(false);
	    this.joinFormElem.classList.add('auth-window__form-fading-out');

	    console.log('setLogin ' + isPopState);

	    this.trigger('auth-window_switched', {
	        isLoginFormActive: true,
	        isPopState: isPopState
	    });

	    this.joinFormElem.addEventListener('animationend', this.setLoginAEHandler, false);
	};

	AuthWindow.prototype.setLoginAEHandler = function () {
	    this.headerElem.textContent = 'logging in';

	    this.isAvailable = true;
	    this.joinForm.setAvailable(true);
	    this.joinFormElem.classList.remove('auth-window__form-fading-out');
	    this.joinFormElem.classList.add('auth-window__form_invisible');
	    this.loginFormElem.classList.remove('auth-window__form_invisible');
	    this.loginFormElemHeight = this.loginFormElemHeight || this.loginFormElem.scrollHeight;
	    this.panel.style.height = this.loginFormElemHeight + 'px';
	    this.isLoginFormActive = true;
	    this.joinFormElem.removeEventListener('animationend', this.setLoginAEHandler);
	};

	AuthWindow.prototype.toggle = function () {
	    if (this.isLoginFormActive) this.setJoin();else this.setLogin();
	};

	for (var key in eventMixin) {
	    AuthWindow.prototype[key] = eventMixin[key];
	}

	module.exports = AuthWindow;

/***/ }),
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

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aG9yaXphdGlvbi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA0N2EzYmNjZmQwY2VlZTgyZDgxMSIsIndlYnBhY2s6Ly8vLi9hdXRob3JpemF0aW9uL3NjcmlwdC5qcyIsIndlYnBhY2s6Ly8vLi9hdXRob3JpemF0aW9uL3N0eWxlLmxlc3MiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9nbG9iYWwtZXJyb3ItaGFuZGxlci9pbmRleC5qcyIsIndlYnBhY2s6Ly8vRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvY29tcG9uZW50RXJyb3JzLmpzIiwid2VicGFjazovLy9EOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9ldmVudE1peGluLmpzIiwid2VicGFjazovLy8uLi9ibG9ja3MvYXV0aC13aW5kb3cvaW5kZXguanMiLCJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2NoZWNrVXNlckRhdGEuanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9mb3JtL2luZGV4LmpzIiwid2VicGFjazovLy9EOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9zZW5kUmVxdWVzdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbiBcdHZhciBwYXJlbnRKc29ucEZ1bmN0aW9uID0gd2luZG93W1wid2VicGFja0pzb25wXCJdO1xuIFx0d2luZG93W1wid2VicGFja0pzb25wXCJdID0gZnVuY3Rpb24gd2VicGFja0pzb25wQ2FsbGJhY2soY2h1bmtJZHMsIG1vcmVNb2R1bGVzKSB7XG4gXHRcdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuIFx0XHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcbiBcdFx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMCwgY2FsbGJhY2tzID0gW107XG4gXHRcdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuIFx0XHRcdGlmKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSlcbiBcdFx0XHRcdGNhbGxiYWNrcy5wdXNoLmFwcGx5KGNhbGxiYWNrcywgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKTtcbiBcdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuIFx0XHR9XG4gXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG4gXHRcdFx0XHRtb2R1bGVzW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHR9XG4gXHRcdH1cbiBcdFx0aWYocGFyZW50SnNvbnBGdW5jdGlvbikgcGFyZW50SnNvbnBGdW5jdGlvbihjaHVua0lkcywgbW9yZU1vZHVsZXMpO1xuIFx0XHR3aGlsZShjYWxsYmFja3MubGVuZ3RoKVxuIFx0XHRcdGNhbGxiYWNrcy5zaGlmdCgpLmNhbGwobnVsbCwgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdH07XG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4gXHQvLyBcIjBcIiBtZWFucyBcImFscmVhZHkgbG9hZGVkXCJcbiBcdC8vIEFycmF5IG1lYW5zIFwibG9hZGluZ1wiLCBhcnJheSBjb250YWlucyBjYWxsYmFja3NcbiBcdHZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG4gXHRcdDA6MFxuIFx0fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG4gXHQvLyBUaGlzIGZpbGUgY29udGFpbnMgb25seSB0aGUgZW50cnkgY2h1bmsuXG4gXHQvLyBUaGUgY2h1bmsgbG9hZGluZyBmdW5jdGlvbiBmb3IgYWRkaXRpb25hbCBjaHVua3NcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZSA9IGZ1bmN0aW9uIHJlcXVpcmVFbnN1cmUoY2h1bmtJZCwgY2FsbGJhY2spIHtcbiBcdFx0Ly8gXCIwXCIgaXMgdGhlIHNpZ25hbCBmb3IgXCJhbHJlYWR5IGxvYWRlZFwiXG4gXHRcdGlmKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMClcbiBcdFx0XHRyZXR1cm4gY2FsbGJhY2suY2FsbChudWxsLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBhbiBhcnJheSBtZWFucyBcImN1cnJlbnRseSBsb2FkaW5nXCIuXG4gXHRcdGlmKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSAhPT0gdW5kZWZpbmVkKSB7XG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdLnB1c2goY2FsbGJhY2spO1xuIFx0XHR9IGVsc2Uge1xuIFx0XHRcdC8vIHN0YXJ0IGNodW5rIGxvYWRpbmdcbiBcdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSBbY2FsbGJhY2tdO1xuIFx0XHRcdHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiBcdFx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gXHRcdFx0c2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcbiBcdFx0XHRzY3JpcHQuY2hhcnNldCA9ICd1dGYtOCc7XG4gXHRcdFx0c2NyaXB0LmFzeW5jID0gdHJ1ZTtcblxuIFx0XHRcdHNjcmlwdC5zcmMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgY2h1bmtJZCArIFwiLlwiICsgKHt9W2NodW5rSWRdfHxjaHVua0lkKSArIFwiLmpzXCI7XG4gXHRcdFx0aGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA0N2EzYmNjZmQwY2VlZTgyZDgxMSIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICcuL3N0eWxlLmxlc3MnO1xyXG5cclxubGV0IEdsb2JhbEVycm9ySGFuZGxlciA9IHJlcXVpcmUoQkxPQ0tTICsgJ2dsb2JhbC1lcnJvci1oYW5kbGVyJyk7XHJcbmxldCBnbG9iYWxFcnJvckhhbmRsZXIgPSBuZXcgR2xvYmFsRXJyb3JIYW5kbGVyKCk7XHJcblxyXG5sZXQgQXV0aFdpbmRvdyA9IHJlcXVpcmUoQkxPQ0tTICsgJ2F1dGgtd2luZG93Jyk7XHJcblxyXG4vL1RPRE8gdGhpcyBsb2dpYyBzaG91bGQgYmUgaW4gQXV0aCBjbGFzc1xyXG5cclxubGV0IGlzTG9naW5Gb3JtQWN0aXZlID0gdHJ1ZTtcclxuaWYgKCFoaXN0b3J5LnN0YXRlICYmIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2ggPT09ICc/am9pbicpXHJcbiAgICBpc0xvZ2luRm9ybUFjdGl2ZSA9IGZhbHNlO1xyXG5cclxubGV0IGF1dGhXaW5kb3cgPSBuZXcgQXV0aFdpbmRvdyh7XHJcbiAgICBlbGVtOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXV0aC13aW5kb3cnKSxcclxuICAgIGlzTG9naW5Gb3JtQWN0aXZlXHJcbn0pO1xyXG5cclxubGV0IHN0YXRlID0gaXNMb2dpbkZvcm1BY3RpdmUgPyAnbG9naW4nIDogJ2pvaW4nO1xyXG5cclxuaGlzdG9yeS5yZXBsYWNlU3RhdGUoe1xyXG4gICAgdHlwZTogc3RhdGVcclxufSwgc3RhdGUsIGA/JHtzdGF0ZX1gKTtcclxuXHJcbndpbmRvdy5vbnBvcHN0YXRlID0gZSA9PiB7XHJcblxyXG4gICAgaWYgKGUuc3RhdGUpXHJcbiAgICAgICAgaWYgKGUuc3RhdGUudHlwZSA9PT0gJ2pvaW4nKVxyXG4gICAgICAgICAgICBhdXRoV2luZG93LnNldEpvaW4odHJ1ZSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBhdXRoV2luZG93LnNldExvZ2luKHRydWUpO1xyXG59O1xyXG5cclxuYXV0aFdpbmRvdy5vbignYXV0aC13aW5kb3dfc3dpdGNoZWQnLCBlID0+IHtcclxuXHJcblxyXG4gICAgaWYgKCFlLmRldGFpbC5pc1BvcFN0YXRlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ9C/0YPRiNGB0YLQtdC50YLQuNC8IScpO1xyXG5cclxuICAgICAgICBpZiAoZS5kZXRhaWwuaXNMb2dpbkZvcm1BY3RpdmUpIHtcclxuICAgICAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2xvZ2luJ1xyXG4gICAgICAgICAgICB9LCAnbG9naW4nLCAnP2xvZ2luJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2pvaW4nXHJcbiAgICAgICAgICAgIH0sICdqb2luJywgJz9qb2luJyk7XHJcbiAgICB9XHJcblxyXG59KTtcclxuXHJcblxyXG5sZXQgQXV0aG9yaXphdGlvbiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLmVsZW0gPSBvcHRpb25zLmVsZW07XHJcbiAgICB0aGlzLndyYXBwZXIgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmF1dGhvcml6YXRpb25fX2JhY2tncm91bmQtd3JhcHBlcicpO1xyXG5cclxuICAgIHRoaXMubGVmdFBpYzEgPSB0aGlzLndyYXBwZXIucXVlcnlTZWxlY3RvcignLmF1dGhvcml6YXRpb25fX2xlZnQtcGljOm50aC1jaGlsZCgxKScpO1xyXG4gICAgdGhpcy5sZWZ0UGljMiA9IHRoaXMud3JhcHBlci5xdWVyeVNlbGVjdG9yKCcuYXV0aG9yaXphdGlvbl9fbGVmdC1waWM6bnRoLWNoaWxkKDIpJyk7XHJcbiAgICB0aGlzLnJpZ2h0UGljMSA9IHRoaXMud3JhcHBlci5xdWVyeVNlbGVjdG9yKCcuYXV0aG9yaXphdGlvbl9fcmlnaHQtcGljOm50aC1jaGlsZCgxKScpO1xyXG4gICAgdGhpcy5yaWdodFBpYzIgPSB0aGlzLndyYXBwZXIucXVlcnlTZWxlY3RvcignLmF1dGhvcml6YXRpb25fX3JpZ2h0LXBpYzpudGgtY2hpbGQoMiknKTtcclxuXHJcbiAgICB0aGlzLmN1cnJlbnRMZWZ0UGljMUluZGV4ID0gLTE7XHJcbiAgICB0aGlzLmN1cnJlbnRMZWZ0UGljMkluZGV4ID0gLTE7XHJcbiAgICB0aGlzLmN1cnJlbnRSaWdodFBpYzFJbmRleCA9IC0xO1xyXG4gICAgdGhpcy5jdXJyZW50UmlnaHRQaWMySW5kZXggPSAtMTtcclxuICAgIHRoaXMuY3VycmVudExlZnRQaWMgPSAxO1xyXG4gICAgdGhpcy5jdXJyZW50UmlnaHRQaWMgPSAxO1xyXG5cclxuICAgIGxldCBpbWFnZVVybHMgPSBKU09OLnBhcnNlKHRoaXMud3JhcHBlci5kYXRhc2V0LmltYWdlcyk7XHJcbiAgICB0aGlzLmltYWdlcyA9IFtdO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW1hZ2VVcmxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IHByZWxvYWRlZEltZyA9IG5ldyBJbWFnZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmltYWdlc1tpXSA9IHtcclxuICAgICAgICAgICAgaW5kZXg6IGksXHJcbiAgICAgICAgICAgIHVybDogaW1hZ2VVcmxzW2ldLFxyXG4gICAgICAgICAgICBwcmVsb2FkZWRJbWcsXHJcbiAgICAgICAgICAgIGxvYWRlZDogZmFsc2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBwcmVsb2FkZWRJbWcub25sb2FkID0gZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2VzW2ldLmxvYWRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50TGVmdFBpYzFJbmRleCA9PT0gLTEgJiYgdGhpcy5jdXJyZW50TGVmdFBpYyA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgLy9UT0RPIGJhY2tkcm9wIHNob3VsZCBkZWNyZWFzZSBpdHMgb3BhY2l0eSBub3dcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0TGVmdFBpY0ltYWdlKDEsIHRoaXMuaW1hZ2VzW2ldKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudExlZnRQaWMySW5kZXggPT09IC0xICYmIHRoaXMuY3VycmVudExlZnRQaWMgPT09IDIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0TGVmdFBpY0ltYWdlKDIsIHRoaXMuaW1hZ2VzW2ldKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFJpZ2h0UGljMUluZGV4ID09PSAtMSAmJiB0aGlzLmN1cnJlbnRSaWdodFBpYyA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRSaWdodFBpY0ltYWdlKDEsIHRoaXMuaW1hZ2VzW2ldKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFJpZ2h0UGljMkluZGV4ID09PSAtMSAmJiB0aGlzLmN1cnJlbnRSaWdodFBpYyA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRSaWdodFBpY0ltYWdlKDIsIHRoaXMuaW1hZ2VzW2ldKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9O1xyXG4gICAgICAgIHByZWxvYWRlZEltZy5zcmMgPSBpbWFnZVVybHNbaV07XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5sZWZ0UGljMi5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25zdGFydCcsIGUgPT4ge1xyXG4gICAgICAgIHRoaXMuc2V0TGVmdFBpY0ltYWdlKDIsIHRoaXMuZ2V0TmV4dExlZnRJbWFnZSgpKTtcclxuICAgIH0sIGZhbHNlKTtcclxuXHJcbiAgICB0aGlzLmxlZnRQaWMxLmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbml0ZXJhdGlvbicsIGUgPT4ge1xyXG4gICAgICAgIHRoaXMuc2V0TGVmdFBpY0ltYWdlKDEsIHRoaXMuZ2V0TmV4dExlZnRJbWFnZSgpKTtcclxuICAgIH0sIGZhbHNlKTtcclxuXHJcbiAgICB0aGlzLmxlZnRQaWMyLmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbml0ZXJhdGlvbicsIGUgPT4ge1xyXG4gICAgICAgIHRoaXMuc2V0TGVmdFBpY0ltYWdlKDIsIHRoaXMuZ2V0TmV4dExlZnRJbWFnZSgpKTtcclxuICAgIH0sIGZhbHNlKTtcclxuXHJcblxyXG4gICAgdGhpcy5yaWdodFBpYzIuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uc3RhcnQnLCBlID0+IHtcclxuICAgICAgICB0aGlzLnNldFJpZ2h0UGljSW1hZ2UoMiwgdGhpcy5nZXROZXh0UmlnaHRJbWFnZSgpKTtcclxuICAgIH0sIGZhbHNlKTtcclxuXHJcbiAgICB0aGlzLnJpZ2h0UGljMS5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25pdGVyYXRpb24nLCBlID0+IHtcclxuICAgICAgICB0aGlzLnNldFJpZ2h0UGljSW1hZ2UoMSwgdGhpcy5nZXROZXh0UmlnaHRJbWFnZSgpKTtcclxuICAgIH0sIGZhbHNlKTtcclxuXHJcbiAgICB0aGlzLnJpZ2h0UGljMi5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25pdGVyYXRpb24nLCBlID0+IHtcclxuICAgICAgICB0aGlzLnNldFJpZ2h0UGljSW1hZ2UoMiwgdGhpcy5nZXROZXh0UmlnaHRJbWFnZSgpKTtcclxuICAgIH0sIGZhbHNlKTtcclxuXHJcbn07XHJcblxyXG5BdXRob3JpemF0aW9uLnByb3RvdHlwZS5nZXROZXh0TGVmdEltYWdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGN1cnJlbnRWaXNpYmxlSW5kZXggPSAodGhpcy5jdXJyZW50TGVmdFBpYyA9PT0gMSkgPyB0aGlzLmN1cnJlbnRMZWZ0UGljMUluZGV4IDogdGhpcy5jdXJyZW50TGVmdFBpYzJJbmRleDtcclxuICAgIGxldCBjdXJyZW50UmlnaHRJbmRleCA9ICh0aGlzLmN1cnJlbnRSaWdodFBpYyA9PT0gMSkgPyB0aGlzLmN1cnJlbnRSaWdodFBpYzFJbmRleCA6IHRoaXMuY3VycmVudFJpZ2h0UGljMkluZGV4O1xyXG5cclxuICAgIGxldCBpID0gKGN1cnJlbnRWaXNpYmxlSW5kZXggKyAxKSAlIHRoaXMuaW1hZ2VzLmxlbmd0aDtcclxuICAgIGRvIHtcclxuICAgICAgICBpZiAodGhpcy5pbWFnZXNbaV0ubG9hZGVkID09PSB0cnVlICYmIGkgIT09IGN1cnJlbnRSaWdodEluZGV4KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbWFnZXNbaV07XHJcbiAgICAgICAgaSA9IChpICsgMSkgJSB0aGlzLmltYWdlcy5sZW5ndGg7XHJcbiAgICB9XHJcbiAgICB3aGlsZSAoaSAhPT0gY3VycmVudFZpc2libGVJbmRleCk7XHJcblxyXG4gICAgaWYgKHRoaXMuaW1hZ2VzW2N1cnJlbnRSaWdodEluZGV4XSlcclxuICAgICAgICByZXR1cm4gdGhpcy5pbWFnZXNbY3VycmVudFJpZ2h0SW5kZXhdO1xyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuQXV0aG9yaXphdGlvbi5wcm90b3R5cGUuZ2V0TmV4dFJpZ2h0SW1hZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgY3VycmVudFZpc2libGVJbmRleCA9ICh0aGlzLmN1cnJlbnRSaWdodFBpYyA9PT0gMSkgPyB0aGlzLmN1cnJlbnRSaWdodFBpYzFJbmRleCA6IHRoaXMuY3VycmVudFJpZ2h0UGljMkluZGV4O1xyXG4gICAgbGV0IGN1cnJlbnRMZWZ0SW5kZXggPSAodGhpcy5jdXJyZW50TGVmdFBpYyA9PT0gMSkgPyB0aGlzLmN1cnJlbnRMZWZ0UGljMUluZGV4IDogdGhpcy5jdXJyZW50TGVmdFBpYzJJbmRleDtcclxuXHJcbiAgICBsZXQgaSA9IGN1cnJlbnRWaXNpYmxlSW5kZXggLSAxO1xyXG4gICAgaWYgKGkgPCAwKVxyXG4gICAgICAgIGkgPSB0aGlzLmltYWdlcy5sZW5ndGggLSAxO1xyXG5cclxuICAgIGRvIHtcclxuICAgICAgICBpZiAodGhpcy5pbWFnZXNbaV0ubG9hZGVkID09PSB0cnVlICYmIGkgIT09IGN1cnJlbnRMZWZ0SW5kZXgpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmltYWdlc1tpXTtcclxuXHJcbiAgICAgICAgaSAtPSAxO1xyXG4gICAgICAgIGlmIChpID09PSAtMSlcclxuICAgICAgICAgICAgaSA9IHRoaXMuaW1hZ2VzLmxlbmd0aCAtIDE7XHJcbiAgICB9XHJcbiAgICB3aGlsZSAoaSAhPT0gY3VycmVudFZpc2libGVJbmRleCk7XHJcblxyXG4gICAgaWYgKHRoaXMuaW1hZ2VzW2N1cnJlbnRMZWZ0SW5kZXhdKVxyXG4gICAgICAgIHJldHVybiB0aGlzLmltYWdlc1tjdXJyZW50TGVmdEluZGV4XTtcclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxuXHJcbkF1dGhvcml6YXRpb24ucHJvdG90eXBlLnNldExlZnRQaWNJbWFnZSA9IGZ1bmN0aW9uIChwaWMsIGltYWdlKSB7XHJcblxyXG4gICAgdGhpcy5jdXJyZW50TGVmdFBpYyA9IHBpYztcclxuXHJcbiAgICBpZiAocGljID09PSAxKSB7XHJcbiAgICAgICAgaWYgKGltYWdlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudExlZnRQaWMxSW5kZXggPSBpbWFnZS5pbmRleDtcclxuICAgICAgICAgICAgdGhpcy5zZXRVcmwodGhpcy5sZWZ0UGljMSwgaW1hZ2UudXJsKTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgdGhpcy5zZXRVcmwodGhpcy5sZWZ0UGljMSwgbnVsbCk7XHJcbiAgICB9IGVsc2UgaWYgKHBpYyA9PT0gMikge1xyXG4gICAgICAgIGlmIChpbWFnZSkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRMZWZ0UGljMkluZGV4ID0gaW1hZ2UuaW5kZXg7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VXJsKHRoaXMubGVmdFBpYzIsIGltYWdlLnVybCk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuc2V0VXJsKHRoaXMubGVmdFBpYzIsIG51bGwpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcbkF1dGhvcml6YXRpb24ucHJvdG90eXBlLnNldFJpZ2h0UGljSW1hZ2UgPSBmdW5jdGlvbiAocGljLCBpbWFnZSkge1xyXG4gICAgdGhpcy5jdXJyZW50UmlnaHRQaWMgPSBwaWM7XHJcblxyXG4gICAgaWYgKHBpYyA9PT0gMSkge1xyXG4gICAgICAgIGlmIChpbWFnZSkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRSaWdodFBpYzFJbmRleCA9IGltYWdlLmluZGV4O1xyXG4gICAgICAgICAgICB0aGlzLnNldFVybCh0aGlzLnJpZ2h0UGljMSwgaW1hZ2UudXJsKTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgdGhpcy5zZXRVcmwodGhpcy5yaWdodFBpYzEsIG51bGwpO1xyXG4gICAgfSBlbHNlIGlmIChwaWMgPT09IDIpIHtcclxuICAgICAgICBpZiAoaW1hZ2UpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UmlnaHRQaWMySW5kZXggPSBpbWFnZS5pbmRleDtcclxuICAgICAgICAgICAgdGhpcy5zZXRVcmwodGhpcy5yaWdodFBpYzIsIGltYWdlLnVybCk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuc2V0VXJsKHRoaXMucmlnaHRQaWMyLCBudWxsKTtcclxuICAgIH1cclxufTtcclxuXHJcbkF1dGhvcml6YXRpb24ucHJvdG90eXBlLnNldFVybCA9IGZ1bmN0aW9uIChlbGVtLCB1cmwpIHtcclxuICAgIGlmICh1cmwpXHJcbiAgICAgICAgZWxlbS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCcke3VybH0nKWA7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgZWxlbS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAnbm9uZSc7XHJcbn07XHJcblxyXG5sZXQgcGFnZSA9IG5ldyBBdXRob3JpemF0aW9uKHtcclxuICAgIGVsZW06IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdXRob3JpemF0aW9uJylcclxufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXV0aG9yaXphdGlvbi9zY3JpcHQuanMiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYXV0aG9yaXphdGlvbi9zdHlsZS5sZXNzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImxldCBHbG9iYWxFcnJvckhhbmRsZXIgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBlID0+IHtcclxuICAgICAgICBsZXQgZXJyb3IgPSBlLmRldGFpbDtcclxuICAgICAgICB0aGlzLmNhbGwoZXJyb3IpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5HbG9iYWxFcnJvckhhbmRsZXIucHJvdG90eXBlLmNhbGwgPSBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgIHJlcXVpcmUuZW5zdXJlKFtMSUJTICsgJ2NvbXBvbmVudEVycm9ycycsIEJMT0NLUyArICdtZXNzYWdlLW1vZGFsLXdpbmRvdyddLCBmdW5jdGlvbiAocmVxdWlyZSkge1xyXG4gICAgICAgIGxldCBDb21wb25lbnRFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5Db21wb25lbnRFcnJvcjtcclxuICAgICAgICBsZXQgTWVzc2FnZU1vZGFsV2luZG93ID0gcmVxdWlyZShCTE9DS1MgKyAnbWVzc2FnZS1tb2RhbC13aW5kb3cnKTtcclxuXHJcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgQ29tcG9uZW50RXJyb3IpIHtcclxuICAgICAgICAgICAgaWYgKGVycm9yLnN0YXR1cyA9PT0gNDAxKSB7XHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkaXJlY3RlZF91cmwnLCB3aW5kb3cubG9jYXRpb24uaHJlZik7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSAnL2F1dGhvcml6YXRpb24nO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IG1lc3NhZ2VNb2RhbFdpbmRvdyA9IG5ldyBNZXNzYWdlTW9kYWxXaW5kb3coe21lc3NhZ2U6IGVycm9yLm1lc3NhZ2V9KTtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2VNb2RhbFdpbmRvdy5hY3RpdmF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcclxuICAgIH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHbG9iYWxFcnJvckhhbmRsZXI7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9nbG9iYWwtZXJyb3ItaGFuZGxlci9pbmRleC5qcyIsImZ1bmN0aW9uIEN1c3RvbUVycm9yKG1lc3NhZ2UpIHtcclxuXHR0aGlzLm5hbWUgPSBcIkN1c3RvbUVycm9yXCI7XHJcblx0dGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuXHJcblx0aWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKVxyXG5cdFx0RXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgQ3VzdG9tRXJyb3IpO1xyXG5cdGVsc2VcclxuXHRcdHRoaXMuc3RhY2sgPSAobmV3IEVycm9yKCkpLnN0YWNrO1xyXG59XHJcbkN1c3RvbUVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcclxuQ3VzdG9tRXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ3VzdG9tRXJyb3I7XHJcblxyXG5cclxuZnVuY3Rpb24gQ29tcG9uZW50RXJyb3IobWVzc2FnZSwgc3RhdHVzKSB7XHJcblx0Q3VzdG9tRXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlIHx8ICdBbiBlcnJvciBoYXMgb2NjdXJyZWQnICk7XHJcblx0dGhpcy5uYW1lID0gXCJDb21wb25lbnRFcnJvclwiO1xyXG5cdHRoaXMuc3RhdHVzID0gc3RhdHVzO1xyXG59XHJcbkNvbXBvbmVudEVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ3VzdG9tRXJyb3IucHJvdG90eXBlKTtcclxuQ29tcG9uZW50RXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ29tcG9uZW50RXJyb3I7XHJcblxyXG5mdW5jdGlvbiBDbGllbnRFcnJvcihtZXNzYWdlLCBkZXRhaWwsIHN0YXR1cykge1xyXG5cdENvbXBvbmVudEVycm9yLmNhbGwodGhpcywgbWVzc2FnZSB8fCAnQW4gZXJyb3IgaGFzIG9jY3VycmVkLiBDaGVjayBpZiBqYXZhc2NyaXB0IGlzIGVuYWJsZWQnLCBzdGF0dXMpO1xyXG5cdHRoaXMubmFtZSA9IFwiQ2xpZW50RXJyb3JcIjtcclxuXHR0aGlzLmRldGFpbCA9IGRldGFpbDtcclxufVxyXG5DbGllbnRFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbXBvbmVudEVycm9yLnByb3RvdHlwZSk7XHJcbkNsaWVudEVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENsaWVudEVycm9yO1xyXG5cclxuXHJcbmZ1bmN0aW9uIEltYWdlTm90Rm91bmQobWVzc2FnZSkge1xyXG4gICAgQ2xpZW50RXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlIHx8ICdJbWFnZSBub3QgZm91bmQuIEl0IHByb2JhYmx5IGhhcyBiZWVuIHJlbW92ZWQnLCBudWxsLCA0MDQpO1xyXG4gICAgdGhpcy5uYW1lID0gXCJJbWFnZU5vdEZvdW5kXCI7XHJcbn1cclxuSW1hZ2VOb3RGb3VuZC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENsaWVudEVycm9yLnByb3RvdHlwZSk7XHJcbkltYWdlTm90Rm91bmQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gSW1hZ2VOb3RGb3VuZDtcclxuXHJcbmZ1bmN0aW9uIFNlcnZlckVycm9yKG1lc3NhZ2UsIHN0YXR1cykge1xyXG5cdENvbXBvbmVudEVycm9yLmNhbGwodGhpcywgbWVzc2FnZSB8fCAnVGhlcmUgaXMgc29tZSBlcnJvciBvbiB0aGUgc2VydmVyIHNpZGUnLCBzdGF0dXMpO1xyXG5cdHRoaXMubmFtZSA9IFwiU2VydmVyRXJyb3JcIjtcclxufVxyXG5TZXJ2ZXJFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbXBvbmVudEVycm9yLnByb3RvdHlwZSk7XHJcblNlcnZlckVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNlcnZlckVycm9yO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0Q29tcG9uZW50RXJyb3IsXHJcblx0Q2xpZW50RXJyb3IsXHJcbiAgICBJbWFnZU5vdEZvdW5kLFxyXG5cdFNlcnZlckVycm9yXHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9jb21wb25lbnRFcnJvcnMuanMiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcblx0b246IGZ1bmN0aW9uKGV2ZW50TmFtZSwgY2IpIHtcclxuXHRcdGlmICh0aGlzLmVsZW0pXHJcblx0XHRcdHRoaXMuZWxlbS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2IpO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHR0aGlzLmxpc3RlbmVycy5wdXNoKHtcclxuXHRcdFx0XHRldmVudE5hbWUsXHJcblx0XHRcdFx0Y2JcclxuXHRcdFx0fSk7XHJcblx0fSxcclxuXHJcblx0dHJpZ2dlcjogZnVuY3Rpb24oZXZlbnROYW1lLCBkZXRhaWwpIHtcclxuXHRcdHRoaXMuZWxlbS5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChldmVudE5hbWUsIHtcclxuXHRcdFx0YnViYmxlczogdHJ1ZSxcclxuXHRcdFx0Y2FuY2VsYWJsZTogdHJ1ZSxcclxuXHRcdFx0ZGV0YWlsOiBkZXRhaWxcclxuXHRcdH0pKTtcclxuXHR9LFxyXG5cclxuXHRlcnJvcjogZnVuY3Rpb24oZXJyKSB7XHJcblx0XHR0aGlzLmVsZW0uZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2Vycm9yJywge1xyXG5cdFx0XHRidWJibGVzOiB0cnVlLFxyXG5cdFx0XHRjYW5jZWxhYmxlOiB0cnVlLFxyXG5cdFx0XHRkZXRhaWw6IGVyclxyXG5cdFx0fSkpO1xyXG5cdH1cclxuXHJcblxyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvZXZlbnRNaXhpbi5qcyIsImxldCBjaGVja1VzZXJEYXRhID0gcmVxdWlyZShMSUJTICsgJ2NoZWNrVXNlckRhdGEnKTtcclxubGV0IGV2ZW50TWl4aW4gPSByZXF1aXJlKExJQlMgKyAnZXZlbnRNaXhpbicpO1xyXG5sZXQgQ2xpZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ2xpZW50RXJyb3I7XHJcbmxldCBGb3JtID0gcmVxdWlyZShCTE9DS1MgKyAnZm9ybScpO1xyXG5cclxubGV0IEF1dGhXaW5kb3cgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgdGhpcy5lbGVtID0gb3B0aW9ucy5lbGVtO1xyXG4gICAgdGhpcy5pc0xvZ2luRm9ybUFjdGl2ZSA9IG9wdGlvbnMuaXNMb2dpbkZvcm1BY3RpdmU7XHJcbiAgICB0aGlzLmlzQXZhaWxhYmxlID0gdHJ1ZTtcclxuICAgIHRoaXMuaGVhZGVyRWxlbSA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcud2luZG93X19oZWFkZXInKTtcclxuXHJcbiAgICB0aGlzLnBhbmVsID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJ2Rpdi53aW5kb3dfX3BhbmVsJyk7XHJcbiAgICB0aGlzLmxvZ2luRm9ybUVsZW0gPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignZm9ybVtuYW1lPVwibG9naW5cIl0nKTtcclxuICAgIHRoaXMuam9pbkZvcm1FbGVtID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJ2Zvcm1bbmFtZT1cImpvaW5cIl0nKTtcclxuXHJcbiAgICB0aGlzLnNldEpvaW5BRUhhbmRsZXIgPSB0aGlzLnNldEpvaW5BRUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2V0TG9naW5BRUhhbmRsZXIgPSB0aGlzLnNldExvZ2luQUVIYW5kbGVyLmJpbmQodGhpcyk7XHJcblxyXG5cclxuICAgIHRoaXMuam9pbkZvcm0gPSBuZXcgRm9ybSh7XHJcbiAgICAgICAgZWxlbTogdGhpcy5qb2luRm9ybUVsZW0sXHJcbiAgICAgICAgZmllbGRzOiB7XHJcbiAgICAgICAgICAgICd1c2VybmFtZSc6IHt9LFxyXG4gICAgICAgICAgICAnZW1haWwnOiB7XHJcbiAgICAgICAgICAgICAgICBhbGlhczogJ2UtbWFpbCdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3Bhc3N3b3JkJzoge30sXHJcbiAgICAgICAgICAgICdwYXNzd29yZC1hZ2Fpbic6IHtcclxuICAgICAgICAgICAgICAgIGV4dHJhOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6ICdwYXNzd29yZCcsXHJcbiAgICAgICAgICAgICAgICBhbGlhczogJ3Bhc3N3b3JkJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB1cmw6ICcvam9pbidcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMubG9naW5Gb3JtID0gbmV3IEZvcm0oe1xyXG4gICAgICAgIGVsZW06IHRoaXMubG9naW5Gb3JtRWxlbSxcclxuICAgICAgICBmaWVsZHM6IHtcclxuICAgICAgICAgICAgJ3VzZXJuYW1lJzoge1xyXG4gICAgICAgICAgICAgICAgdmFsaWRhdG9yOiAnbm9uLWVtcHR5J1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAncGFzc3dvcmQnOiB7XHJcbiAgICAgICAgICAgICAgICB2YWxpZGF0b3I6ICdub24tZW1wdHknXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHVybDogJy9sb2dpbidcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICB0aGlzLmxvZ2luRm9ybS5vbignZm9ybV9zZW50JywgZSA9PiB7XHJcbiAgICAgICAgdGhpcy5yZWRpcmVjdCgpO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLmpvaW5Gb3JtLm9uKCdmb3JtX3NlbnQnLCBlID0+IHtcclxuICAgICAgICB0aGlzLnJlZGlyZWN0KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoIXRoaXMuaXNMb2dpbkZvcm1BY3RpdmUpXHJcbiAgICAgICAgdGhpcy5zZXRKb2luQUVIYW5kbGVyKCk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5zZXRMb2dpbkFFSGFuZGxlcigpO1xyXG5cclxuICAgIHRoaXMuZWxlbS5vbmNsaWNrID0gZSA9PiB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzQXZhaWxhYmxlKVxyXG4gICAgICAgICAgICBpZiAoZS50YXJnZXQubWF0Y2hlcygnLndpbmRvd19fbWVzc2FnZSAucmVmJykpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmVsZW0uYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBlID0+IHtcclxuICAgICAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0ICYmIGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygndGV4dGJveF9fZmllbGQnKSkge1xyXG4gICAgICAgICAgICBsZXQgdGIgPSBlLnRhcmdldC5jbG9zZXN0KCcudGV4dGJveCcpO1xyXG4gICAgICAgICAgICBpZiAodGIpXHJcbiAgICAgICAgICAgICAgICB0Yi5jbGFzc0xpc3QuYWRkKCd0ZXh0Ym94X2ZvY3VzJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSwgdHJ1ZSk7XHJcblxyXG4gICAgdGhpcy5lbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBlID0+IHtcclxuICAgICAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0ICYmIGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygndGV4dGJveF9fZmllbGQnKSkge1xyXG4gICAgICAgICAgICBsZXQgdGIgPSBlLnRhcmdldC5jbG9zZXN0KCcudGV4dGJveCcpO1xyXG4gICAgICAgICAgICBpZiAodGIpXHJcbiAgICAgICAgICAgICAgICB0Yi5jbGFzc0xpc3QucmVtb3ZlKCd0ZXh0Ym94X2ZvY3VzJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSwgdHJ1ZSk7XHJcbn07XHJcblxyXG5BdXRoV2luZG93LnByb3RvdHlwZS5yZWRpcmVjdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCB1cmwgPSAnLyc7XHJcbiAgICB1cmwgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVkaXJlY3RlZF91cmwnKSB8fCB1cmw7XHJcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgncmVkaXJlY3RlZF91cmwnKTtcclxuICAgIHdpbmRvdy5sb2NhdGlvbiA9IHVybDtcclxufTtcclxuXHJcbkF1dGhXaW5kb3cucHJvdG90eXBlLnNldEpvaW4gPSBmdW5jdGlvbiAoaXNQb3BTdGF0ZSkge1xyXG4gICAgdGhpcy5qb2luRm9ybS5jbGVhcigpO1xyXG4gICAgdGhpcy5pc0F2YWlsYWJsZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5sb2dpbkZvcm0uc2V0QXZhaWxhYmxlKGZhbHNlKTtcclxuICAgIHRoaXMubG9naW5Gb3JtRWxlbS5jbGFzc0xpc3QuYWRkKCdhdXRoLXdpbmRvd19fZm9ybS1mYWRpbmctb3V0Jyk7XHJcblxyXG4gICAgY29uc29sZS5sb2coJ3NldEpvaW4gJyArIGlzUG9wU3RhdGUpO1xyXG5cclxuICAgIHRoaXMudHJpZ2dlcignYXV0aC13aW5kb3dfc3dpdGNoZWQnLCB7XHJcbiAgICAgICAgaXNMb2dpbkZvcm1BY3RpdmU6IGZhbHNlLFxyXG4gICAgICAgIGlzUG9wU3RhdGVcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMubG9naW5Gb3JtRWxlbS5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCB0aGlzLnNldEpvaW5BRUhhbmRsZXIsIGZhbHNlKTtcclxufTtcclxuXHJcbkF1dGhXaW5kb3cucHJvdG90eXBlLnNldEpvaW5BRUhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmhlYWRlckVsZW0udGV4dENvbnRlbnQgPSAnc2lnbmluZyB1cCc7XHJcblxyXG4gICAgdGhpcy5pc0F2YWlsYWJsZSA9IHRydWU7XHJcbiAgICB0aGlzLmxvZ2luRm9ybS5zZXRBdmFpbGFibGUodHJ1ZSk7XHJcbiAgICB0aGlzLmxvZ2luRm9ybUVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnYXV0aC13aW5kb3dfX2Zvcm0tZmFkaW5nLW91dCcpO1xyXG4gICAgdGhpcy5sb2dpbkZvcm1FbGVtLmNsYXNzTGlzdC5hZGQoJ2F1dGgtd2luZG93X19mb3JtX2ludmlzaWJsZScpO1xyXG4gICAgdGhpcy5qb2luRm9ybUVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnYXV0aC13aW5kb3dfX2Zvcm1faW52aXNpYmxlJyk7XHJcbiAgICB0aGlzLmpvaW5Gb3JtRWxlbUhlaWdodCA9IHRoaXMuam9pbkZvcm1FbGVtSGVpZ2h0IHx8IHRoaXMuam9pbkZvcm1FbGVtLnNjcm9sbEhlaWdodDtcclxuICAgIHRoaXMucGFuZWwuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5qb2luRm9ybUVsZW1IZWlnaHR9cHhgO1xyXG4gICAgdGhpcy5pc0xvZ2luRm9ybUFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5sb2dpbkZvcm1FbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbmVuZCcsIHRoaXMuc2V0Sm9pbkFFSGFuZGxlcik7XHJcblxyXG5cclxuXHJcbn07XHJcblxyXG5BdXRoV2luZG93LnByb3RvdHlwZS5zZXRMb2dpbiA9IGZ1bmN0aW9uIChpc1BvcFN0YXRlKSB7XHJcbiAgICB0aGlzLmxvZ2luRm9ybS5jbGVhcigpO1xyXG4gICAgdGhpcy5pc0F2YWlsYWJsZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5qb2luRm9ybS5zZXRBdmFpbGFibGUoZmFsc2UpO1xyXG4gICAgdGhpcy5qb2luRm9ybUVsZW0uY2xhc3NMaXN0LmFkZCgnYXV0aC13aW5kb3dfX2Zvcm0tZmFkaW5nLW91dCcpO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKCdzZXRMb2dpbiAnICsgaXNQb3BTdGF0ZSk7XHJcblxyXG4gICAgdGhpcy50cmlnZ2VyKCdhdXRoLXdpbmRvd19zd2l0Y2hlZCcsIHtcclxuICAgICAgICBpc0xvZ2luRm9ybUFjdGl2ZTogdHJ1ZSxcclxuICAgICAgICBpc1BvcFN0YXRlXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmpvaW5Gb3JtRWxlbS5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCB0aGlzLnNldExvZ2luQUVIYW5kbGVyLCBmYWxzZSk7XHJcbn07XHJcblxyXG5BdXRoV2luZG93LnByb3RvdHlwZS5zZXRMb2dpbkFFSGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuaGVhZGVyRWxlbS50ZXh0Q29udGVudCA9ICdsb2dnaW5nIGluJztcclxuXHJcbiAgICB0aGlzLmlzQXZhaWxhYmxlID0gdHJ1ZTtcclxuICAgIHRoaXMuam9pbkZvcm0uc2V0QXZhaWxhYmxlKHRydWUpO1xyXG4gICAgdGhpcy5qb2luRm9ybUVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnYXV0aC13aW5kb3dfX2Zvcm0tZmFkaW5nLW91dCcpO1xyXG4gICAgdGhpcy5qb2luRm9ybUVsZW0uY2xhc3NMaXN0LmFkZCgnYXV0aC13aW5kb3dfX2Zvcm1faW52aXNpYmxlJyk7XHJcbiAgICB0aGlzLmxvZ2luRm9ybUVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnYXV0aC13aW5kb3dfX2Zvcm1faW52aXNpYmxlJyk7XHJcbiAgICB0aGlzLmxvZ2luRm9ybUVsZW1IZWlnaHQgPSB0aGlzLmxvZ2luRm9ybUVsZW1IZWlnaHQgfHwgdGhpcy5sb2dpbkZvcm1FbGVtLnNjcm9sbEhlaWdodDtcclxuICAgIHRoaXMucGFuZWwuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5sb2dpbkZvcm1FbGVtSGVpZ2h0fXB4YDtcclxuICAgIHRoaXMuaXNMb2dpbkZvcm1BY3RpdmUgPSB0cnVlO1xyXG4gICAgdGhpcy5qb2luRm9ybUVsZW0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgdGhpcy5zZXRMb2dpbkFFSGFuZGxlcik7XHJcblxyXG59O1xyXG5cclxuQXV0aFdpbmRvdy5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuaXNMb2dpbkZvcm1BY3RpdmUpXHJcbiAgICAgICAgdGhpcy5zZXRKb2luKCk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5zZXRMb2dpbigpO1xyXG59O1xyXG5cclxuZm9yIChsZXQga2V5IGluIGV2ZW50TWl4aW4pIHtcclxuICAgIEF1dGhXaW5kb3cucHJvdG90eXBlW2tleV0gPSBldmVudE1peGluW2tleV07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQXV0aFdpbmRvdztcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9hdXRoLXdpbmRvdy9pbmRleC5qcyIsIi8vbGV0IGRlYnVnID0gcmVxdWlyZSgnZGVidWcnKSgnYXBwOmNoZWNrVXNlcmREYXRhJyk7XHJcblxyXG5jb25zdCBQUk9QRVJUWV9TWU1CT0wgPSAnW3Byb3BlcnR5XSc7XHJcblxyXG5sZXQgbWVzc2FnZXMgPSB7XHJcbiAgICBwbGFpbjogJ2luY29ycmVjdCBbcHJvcGVydHldJyxcclxuICAgIGVtcHR5OiAnW3Byb3BlcnR5XSBtdXN0IG5vdCBiZSBlbXB0eScsXHJcbiAgICB0b29CaWc6IHZhbHVlID0+IHtcclxuICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAgICAgIHJldHVybiBgW3Byb3BlcnR5XSBtdXN0IGJlIGxvd2VyIHRoYW4gJHt2YWx1ZSArIDF9IHN5bWJvbHNgO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuICdbcHJvcGVydHldIGlzIHRvbyBiaWcnO1xyXG4gICAgfSxcclxuICAgIHRvb1NtYWxsOiB2YWx1ZSA9PiB7XHJcbiAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgICAgICByZXR1cm4gYFtwcm9wZXJ0eV0gbXVzdCBiZSBncmVhdGVyIHRoYW4gJHt2YWx1ZSAtIDF9IHN5bWJvbHNgO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuICdbcHJvcGVydHldIGlzIHRvbyBzaG9ydCc7XHJcbiAgICB9XHJcbn07XHJcblxyXG5sZXQgdGVzdHMgPSB7XHJcbiAgICByZWdFeHA6IChyZWdFeHAsIHZhbHVlKSA9PiByZWdFeHAudGVzdCh2YWx1ZSksXHJcbiAgICBtYXg6IChtYXgsIHZhbHVlKSA9PiAodmFsdWUubGVuZ3RoIDw9IG1heCksXHJcbiAgICBtaW46IChtaW4sIHZhbHVlKSA9PiAodmFsdWUubGVuZ3RoID49IG1pbiksXHJcbiAgICBub25FbXB0eTogKHZhbHVlKSA9PiAodmFsdWUubGVuZ3RoID4gMClcclxuXHJcbn07XHJcblxyXG5cclxubGV0IGNoZWNrcyA9IHtcclxuICAgIG1heDogKHZhbHVlLCBlcnJvck1lc3NhZ2UpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGVycm9yTWVzc2FnZSB8fCBtZXNzYWdlcy50b29CaWcodmFsdWUpLFxyXG4gICAgICAgICAgICB0ZXN0OiB0ZXN0cy5tYXguYmluZChudWxsLCB2YWx1ZSlcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuXHJcbiAgICBtaW46ICh2YWx1ZSwgZXJyb3JNZXNzYWdlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlcnJvck1lc3NhZ2UgfHwgbWVzc2FnZXMudG9vU21hbGwodmFsdWUpLFxyXG4gICAgICAgICAgICB0ZXN0OiB0ZXN0cy5taW4uYmluZChudWxsLCB2YWx1ZSlcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuXHJcbiAgICBub25FbXB0eTogKGVycm9yTWVzc2FnZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZXJyb3JNZXNzYWdlIHx8IG1lc3NhZ2VzLmVtcHR5LFxyXG4gICAgICAgICAgICB0ZXN0OiB0ZXN0cy5ub25FbXB0eVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn07XHJcblxyXG5mdW5jdGlvbiBjb21wdXRlRXJyb3JNZXNzYWdlKHRlbXBsYXRlLCBwcm9wZXJ0eSkge1xyXG4gICAgbGV0IHBvcztcclxuICAgIHRlbXBsYXRlID0gdGVtcGxhdGUgfHwgbWVzc2FnZXMucGxhaW47XHJcbiAgICBwcm9wZXJ0eSA9IHByb3BlcnR5IHx8ICd0aGlzIHByb3BlcnR5JztcclxuICAgIHdoaWxlICh+KHBvcyA9IHRlbXBsYXRlLmluZGV4T2YoUFJPUEVSVFlfU1lNQk9MKSkpXHJcbiAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5zdWJzdHJpbmcoMCwgcG9zKSArIHByb3BlcnR5ICsgdGVtcGxhdGUuc3Vic3RyaW5nKHBvcyArIFBST1BFUlRZX1NZTUJPTC5sZW5ndGgpO1xyXG4gICAgcmV0dXJuIHRlbXBsYXRlO1xyXG59XHJcblxyXG5sZXQgdmFsaWRhdG9ycyA9IHtcclxuXHJcbiAgICAnbm9uLWVtcHR5Jzoge1xyXG4gICAgICAgIGNoZWNrczogW1xyXG4gICAgICAgICAgICBjaGVja3Mubm9uRW1wdHkoKVxyXG4gICAgICAgIF1cclxuICAgIH0sXHJcblxyXG4gICAgJ2VtYWlsJzoge1xyXG4gICAgICAgIGNoZWNrczogW1xyXG4gICAgICAgICAgICBjaGVja3Mubm9uRW1wdHkoKSxcclxuICAgICAgICAgICAgY2hlY2tzLm1heCgxMDAsIG1lc3NhZ2VzLnRvb0JpZygpKSxcclxuICAgICAgICAgICAgY2hlY2tzLm1pbig2LCBtZXNzYWdlcy50b29TbWFsbCgpKSwge1xyXG4gICAgICAgICAgICAgICAgdGVzdDogdGVzdHMucmVnRXhwLmJpbmQobnVsbCwgL14oXFx3K1stXFwuXT8/KStAW1xcdy4tXStcXHdcXC5cXHd7Miw1fSQvaSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgIH0sXHJcblxyXG5cclxuICAgICd1c2VybmFtZSc6IHtcclxuICAgICAgICBjaGVja3M6IFtcclxuICAgICAgICAgICAgY2hlY2tzLm5vbkVtcHR5KCksXHJcbiAgICAgICAgICAgIGNoZWNrcy5tYXgoMzApLFxyXG4gICAgICAgICAgICBjaGVja3MubWluKDUpLCB7XHJcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6ICdtdXN0IG9ubHkgY29udGFpbiBhbHBoYW51bWVyaWMgc3ltYm9scycsXHJcbiAgICAgICAgICAgICAgICB0ZXN0OiB0ZXN0cy5yZWdFeHAuYmluZChudWxsLCAvXltBLVowLTktXSskL2kpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAncGFzc3dvcmQnOiB7XHJcbiAgICAgICAgY2hlY2tzOiBbXHJcbiAgICAgICAgICAgIGNoZWNrcy5ub25FbXB0eSgpLFxyXG4gICAgICAgICAgICBjaGVja3MubWF4KDMwKSxcclxuICAgICAgICAgICAgY2hlY2tzLm1pbig1KSwge1xyXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiAnW3Byb3BlcnR5XSBpcyB0b28gd2VhaycsXHJcbiAgICAgICAgICAgICAgICB0ZXN0OiB0ZXN0cy5yZWdFeHAuYmluZChudWxsLCAvKD89LipcXGQpKD89LipbYS16XSkoPz0uKltBLVpdKS57Nix9LylcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICBdXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAncGFzc3dvcmQtYWdhaW4nOiB7XHJcbiAgICAgICAgY2hlY2tzOiBbXHJcbiAgICAgICAgICAgIGNoZWNrcy5ub25FbXB0eSgncmUtZW50ZXIgW3Byb3BlcnR5XScpLCB7XHJcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6ICdwYXNzd29yZHMgZG8gbm90IG1hdGNoJyxcclxuICAgICAgICAgICAgICAgIHRlc3Q6IGZ1bmN0aW9uKHZhbHVlLCBkYXRhQ2h1bmssIGRhdGEpIHtcclxuXHRcdFx0XHRcdGxldCBvcmlnaW5hbFBhc3MgPSBkYXRhQ2h1bmsucGFzc3dvcmQ7XHJcblx0XHRcdFx0XHRpZiAoIW9yaWdpbmFsUGFzcylcclxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdubyBvcmlnaW5hbCBwYXNzd29yZCByZWZlcmVuY2UnKTtcclxuXHJcblx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspXHJcblx0XHRcdFx0XHRcdGlmIChkYXRhW2ldLnByb3BlcnR5ID09PSBvcmlnaW5hbFBhc3MpXHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuICh2YWx1ZSA9PT0gZGF0YVtpXS52YWx1ZSk7XHJcblxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdubyBvcmdpbmFsIHBhc3N3b3JkIGRhdGEnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICBdXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAndXJsJzoge1xyXG4gICAgICAgIGNoZWNrczogW3tcclxuICAgICAgICAgICAgdGVzdDogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGxldCB1cmxSZWdleCA9ICdeKD8hbWFpbHRvOikoPzooPzpodHRwfGh0dHBzKTovLykoPzpcXFxcUysoPzo6XFxcXFMqKT9AKT8oPzooPzooPzpbMS05XVxcXFxkP3wxXFxcXGRcXFxcZHwyWzAxXVxcXFxkfDIyWzAtM10pKD86XFxcXC4oPzoxP1xcXFxkezEsMn18MlswLTRdXFxcXGR8MjVbMC01XSkpezJ9KD86XFxcXC4oPzpbMC05XVxcXFxkP3wxXFxcXGRcXFxcZHwyWzAtNF1cXFxcZHwyNVswLTRdKSl8KD86KD86W2EtelxcXFx1MDBhMS1cXFxcdWZmZmYwLTldKy0/KSpbYS16XFxcXHUwMGExLVxcXFx1ZmZmZjAtOV0rKSg/OlxcXFwuKD86W2EtelxcXFx1MDBhMS1cXFxcdWZmZmYwLTldKy0/KSpbYS16XFxcXHUwMGExLVxcXFx1ZmZmZjAtOV0rKSooPzpcXFxcLig/OlthLXpcXFxcdTAwYTEtXFxcXHVmZmZmXXsyLH0pKSl8bG9jYWxob3N0KSg/OjpcXFxcZHsyLDV9KT8oPzooL3xcXFxcP3wjKVteXFxcXHNdKik/JCc7XHJcbiAgICAgICAgICAgICAgICBsZXQgdXJsID0gbmV3IFJlZ0V4cCh1cmxSZWdleCwgJ2knKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5sZW5ndGggPCAyMDgzICYmIHVybC50ZXN0KHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1dXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAnZGVzY3JpcHRpb24nOiB7XHJcbiAgICAgICAgY2hlY2tzOiBbXHJcbiAgICAgICAgICAgIGNoZWNrcy5tYXgoMjU1KVxyXG4gICAgICAgIF1cclxuICAgIH0sXHJcblxyXG4gICAgJ2NvbW1lbnQnOiB7XHJcbiAgICAgICAgY2hlY2tzOiBbXHJcbiAgICAgICAgICAgIGNoZWNrcy5ub25FbXB0eSgpLFxyXG4gICAgICAgICAgICBjaGVja3MubWF4KDI1NSlcclxuICAgICAgICBdXHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRFcnJvckFycmF5KGRhdGEpIHtcclxuXHJcblx0aWYgKCFBcnJheS5pc0FycmF5KGRhdGEpKSB7XHJcblx0XHRsZXQgY29ycmVjdERhdGEgPSBbXTtcclxuXHRcdGZvciAobGV0IGtleSBpbiBkYXRhKSB7XHJcblx0XHRcdGNvcnJlY3REYXRhLnB1c2goe1xyXG5cdFx0XHRcdHByb3BlcnR5OiBrZXksXHJcblx0XHRcdFx0dmFsdWU6IGRhdGFba2V5XVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdGRhdGEgPSBjb3JyZWN0RGF0YTtcclxuXHR9XHJcblxyXG4gICAgbGV0IHJlc3VsdCA9IFtdO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG5cdFx0bGV0IGtleSA9IGRhdGFbaV0udmFsaWRhdG9yO1xyXG5cdFx0aWYgKCFrZXkpXHJcblx0XHRcdGtleSA9IGRhdGFbaV0ucHJvcGVydHk7XHJcblxyXG4gICAgICAgIGlmICghdmFsaWRhdG9yc1trZXldKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIHZhbGlkYXRvciBmb3IgdGhpcyBwcm9wZXJ0eTogJyArIGtleSk7XHJcblxyXG4gICAgICAgIHZhbGlkYXRvcnNba2V5XS5jaGVja3MuZm9yRWFjaChjaGVjayA9PiB7XHJcbiAgICAgICAgICAgIGlmICghY2hlY2sudGVzdChkYXRhW2ldLnZhbHVlLCBkYXRhW2ldLCBkYXRhKSlcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eTogZGF0YVtpXS5wcm9wZXJ0eSxcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjb21wdXRlRXJyb3JNZXNzYWdlKGNoZWNrLmVycm9yTWVzc2FnZSwgZGF0YVtpXS5hbGlhcyB8fCBkYXRhW2ldLnByb3BlcnR5IHx8IGtleSlcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRlc3RQcm9wZXJ0eShuYW1lLCB2YWx1ZSkge1xyXG4gICAgbGV0IHJlc3VsdCA9IHRydWU7XHJcbiAgICB2YWxpZGF0b3JzW25hbWVdLmNoZWNrcy5mb3JFYWNoKGNoZWNrID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCFjaGVjay50ZXN0KHZhbHVlKSlcclxuICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgZ2V0RXJyb3JBcnJheSxcclxuICAgIHRlc3RQcm9wZXJ0eVxyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvY2hlY2tVc2VyRGF0YS5qcyIsImxldCBldmVudE1peGluID0gcmVxdWlyZShMSUJTICsgJ2V2ZW50TWl4aW4nKTtcclxubGV0IGdldEVycm9yQXJyYXkgPSByZXF1aXJlKExJQlMgKyAnY2hlY2tVc2VyRGF0YScpLmdldEVycm9yQXJyYXk7XHJcbmxldCBDbGllbnRFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5DbGllbnRFcnJvcjtcclxuXHJcbmxldCBGb3JtID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG4gICAgdGhpcy5lbGVtID0gb3B0aW9ucy5lbGVtO1xyXG4gICAgdGhpcy5maWVsZHMgPSBvcHRpb25zLmZpZWxkcztcclxuICAgIHRoaXMudXJsID0gb3B0aW9ucy51cmw7XHJcbiAgICB0aGlzLmlzQXZhaWxhYmxlID0gdHJ1ZTtcclxuXHJcbiAgICB0aGlzLnNhdmVCdXR0b24gPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLnNhdmUtYnV0dG9uJyk7XHJcblxyXG4gICAgdGhpcy5lbGVtLm9uY2xpY2sgPSBlID0+IHtcclxuICAgICAgICBpZiAoIXRoaXMuaXNBdmFpbGFibGUpIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKGUudGFyZ2V0ICE9PSB0aGlzLnNhdmVCdXR0b24pIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy5jbGVhckVycm9yQm94ZXMoKTtcclxuICAgICAgICBsZXQgZXJyb3JzID0gdGhpcy5nZXRFcnJvcnMoKTtcclxuICAgICAgICBpZiAoZXJyb3JzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgdGhpcy5zZW5kKHRoaXMuZ2V0Qm9keSgpKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuc2V0RXJyb3JzKGVycm9ycyk7XHJcbiAgICB9O1xyXG59O1xyXG5cclxuRm9ybS5wcm90b3R5cGUuc2V0UHJvcGVydHlFcnJvciA9IGZ1bmN0aW9uKHByb3BlcnR5LCBtZXNzYWdlKSB7XHJcbiAgICB0aGlzLmdldEVycm9yQm94KHByb3BlcnR5KS50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XHJcbn07XHJcblxyXG5Gb3JtLnByb3RvdHlwZS5nZXRFcnJvckJveCA9IGZ1bmN0aW9uKGZpZWxkTmFtZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuZWxlbVtmaWVsZE5hbWVdLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignLnRleHRib3hfX2Vycm9yJyk7XHJcbn07XHJcblxyXG5Gb3JtLnByb3RvdHlwZS5zZXRBdmFpbGFibGUgPSBmdW5jdGlvbihpc0F2YWlsYWJsZSkge1xyXG4gICAgdGhpcy5pc0F2YWlsYWJsZSA9IGlzQXZhaWxhYmxlO1xyXG59O1xyXG5cclxuRm9ybS5wcm90b3R5cGUuZ2V0RGF0YU9iaiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IG9wdGlvbnMgPSBbXTtcclxuXHJcbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5maWVsZHMpIHtcclxuICAgICAgICBsZXQgY2h1bmsgPSB0aGlzLmZpZWxkc1trZXldO1xyXG4gICAgICAgIGlmICghY2h1bmsubm9WYWxpZGF0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmICghY2h1bmsucHJvcGVydHkpXHJcbiAgICAgICAgICAgICAgICBjaHVuay5wcm9wZXJ0eSA9IGtleTtcclxuICAgICAgICAgICAgY2h1bmsudmFsdWUgPSB0aGlzLmVsZW1ba2V5XS52YWx1ZTtcclxuICAgICAgICAgICAgb3B0aW9ucy5wdXNoKGNodW5rKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG9wdGlvbnM7XHJcbn07XHJcblxyXG5Gb3JtLnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24oYm9keSkge1xyXG4gICAgcmVxdWlyZShMSUJTICsgJ3NlbmRSZXF1ZXN0JykoYm9keSwgJ1BPU1QnLCB0aGlzLnVybCwgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBDbGllbnRFcnJvciAmJiBlcnIuZGV0YWlsKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRQcm9wZXJ0eUVycm9yKGVyci5kZXRhaWwucHJvcGVydHksIGVyci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy50cmlnZ2VyKCdmb3JtX3NlbnQnLCB7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcblxyXG5Gb3JtLnByb3RvdHlwZS5jbGVhckVycm9yQm94ZXMgPSBmdW5jdGlvbigpIHtcclxuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmZpZWxkcylcclxuICAgICAgICB0aGlzLmdldEVycm9yQm94KGtleSkudGV4dENvbnRlbnQgPSAnJztcclxufTtcclxuXHJcbkZvcm0ucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmNsZWFyRXJyb3JCb3hlcygpO1xyXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuZmllbGRzKVxyXG4gICAgICAgIHRoaXMuZWxlbVtrZXldLnZhbHVlID0gJyc7XHJcbn07XHJcblxyXG5Gb3JtLnByb3RvdHlwZS5nZXRFcnJvcnMgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBnZXRFcnJvckFycmF5KHRoaXMuZ2V0RGF0YU9iaigpKTtcclxufTtcclxuXHJcblxyXG5Gb3JtLnByb3RvdHlwZS5zZXRFcnJvcnMgPSBmdW5jdGlvbihlcnJvcnMpIHtcclxuICAgIHRoaXMuY2xlYXJFcnJvckJveGVzKCk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVycm9ycy5sZW5ndGg7IGkrKylcclxuICAgICAgICBpZiAodGhpcy5nZXRFcnJvckJveChlcnJvcnNbaV0ucHJvcGVydHkpLnRleHRDb250ZW50ID09ICcnKVxyXG4gICAgICAgICAgICB0aGlzLnNldFByb3BlcnR5RXJyb3IoZXJyb3JzW2ldLnByb3BlcnR5LCBlcnJvcnNbaV0ubWVzc2FnZSk7XHJcbn07XHJcblxyXG5Gb3JtLnByb3RvdHlwZS5nZXRCb2R5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgYm9keSA9ICcnO1xyXG5cclxuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmZpZWxkcylcclxuICAgICAgICBpZiAoIXRoaXMuZmllbGRzW2tleV0uZXh0cmEpXHJcbiAgICAgICAgICAgIGJvZHkgKz0gKGJvZHkgPT09ICcnID8gJycgOiAnJicpICtcclxuICAgICAgICAgICAga2V5ICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMuZWxlbVtrZXldLnZhbHVlKTtcclxuICAgIHJldHVybiBib2R5O1xyXG59O1xyXG5cclxuZm9yIChsZXQga2V5IGluIGV2ZW50TWl4aW4pIHtcclxuICAgIEZvcm0ucHJvdG90eXBlW2tleV0gPSBldmVudE1peGluW2tleV07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRm9ybTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9mb3JtL2luZGV4LmpzIiwibGV0IFNlcnZlckVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLlNlcnZlckVycm9yO1xyXG5sZXQgQ2xpZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ2xpZW50RXJyb3I7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChib2R5T2JqLCBtZXRob2QsIHVybCwgY2IpIHtcclxuXHJcblxyXG4gICAgbGV0IGJvZHkgPSAnJztcclxuICAgIGlmICghKHR5cGVvZiBib2R5T2JqID09PSAnc3RyaW5nJykpIHtcclxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gYm9keU9iaikge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSAnJztcclxuICAgICAgICAgICAgaWYgKGJvZHlPYmpba2V5XSlcclxuICAgICAgICAgICAgICAgIHZhbHVlID0ga2V5ICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KCh0eXBlb2YgYm9keU9ialtrZXldID09PSAnb2JqZWN0JykgPyBKU09OLnN0cmluZ2lmeShib2R5T2JqW2tleV0pIDogYm9keU9ialtrZXldKTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgYm9keSArPSAoYm9keSA9PT0gJycgPyAnJyA6ICcmJykgKyB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2VcclxuICAgICAgICBib2R5ID0gYm9keU9iajtcclxuXHJcblxyXG4gICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgeGhyLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xyXG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcclxuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiWC1SZXF1ZXN0ZWQtV2l0aFwiLCBcIlhNTEh0dHBSZXF1ZXN0XCIpO1xyXG5cclxuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSAhPSA0KSByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCByZXNwb25zZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucmVzcG9uc2VUZXh0KVxyXG4gICAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjYihuZXcgU2VydmVyRXJyb3IoJ1NlcnZlciBpcyBub3QgcmVzcG9uZGluZycpKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMClcclxuICAgICAgICAgICAgY2IobnVsbCwgcmVzcG9uc2UpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPj0gNDAwICYmIHRoaXMuc3RhdHVzIDwgNTAwKVxyXG4gICAgICAgICAgICBjYihuZXcgQ2xpZW50RXJyb3IocmVzcG9uc2UubWVzc2FnZSwgcmVzcG9uc2UuZGV0YWlsLCB0aGlzLnN0YXR1cykpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPj0gNTAwKVxyXG4gICAgICAgICAgICBjYihuZXcgU2VydmVyRXJyb3IocmVzcG9uc2UubWVzc2FnZSwgdGhpcy5zdGF0dXMpKTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc29sZS5sb2coYHNlbmRpbmcgbmV4dCByZXF1ZXN0OiAke2JvZHl9YCk7XHJcbiAgICB4aHIuc2VuZChib2R5KTtcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL3NlbmRSZXF1ZXN0LmpzIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7O0FBbkNBO0FBQUE7QUFvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNuT0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUE7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7OztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDcktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFHQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBZEE7QUFBQTtBQWVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQzFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7OyIsInNvdXJjZVJvb3QiOiIifQ==