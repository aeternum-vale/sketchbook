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

	    previewImageElem.querySelector('.image-preview__comment-section .image-preview__designation-text').textContent = 'comment' + (commentAmount === 1 ? '' : 's');
	    previewImageElem.querySelector('.image-preview__like-section .image-preview__designation-text').textContent = 'like' + (likeAmount === 1 ? '' : 's');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMy4zLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2NvbXBvbmVudEVycm9ycy5qcyIsIndlYnBhY2s6Ly8vRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvc2VuZFJlcXVlc3QuanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9nYWxsZXJ5L2luZGV4LmpzIiwid2VicGFjazovLy8uLi9ibG9ja3Mvc3dpdGNoLWJ1dHRvbi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2dhbGxlcnkvd2luZG93Iiwid2VicGFjazovLy8uLi9ibG9ja3MvaW1hZ2UtY29tbWVudC1zZWN0aW9uL2luZGV4LmpzIiwid2VicGFjazovLy8uLi9ibG9ja3MvY29tbWVudC1zZWN0aW9uL2luZGV4LmpzIiwid2VicGFjazovLy8uLi9ibG9ja3MvbGlrZS1idXR0b24vaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gQ3VzdG9tRXJyb3IobWVzc2FnZSkge1xyXG5cdHRoaXMubmFtZSA9IFwiQ3VzdG9tRXJyb3JcIjtcclxuXHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG5cclxuXHRpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpXHJcblx0XHRFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBDdXN0b21FcnJvcik7XHJcblx0ZWxzZVxyXG5cdFx0dGhpcy5zdGFjayA9IChuZXcgRXJyb3IoKSkuc3RhY2s7XHJcbn1cclxuQ3VzdG9tRXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpO1xyXG5DdXN0b21FcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDdXN0b21FcnJvcjtcclxuXHJcblxyXG5mdW5jdGlvbiBDb21wb25lbnRFcnJvcihtZXNzYWdlLCBzdGF0dXMpIHtcclxuXHRDdXN0b21FcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ0FuIGVycm9yIGhhcyBvY2N1cnJlZCcgKTtcclxuXHR0aGlzLm5hbWUgPSBcIkNvbXBvbmVudEVycm9yXCI7XHJcblx0dGhpcy5zdGF0dXMgPSBzdGF0dXM7XHJcbn1cclxuQ29tcG9uZW50RXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDdXN0b21FcnJvci5wcm90b3R5cGUpO1xyXG5Db21wb25lbnRFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDb21wb25lbnRFcnJvcjtcclxuXHJcbmZ1bmN0aW9uIENsaWVudEVycm9yKG1lc3NhZ2UsIGRldGFpbCwgc3RhdHVzKSB7XHJcblx0Q29tcG9uZW50RXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlIHx8ICdBbiBlcnJvciBoYXMgb2NjdXJyZWQuIENoZWNrIGlmIGphdmFzY3JpcHQgaXMgZW5hYmxlZCcsIHN0YXR1cyk7XHJcblx0dGhpcy5uYW1lID0gXCJDbGllbnRFcnJvclwiO1xyXG5cdHRoaXMuZGV0YWlsID0gZGV0YWlsO1xyXG59XHJcbkNsaWVudEVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29tcG9uZW50RXJyb3IucHJvdG90eXBlKTtcclxuQ2xpZW50RXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ2xpZW50RXJyb3I7XHJcblxyXG5cclxuZnVuY3Rpb24gSW1hZ2VOb3RGb3VuZChtZXNzYWdlKSB7XHJcbiAgICBDbGllbnRFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ0ltYWdlIG5vdCBmb3VuZC4gSXQgcHJvYmFibHkgaGFzIGJlZW4gcmVtb3ZlZCcsIG51bGwsIDQwNCk7XHJcbiAgICB0aGlzLm5hbWUgPSBcIkltYWdlTm90Rm91bmRcIjtcclxufVxyXG5JbWFnZU5vdEZvdW5kLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ2xpZW50RXJyb3IucHJvdG90eXBlKTtcclxuSW1hZ2VOb3RGb3VuZC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBJbWFnZU5vdEZvdW5kO1xyXG5cclxuZnVuY3Rpb24gU2VydmVyRXJyb3IobWVzc2FnZSwgc3RhdHVzKSB7XHJcblx0Q29tcG9uZW50RXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlIHx8ICdUaGVyZSBpcyBzb21lIGVycm9yIG9uIHRoZSBzZXJ2ZXIgc2lkZScsIHN0YXR1cyk7XHJcblx0dGhpcy5uYW1lID0gXCJTZXJ2ZXJFcnJvclwiO1xyXG59XHJcblNlcnZlckVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29tcG9uZW50RXJyb3IucHJvdG90eXBlKTtcclxuU2VydmVyRXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2VydmVyRXJyb3I7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRDb21wb25lbnRFcnJvcixcclxuXHRDbGllbnRFcnJvcixcclxuICAgIEltYWdlTm90Rm91bmQsXHJcblx0U2VydmVyRXJyb3JcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2NvbXBvbmVudEVycm9ycy5qcyIsImxldCBTZXJ2ZXJFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5TZXJ2ZXJFcnJvcjtcclxubGV0IENsaWVudEVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLkNsaWVudEVycm9yO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYm9keU9iaiwgbWV0aG9kLCB1cmwsIGNiKSB7XHJcblxyXG5cclxuICAgIGxldCBib2R5ID0gJyc7XHJcbiAgICBpZiAoISh0eXBlb2YgYm9keU9iaiA9PT0gJ3N0cmluZycpKSB7XHJcbiAgICAgICAgZm9yIChsZXQga2V5IGluIGJvZHlPYmopIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgIGlmIChib2R5T2JqW2tleV0pXHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGtleSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCgodHlwZW9mIGJvZHlPYmpba2V5XSA9PT0gJ29iamVjdCcpID8gSlNPTi5zdHJpbmdpZnkoYm9keU9ialtrZXldKSA6IGJvZHlPYmpba2V5XSk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICAgICAgICAgIGJvZHkgKz0gKGJvZHkgPT09ICcnID8gJycgOiAnJicpICsgdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlXHJcbiAgICAgICAgYm9keSA9IGJvZHlPYmo7XHJcblxyXG5cclxuICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgIHhoci5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKTtcclxuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XHJcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIlgtUmVxdWVzdGVkLVdpdGhcIiwgXCJYTUxIdHRwUmVxdWVzdFwiKTtcclxuXHJcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgIT0gNCkgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgcmVzcG9uc2U7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnJlc3BvbnNlVGV4dClcclxuICAgICAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY2IobmV3IFNlcnZlckVycm9yKCdTZXJ2ZXIgaXMgbm90IHJlc3BvbmRpbmcnKSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCAzMDApXHJcbiAgICAgICAgICAgIGNiKG51bGwsIHJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDQwMCAmJiB0aGlzLnN0YXR1cyA8IDUwMClcclxuICAgICAgICAgICAgY2IobmV3IENsaWVudEVycm9yKHJlc3BvbnNlLm1lc3NhZ2UsIHJlc3BvbnNlLmRldGFpbCwgdGhpcy5zdGF0dXMpKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDUwMClcclxuICAgICAgICAgICAgY2IobmV3IFNlcnZlckVycm9yKHJlc3BvbnNlLm1lc3NhZ2UsIHRoaXMuc3RhdHVzKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnNvbGUubG9nKGBzZW5kaW5nIG5leHQgcmVxdWVzdDogJHtib2R5fWApO1xyXG4gICAgeGhyLnNlbmQoYm9keSk7XHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9zZW5kUmVxdWVzdC5qcyIsImxldCBldmVudE1peGluID0gcmVxdWlyZShMSUJTICsgJ2V2ZW50TWl4aW4nKTtcclxubGV0IENsaWVudEVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLkNsaWVudEVycm9yO1xyXG5sZXQgSW1hZ2VOb3RGb3VuZCA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5JbWFnZU5vdEZvdW5kO1xyXG5sZXQgTW9kYWwgPSByZXF1aXJlKEJMT0NLUyArICdtb2RhbCcpO1xyXG5sZXQgU3dpdGNoQnV0dG9uID0gcmVxdWlyZShCTE9DS1MgKyAnc3dpdGNoLWJ1dHRvbicpO1xyXG5cclxuXHJcbmxldCBHYWxsZXJ5ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIE1vZGFsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICB0aGlzLnN0YXR1cyA9IE1vZGFsLnN0YXR1c2VzLk1BSk9SO1xyXG5cclxuICAgIHRoaXMuZ2FsbGVyeSA9IG9wdGlvbnMuZ2FsbGVyeTtcclxuICAgIHRoaXMuZWxlbSA9IG9wdGlvbnMuZWxlbTtcclxuICAgIHRoaXMuaXNMb2dnZWQgPSBvcHRpb25zLmlzTG9nZ2VkO1xyXG4gICAgdGhpcy5wcmVsb2FkRW50aXR5Q291bnQgPSBvcHRpb25zLnByZWxvYWRFbnRpdHlDb3VudDtcclxuICAgIHRoaXMuaXNGZWVkID0gb3B0aW9ucy5pc0ZlZWQgfHwgZmFsc2U7XHJcbiAgICB0aGlzLnVzZXJTdWJzY3JpYmVCdXR0b24gPSBvcHRpb25zLnVzZXJTdWJzY3JpYmVCdXR0b247XHJcblxyXG4gICAgdGhpcy52aWV3TW9kZWxzID0ge307XHJcbiAgICB0aGlzLmdhbGxlcnlBcnJheSA9IG51bGw7XHJcbiAgICB0aGlzLmN1cnJlbnRJbWFnZUlkID0gbnVsbDtcclxuXHJcbiAgICB0aGlzLmxvZ2dlZFVzZXJWaWV3TW9kZWwgPSBudWxsO1xyXG4gICAgdGhpcy5pc0VtYmVkZGVkID0gISF0aGlzLmdhbGxlcnk7XHJcbiAgICB0aGlzLnByZWxvYWRlZEltYWdlcyA9IHt9O1xyXG5cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnY3VycmVudFZpZXdNb2RlbCcsIHtcclxuICAgICAgICBnZXQ6ICgpID0+IHRoaXMudmlld01vZGVsc1t0aGlzLmN1cnJlbnRJbWFnZUlkXVxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IHRoaXMucHJlbG9hZEVudGl0eUNvdW50OyBpKyspIHtcclxuICAgICAgICB0aGlzLnByZWxvYWRlZEltYWdlc1tpXSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgIHRoaXMucHJlbG9hZGVkSW1hZ2VzWy1pXSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGUgPT4ge1xyXG4gICAgICAgIHRoaXMub25Qb3BTdGF0ZShlLnN0YXRlKTtcclxuICAgIH0sIGZhbHNlKTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZSA9PiB7XHJcbiAgICAgICAgdGhpcy5vblJlc2l6ZSgpO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIHRoaXMucHVzaEdhbGxlcnlTdGF0ZSgpO1xyXG5cclxuICAgIGlmICh0aGlzLmlzRW1iZWRkZWQpXHJcbiAgICAgICAgdGhpcy5zZXRHYWxsZXJ5KG9wdGlvbnMpO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHRoaXMuc2hvdygrdGhpcy5lbGVtLmRhdGFzZXQuaWQpLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xyXG4gICAgICAgIH0pO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKE1vZGFsLnByb3RvdHlwZSk7XHJcbkdhbGxlcnkucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2FsbGVyeTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLm9uUmVzaXplID0gZnVuY3Rpb24oKSB7XHJcbiAgICAvLyBjb25zdCBHTE9CQUxfU01BTExfU0NSRUVOX1dJRFRIID0gNzAwO1xyXG4gICAgLy8gaWYgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCA8PSBHTE9CQUxfU01BTExfU0NSRUVOX1dJRFRIKVxyXG4gICAgLy8gICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdpbWFnZV9zbWFsbCcpO1xyXG4gICAgLy8gZWxzZVxyXG4gICAgLy8gICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdpbWFnZV9zbWFsbCcpO1xyXG4gICAgLy9cclxuICAgIC8vIHRoaXMucmVzaXplSW1hZ2UoKTtcclxuICAgIHRoaXMuY29tbWVudFNlY3Rpb24gJiYgdGhpcy5jb21tZW50U2VjdGlvbi51cGRhdGUoKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLm9uR2FsbGVyeUNsaWNrID0gZnVuY3Rpb24gKGUpIHtcclxuICAgIGxldCB0YXJnZXQ7XHJcbiAgICBpZiAoISh0YXJnZXQgPSBlLnRhcmdldC5jbG9zZXN0KCcuaW1hZ2UtcHJldmlldycpKSkgcmV0dXJuO1xyXG5cclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGxldCBpbWFnZUlkID0gK3RhcmdldC5kYXRhc2V0LmlkO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmFjdGl2YXRlKHtpbWFnZUlkfSk7XHJcbn07XHJcblxyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuc2V0R2FsbGVyeSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLnB1YmxpY2F0aW9uTnVtYmVyRWxlbSA9IG9wdGlvbnMucHVibGljYXRpb25OdW1iZXJFbGVtO1xyXG4gICAgdGhpcy5pbWFnZVByZXZpZXdHaG9zdCA9IHRoaXMuZ2FsbGVyeS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2UtcHJldmlldycpO1xyXG4gICAgdGhpcy5nYWxsZXJ5V3JhcHBlciA9IHRoaXMuZ2FsbGVyeS5xdWVyeVNlbGVjdG9yKCcuZ2FsbGVyeV9fd3JhcHBlcicpO1xyXG5cclxuICAgIHRoaXMuZ2FsbGVyeS5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgdGhpcy5vbkdhbGxlcnlDbGljayhlKTtcclxuICAgIH07XHJcbn07XHJcblxyXG4vL1RPRE8gQUxFUlQgSUYgSVQgRE9FU04nVCBBQkxFIFRPIERPV05MT0FEIE1PREFMIE1FU1NBR0UgV0lORE9XXHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5zZXRFbGVtID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblxyXG4gICAgICAgIHRoaXMuaXNFbGVtU2V0dGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmVsZW0pXHJcbiAgICAgICAgICAgIHRoaXMuZWxlbSA9IHRoaXMucmVuZGVyV2luZG93KHJlcXVpcmUoYGh0bWwtbG9hZGVyIS4vd2luZG93YCkpO1xyXG5cclxuICAgICAgICB0aGlzLmltZ0VsZW0gPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignaW1nLmltYWdlX19pbWctZWxlbWVudCcpO1xyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX19kZXNjcmlwdGlvbicpO1xyXG4gICAgICAgIHRoaXMuZGF0ZSA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX3Bvc3QtZGF0ZScpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2VXcmFwcGVyID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9faW1hZ2Utd3JhcHBlcicpO1xyXG4gICAgICAgIHRoaXMuc2lkZUJhciA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX3NpZGViYXInKTtcclxuICAgICAgICB0aGlzLmRlbGV0ZUJ1dHRvbkVsZW0gPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX19kZWxldGUtYnV0dG9uJyk7XHJcbiAgICAgICAgdGhpcy5zdWJzY3JpYmVCdXR0b25FbGVtID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fc3Vic2NyaWJlLWJ1dHRvbicpO1xyXG4gICAgICAgIHRoaXMuYXZhdGFyID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fYXZhdGFyJyk7XHJcbiAgICAgICAgdGhpcy51c2VybmFtZSA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX3VzZXJuYW1lJyk7XHJcbiAgICAgICAgdGhpcy5oZWFkZXJMZWZ0U2lkZSA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2hlYWRlci1sZWZ0LXNpZGUnKTtcclxuICAgICAgICB0aGlzLmZ1bGxzY3JlZW5CdXR0b24gPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX19jb250cm9sLWZ1bGwnKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuaW1nRWxlbS5vbmxvYWQgPSBlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZXNpemVJbWFnZSgpO1xyXG4gICAgICAgICAgICB0aGlzLnNob3dJbWdFbGVtKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5lbGVtLm9uY2xpY2sgPSBlID0+IHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMub25FbGVtQ2xpY2soZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZS50YXJnZXQubWF0Y2hlcygnLmltYWdlX19tb2RhbC1jbG9zZS1idXR0b24td3JhcHBlcicpKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZS50YXJnZXQubWF0Y2hlcygnLmltYWdlX19jb250cm9sLXByZXYnKSlcclxuICAgICAgICAgICAgICAgIHRoaXMuc3dpdGNoVG9QcmV2KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZS50YXJnZXQubWF0Y2hlcygnLmltYWdlX19jb250cm9sLW5leHQnKSlcclxuICAgICAgICAgICAgICAgIHRoaXMuc3dpdGNoVG9OZXh0KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZS50YXJnZXQgPT09IHRoaXMuZnVsbHNjcmVlbkJ1dHRvbilcclxuICAgICAgICAgICAgICAgIHRoaXMuc3dpdGNoRnVsbHNjcmVlbigpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoJy5pbWFnZV9fY2xvc2Utc3BhY2UnKSB8fCBlLnRhcmdldC5tYXRjaGVzKCcuaW1hZ2VfX2Nsb3NlLWJ1dHRvbicpKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIGxldCBDb21tZW50U2VjdGlvbiA9IHJlcXVpcmUoQkxPQ0tTICsgJ2ltYWdlLWNvbW1lbnQtc2VjdGlvbicpO1xyXG4gICAgICAgIGxldCBMaWtlQnV0dG9uID0gcmVxdWlyZShCTE9DS1MgKyAnbGlrZS1idXR0b24nKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb21tZW50U2VjdGlvbiA9IG5ldyBDb21tZW50U2VjdGlvbih7XHJcbiAgICAgICAgICAgIGVsZW06IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuY29tbWVudC1zZWN0aW9uJyksXHJcbiAgICAgICAgICAgIGNvbW1lbnRTZW5kZXJFbGVtOiB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmNvbW1lbnQtc2VuZCcpLFxyXG4gICAgICAgICAgICBpbWFnZUlkOiB0aGlzLmN1cnJlbnRJbWFnZUlkLFxyXG4gICAgICAgICAgICBsb2dnZWRVc2VyVmlld01vZGVsOiB0aGlzLmxvZ2dlZFVzZXJWaWV3TW9kZWwsXHJcblxyXG4gICAgICAgICAgICBjb21tZW50U2VjdGlvbldyYXBwZXI6IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2NvbW1lbnQtc2VjdGlvbi13cmFwcGVyJyksXHJcbiAgICAgICAgICAgIGluZm9Cb2FyZDogdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9faW5mby1ib2FyZCcpLFxyXG4gICAgICAgICAgICBzY3JvbGxiYXJXcmFwcGVyOiB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX19jb21tZW50LXNlY3Rpb24tc2Nyb2xsYmFyLXdyYXBwZXInKVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmNvbW1lbnRTZWN0aW9uLm9uKCdjb21tZW50LXNlY3Rpb25fY2hhbmdlZCcsIGUgPT4ge1xyXG4gICAgICAgICAgICBsZXQgaW1hZ2VJZCA9IGUuZGV0YWlsLmltYWdlSWQ7XHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlVmlld01vZGVsKGltYWdlSWQpO1xyXG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RWaWV3TW9kZWwoaW1hZ2VJZCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUNvbW1lbnRzKGltYWdlSWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5saWtlQnV0dG9uID0gbmV3IExpa2VCdXR0b24oe1xyXG4gICAgICAgICAgICBlbGVtOiB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmxpa2UtYnV0dG9uJyksXHJcbiAgICAgICAgICAgIGRhdGE6IHRoaXMuY3VycmVudEltYWdlSWRcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5saWtlQnV0dG9uLm9uKCdzd2l0Y2gtYnV0dG9uX2NoYW5nZWQnLCBlID0+IHtcclxuICAgICAgICAgICAgbGV0IGltYWdlSWQgPSBlLmRldGFpbC5pbWFnZUlkO1xyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZVZpZXdNb2RlbChpbWFnZUlkKTtcclxuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0Vmlld01vZGVsKGltYWdlSWQpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVMaWtlcyhpbWFnZUlkKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMub25SZXNpemUoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNMb2dnZWQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFZpZXdNb2RlbC5pc093bkltYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldERlbGV0ZUJ1dHRvbigpO1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZS5lbnN1cmUoW0JMT0NLUyArICdkZWxldGUtaW1hZ2UtYnV0dG9uJ10sIHJlcXVpcmUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBEZWxldGVJbWFnZUJ1dHRvbiA9IHJlcXVpcmUoQkxPQ0tTICsgJ2RlbGV0ZS1pbWFnZS1idXR0b24nKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZUJ1dHRvbiA9IG5ldyBEZWxldGVJbWFnZUJ1dHRvbih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW06IHRoaXMuZGVsZXRlQnV0dG9uRWxlbSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VJZDogdGhpcy5jdXJyZW50SW1hZ2VJZFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlQnV0dG9uLm9uKCdkZWxldGUtaW1hZ2UtYnV0dG9uX2ltYWdlLWRlbGV0ZWQnLCBlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGludm9sdmVkSW1hZ2VJZCA9IGUuZGV0YWlsLmltYWdlSWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlVmlld01vZGVsKGludm9sdmVkSW1hZ2VJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlRnJvbUdhbGxlcnlBcnJheShpbnZvbHZlZEltYWdlSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZUltYWdlUHJldmlldyhpbnZvbHZlZEltYWdlSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50SW1hZ2VJZCA9PT0gaW52b2x2ZWRJbWFnZUlkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zd2l0Y2hUb05leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmUuZW5zdXJlKFtCTE9DS1MgKyAnc3Vic2NyaWJlLWJ1dHRvbiddLCByZXF1aXJlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgU3Vic2NyaWJlQnV0dG9uID0gcmVxdWlyZShCTE9DS1MgKyAnc3Vic2NyaWJlLWJ1dHRvbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlQnV0dG9uID0gbmV3IFN1YnNjcmliZUJ1dHRvbih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW06IHRoaXMuc3Vic2NyaWJlQnV0dG9uRWxlbSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGhpcy5jdXJyZW50SW1hZ2VJZFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy51c2VyU3Vic2NyaWJlQnV0dG9uKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBTd2l0Y2hCdXR0b24uc2V0UmVsYXRpb24odGhpcy5zdWJzY3JpYmVCdXR0b24sIHRoaXMudXNlclN1YnNjcmliZUJ1dHRvbik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlQnV0dG9uLm9uKCdzd2l0Y2gtYnV0dG9uX2NoYW5nZWQnLCBlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGludm9sdmVkSW1hZ2VJZCA9IGUuZGV0YWlsLmltYWdlSWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0ZlZWQgJiYgaW52b2x2ZWRJbWFnZUlkID09PSB0aGlzLmN1cnJlbnRJbWFnZUlkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52aWV3TW9kZWxzID0ge307XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN1YnNjcmliZUJ1dHRvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlQnV0dG9uLnNldCh7YWN0aXZlOiB0aGlzLmN1cnJlbnRWaWV3TW9kZWwuYXV0aG9yLmlzTmFycmF0b3J9KTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZUJ1dHRvbkVsZW0ub25jbGljayA9IGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcihuZXcgQ2xpZW50RXJyb3IobnVsbCwgbnVsbCwgNDAxKSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG5cclxufTtcclxuXHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5zd2l0Y2hGdWxsc2NyZWVuID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIGZ1bmN0aW9uIGdvRnVsbHNjcmVlbihlbGVtZW50KSB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQucmVxdWVzdEZ1bGxzY3JlZW4pIHtcclxuICAgICAgICAgICAgZWxlbWVudC5yZXF1ZXN0RnVsbHNjcmVlbigpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbikge1xyXG4gICAgICAgICAgICBlbGVtZW50LndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuKCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50Lm1velJlcXVlc3RGdWxsc2NyZWVuKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQubW96UmVxdWVzdEZ1bGxzY3JlZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2FuY2VsRnVsbHNjcmVlbigpIHtcclxuICAgICAgICBpZiAoZG9jdW1lbnQuZXhpdEZ1bGxzY3JlZW4pIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZXhpdEZ1bGxzY3JlZW4oKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGRvY3VtZW50LndlYmtpdEV4aXRGdWxsc2NyZWVuKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LndlYmtpdEV4aXRGdWxsc2NyZWVuKCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkb2N1bWVudC5tb3pFeGl0RnVsbHNjcmVlbikge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5tb3pFeGl0RnVsbHNjcmVlbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgaWYgKCF0aGlzLmlzRnVsbHNjcmVlbikge1xyXG4gICAgICAgIGdvRnVsbHNjcmVlbih0aGlzLmltYWdlV3JhcHBlcik7XHJcbiAgICAgICAgdGhpcy5pc0Z1bGxzY3JlZW4gPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdpY29uLWFycm93LW1heGltaXNlJyk7XHJcbiAgICAgICAgdGhpcy5mdWxsc2NyZWVuQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2ljb24tYXJyb3ctbWluaW1pc2UnKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbmNlbEZ1bGxzY3JlZW4oKTtcclxuICAgICAgICB0aGlzLmlzRnVsbHNjcmVlbiA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdpY29uLWFycm93LW1heGltaXNlJyk7XHJcbiAgICAgICAgdGhpcy5mdWxsc2NyZWVuQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2ljb24tYXJyb3ctbWluaW1pc2UnKTtcclxuICAgIH1cclxuXHJcbn07XHJcblxyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuc2V0RGVsZXRlQnV0dG9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5kZWxldGVCdXR0b25FbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2J1dHRvbl9pbnZpc2libGUnKTtcclxuICAgIHRoaXMuc3Vic2NyaWJlQnV0dG9uRWxlbS5jbGFzc0xpc3QuYWRkKCdidXR0b25faW52aXNpYmxlJyk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5zZXRTdWJzY3JpYmVCdXR0b24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLnN1YnNjcmliZUJ1dHRvbkVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnYnV0dG9uX2ludmlzaWJsZScpO1xyXG4gICAgdGhpcy5kZWxldGVCdXR0b25FbGVtLmNsYXNzTGlzdC5hZGQoJ2J1dHRvbl9pbnZpc2libGUnKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnVwZGF0ZVByZWxvYWRlZEltYWdlc0FycmF5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gdGhpcy5wcmVsb2FkRW50aXR5Q291bnQ7IGkrKykge1xyXG4gICAgICAgIGxldCBuZXh0SWQgPSB0aGlzLmdldE5leHRJbWFnZUlkKGkpO1xyXG4gICAgICAgIGxldCBwcmV2SWQgPSB0aGlzLmdldE5leHRJbWFnZUlkKC1pKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudmlld01vZGVsc1tuZXh0SWRdKVxyXG4gICAgICAgICAgICB0aGlzLnByZWxvYWRlZEltYWdlc1tpXS5zZXRBdHRyaWJ1dGUoJ3NyYycsIHRoaXMudmlld01vZGVsc1tuZXh0SWRdLmltZ1VybCk7XHJcbiAgICAgICAgaWYgKHRoaXMudmlld01vZGVsc1twcmV2SWRdKVxyXG4gICAgICAgICAgICB0aGlzLnByZWxvYWRlZEltYWdlc1staV0uc2V0QXR0cmlidXRlKCdzcmMnLCB0aGlzLnZpZXdNb2RlbHNbcHJldklkXS5pbWdVcmwpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJzsgLy8gOlxcXHJcblxyXG4gICAgbGV0IGltYWdlSWQ7XHJcbiAgICBsZXQgbm9QdXNoU3RhdGU7XHJcblxyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiYgdHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ251bWJlcicpIHtcclxuICAgICAgICBpbWFnZUlkID0gYXJndW1lbnRzWzBdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBpbWFnZUlkID0gb3B0aW9ucyAmJiBvcHRpb25zLmltYWdlSWQ7XHJcbiAgICAgICAgbm9QdXNoU3RhdGUgPSBvcHRpb25zICYmIG9wdGlvbnMubm9QdXNoU3RhdGUgfHwgZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNFbWJlZGRlZClcclxuICAgICAgICAgICAgTW9kYWwucHJvdG90eXBlLnNob3cuYXBwbHkodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMucmVxdWVzdFZpZXdNb2RlbChpbWFnZUlkKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50SW1hZ2VJZCA9IGltYWdlSWQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNFbGVtU2V0dGVkKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFbGVtKCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDdXJyZW50VmlldyhpbWFnZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnaW1hZ2VfaW52aXNpYmxlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFub1B1c2hTdGF0ZSAmJiBpbWFnZUlkID09PSB0aGlzLmN1cnJlbnRJbWFnZUlkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2hJbWFnZVN0YXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdEFsbE5lY2Vzc2FyeVZpZXdNb2RlbHMoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQcmVsb2FkZWRJbWFnZXNBcnJheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDdXJyZW50VmlldyhpbWFnZUlkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdpbWFnZV9pbnZpc2libGUnKTtcclxuICAgICAgICAgICAgICAgIGlmICghbm9QdXNoU3RhdGUgJiYgaW1hZ2VJZCA9PT0gdGhpcy5jdXJyZW50SW1hZ2VJZClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2hJbWFnZVN0YXRlKCk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RBbGxOZWNlc3NhcnlWaWV3TW9kZWxzKCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQcmVsb2FkZWRJbWFnZXNBcnJheSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KS5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnYXV0byc7XHJcblxyXG5cclxuICAgIGxldCBub1B1c2hTdGF0ZSA9IG9wdGlvbnMgJiYgb3B0aW9ucy5ub1B1c2hTdGF0ZTtcclxuICAgIGlmICghdGhpcy5pc0VtYmVkZGVkKVxyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHRoaXMuZWxlbS5kYXRhc2V0LmF1dGhvclVybDtcclxuICAgIGVsc2Uge1xyXG4gICAgICAgIE1vZGFsLnByb3RvdHlwZS5oaWRlLmFwcGx5KHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnaW1hZ2VfaW52aXNpYmxlJyk7XHJcblxyXG4gICAgICAgIGlmICghbm9QdXNoU3RhdGUpXHJcbiAgICAgICAgICAgIHRoaXMucHVzaEdhbGxlcnlTdGF0ZSgpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuaGlkZUltZ0VsZW0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnaW1hZ2VfaW1nLWVsZW1lbnQtaW52aXNpYmxlJyk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5zaG93SW1nRWxlbSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdpbWFnZV9pbWctZWxlbWVudC1pbnZpc2libGUnKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnJlc2l6ZUltYWdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gaWYgKHRoaXMuZWxlbSkge1xyXG4gICAgLy9cclxuICAgIC8vICAgICB0aGlzLmltZ0VsZW0ucmVtb3ZlQXR0cmlidXRlKCd3aWR0aCcpO1xyXG4gICAgLy8gICAgIHRoaXMuaW1nRWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2hlaWdodCcpO1xyXG4gICAgLy9cclxuICAgIC8vICAgICBpZiAoIXRoaXMuZWxlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2ltYWdlX3NtYWxsJykpIHtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgIGlmICh0aGlzLmltZ0VsZW0ub2Zmc2V0V2lkdGggPj0gdGhpcy5pbWdFbGVtLm9mZnNldEhlaWdodCkge1xyXG4gICAgLy8gICAgICAgICAgICAgaWYgKHRoaXMuaW1hZ2VXcmFwcGVyLm9mZnNldEhlaWdodCA8IHRoaXMuaW1nRWxlbS5vZmZzZXRIZWlnaHQpXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5pbWdFbGVtLmhlaWdodCA9IHRoaXMuaW1hZ2VXcmFwcGVyLm9mZnNldEhlaWdodDtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgICAgICBpZiAodGhpcy5pbWFnZVdyYXBwZXIub2Zmc2V0V2lkdGggPiB0aGlzLmVsZW0ub2Zmc2V0V2lkdGgpIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLmltZ0VsZW0ucmVtb3ZlQXR0cmlidXRlKCdoZWlnaHQnKTtcclxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLmltZ0VsZW0ud2lkdGggPSB0aGlzLmVsZW0ub2Zmc2V0V2lkdGggLSB0aGlzLnNpZGVCYXIub2Zmc2V0V2lkdGg7XHJcbiAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgICAgICAgICBpZiAodGhpcy5pbWFnZVdyYXBwZXIub2Zmc2V0V2lkdGggPiB0aGlzLmVsZW0ub2Zmc2V0V2lkdGgpXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5pbWdFbGVtLndpZHRoID0gdGhpcy5lbGVtLm9mZnNldFdpZHRoIC0gdGhpcy5zaWRlQmFyLm9mZnNldFdpZHRoO1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgICAgIGlmICh0aGlzLmltYWdlV3JhcHBlci5vZmZzZXRIZWlnaHQgPCB0aGlzLmltZ0VsZW0ub2Zmc2V0SGVpZ2h0KSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5pbWdFbGVtLnJlbW92ZUF0dHJpYnV0ZSgnd2lkdGgnKTtcclxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLmltZ0VsZW0uaGVpZ2h0ID0gdGhpcy5pbWFnZVdyYXBwZXIub2Zmc2V0SGVpZ2h0O1xyXG4gICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfSBlbHNlIHtcclxuICAgIC8vICAgICAgICAgaWYgKHRoaXMuaW1hZ2VXcmFwcGVyLm9mZnNldFdpZHRoID4gdGhpcy5lbGVtLm9mZnNldFdpZHRoKSB7XHJcbiAgICAvLyAgICAgICAgICAgICB0aGlzLmltZ0VsZW0ucmVtb3ZlQXR0cmlidXRlKCdoZWlnaHQnKTtcclxuICAgIC8vICAgICAgICAgICAgIHRoaXMuaW1nRWxlbS53aWR0aCA9IHRoaXMuZWxlbS5vZmZzZXRXaWR0aDtcclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH1cclxuICAgIC8vXHJcbiAgICAvL1xyXG4gICAgLy8gfVxyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUucmVxdWVzdFZpZXdNb2RlbCA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudmlld01vZGVsc1tpZF0pIHtcclxuICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgYm9keSA9IHtcclxuICAgICAgICAgICAgaWQsXHJcbiAgICAgICAgICAgIGlzRmVlZDogdGhpcy5pc0ZlZWRcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc0xvZ2dlZCAmJiAhdGhpcy5sb2dnZWRVc2VyVmlld01vZGVsKVxyXG4gICAgICAgICAgICBib2R5LnJlcXVpcmVVc2VyVmlld01vZGVsID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgcmVxdWlyZShMSUJTICsgJ3NlbmRSZXF1ZXN0JykoYm9keSwgJ1BPU1QnLCAnL2dhbGxlcnknLCAoZXJyLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgQ2xpZW50RXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5nYWxsZXJ5QXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVGcm9tR2FsbGVyeUFycmF5KGlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVHYWxsZXJ5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QobmV3IEltYWdlTm90Rm91bmQoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB0aGlzLmdhbGxlcnlBcnJheSA9IHJlc3BvbnNlLmdhbGxlcnk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlR2FsbGVyeSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNMb2dnZWQgJiYgIXRoaXMubG9nZ2VkVXNlclZpZXdNb2RlbCAmJiByZXNwb25zZS5sb2dnZWRVc2VyVmlld01vZGVsKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZWRVc2VyVmlld01vZGVsID0gcmVzcG9uc2UubG9nZ2VkVXNlclZpZXdNb2RlbDtcclxuXHJcblxyXG4gICAgICAgICAgICBsZXQgcHJvdmlkZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIHJlc3BvbnNlLnZpZXdNb2RlbHMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChrZXkgPT0gaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudmlld01vZGVsc1trZXldID0gcmVzcG9uc2Uudmlld01vZGVsc1trZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcm92aWRlZClcclxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdhbGxlcnlBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlRnJvbUdhbGxlcnlBcnJheShpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVHYWxsZXJ5KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEltYWdlTm90Rm91bmQoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUucmVtb3ZlRnJvbUdhbGxlcnlBcnJheSA9IGZ1bmN0aW9uIChpZCkge1xyXG5cclxuICAgIHRoaXMuZ2FsbGVyeUFycmF5ICYmIH50aGlzLmdhbGxlcnlBcnJheS5pbmRleE9mKGlkKSAmJlxyXG4gICAgdGhpcy5nYWxsZXJ5QXJyYXkuc3BsaWNlKHRoaXMuZ2FsbGVyeUFycmF5LmluZGV4T2YoaWQpLCAxKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLmFkZFRvR2FsbGVyeUFycmF5ID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICB0aGlzLmdhbGxlcnlBcnJheSAmJiB0aGlzLmdhbGxlcnlBcnJheS5wdXNoKGlkKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnVwZGF0ZUdhbGxlcnkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5nYWxsZXJ5QXJyYXkgJiYgdGhpcy5nYWxsZXJ5KSB7XHJcbiAgICAgICAgbGV0IGltYWdlUHJldmlld3MgPSB0aGlzLmdhbGxlcnkucXVlcnlTZWxlY3RvckFsbCgnLmltYWdlLXByZXZpZXcnKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGltYWdlUHJldmlld3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKCF+dGhpcy5nYWxsZXJ5QXJyYXkuaW5kZXhPZigraW1hZ2VQcmV2aWV3c1tpXS5kYXRhc2V0LmlkKSlcclxuICAgICAgICAgICAgICAgIGltYWdlUHJldmlld3NbaV0ucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2V0UHVibGljYXRpb25OdW1iZXIodGhpcy5nYWxsZXJ5QXJyYXkubGVuZ3RoKTtcclxuICAgIH1cclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLmdldEltYWdlUHJldmlld0J5SWQgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgIHJldHVybiB0aGlzLmdhbGxlcnkucXVlcnlTZWxlY3RvcihgLmltYWdlLXByZXZpZXdbZGF0YS1pZD1cIiR7aWR9XCJdYCk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS51cGRhdGVJbWFnZVByZXZpZXdUZXh0ID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICBsZXQgbGlrZUFtb3VudCA9IHRoaXMudmlld01vZGVsc1tpZF0ubGlrZXMubGVuZ3RoO1xyXG4gICAgbGV0IGNvbW1lbnRBbW91bnQgPSB0aGlzLnZpZXdNb2RlbHNbaWRdLmNvbW1lbnRzLmxlbmd0aDtcclxuICAgIGxldCBwcmV2aWV3SW1hZ2VFbGVtID0gdGhpcy5nZXRJbWFnZVByZXZpZXdCeUlkKGlkKTtcclxuICAgIHByZXZpZXdJbWFnZUVsZW0uZGF0YXNldC5saWtlQW1vdW50ID0gbGlrZUFtb3VudDtcclxuICAgIHByZXZpZXdJbWFnZUVsZW0uZGF0YXNldC5jb21tZW50QW1vdW50ID0gY29tbWVudEFtb3VudDtcclxuXHJcbiAgICBwcmV2aWV3SW1hZ2VFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZS1wcmV2aWV3X19jb21tZW50LW51bWJlcicpLnRleHRDb250ZW50ID0gY29tbWVudEFtb3VudDtcclxuICAgIHByZXZpZXdJbWFnZUVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlLXByZXZpZXdfX2xpa2UtbnVtYmVyJykudGV4dENvbnRlbnQgPSBsaWtlQW1vdW50O1xyXG5cclxuICAgIHByZXZpZXdJbWFnZUVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlLXByZXZpZXdfX2NvbW1lbnQtc2VjdGlvbiAuaW1hZ2UtcHJldmlld19fZGVzaWduYXRpb24tdGV4dCcpXHJcbiAgICAgICAgLnRleHRDb250ZW50ID0gJ2NvbW1lbnQnICsgKChjb21tZW50QW1vdW50ID09PSAxKSA/ICcnIDogJ3MnKTtcclxuICAgIHByZXZpZXdJbWFnZUVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlLXByZXZpZXdfX2xpa2Utc2VjdGlvbiAuaW1hZ2UtcHJldmlld19fZGVzaWduYXRpb24tdGV4dCcpXHJcbiAgICAgICAgLnRleHRDb250ZW50ID0gJ2xpa2UnICsgKChsaWtlQW1vdW50ID09PSAxKSA/ICcnIDogJ3MnKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLmRlbGV0ZUltYWdlUHJldmlldyA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgbGV0IGVsZW0gPSB0aGlzLmdldEltYWdlUHJldmlld0J5SWQoaWQpO1xyXG4gICAgaWYgKGVsZW0pIHtcclxuICAgICAgICBlbGVtLnJlbW92ZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0UHVibGljYXRpb25OdW1iZXIoLTEsIHRydWUpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuaW5zZXJ0TmV3SW1hZ2VQcmV2aWV3ID0gZnVuY3Rpb24gKGltYWdlSWQsIHByZXZpZXdVcmwpIHtcclxuICAgIGxldCBuZXdJbWFnZVByZXZpZXcgPSB0aGlzLmltYWdlUHJldmlld0dob3N0LmNsb25lTm9kZSh0cnVlKTtcclxuICAgIG5ld0ltYWdlUHJldmlldy5jbGFzc0xpc3QucmVtb3ZlKCdpbWFnZS1wcmV2aWV3X2dob3N0Jyk7XHJcblxyXG4gICAgbmV3SW1hZ2VQcmV2aWV3LmRhdGFzZXQuaWQgPSBpbWFnZUlkO1xyXG4gICAgbmV3SW1hZ2VQcmV2aWV3LmhyZWYgPSBgL2ltYWdlLyR7aW1hZ2VJZH1gO1xyXG4gICAgbmV3SW1hZ2VQcmV2aWV3LnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZS1wcmV2aWV3X19waWN0dXJlJykuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgnLyR7cHJldmlld1VybH0nKWA7XHJcblxyXG4gICAgbmV3SW1hZ2VQcmV2aWV3LnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZS1wcmV2aWV3X19jb21tZW50LW51bWJlcicpLnRleHRDb250ZW50ID0gMDtcclxuICAgIG5ld0ltYWdlUHJldmlldy5xdWVyeVNlbGVjdG9yKCcuaW1hZ2UtcHJldmlld19fbGlrZS1udW1iZXInKS50ZXh0Q29udGVudCA9IDA7XHJcblxyXG4gICAgdGhpcy5nYWxsZXJ5V3JhcHBlci5hcHBlbmRDaGlsZChuZXdJbWFnZVByZXZpZXcpO1xyXG5cclxuICAgIHRoaXMuc2V0UHVibGljYXRpb25OdW1iZXIoMSwgdHJ1ZSk7XHJcbiAgICB0aGlzLmFkZFRvR2FsbGVyeUFycmF5KGltYWdlSWQpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuc2V0UHVibGljYXRpb25OdW1iZXIgPSBmdW5jdGlvbiAodmFsdWUsIHJlbGF0aXZlKSB7XHJcbiAgICBpZiAodGhpcy5wdWJsaWNhdGlvbk51bWJlckVsZW0pXHJcbiAgICAgICAgaWYgKHJlbGF0aXZlKVxyXG4gICAgICAgICAgICB0aGlzLnB1YmxpY2F0aW9uTnVtYmVyRWxlbS50ZXh0Q29udGVudCA9ICt0aGlzLnB1YmxpY2F0aW9uTnVtYmVyRWxlbS50ZXh0Q29udGVudCArIHZhbHVlO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5wdWJsaWNhdGlvbk51bWJlckVsZW0udGV4dENvbnRlbnQgPSB2YWx1ZTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLmRlbGV0ZVZpZXdNb2RlbCA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgZGVsZXRlIHRoaXMudmlld01vZGVsc1tpZF07XHJcbiAgICBjb25zb2xlLmxvZygnZGVsZXRlICMnICsgaWQpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUucmVxdWVzdEFsbE5lY2Vzc2FyeVZpZXdNb2RlbHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xyXG4gICAgICAgIHRoaXMucmVxdWVzdE5leHRWaWV3TW9kZWxzKCksXHJcbiAgICAgICAgdGhpcy5yZXF1ZXN0UHJldlZpZXdNb2RlbHMoKVxyXG4gICAgXSk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5yZXF1ZXN0TmV4dFZpZXdNb2RlbHMgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgaWYgKHRoaXMuZ2FsbGVyeUFycmF5ICYmIHRoaXMuZ2FsbGVyeUFycmF5Lmxlbmd0aCA9PT0gMClcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEltYWdlTm90Rm91bmQoKSk7XHJcblxyXG4gICAgbGV0IHByb21pc2VzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucHJlbG9hZEVudGl0eUNvdW50OyBpKyspXHJcbiAgICAgICAgcHJvbWlzZXMucHVzaCh0aGlzLnJlcXVlc3RWaWV3TW9kZWwodGhpcy5nZXROZXh0SW1hZ2VJZChpKSkpO1xyXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnJlcXVlc3RQcmV2Vmlld01vZGVscyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLmdhbGxlcnlBcnJheSAmJiB0aGlzLmdhbGxlcnlBcnJheS5sZW5ndGggPT09IDApXHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBJbWFnZU5vdEZvdW5kKCkpO1xyXG4gICAgbGV0IHByb21pc2VzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucHJlbG9hZEVudGl0eUNvdW50OyBpKyspXHJcbiAgICAgICAgcHJvbWlzZXMucHVzaCh0aGlzLnJlcXVlc3RWaWV3TW9kZWwodGhpcy5nZXRQcmV2SW1hZ2VJZChpKSkpO1xyXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnN3aXRjaFRvTmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLmdhbGxlcnlBcnJheSAmJiAhdGhpcy5nYWxsZXJ5QXJyYXkubGVuZ3RoKSB7XHJcbiAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBuZXh0SW1hZ2VJZCA9IHRoaXMuZ2V0TmV4dEltYWdlSWQoKTtcclxuICAgIHRoaXMuc2hvdyhuZXh0SW1hZ2VJZCkuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgSW1hZ2VOb3RGb3VuZCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5nYWxsZXJ5QXJyYXkgJiYgdGhpcy5nYWxsZXJ5QXJyYXkubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zd2l0Y2hUb05leHQoKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuc3dpdGNoVG9QcmV2ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIGlmICh0aGlzLmdhbGxlcnlBcnJheSAmJiAhdGhpcy5nYWxsZXJ5QXJyYXkubGVuZ3RoKSB7XHJcbiAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBwcmV2SW1hZ2VJZCA9IHRoaXMuZ2V0UHJldkltYWdlSWQoKTtcclxuICAgIHRoaXMuc2hvdyhwcmV2SW1hZ2VJZCkuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgSW1hZ2VOb3RGb3VuZCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5nYWxsZXJ5QXJyYXkgJiYgdGhpcy5nYWxsZXJ5QXJyYXkubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zd2l0Y2hUb1ByZXYoKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuZ2V0TmV4dEltYWdlSWQgPSBmdW5jdGlvbiAob2Zmc2V0KSB7XHJcbiAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMTtcclxuICAgIGxldCBpbmRleCA9IHRoaXMuZ2FsbGVyeUFycmF5LmluZGV4T2YodGhpcy5jdXJyZW50SW1hZ2VJZCk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZ2FsbGVyeUFycmF5WyhpbmRleCArIG9mZnNldCkgJSB0aGlzLmdhbGxlcnlBcnJheS5sZW5ndGhdO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuZ2V0UHJldkltYWdlSWQgPSBmdW5jdGlvbiAob2Zmc2V0KSB7XHJcbiAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMTtcclxuXHJcbiAgICBsZXQgaW5kZXggPSB0aGlzLmdhbGxlcnlBcnJheS5pbmRleE9mKHRoaXMuY3VycmVudEltYWdlSWQpO1xyXG5cclxuICAgIGlmICh+aW5kZXggJiYgdGhpcy5nYWxsZXJ5QXJyYXkubGVuZ3RoID09PSAxKVxyXG4gICAgICAgIHJldHVybiB0aGlzLmdhbGxlcnlBcnJheVswXTtcclxuXHJcbiAgICBsZXQgZ2FsbGVyeVByZXZJbmRleCA9IGluZGV4IC0gb2Zmc2V0O1xyXG4gICAgaWYgKGdhbGxlcnlQcmV2SW5kZXggPCAwKSB7XHJcbiAgICAgICAgZ2FsbGVyeVByZXZJbmRleCAlPSB0aGlzLmdhbGxlcnlBcnJheS5sZW5ndGg7XHJcbiAgICAgICAgZ2FsbGVyeVByZXZJbmRleCA9IHRoaXMuZ2FsbGVyeUFycmF5Lmxlbmd0aCArIGdhbGxlcnlQcmV2SW5kZXg7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZ2FsbGVyeUFycmF5W2dhbGxlcnlQcmV2SW5kZXhdO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUudXBkYXRlQ3VycmVudFZpZXcgPSBmdW5jdGlvbiAoaW52b2x2ZWRJbWFnZUlkKSB7XHJcblxyXG4gICAgaWYgKGludm9sdmVkSW1hZ2VJZCA9PT0gdGhpcy5jdXJyZW50SW1hZ2VJZCkge1xyXG4gICAgICAgIHRoaXMuaGlkZUltZ0VsZW0oKTtcclxuXHJcbiAgICAgICAgdGhpcy5pbWdFbGVtLnNldEF0dHJpYnV0ZSgnc3JjJywgdGhpcy5jdXJyZW50Vmlld01vZGVsLmltZ1VybCk7XHJcblxyXG4gICAgICAgIHRoaXMubGlrZUJ1dHRvbi5zZXRJbWFnZUlkKHRoaXMuY3VycmVudEltYWdlSWQpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlTGlrZXModGhpcy5jdXJyZW50SW1hZ2VJZCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29tbWVudFNlY3Rpb24uc2V0SW1hZ2VJZCh0aGlzLmN1cnJlbnRJbWFnZUlkKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUNvbW1lbnRzKHRoaXMuY3VycmVudEltYWdlSWQpO1xyXG5cclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uLnRleHRDb250ZW50ID0gdGhpcy5jdXJyZW50Vmlld01vZGVsLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgIGlmICh0aGlzLmRlc2NyaXB0aW9uLnRleHRDb250ZW50ID09PSAnJylcclxuICAgICAgICAgICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ2ltYWdlX25vLWRlc2NyaXB0aW9uJyk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnaW1hZ2Vfbm8tZGVzY3JpcHRpb24nKTtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRlLnRleHRDb250ZW50ID0gdGhpcy5jdXJyZW50Vmlld01vZGVsLmNyZWF0ZURhdGVTdHI7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzTG9nZ2VkKVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50Vmlld01vZGVsLmlzT3duSW1hZ2UpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZUJ1dHRvbi5zZXRJbWFnZUlkKHRoaXMuY3VycmVudEltYWdlSWQpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1YnNjcmliZUJ1dHRvbi5zZXRJbWFnZUlkKHRoaXMuY3VycmVudEltYWdlSWQpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc0ZlZWQpXHJcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlQnV0dG9uLnNldCh7YWN0aXZlOiB0cnVlfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYXZhdGFyLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJyR7dGhpcy5jdXJyZW50Vmlld01vZGVsLmF1dGhvci5hdmF0YXJVcmxzLm1lZGl1bX0nKWA7XHJcbiAgICAgICAgdGhpcy51c2VybmFtZS50ZXh0Q29udGVudCA9IHRoaXMuY3VycmVudFZpZXdNb2RlbC5hdXRob3IudXNlcm5hbWU7XHJcblxyXG4gICAgICAgIHRoaXMuaGVhZGVyTGVmdFNpZGUuc2V0QXR0cmlidXRlKCdocmVmJywgdGhpcy5jdXJyZW50Vmlld01vZGVsLmF1dGhvci51cmwpO1xyXG4gICAgfVxyXG5cclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnVwZGF0ZUxpa2VzID0gZnVuY3Rpb24gKGltYWdlSWQpIHtcclxuICAgIGlmICh0aGlzLmN1cnJlbnRJbWFnZUlkID09PSBpbWFnZUlkKVxyXG4gICAgICAgIHRoaXMubGlrZUJ1dHRvbi5zZXQoe1xyXG4gICAgICAgICAgICBhY3RpdmU6IHRoaXMuY3VycmVudFZpZXdNb2RlbC5pc0xpa2VkLFxyXG4gICAgICAgICAgICBsaWtlQW1vdW50OiB0aGlzLmN1cnJlbnRWaWV3TW9kZWwubGlrZXMubGVuZ3RoXHJcbiAgICAgICAgfSk7XHJcbiAgICBpZiAodGhpcy5nYWxsZXJ5KVxyXG4gICAgICAgIHRoaXMudXBkYXRlSW1hZ2VQcmV2aWV3VGV4dChpbWFnZUlkKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnVwZGF0ZUNvbW1lbnRzID0gZnVuY3Rpb24gKGltYWdlSWQpIHtcclxuICAgIGlmICh0aGlzLmN1cnJlbnRJbWFnZUlkID09PSBpbWFnZUlkKVxyXG4gICAgICAgIHRoaXMuY29tbWVudFNlY3Rpb24uc2V0KHRoaXMuY3VycmVudFZpZXdNb2RlbC5jb21tZW50cyk7XHJcbiAgICBpZiAodGhpcy5nYWxsZXJ5KVxyXG4gICAgICAgIHRoaXMudXBkYXRlSW1hZ2VQcmV2aWV3VGV4dChpbWFnZUlkKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnB1c2hJbWFnZVN0YXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaGlzdG9yeS5wdXNoU3RhdGUoe1xyXG4gICAgICAgIHR5cGU6ICdpbWFnZScsXHJcbiAgICAgICAgaWQ6IHRoaXMuY3VycmVudEltYWdlSWRcclxuICAgIH0sICdpbWFnZSAjJyArIHRoaXMuY3VycmVudEltYWdlSWQsICcvaW1hZ2UvJyArIHRoaXMuY3VycmVudEltYWdlSWQpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUucHVzaEdhbGxlcnlTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBsZXQgdXJsID0gJyc7XHJcbiAgICBpZiAoIXRoaXMuaXNGZWVkKVxyXG4gICAgICAgIHVybCA9IHRoaXMuY3VycmVudFZpZXdNb2RlbCAmJiB0aGlzLmN1cnJlbnRWaWV3TW9kZWwuYXV0aG9yLnVybDtcclxuICAgIGVsc2VcclxuICAgICAgICB1cmwgPSAnL2ZlZWQnO1xyXG5cclxuICAgIGhpc3RvcnkucHVzaFN0YXRlKHtcclxuICAgICAgICB0eXBlOiAnZ2FsbGVyeSdcclxuICAgIH0sICcnLCB1cmwpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUub25Qb3BTdGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZSkge1xyXG5cclxuICAgIGlmIChzdGF0ZSAmJiBzdGF0ZS50eXBlKVxyXG4gICAgICAgIHN3aXRjaCAoc3RhdGUudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdpbWFnZSc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3coe1xyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlSWQ6IHN0YXRlLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIG5vUHVzaFN0YXRlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAnZ2FsbGVyeSc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlYWN0aXZhdGUobnVsbCwge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vUHVzaFN0YXRlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxufTtcclxuXHJcbmZvciAobGV0IGtleSBpbiBldmVudE1peGluKVxyXG4gICAgR2FsbGVyeS5wcm90b3R5cGVba2V5XSA9IGV2ZW50TWl4aW5ba2V5XTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FsbGVyeTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9nYWxsZXJ5L2luZGV4LmpzIiwibGV0IGV2ZW50TWl4aW4gPSByZXF1aXJlKExJQlMgKyAnZXZlbnRNaXhpbicpO1xyXG5cclxubGV0IFN3aXRjaEJ1dHRvbiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLmVsZW0gPSBvcHRpb25zLmVsZW07XHJcbiAgICB0aGlzLmRhdGEgPSBvcHRpb25zLmRhdGE7XHJcbiAgICB0aGlzLmRhdGFTdHIgPSBvcHRpb25zLmRhdGFTdHIgfHwgJ2ltYWdlSWQnO1xyXG5cclxuICAgIFN3aXRjaEJ1dHRvbi5wcm90b3R5cGUuc2V0LmNhbGwodGhpcywge2FjdGl2ZTogISF0aGlzLmVsZW0uZGF0YXNldC5hY3RpdmV9KTtcclxuICAgIGNvbnNvbGUubG9nKCdzd2l0Y2ggYnV0dG9uIGFjdGl2ZTonLCAhIXRoaXMuZWxlbS5kYXRhc2V0LmFjdGl2ZSk7XHJcbiAgICB0aGlzLmF2YWlsYWJsZSA9IHRydWU7XHJcblxyXG4gICAgdGhpcy5lbGVtLm9uY2xpY2sgPSBlID0+IHRoaXMub25DbGljayhlKTtcclxufTtcclxuXHJcblN3aXRjaEJ1dHRvbi5wcm90b3R5cGUub25DbGljayA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIGxldCBpbnZvbHZlZERhdGEgPSB0aGlzLmRhdGE7XHJcblxyXG4gICAgaWYgKHRoaXMuYXZhaWxhYmxlKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYXZhaWxhYmxlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy50b2dnbGUoKTtcclxuXHJcbiAgICAgICAgcmVxdWlyZShMSUJTICsgJ3NlbmRSZXF1ZXN0Jykoe1xyXG4gICAgICAgICAgICBbdGhpcy5kYXRhU3RyXTogaW52b2x2ZWREYXRhXHJcbiAgICAgICAgfSwgJ1BPU1QnLCB0aGlzLnVybCwgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmICghZXJyKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXQocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCdzd2l0Y2gtYnV0dG9uX2NoYW5nZWQnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgW3RoaXMuZGF0YVN0cl06IGludm9sdmVkRGF0YSxcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yKGVycik7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSA9PT0gaW52b2x2ZWREYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5Td2l0Y2hCdXR0b24uc2V0UmVsYXRpb24gPSBmdW5jdGlvbiAoc3dpdGNoQnV0dG9uMSwgc3dpdGNoQnV0dG9uMikge1xyXG4gICAgc3dpdGNoQnV0dG9uMS5vbignc3dpdGNoLWJ1dHRvbl9jaGFuZ2VkJywgZSA9PiB7XHJcbiAgICAgICAgc3dpdGNoQnV0dG9uMi5zZXQoZS5kZXRhaWwucmVzcG9uc2UpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgc3dpdGNoQnV0dG9uMi5vbignc3dpdGNoLWJ1dHRvbl9jaGFuZ2VkJywgZSA9PiB7XHJcbiAgICAgICAgc3dpdGNoQnV0dG9uMS5zZXQoZS5kZXRhaWwucmVzcG9uc2UpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5Td2l0Y2hCdXR0b24ucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBpZiAob3B0aW9ucy5hY3RpdmUpXHJcbiAgICAgICAgdGhpcy5fYWN0aXZhdGUoKTtcclxuICAgIGVsc2VcclxuICAgICAgICB0aGlzLl9kZWFjdGl2YXRlKCk7XHJcbn07XHJcblxyXG5Td2l0Y2hCdXR0b24ucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLmFjdGl2ZSlcclxuICAgICAgICB0aGlzLnNldCh7YWN0aXZlOiBmYWxzZX0pO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHRoaXMuc2V0KHthY3RpdmU6IHRydWV9KTtcclxufTtcclxuXHJcblN3aXRjaEJ1dHRvbi5wcm90b3R5cGUuX2FjdGl2YXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ2J1dHRvbl9hY3RpdmUnKTtcclxuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcclxufTtcclxuXHJcblN3aXRjaEJ1dHRvbi5wcm90b3R5cGUuX2RlYWN0aXZhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnYnV0dG9uX2FjdGl2ZScpO1xyXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxufTtcclxuXHJcblN3aXRjaEJ1dHRvbi5wcm90b3R5cGUuc2V0SW1hZ2VJZCA9IGZ1bmN0aW9uIChpbWFnZUlkKSB7XHJcbiAgICB0aGlzLmRhdGEgPSBpbWFnZUlkO1xyXG59O1xyXG5cclxuZm9yIChsZXQga2V5IGluIGV2ZW50TWl4aW4pXHJcbiAgICBTd2l0Y2hCdXR0b24ucHJvdG90eXBlW2tleV0gPSBldmVudE1peGluW2tleV07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFN3aXRjaEJ1dHRvbjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL3N3aXRjaC1idXR0b24vaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBpZD1cXFwiaW1hZ2VcXFwiIGNsYXNzPVxcXCJtb2RhbCBpbWFnZV9pbWctZWxlbWVudC1pbnZpc2libGUgaW1hZ2UgaW1hZ2Vfbm8tZGVzY3JpcHRpb25cXFwiPlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9faW1hZ2Utd3JhcHBlclxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGlkPVxcXCJzcGlubmVyXFxcIiBjbGFzcz1cXFwic3Bpbm5lciBpbWFnZV9fc3Bpbm5lclxcXCI+XFxyXFxuICAgICAgICBcXHJcXG4gICAgICAgIDwvZGl2PiAgICAgICAgPGltZyBjbGFzcz1cXFwiaW1hZ2VfX2ltZy1lbGVtZW50XFxcIj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19jb250cm9sc1xcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2NvbnRyb2wgaW1hZ2VfX2NvbnRyb2wtcHJldiBpY29uLWFycm93LWxlZnRcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19jb250cm9sIGltYWdlX19jb250cm9sLWZ1bGwgaWNvbi1hcnJvdy1tYXhpbWlzZVxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2NvbnRyb2wgaW1hZ2VfX2NvbnRyb2wtbmV4dCBpY29uLWFycm93LXJpZ2h0XFxcIj48L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX3NpZGViYXJcXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX3RvcC1zaWRlXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJoZWFkZXIgaW1hZ2VfX2hlYWRlclxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxhIGNsYXNzPVxcXCJpbWFnZV9faGVhZGVyLWxlZnQtc2lkZVxcXCIgaHJlZj1cXFwiXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19hdmF0YXJcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPVxcXCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJycpXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19tZXRhZGF0YVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX3VzZXJuYW1lXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fcG9zdC1kYXRlXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8L2E+XFxyXFxuXFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbiBidXR0b25faW52aXNpYmxlIGltYWdlX190b3Atc2lkZS1idXR0b24gaW1hZ2VfX2RlbGV0ZS1idXR0b24gYnV0dG9uX2hlYWRlci1zdHlsZVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICBkZWxldGVcXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXZcXHJcXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJidXR0b24gaW1hZ2VfX3RvcC1zaWRlLWJ1dHRvbiBpbWFnZV9fc3Vic2NyaWJlLWJ1dHRvbiBidXR0b25faGVhZGVyLXN0eWxlXFxcIlxcclxcbiAgICAgICAgICAgICAgICA+XFxyXFxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVcXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuXFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2luZm8tYm9hcmRcXFwiPlxcclxcblxcclxcbiAgICAgICAgICAgICAgICA8ZGl2XFxyXFxuICAgICAgICAgICAgICAgIFxcclxcbiAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJidXR0b24gbGlrZS1idXR0b24gaW1hZ2VfX2xpa2UtYnV0dG9uXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxpa2UtYnV0dG9uX19oZWFydCBpY29uLWhlYXJ0XFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxpa2UtYnV0dG9uX19oZWFydCBpY29uLWhlYXJ0LW91dGxpbmVkXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICZuYnNwO2xpa2UmbmJzcDtcXHJcXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJsaWtlLWJ1dHRvbl9fbGlrZS1hbW91bnRcXFwiPjwvc3Bhbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19kZXNjcmlwdGlvblxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICBcXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuXFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2NvbW1lbnQtc2VjdGlvbi13cmFwcGVyIGltYWdlX25vLXNjcm9sbGJhclxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnQtc2VjdGlvbiBpbWFnZV9fY29tbWVudC1zZWN0aW9uXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnQtc2VjdGlvbl9fbm8tY29tbWVudHMtYmxvY2tcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIFRoZXJlIGFyZSBubyBjb21tZW50cyB5ZXRcXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudC1zZWN0aW9uX19jb21tZW50cy13cmFwcGVyXFxcIj5cXHJcXG5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicGFuZWwgY29tbWVudCBjb21tZW50LXNlY3Rpb25fX2NvbW1lbnQgY29tbWVudF9naG9zdFxcXCIgZGF0YS1pZD1cXFwiXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnRfX3RvcC1zaWRlXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cXFwiY29tbWVudF9fcmVmXFxcIiBocmVmPVxcXCJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb21tZW50X19hdmF0YXJcXFwiIHN0eWxlPVxcXCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJycpXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudF9fbWV0YWRhdGFcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudF9fdXNlcm5hbWVcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudF9fZGF0ZVxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb21tZW50X19jbG9zZS1idXR0b24gaWNvbi1jcm9zc1xcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnRfX3RleHRcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fY29tbWVudC1zZWN0aW9uLXNjcm9sbGJhci13cmFwcGVyIGltYWdlX25vLXNjcm9sbGJhclxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19jb21tZW50LXNlY3Rpb24tc2Nyb2xsYmFyLW9mZnNldFxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19jb21tZW50LXNlY3Rpb24tc2Nyb2xsYmFyXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19jb21tZW50LXNlY3Rpb24tc2xpZGVyXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcInBhbmVsIGNvbW1lbnQgY29tbWVudC1zZW5kIGltYWdlX19jb21tZW50LXNlbmRcXFwiXFxyXFxuICAgICAgICAgICAgIGRhdGEtaW1hZ2UtaWQ9XFxcIlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudF9fdG9wLXNpZGVcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb21tZW50X19hdmF0YXJcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb21tZW50X191c2VybmFtZVxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICAgICAgPHRleHRhcmVhIHBsYWNlaG9sZGVyPVxcXCJzaGFyZSB5b3VyIG9waW5pb27igKZcXFwiIGNsYXNzPVxcXCJjb21tZW50LXNlbmRfX3RleHRhcmVhXFxcIj48L3RleHRhcmVhPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbiBjb21tZW50LXNlbmRfX3NlbmQtYnV0dG9uXFxcIj5zZW5kPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19tb2RhbC1jbG9zZS1idXR0b24td3JhcHBlclxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpY29uLWNyb3NzIG1vZGFsLWNsb3NlLWJ1dHRvbiBpbWFnZV9fbW9kYWwtY2xvc2UtYnV0dG9uXFxcIj48L2Rpdj4gICAgPC9kaXY+XFxyXFxuXFxyXFxuPC9kaXY+XFxyXFxuXFxyXFxuXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL34vaHRtbC1sb2FkZXIhLi4vYmxvY2tzL2dhbGxlcnkvd2luZG93XG4vLyBtb2R1bGUgaWQgPSAzMlxuLy8gbW9kdWxlIGNodW5rcyA9IDMgOCAxMyIsImxldCBDb21tZW50U2VjdGlvbiA9IHJlcXVpcmUoQkxPQ0tTICsgJ2NvbW1lbnQtc2VjdGlvbicpO1xyXG5cclxubGV0IEltYWdlQ29tbWVudFNlY3Rpb24gPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgQ29tbWVudFNlY3Rpb24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHJcbiAgICB0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlciA9IG9wdGlvbnMuY29tbWVudFNlY3Rpb25XcmFwcGVyO1xyXG4gICAgdGhpcy5pbmZvQm9hcmQgPSBvcHRpb25zLmluZm9Cb2FyZDtcclxuICAgIHRoaXMuc2Nyb2xsYmFyV3JhcHBlciA9IG9wdGlvbnMuc2Nyb2xsYmFyV3JhcHBlcjtcclxuICAgIHRoaXMuc2Nyb2xsYmFyID0gdGhpcy5zY3JvbGxiYXJXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fY29tbWVudC1zZWN0aW9uLXNjcm9sbGJhcicpO1xyXG4gICAgdGhpcy5zY3JvbGxiYXJPZmZzZXQgPSB0aGlzLnNjcm9sbGJhcldyYXBwZXIucXVlcnlTZWxlY3RvcignLmltYWdlX19jb21tZW50LXNlY3Rpb24tc2Nyb2xsYmFyLW9mZnNldCcpO1xyXG4gICAgdGhpcy5zY3JvbGxiYXJTbGlkZXIgPSB0aGlzLnNjcm9sbGJhcldyYXBwZXIucXVlcnlTZWxlY3RvcignLmltYWdlX19jb21tZW50LXNlY3Rpb24tc2xpZGVyJyk7XHJcblxyXG4gICAgdGhpcy5jb21tZW50U2VjdGlvbldyYXBwZXIub25zY3JvbGwgPSBlID0+IHtcclxuICAgICAgICBpZiAoIXRoaXMub25EcmFnZ2luZylcclxuICAgICAgICAgICAgdGhpcy5zZXRUb3AoKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5zY3JvbGxiYXJTbGlkZXIub25tb3VzZWRvd24gPSBlID0+IHtcclxuXHJcbiAgICAgICAgdGhpcy5vbkRyYWdnaW5nID0gdHJ1ZTtcclxuICAgICAgICBsZXQgc2xpZGVyQ29vcmRzID0gZ2V0Q29vcmRzKHRoaXMuc2Nyb2xsYmFyU2xpZGVyKTtcclxuICAgICAgICBsZXQgc2hpZnRZID0gZS5wYWdlWSAtIHNsaWRlckNvb3Jkcy50b3A7XHJcbiAgICAgICAgbGV0IHNjcm9sbGJhckNvb3JkcyA9IGdldENvb3Jkcyh0aGlzLnNjcm9sbGJhcik7XHJcbiAgICAgICAgbGV0IG5ld1RvcDtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQub25tb3VzZW1vdmUgPSBlID0+IHtcclxuICAgICAgICAgICAgbmV3VG9wID0gZS5wYWdlWSAtIHNoaWZ0WSAtIHNjcm9sbGJhckNvb3Jkcy50b3A7XHJcbiAgICAgICAgICAgIGlmIChuZXdUb3AgPCAwKSBuZXdUb3AgPSAwO1xyXG4gICAgICAgICAgICBsZXQgYm90dG9tRWRnZSA9IHRoaXMuc2Nyb2xsYmFyLm9mZnNldEhlaWdodCAtIHRoaXMuc2Nyb2xsYmFyU2xpZGVyLm9mZnNldEhlaWdodDtcclxuICAgICAgICAgICAgaWYgKG5ld1RvcCA+IGJvdHRvbUVkZ2UpIG5ld1RvcCA9IGJvdHRvbUVkZ2U7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbGJhclNsaWRlci5zdHlsZS50b3AgPSBuZXdUb3AgKyAncHgnO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jb21tZW50U2VjdGlvbldyYXBwZXIuc2Nyb2xsVG9wID0gKG5ld1RvcCAvIHRoaXMuc2Nyb2xsYmFyLm9mZnNldEhlaWdodCkgLyAoMSAtIHRoaXMuc2xpZGVyU2l6ZVJhdGUpICpcclxuICAgICAgICAgICAgICAgICh0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlci5zY3JvbGxIZWlnaHQgLSB0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlci5vZmZzZXRIZWlnaHQpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGRvY3VtZW50Lm9ubW91c2V1cCA9IGUgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnb25tb3VzZXVwJywgbmV3VG9wLCB0aGlzLnNjcm9sbGJhci5vZmZzZXRIZWlnaHQpO1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbGJhclNsaWRlci5zdHlsZS50b3AgPSAobmV3VG9wICogMTAwIC8gdGhpcy5zY3JvbGxiYXIub2Zmc2V0SGVpZ2h0KSArICclJztcclxuICAgICAgICAgICAgdGhpcy5vbkRyYWdnaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGRvY3VtZW50Lm9ubW91c2Vtb3ZlID0gZG9jdW1lbnQub25tb3VzZXVwID0gbnVsbDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7IC8vIGRpc2FibGUgc2VsZWN0aW9uIHN0YXJ0IChjdXJzb3IgY2hhbmdlKVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnNjcm9sbGJhclNsaWRlci5vbmRyYWdzdGFydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldENvb3JkcyhlbGVtKSB7IC8vINC60YDQvtC80LUgSUU4LVxyXG4gICAgICAgIGxldCBib3ggPSBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0b3A6IGJveC50b3AgKyBwYWdlWU9mZnNldCxcclxuICAgICAgICAgICAgbGVmdDogYm94LmxlZnQgKyBwYWdlWE9mZnNldFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxufTtcclxuSW1hZ2VDb21tZW50U2VjdGlvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbW1lbnRTZWN0aW9uLnByb3RvdHlwZSk7XHJcbkltYWdlQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gSW1hZ2VDb21tZW50U2VjdGlvbjtcclxuXHJcbkltYWdlQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIENvbW1lbnRTZWN0aW9uLnByb3RvdHlwZS5zZXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgIHRoaXMudXBkYXRlKCk7XHJcbn07XHJcblxyXG5JbWFnZUNvbW1lbnRTZWN0aW9uLnByb3RvdHlwZS5zZXRUb3AgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgc2Nyb2xsUmF0ZSA9ICh0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlci5zY3JvbGxUb3ApIC9cclxuICAgICAgICAodGhpcy5jb21tZW50U2VjdGlvbldyYXBwZXIuc2Nyb2xsSGVpZ2h0IC0gdGhpcy5jb21tZW50U2VjdGlvbldyYXBwZXIub2Zmc2V0SGVpZ2h0KSAqIDEwMDtcclxuXHJcbiAgICB0aGlzLnNjcm9sbGJhclNsaWRlci5zdHlsZS50b3AgPSBgJHsoMSAtIHRoaXMuc2xpZGVyU2l6ZVJhdGUpICogc2Nyb2xsUmF0ZX0lYDtcclxuXHJcbn07XHJcblxyXG5JbWFnZUNvbW1lbnRTZWN0aW9uLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlci5jbGFzc0xpc3QuYWRkKCdpbWFnZV9uby1zY3JvbGxiYXInKTtcclxuICAgIHRoaXMuc2Nyb2xsYmFyV3JhcHBlci5jbGFzc0xpc3QuYWRkKCdpbWFnZV9uby1zY3JvbGxiYXInKTtcclxuXHJcbiAgICB0aGlzLmluZm9Cb2FyZEhlaWdodCA9IHRoaXMuaW5mb0JvYXJkLm9mZnNldEhlaWdodDtcclxuXHJcbiAgICBsZXQgY29tcHV0ZWRTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUodGhpcy5pbmZvQm9hcmQpO1xyXG4gICAgcGFyc2VGbG9hdChjb21wdXRlZFN0eWxlLmhlaWdodCkgJiYgKHRoaXMuaW5mb0JvYXJkSGVpZ2h0ID0gcGFyc2VGbG9hdChjb21wdXRlZFN0eWxlLmhlaWdodCkpO1xyXG5cclxuICAgIHRoaXMuc2Nyb2xsYmFyT2Zmc2V0LnN0eWxlLmhlaWdodCA9IGAke3RoaXMuaW5mb0JvYXJkSGVpZ2h0fXB4YDtcclxuICAgIHRoaXMuc2Nyb2xsYmFyLnN0eWxlLmhlaWdodCA9IGBjYWxjKDEwMCUgLSAke3RoaXMuaW5mb0JvYXJkSGVpZ2h0fXB4KWA7XHJcblxyXG4gICAgaWYgKHRoaXMuY29tbWVudFNlY3Rpb25XcmFwcGVyLm9mZnNldEhlaWdodCAtIHRoaXMuY29tbWVudHNXcmFwcGVyLnNjcm9sbEhlaWdodCA8IC0xKSB7XHJcbiAgICAgICAgdGhpcy5zbGlkZXJTaXplUmF0ZSA9IHRoaXMuY29tbWVudFNlY3Rpb25XcmFwcGVyLm9mZnNldEhlaWdodCAvIHRoaXMuY29tbWVudHNXcmFwcGVyLnNjcm9sbEhlaWdodDtcclxuICAgICAgICB0aGlzLnNjcm9sbGJhclNsaWRlci5zdHlsZS5oZWlnaHQgPSBgJHt0aGlzLnNsaWRlclNpemVSYXRlICogMTAwfSVgO1xyXG5cclxuICAgICAgICB0aGlzLnNldFRvcCgpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCdpbWFnZV9uby1zY3JvbGxiYXInKTtcclxuICAgICAgICB0aGlzLnNjcm9sbGJhcldyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSgnaW1hZ2Vfbm8tc2Nyb2xsYmFyJyk7XHJcbiAgICB9XHJcblxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW1hZ2VDb21tZW50U2VjdGlvbjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL2ltYWdlLWNvbW1lbnQtc2VjdGlvbi9pbmRleC5qcyIsImxldCBldmVudE1peGluID0gcmVxdWlyZShMSUJTICsgJ2V2ZW50TWl4aW4nKTtcclxuXHJcbmxldCBDb21tZW50U2VjdGlvbiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgdGhpcy5lbGVtID0gb3B0aW9ucy5lbGVtO1xyXG4gICAgdGhpcy5jb21tZW50c1dyYXBwZXIgPSBvcHRpb25zLmVsZW0ucXVlcnlTZWxlY3RvcignLmNvbW1lbnQtc2VjdGlvbl9fY29tbWVudHMtd3JhcHBlcicpO1xyXG4gICAgdGhpcy5pbWFnZUlkID0gb3B0aW9ucy5pbWFnZUlkO1xyXG4gICAgdGhpcy5sb2dnZWRVc2VyVmlld01vZGVsID0gb3B0aW9ucy5sb2dnZWRVc2VyVmlld01vZGVsO1xyXG5cclxuICAgIHRoaXMuY29tbWVudFNlbmRlckVsZW0gPSBvcHRpb25zLmNvbW1lbnRTZW5kZXJFbGVtO1xyXG4gICAgdGhpcy5jb21tZW50U2VuZFRleHRhcmVhID0gdGhpcy5jb21tZW50U2VuZGVyRWxlbS5xdWVyeVNlbGVjdG9yKCcuY29tbWVudC1zZW5kX190ZXh0YXJlYScpO1xyXG5cclxuICAgIHRoaXMuZ2hvc3QgPSB0aGlzLmNvbW1lbnRzV3JhcHBlci5xdWVyeVNlbGVjdG9yKCcuY29tbWVudCcpO1xyXG5cclxuICAgIGlmICh0aGlzLmxvZ2dlZFVzZXJWaWV3TW9kZWwpIHtcclxuICAgICAgICB0aGlzLmNvbW1lbnRTZW5kZXJFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50X19hdmF0YXInKS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCcke3RoaXMubG9nZ2VkVXNlclZpZXdNb2RlbC5hdmF0YXJVcmxzLm1lZGl1bX0nKWA7XHJcbiAgICAgICAgdGhpcy5jb21tZW50U2VuZGVyRWxlbS5xdWVyeVNlbGVjdG9yKCcuY29tbWVudF9fdXNlcm5hbWUnKS50ZXh0Q29udGVudCA9IHRoaXMubG9nZ2VkVXNlclZpZXdNb2RlbC51c2VybmFtZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jb21tZW50U2VuZGVyRWxlbS5xdWVyeVNlbGVjdG9yKCcuY29tbWVudF9fYXZhdGFyJykuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgnJHtBTk9OX0FWQVRBUl9VUkx9JylgO1xyXG4gICAgICAgIHRoaXMuY29tbWVudFNlbmRlckVsZW0ucXVlcnlTZWxlY3RvcignLmNvbW1lbnRfX3VzZXJuYW1lJykudGV4dENvbnRlbnQgPSBBTk9OX05BTUU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jb21tZW50U2VuZGVyRWxlbS5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgaWYgKCFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2NvbW1lbnQtc2VuZF9fc2VuZC1idXR0b24nKSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgaW52b2x2ZWRJbWFnZUlkID0gdGhpcy5pbWFnZUlkO1xyXG4gICAgICAgIGxldCB0ZXh0ID0gdGhpcy5jb21tZW50U2VuZFRleHRhcmVhLnZhbHVlO1xyXG4gICAgICAgIGlmICh0ZXh0Lmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgcmVxdWlyZShMSUJTICsgJ3NlbmRSZXF1ZXN0Jykoe1xyXG4gICAgICAgICAgICAgICAgaWQ6IGludm9sdmVkSW1hZ2VJZCxcclxuICAgICAgICAgICAgICAgIHRleHRcclxuICAgICAgICAgICAgfSwgJ1BPU1QnLCAnL2NvbW1lbnQnLCAoZXJyLCByZXNwb25zZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY29tbWVudFNlbmRUZXh0YXJlYS52YWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaW1hZ2VJZCA9PT0gaW52b2x2ZWRJbWFnZUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnNlcnROZXdDb21tZW50KHJlc3BvbnNlLnZpZXdNb2RlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxUb0JvdHRvbSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlcignY29tbWVudC1zZWN0aW9uX2NoYW5nZWQnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VJZDogaW52b2x2ZWRJbWFnZUlkXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5lbGVtLm9uY2xpY2sgPSBlID0+IHtcclxuICAgICAgICBpZiAoIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnY29tbWVudF9fY2xvc2UtYnV0dG9uJykpIHJldHVybjtcclxuXHJcbiAgICAgICAgbGV0IGNvbW1lbnQgPSBlLnRhcmdldC5jbG9zZXN0KCcuY29tbWVudCcpO1xyXG4gICAgICAgIGxldCBjb21tZW50SWQgPSBjb21tZW50LmRhdGFzZXQuaWQ7XHJcbiAgICAgICAgbGV0IGludm9sdmVkSW1hZ2VJZCA9IHRoaXMuaW1hZ2VJZDtcclxuXHJcbiAgICAgICAgcmVxdWlyZShMSUJTICsgJ3NlbmRSZXF1ZXN0Jykoe1xyXG4gICAgICAgICAgICBpZDogY29tbWVudElkXHJcbiAgICAgICAgfSwgJ0RFTEVURScsICcvY29tbWVudCcsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCdjb21tZW50LXNlY3Rpb25fY2hhbmdlZCcsIHtcclxuICAgICAgICAgICAgICAgIGltYWdlSWQ6IGludm9sdmVkSW1hZ2VJZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29tbWVudC5yZW1vdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG59O1xyXG5cclxuQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlLnNjcm9sbFRvQm90dG9tID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5jb21tZW50c1dyYXBwZXIuc2Nyb2xsVG9wID0gdGhpcy5jb21tZW50c1dyYXBwZXIuc2Nyb2xsSGVpZ2h0O1xyXG59O1xyXG5cclxuQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlLmluc2VydE5ld0NvbW1lbnQgPSBmdW5jdGlvbiAodmlld01vZGVsKSB7XHJcbiAgICBsZXQgbmV3Q29tbWVudCA9IHRoaXMuZ2hvc3QuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgbmV3Q29tbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjb21tZW50X2dob3N0Jyk7XHJcbiAgICBuZXdDb21tZW50LmRhdGFzZXQuaWQgPSB2aWV3TW9kZWwuX2lkO1xyXG4gICAgbmV3Q29tbWVudC5xdWVyeVNlbGVjdG9yKCcuY29tbWVudF9fcmVmJykuc2V0QXR0cmlidXRlKCdocmVmJywgdmlld01vZGVsLmNvbW1lbnRhdG9yLnVybCk7XHJcbiAgICBuZXdDb21tZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50X19hdmF0YXInKS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPVxyXG4gICAgICAgIGB1cmwoJyR7dmlld01vZGVsLmNvbW1lbnRhdG9yLmF2YXRhclVybHMubWVkaXVtfScpYDtcclxuICAgIG5ld0NvbW1lbnQucXVlcnlTZWxlY3RvcignLmNvbW1lbnRfX3VzZXJuYW1lJykudGV4dENvbnRlbnQgPSB2aWV3TW9kZWwuY29tbWVudGF0b3IudXNlcm5hbWU7XHJcbiAgICBuZXdDb21tZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50X19kYXRlJykudGV4dENvbnRlbnQgPSB2aWV3TW9kZWwuY3JlYXRlRGF0ZVN0cjtcclxuXHJcbiAgICBpZiAoIXZpZXdNb2RlbC5pc093bkNvbW1lbnQpXHJcbiAgICAgICAgbmV3Q29tbWVudC5jbGFzc0xpc3QuYWRkKCdjb21tZW50X25vdC1vd24nKTtcclxuICAgIGVsc2VcclxuICAgICAgICBuZXdDb21tZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NvbW1lbnRfbm90LW93bicpO1xyXG5cclxuICAgIG5ld0NvbW1lbnQucXVlcnlTZWxlY3RvcignLmNvbW1lbnRfX3RleHQnKS50ZXh0Q29udGVudCA9IHZpZXdNb2RlbC50ZXh0O1xyXG4gICAgdGhpcy5jb21tZW50c1dyYXBwZXIuYXBwZW5kQ2hpbGQobmV3Q29tbWVudCk7XHJcblxyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbW1lbnQtc2VjdGlvbl9uby1jb21tZW50cycpO1xyXG59O1xyXG5cclxuXHJcbkNvbW1lbnRTZWN0aW9uLnByb3RvdHlwZS5zZXRJbWFnZUlkID0gZnVuY3Rpb24gKGltYWdlSWQpIHtcclxuICAgIHRoaXMuaW1hZ2VJZCA9IGltYWdlSWQ7XHJcbn07XHJcblxyXG5Db21tZW50U2VjdGlvbi5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHZpZXdNb2RlbHMpIHtcclxuICAgIHRoaXMuY2xlYXIoKTtcclxuXHJcbiAgICBpZiAodmlld01vZGVscy5sZW5ndGggPiAwKVxyXG4gICAgICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdjb21tZW50LXNlY3Rpb25fbm8tY29tbWVudHMnKTtcclxuXHJcbiAgICB2aWV3TW9kZWxzLmZvckVhY2godmlld01vZGVsID0+IHtcclxuICAgICAgICB0aGlzLmluc2VydE5ld0NvbW1lbnQodmlld01vZGVsKTtcclxuICAgIH0pO1xyXG5cclxufTtcclxuXHJcbkNvbW1lbnRTZWN0aW9uLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB0aGlzLmNvbW1lbnRzV3JhcHBlci5pbm5lckhUTUwgPSAnJztcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdjb21tZW50LXNlY3Rpb25fbm8tY29tbWVudHMnKTtcclxufTtcclxuXHJcblxyXG5mb3IgKGxldCBrZXkgaW4gZXZlbnRNaXhpbilcclxuICAgIENvbW1lbnRTZWN0aW9uLnByb3RvdHlwZVtrZXldID0gZXZlbnRNaXhpbltrZXldO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb21tZW50U2VjdGlvbjtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9jb21tZW50LXNlY3Rpb24vaW5kZXguanMiLCJsZXQgU3dpdGNoQnV0dG9uID0gcmVxdWlyZShCTE9DS1MgKyAnc3dpdGNoLWJ1dHRvbicpO1xyXG5cclxubGV0IExpa2VCdXR0b24gPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgU3dpdGNoQnV0dG9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblxyXG4gICAgdGhpcy5saWtlQW1vdW50ID0gK3RoaXMuZWxlbS5kYXRhc2V0Lmxpa2VBbW91bnQ7XHJcbiAgICB0aGlzLmxpa2VBbW91bnRFbGVtID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5saWtlLWJ1dHRvbl9fbGlrZS1hbW91bnQnKTtcclxuXHJcblxyXG4gICAgdGhpcy51cmwgPSAnL2xpa2UnO1xyXG5cclxuXHJcblxyXG59O1xyXG5MaWtlQnV0dG9uLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoU3dpdGNoQnV0dG9uLnByb3RvdHlwZSk7XHJcbkxpa2VCdXR0b24ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTGlrZUJ1dHRvbjtcclxuXHJcbkxpa2VCdXR0b24ucHJvdG90eXBlLnNldEFtb3VudCA9IGZ1bmN0aW9uIChsaWtlQW1vdW50KSB7XHJcbiAgICB0aGlzLmxpa2VBbW91bnQgPSBsaWtlQW1vdW50O1xyXG4gICAgdGhpcy5saWtlQW1vdW50RWxlbS50ZXh0Q29udGVudCA9IGxpa2VBbW91bnQ7XHJcbn07XHJcblxyXG5MaWtlQnV0dG9uLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgdGhpcy5zZXRBbW91bnQob3B0aW9ucy5saWtlQW1vdW50KTtcclxuICAgIFN3aXRjaEJ1dHRvbi5wcm90b3R5cGUuc2V0LmNhbGwodGhpcywgb3B0aW9ucyk7XHJcbn07XHJcblxyXG5MaWtlQnV0dG9uLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5hY3RpdmUpXHJcbiAgICAgICAgdGhpcy5zZXQoe2FjdGl2ZTogZmFsc2UsIGxpa2VBbW91bnQ6IHRoaXMubGlrZUFtb3VudCAtIDF9KTtcclxuICAgIGVsc2VcclxuICAgICAgICB0aGlzLnNldCh7YWN0aXZlOiB0cnVlLCBsaWtlQW1vdW50OiB0aGlzLmxpa2VBbW91bnQgKyAxfSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExpa2VCdXR0b247XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvbGlrZS1idXR0b24vaW5kZXguanMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQ0E7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUtBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTs7Ozs7Ozs7Ozs7QUN2dEJBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7OztBQUVBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7Ozs7Ozs7QUN0RkE7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7Ozs7Ozs7Ozs7QUN0R0E7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBOzs7Ozs7Ozs7QUMvSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBOzs7OzsiLCJzb3VyY2VSb290IjoiIn0=