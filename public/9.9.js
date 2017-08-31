webpackJsonp([9,3,14],{

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

/***/ 24:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var eventMixin = __webpack_require__(25);
	var Spinner = __webpack_require__(26);

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

/***/ 26:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var Spinner = function Spinner(options) {
	    this.elem = document.getElementById('spinner');
	};

	Spinner.html = __webpack_require__(27);

	Spinner.prototype.show = function () {
	    this.elem.classList.remove('spinner_invisible');
	};

	Spinner.prototype.hide = function () {
	    this.elem.classList.add('spinner_invisible');
	};

	module.exports = Spinner;

/***/ }),

/***/ 27:
/***/ (function(module, exports) {

	module.exports = "<div id=\"spinner\" class=\"spinner\">\r\n\r\n</div>";

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

/***/ }),

/***/ 37:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var eventMixin = __webpack_require__(25);
	var ClientError = __webpack_require__(22).ClientError;
	var ImageNotFound = __webpack_require__(22).ImageNotFound;
	var Modal = __webpack_require__(24);
	var SwitchButton = __webpack_require__(38);
	var getCorrectNounForm = __webpack_require__(39);

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

	        if (!_this3.elem) _this3.elem = _this3.renderWindow(__webpack_require__(40));

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

	        var CommentSection = __webpack_require__(41);
	        var LikeButton = __webpack_require__(43);

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
	                    var DeleteImageButton = __webpack_require__(44);
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
	                    var SubscribeButton = __webpack_require__(47);
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
	        } else if (element.mozRequestFullScreen) {
	            element.mozRequestFullScreen();
	        }
	    }

	    function cancelFullscreen() {
	        if (document.exitFullscreen) {
	            document.exitFullscreen();
	        } else if (document.webkitCancelFullScreen) {
	            document.webkitCancelFullScreen();
	        } else if (document.mozCancelFullScreen) {
	            document.mozCancelFullScreen();
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

	        __webpack_require__(32)(body, 'POST', '/gallery', function (err, response) {
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

/***/ 38:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var eventMixin = __webpack_require__(25);

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

	        __webpack_require__(32)(_defineProperty({}, this.dataStr, involvedData), 'POST', this.url, function (err, response) {

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

/***/ 39:
/***/ (function(module, exports) {

	'use strict';

	var getCorrectNounForm = function getCorrectNounForm(singleForm, amount) {
	    return singleForm + (amount === 1 ? '' : 's');
	};

	module.exports = getCorrectNounForm;

/***/ }),

/***/ 40:
/***/ (function(module, exports) {

	module.exports = "<div id=\"image\" class=\"modal image_img-element-invisible image image_no-description\">\r\n    <div class=\"image__image-wrapper\">\r\n        <div id=\"spinner\" class=\"spinner image__spinner\">\r\n        \r\n        </div>        <img class=\"image__img-element\">\r\n        <div class=\"image__controls\">\r\n            <div class=\"image__control image__control-prev icon-arrow-left\"></div>\r\n            <div class=\"image__control image__control-full icon-arrow-maximise\"></div>\r\n            <div class=\"image__control image__control-next icon-arrow-right\"></div>\r\n        </div>\r\n    </div>\r\n    <div class=\"image__sidebar\">\r\n        <div class=\"image__top-side\">\r\n            <div class=\"header image__header\">\r\n                <a class=\"image__header-left-side\" href=\"\">\r\n                    <div class=\"image__avatar\"\r\n                         style=\"background-image: url('')\"></div>\r\n                    <div class=\"image__metadata\">\r\n                        <div class=\"image__username\"></div>\r\n                        <div class=\"image__post-date\"></div>\r\n                    </div>\r\n                </a>\r\n\r\n                <div class=\"button button_invisible image__top-side-button image__delete-button button_header-style\">\r\n                    delete\r\n                </div>\r\n                <div\r\n                    class=\"button image__top-side-button image__subscribe-button button_header-style\"\r\n                >\r\n                    subscribe\r\n                </div>\r\n            </div>\r\n\r\n\r\n            <div class=\"image__info-board\">\r\n\r\n                <div\r\n                \r\n                     class=\"button like-button image__like-button\">\r\n                    <div class=\"like-button__heart icon-heart\"></div>\r\n                    <div class=\"like-button__heart icon-heart-outlined\"></div>\r\n                    &nbsp;like&nbsp;\r\n                    <span class=\"like-button__like-amount\"></span>\r\n                </div>\r\n                <div class=\"image__description\">\r\n                    \r\n                </div>\r\n\r\n            </div>\r\n\r\n\r\n            <div class=\"image__comment-section-wrapper image_no-scrollbar\">\r\n                <div class=\"comment-section image__comment-section\">\r\n                    <div class=\"comment-section__no-comments-block\">\r\n                        There are no comments yet\r\n                    </div>\r\n                    <div class=\"comment-section__comments-wrapper\">\r\n\r\n                            <div class=\"panel comment comment-section__comment comment_ghost\" data-id=\"\">\r\n                                <div class=\"comment__top-side\">\r\n                                    <a class=\"comment__ref\" href=\"\">\r\n                                        <div class=\"comment__avatar\" style=\"background-image: url('')\"></div>\r\n                                        <div class=\"comment__metadata\">\r\n                                            <div class=\"comment__username\"></div>\r\n                                            <div class=\"comment__date\"></div>\r\n                                        </div>\r\n                                    </a>\r\n                                    <div class=\"comment__close-button icon-cross\"></div>\r\n                                </div>\r\n                                <div class=\"comment__text\"></div>\r\n                            </div>\r\n\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"image__comment-section-scrollbar-wrapper image_no-scrollbar\">\r\n                <div class=\"image__comment-section-scrollbar-offset\"></div>\r\n                <div class=\"image__comment-section-scrollbar\">\r\n                    <div class=\"image__comment-section-slider\"></div>\r\n                </div>\r\n\r\n            </div>\r\n\r\n        </div>\r\n\r\n        <div class=\"panel comment comment-send image__comment-send\"\r\n             data-image-id=\"\">\r\n            <div class=\"comment__top-side\">\r\n                <div class=\"comment__avatar\"></div>\r\n                <div class=\"comment__username\"></div>\r\n            </div>\r\n\r\n            <textarea placeholder=\"share your opinion…\" class=\"comment-send__textarea\"></textarea>\r\n            <div class=\"button comment-send__send-button\">send</div>\r\n        </div>\r\n    </div>\r\n    <div class=\"image__modal-close-button-wrapper\">\r\n        <div class=\"icon-cross modal-close-button image__modal-close-button\"></div>    </div>\r\n\r\n</div>\r\n\r\n";

/***/ }),

/***/ 41:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var CommentSection = __webpack_require__(42);

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

/***/ 42:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var eventMixin = __webpack_require__(25);

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

	            __webpack_require__(32)({
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

	        __webpack_require__(32)({
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

/***/ 43:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var SwitchButton = __webpack_require__(38);

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

/***/ })

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiOS45LmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2NvbXBvbmVudEVycm9ycy5qcz9hY2I1Iiwid2VicGFjazovLy8uLi9ibG9ja3MvbW9kYWwvaW5kZXguanMiLCJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2V2ZW50TWl4aW4uanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9zcGlubmVyL2luZGV4LmpzIiwid2VicGFjazovLy8uLi9ibG9ja3Mvc3Bpbm5lci9tYXJrdXAiLCJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL3NlbmRSZXF1ZXN0LmpzPzhhMjciLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9nYWxsZXJ5L2luZGV4LmpzP2I1MjAiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9zd2l0Y2gtYnV0dG9uL2luZGV4LmpzP2FhODYiLCJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2dldENvcnJlY3ROb3VuRm9ybS5qcz84ODM2Iiwid2VicGFjazovLy8uLi9ibG9ja3MvZ2FsbGVyeS93aW5kb3c/YzZiMCIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2ltYWdlLWNvbW1lbnQtc2VjdGlvbi9pbmRleC5qcz9kNjYyIiwid2VicGFjazovLy8uLi9ibG9ja3MvY29tbWVudC1zZWN0aW9uL2luZGV4LmpzPzRmMDMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9saWtlLWJ1dHRvbi9pbmRleC5qcz8xYjUyIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIEN1c3RvbUVycm9yKG1lc3NhZ2UpIHtcclxuXHR0aGlzLm5hbWUgPSBcIkN1c3RvbUVycm9yXCI7XHJcblx0dGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuXHJcblx0aWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKVxyXG5cdFx0RXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgQ3VzdG9tRXJyb3IpO1xyXG5cdGVsc2VcclxuXHRcdHRoaXMuc3RhY2sgPSAobmV3IEVycm9yKCkpLnN0YWNrO1xyXG59XHJcbkN1c3RvbUVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcclxuQ3VzdG9tRXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ3VzdG9tRXJyb3I7XHJcblxyXG5cclxuZnVuY3Rpb24gQ29tcG9uZW50RXJyb3IobWVzc2FnZSwgc3RhdHVzKSB7XHJcblx0Q3VzdG9tRXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlIHx8ICdBbiBlcnJvciBoYXMgb2NjdXJyZWQnICk7XHJcblx0dGhpcy5uYW1lID0gXCJDb21wb25lbnRFcnJvclwiO1xyXG5cdHRoaXMuc3RhdHVzID0gc3RhdHVzO1xyXG59XHJcbkNvbXBvbmVudEVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ3VzdG9tRXJyb3IucHJvdG90eXBlKTtcclxuQ29tcG9uZW50RXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ29tcG9uZW50RXJyb3I7XHJcblxyXG5mdW5jdGlvbiBDbGllbnRFcnJvcihtZXNzYWdlLCBkZXRhaWwsIHN0YXR1cykge1xyXG5cdENvbXBvbmVudEVycm9yLmNhbGwodGhpcywgbWVzc2FnZSB8fCAnQW4gZXJyb3IgaGFzIG9jY3VycmVkLiBDaGVjayBpZiBqYXZhc2NyaXB0IGlzIGVuYWJsZWQnLCBzdGF0dXMpO1xyXG5cdHRoaXMubmFtZSA9IFwiQ2xpZW50RXJyb3JcIjtcclxuXHR0aGlzLmRldGFpbCA9IGRldGFpbDtcclxufVxyXG5DbGllbnRFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbXBvbmVudEVycm9yLnByb3RvdHlwZSk7XHJcbkNsaWVudEVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENsaWVudEVycm9yO1xyXG5cclxuXHJcbmZ1bmN0aW9uIEltYWdlTm90Rm91bmQobWVzc2FnZSkge1xyXG4gICAgQ2xpZW50RXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlIHx8ICdJbWFnZSBub3QgZm91bmQuIEl0IHByb2JhYmx5IGhhcyBiZWVuIHJlbW92ZWQnLCBudWxsLCA0MDQpO1xyXG4gICAgdGhpcy5uYW1lID0gXCJJbWFnZU5vdEZvdW5kXCI7XHJcbn1cclxuSW1hZ2VOb3RGb3VuZC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENsaWVudEVycm9yLnByb3RvdHlwZSk7XHJcbkltYWdlTm90Rm91bmQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gSW1hZ2VOb3RGb3VuZDtcclxuXHJcbmZ1bmN0aW9uIFNlcnZlckVycm9yKG1lc3NhZ2UsIHN0YXR1cykge1xyXG5cdENvbXBvbmVudEVycm9yLmNhbGwodGhpcywgbWVzc2FnZSB8fCAnVGhlcmUgaXMgc29tZSBlcnJvciBvbiB0aGUgc2VydmVyIHNpZGUnLCBzdGF0dXMpO1xyXG5cdHRoaXMubmFtZSA9IFwiU2VydmVyRXJyb3JcIjtcclxufVxyXG5TZXJ2ZXJFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbXBvbmVudEVycm9yLnByb3RvdHlwZSk7XHJcblNlcnZlckVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNlcnZlckVycm9yO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0Q29tcG9uZW50RXJyb3IsXHJcblx0Q2xpZW50RXJyb3IsXHJcbiAgICBJbWFnZU5vdEZvdW5kLFxyXG5cdFNlcnZlckVycm9yXHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9jb21wb25lbnRFcnJvcnMuanMiLCJsZXQgZXZlbnRNaXhpbiA9IHJlcXVpcmUoTElCUyArICdldmVudE1peGluJyk7XHJcbmxldCBTcGlubmVyID0gcmVxdWlyZShCTE9DS1MgKyAnc3Bpbm5lcicpO1xyXG5cclxubGV0IE1vZGFsID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XHJcbiAgICB0aGlzLmxpc3RlbmVycyA9IFtdO1xyXG4gICAgdGhpcy5zdGF0dXMgPSBvcHRpb25zICYmIG9wdGlvbnMuc3RhdHVzIHx8IE1vZGFsLnN0YXR1c2VzLk1JTk9SO1xyXG59O1xyXG5cclxuTW9kYWwuc3RhdHVzZXMgPSB7XHJcbiAgICBNQUpPUjogMSxcclxuICAgIE1JTk9SOiAyXHJcbn07XHJcblxyXG5Nb2RhbC5wcm90b3R5cGUub25FbGVtQ2xpY2sgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoJy5tb2RhbC1jbG9zZS1idXR0b24nKSlcclxuICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcclxufTtcclxuXHJcbk1vZGFsLnByb3RvdHlwZS5zZXRMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmxpc3RlbmVycy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgIHRoaXMuZWxlbS5hZGRFdmVudExpc3RlbmVyKGl0ZW0uZXZlbnROYW1lLCBpdGVtLmNiKTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuTW9kYWwuc2V0QmFja2Ryb3AgPSBmdW5jdGlvbiAoc3RhdHVzKSB7XHJcbiAgICBpZiAoc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUikge1xyXG4gICAgICAgIE1vZGFsLm1pbm9yQmFja2Ryb3AgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja2Ryb3BfbWlub3InKTtcclxuICAgICAgICBpZiAoIU1vZGFsLm1pbm9yQmFja2Ryb3ApXHJcbiAgICAgICAgICAgIE1vZGFsLm1pbm9yQmFja2Ryb3AgPSBNb2RhbC5yZW5kZXJCYWNrZHJvcCgnbWlub3InKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgTW9kYWwubWFqb3JCYWNrZHJvcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrZHJvcF9tYWpvcicpO1xyXG4gICAgICAgIGlmICghTW9kYWwubWFqb3JCYWNrZHJvcClcclxuICAgICAgICAgICAgTW9kYWwubWFqb3JCYWNrZHJvcCA9IE1vZGFsLnJlbmRlckJhY2tkcm9wKCdtYWpvcicpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuTW9kYWwuc2V0V3JhcHBlciA9IGZ1bmN0aW9uIChzdGF0dXMpIHtcclxuICAgIGlmIChzdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKSB7XHJcbiAgICAgICAgTW9kYWwubWlub3JXcmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLXdyYXBwZXItbWlub3InKTtcclxuICAgICAgICBpZiAoIU1vZGFsLm1pbm9yV3JhcHBlcilcclxuICAgICAgICAgICAgTW9kYWwubWlub3JXcmFwcGVyID0gTW9kYWwucmVuZGVyV3JhcHBlcignbWlub3InKTtcclxuICAgICAgICBNb2RhbC5taW5vcldyYXBwZXIub25jbGljayA9IGUgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZS50YXJnZXQgJiYgIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbW9kYWwtd3JhcHBlcl9taW5vcicpKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChNb2RhbC5taW5vckFjdGl2ZSlcclxuICAgICAgICAgICAgICAgIE1vZGFsLm1pbm9yUXVldWVbMF0uZGVhY3RpdmF0ZSgpO1xyXG4gICAgICAgIH07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIE1vZGFsLm1ham9yV3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC13cmFwcGVyLW1ham9yJyk7XHJcbiAgICAgICAgaWYgKCFNb2RhbC5tYWpvcldyYXBwZXIpXHJcbiAgICAgICAgICAgIE1vZGFsLm1ham9yV3JhcHBlciA9IE1vZGFsLnJlbmRlcldyYXBwZXIoJ21ham9yJyk7XHJcbiAgICAgICAgTW9kYWwubWFqb3JXcmFwcGVyLm9uY2xpY2sgPSBlID0+IHtcclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0ICYmICFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ21vZGFsLXdyYXBwZXJfbWFqb3InKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAoTW9kYWwubWFqb3JBY3RpdmUpXHJcbiAgICAgICAgICAgICAgICBNb2RhbC5tYWpvclF1ZXVlWzBdLmRlYWN0aXZhdGUoKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59O1xyXG5cclxuTW9kYWwucmVuZGVyQmFja2Ryb3AgPSBmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgbGV0IGJhY2tkcm9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyk7XHJcbiAgICBiYWNrZHJvcC5jbGFzc05hbWUgPSAnYmFja2Ryb3AgYmFja2Ryb3BfaW52aXNpYmxlJztcclxuICAgIGJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoYGJhY2tkcm9wXyR7dHlwZX1gKTtcclxuICAgIGJhY2tkcm9wLmlkID0gYGJhY2tkcm9wLSR7dHlwZX1gO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChiYWNrZHJvcCk7XHJcbiAgICByZXR1cm4gYmFja2Ryb3A7XHJcbn07XHJcblxyXG5Nb2RhbC5yZW5kZXJXcmFwcGVyID0gZnVuY3Rpb24gKHR5cGUpIHtcclxuICAgIGxldCB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyk7XHJcbiAgICB3cmFwcGVyLmNsYXNzTmFtZSA9ICdtb2RhbC13cmFwcGVyIG1vZGFsLXdyYXBwZXJfaW52aXNpYmxlJztcclxuICAgIHdyYXBwZXIuY2xhc3NMaXN0LmFkZChgbW9kYWwtd3JhcHBlcl8ke3R5cGV9YCk7XHJcbiAgICB3cmFwcGVyLmlkID0gYG1vZGFsLXdyYXBwZXItJHt0eXBlfWA7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHdyYXBwZXIpO1xyXG4gICAgcmV0dXJuIHdyYXBwZXI7XHJcbn07XHJcblxyXG5Nb2RhbC5wcm90b3R5cGUucmVuZGVyV2luZG93ID0gZnVuY3Rpb24gKGh0bWwpIHtcclxuXHJcbiAgICBsZXQgcGFyZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyk7XHJcbiAgICBwYXJlbnQuaW5uZXJIVE1MID0gaHRtbDtcclxuICAgIGxldCB3bmQgPSBwYXJlbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcbiAgICBpZiAodGhpcy5zdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKVxyXG4gICAgICAgIE1vZGFsLm1pbm9yV3JhcHBlci5hcHBlbmRDaGlsZCh3bmQpO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIE1vZGFsLm1ham9yV3JhcHBlci5hcHBlbmRDaGlsZCh3bmQpO1xyXG5cclxuICAgIHBhcmVudC5yZW1vdmUoKTtcclxuICAgIHJldHVybiB3bmQ7XHJcbn07XHJcblxyXG5Nb2RhbC5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpIHtcclxuICAgICAgICBpZiAoIU1vZGFsLm1pbm9yQmFja2Ryb3ApXHJcbiAgICAgICAgICAgIE1vZGFsLnNldEJhY2tkcm9wKE1vZGFsLnN0YXR1c2VzLk1JTk9SKTtcclxuXHJcbiAgICAgICAgaWYgKCFNb2RhbC5taW5vcldyYXBwZXIpXHJcbiAgICAgICAgICAgIE1vZGFsLnNldFdyYXBwZXIoTW9kYWwuc3RhdHVzZXMuTUlOT1IpO1xyXG5cclxuICAgICAgICBNb2RhbC5taW5vcldyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtd3JhcHBlcl9pbnZpc2libGUnKTtcclxuICAgICAgICBNb2RhbC5taW5vckJhY2tkcm9wLmNsYXNzTGlzdC5yZW1vdmUoJ2JhY2tkcm9wX2ludmlzaWJsZScpO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKCFNb2RhbC5tYWpvckJhY2tkcm9wKVxyXG4gICAgICAgICAgICBNb2RhbC5zZXRCYWNrZHJvcChNb2RhbC5zdGF0dXNlcy5NQUpPUik7XHJcblxyXG4gICAgICAgIGlmICghTW9kYWwubWFqb3JXcmFwcGVyKVxyXG4gICAgICAgICAgICBNb2RhbC5zZXRXcmFwcGVyKE1vZGFsLnN0YXR1c2VzLk1BSk9SKTtcclxuXHJcbiAgICAgICAgTW9kYWwubWFqb3JXcmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLXdyYXBwZXJfaW52aXNpYmxlJyk7XHJcbiAgICAgICAgTW9kYWwubWFqb3JCYWNrZHJvcC5jbGFzc0xpc3QucmVtb3ZlKCdiYWNrZHJvcF9pbnZpc2libGUnKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XHJcblxyXG59O1xyXG5cclxuXHJcbk1vZGFsLnByb3RvdHlwZS5hY3RpdmF0ZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgaWYgKHRoaXMuZWxlbUlkID09PSAnc3Bpbm5lcicpIHtcclxuICAgICAgICBsZXQgc3Bpbm5lciA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5vbignc3Bpbm5lcl9ob3N0LWxvYWRlZCcsIGUgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbmV3SG9zdCA9IGUuZGV0YWlsLmhvc3Q7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKVxyXG4gICAgICAgICAgICAgICAgTW9kYWwubWlub3JRdWV1ZS5zcGxpY2UoTW9kYWwubWlub3JRdWV1ZS5pbmRleE9mKHNwaW5uZXIpICsgMSwgMCwgbmV3SG9zdCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIE1vZGFsLm1ham9yUXVldWUuc3BsaWNlKE1vZGFsLm1ham9yUXVldWUuaW5kZXhPZihzcGlubmVyKSArIDEsIDAsIG5ld0hvc3QpO1xyXG5cclxuICAgICAgICAgICAgc3Bpbm5lci5kZWFjdGl2YXRlKGUuZGV0YWlsLm9wdGlvbnMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUikge1xyXG4gICAgICAgICAgICBNb2RhbC5taW5vclF1ZXVlLnB1c2godGhpcyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKE1vZGFsLm1pbm9yUXVldWUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhNb2RhbC5tYWpvclF1ZXVlKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghTW9kYWwubWlub3JBY3RpdmUpXHJcbiAgICAgICAgICAgICAgICBNb2RhbC5taW5vclNob3cob3B0aW9ucykudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIE1vZGFsLm1ham9yUXVldWUucHVzaCh0aGlzKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coTW9kYWwubWlub3JRdWV1ZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKE1vZGFsLm1ham9yUXVldWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFNb2RhbC5tYWpvckFjdGl2ZSlcclxuXHJcbiAgICAgICAgICAgICAgICBNb2RhbC5tYWpvclNob3cob3B0aW9ucykudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufTtcclxuXHJcbk1vZGFsLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUikge1xyXG4gICAgICAgIC8vVE9ETyBub3QgbmVjY2Vzc2FyeSBpZiBxdWV1ZSBpcyBub3QgZW1wdHlcclxuICAgICAgICBNb2RhbC5taW5vcldyYXBwZXIuY2xhc3NMaXN0LmFkZCgnbW9kYWwtd3JhcHBlcl9pbnZpc2libGUnKTtcclxuICAgICAgICBNb2RhbC5taW5vckJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoJ2JhY2tkcm9wX2ludmlzaWJsZScpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgTW9kYWwubWFqb3JXcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ21vZGFsLXdyYXBwZXJfaW52aXNpYmxlJyk7XHJcbiAgICAgICAgTW9kYWwubWFqb3JCYWNrZHJvcC5jbGFzc0xpc3QuYWRkKCdiYWNrZHJvcF9pbnZpc2libGUnKTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5Nb2RhbC5wcm90b3R5cGUuZGVhY3RpdmF0ZSA9IGZ1bmN0aW9uIChuZXh0V2luZG93T3B0aW9ucywgaGlkZU9wdGlvbnMpIHtcclxuXHJcbiAgICB0aGlzLmhpZGUoaGlkZU9wdGlvbnMpO1xyXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpIHtcclxuICAgICAgICBNb2RhbC5taW5vckFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIE1vZGFsLm1pbm9yUXVldWUuc2hpZnQoKTtcclxuICAgICAgICBNb2RhbC5taW5vclNob3cobmV4dFdpbmRvd09wdGlvbnMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBNb2RhbC5tYWpvckFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIE1vZGFsLm1ham9yUXVldWUuc2hpZnQoKTtcclxuICAgICAgICBNb2RhbC5tYWpvclNob3cobmV4dFdpbmRvd09wdGlvbnMpO1xyXG4gICAgfVxyXG4gICAgdGhpcy50cmlnZ2VyKCdtb2RhbC13aW5kb3dfZGVhY3RpdmF0ZWQnKTtcclxufTtcclxuXHJcbk1vZGFsLm1pbm9yQWN0aXZlID0gZmFsc2U7XHJcbk1vZGFsLm1ham9yQWN0aXZlID0gZmFsc2U7XHJcbk1vZGFsLm1pbm9yUXVldWUgPSBbXTtcclxuTW9kYWwubWFqb3JRdWV1ZSA9IFtdO1xyXG5cclxuTW9kYWwuc3Bpbm5lciA9IG5ldyBTcGlubmVyKCk7XHJcbk1vZGFsLnNwaW5uZXIuc3RhdHVzID0gTW9kYWwuc3RhdHVzZXMuTUFKT1I7XHJcblxyXG5Nb2RhbC5zaG93U3Bpbm5lciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIE1vZGFsLnByb3RvdHlwZS5zaG93LmNhbGwoTW9kYWwuc3Bpbm5lcik7XHJcblxyXG4gICAgaWYgKCFNb2RhbC5zcGlubmVyLmVsZW0pXHJcbiAgICAgICAgTW9kYWwuc3Bpbm5lci5lbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwaW5uZXInKTtcclxuICAgIGlmICghTW9kYWwuc3Bpbm5lci5lbGVtKVxyXG4gICAgICAgIE1vZGFsLnNwaW5uZXIuZWxlbSA9IE1vZGFsLnByb3RvdHlwZS5yZW5kZXJXaW5kb3cuY2FsbChNb2RhbC5zcGlubmVyLCBTcGlubmVyLmh0bWwpO1xyXG5cclxuICAgIE1vZGFsLnNwaW5uZXIuc2hvdygpO1xyXG59O1xyXG5cclxuTW9kYWwuaGlkZVNwaW5uZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBNb2RhbC5zcGlubmVyLmhpZGUoKTtcclxufTtcclxuXHJcblxyXG5Nb2RhbC5taW5vclNob3cgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgbGV0IG5leHRNb2RhbFdpbmRvdyA9IE1vZGFsLm1pbm9yUXVldWVbMF07XHJcbiAgICBpZiAobmV4dE1vZGFsV2luZG93KSB7XHJcbiAgICAgICAgbGV0IHByb21pc2UgPSBuZXh0TW9kYWxXaW5kb3cuc2hvdyhvcHRpb25zKTtcclxuICAgICAgICBpZiAocHJvbWlzZSlcclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2UudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBNb2RhbC5taW5vckFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBNb2RhbC5taW5vckFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICBNb2RhbC5taW5vckFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH1cclxufTtcclxuXHJcbk1vZGFsLm1ham9yU2hvdyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgbGV0IG5leHRNb2RhbFdpbmRvdyA9IE1vZGFsLm1ham9yUXVldWVbMF07XHJcblxyXG4gICAgaWYgKG5leHRNb2RhbFdpbmRvdykge1xyXG5cclxuICAgICAgICBNb2RhbC5zaG93U3Bpbm5lcigpO1xyXG4gICAgICAgIGxldCBwcm9taXNlID0gbmV4dE1vZGFsV2luZG93LnNob3cob3B0aW9ucyk7XHJcblxyXG4gICAgICAgIGlmIChwcm9taXNlKVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIE1vZGFsLm1ham9yQWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIE1vZGFsLmhpZGVTcGlubmVyKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBNb2RhbC5tYWpvckFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIE1vZGFsLmhpZGVTcGlubmVyKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBNb2RhbC5tYWpvckFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH1cclxufTtcclxuXHJcbmZvciAobGV0IGtleSBpbiBldmVudE1peGluKVxyXG4gICAgTW9kYWwucHJvdG90eXBlW2tleV0gPSBldmVudE1peGluW2tleV07XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNb2RhbDtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9tb2RhbC9pbmRleC5qcyIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuXHRvbjogZnVuY3Rpb24oZXZlbnROYW1lLCBjYikge1xyXG5cdFx0aWYgKHRoaXMuZWxlbSlcclxuXHRcdFx0dGhpcy5lbGVtLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYik7XHJcblx0XHRlbHNlXHJcblx0XHRcdHRoaXMubGlzdGVuZXJzLnB1c2goe1xyXG5cdFx0XHRcdGV2ZW50TmFtZSxcclxuXHRcdFx0XHRjYlxyXG5cdFx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHR0cmlnZ2VyOiBmdW5jdGlvbihldmVudE5hbWUsIGRldGFpbCkge1xyXG5cdFx0dGhpcy5lbGVtLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwge1xyXG5cdFx0XHRidWJibGVzOiB0cnVlLFxyXG5cdFx0XHRjYW5jZWxhYmxlOiB0cnVlLFxyXG5cdFx0XHRkZXRhaWw6IGRldGFpbFxyXG5cdFx0fSkpO1xyXG5cdH0sXHJcblxyXG5cdGVycm9yOiBmdW5jdGlvbihlcnIpIHtcclxuXHRcdHRoaXMuZWxlbS5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnZXJyb3InLCB7XHJcblx0XHRcdGJ1YmJsZXM6IHRydWUsXHJcblx0XHRcdGNhbmNlbGFibGU6IHRydWUsXHJcblx0XHRcdGRldGFpbDogZXJyXHJcblx0XHR9KSk7XHJcblx0fVxyXG5cclxuXHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9ldmVudE1peGluLmpzIiwibGV0IFNwaW5uZXIgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgdGhpcy5lbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwaW5uZXInKTtcclxufTtcclxuXHJcblNwaW5uZXIuaHRtbCA9IHJlcXVpcmUoYGh0bWwtbG9hZGVyIS4vbWFya3VwYCk7XHJcblxyXG5TcGlubmVyLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3NwaW5uZXJfaW52aXNpYmxlJyk7XHJcbn07XHJcblxyXG5TcGlubmVyLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ3NwaW5uZXJfaW52aXNpYmxlJyk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNwaW5uZXI7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9zcGlubmVyL2luZGV4LmpzIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxkaXYgaWQ9XFxcInNwaW5uZXJcXFwiIGNsYXNzPVxcXCJzcGlubmVyXFxcIj5cXHJcXG5cXHJcXG48L2Rpdj5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svfi9odG1sLWxvYWRlciEuLi9ibG9ja3Mvc3Bpbm5lci9tYXJrdXBcbi8vIG1vZHVsZSBpZCA9IDI3XG4vLyBtb2R1bGUgY2h1bmtzID0gMSAyIDkgMTAgMTEiLCJsZXQgU2VydmVyRXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuU2VydmVyRXJyb3I7XHJcbmxldCBDbGllbnRFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5DbGllbnRFcnJvcjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJvZHlPYmosIG1ldGhvZCwgdXJsLCBjYikge1xyXG5cclxuXHJcbiAgICBsZXQgYm9keSA9ICcnO1xyXG4gICAgaWYgKCEodHlwZW9mIGJvZHlPYmogPT09ICdzdHJpbmcnKSkge1xyXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBib2R5T2JqKSB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICBpZiAoYm9keU9ialtrZXldKVxyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBrZXkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoKHR5cGVvZiBib2R5T2JqW2tleV0gPT09ICdvYmplY3QnKSA/IEpTT04uc3RyaW5naWZ5KGJvZHlPYmpba2V5XSkgOiBib2R5T2JqW2tleV0pO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAgICAgICAgICBib2R5ICs9IChib2R5ID09PSAnJyA/ICcnIDogJyYnKSArIHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZVxyXG4gICAgICAgIGJvZHkgPSBib2R5T2JqO1xyXG5cclxuXHJcbiAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICB4aHIub3BlbihtZXRob2QsIHVybCwgdHJ1ZSk7XHJcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xyXG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJYLVJlcXVlc3RlZC1XaXRoXCIsIFwiWE1MSHR0cFJlcXVlc3RcIik7XHJcblxyXG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlICE9IDQpIHJldHVybjtcclxuXHJcbiAgICAgICAgbGV0IHJlc3BvbnNlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5yZXNwb25zZVRleHQpXHJcbiAgICAgICAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNiKG5ldyBTZXJ2ZXJFcnJvcignU2VydmVyIGlzIG5vdCByZXNwb25kaW5nJykpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwKVxyXG4gICAgICAgICAgICBjYihudWxsLCByZXNwb25zZSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSA0MDAgJiYgdGhpcy5zdGF0dXMgPCA1MDApXHJcbiAgICAgICAgICAgIGNiKG5ldyBDbGllbnRFcnJvcihyZXNwb25zZS5tZXNzYWdlLCByZXNwb25zZS5kZXRhaWwsIHRoaXMuc3RhdHVzKSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSA1MDApXHJcbiAgICAgICAgICAgIGNiKG5ldyBTZXJ2ZXJFcnJvcihyZXNwb25zZS5tZXNzYWdlLCB0aGlzLnN0YXR1cykpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhgc2VuZGluZyBuZXh0IHJlcXVlc3Q6ICR7Ym9keX1gKTtcclxuICAgIHhoci5zZW5kKGJvZHkpO1xyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvc2VuZFJlcXVlc3QuanMiLCJsZXQgZXZlbnRNaXhpbiA9IHJlcXVpcmUoTElCUyArICdldmVudE1peGluJyk7XHJcbmxldCBDbGllbnRFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5DbGllbnRFcnJvcjtcclxubGV0IEltYWdlTm90Rm91bmQgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuSW1hZ2VOb3RGb3VuZDtcclxubGV0IE1vZGFsID0gcmVxdWlyZShCTE9DS1MgKyAnbW9kYWwnKTtcclxubGV0IFN3aXRjaEJ1dHRvbiA9IHJlcXVpcmUoQkxPQ0tTICsgJ3N3aXRjaC1idXR0b24nKTtcclxubGV0IGdldENvcnJlY3ROb3VuRm9ybSA9IHJlcXVpcmUoTElCUyArICdnZXRDb3JyZWN0Tm91bkZvcm0nKTtcclxuXHJcbmxldCBHYWxsZXJ5ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIE1vZGFsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICB0aGlzLnN0YXR1cyA9IE1vZGFsLnN0YXR1c2VzLk1BSk9SO1xyXG5cclxuICAgIHRoaXMuZ2FsbGVyeSA9IG9wdGlvbnMuZ2FsbGVyeTtcclxuICAgIHRoaXMuZWxlbSA9IG9wdGlvbnMuZWxlbTtcclxuICAgIHRoaXMuaXNMb2dnZWQgPSBvcHRpb25zLmlzTG9nZ2VkO1xyXG4gICAgdGhpcy5wcmVsb2FkRW50aXR5Q291bnQgPSBvcHRpb25zLnByZWxvYWRFbnRpdHlDb3VudDtcclxuICAgIHRoaXMuaXNGZWVkID0gb3B0aW9ucy5pc0ZlZWQgfHwgZmFsc2U7XHJcbiAgICB0aGlzLnVzZXJTdWJzY3JpYmVCdXR0b24gPSBvcHRpb25zLnVzZXJTdWJzY3JpYmVCdXR0b247XHJcblxyXG4gICAgdGhpcy52aWV3TW9kZWxzID0ge307XHJcbiAgICB0aGlzLmdhbGxlcnlBcnJheSA9IG51bGw7XHJcbiAgICB0aGlzLmN1cnJlbnRJbWFnZUlkID0gbnVsbDtcclxuXHJcbiAgICB0aGlzLmxvZ2dlZFVzZXJWaWV3TW9kZWwgPSBudWxsO1xyXG4gICAgdGhpcy5pc0VtYmVkZGVkID0gISF0aGlzLmdhbGxlcnk7XHJcbiAgICB0aGlzLnByZWxvYWRlZEltYWdlcyA9IHt9O1xyXG5cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnY3VycmVudFZpZXdNb2RlbCcsIHtcclxuICAgICAgICBnZXQ6ICgpID0+IHRoaXMudmlld01vZGVsc1t0aGlzLmN1cnJlbnRJbWFnZUlkXVxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IHRoaXMucHJlbG9hZEVudGl0eUNvdW50OyBpKyspIHtcclxuICAgICAgICB0aGlzLnByZWxvYWRlZEltYWdlc1tpXSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgIHRoaXMucHJlbG9hZGVkSW1hZ2VzWy1pXSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGUgPT4ge1xyXG4gICAgICAgIHRoaXMub25Qb3BTdGF0ZShlLnN0YXRlKTtcclxuICAgIH0sIGZhbHNlKTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZSA9PiB7XHJcbiAgICAgICAgdGhpcy5vblJlc2l6ZSgpO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIHRoaXMucHVzaEdhbGxlcnlTdGF0ZSgpO1xyXG5cclxuICAgIGlmICh0aGlzLmlzRW1iZWRkZWQpXHJcbiAgICAgICAgdGhpcy5zZXRHYWxsZXJ5KG9wdGlvbnMpO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHRoaXMuc2hvdygrdGhpcy5lbGVtLmRhdGFzZXQuaWQpLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xyXG4gICAgICAgIH0pO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKE1vZGFsLnByb3RvdHlwZSk7XHJcbkdhbGxlcnkucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2FsbGVyeTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLm9uUmVzaXplID0gZnVuY3Rpb24oKSB7XHJcbiAgICAvLyBjb25zdCBHTE9CQUxfU01BTExfU0NSRUVOX1dJRFRIID0gNzAwO1xyXG4gICAgLy8gaWYgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCA8PSBHTE9CQUxfU01BTExfU0NSRUVOX1dJRFRIKVxyXG4gICAgLy8gICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdpbWFnZV9zbWFsbCcpO1xyXG4gICAgLy8gZWxzZVxyXG4gICAgLy8gICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdpbWFnZV9zbWFsbCcpO1xyXG4gICAgLy9cclxuICAgIC8vIHRoaXMucmVzaXplSW1hZ2UoKTtcclxuICAgIHRoaXMuY29tbWVudFNlY3Rpb24gJiYgdGhpcy5jb21tZW50U2VjdGlvbi51cGRhdGUoKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLm9uR2FsbGVyeUNsaWNrID0gZnVuY3Rpb24gKGUpIHtcclxuICAgIGxldCB0YXJnZXQ7XHJcbiAgICBpZiAoISh0YXJnZXQgPSBlLnRhcmdldC5jbG9zZXN0KCcuaW1hZ2UtcHJldmlldycpKSkgcmV0dXJuO1xyXG5cclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGxldCBpbWFnZUlkID0gK3RhcmdldC5kYXRhc2V0LmlkO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmFjdGl2YXRlKHtpbWFnZUlkfSk7XHJcbn07XHJcblxyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuc2V0R2FsbGVyeSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLnB1YmxpY2F0aW9uc1N0YXRFbGVtID0gb3B0aW9ucy5wdWJsaWNhdGlvbnNTdGF0RWxlbTtcclxuICAgIHRoaXMuaW1hZ2VQcmV2aWV3R2hvc3QgPSB0aGlzLmdhbGxlcnkucXVlcnlTZWxlY3RvcignLmltYWdlLXByZXZpZXcnKTtcclxuICAgIHRoaXMuZ2FsbGVyeVdyYXBwZXIgPSB0aGlzLmdhbGxlcnkucXVlcnlTZWxlY3RvcignLmdhbGxlcnlfX3dyYXBwZXInKTtcclxuXHJcbiAgICB0aGlzLmdhbGxlcnkub25jbGljayA9IGUgPT4ge1xyXG4gICAgICAgIHRoaXMub25HYWxsZXJ5Q2xpY2soZSk7XHJcbiAgICB9O1xyXG59O1xyXG5cclxuLy9UT0RPIEFMRVJUIElGIElUIERPRVNOJ1QgQUJMRSBUTyBET1dOTE9BRCBNT0RBTCBNRVNTQUdFIFdJTkRPV1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuc2V0RWxlbSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgICAgICB0aGlzLmlzRWxlbVNldHRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5lbGVtKVxyXG4gICAgICAgICAgICB0aGlzLmVsZW0gPSB0aGlzLnJlbmRlcldpbmRvdyhyZXF1aXJlKGBodG1sLWxvYWRlciEuL3dpbmRvd2ApKTtcclxuXHJcbiAgICAgICAgdGhpcy5pbWdFbGVtID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJ2ltZy5pbWFnZV9faW1nLWVsZW1lbnQnKTtcclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fZGVzY3JpcHRpb24nKTtcclxuICAgICAgICB0aGlzLmRhdGUgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX19wb3N0LWRhdGUnKTtcclxuICAgICAgICB0aGlzLmltYWdlV3JhcHBlciA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2ltYWdlLXdyYXBwZXInKTtcclxuICAgICAgICB0aGlzLnNpZGVCYXIgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX19zaWRlYmFyJyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVCdXR0b25FbGVtID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fZGVsZXRlLWJ1dHRvbicpO1xyXG4gICAgICAgIHRoaXMuc3Vic2NyaWJlQnV0dG9uRWxlbSA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX3N1YnNjcmliZS1idXR0b24nKTtcclxuICAgICAgICB0aGlzLmF2YXRhciA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2F2YXRhcicpO1xyXG4gICAgICAgIHRoaXMudXNlcm5hbWUgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX191c2VybmFtZScpO1xyXG4gICAgICAgIHRoaXMuaGVhZGVyTGVmdFNpZGUgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX19oZWFkZXItbGVmdC1zaWRlJyk7XHJcbiAgICAgICAgdGhpcy5mdWxsc2NyZWVuQnV0dG9uID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fY29udHJvbC1mdWxsJyk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLmltZ0VsZW0ub25sb2FkID0gZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzaXplSW1hZ2UoKTtcclxuICAgICAgICAgICAgdGhpcy5zaG93SW1nRWxlbSgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbS5vbmNsaWNrID0gZSA9PiB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9uRWxlbUNsaWNrKGUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoJy5pbWFnZV9fbW9kYWwtY2xvc2UtYnV0dG9uLXdyYXBwZXInKSlcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoJy5pbWFnZV9fY29udHJvbC1wcmV2JykpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN3aXRjaFRvUHJldigpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoJy5pbWFnZV9fY29udHJvbC1uZXh0JykpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN3aXRjaFRvTmV4dCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0ID09PSB0aGlzLmZ1bGxzY3JlZW5CdXR0b24pXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN3aXRjaEZ1bGxzY3JlZW4oKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldC5tYXRjaGVzKCcuaW1hZ2VfX2Nsb3NlLXNwYWNlJykgfHwgZS50YXJnZXQubWF0Y2hlcygnLmltYWdlX19jbG9zZS1idXR0b24nKSlcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICBsZXQgQ29tbWVudFNlY3Rpb24gPSByZXF1aXJlKEJMT0NLUyArICdpbWFnZS1jb21tZW50LXNlY3Rpb24nKTtcclxuICAgICAgICBsZXQgTGlrZUJ1dHRvbiA9IHJlcXVpcmUoQkxPQ0tTICsgJ2xpa2UtYnV0dG9uJyk7XHJcblxyXG4gICAgICAgIHRoaXMuY29tbWVudFNlY3Rpb24gPSBuZXcgQ29tbWVudFNlY3Rpb24oe1xyXG4gICAgICAgICAgICBlbGVtOiB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmNvbW1lbnQtc2VjdGlvbicpLFxyXG4gICAgICAgICAgICBjb21tZW50U2VuZGVyRWxlbTogdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50LXNlbmQnKSxcclxuICAgICAgICAgICAgaW1hZ2VJZDogdGhpcy5jdXJyZW50SW1hZ2VJZCxcclxuICAgICAgICAgICAgbG9nZ2VkVXNlclZpZXdNb2RlbDogdGhpcy5sb2dnZWRVc2VyVmlld01vZGVsLFxyXG5cclxuICAgICAgICAgICAgY29tbWVudFNlY3Rpb25XcmFwcGVyOiB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX19jb21tZW50LXNlY3Rpb24td3JhcHBlcicpLFxyXG4gICAgICAgICAgICBpbmZvQm9hcmQ6IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2luZm8tYm9hcmQnKSxcclxuICAgICAgICAgICAgc2Nyb2xsYmFyV3JhcHBlcjogdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fY29tbWVudC1zZWN0aW9uLXNjcm9sbGJhci13cmFwcGVyJylcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb21tZW50U2VjdGlvbi5vbignY29tbWVudC1zZWN0aW9uX2NoYW5nZWQnLCBlID0+IHtcclxuICAgICAgICAgICAgbGV0IGltYWdlSWQgPSBlLmRldGFpbC5pbWFnZUlkO1xyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZVZpZXdNb2RlbChpbWFnZUlkKTtcclxuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0Vmlld01vZGVsKGltYWdlSWQpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDb21tZW50cyhpbWFnZUlkKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMubGlrZUJ1dHRvbiA9IG5ldyBMaWtlQnV0dG9uKHtcclxuICAgICAgICAgICAgZWxlbTogdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5saWtlLWJ1dHRvbicpLFxyXG4gICAgICAgICAgICBkYXRhOiB0aGlzLmN1cnJlbnRJbWFnZUlkXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMubGlrZUJ1dHRvbi5vbignc3dpdGNoLWJ1dHRvbl9jaGFuZ2VkJywgZSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpbWFnZUlkID0gZS5kZXRhaWwuaW1hZ2VJZDtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGVWaWV3TW9kZWwoaW1hZ2VJZCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdFZpZXdNb2RlbChpbWFnZUlkKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlTGlrZXMoaW1hZ2VJZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLm9uUmVzaXplKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzTG9nZ2VkKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRWaWV3TW9kZWwuaXNPd25JbWFnZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXREZWxldGVCdXR0b24oKTtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmUuZW5zdXJlKFtCTE9DS1MgKyAnZGVsZXRlLWltYWdlLWJ1dHRvbiddLCByZXF1aXJlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgRGVsZXRlSW1hZ2VCdXR0b24gPSByZXF1aXJlKEJMT0NLUyArICdkZWxldGUtaW1hZ2UtYnV0dG9uJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxldGVCdXR0b24gPSBuZXcgRGVsZXRlSW1hZ2VCdXR0b24oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtOiB0aGlzLmRlbGV0ZUJ1dHRvbkVsZW0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlSWQ6IHRoaXMuY3VycmVudEltYWdlSWRcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZUJ1dHRvbi5vbignZGVsZXRlLWltYWdlLWJ1dHRvbl9pbWFnZS1kZWxldGVkJywgZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbnZvbHZlZEltYWdlSWQgPSBlLmRldGFpbC5pbWFnZUlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZVZpZXdNb2RlbChpbnZvbHZlZEltYWdlSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUZyb21HYWxsZXJ5QXJyYXkoaW52b2x2ZWRJbWFnZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxldGVJbWFnZVByZXZpZXcoaW52b2x2ZWRJbWFnZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudEltYWdlSWQgPT09IGludm9sdmVkSW1hZ2VJZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3dpdGNoVG9OZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlLmVuc3VyZShbQkxPQ0tTICsgJ3N1YnNjcmliZS1idXR0b24nXSwgcmVxdWlyZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IFN1YnNjcmliZUJ1dHRvbiA9IHJlcXVpcmUoQkxPQ0tTICsgJ3N1YnNjcmliZS1idXR0b24nKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN1YnNjcmliZUJ1dHRvbiA9IG5ldyBTdWJzY3JpYmVCdXR0b24oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtOiB0aGlzLnN1YnNjcmliZUJ1dHRvbkVsZW0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRoaXMuY3VycmVudEltYWdlSWRcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudXNlclN1YnNjcmliZUJ1dHRvbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgU3dpdGNoQnV0dG9uLnNldFJlbGF0aW9uKHRoaXMuc3Vic2NyaWJlQnV0dG9uLCB0aGlzLnVzZXJTdWJzY3JpYmVCdXR0b24pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN1YnNjcmliZUJ1dHRvbi5vbignc3dpdGNoLWJ1dHRvbl9jaGFuZ2VkJywgZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbnZvbHZlZEltYWdlSWQgPSBlLmRldGFpbC5pbWFnZUlkO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNGZWVkICYmIGludm9sdmVkSW1hZ2VJZCA9PT0gdGhpcy5jdXJyZW50SW1hZ2VJZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmlld01vZGVscyA9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdWJzY3JpYmVCdXR0b24oKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN1YnNjcmliZUJ1dHRvbi5zZXQoe2FjdGl2ZTogdGhpcy5jdXJyZW50Vmlld01vZGVsLmF1dGhvci5pc05hcnJhdG9yfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVCdXR0b25FbGVtLm9uY2xpY2sgPSBlID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IobmV3IENsaWVudEVycm9yKG51bGwsIG51bGwsIDQwMSkpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuXHJcbn07XHJcblxyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuc3dpdGNoRnVsbHNjcmVlbiA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBmdW5jdGlvbiBnb0Z1bGxzY3JlZW4oZWxlbWVudCkge1xyXG4gICAgICAgIGlmIChlbGVtZW50LnJlcXVlc3RGdWxsc2NyZWVuKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQucmVxdWVzdEZ1bGxzY3JlZW4oKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4pIHtcclxuICAgICAgICAgICAgZWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbigpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbikge1xyXG4gICAgICAgICAgICBlbGVtZW50Lm1velJlcXVlc3RGdWxsU2NyZWVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNhbmNlbEZ1bGxzY3JlZW4oKSB7XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmV4aXRGdWxsc2NyZWVuKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmV4aXRGdWxsc2NyZWVuKCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkb2N1bWVudC53ZWJraXRDYW5jZWxGdWxsU2NyZWVuKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LndlYmtpdENhbmNlbEZ1bGxTY3JlZW4oKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4pIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgaWYgKCF0aGlzLmlzRnVsbHNjcmVlbikge1xyXG4gICAgICAgIGdvRnVsbHNjcmVlbih0aGlzLmltYWdlV3JhcHBlcik7XHJcbiAgICAgICAgdGhpcy5pc0Z1bGxzY3JlZW4gPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdpY29uLWFycm93LW1heGltaXNlJyk7XHJcbiAgICAgICAgdGhpcy5mdWxsc2NyZWVuQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2ljb24tYXJyb3ctbWluaW1pc2UnKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbmNlbEZ1bGxzY3JlZW4oKTtcclxuICAgICAgICB0aGlzLmlzRnVsbHNjcmVlbiA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdpY29uLWFycm93LW1heGltaXNlJyk7XHJcbiAgICAgICAgdGhpcy5mdWxsc2NyZWVuQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2ljb24tYXJyb3ctbWluaW1pc2UnKTtcclxuICAgIH1cclxuXHJcbn07XHJcblxyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuc2V0RGVsZXRlQnV0dG9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5kZWxldGVCdXR0b25FbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2J1dHRvbl9pbnZpc2libGUnKTtcclxuICAgIHRoaXMuc3Vic2NyaWJlQnV0dG9uRWxlbS5jbGFzc0xpc3QuYWRkKCdidXR0b25faW52aXNpYmxlJyk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5zZXRTdWJzY3JpYmVCdXR0b24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLnN1YnNjcmliZUJ1dHRvbkVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnYnV0dG9uX2ludmlzaWJsZScpO1xyXG4gICAgdGhpcy5kZWxldGVCdXR0b25FbGVtLmNsYXNzTGlzdC5hZGQoJ2J1dHRvbl9pbnZpc2libGUnKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnVwZGF0ZVByZWxvYWRlZEltYWdlc0FycmF5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gdGhpcy5wcmVsb2FkRW50aXR5Q291bnQ7IGkrKykge1xyXG4gICAgICAgIGxldCBuZXh0SWQgPSB0aGlzLmdldE5leHRJbWFnZUlkKGkpO1xyXG4gICAgICAgIGxldCBwcmV2SWQgPSB0aGlzLmdldE5leHRJbWFnZUlkKC1pKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudmlld01vZGVsc1tuZXh0SWRdKVxyXG4gICAgICAgICAgICB0aGlzLnByZWxvYWRlZEltYWdlc1tpXS5zZXRBdHRyaWJ1dGUoJ3NyYycsIHRoaXMudmlld01vZGVsc1tuZXh0SWRdLmltZ1VybCk7XHJcbiAgICAgICAgaWYgKHRoaXMudmlld01vZGVsc1twcmV2SWRdKVxyXG4gICAgICAgICAgICB0aGlzLnByZWxvYWRlZEltYWdlc1staV0uc2V0QXR0cmlidXRlKCdzcmMnLCB0aGlzLnZpZXdNb2RlbHNbcHJldklkXS5pbWdVcmwpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJzsgLy8gOlxcXHJcblxyXG5cclxuXHJcbiAgICBsZXQgaW1hZ2VJZDtcclxuICAgIGxldCBub1B1c2hTdGF0ZTtcclxuXHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgIGltYWdlSWQgPSBhcmd1bWVudHNbMF07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGltYWdlSWQgPSBvcHRpb25zICYmIG9wdGlvbnMuaW1hZ2VJZDtcclxuICAgICAgICBub1B1c2hTdGF0ZSA9IG9wdGlvbnMgJiYgb3B0aW9ucy5ub1B1c2hTdGF0ZSB8fCBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc0VtYmVkZGVkKVxyXG4gICAgICAgICAgICBNb2RhbC5wcm90b3R5cGUuc2hvdy5hcHBseSh0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXF1ZXN0Vmlld01vZGVsKGltYWdlSWQpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRJbWFnZUlkID0gaW1hZ2VJZDtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc0VsZW1TZXR0ZWQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEVsZW0oKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUN1cnJlbnRWaWV3KGltYWdlSWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnaW1hZ2VfaW52aXNpYmxlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFub1B1c2hTdGF0ZSAmJiBpbWFnZUlkID09PSB0aGlzLmN1cnJlbnRJbWFnZUlkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2hJbWFnZVN0YXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdEFsbE5lY2Vzc2FyeVZpZXdNb2RlbHMoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQcmVsb2FkZWRJbWFnZXNBcnJheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDdXJyZW50VmlldyhpbWFnZUlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnaW1hZ2VfaW52aXNpYmxlJyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW5vUHVzaFN0YXRlICYmIGltYWdlSWQgPT09IHRoaXMuY3VycmVudEltYWdlSWQpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoSW1hZ2VTdGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0QWxsTmVjZXNzYXJ5Vmlld01vZGVscygpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUHJlbG9hZGVkSW1hZ2VzQXJyYXkoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9uUmVzaXplKCk7XHJcbiAgICAgICAgfSkuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nO1xyXG5cclxuXHJcbiAgICBsZXQgbm9QdXNoU3RhdGUgPSBvcHRpb25zICYmIG9wdGlvbnMubm9QdXNoU3RhdGU7XHJcbiAgICBpZiAoIXRoaXMuaXNFbWJlZGRlZClcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24gPSB0aGlzLmVsZW0uZGF0YXNldC5hdXRob3JVcmw7XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBNb2RhbC5wcm90b3R5cGUuaGlkZS5hcHBseSh0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ2ltYWdlX2ludmlzaWJsZScpO1xyXG5cclxuICAgICAgICBpZiAoIW5vUHVzaFN0YXRlKVxyXG4gICAgICAgICAgICB0aGlzLnB1c2hHYWxsZXJ5U3RhdGUoKTtcclxuICAgIH1cclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLmhpZGVJbWdFbGVtID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ2ltYWdlX2ltZy1lbGVtZW50LWludmlzaWJsZScpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuc2hvd0ltZ0VsZW0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnaW1hZ2VfaW1nLWVsZW1lbnQtaW52aXNpYmxlJyk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5yZXNpemVJbWFnZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIGlmICh0aGlzLmVsZW0pIHtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgdGhpcy5pbWdFbGVtLnJlbW92ZUF0dHJpYnV0ZSgnd2lkdGgnKTtcclxuICAgIC8vICAgICB0aGlzLmltZ0VsZW0ucmVtb3ZlQXR0cmlidXRlKCdoZWlnaHQnKTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgaWYgKCF0aGlzLmVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdpbWFnZV9zbWFsbCcpKSB7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICBpZiAodGhpcy5pbWdFbGVtLm9mZnNldFdpZHRoID49IHRoaXMuaW1nRWxlbS5vZmZzZXRIZWlnaHQpIHtcclxuICAgIC8vICAgICAgICAgICAgIGlmICh0aGlzLmltYWdlV3JhcHBlci5vZmZzZXRIZWlnaHQgPCB0aGlzLmltZ0VsZW0ub2Zmc2V0SGVpZ2h0KVxyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuaW1nRWxlbS5oZWlnaHQgPSB0aGlzLmltYWdlV3JhcHBlci5vZmZzZXRIZWlnaHQ7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICAgICAgaWYgKHRoaXMuaW1hZ2VXcmFwcGVyLm9mZnNldFdpZHRoID4gdGhpcy5lbGVtLm9mZnNldFdpZHRoKSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5pbWdFbGVtLnJlbW92ZUF0dHJpYnV0ZSgnaGVpZ2h0Jyk7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5pbWdFbGVtLndpZHRoID0gdGhpcy5lbGVtLm9mZnNldFdpZHRoIC0gdGhpcy5zaWRlQmFyLm9mZnNldFdpZHRoO1xyXG4gICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAgICAgaWYgKHRoaXMuaW1hZ2VXcmFwcGVyLm9mZnNldFdpZHRoID4gdGhpcy5lbGVtLm9mZnNldFdpZHRoKVxyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuaW1nRWxlbS53aWR0aCA9IHRoaXMuZWxlbS5vZmZzZXRXaWR0aCAtIHRoaXMuc2lkZUJhci5vZmZzZXRXaWR0aDtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgICAgICBpZiAodGhpcy5pbWFnZVdyYXBwZXIub2Zmc2V0SGVpZ2h0IDwgdGhpcy5pbWdFbGVtLm9mZnNldEhlaWdodCkge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuaW1nRWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ3dpZHRoJyk7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5pbWdFbGVtLmhlaWdodCA9IHRoaXMuaW1hZ2VXcmFwcGVyLm9mZnNldEhlaWdodDtcclxuICAgIC8vICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgICAgIGlmICh0aGlzLmltYWdlV3JhcHBlci5vZmZzZXRXaWR0aCA+IHRoaXMuZWxlbS5vZmZzZXRXaWR0aCkge1xyXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5pbWdFbGVtLnJlbW92ZUF0dHJpYnV0ZSgnaGVpZ2h0Jyk7XHJcbiAgICAvLyAgICAgICAgICAgICB0aGlzLmltZ0VsZW0ud2lkdGggPSB0aGlzLmVsZW0ub2Zmc2V0V2lkdGg7XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9XHJcbiAgICAvL1xyXG4gICAgLy9cclxuICAgIC8vIH1cclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnJlcXVlc3RWaWV3TW9kZWwgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnZpZXdNb2RlbHNbaWRdKSB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGJvZHkgPSB7XHJcbiAgICAgICAgICAgIGlkLFxyXG4gICAgICAgICAgICBpc0ZlZWQ6IHRoaXMuaXNGZWVkXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNMb2dnZWQgJiYgIXRoaXMubG9nZ2VkVXNlclZpZXdNb2RlbClcclxuICAgICAgICAgICAgYm9keS5yZXF1aXJlVXNlclZpZXdNb2RlbCA9IHRydWU7XHJcblxyXG4gICAgICAgIHJlcXVpcmUoTElCUyArICdzZW5kUmVxdWVzdCcpKGJvZHksICdQT1NUJywgJy9nYWxsZXJ5JywgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIENsaWVudEVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2FsbGVyeUFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlRnJvbUdhbGxlcnlBcnJheShpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlR2FsbGVyeSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KG5ldyBJbWFnZU5vdEZvdW5kKCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgdGhpcy5nYWxsZXJ5QXJyYXkgPSByZXNwb25zZS5nYWxsZXJ5O1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdhbGxlcnkoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTG9nZ2VkICYmICF0aGlzLmxvZ2dlZFVzZXJWaWV3TW9kZWwgJiYgcmVzcG9uc2UubG9nZ2VkVXNlclZpZXdNb2RlbClcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VkVXNlclZpZXdNb2RlbCA9IHJlc3BvbnNlLmxvZ2dlZFVzZXJWaWV3TW9kZWw7XHJcblxyXG5cclxuICAgICAgICAgICAgbGV0IHByb3ZpZGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiByZXNwb25zZS52aWV3TW9kZWxzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09IGlkKVxyXG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdNb2RlbHNba2V5XSA9IHJlc3BvbnNlLnZpZXdNb2RlbHNba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvdmlkZWQpXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nYWxsZXJ5QXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUZyb21HYWxsZXJ5QXJyYXkoaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlR2FsbGVyeSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBJbWFnZU5vdEZvdW5kKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnJlbW92ZUZyb21HYWxsZXJ5QXJyYXkgPSBmdW5jdGlvbiAoaWQpIHtcclxuXHJcbiAgICB0aGlzLmdhbGxlcnlBcnJheSAmJiB+dGhpcy5nYWxsZXJ5QXJyYXkuaW5kZXhPZihpZCkgJiZcclxuICAgIHRoaXMuZ2FsbGVyeUFycmF5LnNwbGljZSh0aGlzLmdhbGxlcnlBcnJheS5pbmRleE9mKGlkKSwgMSk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5hZGRUb0dhbGxlcnlBcnJheSA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgdGhpcy5nYWxsZXJ5QXJyYXkgJiYgdGhpcy5nYWxsZXJ5QXJyYXkucHVzaChpZCk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS51cGRhdGVHYWxsZXJ5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuZ2FsbGVyeUFycmF5ICYmIHRoaXMuZ2FsbGVyeSkge1xyXG4gICAgICAgIGxldCBpbWFnZVByZXZpZXdzID0gdGhpcy5nYWxsZXJ5LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbWFnZS1wcmV2aWV3Jyk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbWFnZVByZXZpZXdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICghfnRoaXMuZ2FsbGVyeUFycmF5LmluZGV4T2YoK2ltYWdlUHJldmlld3NbaV0uZGF0YXNldC5pZCkpXHJcbiAgICAgICAgICAgICAgICBpbWFnZVByZXZpZXdzW2ldLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldFB1YmxpY2F0aW9uTnVtYmVyKHRoaXMuZ2FsbGVyeUFycmF5Lmxlbmd0aCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5nZXRJbWFnZVByZXZpZXdCeUlkID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICByZXR1cm4gdGhpcy5nYWxsZXJ5LnF1ZXJ5U2VsZWN0b3IoYC5pbWFnZS1wcmV2aWV3W2RhdGEtaWQ9XCIke2lkfVwiXWApO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUudXBkYXRlSW1hZ2VQcmV2aWV3VGV4dCA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgbGV0IGxpa2VBbW91bnQgPSB0aGlzLnZpZXdNb2RlbHNbaWRdLmxpa2VzLmxlbmd0aDtcclxuICAgIGxldCBjb21tZW50QW1vdW50ID0gdGhpcy52aWV3TW9kZWxzW2lkXS5jb21tZW50cy5sZW5ndGg7XHJcbiAgICBsZXQgcHJldmlld0ltYWdlRWxlbSA9IHRoaXMuZ2V0SW1hZ2VQcmV2aWV3QnlJZChpZCk7XHJcbiAgICBwcmV2aWV3SW1hZ2VFbGVtLmRhdGFzZXQubGlrZUFtb3VudCA9IGxpa2VBbW91bnQ7XHJcbiAgICBwcmV2aWV3SW1hZ2VFbGVtLmRhdGFzZXQuY29tbWVudEFtb3VudCA9IGNvbW1lbnRBbW91bnQ7XHJcblxyXG4gICAgcHJldmlld0ltYWdlRWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2UtcHJldmlld19fY29tbWVudC1udW1iZXInKS50ZXh0Q29udGVudCA9IGNvbW1lbnRBbW91bnQ7XHJcbiAgICBwcmV2aWV3SW1hZ2VFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZS1wcmV2aWV3X19saWtlLW51bWJlcicpLnRleHRDb250ZW50ID0gbGlrZUFtb3VudDtcclxuXHJcbiAgICBwcmV2aWV3SW1hZ2VFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZS1wcmV2aWV3X19jb21tZW50LXNlY3Rpb24gLmltYWdlLXByZXZpZXdfX2Rlc2lnbmF0aW9uLXRleHQnKVxyXG4gICAgICAgIC50ZXh0Q29udGVudCA9IGdldENvcnJlY3ROb3VuRm9ybSgnY29tbWVudCcsIGNvbW1lbnRBbW91bnQpO1xyXG4gICAgcHJldmlld0ltYWdlRWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2UtcHJldmlld19fbGlrZS1zZWN0aW9uIC5pbWFnZS1wcmV2aWV3X19kZXNpZ25hdGlvbi10ZXh0JylcclxuICAgICAgICAudGV4dENvbnRlbnQgPSBnZXRDb3JyZWN0Tm91bkZvcm0oJ2xpa2UnLCBsaWtlQW1vdW50KTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLmRlbGV0ZUltYWdlUHJldmlldyA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgbGV0IGVsZW0gPSB0aGlzLmdldEltYWdlUHJldmlld0J5SWQoaWQpO1xyXG4gICAgaWYgKGVsZW0pIHtcclxuICAgICAgICBlbGVtLnJlbW92ZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0UHVibGljYXRpb25OdW1iZXIoLTEsIHRydWUpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuaW5zZXJ0TmV3SW1hZ2VQcmV2aWV3ID0gZnVuY3Rpb24gKGltYWdlSWQsIHByZXZpZXdVcmwpIHtcclxuICAgIGxldCBuZXdJbWFnZVByZXZpZXcgPSB0aGlzLmltYWdlUHJldmlld0dob3N0LmNsb25lTm9kZSh0cnVlKTtcclxuICAgIG5ld0ltYWdlUHJldmlldy5jbGFzc0xpc3QucmVtb3ZlKCdpbWFnZS1wcmV2aWV3X2dob3N0Jyk7XHJcblxyXG4gICAgbmV3SW1hZ2VQcmV2aWV3LmRhdGFzZXQuaWQgPSBpbWFnZUlkO1xyXG4gICAgbmV3SW1hZ2VQcmV2aWV3LmhyZWYgPSBgL2ltYWdlLyR7aW1hZ2VJZH1gO1xyXG4gICAgbmV3SW1hZ2VQcmV2aWV3LnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZS1wcmV2aWV3X19waWN0dXJlJykuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgnLyR7cHJldmlld1VybH0nKWA7XHJcblxyXG4gICAgbmV3SW1hZ2VQcmV2aWV3LnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZS1wcmV2aWV3X19jb21tZW50LW51bWJlcicpLnRleHRDb250ZW50ID0gMDtcclxuICAgIG5ld0ltYWdlUHJldmlldy5xdWVyeVNlbGVjdG9yKCcuaW1hZ2UtcHJldmlld19fbGlrZS1udW1iZXInKS50ZXh0Q29udGVudCA9IDA7XHJcblxyXG4gICAgbmV3SW1hZ2VQcmV2aWV3LnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZS1wcmV2aWV3X19jb21tZW50LXNlY3Rpb24gLmltYWdlLXByZXZpZXdfX2Rlc2lnbmF0aW9uLXRleHQnKVxyXG4gICAgICAgIC50ZXh0Q29udGVudCA9ICdjb21tZW50cyc7XHJcbiAgICBuZXdJbWFnZVByZXZpZXcucXVlcnlTZWxlY3RvcignLmltYWdlLXByZXZpZXdfX2xpa2Utc2VjdGlvbiAuaW1hZ2UtcHJldmlld19fZGVzaWduYXRpb24tdGV4dCcpXHJcbiAgICAgICAgLnRleHRDb250ZW50ID0gJ2xpa2VzJztcclxuXHJcbiAgICBuZXdJbWFnZVByZXZpZXcucXVlcnlTZWxlY3RvcignLmltYWdlLXByZXZpZXdfX3VwbG9hZC1kYXRlLXRleHQnKS50ZXh0Q29udGVudCA9ICdhIGZldyBzZWNvbmRzIGFnbyc7XHJcblxyXG4gICAgdGhpcy5nYWxsZXJ5V3JhcHBlci5hcHBlbmRDaGlsZChuZXdJbWFnZVByZXZpZXcpO1xyXG5cclxuICAgIHRoaXMuc2V0UHVibGljYXRpb25OdW1iZXIoMSwgdHJ1ZSk7XHJcbiAgICB0aGlzLmFkZFRvR2FsbGVyeUFycmF5KGltYWdlSWQpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuc2V0UHVibGljYXRpb25OdW1iZXIgPSBmdW5jdGlvbiAodmFsdWUsIHJlbGF0aXZlKSB7XHJcbiAgICBpZiAodGhpcy5wdWJsaWNhdGlvbnNTdGF0RWxlbSkge1xyXG4gICAgICAgIGxldCBwdWJsaWNhdGlvbk51bWJlckVsZW0gPSB0aGlzLnB1YmxpY2F0aW9uc1N0YXRFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5zdGF0X19udW1iZXInKTtcclxuICAgICAgICBsZXQgcHVibGljYXRpb25UZXh0RWxlbSA9IHRoaXMucHVibGljYXRpb25zU3RhdEVsZW0ucXVlcnlTZWxlY3RvcignLnN0YXRfX2NhcHRpb24nKTtcclxuICAgICAgICBsZXQgbmV3VmFsdWUgPSAocmVsYXRpdmUgJiYgcHVibGljYXRpb25OdW1iZXJFbGVtKSA/ICgrcHVibGljYXRpb25OdW1iZXJFbGVtLnRleHRDb250ZW50ICsgdmFsdWUpIDogdmFsdWU7XHJcblxyXG4gICAgICAgIHB1YmxpY2F0aW9uTnVtYmVyRWxlbS50ZXh0Q29udGVudCA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIHB1YmxpY2F0aW9uVGV4dEVsZW0udGV4dENvbnRlbnQgPSBnZXRDb3JyZWN0Tm91bkZvcm0oJ3B1YmxpY2F0aW9uJywgbmV3VmFsdWUpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuZGVsZXRlVmlld01vZGVsID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICBkZWxldGUgdGhpcy52aWV3TW9kZWxzW2lkXTtcclxuICAgIGNvbnNvbGUubG9nKCdkZWxldGUgIycgKyBpZCk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5yZXF1ZXN0QWxsTmVjZXNzYXJ5Vmlld01vZGVscyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBQcm9taXNlLmFsbChbXHJcbiAgICAgICAgdGhpcy5yZXF1ZXN0TmV4dFZpZXdNb2RlbHMoKSxcclxuICAgICAgICB0aGlzLnJlcXVlc3RQcmV2Vmlld01vZGVscygpXHJcbiAgICBdKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnJlcXVlc3ROZXh0Vmlld01vZGVscyA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBpZiAodGhpcy5nYWxsZXJ5QXJyYXkgJiYgdGhpcy5nYWxsZXJ5QXJyYXkubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgSW1hZ2VOb3RGb3VuZCgpKTtcclxuXHJcbiAgICBsZXQgcHJvbWlzZXMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wcmVsb2FkRW50aXR5Q291bnQ7IGkrKylcclxuICAgICAgICBwcm9taXNlcy5wdXNoKHRoaXMucmVxdWVzdFZpZXdNb2RlbCh0aGlzLmdldE5leHRJbWFnZUlkKGkpKSk7XHJcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUucmVxdWVzdFByZXZWaWV3TW9kZWxzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuZ2FsbGVyeUFycmF5ICYmIHRoaXMuZ2FsbGVyeUFycmF5Lmxlbmd0aCA9PT0gMClcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEltYWdlTm90Rm91bmQoKSk7XHJcbiAgICBsZXQgcHJvbWlzZXMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wcmVsb2FkRW50aXR5Q291bnQ7IGkrKylcclxuICAgICAgICBwcm9taXNlcy5wdXNoKHRoaXMucmVxdWVzdFZpZXdNb2RlbCh0aGlzLmdldFByZXZJbWFnZUlkKGkpKSk7XHJcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuc3dpdGNoVG9OZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuZ2FsbGVyeUFycmF5ICYmICF0aGlzLmdhbGxlcnlBcnJheS5sZW5ndGgpIHtcclxuICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG5leHRJbWFnZUlkID0gdGhpcy5nZXROZXh0SW1hZ2VJZCgpO1xyXG4gICAgdGhpcy5zaG93KG5leHRJbWFnZUlkKS5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBJbWFnZU5vdEZvdW5kKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdhbGxlcnlBcnJheSAmJiB0aGlzLmdhbGxlcnlBcnJheS5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN3aXRjaFRvTmV4dCgpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5zd2l0Y2hUb1ByZXYgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgaWYgKHRoaXMuZ2FsbGVyeUFycmF5ICYmICF0aGlzLmdhbGxlcnlBcnJheS5sZW5ndGgpIHtcclxuICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHByZXZJbWFnZUlkID0gdGhpcy5nZXRQcmV2SW1hZ2VJZCgpO1xyXG4gICAgdGhpcy5zaG93KHByZXZJbWFnZUlkKS5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBJbWFnZU5vdEZvdW5kKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdhbGxlcnlBcnJheSAmJiB0aGlzLmdhbGxlcnlBcnJheS5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN3aXRjaFRvUHJldigpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5nZXROZXh0SW1hZ2VJZCA9IGZ1bmN0aW9uIChvZmZzZXQpIHtcclxuICAgIG9mZnNldCA9IG9mZnNldCB8fCAxO1xyXG4gICAgbGV0IGluZGV4ID0gdGhpcy5nYWxsZXJ5QXJyYXkuaW5kZXhPZih0aGlzLmN1cnJlbnRJbWFnZUlkKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5nYWxsZXJ5QXJyYXlbKGluZGV4ICsgb2Zmc2V0KSAlIHRoaXMuZ2FsbGVyeUFycmF5Lmxlbmd0aF07XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5nZXRQcmV2SW1hZ2VJZCA9IGZ1bmN0aW9uIChvZmZzZXQpIHtcclxuICAgIG9mZnNldCA9IG9mZnNldCB8fCAxO1xyXG5cclxuICAgIGxldCBpbmRleCA9IHRoaXMuZ2FsbGVyeUFycmF5LmluZGV4T2YodGhpcy5jdXJyZW50SW1hZ2VJZCk7XHJcblxyXG4gICAgaWYgKH5pbmRleCAmJiB0aGlzLmdhbGxlcnlBcnJheS5sZW5ndGggPT09IDEpXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2FsbGVyeUFycmF5WzBdO1xyXG5cclxuICAgIGxldCBnYWxsZXJ5UHJldkluZGV4ID0gaW5kZXggLSBvZmZzZXQ7XHJcbiAgICBpZiAoZ2FsbGVyeVByZXZJbmRleCA8IDApIHtcclxuICAgICAgICBnYWxsZXJ5UHJldkluZGV4ICU9IHRoaXMuZ2FsbGVyeUFycmF5Lmxlbmd0aDtcclxuICAgICAgICBnYWxsZXJ5UHJldkluZGV4ID0gdGhpcy5nYWxsZXJ5QXJyYXkubGVuZ3RoICsgZ2FsbGVyeVByZXZJbmRleDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5nYWxsZXJ5QXJyYXlbZ2FsbGVyeVByZXZJbmRleF07XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS51cGRhdGVDdXJyZW50VmlldyA9IGZ1bmN0aW9uIChpbnZvbHZlZEltYWdlSWQpIHtcclxuXHJcbiAgICBpZiAoaW52b2x2ZWRJbWFnZUlkID09PSB0aGlzLmN1cnJlbnRJbWFnZUlkKSB7XHJcbiAgICAgICAgdGhpcy5oaWRlSW1nRWxlbSgpO1xyXG5cclxuICAgICAgICB0aGlzLmltZ0VsZW0uc2V0QXR0cmlidXRlKCdzcmMnLCB0aGlzLmN1cnJlbnRWaWV3TW9kZWwuaW1nVXJsKTtcclxuXHJcbiAgICAgICAgdGhpcy5saWtlQnV0dG9uLnNldEltYWdlSWQodGhpcy5jdXJyZW50SW1hZ2VJZCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVMaWtlcyh0aGlzLmN1cnJlbnRJbWFnZUlkKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb21tZW50U2VjdGlvbi5zZXRJbWFnZUlkKHRoaXMuY3VycmVudEltYWdlSWQpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ29tbWVudHModGhpcy5jdXJyZW50SW1hZ2VJZCk7XHJcblxyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24udGV4dENvbnRlbnQgPSB0aGlzLmN1cnJlbnRWaWV3TW9kZWwuZGVzY3JpcHRpb247XHJcbiAgICAgICAgaWYgKHRoaXMuZGVzY3JpcHRpb24udGV4dENvbnRlbnQgPT09ICcnKVxyXG4gICAgICAgICAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnaW1hZ2Vfbm8tZGVzY3JpcHRpb24nKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdpbWFnZV9uby1kZXNjcmlwdGlvbicpO1xyXG5cclxuICAgICAgICB0aGlzLmRhdGUudGV4dENvbnRlbnQgPSB0aGlzLmN1cnJlbnRWaWV3TW9kZWwuY3JlYXRlRGF0ZVN0cjtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNMb2dnZWQpXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRWaWV3TW9kZWwuaXNPd25JbWFnZSlcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlQnV0dG9uLnNldEltYWdlSWQodGhpcy5jdXJyZW50SW1hZ2VJZCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlQnV0dG9uLnNldEltYWdlSWQodGhpcy5jdXJyZW50SW1hZ2VJZCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzRmVlZClcclxuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVCdXR0b24uc2V0KHthY3RpdmU6IHRydWV9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hdmF0YXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgnJHt0aGlzLmN1cnJlbnRWaWV3TW9kZWwuYXV0aG9yLmF2YXRhclVybHMubWVkaXVtfScpYDtcclxuICAgICAgICB0aGlzLnVzZXJuYW1lLnRleHRDb250ZW50ID0gdGhpcy5jdXJyZW50Vmlld01vZGVsLmF1dGhvci51c2VybmFtZTtcclxuXHJcbiAgICAgICAgdGhpcy5oZWFkZXJMZWZ0U2lkZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCB0aGlzLmN1cnJlbnRWaWV3TW9kZWwuYXV0aG9yLnVybCk7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS51cGRhdGVMaWtlcyA9IGZ1bmN0aW9uIChpbWFnZUlkKSB7XHJcbiAgICBpZiAodGhpcy5jdXJyZW50SW1hZ2VJZCA9PT0gaW1hZ2VJZClcclxuICAgICAgICB0aGlzLmxpa2VCdXR0b24uc2V0KHtcclxuICAgICAgICAgICAgYWN0aXZlOiB0aGlzLmN1cnJlbnRWaWV3TW9kZWwuaXNMaWtlZCxcclxuICAgICAgICAgICAgbGlrZUFtb3VudDogdGhpcy5jdXJyZW50Vmlld01vZGVsLmxpa2VzLmxlbmd0aFxyXG4gICAgICAgIH0pO1xyXG4gICAgaWYgKHRoaXMuZ2FsbGVyeSlcclxuICAgICAgICB0aGlzLnVwZGF0ZUltYWdlUHJldmlld1RleHQoaW1hZ2VJZCk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS51cGRhdGVDb21tZW50cyA9IGZ1bmN0aW9uIChpbWFnZUlkKSB7XHJcbiAgICBpZiAodGhpcy5jdXJyZW50SW1hZ2VJZCA9PT0gaW1hZ2VJZClcclxuICAgICAgICB0aGlzLmNvbW1lbnRTZWN0aW9uLnNldCh0aGlzLmN1cnJlbnRWaWV3TW9kZWwuY29tbWVudHMpO1xyXG4gICAgaWYgKHRoaXMuZ2FsbGVyeSlcclxuICAgICAgICB0aGlzLnVwZGF0ZUltYWdlUHJldmlld1RleHQoaW1hZ2VJZCk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5wdXNoSW1hZ2VTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGhpc3RvcnkucHVzaFN0YXRlKHtcclxuICAgICAgICB0eXBlOiAnaW1hZ2UnLFxyXG4gICAgICAgIGlkOiB0aGlzLmN1cnJlbnRJbWFnZUlkXHJcbiAgICB9LCAnaW1hZ2UgIycgKyB0aGlzLmN1cnJlbnRJbWFnZUlkLCAnL2ltYWdlLycgKyB0aGlzLmN1cnJlbnRJbWFnZUlkKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnB1c2hHYWxsZXJ5U3RhdGUgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgbGV0IHVybCA9ICcnO1xyXG4gICAgaWYgKCF0aGlzLmlzRmVlZClcclxuICAgICAgICB1cmwgPSB0aGlzLmN1cnJlbnRWaWV3TW9kZWwgJiYgdGhpcy5jdXJyZW50Vmlld01vZGVsLmF1dGhvci51cmw7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdXJsID0gJy9mZWVkJztcclxuXHJcbiAgICBoaXN0b3J5LnB1c2hTdGF0ZSh7XHJcbiAgICAgICAgdHlwZTogJ2dhbGxlcnknXHJcbiAgICB9LCAnJywgdXJsKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLm9uUG9wU3RhdGUgPSBmdW5jdGlvbiAoc3RhdGUpIHtcclxuXHJcbiAgICBpZiAoc3RhdGUgJiYgc3RhdGUudHlwZSlcclxuICAgICAgICBzd2l0Y2ggKHN0YXRlLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAnaW1hZ2UnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93KHtcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZUlkOiBzdGF0ZS5pZCxcclxuICAgICAgICAgICAgICAgICAgICBub1B1c2hTdGF0ZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ2dhbGxlcnknOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWFjdGl2YXRlKG51bGwsIHtcclxuICAgICAgICAgICAgICAgICAgICBub1B1c2hTdGF0ZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbn07XHJcblxyXG5mb3IgKGxldCBrZXkgaW4gZXZlbnRNaXhpbilcclxuICAgIEdhbGxlcnkucHJvdG90eXBlW2tleV0gPSBldmVudE1peGluW2tleV07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdhbGxlcnk7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvZ2FsbGVyeS9pbmRleC5qcyIsImxldCBldmVudE1peGluID0gcmVxdWlyZShMSUJTICsgJ2V2ZW50TWl4aW4nKTtcclxuXHJcbmxldCBTd2l0Y2hCdXR0b24gPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgdGhpcy5lbGVtID0gb3B0aW9ucy5lbGVtO1xyXG4gICAgdGhpcy5kYXRhID0gb3B0aW9ucy5kYXRhO1xyXG4gICAgdGhpcy5kYXRhU3RyID0gb3B0aW9ucy5kYXRhU3RyIHx8ICdpbWFnZUlkJztcclxuXHJcbiAgICB0aGlzLnRleHRFbGVtID0gb3B0aW9ucy50ZXh0RWxlbSB8fCB0aGlzLmVsZW07XHJcblxyXG4gICAgU3dpdGNoQnV0dG9uLnByb3RvdHlwZS5zZXQuY2FsbCh0aGlzLCB7YWN0aXZlOiAhIXRoaXMuZWxlbS5kYXRhc2V0LmFjdGl2ZX0pO1xyXG4gICAgdGhpcy5hdmFpbGFibGUgPSB0cnVlO1xyXG5cclxuICAgIHRoaXMuZWxlbS5vbmNsaWNrID0gZSA9PiB0aGlzLm9uQ2xpY2soZSk7XHJcbn07XHJcblxyXG5Td2l0Y2hCdXR0b24ucHJvdG90eXBlLm9uQ2xpY2sgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgbGV0IGludm9sdmVkRGF0YSA9IHRoaXMuZGF0YTtcclxuXHJcbiAgICBpZiAodGhpcy5hdmFpbGFibGUpIHtcclxuXHJcbiAgICAgICAgdGhpcy5hdmFpbGFibGUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnRvZ2dsZSgpO1xyXG5cclxuICAgICAgICByZXF1aXJlKExJQlMgKyAnc2VuZFJlcXVlc3QnKSh7XHJcbiAgICAgICAgICAgIFt0aGlzLmRhdGFTdHJdOiBpbnZvbHZlZERhdGFcclxuICAgICAgICB9LCAnUE9TVCcsIHRoaXMudXJsLCAoZXJyLCByZXNwb25zZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKCFlcnIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldChyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmF2YWlsYWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ3N3aXRjaC1idXR0b25fY2hhbmdlZCcsIHtcclxuICAgICAgICAgICAgICAgICAgICBbdGhpcy5kYXRhU3RyXTogaW52b2x2ZWREYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhID09PSBpbnZvbHZlZERhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmF2YWlsYWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b2dnbGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcblN3aXRjaEJ1dHRvbi5zZXRSZWxhdGlvbiA9IGZ1bmN0aW9uIChzd2l0Y2hCdXR0b24xLCBzd2l0Y2hCdXR0b24yKSB7XHJcbiAgICBzd2l0Y2hCdXR0b24xLm9uKCdzd2l0Y2gtYnV0dG9uX2NoYW5nZWQnLCBlID0+IHtcclxuICAgICAgICBzd2l0Y2hCdXR0b24yLnNldChlLmRldGFpbC5yZXNwb25zZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBzd2l0Y2hCdXR0b24yLm9uKCdzd2l0Y2gtYnV0dG9uX2NoYW5nZWQnLCBlID0+IHtcclxuICAgICAgICBzd2l0Y2hCdXR0b24xLnNldChlLmRldGFpbC5yZXNwb25zZSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcblN3aXRjaEJ1dHRvbi5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIGlmIChvcHRpb25zLmFjdGl2ZSlcclxuICAgICAgICB0aGlzLl9hY3RpdmF0ZSgpO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHRoaXMuX2RlYWN0aXZhdGUoKTtcclxufTtcclxuXHJcblN3aXRjaEJ1dHRvbi5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuYWN0aXZlKVxyXG4gICAgICAgIHRoaXMuc2V0KHthY3RpdmU6IGZhbHNlfSk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5zZXQoe2FjdGl2ZTogdHJ1ZX0pO1xyXG59O1xyXG5cclxuU3dpdGNoQnV0dG9uLnByb3RvdHlwZS5fYWN0aXZhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnYnV0dG9uX2FjdGl2ZScpO1xyXG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xyXG5cclxuICAgIHRoaXMudGV4dEVsZW0gJiYgdGhpcy5hY3RpdmVUZXh0ICYmICh0aGlzLnRleHRFbGVtLnRleHRDb250ZW50ID0gdGhpcy5hY3RpdmVUZXh0KTtcclxufTtcclxuXHJcblN3aXRjaEJ1dHRvbi5wcm90b3R5cGUuX2RlYWN0aXZhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnYnV0dG9uX2FjdGl2ZScpO1xyXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuXHJcbiAgICB0aGlzLnRleHRFbGVtICYmIHRoaXMuaW5hY3RpdmVUZXh0ICYmICh0aGlzLnRleHRFbGVtLnRleHRDb250ZW50ID0gdGhpcy5pbmFjdGl2ZVRleHQpO1xyXG59O1xyXG5cclxuU3dpdGNoQnV0dG9uLnByb3RvdHlwZS5zZXRJbWFnZUlkID0gZnVuY3Rpb24gKGltYWdlSWQpIHtcclxuICAgIHRoaXMuZGF0YSA9IGltYWdlSWQ7XHJcbn07XHJcblxyXG5mb3IgKGxldCBrZXkgaW4gZXZlbnRNaXhpbilcclxuICAgIFN3aXRjaEJ1dHRvbi5wcm90b3R5cGVba2V5XSA9IGV2ZW50TWl4aW5ba2V5XTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3dpdGNoQnV0dG9uO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3Mvc3dpdGNoLWJ1dHRvbi9pbmRleC5qcyIsImxldCBnZXRDb3JyZWN0Tm91bkZvcm0gPSBmdW5jdGlvbiAoc2luZ2xlRm9ybSwgYW1vdW50KSB7XHJcbiAgICByZXR1cm4gc2luZ2xlRm9ybSArICgoYW1vdW50ID09PSAxKSA/ICcnIDogJ3MnKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZ2V0Q29ycmVjdE5vdW5Gb3JtO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9nZXRDb3JyZWN0Tm91bkZvcm0uanMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBpZD1cXFwiaW1hZ2VcXFwiIGNsYXNzPVxcXCJtb2RhbCBpbWFnZV9pbWctZWxlbWVudC1pbnZpc2libGUgaW1hZ2UgaW1hZ2Vfbm8tZGVzY3JpcHRpb25cXFwiPlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9faW1hZ2Utd3JhcHBlclxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGlkPVxcXCJzcGlubmVyXFxcIiBjbGFzcz1cXFwic3Bpbm5lciBpbWFnZV9fc3Bpbm5lclxcXCI+XFxyXFxuICAgICAgICBcXHJcXG4gICAgICAgIDwvZGl2PiAgICAgICAgPGltZyBjbGFzcz1cXFwiaW1hZ2VfX2ltZy1lbGVtZW50XFxcIj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19jb250cm9sc1xcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2NvbnRyb2wgaW1hZ2VfX2NvbnRyb2wtcHJldiBpY29uLWFycm93LWxlZnRcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19jb250cm9sIGltYWdlX19jb250cm9sLWZ1bGwgaWNvbi1hcnJvdy1tYXhpbWlzZVxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2NvbnRyb2wgaW1hZ2VfX2NvbnRyb2wtbmV4dCBpY29uLWFycm93LXJpZ2h0XFxcIj48L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX3NpZGViYXJcXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX3RvcC1zaWRlXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJoZWFkZXIgaW1hZ2VfX2hlYWRlclxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxhIGNsYXNzPVxcXCJpbWFnZV9faGVhZGVyLWxlZnQtc2lkZVxcXCIgaHJlZj1cXFwiXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19hdmF0YXJcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPVxcXCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJycpXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19tZXRhZGF0YVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX3VzZXJuYW1lXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fcG9zdC1kYXRlXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8L2E+XFxyXFxuXFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbiBidXR0b25faW52aXNpYmxlIGltYWdlX190b3Atc2lkZS1idXR0b24gaW1hZ2VfX2RlbGV0ZS1idXR0b24gYnV0dG9uX2hlYWRlci1zdHlsZVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICBkZWxldGVcXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXZcXHJcXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJidXR0b24gaW1hZ2VfX3RvcC1zaWRlLWJ1dHRvbiBpbWFnZV9fc3Vic2NyaWJlLWJ1dHRvbiBidXR0b25faGVhZGVyLXN0eWxlXFxcIlxcclxcbiAgICAgICAgICAgICAgICA+XFxyXFxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVcXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuXFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2luZm8tYm9hcmRcXFwiPlxcclxcblxcclxcbiAgICAgICAgICAgICAgICA8ZGl2XFxyXFxuICAgICAgICAgICAgICAgIFxcclxcbiAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJidXR0b24gbGlrZS1idXR0b24gaW1hZ2VfX2xpa2UtYnV0dG9uXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxpa2UtYnV0dG9uX19oZWFydCBpY29uLWhlYXJ0XFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxpa2UtYnV0dG9uX19oZWFydCBpY29uLWhlYXJ0LW91dGxpbmVkXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICZuYnNwO2xpa2UmbmJzcDtcXHJcXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJsaWtlLWJ1dHRvbl9fbGlrZS1hbW91bnRcXFwiPjwvc3Bhbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19kZXNjcmlwdGlvblxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICBcXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuXFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2NvbW1lbnQtc2VjdGlvbi13cmFwcGVyIGltYWdlX25vLXNjcm9sbGJhclxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnQtc2VjdGlvbiBpbWFnZV9fY29tbWVudC1zZWN0aW9uXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnQtc2VjdGlvbl9fbm8tY29tbWVudHMtYmxvY2tcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIFRoZXJlIGFyZSBubyBjb21tZW50cyB5ZXRcXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudC1zZWN0aW9uX19jb21tZW50cy13cmFwcGVyXFxcIj5cXHJcXG5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicGFuZWwgY29tbWVudCBjb21tZW50LXNlY3Rpb25fX2NvbW1lbnQgY29tbWVudF9naG9zdFxcXCIgZGF0YS1pZD1cXFwiXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnRfX3RvcC1zaWRlXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cXFwiY29tbWVudF9fcmVmXFxcIiBocmVmPVxcXCJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb21tZW50X19hdmF0YXJcXFwiIHN0eWxlPVxcXCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJycpXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudF9fbWV0YWRhdGFcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudF9fdXNlcm5hbWVcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudF9fZGF0ZVxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb21tZW50X19jbG9zZS1idXR0b24gaWNvbi1jcm9zc1xcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnRfX3RleHRcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fY29tbWVudC1zZWN0aW9uLXNjcm9sbGJhci13cmFwcGVyIGltYWdlX25vLXNjcm9sbGJhclxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19jb21tZW50LXNlY3Rpb24tc2Nyb2xsYmFyLW9mZnNldFxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19jb21tZW50LXNlY3Rpb24tc2Nyb2xsYmFyXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19jb21tZW50LXNlY3Rpb24tc2xpZGVyXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcInBhbmVsIGNvbW1lbnQgY29tbWVudC1zZW5kIGltYWdlX19jb21tZW50LXNlbmRcXFwiXFxyXFxuICAgICAgICAgICAgIGRhdGEtaW1hZ2UtaWQ9XFxcIlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudF9fdG9wLXNpZGVcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb21tZW50X19hdmF0YXJcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb21tZW50X191c2VybmFtZVxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICAgICAgPHRleHRhcmVhIHBsYWNlaG9sZGVyPVxcXCJzaGFyZSB5b3VyIG9waW5pb27igKZcXFwiIGNsYXNzPVxcXCJjb21tZW50LXNlbmRfX3RleHRhcmVhXFxcIj48L3RleHRhcmVhPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbiBjb21tZW50LXNlbmRfX3NlbmQtYnV0dG9uXFxcIj5zZW5kPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19tb2RhbC1jbG9zZS1idXR0b24td3JhcHBlclxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpY29uLWNyb3NzIG1vZGFsLWNsb3NlLWJ1dHRvbiBpbWFnZV9fbW9kYWwtY2xvc2UtYnV0dG9uXFxcIj48L2Rpdj4gICAgPC9kaXY+XFxyXFxuXFxyXFxuPC9kaXY+XFxyXFxuXFxyXFxuXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL34vaHRtbC1sb2FkZXIhLi4vYmxvY2tzL2dhbGxlcnkvd2luZG93XG4vLyBtb2R1bGUgaWQgPSA0MFxuLy8gbW9kdWxlIGNodW5rcyA9IDMgOSAxNCIsImxldCBDb21tZW50U2VjdGlvbiA9IHJlcXVpcmUoQkxPQ0tTICsgJ2NvbW1lbnQtc2VjdGlvbicpO1xyXG5cclxubGV0IEltYWdlQ29tbWVudFNlY3Rpb24gPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgQ29tbWVudFNlY3Rpb24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHJcbiAgICB0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlciA9IG9wdGlvbnMuY29tbWVudFNlY3Rpb25XcmFwcGVyO1xyXG4gICAgdGhpcy5pbmZvQm9hcmQgPSBvcHRpb25zLmluZm9Cb2FyZDtcclxuICAgIHRoaXMuc2Nyb2xsYmFyV3JhcHBlciA9IG9wdGlvbnMuc2Nyb2xsYmFyV3JhcHBlcjtcclxuICAgIHRoaXMuc2Nyb2xsYmFyID0gdGhpcy5zY3JvbGxiYXJXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fY29tbWVudC1zZWN0aW9uLXNjcm9sbGJhcicpO1xyXG4gICAgdGhpcy5zY3JvbGxiYXJPZmZzZXQgPSB0aGlzLnNjcm9sbGJhcldyYXBwZXIucXVlcnlTZWxlY3RvcignLmltYWdlX19jb21tZW50LXNlY3Rpb24tc2Nyb2xsYmFyLW9mZnNldCcpO1xyXG4gICAgdGhpcy5zY3JvbGxiYXJTbGlkZXIgPSB0aGlzLnNjcm9sbGJhcldyYXBwZXIucXVlcnlTZWxlY3RvcignLmltYWdlX19jb21tZW50LXNlY3Rpb24tc2xpZGVyJyk7XHJcblxyXG4gICAgdGhpcy5jb21tZW50U2VjdGlvbldyYXBwZXIub25zY3JvbGwgPSBlID0+IHtcclxuICAgICAgICBpZiAoIXRoaXMub25EcmFnZ2luZylcclxuICAgICAgICAgICAgdGhpcy5zZXRUb3AoKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5zY3JvbGxiYXJTbGlkZXIub25tb3VzZWRvd24gPSBlID0+IHtcclxuXHJcbiAgICAgICAgdGhpcy5vbkRyYWdnaW5nID0gdHJ1ZTtcclxuICAgICAgICBsZXQgc2xpZGVyQ29vcmRzID0gZ2V0Q29vcmRzKHRoaXMuc2Nyb2xsYmFyU2xpZGVyKTtcclxuICAgICAgICBsZXQgc2hpZnRZID0gZS5wYWdlWSAtIHNsaWRlckNvb3Jkcy50b3A7XHJcbiAgICAgICAgbGV0IHNjcm9sbGJhckNvb3JkcyA9IGdldENvb3Jkcyh0aGlzLnNjcm9sbGJhcik7XHJcbiAgICAgICAgbGV0IG5ld1RvcDtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQub25tb3VzZW1vdmUgPSBlID0+IHtcclxuICAgICAgICAgICAgbmV3VG9wID0gZS5wYWdlWSAtIHNoaWZ0WSAtIHNjcm9sbGJhckNvb3Jkcy50b3A7XHJcbiAgICAgICAgICAgIGlmIChuZXdUb3AgPCAwKSBuZXdUb3AgPSAwO1xyXG4gICAgICAgICAgICBsZXQgYm90dG9tRWRnZSA9IHRoaXMuc2Nyb2xsYmFyLm9mZnNldEhlaWdodCAtIHRoaXMuc2Nyb2xsYmFyU2xpZGVyLm9mZnNldEhlaWdodDtcclxuICAgICAgICAgICAgaWYgKG5ld1RvcCA+IGJvdHRvbUVkZ2UpIG5ld1RvcCA9IGJvdHRvbUVkZ2U7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbGJhclNsaWRlci5zdHlsZS50b3AgPSBuZXdUb3AgKyAncHgnO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jb21tZW50U2VjdGlvbldyYXBwZXIuc2Nyb2xsVG9wID0gKG5ld1RvcCAvIHRoaXMuc2Nyb2xsYmFyLm9mZnNldEhlaWdodCkgLyAoMSAtIHRoaXMuc2xpZGVyU2l6ZVJhdGUpICpcclxuICAgICAgICAgICAgICAgICh0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlci5zY3JvbGxIZWlnaHQgLSB0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlci5vZmZzZXRIZWlnaHQpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGRvY3VtZW50Lm9ubW91c2V1cCA9IGUgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnb25tb3VzZXVwJywgbmV3VG9wLCB0aGlzLnNjcm9sbGJhci5vZmZzZXRIZWlnaHQpO1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbGJhclNsaWRlci5zdHlsZS50b3AgPSAobmV3VG9wICogMTAwIC8gdGhpcy5zY3JvbGxiYXIub2Zmc2V0SGVpZ2h0KSArICclJztcclxuICAgICAgICAgICAgdGhpcy5vbkRyYWdnaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGRvY3VtZW50Lm9ubW91c2Vtb3ZlID0gZG9jdW1lbnQub25tb3VzZXVwID0gbnVsbDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7IC8vIGRpc2FibGUgc2VsZWN0aW9uIHN0YXJ0IChjdXJzb3IgY2hhbmdlKVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnNjcm9sbGJhclNsaWRlci5vbmRyYWdzdGFydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldENvb3JkcyhlbGVtKSB7IC8vINC60YDQvtC80LUgSUU4LVxyXG4gICAgICAgIGxldCBib3ggPSBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0b3A6IGJveC50b3AgKyBwYWdlWU9mZnNldCxcclxuICAgICAgICAgICAgbGVmdDogYm94LmxlZnQgKyBwYWdlWE9mZnNldFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxufTtcclxuSW1hZ2VDb21tZW50U2VjdGlvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbW1lbnRTZWN0aW9uLnByb3RvdHlwZSk7XHJcbkltYWdlQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gSW1hZ2VDb21tZW50U2VjdGlvbjtcclxuXHJcbkltYWdlQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIENvbW1lbnRTZWN0aW9uLnByb3RvdHlwZS5zZXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgIHRoaXMudXBkYXRlKCk7XHJcbn07XHJcblxyXG5JbWFnZUNvbW1lbnRTZWN0aW9uLnByb3RvdHlwZS5zZXRUb3AgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgc2Nyb2xsUmF0ZSA9ICh0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlci5zY3JvbGxUb3ApIC9cclxuICAgICAgICAodGhpcy5jb21tZW50U2VjdGlvbldyYXBwZXIuc2Nyb2xsSGVpZ2h0IC0gdGhpcy5jb21tZW50U2VjdGlvbldyYXBwZXIub2Zmc2V0SGVpZ2h0KSAqIDEwMDtcclxuXHJcbiAgICB0aGlzLnNjcm9sbGJhclNsaWRlci5zdHlsZS50b3AgPSBgJHsoMSAtIHRoaXMuc2xpZGVyU2l6ZVJhdGUpICogc2Nyb2xsUmF0ZX0lYDtcclxuXHJcbn07XHJcblxyXG5JbWFnZUNvbW1lbnRTZWN0aW9uLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlci5jbGFzc0xpc3QuYWRkKCdpbWFnZV9uby1zY3JvbGxiYXInKTtcclxuICAgIHRoaXMuc2Nyb2xsYmFyV3JhcHBlci5jbGFzc0xpc3QuYWRkKCdpbWFnZV9uby1zY3JvbGxiYXInKTtcclxuXHJcbiAgICB0aGlzLmluZm9Cb2FyZEhlaWdodCA9IHRoaXMuaW5mb0JvYXJkLm9mZnNldEhlaWdodDtcclxuXHJcbiAgICBsZXQgY29tcHV0ZWRTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUodGhpcy5pbmZvQm9hcmQpO1xyXG4gICAgcGFyc2VGbG9hdChjb21wdXRlZFN0eWxlLmhlaWdodCkgJiYgKHRoaXMuaW5mb0JvYXJkSGVpZ2h0ID0gcGFyc2VGbG9hdChjb21wdXRlZFN0eWxlLmhlaWdodCkpO1xyXG5cclxuICAgIHRoaXMuc2Nyb2xsYmFyT2Zmc2V0LnN0eWxlLmhlaWdodCA9IGAke3RoaXMuaW5mb0JvYXJkSGVpZ2h0fXB4YDtcclxuICAgIHRoaXMuc2Nyb2xsYmFyLnN0eWxlLmhlaWdodCA9IGBjYWxjKDEwMCUgLSAke3RoaXMuaW5mb0JvYXJkSGVpZ2h0fXB4KWA7XHJcblxyXG4gICAgaWYgKHRoaXMuY29tbWVudFNlY3Rpb25XcmFwcGVyLm9mZnNldEhlaWdodCAtIHRoaXMuY29tbWVudHNXcmFwcGVyLnNjcm9sbEhlaWdodCA8IC0xKSB7XHJcbiAgICAgICAgdGhpcy5zbGlkZXJTaXplUmF0ZSA9IHRoaXMuY29tbWVudFNlY3Rpb25XcmFwcGVyLm9mZnNldEhlaWdodCAvIHRoaXMuY29tbWVudHNXcmFwcGVyLnNjcm9sbEhlaWdodDtcclxuICAgICAgICB0aGlzLnNjcm9sbGJhclNsaWRlci5zdHlsZS5oZWlnaHQgPSBgJHt0aGlzLnNsaWRlclNpemVSYXRlICogMTAwfSVgO1xyXG5cclxuICAgICAgICB0aGlzLnNldFRvcCgpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCdpbWFnZV9uby1zY3JvbGxiYXInKTtcclxuICAgICAgICB0aGlzLnNjcm9sbGJhcldyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSgnaW1hZ2Vfbm8tc2Nyb2xsYmFyJyk7XHJcbiAgICB9XHJcblxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW1hZ2VDb21tZW50U2VjdGlvbjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL2ltYWdlLWNvbW1lbnQtc2VjdGlvbi9pbmRleC5qcyIsImxldCBldmVudE1peGluID0gcmVxdWlyZShMSUJTICsgJ2V2ZW50TWl4aW4nKTtcclxuXHJcbmxldCBDb21tZW50U2VjdGlvbiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgdGhpcy5lbGVtID0gb3B0aW9ucy5lbGVtO1xyXG4gICAgdGhpcy5jb21tZW50c1dyYXBwZXIgPSBvcHRpb25zLmVsZW0ucXVlcnlTZWxlY3RvcignLmNvbW1lbnQtc2VjdGlvbl9fY29tbWVudHMtd3JhcHBlcicpO1xyXG4gICAgdGhpcy5pbWFnZUlkID0gb3B0aW9ucy5pbWFnZUlkO1xyXG4gICAgdGhpcy5sb2dnZWRVc2VyVmlld01vZGVsID0gb3B0aW9ucy5sb2dnZWRVc2VyVmlld01vZGVsO1xyXG5cclxuICAgIHRoaXMuY29tbWVudFNlbmRlckVsZW0gPSBvcHRpb25zLmNvbW1lbnRTZW5kZXJFbGVtO1xyXG4gICAgdGhpcy5jb21tZW50U2VuZFRleHRhcmVhID0gdGhpcy5jb21tZW50U2VuZGVyRWxlbS5xdWVyeVNlbGVjdG9yKCcuY29tbWVudC1zZW5kX190ZXh0YXJlYScpO1xyXG5cclxuICAgIHRoaXMuZ2hvc3QgPSB0aGlzLmNvbW1lbnRzV3JhcHBlci5xdWVyeVNlbGVjdG9yKCcuY29tbWVudCcpO1xyXG5cclxuICAgIGlmICh0aGlzLmxvZ2dlZFVzZXJWaWV3TW9kZWwpIHtcclxuICAgICAgICB0aGlzLmNvbW1lbnRTZW5kZXJFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50X19hdmF0YXInKS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCcke3RoaXMubG9nZ2VkVXNlclZpZXdNb2RlbC5hdmF0YXJVcmxzLm1lZGl1bX0nKWA7XHJcbiAgICAgICAgdGhpcy5jb21tZW50U2VuZGVyRWxlbS5xdWVyeVNlbGVjdG9yKCcuY29tbWVudF9fdXNlcm5hbWUnKS50ZXh0Q29udGVudCA9IHRoaXMubG9nZ2VkVXNlclZpZXdNb2RlbC51c2VybmFtZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jb21tZW50U2VuZGVyRWxlbS5xdWVyeVNlbGVjdG9yKCcuY29tbWVudF9fYXZhdGFyJykuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgnJHtBTk9OX0FWQVRBUl9VUkx9JylgO1xyXG4gICAgICAgIHRoaXMuY29tbWVudFNlbmRlckVsZW0ucXVlcnlTZWxlY3RvcignLmNvbW1lbnRfX3VzZXJuYW1lJykudGV4dENvbnRlbnQgPSBBTk9OX05BTUU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jb21tZW50U2VuZGVyRWxlbS5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgaWYgKCFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2NvbW1lbnQtc2VuZF9fc2VuZC1idXR0b24nKSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgaW52b2x2ZWRJbWFnZUlkID0gdGhpcy5pbWFnZUlkO1xyXG4gICAgICAgIGxldCB0ZXh0ID0gdGhpcy5jb21tZW50U2VuZFRleHRhcmVhLnZhbHVlO1xyXG4gICAgICAgIGlmICh0ZXh0Lmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgcmVxdWlyZShMSUJTICsgJ3NlbmRSZXF1ZXN0Jykoe1xyXG4gICAgICAgICAgICAgICAgaWQ6IGludm9sdmVkSW1hZ2VJZCxcclxuICAgICAgICAgICAgICAgIHRleHRcclxuICAgICAgICAgICAgfSwgJ1BPU1QnLCAnL2NvbW1lbnQnLCAoZXJyLCByZXNwb25zZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY29tbWVudFNlbmRUZXh0YXJlYS52YWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaW1hZ2VJZCA9PT0gaW52b2x2ZWRJbWFnZUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnNlcnROZXdDb21tZW50KHJlc3BvbnNlLnZpZXdNb2RlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxUb0JvdHRvbSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlcignY29tbWVudC1zZWN0aW9uX2NoYW5nZWQnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VJZDogaW52b2x2ZWRJbWFnZUlkXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5lbGVtLm9uY2xpY2sgPSBlID0+IHtcclxuICAgICAgICBpZiAoIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnY29tbWVudF9fY2xvc2UtYnV0dG9uJykpIHJldHVybjtcclxuXHJcbiAgICAgICAgbGV0IGNvbW1lbnQgPSBlLnRhcmdldC5jbG9zZXN0KCcuY29tbWVudCcpO1xyXG4gICAgICAgIGxldCBjb21tZW50SWQgPSBjb21tZW50LmRhdGFzZXQuaWQ7XHJcbiAgICAgICAgbGV0IGludm9sdmVkSW1hZ2VJZCA9IHRoaXMuaW1hZ2VJZDtcclxuXHJcbiAgICAgICAgcmVxdWlyZShMSUJTICsgJ3NlbmRSZXF1ZXN0Jykoe1xyXG4gICAgICAgICAgICBpZDogY29tbWVudElkXHJcbiAgICAgICAgfSwgJ0RFTEVURScsICcvY29tbWVudCcsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCdjb21tZW50LXNlY3Rpb25fY2hhbmdlZCcsIHtcclxuICAgICAgICAgICAgICAgIGltYWdlSWQ6IGludm9sdmVkSW1hZ2VJZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29tbWVudC5yZW1vdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG59O1xyXG5cclxuQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlLnNjcm9sbFRvQm90dG9tID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5jb21tZW50c1dyYXBwZXIuc2Nyb2xsVG9wID0gdGhpcy5jb21tZW50c1dyYXBwZXIuc2Nyb2xsSGVpZ2h0O1xyXG59O1xyXG5cclxuQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlLmluc2VydE5ld0NvbW1lbnQgPSBmdW5jdGlvbiAodmlld01vZGVsKSB7XHJcbiAgICBsZXQgbmV3Q29tbWVudCA9IHRoaXMuZ2hvc3QuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgbmV3Q29tbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjb21tZW50X2dob3N0Jyk7XHJcbiAgICBuZXdDb21tZW50LmRhdGFzZXQuaWQgPSB2aWV3TW9kZWwuX2lkO1xyXG4gICAgbmV3Q29tbWVudC5xdWVyeVNlbGVjdG9yKCcuY29tbWVudF9fcmVmJykuc2V0QXR0cmlidXRlKCdocmVmJywgdmlld01vZGVsLmNvbW1lbnRhdG9yLnVybCk7XHJcbiAgICBuZXdDb21tZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50X19hdmF0YXInKS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPVxyXG4gICAgICAgIGB1cmwoJyR7dmlld01vZGVsLmNvbW1lbnRhdG9yLmF2YXRhclVybHMubWVkaXVtfScpYDtcclxuICAgIG5ld0NvbW1lbnQucXVlcnlTZWxlY3RvcignLmNvbW1lbnRfX3VzZXJuYW1lJykudGV4dENvbnRlbnQgPSB2aWV3TW9kZWwuY29tbWVudGF0b3IudXNlcm5hbWU7XHJcbiAgICBuZXdDb21tZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50X19kYXRlJykudGV4dENvbnRlbnQgPSB2aWV3TW9kZWwuY3JlYXRlRGF0ZVN0cjtcclxuXHJcbiAgICBpZiAoIXZpZXdNb2RlbC5pc093bkNvbW1lbnQpXHJcbiAgICAgICAgbmV3Q29tbWVudC5jbGFzc0xpc3QuYWRkKCdjb21tZW50X25vdC1vd24nKTtcclxuICAgIGVsc2VcclxuICAgICAgICBuZXdDb21tZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NvbW1lbnRfbm90LW93bicpO1xyXG5cclxuICAgIG5ld0NvbW1lbnQucXVlcnlTZWxlY3RvcignLmNvbW1lbnRfX3RleHQnKS50ZXh0Q29udGVudCA9IHZpZXdNb2RlbC50ZXh0O1xyXG4gICAgdGhpcy5jb21tZW50c1dyYXBwZXIuYXBwZW5kQ2hpbGQobmV3Q29tbWVudCk7XHJcblxyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbW1lbnQtc2VjdGlvbl9uby1jb21tZW50cycpO1xyXG59O1xyXG5cclxuXHJcbkNvbW1lbnRTZWN0aW9uLnByb3RvdHlwZS5zZXRJbWFnZUlkID0gZnVuY3Rpb24gKGltYWdlSWQpIHtcclxuICAgIHRoaXMuaW1hZ2VJZCA9IGltYWdlSWQ7XHJcbn07XHJcblxyXG5Db21tZW50U2VjdGlvbi5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHZpZXdNb2RlbHMpIHtcclxuICAgIHRoaXMuY2xlYXIoKTtcclxuXHJcbiAgICBpZiAodmlld01vZGVscy5sZW5ndGggPiAwKVxyXG4gICAgICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdjb21tZW50LXNlY3Rpb25fbm8tY29tbWVudHMnKTtcclxuXHJcbiAgICB2aWV3TW9kZWxzLmZvckVhY2godmlld01vZGVsID0+IHtcclxuICAgICAgICB0aGlzLmluc2VydE5ld0NvbW1lbnQodmlld01vZGVsKTtcclxuICAgIH0pO1xyXG5cclxufTtcclxuXHJcbkNvbW1lbnRTZWN0aW9uLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB0aGlzLmNvbW1lbnRzV3JhcHBlci5pbm5lckhUTUwgPSAnJztcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdjb21tZW50LXNlY3Rpb25fbm8tY29tbWVudHMnKTtcclxufTtcclxuXHJcblxyXG5mb3IgKGxldCBrZXkgaW4gZXZlbnRNaXhpbilcclxuICAgIENvbW1lbnRTZWN0aW9uLnByb3RvdHlwZVtrZXldID0gZXZlbnRNaXhpbltrZXldO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb21tZW50U2VjdGlvbjtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9jb21tZW50LXNlY3Rpb24vaW5kZXguanMiLCJsZXQgU3dpdGNoQnV0dG9uID0gcmVxdWlyZShCTE9DS1MgKyAnc3dpdGNoLWJ1dHRvbicpO1xyXG5cclxubGV0IExpa2VCdXR0b24gPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgU3dpdGNoQnV0dG9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblxyXG4gICAgdGhpcy5saWtlQW1vdW50ID0gK3RoaXMuZWxlbS5kYXRhc2V0Lmxpa2VBbW91bnQ7XHJcbiAgICB0aGlzLmxpa2VBbW91bnRFbGVtID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5saWtlLWJ1dHRvbl9fbGlrZS1hbW91bnQnKTtcclxuXHJcblxyXG4gICAgdGhpcy51cmwgPSAnL2xpa2UnO1xyXG5cclxuXHJcblxyXG59O1xyXG5MaWtlQnV0dG9uLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoU3dpdGNoQnV0dG9uLnByb3RvdHlwZSk7XHJcbkxpa2VCdXR0b24ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTGlrZUJ1dHRvbjtcclxuXHJcbkxpa2VCdXR0b24ucHJvdG90eXBlLnNldEFtb3VudCA9IGZ1bmN0aW9uIChsaWtlQW1vdW50KSB7XHJcbiAgICB0aGlzLmxpa2VBbW91bnQgPSBsaWtlQW1vdW50O1xyXG4gICAgdGhpcy5saWtlQW1vdW50RWxlbS50ZXh0Q29udGVudCA9IGxpa2VBbW91bnQ7XHJcbn07XHJcblxyXG5MaWtlQnV0dG9uLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgdGhpcy5zZXRBbW91bnQob3B0aW9ucy5saWtlQW1vdW50KTtcclxuICAgIFN3aXRjaEJ1dHRvbi5wcm90b3R5cGUuc2V0LmNhbGwodGhpcywgb3B0aW9ucyk7XHJcbn07XHJcblxyXG5MaWtlQnV0dG9uLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5hY3RpdmUpXHJcbiAgICAgICAgdGhpcy5zZXQoe2FjdGl2ZTogZmFsc2UsIGxpa2VBbW91bnQ6IHRoaXMubGlrZUFtb3VudCAtIDF9KTtcclxuICAgIGVsc2VcclxuICAgICAgICB0aGlzLnNldCh7YWN0aXZlOiB0cnVlLCBsaWtlQW1vdW50OiB0aGlzLmxpa2VBbW91bnQgKyAxfSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExpa2VCdXR0b247XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvbGlrZS1idXR0b24vaW5kZXguanMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBOzs7QUFFQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBOzs7Ozs7Ozs7QUN0UUE7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDYkE7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7O0FBRUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0NBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7Ozs7Ozs7Ozs7O0FDenVCQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7OztBQUVBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTs7Ozs7Ozs7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQ0hBOzs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBOzs7Ozs7Ozs7O0FDdEdBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFBQTs7Ozs7Ozs7O0FDL0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTs7Ozs7Iiwic291cmNlUm9vdCI6IiJ9