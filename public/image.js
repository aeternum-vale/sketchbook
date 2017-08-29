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
/******/ 		8:0,
/******/ 		3:0,
/******/ 		13:0
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

	__webpack_require__(43);

	var GlobalErrorHandler = __webpack_require__(14);
	var globalErrorHandler = new GlobalErrorHandler();

	var Gallery = __webpack_require__(30);
	var gallery = new Gallery({
		elem: document.getElementById('image'),
		isLogged: window.isLogged,
		preloadEntityCount: (1)
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
/* 16 */,
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
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
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
/* 28 */,
/* 29 */,
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var eventMixin = __webpack_require__(18);
	var ClientError = __webpack_require__(15).ClientError;
	var ImageNotFound = __webpack_require__(15).ImageNotFound;
	var Modal = __webpack_require__(17);
	var SwitchButton = __webpack_require__(31);
	var getCorrectNounForm = __webpack_require__(32);

	var Gallery = function Gallery(options) {
	    var _this = this;

	    Modal.apply(this, arguments);
	    this.status = Modal.statuses.MAJOR;

	    this.gallery = options.gallery;
	    this.elem = options.elem;
	    this.isLogged = options.isLogged;
	    this.preloadEntityCount = options.preloadEntityCount;
	    this.isFeed = options.isFeed || false;
	    this.userSubscribeButton = options.userSubscribeButton;

	    this.viewModels = {};
	    this.galleryArray = null;
	    this.currentImageId = null;

	    this.loggedUserViewModel = null;
	    this.isEmbedded = !!this.gallery;
	    this.preloadedImages = {};

	    Object.defineProperty(this, 'currentViewModel', {
	        get: function get() {
	            return _this.viewModels[_this.currentImageId];
	        }
	    });

	    for (var i = 1; i <= this.preloadEntityCount; i++) {
	        this.preloadedImages[i] = new Image();
	        this.preloadedImages[-i] = new Image();
	    }

	    window.addEventListener('popstate', function (e) {
	        _this.onPopState(e.state);
	    }, false);

	    window.addEventListener('resize', function (e) {
	        _this.onResize();
	    });

	    this.pushGalleryState();

	    if (this.isEmbedded) this.setGallery(options);else this.show(+this.elem.dataset.id)['catch'](function (err) {
	        _this.error(err);
	    });
	};

	Gallery.prototype = Object.create(Modal.prototype);
	Gallery.prototype.constructor = Gallery;

	Gallery.prototype.onResize = function () {
	    // const GLOBAL_SMALL_SCREEN_WIDTH = 700;
	    // if (document.documentElement.clientWidth <= GLOBAL_SMALL_SCREEN_WIDTH)
	    //     this.elem.classList.add('image_small');
	    // else
	    //     this.elem.classList.remove('image_small');
	    //
	    // this.resizeImage();
	    this.commentSection && this.commentSection.update();
	};

	Gallery.prototype.onGalleryClick = function (e) {
	    var target = undefined;
	    if (!(target = e.target.closest('.image-preview'))) return;

	    e.preventDefault();
	    var imageId = +target.dataset.id;

	    return this.activate({ imageId: imageId });
	};

	Gallery.prototype.setGallery = function (options) {
	    var _this2 = this;

	    this.publicationsStatElem = options.publicationsStatElem;
	    this.imagePreviewGhost = this.gallery.querySelector('.image-preview');
	    this.galleryWrapper = this.gallery.querySelector('.gallery__wrapper');

	    this.gallery.onclick = function (e) {
	        _this2.onGalleryClick(e);
	    };
	};

	//TODO ALERT IF IT DOESN'T ABLE TO DOWNLOAD MODAL MESSAGE WINDOW

	Gallery.prototype.setElem = function () {
	    var _this3 = this;

	    return new Promise(function (resolve, reject) {

	        _this3.isElemSetted = true;

	        if (!_this3.elem) _this3.elem = _this3.renderWindow(__webpack_require__(33));

	        _this3.imgElem = _this3.elem.querySelector('img.image__img-element');
	        _this3.description = _this3.elem.querySelector('.image__description');
	        _this3.date = _this3.elem.querySelector('.image__post-date');
	        _this3.imageWrapper = _this3.elem.querySelector('.image__image-wrapper');
	        _this3.sideBar = _this3.elem.querySelector('.image__sidebar');
	        _this3.deleteButtonElem = _this3.elem.querySelector('.image__delete-button');
	        _this3.subscribeButtonElem = _this3.elem.querySelector('.image__subscribe-button');
	        _this3.avatar = _this3.elem.querySelector('.image__avatar');
	        _this3.username = _this3.elem.querySelector('.image__username');
	        _this3.headerLeftSide = _this3.elem.querySelector('.image__header-left-side');
	        _this3.fullscreenButton = _this3.elem.querySelector('.image__control-full');

	        _this3.imgElem.onload = function (e) {
	            _this3.resizeImage();
	            _this3.showImgElem();
	        };

	        _this3.elem.onclick = function (e) {

	            _this3.onElemClick(e);

	            if (e.target.matches('.image__modal-close-button-wrapper')) _this3.deactivate();

	            if (e.target.matches('.image__control-prev')) _this3.switchToPrev();

	            if (e.target.matches('.image__control-next')) _this3.switchToNext();

	            if (e.target === _this3.fullscreenButton) _this3.switchFullscreen();

	            if (e.target.matches('.image__close-space') || e.target.matches('.image__close-button')) _this3.deactivate();
	        };

	        var CommentSection = __webpack_require__(34);
	        var LikeButton = __webpack_require__(36);

	        _this3.commentSection = new CommentSection({
	            elem: _this3.elem.querySelector('.comment-section'),
	            commentSenderElem: _this3.elem.querySelector('.comment-send'),
	            imageId: _this3.currentImageId,
	            loggedUserViewModel: _this3.loggedUserViewModel,

	            commentSectionWrapper: _this3.elem.querySelector('.image__comment-section-wrapper'),
	            infoBoard: _this3.elem.querySelector('.image__info-board'),
	            scrollbarWrapper: _this3.elem.querySelector('.image__comment-section-scrollbar-wrapper')
	        });

	        _this3.commentSection.on('comment-section_changed', function (e) {
	            var imageId = e.detail.imageId;
	            _this3.deleteViewModel(imageId);
	            _this3.requestViewModel(imageId).then(function () {
	                _this3.updateComments(imageId);
	            });
	        });

	        _this3.likeButton = new LikeButton({
	            elem: _this3.elem.querySelector('.like-button'),
	            data: _this3.currentImageId
	        });

	        _this3.likeButton.on('switch-button_changed', function (e) {
	            var imageId = e.detail.imageId;
	            _this3.deleteViewModel(imageId);
	            _this3.requestViewModel(imageId).then(function () {
	                _this3.updateLikes(imageId);
	            });
	        });

	        _this3.onResize();

	        if (_this3.isLogged) {
	            if (_this3.currentViewModel.isOwnImage) {
	                _this3.setDeleteButton();
	                __webpack_require__.e/* nsure */(4, function (require) {
	                    var DeleteImageButton = __webpack_require__(37);
	                    _this3.deleteButton = new DeleteImageButton({
	                        elem: _this3.deleteButtonElem,
	                        imageId: _this3.currentImageId
	                    });
	                    _this3.deleteButton.on('delete-image-button_image-deleted', function (e) {
	                        var involvedImageId = e.detail.imageId;
	                        _this3.deleteViewModel(involvedImageId);
	                        _this3.removeFromGalleryArray(involvedImageId);
	                        _this3.deleteImagePreview(involvedImageId);
	                        if (_this3.currentImageId === involvedImageId) _this3.switchToNext();
	                    });
	                    resolve();
	                });
	            } else {
	                __webpack_require__.e/* nsure */(5, function (require) {
	                    var SubscribeButton = __webpack_require__(40);
	                    _this3.subscribeButton = new SubscribeButton({
	                        elem: _this3.subscribeButtonElem,
	                        data: _this3.currentImageId
	                    });

	                    if (_this3.userSubscribeButton) SwitchButton.setRelation(_this3.subscribeButton, _this3.userSubscribeButton);

	                    _this3.subscribeButton.on('switch-button_changed', function (e) {
	                        var involvedImageId = e.detail.imageId;

	                        if (_this3.isFeed && involvedImageId === _this3.currentImageId) _this3.viewModels = {};
	                    });

	                    _this3.setSubscribeButton();
	                    _this3.subscribeButton.set({ active: _this3.currentViewModel.author.isNarrator });
	                    resolve();
	                });
	            }
	        } else {
	            _this3.subscribeButtonElem.onclick = function (e) {
	                _this3.error(new ClientError(null, null, 401));
	            };

	            resolve();
	        }
	    });
	};

	Gallery.prototype.switchFullscreen = function () {

	    function goFullscreen(element) {
	        if (element.requestFullscreen) {
	            element.requestFullscreen();
	        } else if (element.webkitRequestFullscreen) {
	            element.webkitRequestFullscreen();
	        } else if (element.mozRequestFullscreen) {
	            element.mozRequestFullscreen();
	        }
	    }

	    function cancelFullscreen() {
	        if (document.exitFullscreen) {
	            document.exitFullscreen();
	        } else if (document.webkitExitFullscreen) {
	            document.webkitExitFullscreen();
	        } else if (document.mozExitFullscreen) {
	            document.mozExitFullscreen();
	        }
	    }

	    if (!this.isFullscreen) {
	        goFullscreen(this.imageWrapper);
	        this.isFullscreen = true;
	        this.fullscreenButton.classList.remove('icon-arrow-maximise');
	        this.fullscreenButton.classList.add('icon-arrow-minimise');
	    } else {
	        cancelFullscreen();
	        this.isFullscreen = false;
	        this.fullscreenButton.classList.add('icon-arrow-maximise');
	        this.fullscreenButton.classList.remove('icon-arrow-minimise');
	    }
	};

	Gallery.prototype.setDeleteButton = function () {
	    this.deleteButtonElem.classList.remove('button_invisible');
	    this.subscribeButtonElem.classList.add('button_invisible');
	};

	Gallery.prototype.setSubscribeButton = function () {
	    this.subscribeButtonElem.classList.remove('button_invisible');
	    this.deleteButtonElem.classList.add('button_invisible');
	};

	Gallery.prototype.updatePreloadedImagesArray = function () {
	    for (var i = 1; i <= this.preloadEntityCount; i++) {
	        var nextId = this.getNextImageId(i);
	        var prevId = this.getNextImageId(-i);

	        if (this.viewModels[nextId]) this.preloadedImages[i].setAttribute('src', this.viewModels[nextId].imgUrl);
	        if (this.viewModels[prevId]) this.preloadedImages[-i].setAttribute('src', this.viewModels[prevId].imgUrl);
	    }
	};

	Gallery.prototype.show = function (options) {
	    var _this4 = this;

	    document.body.style.overflow = 'hidden'; // :\

	    var imageId = undefined;
	    var noPushState = undefined;

	    if (arguments.length === 1 && typeof arguments[0] === 'number') {
	        imageId = arguments[0];
	    } else {
	        imageId = options && options.imageId;
	        noPushState = options && options.noPushState || false;
	    }

	    return new Promise(function (resolve, reject) {

	        if (_this4.isEmbedded) Modal.prototype.show.apply(_this4);

	        _this4.requestViewModel(imageId).then(function () {
	            _this4.currentImageId = imageId;

	            if (!_this4.isElemSetted) _this4.setElem().then(function () {
	                _this4.updateCurrentView(imageId);

	                _this4.elem.classList.remove('image_invisible');
	                if (!noPushState && imageId === _this4.currentImageId) _this4.pushImageState();
	                resolve();
	                _this4.requestAllNecessaryViewModels().then(function () {
	                    _this4.updatePreloadedImagesArray();
	                });
	            });else {
	                _this4.updateCurrentView(imageId);

	                _this4.elem.classList.remove('image_invisible');
	                if (!noPushState && imageId === _this4.currentImageId) _this4.pushImageState();
	                resolve();
	                _this4.requestAllNecessaryViewModels().then(function () {
	                    _this4.updatePreloadedImagesArray();
	                });
	            }

	            _this4.onResize();
	        })['catch'](function (err) {
	            reject(err);
	        });
	    });
	};

	Gallery.prototype.hide = function (options) {

	    document.body.style.overflow = 'auto';

	    var noPushState = options && options.noPushState;
	    if (!this.isEmbedded) window.location = this.elem.dataset.authorUrl;else {
	        Modal.prototype.hide.apply(this);

	        this.elem.classList.add('image_invisible');

	        if (!noPushState) this.pushGalleryState();
	    }
	};

	Gallery.prototype.hideImgElem = function () {
	    this.elem.classList.add('image_img-element-invisible');
	};

	Gallery.prototype.showImgElem = function () {
	    this.elem.classList.remove('image_img-element-invisible');
	};

	Gallery.prototype.resizeImage = function () {
	    // if (this.elem) {
	    //
	    //     this.imgElem.removeAttribute('width');
	    //     this.imgElem.removeAttribute('height');
	    //
	    //     if (!this.elem.classList.contains('image_small')) {
	    //
	    //         if (this.imgElem.offsetWidth >= this.imgElem.offsetHeight) {
	    //             if (this.imageWrapper.offsetHeight < this.imgElem.offsetHeight)
	    //                 this.imgElem.height = this.imageWrapper.offsetHeight;
	    //
	    //             if (this.imageWrapper.offsetWidth > this.elem.offsetWidth) {
	    //                 this.imgElem.removeAttribute('height');
	    //                 this.imgElem.width = this.elem.offsetWidth - this.sideBar.offsetWidth;
	    //             }
	    //         } else {
	    //             if (this.imageWrapper.offsetWidth > this.elem.offsetWidth)
	    //                 this.imgElem.width = this.elem.offsetWidth - this.sideBar.offsetWidth;
	    //
	    //             if (this.imageWrapper.offsetHeight < this.imgElem.offsetHeight) {
	    //                 this.imgElem.removeAttribute('width');
	    //                 this.imgElem.height = this.imageWrapper.offsetHeight;
	    //             }
	    //         }
	    //     } else {
	    //         if (this.imageWrapper.offsetWidth > this.elem.offsetWidth) {
	    //             this.imgElem.removeAttribute('height');
	    //             this.imgElem.width = this.elem.offsetWidth;
	    //         }
	    //     }
	    //
	    //
	    // }
	};

	Gallery.prototype.requestViewModel = function (id) {
	    var _this5 = this;

	    return new Promise(function (resolve, reject) {

	        if (_this5.viewModels[id]) {
	            resolve();
	            return;
	        }

	        var body = {
	            id: id,
	            isFeed: _this5.isFeed
	        };

	        if (_this5.isLogged && !_this5.loggedUserViewModel) body.requireUserViewModel = true;

	        __webpack_require__(25)(body, 'POST', '/gallery', function (err, response) {
	            if (err) {
	                if (err instanceof ClientError) {
	                    if (_this5.galleryArray) {
	                        _this5.removeFromGalleryArray(id);
	                        _this5.updateGallery();
	                    }
	                    return reject(new ImageNotFound());
	                } else return _this5.error(err);
	            }

	            console.log(response);
	            _this5.galleryArray = response.gallery;
	            _this5.updateGallery();

	            if (_this5.isLogged && !_this5.loggedUserViewModel && response.loggedUserViewModel) _this5.loggedUserViewModel = response.loggedUserViewModel;

	            var provided = false;
	            for (var key in response.viewModels) {
	                if (key == id) provided = true;

	                _this5.viewModels[key] = response.viewModels[key];
	            }
	            if (provided) resolve(response);else {
	                if (_this5.galleryArray) {
	                    _this5.removeFromGalleryArray(id);
	                    _this5.updateGallery();
	                }
	                reject(new ImageNotFound());
	            }
	        });
	    });
	};

	Gallery.prototype.removeFromGalleryArray = function (id) {

	    this.galleryArray && ~this.galleryArray.indexOf(id) && this.galleryArray.splice(this.galleryArray.indexOf(id), 1);
	};

	Gallery.prototype.addToGalleryArray = function (id) {
	    this.galleryArray && this.galleryArray.push(id);
	};

	Gallery.prototype.updateGallery = function () {
	    if (this.galleryArray && this.gallery) {
	        var imagePreviews = this.gallery.querySelectorAll('.image-preview');
	        for (var i = 0; i < imagePreviews.length; i++) {
	            if (! ~this.galleryArray.indexOf(+imagePreviews[i].dataset.id)) imagePreviews[i].remove();
	        }
	        this.setPublicationNumber(this.galleryArray.length);
	    }
	};

	Gallery.prototype.getImagePreviewById = function (id) {
	    return this.gallery.querySelector('.image-preview[data-id="' + id + '"]');
	};

	Gallery.prototype.updateImagePreviewText = function (id) {
	    var likeAmount = this.viewModels[id].likes.length;
	    var commentAmount = this.viewModels[id].comments.length;
	    var previewImageElem = this.getImagePreviewById(id);
	    previewImageElem.dataset.likeAmount = likeAmount;
	    previewImageElem.dataset.commentAmount = commentAmount;

	    previewImageElem.querySelector('.image-preview__comment-number').textContent = commentAmount;
	    previewImageElem.querySelector('.image-preview__like-number').textContent = likeAmount;

	    previewImageElem.querySelector('.image-preview__comment-section .image-preview__designation-text').textContent = getCorrectNounForm('comment', commentAmount);
	    previewImageElem.querySelector('.image-preview__like-section .image-preview__designation-text').textContent = getCorrectNounForm('like', likeAmount);
	};

	Gallery.prototype.deleteImagePreview = function (id) {
	    var elem = this.getImagePreviewById(id);
	    if (elem) {
	        elem.remove();
	        this.setPublicationNumber(-1, true);
	    }
	};

	Gallery.prototype.insertNewImagePreview = function (imageId, previewUrl) {
	    var newImagePreview = this.imagePreviewGhost.cloneNode(true);
	    newImagePreview.classList.remove('image-preview_ghost');

	    newImagePreview.dataset.id = imageId;
	    newImagePreview.href = '/image/' + imageId;
	    newImagePreview.querySelector('.image-preview__picture').style.backgroundImage = 'url(\'/' + previewUrl + '\')';

	    newImagePreview.querySelector('.image-preview__comment-number').textContent = 0;
	    newImagePreview.querySelector('.image-preview__like-number').textContent = 0;

	    newImagePreview.querySelector('.image-preview__comment-section .image-preview__designation-text').textContent = 'comments';
	    newImagePreview.querySelector('.image-preview__like-section .image-preview__designation-text').textContent = 'likes';

	    newImagePreview.querySelector('.image-preview__upload-date-text').textContent = 'a few seconds ago';

	    this.galleryWrapper.appendChild(newImagePreview);

	    this.setPublicationNumber(1, true);
	    this.addToGalleryArray(imageId);
	};

	Gallery.prototype.setPublicationNumber = function (value, relative) {
	    if (this.publicationsStatElem) {
	        var publicationNumberElem = this.publicationsStatElem.querySelector('.stat__number');
	        var publicationTextElem = this.publicationsStatElem.querySelector('.stat__caption');
	        var newValue = relative && publicationNumberElem ? +publicationNumberElem.textContent + value : value;

	        publicationNumberElem.textContent = newValue;
	        publicationTextElem.textContent = getCorrectNounForm('publication', newValue);
	    }
	};

	Gallery.prototype.deleteViewModel = function (id) {
	    delete this.viewModels[id];
	    console.log('delete #' + id);
	};

	Gallery.prototype.requestAllNecessaryViewModels = function () {
	    return Promise.all([this.requestNextViewModels(), this.requestPrevViewModels()]);
	};

	Gallery.prototype.requestNextViewModels = function () {

	    if (this.galleryArray && this.galleryArray.length === 0) return Promise.reject(new ImageNotFound());

	    var promises = [];
	    for (var i = 0; i < this.preloadEntityCount; i++) {
	        promises.push(this.requestViewModel(this.getNextImageId(i)));
	    }return Promise.all(promises);
	};

	Gallery.prototype.requestPrevViewModels = function () {
	    if (this.galleryArray && this.galleryArray.length === 0) return Promise.reject(new ImageNotFound());
	    var promises = [];
	    for (var i = 0; i < this.preloadEntityCount; i++) {
	        promises.push(this.requestViewModel(this.getPrevImageId(i)));
	    }return Promise.all(promises);
	};

	Gallery.prototype.switchToNext = function () {
	    var _this6 = this;

	    if (this.galleryArray && !this.galleryArray.length) {
	        this.deactivate();
	        return;
	    }

	    var nextImageId = this.getNextImageId();
	    this.show(nextImageId)['catch'](function (err) {
	        if (err instanceof ImageNotFound) {
	            if (_this6.galleryArray && _this6.galleryArray.length) _this6.switchToNext();else _this6.deactivate();
	        } else _this6.error(err);
	    });
	};

	Gallery.prototype.switchToPrev = function () {
	    var _this7 = this;

	    if (this.galleryArray && !this.galleryArray.length) {
	        this.deactivate();
	        return;
	    }

	    var prevImageId = this.getPrevImageId();
	    this.show(prevImageId)['catch'](function (err) {
	        if (err instanceof ImageNotFound) {
	            if (_this7.galleryArray && _this7.galleryArray.length) _this7.switchToPrev();else _this7.deactivate();
	        } else _this7.error(err);
	    });
	};

	Gallery.prototype.getNextImageId = function (offset) {
	    offset = offset || 1;
	    var index = this.galleryArray.indexOf(this.currentImageId);

	    return this.galleryArray[(index + offset) % this.galleryArray.length];
	};

	Gallery.prototype.getPrevImageId = function (offset) {
	    offset = offset || 1;

	    var index = this.galleryArray.indexOf(this.currentImageId);

	    if (~index && this.galleryArray.length === 1) return this.galleryArray[0];

	    var galleryPrevIndex = index - offset;
	    if (galleryPrevIndex < 0) {
	        galleryPrevIndex %= this.galleryArray.length;
	        galleryPrevIndex = this.galleryArray.length + galleryPrevIndex;
	    }

	    return this.galleryArray[galleryPrevIndex];
	};

	Gallery.prototype.updateCurrentView = function (involvedImageId) {

	    if (involvedImageId === this.currentImageId) {
	        this.hideImgElem();

	        this.imgElem.setAttribute('src', this.currentViewModel.imgUrl);

	        this.likeButton.setImageId(this.currentImageId);
	        this.updateLikes(this.currentImageId);

	        this.commentSection.setImageId(this.currentImageId);
	        this.updateComments(this.currentImageId);

	        this.description.textContent = this.currentViewModel.description;
	        if (this.description.textContent === '') this.elem.classList.add('image_no-description');else this.elem.classList.remove('image_no-description');

	        this.date.textContent = this.currentViewModel.createDateStr;

	        if (this.isLogged) if (this.currentViewModel.isOwnImage) this.deleteButton.setImageId(this.currentImageId);else this.subscribeButton.setImageId(this.currentImageId);

	        if (this.isFeed) this.subscribeButton.set({ active: true });

	        this.avatar.style.backgroundImage = 'url(\'' + this.currentViewModel.author.avatarUrls.medium + '\')';
	        this.username.textContent = this.currentViewModel.author.username;

	        this.headerLeftSide.setAttribute('href', this.currentViewModel.author.url);
	    }
	};

	Gallery.prototype.updateLikes = function (imageId) {
	    if (this.currentImageId === imageId) this.likeButton.set({
	        active: this.currentViewModel.isLiked,
	        likeAmount: this.currentViewModel.likes.length
	    });
	    if (this.gallery) this.updateImagePreviewText(imageId);
	};

	Gallery.prototype.updateComments = function (imageId) {
	    if (this.currentImageId === imageId) this.commentSection.set(this.currentViewModel.comments);
	    if (this.gallery) this.updateImagePreviewText(imageId);
	};

	Gallery.prototype.pushImageState = function () {
	    history.pushState({
	        type: 'image',
	        id: this.currentImageId
	    }, 'image #' + this.currentImageId, '/image/' + this.currentImageId);
	};

	Gallery.prototype.pushGalleryState = function () {

	    var url = '';
	    if (!this.isFeed) url = this.currentViewModel && this.currentViewModel.author.url;else url = '/feed';

	    history.pushState({
	        type: 'gallery'
	    }, '', url);
	};

	Gallery.prototype.onPopState = function (state) {

	    if (state && state.type) switch (state.type) {
	        case 'image':
	            this.show({
	                imageId: state.id,
	                noPushState: true
	            });
	            break;

	        case 'gallery':
	            this.deactivate(null, {
	                noPushState: true
	            });
	            break;
	    }
	};

	for (var key in eventMixin) {
	    Gallery.prototype[key] = eventMixin[key];
		}module.exports = Gallery;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var eventMixin = __webpack_require__(18);

	var SwitchButton = function SwitchButton(options) {
	    var _this = this;

	    this.elem = options.elem;
	    this.data = options.data;
	    this.dataStr = options.dataStr || 'imageId';

	    this.textElem = options.textElem || this.elem;

	    SwitchButton.prototype.set.call(this, { active: !!this.elem.dataset.active });
	    this.available = true;

	    this.elem.onclick = function (e) {
	        return _this.onClick(e);
	    };
	};

	SwitchButton.prototype.onClick = function (e) {
	    var _this2 = this;

	    var involvedData = this.data;

	    if (this.available) {

	        this.available = false;
	        this.toggle();

	        __webpack_require__(25)(_defineProperty({}, this.dataStr, involvedData), 'POST', this.url, function (err, response) {

	            if (!err) {
	                var _trigger;

	                _this2.set(response);
	                _this2.available = true;
	                _this2.trigger('switch-button_changed', (_trigger = {}, _defineProperty(_trigger, _this2.dataStr, involvedData), _defineProperty(_trigger, 'response', response), _trigger));
	            } else {
	                _this2.error(err);

	                if (_this2.data === involvedData) {
	                    _this2.available = true;
	                    _this2.toggle();
	                }
	            }
	        });
	    }
	};

	SwitchButton.setRelation = function (switchButton1, switchButton2) {
	    switchButton1.on('switch-button_changed', function (e) {
	        switchButton2.set(e.detail.response);
	    });

	    switchButton2.on('switch-button_changed', function (e) {
	        switchButton1.set(e.detail.response);
	    });
	};

	SwitchButton.prototype.set = function (options) {
	    if (options.active) this._activate();else this._deactivate();
	};

	SwitchButton.prototype.toggle = function () {
	    if (this.active) this.set({ active: false });else this.set({ active: true });
	};

	SwitchButton.prototype._activate = function () {
	    this.elem.classList.add('button_active');
	    this.active = true;

	    this.textElem && this.activeText && (this.textElem.textContent = this.activeText);
	};

	SwitchButton.prototype._deactivate = function () {
	    this.elem.classList.remove('button_active');
	    this.active = false;

	    this.textElem && this.inactiveText && (this.textElem.textContent = this.inactiveText);
	};

	SwitchButton.prototype.setImageId = function (imageId) {
	    this.data = imageId;
	};

	for (var key in eventMixin) {
	    SwitchButton.prototype[key] = eventMixin[key];
		}module.exports = SwitchButton;

/***/ }),
/* 32 */
/***/ (function(module, exports) {

	'use strict';

	var getCorrectNounForm = function getCorrectNounForm(singleForm, amount) {
	    return singleForm + (amount === 1 ? '' : 's');
	};

	module.exports = getCorrectNounForm;

/***/ }),
/* 33 */
/***/ (function(module, exports) {

	module.exports = "<div id=\"image\" class=\"modal image_img-element-invisible image image_no-description\">\r\n    <div class=\"image__image-wrapper\">\r\n        <div id=\"spinner\" class=\"spinner image__spinner\">\r\n        \r\n        </div>        <img class=\"image__img-element\">\r\n        <div class=\"image__controls\">\r\n            <div class=\"image__control image__control-prev icon-arrow-left\"></div>\r\n            <div class=\"image__control image__control-full icon-arrow-maximise\"></div>\r\n            <div class=\"image__control image__control-next icon-arrow-right\"></div>\r\n        </div>\r\n    </div>\r\n    <div class=\"image__sidebar\">\r\n        <div class=\"image__top-side\">\r\n            <div class=\"header image__header\">\r\n                <a class=\"image__header-left-side\" href=\"\">\r\n                    <div class=\"image__avatar\"\r\n                         style=\"background-image: url('')\"></div>\r\n                    <div class=\"image__metadata\">\r\n                        <div class=\"image__username\"></div>\r\n                        <div class=\"image__post-date\"></div>\r\n                    </div>\r\n                </a>\r\n\r\n                <div class=\"button button_invisible image__top-side-button image__delete-button button_header-style\">\r\n                    delete\r\n                </div>\r\n                <div\r\n                    class=\"button image__top-side-button image__subscribe-button button_header-style\"\r\n                >\r\n                    subscribe\r\n                </div>\r\n            </div>\r\n\r\n\r\n            <div class=\"image__info-board\">\r\n\r\n                <div\r\n                \r\n                     class=\"button like-button image__like-button\">\r\n                    <div class=\"like-button__heart icon-heart\"></div>\r\n                    <div class=\"like-button__heart icon-heart-outlined\"></div>\r\n                    &nbsp;like&nbsp;\r\n                    <span class=\"like-button__like-amount\"></span>\r\n                </div>\r\n                <div class=\"image__description\">\r\n                    \r\n                </div>\r\n\r\n            </div>\r\n\r\n\r\n            <div class=\"image__comment-section-wrapper image_no-scrollbar\">\r\n                <div class=\"comment-section image__comment-section\">\r\n                    <div class=\"comment-section__no-comments-block\">\r\n                        There are no comments yet\r\n                    </div>\r\n                    <div class=\"comment-section__comments-wrapper\">\r\n\r\n                            <div class=\"panel comment comment-section__comment comment_ghost\" data-id=\"\">\r\n                                <div class=\"comment__top-side\">\r\n                                    <a class=\"comment__ref\" href=\"\">\r\n                                        <div class=\"comment__avatar\" style=\"background-image: url('')\"></div>\r\n                                        <div class=\"comment__metadata\">\r\n                                            <div class=\"comment__username\"></div>\r\n                                            <div class=\"comment__date\"></div>\r\n                                        </div>\r\n                                    </a>\r\n                                    <div class=\"comment__close-button icon-cross\"></div>\r\n                                </div>\r\n                                <div class=\"comment__text\"></div>\r\n                            </div>\r\n\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"image__comment-section-scrollbar-wrapper image_no-scrollbar\">\r\n                <div class=\"image__comment-section-scrollbar-offset\"></div>\r\n                <div class=\"image__comment-section-scrollbar\">\r\n                    <div class=\"image__comment-section-slider\"></div>\r\n                </div>\r\n\r\n            </div>\r\n\r\n        </div>\r\n\r\n        <div class=\"panel comment comment-send image__comment-send\"\r\n             data-image-id=\"\">\r\n            <div class=\"comment__top-side\">\r\n                <div class=\"comment__avatar\"></div>\r\n                <div class=\"comment__username\"></div>\r\n            </div>\r\n\r\n            <textarea placeholder=\"share your opinion…\" class=\"comment-send__textarea\"></textarea>\r\n            <div class=\"button comment-send__send-button\">send</div>\r\n        </div>\r\n    </div>\r\n    <div class=\"image__modal-close-button-wrapper\">\r\n        <div class=\"icon-cross modal-close-button image__modal-close-button\"></div>    </div>\r\n\r\n</div>\r\n\r\n";

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var CommentSection = __webpack_require__(35);

	var ImageCommentSection = function ImageCommentSection(options) {
	    var _this = this;

	    CommentSection.apply(this, arguments);

	    this.commentSectionWrapper = options.commentSectionWrapper;
	    this.infoBoard = options.infoBoard;
	    this.scrollbarWrapper = options.scrollbarWrapper;
	    this.scrollbar = this.scrollbarWrapper.querySelector('.image__comment-section-scrollbar');
	    this.scrollbarOffset = this.scrollbarWrapper.querySelector('.image__comment-section-scrollbar-offset');
	    this.scrollbarSlider = this.scrollbarWrapper.querySelector('.image__comment-section-slider');

	    this.commentSectionWrapper.onscroll = function (e) {
	        if (!_this.onDragging) _this.setTop();
	    };

	    this.scrollbarSlider.onmousedown = function (e) {

	        _this.onDragging = true;
	        var sliderCoords = getCoords(_this.scrollbarSlider);
	        var shiftY = e.pageY - sliderCoords.top;
	        var scrollbarCoords = getCoords(_this.scrollbar);
	        var newTop = undefined;

	        document.onmousemove = function (e) {
	            newTop = e.pageY - shiftY - scrollbarCoords.top;
	            if (newTop < 0) newTop = 0;
	            var bottomEdge = _this.scrollbar.offsetHeight - _this.scrollbarSlider.offsetHeight;
	            if (newTop > bottomEdge) newTop = bottomEdge;

	            _this.scrollbarSlider.style.top = newTop + 'px';

	            _this.commentSectionWrapper.scrollTop = newTop / _this.scrollbar.offsetHeight / (1 - _this.sliderSizeRate) * (_this.commentSectionWrapper.scrollHeight - _this.commentSectionWrapper.offsetHeight);
	        };

	        document.onmouseup = function (e) {
	            console.log('onmouseup', newTop, _this.scrollbar.offsetHeight);
	            _this.scrollbarSlider.style.top = newTop * 100 / _this.scrollbar.offsetHeight + '%';
	            _this.onDragging = false;
	            document.onmousemove = document.onmouseup = null;
	        };

	        return false; // disable selection start (cursor change)
	    };

	    this.scrollbarSlider.ondragstart = function () {
	        return false;
	    };

	    function getCoords(elem) {
	        // кроме IE8-
	        var box = elem.getBoundingClientRect();

	        return {
	            top: box.top + pageYOffset,
	            left: box.left + pageXOffset
	        };
	    }
	};
	ImageCommentSection.prototype = Object.create(CommentSection.prototype);
	ImageCommentSection.prototype.constructor = ImageCommentSection;

	ImageCommentSection.prototype.set = function () {
	    CommentSection.prototype.set.apply(this, arguments);
	    this.update();
	};

	ImageCommentSection.prototype.setTop = function () {
	    var scrollRate = this.commentSectionWrapper.scrollTop / (this.commentSectionWrapper.scrollHeight - this.commentSectionWrapper.offsetHeight) * 100;

	    this.scrollbarSlider.style.top = (1 - this.sliderSizeRate) * scrollRate + '%';
	};

	ImageCommentSection.prototype.update = function () {
	    this.commentSectionWrapper.classList.add('image_no-scrollbar');
	    this.scrollbarWrapper.classList.add('image_no-scrollbar');

	    this.infoBoardHeight = this.infoBoard.offsetHeight;

	    var computedStyle = getComputedStyle(this.infoBoard);
	    parseFloat(computedStyle.height) && (this.infoBoardHeight = parseFloat(computedStyle.height));

	    this.scrollbarOffset.style.height = this.infoBoardHeight + 'px';
	    this.scrollbar.style.height = 'calc(100% - ' + this.infoBoardHeight + 'px)';

	    if (this.commentSectionWrapper.offsetHeight - this.commentsWrapper.scrollHeight < -1) {
	        this.sliderSizeRate = this.commentSectionWrapper.offsetHeight / this.commentsWrapper.scrollHeight;
	        this.scrollbarSlider.style.height = this.sliderSizeRate * 100 + '%';

	        this.setTop();

	        this.commentSectionWrapper.classList.remove('image_no-scrollbar');
	        this.scrollbarWrapper.classList.remove('image_no-scrollbar');
	    }
	};

	module.exports = ImageCommentSection;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var eventMixin = __webpack_require__(18);

	var CommentSection = function CommentSection(options) {
	    var _this = this;

	    this.elem = options.elem;
	    this.commentsWrapper = options.elem.querySelector('.comment-section__comments-wrapper');
	    this.imageId = options.imageId;
	    this.loggedUserViewModel = options.loggedUserViewModel;

	    this.commentSenderElem = options.commentSenderElem;
	    this.commentSendTextarea = this.commentSenderElem.querySelector('.comment-send__textarea');

	    this.ghost = this.commentsWrapper.querySelector('.comment');

	    if (this.loggedUserViewModel) {
	        this.commentSenderElem.querySelector('.comment__avatar').style.backgroundImage = 'url(\'' + this.loggedUserViewModel.avatarUrls.medium + '\')';
	        this.commentSenderElem.querySelector('.comment__username').textContent = this.loggedUserViewModel.username;
	    } else {
	        this.commentSenderElem.querySelector('.comment__avatar').style.backgroundImage = 'url(\'' + ("/anon.svg") + '\')';
	        this.commentSenderElem.querySelector('.comment__username').textContent = ("anonym");
	    }

	    this.commentSenderElem.onclick = function (e) {
	        if (!e.target.classList.contains('comment-send__send-button')) return;

	        var involvedImageId = _this.imageId;
	        var text = _this.commentSendTextarea.value;
	        if (text.length) {

	            __webpack_require__(25)({
	                id: involvedImageId,
	                text: text
	            }, 'POST', '/comment', function (err, response) {

	                if (err) {
	                    _this.error(err);
	                    return;
	                }

	                _this.commentSendTextarea.value = '';
	                if (_this.imageId === involvedImageId) {
	                    _this.insertNewComment(response.viewModel);
	                    _this.scrollToBottom();
	                }

	                _this.trigger('comment-section_changed', {
	                    imageId: involvedImageId
	                });
	            });
	        }
	    };

	    this.elem.onclick = function (e) {
	        if (!e.target.classList.contains('comment__close-button')) return;

	        var comment = e.target.closest('.comment');
	        var commentId = comment.dataset.id;
	        var involvedImageId = _this.imageId;

	        __webpack_require__(25)({
	            id: commentId
	        }, 'DELETE', '/comment', function (err, response) {
	            if (err) {
	                _this.error(err);
	                return;
	            }

	            _this.trigger('comment-section_changed', {
	                imageId: involvedImageId
	            });
	            comment.remove();
	        });
	    };
	};

	CommentSection.prototype.scrollToBottom = function () {
	    this.commentsWrapper.scrollTop = this.commentsWrapper.scrollHeight;
	};

	CommentSection.prototype.insertNewComment = function (viewModel) {
	    var newComment = this.ghost.cloneNode(true);
	    newComment.classList.remove('comment_ghost');
	    newComment.dataset.id = viewModel._id;
	    newComment.querySelector('.comment__ref').setAttribute('href', viewModel.commentator.url);
	    newComment.querySelector('.comment__avatar').style.backgroundImage = 'url(\'' + viewModel.commentator.avatarUrls.medium + '\')';
	    newComment.querySelector('.comment__username').textContent = viewModel.commentator.username;
	    newComment.querySelector('.comment__date').textContent = viewModel.createDateStr;

	    if (!viewModel.isOwnComment) newComment.classList.add('comment_not-own');else newComment.classList.remove('comment_not-own');

	    newComment.querySelector('.comment__text').textContent = viewModel.text;
	    this.commentsWrapper.appendChild(newComment);

	    this.elem.classList.remove('comment-section_no-comments');
	};

	CommentSection.prototype.setImageId = function (imageId) {
	    this.imageId = imageId;
	};

	CommentSection.prototype.set = function (viewModels) {
	    var _this2 = this;

	    this.clear();

	    if (viewModels.length > 0) this.elem.classList.remove('comment-section_no-comments');

	    viewModels.forEach(function (viewModel) {
	        _this2.insertNewComment(viewModel);
	    });
	};

	CommentSection.prototype.clear = function () {

	    this.commentsWrapper.innerHTML = '';
	    this.elem.classList.add('comment-section_no-comments');
	};

	for (var key in eventMixin) {
	    CommentSection.prototype[key] = eventMixin[key];
		}module.exports = CommentSection;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var SwitchButton = __webpack_require__(31);

	var LikeButton = function LikeButton(options) {
	    SwitchButton.apply(this, arguments);

	    this.likeAmount = +this.elem.dataset.likeAmount;
	    this.likeAmountElem = this.elem.querySelector('.like-button__like-amount');

	    this.url = '/like';
	};
	LikeButton.prototype = Object.create(SwitchButton.prototype);
	LikeButton.prototype.constructor = LikeButton;

	LikeButton.prototype.setAmount = function (likeAmount) {
	    this.likeAmount = likeAmount;
	    this.likeAmountElem.textContent = likeAmount;
	};

	LikeButton.prototype.set = function (options) {
	    this.setAmount(options.likeAmount);
	    SwitchButton.prototype.set.call(this, options);
	};

	LikeButton.prototype.toggle = function () {
	    if (this.active) this.set({ active: false, likeAmount: this.likeAmount - 1 });else this.set({ active: true, likeAmount: this.likeAmount + 1 });
	};

	module.exports = LikeButton;

/***/ }),
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2UuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODBhZjUwNDI5OTJlYmJiMDE2YjQiLCJ3ZWJwYWNrOi8vLy4vaW1hZ2Uvc2NyaXB0LmpzIiwid2VicGFjazovLy8uLi9ibG9ja3MvZ2xvYmFsLWVycm9yLWhhbmRsZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2NvbXBvbmVudEVycm9ycy5qcz9hY2I1Iiwid2VicGFjazovLy8uLi9ibG9ja3MvbW9kYWwvaW5kZXguanMiLCJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2V2ZW50TWl4aW4uanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9zcGlubmVyL2luZGV4LmpzIiwid2VicGFjazovLy8uLi9ibG9ja3Mvc3Bpbm5lci9tYXJrdXAiLCJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL3NlbmRSZXF1ZXN0LmpzPzhhMjciLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9nYWxsZXJ5L2luZGV4LmpzP2I1MjAiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9zd2l0Y2gtYnV0dG9uL2luZGV4LmpzP2FhODYiLCJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2dldENvcnJlY3ROb3VuRm9ybS5qcz84ODM2Iiwid2VicGFjazovLy8uLi9ibG9ja3MvZ2FsbGVyeS93aW5kb3c/YzZiMCIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2ltYWdlLWNvbW1lbnQtc2VjdGlvbi9pbmRleC5qcz9kNjYyIiwid2VicGFjazovLy8uLi9ibG9ja3MvY29tbWVudC1zZWN0aW9uL2luZGV4LmpzPzRmMDMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9saWtlLWJ1dHRvbi9pbmRleC5qcz8xYjUyIiwid2VicGFjazovLy8uL2ltYWdlL3N0eWxlLmxlc3MiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG4gXHR2YXIgcGFyZW50SnNvbnBGdW5jdGlvbiA9IHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXTtcbiBcdHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXSA9IGZ1bmN0aW9uIHdlYnBhY2tKc29ucENhbGxiYWNrKGNodW5rSWRzLCBtb3JlTW9kdWxlcykge1xuIFx0XHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcbiBcdFx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG4gXHRcdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDAsIGNhbGxiYWNrcyA9IFtdO1xuIFx0XHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcbiBcdFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pXG4gXHRcdFx0XHRjYWxsYmFja3MucHVzaC5hcHBseShjYWxsYmFja3MsIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSk7XG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcbiBcdFx0fVxuIFx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGlmKHBhcmVudEpzb25wRnVuY3Rpb24pIHBhcmVudEpzb25wRnVuY3Rpb24oY2h1bmtJZHMsIG1vcmVNb2R1bGVzKTtcbiBcdFx0d2hpbGUoY2FsbGJhY2tzLmxlbmd0aClcbiBcdFx0XHRjYWxsYmFja3Muc2hpZnQoKS5jYWxsKG51bGwsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHR9O1xuXG4gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuIFx0Ly8gXCIwXCIgbWVhbnMgXCJhbHJlYWR5IGxvYWRlZFwiXG4gXHQvLyBBcnJheSBtZWFucyBcImxvYWRpbmdcIiwgYXJyYXkgY29udGFpbnMgY2FsbGJhY2tzXG4gXHR2YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuIFx0XHQ4OjAsXG4gXHRcdDM6MCxcbiBcdFx0MTM6MFxuIFx0fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG4gXHQvLyBUaGlzIGZpbGUgY29udGFpbnMgb25seSB0aGUgZW50cnkgY2h1bmsuXG4gXHQvLyBUaGUgY2h1bmsgbG9hZGluZyBmdW5jdGlvbiBmb3IgYWRkaXRpb25hbCBjaHVua3NcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZSA9IGZ1bmN0aW9uIHJlcXVpcmVFbnN1cmUoY2h1bmtJZCwgY2FsbGJhY2spIHtcbiBcdFx0Ly8gXCIwXCIgaXMgdGhlIHNpZ25hbCBmb3IgXCJhbHJlYWR5IGxvYWRlZFwiXG4gXHRcdGlmKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMClcbiBcdFx0XHRyZXR1cm4gY2FsbGJhY2suY2FsbChudWxsLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBhbiBhcnJheSBtZWFucyBcImN1cnJlbnRseSBsb2FkaW5nXCIuXG4gXHRcdGlmKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSAhPT0gdW5kZWZpbmVkKSB7XG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdLnB1c2goY2FsbGJhY2spO1xuIFx0XHR9IGVsc2Uge1xuIFx0XHRcdC8vIHN0YXJ0IGNodW5rIGxvYWRpbmdcbiBcdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSBbY2FsbGJhY2tdO1xuIFx0XHRcdHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiBcdFx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gXHRcdFx0c2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcbiBcdFx0XHRzY3JpcHQuY2hhcnNldCA9ICd1dGYtOCc7XG4gXHRcdFx0c2NyaXB0LmFzeW5jID0gdHJ1ZTtcblxuIFx0XHRcdHNjcmlwdC5zcmMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgY2h1bmtJZCArIFwiLlwiICsgKHt9W2NodW5rSWRdfHxjaHVua0lkKSArIFwiLmpzXCI7XG4gXHRcdFx0aGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA4MGFmNTA0Mjk5MmViYmIwMTZiNCIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICcuL3N0eWxlLmxlc3MnO1xyXG5cclxubGV0IEdsb2JhbEVycm9ySGFuZGxlciA9IHJlcXVpcmUoQkxPQ0tTICsgJ2dsb2JhbC1lcnJvci1oYW5kbGVyJyk7XHJcbmxldCBnbG9iYWxFcnJvckhhbmRsZXIgPSBuZXcgR2xvYmFsRXJyb3JIYW5kbGVyKCk7XHJcblxyXG5sZXQgR2FsbGVyeSA9IHJlcXVpcmUoQkxPQ0tTICsgJ2dhbGxlcnknKTtcclxubGV0IGdhbGxlcnkgPSBuZXcgR2FsbGVyeSh7XHJcblx0ZWxlbTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ltYWdlJyksXHJcblx0aXNMb2dnZWQ6IHdpbmRvdy5pc0xvZ2dlZCxcclxuXHRwcmVsb2FkRW50aXR5Q291bnQ6IFBSRUxPQURfSU1BR0VfQ09VTlRcclxufSk7XHJcblxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9pbWFnZS9zY3JpcHQuanMiLCJsZXQgR2xvYmFsRXJyb3JIYW5kbGVyID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZSA9PiB7XHJcbiAgICAgICAgbGV0IGVycm9yID0gZS5kZXRhaWw7XHJcbiAgICAgICAgdGhpcy5jYWxsKGVycm9yKTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuR2xvYmFsRXJyb3JIYW5kbGVyLnByb3RvdHlwZS5jYWxsID0gZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICByZXF1aXJlLmVuc3VyZShbTElCUyArICdjb21wb25lbnRFcnJvcnMnLCBCTE9DS1MgKyAnbWVzc2FnZS1tb2RhbC13aW5kb3cnXSwgZnVuY3Rpb24gKHJlcXVpcmUpIHtcclxuICAgICAgICBsZXQgQ29tcG9uZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ29tcG9uZW50RXJyb3I7XHJcbiAgICAgICAgbGV0IE1lc3NhZ2VNb2RhbFdpbmRvdyA9IHJlcXVpcmUoQkxPQ0tTICsgJ21lc3NhZ2UtbW9kYWwtd2luZG93Jyk7XHJcblxyXG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIENvbXBvbmVudEVycm9yKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvci5zdGF0dXMgPT09IDQwMSkge1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZGlyZWN0ZWRfdXJsJywgd2luZG93LmxvY2F0aW9uLmhyZWYpO1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gJy9hdXRob3JpemF0aW9uJztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBtZXNzYWdlTW9kYWxXaW5kb3cgPSBuZXcgTWVzc2FnZU1vZGFsV2luZG93KHttZXNzYWdlOiBlcnJvci5tZXNzYWdlfSk7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlTW9kYWxXaW5kb3cuYWN0aXZhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2xvYmFsRXJyb3JIYW5kbGVyO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvZ2xvYmFsLWVycm9yLWhhbmRsZXIvaW5kZXguanMiLCJmdW5jdGlvbiBDdXN0b21FcnJvcihtZXNzYWdlKSB7XHJcblx0dGhpcy5uYW1lID0gXCJDdXN0b21FcnJvclwiO1xyXG5cdHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcblxyXG5cdGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSlcclxuXHRcdEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIEN1c3RvbUVycm9yKTtcclxuXHRlbHNlXHJcblx0XHR0aGlzLnN0YWNrID0gKG5ldyBFcnJvcigpKS5zdGFjaztcclxufVxyXG5DdXN0b21FcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XHJcbkN1c3RvbUVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEN1c3RvbUVycm9yO1xyXG5cclxuXHJcbmZ1bmN0aW9uIENvbXBvbmVudEVycm9yKG1lc3NhZ2UsIHN0YXR1cykge1xyXG5cdEN1c3RvbUVycm9yLmNhbGwodGhpcywgbWVzc2FnZSB8fCAnQW4gZXJyb3IgaGFzIG9jY3VycmVkJyApO1xyXG5cdHRoaXMubmFtZSA9IFwiQ29tcG9uZW50RXJyb3JcIjtcclxuXHR0aGlzLnN0YXR1cyA9IHN0YXR1cztcclxufVxyXG5Db21wb25lbnRFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEN1c3RvbUVycm9yLnByb3RvdHlwZSk7XHJcbkNvbXBvbmVudEVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENvbXBvbmVudEVycm9yO1xyXG5cclxuZnVuY3Rpb24gQ2xpZW50RXJyb3IobWVzc2FnZSwgZGV0YWlsLCBzdGF0dXMpIHtcclxuXHRDb21wb25lbnRFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ0FuIGVycm9yIGhhcyBvY2N1cnJlZC4gQ2hlY2sgaWYgamF2YXNjcmlwdCBpcyBlbmFibGVkJywgc3RhdHVzKTtcclxuXHR0aGlzLm5hbWUgPSBcIkNsaWVudEVycm9yXCI7XHJcblx0dGhpcy5kZXRhaWwgPSBkZXRhaWw7XHJcbn1cclxuQ2xpZW50RXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb21wb25lbnRFcnJvci5wcm90b3R5cGUpO1xyXG5DbGllbnRFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDbGllbnRFcnJvcjtcclxuXHJcblxyXG5mdW5jdGlvbiBJbWFnZU5vdEZvdW5kKG1lc3NhZ2UpIHtcclxuICAgIENsaWVudEVycm9yLmNhbGwodGhpcywgbWVzc2FnZSB8fCAnSW1hZ2Ugbm90IGZvdW5kLiBJdCBwcm9iYWJseSBoYXMgYmVlbiByZW1vdmVkJywgbnVsbCwgNDA0KTtcclxuICAgIHRoaXMubmFtZSA9IFwiSW1hZ2VOb3RGb3VuZFwiO1xyXG59XHJcbkltYWdlTm90Rm91bmQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDbGllbnRFcnJvci5wcm90b3R5cGUpO1xyXG5JbWFnZU5vdEZvdW5kLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEltYWdlTm90Rm91bmQ7XHJcblxyXG5mdW5jdGlvbiBTZXJ2ZXJFcnJvcihtZXNzYWdlLCBzdGF0dXMpIHtcclxuXHRDb21wb25lbnRFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ1RoZXJlIGlzIHNvbWUgZXJyb3Igb24gdGhlIHNlcnZlciBzaWRlJywgc3RhdHVzKTtcclxuXHR0aGlzLm5hbWUgPSBcIlNlcnZlckVycm9yXCI7XHJcbn1cclxuU2VydmVyRXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb21wb25lbnRFcnJvci5wcm90b3R5cGUpO1xyXG5TZXJ2ZXJFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTZXJ2ZXJFcnJvcjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdENvbXBvbmVudEVycm9yLFxyXG5cdENsaWVudEVycm9yLFxyXG4gICAgSW1hZ2VOb3RGb3VuZCxcclxuXHRTZXJ2ZXJFcnJvclxyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvY29tcG9uZW50RXJyb3JzLmpzIiwibGV0IGV2ZW50TWl4aW4gPSByZXF1aXJlKExJQlMgKyAnZXZlbnRNaXhpbicpO1xyXG5sZXQgU3Bpbm5lciA9IHJlcXVpcmUoQkxPQ0tTICsgJ3NwaW5uZXInKTtcclxuXHJcbmxldCBNb2RhbCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcclxuICAgIHRoaXMuc3RhdHVzID0gb3B0aW9ucyAmJiBvcHRpb25zLnN0YXR1cyB8fCBNb2RhbC5zdGF0dXNlcy5NSU5PUjtcclxufTtcclxuXHJcbk1vZGFsLnN0YXR1c2VzID0ge1xyXG4gICAgTUFKT1I6IDEsXHJcbiAgICBNSU5PUjogMlxyXG59O1xyXG5cclxuTW9kYWwucHJvdG90eXBlLm9uRWxlbUNsaWNrID0gZnVuY3Rpb24gKGUpIHtcclxuICAgIGlmIChlLnRhcmdldC5tYXRjaGVzKCcubW9kYWwtY2xvc2UtYnV0dG9uJykpXHJcbiAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XHJcbn07XHJcblxyXG5Nb2RhbC5wcm90b3R5cGUuc2V0TGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5saXN0ZW5lcnMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICB0aGlzLmVsZW0uYWRkRXZlbnRMaXN0ZW5lcihpdGVtLmV2ZW50TmFtZSwgaXRlbS5jYik7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbk1vZGFsLnNldEJhY2tkcm9wID0gZnVuY3Rpb24gKHN0YXR1cykge1xyXG4gICAgaWYgKHN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpIHtcclxuICAgICAgICBNb2RhbC5taW5vckJhY2tkcm9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tkcm9wX21pbm9yJyk7XHJcbiAgICAgICAgaWYgKCFNb2RhbC5taW5vckJhY2tkcm9wKVxyXG4gICAgICAgICAgICBNb2RhbC5taW5vckJhY2tkcm9wID0gTW9kYWwucmVuZGVyQmFja2Ryb3AoJ21pbm9yJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIE1vZGFsLm1ham9yQmFja2Ryb3AgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja2Ryb3BfbWFqb3InKTtcclxuICAgICAgICBpZiAoIU1vZGFsLm1ham9yQmFja2Ryb3ApXHJcbiAgICAgICAgICAgIE1vZGFsLm1ham9yQmFja2Ryb3AgPSBNb2RhbC5yZW5kZXJCYWNrZHJvcCgnbWFqb3InKTtcclxuICAgIH1cclxufTtcclxuXHJcbk1vZGFsLnNldFdyYXBwZXIgPSBmdW5jdGlvbiAoc3RhdHVzKSB7XHJcbiAgICBpZiAoc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUikge1xyXG4gICAgICAgIE1vZGFsLm1pbm9yV3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC13cmFwcGVyLW1pbm9yJyk7XHJcbiAgICAgICAgaWYgKCFNb2RhbC5taW5vcldyYXBwZXIpXHJcbiAgICAgICAgICAgIE1vZGFsLm1pbm9yV3JhcHBlciA9IE1vZGFsLnJlbmRlcldyYXBwZXIoJ21pbm9yJyk7XHJcbiAgICAgICAgTW9kYWwubWlub3JXcmFwcGVyLm9uY2xpY2sgPSBlID0+IHtcclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0ICYmICFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ21vZGFsLXdyYXBwZXJfbWlub3InKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAoTW9kYWwubWlub3JBY3RpdmUpXHJcbiAgICAgICAgICAgICAgICBNb2RhbC5taW5vclF1ZXVlWzBdLmRlYWN0aXZhdGUoKTtcclxuICAgICAgICB9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBNb2RhbC5tYWpvcldyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtd3JhcHBlci1tYWpvcicpO1xyXG4gICAgICAgIGlmICghTW9kYWwubWFqb3JXcmFwcGVyKVxyXG4gICAgICAgICAgICBNb2RhbC5tYWpvcldyYXBwZXIgPSBNb2RhbC5yZW5kZXJXcmFwcGVyKCdtYWpvcicpO1xyXG4gICAgICAgIE1vZGFsLm1ham9yV3JhcHBlci5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldCAmJiAhZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2RhbC13cmFwcGVyX21ham9yJykpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKE1vZGFsLm1ham9yQWN0aXZlKVxyXG4gICAgICAgICAgICAgICAgTW9kYWwubWFqb3JRdWV1ZVswXS5kZWFjdGl2YXRlKCk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufTtcclxuXHJcbk1vZGFsLnJlbmRlckJhY2tkcm9wID0gZnVuY3Rpb24gKHR5cGUpIHtcclxuICAgIGxldCBiYWNrZHJvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xyXG4gICAgYmFja2Ryb3AuY2xhc3NOYW1lID0gJ2JhY2tkcm9wIGJhY2tkcm9wX2ludmlzaWJsZSc7XHJcbiAgICBiYWNrZHJvcC5jbGFzc0xpc3QuYWRkKGBiYWNrZHJvcF8ke3R5cGV9YCk7XHJcbiAgICBiYWNrZHJvcC5pZCA9IGBiYWNrZHJvcC0ke3R5cGV9YDtcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYmFja2Ryb3ApO1xyXG4gICAgcmV0dXJuIGJhY2tkcm9wO1xyXG59O1xyXG5cclxuTW9kYWwucmVuZGVyV3JhcHBlciA9IGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICBsZXQgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xyXG4gICAgd3JhcHBlci5jbGFzc05hbWUgPSAnbW9kYWwtd3JhcHBlciBtb2RhbC13cmFwcGVyX2ludmlzaWJsZSc7XHJcbiAgICB3cmFwcGVyLmNsYXNzTGlzdC5hZGQoYG1vZGFsLXdyYXBwZXJfJHt0eXBlfWApO1xyXG4gICAgd3JhcHBlci5pZCA9IGBtb2RhbC13cmFwcGVyLSR7dHlwZX1gO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcclxuICAgIHJldHVybiB3cmFwcGVyO1xyXG59O1xyXG5cclxuTW9kYWwucHJvdG90eXBlLnJlbmRlcldpbmRvdyA9IGZ1bmN0aW9uIChodG1sKSB7XHJcblxyXG4gICAgbGV0IHBhcmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xyXG4gICAgcGFyZW50LmlubmVySFRNTCA9IGh0bWw7XHJcbiAgICBsZXQgd25kID0gcGFyZW50LmZpcnN0RWxlbWVudENoaWxkO1xyXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUilcclxuICAgICAgICBNb2RhbC5taW5vcldyYXBwZXIuYXBwZW5kQ2hpbGQod25kKTtcclxuICAgIGVsc2VcclxuICAgICAgICBNb2RhbC5tYWpvcldyYXBwZXIuYXBwZW5kQ2hpbGQod25kKTtcclxuXHJcbiAgICBwYXJlbnQucmVtb3ZlKCk7XHJcbiAgICByZXR1cm4gd25kO1xyXG59O1xyXG5cclxuTW9kYWwucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5zdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKSB7XHJcbiAgICAgICAgaWYgKCFNb2RhbC5taW5vckJhY2tkcm9wKVxyXG4gICAgICAgICAgICBNb2RhbC5zZXRCYWNrZHJvcChNb2RhbC5zdGF0dXNlcy5NSU5PUik7XHJcblxyXG4gICAgICAgIGlmICghTW9kYWwubWlub3JXcmFwcGVyKVxyXG4gICAgICAgICAgICBNb2RhbC5zZXRXcmFwcGVyKE1vZGFsLnN0YXR1c2VzLk1JTk9SKTtcclxuXHJcbiAgICAgICAgTW9kYWwubWlub3JXcmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLXdyYXBwZXJfaW52aXNpYmxlJyk7XHJcbiAgICAgICAgTW9kYWwubWlub3JCYWNrZHJvcC5jbGFzc0xpc3QucmVtb3ZlKCdiYWNrZHJvcF9pbnZpc2libGUnKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICghTW9kYWwubWFqb3JCYWNrZHJvcClcclxuICAgICAgICAgICAgTW9kYWwuc2V0QmFja2Ryb3AoTW9kYWwuc3RhdHVzZXMuTUFKT1IpO1xyXG5cclxuICAgICAgICBpZiAoIU1vZGFsLm1ham9yV3JhcHBlcilcclxuICAgICAgICAgICAgTW9kYWwuc2V0V3JhcHBlcihNb2RhbC5zdGF0dXNlcy5NQUpPUik7XHJcblxyXG4gICAgICAgIE1vZGFsLm1ham9yV3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC13cmFwcGVyX2ludmlzaWJsZScpO1xyXG4gICAgICAgIE1vZGFsLm1ham9yQmFja2Ryb3AuY2xhc3NMaXN0LnJlbW92ZSgnYmFja2Ryb3BfaW52aXNpYmxlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xyXG5cclxufTtcclxuXHJcblxyXG5Nb2RhbC5wcm90b3R5cGUuYWN0aXZhdGUgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgIGlmICh0aGlzLmVsZW1JZCA9PT0gJ3NwaW5uZXInKSB7XHJcbiAgICAgICAgbGV0IHNwaW5uZXIgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMub24oJ3NwaW5uZXJfaG9zdC1sb2FkZWQnLCBlID0+IHtcclxuICAgICAgICAgICAgbGV0IG5ld0hvc3QgPSBlLmRldGFpbC5ob3N0O1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUilcclxuICAgICAgICAgICAgICAgIE1vZGFsLm1pbm9yUXVldWUuc3BsaWNlKE1vZGFsLm1pbm9yUXVldWUuaW5kZXhPZihzcGlubmVyKSArIDEsIDAsIG5ld0hvc3QpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBNb2RhbC5tYWpvclF1ZXVlLnNwbGljZShNb2RhbC5tYWpvclF1ZXVlLmluZGV4T2Yoc3Bpbm5lcikgKyAxLCAwLCBuZXdIb3N0KTtcclxuXHJcbiAgICAgICAgICAgIHNwaW5uZXIuZGVhY3RpdmF0ZShlLmRldGFpbC5vcHRpb25zKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpIHtcclxuICAgICAgICAgICAgTW9kYWwubWlub3JRdWV1ZS5wdXNoKHRoaXMpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhNb2RhbC5taW5vclF1ZXVlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coTW9kYWwubWFqb3JRdWV1ZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIU1vZGFsLm1pbm9yQWN0aXZlKVxyXG4gICAgICAgICAgICAgICAgTW9kYWwubWlub3JTaG93KG9wdGlvbnMpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBNb2RhbC5tYWpvclF1ZXVlLnB1c2godGhpcyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKE1vZGFsLm1pbm9yUXVldWUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhNb2RhbC5tYWpvclF1ZXVlKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghTW9kYWwubWFqb3JBY3RpdmUpXHJcblxyXG4gICAgICAgICAgICAgICAgTW9kYWwubWFqb3JTaG93KG9wdGlvbnMpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5Nb2RhbC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpIHtcclxuICAgICAgICAvL1RPRE8gbm90IG5lY2Nlc3NhcnkgaWYgcXVldWUgaXMgbm90IGVtcHR5XHJcbiAgICAgICAgTW9kYWwubWlub3JXcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ21vZGFsLXdyYXBwZXJfaW52aXNpYmxlJyk7XHJcbiAgICAgICAgTW9kYWwubWlub3JCYWNrZHJvcC5jbGFzc0xpc3QuYWRkKCdiYWNrZHJvcF9pbnZpc2libGUnKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIE1vZGFsLm1ham9yV3JhcHBlci5jbGFzc0xpc3QuYWRkKCdtb2RhbC13cmFwcGVyX2ludmlzaWJsZScpO1xyXG4gICAgICAgIE1vZGFsLm1ham9yQmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgnYmFja2Ryb3BfaW52aXNpYmxlJyk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuTW9kYWwucHJvdG90eXBlLmRlYWN0aXZhdGUgPSBmdW5jdGlvbiAobmV4dFdpbmRvd09wdGlvbnMsIGhpZGVPcHRpb25zKSB7XHJcblxyXG4gICAgdGhpcy5oaWRlKGhpZGVPcHRpb25zKTtcclxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XHJcbiAgICBpZiAodGhpcy5zdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKSB7XHJcbiAgICAgICAgTW9kYWwubWlub3JBY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICBNb2RhbC5taW5vclF1ZXVlLnNoaWZ0KCk7XHJcbiAgICAgICAgTW9kYWwubWlub3JTaG93KG5leHRXaW5kb3dPcHRpb25zKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgTW9kYWwubWFqb3JBY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICBNb2RhbC5tYWpvclF1ZXVlLnNoaWZ0KCk7XHJcbiAgICAgICAgTW9kYWwubWFqb3JTaG93KG5leHRXaW5kb3dPcHRpb25zKTtcclxuICAgIH1cclxuICAgIHRoaXMudHJpZ2dlcignbW9kYWwtd2luZG93X2RlYWN0aXZhdGVkJyk7XHJcbn07XHJcblxyXG5Nb2RhbC5taW5vckFjdGl2ZSA9IGZhbHNlO1xyXG5Nb2RhbC5tYWpvckFjdGl2ZSA9IGZhbHNlO1xyXG5Nb2RhbC5taW5vclF1ZXVlID0gW107XHJcbk1vZGFsLm1ham9yUXVldWUgPSBbXTtcclxuXHJcbk1vZGFsLnNwaW5uZXIgPSBuZXcgU3Bpbm5lcigpO1xyXG5Nb2RhbC5zcGlubmVyLnN0YXR1cyA9IE1vZGFsLnN0YXR1c2VzLk1BSk9SO1xyXG5cclxuTW9kYWwuc2hvd1NwaW5uZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBNb2RhbC5wcm90b3R5cGUuc2hvdy5jYWxsKE1vZGFsLnNwaW5uZXIpO1xyXG5cclxuICAgIGlmICghTW9kYWwuc3Bpbm5lci5lbGVtKVxyXG4gICAgICAgIE1vZGFsLnNwaW5uZXIuZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGlubmVyJyk7XHJcbiAgICBpZiAoIU1vZGFsLnNwaW5uZXIuZWxlbSlcclxuICAgICAgICBNb2RhbC5zcGlubmVyLmVsZW0gPSBNb2RhbC5wcm90b3R5cGUucmVuZGVyV2luZG93LmNhbGwoTW9kYWwuc3Bpbm5lciwgU3Bpbm5lci5odG1sKTtcclxuXHJcbiAgICBNb2RhbC5zcGlubmVyLnNob3coKTtcclxufTtcclxuXHJcbk1vZGFsLmhpZGVTcGlubmVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgTW9kYWwuc3Bpbm5lci5oaWRlKCk7XHJcbn07XHJcblxyXG5cclxuTW9kYWwubWlub3JTaG93ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIGxldCBuZXh0TW9kYWxXaW5kb3cgPSBNb2RhbC5taW5vclF1ZXVlWzBdO1xyXG4gICAgaWYgKG5leHRNb2RhbFdpbmRvdykge1xyXG4gICAgICAgIGxldCBwcm9taXNlID0gbmV4dE1vZGFsV2luZG93LnNob3cob3B0aW9ucyk7XHJcbiAgICAgICAgaWYgKHByb21pc2UpXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgTW9kYWwubWlub3JBY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgTW9kYWwubWlub3JBY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgTW9kYWwubWlub3JBY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5Nb2RhbC5tYWpvclNob3cgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgIGxldCBuZXh0TW9kYWxXaW5kb3cgPSBNb2RhbC5tYWpvclF1ZXVlWzBdO1xyXG5cclxuICAgIGlmIChuZXh0TW9kYWxXaW5kb3cpIHtcclxuXHJcbiAgICAgICAgTW9kYWwuc2hvd1NwaW5uZXIoKTtcclxuICAgICAgICBsZXQgcHJvbWlzZSA9IG5leHRNb2RhbFdpbmRvdy5zaG93KG9wdGlvbnMpO1xyXG5cclxuICAgICAgICBpZiAocHJvbWlzZSlcclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2UudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBNb2RhbC5tYWpvckFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBNb2RhbC5oaWRlU3Bpbm5lcigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgTW9kYWwubWFqb3JBY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICBNb2RhbC5oaWRlU3Bpbm5lcigpO1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgTW9kYWwubWFqb3JBY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5mb3IgKGxldCBrZXkgaW4gZXZlbnRNaXhpbilcclxuICAgIE1vZGFsLnByb3RvdHlwZVtrZXldID0gZXZlbnRNaXhpbltrZXldO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTW9kYWw7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvbW9kYWwvaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcblx0b246IGZ1bmN0aW9uKGV2ZW50TmFtZSwgY2IpIHtcclxuXHRcdGlmICh0aGlzLmVsZW0pXHJcblx0XHRcdHRoaXMuZWxlbS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2IpO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHR0aGlzLmxpc3RlbmVycy5wdXNoKHtcclxuXHRcdFx0XHRldmVudE5hbWUsXHJcblx0XHRcdFx0Y2JcclxuXHRcdFx0fSk7XHJcblx0fSxcclxuXHJcblx0dHJpZ2dlcjogZnVuY3Rpb24oZXZlbnROYW1lLCBkZXRhaWwpIHtcclxuXHRcdHRoaXMuZWxlbS5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChldmVudE5hbWUsIHtcclxuXHRcdFx0YnViYmxlczogdHJ1ZSxcclxuXHRcdFx0Y2FuY2VsYWJsZTogdHJ1ZSxcclxuXHRcdFx0ZGV0YWlsOiBkZXRhaWxcclxuXHRcdH0pKTtcclxuXHR9LFxyXG5cclxuXHRlcnJvcjogZnVuY3Rpb24oZXJyKSB7XHJcblx0XHR0aGlzLmVsZW0uZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2Vycm9yJywge1xyXG5cdFx0XHRidWJibGVzOiB0cnVlLFxyXG5cdFx0XHRjYW5jZWxhYmxlOiB0cnVlLFxyXG5cdFx0XHRkZXRhaWw6IGVyclxyXG5cdFx0fSkpO1xyXG5cdH1cclxuXHJcblxyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvZXZlbnRNaXhpbi5qcyIsImxldCBTcGlubmVyID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGlubmVyJyk7XHJcbn07XHJcblxyXG5TcGlubmVyLmh0bWwgPSByZXF1aXJlKGBodG1sLWxvYWRlciEuL21hcmt1cGApO1xyXG5cclxuU3Bpbm5lci5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdzcGlubmVyX2ludmlzaWJsZScpO1xyXG59O1xyXG5cclxuU3Bpbm5lci5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdzcGlubmVyX2ludmlzaWJsZScpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTcGlubmVyO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3Mvc3Bpbm5lci9pbmRleC5qcyIsIm1vZHVsZS5leHBvcnRzID0gXCI8ZGl2IGlkPVxcXCJzcGlubmVyXFxcIiBjbGFzcz1cXFwic3Bpbm5lclxcXCI+XFxyXFxuXFxyXFxuPC9kaXY+XCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL34vaHRtbC1sb2FkZXIhLi4vYmxvY2tzL3NwaW5uZXIvbWFya3VwXG4vLyBtb2R1bGUgaWQgPSAyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDEgMiA4IDkgMTAiLCJsZXQgU2VydmVyRXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuU2VydmVyRXJyb3I7XHJcbmxldCBDbGllbnRFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5DbGllbnRFcnJvcjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJvZHlPYmosIG1ldGhvZCwgdXJsLCBjYikge1xyXG5cclxuXHJcbiAgICBsZXQgYm9keSA9ICcnO1xyXG4gICAgaWYgKCEodHlwZW9mIGJvZHlPYmogPT09ICdzdHJpbmcnKSkge1xyXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBib2R5T2JqKSB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICBpZiAoYm9keU9ialtrZXldKVxyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBrZXkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoKHR5cGVvZiBib2R5T2JqW2tleV0gPT09ICdvYmplY3QnKSA/IEpTT04uc3RyaW5naWZ5KGJvZHlPYmpba2V5XSkgOiBib2R5T2JqW2tleV0pO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAgICAgICAgICBib2R5ICs9IChib2R5ID09PSAnJyA/ICcnIDogJyYnKSArIHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZVxyXG4gICAgICAgIGJvZHkgPSBib2R5T2JqO1xyXG5cclxuXHJcbiAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICB4aHIub3BlbihtZXRob2QsIHVybCwgdHJ1ZSk7XHJcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xyXG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJYLVJlcXVlc3RlZC1XaXRoXCIsIFwiWE1MSHR0cFJlcXVlc3RcIik7XHJcblxyXG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlICE9IDQpIHJldHVybjtcclxuXHJcbiAgICAgICAgbGV0IHJlc3BvbnNlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5yZXNwb25zZVRleHQpXHJcbiAgICAgICAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNiKG5ldyBTZXJ2ZXJFcnJvcignU2VydmVyIGlzIG5vdCByZXNwb25kaW5nJykpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwKVxyXG4gICAgICAgICAgICBjYihudWxsLCByZXNwb25zZSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSA0MDAgJiYgdGhpcy5zdGF0dXMgPCA1MDApXHJcbiAgICAgICAgICAgIGNiKG5ldyBDbGllbnRFcnJvcihyZXNwb25zZS5tZXNzYWdlLCByZXNwb25zZS5kZXRhaWwsIHRoaXMuc3RhdHVzKSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSA1MDApXHJcbiAgICAgICAgICAgIGNiKG5ldyBTZXJ2ZXJFcnJvcihyZXNwb25zZS5tZXNzYWdlLCB0aGlzLnN0YXR1cykpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhgc2VuZGluZyBuZXh0IHJlcXVlc3Q6ICR7Ym9keX1gKTtcclxuICAgIHhoci5zZW5kKGJvZHkpO1xyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvc2VuZFJlcXVlc3QuanMiLCJsZXQgZXZlbnRNaXhpbiA9IHJlcXVpcmUoTElCUyArICdldmVudE1peGluJyk7XHJcbmxldCBDbGllbnRFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5DbGllbnRFcnJvcjtcclxubGV0IEltYWdlTm90Rm91bmQgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuSW1hZ2VOb3RGb3VuZDtcclxubGV0IE1vZGFsID0gcmVxdWlyZShCTE9DS1MgKyAnbW9kYWwnKTtcclxubGV0IFN3aXRjaEJ1dHRvbiA9IHJlcXVpcmUoQkxPQ0tTICsgJ3N3aXRjaC1idXR0b24nKTtcclxubGV0IGdldENvcnJlY3ROb3VuRm9ybSA9IHJlcXVpcmUoTElCUyArICdnZXRDb3JyZWN0Tm91bkZvcm0nKTtcclxuXHJcbmxldCBHYWxsZXJ5ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIE1vZGFsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICB0aGlzLnN0YXR1cyA9IE1vZGFsLnN0YXR1c2VzLk1BSk9SO1xyXG5cclxuICAgIHRoaXMuZ2FsbGVyeSA9IG9wdGlvbnMuZ2FsbGVyeTtcclxuICAgIHRoaXMuZWxlbSA9IG9wdGlvbnMuZWxlbTtcclxuICAgIHRoaXMuaXNMb2dnZWQgPSBvcHRpb25zLmlzTG9nZ2VkO1xyXG4gICAgdGhpcy5wcmVsb2FkRW50aXR5Q291bnQgPSBvcHRpb25zLnByZWxvYWRFbnRpdHlDb3VudDtcclxuICAgIHRoaXMuaXNGZWVkID0gb3B0aW9ucy5pc0ZlZWQgfHwgZmFsc2U7XHJcbiAgICB0aGlzLnVzZXJTdWJzY3JpYmVCdXR0b24gPSBvcHRpb25zLnVzZXJTdWJzY3JpYmVCdXR0b247XHJcblxyXG4gICAgdGhpcy52aWV3TW9kZWxzID0ge307XHJcbiAgICB0aGlzLmdhbGxlcnlBcnJheSA9IG51bGw7XHJcbiAgICB0aGlzLmN1cnJlbnRJbWFnZUlkID0gbnVsbDtcclxuXHJcbiAgICB0aGlzLmxvZ2dlZFVzZXJWaWV3TW9kZWwgPSBudWxsO1xyXG4gICAgdGhpcy5pc0VtYmVkZGVkID0gISF0aGlzLmdhbGxlcnk7XHJcbiAgICB0aGlzLnByZWxvYWRlZEltYWdlcyA9IHt9O1xyXG5cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnY3VycmVudFZpZXdNb2RlbCcsIHtcclxuICAgICAgICBnZXQ6ICgpID0+IHRoaXMudmlld01vZGVsc1t0aGlzLmN1cnJlbnRJbWFnZUlkXVxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IHRoaXMucHJlbG9hZEVudGl0eUNvdW50OyBpKyspIHtcclxuICAgICAgICB0aGlzLnByZWxvYWRlZEltYWdlc1tpXSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgIHRoaXMucHJlbG9hZGVkSW1hZ2VzWy1pXSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGUgPT4ge1xyXG4gICAgICAgIHRoaXMub25Qb3BTdGF0ZShlLnN0YXRlKTtcclxuICAgIH0sIGZhbHNlKTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZSA9PiB7XHJcbiAgICAgICAgdGhpcy5vblJlc2l6ZSgpO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIHRoaXMucHVzaEdhbGxlcnlTdGF0ZSgpO1xyXG5cclxuICAgIGlmICh0aGlzLmlzRW1iZWRkZWQpXHJcbiAgICAgICAgdGhpcy5zZXRHYWxsZXJ5KG9wdGlvbnMpO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHRoaXMuc2hvdygrdGhpcy5lbGVtLmRhdGFzZXQuaWQpLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xyXG4gICAgICAgIH0pO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKE1vZGFsLnByb3RvdHlwZSk7XHJcbkdhbGxlcnkucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2FsbGVyeTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLm9uUmVzaXplID0gZnVuY3Rpb24oKSB7XHJcbiAgICAvLyBjb25zdCBHTE9CQUxfU01BTExfU0NSRUVOX1dJRFRIID0gNzAwO1xyXG4gICAgLy8gaWYgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCA8PSBHTE9CQUxfU01BTExfU0NSRUVOX1dJRFRIKVxyXG4gICAgLy8gICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdpbWFnZV9zbWFsbCcpO1xyXG4gICAgLy8gZWxzZVxyXG4gICAgLy8gICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdpbWFnZV9zbWFsbCcpO1xyXG4gICAgLy9cclxuICAgIC8vIHRoaXMucmVzaXplSW1hZ2UoKTtcclxuICAgIHRoaXMuY29tbWVudFNlY3Rpb24gJiYgdGhpcy5jb21tZW50U2VjdGlvbi51cGRhdGUoKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLm9uR2FsbGVyeUNsaWNrID0gZnVuY3Rpb24gKGUpIHtcclxuICAgIGxldCB0YXJnZXQ7XHJcbiAgICBpZiAoISh0YXJnZXQgPSBlLnRhcmdldC5jbG9zZXN0KCcuaW1hZ2UtcHJldmlldycpKSkgcmV0dXJuO1xyXG5cclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGxldCBpbWFnZUlkID0gK3RhcmdldC5kYXRhc2V0LmlkO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmFjdGl2YXRlKHtpbWFnZUlkfSk7XHJcbn07XHJcblxyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuc2V0R2FsbGVyeSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLnB1YmxpY2F0aW9uc1N0YXRFbGVtID0gb3B0aW9ucy5wdWJsaWNhdGlvbnNTdGF0RWxlbTtcclxuICAgIHRoaXMuaW1hZ2VQcmV2aWV3R2hvc3QgPSB0aGlzLmdhbGxlcnkucXVlcnlTZWxlY3RvcignLmltYWdlLXByZXZpZXcnKTtcclxuICAgIHRoaXMuZ2FsbGVyeVdyYXBwZXIgPSB0aGlzLmdhbGxlcnkucXVlcnlTZWxlY3RvcignLmdhbGxlcnlfX3dyYXBwZXInKTtcclxuXHJcbiAgICB0aGlzLmdhbGxlcnkub25jbGljayA9IGUgPT4ge1xyXG4gICAgICAgIHRoaXMub25HYWxsZXJ5Q2xpY2soZSk7XHJcbiAgICB9O1xyXG59O1xyXG5cclxuLy9UT0RPIEFMRVJUIElGIElUIERPRVNOJ1QgQUJMRSBUTyBET1dOTE9BRCBNT0RBTCBNRVNTQUdFIFdJTkRPV1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuc2V0RWxlbSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgICAgICB0aGlzLmlzRWxlbVNldHRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5lbGVtKVxyXG4gICAgICAgICAgICB0aGlzLmVsZW0gPSB0aGlzLnJlbmRlcldpbmRvdyhyZXF1aXJlKGBodG1sLWxvYWRlciEuL3dpbmRvd2ApKTtcclxuXHJcbiAgICAgICAgdGhpcy5pbWdFbGVtID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJ2ltZy5pbWFnZV9faW1nLWVsZW1lbnQnKTtcclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fZGVzY3JpcHRpb24nKTtcclxuICAgICAgICB0aGlzLmRhdGUgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX19wb3N0LWRhdGUnKTtcclxuICAgICAgICB0aGlzLmltYWdlV3JhcHBlciA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2ltYWdlLXdyYXBwZXInKTtcclxuICAgICAgICB0aGlzLnNpZGVCYXIgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX19zaWRlYmFyJyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVCdXR0b25FbGVtID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fZGVsZXRlLWJ1dHRvbicpO1xyXG4gICAgICAgIHRoaXMuc3Vic2NyaWJlQnV0dG9uRWxlbSA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX3N1YnNjcmliZS1idXR0b24nKTtcclxuICAgICAgICB0aGlzLmF2YXRhciA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2F2YXRhcicpO1xyXG4gICAgICAgIHRoaXMudXNlcm5hbWUgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX191c2VybmFtZScpO1xyXG4gICAgICAgIHRoaXMuaGVhZGVyTGVmdFNpZGUgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX19oZWFkZXItbGVmdC1zaWRlJyk7XHJcbiAgICAgICAgdGhpcy5mdWxsc2NyZWVuQnV0dG9uID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fY29udHJvbC1mdWxsJyk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLmltZ0VsZW0ub25sb2FkID0gZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzaXplSW1hZ2UoKTtcclxuICAgICAgICAgICAgdGhpcy5zaG93SW1nRWxlbSgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbS5vbmNsaWNrID0gZSA9PiB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9uRWxlbUNsaWNrKGUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoJy5pbWFnZV9fbW9kYWwtY2xvc2UtYnV0dG9uLXdyYXBwZXInKSlcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoJy5pbWFnZV9fY29udHJvbC1wcmV2JykpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN3aXRjaFRvUHJldigpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoJy5pbWFnZV9fY29udHJvbC1uZXh0JykpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN3aXRjaFRvTmV4dCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0ID09PSB0aGlzLmZ1bGxzY3JlZW5CdXR0b24pXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN3aXRjaEZ1bGxzY3JlZW4oKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldC5tYXRjaGVzKCcuaW1hZ2VfX2Nsb3NlLXNwYWNlJykgfHwgZS50YXJnZXQubWF0Y2hlcygnLmltYWdlX19jbG9zZS1idXR0b24nKSlcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICBsZXQgQ29tbWVudFNlY3Rpb24gPSByZXF1aXJlKEJMT0NLUyArICdpbWFnZS1jb21tZW50LXNlY3Rpb24nKTtcclxuICAgICAgICBsZXQgTGlrZUJ1dHRvbiA9IHJlcXVpcmUoQkxPQ0tTICsgJ2xpa2UtYnV0dG9uJyk7XHJcblxyXG4gICAgICAgIHRoaXMuY29tbWVudFNlY3Rpb24gPSBuZXcgQ29tbWVudFNlY3Rpb24oe1xyXG4gICAgICAgICAgICBlbGVtOiB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmNvbW1lbnQtc2VjdGlvbicpLFxyXG4gICAgICAgICAgICBjb21tZW50U2VuZGVyRWxlbTogdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50LXNlbmQnKSxcclxuICAgICAgICAgICAgaW1hZ2VJZDogdGhpcy5jdXJyZW50SW1hZ2VJZCxcclxuICAgICAgICAgICAgbG9nZ2VkVXNlclZpZXdNb2RlbDogdGhpcy5sb2dnZWRVc2VyVmlld01vZGVsLFxyXG5cclxuICAgICAgICAgICAgY29tbWVudFNlY3Rpb25XcmFwcGVyOiB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX19jb21tZW50LXNlY3Rpb24td3JhcHBlcicpLFxyXG4gICAgICAgICAgICBpbmZvQm9hcmQ6IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2luZm8tYm9hcmQnKSxcclxuICAgICAgICAgICAgc2Nyb2xsYmFyV3JhcHBlcjogdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fY29tbWVudC1zZWN0aW9uLXNjcm9sbGJhci13cmFwcGVyJylcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb21tZW50U2VjdGlvbi5vbignY29tbWVudC1zZWN0aW9uX2NoYW5nZWQnLCBlID0+IHtcclxuICAgICAgICAgICAgbGV0IGltYWdlSWQgPSBlLmRldGFpbC5pbWFnZUlkO1xyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZVZpZXdNb2RlbChpbWFnZUlkKTtcclxuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0Vmlld01vZGVsKGltYWdlSWQpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDb21tZW50cyhpbWFnZUlkKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMubGlrZUJ1dHRvbiA9IG5ldyBMaWtlQnV0dG9uKHtcclxuICAgICAgICAgICAgZWxlbTogdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5saWtlLWJ1dHRvbicpLFxyXG4gICAgICAgICAgICBkYXRhOiB0aGlzLmN1cnJlbnRJbWFnZUlkXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMubGlrZUJ1dHRvbi5vbignc3dpdGNoLWJ1dHRvbl9jaGFuZ2VkJywgZSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpbWFnZUlkID0gZS5kZXRhaWwuaW1hZ2VJZDtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGVWaWV3TW9kZWwoaW1hZ2VJZCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdFZpZXdNb2RlbChpbWFnZUlkKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlTGlrZXMoaW1hZ2VJZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLm9uUmVzaXplKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzTG9nZ2VkKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRWaWV3TW9kZWwuaXNPd25JbWFnZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXREZWxldGVCdXR0b24oKTtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmUuZW5zdXJlKFtCTE9DS1MgKyAnZGVsZXRlLWltYWdlLWJ1dHRvbiddLCByZXF1aXJlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgRGVsZXRlSW1hZ2VCdXR0b24gPSByZXF1aXJlKEJMT0NLUyArICdkZWxldGUtaW1hZ2UtYnV0dG9uJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxldGVCdXR0b24gPSBuZXcgRGVsZXRlSW1hZ2VCdXR0b24oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtOiB0aGlzLmRlbGV0ZUJ1dHRvbkVsZW0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlSWQ6IHRoaXMuY3VycmVudEltYWdlSWRcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZUJ1dHRvbi5vbignZGVsZXRlLWltYWdlLWJ1dHRvbl9pbWFnZS1kZWxldGVkJywgZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbnZvbHZlZEltYWdlSWQgPSBlLmRldGFpbC5pbWFnZUlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZVZpZXdNb2RlbChpbnZvbHZlZEltYWdlSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUZyb21HYWxsZXJ5QXJyYXkoaW52b2x2ZWRJbWFnZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxldGVJbWFnZVByZXZpZXcoaW52b2x2ZWRJbWFnZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudEltYWdlSWQgPT09IGludm9sdmVkSW1hZ2VJZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3dpdGNoVG9OZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlLmVuc3VyZShbQkxPQ0tTICsgJ3N1YnNjcmliZS1idXR0b24nXSwgcmVxdWlyZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IFN1YnNjcmliZUJ1dHRvbiA9IHJlcXVpcmUoQkxPQ0tTICsgJ3N1YnNjcmliZS1idXR0b24nKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN1YnNjcmliZUJ1dHRvbiA9IG5ldyBTdWJzY3JpYmVCdXR0b24oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtOiB0aGlzLnN1YnNjcmliZUJ1dHRvbkVsZW0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRoaXMuY3VycmVudEltYWdlSWRcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudXNlclN1YnNjcmliZUJ1dHRvbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgU3dpdGNoQnV0dG9uLnNldFJlbGF0aW9uKHRoaXMuc3Vic2NyaWJlQnV0dG9uLCB0aGlzLnVzZXJTdWJzY3JpYmVCdXR0b24pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN1YnNjcmliZUJ1dHRvbi5vbignc3dpdGNoLWJ1dHRvbl9jaGFuZ2VkJywgZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbnZvbHZlZEltYWdlSWQgPSBlLmRldGFpbC5pbWFnZUlkO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNGZWVkICYmIGludm9sdmVkSW1hZ2VJZCA9PT0gdGhpcy5jdXJyZW50SW1hZ2VJZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmlld01vZGVscyA9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdWJzY3JpYmVCdXR0b24oKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN1YnNjcmliZUJ1dHRvbi5zZXQoe2FjdGl2ZTogdGhpcy5jdXJyZW50Vmlld01vZGVsLmF1dGhvci5pc05hcnJhdG9yfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVCdXR0b25FbGVtLm9uY2xpY2sgPSBlID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IobmV3IENsaWVudEVycm9yKG51bGwsIG51bGwsIDQwMSkpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuXHJcbn07XHJcblxyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuc3dpdGNoRnVsbHNjcmVlbiA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBmdW5jdGlvbiBnb0Z1bGxzY3JlZW4oZWxlbWVudCkge1xyXG4gICAgICAgIGlmIChlbGVtZW50LnJlcXVlc3RGdWxsc2NyZWVuKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQucmVxdWVzdEZ1bGxzY3JlZW4oKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4pIHtcclxuICAgICAgICAgICAgZWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbigpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5tb3pSZXF1ZXN0RnVsbHNjcmVlbikge1xyXG4gICAgICAgICAgICBlbGVtZW50Lm1velJlcXVlc3RGdWxsc2NyZWVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNhbmNlbEZ1bGxzY3JlZW4oKSB7XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmV4aXRGdWxsc2NyZWVuKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmV4aXRGdWxsc2NyZWVuKCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkb2N1bWVudC53ZWJraXRFeGl0RnVsbHNjcmVlbikge1xyXG4gICAgICAgICAgICBkb2N1bWVudC53ZWJraXRFeGl0RnVsbHNjcmVlbigpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQubW96RXhpdEZ1bGxzY3JlZW4pIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQubW96RXhpdEZ1bGxzY3JlZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGlmICghdGhpcy5pc0Z1bGxzY3JlZW4pIHtcclxuICAgICAgICBnb0Z1bGxzY3JlZW4odGhpcy5pbWFnZVdyYXBwZXIpO1xyXG4gICAgICAgIHRoaXMuaXNGdWxsc2NyZWVuID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmZ1bGxzY3JlZW5CdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnaWNvbi1hcnJvdy1tYXhpbWlzZScpO1xyXG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdpY29uLWFycm93LW1pbmltaXNlJyk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjYW5jZWxGdWxsc2NyZWVuKCk7XHJcbiAgICAgICAgdGhpcy5pc0Z1bGxzY3JlZW4gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmZ1bGxzY3JlZW5CdXR0b24uY2xhc3NMaXN0LmFkZCgnaWNvbi1hcnJvdy1tYXhpbWlzZScpO1xyXG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdpY29uLWFycm93LW1pbmltaXNlJyk7XHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnNldERlbGV0ZUJ1dHRvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZGVsZXRlQnV0dG9uRWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdidXR0b25faW52aXNpYmxlJyk7XHJcbiAgICB0aGlzLnN1YnNjcmliZUJ1dHRvbkVsZW0uY2xhc3NMaXN0LmFkZCgnYnV0dG9uX2ludmlzaWJsZScpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuc2V0U3Vic2NyaWJlQnV0dG9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5zdWJzY3JpYmVCdXR0b25FbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2J1dHRvbl9pbnZpc2libGUnKTtcclxuICAgIHRoaXMuZGVsZXRlQnV0dG9uRWxlbS5jbGFzc0xpc3QuYWRkKCdidXR0b25faW52aXNpYmxlJyk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS51cGRhdGVQcmVsb2FkZWRJbWFnZXNBcnJheSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IHRoaXMucHJlbG9hZEVudGl0eUNvdW50OyBpKyspIHtcclxuICAgICAgICBsZXQgbmV4dElkID0gdGhpcy5nZXROZXh0SW1hZ2VJZChpKTtcclxuICAgICAgICBsZXQgcHJldklkID0gdGhpcy5nZXROZXh0SW1hZ2VJZCgtaSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnZpZXdNb2RlbHNbbmV4dElkXSlcclxuICAgICAgICAgICAgdGhpcy5wcmVsb2FkZWRJbWFnZXNbaV0uc2V0QXR0cmlidXRlKCdzcmMnLCB0aGlzLnZpZXdNb2RlbHNbbmV4dElkXS5pbWdVcmwpO1xyXG4gICAgICAgIGlmICh0aGlzLnZpZXdNb2RlbHNbcHJldklkXSlcclxuICAgICAgICAgICAgdGhpcy5wcmVsb2FkZWRJbWFnZXNbLWldLnNldEF0dHJpYnV0ZSgnc3JjJywgdGhpcy52aWV3TW9kZWxzW3ByZXZJZF0uaW1nVXJsKTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7IC8vIDpcXFxyXG5cclxuXHJcblxyXG4gICAgbGV0IGltYWdlSWQ7XHJcbiAgICBsZXQgbm9QdXNoU3RhdGU7XHJcblxyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiYgdHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ251bWJlcicpIHtcclxuICAgICAgICBpbWFnZUlkID0gYXJndW1lbnRzWzBdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBpbWFnZUlkID0gb3B0aW9ucyAmJiBvcHRpb25zLmltYWdlSWQ7XHJcbiAgICAgICAgbm9QdXNoU3RhdGUgPSBvcHRpb25zICYmIG9wdGlvbnMubm9QdXNoU3RhdGUgfHwgZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNFbWJlZGRlZClcclxuICAgICAgICAgICAgTW9kYWwucHJvdG90eXBlLnNob3cuYXBwbHkodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMucmVxdWVzdFZpZXdNb2RlbChpbWFnZUlkKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50SW1hZ2VJZCA9IGltYWdlSWQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNFbGVtU2V0dGVkKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFbGVtKCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDdXJyZW50VmlldyhpbWFnZUlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2ltYWdlX2ludmlzaWJsZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghbm9QdXNoU3RhdGUgJiYgaW1hZ2VJZCA9PT0gdGhpcy5jdXJyZW50SW1hZ2VJZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoSW1hZ2VTdGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RBbGxOZWNlc3NhcnlWaWV3TW9kZWxzKCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUHJlbG9hZGVkSW1hZ2VzQXJyYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ3VycmVudFZpZXcoaW1hZ2VJZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2ltYWdlX2ludmlzaWJsZScpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFub1B1c2hTdGF0ZSAmJiBpbWFnZUlkID09PSB0aGlzLmN1cnJlbnRJbWFnZUlkKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaEltYWdlU3RhdGUoKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdEFsbE5lY2Vzc2FyeVZpZXdNb2RlbHMoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVByZWxvYWRlZEltYWdlc0FycmF5KCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5vblJlc2l6ZSgpO1xyXG4gICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0pO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdhdXRvJztcclxuXHJcblxyXG4gICAgbGV0IG5vUHVzaFN0YXRlID0gb3B0aW9ucyAmJiBvcHRpb25zLm5vUHVzaFN0YXRlO1xyXG4gICAgaWYgKCF0aGlzLmlzRW1iZWRkZWQpXHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID0gdGhpcy5lbGVtLmRhdGFzZXQuYXV0aG9yVXJsO1xyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgTW9kYWwucHJvdG90eXBlLmhpZGUuYXBwbHkodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdpbWFnZV9pbnZpc2libGUnKTtcclxuXHJcbiAgICAgICAgaWYgKCFub1B1c2hTdGF0ZSlcclxuICAgICAgICAgICAgdGhpcy5wdXNoR2FsbGVyeVN0YXRlKCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5oaWRlSW1nRWxlbSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdpbWFnZV9pbWctZWxlbWVudC1pbnZpc2libGUnKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnNob3dJbWdFbGVtID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2ltYWdlX2ltZy1lbGVtZW50LWludmlzaWJsZScpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUucmVzaXplSW1hZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyBpZiAodGhpcy5lbGVtKSB7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgIHRoaXMuaW1nRWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ3dpZHRoJyk7XHJcbiAgICAvLyAgICAgdGhpcy5pbWdFbGVtLnJlbW92ZUF0dHJpYnV0ZSgnaGVpZ2h0Jyk7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgIGlmICghdGhpcy5lbGVtLmNsYXNzTGlzdC5jb250YWlucygnaW1hZ2Vfc21hbGwnKSkge1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgaWYgKHRoaXMuaW1nRWxlbS5vZmZzZXRXaWR0aCA+PSB0aGlzLmltZ0VsZW0ub2Zmc2V0SGVpZ2h0KSB7XHJcbiAgICAvLyAgICAgICAgICAgICBpZiAodGhpcy5pbWFnZVdyYXBwZXIub2Zmc2V0SGVpZ2h0IDwgdGhpcy5pbWdFbGVtLm9mZnNldEhlaWdodClcclxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLmltZ0VsZW0uaGVpZ2h0ID0gdGhpcy5pbWFnZVdyYXBwZXIub2Zmc2V0SGVpZ2h0O1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgICAgIGlmICh0aGlzLmltYWdlV3JhcHBlci5vZmZzZXRXaWR0aCA+IHRoaXMuZWxlbS5vZmZzZXRXaWR0aCkge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuaW1nRWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2hlaWdodCcpO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuaW1nRWxlbS53aWR0aCA9IHRoaXMuZWxlbS5vZmZzZXRXaWR0aCAtIHRoaXMuc2lkZUJhci5vZmZzZXRXaWR0aDtcclxuICAgIC8vICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgfSBlbHNlIHtcclxuICAgIC8vICAgICAgICAgICAgIGlmICh0aGlzLmltYWdlV3JhcHBlci5vZmZzZXRXaWR0aCA+IHRoaXMuZWxlbS5vZmZzZXRXaWR0aClcclxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLmltZ0VsZW0ud2lkdGggPSB0aGlzLmVsZW0ub2Zmc2V0V2lkdGggLSB0aGlzLnNpZGVCYXIub2Zmc2V0V2lkdGg7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICAgICAgaWYgKHRoaXMuaW1hZ2VXcmFwcGVyLm9mZnNldEhlaWdodCA8IHRoaXMuaW1nRWxlbS5vZmZzZXRIZWlnaHQpIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLmltZ0VsZW0ucmVtb3ZlQXR0cmlidXRlKCd3aWR0aCcpO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuaW1nRWxlbS5oZWlnaHQgPSB0aGlzLmltYWdlV3JhcHBlci5vZmZzZXRIZWlnaHQ7XHJcbiAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICBpZiAodGhpcy5pbWFnZVdyYXBwZXIub2Zmc2V0V2lkdGggPiB0aGlzLmVsZW0ub2Zmc2V0V2lkdGgpIHtcclxuICAgIC8vICAgICAgICAgICAgIHRoaXMuaW1nRWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2hlaWdodCcpO1xyXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5pbWdFbGVtLndpZHRoID0gdGhpcy5lbGVtLm9mZnNldFdpZHRoO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy9cclxuICAgIC8vXHJcbiAgICAvLyB9XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5yZXF1ZXN0Vmlld01vZGVsID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgICAgICBpZiAodGhpcy52aWV3TW9kZWxzW2lkXSkge1xyXG4gICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBib2R5ID0ge1xyXG4gICAgICAgICAgICBpZCxcclxuICAgICAgICAgICAgaXNGZWVkOiB0aGlzLmlzRmVlZFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzTG9nZ2VkICYmICF0aGlzLmxvZ2dlZFVzZXJWaWV3TW9kZWwpXHJcbiAgICAgICAgICAgIGJvZHkucmVxdWlyZVVzZXJWaWV3TW9kZWwgPSB0cnVlO1xyXG5cclxuICAgICAgICByZXF1aXJlKExJQlMgKyAnc2VuZFJlcXVlc3QnKShib2R5LCAnUE9TVCcsICcvZ2FsbGVyeScsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBDbGllbnRFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmdhbGxlcnlBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUZyb21HYWxsZXJ5QXJyYXkoaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUdhbGxlcnkoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgSW1hZ2VOb3RGb3VuZCgpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FsbGVyeUFycmF5ID0gcmVzcG9uc2UuZ2FsbGVyeTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVHYWxsZXJ5KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0xvZ2dlZCAmJiAhdGhpcy5sb2dnZWRVc2VyVmlld01vZGVsICYmIHJlc3BvbnNlLmxvZ2dlZFVzZXJWaWV3TW9kZWwpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlZFVzZXJWaWV3TW9kZWwgPSByZXNwb25zZS5sb2dnZWRVc2VyVmlld01vZGVsO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGxldCBwcm92aWRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gcmVzcG9uc2Uudmlld01vZGVscykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PSBpZClcclxuICAgICAgICAgICAgICAgICAgICBwcm92aWRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3TW9kZWxzW2tleV0gPSByZXNwb25zZS52aWV3TW9kZWxzW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb3ZpZGVkKVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2FsbGVyeUFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVGcm9tR2FsbGVyeUFycmF5KGlkKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUdhbGxlcnkoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgSW1hZ2VOb3RGb3VuZCgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5yZW1vdmVGcm9tR2FsbGVyeUFycmF5ID0gZnVuY3Rpb24gKGlkKSB7XHJcblxyXG4gICAgdGhpcy5nYWxsZXJ5QXJyYXkgJiYgfnRoaXMuZ2FsbGVyeUFycmF5LmluZGV4T2YoaWQpICYmXHJcbiAgICB0aGlzLmdhbGxlcnlBcnJheS5zcGxpY2UodGhpcy5nYWxsZXJ5QXJyYXkuaW5kZXhPZihpZCksIDEpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuYWRkVG9HYWxsZXJ5QXJyYXkgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgIHRoaXMuZ2FsbGVyeUFycmF5ICYmIHRoaXMuZ2FsbGVyeUFycmF5LnB1c2goaWQpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUudXBkYXRlR2FsbGVyeSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLmdhbGxlcnlBcnJheSAmJiB0aGlzLmdhbGxlcnkpIHtcclxuICAgICAgICBsZXQgaW1hZ2VQcmV2aWV3cyA9IHRoaXMuZ2FsbGVyeS5xdWVyeVNlbGVjdG9yQWxsKCcuaW1hZ2UtcHJldmlldycpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW1hZ2VQcmV2aWV3cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoIX50aGlzLmdhbGxlcnlBcnJheS5pbmRleE9mKCtpbWFnZVByZXZpZXdzW2ldLmRhdGFzZXQuaWQpKVxyXG4gICAgICAgICAgICAgICAgaW1hZ2VQcmV2aWV3c1tpXS5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXRQdWJsaWNhdGlvbk51bWJlcih0aGlzLmdhbGxlcnlBcnJheS5sZW5ndGgpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuZ2V0SW1hZ2VQcmV2aWV3QnlJZCA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2FsbGVyeS5xdWVyeVNlbGVjdG9yKGAuaW1hZ2UtcHJldmlld1tkYXRhLWlkPVwiJHtpZH1cIl1gKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnVwZGF0ZUltYWdlUHJldmlld1RleHQgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgIGxldCBsaWtlQW1vdW50ID0gdGhpcy52aWV3TW9kZWxzW2lkXS5saWtlcy5sZW5ndGg7XHJcbiAgICBsZXQgY29tbWVudEFtb3VudCA9IHRoaXMudmlld01vZGVsc1tpZF0uY29tbWVudHMubGVuZ3RoO1xyXG4gICAgbGV0IHByZXZpZXdJbWFnZUVsZW0gPSB0aGlzLmdldEltYWdlUHJldmlld0J5SWQoaWQpO1xyXG4gICAgcHJldmlld0ltYWdlRWxlbS5kYXRhc2V0Lmxpa2VBbW91bnQgPSBsaWtlQW1vdW50O1xyXG4gICAgcHJldmlld0ltYWdlRWxlbS5kYXRhc2V0LmNvbW1lbnRBbW91bnQgPSBjb21tZW50QW1vdW50O1xyXG5cclxuICAgIHByZXZpZXdJbWFnZUVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlLXByZXZpZXdfX2NvbW1lbnQtbnVtYmVyJykudGV4dENvbnRlbnQgPSBjb21tZW50QW1vdW50O1xyXG4gICAgcHJldmlld0ltYWdlRWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2UtcHJldmlld19fbGlrZS1udW1iZXInKS50ZXh0Q29udGVudCA9IGxpa2VBbW91bnQ7XHJcblxyXG4gICAgcHJldmlld0ltYWdlRWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2UtcHJldmlld19fY29tbWVudC1zZWN0aW9uIC5pbWFnZS1wcmV2aWV3X19kZXNpZ25hdGlvbi10ZXh0JylcclxuICAgICAgICAudGV4dENvbnRlbnQgPSBnZXRDb3JyZWN0Tm91bkZvcm0oJ2NvbW1lbnQnLCBjb21tZW50QW1vdW50KTtcclxuICAgIHByZXZpZXdJbWFnZUVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlLXByZXZpZXdfX2xpa2Utc2VjdGlvbiAuaW1hZ2UtcHJldmlld19fZGVzaWduYXRpb24tdGV4dCcpXHJcbiAgICAgICAgLnRleHRDb250ZW50ID0gZ2V0Q29ycmVjdE5vdW5Gb3JtKCdsaWtlJywgbGlrZUFtb3VudCk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5kZWxldGVJbWFnZVByZXZpZXcgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgIGxldCBlbGVtID0gdGhpcy5nZXRJbWFnZVByZXZpZXdCeUlkKGlkKTtcclxuICAgIGlmIChlbGVtKSB7XHJcbiAgICAgICAgZWxlbS5yZW1vdmUoKTtcclxuICAgICAgICB0aGlzLnNldFB1YmxpY2F0aW9uTnVtYmVyKC0xLCB0cnVlKTtcclxuICAgIH1cclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLmluc2VydE5ld0ltYWdlUHJldmlldyA9IGZ1bmN0aW9uIChpbWFnZUlkLCBwcmV2aWV3VXJsKSB7XHJcbiAgICBsZXQgbmV3SW1hZ2VQcmV2aWV3ID0gdGhpcy5pbWFnZVByZXZpZXdHaG9zdC5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICBuZXdJbWFnZVByZXZpZXcuY2xhc3NMaXN0LnJlbW92ZSgnaW1hZ2UtcHJldmlld19naG9zdCcpO1xyXG5cclxuICAgIG5ld0ltYWdlUHJldmlldy5kYXRhc2V0LmlkID0gaW1hZ2VJZDtcclxuICAgIG5ld0ltYWdlUHJldmlldy5ocmVmID0gYC9pbWFnZS8ke2ltYWdlSWR9YDtcclxuICAgIG5ld0ltYWdlUHJldmlldy5xdWVyeVNlbGVjdG9yKCcuaW1hZ2UtcHJldmlld19fcGljdHVyZScpLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJy8ke3ByZXZpZXdVcmx9JylgO1xyXG5cclxuICAgIG5ld0ltYWdlUHJldmlldy5xdWVyeVNlbGVjdG9yKCcuaW1hZ2UtcHJldmlld19fY29tbWVudC1udW1iZXInKS50ZXh0Q29udGVudCA9IDA7XHJcbiAgICBuZXdJbWFnZVByZXZpZXcucXVlcnlTZWxlY3RvcignLmltYWdlLXByZXZpZXdfX2xpa2UtbnVtYmVyJykudGV4dENvbnRlbnQgPSAwO1xyXG5cclxuICAgIG5ld0ltYWdlUHJldmlldy5xdWVyeVNlbGVjdG9yKCcuaW1hZ2UtcHJldmlld19fY29tbWVudC1zZWN0aW9uIC5pbWFnZS1wcmV2aWV3X19kZXNpZ25hdGlvbi10ZXh0JylcclxuICAgICAgICAudGV4dENvbnRlbnQgPSAnY29tbWVudHMnO1xyXG4gICAgbmV3SW1hZ2VQcmV2aWV3LnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZS1wcmV2aWV3X19saWtlLXNlY3Rpb24gLmltYWdlLXByZXZpZXdfX2Rlc2lnbmF0aW9uLXRleHQnKVxyXG4gICAgICAgIC50ZXh0Q29udGVudCA9ICdsaWtlcyc7XHJcblxyXG4gICAgbmV3SW1hZ2VQcmV2aWV3LnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZS1wcmV2aWV3X191cGxvYWQtZGF0ZS10ZXh0JykudGV4dENvbnRlbnQgPSAnYSBmZXcgc2Vjb25kcyBhZ28nO1xyXG5cclxuICAgIHRoaXMuZ2FsbGVyeVdyYXBwZXIuYXBwZW5kQ2hpbGQobmV3SW1hZ2VQcmV2aWV3KTtcclxuXHJcbiAgICB0aGlzLnNldFB1YmxpY2F0aW9uTnVtYmVyKDEsIHRydWUpO1xyXG4gICAgdGhpcy5hZGRUb0dhbGxlcnlBcnJheShpbWFnZUlkKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnNldFB1YmxpY2F0aW9uTnVtYmVyID0gZnVuY3Rpb24gKHZhbHVlLCByZWxhdGl2ZSkge1xyXG4gICAgaWYgKHRoaXMucHVibGljYXRpb25zU3RhdEVsZW0pIHtcclxuICAgICAgICBsZXQgcHVibGljYXRpb25OdW1iZXJFbGVtID0gdGhpcy5wdWJsaWNhdGlvbnNTdGF0RWxlbS5xdWVyeVNlbGVjdG9yKCcuc3RhdF9fbnVtYmVyJyk7XHJcbiAgICAgICAgbGV0IHB1YmxpY2F0aW9uVGV4dEVsZW0gPSB0aGlzLnB1YmxpY2F0aW9uc1N0YXRFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5zdGF0X19jYXB0aW9uJyk7XHJcbiAgICAgICAgbGV0IG5ld1ZhbHVlID0gKHJlbGF0aXZlICYmIHB1YmxpY2F0aW9uTnVtYmVyRWxlbSkgPyAoK3B1YmxpY2F0aW9uTnVtYmVyRWxlbS50ZXh0Q29udGVudCArIHZhbHVlKSA6IHZhbHVlO1xyXG5cclxuICAgICAgICBwdWJsaWNhdGlvbk51bWJlckVsZW0udGV4dENvbnRlbnQgPSBuZXdWYWx1ZTtcclxuICAgICAgICBwdWJsaWNhdGlvblRleHRFbGVtLnRleHRDb250ZW50ID0gZ2V0Q29ycmVjdE5vdW5Gb3JtKCdwdWJsaWNhdGlvbicsIG5ld1ZhbHVlKTtcclxuICAgIH1cclxuXHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5kZWxldGVWaWV3TW9kZWwgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgIGRlbGV0ZSB0aGlzLnZpZXdNb2RlbHNbaWRdO1xyXG4gICAgY29uc29sZS5sb2coJ2RlbGV0ZSAjJyArIGlkKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnJlcXVlc3RBbGxOZWNlc3NhcnlWaWV3TW9kZWxzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFtcclxuICAgICAgICB0aGlzLnJlcXVlc3ROZXh0Vmlld01vZGVscygpLFxyXG4gICAgICAgIHRoaXMucmVxdWVzdFByZXZWaWV3TW9kZWxzKClcclxuICAgIF0pO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUucmVxdWVzdE5leHRWaWV3TW9kZWxzID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIGlmICh0aGlzLmdhbGxlcnlBcnJheSAmJiB0aGlzLmdhbGxlcnlBcnJheS5sZW5ndGggPT09IDApXHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBJbWFnZU5vdEZvdW5kKCkpO1xyXG5cclxuICAgIGxldCBwcm9taXNlcyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnByZWxvYWRFbnRpdHlDb3VudDsgaSsrKVxyXG4gICAgICAgIHByb21pc2VzLnB1c2godGhpcy5yZXF1ZXN0Vmlld01vZGVsKHRoaXMuZ2V0TmV4dEltYWdlSWQoaSkpKTtcclxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5yZXF1ZXN0UHJldlZpZXdNb2RlbHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5nYWxsZXJ5QXJyYXkgJiYgdGhpcy5nYWxsZXJ5QXJyYXkubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgSW1hZ2VOb3RGb3VuZCgpKTtcclxuICAgIGxldCBwcm9taXNlcyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnByZWxvYWRFbnRpdHlDb3VudDsgaSsrKVxyXG4gICAgICAgIHByb21pc2VzLnB1c2godGhpcy5yZXF1ZXN0Vmlld01vZGVsKHRoaXMuZ2V0UHJldkltYWdlSWQoaSkpKTtcclxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5zd2l0Y2hUb05leHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5nYWxsZXJ5QXJyYXkgJiYgIXRoaXMuZ2FsbGVyeUFycmF5Lmxlbmd0aCkge1xyXG4gICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgbmV4dEltYWdlSWQgPSB0aGlzLmdldE5leHRJbWFnZUlkKCk7XHJcbiAgICB0aGlzLnNob3cobmV4dEltYWdlSWQpLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIEltYWdlTm90Rm91bmQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ2FsbGVyeUFycmF5ICYmIHRoaXMuZ2FsbGVyeUFycmF5Lmxlbmd0aClcclxuICAgICAgICAgICAgICAgIHRoaXMuc3dpdGNoVG9OZXh0KCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmVycm9yKGVycik7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnN3aXRjaFRvUHJldiA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBpZiAodGhpcy5nYWxsZXJ5QXJyYXkgJiYgIXRoaXMuZ2FsbGVyeUFycmF5Lmxlbmd0aCkge1xyXG4gICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcHJldkltYWdlSWQgPSB0aGlzLmdldFByZXZJbWFnZUlkKCk7XHJcbiAgICB0aGlzLnNob3cocHJldkltYWdlSWQpLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIEltYWdlTm90Rm91bmQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ2FsbGVyeUFycmF5ICYmIHRoaXMuZ2FsbGVyeUFycmF5Lmxlbmd0aClcclxuICAgICAgICAgICAgICAgIHRoaXMuc3dpdGNoVG9QcmV2KCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmVycm9yKGVycik7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLmdldE5leHRJbWFnZUlkID0gZnVuY3Rpb24gKG9mZnNldCkge1xyXG4gICAgb2Zmc2V0ID0gb2Zmc2V0IHx8IDE7XHJcbiAgICBsZXQgaW5kZXggPSB0aGlzLmdhbGxlcnlBcnJheS5pbmRleE9mKHRoaXMuY3VycmVudEltYWdlSWQpO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmdhbGxlcnlBcnJheVsoaW5kZXggKyBvZmZzZXQpICUgdGhpcy5nYWxsZXJ5QXJyYXkubGVuZ3RoXTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLmdldFByZXZJbWFnZUlkID0gZnVuY3Rpb24gKG9mZnNldCkge1xyXG4gICAgb2Zmc2V0ID0gb2Zmc2V0IHx8IDE7XHJcblxyXG4gICAgbGV0IGluZGV4ID0gdGhpcy5nYWxsZXJ5QXJyYXkuaW5kZXhPZih0aGlzLmN1cnJlbnRJbWFnZUlkKTtcclxuXHJcbiAgICBpZiAofmluZGV4ICYmIHRoaXMuZ2FsbGVyeUFycmF5Lmxlbmd0aCA9PT0gMSlcclxuICAgICAgICByZXR1cm4gdGhpcy5nYWxsZXJ5QXJyYXlbMF07XHJcblxyXG4gICAgbGV0IGdhbGxlcnlQcmV2SW5kZXggPSBpbmRleCAtIG9mZnNldDtcclxuICAgIGlmIChnYWxsZXJ5UHJldkluZGV4IDwgMCkge1xyXG4gICAgICAgIGdhbGxlcnlQcmV2SW5kZXggJT0gdGhpcy5nYWxsZXJ5QXJyYXkubGVuZ3RoO1xyXG4gICAgICAgIGdhbGxlcnlQcmV2SW5kZXggPSB0aGlzLmdhbGxlcnlBcnJheS5sZW5ndGggKyBnYWxsZXJ5UHJldkluZGV4O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLmdhbGxlcnlBcnJheVtnYWxsZXJ5UHJldkluZGV4XTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnVwZGF0ZUN1cnJlbnRWaWV3ID0gZnVuY3Rpb24gKGludm9sdmVkSW1hZ2VJZCkge1xyXG5cclxuICAgIGlmIChpbnZvbHZlZEltYWdlSWQgPT09IHRoaXMuY3VycmVudEltYWdlSWQpIHtcclxuICAgICAgICB0aGlzLmhpZGVJbWdFbGVtKCk7XHJcblxyXG4gICAgICAgIHRoaXMuaW1nRWxlbS5zZXRBdHRyaWJ1dGUoJ3NyYycsIHRoaXMuY3VycmVudFZpZXdNb2RlbC5pbWdVcmwpO1xyXG5cclxuICAgICAgICB0aGlzLmxpa2VCdXR0b24uc2V0SW1hZ2VJZCh0aGlzLmN1cnJlbnRJbWFnZUlkKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUxpa2VzKHRoaXMuY3VycmVudEltYWdlSWQpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbW1lbnRTZWN0aW9uLnNldEltYWdlSWQodGhpcy5jdXJyZW50SW1hZ2VJZCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDb21tZW50cyh0aGlzLmN1cnJlbnRJbWFnZUlkKTtcclxuXHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbi50ZXh0Q29udGVudCA9IHRoaXMuY3VycmVudFZpZXdNb2RlbC5kZXNjcmlwdGlvbjtcclxuICAgICAgICBpZiAodGhpcy5kZXNjcmlwdGlvbi50ZXh0Q29udGVudCA9PT0gJycpXHJcbiAgICAgICAgICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdpbWFnZV9uby1kZXNjcmlwdGlvbicpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2ltYWdlX25vLWRlc2NyaXB0aW9uJyk7XHJcblxyXG4gICAgICAgIHRoaXMuZGF0ZS50ZXh0Q29udGVudCA9IHRoaXMuY3VycmVudFZpZXdNb2RlbC5jcmVhdGVEYXRlU3RyO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc0xvZ2dlZClcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFZpZXdNb2RlbC5pc093bkltYWdlKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWxldGVCdXR0b24uc2V0SW1hZ2VJZCh0aGlzLmN1cnJlbnRJbWFnZUlkKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVCdXR0b24uc2V0SW1hZ2VJZCh0aGlzLmN1cnJlbnRJbWFnZUlkKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNGZWVkKVxyXG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZUJ1dHRvbi5zZXQoe2FjdGl2ZTogdHJ1ZX0pO1xyXG5cclxuICAgICAgICB0aGlzLmF2YXRhci5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCcke3RoaXMuY3VycmVudFZpZXdNb2RlbC5hdXRob3IuYXZhdGFyVXJscy5tZWRpdW19JylgO1xyXG4gICAgICAgIHRoaXMudXNlcm5hbWUudGV4dENvbnRlbnQgPSB0aGlzLmN1cnJlbnRWaWV3TW9kZWwuYXV0aG9yLnVzZXJuYW1lO1xyXG5cclxuICAgICAgICB0aGlzLmhlYWRlckxlZnRTaWRlLnNldEF0dHJpYnV0ZSgnaHJlZicsIHRoaXMuY3VycmVudFZpZXdNb2RlbC5hdXRob3IudXJsKTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnVwZGF0ZUxpa2VzID0gZnVuY3Rpb24gKGltYWdlSWQpIHtcclxuICAgIGlmICh0aGlzLmN1cnJlbnRJbWFnZUlkID09PSBpbWFnZUlkKVxyXG4gICAgICAgIHRoaXMubGlrZUJ1dHRvbi5zZXQoe1xyXG4gICAgICAgICAgICBhY3RpdmU6IHRoaXMuY3VycmVudFZpZXdNb2RlbC5pc0xpa2VkLFxyXG4gICAgICAgICAgICBsaWtlQW1vdW50OiB0aGlzLmN1cnJlbnRWaWV3TW9kZWwubGlrZXMubGVuZ3RoXHJcbiAgICAgICAgfSk7XHJcbiAgICBpZiAodGhpcy5nYWxsZXJ5KVxyXG4gICAgICAgIHRoaXMudXBkYXRlSW1hZ2VQcmV2aWV3VGV4dChpbWFnZUlkKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnVwZGF0ZUNvbW1lbnRzID0gZnVuY3Rpb24gKGltYWdlSWQpIHtcclxuICAgIGlmICh0aGlzLmN1cnJlbnRJbWFnZUlkID09PSBpbWFnZUlkKVxyXG4gICAgICAgIHRoaXMuY29tbWVudFNlY3Rpb24uc2V0KHRoaXMuY3VycmVudFZpZXdNb2RlbC5jb21tZW50cyk7XHJcbiAgICBpZiAodGhpcy5nYWxsZXJ5KVxyXG4gICAgICAgIHRoaXMudXBkYXRlSW1hZ2VQcmV2aWV3VGV4dChpbWFnZUlkKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnB1c2hJbWFnZVN0YXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaGlzdG9yeS5wdXNoU3RhdGUoe1xyXG4gICAgICAgIHR5cGU6ICdpbWFnZScsXHJcbiAgICAgICAgaWQ6IHRoaXMuY3VycmVudEltYWdlSWRcclxuICAgIH0sICdpbWFnZSAjJyArIHRoaXMuY3VycmVudEltYWdlSWQsICcvaW1hZ2UvJyArIHRoaXMuY3VycmVudEltYWdlSWQpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUucHVzaEdhbGxlcnlTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBsZXQgdXJsID0gJyc7XHJcbiAgICBpZiAoIXRoaXMuaXNGZWVkKVxyXG4gICAgICAgIHVybCA9IHRoaXMuY3VycmVudFZpZXdNb2RlbCAmJiB0aGlzLmN1cnJlbnRWaWV3TW9kZWwuYXV0aG9yLnVybDtcclxuICAgIGVsc2VcclxuICAgICAgICB1cmwgPSAnL2ZlZWQnO1xyXG5cclxuICAgIGhpc3RvcnkucHVzaFN0YXRlKHtcclxuICAgICAgICB0eXBlOiAnZ2FsbGVyeSdcclxuICAgIH0sICcnLCB1cmwpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUub25Qb3BTdGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZSkge1xyXG5cclxuICAgIGlmIChzdGF0ZSAmJiBzdGF0ZS50eXBlKVxyXG4gICAgICAgIHN3aXRjaCAoc3RhdGUudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdpbWFnZSc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3coe1xyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlSWQ6IHN0YXRlLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIG5vUHVzaFN0YXRlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAnZ2FsbGVyeSc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlYWN0aXZhdGUobnVsbCwge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vUHVzaFN0YXRlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxufTtcclxuXHJcbmZvciAobGV0IGtleSBpbiBldmVudE1peGluKVxyXG4gICAgR2FsbGVyeS5wcm90b3R5cGVba2V5XSA9IGV2ZW50TWl4aW5ba2V5XTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FsbGVyeTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9nYWxsZXJ5L2luZGV4LmpzIiwibGV0IGV2ZW50TWl4aW4gPSByZXF1aXJlKExJQlMgKyAnZXZlbnRNaXhpbicpO1xyXG5cclxubGV0IFN3aXRjaEJ1dHRvbiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLmVsZW0gPSBvcHRpb25zLmVsZW07XHJcbiAgICB0aGlzLmRhdGEgPSBvcHRpb25zLmRhdGE7XHJcbiAgICB0aGlzLmRhdGFTdHIgPSBvcHRpb25zLmRhdGFTdHIgfHwgJ2ltYWdlSWQnO1xyXG5cclxuICAgIHRoaXMudGV4dEVsZW0gPSBvcHRpb25zLnRleHRFbGVtIHx8IHRoaXMuZWxlbTtcclxuXHJcbiAgICBTd2l0Y2hCdXR0b24ucHJvdG90eXBlLnNldC5jYWxsKHRoaXMsIHthY3RpdmU6ICEhdGhpcy5lbGVtLmRhdGFzZXQuYWN0aXZlfSk7XHJcbiAgICB0aGlzLmF2YWlsYWJsZSA9IHRydWU7XHJcblxyXG4gICAgdGhpcy5lbGVtLm9uY2xpY2sgPSBlID0+IHRoaXMub25DbGljayhlKTtcclxufTtcclxuXHJcblN3aXRjaEJ1dHRvbi5wcm90b3R5cGUub25DbGljayA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICBsZXQgaW52b2x2ZWREYXRhID0gdGhpcy5kYXRhO1xyXG5cclxuICAgIGlmICh0aGlzLmF2YWlsYWJsZSkge1xyXG5cclxuICAgICAgICB0aGlzLmF2YWlsYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlKCk7XHJcblxyXG4gICAgICAgIHJlcXVpcmUoTElCUyArICdzZW5kUmVxdWVzdCcpKHtcclxuICAgICAgICAgICAgW3RoaXMuZGF0YVN0cl06IGludm9sdmVkRGF0YVxyXG4gICAgICAgIH0sICdQT1NUJywgdGhpcy51cmwsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWVycikge1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlcignc3dpdGNoLWJ1dHRvbl9jaGFuZ2VkJywge1xyXG4gICAgICAgICAgICAgICAgICAgIFt0aGlzLmRhdGFTdHJdOiBpbnZvbHZlZERhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRhdGEgPT09IGludm9sdmVkRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuU3dpdGNoQnV0dG9uLnNldFJlbGF0aW9uID0gZnVuY3Rpb24gKHN3aXRjaEJ1dHRvbjEsIHN3aXRjaEJ1dHRvbjIpIHtcclxuICAgIHN3aXRjaEJ1dHRvbjEub24oJ3N3aXRjaC1idXR0b25fY2hhbmdlZCcsIGUgPT4ge1xyXG4gICAgICAgIHN3aXRjaEJ1dHRvbjIuc2V0KGUuZGV0YWlsLnJlc3BvbnNlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHN3aXRjaEJ1dHRvbjIub24oJ3N3aXRjaC1idXR0b25fY2hhbmdlZCcsIGUgPT4ge1xyXG4gICAgICAgIHN3aXRjaEJ1dHRvbjEuc2V0KGUuZGV0YWlsLnJlc3BvbnNlKTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuU3dpdGNoQnV0dG9uLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgaWYgKG9wdGlvbnMuYWN0aXZlKVxyXG4gICAgICAgIHRoaXMuX2FjdGl2YXRlKCk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5fZGVhY3RpdmF0ZSgpO1xyXG59O1xyXG5cclxuU3dpdGNoQnV0dG9uLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5hY3RpdmUpXHJcbiAgICAgICAgdGhpcy5zZXQoe2FjdGl2ZTogZmFsc2V9KTtcclxuICAgIGVsc2VcclxuICAgICAgICB0aGlzLnNldCh7YWN0aXZlOiB0cnVlfSk7XHJcbn07XHJcblxyXG5Td2l0Y2hCdXR0b24ucHJvdG90eXBlLl9hY3RpdmF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdidXR0b25fYWN0aXZlJyk7XHJcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XHJcblxyXG4gICAgdGhpcy50ZXh0RWxlbSAmJiB0aGlzLmFjdGl2ZVRleHQgJiYgKHRoaXMudGV4dEVsZW0udGV4dENvbnRlbnQgPSB0aGlzLmFjdGl2ZVRleHQpO1xyXG59O1xyXG5cclxuU3dpdGNoQnV0dG9uLnByb3RvdHlwZS5fZGVhY3RpdmF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdidXR0b25fYWN0aXZlJyk7XHJcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG5cclxuICAgIHRoaXMudGV4dEVsZW0gJiYgdGhpcy5pbmFjdGl2ZVRleHQgJiYgKHRoaXMudGV4dEVsZW0udGV4dENvbnRlbnQgPSB0aGlzLmluYWN0aXZlVGV4dCk7XHJcbn07XHJcblxyXG5Td2l0Y2hCdXR0b24ucHJvdG90eXBlLnNldEltYWdlSWQgPSBmdW5jdGlvbiAoaW1hZ2VJZCkge1xyXG4gICAgdGhpcy5kYXRhID0gaW1hZ2VJZDtcclxufTtcclxuXHJcbmZvciAobGV0IGtleSBpbiBldmVudE1peGluKVxyXG4gICAgU3dpdGNoQnV0dG9uLnByb3RvdHlwZVtrZXldID0gZXZlbnRNaXhpbltrZXldO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTd2l0Y2hCdXR0b247XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9zd2l0Y2gtYnV0dG9uL2luZGV4LmpzIiwibGV0IGdldENvcnJlY3ROb3VuRm9ybSA9IGZ1bmN0aW9uIChzaW5nbGVGb3JtLCBhbW91bnQpIHtcclxuICAgIHJldHVybiBzaW5nbGVGb3JtICsgKChhbW91bnQgPT09IDEpID8gJycgOiAncycpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnZXRDb3JyZWN0Tm91bkZvcm07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2dldENvcnJlY3ROb3VuRm9ybS5qcyIsIm1vZHVsZS5leHBvcnRzID0gXCI8ZGl2IGlkPVxcXCJpbWFnZVxcXCIgY2xhc3M9XFxcIm1vZGFsIGltYWdlX2ltZy1lbGVtZW50LWludmlzaWJsZSBpbWFnZSBpbWFnZV9uby1kZXNjcmlwdGlvblxcXCI+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19pbWFnZS13cmFwcGVyXFxcIj5cXHJcXG4gICAgICAgIDxkaXYgaWQ9XFxcInNwaW5uZXJcXFwiIGNsYXNzPVxcXCJzcGlubmVyIGltYWdlX19zcGlubmVyXFxcIj5cXHJcXG4gICAgICAgIFxcclxcbiAgICAgICAgPC9kaXY+ICAgICAgICA8aW1nIGNsYXNzPVxcXCJpbWFnZV9faW1nLWVsZW1lbnRcXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2NvbnRyb2xzXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fY29udHJvbCBpbWFnZV9fY29udHJvbC1wcmV2IGljb24tYXJyb3ctbGVmdFxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2NvbnRyb2wgaW1hZ2VfX2NvbnRyb2wtZnVsbCBpY29uLWFycm93LW1heGltaXNlXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fY29udHJvbCBpbWFnZV9fY29udHJvbC1uZXh0IGljb24tYXJyb3ctcmlnaHRcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fc2lkZWJhclxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fdG9wLXNpZGVcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImhlYWRlciBpbWFnZV9faGVhZGVyXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGEgY2xhc3M9XFxcImltYWdlX19oZWFkZXItbGVmdC1zaWRlXFxcIiBocmVmPVxcXCJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2F2YXRhclxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9XFxcImJhY2tncm91bmQtaW1hZ2U6IHVybCgnJylcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX21ldGFkYXRhXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fdXNlcm5hbWVcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19wb3N0LWRhdGVcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDwvYT5cXHJcXG5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uIGJ1dHRvbl9pbnZpc2libGUgaW1hZ2VfX3RvcC1zaWRlLWJ1dHRvbiBpbWFnZV9fZGVsZXRlLWJ1dHRvbiBidXR0b25faGVhZGVyLXN0eWxlXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZVxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdlxcclxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XFxcImJ1dHRvbiBpbWFnZV9fdG9wLXNpZGUtYnV0dG9uIGltYWdlX19zdWJzY3JpYmUtYnV0dG9uIGJ1dHRvbl9oZWFkZXItc3R5bGVcXFwiXFxyXFxuICAgICAgICAgICAgICAgID5cXHJcXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZVxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9faW5mby1ib2FyZFxcXCI+XFxyXFxuXFxyXFxuICAgICAgICAgICAgICAgIDxkaXZcXHJcXG4gICAgICAgICAgICAgICAgXFxyXFxuICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XFxcImJ1dHRvbiBsaWtlLWJ1dHRvbiBpbWFnZV9fbGlrZS1idXR0b25cXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGlrZS1idXR0b25fX2hlYXJ0IGljb24taGVhcnRcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGlrZS1idXR0b25fX2hlYXJ0IGljb24taGVhcnQtb3V0bGluZWRcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgJm5ic3A7bGlrZSZuYnNwO1xcclxcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcImxpa2UtYnV0dG9uX19saWtlLWFtb3VudFxcXCI+PC9zcGFuPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2Rlc2NyaXB0aW9uXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIFxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fY29tbWVudC1zZWN0aW9uLXdyYXBwZXIgaW1hZ2Vfbm8tc2Nyb2xsYmFyXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudC1zZWN0aW9uIGltYWdlX19jb21tZW50LXNlY3Rpb25cXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudC1zZWN0aW9uX19uby1jb21tZW50cy1ibG9ja1xcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgVGhlcmUgYXJlIG5vIGNvbW1lbnRzIHlldFxcclxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb21tZW50LXNlY3Rpb25fX2NvbW1lbnRzLXdyYXBwZXJcXFwiPlxcclxcblxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJwYW5lbCBjb21tZW50IGNvbW1lbnQtc2VjdGlvbl9fY29tbWVudCBjb21tZW50X2dob3N0XFxcIiBkYXRhLWlkPVxcXCJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudF9fdG9wLXNpZGVcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVxcXCJjb21tZW50X19yZWZcXFwiIGhyZWY9XFxcIlxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnRfX2F2YXRhclxcXCIgc3R5bGU9XFxcImJhY2tncm91bmQtaW1hZ2U6IHVybCgnJylcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb21tZW50X19tZXRhZGF0YVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb21tZW50X191c2VybmFtZVxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb21tZW50X19kYXRlXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnRfX2Nsb3NlLWJ1dHRvbiBpY29uLWNyb3NzXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudF9fdGV4dFxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19jb21tZW50LXNlY3Rpb24tc2Nyb2xsYmFyLXdyYXBwZXIgaW1hZ2Vfbm8tc2Nyb2xsYmFyXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2NvbW1lbnQtc2VjdGlvbi1zY3JvbGxiYXItb2Zmc2V0XFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2NvbW1lbnQtc2VjdGlvbi1zY3JvbGxiYXJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2NvbW1lbnQtc2VjdGlvbi1zbGlkZXJcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwicGFuZWwgY29tbWVudCBjb21tZW50LXNlbmQgaW1hZ2VfX2NvbW1lbnQtc2VuZFxcXCJcXHJcXG4gICAgICAgICAgICAgZGF0YS1pbWFnZS1pZD1cXFwiXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb21tZW50X190b3Atc2lkZVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnRfX2F2YXRhclxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnRfX3VzZXJuYW1lXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgICAgICA8dGV4dGFyZWEgcGxhY2Vob2xkZXI9XFxcInNoYXJlIHlvdXIgb3BpbmlvbuKAplxcXCIgY2xhc3M9XFxcImNvbW1lbnQtc2VuZF9fdGV4dGFyZWFcXFwiPjwvdGV4dGFyZWE+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uIGNvbW1lbnQtc2VuZF9fc2VuZC1idXR0b25cXFwiPnNlbmQ8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX21vZGFsLWNsb3NlLWJ1dHRvbi13cmFwcGVyXFxcIj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImljb24tY3Jvc3MgbW9kYWwtY2xvc2UtYnV0dG9uIGltYWdlX19tb2RhbC1jbG9zZS1idXR0b25cXFwiPjwvZGl2PiAgICA8L2Rpdj5cXHJcXG5cXHJcXG48L2Rpdj5cXHJcXG5cXHJcXG5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svfi9odG1sLWxvYWRlciEuLi9ibG9ja3MvZ2FsbGVyeS93aW5kb3dcbi8vIG1vZHVsZSBpZCA9IDMzXG4vLyBtb2R1bGUgY2h1bmtzID0gMyA4IDEzIiwibGV0IENvbW1lbnRTZWN0aW9uID0gcmVxdWlyZShCTE9DS1MgKyAnY29tbWVudC1zZWN0aW9uJyk7XHJcblxyXG5sZXQgSW1hZ2VDb21tZW50U2VjdGlvbiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBDb21tZW50U2VjdGlvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cclxuICAgIHRoaXMuY29tbWVudFNlY3Rpb25XcmFwcGVyID0gb3B0aW9ucy5jb21tZW50U2VjdGlvbldyYXBwZXI7XHJcbiAgICB0aGlzLmluZm9Cb2FyZCA9IG9wdGlvbnMuaW5mb0JvYXJkO1xyXG4gICAgdGhpcy5zY3JvbGxiYXJXcmFwcGVyID0gb3B0aW9ucy5zY3JvbGxiYXJXcmFwcGVyO1xyXG4gICAgdGhpcy5zY3JvbGxiYXIgPSB0aGlzLnNjcm9sbGJhcldyYXBwZXIucXVlcnlTZWxlY3RvcignLmltYWdlX19jb21tZW50LXNlY3Rpb24tc2Nyb2xsYmFyJyk7XHJcbiAgICB0aGlzLnNjcm9sbGJhck9mZnNldCA9IHRoaXMuc2Nyb2xsYmFyV3JhcHBlci5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2NvbW1lbnQtc2VjdGlvbi1zY3JvbGxiYXItb2Zmc2V0Jyk7XHJcbiAgICB0aGlzLnNjcm9sbGJhclNsaWRlciA9IHRoaXMuc2Nyb2xsYmFyV3JhcHBlci5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2NvbW1lbnQtc2VjdGlvbi1zbGlkZXInKTtcclxuXHJcbiAgICB0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlci5vbnNjcm9sbCA9IGUgPT4ge1xyXG4gICAgICAgIGlmICghdGhpcy5vbkRyYWdnaW5nKVxyXG4gICAgICAgICAgICB0aGlzLnNldFRvcCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnNjcm9sbGJhclNsaWRlci5vbm1vdXNlZG93biA9IGUgPT4ge1xyXG5cclxuICAgICAgICB0aGlzLm9uRHJhZ2dpbmcgPSB0cnVlO1xyXG4gICAgICAgIGxldCBzbGlkZXJDb29yZHMgPSBnZXRDb29yZHModGhpcy5zY3JvbGxiYXJTbGlkZXIpO1xyXG4gICAgICAgIGxldCBzaGlmdFkgPSBlLnBhZ2VZIC0gc2xpZGVyQ29vcmRzLnRvcDtcclxuICAgICAgICBsZXQgc2Nyb2xsYmFyQ29vcmRzID0gZ2V0Q29vcmRzKHRoaXMuc2Nyb2xsYmFyKTtcclxuICAgICAgICBsZXQgbmV3VG9wO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5vbm1vdXNlbW92ZSA9IGUgPT4ge1xyXG4gICAgICAgICAgICBuZXdUb3AgPSBlLnBhZ2VZIC0gc2hpZnRZIC0gc2Nyb2xsYmFyQ29vcmRzLnRvcDtcclxuICAgICAgICAgICAgaWYgKG5ld1RvcCA8IDApIG5ld1RvcCA9IDA7XHJcbiAgICAgICAgICAgIGxldCBib3R0b21FZGdlID0gdGhpcy5zY3JvbGxiYXIub2Zmc2V0SGVpZ2h0IC0gdGhpcy5zY3JvbGxiYXJTbGlkZXIub2Zmc2V0SGVpZ2h0O1xyXG4gICAgICAgICAgICBpZiAobmV3VG9wID4gYm90dG9tRWRnZSkgbmV3VG9wID0gYm90dG9tRWRnZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYmFyU2xpZGVyLnN0eWxlLnRvcCA9IG5ld1RvcCArICdweCc7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlci5zY3JvbGxUb3AgPSAobmV3VG9wIC8gdGhpcy5zY3JvbGxiYXIub2Zmc2V0SGVpZ2h0KSAvICgxIC0gdGhpcy5zbGlkZXJTaXplUmF0ZSkgKlxyXG4gICAgICAgICAgICAgICAgKHRoaXMuY29tbWVudFNlY3Rpb25XcmFwcGVyLnNjcm9sbEhlaWdodCAtIHRoaXMuY29tbWVudFNlY3Rpb25XcmFwcGVyLm9mZnNldEhlaWdodCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQub25tb3VzZXVwID0gZSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdvbm1vdXNldXAnLCBuZXdUb3AsIHRoaXMuc2Nyb2xsYmFyLm9mZnNldEhlaWdodCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYmFyU2xpZGVyLnN0eWxlLnRvcCA9IChuZXdUb3AgKiAxMDAgLyB0aGlzLnNjcm9sbGJhci5vZmZzZXRIZWlnaHQpICsgJyUnO1xyXG4gICAgICAgICAgICB0aGlzLm9uRHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgZG9jdW1lbnQub25tb3VzZW1vdmUgPSBkb2N1bWVudC5vbm1vdXNldXAgPSBudWxsO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTsgLy8gZGlzYWJsZSBzZWxlY3Rpb24gc3RhcnQgKGN1cnNvciBjaGFuZ2UpXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuc2Nyb2xsYmFyU2xpZGVyLm9uZHJhZ3N0YXJ0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0Q29vcmRzKGVsZW0pIHsgLy8g0LrRgNC+0LzQtSBJRTgtXHJcbiAgICAgICAgbGV0IGJveCA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHRvcDogYm94LnRvcCArIHBhZ2VZT2Zmc2V0LFxyXG4gICAgICAgICAgICBsZWZ0OiBib3gubGVmdCArIHBhZ2VYT2Zmc2V0XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG59O1xyXG5JbWFnZUNvbW1lbnRTZWN0aW9uLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlKTtcclxuSW1hZ2VDb21tZW50U2VjdGlvbi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBJbWFnZUNvbW1lbnRTZWN0aW9uO1xyXG5cclxuSW1hZ2VDb21tZW50U2VjdGlvbi5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlLnNldC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgdGhpcy51cGRhdGUoKTtcclxufTtcclxuXHJcbkltYWdlQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlLnNldFRvcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBzY3JvbGxSYXRlID0gKHRoaXMuY29tbWVudFNlY3Rpb25XcmFwcGVyLnNjcm9sbFRvcCkgL1xyXG4gICAgICAgICh0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlci5zY3JvbGxIZWlnaHQgLSB0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlci5vZmZzZXRIZWlnaHQpICogMTAwO1xyXG5cclxuICAgIHRoaXMuc2Nyb2xsYmFyU2xpZGVyLnN0eWxlLnRvcCA9IGAkeygxIC0gdGhpcy5zbGlkZXJTaXplUmF0ZSkgKiBzY3JvbGxSYXRlfSVgO1xyXG5cclxufTtcclxuXHJcbkltYWdlQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuY29tbWVudFNlY3Rpb25XcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2ltYWdlX25vLXNjcm9sbGJhcicpO1xyXG4gICAgdGhpcy5zY3JvbGxiYXJXcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2ltYWdlX25vLXNjcm9sbGJhcicpO1xyXG5cclxuICAgIHRoaXMuaW5mb0JvYXJkSGVpZ2h0ID0gdGhpcy5pbmZvQm9hcmQub2Zmc2V0SGVpZ2h0O1xyXG5cclxuICAgIGxldCBjb21wdXRlZFN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmluZm9Cb2FyZCk7XHJcbiAgICBwYXJzZUZsb2F0KGNvbXB1dGVkU3R5bGUuaGVpZ2h0KSAmJiAodGhpcy5pbmZvQm9hcmRIZWlnaHQgPSBwYXJzZUZsb2F0KGNvbXB1dGVkU3R5bGUuaGVpZ2h0KSk7XHJcblxyXG4gICAgdGhpcy5zY3JvbGxiYXJPZmZzZXQuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5pbmZvQm9hcmRIZWlnaHR9cHhgO1xyXG4gICAgdGhpcy5zY3JvbGxiYXIuc3R5bGUuaGVpZ2h0ID0gYGNhbGMoMTAwJSAtICR7dGhpcy5pbmZvQm9hcmRIZWlnaHR9cHgpYDtcclxuXHJcbiAgICBpZiAodGhpcy5jb21tZW50U2VjdGlvbldyYXBwZXIub2Zmc2V0SGVpZ2h0IC0gdGhpcy5jb21tZW50c1dyYXBwZXIuc2Nyb2xsSGVpZ2h0IDwgLTEpIHtcclxuICAgICAgICB0aGlzLnNsaWRlclNpemVSYXRlID0gdGhpcy5jb21tZW50U2VjdGlvbldyYXBwZXIub2Zmc2V0SGVpZ2h0IC8gdGhpcy5jb21tZW50c1dyYXBwZXIuc2Nyb2xsSGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyU2xpZGVyLnN0eWxlLmhlaWdodCA9IGAke3RoaXMuc2xpZGVyU2l6ZVJhdGUgKiAxMDB9JWA7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VG9wKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29tbWVudFNlY3Rpb25XcmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2ltYWdlX25vLXNjcm9sbGJhcicpO1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyV3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCdpbWFnZV9uby1zY3JvbGxiYXInKTtcclxuICAgIH1cclxuXHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbWFnZUNvbW1lbnRTZWN0aW9uO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvaW1hZ2UtY29tbWVudC1zZWN0aW9uL2luZGV4LmpzIiwibGV0IGV2ZW50TWl4aW4gPSByZXF1aXJlKExJQlMgKyAnZXZlbnRNaXhpbicpO1xyXG5cclxubGV0IENvbW1lbnRTZWN0aW9uID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICB0aGlzLmVsZW0gPSBvcHRpb25zLmVsZW07XHJcbiAgICB0aGlzLmNvbW1lbnRzV3JhcHBlciA9IG9wdGlvbnMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuY29tbWVudC1zZWN0aW9uX19jb21tZW50cy13cmFwcGVyJyk7XHJcbiAgICB0aGlzLmltYWdlSWQgPSBvcHRpb25zLmltYWdlSWQ7XHJcbiAgICB0aGlzLmxvZ2dlZFVzZXJWaWV3TW9kZWwgPSBvcHRpb25zLmxvZ2dlZFVzZXJWaWV3TW9kZWw7XHJcblxyXG4gICAgdGhpcy5jb21tZW50U2VuZGVyRWxlbSA9IG9wdGlvbnMuY29tbWVudFNlbmRlckVsZW07XHJcbiAgICB0aGlzLmNvbW1lbnRTZW5kVGV4dGFyZWEgPSB0aGlzLmNvbW1lbnRTZW5kZXJFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50LXNlbmRfX3RleHRhcmVhJyk7XHJcblxyXG4gICAgdGhpcy5naG9zdCA9IHRoaXMuY29tbWVudHNXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50Jyk7XHJcblxyXG4gICAgaWYgKHRoaXMubG9nZ2VkVXNlclZpZXdNb2RlbCkge1xyXG4gICAgICAgIHRoaXMuY29tbWVudFNlbmRlckVsZW0ucXVlcnlTZWxlY3RvcignLmNvbW1lbnRfX2F2YXRhcicpLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJyR7dGhpcy5sb2dnZWRVc2VyVmlld01vZGVsLmF2YXRhclVybHMubWVkaXVtfScpYDtcclxuICAgICAgICB0aGlzLmNvbW1lbnRTZW5kZXJFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50X191c2VybmFtZScpLnRleHRDb250ZW50ID0gdGhpcy5sb2dnZWRVc2VyVmlld01vZGVsLnVzZXJuYW1lO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvbW1lbnRTZW5kZXJFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50X19hdmF0YXInKS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCcke0FOT05fQVZBVEFSX1VSTH0nKWA7XHJcbiAgICAgICAgdGhpcy5jb21tZW50U2VuZGVyRWxlbS5xdWVyeVNlbGVjdG9yKCcuY29tbWVudF9fdXNlcm5hbWUnKS50ZXh0Q29udGVudCA9IEFOT05fTkFNRTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNvbW1lbnRTZW5kZXJFbGVtLm9uY2xpY2sgPSBlID0+IHtcclxuICAgICAgICBpZiAoIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnY29tbWVudC1zZW5kX19zZW5kLWJ1dHRvbicpKSByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCBpbnZvbHZlZEltYWdlSWQgPSB0aGlzLmltYWdlSWQ7XHJcbiAgICAgICAgbGV0IHRleHQgPSB0aGlzLmNvbW1lbnRTZW5kVGV4dGFyZWEudmFsdWU7XHJcbiAgICAgICAgaWYgKHRleHQubGVuZ3RoKSB7XHJcblxyXG4gICAgICAgICAgICByZXF1aXJlKExJQlMgKyAnc2VuZFJlcXVlc3QnKSh7XHJcbiAgICAgICAgICAgICAgICBpZDogaW52b2x2ZWRJbWFnZUlkLFxyXG4gICAgICAgICAgICAgICAgdGV4dFxyXG4gICAgICAgICAgICB9LCAnUE9TVCcsICcvY29tbWVudCcsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21tZW50U2VuZFRleHRhcmVhLnZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbWFnZUlkID09PSBpbnZvbHZlZEltYWdlSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluc2VydE5ld0NvbW1lbnQocmVzcG9uc2Uudmlld01vZGVsKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvQm90dG9tKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCdjb21tZW50LXNlY3Rpb25fY2hhbmdlZCcsIHtcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZUlkOiBpbnZvbHZlZEltYWdlSWRcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmVsZW0ub25jbGljayA9IGUgPT4ge1xyXG4gICAgICAgIGlmICghZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb21tZW50X19jbG9zZS1idXR0b24nKSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgY29tbWVudCA9IGUudGFyZ2V0LmNsb3Nlc3QoJy5jb21tZW50Jyk7XHJcbiAgICAgICAgbGV0IGNvbW1lbnRJZCA9IGNvbW1lbnQuZGF0YXNldC5pZDtcclxuICAgICAgICBsZXQgaW52b2x2ZWRJbWFnZUlkID0gdGhpcy5pbWFnZUlkO1xyXG5cclxuICAgICAgICByZXF1aXJlKExJQlMgKyAnc2VuZFJlcXVlc3QnKSh7XHJcbiAgICAgICAgICAgIGlkOiBjb21tZW50SWRcclxuICAgICAgICB9LCAnREVMRVRFJywgJy9jb21tZW50JywgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ2NvbW1lbnQtc2VjdGlvbl9jaGFuZ2VkJywge1xyXG4gICAgICAgICAgICAgICAgaW1hZ2VJZDogaW52b2x2ZWRJbWFnZUlkXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb21tZW50LnJlbW92ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbn07XHJcblxyXG5Db21tZW50U2VjdGlvbi5wcm90b3R5cGUuc2Nyb2xsVG9Cb3R0b20gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmNvbW1lbnRzV3JhcHBlci5zY3JvbGxUb3AgPSB0aGlzLmNvbW1lbnRzV3JhcHBlci5zY3JvbGxIZWlnaHQ7XHJcbn07XHJcblxyXG5Db21tZW50U2VjdGlvbi5wcm90b3R5cGUuaW5zZXJ0TmV3Q29tbWVudCA9IGZ1bmN0aW9uICh2aWV3TW9kZWwpIHtcclxuICAgIGxldCBuZXdDb21tZW50ID0gdGhpcy5naG9zdC5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICBuZXdDb21tZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NvbW1lbnRfZ2hvc3QnKTtcclxuICAgIG5ld0NvbW1lbnQuZGF0YXNldC5pZCA9IHZpZXdNb2RlbC5faWQ7XHJcbiAgICBuZXdDb21tZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50X19yZWYnKS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCB2aWV3TW9kZWwuY29tbWVudGF0b3IudXJsKTtcclxuICAgIG5ld0NvbW1lbnQucXVlcnlTZWxlY3RvcignLmNvbW1lbnRfX2F2YXRhcicpLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9XHJcbiAgICAgICAgYHVybCgnJHt2aWV3TW9kZWwuY29tbWVudGF0b3IuYXZhdGFyVXJscy5tZWRpdW19JylgO1xyXG4gICAgbmV3Q29tbWVudC5xdWVyeVNlbGVjdG9yKCcuY29tbWVudF9fdXNlcm5hbWUnKS50ZXh0Q29udGVudCA9IHZpZXdNb2RlbC5jb21tZW50YXRvci51c2VybmFtZTtcclxuICAgIG5ld0NvbW1lbnQucXVlcnlTZWxlY3RvcignLmNvbW1lbnRfX2RhdGUnKS50ZXh0Q29udGVudCA9IHZpZXdNb2RlbC5jcmVhdGVEYXRlU3RyO1xyXG5cclxuICAgIGlmICghdmlld01vZGVsLmlzT3duQ29tbWVudClcclxuICAgICAgICBuZXdDb21tZW50LmNsYXNzTGlzdC5hZGQoJ2NvbW1lbnRfbm90LW93bicpO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIG5ld0NvbW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY29tbWVudF9ub3Qtb3duJyk7XHJcblxyXG4gICAgbmV3Q29tbWVudC5xdWVyeVNlbGVjdG9yKCcuY29tbWVudF9fdGV4dCcpLnRleHRDb250ZW50ID0gdmlld01vZGVsLnRleHQ7XHJcbiAgICB0aGlzLmNvbW1lbnRzV3JhcHBlci5hcHBlbmRDaGlsZChuZXdDb21tZW50KTtcclxuXHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnY29tbWVudC1zZWN0aW9uX25vLWNvbW1lbnRzJyk7XHJcbn07XHJcblxyXG5cclxuQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlLnNldEltYWdlSWQgPSBmdW5jdGlvbiAoaW1hZ2VJZCkge1xyXG4gICAgdGhpcy5pbWFnZUlkID0gaW1hZ2VJZDtcclxufTtcclxuXHJcbkNvbW1lbnRTZWN0aW9uLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAodmlld01vZGVscykge1xyXG4gICAgdGhpcy5jbGVhcigpO1xyXG5cclxuICAgIGlmICh2aWV3TW9kZWxzLmxlbmd0aCA+IDApXHJcbiAgICAgICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbW1lbnQtc2VjdGlvbl9uby1jb21tZW50cycpO1xyXG5cclxuICAgIHZpZXdNb2RlbHMuZm9yRWFjaCh2aWV3TW9kZWwgPT4ge1xyXG4gICAgICAgIHRoaXMuaW5zZXJ0TmV3Q29tbWVudCh2aWV3TW9kZWwpO1xyXG4gICAgfSk7XHJcblxyXG59O1xyXG5cclxuQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIHRoaXMuY29tbWVudHNXcmFwcGVyLmlubmVySFRNTCA9ICcnO1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ2NvbW1lbnQtc2VjdGlvbl9uby1jb21tZW50cycpO1xyXG59O1xyXG5cclxuXHJcbmZvciAobGV0IGtleSBpbiBldmVudE1peGluKVxyXG4gICAgQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlW2tleV0gPSBldmVudE1peGluW2tleV07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbW1lbnRTZWN0aW9uO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL2NvbW1lbnQtc2VjdGlvbi9pbmRleC5qcyIsImxldCBTd2l0Y2hCdXR0b24gPSByZXF1aXJlKEJMT0NLUyArICdzd2l0Y2gtYnV0dG9uJyk7XHJcblxyXG5sZXQgTGlrZUJ1dHRvbiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBTd2l0Y2hCdXR0b24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHJcbiAgICB0aGlzLmxpa2VBbW91bnQgPSArdGhpcy5lbGVtLmRhdGFzZXQubGlrZUFtb3VudDtcclxuICAgIHRoaXMubGlrZUFtb3VudEVsZW0gPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmxpa2UtYnV0dG9uX19saWtlLWFtb3VudCcpO1xyXG5cclxuXHJcbiAgICB0aGlzLnVybCA9ICcvbGlrZSc7XHJcblxyXG5cclxuXHJcbn07XHJcbkxpa2VCdXR0b24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShTd2l0Y2hCdXR0b24ucHJvdG90eXBlKTtcclxuTGlrZUJ1dHRvbi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBMaWtlQnV0dG9uO1xyXG5cclxuTGlrZUJ1dHRvbi5wcm90b3R5cGUuc2V0QW1vdW50ID0gZnVuY3Rpb24gKGxpa2VBbW91bnQpIHtcclxuICAgIHRoaXMubGlrZUFtb3VudCA9IGxpa2VBbW91bnQ7XHJcbiAgICB0aGlzLmxpa2VBbW91bnRFbGVtLnRleHRDb250ZW50ID0gbGlrZUFtb3VudDtcclxufTtcclxuXHJcbkxpa2VCdXR0b24ucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLnNldEFtb3VudChvcHRpb25zLmxpa2VBbW91bnQpO1xyXG4gICAgU3dpdGNoQnV0dG9uLnByb3RvdHlwZS5zZXQuY2FsbCh0aGlzLCBvcHRpb25zKTtcclxufTtcclxuXHJcbkxpa2VCdXR0b24ucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLmFjdGl2ZSlcclxuICAgICAgICB0aGlzLnNldCh7YWN0aXZlOiBmYWxzZSwgbGlrZUFtb3VudDogdGhpcy5saWtlQW1vdW50IC0gMX0pO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHRoaXMuc2V0KHthY3RpdmU6IHRydWUsIGxpa2VBbW91bnQ6IHRoaXMubGlrZUFtb3VudCArIDF9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGlrZUJ1dHRvbjtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9saWtlLWJ1dHRvbi9pbmRleC5qcyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9pbWFnZS9zdHlsZS5sZXNzXG4vLyBtb2R1bGUgaWQgPSA0M1xuLy8gbW9kdWxlIGNodW5rcyA9IDgiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDWkE7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBOzs7QUFFQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBOzs7Ozs7OztBQ3RRQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7OztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDYkE7Ozs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7O0FBRUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0NBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7Ozs7Ozs7Ozs7QUMxdUJBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTs7O0FBRUE7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBOzs7Ozs7OztBQzNGQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ0hBOzs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7Ozs7Ozs7OztBQ3RHQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7Ozs7Ozs7O0FDL0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTs7Ozs7Ozs7Ozs7OztBQ2pDQTs7OyIsInNvdXJjZVJvb3QiOiIifQ==