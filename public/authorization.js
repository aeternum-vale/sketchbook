webpackJsonp([0],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	__webpack_require__(1);

	var GlobalErrorHandler = __webpack_require__(21);
	var globalErrorHandler = new GlobalErrorHandler();

	var AuthWindow = __webpack_require__(29);

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

	        preloadedImg.onload = preloadedImg.onerror = function (e) {
	            console.log('onload');

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

/***/ 1:
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }),

/***/ 22:
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

/***/ 25:
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

/***/ 29:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var checkUserData = __webpack_require__(30);
	var eventMixin = __webpack_require__(25);
	var ClientError = __webpack_require__(22).ClientError;
	var Form = __webpack_require__(31);

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

/***/ 30:
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

/***/ 31:
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

/***/ 32:
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

/***/ })

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aG9yaXphdGlvbi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL2F1dGhvcml6YXRpb24vc2NyaXB0LmpzIiwid2VicGFjazovLy8uL2F1dGhvcml6YXRpb24vc3R5bGUubGVzcyIsIndlYnBhY2s6Ly8vRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvY29tcG9uZW50RXJyb3JzLmpzIiwid2VicGFjazovLy9EOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9ldmVudE1peGluLmpzIiwid2VicGFjazovLy8uLi9ibG9ja3MvYXV0aC13aW5kb3cvaW5kZXguanMiLCJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2NoZWNrVXNlckRhdGEuanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9mb3JtL2luZGV4LmpzIiwid2VicGFjazovLy9EOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9zZW5kUmVxdWVzdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAnLi9zdHlsZS5sZXNzJztcclxuXHJcbmxldCBHbG9iYWxFcnJvckhhbmRsZXIgPSByZXF1aXJlKEJMT0NLUyArICdnbG9iYWwtZXJyb3ItaGFuZGxlcicpO1xyXG5sZXQgZ2xvYmFsRXJyb3JIYW5kbGVyID0gbmV3IEdsb2JhbEVycm9ySGFuZGxlcigpO1xyXG5cclxubGV0IEF1dGhXaW5kb3cgPSByZXF1aXJlKEJMT0NLUyArICdhdXRoLXdpbmRvdycpO1xyXG5cclxuLy9UT0RPIHRoaXMgbG9naWMgc2hvdWxkIGJlIGluIEF1dGggY2xhc3NcclxuXHJcbmxldCBpc0xvZ2luRm9ybUFjdGl2ZSA9IHRydWU7XHJcbmlmICghaGlzdG9yeS5zdGF0ZSAmJiB3aW5kb3cubG9jYXRpb24uc2VhcmNoID09PSAnP2pvaW4nKVxyXG4gICAgaXNMb2dpbkZvcm1BY3RpdmUgPSBmYWxzZTtcclxuXHJcbmxldCBhdXRoV2luZG93ID0gbmV3IEF1dGhXaW5kb3coe1xyXG4gICAgZWxlbTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dGgtd2luZG93JyksXHJcbiAgICBpc0xvZ2luRm9ybUFjdGl2ZVxyXG59KTtcclxuXHJcbmxldCBzdGF0ZSA9IGlzTG9naW5Gb3JtQWN0aXZlID8gJ2xvZ2luJyA6ICdqb2luJztcclxuXHJcbmhpc3RvcnkucmVwbGFjZVN0YXRlKHtcclxuICAgIHR5cGU6IHN0YXRlXHJcbn0sIHN0YXRlLCBgPyR7c3RhdGV9YCk7XHJcblxyXG53aW5kb3cub25wb3BzdGF0ZSA9IGUgPT4ge1xyXG5cclxuICAgIGlmIChlLnN0YXRlKVxyXG4gICAgICAgIGlmIChlLnN0YXRlLnR5cGUgPT09ICdqb2luJylcclxuICAgICAgICAgICAgYXV0aFdpbmRvdy5zZXRKb2luKHRydWUpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgYXV0aFdpbmRvdy5zZXRMb2dpbih0cnVlKTtcclxufTtcclxuXHJcbmF1dGhXaW5kb3cub24oJ2F1dGgtd2luZG93X3N3aXRjaGVkJywgZSA9PiB7XHJcblxyXG5cclxuICAgIGlmICghZS5kZXRhaWwuaXNQb3BTdGF0ZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCfQv9GD0YjRgdGC0LXQudGC0LjQvCEnKTtcclxuXHJcbiAgICAgICAgaWYgKGUuZGV0YWlsLmlzTG9naW5Gb3JtQWN0aXZlKSB7XHJcbiAgICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdsb2dpbidcclxuICAgICAgICAgICAgfSwgJ2xvZ2luJywgJz9sb2dpbicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdqb2luJ1xyXG4gICAgICAgICAgICB9LCAnam9pbicsICc/am9pbicpO1xyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5cclxubGV0IEF1dGhvcml6YXRpb24gPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgdGhpcy5lbGVtID0gb3B0aW9ucy5lbGVtO1xyXG4gICAgdGhpcy53cmFwcGVyID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5hdXRob3JpemF0aW9uX19iYWNrZ3JvdW5kLXdyYXBwZXInKTtcclxuXHJcbiAgICB0aGlzLmxlZnRQaWMxID0gdGhpcy53cmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJy5hdXRob3JpemF0aW9uX19sZWZ0LXBpYzpudGgtY2hpbGQoMSknKTtcclxuICAgIHRoaXMubGVmdFBpYzIgPSB0aGlzLndyYXBwZXIucXVlcnlTZWxlY3RvcignLmF1dGhvcml6YXRpb25fX2xlZnQtcGljOm50aC1jaGlsZCgyKScpO1xyXG4gICAgdGhpcy5yaWdodFBpYzEgPSB0aGlzLndyYXBwZXIucXVlcnlTZWxlY3RvcignLmF1dGhvcml6YXRpb25fX3JpZ2h0LXBpYzpudGgtY2hpbGQoMSknKTtcclxuICAgIHRoaXMucmlnaHRQaWMyID0gdGhpcy53cmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJy5hdXRob3JpemF0aW9uX19yaWdodC1waWM6bnRoLWNoaWxkKDIpJyk7XHJcblxyXG4gICAgdGhpcy5jdXJyZW50TGVmdFBpYzFJbmRleCA9IC0xO1xyXG4gICAgdGhpcy5jdXJyZW50TGVmdFBpYzJJbmRleCA9IC0xO1xyXG4gICAgdGhpcy5jdXJyZW50UmlnaHRQaWMxSW5kZXggPSAtMTtcclxuICAgIHRoaXMuY3VycmVudFJpZ2h0UGljMkluZGV4ID0gLTE7XHJcbiAgICB0aGlzLmN1cnJlbnRMZWZ0UGljID0gMTtcclxuICAgIHRoaXMuY3VycmVudFJpZ2h0UGljID0gMTtcclxuXHJcbiAgICBsZXQgaW1hZ2VVcmxzID0gSlNPTi5wYXJzZSh0aGlzLndyYXBwZXIuZGF0YXNldC5pbWFnZXMpO1xyXG4gICAgdGhpcy5pbWFnZXMgPSBbXTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGltYWdlVXJscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBwcmVsb2FkZWRJbWcgPSBuZXcgSW1hZ2UoKTtcclxuXHJcbiAgICAgICAgdGhpcy5pbWFnZXNbaV0gPSB7XHJcbiAgICAgICAgICAgIGluZGV4OiBpLFxyXG4gICAgICAgICAgICB1cmw6IGltYWdlVXJsc1tpXSxcclxuICAgICAgICAgICAgcHJlbG9hZGVkSW1nLFxyXG4gICAgICAgICAgICBsb2FkZWQ6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcHJlbG9hZGVkSW1nLm9ubG9hZCA9IHByZWxvYWRlZEltZy5vbmVycm9yID0gZSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdvbmxvYWQnKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2VzW2ldLmxvYWRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50TGVmdFBpYzFJbmRleCA9PT0gLTEgJiYgdGhpcy5jdXJyZW50TGVmdFBpYyA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgLy9UT0RPIGJhY2tkcm9wIHNob3VsZCBkZWNyZWFzZSBpdHMgb3BhY2l0eSBub3dcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0TGVmdFBpY0ltYWdlKDEsIHRoaXMuaW1hZ2VzW2ldKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudExlZnRQaWMySW5kZXggPT09IC0xICYmIHRoaXMuY3VycmVudExlZnRQaWMgPT09IDIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0TGVmdFBpY0ltYWdlKDIsIHRoaXMuaW1hZ2VzW2ldKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFJpZ2h0UGljMUluZGV4ID09PSAtMSAmJiB0aGlzLmN1cnJlbnRSaWdodFBpYyA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRSaWdodFBpY0ltYWdlKDEsIHRoaXMuaW1hZ2VzW2ldKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFJpZ2h0UGljMkluZGV4ID09PSAtMSAmJiB0aGlzLmN1cnJlbnRSaWdodFBpYyA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRSaWdodFBpY0ltYWdlKDIsIHRoaXMuaW1hZ2VzW2ldKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICBwcmVsb2FkZWRJbWcuc3JjID0gaW1hZ2VVcmxzW2ldO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubGVmdFBpYzIuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uc3RhcnQnLCBlID0+IHtcclxuICAgICAgICB0aGlzLnNldExlZnRQaWNJbWFnZSgyLCB0aGlzLmdldE5leHRMZWZ0SW1hZ2UoKSk7XHJcbiAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgdGhpcy5sZWZ0UGljMS5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25pdGVyYXRpb24nLCBlID0+IHtcclxuICAgICAgICB0aGlzLnNldExlZnRQaWNJbWFnZSgxLCB0aGlzLmdldE5leHRMZWZ0SW1hZ2UoKSk7XHJcbiAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgdGhpcy5sZWZ0UGljMi5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25pdGVyYXRpb24nLCBlID0+IHtcclxuICAgICAgICB0aGlzLnNldExlZnRQaWNJbWFnZSgyLCB0aGlzLmdldE5leHRMZWZ0SW1hZ2UoKSk7XHJcbiAgICB9LCBmYWxzZSk7XHJcblxyXG5cclxuICAgIHRoaXMucmlnaHRQaWMyLmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbnN0YXJ0JywgZSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZXRSaWdodFBpY0ltYWdlKDIsIHRoaXMuZ2V0TmV4dFJpZ2h0SW1hZ2UoKSk7XHJcbiAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgdGhpcy5yaWdodFBpYzEuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uaXRlcmF0aW9uJywgZSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZXRSaWdodFBpY0ltYWdlKDEsIHRoaXMuZ2V0TmV4dFJpZ2h0SW1hZ2UoKSk7XHJcbiAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgdGhpcy5yaWdodFBpYzIuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uaXRlcmF0aW9uJywgZSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZXRSaWdodFBpY0ltYWdlKDIsIHRoaXMuZ2V0TmV4dFJpZ2h0SW1hZ2UoKSk7XHJcbiAgICB9LCBmYWxzZSk7XHJcblxyXG59O1xyXG5cclxuQXV0aG9yaXphdGlvbi5wcm90b3R5cGUuZ2V0TmV4dExlZnRJbWFnZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBjdXJyZW50VmlzaWJsZUluZGV4ID0gKHRoaXMuY3VycmVudExlZnRQaWMgPT09IDEpID8gdGhpcy5jdXJyZW50TGVmdFBpYzFJbmRleCA6IHRoaXMuY3VycmVudExlZnRQaWMySW5kZXg7XHJcbiAgICBsZXQgY3VycmVudFJpZ2h0SW5kZXggPSAodGhpcy5jdXJyZW50UmlnaHRQaWMgPT09IDEpID8gdGhpcy5jdXJyZW50UmlnaHRQaWMxSW5kZXggOiB0aGlzLmN1cnJlbnRSaWdodFBpYzJJbmRleDtcclxuXHJcbiAgICBsZXQgaSA9IChjdXJyZW50VmlzaWJsZUluZGV4ICsgMSkgJSB0aGlzLmltYWdlcy5sZW5ndGg7XHJcbiAgICBkbyB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2VzW2ldLmxvYWRlZCA9PT0gdHJ1ZSAmJiBpICE9PSBjdXJyZW50UmlnaHRJbmRleClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW1hZ2VzW2ldO1xyXG4gICAgICAgIGkgPSAoaSArIDEpICUgdGhpcy5pbWFnZXMubGVuZ3RoO1xyXG4gICAgfVxyXG4gICAgd2hpbGUgKGkgIT09IGN1cnJlbnRWaXNpYmxlSW5kZXgpO1xyXG5cclxuICAgIGlmICh0aGlzLmltYWdlc1tjdXJyZW50UmlnaHRJbmRleF0pXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW1hZ2VzW2N1cnJlbnRSaWdodEluZGV4XTtcclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxuXHJcbkF1dGhvcml6YXRpb24ucHJvdG90eXBlLmdldE5leHRSaWdodEltYWdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGN1cnJlbnRWaXNpYmxlSW5kZXggPSAodGhpcy5jdXJyZW50UmlnaHRQaWMgPT09IDEpID8gdGhpcy5jdXJyZW50UmlnaHRQaWMxSW5kZXggOiB0aGlzLmN1cnJlbnRSaWdodFBpYzJJbmRleDtcclxuICAgIGxldCBjdXJyZW50TGVmdEluZGV4ID0gKHRoaXMuY3VycmVudExlZnRQaWMgPT09IDEpID8gdGhpcy5jdXJyZW50TGVmdFBpYzFJbmRleCA6IHRoaXMuY3VycmVudExlZnRQaWMySW5kZXg7XHJcblxyXG4gICAgbGV0IGkgPSBjdXJyZW50VmlzaWJsZUluZGV4IC0gMTtcclxuICAgIGlmIChpIDwgMClcclxuICAgICAgICBpID0gdGhpcy5pbWFnZXMubGVuZ3RoIC0gMTtcclxuXHJcbiAgICBkbyB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2VzW2ldLmxvYWRlZCA9PT0gdHJ1ZSAmJiBpICE9PSBjdXJyZW50TGVmdEluZGV4KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbWFnZXNbaV07XHJcblxyXG4gICAgICAgIGkgLT0gMTtcclxuICAgICAgICBpZiAoaSA9PT0gLTEpXHJcbiAgICAgICAgICAgIGkgPSB0aGlzLmltYWdlcy5sZW5ndGggLSAxO1xyXG4gICAgfVxyXG4gICAgd2hpbGUgKGkgIT09IGN1cnJlbnRWaXNpYmxlSW5kZXgpO1xyXG5cclxuICAgIGlmICh0aGlzLmltYWdlc1tjdXJyZW50TGVmdEluZGV4XSlcclxuICAgICAgICByZXR1cm4gdGhpcy5pbWFnZXNbY3VycmVudExlZnRJbmRleF07XHJcblxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcblxyXG5BdXRob3JpemF0aW9uLnByb3RvdHlwZS5zZXRMZWZ0UGljSW1hZ2UgPSBmdW5jdGlvbiAocGljLCBpbWFnZSkge1xyXG5cclxuICAgIHRoaXMuY3VycmVudExlZnRQaWMgPSBwaWM7XHJcblxyXG4gICAgaWYgKHBpYyA9PT0gMSkge1xyXG4gICAgICAgIGlmIChpbWFnZSkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRMZWZ0UGljMUluZGV4ID0gaW1hZ2UuaW5kZXg7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VXJsKHRoaXMubGVmdFBpYzEsIGltYWdlLnVybCk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuc2V0VXJsKHRoaXMubGVmdFBpYzEsIG51bGwpO1xyXG4gICAgfSBlbHNlIGlmIChwaWMgPT09IDIpIHtcclxuICAgICAgICBpZiAoaW1hZ2UpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50TGVmdFBpYzJJbmRleCA9IGltYWdlLmluZGV4O1xyXG4gICAgICAgICAgICB0aGlzLnNldFVybCh0aGlzLmxlZnRQaWMyLCBpbWFnZS51cmwpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICB0aGlzLnNldFVybCh0aGlzLmxlZnRQaWMyLCBudWxsKTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5BdXRob3JpemF0aW9uLnByb3RvdHlwZS5zZXRSaWdodFBpY0ltYWdlID0gZnVuY3Rpb24gKHBpYywgaW1hZ2UpIHtcclxuICAgIHRoaXMuY3VycmVudFJpZ2h0UGljID0gcGljO1xyXG5cclxuICAgIGlmIChwaWMgPT09IDEpIHtcclxuICAgICAgICBpZiAoaW1hZ2UpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UmlnaHRQaWMxSW5kZXggPSBpbWFnZS5pbmRleDtcclxuICAgICAgICAgICAgdGhpcy5zZXRVcmwodGhpcy5yaWdodFBpYzEsIGltYWdlLnVybCk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuc2V0VXJsKHRoaXMucmlnaHRQaWMxLCBudWxsKTtcclxuICAgIH0gZWxzZSBpZiAocGljID09PSAyKSB7XHJcbiAgICAgICAgaWYgKGltYWdlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFJpZ2h0UGljMkluZGV4ID0gaW1hZ2UuaW5kZXg7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VXJsKHRoaXMucmlnaHRQaWMyLCBpbWFnZS51cmwpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICB0aGlzLnNldFVybCh0aGlzLnJpZ2h0UGljMiwgbnVsbCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5BdXRob3JpemF0aW9uLnByb3RvdHlwZS5zZXRVcmwgPSBmdW5jdGlvbiAoZWxlbSwgdXJsKSB7XHJcbiAgICBpZiAodXJsKVxyXG4gICAgICAgIGVsZW0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgnJHt1cmx9JylgO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIGVsZW0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gJ25vbmUnO1xyXG59O1xyXG5cclxubGV0IHBhZ2UgPSBuZXcgQXV0aG9yaXphdGlvbih7XHJcbiAgICBlbGVtOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXV0aG9yaXphdGlvbicpXHJcbn0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2F1dGhvcml6YXRpb24vc2NyaXB0LmpzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2F1dGhvcml6YXRpb24vc3R5bGUubGVzc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJmdW5jdGlvbiBDdXN0b21FcnJvcihtZXNzYWdlKSB7XHJcblx0dGhpcy5uYW1lID0gXCJDdXN0b21FcnJvclwiO1xyXG5cdHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcblxyXG5cdGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSlcclxuXHRcdEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIEN1c3RvbUVycm9yKTtcclxuXHRlbHNlXHJcblx0XHR0aGlzLnN0YWNrID0gKG5ldyBFcnJvcigpKS5zdGFjaztcclxufVxyXG5DdXN0b21FcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XHJcbkN1c3RvbUVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEN1c3RvbUVycm9yO1xyXG5cclxuXHJcbmZ1bmN0aW9uIENvbXBvbmVudEVycm9yKG1lc3NhZ2UsIHN0YXR1cykge1xyXG5cdEN1c3RvbUVycm9yLmNhbGwodGhpcywgbWVzc2FnZSB8fCAnQW4gZXJyb3IgaGFzIG9jY3VycmVkJyApO1xyXG5cdHRoaXMubmFtZSA9IFwiQ29tcG9uZW50RXJyb3JcIjtcclxuXHR0aGlzLnN0YXR1cyA9IHN0YXR1cztcclxufVxyXG5Db21wb25lbnRFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEN1c3RvbUVycm9yLnByb3RvdHlwZSk7XHJcbkNvbXBvbmVudEVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENvbXBvbmVudEVycm9yO1xyXG5cclxuZnVuY3Rpb24gQ2xpZW50RXJyb3IobWVzc2FnZSwgZGV0YWlsLCBzdGF0dXMpIHtcclxuXHRDb21wb25lbnRFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ0FuIGVycm9yIGhhcyBvY2N1cnJlZC4gQ2hlY2sgaWYgamF2YXNjcmlwdCBpcyBlbmFibGVkJywgc3RhdHVzKTtcclxuXHR0aGlzLm5hbWUgPSBcIkNsaWVudEVycm9yXCI7XHJcblx0dGhpcy5kZXRhaWwgPSBkZXRhaWw7XHJcbn1cclxuQ2xpZW50RXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb21wb25lbnRFcnJvci5wcm90b3R5cGUpO1xyXG5DbGllbnRFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDbGllbnRFcnJvcjtcclxuXHJcblxyXG5mdW5jdGlvbiBJbWFnZU5vdEZvdW5kKG1lc3NhZ2UpIHtcclxuICAgIENsaWVudEVycm9yLmNhbGwodGhpcywgbWVzc2FnZSB8fCAnSW1hZ2Ugbm90IGZvdW5kLiBJdCBwcm9iYWJseSBoYXMgYmVlbiByZW1vdmVkJywgbnVsbCwgNDA0KTtcclxuICAgIHRoaXMubmFtZSA9IFwiSW1hZ2VOb3RGb3VuZFwiO1xyXG59XHJcbkltYWdlTm90Rm91bmQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDbGllbnRFcnJvci5wcm90b3R5cGUpO1xyXG5JbWFnZU5vdEZvdW5kLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEltYWdlTm90Rm91bmQ7XHJcblxyXG5mdW5jdGlvbiBTZXJ2ZXJFcnJvcihtZXNzYWdlLCBzdGF0dXMpIHtcclxuXHRDb21wb25lbnRFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ1RoZXJlIGlzIHNvbWUgZXJyb3Igb24gdGhlIHNlcnZlciBzaWRlJywgc3RhdHVzKTtcclxuXHR0aGlzLm5hbWUgPSBcIlNlcnZlckVycm9yXCI7XHJcbn1cclxuU2VydmVyRXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb21wb25lbnRFcnJvci5wcm90b3R5cGUpO1xyXG5TZXJ2ZXJFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTZXJ2ZXJFcnJvcjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdENvbXBvbmVudEVycm9yLFxyXG5cdENsaWVudEVycm9yLFxyXG4gICAgSW1hZ2VOb3RGb3VuZCxcclxuXHRTZXJ2ZXJFcnJvclxyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvY29tcG9uZW50RXJyb3JzLmpzIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG5cdG9uOiBmdW5jdGlvbihldmVudE5hbWUsIGNiKSB7XHJcblx0XHRpZiAodGhpcy5lbGVtKVxyXG5cdFx0XHR0aGlzLmVsZW0uYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNiKTtcclxuXHRcdGVsc2VcclxuXHRcdFx0dGhpcy5saXN0ZW5lcnMucHVzaCh7XHJcblx0XHRcdFx0ZXZlbnROYW1lLFxyXG5cdFx0XHRcdGNiXHJcblx0XHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdHRyaWdnZXI6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZGV0YWlsKSB7XHJcblx0XHR0aGlzLmVsZW0uZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7XHJcblx0XHRcdGJ1YmJsZXM6IHRydWUsXHJcblx0XHRcdGNhbmNlbGFibGU6IHRydWUsXHJcblx0XHRcdGRldGFpbDogZGV0YWlsXHJcblx0XHR9KSk7XHJcblx0fSxcclxuXHJcblx0ZXJyb3I6IGZ1bmN0aW9uKGVycikge1xyXG5cdFx0dGhpcy5lbGVtLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdlcnJvcicsIHtcclxuXHRcdFx0YnViYmxlczogdHJ1ZSxcclxuXHRcdFx0Y2FuY2VsYWJsZTogdHJ1ZSxcclxuXHRcdFx0ZGV0YWlsOiBlcnJcclxuXHRcdH0pKTtcclxuXHR9XHJcblxyXG5cclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2V2ZW50TWl4aW4uanMiLCJsZXQgY2hlY2tVc2VyRGF0YSA9IHJlcXVpcmUoTElCUyArICdjaGVja1VzZXJEYXRhJyk7XHJcbmxldCBldmVudE1peGluID0gcmVxdWlyZShMSUJTICsgJ2V2ZW50TWl4aW4nKTtcclxubGV0IENsaWVudEVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLkNsaWVudEVycm9yO1xyXG5sZXQgRm9ybSA9IHJlcXVpcmUoQkxPQ0tTICsgJ2Zvcm0nKTtcclxuXHJcbmxldCBBdXRoV2luZG93ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuZWxlbSA9IG9wdGlvbnMuZWxlbTtcclxuICAgIHRoaXMuaXNMb2dpbkZvcm1BY3RpdmUgPSBvcHRpb25zLmlzTG9naW5Gb3JtQWN0aXZlO1xyXG4gICAgdGhpcy5pc0F2YWlsYWJsZSA9IHRydWU7XHJcbiAgICB0aGlzLmhlYWRlckVsZW0gPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLndpbmRvd19faGVhZGVyJyk7XHJcblxyXG4gICAgdGhpcy5wYW5lbCA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCdkaXYud2luZG93X19wYW5lbCcpO1xyXG4gICAgdGhpcy5sb2dpbkZvcm1FbGVtID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJ2Zvcm1bbmFtZT1cImxvZ2luXCJdJyk7XHJcbiAgICB0aGlzLmpvaW5Gb3JtRWxlbSA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCdmb3JtW25hbWU9XCJqb2luXCJdJyk7XHJcblxyXG4gICAgdGhpcy5zZXRKb2luQUVIYW5kbGVyID0gdGhpcy5zZXRKb2luQUVIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNldExvZ2luQUVIYW5kbGVyID0gdGhpcy5zZXRMb2dpbkFFSGFuZGxlci5iaW5kKHRoaXMpO1xyXG5cclxuXHJcbiAgICB0aGlzLmpvaW5Gb3JtID0gbmV3IEZvcm0oe1xyXG4gICAgICAgIGVsZW06IHRoaXMuam9pbkZvcm1FbGVtLFxyXG4gICAgICAgIGZpZWxkczoge1xyXG4gICAgICAgICAgICAndXNlcm5hbWUnOiB7fSxcclxuICAgICAgICAgICAgJ2VtYWlsJzoge1xyXG4gICAgICAgICAgICAgICAgYWxpYXM6ICdlLW1haWwnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdwYXNzd29yZCc6IHt9LFxyXG4gICAgICAgICAgICAncGFzc3dvcmQtYWdhaW4nOiB7XHJcbiAgICAgICAgICAgICAgICBleHRyYTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHBhc3N3b3JkOiAncGFzc3dvcmQnLFxyXG4gICAgICAgICAgICAgICAgYWxpYXM6ICdwYXNzd29yZCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdXJsOiAnL2pvaW4nXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmxvZ2luRm9ybSA9IG5ldyBGb3JtKHtcclxuICAgICAgICBlbGVtOiB0aGlzLmxvZ2luRm9ybUVsZW0sXHJcbiAgICAgICAgZmllbGRzOiB7XHJcbiAgICAgICAgICAgICd1c2VybmFtZSc6IHtcclxuICAgICAgICAgICAgICAgIHZhbGlkYXRvcjogJ25vbi1lbXB0eSdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3Bhc3N3b3JkJzoge1xyXG4gICAgICAgICAgICAgICAgdmFsaWRhdG9yOiAnbm9uLWVtcHR5J1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB1cmw6ICcvbG9naW4nXHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgdGhpcy5sb2dpbkZvcm0ub24oJ2Zvcm1fc2VudCcsIGUgPT4ge1xyXG4gICAgICAgIHRoaXMucmVkaXJlY3QoKTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5qb2luRm9ybS5vbignZm9ybV9zZW50JywgZSA9PiB7XHJcbiAgICAgICAgdGhpcy5yZWRpcmVjdCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKCF0aGlzLmlzTG9naW5Gb3JtQWN0aXZlKVxyXG4gICAgICAgIHRoaXMuc2V0Sm9pbkFFSGFuZGxlcigpO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHRoaXMuc2V0TG9naW5BRUhhbmRsZXIoKTtcclxuXHJcbiAgICB0aGlzLmVsZW0ub25jbGljayA9IGUgPT4ge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc0F2YWlsYWJsZSlcclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoJy53aW5kb3dfX21lc3NhZ2UgLnJlZicpKVxyXG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGUoKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5lbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgZSA9PiB7XHJcbiAgICAgICAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdCAmJiBlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3RleHRib3hfX2ZpZWxkJykpIHtcclxuICAgICAgICAgICAgbGV0IHRiID0gZS50YXJnZXQuY2xvc2VzdCgnLnRleHRib3gnKTtcclxuICAgICAgICAgICAgaWYgKHRiKVxyXG4gICAgICAgICAgICAgICAgdGIuY2xhc3NMaXN0LmFkZCgndGV4dGJveF9mb2N1cycpO1xyXG4gICAgICAgIH1cclxuICAgIH0sIHRydWUpO1xyXG5cclxuICAgIHRoaXMuZWxlbS5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgZSA9PiB7XHJcbiAgICAgICAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdCAmJiBlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3RleHRib3hfX2ZpZWxkJykpIHtcclxuICAgICAgICAgICAgbGV0IHRiID0gZS50YXJnZXQuY2xvc2VzdCgnLnRleHRib3gnKTtcclxuICAgICAgICAgICAgaWYgKHRiKVxyXG4gICAgICAgICAgICAgICAgdGIuY2xhc3NMaXN0LnJlbW92ZSgndGV4dGJveF9mb2N1cycpO1xyXG4gICAgICAgIH1cclxuICAgIH0sIHRydWUpO1xyXG59O1xyXG5cclxuQXV0aFdpbmRvdy5wcm90b3R5cGUucmVkaXJlY3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgdXJsID0gJy8nO1xyXG4gICAgdXJsID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlZGlyZWN0ZWRfdXJsJykgfHwgdXJsO1xyXG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3JlZGlyZWN0ZWRfdXJsJyk7XHJcbiAgICB3aW5kb3cubG9jYXRpb24gPSB1cmw7XHJcbn07XHJcblxyXG5BdXRoV2luZG93LnByb3RvdHlwZS5zZXRKb2luID0gZnVuY3Rpb24gKGlzUG9wU3RhdGUpIHtcclxuICAgIHRoaXMuam9pbkZvcm0uY2xlYXIoKTtcclxuICAgIHRoaXMuaXNBdmFpbGFibGUgPSBmYWxzZTtcclxuICAgIHRoaXMubG9naW5Gb3JtLnNldEF2YWlsYWJsZShmYWxzZSk7XHJcbiAgICB0aGlzLmxvZ2luRm9ybUVsZW0uY2xhc3NMaXN0LmFkZCgnYXV0aC13aW5kb3dfX2Zvcm0tZmFkaW5nLW91dCcpO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKCdzZXRKb2luICcgKyBpc1BvcFN0YXRlKTtcclxuXHJcbiAgICB0aGlzLnRyaWdnZXIoJ2F1dGgtd2luZG93X3N3aXRjaGVkJywge1xyXG4gICAgICAgIGlzTG9naW5Gb3JtQWN0aXZlOiBmYWxzZSxcclxuICAgICAgICBpc1BvcFN0YXRlXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmxvZ2luRm9ybUVsZW0uYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgdGhpcy5zZXRKb2luQUVIYW5kbGVyLCBmYWxzZSk7XHJcbn07XHJcblxyXG5BdXRoV2luZG93LnByb3RvdHlwZS5zZXRKb2luQUVIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5oZWFkZXJFbGVtLnRleHRDb250ZW50ID0gJ3NpZ25pbmcgdXAnO1xyXG5cclxuICAgIHRoaXMuaXNBdmFpbGFibGUgPSB0cnVlO1xyXG4gICAgdGhpcy5sb2dpbkZvcm0uc2V0QXZhaWxhYmxlKHRydWUpO1xyXG4gICAgdGhpcy5sb2dpbkZvcm1FbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2F1dGgtd2luZG93X19mb3JtLWZhZGluZy1vdXQnKTtcclxuICAgIHRoaXMubG9naW5Gb3JtRWxlbS5jbGFzc0xpc3QuYWRkKCdhdXRoLXdpbmRvd19fZm9ybV9pbnZpc2libGUnKTtcclxuICAgIHRoaXMuam9pbkZvcm1FbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2F1dGgtd2luZG93X19mb3JtX2ludmlzaWJsZScpO1xyXG4gICAgdGhpcy5qb2luRm9ybUVsZW1IZWlnaHQgPSB0aGlzLmpvaW5Gb3JtRWxlbUhlaWdodCB8fCB0aGlzLmpvaW5Gb3JtRWxlbS5zY3JvbGxIZWlnaHQ7XHJcbiAgICB0aGlzLnBhbmVsLnN0eWxlLmhlaWdodCA9IGAke3RoaXMuam9pbkZvcm1FbGVtSGVpZ2h0fXB4YDtcclxuICAgIHRoaXMuaXNMb2dpbkZvcm1BY3RpdmUgPSBmYWxzZTtcclxuICAgIHRoaXMubG9naW5Gb3JtRWxlbS5yZW1vdmVFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCB0aGlzLnNldEpvaW5BRUhhbmRsZXIpO1xyXG5cclxuXHJcblxyXG59O1xyXG5cclxuQXV0aFdpbmRvdy5wcm90b3R5cGUuc2V0TG9naW4gPSBmdW5jdGlvbiAoaXNQb3BTdGF0ZSkge1xyXG4gICAgdGhpcy5sb2dpbkZvcm0uY2xlYXIoKTtcclxuICAgIHRoaXMuaXNBdmFpbGFibGUgPSBmYWxzZTtcclxuICAgIHRoaXMuam9pbkZvcm0uc2V0QXZhaWxhYmxlKGZhbHNlKTtcclxuICAgIHRoaXMuam9pbkZvcm1FbGVtLmNsYXNzTGlzdC5hZGQoJ2F1dGgtd2luZG93X19mb3JtLWZhZGluZy1vdXQnKTtcclxuXHJcbiAgICBjb25zb2xlLmxvZygnc2V0TG9naW4gJyArIGlzUG9wU3RhdGUpO1xyXG5cclxuICAgIHRoaXMudHJpZ2dlcignYXV0aC13aW5kb3dfc3dpdGNoZWQnLCB7XHJcbiAgICAgICAgaXNMb2dpbkZvcm1BY3RpdmU6IHRydWUsXHJcbiAgICAgICAgaXNQb3BTdGF0ZVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5qb2luRm9ybUVsZW0uYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgdGhpcy5zZXRMb2dpbkFFSGFuZGxlciwgZmFsc2UpO1xyXG59O1xyXG5cclxuQXV0aFdpbmRvdy5wcm90b3R5cGUuc2V0TG9naW5BRUhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmhlYWRlckVsZW0udGV4dENvbnRlbnQgPSAnbG9nZ2luZyBpbic7XHJcblxyXG4gICAgdGhpcy5pc0F2YWlsYWJsZSA9IHRydWU7XHJcbiAgICB0aGlzLmpvaW5Gb3JtLnNldEF2YWlsYWJsZSh0cnVlKTtcclxuICAgIHRoaXMuam9pbkZvcm1FbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2F1dGgtd2luZG93X19mb3JtLWZhZGluZy1vdXQnKTtcclxuICAgIHRoaXMuam9pbkZvcm1FbGVtLmNsYXNzTGlzdC5hZGQoJ2F1dGgtd2luZG93X19mb3JtX2ludmlzaWJsZScpO1xyXG4gICAgdGhpcy5sb2dpbkZvcm1FbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2F1dGgtd2luZG93X19mb3JtX2ludmlzaWJsZScpO1xyXG4gICAgdGhpcy5sb2dpbkZvcm1FbGVtSGVpZ2h0ID0gdGhpcy5sb2dpbkZvcm1FbGVtSGVpZ2h0IHx8IHRoaXMubG9naW5Gb3JtRWxlbS5zY3JvbGxIZWlnaHQ7XHJcbiAgICB0aGlzLnBhbmVsLnN0eWxlLmhlaWdodCA9IGAke3RoaXMubG9naW5Gb3JtRWxlbUhlaWdodH1weGA7XHJcbiAgICB0aGlzLmlzTG9naW5Gb3JtQWN0aXZlID0gdHJ1ZTtcclxuICAgIHRoaXMuam9pbkZvcm1FbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbmVuZCcsIHRoaXMuc2V0TG9naW5BRUhhbmRsZXIpO1xyXG5cclxufTtcclxuXHJcbkF1dGhXaW5kb3cucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLmlzTG9naW5Gb3JtQWN0aXZlKVxyXG4gICAgICAgIHRoaXMuc2V0Sm9pbigpO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHRoaXMuc2V0TG9naW4oKTtcclxufTtcclxuXHJcbmZvciAobGV0IGtleSBpbiBldmVudE1peGluKSB7XHJcbiAgICBBdXRoV2luZG93LnByb3RvdHlwZVtrZXldID0gZXZlbnRNaXhpbltrZXldO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEF1dGhXaW5kb3c7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvYXV0aC13aW5kb3cvaW5kZXguanMiLCIvL2xldCBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ2FwcDpjaGVja1VzZXJkRGF0YScpO1xyXG5cclxuY29uc3QgUFJPUEVSVFlfU1lNQk9MID0gJ1twcm9wZXJ0eV0nO1xyXG5cclxubGV0IG1lc3NhZ2VzID0ge1xyXG4gICAgcGxhaW46ICdpbmNvcnJlY3QgW3Byb3BlcnR5XScsXHJcbiAgICBlbXB0eTogJ1twcm9wZXJ0eV0gbXVzdCBub3QgYmUgZW1wdHknLFxyXG4gICAgdG9vQmlnOiB2YWx1ZSA9PiB7XHJcbiAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgICAgICByZXR1cm4gYFtwcm9wZXJ0eV0gbXVzdCBiZSBsb3dlciB0aGFuICR7dmFsdWUgKyAxfSBzeW1ib2xzYDtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiAnW3Byb3BlcnR5XSBpcyB0b28gYmlnJztcclxuICAgIH0sXHJcbiAgICB0b29TbWFsbDogdmFsdWUgPT4ge1xyXG4gICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICAgICAgcmV0dXJuIGBbcHJvcGVydHldIG11c3QgYmUgZ3JlYXRlciB0aGFuICR7dmFsdWUgLSAxfSBzeW1ib2xzYDtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiAnW3Byb3BlcnR5XSBpcyB0b28gc2hvcnQnO1xyXG4gICAgfVxyXG59O1xyXG5cclxubGV0IHRlc3RzID0ge1xyXG4gICAgcmVnRXhwOiAocmVnRXhwLCB2YWx1ZSkgPT4gcmVnRXhwLnRlc3QodmFsdWUpLFxyXG4gICAgbWF4OiAobWF4LCB2YWx1ZSkgPT4gKHZhbHVlLmxlbmd0aCA8PSBtYXgpLFxyXG4gICAgbWluOiAobWluLCB2YWx1ZSkgPT4gKHZhbHVlLmxlbmd0aCA+PSBtaW4pLFxyXG4gICAgbm9uRW1wdHk6ICh2YWx1ZSkgPT4gKHZhbHVlLmxlbmd0aCA+IDApXHJcblxyXG59O1xyXG5cclxuXHJcbmxldCBjaGVja3MgPSB7XHJcbiAgICBtYXg6ICh2YWx1ZSwgZXJyb3JNZXNzYWdlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlcnJvck1lc3NhZ2UgfHwgbWVzc2FnZXMudG9vQmlnKHZhbHVlKSxcclxuICAgICAgICAgICAgdGVzdDogdGVzdHMubWF4LmJpbmQobnVsbCwgdmFsdWUpXHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcblxyXG4gICAgbWluOiAodmFsdWUsIGVycm9yTWVzc2FnZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZXJyb3JNZXNzYWdlIHx8IG1lc3NhZ2VzLnRvb1NtYWxsKHZhbHVlKSxcclxuICAgICAgICAgICAgdGVzdDogdGVzdHMubWluLmJpbmQobnVsbCwgdmFsdWUpXHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcblxyXG4gICAgbm9uRW1wdHk6IChlcnJvck1lc3NhZ2UpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGVycm9yTWVzc2FnZSB8fCBtZXNzYWdlcy5lbXB0eSxcclxuICAgICAgICAgICAgdGVzdDogdGVzdHMubm9uRW1wdHlcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59O1xyXG5cclxuZnVuY3Rpb24gY29tcHV0ZUVycm9yTWVzc2FnZSh0ZW1wbGF0ZSwgcHJvcGVydHkpIHtcclxuICAgIGxldCBwb3M7XHJcbiAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlIHx8IG1lc3NhZ2VzLnBsYWluO1xyXG4gICAgcHJvcGVydHkgPSBwcm9wZXJ0eSB8fCAndGhpcyBwcm9wZXJ0eSc7XHJcbiAgICB3aGlsZSAofihwb3MgPSB0ZW1wbGF0ZS5pbmRleE9mKFBST1BFUlRZX1NZTUJPTCkpKVxyXG4gICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUuc3Vic3RyaW5nKDAsIHBvcykgKyBwcm9wZXJ0eSArIHRlbXBsYXRlLnN1YnN0cmluZyhwb3MgKyBQUk9QRVJUWV9TWU1CT0wubGVuZ3RoKTtcclxuICAgIHJldHVybiB0ZW1wbGF0ZTtcclxufVxyXG5cclxubGV0IHZhbGlkYXRvcnMgPSB7XHJcblxyXG4gICAgJ25vbi1lbXB0eSc6IHtcclxuICAgICAgICBjaGVja3M6IFtcclxuICAgICAgICAgICAgY2hlY2tzLm5vbkVtcHR5KClcclxuICAgICAgICBdXHJcbiAgICB9LFxyXG5cclxuICAgICdlbWFpbCc6IHtcclxuICAgICAgICBjaGVja3M6IFtcclxuICAgICAgICAgICAgY2hlY2tzLm5vbkVtcHR5KCksXHJcbiAgICAgICAgICAgIGNoZWNrcy5tYXgoMTAwLCBtZXNzYWdlcy50b29CaWcoKSksXHJcbiAgICAgICAgICAgIGNoZWNrcy5taW4oNiwgbWVzc2FnZXMudG9vU21hbGwoKSksIHtcclxuICAgICAgICAgICAgICAgIHRlc3Q6IHRlc3RzLnJlZ0V4cC5iaW5kKG51bGwsIC9eKFxcdytbLVxcLl0/PykrQFtcXHcuLV0rXFx3XFwuXFx3ezIsNX0kL2kpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAndXNlcm5hbWUnOiB7XHJcbiAgICAgICAgY2hlY2tzOiBbXHJcbiAgICAgICAgICAgIGNoZWNrcy5ub25FbXB0eSgpLFxyXG4gICAgICAgICAgICBjaGVja3MubWF4KDE2KSxcclxuICAgICAgICAgICAgY2hlY2tzLm1pbig1KSwge1xyXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiAnbXVzdCBvbmx5IGNvbnRhaW4gYWxwaGFudW1lcmljIHN5bWJvbHMnLFxyXG4gICAgICAgICAgICAgICAgdGVzdDogdGVzdHMucmVnRXhwLmJpbmQobnVsbCwgL15bQS1aMC05LV0rJC9pKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgJ3Bhc3N3b3JkJzoge1xyXG4gICAgICAgIGNoZWNrczogW1xyXG4gICAgICAgICAgICBjaGVja3Mubm9uRW1wdHkoKSxcclxuICAgICAgICAgICAgY2hlY2tzLm1heCgzMCksXHJcbiAgICAgICAgICAgIGNoZWNrcy5taW4oNSksIHtcclxuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogJ1twcm9wZXJ0eV0gaXMgdG9vIHdlYWsnLFxyXG4gICAgICAgICAgICAgICAgdGVzdDogdGVzdHMucmVnRXhwLmJpbmQobnVsbCwgLyg/PS4qXFxkKSg/PS4qW2Etel0pKD89LipbQS1aXSkuezYsfS8pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgXVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgJ3Bhc3N3b3JkLWFnYWluJzoge1xyXG4gICAgICAgIGNoZWNrczogW1xyXG4gICAgICAgICAgICBjaGVja3Mubm9uRW1wdHkoJ3JlLWVudGVyIFtwcm9wZXJ0eV0nKSwge1xyXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiAncGFzc3dvcmRzIGRvIG5vdCBtYXRjaCcsXHJcbiAgICAgICAgICAgICAgICB0ZXN0OiBmdW5jdGlvbih2YWx1ZSwgZGF0YUNodW5rLCBkYXRhKSB7XHJcblx0XHRcdFx0XHRsZXQgb3JpZ2luYWxQYXNzID0gZGF0YUNodW5rLnBhc3N3b3JkO1xyXG5cdFx0XHRcdFx0aWYgKCFvcmlnaW5hbFBhc3MpXHJcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignbm8gb3JpZ2luYWwgcGFzc3dvcmQgcmVmZXJlbmNlJyk7XHJcblxyXG5cdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKVxyXG5cdFx0XHRcdFx0XHRpZiAoZGF0YVtpXS5wcm9wZXJ0eSA9PT0gb3JpZ2luYWxQYXNzKVxyXG5cdFx0XHRcdFx0XHRcdHJldHVybiAodmFsdWUgPT09IGRhdGFbaV0udmFsdWUpO1xyXG5cclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignbm8gb3JnaW5hbCBwYXNzd29yZCBkYXRhJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgXVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgJ3VybCc6IHtcclxuICAgICAgICBjaGVja3M6IFt7XHJcbiAgICAgICAgICAgIHRlc3Q6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdXJsUmVnZXggPSAnXig/IW1haWx0bzopKD86KD86aHR0cHxodHRwcyk6Ly8pKD86XFxcXFMrKD86OlxcXFxTKik/QCk/KD86KD86KD86WzEtOV1cXFxcZD98MVxcXFxkXFxcXGR8MlswMV1cXFxcZHwyMlswLTNdKSg/OlxcXFwuKD86MT9cXFxcZHsxLDJ9fDJbMC00XVxcXFxkfDI1WzAtNV0pKXsyfSg/OlxcXFwuKD86WzAtOV1cXFxcZD98MVxcXFxkXFxcXGR8MlswLTRdXFxcXGR8MjVbMC00XSkpfCg/Oig/OlthLXpcXFxcdTAwYTEtXFxcXHVmZmZmMC05XSstPykqW2EtelxcXFx1MDBhMS1cXFxcdWZmZmYwLTldKykoPzpcXFxcLig/OlthLXpcXFxcdTAwYTEtXFxcXHVmZmZmMC05XSstPykqW2EtelxcXFx1MDBhMS1cXFxcdWZmZmYwLTldKykqKD86XFxcXC4oPzpbYS16XFxcXHUwMGExLVxcXFx1ZmZmZl17Mix9KSkpfGxvY2FsaG9zdCkoPzo6XFxcXGR7Miw1fSk/KD86KC98XFxcXD98IylbXlxcXFxzXSopPyQnO1xyXG4gICAgICAgICAgICAgICAgbGV0IHVybCA9IG5ldyBSZWdFeHAodXJsUmVnZXgsICdpJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUubGVuZ3RoIDwgMjA4MyAmJiB1cmwudGVzdCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgJ2Rlc2NyaXB0aW9uJzoge1xyXG4gICAgICAgIGNoZWNrczogW1xyXG4gICAgICAgICAgICBjaGVja3MubWF4KDI1NSlcclxuICAgICAgICBdXHJcbiAgICB9LFxyXG5cclxuICAgICdjb21tZW50Jzoge1xyXG4gICAgICAgIGNoZWNrczogW1xyXG4gICAgICAgICAgICBjaGVja3Mubm9uRW1wdHkoKSxcclxuICAgICAgICAgICAgY2hlY2tzLm1heCgyNTUpXHJcbiAgICAgICAgXVxyXG4gICAgfVxyXG5cclxufTtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0RXJyb3JBcnJheShkYXRhKSB7XHJcblxyXG5cdGlmICghQXJyYXkuaXNBcnJheShkYXRhKSkge1xyXG5cdFx0bGV0IGNvcnJlY3REYXRhID0gW107XHJcblx0XHRmb3IgKGxldCBrZXkgaW4gZGF0YSkge1xyXG5cdFx0XHRjb3JyZWN0RGF0YS5wdXNoKHtcclxuXHRcdFx0XHRwcm9wZXJ0eToga2V5LFxyXG5cdFx0XHRcdHZhbHVlOiBkYXRhW2tleV1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRkYXRhID0gY29ycmVjdERhdGE7XHJcblx0fVxyXG5cclxuICAgIGxldCByZXN1bHQgPSBbXTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcclxuXHRcdGxldCBrZXkgPSBkYXRhW2ldLnZhbGlkYXRvcjtcclxuXHRcdGlmICgha2V5KVxyXG5cdFx0XHRrZXkgPSBkYXRhW2ldLnByb3BlcnR5O1xyXG5cclxuICAgICAgICBpZiAoIXZhbGlkYXRvcnNba2V5XSlcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyB2YWxpZGF0b3IgZm9yIHRoaXMgcHJvcGVydHk6ICcgKyBrZXkpO1xyXG5cclxuICAgICAgICB2YWxpZGF0b3JzW2tleV0uY2hlY2tzLmZvckVhY2goY2hlY2sgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWNoZWNrLnRlc3QoZGF0YVtpXS52YWx1ZSwgZGF0YVtpXSwgZGF0YSkpXHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHk6IGRhdGFbaV0ucHJvcGVydHksXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY29tcHV0ZUVycm9yTWVzc2FnZShjaGVjay5lcnJvck1lc3NhZ2UsIGRhdGFbaV0uYWxpYXMgfHwgZGF0YVtpXS5wcm9wZXJ0eSB8fCBrZXkpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5mdW5jdGlvbiB0ZXN0UHJvcGVydHkobmFtZSwgdmFsdWUpIHtcclxuICAgIGxldCByZXN1bHQgPSB0cnVlO1xyXG4gICAgdmFsaWRhdG9yc1tuYW1lXS5jaGVja3MuZm9yRWFjaChjaGVjayA9PiB7XHJcblxyXG4gICAgICAgIGlmICghY2hlY2sudGVzdCh2YWx1ZSkpXHJcbiAgICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGdldEVycm9yQXJyYXksXHJcbiAgICB0ZXN0UHJvcGVydHlcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2NoZWNrVXNlckRhdGEuanMiLCJsZXQgZXZlbnRNaXhpbiA9IHJlcXVpcmUoTElCUyArICdldmVudE1peGluJyk7XHJcbmxldCBnZXRFcnJvckFycmF5ID0gcmVxdWlyZShMSUJTICsgJ2NoZWNrVXNlckRhdGEnKS5nZXRFcnJvckFycmF5O1xyXG5sZXQgQ2xpZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ2xpZW50RXJyb3I7XHJcblxyXG5sZXQgRm9ybSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuZWxlbSA9IG9wdGlvbnMuZWxlbTtcclxuICAgIHRoaXMuZmllbGRzID0gb3B0aW9ucy5maWVsZHM7XHJcbiAgICB0aGlzLnVybCA9IG9wdGlvbnMudXJsO1xyXG4gICAgdGhpcy5pc0F2YWlsYWJsZSA9IHRydWU7XHJcblxyXG4gICAgdGhpcy5zYXZlQnV0dG9uID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5zYXZlLWJ1dHRvbicpO1xyXG5cclxuICAgIHRoaXMuZWxlbS5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzQXZhaWxhYmxlKSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmIChlLnRhcmdldCAhPT0gdGhpcy5zYXZlQnV0dG9uKSByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMuY2xlYXJFcnJvckJveGVzKCk7XHJcbiAgICAgICAgbGV0IGVycm9ycyA9IHRoaXMuZ2V0RXJyb3JzKCk7XHJcbiAgICAgICAgaWYgKGVycm9ycy5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIHRoaXMuc2VuZCh0aGlzLmdldEJvZHkoKSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLnNldEVycm9ycyhlcnJvcnMpO1xyXG4gICAgfTtcclxufTtcclxuXHJcbkZvcm0ucHJvdG90eXBlLnNldFByb3BlcnR5RXJyb3IgPSBmdW5jdGlvbihwcm9wZXJ0eSwgbWVzc2FnZSkge1xyXG4gICAgdGhpcy5nZXRFcnJvckJveChwcm9wZXJ0eSkudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xyXG59O1xyXG5cclxuRm9ybS5wcm90b3R5cGUuZ2V0RXJyb3JCb3ggPSBmdW5jdGlvbihmaWVsZE5hbWUpIHtcclxuICAgIHJldHVybiB0aGlzLmVsZW1bZmllbGROYW1lXS5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZXh0Ym94X19lcnJvcicpO1xyXG59O1xyXG5cclxuRm9ybS5wcm90b3R5cGUuc2V0QXZhaWxhYmxlID0gZnVuY3Rpb24oaXNBdmFpbGFibGUpIHtcclxuICAgIHRoaXMuaXNBdmFpbGFibGUgPSBpc0F2YWlsYWJsZTtcclxufTtcclxuXHJcbkZvcm0ucHJvdG90eXBlLmdldERhdGFPYmogPSBmdW5jdGlvbigpIHtcclxuICAgIGxldCBvcHRpb25zID0gW107XHJcblxyXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuZmllbGRzKSB7XHJcbiAgICAgICAgbGV0IGNodW5rID0gdGhpcy5maWVsZHNba2V5XTtcclxuICAgICAgICBpZiAoIWNodW5rLm5vVmFsaWRhdGlvbikge1xyXG4gICAgICAgICAgICBpZiAoIWNodW5rLnByb3BlcnR5KVxyXG4gICAgICAgICAgICAgICAgY2h1bmsucHJvcGVydHkgPSBrZXk7XHJcbiAgICAgICAgICAgIGNodW5rLnZhbHVlID0gdGhpcy5lbGVtW2tleV0udmFsdWU7XHJcbiAgICAgICAgICAgIG9wdGlvbnMucHVzaChjaHVuayk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcHRpb25zO1xyXG59O1xyXG5cclxuRm9ybS5wcm90b3R5cGUuc2VuZCA9IGZ1bmN0aW9uKGJvZHkpIHtcclxuICAgIHJlcXVpcmUoTElCUyArICdzZW5kUmVxdWVzdCcpKGJvZHksICdQT1NUJywgdGhpcy51cmwsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgQ2xpZW50RXJyb3IgJiYgZXJyLmRldGFpbClcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0UHJvcGVydHlFcnJvcihlcnIuZGV0YWlsLnByb3BlcnR5LCBlcnIubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMudHJpZ2dlcignZm9ybV9zZW50Jywge1xyXG4gICAgICAgICAgICByZXNwb25zZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5cclxuRm9ybS5wcm90b3R5cGUuY2xlYXJFcnJvckJveGVzID0gZnVuY3Rpb24oKSB7XHJcbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5maWVsZHMpXHJcbiAgICAgICAgdGhpcy5nZXRFcnJvckJveChrZXkpLnRleHRDb250ZW50ID0gJyc7XHJcbn07XHJcblxyXG5Gb3JtLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5jbGVhckVycm9yQm94ZXMoKTtcclxuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmZpZWxkcylcclxuICAgICAgICB0aGlzLmVsZW1ba2V5XS52YWx1ZSA9ICcnO1xyXG59O1xyXG5cclxuRm9ybS5wcm90b3R5cGUuZ2V0RXJyb3JzID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gZ2V0RXJyb3JBcnJheSh0aGlzLmdldERhdGFPYmooKSk7XHJcbn07XHJcblxyXG5cclxuRm9ybS5wcm90b3R5cGUuc2V0RXJyb3JzID0gZnVuY3Rpb24oZXJyb3JzKSB7XHJcbiAgICB0aGlzLmNsZWFyRXJyb3JCb3hlcygpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlcnJvcnMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0RXJyb3JCb3goZXJyb3JzW2ldLnByb3BlcnR5KS50ZXh0Q29udGVudCA9PSAnJylcclxuICAgICAgICAgICAgdGhpcy5zZXRQcm9wZXJ0eUVycm9yKGVycm9yc1tpXS5wcm9wZXJ0eSwgZXJyb3JzW2ldLm1lc3NhZ2UpO1xyXG59O1xyXG5cclxuRm9ybS5wcm90b3R5cGUuZ2V0Qm9keSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGJvZHkgPSAnJztcclxuXHJcbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5maWVsZHMpXHJcbiAgICAgICAgaWYgKCF0aGlzLmZpZWxkc1trZXldLmV4dHJhKVxyXG4gICAgICAgICAgICBib2R5ICs9IChib2R5ID09PSAnJyA/ICcnIDogJyYnKSArXHJcbiAgICAgICAgICAgIGtleSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh0aGlzLmVsZW1ba2V5XS52YWx1ZSk7XHJcbiAgICByZXR1cm4gYm9keTtcclxufTtcclxuXHJcbmZvciAobGV0IGtleSBpbiBldmVudE1peGluKSB7XHJcbiAgICBGb3JtLnByb3RvdHlwZVtrZXldID0gZXZlbnRNaXhpbltrZXldO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvZm9ybS9pbmRleC5qcyIsImxldCBTZXJ2ZXJFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5TZXJ2ZXJFcnJvcjtcclxubGV0IENsaWVudEVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLkNsaWVudEVycm9yO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYm9keU9iaiwgbWV0aG9kLCB1cmwsIGNiKSB7XHJcblxyXG5cclxuICAgIGxldCBib2R5ID0gJyc7XHJcbiAgICBpZiAoISh0eXBlb2YgYm9keU9iaiA9PT0gJ3N0cmluZycpKSB7XHJcbiAgICAgICAgZm9yIChsZXQga2V5IGluIGJvZHlPYmopIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgIGlmIChib2R5T2JqW2tleV0pXHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGtleSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCgodHlwZW9mIGJvZHlPYmpba2V5XSA9PT0gJ29iamVjdCcpID8gSlNPTi5zdHJpbmdpZnkoYm9keU9ialtrZXldKSA6IGJvZHlPYmpba2V5XSk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICAgICAgICAgIGJvZHkgKz0gKGJvZHkgPT09ICcnID8gJycgOiAnJicpICsgdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlXHJcbiAgICAgICAgYm9keSA9IGJvZHlPYmo7XHJcblxyXG5cclxuICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgIHhoci5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKTtcclxuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XHJcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIlgtUmVxdWVzdGVkLVdpdGhcIiwgXCJYTUxIdHRwUmVxdWVzdFwiKTtcclxuXHJcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgIT0gNCkgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgcmVzcG9uc2U7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnJlc3BvbnNlVGV4dClcclxuICAgICAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY2IobmV3IFNlcnZlckVycm9yKCdTZXJ2ZXIgaXMgbm90IHJlc3BvbmRpbmcnKSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCAzMDApXHJcbiAgICAgICAgICAgIGNiKG51bGwsIHJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDQwMCAmJiB0aGlzLnN0YXR1cyA8IDUwMClcclxuICAgICAgICAgICAgY2IobmV3IENsaWVudEVycm9yKHJlc3BvbnNlLm1lc3NhZ2UsIHJlc3BvbnNlLmRldGFpbCwgdGhpcy5zdGF0dXMpKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDUwMClcclxuICAgICAgICAgICAgY2IobmV3IFNlcnZlckVycm9yKHJlc3BvbnNlLm1lc3NhZ2UsIHRoaXMuc3RhdHVzKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnNvbGUubG9nKGBzZW5kaW5nIG5leHQgcmVxdWVzdDogJHtib2R5fWApO1xyXG4gICAgeGhyLnNlbmQoYm9keSk7XHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9zZW5kUmVxdWVzdC5qcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7O0FBdENBO0FBQUE7QUF1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDdE9BOzs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7OztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3JLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQWRBO0FBQUE7QUFlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDMU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7OzsiLCJzb3VyY2VSb290IjoiIn0=