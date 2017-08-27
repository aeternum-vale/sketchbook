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

	__webpack_require__(42);

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

	        if (!_this3.elem) _this3.elem = _this3.renderWindow(__webpack_require__(32));

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

	        var CommentSection = __webpack_require__(33);
	        var LikeButton = __webpack_require__(35);

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
	                    var DeleteImageButton = __webpack_require__(36);
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
	                    var SubscribeButton = __webpack_require__(39);
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
	        })['catch'](function (err) {
	            reject(err);
	        });
	    });
	};

	Gallery.prototype.hide = function (options) {
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

	module.exports = "<div id=\"image\" class=\"modal image_img-element-invisible image image_no-description\">\r\n    <div class=\"image__image-wrapper\">\r\n        <div id=\"spinner\" class=\"spinner image__spinner\">\r\n        \r\n        </div>        <img class=\"image__img-element\">\r\n        <div class=\"image__controls\">\r\n            <div class=\"image__control image__control-prev icon-arrow-left\"></div>\r\n            <div class=\"image__control image__control-full icon-arrow-maximise\"></div>\r\n            <div class=\"image__control image__control-next icon-arrow-right\"></div>\r\n        </div>\r\n    </div>\r\n    <div class=\"image__sidebar\">\r\n        <div class=\"image__top-side\">\r\n            <div class=\"header image__header\">\r\n                <a class=\"image__header-left-side\" href=\"\">\r\n                    <div class=\"image__avatar\"\r\n                         style=\"background-image: url('')\"></div>\r\n                    <div class=\"image__metadata\">\r\n                        <div class=\"image__username\"></div>\r\n                        <div class=\"image__post-date\"></div>\r\n                    </div>\r\n                </a>\r\n\r\n                <div class=\"button button_invisible image__top-side-button image__delete-button button_header-style\">\r\n                    delete\r\n                </div>\r\n                <div\r\n                    class=\"button image__top-side-button image__subscribe-button button_header-style\"\r\n                >\r\n                    subscribe\r\n                </div>\r\n            </div>\r\n\r\n\r\n            <div class=\"image__info-board\">\r\n                <div\r\n                     class=\"button like-button image__like-button\">\r\n                    like \r\n                </div>\r\n\r\n                <div class=\"image__description\">\r\n                    \r\n                </div>\r\n\r\n            </div>\r\n\r\n\r\n            <div class=\"image__comment-section-wrapper image_no-scrollbar\">\r\n                <div class=\"comment-section image__comment-section\">\r\n                    <div class=\"comment-section__comments-wrapper\">\r\n                            <div class=\"panel comment comment-section__comment comment_ghost\" data-id=\"\">\r\n                                <div class=\"comment__top-side\">\r\n                                    <a class=\"comment__ref\" href=\"\">\r\n                                        <div class=\"comment__avatar\" style=\"background-image: url('')\"></div>\r\n                                        <div class=\"comment__metadata\">\r\n                                            <div class=\"comment__username\"></div>\r\n                                            <div class=\"comment__date\"></div>\r\n                                        </div>\r\n                                    </a>\r\n                                    <div class=\"comment__close-button icon-cross\"></div>\r\n                                </div>\r\n                                <div class=\"comment__text\"></div>\r\n                            </div>\r\n\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"image__comment-section-scrollbar-wrapper image_no-scrollbar\">\r\n                <div class=\"image__comment-section-scrollbar-offset\"></div>\r\n                <div class=\"image__comment-section-scrollbar\">\r\n                    <div class=\"image__comment-section-slider\"></div>\r\n                </div>\r\n\r\n            </div>\r\n\r\n\r\n        </div>\r\n\r\n        <div class=\"panel comment comment-send image__comment-send\"\r\n             data-image-id=\"\">\r\n            <div class=\"comment__top-side\">\r\n                <div class=\"comment__avatar\" style=\"background-image: url('')\"></div>\r\n                <div class=\"comment__username\"></div>\r\n            </div>\r\n\r\n            <textarea placeholder=\"share your opinion…\" class=\"comment-send__textarea\"></textarea>\r\n            <div class=\"button comment-send__send-button\">send</div>\r\n        </div>\r\n    </div>\r\n    <div class=\"image__modal-close-button-wrapper\">\r\n        <div class=\"icon-cross modal-close-button image__modal-close-button\"></div>    </div>\r\n\r\n</div>\r\n\r\n";

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var CommentSection = __webpack_require__(34);

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
/* 34 */
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
	        this.commentSenderElem.querySelector('.comment__username').textContent = ("ano2nym");
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
	};

	CommentSection.prototype.setImageId = function (imageId) {
	    this.imageId = imageId;
	};

	CommentSection.prototype.set = function (viewModels) {
	    var _this2 = this;

	    this.clear();

	    viewModels.forEach(function (viewModel) {
	        _this2.insertNewComment(viewModel);
	    });
	};

	CommentSection.prototype.clear = function () {
	    this.commentsWrapper.innerHTML = '';
	};

	for (var key in eventMixin) {
	    CommentSection.prototype[key] = eventMixin[key];
		}module.exports = CommentSection;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var SwitchButton = __webpack_require__(31);

	var LikeButton = function LikeButton(options) {
	    SwitchButton.apply(this, arguments);

	    this.likeAmount = +this.elem.dataset.likeAmount;
	    this.url = '/like';
	};
	LikeButton.prototype = Object.create(SwitchButton.prototype);
	LikeButton.prototype.constructor = LikeButton;

	LikeButton.prototype.setAmount = function (likeAmount) {
	    this.likeAmount = likeAmount;
	    this.elem.textContent = 'like ' + this.likeAmount;
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
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2UuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODYwNzUwNzYyYzAzZjg5NmFkOWU/N2NmZCoiLCJ3ZWJwYWNrOi8vLy4vaW1hZ2Uvc2NyaXB0LmpzIiwid2VicGFjazovLy8uLi9ibG9ja3MvZ2xvYmFsLWVycm9yLWhhbmRsZXIvaW5kZXguanM/YjAxNioiLCJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2NvbXBvbmVudEVycm9ycy5qcz9hY2I1Iiwid2VicGFjazovLy8uLi9ibG9ja3MvbW9kYWwvaW5kZXguanM/OWM0NiIsIndlYnBhY2s6Ly8vRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvZXZlbnRNaXhpbi5qcz8zY2JjIiwid2VicGFjazovLy8uLi9ibG9ja3Mvc3Bpbm5lci9pbmRleC5qcz8wNDkyIiwid2VicGFjazovLy8uLi9ibG9ja3Mvc3Bpbm5lci9tYXJrdXA/NDdkNyIsIndlYnBhY2s6Ly8vRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvc2VuZFJlcXVlc3QuanM/OGEyNyIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2dhbGxlcnkvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9zd2l0Y2gtYnV0dG9uL2luZGV4LmpzIiwid2VicGFjazovLy8uLi9ibG9ja3MvZ2FsbGVyeS93aW5kb3ciLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9pbWFnZS1jb21tZW50LXNlY3Rpb24vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9jb21tZW50LXNlY3Rpb24vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9saWtlLWJ1dHRvbi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9pbWFnZS9zdHlsZS5sZXNzIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xuIFx0dmFyIHBhcmVudEpzb25wRnVuY3Rpb24gPSB3aW5kb3dbXCJ3ZWJwYWNrSnNvbnBcIl07XG4gXHR3aW5kb3dbXCJ3ZWJwYWNrSnNvbnBcIl0gPSBmdW5jdGlvbiB3ZWJwYWNrSnNvbnBDYWxsYmFjayhjaHVua0lkcywgbW9yZU1vZHVsZXMpIHtcbiBcdFx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG4gXHRcdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuIFx0XHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwLCBjYWxsYmFja3MgPSBbXTtcbiBcdFx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG4gXHRcdFx0aWYoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKVxuIFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2guYXBwbHkoY2FsbGJhY2tzLCBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pO1xuIFx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG4gXHRcdH1cbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRpZihwYXJlbnRKc29ucEZ1bmN0aW9uKSBwYXJlbnRKc29ucEZ1bmN0aW9uKGNodW5rSWRzLCBtb3JlTW9kdWxlcyk7XG4gXHRcdHdoaWxlKGNhbGxiYWNrcy5sZW5ndGgpXG4gXHRcdFx0Y2FsbGJhY2tzLnNoaWZ0KCkuY2FsbChudWxsLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0fTtcblxuIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3NcbiBcdC8vIFwiMFwiIG1lYW5zIFwiYWxyZWFkeSBsb2FkZWRcIlxuIFx0Ly8gQXJyYXkgbWVhbnMgXCJsb2FkaW5nXCIsIGFycmF5IGNvbnRhaW5zIGNhbGxiYWNrc1xuIFx0dmFyIGluc3RhbGxlZENodW5rcyA9IHtcbiBcdFx0ODowLFxuIFx0XHQzOjAsXG4gXHRcdDEzOjBcbiBcdH07XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuIFx0Ly8gVGhpcyBmaWxlIGNvbnRhaW5zIG9ubHkgdGhlIGVudHJ5IGNodW5rLlxuIFx0Ly8gVGhlIGNodW5rIGxvYWRpbmcgZnVuY3Rpb24gZm9yIGFkZGl0aW9uYWwgY2h1bmtzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmUgPSBmdW5jdGlvbiByZXF1aXJlRW5zdXJlKGNodW5rSWQsIGNhbGxiYWNrKSB7XG4gXHRcdC8vIFwiMFwiIGlzIHRoZSBzaWduYWwgZm9yIFwiYWxyZWFkeSBsb2FkZWRcIlxuIFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApXG4gXHRcdFx0cmV0dXJuIGNhbGxiYWNrLmNhbGwobnVsbCwgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gYW4gYXJyYXkgbWVhbnMgXCJjdXJyZW50bHkgbG9hZGluZ1wiLlxuIFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gIT09IHVuZGVmaW5lZCkge1xuIFx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXS5wdXNoKGNhbGxiYWNrKTtcbiBcdFx0fSBlbHNlIHtcbiBcdFx0XHQvLyBzdGFydCBjaHVuayBsb2FkaW5nXG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gW2NhbGxiYWNrXTtcbiBcdFx0XHR2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gXHRcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuIFx0XHRcdHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gXHRcdFx0c2NyaXB0LmNoYXJzZXQgPSAndXRmLTgnO1xuIFx0XHRcdHNjcmlwdC5hc3luYyA9IHRydWU7XG5cbiBcdFx0XHRzY3JpcHQuc3JjID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGNodW5rSWQgKyBcIi5cIiArICh7fVtjaHVua0lkXXx8Y2h1bmtJZCkgKyBcIi5qc1wiO1xuIFx0XHRcdGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgODYwNzUwNzYyYzAzZjg5NmFkOWUiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAnLi9zdHlsZS5sZXNzJztcclxuXHJcbmxldCBHbG9iYWxFcnJvckhhbmRsZXIgPSByZXF1aXJlKEJMT0NLUyArICdnbG9iYWwtZXJyb3ItaGFuZGxlcicpO1xyXG5sZXQgZ2xvYmFsRXJyb3JIYW5kbGVyID0gbmV3IEdsb2JhbEVycm9ySGFuZGxlcigpO1xyXG5cclxubGV0IEdhbGxlcnkgPSByZXF1aXJlKEJMT0NLUyArICdnYWxsZXJ5Jyk7XHJcbmxldCBnYWxsZXJ5ID0gbmV3IEdhbGxlcnkoe1xyXG5cdGVsZW06IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbWFnZScpLFxyXG5cdGlzTG9nZ2VkOiB3aW5kb3cuaXNMb2dnZWQsXHJcblx0cHJlbG9hZEVudGl0eUNvdW50OiBQUkVMT0FEX0lNQUdFX0NPVU5UXHJcbn0pO1xyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vaW1hZ2Uvc2NyaXB0LmpzIiwibGV0IEdsb2JhbEVycm9ySGFuZGxlciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGUgPT4ge1xyXG4gICAgICAgIGxldCBlcnJvciA9IGUuZGV0YWlsO1xyXG4gICAgICAgIHRoaXMuY2FsbChlcnJvcik7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbkdsb2JhbEVycm9ySGFuZGxlci5wcm90b3R5cGUuY2FsbCA9IGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgcmVxdWlyZS5lbnN1cmUoW0xJQlMgKyAnY29tcG9uZW50RXJyb3JzJywgQkxPQ0tTICsgJ21lc3NhZ2UtbW9kYWwtd2luZG93J10sIGZ1bmN0aW9uIChyZXF1aXJlKSB7XHJcbiAgICAgICAgbGV0IENvbXBvbmVudEVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLkNvbXBvbmVudEVycm9yO1xyXG4gICAgICAgIGxldCBNZXNzYWdlTW9kYWxXaW5kb3cgPSByZXF1aXJlKEJMT0NLUyArICdtZXNzYWdlLW1vZGFsLXdpbmRvdycpO1xyXG5cclxuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBDb21wb25lbnRFcnJvcikge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzID09PSA0MDEpIHtcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWRpcmVjdGVkX3VybCcsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9ICcvYXV0aG9yaXphdGlvbic7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWVzc2FnZU1vZGFsV2luZG93ID0gbmV3IE1lc3NhZ2VNb2RhbFdpbmRvdyh7bWVzc2FnZTogZXJyb3IubWVzc2FnZX0pO1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZU1vZGFsV2luZG93LmFjdGl2YXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdsb2JhbEVycm9ySGFuZGxlcjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL2dsb2JhbC1lcnJvci1oYW5kbGVyL2luZGV4LmpzIiwiZnVuY3Rpb24gQ3VzdG9tRXJyb3IobWVzc2FnZSkge1xyXG5cdHRoaXMubmFtZSA9IFwiQ3VzdG9tRXJyb3JcIjtcclxuXHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG5cclxuXHRpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpXHJcblx0XHRFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBDdXN0b21FcnJvcik7XHJcblx0ZWxzZVxyXG5cdFx0dGhpcy5zdGFjayA9IChuZXcgRXJyb3IoKSkuc3RhY2s7XHJcbn1cclxuQ3VzdG9tRXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpO1xyXG5DdXN0b21FcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDdXN0b21FcnJvcjtcclxuXHJcblxyXG5mdW5jdGlvbiBDb21wb25lbnRFcnJvcihtZXNzYWdlLCBzdGF0dXMpIHtcclxuXHRDdXN0b21FcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ0FuIGVycm9yIGhhcyBvY2N1cnJlZCcgKTtcclxuXHR0aGlzLm5hbWUgPSBcIkNvbXBvbmVudEVycm9yXCI7XHJcblx0dGhpcy5zdGF0dXMgPSBzdGF0dXM7XHJcbn1cclxuQ29tcG9uZW50RXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDdXN0b21FcnJvci5wcm90b3R5cGUpO1xyXG5Db21wb25lbnRFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDb21wb25lbnRFcnJvcjtcclxuXHJcbmZ1bmN0aW9uIENsaWVudEVycm9yKG1lc3NhZ2UsIGRldGFpbCwgc3RhdHVzKSB7XHJcblx0Q29tcG9uZW50RXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlIHx8ICdBbiBlcnJvciBoYXMgb2NjdXJyZWQuIENoZWNrIGlmIGphdmFzY3JpcHQgaXMgZW5hYmxlZCcsIHN0YXR1cyk7XHJcblx0dGhpcy5uYW1lID0gXCJDbGllbnRFcnJvclwiO1xyXG5cdHRoaXMuZGV0YWlsID0gZGV0YWlsO1xyXG59XHJcbkNsaWVudEVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29tcG9uZW50RXJyb3IucHJvdG90eXBlKTtcclxuQ2xpZW50RXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ2xpZW50RXJyb3I7XHJcblxyXG5cclxuZnVuY3Rpb24gSW1hZ2VOb3RGb3VuZChtZXNzYWdlKSB7XHJcbiAgICBDbGllbnRFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ0ltYWdlIG5vdCBmb3VuZC4gSXQgcHJvYmFibHkgaGFzIGJlZW4gcmVtb3ZlZCcsIG51bGwsIDQwNCk7XHJcbiAgICB0aGlzLm5hbWUgPSBcIkltYWdlTm90Rm91bmRcIjtcclxufVxyXG5JbWFnZU5vdEZvdW5kLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ2xpZW50RXJyb3IucHJvdG90eXBlKTtcclxuSW1hZ2VOb3RGb3VuZC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBJbWFnZU5vdEZvdW5kO1xyXG5cclxuZnVuY3Rpb24gU2VydmVyRXJyb3IobWVzc2FnZSwgc3RhdHVzKSB7XHJcblx0Q29tcG9uZW50RXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlIHx8ICdUaGVyZSBpcyBzb21lIGVycm9yIG9uIHRoZSBzZXJ2ZXIgc2lkZScsIHN0YXR1cyk7XHJcblx0dGhpcy5uYW1lID0gXCJTZXJ2ZXJFcnJvclwiO1xyXG59XHJcblNlcnZlckVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29tcG9uZW50RXJyb3IucHJvdG90eXBlKTtcclxuU2VydmVyRXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2VydmVyRXJyb3I7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRDb21wb25lbnRFcnJvcixcclxuXHRDbGllbnRFcnJvcixcclxuICAgIEltYWdlTm90Rm91bmQsXHJcblx0U2VydmVyRXJyb3JcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2NvbXBvbmVudEVycm9ycy5qcyIsImxldCBldmVudE1peGluID0gcmVxdWlyZShMSUJTICsgJ2V2ZW50TWl4aW4nKTtcclxubGV0IFNwaW5uZXIgPSByZXF1aXJlKEJMT0NLUyArICdzcGlubmVyJyk7XHJcblxyXG5sZXQgTW9kYWwgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuICAgIHRoaXMubGlzdGVuZXJzID0gW107XHJcbiAgICB0aGlzLnN0YXR1cyA9IG9wdGlvbnMgJiYgb3B0aW9ucy5zdGF0dXMgfHwgTW9kYWwuc3RhdHVzZXMuTUlOT1I7XHJcbn07XHJcblxyXG5Nb2RhbC5zdGF0dXNlcyA9IHtcclxuICAgIE1BSk9SOiAxLFxyXG4gICAgTUlOT1I6IDJcclxufTtcclxuXHJcbk1vZGFsLnByb3RvdHlwZS5vbkVsZW1DbGljayA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICBpZiAoZS50YXJnZXQubWF0Y2hlcygnLm1vZGFsLWNsb3NlLWJ1dHRvbicpKVxyXG4gICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xyXG59O1xyXG5cclxuTW9kYWwucHJvdG90eXBlLnNldExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMubGlzdGVuZXJzLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgdGhpcy5lbGVtLmFkZEV2ZW50TGlzdGVuZXIoaXRlbS5ldmVudE5hbWUsIGl0ZW0uY2IpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5Nb2RhbC5zZXRCYWNrZHJvcCA9IGZ1bmN0aW9uIChzdGF0dXMpIHtcclxuICAgIGlmIChzdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKSB7XHJcbiAgICAgICAgTW9kYWwubWlub3JCYWNrZHJvcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrZHJvcF9taW5vcicpO1xyXG4gICAgICAgIGlmICghTW9kYWwubWlub3JCYWNrZHJvcClcclxuICAgICAgICAgICAgTW9kYWwubWlub3JCYWNrZHJvcCA9IE1vZGFsLnJlbmRlckJhY2tkcm9wKCdtaW5vcicpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBNb2RhbC5tYWpvckJhY2tkcm9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tkcm9wX21ham9yJyk7XHJcbiAgICAgICAgaWYgKCFNb2RhbC5tYWpvckJhY2tkcm9wKVxyXG4gICAgICAgICAgICBNb2RhbC5tYWpvckJhY2tkcm9wID0gTW9kYWwucmVuZGVyQmFja2Ryb3AoJ21ham9yJyk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5Nb2RhbC5zZXRXcmFwcGVyID0gZnVuY3Rpb24gKHN0YXR1cykge1xyXG4gICAgaWYgKHN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpIHtcclxuICAgICAgICBNb2RhbC5taW5vcldyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtd3JhcHBlci1taW5vcicpO1xyXG4gICAgICAgIGlmICghTW9kYWwubWlub3JXcmFwcGVyKVxyXG4gICAgICAgICAgICBNb2RhbC5taW5vcldyYXBwZXIgPSBNb2RhbC5yZW5kZXJXcmFwcGVyKCdtaW5vcicpO1xyXG4gICAgICAgIE1vZGFsLm1pbm9yV3JhcHBlci5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldCAmJiAhZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2RhbC13cmFwcGVyX21pbm9yJykpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKE1vZGFsLm1pbm9yQWN0aXZlKVxyXG4gICAgICAgICAgICAgICAgTW9kYWwubWlub3JRdWV1ZVswXS5kZWFjdGl2YXRlKCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgTW9kYWwubWFqb3JXcmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLXdyYXBwZXItbWFqb3InKTtcclxuICAgICAgICBpZiAoIU1vZGFsLm1ham9yV3JhcHBlcilcclxuICAgICAgICAgICAgTW9kYWwubWFqb3JXcmFwcGVyID0gTW9kYWwucmVuZGVyV3JhcHBlcignbWFqb3InKTtcclxuICAgICAgICBNb2RhbC5tYWpvcldyYXBwZXIub25jbGljayA9IGUgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZS50YXJnZXQgJiYgIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbW9kYWwtd3JhcHBlcl9tYWpvcicpKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChNb2RhbC5tYWpvckFjdGl2ZSlcclxuICAgICAgICAgICAgICAgIE1vZGFsLm1ham9yUXVldWVbMF0uZGVhY3RpdmF0ZSgpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn07XHJcblxyXG5Nb2RhbC5yZW5kZXJCYWNrZHJvcCA9IGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICBsZXQgYmFja2Ryb3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKTtcclxuICAgIGJhY2tkcm9wLmNsYXNzTmFtZSA9ICdiYWNrZHJvcCBiYWNrZHJvcF9pbnZpc2libGUnO1xyXG4gICAgYmFja2Ryb3AuY2xhc3NMaXN0LmFkZChgYmFja2Ryb3BfJHt0eXBlfWApO1xyXG4gICAgYmFja2Ryb3AuaWQgPSBgYmFja2Ryb3AtJHt0eXBlfWA7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGJhY2tkcm9wKTtcclxuICAgIHJldHVybiBiYWNrZHJvcDtcclxufTtcclxuXHJcbk1vZGFsLnJlbmRlcldyYXBwZXIgPSBmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgbGV0IHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKTtcclxuICAgIHdyYXBwZXIuY2xhc3NOYW1lID0gJ21vZGFsLXdyYXBwZXIgbW9kYWwtd3JhcHBlcl9pbnZpc2libGUnO1xyXG4gICAgd3JhcHBlci5jbGFzc0xpc3QuYWRkKGBtb2RhbC13cmFwcGVyXyR7dHlwZX1gKTtcclxuICAgIHdyYXBwZXIuaWQgPSBgbW9kYWwtd3JhcHBlci0ke3R5cGV9YDtcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQod3JhcHBlcik7XHJcbiAgICByZXR1cm4gd3JhcHBlcjtcclxufTtcclxuXHJcbk1vZGFsLnByb3RvdHlwZS5yZW5kZXJXaW5kb3cgPSBmdW5jdGlvbiAoaHRtbCkge1xyXG5cclxuICAgIGxldCBwYXJlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKTtcclxuICAgIHBhcmVudC5pbm5lckhUTUwgPSBodG1sO1xyXG4gICAgbGV0IHduZCA9IHBhcmVudC5maXJzdEVsZW1lbnRDaGlsZDtcclxuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpXHJcbiAgICAgICAgTW9kYWwubWlub3JXcmFwcGVyLmFwcGVuZENoaWxkKHduZCk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgTW9kYWwubWFqb3JXcmFwcGVyLmFwcGVuZENoaWxkKHduZCk7XHJcblxyXG4gICAgcGFyZW50LnJlbW92ZSgpO1xyXG4gICAgcmV0dXJuIHduZDtcclxufTtcclxuXHJcbk1vZGFsLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUikge1xyXG4gICAgICAgIGlmICghTW9kYWwubWlub3JCYWNrZHJvcClcclxuICAgICAgICAgICAgTW9kYWwuc2V0QmFja2Ryb3AoTW9kYWwuc3RhdHVzZXMuTUlOT1IpO1xyXG5cclxuICAgICAgICBpZiAoIU1vZGFsLm1pbm9yV3JhcHBlcilcclxuICAgICAgICAgICAgTW9kYWwuc2V0V3JhcHBlcihNb2RhbC5zdGF0dXNlcy5NSU5PUik7XHJcblxyXG4gICAgICAgIE1vZGFsLm1pbm9yV3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC13cmFwcGVyX2ludmlzaWJsZScpO1xyXG4gICAgICAgIE1vZGFsLm1pbm9yQmFja2Ryb3AuY2xhc3NMaXN0LnJlbW92ZSgnYmFja2Ryb3BfaW52aXNpYmxlJyk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoIU1vZGFsLm1ham9yQmFja2Ryb3ApXHJcbiAgICAgICAgICAgIE1vZGFsLnNldEJhY2tkcm9wKE1vZGFsLnN0YXR1c2VzLk1BSk9SKTtcclxuXHJcbiAgICAgICAgaWYgKCFNb2RhbC5tYWpvcldyYXBwZXIpXHJcbiAgICAgICAgICAgIE1vZGFsLnNldFdyYXBwZXIoTW9kYWwuc3RhdHVzZXMuTUFKT1IpO1xyXG5cclxuICAgICAgICBNb2RhbC5tYWpvcldyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtd3JhcHBlcl9pbnZpc2libGUnKTtcclxuICAgICAgICBNb2RhbC5tYWpvckJhY2tkcm9wLmNsYXNzTGlzdC5yZW1vdmUoJ2JhY2tkcm9wX2ludmlzaWJsZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcclxuXHJcbn07XHJcblxyXG5cclxuTW9kYWwucHJvdG90eXBlLmFjdGl2YXRlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICBpZiAodGhpcy5lbGVtSWQgPT09ICdzcGlubmVyJykge1xyXG4gICAgICAgIGxldCBzcGlubmVyID0gdGhpcztcclxuICAgICAgICB0aGlzLm9uKCdzcGlubmVyX2hvc3QtbG9hZGVkJywgZSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBuZXdIb3N0ID0gZS5kZXRhaWwuaG9zdDtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpXHJcbiAgICAgICAgICAgICAgICBNb2RhbC5taW5vclF1ZXVlLnNwbGljZShNb2RhbC5taW5vclF1ZXVlLmluZGV4T2Yoc3Bpbm5lcikgKyAxLCAwLCBuZXdIb3N0KTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgTW9kYWwubWFqb3JRdWV1ZS5zcGxpY2UoTW9kYWwubWFqb3JRdWV1ZS5pbmRleE9mKHNwaW5uZXIpICsgMSwgMCwgbmV3SG9zdCk7XHJcblxyXG4gICAgICAgICAgICBzcGlubmVyLmRlYWN0aXZhdGUoZS5kZXRhaWwub3B0aW9ucyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKSB7XHJcbiAgICAgICAgICAgIE1vZGFsLm1pbm9yUXVldWUucHVzaCh0aGlzKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coTW9kYWwubWlub3JRdWV1ZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKE1vZGFsLm1ham9yUXVldWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFNb2RhbC5taW5vckFjdGl2ZSlcclxuICAgICAgICAgICAgICAgIE1vZGFsLm1pbm9yU2hvdyhvcHRpb25zKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgTW9kYWwubWFqb3JRdWV1ZS5wdXNoKHRoaXMpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhNb2RhbC5taW5vclF1ZXVlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coTW9kYWwubWFqb3JRdWV1ZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIU1vZGFsLm1ham9yQWN0aXZlKVxyXG5cclxuICAgICAgICAgICAgICAgIE1vZGFsLm1ham9yU2hvdyhvcHRpb25zKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59O1xyXG5cclxuTW9kYWwucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5zdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKSB7XHJcbiAgICAgICAgLy9UT0RPIG5vdCBuZWNjZXNzYXJ5IGlmIHF1ZXVlIGlzIG5vdCBlbXB0eVxyXG4gICAgICAgIE1vZGFsLm1pbm9yV3JhcHBlci5jbGFzc0xpc3QuYWRkKCdtb2RhbC13cmFwcGVyX2ludmlzaWJsZScpO1xyXG4gICAgICAgIE1vZGFsLm1pbm9yQmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgnYmFja2Ryb3BfaW52aXNpYmxlJyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBNb2RhbC5tYWpvcldyYXBwZXIuY2xhc3NMaXN0LmFkZCgnbW9kYWwtd3JhcHBlcl9pbnZpc2libGUnKTtcclxuICAgICAgICBNb2RhbC5tYWpvckJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoJ2JhY2tkcm9wX2ludmlzaWJsZScpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcbk1vZGFsLnByb3RvdHlwZS5kZWFjdGl2YXRlID0gZnVuY3Rpb24gKG5leHRXaW5kb3dPcHRpb25zLCBoaWRlT3B0aW9ucykge1xyXG5cclxuICAgIHRoaXMuaGlkZShoaWRlT3B0aW9ucyk7XHJcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUikge1xyXG4gICAgICAgIE1vZGFsLm1pbm9yQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgTW9kYWwubWlub3JRdWV1ZS5zaGlmdCgpO1xyXG4gICAgICAgIE1vZGFsLm1pbm9yU2hvdyhuZXh0V2luZG93T3B0aW9ucyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIE1vZGFsLm1ham9yQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgTW9kYWwubWFqb3JRdWV1ZS5zaGlmdCgpO1xyXG4gICAgICAgIE1vZGFsLm1ham9yU2hvdyhuZXh0V2luZG93T3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnRyaWdnZXIoJ21vZGFsLXdpbmRvd19kZWFjdGl2YXRlZCcpO1xyXG59O1xyXG5cclxuTW9kYWwubWlub3JBY3RpdmUgPSBmYWxzZTtcclxuTW9kYWwubWFqb3JBY3RpdmUgPSBmYWxzZTtcclxuTW9kYWwubWlub3JRdWV1ZSA9IFtdO1xyXG5Nb2RhbC5tYWpvclF1ZXVlID0gW107XHJcblxyXG5Nb2RhbC5zcGlubmVyID0gbmV3IFNwaW5uZXIoKTtcclxuTW9kYWwuc3Bpbm5lci5zdGF0dXMgPSBNb2RhbC5zdGF0dXNlcy5NQUpPUjtcclxuXHJcbk1vZGFsLnNob3dTcGlubmVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgTW9kYWwucHJvdG90eXBlLnNob3cuY2FsbChNb2RhbC5zcGlubmVyKTtcclxuXHJcbiAgICBpZiAoIU1vZGFsLnNwaW5uZXIuZWxlbSlcclxuICAgICAgICBNb2RhbC5zcGlubmVyLmVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bpbm5lcicpO1xyXG4gICAgaWYgKCFNb2RhbC5zcGlubmVyLmVsZW0pXHJcbiAgICAgICAgTW9kYWwuc3Bpbm5lci5lbGVtID0gTW9kYWwucHJvdG90eXBlLnJlbmRlcldpbmRvdy5jYWxsKE1vZGFsLnNwaW5uZXIsIFNwaW5uZXIuaHRtbCk7XHJcblxyXG4gICAgTW9kYWwuc3Bpbm5lci5zaG93KCk7XHJcbn07XHJcblxyXG5Nb2RhbC5oaWRlU3Bpbm5lciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIE1vZGFsLnNwaW5uZXIuaGlkZSgpO1xyXG59O1xyXG5cclxuXHJcbk1vZGFsLm1pbm9yU2hvdyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBsZXQgbmV4dE1vZGFsV2luZG93ID0gTW9kYWwubWlub3JRdWV1ZVswXTtcclxuICAgIGlmIChuZXh0TW9kYWxXaW5kb3cpIHtcclxuICAgICAgICBsZXQgcHJvbWlzZSA9IG5leHRNb2RhbFdpbmRvdy5zaG93KG9wdGlvbnMpO1xyXG4gICAgICAgIGlmIChwcm9taXNlKVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIE1vZGFsLm1pbm9yQWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIE1vZGFsLm1pbm9yQWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIE1vZGFsLm1pbm9yQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuTW9kYWwubWFqb3JTaG93ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICBsZXQgbmV4dE1vZGFsV2luZG93ID0gTW9kYWwubWFqb3JRdWV1ZVswXTtcclxuXHJcbiAgICBpZiAobmV4dE1vZGFsV2luZG93KSB7XHJcblxyXG4gICAgICAgIE1vZGFsLnNob3dTcGlubmVyKCk7XHJcbiAgICAgICAgbGV0IHByb21pc2UgPSBuZXh0TW9kYWxXaW5kb3cuc2hvdyhvcHRpb25zKTtcclxuXHJcbiAgICAgICAgaWYgKHByb21pc2UpXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgTW9kYWwubWFqb3JBY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgTW9kYWwuaGlkZVNwaW5uZXIoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIE1vZGFsLm1ham9yQWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgTW9kYWwuaGlkZVNwaW5uZXIoKTtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIE1vZGFsLm1ham9yQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZm9yIChsZXQga2V5IGluIGV2ZW50TWl4aW4pXHJcbiAgICBNb2RhbC5wcm90b3R5cGVba2V5XSA9IGV2ZW50TWl4aW5ba2V5XTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGFsO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL21vZGFsL2luZGV4LmpzIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG5cdG9uOiBmdW5jdGlvbihldmVudE5hbWUsIGNiKSB7XHJcblx0XHRpZiAodGhpcy5lbGVtKVxyXG5cdFx0XHR0aGlzLmVsZW0uYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNiKTtcclxuXHRcdGVsc2VcclxuXHRcdFx0dGhpcy5saXN0ZW5lcnMucHVzaCh7XHJcblx0XHRcdFx0ZXZlbnROYW1lLFxyXG5cdFx0XHRcdGNiXHJcblx0XHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdHRyaWdnZXI6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZGV0YWlsKSB7XHJcblx0XHR0aGlzLmVsZW0uZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7XHJcblx0XHRcdGJ1YmJsZXM6IHRydWUsXHJcblx0XHRcdGNhbmNlbGFibGU6IHRydWUsXHJcblx0XHRcdGRldGFpbDogZGV0YWlsXHJcblx0XHR9KSk7XHJcblx0fSxcclxuXHJcblx0ZXJyb3I6IGZ1bmN0aW9uKGVycikge1xyXG5cdFx0dGhpcy5lbGVtLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdlcnJvcicsIHtcclxuXHRcdFx0YnViYmxlczogdHJ1ZSxcclxuXHRcdFx0Y2FuY2VsYWJsZTogdHJ1ZSxcclxuXHRcdFx0ZGV0YWlsOiBlcnJcclxuXHRcdH0pKTtcclxuXHR9XHJcblxyXG5cclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2V2ZW50TWl4aW4uanMiLCJsZXQgU3Bpbm5lciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLmVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bpbm5lcicpO1xyXG59O1xyXG5cclxuU3Bpbm5lci5odG1sID0gcmVxdWlyZShgaHRtbC1sb2FkZXIhLi9tYXJrdXBgKTtcclxuXHJcblNwaW5uZXIucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnc3Bpbm5lcl9pbnZpc2libGUnKTtcclxufTtcclxuXHJcblNwaW5uZXIucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnc3Bpbm5lcl9pbnZpc2libGUnKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3Bpbm5lcjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL3NwaW5uZXIvaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBpZD1cXFwic3Bpbm5lclxcXCIgY2xhc3M9XFxcInNwaW5uZXJcXFwiPlxcclxcblxcclxcbjwvZGl2PlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9+L2h0bWwtbG9hZGVyIS4uL2Jsb2Nrcy9zcGlubmVyL21hcmt1cFxuLy8gbW9kdWxlIGlkID0gMjBcbi8vIG1vZHVsZSBjaHVua3MgPSAxIDIgOCA5IDEwIiwibGV0IFNlcnZlckVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLlNlcnZlckVycm9yO1xyXG5sZXQgQ2xpZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ2xpZW50RXJyb3I7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChib2R5T2JqLCBtZXRob2QsIHVybCwgY2IpIHtcclxuXHJcblxyXG4gICAgbGV0IGJvZHkgPSAnJztcclxuICAgIGlmICghKHR5cGVvZiBib2R5T2JqID09PSAnc3RyaW5nJykpIHtcclxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gYm9keU9iaikge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSAnJztcclxuICAgICAgICAgICAgaWYgKGJvZHlPYmpba2V5XSlcclxuICAgICAgICAgICAgICAgIHZhbHVlID0ga2V5ICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KCh0eXBlb2YgYm9keU9ialtrZXldID09PSAnb2JqZWN0JykgPyBKU09OLnN0cmluZ2lmeShib2R5T2JqW2tleV0pIDogYm9keU9ialtrZXldKTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgYm9keSArPSAoYm9keSA9PT0gJycgPyAnJyA6ICcmJykgKyB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2VcclxuICAgICAgICBib2R5ID0gYm9keU9iajtcclxuXHJcblxyXG4gICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgeGhyLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xyXG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcclxuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiWC1SZXF1ZXN0ZWQtV2l0aFwiLCBcIlhNTEh0dHBSZXF1ZXN0XCIpO1xyXG5cclxuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSAhPSA0KSByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCByZXNwb25zZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucmVzcG9uc2VUZXh0KVxyXG4gICAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjYihuZXcgU2VydmVyRXJyb3IoJ1NlcnZlciBpcyBub3QgcmVzcG9uZGluZycpKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMClcclxuICAgICAgICAgICAgY2IobnVsbCwgcmVzcG9uc2UpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPj0gNDAwICYmIHRoaXMuc3RhdHVzIDwgNTAwKVxyXG4gICAgICAgICAgICBjYihuZXcgQ2xpZW50RXJyb3IocmVzcG9uc2UubWVzc2FnZSwgcmVzcG9uc2UuZGV0YWlsLCB0aGlzLnN0YXR1cykpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPj0gNTAwKVxyXG4gICAgICAgICAgICBjYihuZXcgU2VydmVyRXJyb3IocmVzcG9uc2UubWVzc2FnZSwgdGhpcy5zdGF0dXMpKTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc29sZS5sb2coYHNlbmRpbmcgbmV4dCByZXF1ZXN0OiAke2JvZHl9YCk7XHJcbiAgICB4aHIuc2VuZChib2R5KTtcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL3NlbmRSZXF1ZXN0LmpzIiwibGV0IGV2ZW50TWl4aW4gPSByZXF1aXJlKExJQlMgKyAnZXZlbnRNaXhpbicpO1xyXG5sZXQgQ2xpZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ2xpZW50RXJyb3I7XHJcbmxldCBJbWFnZU5vdEZvdW5kID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLkltYWdlTm90Rm91bmQ7XHJcbmxldCBNb2RhbCA9IHJlcXVpcmUoQkxPQ0tTICsgJ21vZGFsJyk7XHJcbmxldCBTd2l0Y2hCdXR0b24gPSByZXF1aXJlKEJMT0NLUyArICdzd2l0Y2gtYnV0dG9uJyk7XHJcblxyXG5cclxubGV0IEdhbGxlcnkgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgTW9kYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgIHRoaXMuc3RhdHVzID0gTW9kYWwuc3RhdHVzZXMuTUFKT1I7XHJcblxyXG4gICAgdGhpcy5nYWxsZXJ5ID0gb3B0aW9ucy5nYWxsZXJ5O1xyXG4gICAgdGhpcy5lbGVtID0gb3B0aW9ucy5lbGVtO1xyXG4gICAgdGhpcy5pc0xvZ2dlZCA9IG9wdGlvbnMuaXNMb2dnZWQ7XHJcbiAgICB0aGlzLnByZWxvYWRFbnRpdHlDb3VudCA9IG9wdGlvbnMucHJlbG9hZEVudGl0eUNvdW50O1xyXG4gICAgdGhpcy5pc0ZlZWQgPSBvcHRpb25zLmlzRmVlZCB8fCBmYWxzZTtcclxuICAgIHRoaXMudXNlclN1YnNjcmliZUJ1dHRvbiA9IG9wdGlvbnMudXNlclN1YnNjcmliZUJ1dHRvbjtcclxuXHJcbiAgICB0aGlzLnZpZXdNb2RlbHMgPSB7fTtcclxuICAgIHRoaXMuZ2FsbGVyeUFycmF5ID0gbnVsbDtcclxuICAgIHRoaXMuY3VycmVudEltYWdlSWQgPSBudWxsO1xyXG5cclxuICAgIHRoaXMubG9nZ2VkVXNlclZpZXdNb2RlbCA9IG51bGw7XHJcbiAgICB0aGlzLmlzRW1iZWRkZWQgPSAhIXRoaXMuZ2FsbGVyeTtcclxuICAgIHRoaXMucHJlbG9hZGVkSW1hZ2VzID0ge307XHJcblxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdjdXJyZW50Vmlld01vZGVsJywge1xyXG4gICAgICAgIGdldDogKCkgPT4gdGhpcy52aWV3TW9kZWxzW3RoaXMuY3VycmVudEltYWdlSWRdXHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gdGhpcy5wcmVsb2FkRW50aXR5Q291bnQ7IGkrKykge1xyXG4gICAgICAgIHRoaXMucHJlbG9hZGVkSW1hZ2VzW2ldID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgdGhpcy5wcmVsb2FkZWRJbWFnZXNbLWldID0gbmV3IEltYWdlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgZSA9PiB7XHJcbiAgICAgICAgdGhpcy5vblBvcFN0YXRlKGUuc3RhdGUpO1xyXG4gICAgfSwgZmFsc2UpO1xyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBlID0+IHtcclxuICAgICAgICB0aGlzLm9uUmVzaXplKCk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgdGhpcy5wdXNoR2FsbGVyeVN0YXRlKCk7XHJcblxyXG4gICAgaWYgKHRoaXMuaXNFbWJlZGRlZClcclxuICAgICAgICB0aGlzLnNldEdhbGxlcnkob3B0aW9ucyk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5zaG93KCt0aGlzLmVsZW0uZGF0YXNldC5pZCkuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yKGVycik7XHJcbiAgICAgICAgfSk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoTW9kYWwucHJvdG90eXBlKTtcclxuR2FsbGVyeS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBHYWxsZXJ5O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUub25SZXNpemUgPSBmdW5jdGlvbigpIHtcclxuICAgIC8vIGNvbnN0IEdMT0JBTF9TTUFMTF9TQ1JFRU5fV0lEVEggPSA3MDA7XHJcbiAgICAvLyBpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIDw9IEdMT0JBTF9TTUFMTF9TQ1JFRU5fV0lEVEgpXHJcbiAgICAvLyAgICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ2ltYWdlX3NtYWxsJyk7XHJcbiAgICAvLyBlbHNlXHJcbiAgICAvLyAgICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2ltYWdlX3NtYWxsJyk7XHJcbiAgICAvL1xyXG4gICAgLy8gdGhpcy5yZXNpemVJbWFnZSgpO1xyXG4gICAgdGhpcy5jb21tZW50U2VjdGlvbiAmJiB0aGlzLmNvbW1lbnRTZWN0aW9uLnVwZGF0ZSgpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUub25HYWxsZXJ5Q2xpY2sgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgbGV0IHRhcmdldDtcclxuICAgIGlmICghKHRhcmdldCA9IGUudGFyZ2V0LmNsb3Nlc3QoJy5pbWFnZS1wcmV2aWV3JykpKSByZXR1cm47XHJcblxyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgbGV0IGltYWdlSWQgPSArdGFyZ2V0LmRhdGFzZXQuaWQ7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuYWN0aXZhdGUoe2ltYWdlSWR9KTtcclxufTtcclxuXHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5zZXRHYWxsZXJ5ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIHRoaXMucHVibGljYXRpb25OdW1iZXJFbGVtID0gb3B0aW9ucy5wdWJsaWNhdGlvbk51bWJlckVsZW07XHJcbiAgICB0aGlzLmltYWdlUHJldmlld0dob3N0ID0gdGhpcy5nYWxsZXJ5LnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZS1wcmV2aWV3Jyk7XHJcbiAgICB0aGlzLmdhbGxlcnlXcmFwcGVyID0gdGhpcy5nYWxsZXJ5LnF1ZXJ5U2VsZWN0b3IoJy5nYWxsZXJ5X193cmFwcGVyJyk7XHJcblxyXG4gICAgdGhpcy5nYWxsZXJ5Lm9uY2xpY2sgPSBlID0+IHtcclxuICAgICAgICB0aGlzLm9uR2FsbGVyeUNsaWNrKGUpO1xyXG4gICAgfTtcclxufTtcclxuXHJcbi8vVE9ETyBBTEVSVCBJRiBJVCBET0VTTidUIEFCTEUgVE8gRE9XTkxPQUQgTU9EQUwgTUVTU0FHRSBXSU5ET1dcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnNldEVsZW0gPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHJcbiAgICAgICAgdGhpcy5pc0VsZW1TZXR0ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuZWxlbSlcclxuICAgICAgICAgICAgdGhpcy5lbGVtID0gdGhpcy5yZW5kZXJXaW5kb3cocmVxdWlyZShgaHRtbC1sb2FkZXIhLi93aW5kb3dgKSk7XHJcblxyXG4gICAgICAgIHRoaXMuaW1nRWxlbSA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCdpbWcuaW1hZ2VfX2ltZy1lbGVtZW50Jyk7XHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2Rlc2NyaXB0aW9uJyk7XHJcbiAgICAgICAgdGhpcy5kYXRlID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fcG9zdC1kYXRlJyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZVdyYXBwZXIgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX19pbWFnZS13cmFwcGVyJyk7XHJcbiAgICAgICAgdGhpcy5zaWRlQmFyID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fc2lkZWJhcicpO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlQnV0dG9uRWxlbSA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2RlbGV0ZS1idXR0b24nKTtcclxuICAgICAgICB0aGlzLnN1YnNjcmliZUJ1dHRvbkVsZW0gPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX19zdWJzY3JpYmUtYnV0dG9uJyk7XHJcbiAgICAgICAgdGhpcy5hdmF0YXIgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX19hdmF0YXInKTtcclxuICAgICAgICB0aGlzLnVzZXJuYW1lID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fdXNlcm5hbWUnKTtcclxuICAgICAgICB0aGlzLmhlYWRlckxlZnRTaWRlID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9faGVhZGVyLWxlZnQtc2lkZScpO1xyXG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkJ1dHRvbiA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2NvbnRyb2wtZnVsbCcpO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5pbWdFbGVtLm9ubG9hZCA9IGUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJlc2l6ZUltYWdlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd0ltZ0VsZW0oKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmVsZW0ub25jbGljayA9IGUgPT4ge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5vbkVsZW1DbGljayhlKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldC5tYXRjaGVzKCcuaW1hZ2VfX21vZGFsLWNsb3NlLWJ1dHRvbi13cmFwcGVyJykpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldC5tYXRjaGVzKCcuaW1hZ2VfX2NvbnRyb2wtcHJldicpKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zd2l0Y2hUb1ByZXYoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldC5tYXRjaGVzKCcuaW1hZ2VfX2NvbnRyb2wtbmV4dCcpKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zd2l0Y2hUb05leHQoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldCA9PT0gdGhpcy5mdWxsc2NyZWVuQnV0dG9uKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zd2l0Y2hGdWxsc2NyZWVuKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZS50YXJnZXQubWF0Y2hlcygnLmltYWdlX19jbG9zZS1zcGFjZScpIHx8IGUudGFyZ2V0Lm1hdGNoZXMoJy5pbWFnZV9fY2xvc2UtYnV0dG9uJykpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgbGV0IENvbW1lbnRTZWN0aW9uID0gcmVxdWlyZShCTE9DS1MgKyAnaW1hZ2UtY29tbWVudC1zZWN0aW9uJyk7XHJcbiAgICAgICAgbGV0IExpa2VCdXR0b24gPSByZXF1aXJlKEJMT0NLUyArICdsaWtlLWJ1dHRvbicpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbW1lbnRTZWN0aW9uID0gbmV3IENvbW1lbnRTZWN0aW9uKHtcclxuICAgICAgICAgICAgZWxlbTogdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50LXNlY3Rpb24nKSxcclxuICAgICAgICAgICAgY29tbWVudFNlbmRlckVsZW06IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuY29tbWVudC1zZW5kJyksXHJcbiAgICAgICAgICAgIGltYWdlSWQ6IHRoaXMuY3VycmVudEltYWdlSWQsXHJcbiAgICAgICAgICAgIGxvZ2dlZFVzZXJWaWV3TW9kZWw6IHRoaXMubG9nZ2VkVXNlclZpZXdNb2RlbCxcclxuXHJcbiAgICAgICAgICAgIGNvbW1lbnRTZWN0aW9uV3JhcHBlcjogdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fY29tbWVudC1zZWN0aW9uLXdyYXBwZXInKSxcclxuICAgICAgICAgICAgaW5mb0JvYXJkOiB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX19pbmZvLWJvYXJkJyksXHJcbiAgICAgICAgICAgIHNjcm9sbGJhcldyYXBwZXI6IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2NvbW1lbnQtc2VjdGlvbi1zY3JvbGxiYXItd3JhcHBlcicpXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29tbWVudFNlY3Rpb24ub24oJ2NvbW1lbnQtc2VjdGlvbl9jaGFuZ2VkJywgZSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpbWFnZUlkID0gZS5kZXRhaWwuaW1hZ2VJZDtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGVWaWV3TW9kZWwoaW1hZ2VJZCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdFZpZXdNb2RlbChpbWFnZUlkKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ29tbWVudHMoaW1hZ2VJZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmxpa2VCdXR0b24gPSBuZXcgTGlrZUJ1dHRvbih7XHJcbiAgICAgICAgICAgIGVsZW06IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcubGlrZS1idXR0b24nKSxcclxuICAgICAgICAgICAgZGF0YTogdGhpcy5jdXJyZW50SW1hZ2VJZFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmxpa2VCdXR0b24ub24oJ3N3aXRjaC1idXR0b25fY2hhbmdlZCcsIGUgPT4ge1xyXG4gICAgICAgICAgICBsZXQgaW1hZ2VJZCA9IGUuZGV0YWlsLmltYWdlSWQ7XHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlVmlld01vZGVsKGltYWdlSWQpO1xyXG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RWaWV3TW9kZWwoaW1hZ2VJZCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUxpa2VzKGltYWdlSWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5vblJlc2l6ZSgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc0xvZ2dlZCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50Vmlld01vZGVsLmlzT3duSW1hZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RGVsZXRlQnV0dG9uKCk7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlLmVuc3VyZShbQkxPQ0tTICsgJ2RlbGV0ZS1pbWFnZS1idXR0b24nXSwgcmVxdWlyZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IERlbGV0ZUltYWdlQnV0dG9uID0gcmVxdWlyZShCTE9DS1MgKyAnZGVsZXRlLWltYWdlLWJ1dHRvbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlQnV0dG9uID0gbmV3IERlbGV0ZUltYWdlQnV0dG9uKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbTogdGhpcy5kZWxldGVCdXR0b25FbGVtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZUlkOiB0aGlzLmN1cnJlbnRJbWFnZUlkXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxldGVCdXR0b24ub24oJ2RlbGV0ZS1pbWFnZS1idXR0b25faW1hZ2UtZGVsZXRlZCcsIGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW52b2x2ZWRJbWFnZUlkID0gZS5kZXRhaWwuaW1hZ2VJZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxldGVWaWV3TW9kZWwoaW52b2x2ZWRJbWFnZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVGcm9tR2FsbGVyeUFycmF5KGludm9sdmVkSW1hZ2VJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlSW1hZ2VQcmV2aWV3KGludm9sdmVkSW1hZ2VJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRJbWFnZUlkID09PSBpbnZvbHZlZEltYWdlSWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN3aXRjaFRvTmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZS5lbnN1cmUoW0JMT0NLUyArICdzdWJzY3JpYmUtYnV0dG9uJ10sIHJlcXVpcmUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBTdWJzY3JpYmVCdXR0b24gPSByZXF1aXJlKEJMT0NLUyArICdzdWJzY3JpYmUtYnV0dG9uJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVCdXR0b24gPSBuZXcgU3Vic2NyaWJlQnV0dG9uKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbTogdGhpcy5zdWJzY3JpYmVCdXR0b25FbGVtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0aGlzLmN1cnJlbnRJbWFnZUlkXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnVzZXJTdWJzY3JpYmVCdXR0b24pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFN3aXRjaEJ1dHRvbi5zZXRSZWxhdGlvbih0aGlzLnN1YnNjcmliZUJ1dHRvbiwgdGhpcy51c2VyU3Vic2NyaWJlQnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVCdXR0b24ub24oJ3N3aXRjaC1idXR0b25fY2hhbmdlZCcsIGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW52b2x2ZWRJbWFnZUlkID0gZS5kZXRhaWwuaW1hZ2VJZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzRmVlZCAmJiBpbnZvbHZlZEltYWdlSWQgPT09IHRoaXMuY3VycmVudEltYWdlSWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXdNb2RlbHMgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3Vic2NyaWJlQnV0dG9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVCdXR0b24uc2V0KHthY3RpdmU6IHRoaXMuY3VycmVudFZpZXdNb2RlbC5hdXRob3IuaXNOYXJyYXRvcn0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlQnV0dG9uRWxlbS5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yKG5ldyBDbGllbnRFcnJvcihudWxsLCBudWxsLCA0MDEpKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSk7XHJcblxyXG59O1xyXG5cclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnN3aXRjaEZ1bGxzY3JlZW4gPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgZnVuY3Rpb24gZ29GdWxsc2NyZWVuKGVsZW1lbnQpIHtcclxuICAgICAgICBpZiAoZWxlbWVudC5yZXF1ZXN0RnVsbHNjcmVlbikge1xyXG4gICAgICAgICAgICBlbGVtZW50LnJlcXVlc3RGdWxsc2NyZWVuKCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4oKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQubW96UmVxdWVzdEZ1bGxzY3JlZW4pIHtcclxuICAgICAgICAgICAgZWxlbWVudC5tb3pSZXF1ZXN0RnVsbHNjcmVlbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjYW5jZWxGdWxsc2NyZWVuKCkge1xyXG4gICAgICAgIGlmIChkb2N1bWVudC5leGl0RnVsbHNjcmVlbikge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5leGl0RnVsbHNjcmVlbigpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQud2Via2l0RXhpdEZ1bGxzY3JlZW4pIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQud2Via2l0RXhpdEZ1bGxzY3JlZW4oKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGRvY3VtZW50Lm1vekV4aXRGdWxsc2NyZWVuKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50Lm1vekV4aXRGdWxsc2NyZWVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBpZiAoIXRoaXMuaXNGdWxsc2NyZWVuKSB7XHJcbiAgICAgICAgZ29GdWxsc2NyZWVuKHRoaXMuaW1hZ2VXcmFwcGVyKTtcclxuICAgICAgICB0aGlzLmlzRnVsbHNjcmVlbiA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5mdWxsc2NyZWVuQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2ljb24tYXJyb3ctbWF4aW1pc2UnKTtcclxuICAgICAgICB0aGlzLmZ1bGxzY3JlZW5CdXR0b24uY2xhc3NMaXN0LmFkZCgnaWNvbi1hcnJvdy1taW5pbWlzZScpO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FuY2VsRnVsbHNjcmVlbigpO1xyXG4gICAgICAgIHRoaXMuaXNGdWxsc2NyZWVuID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5mdWxsc2NyZWVuQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2ljb24tYXJyb3ctbWF4aW1pc2UnKTtcclxuICAgICAgICB0aGlzLmZ1bGxzY3JlZW5CdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnaWNvbi1hcnJvdy1taW5pbWlzZScpO1xyXG4gICAgfVxyXG5cclxufTtcclxuXHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5zZXREZWxldGVCdXR0b24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmRlbGV0ZUJ1dHRvbkVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnYnV0dG9uX2ludmlzaWJsZScpO1xyXG4gICAgdGhpcy5zdWJzY3JpYmVCdXR0b25FbGVtLmNsYXNzTGlzdC5hZGQoJ2J1dHRvbl9pbnZpc2libGUnKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnNldFN1YnNjcmliZUJ1dHRvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuc3Vic2NyaWJlQnV0dG9uRWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdidXR0b25faW52aXNpYmxlJyk7XHJcbiAgICB0aGlzLmRlbGV0ZUJ1dHRvbkVsZW0uY2xhc3NMaXN0LmFkZCgnYnV0dG9uX2ludmlzaWJsZScpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUudXBkYXRlUHJlbG9hZGVkSW1hZ2VzQXJyYXkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSB0aGlzLnByZWxvYWRFbnRpdHlDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IG5leHRJZCA9IHRoaXMuZ2V0TmV4dEltYWdlSWQoaSk7XHJcbiAgICAgICAgbGV0IHByZXZJZCA9IHRoaXMuZ2V0TmV4dEltYWdlSWQoLWkpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy52aWV3TW9kZWxzW25leHRJZF0pXHJcbiAgICAgICAgICAgIHRoaXMucHJlbG9hZGVkSW1hZ2VzW2ldLnNldEF0dHJpYnV0ZSgnc3JjJywgdGhpcy52aWV3TW9kZWxzW25leHRJZF0uaW1nVXJsKTtcclxuICAgICAgICBpZiAodGhpcy52aWV3TW9kZWxzW3ByZXZJZF0pXHJcbiAgICAgICAgICAgIHRoaXMucHJlbG9hZGVkSW1hZ2VzWy1pXS5zZXRBdHRyaWJ1dGUoJ3NyYycsIHRoaXMudmlld01vZGVsc1twcmV2SWRdLmltZ1VybCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBsZXQgaW1hZ2VJZDtcclxuICAgIGxldCBub1B1c2hTdGF0ZTtcclxuXHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgIGltYWdlSWQgPSBhcmd1bWVudHNbMF07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGltYWdlSWQgPSBvcHRpb25zICYmIG9wdGlvbnMuaW1hZ2VJZDtcclxuICAgICAgICBub1B1c2hTdGF0ZSA9IG9wdGlvbnMgJiYgb3B0aW9ucy5ub1B1c2hTdGF0ZSB8fCBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc0VtYmVkZGVkKVxyXG4gICAgICAgICAgICBNb2RhbC5wcm90b3R5cGUuc2hvdy5hcHBseSh0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXF1ZXN0Vmlld01vZGVsKGltYWdlSWQpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRJbWFnZUlkID0gaW1hZ2VJZDtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc0VsZW1TZXR0ZWQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEVsZW0oKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUN1cnJlbnRWaWV3KGltYWdlSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdpbWFnZV9pbnZpc2libGUnKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIW5vUHVzaFN0YXRlICYmIGltYWdlSWQgPT09IHRoaXMuY3VycmVudEltYWdlSWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaEltYWdlU3RhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0QWxsTmVjZXNzYXJ5Vmlld01vZGVscygpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVByZWxvYWRlZEltYWdlc0FycmF5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUN1cnJlbnRWaWV3KGltYWdlSWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2ltYWdlX2ludmlzaWJsZScpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFub1B1c2hTdGF0ZSAmJiBpbWFnZUlkID09PSB0aGlzLmN1cnJlbnRJbWFnZUlkKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaEltYWdlU3RhdGUoKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdEFsbE5lY2Vzc2FyeVZpZXdNb2RlbHMoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVByZWxvYWRlZEltYWdlc0FycmF5KCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0pO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBsZXQgbm9QdXNoU3RhdGUgPSBvcHRpb25zICYmIG9wdGlvbnMubm9QdXNoU3RhdGU7XHJcbiAgICBpZiAoIXRoaXMuaXNFbWJlZGRlZClcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24gPSB0aGlzLmVsZW0uZGF0YXNldC5hdXRob3JVcmw7XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBNb2RhbC5wcm90b3R5cGUuaGlkZS5hcHBseSh0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ2ltYWdlX2ludmlzaWJsZScpO1xyXG5cclxuICAgICAgICBpZiAoIW5vUHVzaFN0YXRlKVxyXG4gICAgICAgICAgICB0aGlzLnB1c2hHYWxsZXJ5U3RhdGUoKTtcclxuICAgIH1cclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLmhpZGVJbWdFbGVtID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ2ltYWdlX2ltZy1lbGVtZW50LWludmlzaWJsZScpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuc2hvd0ltZ0VsZW0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnaW1hZ2VfaW1nLWVsZW1lbnQtaW52aXNpYmxlJyk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5yZXNpemVJbWFnZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIGlmICh0aGlzLmVsZW0pIHtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgdGhpcy5pbWdFbGVtLnJlbW92ZUF0dHJpYnV0ZSgnd2lkdGgnKTtcclxuICAgIC8vICAgICB0aGlzLmltZ0VsZW0ucmVtb3ZlQXR0cmlidXRlKCdoZWlnaHQnKTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgaWYgKCF0aGlzLmVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdpbWFnZV9zbWFsbCcpKSB7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICBpZiAodGhpcy5pbWdFbGVtLm9mZnNldFdpZHRoID49IHRoaXMuaW1nRWxlbS5vZmZzZXRIZWlnaHQpIHtcclxuICAgIC8vICAgICAgICAgICAgIGlmICh0aGlzLmltYWdlV3JhcHBlci5vZmZzZXRIZWlnaHQgPCB0aGlzLmltZ0VsZW0ub2Zmc2V0SGVpZ2h0KVxyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuaW1nRWxlbS5oZWlnaHQgPSB0aGlzLmltYWdlV3JhcHBlci5vZmZzZXRIZWlnaHQ7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICAgICAgaWYgKHRoaXMuaW1hZ2VXcmFwcGVyLm9mZnNldFdpZHRoID4gdGhpcy5lbGVtLm9mZnNldFdpZHRoKSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5pbWdFbGVtLnJlbW92ZUF0dHJpYnV0ZSgnaGVpZ2h0Jyk7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5pbWdFbGVtLndpZHRoID0gdGhpcy5lbGVtLm9mZnNldFdpZHRoIC0gdGhpcy5zaWRlQmFyLm9mZnNldFdpZHRoO1xyXG4gICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAgICAgaWYgKHRoaXMuaW1hZ2VXcmFwcGVyLm9mZnNldFdpZHRoID4gdGhpcy5lbGVtLm9mZnNldFdpZHRoKVxyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuaW1nRWxlbS53aWR0aCA9IHRoaXMuZWxlbS5vZmZzZXRXaWR0aCAtIHRoaXMuc2lkZUJhci5vZmZzZXRXaWR0aDtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgICAgICBpZiAodGhpcy5pbWFnZVdyYXBwZXIub2Zmc2V0SGVpZ2h0IDwgdGhpcy5pbWdFbGVtLm9mZnNldEhlaWdodCkge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuaW1nRWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ3dpZHRoJyk7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5pbWdFbGVtLmhlaWdodCA9IHRoaXMuaW1hZ2VXcmFwcGVyLm9mZnNldEhlaWdodDtcclxuICAgIC8vICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgICAgIGlmICh0aGlzLmltYWdlV3JhcHBlci5vZmZzZXRXaWR0aCA+IHRoaXMuZWxlbS5vZmZzZXRXaWR0aCkge1xyXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5pbWdFbGVtLnJlbW92ZUF0dHJpYnV0ZSgnaGVpZ2h0Jyk7XHJcbiAgICAvLyAgICAgICAgICAgICB0aGlzLmltZ0VsZW0ud2lkdGggPSB0aGlzLmVsZW0ub2Zmc2V0V2lkdGg7XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9XHJcbiAgICAvL1xyXG4gICAgLy9cclxuICAgIC8vIH1cclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnJlcXVlc3RWaWV3TW9kZWwgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnZpZXdNb2RlbHNbaWRdKSB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGJvZHkgPSB7XHJcbiAgICAgICAgICAgIGlkLFxyXG4gICAgICAgICAgICBpc0ZlZWQ6IHRoaXMuaXNGZWVkXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNMb2dnZWQgJiYgIXRoaXMubG9nZ2VkVXNlclZpZXdNb2RlbClcclxuICAgICAgICAgICAgYm9keS5yZXF1aXJlVXNlclZpZXdNb2RlbCA9IHRydWU7XHJcblxyXG4gICAgICAgIHJlcXVpcmUoTElCUyArICdzZW5kUmVxdWVzdCcpKGJvZHksICdQT1NUJywgJy9nYWxsZXJ5JywgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIENsaWVudEVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2FsbGVyeUFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlRnJvbUdhbGxlcnlBcnJheShpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlR2FsbGVyeSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KG5ldyBJbWFnZU5vdEZvdW5kKCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgdGhpcy5nYWxsZXJ5QXJyYXkgPSByZXNwb25zZS5nYWxsZXJ5O1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdhbGxlcnkoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTG9nZ2VkICYmICF0aGlzLmxvZ2dlZFVzZXJWaWV3TW9kZWwgJiYgcmVzcG9uc2UubG9nZ2VkVXNlclZpZXdNb2RlbClcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VkVXNlclZpZXdNb2RlbCA9IHJlc3BvbnNlLmxvZ2dlZFVzZXJWaWV3TW9kZWw7XHJcblxyXG5cclxuICAgICAgICAgICAgbGV0IHByb3ZpZGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiByZXNwb25zZS52aWV3TW9kZWxzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09IGlkKVxyXG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdNb2RlbHNba2V5XSA9IHJlc3BvbnNlLnZpZXdNb2RlbHNba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvdmlkZWQpXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nYWxsZXJ5QXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUZyb21HYWxsZXJ5QXJyYXkoaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlR2FsbGVyeSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBJbWFnZU5vdEZvdW5kKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnJlbW92ZUZyb21HYWxsZXJ5QXJyYXkgPSBmdW5jdGlvbiAoaWQpIHtcclxuXHJcbiAgICB0aGlzLmdhbGxlcnlBcnJheSAmJiB+dGhpcy5nYWxsZXJ5QXJyYXkuaW5kZXhPZihpZCkgJiZcclxuICAgIHRoaXMuZ2FsbGVyeUFycmF5LnNwbGljZSh0aGlzLmdhbGxlcnlBcnJheS5pbmRleE9mKGlkKSwgMSk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5hZGRUb0dhbGxlcnlBcnJheSA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgdGhpcy5nYWxsZXJ5QXJyYXkgJiYgdGhpcy5nYWxsZXJ5QXJyYXkucHVzaChpZCk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS51cGRhdGVHYWxsZXJ5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuZ2FsbGVyeUFycmF5ICYmIHRoaXMuZ2FsbGVyeSkge1xyXG4gICAgICAgIGxldCBpbWFnZVByZXZpZXdzID0gdGhpcy5nYWxsZXJ5LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbWFnZS1wcmV2aWV3Jyk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbWFnZVByZXZpZXdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICghfnRoaXMuZ2FsbGVyeUFycmF5LmluZGV4T2YoK2ltYWdlUHJldmlld3NbaV0uZGF0YXNldC5pZCkpXHJcbiAgICAgICAgICAgICAgICBpbWFnZVByZXZpZXdzW2ldLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldFB1YmxpY2F0aW9uTnVtYmVyKHRoaXMuZ2FsbGVyeUFycmF5Lmxlbmd0aCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5nZXRJbWFnZVByZXZpZXdCeUlkID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICByZXR1cm4gdGhpcy5nYWxsZXJ5LnF1ZXJ5U2VsZWN0b3IoYC5pbWFnZS1wcmV2aWV3W2RhdGEtaWQ9XCIke2lkfVwiXWApO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUudXBkYXRlSW1hZ2VQcmV2aWV3VGV4dCA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgbGV0IGxpa2VBbW91bnQgPSB0aGlzLnZpZXdNb2RlbHNbaWRdLmxpa2VzLmxlbmd0aDtcclxuICAgIGxldCBjb21tZW50QW1vdW50ID0gdGhpcy52aWV3TW9kZWxzW2lkXS5jb21tZW50cy5sZW5ndGg7XHJcbiAgICBsZXQgcHJldmlld0ltYWdlRWxlbSA9IHRoaXMuZ2V0SW1hZ2VQcmV2aWV3QnlJZChpZCk7XHJcbiAgICBwcmV2aWV3SW1hZ2VFbGVtLmRhdGFzZXQubGlrZUFtb3VudCA9IGxpa2VBbW91bnQ7XHJcbiAgICBwcmV2aWV3SW1hZ2VFbGVtLmRhdGFzZXQuY29tbWVudEFtb3VudCA9IGNvbW1lbnRBbW91bnQ7XHJcblxyXG4gICAgcHJldmlld0ltYWdlRWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2UtcHJldmlld19fY29tbWVudC1udW1iZXInKS50ZXh0Q29udGVudCA9IGNvbW1lbnRBbW91bnQ7XHJcbiAgICBwcmV2aWV3SW1hZ2VFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZS1wcmV2aWV3X19saWtlLW51bWJlcicpLnRleHRDb250ZW50ID0gbGlrZUFtb3VudDtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLmRlbGV0ZUltYWdlUHJldmlldyA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgbGV0IGVsZW0gPSB0aGlzLmdldEltYWdlUHJldmlld0J5SWQoaWQpO1xyXG4gICAgaWYgKGVsZW0pIHtcclxuICAgICAgICBlbGVtLnJlbW92ZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0UHVibGljYXRpb25OdW1iZXIoLTEsIHRydWUpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuaW5zZXJ0TmV3SW1hZ2VQcmV2aWV3ID0gZnVuY3Rpb24gKGltYWdlSWQsIHByZXZpZXdVcmwpIHtcclxuICAgIGxldCBuZXdJbWFnZVByZXZpZXcgPSB0aGlzLmltYWdlUHJldmlld0dob3N0LmNsb25lTm9kZSh0cnVlKTtcclxuICAgIG5ld0ltYWdlUHJldmlldy5jbGFzc0xpc3QucmVtb3ZlKCdpbWFnZS1wcmV2aWV3X2dob3N0Jyk7XHJcblxyXG4gICAgbmV3SW1hZ2VQcmV2aWV3LmRhdGFzZXQuaWQgPSBpbWFnZUlkO1xyXG4gICAgbmV3SW1hZ2VQcmV2aWV3LmhyZWYgPSBgL2ltYWdlLyR7aW1hZ2VJZH1gO1xyXG4gICAgbmV3SW1hZ2VQcmV2aWV3LnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZS1wcmV2aWV3X19waWN0dXJlJykuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgnLyR7cHJldmlld1VybH0nKWA7XHJcblxyXG4gICAgbmV3SW1hZ2VQcmV2aWV3LnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZS1wcmV2aWV3X19jb21tZW50LW51bWJlcicpLnRleHRDb250ZW50ID0gMDtcclxuICAgIG5ld0ltYWdlUHJldmlldy5xdWVyeVNlbGVjdG9yKCcuaW1hZ2UtcHJldmlld19fbGlrZS1udW1iZXInKS50ZXh0Q29udGVudCA9IDA7XHJcblxyXG4gICAgdGhpcy5nYWxsZXJ5V3JhcHBlci5hcHBlbmRDaGlsZChuZXdJbWFnZVByZXZpZXcpO1xyXG5cclxuICAgIHRoaXMuc2V0UHVibGljYXRpb25OdW1iZXIoMSwgdHJ1ZSk7XHJcbiAgICB0aGlzLmFkZFRvR2FsbGVyeUFycmF5KGltYWdlSWQpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuc2V0UHVibGljYXRpb25OdW1iZXIgPSBmdW5jdGlvbiAodmFsdWUsIHJlbGF0aXZlKSB7XHJcbiAgICBpZiAodGhpcy5wdWJsaWNhdGlvbk51bWJlckVsZW0pXHJcbiAgICAgICAgaWYgKHJlbGF0aXZlKVxyXG4gICAgICAgICAgICB0aGlzLnB1YmxpY2F0aW9uTnVtYmVyRWxlbS50ZXh0Q29udGVudCA9ICt0aGlzLnB1YmxpY2F0aW9uTnVtYmVyRWxlbS50ZXh0Q29udGVudCArIHZhbHVlO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5wdWJsaWNhdGlvbk51bWJlckVsZW0udGV4dENvbnRlbnQgPSB2YWx1ZTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLmRlbGV0ZVZpZXdNb2RlbCA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgZGVsZXRlIHRoaXMudmlld01vZGVsc1tpZF07XHJcbiAgICBjb25zb2xlLmxvZygnZGVsZXRlICMnICsgaWQpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUucmVxdWVzdEFsbE5lY2Vzc2FyeVZpZXdNb2RlbHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xyXG4gICAgICAgIHRoaXMucmVxdWVzdE5leHRWaWV3TW9kZWxzKCksXHJcbiAgICAgICAgdGhpcy5yZXF1ZXN0UHJldlZpZXdNb2RlbHMoKVxyXG4gICAgXSk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5yZXF1ZXN0TmV4dFZpZXdNb2RlbHMgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgaWYgKHRoaXMuZ2FsbGVyeUFycmF5ICYmIHRoaXMuZ2FsbGVyeUFycmF5Lmxlbmd0aCA9PT0gMClcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEltYWdlTm90Rm91bmQoKSk7XHJcblxyXG4gICAgbGV0IHByb21pc2VzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucHJlbG9hZEVudGl0eUNvdW50OyBpKyspXHJcbiAgICAgICAgcHJvbWlzZXMucHVzaCh0aGlzLnJlcXVlc3RWaWV3TW9kZWwodGhpcy5nZXROZXh0SW1hZ2VJZChpKSkpO1xyXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnJlcXVlc3RQcmV2Vmlld01vZGVscyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLmdhbGxlcnlBcnJheSAmJiB0aGlzLmdhbGxlcnlBcnJheS5sZW5ndGggPT09IDApXHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBJbWFnZU5vdEZvdW5kKCkpO1xyXG4gICAgbGV0IHByb21pc2VzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucHJlbG9hZEVudGl0eUNvdW50OyBpKyspXHJcbiAgICAgICAgcHJvbWlzZXMucHVzaCh0aGlzLnJlcXVlc3RWaWV3TW9kZWwodGhpcy5nZXRQcmV2SW1hZ2VJZChpKSkpO1xyXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnN3aXRjaFRvTmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLmdhbGxlcnlBcnJheSAmJiAhdGhpcy5nYWxsZXJ5QXJyYXkubGVuZ3RoKSB7XHJcbiAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBuZXh0SW1hZ2VJZCA9IHRoaXMuZ2V0TmV4dEltYWdlSWQoKTtcclxuICAgIHRoaXMuc2hvdyhuZXh0SW1hZ2VJZCkuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgSW1hZ2VOb3RGb3VuZCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5nYWxsZXJ5QXJyYXkgJiYgdGhpcy5nYWxsZXJ5QXJyYXkubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zd2l0Y2hUb05leHQoKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuc3dpdGNoVG9QcmV2ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIGlmICh0aGlzLmdhbGxlcnlBcnJheSAmJiAhdGhpcy5nYWxsZXJ5QXJyYXkubGVuZ3RoKSB7XHJcbiAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBwcmV2SW1hZ2VJZCA9IHRoaXMuZ2V0UHJldkltYWdlSWQoKTtcclxuICAgIHRoaXMuc2hvdyhwcmV2SW1hZ2VJZCkuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgSW1hZ2VOb3RGb3VuZCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5nYWxsZXJ5QXJyYXkgJiYgdGhpcy5nYWxsZXJ5QXJyYXkubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zd2l0Y2hUb1ByZXYoKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuZ2V0TmV4dEltYWdlSWQgPSBmdW5jdGlvbiAob2Zmc2V0KSB7XHJcbiAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMTtcclxuICAgIGxldCBpbmRleCA9IHRoaXMuZ2FsbGVyeUFycmF5LmluZGV4T2YodGhpcy5jdXJyZW50SW1hZ2VJZCk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZ2FsbGVyeUFycmF5WyhpbmRleCArIG9mZnNldCkgJSB0aGlzLmdhbGxlcnlBcnJheS5sZW5ndGhdO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuZ2V0UHJldkltYWdlSWQgPSBmdW5jdGlvbiAob2Zmc2V0KSB7XHJcbiAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMTtcclxuXHJcbiAgICBsZXQgaW5kZXggPSB0aGlzLmdhbGxlcnlBcnJheS5pbmRleE9mKHRoaXMuY3VycmVudEltYWdlSWQpO1xyXG5cclxuICAgIGlmICh+aW5kZXggJiYgdGhpcy5nYWxsZXJ5QXJyYXkubGVuZ3RoID09PSAxKVxyXG4gICAgICAgIHJldHVybiB0aGlzLmdhbGxlcnlBcnJheVswXTtcclxuXHJcbiAgICBsZXQgZ2FsbGVyeVByZXZJbmRleCA9IGluZGV4IC0gb2Zmc2V0O1xyXG4gICAgaWYgKGdhbGxlcnlQcmV2SW5kZXggPCAwKSB7XHJcbiAgICAgICAgZ2FsbGVyeVByZXZJbmRleCAlPSB0aGlzLmdhbGxlcnlBcnJheS5sZW5ndGg7XHJcbiAgICAgICAgZ2FsbGVyeVByZXZJbmRleCA9IHRoaXMuZ2FsbGVyeUFycmF5Lmxlbmd0aCArIGdhbGxlcnlQcmV2SW5kZXg7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZ2FsbGVyeUFycmF5W2dhbGxlcnlQcmV2SW5kZXhdO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUudXBkYXRlQ3VycmVudFZpZXcgPSBmdW5jdGlvbiAoaW52b2x2ZWRJbWFnZUlkKSB7XHJcblxyXG4gICAgaWYgKGludm9sdmVkSW1hZ2VJZCA9PT0gdGhpcy5jdXJyZW50SW1hZ2VJZCkge1xyXG4gICAgICAgIHRoaXMuaGlkZUltZ0VsZW0oKTtcclxuXHJcbiAgICAgICAgdGhpcy5pbWdFbGVtLnNldEF0dHJpYnV0ZSgnc3JjJywgdGhpcy5jdXJyZW50Vmlld01vZGVsLmltZ1VybCk7XHJcblxyXG4gICAgICAgIHRoaXMubGlrZUJ1dHRvbi5zZXRJbWFnZUlkKHRoaXMuY3VycmVudEltYWdlSWQpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlTGlrZXModGhpcy5jdXJyZW50SW1hZ2VJZCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29tbWVudFNlY3Rpb24uc2V0SW1hZ2VJZCh0aGlzLmN1cnJlbnRJbWFnZUlkKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUNvbW1lbnRzKHRoaXMuY3VycmVudEltYWdlSWQpO1xyXG5cclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uLnRleHRDb250ZW50ID0gdGhpcy5jdXJyZW50Vmlld01vZGVsLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgIGlmICh0aGlzLmRlc2NyaXB0aW9uLnRleHRDb250ZW50ID09PSAnJylcclxuICAgICAgICAgICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ2ltYWdlX25vLWRlc2NyaXB0aW9uJyk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnaW1hZ2Vfbm8tZGVzY3JpcHRpb24nKTtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRlLnRleHRDb250ZW50ID0gdGhpcy5jdXJyZW50Vmlld01vZGVsLmNyZWF0ZURhdGVTdHI7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzTG9nZ2VkKVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50Vmlld01vZGVsLmlzT3duSW1hZ2UpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZUJ1dHRvbi5zZXRJbWFnZUlkKHRoaXMuY3VycmVudEltYWdlSWQpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1YnNjcmliZUJ1dHRvbi5zZXRJbWFnZUlkKHRoaXMuY3VycmVudEltYWdlSWQpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc0ZlZWQpXHJcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlQnV0dG9uLnNldCh7YWN0aXZlOiB0cnVlfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYXZhdGFyLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJyR7dGhpcy5jdXJyZW50Vmlld01vZGVsLmF1dGhvci5hdmF0YXJVcmxzLm1lZGl1bX0nKWA7XHJcbiAgICAgICAgdGhpcy51c2VybmFtZS50ZXh0Q29udGVudCA9IHRoaXMuY3VycmVudFZpZXdNb2RlbC5hdXRob3IudXNlcm5hbWU7XHJcblxyXG4gICAgICAgIHRoaXMuaGVhZGVyTGVmdFNpZGUuc2V0QXR0cmlidXRlKCdocmVmJywgdGhpcy5jdXJyZW50Vmlld01vZGVsLmF1dGhvci51cmwpO1xyXG4gICAgfVxyXG5cclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnVwZGF0ZUxpa2VzID0gZnVuY3Rpb24gKGltYWdlSWQpIHtcclxuICAgIGlmICh0aGlzLmN1cnJlbnRJbWFnZUlkID09PSBpbWFnZUlkKVxyXG4gICAgICAgIHRoaXMubGlrZUJ1dHRvbi5zZXQoe1xyXG4gICAgICAgICAgICBhY3RpdmU6IHRoaXMuY3VycmVudFZpZXdNb2RlbC5pc0xpa2VkLFxyXG4gICAgICAgICAgICBsaWtlQW1vdW50OiB0aGlzLmN1cnJlbnRWaWV3TW9kZWwubGlrZXMubGVuZ3RoXHJcbiAgICAgICAgfSk7XHJcbiAgICBpZiAodGhpcy5nYWxsZXJ5KVxyXG4gICAgICAgIHRoaXMudXBkYXRlSW1hZ2VQcmV2aWV3VGV4dChpbWFnZUlkKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnVwZGF0ZUNvbW1lbnRzID0gZnVuY3Rpb24gKGltYWdlSWQpIHtcclxuICAgIGlmICh0aGlzLmN1cnJlbnRJbWFnZUlkID09PSBpbWFnZUlkKVxyXG4gICAgICAgIHRoaXMuY29tbWVudFNlY3Rpb24uc2V0KHRoaXMuY3VycmVudFZpZXdNb2RlbC5jb21tZW50cyk7XHJcbiAgICBpZiAodGhpcy5nYWxsZXJ5KVxyXG4gICAgICAgIHRoaXMudXBkYXRlSW1hZ2VQcmV2aWV3VGV4dChpbWFnZUlkKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnB1c2hJbWFnZVN0YXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaGlzdG9yeS5wdXNoU3RhdGUoe1xyXG4gICAgICAgIHR5cGU6ICdpbWFnZScsXHJcbiAgICAgICAgaWQ6IHRoaXMuY3VycmVudEltYWdlSWRcclxuICAgIH0sICdpbWFnZSAjJyArIHRoaXMuY3VycmVudEltYWdlSWQsICcvaW1hZ2UvJyArIHRoaXMuY3VycmVudEltYWdlSWQpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUucHVzaEdhbGxlcnlTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBsZXQgdXJsID0gJyc7XHJcbiAgICBpZiAoIXRoaXMuaXNGZWVkKVxyXG4gICAgICAgIHVybCA9IHRoaXMuY3VycmVudFZpZXdNb2RlbCAmJiB0aGlzLmN1cnJlbnRWaWV3TW9kZWwuYXV0aG9yLnVybDtcclxuICAgIGVsc2VcclxuICAgICAgICB1cmwgPSAnL2ZlZWQnO1xyXG5cclxuICAgIGhpc3RvcnkucHVzaFN0YXRlKHtcclxuICAgICAgICB0eXBlOiAnZ2FsbGVyeSdcclxuICAgIH0sICcnLCB1cmwpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUub25Qb3BTdGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZSkge1xyXG5cclxuICAgIGlmIChzdGF0ZSAmJiBzdGF0ZS50eXBlKVxyXG4gICAgICAgIHN3aXRjaCAoc3RhdGUudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdpbWFnZSc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3coe1xyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlSWQ6IHN0YXRlLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIG5vUHVzaFN0YXRlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAnZ2FsbGVyeSc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlYWN0aXZhdGUobnVsbCwge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vUHVzaFN0YXRlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxufTtcclxuXHJcbmZvciAobGV0IGtleSBpbiBldmVudE1peGluKVxyXG4gICAgR2FsbGVyeS5wcm90b3R5cGVba2V5XSA9IGV2ZW50TWl4aW5ba2V5XTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FsbGVyeTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9nYWxsZXJ5L2luZGV4LmpzIiwibGV0IGV2ZW50TWl4aW4gPSByZXF1aXJlKExJQlMgKyAnZXZlbnRNaXhpbicpO1xyXG5cclxubGV0IFN3aXRjaEJ1dHRvbiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLmVsZW0gPSBvcHRpb25zLmVsZW07XHJcbiAgICB0aGlzLmRhdGEgPSBvcHRpb25zLmRhdGE7XHJcbiAgICB0aGlzLmRhdGFTdHIgPSBvcHRpb25zLmRhdGFTdHIgfHwgJ2ltYWdlSWQnO1xyXG5cclxuICAgIFN3aXRjaEJ1dHRvbi5wcm90b3R5cGUuc2V0LmNhbGwodGhpcywge2FjdGl2ZTogISF0aGlzLmVsZW0uZGF0YXNldC5hY3RpdmV9KTtcclxuICAgIGNvbnNvbGUubG9nKCdzd2l0Y2ggYnV0dG9uIGFjdGl2ZTonLCAhIXRoaXMuZWxlbS5kYXRhc2V0LmFjdGl2ZSk7XHJcbiAgICB0aGlzLmF2YWlsYWJsZSA9IHRydWU7XHJcblxyXG4gICAgdGhpcy5lbGVtLm9uY2xpY2sgPSBlID0+IHRoaXMub25DbGljayhlKTtcclxufTtcclxuXHJcblN3aXRjaEJ1dHRvbi5wcm90b3R5cGUub25DbGljayA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIGxldCBpbnZvbHZlZERhdGEgPSB0aGlzLmRhdGE7XHJcblxyXG4gICAgaWYgKHRoaXMuYXZhaWxhYmxlKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYXZhaWxhYmxlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy50b2dnbGUoKTtcclxuXHJcbiAgICAgICAgcmVxdWlyZShMSUJTICsgJ3NlbmRSZXF1ZXN0Jykoe1xyXG4gICAgICAgICAgICBbdGhpcy5kYXRhU3RyXTogaW52b2x2ZWREYXRhXHJcbiAgICAgICAgfSwgJ1BPU1QnLCB0aGlzLnVybCwgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmICghZXJyKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXQocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCdzd2l0Y2gtYnV0dG9uX2NoYW5nZWQnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgW3RoaXMuZGF0YVN0cl06IGludm9sdmVkRGF0YSxcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yKGVycik7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSA9PT0gaW52b2x2ZWREYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5Td2l0Y2hCdXR0b24uc2V0UmVsYXRpb24gPSBmdW5jdGlvbiAoc3dpdGNoQnV0dG9uMSwgc3dpdGNoQnV0dG9uMikge1xyXG4gICAgc3dpdGNoQnV0dG9uMS5vbignc3dpdGNoLWJ1dHRvbl9jaGFuZ2VkJywgZSA9PiB7XHJcbiAgICAgICAgc3dpdGNoQnV0dG9uMi5zZXQoZS5kZXRhaWwucmVzcG9uc2UpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgc3dpdGNoQnV0dG9uMi5vbignc3dpdGNoLWJ1dHRvbl9jaGFuZ2VkJywgZSA9PiB7XHJcbiAgICAgICAgc3dpdGNoQnV0dG9uMS5zZXQoZS5kZXRhaWwucmVzcG9uc2UpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5Td2l0Y2hCdXR0b24ucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBpZiAob3B0aW9ucy5hY3RpdmUpXHJcbiAgICAgICAgdGhpcy5fYWN0aXZhdGUoKTtcclxuICAgIGVsc2VcclxuICAgICAgICB0aGlzLl9kZWFjdGl2YXRlKCk7XHJcbn07XHJcblxyXG5Td2l0Y2hCdXR0b24ucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLmFjdGl2ZSlcclxuICAgICAgICB0aGlzLnNldCh7YWN0aXZlOiBmYWxzZX0pO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHRoaXMuc2V0KHthY3RpdmU6IHRydWV9KTtcclxufTtcclxuXHJcblN3aXRjaEJ1dHRvbi5wcm90b3R5cGUuX2FjdGl2YXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ2J1dHRvbl9hY3RpdmUnKTtcclxuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcclxufTtcclxuXHJcblN3aXRjaEJ1dHRvbi5wcm90b3R5cGUuX2RlYWN0aXZhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnYnV0dG9uX2FjdGl2ZScpO1xyXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxufTtcclxuXHJcblN3aXRjaEJ1dHRvbi5wcm90b3R5cGUuc2V0SW1hZ2VJZCA9IGZ1bmN0aW9uIChpbWFnZUlkKSB7XHJcbiAgICB0aGlzLmRhdGEgPSBpbWFnZUlkO1xyXG59O1xyXG5cclxuZm9yIChsZXQga2V5IGluIGV2ZW50TWl4aW4pXHJcbiAgICBTd2l0Y2hCdXR0b24ucHJvdG90eXBlW2tleV0gPSBldmVudE1peGluW2tleV07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFN3aXRjaEJ1dHRvbjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL3N3aXRjaC1idXR0b24vaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBpZD1cXFwiaW1hZ2VcXFwiIGNsYXNzPVxcXCJtb2RhbCBpbWFnZV9pbWctZWxlbWVudC1pbnZpc2libGUgaW1hZ2UgaW1hZ2Vfbm8tZGVzY3JpcHRpb25cXFwiPlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9faW1hZ2Utd3JhcHBlclxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGlkPVxcXCJzcGlubmVyXFxcIiBjbGFzcz1cXFwic3Bpbm5lciBpbWFnZV9fc3Bpbm5lclxcXCI+XFxyXFxuICAgICAgICBcXHJcXG4gICAgICAgIDwvZGl2PiAgICAgICAgPGltZyBjbGFzcz1cXFwiaW1hZ2VfX2ltZy1lbGVtZW50XFxcIj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19jb250cm9sc1xcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2NvbnRyb2wgaW1hZ2VfX2NvbnRyb2wtcHJldiBpY29uLWFycm93LWxlZnRcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19jb250cm9sIGltYWdlX19jb250cm9sLWZ1bGwgaWNvbi1hcnJvdy1tYXhpbWlzZVxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2NvbnRyb2wgaW1hZ2VfX2NvbnRyb2wtbmV4dCBpY29uLWFycm93LXJpZ2h0XFxcIj48L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX3NpZGViYXJcXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX3RvcC1zaWRlXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJoZWFkZXIgaW1hZ2VfX2hlYWRlclxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxhIGNsYXNzPVxcXCJpbWFnZV9faGVhZGVyLWxlZnQtc2lkZVxcXCIgaHJlZj1cXFwiXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19hdmF0YXJcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPVxcXCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJycpXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19tZXRhZGF0YVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX3VzZXJuYW1lXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fcG9zdC1kYXRlXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8L2E+XFxyXFxuXFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbiBidXR0b25faW52aXNpYmxlIGltYWdlX190b3Atc2lkZS1idXR0b24gaW1hZ2VfX2RlbGV0ZS1idXR0b24gYnV0dG9uX2hlYWRlci1zdHlsZVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICBkZWxldGVcXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXZcXHJcXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJidXR0b24gaW1hZ2VfX3RvcC1zaWRlLWJ1dHRvbiBpbWFnZV9fc3Vic2NyaWJlLWJ1dHRvbiBidXR0b25faGVhZGVyLXN0eWxlXFxcIlxcclxcbiAgICAgICAgICAgICAgICA+XFxyXFxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVcXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuXFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2luZm8tYm9hcmRcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2XFxyXFxuICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XFxcImJ1dHRvbiBsaWtlLWJ1dHRvbiBpbWFnZV9fbGlrZS1idXR0b25cXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgbGlrZSBcXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19kZXNjcmlwdGlvblxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICBcXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuXFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2NvbW1lbnQtc2VjdGlvbi13cmFwcGVyIGltYWdlX25vLXNjcm9sbGJhclxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnQtc2VjdGlvbiBpbWFnZV9fY29tbWVudC1zZWN0aW9uXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnQtc2VjdGlvbl9fY29tbWVudHMtd3JhcHBlclxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInBhbmVsIGNvbW1lbnQgY29tbWVudC1zZWN0aW9uX19jb21tZW50IGNvbW1lbnRfZ2hvc3RcXFwiIGRhdGEtaWQ9XFxcIlxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb21tZW50X190b3Atc2lkZVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XFxcImNvbW1lbnRfX3JlZlxcXCIgaHJlZj1cXFwiXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudF9fYXZhdGFyXFxcIiBzdHlsZT1cXFwiYmFja2dyb3VuZC1pbWFnZTogdXJsKCcnKVxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnRfX21ldGFkYXRhXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnRfX3VzZXJuYW1lXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnRfX2RhdGVcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudF9fY2xvc2UtYnV0dG9uIGljb24tY3Jvc3NcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb21tZW50X190ZXh0XFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2NvbW1lbnQtc2VjdGlvbi1zY3JvbGxiYXItd3JhcHBlciBpbWFnZV9uby1zY3JvbGxiYXJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fY29tbWVudC1zZWN0aW9uLXNjcm9sbGJhci1vZmZzZXRcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fY29tbWVudC1zZWN0aW9uLXNjcm9sbGJhclxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fY29tbWVudC1zZWN0aW9uLXNsaWRlclxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcblxcclxcblxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJwYW5lbCBjb21tZW50IGNvbW1lbnQtc2VuZCBpbWFnZV9fY29tbWVudC1zZW5kXFxcIlxcclxcbiAgICAgICAgICAgICBkYXRhLWltYWdlLWlkPVxcXCJcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnRfX3RvcC1zaWRlXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudF9fYXZhdGFyXFxcIiBzdHlsZT1cXFwiYmFja2dyb3VuZC1pbWFnZTogdXJsKCcnKVxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnRfX3VzZXJuYW1lXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgICAgICA8dGV4dGFyZWEgcGxhY2Vob2xkZXI9XFxcInNoYXJlIHlvdXIgb3BpbmlvbuKAplxcXCIgY2xhc3M9XFxcImNvbW1lbnQtc2VuZF9fdGV4dGFyZWFcXFwiPjwvdGV4dGFyZWE+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uIGNvbW1lbnQtc2VuZF9fc2VuZC1idXR0b25cXFwiPnNlbmQ8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX21vZGFsLWNsb3NlLWJ1dHRvbi13cmFwcGVyXFxcIj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImljb24tY3Jvc3MgbW9kYWwtY2xvc2UtYnV0dG9uIGltYWdlX19tb2RhbC1jbG9zZS1idXR0b25cXFwiPjwvZGl2PiAgICA8L2Rpdj5cXHJcXG5cXHJcXG48L2Rpdj5cXHJcXG5cXHJcXG5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svfi9odG1sLWxvYWRlciEuLi9ibG9ja3MvZ2FsbGVyeS93aW5kb3dcbi8vIG1vZHVsZSBpZCA9IDMyXG4vLyBtb2R1bGUgY2h1bmtzID0gMyA4IDEzIiwibGV0IENvbW1lbnRTZWN0aW9uID0gcmVxdWlyZShCTE9DS1MgKyAnY29tbWVudC1zZWN0aW9uJyk7XHJcblxyXG5sZXQgSW1hZ2VDb21tZW50U2VjdGlvbiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBDb21tZW50U2VjdGlvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cclxuICAgIHRoaXMuY29tbWVudFNlY3Rpb25XcmFwcGVyID0gb3B0aW9ucy5jb21tZW50U2VjdGlvbldyYXBwZXI7XHJcbiAgICB0aGlzLmluZm9Cb2FyZCA9IG9wdGlvbnMuaW5mb0JvYXJkO1xyXG4gICAgdGhpcy5zY3JvbGxiYXJXcmFwcGVyID0gb3B0aW9ucy5zY3JvbGxiYXJXcmFwcGVyO1xyXG4gICAgdGhpcy5zY3JvbGxiYXIgPSB0aGlzLnNjcm9sbGJhcldyYXBwZXIucXVlcnlTZWxlY3RvcignLmltYWdlX19jb21tZW50LXNlY3Rpb24tc2Nyb2xsYmFyJyk7XHJcbiAgICB0aGlzLnNjcm9sbGJhck9mZnNldCA9IHRoaXMuc2Nyb2xsYmFyV3JhcHBlci5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2NvbW1lbnQtc2VjdGlvbi1zY3JvbGxiYXItb2Zmc2V0Jyk7XHJcbiAgICB0aGlzLnNjcm9sbGJhclNsaWRlciA9IHRoaXMuc2Nyb2xsYmFyV3JhcHBlci5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2NvbW1lbnQtc2VjdGlvbi1zbGlkZXInKTtcclxuXHJcbiAgICB0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlci5vbnNjcm9sbCA9IGUgPT4ge1xyXG4gICAgICAgIGlmICghdGhpcy5vbkRyYWdnaW5nKVxyXG4gICAgICAgICAgICB0aGlzLnNldFRvcCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnNjcm9sbGJhclNsaWRlci5vbm1vdXNlZG93biA9IGUgPT4ge1xyXG5cclxuICAgICAgICB0aGlzLm9uRHJhZ2dpbmcgPSB0cnVlO1xyXG4gICAgICAgIGxldCBzbGlkZXJDb29yZHMgPSBnZXRDb29yZHModGhpcy5zY3JvbGxiYXJTbGlkZXIpO1xyXG4gICAgICAgIGxldCBzaGlmdFkgPSBlLnBhZ2VZIC0gc2xpZGVyQ29vcmRzLnRvcDtcclxuICAgICAgICBsZXQgc2Nyb2xsYmFyQ29vcmRzID0gZ2V0Q29vcmRzKHRoaXMuc2Nyb2xsYmFyKTtcclxuICAgICAgICBsZXQgbmV3VG9wO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5vbm1vdXNlbW92ZSA9IGUgPT4ge1xyXG4gICAgICAgICAgICBuZXdUb3AgPSBlLnBhZ2VZIC0gc2hpZnRZIC0gc2Nyb2xsYmFyQ29vcmRzLnRvcDtcclxuICAgICAgICAgICAgaWYgKG5ld1RvcCA8IDApIG5ld1RvcCA9IDA7XHJcbiAgICAgICAgICAgIGxldCBib3R0b21FZGdlID0gdGhpcy5zY3JvbGxiYXIub2Zmc2V0SGVpZ2h0IC0gdGhpcy5zY3JvbGxiYXJTbGlkZXIub2Zmc2V0SGVpZ2h0O1xyXG4gICAgICAgICAgICBpZiAobmV3VG9wID4gYm90dG9tRWRnZSkgbmV3VG9wID0gYm90dG9tRWRnZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYmFyU2xpZGVyLnN0eWxlLnRvcCA9IG5ld1RvcCArICdweCc7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlci5zY3JvbGxUb3AgPSAobmV3VG9wIC8gdGhpcy5zY3JvbGxiYXIub2Zmc2V0SGVpZ2h0KSAvICgxIC0gdGhpcy5zbGlkZXJTaXplUmF0ZSkgKlxyXG4gICAgICAgICAgICAgICAgKHRoaXMuY29tbWVudFNlY3Rpb25XcmFwcGVyLnNjcm9sbEhlaWdodCAtIHRoaXMuY29tbWVudFNlY3Rpb25XcmFwcGVyLm9mZnNldEhlaWdodCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQub25tb3VzZXVwID0gZSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdvbm1vdXNldXAnLCBuZXdUb3AsIHRoaXMuc2Nyb2xsYmFyLm9mZnNldEhlaWdodCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYmFyU2xpZGVyLnN0eWxlLnRvcCA9IChuZXdUb3AgKiAxMDAgLyB0aGlzLnNjcm9sbGJhci5vZmZzZXRIZWlnaHQpICsgJyUnO1xyXG4gICAgICAgICAgICB0aGlzLm9uRHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgZG9jdW1lbnQub25tb3VzZW1vdmUgPSBkb2N1bWVudC5vbm1vdXNldXAgPSBudWxsO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTsgLy8gZGlzYWJsZSBzZWxlY3Rpb24gc3RhcnQgKGN1cnNvciBjaGFuZ2UpXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuc2Nyb2xsYmFyU2xpZGVyLm9uZHJhZ3N0YXJ0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0Q29vcmRzKGVsZW0pIHsgLy8g0LrRgNC+0LzQtSBJRTgtXHJcbiAgICAgICAgbGV0IGJveCA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHRvcDogYm94LnRvcCArIHBhZ2VZT2Zmc2V0LFxyXG4gICAgICAgICAgICBsZWZ0OiBib3gubGVmdCArIHBhZ2VYT2Zmc2V0XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG59O1xyXG5JbWFnZUNvbW1lbnRTZWN0aW9uLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlKTtcclxuSW1hZ2VDb21tZW50U2VjdGlvbi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBJbWFnZUNvbW1lbnRTZWN0aW9uO1xyXG5cclxuSW1hZ2VDb21tZW50U2VjdGlvbi5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlLnNldC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgdGhpcy51cGRhdGUoKTtcclxufTtcclxuXHJcbkltYWdlQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlLnNldFRvcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBzY3JvbGxSYXRlID0gKHRoaXMuY29tbWVudFNlY3Rpb25XcmFwcGVyLnNjcm9sbFRvcCkgL1xyXG4gICAgICAgICh0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlci5zY3JvbGxIZWlnaHQgLSB0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlci5vZmZzZXRIZWlnaHQpICogMTAwO1xyXG5cclxuICAgIHRoaXMuc2Nyb2xsYmFyU2xpZGVyLnN0eWxlLnRvcCA9IGAkeygxIC0gdGhpcy5zbGlkZXJTaXplUmF0ZSkgKiBzY3JvbGxSYXRlfSVgO1xyXG5cclxufTtcclxuXHJcbkltYWdlQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuY29tbWVudFNlY3Rpb25XcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2ltYWdlX25vLXNjcm9sbGJhcicpO1xyXG4gICAgdGhpcy5zY3JvbGxiYXJXcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2ltYWdlX25vLXNjcm9sbGJhcicpO1xyXG5cclxuICAgIHRoaXMuaW5mb0JvYXJkSGVpZ2h0ID0gdGhpcy5pbmZvQm9hcmQub2Zmc2V0SGVpZ2h0O1xyXG5cclxuICAgIGxldCBjb21wdXRlZFN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmluZm9Cb2FyZCk7XHJcbiAgICBwYXJzZUZsb2F0KGNvbXB1dGVkU3R5bGUuaGVpZ2h0KSAmJiAodGhpcy5pbmZvQm9hcmRIZWlnaHQgPSBwYXJzZUZsb2F0KGNvbXB1dGVkU3R5bGUuaGVpZ2h0KSk7XHJcblxyXG4gICAgdGhpcy5zY3JvbGxiYXJPZmZzZXQuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5pbmZvQm9hcmRIZWlnaHR9cHhgO1xyXG4gICAgdGhpcy5zY3JvbGxiYXIuc3R5bGUuaGVpZ2h0ID0gYGNhbGMoMTAwJSAtICR7dGhpcy5pbmZvQm9hcmRIZWlnaHR9cHgpYDtcclxuXHJcbiAgICBpZiAodGhpcy5jb21tZW50U2VjdGlvbldyYXBwZXIub2Zmc2V0SGVpZ2h0IC0gdGhpcy5jb21tZW50c1dyYXBwZXIuc2Nyb2xsSGVpZ2h0IDwgLTEpIHtcclxuICAgICAgICB0aGlzLnNsaWRlclNpemVSYXRlID0gdGhpcy5jb21tZW50U2VjdGlvbldyYXBwZXIub2Zmc2V0SGVpZ2h0IC8gdGhpcy5jb21tZW50c1dyYXBwZXIuc2Nyb2xsSGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyU2xpZGVyLnN0eWxlLmhlaWdodCA9IGAke3RoaXMuc2xpZGVyU2l6ZVJhdGUgKiAxMDB9JWA7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VG9wKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29tbWVudFNlY3Rpb25XcmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2ltYWdlX25vLXNjcm9sbGJhcicpO1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyV3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCdpbWFnZV9uby1zY3JvbGxiYXInKTtcclxuICAgIH1cclxuXHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbWFnZUNvbW1lbnRTZWN0aW9uO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvaW1hZ2UtY29tbWVudC1zZWN0aW9uL2luZGV4LmpzIiwibGV0IGV2ZW50TWl4aW4gPSByZXF1aXJlKExJQlMgKyAnZXZlbnRNaXhpbicpO1xyXG5cclxubGV0IENvbW1lbnRTZWN0aW9uID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICB0aGlzLmVsZW0gPSBvcHRpb25zLmVsZW07XHJcbiAgICB0aGlzLmNvbW1lbnRzV3JhcHBlciA9IG9wdGlvbnMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuY29tbWVudC1zZWN0aW9uX19jb21tZW50cy13cmFwcGVyJyk7XHJcbiAgICB0aGlzLmltYWdlSWQgPSBvcHRpb25zLmltYWdlSWQ7XHJcbiAgICB0aGlzLmxvZ2dlZFVzZXJWaWV3TW9kZWwgPSBvcHRpb25zLmxvZ2dlZFVzZXJWaWV3TW9kZWw7XHJcblxyXG4gICAgdGhpcy5jb21tZW50U2VuZGVyRWxlbSA9IG9wdGlvbnMuY29tbWVudFNlbmRlckVsZW07XHJcbiAgICB0aGlzLmNvbW1lbnRTZW5kVGV4dGFyZWEgPSB0aGlzLmNvbW1lbnRTZW5kZXJFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50LXNlbmRfX3RleHRhcmVhJyk7XHJcblxyXG4gICAgdGhpcy5naG9zdCA9IHRoaXMuY29tbWVudHNXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50Jyk7XHJcblxyXG4gICAgaWYgKHRoaXMubG9nZ2VkVXNlclZpZXdNb2RlbCkge1xyXG4gICAgICAgIHRoaXMuY29tbWVudFNlbmRlckVsZW0ucXVlcnlTZWxlY3RvcignLmNvbW1lbnRfX2F2YXRhcicpLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJyR7dGhpcy5sb2dnZWRVc2VyVmlld01vZGVsLmF2YXRhclVybHMubWVkaXVtfScpYDtcclxuICAgICAgICB0aGlzLmNvbW1lbnRTZW5kZXJFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50X191c2VybmFtZScpLnRleHRDb250ZW50ID0gdGhpcy5sb2dnZWRVc2VyVmlld01vZGVsLnVzZXJuYW1lO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvbW1lbnRTZW5kZXJFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50X19hdmF0YXInKS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCcke0FOT05fQVZBVEFSX1VSTH0nKWA7XHJcbiAgICAgICAgdGhpcy5jb21tZW50U2VuZGVyRWxlbS5xdWVyeVNlbGVjdG9yKCcuY29tbWVudF9fdXNlcm5hbWUnKS50ZXh0Q29udGVudCA9IEFOT05fTkFNRTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNvbW1lbnRTZW5kZXJFbGVtLm9uY2xpY2sgPSBlID0+IHtcclxuICAgICAgICBpZiAoIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnY29tbWVudC1zZW5kX19zZW5kLWJ1dHRvbicpKSByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCBpbnZvbHZlZEltYWdlSWQgPSB0aGlzLmltYWdlSWQ7XHJcbiAgICAgICAgbGV0IHRleHQgPSB0aGlzLmNvbW1lbnRTZW5kVGV4dGFyZWEudmFsdWU7XHJcbiAgICAgICAgaWYgKHRleHQubGVuZ3RoKSB7XHJcblxyXG4gICAgICAgICAgICByZXF1aXJlKExJQlMgKyAnc2VuZFJlcXVlc3QnKSh7XHJcbiAgICAgICAgICAgICAgICBpZDogaW52b2x2ZWRJbWFnZUlkLFxyXG4gICAgICAgICAgICAgICAgdGV4dFxyXG4gICAgICAgICAgICB9LCAnUE9TVCcsICcvY29tbWVudCcsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21tZW50U2VuZFRleHRhcmVhLnZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbWFnZUlkID09PSBpbnZvbHZlZEltYWdlSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluc2VydE5ld0NvbW1lbnQocmVzcG9uc2Uudmlld01vZGVsKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvQm90dG9tKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCdjb21tZW50LXNlY3Rpb25fY2hhbmdlZCcsIHtcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZUlkOiBpbnZvbHZlZEltYWdlSWRcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmVsZW0ub25jbGljayA9IGUgPT4ge1xyXG4gICAgICAgIGlmICghZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb21tZW50X19jbG9zZS1idXR0b24nKSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgY29tbWVudCA9IGUudGFyZ2V0LmNsb3Nlc3QoJy5jb21tZW50Jyk7XHJcbiAgICAgICAgbGV0IGNvbW1lbnRJZCA9IGNvbW1lbnQuZGF0YXNldC5pZDtcclxuICAgICAgICBsZXQgaW52b2x2ZWRJbWFnZUlkID0gdGhpcy5pbWFnZUlkO1xyXG5cclxuICAgICAgICByZXF1aXJlKExJQlMgKyAnc2VuZFJlcXVlc3QnKSh7XHJcbiAgICAgICAgICAgIGlkOiBjb21tZW50SWRcclxuICAgICAgICB9LCAnREVMRVRFJywgJy9jb21tZW50JywgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ2NvbW1lbnQtc2VjdGlvbl9jaGFuZ2VkJywge1xyXG4gICAgICAgICAgICAgICAgaW1hZ2VJZDogaW52b2x2ZWRJbWFnZUlkXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb21tZW50LnJlbW92ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbn07XHJcblxyXG5Db21tZW50U2VjdGlvbi5wcm90b3R5cGUuc2Nyb2xsVG9Cb3R0b20gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmNvbW1lbnRzV3JhcHBlci5zY3JvbGxUb3AgPSB0aGlzLmNvbW1lbnRzV3JhcHBlci5zY3JvbGxIZWlnaHQ7XHJcbn07XHJcblxyXG5Db21tZW50U2VjdGlvbi5wcm90b3R5cGUuaW5zZXJ0TmV3Q29tbWVudCA9IGZ1bmN0aW9uICh2aWV3TW9kZWwpIHtcclxuICAgIGxldCBuZXdDb21tZW50ID0gdGhpcy5naG9zdC5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICBuZXdDb21tZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NvbW1lbnRfZ2hvc3QnKTtcclxuICAgIG5ld0NvbW1lbnQuZGF0YXNldC5pZCA9IHZpZXdNb2RlbC5faWQ7XHJcbiAgICBuZXdDb21tZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50X19yZWYnKS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCB2aWV3TW9kZWwuY29tbWVudGF0b3IudXJsKTtcclxuICAgIG5ld0NvbW1lbnQucXVlcnlTZWxlY3RvcignLmNvbW1lbnRfX2F2YXRhcicpLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9XHJcbiAgICAgICAgYHVybCgnJHt2aWV3TW9kZWwuY29tbWVudGF0b3IuYXZhdGFyVXJscy5tZWRpdW19JylgO1xyXG4gICAgbmV3Q29tbWVudC5xdWVyeVNlbGVjdG9yKCcuY29tbWVudF9fdXNlcm5hbWUnKS50ZXh0Q29udGVudCA9IHZpZXdNb2RlbC5jb21tZW50YXRvci51c2VybmFtZTtcclxuICAgIG5ld0NvbW1lbnQucXVlcnlTZWxlY3RvcignLmNvbW1lbnRfX2RhdGUnKS50ZXh0Q29udGVudCA9IHZpZXdNb2RlbC5jcmVhdGVEYXRlU3RyO1xyXG5cclxuICAgIGlmICghdmlld01vZGVsLmlzT3duQ29tbWVudClcclxuICAgICAgICBuZXdDb21tZW50LmNsYXNzTGlzdC5hZGQoJ2NvbW1lbnRfbm90LW93bicpO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIG5ld0NvbW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY29tbWVudF9ub3Qtb3duJyk7XHJcblxyXG4gICAgbmV3Q29tbWVudC5xdWVyeVNlbGVjdG9yKCcuY29tbWVudF9fdGV4dCcpLnRleHRDb250ZW50ID0gdmlld01vZGVsLnRleHQ7XHJcbiAgICB0aGlzLmNvbW1lbnRzV3JhcHBlci5hcHBlbmRDaGlsZChuZXdDb21tZW50KTtcclxufTtcclxuXHJcblxyXG5Db21tZW50U2VjdGlvbi5wcm90b3R5cGUuc2V0SW1hZ2VJZCA9IGZ1bmN0aW9uIChpbWFnZUlkKSB7XHJcbiAgICB0aGlzLmltYWdlSWQgPSBpbWFnZUlkO1xyXG59O1xyXG5cclxuQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uICh2aWV3TW9kZWxzKSB7XHJcbiAgICB0aGlzLmNsZWFyKCk7XHJcblxyXG4gICAgdmlld01vZGVscy5mb3JFYWNoKHZpZXdNb2RlbCA9PiB7XHJcbiAgICAgICAgdGhpcy5pbnNlcnROZXdDb21tZW50KHZpZXdNb2RlbCk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbkNvbW1lbnRTZWN0aW9uLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuY29tbWVudHNXcmFwcGVyLmlubmVySFRNTCA9ICcnO1xyXG59O1xyXG5cclxuXHJcbmZvciAobGV0IGtleSBpbiBldmVudE1peGluKVxyXG4gICAgQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlW2tleV0gPSBldmVudE1peGluW2tleV07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbW1lbnRTZWN0aW9uO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL2NvbW1lbnQtc2VjdGlvbi9pbmRleC5qcyIsImxldCBTd2l0Y2hCdXR0b24gPSByZXF1aXJlKEJMT0NLUyArICdzd2l0Y2gtYnV0dG9uJyk7XHJcblxyXG5sZXQgTGlrZUJ1dHRvbiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBTd2l0Y2hCdXR0b24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHJcbiAgICB0aGlzLmxpa2VBbW91bnQgPSArdGhpcy5lbGVtLmRhdGFzZXQubGlrZUFtb3VudDtcclxuICAgIHRoaXMudXJsID0gJy9saWtlJztcclxuXHJcbn07XHJcbkxpa2VCdXR0b24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShTd2l0Y2hCdXR0b24ucHJvdG90eXBlKTtcclxuTGlrZUJ1dHRvbi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBMaWtlQnV0dG9uO1xyXG5cclxuTGlrZUJ1dHRvbi5wcm90b3R5cGUuc2V0QW1vdW50ID0gZnVuY3Rpb24gKGxpa2VBbW91bnQpIHtcclxuICAgIHRoaXMubGlrZUFtb3VudCA9IGxpa2VBbW91bnQ7XHJcbiAgICB0aGlzLmVsZW0udGV4dENvbnRlbnQgPSBgbGlrZSAke3RoaXMubGlrZUFtb3VudH1gO1xyXG59O1xyXG5cclxuTGlrZUJ1dHRvbi5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuc2V0QW1vdW50KG9wdGlvbnMubGlrZUFtb3VudCk7XHJcbiAgICBTd2l0Y2hCdXR0b24ucHJvdG90eXBlLnNldC5jYWxsKHRoaXMsIG9wdGlvbnMpO1xyXG59O1xyXG5cclxuTGlrZUJ1dHRvbi5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuYWN0aXZlKVxyXG4gICAgICAgIHRoaXMuc2V0KHthY3RpdmU6IGZhbHNlLCBsaWtlQW1vdW50OiB0aGlzLmxpa2VBbW91bnQgLSAxfSk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5zZXQoe2FjdGl2ZTogdHJ1ZSwgbGlrZUFtb3VudDogdGhpcy5saWtlQW1vdW50ICsgMX0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMaWtlQnV0dG9uO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL2xpa2UtYnV0dG9uL2luZGV4LmpzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2ltYWdlL3N0eWxlLmxlc3Ncbi8vIG1vZHVsZSBpZCA9IDQyXG4vLyBtb2R1bGUgY2h1bmtzID0gOCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNaQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7OztBQUVBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUdBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7Ozs7Ozs7O0FDdFFBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNiQTs7Ozs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0NBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7Ozs7Ozs7Ozs7QUMzc0JBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7OztBQUVBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7Ozs7OztBQ3RGQTs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBOzs7Ozs7Ozs7QUN0R0E7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBOzs7Ozs7OztBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTs7Ozs7Ozs7Ozs7OztBQzVCQTs7OyIsInNvdXJjZVJvb3QiOiIifQ==