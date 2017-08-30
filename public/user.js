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

	__webpack_require__(54);

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
	            var SubscribeButton = __webpack_require__(40);
	            subscribeButton = new SubscribeButton({
	                elem: subscribeButtonElem,
	                outerStatElem: document.getElementById('subscribers-stat')
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
	                    var UploadImageModalWindow = __webpack_require__(56);
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
	                publicationsStatElem: document.getElementById('publications-stat'),
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
	                var messageModalWindow = new MessageModalWindow({ message: error.message, caption: 'error' });
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

	    this.elem.classList.add('modal', 'modal-spinner');
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

/***/ 54:
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAxZGM0YmU4MzU1ZGE0NWUzMmJmMiIsIndlYnBhY2s6Ly8vLi91c2VyL3NjcmlwdC5qcyIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2dsb2JhbC1lcnJvci1oYW5kbGVyL2luZGV4LmpzIiwid2VicGFjazovLy9EOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9jb21wb25lbnRFcnJvcnMuanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9tb2RhbC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvZXZlbnRNaXhpbi5qcyIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL3NwaW5uZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9zcGlubmVyL21hcmt1cCIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2Ryb3Bkb3duL2luZGV4LmpzIiwid2VicGFjazovLy8uLi9ibG9ja3MvbW9kYWwtc3Bpbm5lci9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi91c2VyL3N0eWxlLmxlc3MiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG4gXHR2YXIgcGFyZW50SnNvbnBGdW5jdGlvbiA9IHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXTtcbiBcdHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXSA9IGZ1bmN0aW9uIHdlYnBhY2tKc29ucENhbGxiYWNrKGNodW5rSWRzLCBtb3JlTW9kdWxlcykge1xuIFx0XHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcbiBcdFx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG4gXHRcdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDAsIGNhbGxiYWNrcyA9IFtdO1xuIFx0XHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcbiBcdFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pXG4gXHRcdFx0XHRjYWxsYmFja3MucHVzaC5hcHBseShjYWxsYmFja3MsIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSk7XG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcbiBcdFx0fVxuIFx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGlmKHBhcmVudEpzb25wRnVuY3Rpb24pIHBhcmVudEpzb25wRnVuY3Rpb24oY2h1bmtJZHMsIG1vcmVNb2R1bGVzKTtcbiBcdFx0d2hpbGUoY2FsbGJhY2tzLmxlbmd0aClcbiBcdFx0XHRjYWxsYmFja3Muc2hpZnQoKS5jYWxsKG51bGwsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHR9O1xuXG4gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuIFx0Ly8gXCIwXCIgbWVhbnMgXCJhbHJlYWR5IGxvYWRlZFwiXG4gXHQvLyBBcnJheSBtZWFucyBcImxvYWRpbmdcIiwgYXJyYXkgY29udGFpbnMgY2FsbGJhY2tzXG4gXHR2YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuIFx0XHQxMDowXG4gXHR9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cbiBcdC8vIFRoaXMgZmlsZSBjb250YWlucyBvbmx5IHRoZSBlbnRyeSBjaHVuay5cbiBcdC8vIFRoZSBjaHVuayBsb2FkaW5nIGZ1bmN0aW9uIGZvciBhZGRpdGlvbmFsIGNodW5rc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5lID0gZnVuY3Rpb24gcmVxdWlyZUVuc3VyZShjaHVua0lkLCBjYWxsYmFjaykge1xuIFx0XHQvLyBcIjBcIiBpcyB0aGUgc2lnbmFsIGZvciBcImFscmVhZHkgbG9hZGVkXCJcbiBcdFx0aWYoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKVxuIFx0XHRcdHJldHVybiBjYWxsYmFjay5jYWxsKG51bGwsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIGFuIGFycmF5IG1lYW5zIFwiY3VycmVudGx5IGxvYWRpbmdcIi5cbiBcdFx0aWYoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdICE9PSB1bmRlZmluZWQpIHtcbiBcdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0ucHVzaChjYWxsYmFjayk7XG4gXHRcdH0gZWxzZSB7XG4gXHRcdFx0Ly8gc3RhcnQgY2h1bmsgbG9hZGluZ1xuIFx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IFtjYWxsYmFja107XG4gXHRcdFx0dmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuIFx0XHRcdHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiBcdFx0XHRzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuIFx0XHRcdHNjcmlwdC5jaGFyc2V0ID0gJ3V0Zi04JztcbiBcdFx0XHRzY3JpcHQuYXN5bmMgPSB0cnVlO1xuXG4gXHRcdFx0c2NyaXB0LnNyYyA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIFwiXCIgKyBjaHVua0lkICsgXCIuXCIgKyAoe31bY2h1bmtJZF18fGNodW5rSWQpICsgXCIuanNcIjtcbiBcdFx0XHRoZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDFkYzRiZTgzNTVkYTQ1ZTMyYmYyIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgJy4vc3R5bGUubGVzcyc7XHJcblxyXG5sZXQgR2xvYmFsRXJyb3JIYW5kbGVyID0gcmVxdWlyZShCTE9DS1MgKyAnZ2xvYmFsLWVycm9yLWhhbmRsZXInKTtcclxubGV0IGdsb2JhbEVycm9ySGFuZGxlciA9IG5ldyBHbG9iYWxFcnJvckhhbmRsZXIoKTtcclxuXHJcbmxldCBDbGllbnRFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5DbGllbnRFcnJvcjtcclxubGV0IERyb3Bkb3duID0gcmVxdWlyZShCTE9DS1MgKyAnZHJvcGRvd24nKTtcclxubGV0IE1vZGFsID0gcmVxdWlyZShCTE9DS1MgKyAnbW9kYWwnKTtcclxubGV0IE1vZGFsU3Bpbm5lciA9IHJlcXVpcmUoQkxPQ0tTICsgJ21vZGFsLXNwaW5uZXInKTtcclxubGV0IGV2ZW50TWl4aW4gPSByZXF1aXJlKExJQlMgKyAnZXZlbnRNaXhpbicpO1xyXG5cclxuXHJcbi8vIGxldCBsaW5rc0Ryb3Bkb3duID0gbmV3IERyb3Bkb3duKHtcclxuLy8gICAgIGVsZW06IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaW5rcy1kcm9wZG93bicpLFxyXG4vLyAgICAgY2xhc3NOYW1lOiAnbGlua3MtZHJvcGRvd24nXHJcbi8vIH0pO1xyXG5cclxubGV0IHN1YnNjcmliZUJ1dHRvbkVsZW07XHJcbmxldCBzdWJzY3JpYmVCdXR0b247XHJcblxyXG5pZiAoc3Vic2NyaWJlQnV0dG9uRWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdWJzY3JpYmUtYnV0dG9uJykpIHtcclxuICAgIGlmICh3aW5kb3cuaXNMb2dnZWQpIHtcclxuICAgICAgICByZXF1aXJlLmVuc3VyZShbQkxPQ0tTICsgJ3N1YnNjcmliZS1idXR0b24nXSwgZnVuY3Rpb24gKHJlcXVpcmUpIHtcclxuICAgICAgICAgICAgbGV0IFN1YnNjcmliZUJ1dHRvbiA9IHJlcXVpcmUoQkxPQ0tTICsgJ3N1YnNjcmliZS1idXR0b24nKTtcclxuICAgICAgICAgICAgc3Vic2NyaWJlQnV0dG9uID0gbmV3IFN1YnNjcmliZUJ1dHRvbih7XHJcbiAgICAgICAgICAgICAgICBlbGVtOiBzdWJzY3JpYmVCdXR0b25FbGVtLFxyXG4gICAgICAgICAgICAgICAgb3V0ZXJTdGF0RWxlbTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1YnNjcmliZXJzLXN0YXQnKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZVxyXG4gICAgICAgIHN1YnNjcmliZUJ1dHRvbkVsZW0ub25jbGljayA9IGUgPT4ge1xyXG4gICAgICAgICAgICBnbG9iYWxFcnJvckhhbmRsZXIuY2FsbChuZXcgQ2xpZW50RXJyb3IobnVsbCwgbnVsbCwgNDAxKSk7XHJcbiAgICAgICAgfTtcclxufVxyXG5cclxuXHJcbmxldCB1cGxvYWRJbWFnZU1vZGFsV2luZG93Q2FsbGVyO1xyXG5sZXQgdXBsb2FkSW1hZ2VNb2RhbFdpbmRvdztcclxuaWYgKHVwbG9hZEltYWdlTW9kYWxXaW5kb3dDYWxsZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXBsb2FkLXdpbmRvdy1jYWxsZXInKSkge1xyXG4gICAgdXBsb2FkSW1hZ2VNb2RhbFdpbmRvd0NhbGxlci5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdXBsb2FkSW1hZ2VNb2RhbFdpbmRvdykge1xyXG5cclxuICAgICAgICAgICAgbGV0IHNwaW5uZXIgPSBuZXcgTW9kYWxTcGlubmVyKHtcclxuICAgICAgICAgICAgICAgIHN0YXR1czogTW9kYWwuc3RhdHVzZXMuTUFKT1JcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHNwaW5uZXIuYWN0aXZhdGUoKTtcclxuICAgICAgICAgICAgcmVxdWlyZS5lbnN1cmUoW0JMT0NLUyArICd1cGxvYWQtaW1hZ2UtbW9kYWwtd2luZG93J10sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVxdWlyZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBVcGxvYWRJbWFnZU1vZGFsV2luZG93ID0gcmVxdWlyZShCTE9DS1MgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAndXBsb2FkLWltYWdlLW1vZGFsLXdpbmRvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZEltYWdlTW9kYWxXaW5kb3cgPSBuZXcgVXBsb2FkSW1hZ2VNb2RhbFdpbmRvdygpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB1cGxvYWRJbWFnZU1vZGFsV2luZG93Lm9uKCd1cGxvYWQtaW1hZ2UtbW9kYWwtd2luZG93X19pbWFnZS11cGxvYWRlZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdhbGxlcnkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FsbGVyeS5pbnNlcnROZXdJbWFnZVByZXZpZXcoZS5kZXRhaWwuaW1hZ2VJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5kZXRhaWwucHJldmlld1VybCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVHYWxsZXJ5KCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhbGxlcnkuaW5zZXJ0TmV3SW1hZ2VQcmV2aWV3KGUuZGV0YWlsLmltYWdlSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLmRldGFpbC5wcmV2aWV3VXJsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNwaW5uZXIub25Ib3N0TG9hZGVkKHVwbG9hZEltYWdlTW9kYWxXaW5kb3cpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHVwbG9hZEltYWdlTW9kYWxXaW5kb3cuYWN0aXZhdGUoKTtcclxuICAgIH07XHJcbn1cclxuXHJcbmxldCBnYWxsZXJ5O1xyXG5sZXQgZ2FsbGVyeUVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FsbGVyeScpO1xyXG5nYWxsZXJ5RWxlbS5vbmNsaWNrID0gZnVuY3Rpb24gKGUpIHtcclxuICAgIGxldCB0YXJnZXQ7XHJcbiAgICBpZiAoISh0YXJnZXQgPSBlLnRhcmdldC5jbG9zZXN0KCcuaW1hZ2UtcHJldmlldycpKSkgcmV0dXJuO1xyXG5cclxuICAgIGxldCBzcGlubmVyID0gbmV3IE1vZGFsU3Bpbm5lcih7XHJcbiAgICAgICAgc3RhdHVzOiBNb2RhbC5zdGF0dXNlcy5NQUpPUlxyXG4gICAgfSk7XHJcbiAgICBzcGlubmVyLmFjdGl2YXRlKCk7XHJcblxyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGxldCBpbWFnZUlkID0gK3RhcmdldC5kYXRhc2V0LmlkO1xyXG4gICAgY3JlYXRlR2FsbGVyeSgpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIHNwaW5uZXIub25Ib3N0TG9hZGVkKGdhbGxlcnksIHtcclxuICAgICAgICAgICAgaW1hZ2VJZFxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVHYWxsZXJ5KCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICByZXF1aXJlLmVuc3VyZShbQkxPQ0tTICsgJ2dhbGxlcnknXSwgZnVuY3Rpb24gKHJlcXVpcmUpIHtcclxuICAgICAgICAgICAgbGV0IEdhbGxlcnkgPSByZXF1aXJlKEJMT0NLUyArICdnYWxsZXJ5Jyk7XHJcbiAgICAgICAgICAgIGdhbGxlcnkgPSBuZXcgR2FsbGVyeSh7XHJcbiAgICAgICAgICAgICAgICBnYWxsZXJ5OiBnYWxsZXJ5RWxlbSxcclxuICAgICAgICAgICAgICAgIGlzTG9nZ2VkOiB3aW5kb3cuaXNMb2dnZWQsXHJcbiAgICAgICAgICAgICAgICBwcmVsb2FkRW50aXR5Q291bnQ6IFBSRUxPQURfSU1BR0VfQ09VTlQsXHJcbiAgICAgICAgICAgICAgICBpc0VtYmVkZGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcHVibGljYXRpb25zU3RhdEVsZW06IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwdWJsaWNhdGlvbnMtc3RhdCcpLFxyXG4gICAgICAgICAgICAgICAgdXNlclN1YnNjcmliZUJ1dHRvbjogc3Vic2NyaWJlQnV0dG9uXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8vbGV0IG1lc3NhZ2VNb2RhbFdpbmRvdyA9IHJlcXVpcmUoQkxPQ0tTICsgJ21lc3NhZ2UtbW9kYWwtd2luZG93Jyk7XHJcbi8vIGxldCBjb3VudCA9IDA7XHJcbi8vIHNldEludGVydmFsKCgpID0+IHtcclxuLy8gICAgIGxldCBtZXNzYWdlID0gbmV3IG1lc3NhZ2VNb2RhbFdpbmRvdyh7bWVzc2FnZTogKytjb3VudH0pO1xyXG4vLyAgICAgbWVzc2FnZS5hY3RpdmF0ZSgpO1xyXG4vL1xyXG4vLyB9LCA1MDAwKTtcclxuXHJcblxyXG5pZiAod2luZG93LmlzTG9nZ2VkKSB7XHJcbiAgICBsZXQgdXNlck1lbnVEcm9wZG93biA9IG5ldyBEcm9wZG93bih7XHJcbiAgICAgICAgZWxlbTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXItbWVudScpLFxyXG4gICAgICAgIGNsYXNzTmFtZTogJ2hlYWRlci1lbGVtZW50J1xyXG4gICAgfSk7XHJcbn1cclxuXHJcblxyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vdXNlci9zY3JpcHQuanMiLCJsZXQgR2xvYmFsRXJyb3JIYW5kbGVyID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZSA9PiB7XHJcbiAgICAgICAgbGV0IGVycm9yID0gZS5kZXRhaWw7XHJcbiAgICAgICAgdGhpcy5jYWxsKGVycm9yKTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuR2xvYmFsRXJyb3JIYW5kbGVyLnByb3RvdHlwZS5jYWxsID0gZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICByZXF1aXJlLmVuc3VyZShbTElCUyArICdjb21wb25lbnRFcnJvcnMnLCBCTE9DS1MgKyAnbWVzc2FnZS1tb2RhbC13aW5kb3cnXSwgZnVuY3Rpb24gKHJlcXVpcmUpIHtcclxuICAgICAgICBsZXQgQ29tcG9uZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ29tcG9uZW50RXJyb3I7XHJcbiAgICAgICAgbGV0IE1lc3NhZ2VNb2RhbFdpbmRvdyA9IHJlcXVpcmUoQkxPQ0tTICsgJ21lc3NhZ2UtbW9kYWwtd2luZG93Jyk7XHJcblxyXG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIENvbXBvbmVudEVycm9yKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvci5zdGF0dXMgPT09IDQwMSkge1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZGlyZWN0ZWRfdXJsJywgd2luZG93LmxvY2F0aW9uLmhyZWYpO1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gJy9hdXRob3JpemF0aW9uJztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBtZXNzYWdlTW9kYWxXaW5kb3cgPSBuZXcgTWVzc2FnZU1vZGFsV2luZG93KHttZXNzYWdlOiBlcnJvci5tZXNzYWdlLCBjYXB0aW9uOiAnZXJyb3InfSk7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlTW9kYWxXaW5kb3cuYWN0aXZhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2xvYmFsRXJyb3JIYW5kbGVyO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvZ2xvYmFsLWVycm9yLWhhbmRsZXIvaW5kZXguanMiLCJmdW5jdGlvbiBDdXN0b21FcnJvcihtZXNzYWdlKSB7XHJcblx0dGhpcy5uYW1lID0gXCJDdXN0b21FcnJvclwiO1xyXG5cdHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcblxyXG5cdGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSlcclxuXHRcdEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIEN1c3RvbUVycm9yKTtcclxuXHRlbHNlXHJcblx0XHR0aGlzLnN0YWNrID0gKG5ldyBFcnJvcigpKS5zdGFjaztcclxufVxyXG5DdXN0b21FcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XHJcbkN1c3RvbUVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEN1c3RvbUVycm9yO1xyXG5cclxuXHJcbmZ1bmN0aW9uIENvbXBvbmVudEVycm9yKG1lc3NhZ2UsIHN0YXR1cykge1xyXG5cdEN1c3RvbUVycm9yLmNhbGwodGhpcywgbWVzc2FnZSB8fCAnQW4gZXJyb3IgaGFzIG9jY3VycmVkJyApO1xyXG5cdHRoaXMubmFtZSA9IFwiQ29tcG9uZW50RXJyb3JcIjtcclxuXHR0aGlzLnN0YXR1cyA9IHN0YXR1cztcclxufVxyXG5Db21wb25lbnRFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEN1c3RvbUVycm9yLnByb3RvdHlwZSk7XHJcbkNvbXBvbmVudEVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENvbXBvbmVudEVycm9yO1xyXG5cclxuZnVuY3Rpb24gQ2xpZW50RXJyb3IobWVzc2FnZSwgZGV0YWlsLCBzdGF0dXMpIHtcclxuXHRDb21wb25lbnRFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ0FuIGVycm9yIGhhcyBvY2N1cnJlZC4gQ2hlY2sgaWYgamF2YXNjcmlwdCBpcyBlbmFibGVkJywgc3RhdHVzKTtcclxuXHR0aGlzLm5hbWUgPSBcIkNsaWVudEVycm9yXCI7XHJcblx0dGhpcy5kZXRhaWwgPSBkZXRhaWw7XHJcbn1cclxuQ2xpZW50RXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb21wb25lbnRFcnJvci5wcm90b3R5cGUpO1xyXG5DbGllbnRFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDbGllbnRFcnJvcjtcclxuXHJcblxyXG5mdW5jdGlvbiBJbWFnZU5vdEZvdW5kKG1lc3NhZ2UpIHtcclxuICAgIENsaWVudEVycm9yLmNhbGwodGhpcywgbWVzc2FnZSB8fCAnSW1hZ2Ugbm90IGZvdW5kLiBJdCBwcm9iYWJseSBoYXMgYmVlbiByZW1vdmVkJywgbnVsbCwgNDA0KTtcclxuICAgIHRoaXMubmFtZSA9IFwiSW1hZ2VOb3RGb3VuZFwiO1xyXG59XHJcbkltYWdlTm90Rm91bmQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDbGllbnRFcnJvci5wcm90b3R5cGUpO1xyXG5JbWFnZU5vdEZvdW5kLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEltYWdlTm90Rm91bmQ7XHJcblxyXG5mdW5jdGlvbiBTZXJ2ZXJFcnJvcihtZXNzYWdlLCBzdGF0dXMpIHtcclxuXHRDb21wb25lbnRFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ1RoZXJlIGlzIHNvbWUgZXJyb3Igb24gdGhlIHNlcnZlciBzaWRlJywgc3RhdHVzKTtcclxuXHR0aGlzLm5hbWUgPSBcIlNlcnZlckVycm9yXCI7XHJcbn1cclxuU2VydmVyRXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb21wb25lbnRFcnJvci5wcm90b3R5cGUpO1xyXG5TZXJ2ZXJFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTZXJ2ZXJFcnJvcjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdENvbXBvbmVudEVycm9yLFxyXG5cdENsaWVudEVycm9yLFxyXG4gICAgSW1hZ2VOb3RGb3VuZCxcclxuXHRTZXJ2ZXJFcnJvclxyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvY29tcG9uZW50RXJyb3JzLmpzIiwibGV0IGV2ZW50TWl4aW4gPSByZXF1aXJlKExJQlMgKyAnZXZlbnRNaXhpbicpO1xyXG5sZXQgU3Bpbm5lciA9IHJlcXVpcmUoQkxPQ0tTICsgJ3NwaW5uZXInKTtcclxuXHJcbmxldCBNb2RhbCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcclxuICAgIHRoaXMuc3RhdHVzID0gb3B0aW9ucyAmJiBvcHRpb25zLnN0YXR1cyB8fCBNb2RhbC5zdGF0dXNlcy5NSU5PUjtcclxufTtcclxuXHJcbk1vZGFsLnN0YXR1c2VzID0ge1xyXG4gICAgTUFKT1I6IDEsXHJcbiAgICBNSU5PUjogMlxyXG59O1xyXG5cclxuTW9kYWwucHJvdG90eXBlLm9uRWxlbUNsaWNrID0gZnVuY3Rpb24gKGUpIHtcclxuICAgIGlmIChlLnRhcmdldC5tYXRjaGVzKCcubW9kYWwtY2xvc2UtYnV0dG9uJykpXHJcbiAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XHJcbn07XHJcblxyXG5Nb2RhbC5wcm90b3R5cGUuc2V0TGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5saXN0ZW5lcnMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICB0aGlzLmVsZW0uYWRkRXZlbnRMaXN0ZW5lcihpdGVtLmV2ZW50TmFtZSwgaXRlbS5jYik7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbk1vZGFsLnNldEJhY2tkcm9wID0gZnVuY3Rpb24gKHN0YXR1cykge1xyXG4gICAgaWYgKHN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpIHtcclxuICAgICAgICBNb2RhbC5taW5vckJhY2tkcm9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tkcm9wX21pbm9yJyk7XHJcbiAgICAgICAgaWYgKCFNb2RhbC5taW5vckJhY2tkcm9wKVxyXG4gICAgICAgICAgICBNb2RhbC5taW5vckJhY2tkcm9wID0gTW9kYWwucmVuZGVyQmFja2Ryb3AoJ21pbm9yJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIE1vZGFsLm1ham9yQmFja2Ryb3AgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja2Ryb3BfbWFqb3InKTtcclxuICAgICAgICBpZiAoIU1vZGFsLm1ham9yQmFja2Ryb3ApXHJcbiAgICAgICAgICAgIE1vZGFsLm1ham9yQmFja2Ryb3AgPSBNb2RhbC5yZW5kZXJCYWNrZHJvcCgnbWFqb3InKTtcclxuICAgIH1cclxufTtcclxuXHJcbk1vZGFsLnNldFdyYXBwZXIgPSBmdW5jdGlvbiAoc3RhdHVzKSB7XHJcbiAgICBpZiAoc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUikge1xyXG4gICAgICAgIE1vZGFsLm1pbm9yV3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC13cmFwcGVyLW1pbm9yJyk7XHJcbiAgICAgICAgaWYgKCFNb2RhbC5taW5vcldyYXBwZXIpXHJcbiAgICAgICAgICAgIE1vZGFsLm1pbm9yV3JhcHBlciA9IE1vZGFsLnJlbmRlcldyYXBwZXIoJ21pbm9yJyk7XHJcbiAgICAgICAgTW9kYWwubWlub3JXcmFwcGVyLm9uY2xpY2sgPSBlID0+IHtcclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0ICYmICFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ21vZGFsLXdyYXBwZXJfbWlub3InKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAoTW9kYWwubWlub3JBY3RpdmUpXHJcbiAgICAgICAgICAgICAgICBNb2RhbC5taW5vclF1ZXVlWzBdLmRlYWN0aXZhdGUoKTtcclxuICAgICAgICB9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBNb2RhbC5tYWpvcldyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtd3JhcHBlci1tYWpvcicpO1xyXG4gICAgICAgIGlmICghTW9kYWwubWFqb3JXcmFwcGVyKVxyXG4gICAgICAgICAgICBNb2RhbC5tYWpvcldyYXBwZXIgPSBNb2RhbC5yZW5kZXJXcmFwcGVyKCdtYWpvcicpO1xyXG4gICAgICAgIE1vZGFsLm1ham9yV3JhcHBlci5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldCAmJiAhZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2RhbC13cmFwcGVyX21ham9yJykpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKE1vZGFsLm1ham9yQWN0aXZlKVxyXG4gICAgICAgICAgICAgICAgTW9kYWwubWFqb3JRdWV1ZVswXS5kZWFjdGl2YXRlKCk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufTtcclxuXHJcbk1vZGFsLnJlbmRlckJhY2tkcm9wID0gZnVuY3Rpb24gKHR5cGUpIHtcclxuICAgIGxldCBiYWNrZHJvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xyXG4gICAgYmFja2Ryb3AuY2xhc3NOYW1lID0gJ2JhY2tkcm9wIGJhY2tkcm9wX2ludmlzaWJsZSc7XHJcbiAgICBiYWNrZHJvcC5jbGFzc0xpc3QuYWRkKGBiYWNrZHJvcF8ke3R5cGV9YCk7XHJcbiAgICBiYWNrZHJvcC5pZCA9IGBiYWNrZHJvcC0ke3R5cGV9YDtcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYmFja2Ryb3ApO1xyXG4gICAgcmV0dXJuIGJhY2tkcm9wO1xyXG59O1xyXG5cclxuTW9kYWwucmVuZGVyV3JhcHBlciA9IGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICBsZXQgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xyXG4gICAgd3JhcHBlci5jbGFzc05hbWUgPSAnbW9kYWwtd3JhcHBlciBtb2RhbC13cmFwcGVyX2ludmlzaWJsZSc7XHJcbiAgICB3cmFwcGVyLmNsYXNzTGlzdC5hZGQoYG1vZGFsLXdyYXBwZXJfJHt0eXBlfWApO1xyXG4gICAgd3JhcHBlci5pZCA9IGBtb2RhbC13cmFwcGVyLSR7dHlwZX1gO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcclxuICAgIHJldHVybiB3cmFwcGVyO1xyXG59O1xyXG5cclxuTW9kYWwucHJvdG90eXBlLnJlbmRlcldpbmRvdyA9IGZ1bmN0aW9uIChodG1sKSB7XHJcblxyXG4gICAgbGV0IHBhcmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xyXG4gICAgcGFyZW50LmlubmVySFRNTCA9IGh0bWw7XHJcbiAgICBsZXQgd25kID0gcGFyZW50LmZpcnN0RWxlbWVudENoaWxkO1xyXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUilcclxuICAgICAgICBNb2RhbC5taW5vcldyYXBwZXIuYXBwZW5kQ2hpbGQod25kKTtcclxuICAgIGVsc2VcclxuICAgICAgICBNb2RhbC5tYWpvcldyYXBwZXIuYXBwZW5kQ2hpbGQod25kKTtcclxuXHJcbiAgICBwYXJlbnQucmVtb3ZlKCk7XHJcbiAgICByZXR1cm4gd25kO1xyXG59O1xyXG5cclxuTW9kYWwucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5zdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKSB7XHJcbiAgICAgICAgaWYgKCFNb2RhbC5taW5vckJhY2tkcm9wKVxyXG4gICAgICAgICAgICBNb2RhbC5zZXRCYWNrZHJvcChNb2RhbC5zdGF0dXNlcy5NSU5PUik7XHJcblxyXG4gICAgICAgIGlmICghTW9kYWwubWlub3JXcmFwcGVyKVxyXG4gICAgICAgICAgICBNb2RhbC5zZXRXcmFwcGVyKE1vZGFsLnN0YXR1c2VzLk1JTk9SKTtcclxuXHJcbiAgICAgICAgTW9kYWwubWlub3JXcmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLXdyYXBwZXJfaW52aXNpYmxlJyk7XHJcbiAgICAgICAgTW9kYWwubWlub3JCYWNrZHJvcC5jbGFzc0xpc3QucmVtb3ZlKCdiYWNrZHJvcF9pbnZpc2libGUnKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICghTW9kYWwubWFqb3JCYWNrZHJvcClcclxuICAgICAgICAgICAgTW9kYWwuc2V0QmFja2Ryb3AoTW9kYWwuc3RhdHVzZXMuTUFKT1IpO1xyXG5cclxuICAgICAgICBpZiAoIU1vZGFsLm1ham9yV3JhcHBlcilcclxuICAgICAgICAgICAgTW9kYWwuc2V0V3JhcHBlcihNb2RhbC5zdGF0dXNlcy5NQUpPUik7XHJcblxyXG4gICAgICAgIE1vZGFsLm1ham9yV3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC13cmFwcGVyX2ludmlzaWJsZScpO1xyXG4gICAgICAgIE1vZGFsLm1ham9yQmFja2Ryb3AuY2xhc3NMaXN0LnJlbW92ZSgnYmFja2Ryb3BfaW52aXNpYmxlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xyXG5cclxufTtcclxuXHJcblxyXG5Nb2RhbC5wcm90b3R5cGUuYWN0aXZhdGUgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgIGlmICh0aGlzLmVsZW1JZCA9PT0gJ3NwaW5uZXInKSB7XHJcbiAgICAgICAgbGV0IHNwaW5uZXIgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMub24oJ3NwaW5uZXJfaG9zdC1sb2FkZWQnLCBlID0+IHtcclxuICAgICAgICAgICAgbGV0IG5ld0hvc3QgPSBlLmRldGFpbC5ob3N0O1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUilcclxuICAgICAgICAgICAgICAgIE1vZGFsLm1pbm9yUXVldWUuc3BsaWNlKE1vZGFsLm1pbm9yUXVldWUuaW5kZXhPZihzcGlubmVyKSArIDEsIDAsIG5ld0hvc3QpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBNb2RhbC5tYWpvclF1ZXVlLnNwbGljZShNb2RhbC5tYWpvclF1ZXVlLmluZGV4T2Yoc3Bpbm5lcikgKyAxLCAwLCBuZXdIb3N0KTtcclxuXHJcbiAgICAgICAgICAgIHNwaW5uZXIuZGVhY3RpdmF0ZShlLmRldGFpbC5vcHRpb25zKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpIHtcclxuICAgICAgICAgICAgTW9kYWwubWlub3JRdWV1ZS5wdXNoKHRoaXMpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhNb2RhbC5taW5vclF1ZXVlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coTW9kYWwubWFqb3JRdWV1ZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIU1vZGFsLm1pbm9yQWN0aXZlKVxyXG4gICAgICAgICAgICAgICAgTW9kYWwubWlub3JTaG93KG9wdGlvbnMpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBNb2RhbC5tYWpvclF1ZXVlLnB1c2godGhpcyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKE1vZGFsLm1pbm9yUXVldWUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhNb2RhbC5tYWpvclF1ZXVlKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghTW9kYWwubWFqb3JBY3RpdmUpXHJcblxyXG4gICAgICAgICAgICAgICAgTW9kYWwubWFqb3JTaG93KG9wdGlvbnMpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5Nb2RhbC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpIHtcclxuICAgICAgICAvL1RPRE8gbm90IG5lY2Nlc3NhcnkgaWYgcXVldWUgaXMgbm90IGVtcHR5XHJcbiAgICAgICAgTW9kYWwubWlub3JXcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ21vZGFsLXdyYXBwZXJfaW52aXNpYmxlJyk7XHJcbiAgICAgICAgTW9kYWwubWlub3JCYWNrZHJvcC5jbGFzc0xpc3QuYWRkKCdiYWNrZHJvcF9pbnZpc2libGUnKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIE1vZGFsLm1ham9yV3JhcHBlci5jbGFzc0xpc3QuYWRkKCdtb2RhbC13cmFwcGVyX2ludmlzaWJsZScpO1xyXG4gICAgICAgIE1vZGFsLm1ham9yQmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgnYmFja2Ryb3BfaW52aXNpYmxlJyk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuTW9kYWwucHJvdG90eXBlLmRlYWN0aXZhdGUgPSBmdW5jdGlvbiAobmV4dFdpbmRvd09wdGlvbnMsIGhpZGVPcHRpb25zKSB7XHJcblxyXG4gICAgdGhpcy5oaWRlKGhpZGVPcHRpb25zKTtcclxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XHJcbiAgICBpZiAodGhpcy5zdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKSB7XHJcbiAgICAgICAgTW9kYWwubWlub3JBY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICBNb2RhbC5taW5vclF1ZXVlLnNoaWZ0KCk7XHJcbiAgICAgICAgTW9kYWwubWlub3JTaG93KG5leHRXaW5kb3dPcHRpb25zKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgTW9kYWwubWFqb3JBY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICBNb2RhbC5tYWpvclF1ZXVlLnNoaWZ0KCk7XHJcbiAgICAgICAgTW9kYWwubWFqb3JTaG93KG5leHRXaW5kb3dPcHRpb25zKTtcclxuICAgIH1cclxuICAgIHRoaXMudHJpZ2dlcignbW9kYWwtd2luZG93X2RlYWN0aXZhdGVkJyk7XHJcbn07XHJcblxyXG5Nb2RhbC5taW5vckFjdGl2ZSA9IGZhbHNlO1xyXG5Nb2RhbC5tYWpvckFjdGl2ZSA9IGZhbHNlO1xyXG5Nb2RhbC5taW5vclF1ZXVlID0gW107XHJcbk1vZGFsLm1ham9yUXVldWUgPSBbXTtcclxuXHJcbk1vZGFsLnNwaW5uZXIgPSBuZXcgU3Bpbm5lcigpO1xyXG5Nb2RhbC5zcGlubmVyLnN0YXR1cyA9IE1vZGFsLnN0YXR1c2VzLk1BSk9SO1xyXG5cclxuTW9kYWwuc2hvd1NwaW5uZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBNb2RhbC5wcm90b3R5cGUuc2hvdy5jYWxsKE1vZGFsLnNwaW5uZXIpO1xyXG5cclxuICAgIGlmICghTW9kYWwuc3Bpbm5lci5lbGVtKVxyXG4gICAgICAgIE1vZGFsLnNwaW5uZXIuZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGlubmVyJyk7XHJcbiAgICBpZiAoIU1vZGFsLnNwaW5uZXIuZWxlbSlcclxuICAgICAgICBNb2RhbC5zcGlubmVyLmVsZW0gPSBNb2RhbC5wcm90b3R5cGUucmVuZGVyV2luZG93LmNhbGwoTW9kYWwuc3Bpbm5lciwgU3Bpbm5lci5odG1sKTtcclxuXHJcbiAgICBNb2RhbC5zcGlubmVyLnNob3coKTtcclxufTtcclxuXHJcbk1vZGFsLmhpZGVTcGlubmVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgTW9kYWwuc3Bpbm5lci5oaWRlKCk7XHJcbn07XHJcblxyXG5cclxuTW9kYWwubWlub3JTaG93ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIGxldCBuZXh0TW9kYWxXaW5kb3cgPSBNb2RhbC5taW5vclF1ZXVlWzBdO1xyXG4gICAgaWYgKG5leHRNb2RhbFdpbmRvdykge1xyXG4gICAgICAgIGxldCBwcm9taXNlID0gbmV4dE1vZGFsV2luZG93LnNob3cob3B0aW9ucyk7XHJcbiAgICAgICAgaWYgKHByb21pc2UpXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgTW9kYWwubWlub3JBY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgTW9kYWwubWlub3JBY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgTW9kYWwubWlub3JBY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5Nb2RhbC5tYWpvclNob3cgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgIGxldCBuZXh0TW9kYWxXaW5kb3cgPSBNb2RhbC5tYWpvclF1ZXVlWzBdO1xyXG5cclxuICAgIGlmIChuZXh0TW9kYWxXaW5kb3cpIHtcclxuXHJcbiAgICAgICAgTW9kYWwuc2hvd1NwaW5uZXIoKTtcclxuICAgICAgICBsZXQgcHJvbWlzZSA9IG5leHRNb2RhbFdpbmRvdy5zaG93KG9wdGlvbnMpO1xyXG5cclxuICAgICAgICBpZiAocHJvbWlzZSlcclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2UudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBNb2RhbC5tYWpvckFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBNb2RhbC5oaWRlU3Bpbm5lcigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgTW9kYWwubWFqb3JBY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICBNb2RhbC5oaWRlU3Bpbm5lcigpO1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgTW9kYWwubWFqb3JBY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5mb3IgKGxldCBrZXkgaW4gZXZlbnRNaXhpbilcclxuICAgIE1vZGFsLnByb3RvdHlwZVtrZXldID0gZXZlbnRNaXhpbltrZXldO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTW9kYWw7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvbW9kYWwvaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcblx0b246IGZ1bmN0aW9uKGV2ZW50TmFtZSwgY2IpIHtcclxuXHRcdGlmICh0aGlzLmVsZW0pXHJcblx0XHRcdHRoaXMuZWxlbS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2IpO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHR0aGlzLmxpc3RlbmVycy5wdXNoKHtcclxuXHRcdFx0XHRldmVudE5hbWUsXHJcblx0XHRcdFx0Y2JcclxuXHRcdFx0fSk7XHJcblx0fSxcclxuXHJcblx0dHJpZ2dlcjogZnVuY3Rpb24oZXZlbnROYW1lLCBkZXRhaWwpIHtcclxuXHRcdHRoaXMuZWxlbS5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChldmVudE5hbWUsIHtcclxuXHRcdFx0YnViYmxlczogdHJ1ZSxcclxuXHRcdFx0Y2FuY2VsYWJsZTogdHJ1ZSxcclxuXHRcdFx0ZGV0YWlsOiBkZXRhaWxcclxuXHRcdH0pKTtcclxuXHR9LFxyXG5cclxuXHRlcnJvcjogZnVuY3Rpb24oZXJyKSB7XHJcblx0XHR0aGlzLmVsZW0uZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2Vycm9yJywge1xyXG5cdFx0XHRidWJibGVzOiB0cnVlLFxyXG5cdFx0XHRjYW5jZWxhYmxlOiB0cnVlLFxyXG5cdFx0XHRkZXRhaWw6IGVyclxyXG5cdFx0fSkpO1xyXG5cdH1cclxuXHJcblxyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvZXZlbnRNaXhpbi5qcyIsImxldCBTcGlubmVyID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGlubmVyJyk7XHJcbn07XHJcblxyXG5TcGlubmVyLmh0bWwgPSByZXF1aXJlKGBodG1sLWxvYWRlciEuL21hcmt1cGApO1xyXG5cclxuU3Bpbm5lci5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdzcGlubmVyX2ludmlzaWJsZScpO1xyXG59O1xyXG5cclxuU3Bpbm5lci5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdzcGlubmVyX2ludmlzaWJsZScpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTcGlubmVyO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3Mvc3Bpbm5lci9pbmRleC5qcyIsIm1vZHVsZS5leHBvcnRzID0gXCI8ZGl2IGlkPVxcXCJzcGlubmVyXFxcIiBjbGFzcz1cXFwic3Bpbm5lclxcXCI+XFxyXFxuXFxyXFxuPC9kaXY+XCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL34vaHRtbC1sb2FkZXIhLi4vYmxvY2tzL3NwaW5uZXIvbWFya3VwXG4vLyBtb2R1bGUgaWQgPSAyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDEgMiA4IDkgMTAiLCJsZXQgRHJvcGRvd24gPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgIHRoaXMuZWxlbSA9IG9wdGlvbnMuZWxlbTtcclxuICAgIHRoaXMuaXRlbUxpc3QgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmRyb3Bkb3duX19pdGVtLWxpc3QnKTtcclxuICAgIHRoaXMuY2xhc3NOYW1lID0gb3B0aW9ucy5jbGFzc05hbWU7XHJcblxyXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuXHJcbiAgICAvLyB0aGlzLmVsZW0ub25jbGljayA9IGUgPT4ge1xyXG4gICAgLy8gICAgIHRoaXMudG9nZ2xlKCk7XHJcbiAgICAvLyB9O1xyXG5cclxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLml0ZW1MaXN0LmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5lbGVtLmNvbnRhaW5zKGUudGFyZ2V0KSlcclxuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlKCk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuYWN0aXZlKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sIGZhbHNlKTtcclxuXHJcblxyXG4gICAgdGhpcy5BRUhhbmRsZXIgPSB0aGlzLkFFSGFuZGxlci5iaW5kKHRoaXMpO1xyXG5cclxufTtcclxuXHJcbkRyb3Bkb3duLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3Bkb3duX2ludmlzaWJsZScpO1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoYCR7dGhpcy5jbGFzc05hbWV9X2FjdGl2ZWApO1xyXG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xyXG59O1xyXG5cclxuRHJvcGRvd24ucHJvdG90eXBlLmRlYWN0aXZhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLml0ZW1MaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbmVuZCcsIHRoaXMuQUVIYW5kbGVyLCBmYWxzZSk7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnZHJvcGRvd25fZmFkaW5nLW91dCcpO1xyXG59O1xyXG5cclxuRHJvcGRvd24ucHJvdG90eXBlLkFFSGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdkcm9wZG93bl9mYWRpbmctb3V0Jyk7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnZHJvcGRvd25faW52aXNpYmxlJyk7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZShgJHt0aGlzLmNsYXNzTmFtZX1fYWN0aXZlYCk7XHJcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5pdGVtTGlzdC5yZW1vdmVFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCB0aGlzLkFFSGFuZGxlcik7XHJcbn07XHJcblxyXG5Ecm9wZG93bi5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuYWN0aXZlKVxyXG4gICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHRoaXMuc2hvdygpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEcm9wZG93bjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL2Ryb3Bkb3duL2luZGV4LmpzIiwibGV0IGV2ZW50TWl4aW4gPSByZXF1aXJlKExJQlMgKyAnZXZlbnRNaXhpbicpO1xyXG5sZXQgTW9kYWwgPSByZXF1aXJlKEJMT0NLUyArICdtb2RhbCcpO1xyXG5sZXQgU3Bpbm5lciA9IHJlcXVpcmUoQkxPQ0tTICsgJ3NwaW5uZXInKTtcclxuXHJcbmxldCBNb2RhbFNwaW5uZXIgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgU3Bpbm5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgTW9kYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgIHRoaXMuZWxlbUlkID0gJ3NwaW5uZXInO1xyXG4gICAgdGhpcy5ob3N0ID0gbnVsbDtcclxuXHJcbn07XHJcbk1vZGFsU3Bpbm5lci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKE1vZGFsLnByb3RvdHlwZSk7XHJcbk1vZGFsU3Bpbm5lci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBNb2RhbFNwaW5uZXI7XHJcblxyXG5mb3IgKGxldCBrZXkgaW4gU3Bpbm5lci5wcm90b3R5cGUpXHJcbiAgICBNb2RhbFNwaW5uZXIucHJvdG90eXBlW2tleV0gPSBTcGlubmVyLnByb3RvdHlwZVtrZXldO1xyXG5cclxuXHJcbk1vZGFsU3Bpbm5lci5wcm90b3R5cGUuc2V0RWxlbSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKCF0aGlzLmVsZW0pXHJcbiAgICAgICAgdGhpcy5lbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwaW5uZXInKTtcclxuICAgIGlmICghdGhpcy5lbGVtKVxyXG4gICAgICAgIHRoaXMuZWxlbSA9IHRoaXMucmVuZGVyV2luZG93KFNwaW5uZXIuaHRtbCk7XHJcblxyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ21vZGFsJywgJ21vZGFsLXNwaW5uZXInKTtcclxufTtcclxuXHJcbk1vZGFsU3Bpbm5lci5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIE1vZGFsLnByb3RvdHlwZS5zaG93LmFwcGx5KHRoaXMpO1xyXG5cclxuICAgIGlmICghdGhpcy5lbGVtKVxyXG4gICAgICAgIHRoaXMuc2V0RWxlbSgpO1xyXG5cclxuICAgIHRoaXMuc2V0TGlzdGVuZXJzKCk7XHJcblxyXG4gICAgU3Bpbm5lci5wcm90b3R5cGUuc2hvdy5hcHBseSh0aGlzKTtcclxufTtcclxuXHJcbk1vZGFsU3Bpbm5lci5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIE1vZGFsLnByb3RvdHlwZS5oaWRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICBTcGlubmVyLnByb3RvdHlwZS5oaWRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn07XHJcblxyXG5cclxuTW9kYWxTcGlubmVyLnByb3RvdHlwZS5kZWFjdGl2YXRlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIE1vZGFsLnByb3RvdHlwZS5kZWFjdGl2YXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn07XHJcblxyXG5Nb2RhbFNwaW5uZXIucHJvdG90eXBlLm9uSG9zdExvYWRlZCA9IGZ1bmN0aW9uIChob3N0LCBvcHRpb25zKSB7XHJcbiAgICB0aGlzLnRyaWdnZXIoJ3NwaW5uZXJfaG9zdC1sb2FkZWQnLCB7XHJcbiAgICAgICAgaG9zdCxcclxuICAgICAgICBvcHRpb25zXHJcbiAgICB9KTtcclxufTtcclxuXHJcblxyXG5cclxuZm9yIChsZXQga2V5IGluIGV2ZW50TWl4aW4pXHJcbiAgICBNb2RhbFNwaW5uZXIucHJvdG90eXBlW2tleV0gPSBldmVudE1peGluW2tleV07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGFsU3Bpbm5lcjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL21vZGFsLXNwaW5uZXIvaW5kZXguanMiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdXNlci9zdHlsZS5sZXNzXG4vLyBtb2R1bGUgaWQgPSA1NFxuLy8gbW9kdWxlIGNodW5rcyA9IDEwIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUlBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDOUhBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7OztBQUVBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUdBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7Ozs7Ozs7OztBQ3RRQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNiQTs7Ozs7Ozs7O0FDQUE7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7Ozs7Ozs7Ozs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFJQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUFBOzs7Ozs7O0FDMURBOzs7OyIsInNvdXJjZVJvb3QiOiIifQ==