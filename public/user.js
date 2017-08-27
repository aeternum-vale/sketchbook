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
/******/ 		10:0
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
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	__webpack_require__(53);

	var GlobalErrorHandler = __webpack_require__(14);
	var globalErrorHandler = new GlobalErrorHandler();

	var ClientError = __webpack_require__(15).ClientError;
	var Dropdown = __webpack_require__(28);
	var Modal = __webpack_require__(17);
	var ModalSpinner = __webpack_require__(29);
	var eventMixin = __webpack_require__(18);

	// let linksDropdown = new Dropdown({
	//     elem: document.getElementById('links-dropdown'),
	//     className: 'links-dropdown'
	// });

	var subscribeButtonElem = undefined;
	var subscribeButton = undefined;

	if (subscribeButtonElem = document.getElementById('subscribe-button')) {
	    if (window.isLogged) {
	        __webpack_require__.e/* nsure */(11, function (require) {
	            var SubscribeButton = __webpack_require__(39);
	            subscribeButton = new SubscribeButton({
	                elem: subscribeButtonElem,
	                counterElem: document.getElementById('subscribers-number')
	            });
	        });
	    } else subscribeButtonElem.onclick = function (e) {
	        globalErrorHandler.call(new ClientError(null, null, 401));
	    };
	}

	var uploadImageModalWindowCaller = undefined;
	var uploadImageModalWindow = undefined;
	if (uploadImageModalWindowCaller = document.getElementById('upload-window-caller')) {
	    uploadImageModalWindowCaller.onclick = function () {
	        if (!uploadImageModalWindow) {
	            (function () {

	                var spinner = new ModalSpinner({
	                    status: Modal.statuses.MAJOR
	                });
	                spinner.activate();
	                __webpack_require__.e/* nsure */(12, function (require) {
	                    var UploadImageModalWindow = __webpack_require__(55);
	                    uploadImageModalWindow = new UploadImageModalWindow();

	                    uploadImageModalWindow.on('upload-image-modal-window__image-uploaded', function (e) {
	                        if (gallery) gallery.insertNewImagePreview(e.detail.imageId, e.detail.previewUrl);else {
	                            createGallery().then(function () {
	                                gallery.insertNewImagePreview(e.detail.imageId, e.detail.previewUrl);
	                            });
	                        }
	                    });

	                    spinner.onHostLoaded(uploadImageModalWindow);
	                });
	            })();
	        } else uploadImageModalWindow.activate();
	    };
	}

	var gallery = undefined;
	var galleryElem = document.getElementById('gallery');
	galleryElem.onclick = function (e) {
	    var target = undefined;
	    if (!(target = e.target.closest('.image-preview'))) return;

	    var spinner = new ModalSpinner({
	        status: Modal.statuses.MAJOR
	    });
	    spinner.activate();

	    e.preventDefault();

	    var imageId = +target.dataset.id;
	    createGallery().then(function () {
	        spinner.onHostLoaded(gallery, {
	            imageId: imageId
	        });
	    });
	};

	function createGallery() {
	    return new Promise(function (resolve, reject) {
	        __webpack_require__.e/* nsure */(13, function (require) {
	            var Gallery = __webpack_require__(30);
	            gallery = new Gallery({
	                gallery: galleryElem,
	                isLogged: window.isLogged,
	                preloadEntityCount: (1),
	                isEmbedded: true,
	                publicationNumberElem: document.getElementById('publication-number'),
	                userSubscribeButton: subscribeButton
	            });
	            resolve();
	        });
	    });
	}

	//let messageModalWindow = require(BLOCKS + 'message-modal-window');
	// let count = 0;
	// setInterval(() => {
	//     let message = new messageModalWindow({message: ++count});
	//     message.activate();
	//
	// }, 5000);

	if (window.isLogged) {
	    var userMenuDropdown = new Dropdown({
	        elem: document.getElementById('user-menu'),
	        className: 'header-element'
	    });
	}

/***/ }),

/***/ 14:
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

/***/ 15:
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

/***/ 17:
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

/***/ 18:
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

/***/ 19:
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

/***/ 20:
/***/ (function(module, exports) {

	module.exports = "<div id=\"spinner\" class=\"spinner\">\r\n\r\n</div>";

/***/ }),

/***/ 28:
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

/***/ 29:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var eventMixin = __webpack_require__(18);
	var Modal = __webpack_require__(17);
	var Spinner = __webpack_require__(19);

	var ModalSpinner = function ModalSpinner(options) {
	    Spinner.apply(this, arguments);
	    Modal.apply(this, arguments);
	    this.elemId = 'spinner';
	    this.host = null;
	};
	ModalSpinner.prototype = Object.create(Modal.prototype);
	ModalSpinner.prototype.constructor = ModalSpinner;

	for (var key in Spinner.prototype) {
	    ModalSpinner.prototype[key] = Spinner.prototype[key];
	}ModalSpinner.prototype.setElem = function () {
	    if (!this.elem) this.elem = document.getElementById('spinner');
	    if (!this.elem) this.elem = this.renderWindow(Spinner.html);
	};

	ModalSpinner.prototype.show = function () {
	    Modal.prototype.show.apply(this);

	    if (!this.elem) this.setElem();

	    this.setListeners();

	    Spinner.prototype.show.apply(this);
	};

	ModalSpinner.prototype.hide = function () {
	    Modal.prototype.hide.apply(this, arguments);
	    Spinner.prototype.hide.apply(this, arguments);
	};

	ModalSpinner.prototype.deactivate = function (options) {
	    Modal.prototype.deactivate.apply(this, arguments);
	};

	ModalSpinner.prototype.onHostLoaded = function (host, options) {
	    this.trigger('spinner_host-loaded', {
	        host: host,
	        options: options
	    });
	};

	for (var key in eventMixin) {
	    ModalSpinner.prototype[key] = eventMixin[key];
		}module.exports = ModalSpinner;

/***/ }),

