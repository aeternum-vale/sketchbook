webpackJsonp([3,13],{

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

/***/ 25:
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

/***/ 30:
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

/***/ 31:
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

/***/ 32:
/***/ (function(module, exports) {

	module.exports = "<div id=\"image\" class=\"modal image_img-element-invisible image image_no-description\">\r\n    <div class=\"image__image-wrapper\">\r\n        <div id=\"spinner\" class=\"spinner image__spinner\">\r\n        \r\n        </div>        <img class=\"image__img-element\">\r\n        <div class=\"image__controls\">\r\n            <div class=\"image__control image__control-prev icon-arrow-left\"></div>\r\n            <div class=\"image__control image__control-full icon-arrow-maximise\"></div>\r\n            <div class=\"image__control image__control-next icon-arrow-right\"></div>\r\n        </div>\r\n    </div>\r\n    <div class=\"image__sidebar\">\r\n        <div class=\"image__top-side\">\r\n            <div class=\"header image__header\">\r\n                <a class=\"image__header-left-side\" href=\"\">\r\n                    <div class=\"image__avatar\"\r\n                         style=\"background-image: url('')\"></div>\r\n                    <div class=\"image__metadata\">\r\n                        <div class=\"image__username\"></div>\r\n                        <div class=\"image__post-date\"></div>\r\n                    </div>\r\n                </a>\r\n\r\n                <div class=\"button button_invisible image__top-side-button image__delete-button button_header-style\">\r\n                    delete\r\n                </div>\r\n                <div\r\n                    class=\"button image__top-side-button image__subscribe-button button_header-style\"\r\n                >\r\n                    subscribe\r\n                </div>\r\n            </div>\r\n\r\n\r\n            <div class=\"image__info-board\">\r\n\r\n                <div\r\n                \r\n                     class=\"button like-button image__like-button\">\r\n                    <div class=\"like-button__heart icon-heart\"></div>\r\n                    <div class=\"like-button__heart icon-heart-outlined\"></div>\r\n                    &nbsp;like&nbsp;\r\n                    <span class=\"like-button__like-amount\"></span>\r\n                </div>\r\n                <div class=\"image__description\">\r\n                    \r\n                </div>\r\n\r\n            </div>\r\n\r\n\r\n            <div class=\"image__comment-section-wrapper image_no-scrollbar\">\r\n                <div class=\"comment-section image__comment-section\">\r\n                    <div class=\"comment-section__no-comments-block\">\r\n                        There are no comments yet\r\n                    </div>\r\n                    <div class=\"comment-section__comments-wrapper\">\r\n\r\n                            <div class=\"panel comment comment-section__comment comment_ghost\" data-id=\"\">\r\n                                <div class=\"comment__top-side\">\r\n                                    <a class=\"comment__ref\" href=\"\">\r\n                                        <div class=\"comment__avatar\" style=\"background-image: url('')\"></div>\r\n                                        <div class=\"comment__metadata\">\r\n                                            <div class=\"comment__username\"></div>\r\n                                            <div class=\"comment__date\"></div>\r\n                                        </div>\r\n                                    </a>\r\n                                    <div class=\"comment__close-button icon-cross\"></div>\r\n                                </div>\r\n                                <div class=\"comment__text\"></div>\r\n                            </div>\r\n\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"image__comment-section-scrollbar-wrapper image_no-scrollbar\">\r\n                <div class=\"image__comment-section-scrollbar-offset\"></div>\r\n                <div class=\"image__comment-section-scrollbar\">\r\n                    <div class=\"image__comment-section-slider\"></div>\r\n                </div>\r\n\r\n            </div>\r\n\r\n        </div>\r\n\r\n        <div class=\"panel comment comment-send image__comment-send\"\r\n             data-image-id=\"\">\r\n            <div class=\"comment__top-side\">\r\n                <div class=\"comment__avatar\"></div>\r\n                <div class=\"comment__username\"></div>\r\n            </div>\r\n\r\n            <textarea placeholder=\"share your opinion…\" class=\"comment-send__textarea\"></textarea>\r\n            <div class=\"button comment-send__send-button\">send</div>\r\n        </div>\r\n    </div>\r\n    <div class=\"image__modal-close-button-wrapper\">\r\n        <div class=\"icon-cross modal-close-button image__modal-close-button\"></div>    </div>\r\n\r\n</div>\r\n\r\n";

/***/ }),

/***/ 33:
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

/***/ 34:
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

/***/ 35:
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

/***/ })

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMy4zLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2NvbXBvbmVudEVycm9ycy5qcz9hY2I1KiIsIndlYnBhY2s6Ly8vRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvc2VuZFJlcXVlc3QuanM/OGEyNyIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2dhbGxlcnkvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9zd2l0Y2gtYnV0dG9uL2luZGV4LmpzIiwid2VicGFjazovLy8uLi9ibG9ja3MvZ2FsbGVyeS93aW5kb3ciLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9pbWFnZS1jb21tZW50LXNlY3Rpb24vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9jb21tZW50LXNlY3Rpb24vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9saWtlLWJ1dHRvbi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBDdXN0b21FcnJvcihtZXNzYWdlKSB7XHJcblx0dGhpcy5uYW1lID0gXCJDdXN0b21FcnJvclwiO1xyXG5cdHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcblxyXG5cdGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSlcclxuXHRcdEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIEN1c3RvbUVycm9yKTtcclxuXHRlbHNlXHJcblx0XHR0aGlzLnN0YWNrID0gKG5ldyBFcnJvcigpKS5zdGFjaztcclxufVxyXG5DdXN0b21FcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XHJcbkN1c3RvbUVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEN1c3RvbUVycm9yO1xyXG5cclxuXHJcbmZ1bmN0aW9uIENvbXBvbmVudEVycm9yKG1lc3NhZ2UsIHN0YXR1cykge1xyXG5cdEN1c3RvbUVycm9yLmNhbGwodGhpcywgbWVzc2FnZSB8fCAnQW4gZXJyb3IgaGFzIG9jY3VycmVkJyApO1xyXG5cdHRoaXMubmFtZSA9IFwiQ29tcG9uZW50RXJyb3JcIjtcclxuXHR0aGlzLnN0YXR1cyA9IHN0YXR1cztcclxufVxyXG5Db21wb25lbnRFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEN1c3RvbUVycm9yLnByb3RvdHlwZSk7XHJcbkNvbXBvbmVudEVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENvbXBvbmVudEVycm9yO1xyXG5cclxuZnVuY3Rpb24gQ2xpZW50RXJyb3IobWVzc2FnZSwgZGV0YWlsLCBzdGF0dXMpIHtcclxuXHRDb21wb25lbnRFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ0FuIGVycm9yIGhhcyBvY2N1cnJlZC4gQ2hlY2sgaWYgamF2YXNjcmlwdCBpcyBlbmFibGVkJywgc3RhdHVzKTtcclxuXHR0aGlzLm5hbWUgPSBcIkNsaWVudEVycm9yXCI7XHJcblx0dGhpcy5kZXRhaWwgPSBkZXRhaWw7XHJcbn1cclxuQ2xpZW50RXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb21wb25lbnRFcnJvci5wcm90b3R5cGUpO1xyXG5DbGllbnRFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDbGllbnRFcnJvcjtcclxuXHJcblxyXG5mdW5jdGlvbiBJbWFnZU5vdEZvdW5kKG1lc3NhZ2UpIHtcclxuICAgIENsaWVudEVycm9yLmNhbGwodGhpcywgbWVzc2FnZSB8fCAnSW1hZ2Ugbm90IGZvdW5kLiBJdCBwcm9iYWJseSBoYXMgYmVlbiByZW1vdmVkJywgbnVsbCwgNDA0KTtcclxuICAgIHRoaXMubmFtZSA9IFwiSW1hZ2VOb3RGb3VuZFwiO1xyXG59XHJcbkltYWdlTm90Rm91bmQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDbGllbnRFcnJvci5wcm90b3R5cGUpO1xyXG5JbWFnZU5vdEZvdW5kLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEltYWdlTm90Rm91bmQ7XHJcblxyXG5mdW5jdGlvbiBTZXJ2ZXJFcnJvcihtZXNzYWdlLCBzdGF0dXMpIHtcclxuXHRDb21wb25lbnRFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ1RoZXJlIGlzIHNvbWUgZXJyb3Igb24gdGhlIHNlcnZlciBzaWRlJywgc3RhdHVzKTtcclxuXHR0aGlzLm5hbWUgPSBcIlNlcnZlckVycm9yXCI7XHJcbn1cclxuU2VydmVyRXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb21wb25lbnRFcnJvci5wcm90b3R5cGUpO1xyXG5TZXJ2ZXJFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTZXJ2ZXJFcnJvcjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdENvbXBvbmVudEVycm9yLFxyXG5cdENsaWVudEVycm9yLFxyXG4gICAgSW1hZ2VOb3RGb3VuZCxcclxuXHRTZXJ2ZXJFcnJvclxyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvY29tcG9uZW50RXJyb3JzLmpzIiwibGV0IFNlcnZlckVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLlNlcnZlckVycm9yO1xyXG5sZXQgQ2xpZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ2xpZW50RXJyb3I7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChib2R5T2JqLCBtZXRob2QsIHVybCwgY2IpIHtcclxuXHJcblxyXG4gICAgbGV0IGJvZHkgPSAnJztcclxuICAgIGlmICghKHR5cGVvZiBib2R5T2JqID09PSAnc3RyaW5nJykpIHtcclxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gYm9keU9iaikge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSAnJztcclxuICAgICAgICAgICAgaWYgKGJvZHlPYmpba2V5XSlcclxuICAgICAgICAgICAgICAgIHZhbHVlID0ga2V5ICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KCh0eXBlb2YgYm9keU9ialtrZXldID09PSAnb2JqZWN0JykgPyBKU09OLnN0cmluZ2lmeShib2R5T2JqW2tleV0pIDogYm9keU9ialtrZXldKTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgYm9keSArPSAoYm9keSA9PT0gJycgPyAnJyA6ICcmJykgKyB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2VcclxuICAgICAgICBib2R5ID0gYm9keU9iajtcclxuXHJcblxyXG4gICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgeGhyLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xyXG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcclxuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiWC1SZXF1ZXN0ZWQtV2l0aFwiLCBcIlhNTEh0dHBSZXF1ZXN0XCIpO1xyXG5cclxuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSAhPSA0KSByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCByZXNwb25zZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucmVzcG9uc2VUZXh0KVxyXG4gICAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjYihuZXcgU2VydmVyRXJyb3IoJ1NlcnZlciBpcyBub3QgcmVzcG9uZGluZycpKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMClcclxuICAgICAgICAgICAgY2IobnVsbCwgcmVzcG9uc2UpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPj0gNDAwICYmIHRoaXMuc3RhdHVzIDwgNTAwKVxyXG4gICAgICAgICAgICBjYihuZXcgQ2xpZW50RXJyb3IocmVzcG9uc2UubWVzc2FnZSwgcmVzcG9uc2UuZGV0YWlsLCB0aGlzLnN0YXR1cykpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPj0gNTAwKVxyXG4gICAgICAgICAgICBjYihuZXcgU2VydmVyRXJyb3IocmVzcG9uc2UubWVzc2FnZSwgdGhpcy5zdGF0dXMpKTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc29sZS5sb2coYHNlbmRpbmcgbmV4dCByZXF1ZXN0OiAke2JvZHl9YCk7XHJcbiAgICB4aHIuc2VuZChib2R5KTtcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL3NlbmRSZXF1ZXN0LmpzIiwibGV0IGV2ZW50TWl4aW4gPSByZXF1aXJlKExJQlMgKyAnZXZlbnRNaXhpbicpO1xyXG5sZXQgQ2xpZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ2xpZW50RXJyb3I7XHJcbmxldCBJbWFnZU5vdEZvdW5kID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLkltYWdlTm90Rm91bmQ7XHJcbmxldCBNb2RhbCA9IHJlcXVpcmUoQkxPQ0tTICsgJ21vZGFsJyk7XHJcbmxldCBTd2l0Y2hCdXR0b24gPSByZXF1aXJlKEJMT0NLUyArICdzd2l0Y2gtYnV0dG9uJyk7XHJcblxyXG5cclxubGV0IEdhbGxlcnkgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgTW9kYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgIHRoaXMuc3RhdHVzID0gTW9kYWwuc3RhdHVzZXMuTUFKT1I7XHJcblxyXG4gICAgdGhpcy5nYWxsZXJ5ID0gb3B0aW9ucy5nYWxsZXJ5O1xyXG4gICAgdGhpcy5lbGVtID0gb3B0aW9ucy5lbGVtO1xyXG4gICAgdGhpcy5pc0xvZ2dlZCA9IG9wdGlvbnMuaXNMb2dnZWQ7XHJcbiAgICB0aGlzLnByZWxvYWRFbnRpdHlDb3VudCA9IG9wdGlvbnMucHJlbG9hZEVudGl0eUNvdW50O1xyXG4gICAgdGhpcy5pc0ZlZWQgPSBvcHRpb25zLmlzRmVlZCB8fCBmYWxzZTtcclxuICAgIHRoaXMudXNlclN1YnNjcmliZUJ1dHRvbiA9IG9wdGlvbnMudXNlclN1YnNjcmliZUJ1dHRvbjtcclxuXHJcbiAgICB0aGlzLnZpZXdNb2RlbHMgPSB7fTtcclxuICAgIHRoaXMuZ2FsbGVyeUFycmF5ID0gbnVsbDtcclxuICAgIHRoaXMuY3VycmVudEltYWdlSWQgPSBudWxsO1xyXG5cclxuICAgIHRoaXMubG9nZ2VkVXNlclZpZXdNb2RlbCA9IG51bGw7XHJcbiAgICB0aGlzLmlzRW1iZWRkZWQgPSAhIXRoaXMuZ2FsbGVyeTtcclxuICAgIHRoaXMucHJlbG9hZGVkSW1hZ2VzID0ge307XHJcblxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdjdXJyZW50Vmlld01vZGVsJywge1xyXG4gICAgICAgIGdldDogKCkgPT4gdGhpcy52aWV3TW9kZWxzW3RoaXMuY3VycmVudEltYWdlSWRdXHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gdGhpcy5wcmVsb2FkRW50aXR5Q291bnQ7IGkrKykge1xyXG4gICAgICAgIHRoaXMucHJlbG9hZGVkSW1hZ2VzW2ldID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgdGhpcy5wcmVsb2FkZWRJbWFnZXNbLWldID0gbmV3IEltYWdlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgZSA9PiB7XHJcbiAgICAgICAgdGhpcy5vblBvcFN0YXRlKGUuc3RhdGUpO1xyXG4gICAgfSwgZmFsc2UpO1xyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBlID0+IHtcclxuICAgICAgICB0aGlzLm9uUmVzaXplKCk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgdGhpcy5wdXNoR2FsbGVyeVN0YXRlKCk7XHJcblxyXG4gICAgaWYgKHRoaXMuaXNFbWJlZGRlZClcclxuICAgICAgICB0aGlzLnNldEdhbGxlcnkob3B0aW9ucyk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5zaG93KCt0aGlzLmVsZW0uZGF0YXNldC5pZCkuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yKGVycik7XHJcbiAgICAgICAgfSk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoTW9kYWwucHJvdG90eXBlKTtcclxuR2FsbGVyeS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBHYWxsZXJ5O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUub25SZXNpemUgPSBmdW5jdGlvbigpIHtcclxuICAgIC8vIGNvbnN0IEdMT0JBTF9TTUFMTF9TQ1JFRU5fV0lEVEggPSA3MDA7XHJcbiAgICAvLyBpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIDw9IEdMT0JBTF9TTUFMTF9TQ1JFRU5fV0lEVEgpXHJcbiAgICAvLyAgICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ2ltYWdlX3NtYWxsJyk7XHJcbiAgICAvLyBlbHNlXHJcbiAgICAvLyAgICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2ltYWdlX3NtYWxsJyk7XHJcbiAgICAvL1xyXG4gICAgLy8gdGhpcy5yZXNpemVJbWFnZSgpO1xyXG4gICAgdGhpcy5jb21tZW50U2VjdGlvbiAmJiB0aGlzLmNvbW1lbnRTZWN0aW9uLnVwZGF0ZSgpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUub25HYWxsZXJ5Q2xpY2sgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgbGV0IHRhcmdldDtcclxuICAgIGlmICghKHRhcmdldCA9IGUudGFyZ2V0LmNsb3Nlc3QoJy5pbWFnZS1wcmV2aWV3JykpKSByZXR1cm47XHJcblxyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgbGV0IGltYWdlSWQgPSArdGFyZ2V0LmRhdGFzZXQuaWQ7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuYWN0aXZhdGUoe2ltYWdlSWR9KTtcclxufTtcclxuXHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5zZXRHYWxsZXJ5ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIHRoaXMucHVibGljYXRpb25OdW1iZXJFbGVtID0gb3B0aW9ucy5wdWJsaWNhdGlvbk51bWJlckVsZW07XHJcbiAgICB0aGlzLmltYWdlUHJldmlld0dob3N0ID0gdGhpcy5nYWxsZXJ5LnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZS1wcmV2aWV3Jyk7XHJcbiAgICB0aGlzLmdhbGxlcnlXcmFwcGVyID0gdGhpcy5nYWxsZXJ5LnF1ZXJ5U2VsZWN0b3IoJy5nYWxsZXJ5X193cmFwcGVyJyk7XHJcblxyXG4gICAgdGhpcy5nYWxsZXJ5Lm9uY2xpY2sgPSBlID0+IHtcclxuICAgICAgICB0aGlzLm9uR2FsbGVyeUNsaWNrKGUpO1xyXG4gICAgfTtcclxufTtcclxuXHJcbi8vVE9ETyBBTEVSVCBJRiBJVCBET0VTTidUIEFCTEUgVE8gRE9XTkxPQUQgTU9EQUwgTUVTU0FHRSBXSU5ET1dcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnNldEVsZW0gPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHJcbiAgICAgICAgdGhpcy5pc0VsZW1TZXR0ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuZWxlbSlcclxuICAgICAgICAgICAgdGhpcy5lbGVtID0gdGhpcy5yZW5kZXJXaW5kb3cocmVxdWlyZShgaHRtbC1sb2FkZXIhLi93aW5kb3dgKSk7XHJcblxyXG4gICAgICAgIHRoaXMuaW1nRWxlbSA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCdpbWcuaW1hZ2VfX2ltZy1lbGVtZW50Jyk7XHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2Rlc2NyaXB0aW9uJyk7XHJcbiAgICAgICAgdGhpcy5kYXRlID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fcG9zdC1kYXRlJyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZVdyYXBwZXIgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX19pbWFnZS13cmFwcGVyJyk7XHJcbiAgICAgICAgdGhpcy5zaWRlQmFyID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fc2lkZWJhcicpO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlQnV0dG9uRWxlbSA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2RlbGV0ZS1idXR0b24nKTtcclxuICAgICAgICB0aGlzLnN1YnNjcmliZUJ1dHRvbkVsZW0gPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX19zdWJzY3JpYmUtYnV0dG9uJyk7XHJcbiAgICAgICAgdGhpcy5hdmF0YXIgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX19hdmF0YXInKTtcclxuICAgICAgICB0aGlzLnVzZXJuYW1lID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fdXNlcm5hbWUnKTtcclxuICAgICAgICB0aGlzLmhlYWRlckxlZnRTaWRlID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9faGVhZGVyLWxlZnQtc2lkZScpO1xyXG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkJ1dHRvbiA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2NvbnRyb2wtZnVsbCcpO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5pbWdFbGVtLm9ubG9hZCA9IGUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJlc2l6ZUltYWdlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd0ltZ0VsZW0oKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmVsZW0ub25jbGljayA9IGUgPT4ge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5vbkVsZW1DbGljayhlKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldC5tYXRjaGVzKCcuaW1hZ2VfX21vZGFsLWNsb3NlLWJ1dHRvbi13cmFwcGVyJykpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldC5tYXRjaGVzKCcuaW1hZ2VfX2NvbnRyb2wtcHJldicpKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zd2l0Y2hUb1ByZXYoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldC5tYXRjaGVzKCcuaW1hZ2VfX2NvbnRyb2wtbmV4dCcpKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zd2l0Y2hUb05leHQoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldCA9PT0gdGhpcy5mdWxsc2NyZWVuQnV0dG9uKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zd2l0Y2hGdWxsc2NyZWVuKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZS50YXJnZXQubWF0Y2hlcygnLmltYWdlX19jbG9zZS1zcGFjZScpIHx8IGUudGFyZ2V0Lm1hdGNoZXMoJy5pbWFnZV9fY2xvc2UtYnV0dG9uJykpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgbGV0IENvbW1lbnRTZWN0aW9uID0gcmVxdWlyZShCTE9DS1MgKyAnaW1hZ2UtY29tbWVudC1zZWN0aW9uJyk7XHJcbiAgICAgICAgbGV0IExpa2VCdXR0b24gPSByZXF1aXJlKEJMT0NLUyArICdsaWtlLWJ1dHRvbicpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbW1lbnRTZWN0aW9uID0gbmV3IENvbW1lbnRTZWN0aW9uKHtcclxuICAgICAgICAgICAgZWxlbTogdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50LXNlY3Rpb24nKSxcclxuICAgICAgICAgICAgY29tbWVudFNlbmRlckVsZW06IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuY29tbWVudC1zZW5kJyksXHJcbiAgICAgICAgICAgIGltYWdlSWQ6IHRoaXMuY3VycmVudEltYWdlSWQsXHJcbiAgICAgICAgICAgIGxvZ2dlZFVzZXJWaWV3TW9kZWw6IHRoaXMubG9nZ2VkVXNlclZpZXdNb2RlbCxcclxuXHJcbiAgICAgICAgICAgIGNvbW1lbnRTZWN0aW9uV3JhcHBlcjogdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fY29tbWVudC1zZWN0aW9uLXdyYXBwZXInKSxcclxuICAgICAgICAgICAgaW5mb0JvYXJkOiB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX19pbmZvLWJvYXJkJyksXHJcbiAgICAgICAgICAgIHNjcm9sbGJhcldyYXBwZXI6IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2NvbW1lbnQtc2VjdGlvbi1zY3JvbGxiYXItd3JhcHBlcicpXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29tbWVudFNlY3Rpb24ub24oJ2NvbW1lbnQtc2VjdGlvbl9jaGFuZ2VkJywgZSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpbWFnZUlkID0gZS5kZXRhaWwuaW1hZ2VJZDtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGVWaWV3TW9kZWwoaW1hZ2VJZCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdFZpZXdNb2RlbChpbWFnZUlkKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ29tbWVudHMoaW1hZ2VJZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmxpa2VCdXR0b24gPSBuZXcgTGlrZUJ1dHRvbih7XHJcbiAgICAgICAgICAgIGVsZW06IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcubGlrZS1idXR0b24nKSxcclxuICAgICAgICAgICAgZGF0YTogdGhpcy5jdXJyZW50SW1hZ2VJZFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmxpa2VCdXR0b24ub24oJ3N3aXRjaC1idXR0b25fY2hhbmdlZCcsIGUgPT4ge1xyXG4gICAgICAgICAgICBsZXQgaW1hZ2VJZCA9IGUuZGV0YWlsLmltYWdlSWQ7XHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlVmlld01vZGVsKGltYWdlSWQpO1xyXG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RWaWV3TW9kZWwoaW1hZ2VJZCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUxpa2VzKGltYWdlSWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5vblJlc2l6ZSgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc0xvZ2dlZCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50Vmlld01vZGVsLmlzT3duSW1hZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RGVsZXRlQnV0dG9uKCk7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlLmVuc3VyZShbQkxPQ0tTICsgJ2RlbGV0ZS1pbWFnZS1idXR0b24nXSwgcmVxdWlyZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IERlbGV0ZUltYWdlQnV0dG9uID0gcmVxdWlyZShCTE9DS1MgKyAnZGVsZXRlLWltYWdlLWJ1dHRvbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlQnV0dG9uID0gbmV3IERlbGV0ZUltYWdlQnV0dG9uKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbTogdGhpcy5kZWxldGVCdXR0b25FbGVtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZUlkOiB0aGlzLmN1cnJlbnRJbWFnZUlkXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxldGVCdXR0b24ub24oJ2RlbGV0ZS1pbWFnZS1idXR0b25faW1hZ2UtZGVsZXRlZCcsIGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW52b2x2ZWRJbWFnZUlkID0gZS5kZXRhaWwuaW1hZ2VJZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxldGVWaWV3TW9kZWwoaW52b2x2ZWRJbWFnZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVGcm9tR2FsbGVyeUFycmF5KGludm9sdmVkSW1hZ2VJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlSW1hZ2VQcmV2aWV3KGludm9sdmVkSW1hZ2VJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRJbWFnZUlkID09PSBpbnZvbHZlZEltYWdlSWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN3aXRjaFRvTmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZS5lbnN1cmUoW0JMT0NLUyArICdzdWJzY3JpYmUtYnV0dG9uJ10sIHJlcXVpcmUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBTdWJzY3JpYmVCdXR0b24gPSByZXF1aXJlKEJMT0NLUyArICdzdWJzY3JpYmUtYnV0dG9uJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVCdXR0b24gPSBuZXcgU3Vic2NyaWJlQnV0dG9uKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbTogdGhpcy5zdWJzY3JpYmVCdXR0b25FbGVtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0aGlzLmN1cnJlbnRJbWFnZUlkXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnVzZXJTdWJzY3JpYmVCdXR0b24pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFN3aXRjaEJ1dHRvbi5zZXRSZWxhdGlvbih0aGlzLnN1YnNjcmliZUJ1dHRvbiwgdGhpcy51c2VyU3Vic2NyaWJlQnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVCdXR0b24ub24oJ3N3aXRjaC1idXR0b25fY2hhbmdlZCcsIGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW52b2x2ZWRJbWFnZUlkID0gZS5kZXRhaWwuaW1hZ2VJZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzRmVlZCAmJiBpbnZvbHZlZEltYWdlSWQgPT09IHRoaXMuY3VycmVudEltYWdlSWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXdNb2RlbHMgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3Vic2NyaWJlQnV0dG9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVCdXR0b24uc2V0KHthY3RpdmU6IHRoaXMuY3VycmVudFZpZXdNb2RlbC5hdXRob3IuaXNOYXJyYXRvcn0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlQnV0dG9uRWxlbS5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yKG5ldyBDbGllbnRFcnJvcihudWxsLCBudWxsLCA0MDEpKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSk7XHJcblxyXG59O1xyXG5cclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnN3aXRjaEZ1bGxzY3JlZW4gPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgZnVuY3Rpb24gZ29GdWxsc2NyZWVuKGVsZW1lbnQpIHtcclxuICAgICAgICBpZiAoZWxlbWVudC5yZXF1ZXN0RnVsbHNjcmVlbikge1xyXG4gICAgICAgICAgICBlbGVtZW50LnJlcXVlc3RGdWxsc2NyZWVuKCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4oKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQubW96UmVxdWVzdEZ1bGxzY3JlZW4pIHtcclxuICAgICAgICAgICAgZWxlbWVudC5tb3pSZXF1ZXN0RnVsbHNjcmVlbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjYW5jZWxGdWxsc2NyZWVuKCkge1xyXG4gICAgICAgIGlmIChkb2N1bWVudC5leGl0RnVsbHNjcmVlbikge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5leGl0RnVsbHNjcmVlbigpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQud2Via2l0RXhpdEZ1bGxzY3JlZW4pIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQud2Via2l0RXhpdEZ1bGxzY3JlZW4oKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGRvY3VtZW50Lm1vekV4aXRGdWxsc2NyZWVuKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50Lm1vekV4aXRGdWxsc2NyZWVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBpZiAoIXRoaXMuaXNGdWxsc2NyZWVuKSB7XHJcbiAgICAgICAgZ29GdWxsc2NyZWVuKHRoaXMuaW1hZ2VXcmFwcGVyKTtcclxuICAgICAgICB0aGlzLmlzRnVsbHNjcmVlbiA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5mdWxsc2NyZWVuQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2ljb24tYXJyb3ctbWF4aW1pc2UnKTtcclxuICAgICAgICB0aGlzLmZ1bGxzY3JlZW5CdXR0b24uY2xhc3NMaXN0LmFkZCgnaWNvbi1hcnJvdy1taW5pbWlzZScpO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FuY2VsRnVsbHNjcmVlbigpO1xyXG4gICAgICAgIHRoaXMuaXNGdWxsc2NyZWVuID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5mdWxsc2NyZWVuQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2ljb24tYXJyb3ctbWF4aW1pc2UnKTtcclxuICAgICAgICB0aGlzLmZ1bGxzY3JlZW5CdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnaWNvbi1hcnJvdy1taW5pbWlzZScpO1xyXG4gICAgfVxyXG5cclxufTtcclxuXHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5zZXREZWxldGVCdXR0b24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmRlbGV0ZUJ1dHRvbkVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnYnV0dG9uX2ludmlzaWJsZScpO1xyXG4gICAgdGhpcy5zdWJzY3JpYmVCdXR0b25FbGVtLmNsYXNzTGlzdC5hZGQoJ2J1dHRvbl9pbnZpc2libGUnKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnNldFN1YnNjcmliZUJ1dHRvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuc3Vic2NyaWJlQnV0dG9uRWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdidXR0b25faW52aXNpYmxlJyk7XHJcbiAgICB0aGlzLmRlbGV0ZUJ1dHRvbkVsZW0uY2xhc3NMaXN0LmFkZCgnYnV0dG9uX2ludmlzaWJsZScpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUudXBkYXRlUHJlbG9hZGVkSW1hZ2VzQXJyYXkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSB0aGlzLnByZWxvYWRFbnRpdHlDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IG5leHRJZCA9IHRoaXMuZ2V0TmV4dEltYWdlSWQoaSk7XHJcbiAgICAgICAgbGV0IHByZXZJZCA9IHRoaXMuZ2V0TmV4dEltYWdlSWQoLWkpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy52aWV3TW9kZWxzW25leHRJZF0pXHJcbiAgICAgICAgICAgIHRoaXMucHJlbG9hZGVkSW1hZ2VzW2ldLnNldEF0dHJpYnV0ZSgnc3JjJywgdGhpcy52aWV3TW9kZWxzW25leHRJZF0uaW1nVXJsKTtcclxuICAgICAgICBpZiAodGhpcy52aWV3TW9kZWxzW3ByZXZJZF0pXHJcbiAgICAgICAgICAgIHRoaXMucHJlbG9hZGVkSW1hZ2VzWy1pXS5zZXRBdHRyaWJ1dGUoJ3NyYycsIHRoaXMudmlld01vZGVsc1twcmV2SWRdLmltZ1VybCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBsZXQgaW1hZ2VJZDtcclxuICAgIGxldCBub1B1c2hTdGF0ZTtcclxuXHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgIGltYWdlSWQgPSBhcmd1bWVudHNbMF07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGltYWdlSWQgPSBvcHRpb25zICYmIG9wdGlvbnMuaW1hZ2VJZDtcclxuICAgICAgICBub1B1c2hTdGF0ZSA9IG9wdGlvbnMgJiYgb3B0aW9ucy5ub1B1c2hTdGF0ZSB8fCBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc0VtYmVkZGVkKVxyXG4gICAgICAgICAgICBNb2RhbC5wcm90b3R5cGUuc2hvdy5hcHBseSh0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXF1ZXN0Vmlld01vZGVsKGltYWdlSWQpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRJbWFnZUlkID0gaW1hZ2VJZDtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc0VsZW1TZXR0ZWQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEVsZW0oKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUN1cnJlbnRWaWV3KGltYWdlSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdpbWFnZV9pbnZpc2libGUnKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIW5vUHVzaFN0YXRlICYmIGltYWdlSWQgPT09IHRoaXMuY3VycmVudEltYWdlSWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaEltYWdlU3RhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0QWxsTmVjZXNzYXJ5Vmlld01vZGVscygpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVByZWxvYWRlZEltYWdlc0FycmF5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUN1cnJlbnRWaWV3KGltYWdlSWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2ltYWdlX2ludmlzaWJsZScpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFub1B1c2hTdGF0ZSAmJiBpbWFnZUlkID09PSB0aGlzLmN1cnJlbnRJbWFnZUlkKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaEltYWdlU3RhdGUoKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdEFsbE5lY2Vzc2FyeVZpZXdNb2RlbHMoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVByZWxvYWRlZEltYWdlc0FycmF5KCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0pO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBsZXQgbm9QdXNoU3RhdGUgPSBvcHRpb25zICYmIG9wdGlvbnMubm9QdXNoU3RhdGU7XHJcbiAgICBpZiAoIXRoaXMuaXNFbWJlZGRlZClcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24gPSB0aGlzLmVsZW0uZGF0YXNldC5hdXRob3JVcmw7XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBNb2RhbC5wcm90b3R5cGUuaGlkZS5hcHBseSh0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ2ltYWdlX2ludmlzaWJsZScpO1xyXG5cclxuICAgICAgICBpZiAoIW5vUHVzaFN0YXRlKVxyXG4gICAgICAgICAgICB0aGlzLnB1c2hHYWxsZXJ5U3RhdGUoKTtcclxuICAgIH1cclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLmhpZGVJbWdFbGVtID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ2ltYWdlX2ltZy1lbGVtZW50LWludmlzaWJsZScpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuc2hvd0ltZ0VsZW0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnaW1hZ2VfaW1nLWVsZW1lbnQtaW52aXNpYmxlJyk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5yZXNpemVJbWFnZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIGlmICh0aGlzLmVsZW0pIHtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgdGhpcy5pbWdFbGVtLnJlbW92ZUF0dHJpYnV0ZSgnd2lkdGgnKTtcclxuICAgIC8vICAgICB0aGlzLmltZ0VsZW0ucmVtb3ZlQXR0cmlidXRlKCdoZWlnaHQnKTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgaWYgKCF0aGlzLmVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdpbWFnZV9zbWFsbCcpKSB7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICBpZiAodGhpcy5pbWdFbGVtLm9mZnNldFdpZHRoID49IHRoaXMuaW1nRWxlbS5vZmZzZXRIZWlnaHQpIHtcclxuICAgIC8vICAgICAgICAgICAgIGlmICh0aGlzLmltYWdlV3JhcHBlci5vZmZzZXRIZWlnaHQgPCB0aGlzLmltZ0VsZW0ub2Zmc2V0SGVpZ2h0KVxyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuaW1nRWxlbS5oZWlnaHQgPSB0aGlzLmltYWdlV3JhcHBlci5vZmZzZXRIZWlnaHQ7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICAgICAgaWYgKHRoaXMuaW1hZ2VXcmFwcGVyLm9mZnNldFdpZHRoID4gdGhpcy5lbGVtLm9mZnNldFdpZHRoKSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5pbWdFbGVtLnJlbW92ZUF0dHJpYnV0ZSgnaGVpZ2h0Jyk7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5pbWdFbGVtLndpZHRoID0gdGhpcy5lbGVtLm9mZnNldFdpZHRoIC0gdGhpcy5zaWRlQmFyLm9mZnNldFdpZHRoO1xyXG4gICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAgICAgaWYgKHRoaXMuaW1hZ2VXcmFwcGVyLm9mZnNldFdpZHRoID4gdGhpcy5lbGVtLm9mZnNldFdpZHRoKVxyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuaW1nRWxlbS53aWR0aCA9IHRoaXMuZWxlbS5vZmZzZXRXaWR0aCAtIHRoaXMuc2lkZUJhci5vZmZzZXRXaWR0aDtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgICAgICBpZiAodGhpcy5pbWFnZVdyYXBwZXIub2Zmc2V0SGVpZ2h0IDwgdGhpcy5pbWdFbGVtLm9mZnNldEhlaWdodCkge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuaW1nRWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ3dpZHRoJyk7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5pbWdFbGVtLmhlaWdodCA9IHRoaXMuaW1hZ2VXcmFwcGVyLm9mZnNldEhlaWdodDtcclxuICAgIC8vICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgICAgIGlmICh0aGlzLmltYWdlV3JhcHBlci5vZmZzZXRXaWR0aCA+IHRoaXMuZWxlbS5vZmZzZXRXaWR0aCkge1xyXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5pbWdFbGVtLnJlbW92ZUF0dHJpYnV0ZSgnaGVpZ2h0Jyk7XHJcbiAgICAvLyAgICAgICAgICAgICB0aGlzLmltZ0VsZW0ud2lkdGggPSB0aGlzLmVsZW0ub2Zmc2V0V2lkdGg7XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9XHJcbiAgICAvL1xyXG4gICAgLy9cclxuICAgIC8vIH1cclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnJlcXVlc3RWaWV3TW9kZWwgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnZpZXdNb2RlbHNbaWRdKSB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGJvZHkgPSB7XHJcbiAgICAgICAgICAgIGlkLFxyXG4gICAgICAgICAgICBpc0ZlZWQ6IHRoaXMuaXNGZWVkXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNMb2dnZWQgJiYgIXRoaXMubG9nZ2VkVXNlclZpZXdNb2RlbClcclxuICAgICAgICAgICAgYm9keS5yZXF1aXJlVXNlclZpZXdNb2RlbCA9IHRydWU7XHJcblxyXG4gICAgICAgIHJlcXVpcmUoTElCUyArICdzZW5kUmVxdWVzdCcpKGJvZHksICdQT1NUJywgJy9nYWxsZXJ5JywgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIENsaWVudEVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2FsbGVyeUFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlRnJvbUdhbGxlcnlBcnJheShpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlR2FsbGVyeSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KG5ldyBJbWFnZU5vdEZvdW5kKCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgdGhpcy5nYWxsZXJ5QXJyYXkgPSByZXNwb25zZS5nYWxsZXJ5O1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdhbGxlcnkoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTG9nZ2VkICYmICF0aGlzLmxvZ2dlZFVzZXJWaWV3TW9kZWwgJiYgcmVzcG9uc2UubG9nZ2VkVXNlclZpZXdNb2RlbClcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VkVXNlclZpZXdNb2RlbCA9IHJlc3BvbnNlLmxvZ2dlZFVzZXJWaWV3TW9kZWw7XHJcblxyXG5cclxuICAgICAgICAgICAgbGV0IHByb3ZpZGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiByZXNwb25zZS52aWV3TW9kZWxzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09IGlkKVxyXG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdNb2RlbHNba2V5XSA9IHJlc3BvbnNlLnZpZXdNb2RlbHNba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvdmlkZWQpXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nYWxsZXJ5QXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUZyb21HYWxsZXJ5QXJyYXkoaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlR2FsbGVyeSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBJbWFnZU5vdEZvdW5kKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnJlbW92ZUZyb21HYWxsZXJ5QXJyYXkgPSBmdW5jdGlvbiAoaWQpIHtcclxuXHJcbiAgICB0aGlzLmdhbGxlcnlBcnJheSAmJiB+dGhpcy5nYWxsZXJ5QXJyYXkuaW5kZXhPZihpZCkgJiZcclxuICAgIHRoaXMuZ2FsbGVyeUFycmF5LnNwbGljZSh0aGlzLmdhbGxlcnlBcnJheS5pbmRleE9mKGlkKSwgMSk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5hZGRUb0dhbGxlcnlBcnJheSA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgdGhpcy5nYWxsZXJ5QXJyYXkgJiYgdGhpcy5nYWxsZXJ5QXJyYXkucHVzaChpZCk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS51cGRhdGVHYWxsZXJ5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuZ2FsbGVyeUFycmF5ICYmIHRoaXMuZ2FsbGVyeSkge1xyXG4gICAgICAgIGxldCBpbWFnZVByZXZpZXdzID0gdGhpcy5nYWxsZXJ5LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbWFnZS1wcmV2aWV3Jyk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbWFnZVByZXZpZXdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICghfnRoaXMuZ2FsbGVyeUFycmF5LmluZGV4T2YoK2ltYWdlUHJldmlld3NbaV0uZGF0YXNldC5pZCkpXHJcbiAgICAgICAgICAgICAgICBpbWFnZVByZXZpZXdzW2ldLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldFB1YmxpY2F0aW9uTnVtYmVyKHRoaXMuZ2FsbGVyeUFycmF5Lmxlbmd0aCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5nZXRJbWFnZVByZXZpZXdCeUlkID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICByZXR1cm4gdGhpcy5nYWxsZXJ5LnF1ZXJ5U2VsZWN0b3IoYC5pbWFnZS1wcmV2aWV3W2RhdGEtaWQ9XCIke2lkfVwiXWApO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUudXBkYXRlSW1hZ2VQcmV2aWV3VGV4dCA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgbGV0IGxpa2VBbW91bnQgPSB0aGlzLnZpZXdNb2RlbHNbaWRdLmxpa2VzLmxlbmd0aDtcclxuICAgIGxldCBjb21tZW50QW1vdW50ID0gdGhpcy52aWV3TW9kZWxzW2lkXS5jb21tZW50cy5sZW5ndGg7XHJcbiAgICBsZXQgcHJldmlld0ltYWdlRWxlbSA9IHRoaXMuZ2V0SW1hZ2VQcmV2aWV3QnlJZChpZCk7XHJcbiAgICBwcmV2aWV3SW1hZ2VFbGVtLmRhdGFzZXQubGlrZUFtb3VudCA9IGxpa2VBbW91bnQ7XHJcbiAgICBwcmV2aWV3SW1hZ2VFbGVtLmRhdGFzZXQuY29tbWVudEFtb3VudCA9IGNvbW1lbnRBbW91bnQ7XHJcblxyXG4gICAgcHJldmlld0ltYWdlRWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2UtcHJldmlld19fY29tbWVudC1udW1iZXInKS50ZXh0Q29udGVudCA9IGNvbW1lbnRBbW91bnQ7XHJcbiAgICBwcmV2aWV3SW1hZ2VFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZS1wcmV2aWV3X19saWtlLW51bWJlcicpLnRleHRDb250ZW50ID0gbGlrZUFtb3VudDtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLmRlbGV0ZUltYWdlUHJldmlldyA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgbGV0IGVsZW0gPSB0aGlzLmdldEltYWdlUHJldmlld0J5SWQoaWQpO1xyXG4gICAgaWYgKGVsZW0pIHtcclxuICAgICAgICBlbGVtLnJlbW92ZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0UHVibGljYXRpb25OdW1iZXIoLTEsIHRydWUpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuaW5zZXJ0TmV3SW1hZ2VQcmV2aWV3ID0gZnVuY3Rpb24gKGltYWdlSWQsIHByZXZpZXdVcmwpIHtcclxuICAgIGxldCBuZXdJbWFnZVByZXZpZXcgPSB0aGlzLmltYWdlUHJldmlld0dob3N0LmNsb25lTm9kZSh0cnVlKTtcclxuICAgIG5ld0ltYWdlUHJldmlldy5jbGFzc0xpc3QucmVtb3ZlKCdpbWFnZS1wcmV2aWV3X2dob3N0Jyk7XHJcblxyXG4gICAgbmV3SW1hZ2VQcmV2aWV3LmRhdGFzZXQuaWQgPSBpbWFnZUlkO1xyXG4gICAgbmV3SW1hZ2VQcmV2aWV3LmhyZWYgPSBgL2ltYWdlLyR7aW1hZ2VJZH1gO1xyXG4gICAgbmV3SW1hZ2VQcmV2aWV3LnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZS1wcmV2aWV3X19waWN0dXJlJykuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgnLyR7cHJldmlld1VybH0nKWA7XHJcblxyXG4gICAgbmV3SW1hZ2VQcmV2aWV3LnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZS1wcmV2aWV3X19jb21tZW50LW51bWJlcicpLnRleHRDb250ZW50ID0gMDtcclxuICAgIG5ld0ltYWdlUHJldmlldy5xdWVyeVNlbGVjdG9yKCcuaW1hZ2UtcHJldmlld19fbGlrZS1udW1iZXInKS50ZXh0Q29udGVudCA9IDA7XHJcblxyXG4gICAgdGhpcy5nYWxsZXJ5V3JhcHBlci5hcHBlbmRDaGlsZChuZXdJbWFnZVByZXZpZXcpO1xyXG5cclxuICAgIHRoaXMuc2V0UHVibGljYXRpb25OdW1iZXIoMSwgdHJ1ZSk7XHJcbiAgICB0aGlzLmFkZFRvR2FsbGVyeUFycmF5KGltYWdlSWQpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuc2V0UHVibGljYXRpb25OdW1iZXIgPSBmdW5jdGlvbiAodmFsdWUsIHJlbGF0aXZlKSB7XHJcbiAgICBpZiAodGhpcy5wdWJsaWNhdGlvbk51bWJlckVsZW0pXHJcbiAgICAgICAgaWYgKHJlbGF0aXZlKVxyXG4gICAgICAgICAgICB0aGlzLnB1YmxpY2F0aW9uTnVtYmVyRWxlbS50ZXh0Q29udGVudCA9ICt0aGlzLnB1YmxpY2F0aW9uTnVtYmVyRWxlbS50ZXh0Q29udGVudCArIHZhbHVlO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5wdWJsaWNhdGlvbk51bWJlckVsZW0udGV4dENvbnRlbnQgPSB2YWx1ZTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLmRlbGV0ZVZpZXdNb2RlbCA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgZGVsZXRlIHRoaXMudmlld01vZGVsc1tpZF07XHJcbiAgICBjb25zb2xlLmxvZygnZGVsZXRlICMnICsgaWQpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUucmVxdWVzdEFsbE5lY2Vzc2FyeVZpZXdNb2RlbHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xyXG4gICAgICAgIHRoaXMucmVxdWVzdE5leHRWaWV3TW9kZWxzKCksXHJcbiAgICAgICAgdGhpcy5yZXF1ZXN0UHJldlZpZXdNb2RlbHMoKVxyXG4gICAgXSk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5yZXF1ZXN0TmV4dFZpZXdNb2RlbHMgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgaWYgKHRoaXMuZ2FsbGVyeUFycmF5ICYmIHRoaXMuZ2FsbGVyeUFycmF5Lmxlbmd0aCA9PT0gMClcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEltYWdlTm90Rm91bmQoKSk7XHJcblxyXG4gICAgbGV0IHByb21pc2VzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucHJlbG9hZEVudGl0eUNvdW50OyBpKyspXHJcbiAgICAgICAgcHJvbWlzZXMucHVzaCh0aGlzLnJlcXVlc3RWaWV3TW9kZWwodGhpcy5nZXROZXh0SW1hZ2VJZChpKSkpO1xyXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnJlcXVlc3RQcmV2Vmlld01vZGVscyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLmdhbGxlcnlBcnJheSAmJiB0aGlzLmdhbGxlcnlBcnJheS5sZW5ndGggPT09IDApXHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBJbWFnZU5vdEZvdW5kKCkpO1xyXG4gICAgbGV0IHByb21pc2VzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucHJlbG9hZEVudGl0eUNvdW50OyBpKyspXHJcbiAgICAgICAgcHJvbWlzZXMucHVzaCh0aGlzLnJlcXVlc3RWaWV3TW9kZWwodGhpcy5nZXRQcmV2SW1hZ2VJZChpKSkpO1xyXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnN3aXRjaFRvTmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLmdhbGxlcnlBcnJheSAmJiAhdGhpcy5nYWxsZXJ5QXJyYXkubGVuZ3RoKSB7XHJcbiAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBuZXh0SW1hZ2VJZCA9IHRoaXMuZ2V0TmV4dEltYWdlSWQoKTtcclxuICAgIHRoaXMuc2hvdyhuZXh0SW1hZ2VJZCkuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgSW1hZ2VOb3RGb3VuZCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5nYWxsZXJ5QXJyYXkgJiYgdGhpcy5nYWxsZXJ5QXJyYXkubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zd2l0Y2hUb05leHQoKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuc3dpdGNoVG9QcmV2ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIGlmICh0aGlzLmdhbGxlcnlBcnJheSAmJiAhdGhpcy5nYWxsZXJ5QXJyYXkubGVuZ3RoKSB7XHJcbiAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBwcmV2SW1hZ2VJZCA9IHRoaXMuZ2V0UHJldkltYWdlSWQoKTtcclxuICAgIHRoaXMuc2hvdyhwcmV2SW1hZ2VJZCkuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgSW1hZ2VOb3RGb3VuZCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5nYWxsZXJ5QXJyYXkgJiYgdGhpcy5nYWxsZXJ5QXJyYXkubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zd2l0Y2hUb1ByZXYoKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuZ2V0TmV4dEltYWdlSWQgPSBmdW5jdGlvbiAob2Zmc2V0KSB7XHJcbiAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMTtcclxuICAgIGxldCBpbmRleCA9IHRoaXMuZ2FsbGVyeUFycmF5LmluZGV4T2YodGhpcy5jdXJyZW50SW1hZ2VJZCk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZ2FsbGVyeUFycmF5WyhpbmRleCArIG9mZnNldCkgJSB0aGlzLmdhbGxlcnlBcnJheS5sZW5ndGhdO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuZ2V0UHJldkltYWdlSWQgPSBmdW5jdGlvbiAob2Zmc2V0KSB7XHJcbiAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMTtcclxuXHJcbiAgICBsZXQgaW5kZXggPSB0aGlzLmdhbGxlcnlBcnJheS5pbmRleE9mKHRoaXMuY3VycmVudEltYWdlSWQpO1xyXG5cclxuICAgIGlmICh+aW5kZXggJiYgdGhpcy5nYWxsZXJ5QXJyYXkubGVuZ3RoID09PSAxKVxyXG4gICAgICAgIHJldHVybiB0aGlzLmdhbGxlcnlBcnJheVswXTtcclxuXHJcbiAgICBsZXQgZ2FsbGVyeVByZXZJbmRleCA9IGluZGV4IC0gb2Zmc2V0O1xyXG4gICAgaWYgKGdhbGxlcnlQcmV2SW5kZXggPCAwKSB7XHJcbiAgICAgICAgZ2FsbGVyeVByZXZJbmRleCAlPSB0aGlzLmdhbGxlcnlBcnJheS5sZW5ndGg7XHJcbiAgICAgICAgZ2FsbGVyeVByZXZJbmRleCA9IHRoaXMuZ2FsbGVyeUFycmF5Lmxlbmd0aCArIGdhbGxlcnlQcmV2SW5kZXg7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZ2FsbGVyeUFycmF5W2dhbGxlcnlQcmV2SW5kZXhdO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUudXBkYXRlQ3VycmVudFZpZXcgPSBmdW5jdGlvbiAoaW52b2x2ZWRJbWFnZUlkKSB7XHJcblxyXG4gICAgaWYgKGludm9sdmVkSW1hZ2VJZCA9PT0gdGhpcy5jdXJyZW50SW1hZ2VJZCkge1xyXG4gICAgICAgIHRoaXMuaGlkZUltZ0VsZW0oKTtcclxuXHJcbiAgICAgICAgdGhpcy5pbWdFbGVtLnNldEF0dHJpYnV0ZSgnc3JjJywgdGhpcy5jdXJyZW50Vmlld01vZGVsLmltZ1VybCk7XHJcblxyXG4gICAgICAgIHRoaXMubGlrZUJ1dHRvbi5zZXRJbWFnZUlkKHRoaXMuY3VycmVudEltYWdlSWQpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlTGlrZXModGhpcy5jdXJyZW50SW1hZ2VJZCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29tbWVudFNlY3Rpb24uc2V0SW1hZ2VJZCh0aGlzLmN1cnJlbnRJbWFnZUlkKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUNvbW1lbnRzKHRoaXMuY3VycmVudEltYWdlSWQpO1xyXG5cclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uLnRleHRDb250ZW50ID0gdGhpcy5jdXJyZW50Vmlld01vZGVsLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgIGlmICh0aGlzLmRlc2NyaXB0aW9uLnRleHRDb250ZW50ID09PSAnJylcclxuICAgICAgICAgICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ2ltYWdlX25vLWRlc2NyaXB0aW9uJyk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnaW1hZ2Vfbm8tZGVzY3JpcHRpb24nKTtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRlLnRleHRDb250ZW50ID0gdGhpcy5jdXJyZW50Vmlld01vZGVsLmNyZWF0ZURhdGVTdHI7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzTG9nZ2VkKVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50Vmlld01vZGVsLmlzT3duSW1hZ2UpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZUJ1dHRvbi5zZXRJbWFnZUlkKHRoaXMuY3VycmVudEltYWdlSWQpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1YnNjcmliZUJ1dHRvbi5zZXRJbWFnZUlkKHRoaXMuY3VycmVudEltYWdlSWQpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc0ZlZWQpXHJcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlQnV0dG9uLnNldCh7YWN0aXZlOiB0cnVlfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYXZhdGFyLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJyR7dGhpcy5jdXJyZW50Vmlld01vZGVsLmF1dGhvci5hdmF0YXJVcmxzLm1lZGl1bX0nKWA7XHJcbiAgICAgICAgdGhpcy51c2VybmFtZS50ZXh0Q29udGVudCA9IHRoaXMuY3VycmVudFZpZXdNb2RlbC5hdXRob3IudXNlcm5hbWU7XHJcblxyXG4gICAgICAgIHRoaXMuaGVhZGVyTGVmdFNpZGUuc2V0QXR0cmlidXRlKCdocmVmJywgdGhpcy5jdXJyZW50Vmlld01vZGVsLmF1dGhvci51cmwpO1xyXG4gICAgfVxyXG5cclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnVwZGF0ZUxpa2VzID0gZnVuY3Rpb24gKGltYWdlSWQpIHtcclxuICAgIGlmICh0aGlzLmN1cnJlbnRJbWFnZUlkID09PSBpbWFnZUlkKVxyXG4gICAgICAgIHRoaXMubGlrZUJ1dHRvbi5zZXQoe1xyXG4gICAgICAgICAgICBhY3RpdmU6IHRoaXMuY3VycmVudFZpZXdNb2RlbC5pc0xpa2VkLFxyXG4gICAgICAgICAgICBsaWtlQW1vdW50OiB0aGlzLmN1cnJlbnRWaWV3TW9kZWwubGlrZXMubGVuZ3RoXHJcbiAgICAgICAgfSk7XHJcbiAgICBpZiAodGhpcy5nYWxsZXJ5KVxyXG4gICAgICAgIHRoaXMudXBkYXRlSW1hZ2VQcmV2aWV3VGV4dChpbWFnZUlkKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnVwZGF0ZUNvbW1lbnRzID0gZnVuY3Rpb24gKGltYWdlSWQpIHtcclxuICAgIGlmICh0aGlzLmN1cnJlbnRJbWFnZUlkID09PSBpbWFnZUlkKVxyXG4gICAgICAgIHRoaXMuY29tbWVudFNlY3Rpb24uc2V0KHRoaXMuY3VycmVudFZpZXdNb2RlbC5jb21tZW50cyk7XHJcbiAgICBpZiAodGhpcy5nYWxsZXJ5KVxyXG4gICAgICAgIHRoaXMudXBkYXRlSW1hZ2VQcmV2aWV3VGV4dChpbWFnZUlkKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnB1c2hJbWFnZVN0YXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaGlzdG9yeS5wdXNoU3RhdGUoe1xyXG4gICAgICAgIHR5cGU6ICdpbWFnZScsXHJcbiAgICAgICAgaWQ6IHRoaXMuY3VycmVudEltYWdlSWRcclxuICAgIH0sICdpbWFnZSAjJyArIHRoaXMuY3VycmVudEltYWdlSWQsICcvaW1hZ2UvJyArIHRoaXMuY3VycmVudEltYWdlSWQpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUucHVzaEdhbGxlcnlTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBsZXQgdXJsID0gJyc7XHJcbiAgICBpZiAoIXRoaXMuaXNGZWVkKVxyXG4gICAgICAgIHVybCA9IHRoaXMuY3VycmVudFZpZXdNb2RlbCAmJiB0aGlzLmN1cnJlbnRWaWV3TW9kZWwuYXV0aG9yLnVybDtcclxuICAgIGVsc2VcclxuICAgICAgICB1cmwgPSAnL2ZlZWQnO1xyXG5cclxuICAgIGhpc3RvcnkucHVzaFN0YXRlKHtcclxuICAgICAgICB0eXBlOiAnZ2FsbGVyeSdcclxuICAgIH0sICcnLCB1cmwpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUub25Qb3BTdGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZSkge1xyXG5cclxuICAgIGlmIChzdGF0ZSAmJiBzdGF0ZS50eXBlKVxyXG4gICAgICAgIHN3aXRjaCAoc3RhdGUudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdpbWFnZSc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3coe1xyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlSWQ6IHN0YXRlLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIG5vUHVzaFN0YXRlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAnZ2FsbGVyeSc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlYWN0aXZhdGUobnVsbCwge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vUHVzaFN0YXRlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxufTtcclxuXHJcbmZvciAobGV0IGtleSBpbiBldmVudE1peGluKVxyXG4gICAgR2FsbGVyeS5wcm90b3R5cGVba2V5XSA9IGV2ZW50TWl4aW5ba2V5XTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FsbGVyeTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9nYWxsZXJ5L2luZGV4LmpzIiwibGV0IGV2ZW50TWl4aW4gPSByZXF1aXJlKExJQlMgKyAnZXZlbnRNaXhpbicpO1xyXG5cclxubGV0IFN3aXRjaEJ1dHRvbiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLmVsZW0gPSBvcHRpb25zLmVsZW07XHJcbiAgICB0aGlzLmRhdGEgPSBvcHRpb25zLmRhdGE7XHJcbiAgICB0aGlzLmRhdGFTdHIgPSBvcHRpb25zLmRhdGFTdHIgfHwgJ2ltYWdlSWQnO1xyXG5cclxuICAgIFN3aXRjaEJ1dHRvbi5wcm90b3R5cGUuc2V0LmNhbGwodGhpcywge2FjdGl2ZTogISF0aGlzLmVsZW0uZGF0YXNldC5hY3RpdmV9KTtcclxuICAgIGNvbnNvbGUubG9nKCdzd2l0Y2ggYnV0dG9uIGFjdGl2ZTonLCAhIXRoaXMuZWxlbS5kYXRhc2V0LmFjdGl2ZSk7XHJcbiAgICB0aGlzLmF2YWlsYWJsZSA9IHRydWU7XHJcblxyXG4gICAgdGhpcy5lbGVtLm9uY2xpY2sgPSBlID0+IHRoaXMub25DbGljayhlKTtcclxufTtcclxuXHJcblN3aXRjaEJ1dHRvbi5wcm90b3R5cGUub25DbGljayA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIGxldCBpbnZvbHZlZERhdGEgPSB0aGlzLmRhdGE7XHJcblxyXG4gICAgaWYgKHRoaXMuYXZhaWxhYmxlKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYXZhaWxhYmxlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy50b2dnbGUoKTtcclxuXHJcbiAgICAgICAgcmVxdWlyZShMSUJTICsgJ3NlbmRSZXF1ZXN0Jykoe1xyXG4gICAgICAgICAgICBbdGhpcy5kYXRhU3RyXTogaW52b2x2ZWREYXRhXHJcbiAgICAgICAgfSwgJ1BPU1QnLCB0aGlzLnVybCwgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmICghZXJyKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXQocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCdzd2l0Y2gtYnV0dG9uX2NoYW5nZWQnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgW3RoaXMuZGF0YVN0cl06IGludm9sdmVkRGF0YSxcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yKGVycik7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSA9PT0gaW52b2x2ZWREYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5Td2l0Y2hCdXR0b24uc2V0UmVsYXRpb24gPSBmdW5jdGlvbiAoc3dpdGNoQnV0dG9uMSwgc3dpdGNoQnV0dG9uMikge1xyXG4gICAgc3dpdGNoQnV0dG9uMS5vbignc3dpdGNoLWJ1dHRvbl9jaGFuZ2VkJywgZSA9PiB7XHJcbiAgICAgICAgc3dpdGNoQnV0dG9uMi5zZXQoZS5kZXRhaWwucmVzcG9uc2UpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgc3dpdGNoQnV0dG9uMi5vbignc3dpdGNoLWJ1dHRvbl9jaGFuZ2VkJywgZSA9PiB7XHJcbiAgICAgICAgc3dpdGNoQnV0dG9uMS5zZXQoZS5kZXRhaWwucmVzcG9uc2UpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5Td2l0Y2hCdXR0b24ucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBpZiAob3B0aW9ucy5hY3RpdmUpXHJcbiAgICAgICAgdGhpcy5fYWN0aXZhdGUoKTtcclxuICAgIGVsc2VcclxuICAgICAgICB0aGlzLl9kZWFjdGl2YXRlKCk7XHJcbn07XHJcblxyXG5Td2l0Y2hCdXR0b24ucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLmFjdGl2ZSlcclxuICAgICAgICB0aGlzLnNldCh7YWN0aXZlOiBmYWxzZX0pO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHRoaXMuc2V0KHthY3RpdmU6IHRydWV9KTtcclxufTtcclxuXHJcblN3aXRjaEJ1dHRvbi5wcm90b3R5cGUuX2FjdGl2YXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ2J1dHRvbl9hY3RpdmUnKTtcclxuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcclxufTtcclxuXHJcblN3aXRjaEJ1dHRvbi5wcm90b3R5cGUuX2RlYWN0aXZhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnYnV0dG9uX2FjdGl2ZScpO1xyXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxufTtcclxuXHJcblN3aXRjaEJ1dHRvbi5wcm90b3R5cGUuc2V0SW1hZ2VJZCA9IGZ1bmN0aW9uIChpbWFnZUlkKSB7XHJcbiAgICB0aGlzLmRhdGEgPSBpbWFnZUlkO1xyXG59O1xyXG5cclxuZm9yIChsZXQga2V5IGluIGV2ZW50TWl4aW4pXHJcbiAgICBTd2l0Y2hCdXR0b24ucHJvdG90eXBlW2tleV0gPSBldmVudE1peGluW2tleV07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFN3aXRjaEJ1dHRvbjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL3N3aXRjaC1idXR0b24vaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBpZD1cXFwiaW1hZ2VcXFwiIGNsYXNzPVxcXCJtb2RhbCBpbWFnZV9pbWctZWxlbWVudC1pbnZpc2libGUgaW1hZ2UgaW1hZ2Vfbm8tZGVzY3JpcHRpb25cXFwiPlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9faW1hZ2Utd3JhcHBlclxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGlkPVxcXCJzcGlubmVyXFxcIiBjbGFzcz1cXFwic3Bpbm5lciBpbWFnZV9fc3Bpbm5lclxcXCI+XFxyXFxuICAgICAgICBcXHJcXG4gICAgICAgIDwvZGl2PiAgICAgICAgPGltZyBjbGFzcz1cXFwiaW1hZ2VfX2ltZy1lbGVtZW50XFxcIj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19jb250cm9sc1xcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2NvbnRyb2wgaW1hZ2VfX2NvbnRyb2wtcHJldiBpY29uLWFycm93LWxlZnRcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19jb250cm9sIGltYWdlX19jb250cm9sLWZ1bGwgaWNvbi1hcnJvdy1tYXhpbWlzZVxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2NvbnRyb2wgaW1hZ2VfX2NvbnRyb2wtbmV4dCBpY29uLWFycm93LXJpZ2h0XFxcIj48L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX3NpZGViYXJcXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX3RvcC1zaWRlXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJoZWFkZXIgaW1hZ2VfX2hlYWRlclxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxhIGNsYXNzPVxcXCJpbWFnZV9faGVhZGVyLWxlZnQtc2lkZVxcXCIgaHJlZj1cXFwiXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19hdmF0YXJcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPVxcXCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJycpXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19tZXRhZGF0YVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX3VzZXJuYW1lXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fcG9zdC1kYXRlXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8L2E+XFxyXFxuXFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbiBidXR0b25faW52aXNpYmxlIGltYWdlX190b3Atc2lkZS1idXR0b24gaW1hZ2VfX2RlbGV0ZS1idXR0b24gYnV0dG9uX2hlYWRlci1zdHlsZVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICBkZWxldGVcXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXZcXHJcXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJidXR0b24gaW1hZ2VfX3RvcC1zaWRlLWJ1dHRvbiBpbWFnZV9fc3Vic2NyaWJlLWJ1dHRvbiBidXR0b25faGVhZGVyLXN0eWxlXFxcIlxcclxcbiAgICAgICAgICAgICAgICA+XFxyXFxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVcXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuXFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2luZm8tYm9hcmRcXFwiPlxcclxcblxcclxcbiAgICAgICAgICAgICAgICA8ZGl2XFxyXFxuICAgICAgICAgICAgICAgIFxcclxcbiAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJidXR0b24gbGlrZS1idXR0b24gaW1hZ2VfX2xpa2UtYnV0dG9uXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxpa2UtYnV0dG9uX19oZWFydCBpY29uLWhlYXJ0XFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxpa2UtYnV0dG9uX19oZWFydCBpY29uLWhlYXJ0LW91dGxpbmVkXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICZuYnNwO2xpa2UmbmJzcDtcXHJcXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJsaWtlLWJ1dHRvbl9fbGlrZS1hbW91bnRcXFwiPjwvc3Bhbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19kZXNjcmlwdGlvblxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICBcXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuXFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2NvbW1lbnQtc2VjdGlvbi13cmFwcGVyIGltYWdlX25vLXNjcm9sbGJhclxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnQtc2VjdGlvbiBpbWFnZV9fY29tbWVudC1zZWN0aW9uXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnQtc2VjdGlvbl9fbm8tY29tbWVudHMtYmxvY2tcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIFRoZXJlIGFyZSBubyBjb21tZW50cyB5ZXRcXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudC1zZWN0aW9uX19jb21tZW50cy13cmFwcGVyXFxcIj5cXHJcXG5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicGFuZWwgY29tbWVudCBjb21tZW50LXNlY3Rpb25fX2NvbW1lbnQgY29tbWVudF9naG9zdFxcXCIgZGF0YS1pZD1cXFwiXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnRfX3RvcC1zaWRlXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cXFwiY29tbWVudF9fcmVmXFxcIiBocmVmPVxcXCJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb21tZW50X19hdmF0YXJcXFwiIHN0eWxlPVxcXCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJycpXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudF9fbWV0YWRhdGFcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudF9fdXNlcm5hbWVcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudF9fZGF0ZVxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb21tZW50X19jbG9zZS1idXR0b24gaWNvbi1jcm9zc1xcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnRfX3RleHRcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fY29tbWVudC1zZWN0aW9uLXNjcm9sbGJhci13cmFwcGVyIGltYWdlX25vLXNjcm9sbGJhclxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19jb21tZW50LXNlY3Rpb24tc2Nyb2xsYmFyLW9mZnNldFxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19jb21tZW50LXNlY3Rpb24tc2Nyb2xsYmFyXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19jb21tZW50LXNlY3Rpb24tc2xpZGVyXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcInBhbmVsIGNvbW1lbnQgY29tbWVudC1zZW5kIGltYWdlX19jb21tZW50LXNlbmRcXFwiXFxyXFxuICAgICAgICAgICAgIGRhdGEtaW1hZ2UtaWQ9XFxcIlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudF9fdG9wLXNpZGVcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb21tZW50X19hdmF0YXJcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb21tZW50X191c2VybmFtZVxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICAgICAgPHRleHRhcmVhIHBsYWNlaG9sZGVyPVxcXCJzaGFyZSB5b3VyIG9waW5pb27igKZcXFwiIGNsYXNzPVxcXCJjb21tZW50LXNlbmRfX3RleHRhcmVhXFxcIj48L3RleHRhcmVhPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbiBjb21tZW50LXNlbmRfX3NlbmQtYnV0dG9uXFxcIj5zZW5kPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19tb2RhbC1jbG9zZS1idXR0b24td3JhcHBlclxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpY29uLWNyb3NzIG1vZGFsLWNsb3NlLWJ1dHRvbiBpbWFnZV9fbW9kYWwtY2xvc2UtYnV0dG9uXFxcIj48L2Rpdj4gICAgPC9kaXY+XFxyXFxuXFxyXFxuPC9kaXY+XFxyXFxuXFxyXFxuXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL34vaHRtbC1sb2FkZXIhLi4vYmxvY2tzL2dhbGxlcnkvd2luZG93XG4vLyBtb2R1bGUgaWQgPSAzMlxuLy8gbW9kdWxlIGNodW5rcyA9IDMgOCAxMyIsImxldCBDb21tZW50U2VjdGlvbiA9IHJlcXVpcmUoQkxPQ0tTICsgJ2NvbW1lbnQtc2VjdGlvbicpO1xyXG5cclxubGV0IEltYWdlQ29tbWVudFNlY3Rpb24gPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgQ29tbWVudFNlY3Rpb24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHJcbiAgICB0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlciA9IG9wdGlvbnMuY29tbWVudFNlY3Rpb25XcmFwcGVyO1xyXG4gICAgdGhpcy5pbmZvQm9hcmQgPSBvcHRpb25zLmluZm9Cb2FyZDtcclxuICAgIHRoaXMuc2Nyb2xsYmFyV3JhcHBlciA9IG9wdGlvbnMuc2Nyb2xsYmFyV3JhcHBlcjtcclxuICAgIHRoaXMuc2Nyb2xsYmFyID0gdGhpcy5zY3JvbGxiYXJXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fY29tbWVudC1zZWN0aW9uLXNjcm9sbGJhcicpO1xyXG4gICAgdGhpcy5zY3JvbGxiYXJPZmZzZXQgPSB0aGlzLnNjcm9sbGJhcldyYXBwZXIucXVlcnlTZWxlY3RvcignLmltYWdlX19jb21tZW50LXNlY3Rpb24tc2Nyb2xsYmFyLW9mZnNldCcpO1xyXG4gICAgdGhpcy5zY3JvbGxiYXJTbGlkZXIgPSB0aGlzLnNjcm9sbGJhcldyYXBwZXIucXVlcnlTZWxlY3RvcignLmltYWdlX19jb21tZW50LXNlY3Rpb24tc2xpZGVyJyk7XHJcblxyXG4gICAgdGhpcy5jb21tZW50U2VjdGlvbldyYXBwZXIub25zY3JvbGwgPSBlID0+IHtcclxuICAgICAgICBpZiAoIXRoaXMub25EcmFnZ2luZylcclxuICAgICAgICAgICAgdGhpcy5zZXRUb3AoKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5zY3JvbGxiYXJTbGlkZXIub25tb3VzZWRvd24gPSBlID0+IHtcclxuXHJcbiAgICAgICAgdGhpcy5vbkRyYWdnaW5nID0gdHJ1ZTtcclxuICAgICAgICBsZXQgc2xpZGVyQ29vcmRzID0gZ2V0Q29vcmRzKHRoaXMuc2Nyb2xsYmFyU2xpZGVyKTtcclxuICAgICAgICBsZXQgc2hpZnRZID0gZS5wYWdlWSAtIHNsaWRlckNvb3Jkcy50b3A7XHJcbiAgICAgICAgbGV0IHNjcm9sbGJhckNvb3JkcyA9IGdldENvb3Jkcyh0aGlzLnNjcm9sbGJhcik7XHJcbiAgICAgICAgbGV0IG5ld1RvcDtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQub25tb3VzZW1vdmUgPSBlID0+IHtcclxuICAgICAgICAgICAgbmV3VG9wID0gZS5wYWdlWSAtIHNoaWZ0WSAtIHNjcm9sbGJhckNvb3Jkcy50b3A7XHJcbiAgICAgICAgICAgIGlmIChuZXdUb3AgPCAwKSBuZXdUb3AgPSAwO1xyXG4gICAgICAgICAgICBsZXQgYm90dG9tRWRnZSA9IHRoaXMuc2Nyb2xsYmFyLm9mZnNldEhlaWdodCAtIHRoaXMuc2Nyb2xsYmFyU2xpZGVyLm9mZnNldEhlaWdodDtcclxuICAgICAgICAgICAgaWYgKG5ld1RvcCA+IGJvdHRvbUVkZ2UpIG5ld1RvcCA9IGJvdHRvbUVkZ2U7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbGJhclNsaWRlci5zdHlsZS50b3AgPSBuZXdUb3AgKyAncHgnO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jb21tZW50U2VjdGlvbldyYXBwZXIuc2Nyb2xsVG9wID0gKG5ld1RvcCAvIHRoaXMuc2Nyb2xsYmFyLm9mZnNldEhlaWdodCkgLyAoMSAtIHRoaXMuc2xpZGVyU2l6ZVJhdGUpICpcclxuICAgICAgICAgICAgICAgICh0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlci5zY3JvbGxIZWlnaHQgLSB0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlci5vZmZzZXRIZWlnaHQpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGRvY3VtZW50Lm9ubW91c2V1cCA9IGUgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnb25tb3VzZXVwJywgbmV3VG9wLCB0aGlzLnNjcm9sbGJhci5vZmZzZXRIZWlnaHQpO1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbGJhclNsaWRlci5zdHlsZS50b3AgPSAobmV3VG9wICogMTAwIC8gdGhpcy5zY3JvbGxiYXIub2Zmc2V0SGVpZ2h0KSArICclJztcclxuICAgICAgICAgICAgdGhpcy5vbkRyYWdnaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGRvY3VtZW50Lm9ubW91c2Vtb3ZlID0gZG9jdW1lbnQub25tb3VzZXVwID0gbnVsbDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7IC8vIGRpc2FibGUgc2VsZWN0aW9uIHN0YXJ0IChjdXJzb3IgY2hhbmdlKVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnNjcm9sbGJhclNsaWRlci5vbmRyYWdzdGFydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldENvb3JkcyhlbGVtKSB7IC8vINC60YDQvtC80LUgSUU4LVxyXG4gICAgICAgIGxldCBib3ggPSBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0b3A6IGJveC50b3AgKyBwYWdlWU9mZnNldCxcclxuICAgICAgICAgICAgbGVmdDogYm94LmxlZnQgKyBwYWdlWE9mZnNldFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxufTtcclxuSW1hZ2VDb21tZW50U2VjdGlvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbW1lbnRTZWN0aW9uLnByb3RvdHlwZSk7XHJcbkltYWdlQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gSW1hZ2VDb21tZW50U2VjdGlvbjtcclxuXHJcbkltYWdlQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIENvbW1lbnRTZWN0aW9uLnByb3RvdHlwZS5zZXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgIHRoaXMudXBkYXRlKCk7XHJcbn07XHJcblxyXG5JbWFnZUNvbW1lbnRTZWN0aW9uLnByb3RvdHlwZS5zZXRUb3AgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgc2Nyb2xsUmF0ZSA9ICh0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlci5zY3JvbGxUb3ApIC9cclxuICAgICAgICAodGhpcy5jb21tZW50U2VjdGlvbldyYXBwZXIuc2Nyb2xsSGVpZ2h0IC0gdGhpcy5jb21tZW50U2VjdGlvbldyYXBwZXIub2Zmc2V0SGVpZ2h0KSAqIDEwMDtcclxuXHJcbiAgICB0aGlzLnNjcm9sbGJhclNsaWRlci5zdHlsZS50b3AgPSBgJHsoMSAtIHRoaXMuc2xpZGVyU2l6ZVJhdGUpICogc2Nyb2xsUmF0ZX0lYDtcclxuXHJcbn07XHJcblxyXG5JbWFnZUNvbW1lbnRTZWN0aW9uLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlci5jbGFzc0xpc3QuYWRkKCdpbWFnZV9uby1zY3JvbGxiYXInKTtcclxuICAgIHRoaXMuc2Nyb2xsYmFyV3JhcHBlci5jbGFzc0xpc3QuYWRkKCdpbWFnZV9uby1zY3JvbGxiYXInKTtcclxuXHJcbiAgICB0aGlzLmluZm9Cb2FyZEhlaWdodCA9IHRoaXMuaW5mb0JvYXJkLm9mZnNldEhlaWdodDtcclxuXHJcbiAgICBsZXQgY29tcHV0ZWRTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUodGhpcy5pbmZvQm9hcmQpO1xyXG4gICAgcGFyc2VGbG9hdChjb21wdXRlZFN0eWxlLmhlaWdodCkgJiYgKHRoaXMuaW5mb0JvYXJkSGVpZ2h0ID0gcGFyc2VGbG9hdChjb21wdXRlZFN0eWxlLmhlaWdodCkpO1xyXG5cclxuICAgIHRoaXMuc2Nyb2xsYmFyT2Zmc2V0LnN0eWxlLmhlaWdodCA9IGAke3RoaXMuaW5mb0JvYXJkSGVpZ2h0fXB4YDtcclxuICAgIHRoaXMuc2Nyb2xsYmFyLnN0eWxlLmhlaWdodCA9IGBjYWxjKDEwMCUgLSAke3RoaXMuaW5mb0JvYXJkSGVpZ2h0fXB4KWA7XHJcblxyXG4gICAgaWYgKHRoaXMuY29tbWVudFNlY3Rpb25XcmFwcGVyLm9mZnNldEhlaWdodCAtIHRoaXMuY29tbWVudHNXcmFwcGVyLnNjcm9sbEhlaWdodCA8IC0xKSB7XHJcbiAgICAgICAgdGhpcy5zbGlkZXJTaXplUmF0ZSA9IHRoaXMuY29tbWVudFNlY3Rpb25XcmFwcGVyLm9mZnNldEhlaWdodCAvIHRoaXMuY29tbWVudHNXcmFwcGVyLnNjcm9sbEhlaWdodDtcclxuICAgICAgICB0aGlzLnNjcm9sbGJhclNsaWRlci5zdHlsZS5oZWlnaHQgPSBgJHt0aGlzLnNsaWRlclNpemVSYXRlICogMTAwfSVgO1xyXG5cclxuICAgICAgICB0aGlzLnNldFRvcCgpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCdpbWFnZV9uby1zY3JvbGxiYXInKTtcclxuICAgICAgICB0aGlzLnNjcm9sbGJhcldyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSgnaW1hZ2Vfbm8tc2Nyb2xsYmFyJyk7XHJcbiAgICB9XHJcblxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW1hZ2VDb21tZW50U2VjdGlvbjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL2ltYWdlLWNvbW1lbnQtc2VjdGlvbi9pbmRleC5qcyIsImxldCBldmVudE1peGluID0gcmVxdWlyZShMSUJTICsgJ2V2ZW50TWl4aW4nKTtcclxuXHJcbmxldCBDb21tZW50U2VjdGlvbiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgdGhpcy5lbGVtID0gb3B0aW9ucy5lbGVtO1xyXG4gICAgdGhpcy5jb21tZW50c1dyYXBwZXIgPSBvcHRpb25zLmVsZW0ucXVlcnlTZWxlY3RvcignLmNvbW1lbnQtc2VjdGlvbl9fY29tbWVudHMtd3JhcHBlcicpO1xyXG4gICAgdGhpcy5pbWFnZUlkID0gb3B0aW9ucy5pbWFnZUlkO1xyXG4gICAgdGhpcy5sb2dnZWRVc2VyVmlld01vZGVsID0gb3B0aW9ucy5sb2dnZWRVc2VyVmlld01vZGVsO1xyXG5cclxuICAgIHRoaXMuY29tbWVudFNlbmRlckVsZW0gPSBvcHRpb25zLmNvbW1lbnRTZW5kZXJFbGVtO1xyXG4gICAgdGhpcy5jb21tZW50U2VuZFRleHRhcmVhID0gdGhpcy5jb21tZW50U2VuZGVyRWxlbS5xdWVyeVNlbGVjdG9yKCcuY29tbWVudC1zZW5kX190ZXh0YXJlYScpO1xyXG5cclxuICAgIHRoaXMuZ2hvc3QgPSB0aGlzLmNvbW1lbnRzV3JhcHBlci5xdWVyeVNlbGVjdG9yKCcuY29tbWVudCcpO1xyXG5cclxuICAgIGlmICh0aGlzLmxvZ2dlZFVzZXJWaWV3TW9kZWwpIHtcclxuICAgICAgICB0aGlzLmNvbW1lbnRTZW5kZXJFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50X19hdmF0YXInKS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCcke3RoaXMubG9nZ2VkVXNlclZpZXdNb2RlbC5hdmF0YXJVcmxzLm1lZGl1bX0nKWA7XHJcbiAgICAgICAgdGhpcy5jb21tZW50U2VuZGVyRWxlbS5xdWVyeVNlbGVjdG9yKCcuY29tbWVudF9fdXNlcm5hbWUnKS50ZXh0Q29udGVudCA9IHRoaXMubG9nZ2VkVXNlclZpZXdNb2RlbC51c2VybmFtZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jb21tZW50U2VuZGVyRWxlbS5xdWVyeVNlbGVjdG9yKCcuY29tbWVudF9fYXZhdGFyJykuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgnJHtBTk9OX0FWQVRBUl9VUkx9JylgO1xyXG4gICAgICAgIHRoaXMuY29tbWVudFNlbmRlckVsZW0ucXVlcnlTZWxlY3RvcignLmNvbW1lbnRfX3VzZXJuYW1lJykudGV4dENvbnRlbnQgPSBBTk9OX05BTUU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jb21tZW50U2VuZGVyRWxlbS5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgaWYgKCFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2NvbW1lbnQtc2VuZF9fc2VuZC1idXR0b24nKSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgaW52b2x2ZWRJbWFnZUlkID0gdGhpcy5pbWFnZUlkO1xyXG4gICAgICAgIGxldCB0ZXh0ID0gdGhpcy5jb21tZW50U2VuZFRleHRhcmVhLnZhbHVlO1xyXG4gICAgICAgIGlmICh0ZXh0Lmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgcmVxdWlyZShMSUJTICsgJ3NlbmRSZXF1ZXN0Jykoe1xyXG4gICAgICAgICAgICAgICAgaWQ6IGludm9sdmVkSW1hZ2VJZCxcclxuICAgICAgICAgICAgICAgIHRleHRcclxuICAgICAgICAgICAgfSwgJ1BPU1QnLCAnL2NvbW1lbnQnLCAoZXJyLCByZXNwb25zZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY29tbWVudFNlbmRUZXh0YXJlYS52YWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaW1hZ2VJZCA9PT0gaW52b2x2ZWRJbWFnZUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnNlcnROZXdDb21tZW50KHJlc3BvbnNlLnZpZXdNb2RlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxUb0JvdHRvbSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlcignY29tbWVudC1zZWN0aW9uX2NoYW5nZWQnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VJZDogaW52b2x2ZWRJbWFnZUlkXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5lbGVtLm9uY2xpY2sgPSBlID0+IHtcclxuICAgICAgICBpZiAoIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnY29tbWVudF9fY2xvc2UtYnV0dG9uJykpIHJldHVybjtcclxuXHJcbiAgICAgICAgbGV0IGNvbW1lbnQgPSBlLnRhcmdldC5jbG9zZXN0KCcuY29tbWVudCcpO1xyXG4gICAgICAgIGxldCBjb21tZW50SWQgPSBjb21tZW50LmRhdGFzZXQuaWQ7XHJcbiAgICAgICAgbGV0IGludm9sdmVkSW1hZ2VJZCA9IHRoaXMuaW1hZ2VJZDtcclxuXHJcbiAgICAgICAgcmVxdWlyZShMSUJTICsgJ3NlbmRSZXF1ZXN0Jykoe1xyXG4gICAgICAgICAgICBpZDogY29tbWVudElkXHJcbiAgICAgICAgfSwgJ0RFTEVURScsICcvY29tbWVudCcsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCdjb21tZW50LXNlY3Rpb25fY2hhbmdlZCcsIHtcclxuICAgICAgICAgICAgICAgIGltYWdlSWQ6IGludm9sdmVkSW1hZ2VJZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29tbWVudC5yZW1vdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG59O1xyXG5cclxuQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlLnNjcm9sbFRvQm90dG9tID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5jb21tZW50c1dyYXBwZXIuc2Nyb2xsVG9wID0gdGhpcy5jb21tZW50c1dyYXBwZXIuc2Nyb2xsSGVpZ2h0O1xyXG59O1xyXG5cclxuQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlLmluc2VydE5ld0NvbW1lbnQgPSBmdW5jdGlvbiAodmlld01vZGVsKSB7XHJcbiAgICBsZXQgbmV3Q29tbWVudCA9IHRoaXMuZ2hvc3QuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgbmV3Q29tbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjb21tZW50X2dob3N0Jyk7XHJcbiAgICBuZXdDb21tZW50LmRhdGFzZXQuaWQgPSB2aWV3TW9kZWwuX2lkO1xyXG4gICAgbmV3Q29tbWVudC5xdWVyeVNlbGVjdG9yKCcuY29tbWVudF9fcmVmJykuc2V0QXR0cmlidXRlKCdocmVmJywgdmlld01vZGVsLmNvbW1lbnRhdG9yLnVybCk7XHJcbiAgICBuZXdDb21tZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50X19hdmF0YXInKS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPVxyXG4gICAgICAgIGB1cmwoJyR7dmlld01vZGVsLmNvbW1lbnRhdG9yLmF2YXRhclVybHMubWVkaXVtfScpYDtcclxuICAgIG5ld0NvbW1lbnQucXVlcnlTZWxlY3RvcignLmNvbW1lbnRfX3VzZXJuYW1lJykudGV4dENvbnRlbnQgPSB2aWV3TW9kZWwuY29tbWVudGF0b3IudXNlcm5hbWU7XHJcbiAgICBuZXdDb21tZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50X19kYXRlJykudGV4dENvbnRlbnQgPSB2aWV3TW9kZWwuY3JlYXRlRGF0ZVN0cjtcclxuXHJcbiAgICBpZiAoIXZpZXdNb2RlbC5pc093bkNvbW1lbnQpXHJcbiAgICAgICAgbmV3Q29tbWVudC5jbGFzc0xpc3QuYWRkKCdjb21tZW50X25vdC1vd24nKTtcclxuICAgIGVsc2VcclxuICAgICAgICBuZXdDb21tZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NvbW1lbnRfbm90LW93bicpO1xyXG5cclxuICAgIG5ld0NvbW1lbnQucXVlcnlTZWxlY3RvcignLmNvbW1lbnRfX3RleHQnKS50ZXh0Q29udGVudCA9IHZpZXdNb2RlbC50ZXh0O1xyXG4gICAgdGhpcy5jb21tZW50c1dyYXBwZXIuYXBwZW5kQ2hpbGQobmV3Q29tbWVudCk7XHJcbn07XHJcblxyXG5cclxuQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlLnNldEltYWdlSWQgPSBmdW5jdGlvbiAoaW1hZ2VJZCkge1xyXG4gICAgdGhpcy5pbWFnZUlkID0gaW1hZ2VJZDtcclxufTtcclxuXHJcbkNvbW1lbnRTZWN0aW9uLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAodmlld01vZGVscykge1xyXG4gICAgdGhpcy5jbGVhcigpO1xyXG5cclxuICAgIGlmICh2aWV3TW9kZWxzLmxlbmd0aCA+IDApXHJcbiAgICAgICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbW1lbnQtc2VjdGlvbl9uby1jb21tZW50cycpO1xyXG5cclxuICAgIHZpZXdNb2RlbHMuZm9yRWFjaCh2aWV3TW9kZWwgPT4ge1xyXG4gICAgICAgIHRoaXMuaW5zZXJ0TmV3Q29tbWVudCh2aWV3TW9kZWwpO1xyXG4gICAgfSk7XHJcblxyXG59O1xyXG5cclxuQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIHRoaXMuY29tbWVudHNXcmFwcGVyLmlubmVySFRNTCA9ICcnO1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ2NvbW1lbnQtc2VjdGlvbl9uby1jb21tZW50cycpO1xyXG59O1xyXG5cclxuXHJcbmZvciAobGV0IGtleSBpbiBldmVudE1peGluKVxyXG4gICAgQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlW2tleV0gPSBldmVudE1peGluW2tleV07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbW1lbnRTZWN0aW9uO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL2NvbW1lbnQtc2VjdGlvbi9pbmRleC5qcyIsImxldCBTd2l0Y2hCdXR0b24gPSByZXF1aXJlKEJMT0NLUyArICdzd2l0Y2gtYnV0dG9uJyk7XHJcblxyXG5sZXQgTGlrZUJ1dHRvbiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBTd2l0Y2hCdXR0b24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHJcbiAgICB0aGlzLmxpa2VBbW91bnQgPSArdGhpcy5lbGVtLmRhdGFzZXQubGlrZUFtb3VudDtcclxuICAgIHRoaXMubGlrZUFtb3VudEVsZW0gPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmxpa2UtYnV0dG9uX19saWtlLWFtb3VudCcpO1xyXG5cclxuXHJcbiAgICB0aGlzLnVybCA9ICcvbGlrZSc7XHJcblxyXG5cclxuXHJcbn07XHJcbkxpa2VCdXR0b24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShTd2l0Y2hCdXR0b24ucHJvdG90eXBlKTtcclxuTGlrZUJ1dHRvbi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBMaWtlQnV0dG9uO1xyXG5cclxuTGlrZUJ1dHRvbi5wcm90b3R5cGUuc2V0QW1vdW50ID0gZnVuY3Rpb24gKGxpa2VBbW91bnQpIHtcclxuICAgIHRoaXMubGlrZUFtb3VudCA9IGxpa2VBbW91bnQ7XHJcbiAgICB0aGlzLmxpa2VBbW91bnRFbGVtLnRleHRDb250ZW50ID0gbGlrZUFtb3VudDtcclxufTtcclxuXHJcbkxpa2VCdXR0b24ucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLnNldEFtb3VudChvcHRpb25zLmxpa2VBbW91bnQpO1xyXG4gICAgU3dpdGNoQnV0dG9uLnByb3RvdHlwZS5zZXQuY2FsbCh0aGlzLCBvcHRpb25zKTtcclxufTtcclxuXHJcbkxpa2VCdXR0b24ucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLmFjdGl2ZSlcclxuICAgICAgICB0aGlzLnNldCh7YWN0aXZlOiBmYWxzZSwgbGlrZUFtb3VudDogdGhpcy5saWtlQW1vdW50IC0gMX0pO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHRoaXMuc2V0KHthY3RpdmU6IHRydWUsIGxpa2VBbW91bnQ6IHRoaXMubGlrZUFtb3VudCArIDF9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGlrZUJ1dHRvbjtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9saWtlLWJ1dHRvbi9pbmRleC5qcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0NBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7Ozs7Ozs7Ozs7O0FDM3NCQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBOzs7QUFFQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBOzs7Ozs7O0FDdEZBOzs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBOzs7Ozs7Ozs7O0FDdEdBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBOzs7Ozs7Ozs7QUM3SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBOzs7OzsiLCJzb3VyY2VSb290IjoiIn0=