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

	    this.publicationNumberElem = options.publicationNumberElem;
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

	    this.galleryWrapper.appendChild(newImagePreview);

	    this.setPublicationNumber(1, true);
	    this.addToGalleryArray(imageId);
	};

	Gallery.prototype.setPublicationNumber = function (value, relative) {
	    if (this.publicationNumberElem) if (relative) this.publicationNumberElem.textContent = +this.publicationNumberElem.textContent + value;else this.publicationNumberElem.textContent = value;
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

	    this.activeText = options.activeText;
	    this.inactiveText = options.inactiveText;
	    this.textElem = options.textElem || this.elem;

	    SwitchButton.prototype.set.call(this, { active: !!this.elem.dataset.active });
	    console.log('switch button active:', !!this.elem.dataset.active);
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
	};

	SwitchButton.prototype._deactivate = function () {
	    this.elem.classList.remove('button_active');
	    this.active = false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2UuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDljM2Y4NWUzYWE5MTFmZDRmMGYiLCJ3ZWJwYWNrOi8vLy4vaW1hZ2Uvc2NyaXB0LmpzIiwid2VicGFjazovLy8uLi9ibG9ja3MvZ2xvYmFsLWVycm9yLWhhbmRsZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2NvbXBvbmVudEVycm9ycy5qcz9hY2I1Iiwid2VicGFjazovLy8uLi9ibG9ja3MvbW9kYWwvaW5kZXguanMiLCJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2V2ZW50TWl4aW4uanM/M2NiYyIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL3NwaW5uZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9zcGlubmVyL21hcmt1cCIsIndlYnBhY2s6Ly8vRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvc2VuZFJlcXVlc3QuanM/OGEyNyIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2dhbGxlcnkvaW5kZXguanM/YjUyMCIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL3N3aXRjaC1idXR0b24vaW5kZXguanM/YWE4NioiLCJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2dldENvcnJlY3ROb3VuRm9ybS5qcz84ODM2KiIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2dhbGxlcnkvd2luZG93P2M2YjAiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9pbWFnZS1jb21tZW50LXNlY3Rpb24vaW5kZXguanM/ZDY2MiIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2NvbW1lbnQtc2VjdGlvbi9pbmRleC5qcz80ZjAzIiwid2VicGFjazovLy8uLi9ibG9ja3MvbGlrZS1idXR0b24vaW5kZXguanM/MWI1MiIsIndlYnBhY2s6Ly8vLi9pbWFnZS9zdHlsZS5sZXNzIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xuIFx0dmFyIHBhcmVudEpzb25wRnVuY3Rpb24gPSB3aW5kb3dbXCJ3ZWJwYWNrSnNvbnBcIl07XG4gXHR3aW5kb3dbXCJ3ZWJwYWNrSnNvbnBcIl0gPSBmdW5jdGlvbiB3ZWJwYWNrSnNvbnBDYWxsYmFjayhjaHVua0lkcywgbW9yZU1vZHVsZXMpIHtcbiBcdFx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG4gXHRcdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuIFx0XHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwLCBjYWxsYmFja3MgPSBbXTtcbiBcdFx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG4gXHRcdFx0aWYoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKVxuIFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2guYXBwbHkoY2FsbGJhY2tzLCBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pO1xuIFx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG4gXHRcdH1cbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRpZihwYXJlbnRKc29ucEZ1bmN0aW9uKSBwYXJlbnRKc29ucEZ1bmN0aW9uKGNodW5rSWRzLCBtb3JlTW9kdWxlcyk7XG4gXHRcdHdoaWxlKGNhbGxiYWNrcy5sZW5ndGgpXG4gXHRcdFx0Y2FsbGJhY2tzLnNoaWZ0KCkuY2FsbChudWxsLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0fTtcblxuIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3NcbiBcdC8vIFwiMFwiIG1lYW5zIFwiYWxyZWFkeSBsb2FkZWRcIlxuIFx0Ly8gQXJyYXkgbWVhbnMgXCJsb2FkaW5nXCIsIGFycmF5IGNvbnRhaW5zIGNhbGxiYWNrc1xuIFx0dmFyIGluc3RhbGxlZENodW5rcyA9IHtcbiBcdFx0ODowLFxuIFx0XHQzOjAsXG4gXHRcdDEzOjBcbiBcdH07XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuIFx0Ly8gVGhpcyBmaWxlIGNvbnRhaW5zIG9ubHkgdGhlIGVudHJ5IGNodW5rLlxuIFx0Ly8gVGhlIGNodW5rIGxvYWRpbmcgZnVuY3Rpb24gZm9yIGFkZGl0aW9uYWwgY2h1bmtzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmUgPSBmdW5jdGlvbiByZXF1aXJlRW5zdXJlKGNodW5rSWQsIGNhbGxiYWNrKSB7XG4gXHRcdC8vIFwiMFwiIGlzIHRoZSBzaWduYWwgZm9yIFwiYWxyZWFkeSBsb2FkZWRcIlxuIFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApXG4gXHRcdFx0cmV0dXJuIGNhbGxiYWNrLmNhbGwobnVsbCwgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gYW4gYXJyYXkgbWVhbnMgXCJjdXJyZW50bHkgbG9hZGluZ1wiLlxuIFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gIT09IHVuZGVmaW5lZCkge1xuIFx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXS5wdXNoKGNhbGxiYWNrKTtcbiBcdFx0fSBlbHNlIHtcbiBcdFx0XHQvLyBzdGFydCBjaHVuayBsb2FkaW5nXG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gW2NhbGxiYWNrXTtcbiBcdFx0XHR2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gXHRcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuIFx0XHRcdHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gXHRcdFx0c2NyaXB0LmNoYXJzZXQgPSAndXRmLTgnO1xuIFx0XHRcdHNjcmlwdC5hc3luYyA9IHRydWU7XG5cbiBcdFx0XHRzY3JpcHQuc3JjID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGNodW5rSWQgKyBcIi5cIiArICh7fVtjaHVua0lkXXx8Y2h1bmtJZCkgKyBcIi5qc1wiO1xuIFx0XHRcdGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZDljM2Y4NWUzYWE5MTFmZDRmMGYiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAnLi9zdHlsZS5sZXNzJztcclxuXHJcbmxldCBHbG9iYWxFcnJvckhhbmRsZXIgPSByZXF1aXJlKEJMT0NLUyArICdnbG9iYWwtZXJyb3ItaGFuZGxlcicpO1xyXG5sZXQgZ2xvYmFsRXJyb3JIYW5kbGVyID0gbmV3IEdsb2JhbEVycm9ySGFuZGxlcigpO1xyXG5cclxubGV0IEdhbGxlcnkgPSByZXF1aXJlKEJMT0NLUyArICdnYWxsZXJ5Jyk7XHJcbmxldCBnYWxsZXJ5ID0gbmV3IEdhbGxlcnkoe1xyXG5cdGVsZW06IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbWFnZScpLFxyXG5cdGlzTG9nZ2VkOiB3aW5kb3cuaXNMb2dnZWQsXHJcblx0cHJlbG9hZEVudGl0eUNvdW50OiBQUkVMT0FEX0lNQUdFX0NPVU5UXHJcbn0pO1xyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vaW1hZ2Uvc2NyaXB0LmpzIiwibGV0IEdsb2JhbEVycm9ySGFuZGxlciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGUgPT4ge1xyXG4gICAgICAgIGxldCBlcnJvciA9IGUuZGV0YWlsO1xyXG4gICAgICAgIHRoaXMuY2FsbChlcnJvcik7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbkdsb2JhbEVycm9ySGFuZGxlci5wcm90b3R5cGUuY2FsbCA9IGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgcmVxdWlyZS5lbnN1cmUoW0xJQlMgKyAnY29tcG9uZW50RXJyb3JzJywgQkxPQ0tTICsgJ21lc3NhZ2UtbW9kYWwtd2luZG93J10sIGZ1bmN0aW9uIChyZXF1aXJlKSB7XHJcbiAgICAgICAgbGV0IENvbXBvbmVudEVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLkNvbXBvbmVudEVycm9yO1xyXG4gICAgICAgIGxldCBNZXNzYWdlTW9kYWxXaW5kb3cgPSByZXF1aXJlKEJMT0NLUyArICdtZXNzYWdlLW1vZGFsLXdpbmRvdycpO1xyXG5cclxuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBDb21wb25lbnRFcnJvcikge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzID09PSA0MDEpIHtcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWRpcmVjdGVkX3VybCcsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9ICcvYXV0aG9yaXphdGlvbic7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWVzc2FnZU1vZGFsV2luZG93ID0gbmV3IE1lc3NhZ2VNb2RhbFdpbmRvdyh7bWVzc2FnZTogZXJyb3IubWVzc2FnZX0pO1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZU1vZGFsV2luZG93LmFjdGl2YXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdsb2JhbEVycm9ySGFuZGxlcjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL2dsb2JhbC1lcnJvci1oYW5kbGVyL2luZGV4LmpzIiwiZnVuY3Rpb24gQ3VzdG9tRXJyb3IobWVzc2FnZSkge1xyXG5cdHRoaXMubmFtZSA9IFwiQ3VzdG9tRXJyb3JcIjtcclxuXHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG5cclxuXHRpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpXHJcblx0XHRFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBDdXN0b21FcnJvcik7XHJcblx0ZWxzZVxyXG5cdFx0dGhpcy5zdGFjayA9IChuZXcgRXJyb3IoKSkuc3RhY2s7XHJcbn1cclxuQ3VzdG9tRXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpO1xyXG5DdXN0b21FcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDdXN0b21FcnJvcjtcclxuXHJcblxyXG5mdW5jdGlvbiBDb21wb25lbnRFcnJvcihtZXNzYWdlLCBzdGF0dXMpIHtcclxuXHRDdXN0b21FcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ0FuIGVycm9yIGhhcyBvY2N1cnJlZCcgKTtcclxuXHR0aGlzLm5hbWUgPSBcIkNvbXBvbmVudEVycm9yXCI7XHJcblx0dGhpcy5zdGF0dXMgPSBzdGF0dXM7XHJcbn1cclxuQ29tcG9uZW50RXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDdXN0b21FcnJvci5wcm90b3R5cGUpO1xyXG5Db21wb25lbnRFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDb21wb25lbnRFcnJvcjtcclxuXHJcbmZ1bmN0aW9uIENsaWVudEVycm9yKG1lc3NhZ2UsIGRldGFpbCwgc3RhdHVzKSB7XHJcblx0Q29tcG9uZW50RXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlIHx8ICdBbiBlcnJvciBoYXMgb2NjdXJyZWQuIENoZWNrIGlmIGphdmFzY3JpcHQgaXMgZW5hYmxlZCcsIHN0YXR1cyk7XHJcblx0dGhpcy5uYW1lID0gXCJDbGllbnRFcnJvclwiO1xyXG5cdHRoaXMuZGV0YWlsID0gZGV0YWlsO1xyXG59XHJcbkNsaWVudEVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29tcG9uZW50RXJyb3IucHJvdG90eXBlKTtcclxuQ2xpZW50RXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ2xpZW50RXJyb3I7XHJcblxyXG5cclxuZnVuY3Rpb24gSW1hZ2VOb3RGb3VuZChtZXNzYWdlKSB7XHJcbiAgICBDbGllbnRFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ0ltYWdlIG5vdCBmb3VuZC4gSXQgcHJvYmFibHkgaGFzIGJlZW4gcmVtb3ZlZCcsIG51bGwsIDQwNCk7XHJcbiAgICB0aGlzLm5hbWUgPSBcIkltYWdlTm90Rm91bmRcIjtcclxufVxyXG5JbWFnZU5vdEZvdW5kLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ2xpZW50RXJyb3IucHJvdG90eXBlKTtcclxuSW1hZ2VOb3RGb3VuZC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBJbWFnZU5vdEZvdW5kO1xyXG5cclxuZnVuY3Rpb24gU2VydmVyRXJyb3IobWVzc2FnZSwgc3RhdHVzKSB7XHJcblx0Q29tcG9uZW50RXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlIHx8ICdUaGVyZSBpcyBzb21lIGVycm9yIG9uIHRoZSBzZXJ2ZXIgc2lkZScsIHN0YXR1cyk7XHJcblx0dGhpcy5uYW1lID0gXCJTZXJ2ZXJFcnJvclwiO1xyXG59XHJcblNlcnZlckVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29tcG9uZW50RXJyb3IucHJvdG90eXBlKTtcclxuU2VydmVyRXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2VydmVyRXJyb3I7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRDb21wb25lbnRFcnJvcixcclxuXHRDbGllbnRFcnJvcixcclxuICAgIEltYWdlTm90Rm91bmQsXHJcblx0U2VydmVyRXJyb3JcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2NvbXBvbmVudEVycm9ycy5qcyIsImxldCBldmVudE1peGluID0gcmVxdWlyZShMSUJTICsgJ2V2ZW50TWl4aW4nKTtcclxubGV0IFNwaW5uZXIgPSByZXF1aXJlKEJMT0NLUyArICdzcGlubmVyJyk7XHJcblxyXG5sZXQgTW9kYWwgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuICAgIHRoaXMubGlzdGVuZXJzID0gW107XHJcbiAgICB0aGlzLnN0YXR1cyA9IG9wdGlvbnMgJiYgb3B0aW9ucy5zdGF0dXMgfHwgTW9kYWwuc3RhdHVzZXMuTUlOT1I7XHJcbn07XHJcblxyXG5Nb2RhbC5zdGF0dXNlcyA9IHtcclxuICAgIE1BSk9SOiAxLFxyXG4gICAgTUlOT1I6IDJcclxufTtcclxuXHJcbk1vZGFsLnByb3RvdHlwZS5vbkVsZW1DbGljayA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICBpZiAoZS50YXJnZXQubWF0Y2hlcygnLm1vZGFsLWNsb3NlLWJ1dHRvbicpKVxyXG4gICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xyXG59O1xyXG5cclxuTW9kYWwucHJvdG90eXBlLnNldExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMubGlzdGVuZXJzLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgdGhpcy5lbGVtLmFkZEV2ZW50TGlzdGVuZXIoaXRlbS5ldmVudE5hbWUsIGl0ZW0uY2IpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5Nb2RhbC5zZXRCYWNrZHJvcCA9IGZ1bmN0aW9uIChzdGF0dXMpIHtcclxuICAgIGlmIChzdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKSB7XHJcbiAgICAgICAgTW9kYWwubWlub3JCYWNrZHJvcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrZHJvcF9taW5vcicpO1xyXG4gICAgICAgIGlmICghTW9kYWwubWlub3JCYWNrZHJvcClcclxuICAgICAgICAgICAgTW9kYWwubWlub3JCYWNrZHJvcCA9IE1vZGFsLnJlbmRlckJhY2tkcm9wKCdtaW5vcicpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBNb2RhbC5tYWpvckJhY2tkcm9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tkcm9wX21ham9yJyk7XHJcbiAgICAgICAgaWYgKCFNb2RhbC5tYWpvckJhY2tkcm9wKVxyXG4gICAgICAgICAgICBNb2RhbC5tYWpvckJhY2tkcm9wID0gTW9kYWwucmVuZGVyQmFja2Ryb3AoJ21ham9yJyk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5Nb2RhbC5zZXRXcmFwcGVyID0gZnVuY3Rpb24gKHN0YXR1cykge1xyXG4gICAgaWYgKHN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpIHtcclxuICAgICAgICBNb2RhbC5taW5vcldyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtd3JhcHBlci1taW5vcicpO1xyXG4gICAgICAgIGlmICghTW9kYWwubWlub3JXcmFwcGVyKVxyXG4gICAgICAgICAgICBNb2RhbC5taW5vcldyYXBwZXIgPSBNb2RhbC5yZW5kZXJXcmFwcGVyKCdtaW5vcicpO1xyXG4gICAgICAgIE1vZGFsLm1pbm9yV3JhcHBlci5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldCAmJiAhZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2RhbC13cmFwcGVyX21pbm9yJykpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKE1vZGFsLm1pbm9yQWN0aXZlKVxyXG4gICAgICAgICAgICAgICAgTW9kYWwubWlub3JRdWV1ZVswXS5kZWFjdGl2YXRlKCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgTW9kYWwubWFqb3JXcmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLXdyYXBwZXItbWFqb3InKTtcclxuICAgICAgICBpZiAoIU1vZGFsLm1ham9yV3JhcHBlcilcclxuICAgICAgICAgICAgTW9kYWwubWFqb3JXcmFwcGVyID0gTW9kYWwucmVuZGVyV3JhcHBlcignbWFqb3InKTtcclxuICAgICAgICBNb2RhbC5tYWpvcldyYXBwZXIub25jbGljayA9IGUgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZS50YXJnZXQgJiYgIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbW9kYWwtd3JhcHBlcl9tYWpvcicpKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChNb2RhbC5tYWpvckFjdGl2ZSlcclxuICAgICAgICAgICAgICAgIE1vZGFsLm1ham9yUXVldWVbMF0uZGVhY3RpdmF0ZSgpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn07XHJcblxyXG5Nb2RhbC5yZW5kZXJCYWNrZHJvcCA9IGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICBsZXQgYmFja2Ryb3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKTtcclxuICAgIGJhY2tkcm9wLmNsYXNzTmFtZSA9ICdiYWNrZHJvcCBiYWNrZHJvcF9pbnZpc2libGUnO1xyXG4gICAgYmFja2Ryb3AuY2xhc3NMaXN0LmFkZChgYmFja2Ryb3BfJHt0eXBlfWApO1xyXG4gICAgYmFja2Ryb3AuaWQgPSBgYmFja2Ryb3AtJHt0eXBlfWA7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGJhY2tkcm9wKTtcclxuICAgIHJldHVybiBiYWNrZHJvcDtcclxufTtcclxuXHJcbk1vZGFsLnJlbmRlcldyYXBwZXIgPSBmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgbGV0IHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKTtcclxuICAgIHdyYXBwZXIuY2xhc3NOYW1lID0gJ21vZGFsLXdyYXBwZXIgbW9kYWwtd3JhcHBlcl9pbnZpc2libGUnO1xyXG4gICAgd3JhcHBlci5jbGFzc0xpc3QuYWRkKGBtb2RhbC13cmFwcGVyXyR7dHlwZX1gKTtcclxuICAgIHdyYXBwZXIuaWQgPSBgbW9kYWwtd3JhcHBlci0ke3R5cGV9YDtcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQod3JhcHBlcik7XHJcbiAgICByZXR1cm4gd3JhcHBlcjtcclxufTtcclxuXHJcbk1vZGFsLnByb3RvdHlwZS5yZW5kZXJXaW5kb3cgPSBmdW5jdGlvbiAoaHRtbCkge1xyXG5cclxuICAgIGxldCBwYXJlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKTtcclxuICAgIHBhcmVudC5pbm5lckhUTUwgPSBodG1sO1xyXG4gICAgbGV0IHduZCA9IHBhcmVudC5maXJzdEVsZW1lbnRDaGlsZDtcclxuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpXHJcbiAgICAgICAgTW9kYWwubWlub3JXcmFwcGVyLmFwcGVuZENoaWxkKHduZCk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgTW9kYWwubWFqb3JXcmFwcGVyLmFwcGVuZENoaWxkKHduZCk7XHJcblxyXG4gICAgcGFyZW50LnJlbW92ZSgpO1xyXG4gICAgcmV0dXJuIHduZDtcclxufTtcclxuXHJcbk1vZGFsLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUikge1xyXG4gICAgICAgIGlmICghTW9kYWwubWlub3JCYWNrZHJvcClcclxuICAgICAgICAgICAgTW9kYWwuc2V0QmFja2Ryb3AoTW9kYWwuc3RhdHVzZXMuTUlOT1IpO1xyXG5cclxuICAgICAgICBpZiAoIU1vZGFsLm1pbm9yV3JhcHBlcilcclxuICAgICAgICAgICAgTW9kYWwuc2V0V3JhcHBlcihNb2RhbC5zdGF0dXNlcy5NSU5PUik7XHJcblxyXG4gICAgICAgIE1vZGFsLm1pbm9yV3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC13cmFwcGVyX2ludmlzaWJsZScpO1xyXG4gICAgICAgIE1vZGFsLm1pbm9yQmFja2Ryb3AuY2xhc3NMaXN0LnJlbW92ZSgnYmFja2Ryb3BfaW52aXNpYmxlJyk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoIU1vZGFsLm1ham9yQmFja2Ryb3ApXHJcbiAgICAgICAgICAgIE1vZGFsLnNldEJhY2tkcm9wKE1vZGFsLnN0YXR1c2VzLk1BSk9SKTtcclxuXHJcbiAgICAgICAgaWYgKCFNb2RhbC5tYWpvcldyYXBwZXIpXHJcbiAgICAgICAgICAgIE1vZGFsLnNldFdyYXBwZXIoTW9kYWwuc3RhdHVzZXMuTUFKT1IpO1xyXG5cclxuICAgICAgICBNb2RhbC5tYWpvcldyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtd3JhcHBlcl9pbnZpc2libGUnKTtcclxuICAgICAgICBNb2RhbC5tYWpvckJhY2tkcm9wLmNsYXNzTGlzdC5yZW1vdmUoJ2JhY2tkcm9wX2ludmlzaWJsZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcclxuXHJcbn07XHJcblxyXG5cclxuTW9kYWwucHJvdG90eXBlLmFjdGl2YXRlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICBpZiAodGhpcy5lbGVtSWQgPT09ICdzcGlubmVyJykge1xyXG4gICAgICAgIGxldCBzcGlubmVyID0gdGhpcztcclxuICAgICAgICB0aGlzLm9uKCdzcGlubmVyX2hvc3QtbG9hZGVkJywgZSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBuZXdIb3N0ID0gZS5kZXRhaWwuaG9zdDtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpXHJcbiAgICAgICAgICAgICAgICBNb2RhbC5taW5vclF1ZXVlLnNwbGljZShNb2RhbC5taW5vclF1ZXVlLmluZGV4T2Yoc3Bpbm5lcikgKyAxLCAwLCBuZXdIb3N0KTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgTW9kYWwubWFqb3JRdWV1ZS5zcGxpY2UoTW9kYWwubWFqb3JRdWV1ZS5pbmRleE9mKHNwaW5uZXIpICsgMSwgMCwgbmV3SG9zdCk7XHJcblxyXG4gICAgICAgICAgICBzcGlubmVyLmRlYWN0aXZhdGUoZS5kZXRhaWwub3B0aW9ucyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKSB7XHJcbiAgICAgICAgICAgIE1vZGFsLm1pbm9yUXVldWUucHVzaCh0aGlzKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coTW9kYWwubWlub3JRdWV1ZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKE1vZGFsLm1ham9yUXVldWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFNb2RhbC5taW5vckFjdGl2ZSlcclxuICAgICAgICAgICAgICAgIE1vZGFsLm1pbm9yU2hvdyhvcHRpb25zKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgTW9kYWwubWFqb3JRdWV1ZS5wdXNoKHRoaXMpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhNb2RhbC5taW5vclF1ZXVlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coTW9kYWwubWFqb3JRdWV1ZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIU1vZGFsLm1ham9yQWN0aXZlKVxyXG5cclxuICAgICAgICAgICAgICAgIE1vZGFsLm1ham9yU2hvdyhvcHRpb25zKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59O1xyXG5cclxuTW9kYWwucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5zdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKSB7XHJcbiAgICAgICAgLy9UT0RPIG5vdCBuZWNjZXNzYXJ5IGlmIHF1ZXVlIGlzIG5vdCBlbXB0eVxyXG4gICAgICAgIE1vZGFsLm1pbm9yV3JhcHBlci5jbGFzc0xpc3QuYWRkKCdtb2RhbC13cmFwcGVyX2ludmlzaWJsZScpO1xyXG4gICAgICAgIE1vZGFsLm1pbm9yQmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgnYmFja2Ryb3BfaW52aXNpYmxlJyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBNb2RhbC5tYWpvcldyYXBwZXIuY2xhc3NMaXN0LmFkZCgnbW9kYWwtd3JhcHBlcl9pbnZpc2libGUnKTtcclxuICAgICAgICBNb2RhbC5tYWpvckJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoJ2JhY2tkcm9wX2ludmlzaWJsZScpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcbk1vZGFsLnByb3RvdHlwZS5kZWFjdGl2YXRlID0gZnVuY3Rpb24gKG5leHRXaW5kb3dPcHRpb25zLCBoaWRlT3B0aW9ucykge1xyXG5cclxuICAgIHRoaXMuaGlkZShoaWRlT3B0aW9ucyk7XHJcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUikge1xyXG4gICAgICAgIE1vZGFsLm1pbm9yQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgTW9kYWwubWlub3JRdWV1ZS5zaGlmdCgpO1xyXG4gICAgICAgIE1vZGFsLm1pbm9yU2hvdyhuZXh0V2luZG93T3B0aW9ucyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIE1vZGFsLm1ham9yQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgTW9kYWwubWFqb3JRdWV1ZS5zaGlmdCgpO1xyXG4gICAgICAgIE1vZGFsLm1ham9yU2hvdyhuZXh0V2luZG93T3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnRyaWdnZXIoJ21vZGFsLXdpbmRvd19kZWFjdGl2YXRlZCcpO1xyXG59O1xyXG5cclxuTW9kYWwubWlub3JBY3RpdmUgPSBmYWxzZTtcclxuTW9kYWwubWFqb3JBY3RpdmUgPSBmYWxzZTtcclxuTW9kYWwubWlub3JRdWV1ZSA9IFtdO1xyXG5Nb2RhbC5tYWpvclF1ZXVlID0gW107XHJcblxyXG5Nb2RhbC5zcGlubmVyID0gbmV3IFNwaW5uZXIoKTtcclxuTW9kYWwuc3Bpbm5lci5zdGF0dXMgPSBNb2RhbC5zdGF0dXNlcy5NQUpPUjtcclxuXHJcbk1vZGFsLnNob3dTcGlubmVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgTW9kYWwucHJvdG90eXBlLnNob3cuY2FsbChNb2RhbC5zcGlubmVyKTtcclxuXHJcbiAgICBpZiAoIU1vZGFsLnNwaW5uZXIuZWxlbSlcclxuICAgICAgICBNb2RhbC5zcGlubmVyLmVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bpbm5lcicpO1xyXG4gICAgaWYgKCFNb2RhbC5zcGlubmVyLmVsZW0pXHJcbiAgICAgICAgTW9kYWwuc3Bpbm5lci5lbGVtID0gTW9kYWwucHJvdG90eXBlLnJlbmRlcldpbmRvdy5jYWxsKE1vZGFsLnNwaW5uZXIsIFNwaW5uZXIuaHRtbCk7XHJcblxyXG4gICAgTW9kYWwuc3Bpbm5lci5zaG93KCk7XHJcbn07XHJcblxyXG5Nb2RhbC5oaWRlU3Bpbm5lciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIE1vZGFsLnNwaW5uZXIuaGlkZSgpO1xyXG59O1xyXG5cclxuXHJcbk1vZGFsLm1pbm9yU2hvdyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBsZXQgbmV4dE1vZGFsV2luZG93ID0gTW9kYWwubWlub3JRdWV1ZVswXTtcclxuICAgIGlmIChuZXh0TW9kYWxXaW5kb3cpIHtcclxuICAgICAgICBsZXQgcHJvbWlzZSA9IG5leHRNb2RhbFdpbmRvdy5zaG93KG9wdGlvbnMpO1xyXG4gICAgICAgIGlmIChwcm9taXNlKVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIE1vZGFsLm1pbm9yQWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIE1vZGFsLm1pbm9yQWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIE1vZGFsLm1pbm9yQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuTW9kYWwubWFqb3JTaG93ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICBsZXQgbmV4dE1vZGFsV2luZG93ID0gTW9kYWwubWFqb3JRdWV1ZVswXTtcclxuXHJcbiAgICBpZiAobmV4dE1vZGFsV2luZG93KSB7XHJcblxyXG4gICAgICAgIE1vZGFsLnNob3dTcGlubmVyKCk7XHJcbiAgICAgICAgbGV0IHByb21pc2UgPSBuZXh0TW9kYWxXaW5kb3cuc2hvdyhvcHRpb25zKTtcclxuXHJcbiAgICAgICAgaWYgKHByb21pc2UpXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgTW9kYWwubWFqb3JBY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgTW9kYWwuaGlkZVNwaW5uZXIoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIE1vZGFsLm1ham9yQWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgTW9kYWwuaGlkZVNwaW5uZXIoKTtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIE1vZGFsLm1ham9yQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZm9yIChsZXQga2V5IGluIGV2ZW50TWl4aW4pXHJcbiAgICBNb2RhbC5wcm90b3R5cGVba2V5XSA9IGV2ZW50TWl4aW5ba2V5XTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGFsO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL21vZGFsL2luZGV4LmpzIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG5cdG9uOiBmdW5jdGlvbihldmVudE5hbWUsIGNiKSB7XHJcblx0XHRpZiAodGhpcy5lbGVtKVxyXG5cdFx0XHR0aGlzLmVsZW0uYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNiKTtcclxuXHRcdGVsc2VcclxuXHRcdFx0dGhpcy5saXN0ZW5lcnMucHVzaCh7XHJcblx0XHRcdFx0ZXZlbnROYW1lLFxyXG5cdFx0XHRcdGNiXHJcblx0XHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdHRyaWdnZXI6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZGV0YWlsKSB7XHJcblx0XHR0aGlzLmVsZW0uZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7XHJcblx0XHRcdGJ1YmJsZXM6IHRydWUsXHJcblx0XHRcdGNhbmNlbGFibGU6IHRydWUsXHJcblx0XHRcdGRldGFpbDogZGV0YWlsXHJcblx0XHR9KSk7XHJcblx0fSxcclxuXHJcblx0ZXJyb3I6IGZ1bmN0aW9uKGVycikge1xyXG5cdFx0dGhpcy5lbGVtLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdlcnJvcicsIHtcclxuXHRcdFx0YnViYmxlczogdHJ1ZSxcclxuXHRcdFx0Y2FuY2VsYWJsZTogdHJ1ZSxcclxuXHRcdFx0ZGV0YWlsOiBlcnJcclxuXHRcdH0pKTtcclxuXHR9XHJcblxyXG5cclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2V2ZW50TWl4aW4uanMiLCJsZXQgU3Bpbm5lciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLmVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bpbm5lcicpO1xyXG59O1xyXG5cclxuU3Bpbm5lci5odG1sID0gcmVxdWlyZShgaHRtbC1sb2FkZXIhLi9tYXJrdXBgKTtcclxuXHJcblNwaW5uZXIucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnc3Bpbm5lcl9pbnZpc2libGUnKTtcclxufTtcclxuXHJcblNwaW5uZXIucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnc3Bpbm5lcl9pbnZpc2libGUnKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3Bpbm5lcjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL3NwaW5uZXIvaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBpZD1cXFwic3Bpbm5lclxcXCIgY2xhc3M9XFxcInNwaW5uZXJcXFwiPlxcclxcblxcclxcbjwvZGl2PlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9+L2h0bWwtbG9hZGVyIS4uL2Jsb2Nrcy9zcGlubmVyL21hcmt1cFxuLy8gbW9kdWxlIGlkID0gMjBcbi8vIG1vZHVsZSBjaHVua3MgPSAxIDIgOCA5IDEwIiwibGV0IFNlcnZlckVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLlNlcnZlckVycm9yO1xyXG5sZXQgQ2xpZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ2xpZW50RXJyb3I7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChib2R5T2JqLCBtZXRob2QsIHVybCwgY2IpIHtcclxuXHJcblxyXG4gICAgbGV0IGJvZHkgPSAnJztcclxuICAgIGlmICghKHR5cGVvZiBib2R5T2JqID09PSAnc3RyaW5nJykpIHtcclxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gYm9keU9iaikge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSAnJztcclxuICAgICAgICAgICAgaWYgKGJvZHlPYmpba2V5XSlcclxuICAgICAgICAgICAgICAgIHZhbHVlID0ga2V5ICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KCh0eXBlb2YgYm9keU9ialtrZXldID09PSAnb2JqZWN0JykgPyBKU09OLnN0cmluZ2lmeShib2R5T2JqW2tleV0pIDogYm9keU9ialtrZXldKTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgYm9keSArPSAoYm9keSA9PT0gJycgPyAnJyA6ICcmJykgKyB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2VcclxuICAgICAgICBib2R5ID0gYm9keU9iajtcclxuXHJcblxyXG4gICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgeGhyLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xyXG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcclxuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiWC1SZXF1ZXN0ZWQtV2l0aFwiLCBcIlhNTEh0dHBSZXF1ZXN0XCIpO1xyXG5cclxuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSAhPSA0KSByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCByZXNwb25zZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucmVzcG9uc2VUZXh0KVxyXG4gICAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjYihuZXcgU2VydmVyRXJyb3IoJ1NlcnZlciBpcyBub3QgcmVzcG9uZGluZycpKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMClcclxuICAgICAgICAgICAgY2IobnVsbCwgcmVzcG9uc2UpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPj0gNDAwICYmIHRoaXMuc3RhdHVzIDwgNTAwKVxyXG4gICAgICAgICAgICBjYihuZXcgQ2xpZW50RXJyb3IocmVzcG9uc2UubWVzc2FnZSwgcmVzcG9uc2UuZGV0YWlsLCB0aGlzLnN0YXR1cykpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPj0gNTAwKVxyXG4gICAgICAgICAgICBjYihuZXcgU2VydmVyRXJyb3IocmVzcG9uc2UubWVzc2FnZSwgdGhpcy5zdGF0dXMpKTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc29sZS5sb2coYHNlbmRpbmcgbmV4dCByZXF1ZXN0OiAke2JvZHl9YCk7XHJcbiAgICB4aHIuc2VuZChib2R5KTtcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL3NlbmRSZXF1ZXN0LmpzIiwibGV0IGV2ZW50TWl4aW4gPSByZXF1aXJlKExJQlMgKyAnZXZlbnRNaXhpbicpO1xyXG5sZXQgQ2xpZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ2xpZW50RXJyb3I7XHJcbmxldCBJbWFnZU5vdEZvdW5kID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLkltYWdlTm90Rm91bmQ7XHJcbmxldCBNb2RhbCA9IHJlcXVpcmUoQkxPQ0tTICsgJ21vZGFsJyk7XHJcbmxldCBTd2l0Y2hCdXR0b24gPSByZXF1aXJlKEJMT0NLUyArICdzd2l0Y2gtYnV0dG9uJyk7XHJcbmxldCBnZXRDb3JyZWN0Tm91bkZvcm0gPSByZXF1aXJlKExJQlMgKyAnZ2V0Q29ycmVjdE5vdW5Gb3JtJyk7XHJcblxyXG5sZXQgR2FsbGVyeSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBNb2RhbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgdGhpcy5zdGF0dXMgPSBNb2RhbC5zdGF0dXNlcy5NQUpPUjtcclxuXHJcbiAgICB0aGlzLmdhbGxlcnkgPSBvcHRpb25zLmdhbGxlcnk7XHJcbiAgICB0aGlzLmVsZW0gPSBvcHRpb25zLmVsZW07XHJcbiAgICB0aGlzLmlzTG9nZ2VkID0gb3B0aW9ucy5pc0xvZ2dlZDtcclxuICAgIHRoaXMucHJlbG9hZEVudGl0eUNvdW50ID0gb3B0aW9ucy5wcmVsb2FkRW50aXR5Q291bnQ7XHJcbiAgICB0aGlzLmlzRmVlZCA9IG9wdGlvbnMuaXNGZWVkIHx8IGZhbHNlO1xyXG4gICAgdGhpcy51c2VyU3Vic2NyaWJlQnV0dG9uID0gb3B0aW9ucy51c2VyU3Vic2NyaWJlQnV0dG9uO1xyXG5cclxuICAgIHRoaXMudmlld01vZGVscyA9IHt9O1xyXG4gICAgdGhpcy5nYWxsZXJ5QXJyYXkgPSBudWxsO1xyXG4gICAgdGhpcy5jdXJyZW50SW1hZ2VJZCA9IG51bGw7XHJcblxyXG4gICAgdGhpcy5sb2dnZWRVc2VyVmlld01vZGVsID0gbnVsbDtcclxuICAgIHRoaXMuaXNFbWJlZGRlZCA9ICEhdGhpcy5nYWxsZXJ5O1xyXG4gICAgdGhpcy5wcmVsb2FkZWRJbWFnZXMgPSB7fTtcclxuXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2N1cnJlbnRWaWV3TW9kZWwnLCB7XHJcbiAgICAgICAgZ2V0OiAoKSA9PiB0aGlzLnZpZXdNb2RlbHNbdGhpcy5jdXJyZW50SW1hZ2VJZF1cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSB0aGlzLnByZWxvYWRFbnRpdHlDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5wcmVsb2FkZWRJbWFnZXNbaV0gPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICB0aGlzLnByZWxvYWRlZEltYWdlc1staV0gPSBuZXcgSW1hZ2UoKTtcclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBlID0+IHtcclxuICAgICAgICB0aGlzLm9uUG9wU3RhdGUoZS5zdGF0ZSk7XHJcbiAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGUgPT4ge1xyXG4gICAgICAgIHRoaXMub25SZXNpemUoKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICB0aGlzLnB1c2hHYWxsZXJ5U3RhdGUoKTtcclxuXHJcbiAgICBpZiAodGhpcy5pc0VtYmVkZGVkKVxyXG4gICAgICAgIHRoaXMuc2V0R2FsbGVyeShvcHRpb25zKTtcclxuICAgIGVsc2VcclxuICAgICAgICB0aGlzLnNob3coK3RoaXMuZWxlbS5kYXRhc2V0LmlkKS5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcclxuICAgICAgICB9KTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShNb2RhbC5wcm90b3R5cGUpO1xyXG5HYWxsZXJ5LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEdhbGxlcnk7XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5vblJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gY29uc3QgR0xPQkFMX1NNQUxMX1NDUkVFTl9XSURUSCA9IDcwMDtcclxuICAgIC8vIGlmIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggPD0gR0xPQkFMX1NNQUxMX1NDUkVFTl9XSURUSClcclxuICAgIC8vICAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnaW1hZ2Vfc21hbGwnKTtcclxuICAgIC8vIGVsc2VcclxuICAgIC8vICAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnaW1hZ2Vfc21hbGwnKTtcclxuICAgIC8vXHJcbiAgICAvLyB0aGlzLnJlc2l6ZUltYWdlKCk7XHJcbiAgICB0aGlzLmNvbW1lbnRTZWN0aW9uICYmIHRoaXMuY29tbWVudFNlY3Rpb24udXBkYXRlKCk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5vbkdhbGxlcnlDbGljayA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICBsZXQgdGFyZ2V0O1xyXG4gICAgaWYgKCEodGFyZ2V0ID0gZS50YXJnZXQuY2xvc2VzdCgnLmltYWdlLXByZXZpZXcnKSkpIHJldHVybjtcclxuXHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBsZXQgaW1hZ2VJZCA9ICt0YXJnZXQuZGF0YXNldC5pZDtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5hY3RpdmF0ZSh7aW1hZ2VJZH0pO1xyXG59O1xyXG5cclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnNldEdhbGxlcnkgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgdGhpcy5wdWJsaWNhdGlvbk51bWJlckVsZW0gPSBvcHRpb25zLnB1YmxpY2F0aW9uTnVtYmVyRWxlbTtcclxuICAgIHRoaXMuaW1hZ2VQcmV2aWV3R2hvc3QgPSB0aGlzLmdhbGxlcnkucXVlcnlTZWxlY3RvcignLmltYWdlLXByZXZpZXcnKTtcclxuICAgIHRoaXMuZ2FsbGVyeVdyYXBwZXIgPSB0aGlzLmdhbGxlcnkucXVlcnlTZWxlY3RvcignLmdhbGxlcnlfX3dyYXBwZXInKTtcclxuXHJcbiAgICB0aGlzLmdhbGxlcnkub25jbGljayA9IGUgPT4ge1xyXG4gICAgICAgIHRoaXMub25HYWxsZXJ5Q2xpY2soZSk7XHJcbiAgICB9O1xyXG59O1xyXG5cclxuLy9UT0RPIEFMRVJUIElGIElUIERPRVNOJ1QgQUJMRSBUTyBET1dOTE9BRCBNT0RBTCBNRVNTQUdFIFdJTkRPV1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuc2V0RWxlbSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgICAgICB0aGlzLmlzRWxlbVNldHRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5lbGVtKVxyXG4gICAgICAgICAgICB0aGlzLmVsZW0gPSB0aGlzLnJlbmRlcldpbmRvdyhyZXF1aXJlKGBodG1sLWxvYWRlciEuL3dpbmRvd2ApKTtcclxuXHJcbiAgICAgICAgdGhpcy5pbWdFbGVtID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJ2ltZy5pbWFnZV9faW1nLWVsZW1lbnQnKTtcclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fZGVzY3JpcHRpb24nKTtcclxuICAgICAgICB0aGlzLmRhdGUgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX19wb3N0LWRhdGUnKTtcclxuICAgICAgICB0aGlzLmltYWdlV3JhcHBlciA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2ltYWdlLXdyYXBwZXInKTtcclxuICAgICAgICB0aGlzLnNpZGVCYXIgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX19zaWRlYmFyJyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVCdXR0b25FbGVtID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fZGVsZXRlLWJ1dHRvbicpO1xyXG4gICAgICAgIHRoaXMuc3Vic2NyaWJlQnV0dG9uRWxlbSA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX3N1YnNjcmliZS1idXR0b24nKTtcclxuICAgICAgICB0aGlzLmF2YXRhciA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2F2YXRhcicpO1xyXG4gICAgICAgIHRoaXMudXNlcm5hbWUgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX191c2VybmFtZScpO1xyXG4gICAgICAgIHRoaXMuaGVhZGVyTGVmdFNpZGUgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX19oZWFkZXItbGVmdC1zaWRlJyk7XHJcbiAgICAgICAgdGhpcy5mdWxsc2NyZWVuQnV0dG9uID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fY29udHJvbC1mdWxsJyk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLmltZ0VsZW0ub25sb2FkID0gZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzaXplSW1hZ2UoKTtcclxuICAgICAgICAgICAgdGhpcy5zaG93SW1nRWxlbSgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbS5vbmNsaWNrID0gZSA9PiB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9uRWxlbUNsaWNrKGUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoJy5pbWFnZV9fbW9kYWwtY2xvc2UtYnV0dG9uLXdyYXBwZXInKSlcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoJy5pbWFnZV9fY29udHJvbC1wcmV2JykpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN3aXRjaFRvUHJldigpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoJy5pbWFnZV9fY29udHJvbC1uZXh0JykpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN3aXRjaFRvTmV4dCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0ID09PSB0aGlzLmZ1bGxzY3JlZW5CdXR0b24pXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN3aXRjaEZ1bGxzY3JlZW4oKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldC5tYXRjaGVzKCcuaW1hZ2VfX2Nsb3NlLXNwYWNlJykgfHwgZS50YXJnZXQubWF0Y2hlcygnLmltYWdlX19jbG9zZS1idXR0b24nKSlcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICBsZXQgQ29tbWVudFNlY3Rpb24gPSByZXF1aXJlKEJMT0NLUyArICdpbWFnZS1jb21tZW50LXNlY3Rpb24nKTtcclxuICAgICAgICBsZXQgTGlrZUJ1dHRvbiA9IHJlcXVpcmUoQkxPQ0tTICsgJ2xpa2UtYnV0dG9uJyk7XHJcblxyXG4gICAgICAgIHRoaXMuY29tbWVudFNlY3Rpb24gPSBuZXcgQ29tbWVudFNlY3Rpb24oe1xyXG4gICAgICAgICAgICBlbGVtOiB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmNvbW1lbnQtc2VjdGlvbicpLFxyXG4gICAgICAgICAgICBjb21tZW50U2VuZGVyRWxlbTogdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50LXNlbmQnKSxcclxuICAgICAgICAgICAgaW1hZ2VJZDogdGhpcy5jdXJyZW50SW1hZ2VJZCxcclxuICAgICAgICAgICAgbG9nZ2VkVXNlclZpZXdNb2RlbDogdGhpcy5sb2dnZWRVc2VyVmlld01vZGVsLFxyXG5cclxuICAgICAgICAgICAgY29tbWVudFNlY3Rpb25XcmFwcGVyOiB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX19jb21tZW50LXNlY3Rpb24td3JhcHBlcicpLFxyXG4gICAgICAgICAgICBpbmZvQm9hcmQ6IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2luZm8tYm9hcmQnKSxcclxuICAgICAgICAgICAgc2Nyb2xsYmFyV3JhcHBlcjogdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fY29tbWVudC1zZWN0aW9uLXNjcm9sbGJhci13cmFwcGVyJylcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb21tZW50U2VjdGlvbi5vbignY29tbWVudC1zZWN0aW9uX2NoYW5nZWQnLCBlID0+IHtcclxuICAgICAgICAgICAgbGV0IGltYWdlSWQgPSBlLmRldGFpbC5pbWFnZUlkO1xyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZVZpZXdNb2RlbChpbWFnZUlkKTtcclxuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0Vmlld01vZGVsKGltYWdlSWQpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDb21tZW50cyhpbWFnZUlkKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMubGlrZUJ1dHRvbiA9IG5ldyBMaWtlQnV0dG9uKHtcclxuICAgICAgICAgICAgZWxlbTogdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5saWtlLWJ1dHRvbicpLFxyXG4gICAgICAgICAgICBkYXRhOiB0aGlzLmN1cnJlbnRJbWFnZUlkXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMubGlrZUJ1dHRvbi5vbignc3dpdGNoLWJ1dHRvbl9jaGFuZ2VkJywgZSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpbWFnZUlkID0gZS5kZXRhaWwuaW1hZ2VJZDtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGVWaWV3TW9kZWwoaW1hZ2VJZCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdFZpZXdNb2RlbChpbWFnZUlkKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlTGlrZXMoaW1hZ2VJZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLm9uUmVzaXplKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzTG9nZ2VkKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRWaWV3TW9kZWwuaXNPd25JbWFnZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXREZWxldGVCdXR0b24oKTtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmUuZW5zdXJlKFtCTE9DS1MgKyAnZGVsZXRlLWltYWdlLWJ1dHRvbiddLCByZXF1aXJlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgRGVsZXRlSW1hZ2VCdXR0b24gPSByZXF1aXJlKEJMT0NLUyArICdkZWxldGUtaW1hZ2UtYnV0dG9uJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxldGVCdXR0b24gPSBuZXcgRGVsZXRlSW1hZ2VCdXR0b24oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtOiB0aGlzLmRlbGV0ZUJ1dHRvbkVsZW0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlSWQ6IHRoaXMuY3VycmVudEltYWdlSWRcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZUJ1dHRvbi5vbignZGVsZXRlLWltYWdlLWJ1dHRvbl9pbWFnZS1kZWxldGVkJywgZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbnZvbHZlZEltYWdlSWQgPSBlLmRldGFpbC5pbWFnZUlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZVZpZXdNb2RlbChpbnZvbHZlZEltYWdlSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUZyb21HYWxsZXJ5QXJyYXkoaW52b2x2ZWRJbWFnZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxldGVJbWFnZVByZXZpZXcoaW52b2x2ZWRJbWFnZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudEltYWdlSWQgPT09IGludm9sdmVkSW1hZ2VJZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3dpdGNoVG9OZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlLmVuc3VyZShbQkxPQ0tTICsgJ3N1YnNjcmliZS1idXR0b24nXSwgcmVxdWlyZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IFN1YnNjcmliZUJ1dHRvbiA9IHJlcXVpcmUoQkxPQ0tTICsgJ3N1YnNjcmliZS1idXR0b24nKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN1YnNjcmliZUJ1dHRvbiA9IG5ldyBTdWJzY3JpYmVCdXR0b24oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtOiB0aGlzLnN1YnNjcmliZUJ1dHRvbkVsZW0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRoaXMuY3VycmVudEltYWdlSWRcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudXNlclN1YnNjcmliZUJ1dHRvbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgU3dpdGNoQnV0dG9uLnNldFJlbGF0aW9uKHRoaXMuc3Vic2NyaWJlQnV0dG9uLCB0aGlzLnVzZXJTdWJzY3JpYmVCdXR0b24pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN1YnNjcmliZUJ1dHRvbi5vbignc3dpdGNoLWJ1dHRvbl9jaGFuZ2VkJywgZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbnZvbHZlZEltYWdlSWQgPSBlLmRldGFpbC5pbWFnZUlkO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNGZWVkICYmIGludm9sdmVkSW1hZ2VJZCA9PT0gdGhpcy5jdXJyZW50SW1hZ2VJZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmlld01vZGVscyA9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdWJzY3JpYmVCdXR0b24oKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN1YnNjcmliZUJ1dHRvbi5zZXQoe2FjdGl2ZTogdGhpcy5jdXJyZW50Vmlld01vZGVsLmF1dGhvci5pc05hcnJhdG9yfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVCdXR0b25FbGVtLm9uY2xpY2sgPSBlID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IobmV3IENsaWVudEVycm9yKG51bGwsIG51bGwsIDQwMSkpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuXHJcbn07XHJcblxyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuc3dpdGNoRnVsbHNjcmVlbiA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBmdW5jdGlvbiBnb0Z1bGxzY3JlZW4oZWxlbWVudCkge1xyXG4gICAgICAgIGlmIChlbGVtZW50LnJlcXVlc3RGdWxsc2NyZWVuKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQucmVxdWVzdEZ1bGxzY3JlZW4oKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4pIHtcclxuICAgICAgICAgICAgZWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbigpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5tb3pSZXF1ZXN0RnVsbHNjcmVlbikge1xyXG4gICAgICAgICAgICBlbGVtZW50Lm1velJlcXVlc3RGdWxsc2NyZWVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNhbmNlbEZ1bGxzY3JlZW4oKSB7XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmV4aXRGdWxsc2NyZWVuKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmV4aXRGdWxsc2NyZWVuKCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkb2N1bWVudC53ZWJraXRFeGl0RnVsbHNjcmVlbikge1xyXG4gICAgICAgICAgICBkb2N1bWVudC53ZWJraXRFeGl0RnVsbHNjcmVlbigpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQubW96RXhpdEZ1bGxzY3JlZW4pIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQubW96RXhpdEZ1bGxzY3JlZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGlmICghdGhpcy5pc0Z1bGxzY3JlZW4pIHtcclxuICAgICAgICBnb0Z1bGxzY3JlZW4odGhpcy5pbWFnZVdyYXBwZXIpO1xyXG4gICAgICAgIHRoaXMuaXNGdWxsc2NyZWVuID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmZ1bGxzY3JlZW5CdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnaWNvbi1hcnJvdy1tYXhpbWlzZScpO1xyXG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdpY29uLWFycm93LW1pbmltaXNlJyk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjYW5jZWxGdWxsc2NyZWVuKCk7XHJcbiAgICAgICAgdGhpcy5pc0Z1bGxzY3JlZW4gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmZ1bGxzY3JlZW5CdXR0b24uY2xhc3NMaXN0LmFkZCgnaWNvbi1hcnJvdy1tYXhpbWlzZScpO1xyXG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdpY29uLWFycm93LW1pbmltaXNlJyk7XHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnNldERlbGV0ZUJ1dHRvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZGVsZXRlQnV0dG9uRWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdidXR0b25faW52aXNpYmxlJyk7XHJcbiAgICB0aGlzLnN1YnNjcmliZUJ1dHRvbkVsZW0uY2xhc3NMaXN0LmFkZCgnYnV0dG9uX2ludmlzaWJsZScpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuc2V0U3Vic2NyaWJlQnV0dG9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5zdWJzY3JpYmVCdXR0b25FbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2J1dHRvbl9pbnZpc2libGUnKTtcclxuICAgIHRoaXMuZGVsZXRlQnV0dG9uRWxlbS5jbGFzc0xpc3QuYWRkKCdidXR0b25faW52aXNpYmxlJyk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS51cGRhdGVQcmVsb2FkZWRJbWFnZXNBcnJheSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IHRoaXMucHJlbG9hZEVudGl0eUNvdW50OyBpKyspIHtcclxuICAgICAgICBsZXQgbmV4dElkID0gdGhpcy5nZXROZXh0SW1hZ2VJZChpKTtcclxuICAgICAgICBsZXQgcHJldklkID0gdGhpcy5nZXROZXh0SW1hZ2VJZCgtaSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnZpZXdNb2RlbHNbbmV4dElkXSlcclxuICAgICAgICAgICAgdGhpcy5wcmVsb2FkZWRJbWFnZXNbaV0uc2V0QXR0cmlidXRlKCdzcmMnLCB0aGlzLnZpZXdNb2RlbHNbbmV4dElkXS5pbWdVcmwpO1xyXG4gICAgICAgIGlmICh0aGlzLnZpZXdNb2RlbHNbcHJldklkXSlcclxuICAgICAgICAgICAgdGhpcy5wcmVsb2FkZWRJbWFnZXNbLWldLnNldEF0dHJpYnV0ZSgnc3JjJywgdGhpcy52aWV3TW9kZWxzW3ByZXZJZF0uaW1nVXJsKTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7IC8vIDpcXFxyXG5cclxuXHJcblxyXG4gICAgbGV0IGltYWdlSWQ7XHJcbiAgICBsZXQgbm9QdXNoU3RhdGU7XHJcblxyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiYgdHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ251bWJlcicpIHtcclxuICAgICAgICBpbWFnZUlkID0gYXJndW1lbnRzWzBdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBpbWFnZUlkID0gb3B0aW9ucyAmJiBvcHRpb25zLmltYWdlSWQ7XHJcbiAgICAgICAgbm9QdXNoU3RhdGUgPSBvcHRpb25zICYmIG9wdGlvbnMubm9QdXNoU3RhdGUgfHwgZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNFbWJlZGRlZClcclxuICAgICAgICAgICAgTW9kYWwucHJvdG90eXBlLnNob3cuYXBwbHkodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMucmVxdWVzdFZpZXdNb2RlbChpbWFnZUlkKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50SW1hZ2VJZCA9IGltYWdlSWQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNFbGVtU2V0dGVkKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFbGVtKCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDdXJyZW50VmlldyhpbWFnZUlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2ltYWdlX2ludmlzaWJsZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghbm9QdXNoU3RhdGUgJiYgaW1hZ2VJZCA9PT0gdGhpcy5jdXJyZW50SW1hZ2VJZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoSW1hZ2VTdGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RBbGxOZWNlc3NhcnlWaWV3TW9kZWxzKCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUHJlbG9hZGVkSW1hZ2VzQXJyYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ3VycmVudFZpZXcoaW1hZ2VJZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2ltYWdlX2ludmlzaWJsZScpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFub1B1c2hTdGF0ZSAmJiBpbWFnZUlkID09PSB0aGlzLmN1cnJlbnRJbWFnZUlkKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaEltYWdlU3RhdGUoKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdEFsbE5lY2Vzc2FyeVZpZXdNb2RlbHMoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVByZWxvYWRlZEltYWdlc0FycmF5KCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5vblJlc2l6ZSgpO1xyXG4gICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0pO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdhdXRvJztcclxuXHJcblxyXG4gICAgbGV0IG5vUHVzaFN0YXRlID0gb3B0aW9ucyAmJiBvcHRpb25zLm5vUHVzaFN0YXRlO1xyXG4gICAgaWYgKCF0aGlzLmlzRW1iZWRkZWQpXHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID0gdGhpcy5lbGVtLmRhdGFzZXQuYXV0aG9yVXJsO1xyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgTW9kYWwucHJvdG90eXBlLmhpZGUuYXBwbHkodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdpbWFnZV9pbnZpc2libGUnKTtcclxuXHJcbiAgICAgICAgaWYgKCFub1B1c2hTdGF0ZSlcclxuICAgICAgICAgICAgdGhpcy5wdXNoR2FsbGVyeVN0YXRlKCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5oaWRlSW1nRWxlbSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdpbWFnZV9pbWctZWxlbWVudC1pbnZpc2libGUnKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnNob3dJbWdFbGVtID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2ltYWdlX2ltZy1lbGVtZW50LWludmlzaWJsZScpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUucmVzaXplSW1hZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyBpZiAodGhpcy5lbGVtKSB7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgIHRoaXMuaW1nRWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ3dpZHRoJyk7XHJcbiAgICAvLyAgICAgdGhpcy5pbWdFbGVtLnJlbW92ZUF0dHJpYnV0ZSgnaGVpZ2h0Jyk7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgIGlmICghdGhpcy5lbGVtLmNsYXNzTGlzdC5jb250YWlucygnaW1hZ2Vfc21hbGwnKSkge1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgaWYgKHRoaXMuaW1nRWxlbS5vZmZzZXRXaWR0aCA+PSB0aGlzLmltZ0VsZW0ub2Zmc2V0SGVpZ2h0KSB7XHJcbiAgICAvLyAgICAgICAgICAgICBpZiAodGhpcy5pbWFnZVdyYXBwZXIub2Zmc2V0SGVpZ2h0IDwgdGhpcy5pbWdFbGVtLm9mZnNldEhlaWdodClcclxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLmltZ0VsZW0uaGVpZ2h0ID0gdGhpcy5pbWFnZVdyYXBwZXIub2Zmc2V0SGVpZ2h0O1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgICAgIGlmICh0aGlzLmltYWdlV3JhcHBlci5vZmZzZXRXaWR0aCA+IHRoaXMuZWxlbS5vZmZzZXRXaWR0aCkge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuaW1nRWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2hlaWdodCcpO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuaW1nRWxlbS53aWR0aCA9IHRoaXMuZWxlbS5vZmZzZXRXaWR0aCAtIHRoaXMuc2lkZUJhci5vZmZzZXRXaWR0aDtcclxuICAgIC8vICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgfSBlbHNlIHtcclxuICAgIC8vICAgICAgICAgICAgIGlmICh0aGlzLmltYWdlV3JhcHBlci5vZmZzZXRXaWR0aCA+IHRoaXMuZWxlbS5vZmZzZXRXaWR0aClcclxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLmltZ0VsZW0ud2lkdGggPSB0aGlzLmVsZW0ub2Zmc2V0V2lkdGggLSB0aGlzLnNpZGVCYXIub2Zmc2V0V2lkdGg7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICAgICAgaWYgKHRoaXMuaW1hZ2VXcmFwcGVyLm9mZnNldEhlaWdodCA8IHRoaXMuaW1nRWxlbS5vZmZzZXRIZWlnaHQpIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLmltZ0VsZW0ucmVtb3ZlQXR0cmlidXRlKCd3aWR0aCcpO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuaW1nRWxlbS5oZWlnaHQgPSB0aGlzLmltYWdlV3JhcHBlci5vZmZzZXRIZWlnaHQ7XHJcbiAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICBpZiAodGhpcy5pbWFnZVdyYXBwZXIub2Zmc2V0V2lkdGggPiB0aGlzLmVsZW0ub2Zmc2V0V2lkdGgpIHtcclxuICAgIC8vICAgICAgICAgICAgIHRoaXMuaW1nRWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2hlaWdodCcpO1xyXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5pbWdFbGVtLndpZHRoID0gdGhpcy5lbGVtLm9mZnNldFdpZHRoO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy9cclxuICAgIC8vXHJcbiAgICAvLyB9XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5yZXF1ZXN0Vmlld01vZGVsID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgICAgICBpZiAodGhpcy52aWV3TW9kZWxzW2lkXSkge1xyXG4gICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBib2R5ID0ge1xyXG4gICAgICAgICAgICBpZCxcclxuICAgICAgICAgICAgaXNGZWVkOiB0aGlzLmlzRmVlZFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzTG9nZ2VkICYmICF0aGlzLmxvZ2dlZFVzZXJWaWV3TW9kZWwpXHJcbiAgICAgICAgICAgIGJvZHkucmVxdWlyZVVzZXJWaWV3TW9kZWwgPSB0cnVlO1xyXG5cclxuICAgICAgICByZXF1aXJlKExJQlMgKyAnc2VuZFJlcXVlc3QnKShib2R5LCAnUE9TVCcsICcvZ2FsbGVyeScsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBDbGllbnRFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmdhbGxlcnlBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUZyb21HYWxsZXJ5QXJyYXkoaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUdhbGxlcnkoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgSW1hZ2VOb3RGb3VuZCgpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FsbGVyeUFycmF5ID0gcmVzcG9uc2UuZ2FsbGVyeTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVHYWxsZXJ5KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0xvZ2dlZCAmJiAhdGhpcy5sb2dnZWRVc2VyVmlld01vZGVsICYmIHJlc3BvbnNlLmxvZ2dlZFVzZXJWaWV3TW9kZWwpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlZFVzZXJWaWV3TW9kZWwgPSByZXNwb25zZS5sb2dnZWRVc2VyVmlld01vZGVsO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGxldCBwcm92aWRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gcmVzcG9uc2Uudmlld01vZGVscykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PSBpZClcclxuICAgICAgICAgICAgICAgICAgICBwcm92aWRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3TW9kZWxzW2tleV0gPSByZXNwb25zZS52aWV3TW9kZWxzW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb3ZpZGVkKVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2FsbGVyeUFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVGcm9tR2FsbGVyeUFycmF5KGlkKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUdhbGxlcnkoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgSW1hZ2VOb3RGb3VuZCgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5yZW1vdmVGcm9tR2FsbGVyeUFycmF5ID0gZnVuY3Rpb24gKGlkKSB7XHJcblxyXG4gICAgdGhpcy5nYWxsZXJ5QXJyYXkgJiYgfnRoaXMuZ2FsbGVyeUFycmF5LmluZGV4T2YoaWQpICYmXHJcbiAgICB0aGlzLmdhbGxlcnlBcnJheS5zcGxpY2UodGhpcy5nYWxsZXJ5QXJyYXkuaW5kZXhPZihpZCksIDEpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuYWRkVG9HYWxsZXJ5QXJyYXkgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgIHRoaXMuZ2FsbGVyeUFycmF5ICYmIHRoaXMuZ2FsbGVyeUFycmF5LnB1c2goaWQpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUudXBkYXRlR2FsbGVyeSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLmdhbGxlcnlBcnJheSAmJiB0aGlzLmdhbGxlcnkpIHtcclxuICAgICAgICBsZXQgaW1hZ2VQcmV2aWV3cyA9IHRoaXMuZ2FsbGVyeS5xdWVyeVNlbGVjdG9yQWxsKCcuaW1hZ2UtcHJldmlldycpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW1hZ2VQcmV2aWV3cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoIX50aGlzLmdhbGxlcnlBcnJheS5pbmRleE9mKCtpbWFnZVByZXZpZXdzW2ldLmRhdGFzZXQuaWQpKVxyXG4gICAgICAgICAgICAgICAgaW1hZ2VQcmV2aWV3c1tpXS5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXRQdWJsaWNhdGlvbk51bWJlcih0aGlzLmdhbGxlcnlBcnJheS5sZW5ndGgpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuZ2V0SW1hZ2VQcmV2aWV3QnlJZCA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2FsbGVyeS5xdWVyeVNlbGVjdG9yKGAuaW1hZ2UtcHJldmlld1tkYXRhLWlkPVwiJHtpZH1cIl1gKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnVwZGF0ZUltYWdlUHJldmlld1RleHQgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgIGxldCBsaWtlQW1vdW50ID0gdGhpcy52aWV3TW9kZWxzW2lkXS5saWtlcy5sZW5ndGg7XHJcbiAgICBsZXQgY29tbWVudEFtb3VudCA9IHRoaXMudmlld01vZGVsc1tpZF0uY29tbWVudHMubGVuZ3RoO1xyXG4gICAgbGV0IHByZXZpZXdJbWFnZUVsZW0gPSB0aGlzLmdldEltYWdlUHJldmlld0J5SWQoaWQpO1xyXG4gICAgcHJldmlld0ltYWdlRWxlbS5kYXRhc2V0Lmxpa2VBbW91bnQgPSBsaWtlQW1vdW50O1xyXG4gICAgcHJldmlld0ltYWdlRWxlbS5kYXRhc2V0LmNvbW1lbnRBbW91bnQgPSBjb21tZW50QW1vdW50O1xyXG5cclxuICAgIHByZXZpZXdJbWFnZUVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlLXByZXZpZXdfX2NvbW1lbnQtbnVtYmVyJykudGV4dENvbnRlbnQgPSBjb21tZW50QW1vdW50O1xyXG4gICAgcHJldmlld0ltYWdlRWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2UtcHJldmlld19fbGlrZS1udW1iZXInKS50ZXh0Q29udGVudCA9IGxpa2VBbW91bnQ7XHJcblxyXG4gICAgcHJldmlld0ltYWdlRWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2UtcHJldmlld19fY29tbWVudC1zZWN0aW9uIC5pbWFnZS1wcmV2aWV3X19kZXNpZ25hdGlvbi10ZXh0JylcclxuICAgICAgICAudGV4dENvbnRlbnQgPSBnZXRDb3JyZWN0Tm91bkZvcm0oJ2NvbW1lbnQnLCBjb21tZW50QW1vdW50KTtcclxuICAgIHByZXZpZXdJbWFnZUVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlLXByZXZpZXdfX2xpa2Utc2VjdGlvbiAuaW1hZ2UtcHJldmlld19fZGVzaWduYXRpb24tdGV4dCcpXHJcbiAgICAgICAgLnRleHRDb250ZW50ID0gZ2V0Q29ycmVjdE5vdW5Gb3JtKCdsaWtlJywgbGlrZUFtb3VudCk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5kZWxldGVJbWFnZVByZXZpZXcgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgIGxldCBlbGVtID0gdGhpcy5nZXRJbWFnZVByZXZpZXdCeUlkKGlkKTtcclxuICAgIGlmIChlbGVtKSB7XHJcbiAgICAgICAgZWxlbS5yZW1vdmUoKTtcclxuICAgICAgICB0aGlzLnNldFB1YmxpY2F0aW9uTnVtYmVyKC0xLCB0cnVlKTtcclxuICAgIH1cclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLmluc2VydE5ld0ltYWdlUHJldmlldyA9IGZ1bmN0aW9uIChpbWFnZUlkLCBwcmV2aWV3VXJsKSB7XHJcbiAgICBsZXQgbmV3SW1hZ2VQcmV2aWV3ID0gdGhpcy5pbWFnZVByZXZpZXdHaG9zdC5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICBuZXdJbWFnZVByZXZpZXcuY2xhc3NMaXN0LnJlbW92ZSgnaW1hZ2UtcHJldmlld19naG9zdCcpO1xyXG5cclxuICAgIG5ld0ltYWdlUHJldmlldy5kYXRhc2V0LmlkID0gaW1hZ2VJZDtcclxuICAgIG5ld0ltYWdlUHJldmlldy5ocmVmID0gYC9pbWFnZS8ke2ltYWdlSWR9YDtcclxuICAgIG5ld0ltYWdlUHJldmlldy5xdWVyeVNlbGVjdG9yKCcuaW1hZ2UtcHJldmlld19fcGljdHVyZScpLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJy8ke3ByZXZpZXdVcmx9JylgO1xyXG5cclxuICAgIG5ld0ltYWdlUHJldmlldy5xdWVyeVNlbGVjdG9yKCcuaW1hZ2UtcHJldmlld19fY29tbWVudC1udW1iZXInKS50ZXh0Q29udGVudCA9IDA7XHJcbiAgICBuZXdJbWFnZVByZXZpZXcucXVlcnlTZWxlY3RvcignLmltYWdlLXByZXZpZXdfX2xpa2UtbnVtYmVyJykudGV4dENvbnRlbnQgPSAwO1xyXG5cclxuICAgIHRoaXMuZ2FsbGVyeVdyYXBwZXIuYXBwZW5kQ2hpbGQobmV3SW1hZ2VQcmV2aWV3KTtcclxuXHJcbiAgICB0aGlzLnNldFB1YmxpY2F0aW9uTnVtYmVyKDEsIHRydWUpO1xyXG4gICAgdGhpcy5hZGRUb0dhbGxlcnlBcnJheShpbWFnZUlkKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnNldFB1YmxpY2F0aW9uTnVtYmVyID0gZnVuY3Rpb24gKHZhbHVlLCByZWxhdGl2ZSkge1xyXG4gICAgaWYgKHRoaXMucHVibGljYXRpb25OdW1iZXJFbGVtKVxyXG4gICAgICAgIGlmIChyZWxhdGl2ZSlcclxuICAgICAgICAgICAgdGhpcy5wdWJsaWNhdGlvbk51bWJlckVsZW0udGV4dENvbnRlbnQgPSArdGhpcy5wdWJsaWNhdGlvbk51bWJlckVsZW0udGV4dENvbnRlbnQgKyB2YWx1ZTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMucHVibGljYXRpb25OdW1iZXJFbGVtLnRleHRDb250ZW50ID0gdmFsdWU7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5kZWxldGVWaWV3TW9kZWwgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgIGRlbGV0ZSB0aGlzLnZpZXdNb2RlbHNbaWRdO1xyXG4gICAgY29uc29sZS5sb2coJ2RlbGV0ZSAjJyArIGlkKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnJlcXVlc3RBbGxOZWNlc3NhcnlWaWV3TW9kZWxzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFtcclxuICAgICAgICB0aGlzLnJlcXVlc3ROZXh0Vmlld01vZGVscygpLFxyXG4gICAgICAgIHRoaXMucmVxdWVzdFByZXZWaWV3TW9kZWxzKClcclxuICAgIF0pO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUucmVxdWVzdE5leHRWaWV3TW9kZWxzID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIGlmICh0aGlzLmdhbGxlcnlBcnJheSAmJiB0aGlzLmdhbGxlcnlBcnJheS5sZW5ndGggPT09IDApXHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBJbWFnZU5vdEZvdW5kKCkpO1xyXG5cclxuICAgIGxldCBwcm9taXNlcyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnByZWxvYWRFbnRpdHlDb3VudDsgaSsrKVxyXG4gICAgICAgIHByb21pc2VzLnB1c2godGhpcy5yZXF1ZXN0Vmlld01vZGVsKHRoaXMuZ2V0TmV4dEltYWdlSWQoaSkpKTtcclxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5yZXF1ZXN0UHJldlZpZXdNb2RlbHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5nYWxsZXJ5QXJyYXkgJiYgdGhpcy5nYWxsZXJ5QXJyYXkubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgSW1hZ2VOb3RGb3VuZCgpKTtcclxuICAgIGxldCBwcm9taXNlcyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnByZWxvYWRFbnRpdHlDb3VudDsgaSsrKVxyXG4gICAgICAgIHByb21pc2VzLnB1c2godGhpcy5yZXF1ZXN0Vmlld01vZGVsKHRoaXMuZ2V0UHJldkltYWdlSWQoaSkpKTtcclxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5zd2l0Y2hUb05leHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5nYWxsZXJ5QXJyYXkgJiYgIXRoaXMuZ2FsbGVyeUFycmF5Lmxlbmd0aCkge1xyXG4gICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgbmV4dEltYWdlSWQgPSB0aGlzLmdldE5leHRJbWFnZUlkKCk7XHJcbiAgICB0aGlzLnNob3cobmV4dEltYWdlSWQpLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIEltYWdlTm90Rm91bmQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ2FsbGVyeUFycmF5ICYmIHRoaXMuZ2FsbGVyeUFycmF5Lmxlbmd0aClcclxuICAgICAgICAgICAgICAgIHRoaXMuc3dpdGNoVG9OZXh0KCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmVycm9yKGVycik7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnN3aXRjaFRvUHJldiA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBpZiAodGhpcy5nYWxsZXJ5QXJyYXkgJiYgIXRoaXMuZ2FsbGVyeUFycmF5Lmxlbmd0aCkge1xyXG4gICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcHJldkltYWdlSWQgPSB0aGlzLmdldFByZXZJbWFnZUlkKCk7XHJcbiAgICB0aGlzLnNob3cocHJldkltYWdlSWQpLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIEltYWdlTm90Rm91bmQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ2FsbGVyeUFycmF5ICYmIHRoaXMuZ2FsbGVyeUFycmF5Lmxlbmd0aClcclxuICAgICAgICAgICAgICAgIHRoaXMuc3dpdGNoVG9QcmV2KCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmVycm9yKGVycik7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLmdldE5leHRJbWFnZUlkID0gZnVuY3Rpb24gKG9mZnNldCkge1xyXG4gICAgb2Zmc2V0ID0gb2Zmc2V0IHx8IDE7XHJcbiAgICBsZXQgaW5kZXggPSB0aGlzLmdhbGxlcnlBcnJheS5pbmRleE9mKHRoaXMuY3VycmVudEltYWdlSWQpO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmdhbGxlcnlBcnJheVsoaW5kZXggKyBvZmZzZXQpICUgdGhpcy5nYWxsZXJ5QXJyYXkubGVuZ3RoXTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLmdldFByZXZJbWFnZUlkID0gZnVuY3Rpb24gKG9mZnNldCkge1xyXG4gICAgb2Zmc2V0ID0gb2Zmc2V0IHx8IDE7XHJcblxyXG4gICAgbGV0IGluZGV4ID0gdGhpcy5nYWxsZXJ5QXJyYXkuaW5kZXhPZih0aGlzLmN1cnJlbnRJbWFnZUlkKTtcclxuXHJcbiAgICBpZiAofmluZGV4ICYmIHRoaXMuZ2FsbGVyeUFycmF5Lmxlbmd0aCA9PT0gMSlcclxuICAgICAgICByZXR1cm4gdGhpcy5nYWxsZXJ5QXJyYXlbMF07XHJcblxyXG4gICAgbGV0IGdhbGxlcnlQcmV2SW5kZXggPSBpbmRleCAtIG9mZnNldDtcclxuICAgIGlmIChnYWxsZXJ5UHJldkluZGV4IDwgMCkge1xyXG4gICAgICAgIGdhbGxlcnlQcmV2SW5kZXggJT0gdGhpcy5nYWxsZXJ5QXJyYXkubGVuZ3RoO1xyXG4gICAgICAgIGdhbGxlcnlQcmV2SW5kZXggPSB0aGlzLmdhbGxlcnlBcnJheS5sZW5ndGggKyBnYWxsZXJ5UHJldkluZGV4O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLmdhbGxlcnlBcnJheVtnYWxsZXJ5UHJldkluZGV4XTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnVwZGF0ZUN1cnJlbnRWaWV3ID0gZnVuY3Rpb24gKGludm9sdmVkSW1hZ2VJZCkge1xyXG5cclxuICAgIGlmIChpbnZvbHZlZEltYWdlSWQgPT09IHRoaXMuY3VycmVudEltYWdlSWQpIHtcclxuICAgICAgICB0aGlzLmhpZGVJbWdFbGVtKCk7XHJcblxyXG4gICAgICAgIHRoaXMuaW1nRWxlbS5zZXRBdHRyaWJ1dGUoJ3NyYycsIHRoaXMuY3VycmVudFZpZXdNb2RlbC5pbWdVcmwpO1xyXG5cclxuICAgICAgICB0aGlzLmxpa2VCdXR0b24uc2V0SW1hZ2VJZCh0aGlzLmN1cnJlbnRJbWFnZUlkKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUxpa2VzKHRoaXMuY3VycmVudEltYWdlSWQpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbW1lbnRTZWN0aW9uLnNldEltYWdlSWQodGhpcy5jdXJyZW50SW1hZ2VJZCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDb21tZW50cyh0aGlzLmN1cnJlbnRJbWFnZUlkKTtcclxuXHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbi50ZXh0Q29udGVudCA9IHRoaXMuY3VycmVudFZpZXdNb2RlbC5kZXNjcmlwdGlvbjtcclxuICAgICAgICBpZiAodGhpcy5kZXNjcmlwdGlvbi50ZXh0Q29udGVudCA9PT0gJycpXHJcbiAgICAgICAgICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdpbWFnZV9uby1kZXNjcmlwdGlvbicpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2ltYWdlX25vLWRlc2NyaXB0aW9uJyk7XHJcblxyXG4gICAgICAgIHRoaXMuZGF0ZS50ZXh0Q29udGVudCA9IHRoaXMuY3VycmVudFZpZXdNb2RlbC5jcmVhdGVEYXRlU3RyO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc0xvZ2dlZClcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFZpZXdNb2RlbC5pc093bkltYWdlKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWxldGVCdXR0b24uc2V0SW1hZ2VJZCh0aGlzLmN1cnJlbnRJbWFnZUlkKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVCdXR0b24uc2V0SW1hZ2VJZCh0aGlzLmN1cnJlbnRJbWFnZUlkKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNGZWVkKVxyXG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZUJ1dHRvbi5zZXQoe2FjdGl2ZTogdHJ1ZX0pO1xyXG5cclxuICAgICAgICB0aGlzLmF2YXRhci5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCcke3RoaXMuY3VycmVudFZpZXdNb2RlbC5hdXRob3IuYXZhdGFyVXJscy5tZWRpdW19JylgO1xyXG4gICAgICAgIHRoaXMudXNlcm5hbWUudGV4dENvbnRlbnQgPSB0aGlzLmN1cnJlbnRWaWV3TW9kZWwuYXV0aG9yLnVzZXJuYW1lO1xyXG5cclxuICAgICAgICB0aGlzLmhlYWRlckxlZnRTaWRlLnNldEF0dHJpYnV0ZSgnaHJlZicsIHRoaXMuY3VycmVudFZpZXdNb2RlbC5hdXRob3IudXJsKTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnVwZGF0ZUxpa2VzID0gZnVuY3Rpb24gKGltYWdlSWQpIHtcclxuICAgIGlmICh0aGlzLmN1cnJlbnRJbWFnZUlkID09PSBpbWFnZUlkKVxyXG4gICAgICAgIHRoaXMubGlrZUJ1dHRvbi5zZXQoe1xyXG4gICAgICAgICAgICBhY3RpdmU6IHRoaXMuY3VycmVudFZpZXdNb2RlbC5pc0xpa2VkLFxyXG4gICAgICAgICAgICBsaWtlQW1vdW50OiB0aGlzLmN1cnJlbnRWaWV3TW9kZWwubGlrZXMubGVuZ3RoXHJcbiAgICAgICAgfSk7XHJcbiAgICBpZiAodGhpcy5nYWxsZXJ5KVxyXG4gICAgICAgIHRoaXMudXBkYXRlSW1hZ2VQcmV2aWV3VGV4dChpbWFnZUlkKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnVwZGF0ZUNvbW1lbnRzID0gZnVuY3Rpb24gKGltYWdlSWQpIHtcclxuICAgIGlmICh0aGlzLmN1cnJlbnRJbWFnZUlkID09PSBpbWFnZUlkKVxyXG4gICAgICAgIHRoaXMuY29tbWVudFNlY3Rpb24uc2V0KHRoaXMuY3VycmVudFZpZXdNb2RlbC5jb21tZW50cyk7XHJcbiAgICBpZiAodGhpcy5nYWxsZXJ5KVxyXG4gICAgICAgIHRoaXMudXBkYXRlSW1hZ2VQcmV2aWV3VGV4dChpbWFnZUlkKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnB1c2hJbWFnZVN0YXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaGlzdG9yeS5wdXNoU3RhdGUoe1xyXG4gICAgICAgIHR5cGU6ICdpbWFnZScsXHJcbiAgICAgICAgaWQ6IHRoaXMuY3VycmVudEltYWdlSWRcclxuICAgIH0sICdpbWFnZSAjJyArIHRoaXMuY3VycmVudEltYWdlSWQsICcvaW1hZ2UvJyArIHRoaXMuY3VycmVudEltYWdlSWQpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUucHVzaEdhbGxlcnlTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBsZXQgdXJsID0gJyc7XHJcbiAgICBpZiAoIXRoaXMuaXNGZWVkKVxyXG4gICAgICAgIHVybCA9IHRoaXMuY3VycmVudFZpZXdNb2RlbCAmJiB0aGlzLmN1cnJlbnRWaWV3TW9kZWwuYXV0aG9yLnVybDtcclxuICAgIGVsc2VcclxuICAgICAgICB1cmwgPSAnL2ZlZWQnO1xyXG5cclxuICAgIGhpc3RvcnkucHVzaFN0YXRlKHtcclxuICAgICAgICB0eXBlOiAnZ2FsbGVyeSdcclxuICAgIH0sICcnLCB1cmwpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUub25Qb3BTdGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZSkge1xyXG5cclxuICAgIGlmIChzdGF0ZSAmJiBzdGF0ZS50eXBlKVxyXG4gICAgICAgIHN3aXRjaCAoc3RhdGUudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdpbWFnZSc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3coe1xyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlSWQ6IHN0YXRlLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIG5vUHVzaFN0YXRlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAnZ2FsbGVyeSc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlYWN0aXZhdGUobnVsbCwge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vUHVzaFN0YXRlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxufTtcclxuXHJcbmZvciAobGV0IGtleSBpbiBldmVudE1peGluKVxyXG4gICAgR2FsbGVyeS5wcm90b3R5cGVba2V5XSA9IGV2ZW50TWl4aW5ba2V5XTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FsbGVyeTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9nYWxsZXJ5L2luZGV4LmpzIiwibGV0IGV2ZW50TWl4aW4gPSByZXF1aXJlKExJQlMgKyAnZXZlbnRNaXhpbicpO1xyXG5cclxubGV0IFN3aXRjaEJ1dHRvbiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLmVsZW0gPSBvcHRpb25zLmVsZW07XHJcbiAgICB0aGlzLmRhdGEgPSBvcHRpb25zLmRhdGE7XHJcbiAgICB0aGlzLmRhdGFTdHIgPSBvcHRpb25zLmRhdGFTdHIgfHwgJ2ltYWdlSWQnO1xyXG5cclxuICAgIHRoaXMuYWN0aXZlVGV4dCA9IG9wdGlvbnMuYWN0aXZlVGV4dDtcclxuICAgIHRoaXMuaW5hY3RpdmVUZXh0ID0gb3B0aW9ucy5pbmFjdGl2ZVRleHQ7XHJcbiAgICB0aGlzLnRleHRFbGVtID0gb3B0aW9ucy50ZXh0RWxlbSB8fCB0aGlzLmVsZW07XHJcblxyXG4gICAgU3dpdGNoQnV0dG9uLnByb3RvdHlwZS5zZXQuY2FsbCh0aGlzLCB7YWN0aXZlOiAhIXRoaXMuZWxlbS5kYXRhc2V0LmFjdGl2ZX0pO1xyXG4gICAgY29uc29sZS5sb2coJ3N3aXRjaCBidXR0b24gYWN0aXZlOicsICEhdGhpcy5lbGVtLmRhdGFzZXQuYWN0aXZlKTtcclxuICAgIHRoaXMuYXZhaWxhYmxlID0gdHJ1ZTtcclxuXHJcbiAgICB0aGlzLmVsZW0ub25jbGljayA9IGUgPT4gdGhpcy5vbkNsaWNrKGUpO1xyXG59O1xyXG5cclxuU3dpdGNoQnV0dG9uLnByb3RvdHlwZS5vbkNsaWNrID0gZnVuY3Rpb24gKGUpIHtcclxuICAgIGxldCBpbnZvbHZlZERhdGEgPSB0aGlzLmRhdGE7XHJcblxyXG4gICAgaWYgKHRoaXMuYXZhaWxhYmxlKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYXZhaWxhYmxlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy50b2dnbGUoKTtcclxuXHJcbiAgICAgICAgcmVxdWlyZShMSUJTICsgJ3NlbmRSZXF1ZXN0Jykoe1xyXG4gICAgICAgICAgICBbdGhpcy5kYXRhU3RyXTogaW52b2x2ZWREYXRhXHJcbiAgICAgICAgfSwgJ1BPU1QnLCB0aGlzLnVybCwgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmICghZXJyKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXQocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCdzd2l0Y2gtYnV0dG9uX2NoYW5nZWQnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgW3RoaXMuZGF0YVN0cl06IGludm9sdmVkRGF0YSxcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yKGVycik7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSA9PT0gaW52b2x2ZWREYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5Td2l0Y2hCdXR0b24uc2V0UmVsYXRpb24gPSBmdW5jdGlvbiAoc3dpdGNoQnV0dG9uMSwgc3dpdGNoQnV0dG9uMikge1xyXG4gICAgc3dpdGNoQnV0dG9uMS5vbignc3dpdGNoLWJ1dHRvbl9jaGFuZ2VkJywgZSA9PiB7XHJcbiAgICAgICAgc3dpdGNoQnV0dG9uMi5zZXQoZS5kZXRhaWwucmVzcG9uc2UpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgc3dpdGNoQnV0dG9uMi5vbignc3dpdGNoLWJ1dHRvbl9jaGFuZ2VkJywgZSA9PiB7XHJcbiAgICAgICAgc3dpdGNoQnV0dG9uMS5zZXQoZS5kZXRhaWwucmVzcG9uc2UpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5Td2l0Y2hCdXR0b24ucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBpZiAob3B0aW9ucy5hY3RpdmUpXHJcbiAgICAgICAgdGhpcy5fYWN0aXZhdGUoKTtcclxuICAgIGVsc2VcclxuICAgICAgICB0aGlzLl9kZWFjdGl2YXRlKCk7XHJcbn07XHJcblxyXG5Td2l0Y2hCdXR0b24ucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLmFjdGl2ZSlcclxuICAgICAgICB0aGlzLnNldCh7YWN0aXZlOiBmYWxzZX0pO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHRoaXMuc2V0KHthY3RpdmU6IHRydWV9KTtcclxufTtcclxuXHJcblN3aXRjaEJ1dHRvbi5wcm90b3R5cGUuX2FjdGl2YXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ2J1dHRvbl9hY3RpdmUnKTtcclxuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcclxufTtcclxuXHJcblN3aXRjaEJ1dHRvbi5wcm90b3R5cGUuX2RlYWN0aXZhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnYnV0dG9uX2FjdGl2ZScpO1xyXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxufTtcclxuXHJcblN3aXRjaEJ1dHRvbi5wcm90b3R5cGUuc2V0SW1hZ2VJZCA9IGZ1bmN0aW9uIChpbWFnZUlkKSB7XHJcbiAgICB0aGlzLmRhdGEgPSBpbWFnZUlkO1xyXG59O1xyXG5cclxuZm9yIChsZXQga2V5IGluIGV2ZW50TWl4aW4pXHJcbiAgICBTd2l0Y2hCdXR0b24ucHJvdG90eXBlW2tleV0gPSBldmVudE1peGluW2tleV07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFN3aXRjaEJ1dHRvbjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL3N3aXRjaC1idXR0b24vaW5kZXguanMiLCJsZXQgZ2V0Q29ycmVjdE5vdW5Gb3JtID0gZnVuY3Rpb24gKHNpbmdsZUZvcm0sIGFtb3VudCkge1xyXG4gICAgcmV0dXJuIHNpbmdsZUZvcm0gKyAoKGFtb3VudCA9PT0gMSkgPyAnJyA6ICdzJyk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGdldENvcnJlY3ROb3VuRm9ybTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvZ2V0Q29ycmVjdE5vdW5Gb3JtLmpzIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxkaXYgaWQ9XFxcImltYWdlXFxcIiBjbGFzcz1cXFwibW9kYWwgaW1hZ2VfaW1nLWVsZW1lbnQtaW52aXNpYmxlIGltYWdlIGltYWdlX25vLWRlc2NyaXB0aW9uXFxcIj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2ltYWdlLXdyYXBwZXJcXFwiPlxcclxcbiAgICAgICAgPGRpdiBpZD1cXFwic3Bpbm5lclxcXCIgY2xhc3M9XFxcInNwaW5uZXIgaW1hZ2VfX3NwaW5uZXJcXFwiPlxcclxcbiAgICAgICAgXFxyXFxuICAgICAgICA8L2Rpdj4gICAgICAgIDxpbWcgY2xhc3M9XFxcImltYWdlX19pbWctZWxlbWVudFxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fY29udHJvbHNcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19jb250cm9sIGltYWdlX19jb250cm9sLXByZXYgaWNvbi1hcnJvdy1sZWZ0XFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fY29udHJvbCBpbWFnZV9fY29udHJvbC1mdWxsIGljb24tYXJyb3ctbWF4aW1pc2VcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19jb250cm9sIGltYWdlX19jb250cm9sLW5leHQgaWNvbi1hcnJvdy1yaWdodFxcXCI+PC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19zaWRlYmFyXFxcIj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX190b3Atc2lkZVxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaGVhZGVyIGltYWdlX19oZWFkZXJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8YSBjbGFzcz1cXFwiaW1hZ2VfX2hlYWRlci1sZWZ0LXNpZGVcXFwiIGhyZWY9XFxcIlxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fYXZhdGFyXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT1cXFwiYmFja2dyb3VuZC1pbWFnZTogdXJsKCcnKVxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fbWV0YWRhdGFcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX191c2VybmFtZVxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX3Bvc3QtZGF0ZVxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPC9hPlxcclxcblxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b24gYnV0dG9uX2ludmlzaWJsZSBpbWFnZV9fdG9wLXNpZGUtYnV0dG9uIGltYWdlX19kZWxldGUtYnV0dG9uIGJ1dHRvbl9oZWFkZXItc3R5bGVcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlXFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2XFxyXFxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cXFwiYnV0dG9uIGltYWdlX190b3Atc2lkZS1idXR0b24gaW1hZ2VfX3N1YnNjcmliZS1idXR0b24gYnV0dG9uX2hlYWRlci1zdHlsZVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgPlxcclxcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlXFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcblxcclxcblxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19pbmZvLWJvYXJkXFxcIj5cXHJcXG5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdlxcclxcbiAgICAgICAgICAgICAgICBcXHJcXG4gICAgICAgICAgICAgICAgICAgICBjbGFzcz1cXFwiYnV0dG9uIGxpa2UtYnV0dG9uIGltYWdlX19saWtlLWJ1dHRvblxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsaWtlLWJ1dHRvbl9faGVhcnQgaWNvbi1oZWFydFxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsaWtlLWJ1dHRvbl9faGVhcnQgaWNvbi1oZWFydC1vdXRsaW5lZFxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgICAgICAmbmJzcDtsaWtlJm5ic3A7XFxyXFxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwibGlrZS1idXR0b25fX2xpa2UtYW1vdW50XFxcIj48L3NwYW4+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fZGVzY3JpcHRpb25cXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgXFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcblxcclxcblxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19jb21tZW50LXNlY3Rpb24td3JhcHBlciBpbWFnZV9uby1zY3JvbGxiYXJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb21tZW50LXNlY3Rpb24gaW1hZ2VfX2NvbW1lbnQtc2VjdGlvblxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb21tZW50LXNlY3Rpb25fX25vLWNvbW1lbnRzLWJsb2NrXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBUaGVyZSBhcmUgbm8gY29tbWVudHMgeWV0XFxyXFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnQtc2VjdGlvbl9fY29tbWVudHMtd3JhcHBlclxcXCI+XFxyXFxuXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInBhbmVsIGNvbW1lbnQgY29tbWVudC1zZWN0aW9uX19jb21tZW50IGNvbW1lbnRfZ2hvc3RcXFwiIGRhdGEtaWQ9XFxcIlxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb21tZW50X190b3Atc2lkZVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XFxcImNvbW1lbnRfX3JlZlxcXCIgaHJlZj1cXFwiXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudF9fYXZhdGFyXFxcIiBzdHlsZT1cXFwiYmFja2dyb3VuZC1pbWFnZTogdXJsKCcnKVxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnRfX21ldGFkYXRhXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnRfX3VzZXJuYW1lXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnRfX2RhdGVcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudF9fY2xvc2UtYnV0dG9uIGljb24tY3Jvc3NcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb21tZW50X190ZXh0XFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2NvbW1lbnQtc2VjdGlvbi1zY3JvbGxiYXItd3JhcHBlciBpbWFnZV9uby1zY3JvbGxiYXJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fY29tbWVudC1zZWN0aW9uLXNjcm9sbGJhci1vZmZzZXRcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fY29tbWVudC1zZWN0aW9uLXNjcm9sbGJhclxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fY29tbWVudC1zZWN0aW9uLXNsaWRlclxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJwYW5lbCBjb21tZW50IGNvbW1lbnQtc2VuZCBpbWFnZV9fY29tbWVudC1zZW5kXFxcIlxcclxcbiAgICAgICAgICAgICBkYXRhLWltYWdlLWlkPVxcXCJcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnRfX3RvcC1zaWRlXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudF9fYXZhdGFyXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudF9fdXNlcm5hbWVcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICAgICAgICAgIDx0ZXh0YXJlYSBwbGFjZWhvbGRlcj1cXFwic2hhcmUgeW91ciBvcGluaW9u4oCmXFxcIiBjbGFzcz1cXFwiY29tbWVudC1zZW5kX190ZXh0YXJlYVxcXCI+PC90ZXh0YXJlYT5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b24gY29tbWVudC1zZW5kX19zZW5kLWJ1dHRvblxcXCI+c2VuZDwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fbW9kYWwtY2xvc2UtYnV0dG9uLXdyYXBwZXJcXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiaWNvbi1jcm9zcyBtb2RhbC1jbG9zZS1idXR0b24gaW1hZ2VfX21vZGFsLWNsb3NlLWJ1dHRvblxcXCI+PC9kaXY+ICAgIDwvZGl2PlxcclxcblxcclxcbjwvZGl2PlxcclxcblxcclxcblwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9+L2h0bWwtbG9hZGVyIS4uL2Jsb2Nrcy9nYWxsZXJ5L3dpbmRvd1xuLy8gbW9kdWxlIGlkID0gMzNcbi8vIG1vZHVsZSBjaHVua3MgPSAzIDggMTMiLCJsZXQgQ29tbWVudFNlY3Rpb24gPSByZXF1aXJlKEJMT0NLUyArICdjb21tZW50LXNlY3Rpb24nKTtcclxuXHJcbmxldCBJbWFnZUNvbW1lbnRTZWN0aW9uID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIENvbW1lbnRTZWN0aW9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblxyXG4gICAgdGhpcy5jb21tZW50U2VjdGlvbldyYXBwZXIgPSBvcHRpb25zLmNvbW1lbnRTZWN0aW9uV3JhcHBlcjtcclxuICAgIHRoaXMuaW5mb0JvYXJkID0gb3B0aW9ucy5pbmZvQm9hcmQ7XHJcbiAgICB0aGlzLnNjcm9sbGJhcldyYXBwZXIgPSBvcHRpb25zLnNjcm9sbGJhcldyYXBwZXI7XHJcbiAgICB0aGlzLnNjcm9sbGJhciA9IHRoaXMuc2Nyb2xsYmFyV3JhcHBlci5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2NvbW1lbnQtc2VjdGlvbi1zY3JvbGxiYXInKTtcclxuICAgIHRoaXMuc2Nyb2xsYmFyT2Zmc2V0ID0gdGhpcy5zY3JvbGxiYXJXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fY29tbWVudC1zZWN0aW9uLXNjcm9sbGJhci1vZmZzZXQnKTtcclxuICAgIHRoaXMuc2Nyb2xsYmFyU2xpZGVyID0gdGhpcy5zY3JvbGxiYXJXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fY29tbWVudC1zZWN0aW9uLXNsaWRlcicpO1xyXG5cclxuICAgIHRoaXMuY29tbWVudFNlY3Rpb25XcmFwcGVyLm9uc2Nyb2xsID0gZSA9PiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLm9uRHJhZ2dpbmcpXHJcbiAgICAgICAgICAgIHRoaXMuc2V0VG9wKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuc2Nyb2xsYmFyU2xpZGVyLm9ubW91c2Vkb3duID0gZSA9PiB7XHJcblxyXG4gICAgICAgIHRoaXMub25EcmFnZ2luZyA9IHRydWU7XHJcbiAgICAgICAgbGV0IHNsaWRlckNvb3JkcyA9IGdldENvb3Jkcyh0aGlzLnNjcm9sbGJhclNsaWRlcik7XHJcbiAgICAgICAgbGV0IHNoaWZ0WSA9IGUucGFnZVkgLSBzbGlkZXJDb29yZHMudG9wO1xyXG4gICAgICAgIGxldCBzY3JvbGxiYXJDb29yZHMgPSBnZXRDb29yZHModGhpcy5zY3JvbGxiYXIpO1xyXG4gICAgICAgIGxldCBuZXdUb3A7XHJcblxyXG4gICAgICAgIGRvY3VtZW50Lm9ubW91c2Vtb3ZlID0gZSA9PiB7XHJcbiAgICAgICAgICAgIG5ld1RvcCA9IGUucGFnZVkgLSBzaGlmdFkgLSBzY3JvbGxiYXJDb29yZHMudG9wO1xyXG4gICAgICAgICAgICBpZiAobmV3VG9wIDwgMCkgbmV3VG9wID0gMDtcclxuICAgICAgICAgICAgbGV0IGJvdHRvbUVkZ2UgPSB0aGlzLnNjcm9sbGJhci5vZmZzZXRIZWlnaHQgLSB0aGlzLnNjcm9sbGJhclNsaWRlci5vZmZzZXRIZWlnaHQ7XHJcbiAgICAgICAgICAgIGlmIChuZXdUb3AgPiBib3R0b21FZGdlKSBuZXdUb3AgPSBib3R0b21FZGdlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zY3JvbGxiYXJTbGlkZXIuc3R5bGUudG9wID0gbmV3VG9wICsgJ3B4JztcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY29tbWVudFNlY3Rpb25XcmFwcGVyLnNjcm9sbFRvcCA9IChuZXdUb3AgLyB0aGlzLnNjcm9sbGJhci5vZmZzZXRIZWlnaHQpIC8gKDEgLSB0aGlzLnNsaWRlclNpemVSYXRlKSAqXHJcbiAgICAgICAgICAgICAgICAodGhpcy5jb21tZW50U2VjdGlvbldyYXBwZXIuc2Nyb2xsSGVpZ2h0IC0gdGhpcy5jb21tZW50U2VjdGlvbldyYXBwZXIub2Zmc2V0SGVpZ2h0KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBkb2N1bWVudC5vbm1vdXNldXAgPSBlID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ29ubW91c2V1cCcsIG5ld1RvcCwgdGhpcy5zY3JvbGxiYXIub2Zmc2V0SGVpZ2h0KTtcclxuICAgICAgICAgICAgdGhpcy5zY3JvbGxiYXJTbGlkZXIuc3R5bGUudG9wID0gKG5ld1RvcCAqIDEwMCAvIHRoaXMuc2Nyb2xsYmFyLm9mZnNldEhlaWdodCkgKyAnJSc7XHJcbiAgICAgICAgICAgIHRoaXMub25EcmFnZ2luZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5vbm1vdXNlbW92ZSA9IGRvY3VtZW50Lm9ubW91c2V1cCA9IG51bGw7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBkaXNhYmxlIHNlbGVjdGlvbiBzdGFydCAoY3Vyc29yIGNoYW5nZSlcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5zY3JvbGxiYXJTbGlkZXIub25kcmFnc3RhcnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRDb29yZHMoZWxlbSkgeyAvLyDQutGA0L7QvNC1IElFOC1cclxuICAgICAgICBsZXQgYm94ID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdG9wOiBib3gudG9wICsgcGFnZVlPZmZzZXQsXHJcbiAgICAgICAgICAgIGxlZnQ6IGJveC5sZWZ0ICsgcGFnZVhPZmZzZXRcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbn07XHJcbkltYWdlQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb21tZW50U2VjdGlvbi5wcm90b3R5cGUpO1xyXG5JbWFnZUNvbW1lbnRTZWN0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEltYWdlQ29tbWVudFNlY3Rpb247XHJcblxyXG5JbWFnZUNvbW1lbnRTZWN0aW9uLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBDb21tZW50U2VjdGlvbi5wcm90b3R5cGUuc2V0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICB0aGlzLnVwZGF0ZSgpO1xyXG59O1xyXG5cclxuSW1hZ2VDb21tZW50U2VjdGlvbi5wcm90b3R5cGUuc2V0VG9wID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IHNjcm9sbFJhdGUgPSAodGhpcy5jb21tZW50U2VjdGlvbldyYXBwZXIuc2Nyb2xsVG9wKSAvXHJcbiAgICAgICAgKHRoaXMuY29tbWVudFNlY3Rpb25XcmFwcGVyLnNjcm9sbEhlaWdodCAtIHRoaXMuY29tbWVudFNlY3Rpb25XcmFwcGVyLm9mZnNldEhlaWdodCkgKiAxMDA7XHJcblxyXG4gICAgdGhpcy5zY3JvbGxiYXJTbGlkZXIuc3R5bGUudG9wID0gYCR7KDEgLSB0aGlzLnNsaWRlclNpemVSYXRlKSAqIHNjcm9sbFJhdGV9JWA7XHJcblxyXG59O1xyXG5cclxuSW1hZ2VDb21tZW50U2VjdGlvbi5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5jb21tZW50U2VjdGlvbldyYXBwZXIuY2xhc3NMaXN0LmFkZCgnaW1hZ2Vfbm8tc2Nyb2xsYmFyJyk7XHJcbiAgICB0aGlzLnNjcm9sbGJhcldyYXBwZXIuY2xhc3NMaXN0LmFkZCgnaW1hZ2Vfbm8tc2Nyb2xsYmFyJyk7XHJcblxyXG4gICAgdGhpcy5pbmZvQm9hcmRIZWlnaHQgPSB0aGlzLmluZm9Cb2FyZC5vZmZzZXRIZWlnaHQ7XHJcblxyXG4gICAgbGV0IGNvbXB1dGVkU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKHRoaXMuaW5mb0JvYXJkKTtcclxuICAgIHBhcnNlRmxvYXQoY29tcHV0ZWRTdHlsZS5oZWlnaHQpICYmICh0aGlzLmluZm9Cb2FyZEhlaWdodCA9IHBhcnNlRmxvYXQoY29tcHV0ZWRTdHlsZS5oZWlnaHQpKTtcclxuXHJcbiAgICB0aGlzLnNjcm9sbGJhck9mZnNldC5zdHlsZS5oZWlnaHQgPSBgJHt0aGlzLmluZm9Cb2FyZEhlaWdodH1weGA7XHJcbiAgICB0aGlzLnNjcm9sbGJhci5zdHlsZS5oZWlnaHQgPSBgY2FsYygxMDAlIC0gJHt0aGlzLmluZm9Cb2FyZEhlaWdodH1weClgO1xyXG5cclxuICAgIGlmICh0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlci5vZmZzZXRIZWlnaHQgLSB0aGlzLmNvbW1lbnRzV3JhcHBlci5zY3JvbGxIZWlnaHQgPCAtMSkge1xyXG4gICAgICAgIHRoaXMuc2xpZGVyU2l6ZVJhdGUgPSB0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlci5vZmZzZXRIZWlnaHQgLyB0aGlzLmNvbW1lbnRzV3JhcHBlci5zY3JvbGxIZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJTbGlkZXIuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5zbGlkZXJTaXplUmF0ZSAqIDEwMH0lYDtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRUb3AoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb21tZW50U2VjdGlvbldyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSgnaW1hZ2Vfbm8tc2Nyb2xsYmFyJyk7XHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJXcmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2ltYWdlX25vLXNjcm9sbGJhcicpO1xyXG4gICAgfVxyXG5cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEltYWdlQ29tbWVudFNlY3Rpb247XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9pbWFnZS1jb21tZW50LXNlY3Rpb24vaW5kZXguanMiLCJsZXQgZXZlbnRNaXhpbiA9IHJlcXVpcmUoTElCUyArICdldmVudE1peGluJyk7XHJcblxyXG5sZXQgQ29tbWVudFNlY3Rpb24gPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgIHRoaXMuZWxlbSA9IG9wdGlvbnMuZWxlbTtcclxuICAgIHRoaXMuY29tbWVudHNXcmFwcGVyID0gb3B0aW9ucy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50LXNlY3Rpb25fX2NvbW1lbnRzLXdyYXBwZXInKTtcclxuICAgIHRoaXMuaW1hZ2VJZCA9IG9wdGlvbnMuaW1hZ2VJZDtcclxuICAgIHRoaXMubG9nZ2VkVXNlclZpZXdNb2RlbCA9IG9wdGlvbnMubG9nZ2VkVXNlclZpZXdNb2RlbDtcclxuXHJcbiAgICB0aGlzLmNvbW1lbnRTZW5kZXJFbGVtID0gb3B0aW9ucy5jb21tZW50U2VuZGVyRWxlbTtcclxuICAgIHRoaXMuY29tbWVudFNlbmRUZXh0YXJlYSA9IHRoaXMuY29tbWVudFNlbmRlckVsZW0ucXVlcnlTZWxlY3RvcignLmNvbW1lbnQtc2VuZF9fdGV4dGFyZWEnKTtcclxuXHJcbiAgICB0aGlzLmdob3N0ID0gdGhpcy5jb21tZW50c1dyYXBwZXIucXVlcnlTZWxlY3RvcignLmNvbW1lbnQnKTtcclxuXHJcbiAgICBpZiAodGhpcy5sb2dnZWRVc2VyVmlld01vZGVsKSB7XHJcbiAgICAgICAgdGhpcy5jb21tZW50U2VuZGVyRWxlbS5xdWVyeVNlbGVjdG9yKCcuY29tbWVudF9fYXZhdGFyJykuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgnJHt0aGlzLmxvZ2dlZFVzZXJWaWV3TW9kZWwuYXZhdGFyVXJscy5tZWRpdW19JylgO1xyXG4gICAgICAgIHRoaXMuY29tbWVudFNlbmRlckVsZW0ucXVlcnlTZWxlY3RvcignLmNvbW1lbnRfX3VzZXJuYW1lJykudGV4dENvbnRlbnQgPSB0aGlzLmxvZ2dlZFVzZXJWaWV3TW9kZWwudXNlcm5hbWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY29tbWVudFNlbmRlckVsZW0ucXVlcnlTZWxlY3RvcignLmNvbW1lbnRfX2F2YXRhcicpLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJyR7QU5PTl9BVkFUQVJfVVJMfScpYDtcclxuICAgICAgICB0aGlzLmNvbW1lbnRTZW5kZXJFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50X191c2VybmFtZScpLnRleHRDb250ZW50ID0gQU5PTl9OQU1FO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY29tbWVudFNlbmRlckVsZW0ub25jbGljayA9IGUgPT4ge1xyXG4gICAgICAgIGlmICghZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb21tZW50LXNlbmRfX3NlbmQtYnV0dG9uJykpIHJldHVybjtcclxuXHJcbiAgICAgICAgbGV0IGludm9sdmVkSW1hZ2VJZCA9IHRoaXMuaW1hZ2VJZDtcclxuICAgICAgICBsZXQgdGV4dCA9IHRoaXMuY29tbWVudFNlbmRUZXh0YXJlYS52YWx1ZTtcclxuICAgICAgICBpZiAodGV4dC5sZW5ndGgpIHtcclxuXHJcbiAgICAgICAgICAgIHJlcXVpcmUoTElCUyArICdzZW5kUmVxdWVzdCcpKHtcclxuICAgICAgICAgICAgICAgIGlkOiBpbnZvbHZlZEltYWdlSWQsXHJcbiAgICAgICAgICAgICAgICB0ZXh0XHJcbiAgICAgICAgICAgIH0sICdQT1NUJywgJy9jb21tZW50JywgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbW1lbnRTZW5kVGV4dGFyZWEudmFsdWUgPSAnJztcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmltYWdlSWQgPT09IGludm9sdmVkSW1hZ2VJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0TmV3Q29tbWVudChyZXNwb25zZS52aWV3TW9kZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG9Cb3R0b20oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ2NvbW1lbnQtc2VjdGlvbl9jaGFuZ2VkJywge1xyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlSWQ6IGludm9sdmVkSW1hZ2VJZFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuZWxlbS5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgaWYgKCFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2NvbW1lbnRfX2Nsb3NlLWJ1dHRvbicpKSByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCBjb21tZW50ID0gZS50YXJnZXQuY2xvc2VzdCgnLmNvbW1lbnQnKTtcclxuICAgICAgICBsZXQgY29tbWVudElkID0gY29tbWVudC5kYXRhc2V0LmlkO1xyXG4gICAgICAgIGxldCBpbnZvbHZlZEltYWdlSWQgPSB0aGlzLmltYWdlSWQ7XHJcblxyXG4gICAgICAgIHJlcXVpcmUoTElCUyArICdzZW5kUmVxdWVzdCcpKHtcclxuICAgICAgICAgICAgaWQ6IGNvbW1lbnRJZFxyXG4gICAgICAgIH0sICdERUxFVEUnLCAnL2NvbW1lbnQnLCAoZXJyLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcignY29tbWVudC1zZWN0aW9uX2NoYW5nZWQnLCB7XHJcbiAgICAgICAgICAgICAgICBpbWFnZUlkOiBpbnZvbHZlZEltYWdlSWRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNvbW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxufTtcclxuXHJcbkNvbW1lbnRTZWN0aW9uLnByb3RvdHlwZS5zY3JvbGxUb0JvdHRvbSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuY29tbWVudHNXcmFwcGVyLnNjcm9sbFRvcCA9IHRoaXMuY29tbWVudHNXcmFwcGVyLnNjcm9sbEhlaWdodDtcclxufTtcclxuXHJcbkNvbW1lbnRTZWN0aW9uLnByb3RvdHlwZS5pbnNlcnROZXdDb21tZW50ID0gZnVuY3Rpb24gKHZpZXdNb2RlbCkge1xyXG4gICAgbGV0IG5ld0NvbW1lbnQgPSB0aGlzLmdob3N0LmNsb25lTm9kZSh0cnVlKTtcclxuICAgIG5ld0NvbW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY29tbWVudF9naG9zdCcpO1xyXG4gICAgbmV3Q29tbWVudC5kYXRhc2V0LmlkID0gdmlld01vZGVsLl9pZDtcclxuICAgIG5ld0NvbW1lbnQucXVlcnlTZWxlY3RvcignLmNvbW1lbnRfX3JlZicpLnNldEF0dHJpYnV0ZSgnaHJlZicsIHZpZXdNb2RlbC5jb21tZW50YXRvci51cmwpO1xyXG4gICAgbmV3Q29tbWVudC5xdWVyeVNlbGVjdG9yKCcuY29tbWVudF9fYXZhdGFyJykuc3R5bGUuYmFja2dyb3VuZEltYWdlID1cclxuICAgICAgICBgdXJsKCcke3ZpZXdNb2RlbC5jb21tZW50YXRvci5hdmF0YXJVcmxzLm1lZGl1bX0nKWA7XHJcbiAgICBuZXdDb21tZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50X191c2VybmFtZScpLnRleHRDb250ZW50ID0gdmlld01vZGVsLmNvbW1lbnRhdG9yLnVzZXJuYW1lO1xyXG4gICAgbmV3Q29tbWVudC5xdWVyeVNlbGVjdG9yKCcuY29tbWVudF9fZGF0ZScpLnRleHRDb250ZW50ID0gdmlld01vZGVsLmNyZWF0ZURhdGVTdHI7XHJcblxyXG4gICAgaWYgKCF2aWV3TW9kZWwuaXNPd25Db21tZW50KVxyXG4gICAgICAgIG5ld0NvbW1lbnQuY2xhc3NMaXN0LmFkZCgnY29tbWVudF9ub3Qtb3duJyk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgbmV3Q29tbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjb21tZW50X25vdC1vd24nKTtcclxuXHJcbiAgICBuZXdDb21tZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50X190ZXh0JykudGV4dENvbnRlbnQgPSB2aWV3TW9kZWwudGV4dDtcclxuICAgIHRoaXMuY29tbWVudHNXcmFwcGVyLmFwcGVuZENoaWxkKG5ld0NvbW1lbnQpO1xyXG5cclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdjb21tZW50LXNlY3Rpb25fbm8tY29tbWVudHMnKTtcclxufTtcclxuXHJcblxyXG5Db21tZW50U2VjdGlvbi5wcm90b3R5cGUuc2V0SW1hZ2VJZCA9IGZ1bmN0aW9uIChpbWFnZUlkKSB7XHJcbiAgICB0aGlzLmltYWdlSWQgPSBpbWFnZUlkO1xyXG59O1xyXG5cclxuQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uICh2aWV3TW9kZWxzKSB7XHJcbiAgICB0aGlzLmNsZWFyKCk7XHJcblxyXG4gICAgaWYgKHZpZXdNb2RlbHMubGVuZ3RoID4gMClcclxuICAgICAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnY29tbWVudC1zZWN0aW9uX25vLWNvbW1lbnRzJyk7XHJcblxyXG4gICAgdmlld01vZGVscy5mb3JFYWNoKHZpZXdNb2RlbCA9PiB7XHJcbiAgICAgICAgdGhpcy5pbnNlcnROZXdDb21tZW50KHZpZXdNb2RlbCk7XHJcbiAgICB9KTtcclxuXHJcbn07XHJcblxyXG5Db21tZW50U2VjdGlvbi5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgdGhpcy5jb21tZW50c1dyYXBwZXIuaW5uZXJIVE1MID0gJyc7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnY29tbWVudC1zZWN0aW9uX25vLWNvbW1lbnRzJyk7XHJcbn07XHJcblxyXG5cclxuZm9yIChsZXQga2V5IGluIGV2ZW50TWl4aW4pXHJcbiAgICBDb21tZW50U2VjdGlvbi5wcm90b3R5cGVba2V5XSA9IGV2ZW50TWl4aW5ba2V5XTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29tbWVudFNlY3Rpb247XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvY29tbWVudC1zZWN0aW9uL2luZGV4LmpzIiwibGV0IFN3aXRjaEJ1dHRvbiA9IHJlcXVpcmUoQkxPQ0tTICsgJ3N3aXRjaC1idXR0b24nKTtcclxuXHJcbmxldCBMaWtlQnV0dG9uID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIFN3aXRjaEJ1dHRvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cclxuICAgIHRoaXMubGlrZUFtb3VudCA9ICt0aGlzLmVsZW0uZGF0YXNldC5saWtlQW1vdW50O1xyXG4gICAgdGhpcy5saWtlQW1vdW50RWxlbSA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcubGlrZS1idXR0b25fX2xpa2UtYW1vdW50Jyk7XHJcblxyXG5cclxuICAgIHRoaXMudXJsID0gJy9saWtlJztcclxuXHJcblxyXG5cclxufTtcclxuTGlrZUJ1dHRvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFN3aXRjaEJ1dHRvbi5wcm90b3R5cGUpO1xyXG5MaWtlQnV0dG9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IExpa2VCdXR0b247XHJcblxyXG5MaWtlQnV0dG9uLnByb3RvdHlwZS5zZXRBbW91bnQgPSBmdW5jdGlvbiAobGlrZUFtb3VudCkge1xyXG4gICAgdGhpcy5saWtlQW1vdW50ID0gbGlrZUFtb3VudDtcclxuICAgIHRoaXMubGlrZUFtb3VudEVsZW0udGV4dENvbnRlbnQgPSBsaWtlQW1vdW50O1xyXG59O1xyXG5cclxuTGlrZUJ1dHRvbi5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuc2V0QW1vdW50KG9wdGlvbnMubGlrZUFtb3VudCk7XHJcbiAgICBTd2l0Y2hCdXR0b24ucHJvdG90eXBlLnNldC5jYWxsKHRoaXMsIG9wdGlvbnMpO1xyXG59O1xyXG5cclxuTGlrZUJ1dHRvbi5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuYWN0aXZlKVxyXG4gICAgICAgIHRoaXMuc2V0KHthY3RpdmU6IGZhbHNlLCBsaWtlQW1vdW50OiB0aGlzLmxpa2VBbW91bnQgLSAxfSk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5zZXQoe2FjdGl2ZTogdHJ1ZSwgbGlrZUFtb3VudDogdGhpcy5saWtlQW1vdW50ICsgMX0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMaWtlQnV0dG9uO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL2xpa2UtYnV0dG9uL2luZGV4LmpzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2ltYWdlL3N0eWxlLmxlc3Ncbi8vIG1vZHVsZSBpZCA9IDQzXG4vLyBtb2R1bGUgY2h1bmtzID0gOCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNaQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7OztBQUVBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUdBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7Ozs7Ozs7O0FDdFFBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNiQTs7Ozs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBOzs7QUFFQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQ0E7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUtBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTs7Ozs7Ozs7OztBQy90QkE7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBOzs7QUFFQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBOzs7Ozs7OztBQzFGQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ0hBOzs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7Ozs7Ozs7OztBQ3RHQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7Ozs7Ozs7O0FDL0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTs7Ozs7Ozs7Ozs7OztBQ2pDQTs7OyIsInNvdXJjZVJvb3QiOiIifQ==