/***/ 53:
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBjMDk3MWNjYjg2ZjM1ZTRmZDhmZj9iZWRkIiwid2VicGFjazovLy8uL3VzZXIvc2NyaXB0LmpzIiwid2VicGFjazovLy8uLi9ibG9ja3MvZ2xvYmFsLWVycm9yLWhhbmRsZXIvaW5kZXguanM/YjAxNiIsIndlYnBhY2s6Ly8vRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvY29tcG9uZW50RXJyb3JzLmpzIiwid2VicGFjazovLy8uLi9ibG9ja3MvbW9kYWwvaW5kZXguanM/OWM0NiIsIndlYnBhY2s6Ly8vRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvZXZlbnRNaXhpbi5qcz8zY2JjIiwid2VicGFjazovLy8uLi9ibG9ja3Mvc3Bpbm5lci9pbmRleC5qcz8wNDkyIiwid2VicGFjazovLy8uLi9ibG9ja3Mvc3Bpbm5lci9tYXJrdXA/NDdkNyIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2Ryb3Bkb3duL2luZGV4LmpzPzVlMjkiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9tb2RhbC1zcGlubmVyL2luZGV4LmpzPzk3ZjYiLCJ3ZWJwYWNrOi8vLy4vdXNlci9zdHlsZS5sZXNzIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xuIFx0dmFyIHBhcmVudEpzb25wRnVuY3Rpb24gPSB3aW5kb3dbXCJ3ZWJwYWNrSnNvbnBcIl07XG4gXHR3aW5kb3dbXCJ3ZWJwYWNrSnNvbnBcIl0gPSBmdW5jdGlvbiB3ZWJwYWNrSnNvbnBDYWxsYmFjayhjaHVua0lkcywgbW9yZU1vZHVsZXMpIHtcbiBcdFx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG4gXHRcdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuIFx0XHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwLCBjYWxsYmFja3MgPSBbXTtcbiBcdFx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG4gXHRcdFx0aWYoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKVxuIFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2guYXBwbHkoY2FsbGJhY2tzLCBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pO1xuIFx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG4gXHRcdH1cbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRpZihwYXJlbnRKc29ucEZ1bmN0aW9uKSBwYXJlbnRKc29ucEZ1bmN0aW9uKGNodW5rSWRzLCBtb3JlTW9kdWxlcyk7XG4gXHRcdHdoaWxlKGNhbGxiYWNrcy5sZW5ndGgpXG4gXHRcdFx0Y2FsbGJhY2tzLnNoaWZ0KCkuY2FsbChudWxsLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0fTtcblxuIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3NcbiBcdC8vIFwiMFwiIG1lYW5zIFwiYWxyZWFkeSBsb2FkZWRcIlxuIFx0Ly8gQXJyYXkgbWVhbnMgXCJsb2FkaW5nXCIsIGFycmF5IGNvbnRhaW5zIGNhbGxiYWNrc1xuIFx0dmFyIGluc3RhbGxlZENodW5rcyA9IHtcbiBcdFx0MTA6MFxuIFx0fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG4gXHQvLyBUaGlzIGZpbGUgY29udGFpbnMgb25seSB0aGUgZW50cnkgY2h1bmsuXG4gXHQvLyBUaGUgY2h1bmsgbG9hZGluZyBmdW5jdGlvbiBmb3IgYWRkaXRpb25hbCBjaHVua3NcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZSA9IGZ1bmN0aW9uIHJlcXVpcmVFbnN1cmUoY2h1bmtJZCwgY2FsbGJhY2spIHtcbiBcdFx0Ly8gXCIwXCIgaXMgdGhlIHNpZ25hbCBmb3IgXCJhbHJlYWR5IGxvYWRlZFwiXG4gXHRcdGlmKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMClcbiBcdFx0XHRyZXR1cm4gY2FsbGJhY2suY2FsbChudWxsLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBhbiBhcnJheSBtZWFucyBcImN1cnJlbnRseSBsb2FkaW5nXCIuXG4gXHRcdGlmKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSAhPT0gdW5kZWZpbmVkKSB7XG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdLnB1c2goY2FsbGJhY2spO1xuIFx0XHR9IGVsc2Uge1xuIFx0XHRcdC8vIHN0YXJ0IGNodW5rIGxvYWRpbmdcbiBcdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSBbY2FsbGJhY2tdO1xuIFx0XHRcdHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiBcdFx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gXHRcdFx0c2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcbiBcdFx0XHRzY3JpcHQuY2hhcnNldCA9ICd1dGYtOCc7XG4gXHRcdFx0c2NyaXB0LmFzeW5jID0gdHJ1ZTtcblxuIFx0XHRcdHNjcmlwdC5zcmMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgY2h1bmtJZCArIFwiLlwiICsgKHt9W2NodW5rSWRdfHxjaHVua0lkKSArIFwiLmpzXCI7XG4gXHRcdFx0aGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBjMDk3MWNjYjg2ZjM1ZTRmZDhmZiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICcuL3N0eWxlLmxlc3MnO1xyXG5cclxubGV0IEdsb2JhbEVycm9ySGFuZGxlciA9IHJlcXVpcmUoQkxPQ0tTICsgJ2dsb2JhbC1lcnJvci1oYW5kbGVyJyk7XHJcbmxldCBnbG9iYWxFcnJvckhhbmRsZXIgPSBuZXcgR2xvYmFsRXJyb3JIYW5kbGVyKCk7XHJcblxyXG5sZXQgQ2xpZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ2xpZW50RXJyb3I7XHJcbmxldCBEcm9wZG93biA9IHJlcXVpcmUoQkxPQ0tTICsgJ2Ryb3Bkb3duJyk7XHJcbmxldCBNb2RhbCA9IHJlcXVpcmUoQkxPQ0tTICsgJ21vZGFsJyk7XHJcbmxldCBNb2RhbFNwaW5uZXIgPSByZXF1aXJlKEJMT0NLUyArICdtb2RhbC1zcGlubmVyJyk7XHJcbmxldCBldmVudE1peGluID0gcmVxdWlyZShMSUJTICsgJ2V2ZW50TWl4aW4nKTtcclxuXHJcblxyXG4vLyBsZXQgbGlua3NEcm9wZG93biA9IG5ldyBEcm9wZG93bih7XHJcbi8vICAgICBlbGVtOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlua3MtZHJvcGRvd24nKSxcclxuLy8gICAgIGNsYXNzTmFtZTogJ2xpbmtzLWRyb3Bkb3duJ1xyXG4vLyB9KTtcclxuXHJcbmxldCBzdWJzY3JpYmVCdXR0b25FbGVtO1xyXG5sZXQgc3Vic2NyaWJlQnV0dG9uO1xyXG5cclxuaWYgKHN1YnNjcmliZUJ1dHRvbkVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Vic2NyaWJlLWJ1dHRvbicpKSB7XHJcbiAgICBpZiAod2luZG93LmlzTG9nZ2VkKSB7XHJcbiAgICAgICAgcmVxdWlyZS5lbnN1cmUoW0JMT0NLUyArICdzdWJzY3JpYmUtYnV0dG9uJ10sIGZ1bmN0aW9uIChyZXF1aXJlKSB7XHJcbiAgICAgICAgICAgIGxldCBTdWJzY3JpYmVCdXR0b24gPSByZXF1aXJlKEJMT0NLUyArICdzdWJzY3JpYmUtYnV0dG9uJyk7XHJcbiAgICAgICAgICAgIHN1YnNjcmliZUJ1dHRvbiA9IG5ldyBTdWJzY3JpYmVCdXR0b24oe1xyXG4gICAgICAgICAgICAgICAgZWxlbTogc3Vic2NyaWJlQnV0dG9uRWxlbSxcclxuICAgICAgICAgICAgICAgIGNvdW50ZXJFbGVtOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Vic2NyaWJlcnMtbnVtYmVyJylcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2VcclxuICAgICAgICBzdWJzY3JpYmVCdXR0b25FbGVtLm9uY2xpY2sgPSBlID0+IHtcclxuICAgICAgICAgICAgZ2xvYmFsRXJyb3JIYW5kbGVyLmNhbGwobmV3IENsaWVudEVycm9yKG51bGwsIG51bGwsIDQwMSkpO1xyXG4gICAgICAgIH07XHJcbn1cclxuXHJcblxyXG5sZXQgdXBsb2FkSW1hZ2VNb2RhbFdpbmRvd0NhbGxlcjtcclxubGV0IHVwbG9hZEltYWdlTW9kYWxXaW5kb3c7XHJcbmlmICh1cGxvYWRJbWFnZU1vZGFsV2luZG93Q2FsbGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VwbG9hZC13aW5kb3ctY2FsbGVyJykpIHtcclxuICAgIHVwbG9hZEltYWdlTW9kYWxXaW5kb3dDYWxsZXIub25jbGljayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXVwbG9hZEltYWdlTW9kYWxXaW5kb3cpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBzcGlubmVyID0gbmV3IE1vZGFsU3Bpbm5lcih7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXM6IE1vZGFsLnN0YXR1c2VzLk1BSk9SXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzcGlubmVyLmFjdGl2YXRlKCk7XHJcbiAgICAgICAgICAgIHJlcXVpcmUuZW5zdXJlKFtCTE9DS1MgKyAndXBsb2FkLWltYWdlLW1vZGFsLXdpbmRvdyddLFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlcXVpcmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgVXBsb2FkSW1hZ2VNb2RhbFdpbmRvdyA9IHJlcXVpcmUoQkxPQ0tTICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3VwbG9hZC1pbWFnZS1tb2RhbC13aW5kb3cnKTtcclxuICAgICAgICAgICAgICAgICAgICB1cGxvYWRJbWFnZU1vZGFsV2luZG93ID0gbmV3IFVwbG9hZEltYWdlTW9kYWxXaW5kb3coKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkSW1hZ2VNb2RhbFdpbmRvdy5vbigndXBsb2FkLWltYWdlLW1vZGFsLXdpbmRvd19faW1hZ2UtdXBsb2FkZWQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnYWxsZXJ5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhbGxlcnkuaW5zZXJ0TmV3SW1hZ2VQcmV2aWV3KGUuZGV0YWlsLmltYWdlSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuZGV0YWlsLnByZXZpZXdVcmwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlR2FsbGVyeSgpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYWxsZXJ5Lmluc2VydE5ld0ltYWdlUHJldmlldyhlLmRldGFpbC5pbWFnZUlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5kZXRhaWwucHJldmlld1VybCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzcGlubmVyLm9uSG9zdExvYWRlZCh1cGxvYWRJbWFnZU1vZGFsV2luZG93KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICB1cGxvYWRJbWFnZU1vZGFsV2luZG93LmFjdGl2YXRlKCk7XHJcbiAgICB9O1xyXG59XHJcblxyXG5sZXQgZ2FsbGVyeTtcclxubGV0IGdhbGxlcnlFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbGxlcnknKTtcclxuZ2FsbGVyeUVsZW0ub25jbGljayA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICBsZXQgdGFyZ2V0O1xyXG4gICAgaWYgKCEodGFyZ2V0ID0gZS50YXJnZXQuY2xvc2VzdCgnLmltYWdlLXByZXZpZXcnKSkpIHJldHVybjtcclxuXHJcbiAgICBsZXQgc3Bpbm5lciA9IG5ldyBNb2RhbFNwaW5uZXIoe1xyXG4gICAgICAgIHN0YXR1czogTW9kYWwuc3RhdHVzZXMuTUFKT1JcclxuICAgIH0pO1xyXG4gICAgc3Bpbm5lci5hY3RpdmF0ZSgpO1xyXG5cclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICBsZXQgaW1hZ2VJZCA9ICt0YXJnZXQuZGF0YXNldC5pZDtcclxuICAgIGNyZWF0ZUdhbGxlcnkoKS50aGVuKCgpID0+IHtcclxuICAgICAgICBzcGlubmVyLm9uSG9zdExvYWRlZChnYWxsZXJ5LCB7XHJcbiAgICAgICAgICAgIGltYWdlSWRcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlR2FsbGVyeSgpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgcmVxdWlyZS5lbnN1cmUoW0JMT0NLUyArICdnYWxsZXJ5J10sIGZ1bmN0aW9uIChyZXF1aXJlKSB7XHJcbiAgICAgICAgICAgIGxldCBHYWxsZXJ5ID0gcmVxdWlyZShCTE9DS1MgKyAnZ2FsbGVyeScpO1xyXG4gICAgICAgICAgICBnYWxsZXJ5ID0gbmV3IEdhbGxlcnkoe1xyXG4gICAgICAgICAgICAgICAgZ2FsbGVyeTogZ2FsbGVyeUVsZW0sXHJcbiAgICAgICAgICAgICAgICBpc0xvZ2dlZDogd2luZG93LmlzTG9nZ2VkLFxyXG4gICAgICAgICAgICAgICAgcHJlbG9hZEVudGl0eUNvdW50OiBQUkVMT0FEX0lNQUdFX0NPVU5ULFxyXG4gICAgICAgICAgICAgICAgaXNFbWJlZGRlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHB1YmxpY2F0aW9uTnVtYmVyRWxlbTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3B1YmxpY2F0aW9uLW51bWJlcicpLFxyXG4gICAgICAgICAgICAgICAgdXNlclN1YnNjcmliZUJ1dHRvbjogc3Vic2NyaWJlQnV0dG9uXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8vbGV0IG1lc3NhZ2VNb2RhbFdpbmRvdyA9IHJlcXVpcmUoQkxPQ0tTICsgJ21lc3NhZ2UtbW9kYWwtd2luZG93Jyk7XHJcbi8vIGxldCBjb3VudCA9IDA7XHJcbi8vIHNldEludGVydmFsKCgpID0+IHtcclxuLy8gICAgIGxldCBtZXNzYWdlID0gbmV3IG1lc3NhZ2VNb2RhbFdpbmRvdyh7bWVzc2FnZTogKytjb3VudH0pO1xyXG4vLyAgICAgbWVzc2FnZS5hY3RpdmF0ZSgpO1xyXG4vL1xyXG4vLyB9LCA1MDAwKTtcclxuXHJcblxyXG5pZiAod2luZG93LmlzTG9nZ2VkKSB7XHJcbiAgICBsZXQgdXNlck1lbnVEcm9wZG93biA9IG5ldyBEcm9wZG93bih7XHJcbiAgICAgICAgZWxlbTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXItbWVudScpLFxyXG4gICAgICAgIGNsYXNzTmFtZTogJ2hlYWRlci1lbGVtZW50J1xyXG4gICAgfSk7XHJcbn1cclxuXHJcblxyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vdXNlci9zY3JpcHQuanMiLCJsZXQgR2xvYmFsRXJyb3JIYW5kbGVyID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZSA9PiB7XHJcbiAgICAgICAgbGV0IGVycm9yID0gZS5kZXRhaWw7XHJcbiAgICAgICAgdGhpcy5jYWxsKGVycm9yKTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuR2xvYmFsRXJyb3JIYW5kbGVyLnByb3RvdHlwZS5jYWxsID0gZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICByZXF1aXJlLmVuc3VyZShbTElCUyArICdjb21wb25lbnRFcnJvcnMnLCBCTE9DS1MgKyAnbWVzc2FnZS1tb2RhbC13aW5kb3cnXSwgZnVuY3Rpb24gKHJlcXVpcmUpIHtcclxuICAgICAgICBsZXQgQ29tcG9uZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ29tcG9uZW50RXJyb3I7XHJcbiAgICAgICAgbGV0IE1lc3NhZ2VNb2RhbFdpbmRvdyA9IHJlcXVpcmUoQkxPQ0tTICsgJ21lc3NhZ2UtbW9kYWwtd2luZG93Jyk7XHJcblxyXG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIENvbXBvbmVudEVycm9yKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvci5zdGF0dXMgPT09IDQwMSkge1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZGlyZWN0ZWRfdXJsJywgd2luZG93LmxvY2F0aW9uLmhyZWYpO1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gJy9hdXRob3JpemF0aW9uJztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBtZXNzYWdlTW9kYWxXaW5kb3cgPSBuZXcgTWVzc2FnZU1vZGFsV2luZG93KHttZXNzYWdlOiBlcnJvci5tZXNzYWdlfSk7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlTW9kYWxXaW5kb3cuYWN0aXZhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2xvYmFsRXJyb3JIYW5kbGVyO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvZ2xvYmFsLWVycm9yLWhhbmRsZXIvaW5kZXguanMiLCJmdW5jdGlvbiBDdXN0b21FcnJvcihtZXNzYWdlKSB7XHJcblx0dGhpcy5uYW1lID0gXCJDdXN0b21FcnJvclwiO1xyXG5cdHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcblxyXG5cdGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSlcclxuXHRcdEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIEN1c3RvbUVycm9yKTtcclxuXHRlbHNlXHJcblx0XHR0aGlzLnN0YWNrID0gKG5ldyBFcnJvcigpKS5zdGFjaztcclxufVxyXG5DdXN0b21FcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XHJcbkN1c3RvbUVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEN1c3RvbUVycm9yO1xyXG5cclxuXHJcbmZ1bmN0aW9uIENvbXBvbmVudEVycm9yKG1lc3NhZ2UsIHN0YXR1cykge1xyXG5cdEN1c3RvbUVycm9yLmNhbGwodGhpcywgbWVzc2FnZSB8fCAnQW4gZXJyb3IgaGFzIG9jY3VycmVkJyApO1xyXG5cdHRoaXMubmFtZSA9IFwiQ29tcG9uZW50RXJyb3JcIjtcclxuXHR0aGlzLnN0YXR1cyA9IHN0YXR1cztcclxufVxyXG5Db21wb25lbnRFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEN1c3RvbUVycm9yLnByb3RvdHlwZSk7XHJcbkNvbXBvbmVudEVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENvbXBvbmVudEVycm9yO1xyXG5cclxuZnVuY3Rpb24gQ2xpZW50RXJyb3IobWVzc2FnZSwgZGV0YWlsLCBzdGF0dXMpIHtcclxuXHRDb21wb25lbnRFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ0FuIGVycm9yIGhhcyBvY2N1cnJlZC4gQ2hlY2sgaWYgamF2YXNjcmlwdCBpcyBlbmFibGVkJywgc3RhdHVzKTtcclxuXHR0aGlzLm5hbWUgPSBcIkNsaWVudEVycm9yXCI7XHJcblx0dGhpcy5kZXRhaWwgPSBkZXRhaWw7XHJcbn1cclxuQ2xpZW50RXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb21wb25lbnRFcnJvci5wcm90b3R5cGUpO1xyXG5DbGllbnRFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDbGllbnRFcnJvcjtcclxuXHJcblxyXG5mdW5jdGlvbiBJbWFnZU5vdEZvdW5kKG1lc3NhZ2UpIHtcclxuICAgIENsaWVudEVycm9yLmNhbGwodGhpcywgbWVzc2FnZSB8fCAnSW1hZ2Ugbm90IGZvdW5kLiBJdCBwcm9iYWJseSBoYXMgYmVlbiByZW1vdmVkJywgbnVsbCwgNDA0KTtcclxuICAgIHRoaXMubmFtZSA9IFwiSW1hZ2VOb3RGb3VuZFwiO1xyXG59XHJcbkltYWdlTm90Rm91bmQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDbGllbnRFcnJvci5wcm90b3R5cGUpO1xyXG5JbWFnZU5vdEZvdW5kLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEltYWdlTm90Rm91bmQ7XHJcblxyXG5mdW5jdGlvbiBTZXJ2ZXJFcnJvcihtZXNzYWdlLCBzdGF0dXMpIHtcclxuXHRDb21wb25lbnRFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ1RoZXJlIGlzIHNvbWUgZXJyb3Igb24gdGhlIHNlcnZlciBzaWRlJywgc3RhdHVzKTtcclxuXHR0aGlzLm5hbWUgPSBcIlNlcnZlckVycm9yXCI7XHJcbn1cclxuU2VydmVyRXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb21wb25lbnRFcnJvci5wcm90b3R5cGUpO1xyXG5TZXJ2ZXJFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTZXJ2ZXJFcnJvcjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdENvbXBvbmVudEVycm9yLFxyXG5cdENsaWVudEVycm9yLFxyXG4gICAgSW1hZ2VOb3RGb3VuZCxcclxuXHRTZXJ2ZXJFcnJvclxyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvY29tcG9uZW50RXJyb3JzLmpzIiwibGV0IGV2ZW50TWl4aW4gPSByZXF1aXJlKExJQlMgKyAnZXZlbnRNaXhpbicpO1xyXG5sZXQgU3Bpbm5lciA9IHJlcXVpcmUoQkxPQ0tTICsgJ3NwaW5uZXInKTtcclxuXHJcbmxldCBNb2RhbCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcclxuICAgIHRoaXMuc3RhdHVzID0gb3B0aW9ucyAmJiBvcHRpb25zLnN0YXR1cyB8fCBNb2RhbC5zdGF0dXNlcy5NSU5PUjtcclxufTtcclxuXHJcbk1vZGFsLnN0YXR1c2VzID0ge1xyXG4gICAgTUFKT1I6IDEsXHJcbiAgICBNSU5PUjogMlxyXG59O1xyXG5cclxuTW9kYWwucHJvdG90eXBlLm9uRWxlbUNsaWNrID0gZnVuY3Rpb24gKGUpIHtcclxuICAgIGlmIChlLnRhcmdldC5tYXRjaGVzKCcubW9kYWwtY2xvc2UtYnV0dG9uJykpXHJcbiAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XHJcbn07XHJcblxyXG5Nb2RhbC5wcm90b3R5cGUuc2V0TGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5saXN0ZW5lcnMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICB0aGlzLmVsZW0uYWRkRXZlbnRMaXN0ZW5lcihpdGVtLmV2ZW50TmFtZSwgaXRlbS5jYik7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbk1vZGFsLnNldEJhY2tkcm9wID0gZnVuY3Rpb24gKHN0YXR1cykge1xyXG4gICAgaWYgKHN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpIHtcclxuICAgICAgICBNb2RhbC5taW5vckJhY2tkcm9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tkcm9wX21pbm9yJyk7XHJcbiAgICAgICAgaWYgKCFNb2RhbC5taW5vckJhY2tkcm9wKVxyXG4gICAgICAgICAgICBNb2RhbC5taW5vckJhY2tkcm9wID0gTW9kYWwucmVuZGVyQmFja2Ryb3AoJ21pbm9yJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIE1vZGFsLm1ham9yQmFja2Ryb3AgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja2Ryb3BfbWFqb3InKTtcclxuICAgICAgICBpZiAoIU1vZGFsLm1ham9yQmFja2Ryb3ApXHJcbiAgICAgICAgICAgIE1vZGFsLm1ham9yQmFja2Ryb3AgPSBNb2RhbC5yZW5kZXJCYWNrZHJvcCgnbWFqb3InKTtcclxuICAgIH1cclxufTtcclxuXHJcbk1vZGFsLnNldFdyYXBwZXIgPSBmdW5jdGlvbiAoc3RhdHVzKSB7XHJcbiAgICBpZiAoc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUikge1xyXG4gICAgICAgIE1vZGFsLm1pbm9yV3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC13cmFwcGVyLW1pbm9yJyk7XHJcbiAgICAgICAgaWYgKCFNb2RhbC5taW5vcldyYXBwZXIpXHJcbiAgICAgICAgICAgIE1vZGFsLm1pbm9yV3JhcHBlciA9IE1vZGFsLnJlbmRlcldyYXBwZXIoJ21pbm9yJyk7XHJcbiAgICAgICAgTW9kYWwubWlub3JXcmFwcGVyLm9uY2xpY2sgPSBlID0+IHtcclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0ICYmICFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ21vZGFsLXdyYXBwZXJfbWlub3InKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAoTW9kYWwubWlub3JBY3RpdmUpXHJcbiAgICAgICAgICAgICAgICBNb2RhbC5taW5vclF1ZXVlWzBdLmRlYWN0aXZhdGUoKTtcclxuICAgICAgICB9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBNb2RhbC5tYWpvcldyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtd3JhcHBlci1tYWpvcicpO1xyXG4gICAgICAgIGlmICghTW9kYWwubWFqb3JXcmFwcGVyKVxyXG4gICAgICAgICAgICBNb2RhbC5tYWpvcldyYXBwZXIgPSBNb2RhbC5yZW5kZXJXcmFwcGVyKCdtYWpvcicpO1xyXG4gICAgICAgIE1vZGFsLm1ham9yV3JhcHBlci5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldCAmJiAhZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2RhbC13cmFwcGVyX21ham9yJykpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKE1vZGFsLm1ham9yQWN0aXZlKVxyXG4gICAgICAgICAgICAgICAgTW9kYWwubWFqb3JRdWV1ZVswXS5kZWFjdGl2YXRlKCk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufTtcclxuXHJcbk1vZGFsLnJlbmRlckJhY2tkcm9wID0gZnVuY3Rpb24gKHR5cGUpIHtcclxuICAgIGxldCBiYWNrZHJvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xyXG4gICAgYmFja2Ryb3AuY2xhc3NOYW1lID0gJ2JhY2tkcm9wIGJhY2tkcm9wX2ludmlzaWJsZSc7XHJcbiAgICBiYWNrZHJvcC5jbGFzc0xpc3QuYWRkKGBiYWNrZHJvcF8ke3R5cGV9YCk7XHJcbiAgICBiYWNrZHJvcC5pZCA9IGBiYWNrZHJvcC0ke3R5cGV9YDtcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYmFja2Ryb3ApO1xyXG4gICAgcmV0dXJuIGJhY2tkcm9wO1xyXG59O1xyXG5cclxuTW9kYWwucmVuZGVyV3JhcHBlciA9IGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICBsZXQgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xyXG4gICAgd3JhcHBlci5jbGFzc05hbWUgPSAnbW9kYWwtd3JhcHBlciBtb2RhbC13cmFwcGVyX2ludmlzaWJsZSc7XHJcbiAgICB3cmFwcGVyLmNsYXNzTGlzdC5hZGQoYG1vZGFsLXdyYXBwZXJfJHt0eXBlfWApO1xyXG4gICAgd3JhcHBlci5pZCA9IGBtb2RhbC13cmFwcGVyLSR7dHlwZX1gO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcclxuICAgIHJldHVybiB3cmFwcGVyO1xyXG59O1xyXG5cclxuTW9kYWwucHJvdG90eXBlLnJlbmRlcldpbmRvdyA9IGZ1bmN0aW9uIChodG1sKSB7XHJcblxyXG4gICAgbGV0IHBhcmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xyXG4gICAgcGFyZW50LmlubmVySFRNTCA9IGh0bWw7XHJcbiAgICBsZXQgd25kID0gcGFyZW50LmZpcnN0RWxlbWVudENoaWxkO1xyXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUilcclxuICAgICAgICBNb2RhbC5taW5vcldyYXBwZXIuYXBwZW5kQ2hpbGQod25kKTtcclxuICAgIGVsc2VcclxuICAgICAgICBNb2RhbC5tYWpvcldyYXBwZXIuYXBwZW5kQ2hpbGQod25kKTtcclxuXHJcbiAgICBwYXJlbnQucmVtb3ZlKCk7XHJcbiAgICByZXR1cm4gd25kO1xyXG59O1xyXG5cclxuTW9kYWwucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5zdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKSB7XHJcbiAgICAgICAgaWYgKCFNb2RhbC5taW5vckJhY2tkcm9wKVxyXG4gICAgICAgICAgICBNb2RhbC5zZXRCYWNrZHJvcChNb2RhbC5zdGF0dXNlcy5NSU5PUik7XHJcblxyXG4gICAgICAgIGlmICghTW9kYWwubWlub3JXcmFwcGVyKVxyXG4gICAgICAgICAgICBNb2RhbC5zZXRXcmFwcGVyKE1vZGFsLnN0YXR1c2VzLk1JTk9SKTtcclxuXHJcbiAgICAgICAgTW9kYWwubWlub3JXcmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLXdyYXBwZXJfaW52aXNpYmxlJyk7XHJcbiAgICAgICAgTW9kYWwubWlub3JCYWNrZHJvcC5jbGFzc0xpc3QucmVtb3ZlKCdiYWNrZHJvcF9pbnZpc2libGUnKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICghTW9kYWwubWFqb3JCYWNrZHJvcClcclxuICAgICAgICAgICAgTW9kYWwuc2V0QmFja2Ryb3AoTW9kYWwuc3RhdHVzZXMuTUFKT1IpO1xyXG5cclxuICAgICAgICBpZiAoIU1vZGFsLm1ham9yV3JhcHBlcilcclxuICAgICAgICAgICAgTW9kYWwuc2V0V3JhcHBlcihNb2RhbC5zdGF0dXNlcy5NQUpPUik7XHJcblxyXG4gICAgICAgIE1vZGFsLm1ham9yV3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC13cmFwcGVyX2ludmlzaWJsZScpO1xyXG4gICAgICAgIE1vZGFsLm1ham9yQmFja2Ryb3AuY2xhc3NMaXN0LnJlbW92ZSgnYmFja2Ryb3BfaW52aXNpYmxlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xyXG5cclxufTtcclxuXHJcblxyXG5Nb2RhbC5wcm90b3R5cGUuYWN0aXZhdGUgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgIGlmICh0aGlzLmVsZW1JZCA9PT0gJ3NwaW5uZXInKSB7XHJcbiAgICAgICAgbGV0IHNwaW5uZXIgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMub24oJ3NwaW5uZXJfaG9zdC1sb2FkZWQnLCBlID0+IHtcclxuICAgICAgICAgICAgbGV0IG5ld0hvc3QgPSBlLmRldGFpbC5ob3N0O1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUilcclxuICAgICAgICAgICAgICAgIE1vZGFsLm1pbm9yUXVldWUuc3BsaWNlKE1vZGFsLm1pbm9yUXVldWUuaW5kZXhPZihzcGlubmVyKSArIDEsIDAsIG5ld0hvc3QpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBNb2RhbC5tYWpvclF1ZXVlLnNwbGljZShNb2RhbC5tYWpvclF1ZXVlLmluZGV4T2Yoc3Bpbm5lcikgKyAxLCAwLCBuZXdIb3N0KTtcclxuXHJcbiAgICAgICAgICAgIHNwaW5uZXIuZGVhY3RpdmF0ZShlLmRldGFpbC5vcHRpb25zKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpIHtcclxuICAgICAgICAgICAgTW9kYWwubWlub3JRdWV1ZS5wdXNoKHRoaXMpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhNb2RhbC5taW5vclF1ZXVlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coTW9kYWwubWFqb3JRdWV1ZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIU1vZGFsLm1pbm9yQWN0aXZlKVxyXG4gICAgICAgICAgICAgICAgTW9kYWwubWlub3JTaG93KG9wdGlvbnMpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBNb2RhbC5tYWpvclF1ZXVlLnB1c2godGhpcyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKE1vZGFsLm1pbm9yUXVldWUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhNb2RhbC5tYWpvclF1ZXVlKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghTW9kYWwubWFqb3JBY3RpdmUpXHJcblxyXG4gICAgICAgICAgICAgICAgTW9kYWwubWFqb3JTaG93KG9wdGlvbnMpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5Nb2RhbC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpIHtcclxuICAgICAgICAvL1RPRE8gbm90IG5lY2Nlc3NhcnkgaWYgcXVldWUgaXMgbm90IGVtcHR5XHJcbiAgICAgICAgTW9kYWwubWlub3JXcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ21vZGFsLXdyYXBwZXJfaW52aXNpYmxlJyk7XHJcbiAgICAgICAgTW9kYWwubWlub3JCYWNrZHJvcC5jbGFzc0xpc3QuYWRkKCdiYWNrZHJvcF9pbnZpc2libGUnKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIE1vZGFsLm1ham9yV3JhcHBlci5jbGFzc0xpc3QuYWRkKCdtb2RhbC13cmFwcGVyX2ludmlzaWJsZScpO1xyXG4gICAgICAgIE1vZGFsLm1ham9yQmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgnYmFja2Ryb3BfaW52aXNpYmxlJyk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuTW9kYWwucHJvdG90eXBlLmRlYWN0aXZhdGUgPSBmdW5jdGlvbiAobmV4dFdpbmRvd09wdGlvbnMsIGhpZGVPcHRpb25zKSB7XHJcblxyXG4gICAgdGhpcy5oaWRlKGhpZGVPcHRpb25zKTtcclxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XHJcbiAgICBpZiAodGhpcy5zdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKSB7XHJcbiAgICAgICAgTW9kYWwubWlub3JBY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICBNb2RhbC5taW5vclF1ZXVlLnNoaWZ0KCk7XHJcbiAgICAgICAgTW9kYWwubWlub3JTaG93KG5leHRXaW5kb3dPcHRpb25zKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgTW9kYWwubWFqb3JBY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICBNb2RhbC5tYWpvclF1ZXVlLnNoaWZ0KCk7XHJcbiAgICAgICAgTW9kYWwubWFqb3JTaG93KG5leHRXaW5kb3dPcHRpb25zKTtcclxuICAgIH1cclxuICAgIHRoaXMudHJpZ2dlcignbW9kYWwtd2luZG93X2RlYWN0aXZhdGVkJyk7XHJcbn07XHJcblxyXG5Nb2RhbC5taW5vckFjdGl2ZSA9IGZhbHNlO1xyXG5Nb2RhbC5tYWpvckFjdGl2ZSA9IGZhbHNlO1xyXG5Nb2RhbC5taW5vclF1ZXVlID0gW107XHJcbk1vZGFsLm1ham9yUXVldWUgPSBbXTtcclxuXHJcbk1vZGFsLnNwaW5uZXIgPSBuZXcgU3Bpbm5lcigpO1xyXG5Nb2RhbC5zcGlubmVyLnN0YXR1cyA9IE1vZGFsLnN0YXR1c2VzLk1BSk9SO1xyXG5cclxuTW9kYWwuc2hvd1NwaW5uZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBNb2RhbC5wcm90b3R5cGUuc2hvdy5jYWxsKE1vZGFsLnNwaW5uZXIpO1xyXG5cclxuICAgIGlmICghTW9kYWwuc3Bpbm5lci5lbGVtKVxyXG4gICAgICAgIE1vZGFsLnNwaW5uZXIuZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGlubmVyJyk7XHJcbiAgICBpZiAoIU1vZGFsLnNwaW5uZXIuZWxlbSlcclxuICAgICAgICBNb2RhbC5zcGlubmVyLmVsZW0gPSBNb2RhbC5wcm90b3R5cGUucmVuZGVyV2luZG93LmNhbGwoTW9kYWwuc3Bpbm5lciwgU3Bpbm5lci5odG1sKTtcclxuXHJcbiAgICBNb2RhbC5zcGlubmVyLnNob3coKTtcclxufTtcclxuXHJcbk1vZGFsLmhpZGVTcGlubmVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgTW9kYWwuc3Bpbm5lci5oaWRlKCk7XHJcbn07XHJcblxyXG5cclxuTW9kYWwubWlub3JTaG93ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIGxldCBuZXh0TW9kYWxXaW5kb3cgPSBNb2RhbC5taW5vclF1ZXVlWzBdO1xyXG4gICAgaWYgKG5leHRNb2RhbFdpbmRvdykge1xyXG4gICAgICAgIGxldCBwcm9taXNlID0gbmV4dE1vZGFsV2luZG93LnNob3cob3B0aW9ucyk7XHJcbiAgICAgICAgaWYgKHByb21pc2UpXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgTW9kYWwubWlub3JBY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgTW9kYWwubWlub3JBY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgTW9kYWwubWlub3JBY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5Nb2RhbC5tYWpvclNob3cgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgIGxldCBuZXh0TW9kYWxXaW5kb3cgPSBNb2RhbC5tYWpvclF1ZXVlWzBdO1xyXG5cclxuICAgIGlmIChuZXh0TW9kYWxXaW5kb3cpIHtcclxuXHJcbiAgICAgICAgTW9kYWwuc2hvd1NwaW5uZXIoKTtcclxuICAgICAgICBsZXQgcHJvbWlzZSA9IG5leHRNb2RhbFdpbmRvdy5zaG93KG9wdGlvbnMpO1xyXG5cclxuICAgICAgICBpZiAocHJvbWlzZSlcclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2UudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBNb2RhbC5tYWpvckFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBNb2RhbC5oaWRlU3Bpbm5lcigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgTW9kYWwubWFqb3JBY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICBNb2RhbC5oaWRlU3Bpbm5lcigpO1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgTW9kYWwubWFqb3JBY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5mb3IgKGxldCBrZXkgaW4gZXZlbnRNaXhpbilcclxuICAgIE1vZGFsLnByb3RvdHlwZVtrZXldID0gZXZlbnRNaXhpbltrZXldO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTW9kYWw7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvbW9kYWwvaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcblx0b246IGZ1bmN0aW9uKGV2ZW50TmFtZSwgY2IpIHtcclxuXHRcdGlmICh0aGlzLmVsZW0pXHJcblx0XHRcdHRoaXMuZWxlbS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2IpO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHR0aGlzLmxpc3RlbmVycy5wdXNoKHtcclxuXHRcdFx0XHRldmVudE5hbWUsXHJcblx0XHRcdFx0Y2JcclxuXHRcdFx0fSk7XHJcblx0fSxcclxuXHJcblx0dHJpZ2dlcjogZnVuY3Rpb24oZXZlbnROYW1lLCBkZXRhaWwpIHtcclxuXHRcdHRoaXMuZWxlbS5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChldmVudE5hbWUsIHtcclxuXHRcdFx0YnViYmxlczogdHJ1ZSxcclxuXHRcdFx0Y2FuY2VsYWJsZTogdHJ1ZSxcclxuXHRcdFx0ZGV0YWlsOiBkZXRhaWxcclxuXHRcdH0pKTtcclxuXHR9LFxyXG5cclxuXHRlcnJvcjogZnVuY3Rpb24oZXJyKSB7XHJcblx0XHR0aGlzLmVsZW0uZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2Vycm9yJywge1xyXG5cdFx0XHRidWJibGVzOiB0cnVlLFxyXG5cdFx0XHRjYW5jZWxhYmxlOiB0cnVlLFxyXG5cdFx0XHRkZXRhaWw6IGVyclxyXG5cdFx0fSkpO1xyXG5cdH1cclxuXHJcblxyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvZXZlbnRNaXhpbi5qcyIsImxldCBTcGlubmVyID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGlubmVyJyk7XHJcbn07XHJcblxyXG5TcGlubmVyLmh0bWwgPSByZXF1aXJlKGBodG1sLWxvYWRlciEuL21hcmt1cGApO1xyXG5cclxuU3Bpbm5lci5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdzcGlubmVyX2ludmlzaWJsZScpO1xyXG59O1xyXG5cclxuU3Bpbm5lci5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdzcGlubmVyX2ludmlzaWJsZScpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTcGlubmVyO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3Mvc3Bpbm5lci9pbmRleC5qcyIsIm1vZHVsZS5leHBvcnRzID0gXCI8ZGl2IGlkPVxcXCJzcGlubmVyXFxcIiBjbGFzcz1cXFwic3Bpbm5lclxcXCI+XFxyXFxuXFxyXFxuPC9kaXY+XCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL34vaHRtbC1sb2FkZXIhLi4vYmxvY2tzL3NwaW5uZXIvbWFya3VwXG4vLyBtb2R1bGUgaWQgPSAyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDEgMiA4IDkgMTAiLCJsZXQgRHJvcGRvd24gPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgIHRoaXMuZWxlbSA9IG9wdGlvbnMuZWxlbTtcclxuICAgIHRoaXMuaXRlbUxpc3QgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmRyb3Bkb3duX19pdGVtLWxpc3QnKTtcclxuICAgIHRoaXMuY2xhc3NOYW1lID0gb3B0aW9ucy5jbGFzc05hbWU7XHJcblxyXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuXHJcbiAgICAvLyB0aGlzLmVsZW0ub25jbGljayA9IGUgPT4ge1xyXG4gICAgLy8gICAgIHRoaXMudG9nZ2xlKCk7XHJcbiAgICAvLyB9O1xyXG5cclxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLml0ZW1MaXN0LmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5lbGVtLmNvbnRhaW5zKGUudGFyZ2V0KSlcclxuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlKCk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuYWN0aXZlKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sIGZhbHNlKTtcclxuXHJcblxyXG4gICAgdGhpcy5BRUhhbmRsZXIgPSB0aGlzLkFFSGFuZGxlci5iaW5kKHRoaXMpO1xyXG5cclxufTtcclxuXHJcbkRyb3Bkb3duLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3Bkb3duX2ludmlzaWJsZScpO1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoYCR7dGhpcy5jbGFzc05hbWV9X2FjdGl2ZWApO1xyXG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xyXG59O1xyXG5cclxuRHJvcGRvd24ucHJvdG90eXBlLmRlYWN0aXZhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLml0ZW1MaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbmVuZCcsIHRoaXMuQUVIYW5kbGVyLCBmYWxzZSk7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnZHJvcGRvd25fZmFkaW5nLW91dCcpO1xyXG59O1xyXG5cclxuRHJvcGRvd24ucHJvdG90eXBlLkFFSGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdkcm9wZG93bl9mYWRpbmctb3V0Jyk7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnZHJvcGRvd25faW52aXNpYmxlJyk7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZShgJHt0aGlzLmNsYXNzTmFtZX1fYWN0aXZlYCk7XHJcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5pdGVtTGlzdC5yZW1vdmVFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCB0aGlzLkFFSGFuZGxlcik7XHJcbn07XHJcblxyXG5Ecm9wZG93bi5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuYWN0aXZlKVxyXG4gICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHRoaXMuc2hvdygpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEcm9wZG93bjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL2Ryb3Bkb3duL2luZGV4LmpzIiwibGV0IGV2ZW50TWl4aW4gPSByZXF1aXJlKExJQlMgKyAnZXZlbnRNaXhpbicpO1xyXG5sZXQgTW9kYWwgPSByZXF1aXJlKEJMT0NLUyArICdtb2RhbCcpO1xyXG5sZXQgU3Bpbm5lciA9IHJlcXVpcmUoQkxPQ0tTICsgJ3NwaW5uZXInKTtcclxuXHJcbmxldCBNb2RhbFNwaW5uZXIgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgU3Bpbm5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgTW9kYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgIHRoaXMuZWxlbUlkID0gJ3NwaW5uZXInO1xyXG4gICAgdGhpcy5ob3N0ID0gbnVsbDtcclxuXHJcbn07XHJcbk1vZGFsU3Bpbm5lci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKE1vZGFsLnByb3RvdHlwZSk7XHJcbk1vZGFsU3Bpbm5lci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBNb2RhbFNwaW5uZXI7XHJcblxyXG5mb3IgKGxldCBrZXkgaW4gU3Bpbm5lci5wcm90b3R5cGUpXHJcbiAgICBNb2RhbFNwaW5uZXIucHJvdG90eXBlW2tleV0gPSBTcGlubmVyLnByb3RvdHlwZVtrZXldO1xyXG5cclxuXHJcbk1vZGFsU3Bpbm5lci5wcm90b3R5cGUuc2V0RWxlbSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKCF0aGlzLmVsZW0pXHJcbiAgICAgICAgdGhpcy5lbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwaW5uZXInKTtcclxuICAgIGlmICghdGhpcy5lbGVtKVxyXG4gICAgICAgIHRoaXMuZWxlbSA9IHRoaXMucmVuZGVyV2luZG93KFNwaW5uZXIuaHRtbCk7XHJcbn07XHJcblxyXG5Nb2RhbFNwaW5uZXIucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBNb2RhbC5wcm90b3R5cGUuc2hvdy5hcHBseSh0aGlzKTtcclxuXHJcbiAgICBpZiAoIXRoaXMuZWxlbSlcclxuICAgICAgICB0aGlzLnNldEVsZW0oKTtcclxuXHJcbiAgICB0aGlzLnNldExpc3RlbmVycygpO1xyXG5cclxuICAgIFNwaW5uZXIucHJvdG90eXBlLnNob3cuYXBwbHkodGhpcyk7XHJcbn07XHJcblxyXG5Nb2RhbFNwaW5uZXIucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBNb2RhbC5wcm90b3R5cGUuaGlkZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgU3Bpbm5lci5wcm90b3R5cGUuaGlkZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59O1xyXG5cclxuXHJcbk1vZGFsU3Bpbm5lci5wcm90b3R5cGUuZGVhY3RpdmF0ZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBNb2RhbC5wcm90b3R5cGUuZGVhY3RpdmF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59O1xyXG5cclxuTW9kYWxTcGlubmVyLnByb3RvdHlwZS5vbkhvc3RMb2FkZWQgPSBmdW5jdGlvbiAoaG9zdCwgb3B0aW9ucykge1xyXG4gICAgdGhpcy50cmlnZ2VyKCdzcGlubmVyX2hvc3QtbG9hZGVkJywge1xyXG4gICAgICAgIGhvc3QsXHJcbiAgICAgICAgb3B0aW9uc1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5cclxuXHJcbmZvciAobGV0IGtleSBpbiBldmVudE1peGluKVxyXG4gICAgTW9kYWxTcGlubmVyLnByb3RvdHlwZVtrZXldID0gZXZlbnRNaXhpbltrZXldO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNb2RhbFNwaW5uZXI7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9tb2RhbC1zcGlubmVyL2luZGV4LmpzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3VzZXIvc3R5bGUubGVzc1xuLy8gbW9kdWxlIGlkID0gNTNcbi8vIG1vZHVsZSBjaHVua3MgPSAxMCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFJQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQzlIQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBOzs7QUFFQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBOzs7Ozs7Ozs7QUN0UUE7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDYkE7Ozs7Ozs7OztBQ0FBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBOzs7Ozs7Ozs7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBSUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUFBOzs7Ozs7O0FDeERBOzs7OyIsInNvdXJjZVJvb3QiOiIifQ==