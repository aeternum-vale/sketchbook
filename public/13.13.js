webpackJsonp([13],{

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

/***/ 32:
/***/ (function(module, exports) {

	'use strict';

	var getCorrectNounForm = function getCorrectNounForm(singleForm, amount) {
	    return singleForm + (amount === 1 ? '' : 's');
	};

	module.exports = getCorrectNounForm;

/***/ }),

/***/ 33:
/***/ (function(module, exports) {

	module.exports = "<div id=\"image\" class=\"modal image_img-element-invisible image image_no-description\">\r\n    <div class=\"image__image-wrapper\">\r\n        <div id=\"spinner\" class=\"spinner image__spinner\">\r\n        \r\n        </div>        <img class=\"image__img-element\">\r\n        <div class=\"image__controls\">\r\n            <div class=\"image__control image__control-prev icon-arrow-left\"></div>\r\n            <div class=\"image__control image__control-full icon-arrow-maximise\"></div>\r\n            <div class=\"image__control image__control-next icon-arrow-right\"></div>\r\n        </div>\r\n    </div>\r\n    <div class=\"image__sidebar\">\r\n        <div class=\"image__top-side\">\r\n            <div class=\"header image__header\">\r\n                <a class=\"image__header-left-side\" href=\"\">\r\n                    <div class=\"image__avatar\"\r\n                         style=\"background-image: url('')\"></div>\r\n                    <div class=\"image__metadata\">\r\n                        <div class=\"image__username\"></div>\r\n                        <div class=\"image__post-date\"></div>\r\n                    </div>\r\n                </a>\r\n\r\n                <div class=\"button button_invisible image__top-side-button image__delete-button button_header-style\">\r\n                    delete\r\n                </div>\r\n                <div\r\n                    class=\"button image__top-side-button image__subscribe-button button_header-style\"\r\n                >\r\n                    subscribe\r\n                </div>\r\n            </div>\r\n\r\n\r\n            <div class=\"image__info-board\">\r\n\r\n                <div\r\n                \r\n                     class=\"button like-button image__like-button\">\r\n                    <div class=\"like-button__heart icon-heart\"></div>\r\n                    <div class=\"like-button__heart icon-heart-outlined\"></div>\r\n                    &nbsp;like&nbsp;\r\n                    <span class=\"like-button__like-amount\"></span>\r\n                </div>\r\n                <div class=\"image__description\">\r\n                    \r\n                </div>\r\n\r\n            </div>\r\n\r\n\r\n            <div class=\"image__comment-section-wrapper image_no-scrollbar\">\r\n                <div class=\"comment-section image__comment-section\">\r\n                    <div class=\"comment-section__no-comments-block\">\r\n                        There are no comments yet\r\n                    </div>\r\n                    <div class=\"comment-section__comments-wrapper\">\r\n\r\n                            <div class=\"panel comment comment-section__comment comment_ghost\" data-id=\"\">\r\n                                <div class=\"comment__top-side\">\r\n                                    <a class=\"comment__ref\" href=\"\">\r\n                                        <div class=\"comment__avatar\" style=\"background-image: url('')\"></div>\r\n                                        <div class=\"comment__metadata\">\r\n                                            <div class=\"comment__username\"></div>\r\n                                            <div class=\"comment__date\"></div>\r\n                                        </div>\r\n                                    </a>\r\n                                    <div class=\"comment__close-button icon-cross\"></div>\r\n                                </div>\r\n                                <div class=\"comment__text\"></div>\r\n                            </div>\r\n\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"image__comment-section-scrollbar-wrapper image_no-scrollbar\">\r\n                <div class=\"image__comment-section-scrollbar-offset\"></div>\r\n                <div class=\"image__comment-section-scrollbar\">\r\n                    <div class=\"image__comment-section-slider\"></div>\r\n                </div>\r\n\r\n            </div>\r\n\r\n        </div>\r\n\r\n        <div class=\"panel comment comment-send image__comment-send\"\r\n             data-image-id=\"\">\r\n            <div class=\"comment__top-side\">\r\n                <div class=\"comment__avatar\"></div>\r\n                <div class=\"comment__username\"></div>\r\n            </div>\r\n\r\n            <textarea placeholder=\"share your opinion…\" class=\"comment-send__textarea\"></textarea>\r\n            <div class=\"button comment-send__send-button\">send</div>\r\n        </div>\r\n    </div>\r\n    <div class=\"image__modal-close-button-wrapper\">\r\n        <div class=\"icon-cross modal-close-button image__modal-close-button\"></div>    </div>\r\n\r\n</div>\r\n\r\n";

/***/ }),

/***/ 34:
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

/***/ 35:
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

/***/ 36:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTMuMTMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvc2VuZFJlcXVlc3QuanM/OGEyNyoqIiwid2VicGFjazovLy8uLi9ibG9ja3MvZ2FsbGVyeS9pbmRleC5qcz9iNTIwKiIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL3N3aXRjaC1idXR0b24vaW5kZXguanM/YWE4NioqKiIsIndlYnBhY2s6Ly8vRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvZ2V0Q29ycmVjdE5vdW5Gb3JtLmpzPzg4MzYqKioiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9nYWxsZXJ5L3dpbmRvdz9jNmIwKiIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2ltYWdlLWNvbW1lbnQtc2VjdGlvbi9pbmRleC5qcz9kNjYyKiIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2NvbW1lbnQtc2VjdGlvbi9pbmRleC5qcz80ZjAzKiIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2xpa2UtYnV0dG9uL2luZGV4LmpzPzFiNTIqIl0sInNvdXJjZXNDb250ZW50IjpbImxldCBTZXJ2ZXJFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5TZXJ2ZXJFcnJvcjtcclxubGV0IENsaWVudEVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLkNsaWVudEVycm9yO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYm9keU9iaiwgbWV0aG9kLCB1cmwsIGNiKSB7XHJcblxyXG5cclxuICAgIGxldCBib2R5ID0gJyc7XHJcbiAgICBpZiAoISh0eXBlb2YgYm9keU9iaiA9PT0gJ3N0cmluZycpKSB7XHJcbiAgICAgICAgZm9yIChsZXQga2V5IGluIGJvZHlPYmopIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgIGlmIChib2R5T2JqW2tleV0pXHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGtleSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCgodHlwZW9mIGJvZHlPYmpba2V5XSA9PT0gJ29iamVjdCcpID8gSlNPTi5zdHJpbmdpZnkoYm9keU9ialtrZXldKSA6IGJvZHlPYmpba2V5XSk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICAgICAgICAgIGJvZHkgKz0gKGJvZHkgPT09ICcnID8gJycgOiAnJicpICsgdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlXHJcbiAgICAgICAgYm9keSA9IGJvZHlPYmo7XHJcblxyXG5cclxuICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgIHhoci5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKTtcclxuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XHJcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIlgtUmVxdWVzdGVkLVdpdGhcIiwgXCJYTUxIdHRwUmVxdWVzdFwiKTtcclxuXHJcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgIT0gNCkgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgcmVzcG9uc2U7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnJlc3BvbnNlVGV4dClcclxuICAgICAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY2IobmV3IFNlcnZlckVycm9yKCdTZXJ2ZXIgaXMgbm90IHJlc3BvbmRpbmcnKSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCAzMDApXHJcbiAgICAgICAgICAgIGNiKG51bGwsIHJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDQwMCAmJiB0aGlzLnN0YXR1cyA8IDUwMClcclxuICAgICAgICAgICAgY2IobmV3IENsaWVudEVycm9yKHJlc3BvbnNlLm1lc3NhZ2UsIHJlc3BvbnNlLmRldGFpbCwgdGhpcy5zdGF0dXMpKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDUwMClcclxuICAgICAgICAgICAgY2IobmV3IFNlcnZlckVycm9yKHJlc3BvbnNlLm1lc3NhZ2UsIHRoaXMuc3RhdHVzKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnNvbGUubG9nKGBzZW5kaW5nIG5leHQgcmVxdWVzdDogJHtib2R5fWApO1xyXG4gICAgeGhyLnNlbmQoYm9keSk7XHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9zZW5kUmVxdWVzdC5qcyIsImxldCBldmVudE1peGluID0gcmVxdWlyZShMSUJTICsgJ2V2ZW50TWl4aW4nKTtcclxubGV0IENsaWVudEVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLkNsaWVudEVycm9yO1xyXG5sZXQgSW1hZ2VOb3RGb3VuZCA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5JbWFnZU5vdEZvdW5kO1xyXG5sZXQgTW9kYWwgPSByZXF1aXJlKEJMT0NLUyArICdtb2RhbCcpO1xyXG5sZXQgU3dpdGNoQnV0dG9uID0gcmVxdWlyZShCTE9DS1MgKyAnc3dpdGNoLWJ1dHRvbicpO1xyXG5sZXQgZ2V0Q29ycmVjdE5vdW5Gb3JtID0gcmVxdWlyZShMSUJTICsgJ2dldENvcnJlY3ROb3VuRm9ybScpO1xyXG5cclxubGV0IEdhbGxlcnkgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgTW9kYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgIHRoaXMuc3RhdHVzID0gTW9kYWwuc3RhdHVzZXMuTUFKT1I7XHJcblxyXG4gICAgdGhpcy5nYWxsZXJ5ID0gb3B0aW9ucy5nYWxsZXJ5O1xyXG4gICAgdGhpcy5lbGVtID0gb3B0aW9ucy5lbGVtO1xyXG4gICAgdGhpcy5pc0xvZ2dlZCA9IG9wdGlvbnMuaXNMb2dnZWQ7XHJcbiAgICB0aGlzLnByZWxvYWRFbnRpdHlDb3VudCA9IG9wdGlvbnMucHJlbG9hZEVudGl0eUNvdW50O1xyXG4gICAgdGhpcy5pc0ZlZWQgPSBvcHRpb25zLmlzRmVlZCB8fCBmYWxzZTtcclxuICAgIHRoaXMudXNlclN1YnNjcmliZUJ1dHRvbiA9IG9wdGlvbnMudXNlclN1YnNjcmliZUJ1dHRvbjtcclxuXHJcbiAgICB0aGlzLnZpZXdNb2RlbHMgPSB7fTtcclxuICAgIHRoaXMuZ2FsbGVyeUFycmF5ID0gbnVsbDtcclxuICAgIHRoaXMuY3VycmVudEltYWdlSWQgPSBudWxsO1xyXG5cclxuICAgIHRoaXMubG9nZ2VkVXNlclZpZXdNb2RlbCA9IG51bGw7XHJcbiAgICB0aGlzLmlzRW1iZWRkZWQgPSAhIXRoaXMuZ2FsbGVyeTtcclxuICAgIHRoaXMucHJlbG9hZGVkSW1hZ2VzID0ge307XHJcblxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdjdXJyZW50Vmlld01vZGVsJywge1xyXG4gICAgICAgIGdldDogKCkgPT4gdGhpcy52aWV3TW9kZWxzW3RoaXMuY3VycmVudEltYWdlSWRdXHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gdGhpcy5wcmVsb2FkRW50aXR5Q291bnQ7IGkrKykge1xyXG4gICAgICAgIHRoaXMucHJlbG9hZGVkSW1hZ2VzW2ldID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgdGhpcy5wcmVsb2FkZWRJbWFnZXNbLWldID0gbmV3IEltYWdlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgZSA9PiB7XHJcbiAgICAgICAgdGhpcy5vblBvcFN0YXRlKGUuc3RhdGUpO1xyXG4gICAgfSwgZmFsc2UpO1xyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBlID0+IHtcclxuICAgICAgICB0aGlzLm9uUmVzaXplKCk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgdGhpcy5wdXNoR2FsbGVyeVN0YXRlKCk7XHJcblxyXG4gICAgaWYgKHRoaXMuaXNFbWJlZGRlZClcclxuICAgICAgICB0aGlzLnNldEdhbGxlcnkob3B0aW9ucyk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5zaG93KCt0aGlzLmVsZW0uZGF0YXNldC5pZCkuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yKGVycik7XHJcbiAgICAgICAgfSk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoTW9kYWwucHJvdG90eXBlKTtcclxuR2FsbGVyeS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBHYWxsZXJ5O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUub25SZXNpemUgPSBmdW5jdGlvbigpIHtcclxuICAgIC8vIGNvbnN0IEdMT0JBTF9TTUFMTF9TQ1JFRU5fV0lEVEggPSA3MDA7XHJcbiAgICAvLyBpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIDw9IEdMT0JBTF9TTUFMTF9TQ1JFRU5fV0lEVEgpXHJcbiAgICAvLyAgICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ2ltYWdlX3NtYWxsJyk7XHJcbiAgICAvLyBlbHNlXHJcbiAgICAvLyAgICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2ltYWdlX3NtYWxsJyk7XHJcbiAgICAvL1xyXG4gICAgLy8gdGhpcy5yZXNpemVJbWFnZSgpO1xyXG4gICAgdGhpcy5jb21tZW50U2VjdGlvbiAmJiB0aGlzLmNvbW1lbnRTZWN0aW9uLnVwZGF0ZSgpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUub25HYWxsZXJ5Q2xpY2sgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgbGV0IHRhcmdldDtcclxuICAgIGlmICghKHRhcmdldCA9IGUudGFyZ2V0LmNsb3Nlc3QoJy5pbWFnZS1wcmV2aWV3JykpKSByZXR1cm47XHJcblxyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgbGV0IGltYWdlSWQgPSArdGFyZ2V0LmRhdGFzZXQuaWQ7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuYWN0aXZhdGUoe2ltYWdlSWR9KTtcclxufTtcclxuXHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5zZXRHYWxsZXJ5ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIHRoaXMucHVibGljYXRpb25OdW1iZXJFbGVtID0gb3B0aW9ucy5wdWJsaWNhdGlvbk51bWJlckVsZW07XHJcbiAgICB0aGlzLmltYWdlUHJldmlld0dob3N0ID0gdGhpcy5nYWxsZXJ5LnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZS1wcmV2aWV3Jyk7XHJcbiAgICB0aGlzLmdhbGxlcnlXcmFwcGVyID0gdGhpcy5nYWxsZXJ5LnF1ZXJ5U2VsZWN0b3IoJy5nYWxsZXJ5X193cmFwcGVyJyk7XHJcblxyXG4gICAgdGhpcy5nYWxsZXJ5Lm9uY2xpY2sgPSBlID0+IHtcclxuICAgICAgICB0aGlzLm9uR2FsbGVyeUNsaWNrKGUpO1xyXG4gICAgfTtcclxufTtcclxuXHJcbi8vVE9ETyBBTEVSVCBJRiBJVCBET0VTTidUIEFCTEUgVE8gRE9XTkxPQUQgTU9EQUwgTUVTU0FHRSBXSU5ET1dcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnNldEVsZW0gPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHJcbiAgICAgICAgdGhpcy5pc0VsZW1TZXR0ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuZWxlbSlcclxuICAgICAgICAgICAgdGhpcy5lbGVtID0gdGhpcy5yZW5kZXJXaW5kb3cocmVxdWlyZShgaHRtbC1sb2FkZXIhLi93aW5kb3dgKSk7XHJcblxyXG4gICAgICAgIHRoaXMuaW1nRWxlbSA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCdpbWcuaW1hZ2VfX2ltZy1lbGVtZW50Jyk7XHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2Rlc2NyaXB0aW9uJyk7XHJcbiAgICAgICAgdGhpcy5kYXRlID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fcG9zdC1kYXRlJyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZVdyYXBwZXIgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX19pbWFnZS13cmFwcGVyJyk7XHJcbiAgICAgICAgdGhpcy5zaWRlQmFyID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fc2lkZWJhcicpO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlQnV0dG9uRWxlbSA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2RlbGV0ZS1idXR0b24nKTtcclxuICAgICAgICB0aGlzLnN1YnNjcmliZUJ1dHRvbkVsZW0gPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX19zdWJzY3JpYmUtYnV0dG9uJyk7XHJcbiAgICAgICAgdGhpcy5hdmF0YXIgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX19hdmF0YXInKTtcclxuICAgICAgICB0aGlzLnVzZXJuYW1lID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fdXNlcm5hbWUnKTtcclxuICAgICAgICB0aGlzLmhlYWRlckxlZnRTaWRlID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9faGVhZGVyLWxlZnQtc2lkZScpO1xyXG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkJ1dHRvbiA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2NvbnRyb2wtZnVsbCcpO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5pbWdFbGVtLm9ubG9hZCA9IGUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJlc2l6ZUltYWdlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd0ltZ0VsZW0oKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmVsZW0ub25jbGljayA9IGUgPT4ge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5vbkVsZW1DbGljayhlKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldC5tYXRjaGVzKCcuaW1hZ2VfX21vZGFsLWNsb3NlLWJ1dHRvbi13cmFwcGVyJykpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldC5tYXRjaGVzKCcuaW1hZ2VfX2NvbnRyb2wtcHJldicpKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zd2l0Y2hUb1ByZXYoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldC5tYXRjaGVzKCcuaW1hZ2VfX2NvbnRyb2wtbmV4dCcpKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zd2l0Y2hUb05leHQoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldCA9PT0gdGhpcy5mdWxsc2NyZWVuQnV0dG9uKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zd2l0Y2hGdWxsc2NyZWVuKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZS50YXJnZXQubWF0Y2hlcygnLmltYWdlX19jbG9zZS1zcGFjZScpIHx8IGUudGFyZ2V0Lm1hdGNoZXMoJy5pbWFnZV9fY2xvc2UtYnV0dG9uJykpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgbGV0IENvbW1lbnRTZWN0aW9uID0gcmVxdWlyZShCTE9DS1MgKyAnaW1hZ2UtY29tbWVudC1zZWN0aW9uJyk7XHJcbiAgICAgICAgbGV0IExpa2VCdXR0b24gPSByZXF1aXJlKEJMT0NLUyArICdsaWtlLWJ1dHRvbicpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbW1lbnRTZWN0aW9uID0gbmV3IENvbW1lbnRTZWN0aW9uKHtcclxuICAgICAgICAgICAgZWxlbTogdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50LXNlY3Rpb24nKSxcclxuICAgICAgICAgICAgY29tbWVudFNlbmRlckVsZW06IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuY29tbWVudC1zZW5kJyksXHJcbiAgICAgICAgICAgIGltYWdlSWQ6IHRoaXMuY3VycmVudEltYWdlSWQsXHJcbiAgICAgICAgICAgIGxvZ2dlZFVzZXJWaWV3TW9kZWw6IHRoaXMubG9nZ2VkVXNlclZpZXdNb2RlbCxcclxuXHJcbiAgICAgICAgICAgIGNvbW1lbnRTZWN0aW9uV3JhcHBlcjogdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZV9fY29tbWVudC1zZWN0aW9uLXdyYXBwZXInKSxcclxuICAgICAgICAgICAgaW5mb0JvYXJkOiB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlX19pbmZvLWJvYXJkJyksXHJcbiAgICAgICAgICAgIHNjcm9sbGJhcldyYXBwZXI6IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2NvbW1lbnQtc2VjdGlvbi1zY3JvbGxiYXItd3JhcHBlcicpXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29tbWVudFNlY3Rpb24ub24oJ2NvbW1lbnQtc2VjdGlvbl9jaGFuZ2VkJywgZSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpbWFnZUlkID0gZS5kZXRhaWwuaW1hZ2VJZDtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGVWaWV3TW9kZWwoaW1hZ2VJZCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdFZpZXdNb2RlbChpbWFnZUlkKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ29tbWVudHMoaW1hZ2VJZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmxpa2VCdXR0b24gPSBuZXcgTGlrZUJ1dHRvbih7XHJcbiAgICAgICAgICAgIGVsZW06IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcubGlrZS1idXR0b24nKSxcclxuICAgICAgICAgICAgZGF0YTogdGhpcy5jdXJyZW50SW1hZ2VJZFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmxpa2VCdXR0b24ub24oJ3N3aXRjaC1idXR0b25fY2hhbmdlZCcsIGUgPT4ge1xyXG4gICAgICAgICAgICBsZXQgaW1hZ2VJZCA9IGUuZGV0YWlsLmltYWdlSWQ7XHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlVmlld01vZGVsKGltYWdlSWQpO1xyXG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RWaWV3TW9kZWwoaW1hZ2VJZCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUxpa2VzKGltYWdlSWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5vblJlc2l6ZSgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc0xvZ2dlZCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50Vmlld01vZGVsLmlzT3duSW1hZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RGVsZXRlQnV0dG9uKCk7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlLmVuc3VyZShbQkxPQ0tTICsgJ2RlbGV0ZS1pbWFnZS1idXR0b24nXSwgcmVxdWlyZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IERlbGV0ZUltYWdlQnV0dG9uID0gcmVxdWlyZShCTE9DS1MgKyAnZGVsZXRlLWltYWdlLWJ1dHRvbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlQnV0dG9uID0gbmV3IERlbGV0ZUltYWdlQnV0dG9uKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbTogdGhpcy5kZWxldGVCdXR0b25FbGVtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZUlkOiB0aGlzLmN1cnJlbnRJbWFnZUlkXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxldGVCdXR0b24ub24oJ2RlbGV0ZS1pbWFnZS1idXR0b25faW1hZ2UtZGVsZXRlZCcsIGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW52b2x2ZWRJbWFnZUlkID0gZS5kZXRhaWwuaW1hZ2VJZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxldGVWaWV3TW9kZWwoaW52b2x2ZWRJbWFnZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVGcm9tR2FsbGVyeUFycmF5KGludm9sdmVkSW1hZ2VJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlSW1hZ2VQcmV2aWV3KGludm9sdmVkSW1hZ2VJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRJbWFnZUlkID09PSBpbnZvbHZlZEltYWdlSWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN3aXRjaFRvTmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZS5lbnN1cmUoW0JMT0NLUyArICdzdWJzY3JpYmUtYnV0dG9uJ10sIHJlcXVpcmUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBTdWJzY3JpYmVCdXR0b24gPSByZXF1aXJlKEJMT0NLUyArICdzdWJzY3JpYmUtYnV0dG9uJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVCdXR0b24gPSBuZXcgU3Vic2NyaWJlQnV0dG9uKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbTogdGhpcy5zdWJzY3JpYmVCdXR0b25FbGVtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0aGlzLmN1cnJlbnRJbWFnZUlkXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnVzZXJTdWJzY3JpYmVCdXR0b24pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFN3aXRjaEJ1dHRvbi5zZXRSZWxhdGlvbih0aGlzLnN1YnNjcmliZUJ1dHRvbiwgdGhpcy51c2VyU3Vic2NyaWJlQnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVCdXR0b24ub24oJ3N3aXRjaC1idXR0b25fY2hhbmdlZCcsIGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW52b2x2ZWRJbWFnZUlkID0gZS5kZXRhaWwuaW1hZ2VJZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzRmVlZCAmJiBpbnZvbHZlZEltYWdlSWQgPT09IHRoaXMuY3VycmVudEltYWdlSWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXdNb2RlbHMgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3Vic2NyaWJlQnV0dG9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVCdXR0b24uc2V0KHthY3RpdmU6IHRoaXMuY3VycmVudFZpZXdNb2RlbC5hdXRob3IuaXNOYXJyYXRvcn0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlQnV0dG9uRWxlbS5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yKG5ldyBDbGllbnRFcnJvcihudWxsLCBudWxsLCA0MDEpKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSk7XHJcblxyXG59O1xyXG5cclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnN3aXRjaEZ1bGxzY3JlZW4gPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgZnVuY3Rpb24gZ29GdWxsc2NyZWVuKGVsZW1lbnQpIHtcclxuICAgICAgICBpZiAoZWxlbWVudC5yZXF1ZXN0RnVsbHNjcmVlbikge1xyXG4gICAgICAgICAgICBlbGVtZW50LnJlcXVlc3RGdWxsc2NyZWVuKCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4oKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQubW96UmVxdWVzdEZ1bGxzY3JlZW4pIHtcclxuICAgICAgICAgICAgZWxlbWVudC5tb3pSZXF1ZXN0RnVsbHNjcmVlbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjYW5jZWxGdWxsc2NyZWVuKCkge1xyXG4gICAgICAgIGlmIChkb2N1bWVudC5leGl0RnVsbHNjcmVlbikge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5leGl0RnVsbHNjcmVlbigpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQud2Via2l0RXhpdEZ1bGxzY3JlZW4pIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQud2Via2l0RXhpdEZ1bGxzY3JlZW4oKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGRvY3VtZW50Lm1vekV4aXRGdWxsc2NyZWVuKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50Lm1vekV4aXRGdWxsc2NyZWVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBpZiAoIXRoaXMuaXNGdWxsc2NyZWVuKSB7XHJcbiAgICAgICAgZ29GdWxsc2NyZWVuKHRoaXMuaW1hZ2VXcmFwcGVyKTtcclxuICAgICAgICB0aGlzLmlzRnVsbHNjcmVlbiA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5mdWxsc2NyZWVuQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2ljb24tYXJyb3ctbWF4aW1pc2UnKTtcclxuICAgICAgICB0aGlzLmZ1bGxzY3JlZW5CdXR0b24uY2xhc3NMaXN0LmFkZCgnaWNvbi1hcnJvdy1taW5pbWlzZScpO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FuY2VsRnVsbHNjcmVlbigpO1xyXG4gICAgICAgIHRoaXMuaXNGdWxsc2NyZWVuID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5mdWxsc2NyZWVuQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2ljb24tYXJyb3ctbWF4aW1pc2UnKTtcclxuICAgICAgICB0aGlzLmZ1bGxzY3JlZW5CdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnaWNvbi1hcnJvdy1taW5pbWlzZScpO1xyXG4gICAgfVxyXG5cclxufTtcclxuXHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5zZXREZWxldGVCdXR0b24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmRlbGV0ZUJ1dHRvbkVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnYnV0dG9uX2ludmlzaWJsZScpO1xyXG4gICAgdGhpcy5zdWJzY3JpYmVCdXR0b25FbGVtLmNsYXNzTGlzdC5hZGQoJ2J1dHRvbl9pbnZpc2libGUnKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnNldFN1YnNjcmliZUJ1dHRvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuc3Vic2NyaWJlQnV0dG9uRWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdidXR0b25faW52aXNpYmxlJyk7XHJcbiAgICB0aGlzLmRlbGV0ZUJ1dHRvbkVsZW0uY2xhc3NMaXN0LmFkZCgnYnV0dG9uX2ludmlzaWJsZScpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUudXBkYXRlUHJlbG9hZGVkSW1hZ2VzQXJyYXkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSB0aGlzLnByZWxvYWRFbnRpdHlDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IG5leHRJZCA9IHRoaXMuZ2V0TmV4dEltYWdlSWQoaSk7XHJcbiAgICAgICAgbGV0IHByZXZJZCA9IHRoaXMuZ2V0TmV4dEltYWdlSWQoLWkpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy52aWV3TW9kZWxzW25leHRJZF0pXHJcbiAgICAgICAgICAgIHRoaXMucHJlbG9hZGVkSW1hZ2VzW2ldLnNldEF0dHJpYnV0ZSgnc3JjJywgdGhpcy52aWV3TW9kZWxzW25leHRJZF0uaW1nVXJsKTtcclxuICAgICAgICBpZiAodGhpcy52aWV3TW9kZWxzW3ByZXZJZF0pXHJcbiAgICAgICAgICAgIHRoaXMucHJlbG9hZGVkSW1hZ2VzWy1pXS5zZXRBdHRyaWJ1dGUoJ3NyYycsIHRoaXMudmlld01vZGVsc1twcmV2SWRdLmltZ1VybCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nOyAvLyA6XFxcclxuXHJcblxyXG5cclxuICAgIGxldCBpbWFnZUlkO1xyXG4gICAgbGV0IG5vUHVzaFN0YXRlO1xyXG5cclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxICYmIHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdudW1iZXInKSB7XHJcbiAgICAgICAgaW1hZ2VJZCA9IGFyZ3VtZW50c1swXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaW1hZ2VJZCA9IG9wdGlvbnMgJiYgb3B0aW9ucy5pbWFnZUlkO1xyXG4gICAgICAgIG5vUHVzaFN0YXRlID0gb3B0aW9ucyAmJiBvcHRpb25zLm5vUHVzaFN0YXRlIHx8IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzRW1iZWRkZWQpXHJcbiAgICAgICAgICAgIE1vZGFsLnByb3RvdHlwZS5zaG93LmFwcGx5KHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLnJlcXVlc3RWaWV3TW9kZWwoaW1hZ2VJZCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEltYWdlSWQgPSBpbWFnZUlkO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzRWxlbVNldHRlZClcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RWxlbSgpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ3VycmVudFZpZXcoaW1hZ2VJZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdpbWFnZV9pbnZpc2libGUnKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIW5vUHVzaFN0YXRlICYmIGltYWdlSWQgPT09IHRoaXMuY3VycmVudEltYWdlSWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaEltYWdlU3RhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0QWxsTmVjZXNzYXJ5Vmlld01vZGVscygpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVByZWxvYWRlZEltYWdlc0FycmF5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUN1cnJlbnRWaWV3KGltYWdlSWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdpbWFnZV9pbnZpc2libGUnKTtcclxuICAgICAgICAgICAgICAgIGlmICghbm9QdXNoU3RhdGUgJiYgaW1hZ2VJZCA9PT0gdGhpcy5jdXJyZW50SW1hZ2VJZClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2hJbWFnZVN0YXRlKCk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RBbGxOZWNlc3NhcnlWaWV3TW9kZWxzKCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQcmVsb2FkZWRJbWFnZXNBcnJheSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMub25SZXNpemUoKTtcclxuICAgICAgICB9KS5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnYXV0byc7XHJcblxyXG5cclxuICAgIGxldCBub1B1c2hTdGF0ZSA9IG9wdGlvbnMgJiYgb3B0aW9ucy5ub1B1c2hTdGF0ZTtcclxuICAgIGlmICghdGhpcy5pc0VtYmVkZGVkKVxyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHRoaXMuZWxlbS5kYXRhc2V0LmF1dGhvclVybDtcclxuICAgIGVsc2Uge1xyXG4gICAgICAgIE1vZGFsLnByb3RvdHlwZS5oaWRlLmFwcGx5KHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnaW1hZ2VfaW52aXNpYmxlJyk7XHJcblxyXG4gICAgICAgIGlmICghbm9QdXNoU3RhdGUpXHJcbiAgICAgICAgICAgIHRoaXMucHVzaEdhbGxlcnlTdGF0ZSgpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuaGlkZUltZ0VsZW0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnaW1hZ2VfaW1nLWVsZW1lbnQtaW52aXNpYmxlJyk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5zaG93SW1nRWxlbSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdpbWFnZV9pbWctZWxlbWVudC1pbnZpc2libGUnKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnJlc2l6ZUltYWdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gaWYgKHRoaXMuZWxlbSkge1xyXG4gICAgLy9cclxuICAgIC8vICAgICB0aGlzLmltZ0VsZW0ucmVtb3ZlQXR0cmlidXRlKCd3aWR0aCcpO1xyXG4gICAgLy8gICAgIHRoaXMuaW1nRWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2hlaWdodCcpO1xyXG4gICAgLy9cclxuICAgIC8vICAgICBpZiAoIXRoaXMuZWxlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2ltYWdlX3NtYWxsJykpIHtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgIGlmICh0aGlzLmltZ0VsZW0ub2Zmc2V0V2lkdGggPj0gdGhpcy5pbWdFbGVtLm9mZnNldEhlaWdodCkge1xyXG4gICAgLy8gICAgICAgICAgICAgaWYgKHRoaXMuaW1hZ2VXcmFwcGVyLm9mZnNldEhlaWdodCA8IHRoaXMuaW1nRWxlbS5vZmZzZXRIZWlnaHQpXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5pbWdFbGVtLmhlaWdodCA9IHRoaXMuaW1hZ2VXcmFwcGVyLm9mZnNldEhlaWdodDtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgICAgICBpZiAodGhpcy5pbWFnZVdyYXBwZXIub2Zmc2V0V2lkdGggPiB0aGlzLmVsZW0ub2Zmc2V0V2lkdGgpIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLmltZ0VsZW0ucmVtb3ZlQXR0cmlidXRlKCdoZWlnaHQnKTtcclxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLmltZ0VsZW0ud2lkdGggPSB0aGlzLmVsZW0ub2Zmc2V0V2lkdGggLSB0aGlzLnNpZGVCYXIub2Zmc2V0V2lkdGg7XHJcbiAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgICAgICAgICBpZiAodGhpcy5pbWFnZVdyYXBwZXIub2Zmc2V0V2lkdGggPiB0aGlzLmVsZW0ub2Zmc2V0V2lkdGgpXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5pbWdFbGVtLndpZHRoID0gdGhpcy5lbGVtLm9mZnNldFdpZHRoIC0gdGhpcy5zaWRlQmFyLm9mZnNldFdpZHRoO1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgICAgIGlmICh0aGlzLmltYWdlV3JhcHBlci5vZmZzZXRIZWlnaHQgPCB0aGlzLmltZ0VsZW0ub2Zmc2V0SGVpZ2h0KSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5pbWdFbGVtLnJlbW92ZUF0dHJpYnV0ZSgnd2lkdGgnKTtcclxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLmltZ0VsZW0uaGVpZ2h0ID0gdGhpcy5pbWFnZVdyYXBwZXIub2Zmc2V0SGVpZ2h0O1xyXG4gICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfSBlbHNlIHtcclxuICAgIC8vICAgICAgICAgaWYgKHRoaXMuaW1hZ2VXcmFwcGVyLm9mZnNldFdpZHRoID4gdGhpcy5lbGVtLm9mZnNldFdpZHRoKSB7XHJcbiAgICAvLyAgICAgICAgICAgICB0aGlzLmltZ0VsZW0ucmVtb3ZlQXR0cmlidXRlKCdoZWlnaHQnKTtcclxuICAgIC8vICAgICAgICAgICAgIHRoaXMuaW1nRWxlbS53aWR0aCA9IHRoaXMuZWxlbS5vZmZzZXRXaWR0aDtcclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH1cclxuICAgIC8vXHJcbiAgICAvL1xyXG4gICAgLy8gfVxyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUucmVxdWVzdFZpZXdNb2RlbCA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudmlld01vZGVsc1tpZF0pIHtcclxuICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgYm9keSA9IHtcclxuICAgICAgICAgICAgaWQsXHJcbiAgICAgICAgICAgIGlzRmVlZDogdGhpcy5pc0ZlZWRcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc0xvZ2dlZCAmJiAhdGhpcy5sb2dnZWRVc2VyVmlld01vZGVsKVxyXG4gICAgICAgICAgICBib2R5LnJlcXVpcmVVc2VyVmlld01vZGVsID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgcmVxdWlyZShMSUJTICsgJ3NlbmRSZXF1ZXN0JykoYm9keSwgJ1BPU1QnLCAnL2dhbGxlcnknLCAoZXJyLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgQ2xpZW50RXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5nYWxsZXJ5QXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVGcm9tR2FsbGVyeUFycmF5KGlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVHYWxsZXJ5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QobmV3IEltYWdlTm90Rm91bmQoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB0aGlzLmdhbGxlcnlBcnJheSA9IHJlc3BvbnNlLmdhbGxlcnk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlR2FsbGVyeSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNMb2dnZWQgJiYgIXRoaXMubG9nZ2VkVXNlclZpZXdNb2RlbCAmJiByZXNwb25zZS5sb2dnZWRVc2VyVmlld01vZGVsKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZWRVc2VyVmlld01vZGVsID0gcmVzcG9uc2UubG9nZ2VkVXNlclZpZXdNb2RlbDtcclxuXHJcblxyXG4gICAgICAgICAgICBsZXQgcHJvdmlkZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIHJlc3BvbnNlLnZpZXdNb2RlbHMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChrZXkgPT0gaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudmlld01vZGVsc1trZXldID0gcmVzcG9uc2Uudmlld01vZGVsc1trZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcm92aWRlZClcclxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdhbGxlcnlBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlRnJvbUdhbGxlcnlBcnJheShpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVHYWxsZXJ5KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEltYWdlTm90Rm91bmQoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUucmVtb3ZlRnJvbUdhbGxlcnlBcnJheSA9IGZ1bmN0aW9uIChpZCkge1xyXG5cclxuICAgIHRoaXMuZ2FsbGVyeUFycmF5ICYmIH50aGlzLmdhbGxlcnlBcnJheS5pbmRleE9mKGlkKSAmJlxyXG4gICAgdGhpcy5nYWxsZXJ5QXJyYXkuc3BsaWNlKHRoaXMuZ2FsbGVyeUFycmF5LmluZGV4T2YoaWQpLCAxKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLmFkZFRvR2FsbGVyeUFycmF5ID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICB0aGlzLmdhbGxlcnlBcnJheSAmJiB0aGlzLmdhbGxlcnlBcnJheS5wdXNoKGlkKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnVwZGF0ZUdhbGxlcnkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5nYWxsZXJ5QXJyYXkgJiYgdGhpcy5nYWxsZXJ5KSB7XHJcbiAgICAgICAgbGV0IGltYWdlUHJldmlld3MgPSB0aGlzLmdhbGxlcnkucXVlcnlTZWxlY3RvckFsbCgnLmltYWdlLXByZXZpZXcnKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGltYWdlUHJldmlld3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKCF+dGhpcy5nYWxsZXJ5QXJyYXkuaW5kZXhPZigraW1hZ2VQcmV2aWV3c1tpXS5kYXRhc2V0LmlkKSlcclxuICAgICAgICAgICAgICAgIGltYWdlUHJldmlld3NbaV0ucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2V0UHVibGljYXRpb25OdW1iZXIodGhpcy5nYWxsZXJ5QXJyYXkubGVuZ3RoKTtcclxuICAgIH1cclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLmdldEltYWdlUHJldmlld0J5SWQgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgIHJldHVybiB0aGlzLmdhbGxlcnkucXVlcnlTZWxlY3RvcihgLmltYWdlLXByZXZpZXdbZGF0YS1pZD1cIiR7aWR9XCJdYCk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS51cGRhdGVJbWFnZVByZXZpZXdUZXh0ID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICBsZXQgbGlrZUFtb3VudCA9IHRoaXMudmlld01vZGVsc1tpZF0ubGlrZXMubGVuZ3RoO1xyXG4gICAgbGV0IGNvbW1lbnRBbW91bnQgPSB0aGlzLnZpZXdNb2RlbHNbaWRdLmNvbW1lbnRzLmxlbmd0aDtcclxuICAgIGxldCBwcmV2aWV3SW1hZ2VFbGVtID0gdGhpcy5nZXRJbWFnZVByZXZpZXdCeUlkKGlkKTtcclxuICAgIHByZXZpZXdJbWFnZUVsZW0uZGF0YXNldC5saWtlQW1vdW50ID0gbGlrZUFtb3VudDtcclxuICAgIHByZXZpZXdJbWFnZUVsZW0uZGF0YXNldC5jb21tZW50QW1vdW50ID0gY29tbWVudEFtb3VudDtcclxuXHJcbiAgICBwcmV2aWV3SW1hZ2VFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZS1wcmV2aWV3X19jb21tZW50LW51bWJlcicpLnRleHRDb250ZW50ID0gY29tbWVudEFtb3VudDtcclxuICAgIHByZXZpZXdJbWFnZUVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlLXByZXZpZXdfX2xpa2UtbnVtYmVyJykudGV4dENvbnRlbnQgPSBsaWtlQW1vdW50O1xyXG5cclxuICAgIHByZXZpZXdJbWFnZUVsZW0ucXVlcnlTZWxlY3RvcignLmltYWdlLXByZXZpZXdfX2NvbW1lbnQtc2VjdGlvbiAuaW1hZ2UtcHJldmlld19fZGVzaWduYXRpb24tdGV4dCcpXHJcbiAgICAgICAgLnRleHRDb250ZW50ID0gZ2V0Q29ycmVjdE5vdW5Gb3JtKCdjb21tZW50JywgY29tbWVudEFtb3VudCk7XHJcbiAgICBwcmV2aWV3SW1hZ2VFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZS1wcmV2aWV3X19saWtlLXNlY3Rpb24gLmltYWdlLXByZXZpZXdfX2Rlc2lnbmF0aW9uLXRleHQnKVxyXG4gICAgICAgIC50ZXh0Q29udGVudCA9IGdldENvcnJlY3ROb3VuRm9ybSgnbGlrZScsIGxpa2VBbW91bnQpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuZGVsZXRlSW1hZ2VQcmV2aWV3ID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICBsZXQgZWxlbSA9IHRoaXMuZ2V0SW1hZ2VQcmV2aWV3QnlJZChpZCk7XHJcbiAgICBpZiAoZWxlbSkge1xyXG4gICAgICAgIGVsZW0ucmVtb3ZlKCk7XHJcbiAgICAgICAgdGhpcy5zZXRQdWJsaWNhdGlvbk51bWJlcigtMSwgdHJ1ZSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5pbnNlcnROZXdJbWFnZVByZXZpZXcgPSBmdW5jdGlvbiAoaW1hZ2VJZCwgcHJldmlld1VybCkge1xyXG4gICAgbGV0IG5ld0ltYWdlUHJldmlldyA9IHRoaXMuaW1hZ2VQcmV2aWV3R2hvc3QuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgbmV3SW1hZ2VQcmV2aWV3LmNsYXNzTGlzdC5yZW1vdmUoJ2ltYWdlLXByZXZpZXdfZ2hvc3QnKTtcclxuXHJcbiAgICBuZXdJbWFnZVByZXZpZXcuZGF0YXNldC5pZCA9IGltYWdlSWQ7XHJcbiAgICBuZXdJbWFnZVByZXZpZXcuaHJlZiA9IGAvaW1hZ2UvJHtpbWFnZUlkfWA7XHJcbiAgICBuZXdJbWFnZVByZXZpZXcucXVlcnlTZWxlY3RvcignLmltYWdlLXByZXZpZXdfX3BpY3R1cmUnKS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCcvJHtwcmV2aWV3VXJsfScpYDtcclxuXHJcbiAgICBuZXdJbWFnZVByZXZpZXcucXVlcnlTZWxlY3RvcignLmltYWdlLXByZXZpZXdfX2NvbW1lbnQtbnVtYmVyJykudGV4dENvbnRlbnQgPSAwO1xyXG4gICAgbmV3SW1hZ2VQcmV2aWV3LnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZS1wcmV2aWV3X19saWtlLW51bWJlcicpLnRleHRDb250ZW50ID0gMDtcclxuXHJcbiAgICB0aGlzLmdhbGxlcnlXcmFwcGVyLmFwcGVuZENoaWxkKG5ld0ltYWdlUHJldmlldyk7XHJcblxyXG4gICAgdGhpcy5zZXRQdWJsaWNhdGlvbk51bWJlcigxLCB0cnVlKTtcclxuICAgIHRoaXMuYWRkVG9HYWxsZXJ5QXJyYXkoaW1hZ2VJZCk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5zZXRQdWJsaWNhdGlvbk51bWJlciA9IGZ1bmN0aW9uICh2YWx1ZSwgcmVsYXRpdmUpIHtcclxuICAgIGlmICh0aGlzLnB1YmxpY2F0aW9uTnVtYmVyRWxlbSlcclxuICAgICAgICBpZiAocmVsYXRpdmUpXHJcbiAgICAgICAgICAgIHRoaXMucHVibGljYXRpb25OdW1iZXJFbGVtLnRleHRDb250ZW50ID0gK3RoaXMucHVibGljYXRpb25OdW1iZXJFbGVtLnRleHRDb250ZW50ICsgdmFsdWU7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLnB1YmxpY2F0aW9uTnVtYmVyRWxlbS50ZXh0Q29udGVudCA9IHZhbHVlO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuZGVsZXRlVmlld01vZGVsID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICBkZWxldGUgdGhpcy52aWV3TW9kZWxzW2lkXTtcclxuICAgIGNvbnNvbGUubG9nKCdkZWxldGUgIycgKyBpZCk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5yZXF1ZXN0QWxsTmVjZXNzYXJ5Vmlld01vZGVscyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBQcm9taXNlLmFsbChbXHJcbiAgICAgICAgdGhpcy5yZXF1ZXN0TmV4dFZpZXdNb2RlbHMoKSxcclxuICAgICAgICB0aGlzLnJlcXVlc3RQcmV2Vmlld01vZGVscygpXHJcbiAgICBdKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnJlcXVlc3ROZXh0Vmlld01vZGVscyA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBpZiAodGhpcy5nYWxsZXJ5QXJyYXkgJiYgdGhpcy5nYWxsZXJ5QXJyYXkubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgSW1hZ2VOb3RGb3VuZCgpKTtcclxuXHJcbiAgICBsZXQgcHJvbWlzZXMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wcmVsb2FkRW50aXR5Q291bnQ7IGkrKylcclxuICAgICAgICBwcm9taXNlcy5wdXNoKHRoaXMucmVxdWVzdFZpZXdNb2RlbCh0aGlzLmdldE5leHRJbWFnZUlkKGkpKSk7XHJcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUucmVxdWVzdFByZXZWaWV3TW9kZWxzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuZ2FsbGVyeUFycmF5ICYmIHRoaXMuZ2FsbGVyeUFycmF5Lmxlbmd0aCA9PT0gMClcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEltYWdlTm90Rm91bmQoKSk7XHJcbiAgICBsZXQgcHJvbWlzZXMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wcmVsb2FkRW50aXR5Q291bnQ7IGkrKylcclxuICAgICAgICBwcm9taXNlcy5wdXNoKHRoaXMucmVxdWVzdFZpZXdNb2RlbCh0aGlzLmdldFByZXZJbWFnZUlkKGkpKSk7XHJcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xyXG59O1xyXG5cclxuR2FsbGVyeS5wcm90b3R5cGUuc3dpdGNoVG9OZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuZ2FsbGVyeUFycmF5ICYmICF0aGlzLmdhbGxlcnlBcnJheS5sZW5ndGgpIHtcclxuICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG5leHRJbWFnZUlkID0gdGhpcy5nZXROZXh0SW1hZ2VJZCgpO1xyXG4gICAgdGhpcy5zaG93KG5leHRJbWFnZUlkKS5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBJbWFnZU5vdEZvdW5kKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdhbGxlcnlBcnJheSAmJiB0aGlzLmdhbGxlcnlBcnJheS5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN3aXRjaFRvTmV4dCgpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5zd2l0Y2hUb1ByZXYgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgaWYgKHRoaXMuZ2FsbGVyeUFycmF5ICYmICF0aGlzLmdhbGxlcnlBcnJheS5sZW5ndGgpIHtcclxuICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHByZXZJbWFnZUlkID0gdGhpcy5nZXRQcmV2SW1hZ2VJZCgpO1xyXG4gICAgdGhpcy5zaG93KHByZXZJbWFnZUlkKS5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBJbWFnZU5vdEZvdW5kKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdhbGxlcnlBcnJheSAmJiB0aGlzLmdhbGxlcnlBcnJheS5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN3aXRjaFRvUHJldigpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5nZXROZXh0SW1hZ2VJZCA9IGZ1bmN0aW9uIChvZmZzZXQpIHtcclxuICAgIG9mZnNldCA9IG9mZnNldCB8fCAxO1xyXG4gICAgbGV0IGluZGV4ID0gdGhpcy5nYWxsZXJ5QXJyYXkuaW5kZXhPZih0aGlzLmN1cnJlbnRJbWFnZUlkKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5nYWxsZXJ5QXJyYXlbKGluZGV4ICsgb2Zmc2V0KSAlIHRoaXMuZ2FsbGVyeUFycmF5Lmxlbmd0aF07XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5nZXRQcmV2SW1hZ2VJZCA9IGZ1bmN0aW9uIChvZmZzZXQpIHtcclxuICAgIG9mZnNldCA9IG9mZnNldCB8fCAxO1xyXG5cclxuICAgIGxldCBpbmRleCA9IHRoaXMuZ2FsbGVyeUFycmF5LmluZGV4T2YodGhpcy5jdXJyZW50SW1hZ2VJZCk7XHJcblxyXG4gICAgaWYgKH5pbmRleCAmJiB0aGlzLmdhbGxlcnlBcnJheS5sZW5ndGggPT09IDEpXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2FsbGVyeUFycmF5WzBdO1xyXG5cclxuICAgIGxldCBnYWxsZXJ5UHJldkluZGV4ID0gaW5kZXggLSBvZmZzZXQ7XHJcbiAgICBpZiAoZ2FsbGVyeVByZXZJbmRleCA8IDApIHtcclxuICAgICAgICBnYWxsZXJ5UHJldkluZGV4ICU9IHRoaXMuZ2FsbGVyeUFycmF5Lmxlbmd0aDtcclxuICAgICAgICBnYWxsZXJ5UHJldkluZGV4ID0gdGhpcy5nYWxsZXJ5QXJyYXkubGVuZ3RoICsgZ2FsbGVyeVByZXZJbmRleDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5nYWxsZXJ5QXJyYXlbZ2FsbGVyeVByZXZJbmRleF07XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS51cGRhdGVDdXJyZW50VmlldyA9IGZ1bmN0aW9uIChpbnZvbHZlZEltYWdlSWQpIHtcclxuXHJcbiAgICBpZiAoaW52b2x2ZWRJbWFnZUlkID09PSB0aGlzLmN1cnJlbnRJbWFnZUlkKSB7XHJcbiAgICAgICAgdGhpcy5oaWRlSW1nRWxlbSgpO1xyXG5cclxuICAgICAgICB0aGlzLmltZ0VsZW0uc2V0QXR0cmlidXRlKCdzcmMnLCB0aGlzLmN1cnJlbnRWaWV3TW9kZWwuaW1nVXJsKTtcclxuXHJcbiAgICAgICAgdGhpcy5saWtlQnV0dG9uLnNldEltYWdlSWQodGhpcy5jdXJyZW50SW1hZ2VJZCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVMaWtlcyh0aGlzLmN1cnJlbnRJbWFnZUlkKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb21tZW50U2VjdGlvbi5zZXRJbWFnZUlkKHRoaXMuY3VycmVudEltYWdlSWQpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ29tbWVudHModGhpcy5jdXJyZW50SW1hZ2VJZCk7XHJcblxyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24udGV4dENvbnRlbnQgPSB0aGlzLmN1cnJlbnRWaWV3TW9kZWwuZGVzY3JpcHRpb247XHJcbiAgICAgICAgaWYgKHRoaXMuZGVzY3JpcHRpb24udGV4dENvbnRlbnQgPT09ICcnKVxyXG4gICAgICAgICAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnaW1hZ2Vfbm8tZGVzY3JpcHRpb24nKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdpbWFnZV9uby1kZXNjcmlwdGlvbicpO1xyXG5cclxuICAgICAgICB0aGlzLmRhdGUudGV4dENvbnRlbnQgPSB0aGlzLmN1cnJlbnRWaWV3TW9kZWwuY3JlYXRlRGF0ZVN0cjtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNMb2dnZWQpXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRWaWV3TW9kZWwuaXNPd25JbWFnZSlcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlQnV0dG9uLnNldEltYWdlSWQodGhpcy5jdXJyZW50SW1hZ2VJZCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlQnV0dG9uLnNldEltYWdlSWQodGhpcy5jdXJyZW50SW1hZ2VJZCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzRmVlZClcclxuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVCdXR0b24uc2V0KHthY3RpdmU6IHRydWV9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hdmF0YXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgnJHt0aGlzLmN1cnJlbnRWaWV3TW9kZWwuYXV0aG9yLmF2YXRhclVybHMubWVkaXVtfScpYDtcclxuICAgICAgICB0aGlzLnVzZXJuYW1lLnRleHRDb250ZW50ID0gdGhpcy5jdXJyZW50Vmlld01vZGVsLmF1dGhvci51c2VybmFtZTtcclxuXHJcbiAgICAgICAgdGhpcy5oZWFkZXJMZWZ0U2lkZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCB0aGlzLmN1cnJlbnRWaWV3TW9kZWwuYXV0aG9yLnVybCk7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS51cGRhdGVMaWtlcyA9IGZ1bmN0aW9uIChpbWFnZUlkKSB7XHJcbiAgICBpZiAodGhpcy5jdXJyZW50SW1hZ2VJZCA9PT0gaW1hZ2VJZClcclxuICAgICAgICB0aGlzLmxpa2VCdXR0b24uc2V0KHtcclxuICAgICAgICAgICAgYWN0aXZlOiB0aGlzLmN1cnJlbnRWaWV3TW9kZWwuaXNMaWtlZCxcclxuICAgICAgICAgICAgbGlrZUFtb3VudDogdGhpcy5jdXJyZW50Vmlld01vZGVsLmxpa2VzLmxlbmd0aFxyXG4gICAgICAgIH0pO1xyXG4gICAgaWYgKHRoaXMuZ2FsbGVyeSlcclxuICAgICAgICB0aGlzLnVwZGF0ZUltYWdlUHJldmlld1RleHQoaW1hZ2VJZCk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS51cGRhdGVDb21tZW50cyA9IGZ1bmN0aW9uIChpbWFnZUlkKSB7XHJcbiAgICBpZiAodGhpcy5jdXJyZW50SW1hZ2VJZCA9PT0gaW1hZ2VJZClcclxuICAgICAgICB0aGlzLmNvbW1lbnRTZWN0aW9uLnNldCh0aGlzLmN1cnJlbnRWaWV3TW9kZWwuY29tbWVudHMpO1xyXG4gICAgaWYgKHRoaXMuZ2FsbGVyeSlcclxuICAgICAgICB0aGlzLnVwZGF0ZUltYWdlUHJldmlld1RleHQoaW1hZ2VJZCk7XHJcbn07XHJcblxyXG5HYWxsZXJ5LnByb3RvdHlwZS5wdXNoSW1hZ2VTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGhpc3RvcnkucHVzaFN0YXRlKHtcclxuICAgICAgICB0eXBlOiAnaW1hZ2UnLFxyXG4gICAgICAgIGlkOiB0aGlzLmN1cnJlbnRJbWFnZUlkXHJcbiAgICB9LCAnaW1hZ2UgIycgKyB0aGlzLmN1cnJlbnRJbWFnZUlkLCAnL2ltYWdlLycgKyB0aGlzLmN1cnJlbnRJbWFnZUlkKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLnB1c2hHYWxsZXJ5U3RhdGUgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgbGV0IHVybCA9ICcnO1xyXG4gICAgaWYgKCF0aGlzLmlzRmVlZClcclxuICAgICAgICB1cmwgPSB0aGlzLmN1cnJlbnRWaWV3TW9kZWwgJiYgdGhpcy5jdXJyZW50Vmlld01vZGVsLmF1dGhvci51cmw7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdXJsID0gJy9mZWVkJztcclxuXHJcbiAgICBoaXN0b3J5LnB1c2hTdGF0ZSh7XHJcbiAgICAgICAgdHlwZTogJ2dhbGxlcnknXHJcbiAgICB9LCAnJywgdXJsKTtcclxufTtcclxuXHJcbkdhbGxlcnkucHJvdG90eXBlLm9uUG9wU3RhdGUgPSBmdW5jdGlvbiAoc3RhdGUpIHtcclxuXHJcbiAgICBpZiAoc3RhdGUgJiYgc3RhdGUudHlwZSlcclxuICAgICAgICBzd2l0Y2ggKHN0YXRlLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAnaW1hZ2UnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93KHtcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZUlkOiBzdGF0ZS5pZCxcclxuICAgICAgICAgICAgICAgICAgICBub1B1c2hTdGF0ZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ2dhbGxlcnknOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWFjdGl2YXRlKG51bGwsIHtcclxuICAgICAgICAgICAgICAgICAgICBub1B1c2hTdGF0ZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbn07XHJcblxyXG5mb3IgKGxldCBrZXkgaW4gZXZlbnRNaXhpbilcclxuICAgIEdhbGxlcnkucHJvdG90eXBlW2tleV0gPSBldmVudE1peGluW2tleV07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdhbGxlcnk7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvZ2FsbGVyeS9pbmRleC5qcyIsImxldCBldmVudE1peGluID0gcmVxdWlyZShMSUJTICsgJ2V2ZW50TWl4aW4nKTtcclxuXHJcbmxldCBTd2l0Y2hCdXR0b24gPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgdGhpcy5lbGVtID0gb3B0aW9ucy5lbGVtO1xyXG4gICAgdGhpcy5kYXRhID0gb3B0aW9ucy5kYXRhO1xyXG4gICAgdGhpcy5kYXRhU3RyID0gb3B0aW9ucy5kYXRhU3RyIHx8ICdpbWFnZUlkJztcclxuXHJcbiAgICB0aGlzLmFjdGl2ZVRleHQgPSBvcHRpb25zLmFjdGl2ZVRleHQ7XHJcbiAgICB0aGlzLmluYWN0aXZlVGV4dCA9IG9wdGlvbnMuaW5hY3RpdmVUZXh0O1xyXG4gICAgdGhpcy50ZXh0RWxlbSA9IG9wdGlvbnMudGV4dEVsZW0gfHwgdGhpcy5lbGVtO1xyXG5cclxuICAgIFN3aXRjaEJ1dHRvbi5wcm90b3R5cGUuc2V0LmNhbGwodGhpcywge2FjdGl2ZTogISF0aGlzLmVsZW0uZGF0YXNldC5hY3RpdmV9KTtcclxuICAgIGNvbnNvbGUubG9nKCdzd2l0Y2ggYnV0dG9uIGFjdGl2ZTonLCAhIXRoaXMuZWxlbS5kYXRhc2V0LmFjdGl2ZSk7XHJcbiAgICB0aGlzLmF2YWlsYWJsZSA9IHRydWU7XHJcblxyXG4gICAgdGhpcy5lbGVtLm9uY2xpY2sgPSBlID0+IHRoaXMub25DbGljayhlKTtcclxufTtcclxuXHJcblN3aXRjaEJ1dHRvbi5wcm90b3R5cGUub25DbGljayA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICBsZXQgaW52b2x2ZWREYXRhID0gdGhpcy5kYXRhO1xyXG5cclxuICAgIGlmICh0aGlzLmF2YWlsYWJsZSkge1xyXG5cclxuICAgICAgICB0aGlzLmF2YWlsYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlKCk7XHJcblxyXG4gICAgICAgIHJlcXVpcmUoTElCUyArICdzZW5kUmVxdWVzdCcpKHtcclxuICAgICAgICAgICAgW3RoaXMuZGF0YVN0cl06IGludm9sdmVkRGF0YVxyXG4gICAgICAgIH0sICdQT1NUJywgdGhpcy51cmwsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWVycikge1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlcignc3dpdGNoLWJ1dHRvbl9jaGFuZ2VkJywge1xyXG4gICAgICAgICAgICAgICAgICAgIFt0aGlzLmRhdGFTdHJdOiBpbnZvbHZlZERhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRhdGEgPT09IGludm9sdmVkRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuU3dpdGNoQnV0dG9uLnNldFJlbGF0aW9uID0gZnVuY3Rpb24gKHN3aXRjaEJ1dHRvbjEsIHN3aXRjaEJ1dHRvbjIpIHtcclxuICAgIHN3aXRjaEJ1dHRvbjEub24oJ3N3aXRjaC1idXR0b25fY2hhbmdlZCcsIGUgPT4ge1xyXG4gICAgICAgIHN3aXRjaEJ1dHRvbjIuc2V0KGUuZGV0YWlsLnJlc3BvbnNlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHN3aXRjaEJ1dHRvbjIub24oJ3N3aXRjaC1idXR0b25fY2hhbmdlZCcsIGUgPT4ge1xyXG4gICAgICAgIHN3aXRjaEJ1dHRvbjEuc2V0KGUuZGV0YWlsLnJlc3BvbnNlKTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuU3dpdGNoQnV0dG9uLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgaWYgKG9wdGlvbnMuYWN0aXZlKVxyXG4gICAgICAgIHRoaXMuX2FjdGl2YXRlKCk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5fZGVhY3RpdmF0ZSgpO1xyXG59O1xyXG5cclxuU3dpdGNoQnV0dG9uLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5hY3RpdmUpXHJcbiAgICAgICAgdGhpcy5zZXQoe2FjdGl2ZTogZmFsc2V9KTtcclxuICAgIGVsc2VcclxuICAgICAgICB0aGlzLnNldCh7YWN0aXZlOiB0cnVlfSk7XHJcbn07XHJcblxyXG5Td2l0Y2hCdXR0b24ucHJvdG90eXBlLl9hY3RpdmF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdidXR0b25fYWN0aXZlJyk7XHJcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XHJcbn07XHJcblxyXG5Td2l0Y2hCdXR0b24ucHJvdG90eXBlLl9kZWFjdGl2YXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2J1dHRvbl9hY3RpdmUnKTtcclxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XHJcbn07XHJcblxyXG5Td2l0Y2hCdXR0b24ucHJvdG90eXBlLnNldEltYWdlSWQgPSBmdW5jdGlvbiAoaW1hZ2VJZCkge1xyXG4gICAgdGhpcy5kYXRhID0gaW1hZ2VJZDtcclxufTtcclxuXHJcbmZvciAobGV0IGtleSBpbiBldmVudE1peGluKVxyXG4gICAgU3dpdGNoQnV0dG9uLnByb3RvdHlwZVtrZXldID0gZXZlbnRNaXhpbltrZXldO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTd2l0Y2hCdXR0b247XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9zd2l0Y2gtYnV0dG9uL2luZGV4LmpzIiwibGV0IGdldENvcnJlY3ROb3VuRm9ybSA9IGZ1bmN0aW9uIChzaW5nbGVGb3JtLCBhbW91bnQpIHtcclxuICAgIHJldHVybiBzaW5nbGVGb3JtICsgKChhbW91bnQgPT09IDEpID8gJycgOiAncycpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnZXRDb3JyZWN0Tm91bkZvcm07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2dldENvcnJlY3ROb3VuRm9ybS5qcyIsIm1vZHVsZS5leHBvcnRzID0gXCI8ZGl2IGlkPVxcXCJpbWFnZVxcXCIgY2xhc3M9XFxcIm1vZGFsIGltYWdlX2ltZy1lbGVtZW50LWludmlzaWJsZSBpbWFnZSBpbWFnZV9uby1kZXNjcmlwdGlvblxcXCI+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19pbWFnZS13cmFwcGVyXFxcIj5cXHJcXG4gICAgICAgIDxkaXYgaWQ9XFxcInNwaW5uZXJcXFwiIGNsYXNzPVxcXCJzcGlubmVyIGltYWdlX19zcGlubmVyXFxcIj5cXHJcXG4gICAgICAgIFxcclxcbiAgICAgICAgPC9kaXY+ICAgICAgICA8aW1nIGNsYXNzPVxcXCJpbWFnZV9faW1nLWVsZW1lbnRcXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2NvbnRyb2xzXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fY29udHJvbCBpbWFnZV9fY29udHJvbC1wcmV2IGljb24tYXJyb3ctbGVmdFxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2NvbnRyb2wgaW1hZ2VfX2NvbnRyb2wtZnVsbCBpY29uLWFycm93LW1heGltaXNlXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fY29udHJvbCBpbWFnZV9fY29udHJvbC1uZXh0IGljb24tYXJyb3ctcmlnaHRcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fc2lkZWJhclxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fdG9wLXNpZGVcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImhlYWRlciBpbWFnZV9faGVhZGVyXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGEgY2xhc3M9XFxcImltYWdlX19oZWFkZXItbGVmdC1zaWRlXFxcIiBocmVmPVxcXCJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2F2YXRhclxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9XFxcImJhY2tncm91bmQtaW1hZ2U6IHVybCgnJylcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX21ldGFkYXRhXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fdXNlcm5hbWVcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19wb3N0LWRhdGVcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDwvYT5cXHJcXG5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uIGJ1dHRvbl9pbnZpc2libGUgaW1hZ2VfX3RvcC1zaWRlLWJ1dHRvbiBpbWFnZV9fZGVsZXRlLWJ1dHRvbiBidXR0b25faGVhZGVyLXN0eWxlXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZVxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdlxcclxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XFxcImJ1dHRvbiBpbWFnZV9fdG9wLXNpZGUtYnV0dG9uIGltYWdlX19zdWJzY3JpYmUtYnV0dG9uIGJ1dHRvbl9oZWFkZXItc3R5bGVcXFwiXFxyXFxuICAgICAgICAgICAgICAgID5cXHJcXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZVxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9faW5mby1ib2FyZFxcXCI+XFxyXFxuXFxyXFxuICAgICAgICAgICAgICAgIDxkaXZcXHJcXG4gICAgICAgICAgICAgICAgXFxyXFxuICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XFxcImJ1dHRvbiBsaWtlLWJ1dHRvbiBpbWFnZV9fbGlrZS1idXR0b25cXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGlrZS1idXR0b25fX2hlYXJ0IGljb24taGVhcnRcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGlrZS1idXR0b25fX2hlYXJ0IGljb24taGVhcnQtb3V0bGluZWRcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgJm5ic3A7bGlrZSZuYnNwO1xcclxcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcImxpa2UtYnV0dG9uX19saWtlLWFtb3VudFxcXCI+PC9zcGFuPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2Rlc2NyaXB0aW9uXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIFxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbWFnZV9fY29tbWVudC1zZWN0aW9uLXdyYXBwZXIgaW1hZ2Vfbm8tc2Nyb2xsYmFyXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudC1zZWN0aW9uIGltYWdlX19jb21tZW50LXNlY3Rpb25cXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudC1zZWN0aW9uX19uby1jb21tZW50cy1ibG9ja1xcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgVGhlcmUgYXJlIG5vIGNvbW1lbnRzIHlldFxcclxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb21tZW50LXNlY3Rpb25fX2NvbW1lbnRzLXdyYXBwZXJcXFwiPlxcclxcblxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJwYW5lbCBjb21tZW50IGNvbW1lbnQtc2VjdGlvbl9fY29tbWVudCBjb21tZW50X2dob3N0XFxcIiBkYXRhLWlkPVxcXCJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudF9fdG9wLXNpZGVcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVxcXCJjb21tZW50X19yZWZcXFwiIGhyZWY9XFxcIlxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnRfX2F2YXRhclxcXCIgc3R5bGU9XFxcImJhY2tncm91bmQtaW1hZ2U6IHVybCgnJylcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb21tZW50X19tZXRhZGF0YVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb21tZW50X191c2VybmFtZVxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb21tZW50X19kYXRlXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnRfX2Nsb3NlLWJ1dHRvbiBpY29uLWNyb3NzXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29tbWVudF9fdGV4dFxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImltYWdlX19jb21tZW50LXNlY3Rpb24tc2Nyb2xsYmFyLXdyYXBwZXIgaW1hZ2Vfbm8tc2Nyb2xsYmFyXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2NvbW1lbnQtc2VjdGlvbi1zY3JvbGxiYXItb2Zmc2V0XFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2NvbW1lbnQtc2VjdGlvbi1zY3JvbGxiYXJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX2NvbW1lbnQtc2VjdGlvbi1zbGlkZXJcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwicGFuZWwgY29tbWVudCBjb21tZW50LXNlbmQgaW1hZ2VfX2NvbW1lbnQtc2VuZFxcXCJcXHJcXG4gICAgICAgICAgICAgZGF0YS1pbWFnZS1pZD1cXFwiXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb21tZW50X190b3Atc2lkZVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnRfX2F2YXRhclxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbW1lbnRfX3VzZXJuYW1lXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgICAgICA8dGV4dGFyZWEgcGxhY2Vob2xkZXI9XFxcInNoYXJlIHlvdXIgb3BpbmlvbuKAplxcXCIgY2xhc3M9XFxcImNvbW1lbnQtc2VuZF9fdGV4dGFyZWFcXFwiPjwvdGV4dGFyZWE+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uIGNvbW1lbnQtc2VuZF9fc2VuZC1idXR0b25cXFwiPnNlbmQ8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2VfX21vZGFsLWNsb3NlLWJ1dHRvbi13cmFwcGVyXFxcIj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImljb24tY3Jvc3MgbW9kYWwtY2xvc2UtYnV0dG9uIGltYWdlX19tb2RhbC1jbG9zZS1idXR0b25cXFwiPjwvZGl2PiAgICA8L2Rpdj5cXHJcXG5cXHJcXG48L2Rpdj5cXHJcXG5cXHJcXG5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svfi9odG1sLWxvYWRlciEuLi9ibG9ja3MvZ2FsbGVyeS93aW5kb3dcbi8vIG1vZHVsZSBpZCA9IDMzXG4vLyBtb2R1bGUgY2h1bmtzID0gMyA4IDEzIiwibGV0IENvbW1lbnRTZWN0aW9uID0gcmVxdWlyZShCTE9DS1MgKyAnY29tbWVudC1zZWN0aW9uJyk7XHJcblxyXG5sZXQgSW1hZ2VDb21tZW50U2VjdGlvbiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBDb21tZW50U2VjdGlvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cclxuICAgIHRoaXMuY29tbWVudFNlY3Rpb25XcmFwcGVyID0gb3B0aW9ucy5jb21tZW50U2VjdGlvbldyYXBwZXI7XHJcbiAgICB0aGlzLmluZm9Cb2FyZCA9IG9wdGlvbnMuaW5mb0JvYXJkO1xyXG4gICAgdGhpcy5zY3JvbGxiYXJXcmFwcGVyID0gb3B0aW9ucy5zY3JvbGxiYXJXcmFwcGVyO1xyXG4gICAgdGhpcy5zY3JvbGxiYXIgPSB0aGlzLnNjcm9sbGJhcldyYXBwZXIucXVlcnlTZWxlY3RvcignLmltYWdlX19jb21tZW50LXNlY3Rpb24tc2Nyb2xsYmFyJyk7XHJcbiAgICB0aGlzLnNjcm9sbGJhck9mZnNldCA9IHRoaXMuc2Nyb2xsYmFyV3JhcHBlci5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2NvbW1lbnQtc2VjdGlvbi1zY3JvbGxiYXItb2Zmc2V0Jyk7XHJcbiAgICB0aGlzLnNjcm9sbGJhclNsaWRlciA9IHRoaXMuc2Nyb2xsYmFyV3JhcHBlci5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VfX2NvbW1lbnQtc2VjdGlvbi1zbGlkZXInKTtcclxuXHJcbiAgICB0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlci5vbnNjcm9sbCA9IGUgPT4ge1xyXG4gICAgICAgIGlmICghdGhpcy5vbkRyYWdnaW5nKVxyXG4gICAgICAgICAgICB0aGlzLnNldFRvcCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnNjcm9sbGJhclNsaWRlci5vbm1vdXNlZG93biA9IGUgPT4ge1xyXG5cclxuICAgICAgICB0aGlzLm9uRHJhZ2dpbmcgPSB0cnVlO1xyXG4gICAgICAgIGxldCBzbGlkZXJDb29yZHMgPSBnZXRDb29yZHModGhpcy5zY3JvbGxiYXJTbGlkZXIpO1xyXG4gICAgICAgIGxldCBzaGlmdFkgPSBlLnBhZ2VZIC0gc2xpZGVyQ29vcmRzLnRvcDtcclxuICAgICAgICBsZXQgc2Nyb2xsYmFyQ29vcmRzID0gZ2V0Q29vcmRzKHRoaXMuc2Nyb2xsYmFyKTtcclxuICAgICAgICBsZXQgbmV3VG9wO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5vbm1vdXNlbW92ZSA9IGUgPT4ge1xyXG4gICAgICAgICAgICBuZXdUb3AgPSBlLnBhZ2VZIC0gc2hpZnRZIC0gc2Nyb2xsYmFyQ29vcmRzLnRvcDtcclxuICAgICAgICAgICAgaWYgKG5ld1RvcCA8IDApIG5ld1RvcCA9IDA7XHJcbiAgICAgICAgICAgIGxldCBib3R0b21FZGdlID0gdGhpcy5zY3JvbGxiYXIub2Zmc2V0SGVpZ2h0IC0gdGhpcy5zY3JvbGxiYXJTbGlkZXIub2Zmc2V0SGVpZ2h0O1xyXG4gICAgICAgICAgICBpZiAobmV3VG9wID4gYm90dG9tRWRnZSkgbmV3VG9wID0gYm90dG9tRWRnZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYmFyU2xpZGVyLnN0eWxlLnRvcCA9IG5ld1RvcCArICdweCc7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlci5zY3JvbGxUb3AgPSAobmV3VG9wIC8gdGhpcy5zY3JvbGxiYXIub2Zmc2V0SGVpZ2h0KSAvICgxIC0gdGhpcy5zbGlkZXJTaXplUmF0ZSkgKlxyXG4gICAgICAgICAgICAgICAgKHRoaXMuY29tbWVudFNlY3Rpb25XcmFwcGVyLnNjcm9sbEhlaWdodCAtIHRoaXMuY29tbWVudFNlY3Rpb25XcmFwcGVyLm9mZnNldEhlaWdodCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQub25tb3VzZXVwID0gZSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdvbm1vdXNldXAnLCBuZXdUb3AsIHRoaXMuc2Nyb2xsYmFyLm9mZnNldEhlaWdodCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYmFyU2xpZGVyLnN0eWxlLnRvcCA9IChuZXdUb3AgKiAxMDAgLyB0aGlzLnNjcm9sbGJhci5vZmZzZXRIZWlnaHQpICsgJyUnO1xyXG4gICAgICAgICAgICB0aGlzLm9uRHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgZG9jdW1lbnQub25tb3VzZW1vdmUgPSBkb2N1bWVudC5vbm1vdXNldXAgPSBudWxsO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTsgLy8gZGlzYWJsZSBzZWxlY3Rpb24gc3RhcnQgKGN1cnNvciBjaGFuZ2UpXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuc2Nyb2xsYmFyU2xpZGVyLm9uZHJhZ3N0YXJ0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0Q29vcmRzKGVsZW0pIHsgLy8g0LrRgNC+0LzQtSBJRTgtXHJcbiAgICAgICAgbGV0IGJveCA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHRvcDogYm94LnRvcCArIHBhZ2VZT2Zmc2V0LFxyXG4gICAgICAgICAgICBsZWZ0OiBib3gubGVmdCArIHBhZ2VYT2Zmc2V0XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG59O1xyXG5JbWFnZUNvbW1lbnRTZWN0aW9uLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlKTtcclxuSW1hZ2VDb21tZW50U2VjdGlvbi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBJbWFnZUNvbW1lbnRTZWN0aW9uO1xyXG5cclxuSW1hZ2VDb21tZW50U2VjdGlvbi5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlLnNldC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgdGhpcy51cGRhdGUoKTtcclxufTtcclxuXHJcbkltYWdlQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlLnNldFRvcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBzY3JvbGxSYXRlID0gKHRoaXMuY29tbWVudFNlY3Rpb25XcmFwcGVyLnNjcm9sbFRvcCkgL1xyXG4gICAgICAgICh0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlci5zY3JvbGxIZWlnaHQgLSB0aGlzLmNvbW1lbnRTZWN0aW9uV3JhcHBlci5vZmZzZXRIZWlnaHQpICogMTAwO1xyXG5cclxuICAgIHRoaXMuc2Nyb2xsYmFyU2xpZGVyLnN0eWxlLnRvcCA9IGAkeygxIC0gdGhpcy5zbGlkZXJTaXplUmF0ZSkgKiBzY3JvbGxSYXRlfSVgO1xyXG5cclxufTtcclxuXHJcbkltYWdlQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuY29tbWVudFNlY3Rpb25XcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2ltYWdlX25vLXNjcm9sbGJhcicpO1xyXG4gICAgdGhpcy5zY3JvbGxiYXJXcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2ltYWdlX25vLXNjcm9sbGJhcicpO1xyXG5cclxuICAgIHRoaXMuaW5mb0JvYXJkSGVpZ2h0ID0gdGhpcy5pbmZvQm9hcmQub2Zmc2V0SGVpZ2h0O1xyXG5cclxuICAgIGxldCBjb21wdXRlZFN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmluZm9Cb2FyZCk7XHJcbiAgICBwYXJzZUZsb2F0KGNvbXB1dGVkU3R5bGUuaGVpZ2h0KSAmJiAodGhpcy5pbmZvQm9hcmRIZWlnaHQgPSBwYXJzZUZsb2F0KGNvbXB1dGVkU3R5bGUuaGVpZ2h0KSk7XHJcblxyXG4gICAgdGhpcy5zY3JvbGxiYXJPZmZzZXQuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5pbmZvQm9hcmRIZWlnaHR9cHhgO1xyXG4gICAgdGhpcy5zY3JvbGxiYXIuc3R5bGUuaGVpZ2h0ID0gYGNhbGMoMTAwJSAtICR7dGhpcy5pbmZvQm9hcmRIZWlnaHR9cHgpYDtcclxuXHJcbiAgICBpZiAodGhpcy5jb21tZW50U2VjdGlvbldyYXBwZXIub2Zmc2V0SGVpZ2h0IC0gdGhpcy5jb21tZW50c1dyYXBwZXIuc2Nyb2xsSGVpZ2h0IDwgLTEpIHtcclxuICAgICAgICB0aGlzLnNsaWRlclNpemVSYXRlID0gdGhpcy5jb21tZW50U2VjdGlvbldyYXBwZXIub2Zmc2V0SGVpZ2h0IC8gdGhpcy5jb21tZW50c1dyYXBwZXIuc2Nyb2xsSGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyU2xpZGVyLnN0eWxlLmhlaWdodCA9IGAke3RoaXMuc2xpZGVyU2l6ZVJhdGUgKiAxMDB9JWA7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VG9wKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29tbWVudFNlY3Rpb25XcmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2ltYWdlX25vLXNjcm9sbGJhcicpO1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyV3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCdpbWFnZV9uby1zY3JvbGxiYXInKTtcclxuICAgIH1cclxuXHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbWFnZUNvbW1lbnRTZWN0aW9uO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvaW1hZ2UtY29tbWVudC1zZWN0aW9uL2luZGV4LmpzIiwibGV0IGV2ZW50TWl4aW4gPSByZXF1aXJlKExJQlMgKyAnZXZlbnRNaXhpbicpO1xyXG5cclxubGV0IENvbW1lbnRTZWN0aW9uID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICB0aGlzLmVsZW0gPSBvcHRpb25zLmVsZW07XHJcbiAgICB0aGlzLmNvbW1lbnRzV3JhcHBlciA9IG9wdGlvbnMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuY29tbWVudC1zZWN0aW9uX19jb21tZW50cy13cmFwcGVyJyk7XHJcbiAgICB0aGlzLmltYWdlSWQgPSBvcHRpb25zLmltYWdlSWQ7XHJcbiAgICB0aGlzLmxvZ2dlZFVzZXJWaWV3TW9kZWwgPSBvcHRpb25zLmxvZ2dlZFVzZXJWaWV3TW9kZWw7XHJcblxyXG4gICAgdGhpcy5jb21tZW50U2VuZGVyRWxlbSA9IG9wdGlvbnMuY29tbWVudFNlbmRlckVsZW07XHJcbiAgICB0aGlzLmNvbW1lbnRTZW5kVGV4dGFyZWEgPSB0aGlzLmNvbW1lbnRTZW5kZXJFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50LXNlbmRfX3RleHRhcmVhJyk7XHJcblxyXG4gICAgdGhpcy5naG9zdCA9IHRoaXMuY29tbWVudHNXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50Jyk7XHJcblxyXG4gICAgaWYgKHRoaXMubG9nZ2VkVXNlclZpZXdNb2RlbCkge1xyXG4gICAgICAgIHRoaXMuY29tbWVudFNlbmRlckVsZW0ucXVlcnlTZWxlY3RvcignLmNvbW1lbnRfX2F2YXRhcicpLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJyR7dGhpcy5sb2dnZWRVc2VyVmlld01vZGVsLmF2YXRhclVybHMubWVkaXVtfScpYDtcclxuICAgICAgICB0aGlzLmNvbW1lbnRTZW5kZXJFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50X191c2VybmFtZScpLnRleHRDb250ZW50ID0gdGhpcy5sb2dnZWRVc2VyVmlld01vZGVsLnVzZXJuYW1lO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvbW1lbnRTZW5kZXJFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50X19hdmF0YXInKS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCcke0FOT05fQVZBVEFSX1VSTH0nKWA7XHJcbiAgICAgICAgdGhpcy5jb21tZW50U2VuZGVyRWxlbS5xdWVyeVNlbGVjdG9yKCcuY29tbWVudF9fdXNlcm5hbWUnKS50ZXh0Q29udGVudCA9IEFOT05fTkFNRTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNvbW1lbnRTZW5kZXJFbGVtLm9uY2xpY2sgPSBlID0+IHtcclxuICAgICAgICBpZiAoIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnY29tbWVudC1zZW5kX19zZW5kLWJ1dHRvbicpKSByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCBpbnZvbHZlZEltYWdlSWQgPSB0aGlzLmltYWdlSWQ7XHJcbiAgICAgICAgbGV0IHRleHQgPSB0aGlzLmNvbW1lbnRTZW5kVGV4dGFyZWEudmFsdWU7XHJcbiAgICAgICAgaWYgKHRleHQubGVuZ3RoKSB7XHJcblxyXG4gICAgICAgICAgICByZXF1aXJlKExJQlMgKyAnc2VuZFJlcXVlc3QnKSh7XHJcbiAgICAgICAgICAgICAgICBpZDogaW52b2x2ZWRJbWFnZUlkLFxyXG4gICAgICAgICAgICAgICAgdGV4dFxyXG4gICAgICAgICAgICB9LCAnUE9TVCcsICcvY29tbWVudCcsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21tZW50U2VuZFRleHRhcmVhLnZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbWFnZUlkID09PSBpbnZvbHZlZEltYWdlSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluc2VydE5ld0NvbW1lbnQocmVzcG9uc2Uudmlld01vZGVsKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvQm90dG9tKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCdjb21tZW50LXNlY3Rpb25fY2hhbmdlZCcsIHtcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZUlkOiBpbnZvbHZlZEltYWdlSWRcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmVsZW0ub25jbGljayA9IGUgPT4ge1xyXG4gICAgICAgIGlmICghZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb21tZW50X19jbG9zZS1idXR0b24nKSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgY29tbWVudCA9IGUudGFyZ2V0LmNsb3Nlc3QoJy5jb21tZW50Jyk7XHJcbiAgICAgICAgbGV0IGNvbW1lbnRJZCA9IGNvbW1lbnQuZGF0YXNldC5pZDtcclxuICAgICAgICBsZXQgaW52b2x2ZWRJbWFnZUlkID0gdGhpcy5pbWFnZUlkO1xyXG5cclxuICAgICAgICByZXF1aXJlKExJQlMgKyAnc2VuZFJlcXVlc3QnKSh7XHJcbiAgICAgICAgICAgIGlkOiBjb21tZW50SWRcclxuICAgICAgICB9LCAnREVMRVRFJywgJy9jb21tZW50JywgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ2NvbW1lbnQtc2VjdGlvbl9jaGFuZ2VkJywge1xyXG4gICAgICAgICAgICAgICAgaW1hZ2VJZDogaW52b2x2ZWRJbWFnZUlkXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb21tZW50LnJlbW92ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbn07XHJcblxyXG5Db21tZW50U2VjdGlvbi5wcm90b3R5cGUuc2Nyb2xsVG9Cb3R0b20gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmNvbW1lbnRzV3JhcHBlci5zY3JvbGxUb3AgPSB0aGlzLmNvbW1lbnRzV3JhcHBlci5zY3JvbGxIZWlnaHQ7XHJcbn07XHJcblxyXG5Db21tZW50U2VjdGlvbi5wcm90b3R5cGUuaW5zZXJ0TmV3Q29tbWVudCA9IGZ1bmN0aW9uICh2aWV3TW9kZWwpIHtcclxuICAgIGxldCBuZXdDb21tZW50ID0gdGhpcy5naG9zdC5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICBuZXdDb21tZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NvbW1lbnRfZ2hvc3QnKTtcclxuICAgIG5ld0NvbW1lbnQuZGF0YXNldC5pZCA9IHZpZXdNb2RlbC5faWQ7XHJcbiAgICBuZXdDb21tZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50X19yZWYnKS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCB2aWV3TW9kZWwuY29tbWVudGF0b3IudXJsKTtcclxuICAgIG5ld0NvbW1lbnQucXVlcnlTZWxlY3RvcignLmNvbW1lbnRfX2F2YXRhcicpLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9XHJcbiAgICAgICAgYHVybCgnJHt2aWV3TW9kZWwuY29tbWVudGF0b3IuYXZhdGFyVXJscy5tZWRpdW19JylgO1xyXG4gICAgbmV3Q29tbWVudC5xdWVyeVNlbGVjdG9yKCcuY29tbWVudF9fdXNlcm5hbWUnKS50ZXh0Q29udGVudCA9IHZpZXdNb2RlbC5jb21tZW50YXRvci51c2VybmFtZTtcclxuICAgIG5ld0NvbW1lbnQucXVlcnlTZWxlY3RvcignLmNvbW1lbnRfX2RhdGUnKS50ZXh0Q29udGVudCA9IHZpZXdNb2RlbC5jcmVhdGVEYXRlU3RyO1xyXG5cclxuICAgIGlmICghdmlld01vZGVsLmlzT3duQ29tbWVudClcclxuICAgICAgICBuZXdDb21tZW50LmNsYXNzTGlzdC5hZGQoJ2NvbW1lbnRfbm90LW93bicpO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIG5ld0NvbW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY29tbWVudF9ub3Qtb3duJyk7XHJcblxyXG4gICAgbmV3Q29tbWVudC5xdWVyeVNlbGVjdG9yKCcuY29tbWVudF9fdGV4dCcpLnRleHRDb250ZW50ID0gdmlld01vZGVsLnRleHQ7XHJcbiAgICB0aGlzLmNvbW1lbnRzV3JhcHBlci5hcHBlbmRDaGlsZChuZXdDb21tZW50KTtcclxuXHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnY29tbWVudC1zZWN0aW9uX25vLWNvbW1lbnRzJyk7XHJcbn07XHJcblxyXG5cclxuQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlLnNldEltYWdlSWQgPSBmdW5jdGlvbiAoaW1hZ2VJZCkge1xyXG4gICAgdGhpcy5pbWFnZUlkID0gaW1hZ2VJZDtcclxufTtcclxuXHJcbkNvbW1lbnRTZWN0aW9uLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAodmlld01vZGVscykge1xyXG4gICAgdGhpcy5jbGVhcigpO1xyXG5cclxuICAgIGlmICh2aWV3TW9kZWxzLmxlbmd0aCA+IDApXHJcbiAgICAgICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbW1lbnQtc2VjdGlvbl9uby1jb21tZW50cycpO1xyXG5cclxuICAgIHZpZXdNb2RlbHMuZm9yRWFjaCh2aWV3TW9kZWwgPT4ge1xyXG4gICAgICAgIHRoaXMuaW5zZXJ0TmV3Q29tbWVudCh2aWV3TW9kZWwpO1xyXG4gICAgfSk7XHJcblxyXG59O1xyXG5cclxuQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIHRoaXMuY29tbWVudHNXcmFwcGVyLmlubmVySFRNTCA9ICcnO1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ2NvbW1lbnQtc2VjdGlvbl9uby1jb21tZW50cycpO1xyXG59O1xyXG5cclxuXHJcbmZvciAobGV0IGtleSBpbiBldmVudE1peGluKVxyXG4gICAgQ29tbWVudFNlY3Rpb24ucHJvdG90eXBlW2tleV0gPSBldmVudE1peGluW2tleV07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbW1lbnRTZWN0aW9uO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL2NvbW1lbnQtc2VjdGlvbi9pbmRleC5qcyIsImxldCBTd2l0Y2hCdXR0b24gPSByZXF1aXJlKEJMT0NLUyArICdzd2l0Y2gtYnV0dG9uJyk7XHJcblxyXG5sZXQgTGlrZUJ1dHRvbiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBTd2l0Y2hCdXR0b24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHJcbiAgICB0aGlzLmxpa2VBbW91bnQgPSArdGhpcy5lbGVtLmRhdGFzZXQubGlrZUFtb3VudDtcclxuICAgIHRoaXMubGlrZUFtb3VudEVsZW0gPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmxpa2UtYnV0dG9uX19saWtlLWFtb3VudCcpO1xyXG5cclxuXHJcbiAgICB0aGlzLnVybCA9ICcvbGlrZSc7XHJcblxyXG5cclxuXHJcbn07XHJcbkxpa2VCdXR0b24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShTd2l0Y2hCdXR0b24ucHJvdG90eXBlKTtcclxuTGlrZUJ1dHRvbi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBMaWtlQnV0dG9uO1xyXG5cclxuTGlrZUJ1dHRvbi5wcm90b3R5cGUuc2V0QW1vdW50ID0gZnVuY3Rpb24gKGxpa2VBbW91bnQpIHtcclxuICAgIHRoaXMubGlrZUFtb3VudCA9IGxpa2VBbW91bnQ7XHJcbiAgICB0aGlzLmxpa2VBbW91bnRFbGVtLnRleHRDb250ZW50ID0gbGlrZUFtb3VudDtcclxufTtcclxuXHJcbkxpa2VCdXR0b24ucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLnNldEFtb3VudChvcHRpb25zLmxpa2VBbW91bnQpO1xyXG4gICAgU3dpdGNoQnV0dG9uLnByb3RvdHlwZS5zZXQuY2FsbCh0aGlzLCBvcHRpb25zKTtcclxufTtcclxuXHJcbkxpa2VCdXR0b24ucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLmFjdGl2ZSlcclxuICAgICAgICB0aGlzLnNldCh7YWN0aXZlOiBmYWxzZSwgbGlrZUFtb3VudDogdGhpcy5saWtlQW1vdW50IC0gMX0pO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHRoaXMuc2V0KHthY3RpdmU6IHRydWUsIGxpa2VBbW91bnQ6IHRoaXMubGlrZUFtb3VudCArIDF9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGlrZUJ1dHRvbjtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9saWtlLWJ1dHRvbi9pbmRleC5qcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7O0FBRUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0NBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7Ozs7Ozs7Ozs7O0FDL3RCQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7OztBQUVBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7Ozs7Ozs7OztBQzFGQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNIQTs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTs7Ozs7Ozs7OztBQ3RHQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7Ozs7Ozs7OztBQy9IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7Ozs7OyIsInNvdXJjZVJvb3QiOiIifQ==