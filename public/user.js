webpackJsonp([11],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	__webpack_require__(61);

	var GlobalErrorHandler = __webpack_require__(21);
	var globalErrorHandler = new GlobalErrorHandler();

	var ClientError = __webpack_require__(22).ClientError;
	var Dropdown = __webpack_require__(35);
	var Modal = __webpack_require__(24);
	var ModalSpinner = __webpack_require__(36);
	var eventMixin = __webpack_require__(25);
	var PassportAnimation = __webpack_require__(63);

	var canvasElem = document.getElementById('passport-canvas');
	var passportAnimation = new PassportAnimation({
	    canvasElem: canvasElem
	});

	passportAnimation.init(canvasElem.offsetWidth, canvasElem.offsetHeight);
	window.addEventListener('resize', function () {
	    passportAnimation.init(canvasElem.offsetWidth, canvasElem.offsetHeight);
	});

	// let linksDropdown = new Dropdown({
	//     elem: document.getElementById('links-dropdown'),
	//     className: 'links-dropdown'
	// });

	var subscribeButtonElem = undefined;
	var subscribeButton = undefined;

	if (subscribeButtonElem = document.getElementById('subscribe-button')) {
	    if (window.isLogged) {
	        __webpack_require__.e/* nsure */(12, function (require) {
	            var SubscribeButton = __webpack_require__(47);
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
	                __webpack_require__.e/* nsure */(13, function (require) {
	                    var UploadImageModalWindow = __webpack_require__(64);
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
	        __webpack_require__.e/* nsure */(14, function (require) {
	            var Gallery = __webpack_require__(37);
	            gallery = new Gallery({
	                gallery: galleryElem,
	                isLogged: window.isLogged,
	                preloadEntityCount: (1),
	                isEmbedded: true,
	                publicationsStatElem: document.getElementById('publications-stat'),
	                userSubscribeButton: subscribeButton
	            });

	            gallery.on('gallery_shown', function () {
	                passportAnimation.pause();
	            });

	            gallery.on('gallery_hided', function () {
	                passportAnimation.play();
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
		ComponentError.call(this, message || 'An error has occurred. Retry later', status);
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
		ComponentError.call(this, message || 'There is some error on the server side. Retry later', status);
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

/***/ 35:
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

/***/ 36:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var eventMixin = __webpack_require__(25);
	var Modal = __webpack_require__(24);
	var Spinner = __webpack_require__(26);

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

/***/ 61:
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }),

/***/ 63:
/***/ (function(module, exports) {

	'use strict';

	var PI = Math.PI;
	var POLYGON_PERIOD = 60;
	var UNWANTED_ANGLE_RATE = .2;

	var canvasWidth = 0;
	var canvasHeight = 0;
	var canvasCenter = undefined;
	var startCircleRadius = undefined;

	var canvas = undefined;
	var ctx = undefined;

	function moveTo(point) {
	    ctx.moveTo(point.x, point.y);
	}

	function lineTo(point) {
	    ctx.lineTo(point.x, point.y);
	}

	function getCoords(center, radius, angle) {
	    return new Point(center.x + Math.cos(angle) * radius, center.y + Math.sin(angle) * radius);
	}

	function Point(x, y) {
	    this.x = x || 0;
	    this.y = y || 0;
	}

	function PassportAnimation(options) {
	    canvas = options.canvasElem;
	    ctx = canvas.getContext('2d');

	    this.beforeNewPolygonLeft = 1;
	    this.startAngle = 0;
	    this.startAngleSpeed = .01;

	    window.requestAnimFrame = (function () {
	        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
	            window.setTimeout(callback, 4);
	        };
	    })();

	    this.polygons = [];
	    var self = this;
	    // (function animloop(time) {
	    //     self.update();
	    //     self.draw();
	    //     requestAnimFrame(animloop, canvas);
	    // })();

	    var start = performance.now();
	    var UPDATE_TIME = 20;
	    (function animloop(time) {
	        var timePassed = time - start;
	        if (timePassed >= UPDATE_TIME) {
	            if (self.isPlaying) self.update();
	            start = time;
	        }
	        if (self.isPlaying) self.draw();
	        requestAnimFrame(animloop, canvas);
	    })();
	}

	PassportAnimation.prototype.init = function (_canvasWidth, _canvasHeight) {
	    this.isPlaying = true;

	    this.polygons = [];
	    this.beforeNewPolygonLeft = 1;

	    canvasWidth = _canvasWidth;
	    canvasHeight = _canvasHeight;
	    canvas.width = canvasWidth;
	    canvas.height = canvasHeight;
	    canvasCenter = new Point(canvasWidth / 2, canvasHeight / 2);
	    startCircleRadius = Math.min(canvasWidth, canvasHeight);
	};

	PassportAnimation.prototype.pause = function () {
	    this.isPlaying = false;
	};

	PassportAnimation.prototype.play = function () {
	    this.isPlaying = true;
	};

	PassportAnimation.prototype.clearScreen = function () {
	    ctx.save();
	    ctx.fillStyle = "#383838";
	    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
	    ctx.restore();
	};

	PassportAnimation.prototype.update = function () {
	    var _this = this;

	    this.startAngle += this.startAngleSpeed;
	    this.startAngle %= PI * 2;

	    this.beforeNewPolygonLeft--;
	    if (this.beforeNewPolygonLeft <= 0) {
	        this.polygons.push(new Polygon({
	            initAngle: this.startAngle
	        }));
	        this.beforeNewPolygonLeft = POLYGON_PERIOD;
	    }

	    this.polygons.forEach(function (polygon, i) {
	        polygon.update();
	        if (polygon.isFinished) _this.polygons.splice(i--, 1);
	    });
	};

	PassportAnimation.prototype.draw = function () {
	    this.clearScreen();
	    for (var i = this.polygons.length - 1; i >= 0; i--) {
	        this.polygons[i].draw();
	    }
	};

	function Polygon(options) {

	    this.initAngle = options && options.initAngle || 0;
	    this.vertexCount = options && options.vertexCount || 4;

	    this.center = canvasCenter;
	    this.width = .6;
	    this.radius = 0;
	    this.endRadius = Math.max(canvasWidth, canvasHeight) * 6;
	    this.isFinished = false;
	    this.opacity = 0;
	    this.opacityVelocity = .001;
	    this.maxOpacity = .2;
	    this.distRate = 0;

	    var globalSpeedRate = .17;
	    this.speed = .1 * globalSpeedRate;
	    this.acceleration = .08 * globalSpeedRate;
	    this.distRateSpeed = .025 * globalSpeedRate;
	    this.distRateAcceleration = .01 * globalSpeedRate;
	    this.rotationSpeed = .05 * globalSpeedRate;

	    this.rotationAngle = Math.random() * PI * 2;

	    this.vertexAngles = [];

	    for (var i = 0; i < this.vertexCount; i++) {
	        this.vertexAngles[i] = 2 * PI / this.vertexCount * (Math.random() * (1 - 2 * UNWANTED_ANGLE_RATE) + UNWANTED_ANGLE_RATE) + 2 * PI / this.vertexCount * i;
	    }
	}

	Polygon.prototype.getVertexCoords = function (angle) {
	    return getCoords(new Point(), this.radius, angle);
	};

	Polygon.prototype.update = function () {

	    this.distRate += this.distRateSpeed;
	    this.distRateSpeed -= this.distRateSpeed * this.distRateAcceleration;

	    this.center = getCoords(canvasCenter, startCircleRadius * (1 - this.distRate), this.initAngle);
	    this.radius += this.speed;
	    if (this.radius >= this.endRadius) this.isFinished = true;

	    this.speed += this.acceleration * this.speed;
	    this.width += this.acceleration * this.width;

	    this.opacity += this.opacityVelocity;
	    if (this.opacity >= this.maxOpacity) this.opacity = this.maxOpacity;

	    this.rotationAngle -= this.rotationSpeed;
	};

	Polygon.prototype.draw = function () {
	    ctx.save();

	    ctx.strokeStyle = 'rgba(255, 255, 255, ' + this.opacity + ')';
	    ctx.lineWidth = this.width;
	    ctx.lineJoin = 'mitter';
	    ctx.translate(this.center.x, this.center.y);
	    ctx.rotate(this.rotationAngle);

	    ctx.beginPath();
	    moveTo(this.getVertexCoords(this.vertexAngles[0]));
	    for (var i = 1; i < this.vertexCount; i++) {
	        lineTo(this.getVertexCoords(this.vertexAngles[i]));
	    }lineTo(this.getVertexCoords(this.vertexAngles[0]));
	    ctx.closePath();

	    ctx.stroke();
	    ctx.restore();
	};

		module.exports = PassportAnimation;

/***/ })

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3VzZXIvc2NyaXB0LmpzIiwid2VicGFjazovLy9EOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9jb21wb25lbnRFcnJvcnMuanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9tb2RhbC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvZXZlbnRNaXhpbi5qcyIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL3NwaW5uZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9zcGlubmVyL21hcmt1cCIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2Ryb3Bkb3duL2luZGV4LmpzIiwid2VicGFjazovLy8uLi9ibG9ja3MvbW9kYWwtc3Bpbm5lci9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi91c2VyL3N0eWxlLmxlc3MiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9wYXNzcG9ydC1hbmltYXRpb24vaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgJy4vc3R5bGUubGVzcyc7XHJcblxyXG5sZXQgR2xvYmFsRXJyb3JIYW5kbGVyID0gcmVxdWlyZShCTE9DS1MgKyAnZ2xvYmFsLWVycm9yLWhhbmRsZXInKTtcclxubGV0IGdsb2JhbEVycm9ySGFuZGxlciA9IG5ldyBHbG9iYWxFcnJvckhhbmRsZXIoKTtcclxuXHJcbmxldCBDbGllbnRFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5DbGllbnRFcnJvcjtcclxubGV0IERyb3Bkb3duID0gcmVxdWlyZShCTE9DS1MgKyAnZHJvcGRvd24nKTtcclxubGV0IE1vZGFsID0gcmVxdWlyZShCTE9DS1MgKyAnbW9kYWwnKTtcclxubGV0IE1vZGFsU3Bpbm5lciA9IHJlcXVpcmUoQkxPQ0tTICsgJ21vZGFsLXNwaW5uZXInKTtcclxubGV0IGV2ZW50TWl4aW4gPSByZXF1aXJlKExJQlMgKyAnZXZlbnRNaXhpbicpO1xyXG5sZXQgUGFzc3BvcnRBbmltYXRpb24gPSByZXF1aXJlKEJMT0NLUyArICdwYXNzcG9ydC1hbmltYXRpb24nKTtcclxuXHJcbmxldCBjYW52YXNFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Bhc3Nwb3J0LWNhbnZhcycpO1xyXG5sZXQgcGFzc3BvcnRBbmltYXRpb24gPSBuZXcgUGFzc3BvcnRBbmltYXRpb24oe1xyXG4gICAgY2FudmFzRWxlbVxyXG59KTtcclxuXHJcbnBhc3Nwb3J0QW5pbWF0aW9uLmluaXQoY2FudmFzRWxlbS5vZmZzZXRXaWR0aCwgY2FudmFzRWxlbS5vZmZzZXRIZWlnaHQpO1xyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCk9PiB7XHJcbiAgICBwYXNzcG9ydEFuaW1hdGlvbi5pbml0KGNhbnZhc0VsZW0ub2Zmc2V0V2lkdGgsIGNhbnZhc0VsZW0ub2Zmc2V0SGVpZ2h0KTtcclxufSk7XHJcblxyXG5cclxuXHJcblxyXG4vLyBsZXQgbGlua3NEcm9wZG93biA9IG5ldyBEcm9wZG93bih7XHJcbi8vICAgICBlbGVtOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlua3MtZHJvcGRvd24nKSxcclxuLy8gICAgIGNsYXNzTmFtZTogJ2xpbmtzLWRyb3Bkb3duJ1xyXG4vLyB9KTtcclxuXHJcbmxldCBzdWJzY3JpYmVCdXR0b25FbGVtO1xyXG5sZXQgc3Vic2NyaWJlQnV0dG9uO1xyXG5cclxuaWYgKHN1YnNjcmliZUJ1dHRvbkVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Vic2NyaWJlLWJ1dHRvbicpKSB7XHJcbiAgICBpZiAod2luZG93LmlzTG9nZ2VkKSB7XHJcbiAgICAgICAgcmVxdWlyZS5lbnN1cmUoW0JMT0NLUyArICdzdWJzY3JpYmUtYnV0dG9uJ10sIGZ1bmN0aW9uIChyZXF1aXJlKSB7XHJcbiAgICAgICAgICAgIGxldCBTdWJzY3JpYmVCdXR0b24gPSByZXF1aXJlKEJMT0NLUyArICdzdWJzY3JpYmUtYnV0dG9uJyk7XHJcbiAgICAgICAgICAgIHN1YnNjcmliZUJ1dHRvbiA9IG5ldyBTdWJzY3JpYmVCdXR0b24oe1xyXG4gICAgICAgICAgICAgICAgZWxlbTogc3Vic2NyaWJlQnV0dG9uRWxlbSxcclxuICAgICAgICAgICAgICAgIG91dGVyU3RhdEVsZW06IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdWJzY3JpYmVycy1zdGF0JylcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2VcclxuICAgICAgICBzdWJzY3JpYmVCdXR0b25FbGVtLm9uY2xpY2sgPSBlID0+IHtcclxuICAgICAgICAgICAgZ2xvYmFsRXJyb3JIYW5kbGVyLmNhbGwobmV3IENsaWVudEVycm9yKG51bGwsIG51bGwsIDQwMSkpO1xyXG4gICAgICAgIH07XHJcbn1cclxuXHJcblxyXG5sZXQgdXBsb2FkSW1hZ2VNb2RhbFdpbmRvd0NhbGxlcjtcclxubGV0IHVwbG9hZEltYWdlTW9kYWxXaW5kb3c7XHJcbmlmICh1cGxvYWRJbWFnZU1vZGFsV2luZG93Q2FsbGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VwbG9hZC13aW5kb3ctY2FsbGVyJykpIHtcclxuICAgIHVwbG9hZEltYWdlTW9kYWxXaW5kb3dDYWxsZXIub25jbGljayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXVwbG9hZEltYWdlTW9kYWxXaW5kb3cpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBzcGlubmVyID0gbmV3IE1vZGFsU3Bpbm5lcih7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXM6IE1vZGFsLnN0YXR1c2VzLk1BSk9SXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzcGlubmVyLmFjdGl2YXRlKCk7XHJcbiAgICAgICAgICAgIHJlcXVpcmUuZW5zdXJlKFtCTE9DS1MgKyAndXBsb2FkLWltYWdlLW1vZGFsLXdpbmRvdyddLFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlcXVpcmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgVXBsb2FkSW1hZ2VNb2RhbFdpbmRvdyA9IHJlcXVpcmUoQkxPQ0tTICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3VwbG9hZC1pbWFnZS1tb2RhbC13aW5kb3cnKTtcclxuICAgICAgICAgICAgICAgICAgICB1cGxvYWRJbWFnZU1vZGFsV2luZG93ID0gbmV3IFVwbG9hZEltYWdlTW9kYWxXaW5kb3coKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkSW1hZ2VNb2RhbFdpbmRvdy5vbigndXBsb2FkLWltYWdlLW1vZGFsLXdpbmRvd19faW1hZ2UtdXBsb2FkZWQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnYWxsZXJ5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhbGxlcnkuaW5zZXJ0TmV3SW1hZ2VQcmV2aWV3KGUuZGV0YWlsLmltYWdlSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuZGV0YWlsLnByZXZpZXdVcmwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlR2FsbGVyeSgpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYWxsZXJ5Lmluc2VydE5ld0ltYWdlUHJldmlldyhlLmRldGFpbC5pbWFnZUlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5kZXRhaWwucHJldmlld1VybCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzcGlubmVyLm9uSG9zdExvYWRlZCh1cGxvYWRJbWFnZU1vZGFsV2luZG93KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICB1cGxvYWRJbWFnZU1vZGFsV2luZG93LmFjdGl2YXRlKCk7XHJcbiAgICB9O1xyXG59XHJcblxyXG5sZXQgZ2FsbGVyeTtcclxubGV0IGdhbGxlcnlFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbGxlcnknKTtcclxuZ2FsbGVyeUVsZW0ub25jbGljayA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICBsZXQgdGFyZ2V0O1xyXG4gICAgaWYgKCEodGFyZ2V0ID0gZS50YXJnZXQuY2xvc2VzdCgnLmltYWdlLXByZXZpZXcnKSkpIHJldHVybjtcclxuXHJcbiAgICBsZXQgc3Bpbm5lciA9IG5ldyBNb2RhbFNwaW5uZXIoe1xyXG4gICAgICAgIHN0YXR1czogTW9kYWwuc3RhdHVzZXMuTUFKT1JcclxuICAgIH0pO1xyXG4gICAgc3Bpbm5lci5hY3RpdmF0ZSgpO1xyXG5cclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICBsZXQgaW1hZ2VJZCA9ICt0YXJnZXQuZGF0YXNldC5pZDtcclxuICAgIGNyZWF0ZUdhbGxlcnkoKS50aGVuKCgpID0+IHtcclxuICAgICAgICBzcGlubmVyLm9uSG9zdExvYWRlZChnYWxsZXJ5LCB7XHJcbiAgICAgICAgICAgIGltYWdlSWRcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlR2FsbGVyeSgpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgcmVxdWlyZS5lbnN1cmUoW0JMT0NLUyArICdnYWxsZXJ5J10sIGZ1bmN0aW9uIChyZXF1aXJlKSB7XHJcbiAgICAgICAgICAgIGxldCBHYWxsZXJ5ID0gcmVxdWlyZShCTE9DS1MgKyAnZ2FsbGVyeScpO1xyXG4gICAgICAgICAgICBnYWxsZXJ5ID0gbmV3IEdhbGxlcnkoe1xyXG4gICAgICAgICAgICAgICAgZ2FsbGVyeTogZ2FsbGVyeUVsZW0sXHJcbiAgICAgICAgICAgICAgICBpc0xvZ2dlZDogd2luZG93LmlzTG9nZ2VkLFxyXG4gICAgICAgICAgICAgICAgcHJlbG9hZEVudGl0eUNvdW50OiBQUkVMT0FEX0lNQUdFX0NPVU5ULFxyXG4gICAgICAgICAgICAgICAgaXNFbWJlZGRlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHB1YmxpY2F0aW9uc1N0YXRFbGVtOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHVibGljYXRpb25zLXN0YXQnKSxcclxuICAgICAgICAgICAgICAgIHVzZXJTdWJzY3JpYmVCdXR0b246IHN1YnNjcmliZUJ1dHRvblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGdhbGxlcnkub24oJ2dhbGxlcnlfc2hvd24nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBwYXNzcG9ydEFuaW1hdGlvbi5wYXVzZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGdhbGxlcnkub24oJ2dhbGxlcnlfaGlkZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBwYXNzcG9ydEFuaW1hdGlvbi5wbGF5KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0pO1xyXG59XHJcblxyXG4vL2xldCBtZXNzYWdlTW9kYWxXaW5kb3cgPSByZXF1aXJlKEJMT0NLUyArICdtZXNzYWdlLW1vZGFsLXdpbmRvdycpO1xyXG4vLyBsZXQgY291bnQgPSAwO1xyXG4vLyBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbi8vICAgICBsZXQgbWVzc2FnZSA9IG5ldyBtZXNzYWdlTW9kYWxXaW5kb3coe21lc3NhZ2U6ICsrY291bnR9KTtcclxuLy8gICAgIG1lc3NhZ2UuYWN0aXZhdGUoKTtcclxuLy9cclxuLy8gfSwgNTAwMCk7XHJcblxyXG5cclxuaWYgKHdpbmRvdy5pc0xvZ2dlZCkge1xyXG4gICAgbGV0IHVzZXJNZW51RHJvcGRvd24gPSBuZXcgRHJvcGRvd24oe1xyXG4gICAgICAgIGVsZW06IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2VyLW1lbnUnKSxcclxuICAgICAgICBjbGFzc05hbWU6ICdoZWFkZXItZWxlbWVudCdcclxuICAgIH0pO1xyXG59XHJcblxyXG5cclxuXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3VzZXIvc2NyaXB0LmpzIiwiZnVuY3Rpb24gQ3VzdG9tRXJyb3IobWVzc2FnZSkge1xyXG5cdHRoaXMubmFtZSA9IFwiQ3VzdG9tRXJyb3JcIjtcclxuXHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG5cclxuXHRpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpXHJcblx0XHRFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBDdXN0b21FcnJvcik7XHJcblx0ZWxzZVxyXG5cdFx0dGhpcy5zdGFjayA9IChuZXcgRXJyb3IoKSkuc3RhY2s7XHJcbn1cclxuQ3VzdG9tRXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpO1xyXG5DdXN0b21FcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDdXN0b21FcnJvcjtcclxuXHJcblxyXG5mdW5jdGlvbiBDb21wb25lbnRFcnJvcihtZXNzYWdlLCBzdGF0dXMpIHtcclxuXHRDdXN0b21FcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ0FuIGVycm9yIGhhcyBvY2N1cnJlZCcgKTtcclxuXHR0aGlzLm5hbWUgPSBcIkNvbXBvbmVudEVycm9yXCI7XHJcblx0dGhpcy5zdGF0dXMgPSBzdGF0dXM7XHJcbn1cclxuQ29tcG9uZW50RXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDdXN0b21FcnJvci5wcm90b3R5cGUpO1xyXG5Db21wb25lbnRFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDb21wb25lbnRFcnJvcjtcclxuXHJcbmZ1bmN0aW9uIENsaWVudEVycm9yKG1lc3NhZ2UsIGRldGFpbCwgc3RhdHVzKSB7XHJcblx0Q29tcG9uZW50RXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlIHx8ICdBbiBlcnJvciBoYXMgb2NjdXJyZWQuIFJldHJ5IGxhdGVyJywgc3RhdHVzKTtcclxuXHR0aGlzLm5hbWUgPSBcIkNsaWVudEVycm9yXCI7XHJcblx0dGhpcy5kZXRhaWwgPSBkZXRhaWw7XHJcbn1cclxuQ2xpZW50RXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb21wb25lbnRFcnJvci5wcm90b3R5cGUpO1xyXG5DbGllbnRFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDbGllbnRFcnJvcjtcclxuXHJcblxyXG5mdW5jdGlvbiBJbWFnZU5vdEZvdW5kKG1lc3NhZ2UpIHtcclxuICAgIENsaWVudEVycm9yLmNhbGwodGhpcywgbWVzc2FnZSB8fCAnSW1hZ2Ugbm90IGZvdW5kLiBJdCBwcm9iYWJseSBoYXMgYmVlbiByZW1vdmVkJywgbnVsbCwgNDA0KTtcclxuICAgIHRoaXMubmFtZSA9IFwiSW1hZ2VOb3RGb3VuZFwiO1xyXG59XHJcbkltYWdlTm90Rm91bmQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDbGllbnRFcnJvci5wcm90b3R5cGUpO1xyXG5JbWFnZU5vdEZvdW5kLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEltYWdlTm90Rm91bmQ7XHJcblxyXG5mdW5jdGlvbiBTZXJ2ZXJFcnJvcihtZXNzYWdlLCBzdGF0dXMpIHtcclxuXHRDb21wb25lbnRFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ1RoZXJlIGlzIHNvbWUgZXJyb3Igb24gdGhlIHNlcnZlciBzaWRlLiBSZXRyeSBsYXRlcicsIHN0YXR1cyk7XHJcblx0dGhpcy5uYW1lID0gXCJTZXJ2ZXJFcnJvclwiO1xyXG59XHJcblNlcnZlckVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29tcG9uZW50RXJyb3IucHJvdG90eXBlKTtcclxuU2VydmVyRXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2VydmVyRXJyb3I7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRDb21wb25lbnRFcnJvcixcclxuXHRDbGllbnRFcnJvcixcclxuICAgIEltYWdlTm90Rm91bmQsXHJcblx0U2VydmVyRXJyb3JcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2NvbXBvbmVudEVycm9ycy5qcyIsImxldCBldmVudE1peGluID0gcmVxdWlyZShMSUJTICsgJ2V2ZW50TWl4aW4nKTtcclxubGV0IFNwaW5uZXIgPSByZXF1aXJlKEJMT0NLUyArICdzcGlubmVyJyk7XHJcblxyXG5sZXQgTW9kYWwgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuICAgIHRoaXMubGlzdGVuZXJzID0gW107XHJcbiAgICB0aGlzLnN0YXR1cyA9IG9wdGlvbnMgJiYgb3B0aW9ucy5zdGF0dXMgfHwgTW9kYWwuc3RhdHVzZXMuTUlOT1I7XHJcbn07XHJcblxyXG5Nb2RhbC5zdGF0dXNlcyA9IHtcclxuICAgIE1BSk9SOiAxLFxyXG4gICAgTUlOT1I6IDJcclxufTtcclxuXHJcbk1vZGFsLnByb3RvdHlwZS5vbkVsZW1DbGljayA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICBpZiAoZS50YXJnZXQubWF0Y2hlcygnLm1vZGFsLWNsb3NlLWJ1dHRvbicpKVxyXG4gICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xyXG59O1xyXG5cclxuTW9kYWwucHJvdG90eXBlLnNldExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMubGlzdGVuZXJzLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgdGhpcy5lbGVtLmFkZEV2ZW50TGlzdGVuZXIoaXRlbS5ldmVudE5hbWUsIGl0ZW0uY2IpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5Nb2RhbC5zZXRCYWNrZHJvcCA9IGZ1bmN0aW9uIChzdGF0dXMpIHtcclxuICAgIGlmIChzdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKSB7XHJcbiAgICAgICAgTW9kYWwubWlub3JCYWNrZHJvcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrZHJvcF9taW5vcicpO1xyXG4gICAgICAgIGlmICghTW9kYWwubWlub3JCYWNrZHJvcClcclxuICAgICAgICAgICAgTW9kYWwubWlub3JCYWNrZHJvcCA9IE1vZGFsLnJlbmRlckJhY2tkcm9wKCdtaW5vcicpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBNb2RhbC5tYWpvckJhY2tkcm9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tkcm9wX21ham9yJyk7XHJcbiAgICAgICAgaWYgKCFNb2RhbC5tYWpvckJhY2tkcm9wKVxyXG4gICAgICAgICAgICBNb2RhbC5tYWpvckJhY2tkcm9wID0gTW9kYWwucmVuZGVyQmFja2Ryb3AoJ21ham9yJyk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5Nb2RhbC5zZXRXcmFwcGVyID0gZnVuY3Rpb24gKHN0YXR1cykge1xyXG4gICAgaWYgKHN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpIHtcclxuICAgICAgICBNb2RhbC5taW5vcldyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtd3JhcHBlci1taW5vcicpO1xyXG4gICAgICAgIGlmICghTW9kYWwubWlub3JXcmFwcGVyKVxyXG4gICAgICAgICAgICBNb2RhbC5taW5vcldyYXBwZXIgPSBNb2RhbC5yZW5kZXJXcmFwcGVyKCdtaW5vcicpO1xyXG4gICAgICAgIE1vZGFsLm1pbm9yV3JhcHBlci5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldCAmJiAhZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2RhbC13cmFwcGVyX21pbm9yJykpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKE1vZGFsLm1pbm9yQWN0aXZlKVxyXG4gICAgICAgICAgICAgICAgTW9kYWwubWlub3JRdWV1ZVswXS5kZWFjdGl2YXRlKCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgTW9kYWwubWFqb3JXcmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLXdyYXBwZXItbWFqb3InKTtcclxuICAgICAgICBpZiAoIU1vZGFsLm1ham9yV3JhcHBlcilcclxuICAgICAgICAgICAgTW9kYWwubWFqb3JXcmFwcGVyID0gTW9kYWwucmVuZGVyV3JhcHBlcignbWFqb3InKTtcclxuICAgICAgICBNb2RhbC5tYWpvcldyYXBwZXIub25jbGljayA9IGUgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZS50YXJnZXQgJiYgIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbW9kYWwtd3JhcHBlcl9tYWpvcicpKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChNb2RhbC5tYWpvckFjdGl2ZSlcclxuICAgICAgICAgICAgICAgIE1vZGFsLm1ham9yUXVldWVbMF0uZGVhY3RpdmF0ZSgpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn07XHJcblxyXG5Nb2RhbC5yZW5kZXJCYWNrZHJvcCA9IGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICBsZXQgYmFja2Ryb3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKTtcclxuICAgIGJhY2tkcm9wLmNsYXNzTmFtZSA9ICdiYWNrZHJvcCBiYWNrZHJvcF9pbnZpc2libGUnO1xyXG4gICAgYmFja2Ryb3AuY2xhc3NMaXN0LmFkZChgYmFja2Ryb3BfJHt0eXBlfWApO1xyXG4gICAgYmFja2Ryb3AuaWQgPSBgYmFja2Ryb3AtJHt0eXBlfWA7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGJhY2tkcm9wKTtcclxuICAgIHJldHVybiBiYWNrZHJvcDtcclxufTtcclxuXHJcbk1vZGFsLnJlbmRlcldyYXBwZXIgPSBmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgbGV0IHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKTtcclxuICAgIHdyYXBwZXIuY2xhc3NOYW1lID0gJ21vZGFsLXdyYXBwZXIgbW9kYWwtd3JhcHBlcl9pbnZpc2libGUnO1xyXG4gICAgd3JhcHBlci5jbGFzc0xpc3QuYWRkKGBtb2RhbC13cmFwcGVyXyR7dHlwZX1gKTtcclxuICAgIHdyYXBwZXIuaWQgPSBgbW9kYWwtd3JhcHBlci0ke3R5cGV9YDtcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQod3JhcHBlcik7XHJcbiAgICByZXR1cm4gd3JhcHBlcjtcclxufTtcclxuXHJcbk1vZGFsLnByb3RvdHlwZS5yZW5kZXJXaW5kb3cgPSBmdW5jdGlvbiAoaHRtbCkge1xyXG5cclxuICAgIGxldCBwYXJlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKTtcclxuICAgIHBhcmVudC5pbm5lckhUTUwgPSBodG1sO1xyXG4gICAgbGV0IHduZCA9IHBhcmVudC5maXJzdEVsZW1lbnRDaGlsZDtcclxuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpXHJcbiAgICAgICAgTW9kYWwubWlub3JXcmFwcGVyLmFwcGVuZENoaWxkKHduZCk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgTW9kYWwubWFqb3JXcmFwcGVyLmFwcGVuZENoaWxkKHduZCk7XHJcblxyXG4gICAgcGFyZW50LnJlbW92ZSgpO1xyXG4gICAgcmV0dXJuIHduZDtcclxufTtcclxuXHJcbk1vZGFsLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUikge1xyXG4gICAgICAgIGlmICghTW9kYWwubWlub3JCYWNrZHJvcClcclxuICAgICAgICAgICAgTW9kYWwuc2V0QmFja2Ryb3AoTW9kYWwuc3RhdHVzZXMuTUlOT1IpO1xyXG5cclxuICAgICAgICBpZiAoIU1vZGFsLm1pbm9yV3JhcHBlcilcclxuICAgICAgICAgICAgTW9kYWwuc2V0V3JhcHBlcihNb2RhbC5zdGF0dXNlcy5NSU5PUik7XHJcblxyXG4gICAgICAgIE1vZGFsLm1pbm9yV3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC13cmFwcGVyX2ludmlzaWJsZScpO1xyXG4gICAgICAgIE1vZGFsLm1pbm9yQmFja2Ryb3AuY2xhc3NMaXN0LnJlbW92ZSgnYmFja2Ryb3BfaW52aXNpYmxlJyk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoIU1vZGFsLm1ham9yQmFja2Ryb3ApXHJcbiAgICAgICAgICAgIE1vZGFsLnNldEJhY2tkcm9wKE1vZGFsLnN0YXR1c2VzLk1BSk9SKTtcclxuXHJcbiAgICAgICAgaWYgKCFNb2RhbC5tYWpvcldyYXBwZXIpXHJcbiAgICAgICAgICAgIE1vZGFsLnNldFdyYXBwZXIoTW9kYWwuc3RhdHVzZXMuTUFKT1IpO1xyXG5cclxuICAgICAgICBNb2RhbC5tYWpvcldyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtd3JhcHBlcl9pbnZpc2libGUnKTtcclxuICAgICAgICBNb2RhbC5tYWpvckJhY2tkcm9wLmNsYXNzTGlzdC5yZW1vdmUoJ2JhY2tkcm9wX2ludmlzaWJsZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcclxuXHJcbn07XHJcblxyXG5cclxuTW9kYWwucHJvdG90eXBlLmFjdGl2YXRlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICBpZiAodGhpcy5lbGVtSWQgPT09ICdzcGlubmVyJykge1xyXG4gICAgICAgIGxldCBzcGlubmVyID0gdGhpcztcclxuICAgICAgICB0aGlzLm9uKCdzcGlubmVyX2hvc3QtbG9hZGVkJywgZSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBuZXdIb3N0ID0gZS5kZXRhaWwuaG9zdDtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gTW9kYWwuc3RhdHVzZXMuTUlOT1IpXHJcbiAgICAgICAgICAgICAgICBNb2RhbC5taW5vclF1ZXVlLnNwbGljZShNb2RhbC5taW5vclF1ZXVlLmluZGV4T2Yoc3Bpbm5lcikgKyAxLCAwLCBuZXdIb3N0KTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgTW9kYWwubWFqb3JRdWV1ZS5zcGxpY2UoTW9kYWwubWFqb3JRdWV1ZS5pbmRleE9mKHNwaW5uZXIpICsgMSwgMCwgbmV3SG9zdCk7XHJcblxyXG4gICAgICAgICAgICBzcGlubmVyLmRlYWN0aXZhdGUoZS5kZXRhaWwub3B0aW9ucyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKSB7XHJcbiAgICAgICAgICAgIE1vZGFsLm1pbm9yUXVldWUucHVzaCh0aGlzKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coTW9kYWwubWlub3JRdWV1ZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKE1vZGFsLm1ham9yUXVldWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFNb2RhbC5taW5vckFjdGl2ZSlcclxuICAgICAgICAgICAgICAgIE1vZGFsLm1pbm9yU2hvdyhvcHRpb25zKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgTW9kYWwubWFqb3JRdWV1ZS5wdXNoKHRoaXMpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhNb2RhbC5taW5vclF1ZXVlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coTW9kYWwubWFqb3JRdWV1ZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIU1vZGFsLm1ham9yQWN0aXZlKVxyXG5cclxuICAgICAgICAgICAgICAgIE1vZGFsLm1ham9yU2hvdyhvcHRpb25zKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59O1xyXG5cclxuTW9kYWwucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5zdGF0dXMgPT09IE1vZGFsLnN0YXR1c2VzLk1JTk9SKSB7XHJcbiAgICAgICAgLy9UT0RPIG5vdCBuZWNjZXNzYXJ5IGlmIHF1ZXVlIGlzIG5vdCBlbXB0eVxyXG4gICAgICAgIE1vZGFsLm1pbm9yV3JhcHBlci5jbGFzc0xpc3QuYWRkKCdtb2RhbC13cmFwcGVyX2ludmlzaWJsZScpO1xyXG4gICAgICAgIE1vZGFsLm1pbm9yQmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgnYmFja2Ryb3BfaW52aXNpYmxlJyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBNb2RhbC5tYWpvcldyYXBwZXIuY2xhc3NMaXN0LmFkZCgnbW9kYWwtd3JhcHBlcl9pbnZpc2libGUnKTtcclxuICAgICAgICBNb2RhbC5tYWpvckJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoJ2JhY2tkcm9wX2ludmlzaWJsZScpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcbk1vZGFsLnByb3RvdHlwZS5kZWFjdGl2YXRlID0gZnVuY3Rpb24gKG5leHRXaW5kb3dPcHRpb25zLCBoaWRlT3B0aW9ucykge1xyXG5cclxuICAgIHRoaXMuaGlkZShoaWRlT3B0aW9ucyk7XHJcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBNb2RhbC5zdGF0dXNlcy5NSU5PUikge1xyXG4gICAgICAgIE1vZGFsLm1pbm9yQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgTW9kYWwubWlub3JRdWV1ZS5zaGlmdCgpO1xyXG4gICAgICAgIE1vZGFsLm1pbm9yU2hvdyhuZXh0V2luZG93T3B0aW9ucyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIE1vZGFsLm1ham9yQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgTW9kYWwubWFqb3JRdWV1ZS5zaGlmdCgpO1xyXG4gICAgICAgIE1vZGFsLm1ham9yU2hvdyhuZXh0V2luZG93T3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnRyaWdnZXIoJ21vZGFsLXdpbmRvd19kZWFjdGl2YXRlZCcpO1xyXG59O1xyXG5cclxuTW9kYWwubWlub3JBY3RpdmUgPSBmYWxzZTtcclxuTW9kYWwubWFqb3JBY3RpdmUgPSBmYWxzZTtcclxuTW9kYWwubWlub3JRdWV1ZSA9IFtdO1xyXG5Nb2RhbC5tYWpvclF1ZXVlID0gW107XHJcblxyXG5Nb2RhbC5zcGlubmVyID0gbmV3IFNwaW5uZXIoKTtcclxuTW9kYWwuc3Bpbm5lci5zdGF0dXMgPSBNb2RhbC5zdGF0dXNlcy5NQUpPUjtcclxuXHJcbk1vZGFsLnNob3dTcGlubmVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgTW9kYWwucHJvdG90eXBlLnNob3cuY2FsbChNb2RhbC5zcGlubmVyKTtcclxuXHJcbiAgICBpZiAoIU1vZGFsLnNwaW5uZXIuZWxlbSlcclxuICAgICAgICBNb2RhbC5zcGlubmVyLmVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bpbm5lcicpO1xyXG4gICAgaWYgKCFNb2RhbC5zcGlubmVyLmVsZW0pXHJcbiAgICAgICAgTW9kYWwuc3Bpbm5lci5lbGVtID0gTW9kYWwucHJvdG90eXBlLnJlbmRlcldpbmRvdy5jYWxsKE1vZGFsLnNwaW5uZXIsIFNwaW5uZXIuaHRtbCk7XHJcblxyXG4gICAgTW9kYWwuc3Bpbm5lci5zaG93KCk7XHJcbn07XHJcblxyXG5Nb2RhbC5oaWRlU3Bpbm5lciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIE1vZGFsLnNwaW5uZXIuaGlkZSgpO1xyXG59O1xyXG5cclxuXHJcbk1vZGFsLm1pbm9yU2hvdyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBsZXQgbmV4dE1vZGFsV2luZG93ID0gTW9kYWwubWlub3JRdWV1ZVswXTtcclxuICAgIGlmIChuZXh0TW9kYWxXaW5kb3cpIHtcclxuICAgICAgICBsZXQgcHJvbWlzZSA9IG5leHRNb2RhbFdpbmRvdy5zaG93KG9wdGlvbnMpO1xyXG4gICAgICAgIGlmIChwcm9taXNlKVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIE1vZGFsLm1pbm9yQWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIE1vZGFsLm1pbm9yQWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIE1vZGFsLm1pbm9yQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuTW9kYWwubWFqb3JTaG93ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICBsZXQgbmV4dE1vZGFsV2luZG93ID0gTW9kYWwubWFqb3JRdWV1ZVswXTtcclxuXHJcbiAgICBpZiAobmV4dE1vZGFsV2luZG93KSB7XHJcblxyXG4gICAgICAgIE1vZGFsLnNob3dTcGlubmVyKCk7XHJcbiAgICAgICAgbGV0IHByb21pc2UgPSBuZXh0TW9kYWxXaW5kb3cuc2hvdyhvcHRpb25zKTtcclxuXHJcbiAgICAgICAgaWYgKHByb21pc2UpXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgTW9kYWwubWFqb3JBY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgTW9kYWwuaGlkZVNwaW5uZXIoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIE1vZGFsLm1ham9yQWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgTW9kYWwuaGlkZVNwaW5uZXIoKTtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIE1vZGFsLm1ham9yQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZm9yIChsZXQga2V5IGluIGV2ZW50TWl4aW4pXHJcbiAgICBNb2RhbC5wcm90b3R5cGVba2V5XSA9IGV2ZW50TWl4aW5ba2V5XTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGFsO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL21vZGFsL2luZGV4LmpzIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG5cdG9uOiBmdW5jdGlvbihldmVudE5hbWUsIGNiKSB7XHJcblx0XHRpZiAodGhpcy5lbGVtKVxyXG5cdFx0XHR0aGlzLmVsZW0uYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNiKTtcclxuXHRcdGVsc2VcclxuXHRcdFx0dGhpcy5saXN0ZW5lcnMucHVzaCh7XHJcblx0XHRcdFx0ZXZlbnROYW1lLFxyXG5cdFx0XHRcdGNiXHJcblx0XHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdHRyaWdnZXI6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZGV0YWlsKSB7XHJcblx0XHR0aGlzLmVsZW0uZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7XHJcblx0XHRcdGJ1YmJsZXM6IHRydWUsXHJcblx0XHRcdGNhbmNlbGFibGU6IHRydWUsXHJcblx0XHRcdGRldGFpbDogZGV0YWlsXHJcblx0XHR9KSk7XHJcblx0fSxcclxuXHJcblx0ZXJyb3I6IGZ1bmN0aW9uKGVycikge1xyXG5cdFx0dGhpcy5lbGVtLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdlcnJvcicsIHtcclxuXHRcdFx0YnViYmxlczogdHJ1ZSxcclxuXHRcdFx0Y2FuY2VsYWJsZTogdHJ1ZSxcclxuXHRcdFx0ZGV0YWlsOiBlcnJcclxuXHRcdH0pKTtcclxuXHR9XHJcblxyXG5cclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2V2ZW50TWl4aW4uanMiLCJsZXQgU3Bpbm5lciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLmVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bpbm5lcicpO1xyXG59O1xyXG5cclxuU3Bpbm5lci5odG1sID0gcmVxdWlyZShgaHRtbC1sb2FkZXIhLi9tYXJrdXBgKTtcclxuXHJcblNwaW5uZXIucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnc3Bpbm5lcl9pbnZpc2libGUnKTtcclxufTtcclxuXHJcblNwaW5uZXIucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnc3Bpbm5lcl9pbnZpc2libGUnKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3Bpbm5lcjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL3NwaW5uZXIvaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBpZD1cXFwic3Bpbm5lclxcXCIgY2xhc3M9XFxcInNwaW5uZXJcXFwiPlxcclxcblxcclxcbjwvZGl2PlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9+L2h0bWwtbG9hZGVyIS4uL2Jsb2Nrcy9zcGlubmVyL21hcmt1cFxuLy8gbW9kdWxlIGlkID0gMjdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIDIgOSAxMCAxMSIsImxldCBEcm9wZG93biA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgdGhpcy5lbGVtID0gb3B0aW9ucy5lbGVtO1xyXG4gICAgdGhpcy5pdGVtTGlzdCA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuZHJvcGRvd25fX2l0ZW0tbGlzdCcpO1xyXG4gICAgdGhpcy5jbGFzc05hbWUgPSBvcHRpb25zLmNsYXNzTmFtZTtcclxuXHJcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG5cclxuICAgIC8vIHRoaXMuZWxlbS5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAvLyAgICAgdGhpcy50b2dnbGUoKTtcclxuICAgIC8vIH07XHJcblxyXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaXRlbUxpc3QuY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW0uY29udGFpbnMoZS50YXJnZXQpKVxyXG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGUoKTtcclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5hY3RpdmUpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSwgZmFsc2UpO1xyXG5cclxuXHJcbiAgICB0aGlzLkFFSGFuZGxlciA9IHRoaXMuQUVIYW5kbGVyLmJpbmQodGhpcyk7XHJcblxyXG59O1xyXG5cclxuRHJvcGRvd24ucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnZHJvcGRvd25faW52aXNpYmxlJyk7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZChgJHt0aGlzLmNsYXNzTmFtZX1fYWN0aXZlYCk7XHJcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XHJcbn07XHJcblxyXG5Ecm9wZG93bi5wcm90b3R5cGUuZGVhY3RpdmF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuaXRlbUxpc3QuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgdGhpcy5BRUhhbmRsZXIsIGZhbHNlKTtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdkcm9wZG93bl9mYWRpbmctb3V0Jyk7XHJcbn07XHJcblxyXG5Ecm9wZG93bi5wcm90b3R5cGUuQUVIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3Bkb3duX2ZhZGluZy1vdXQnKTtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdkcm9wZG93bl9pbnZpc2libGUnKTtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKGAke3RoaXMuY2xhc3NOYW1lfV9hY3RpdmVgKTtcclxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XHJcbiAgICB0aGlzLml0ZW1MaXN0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbmVuZCcsIHRoaXMuQUVIYW5kbGVyKTtcclxufTtcclxuXHJcbkRyb3Bkb3duLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5hY3RpdmUpXHJcbiAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5zaG93KCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERyb3Bkb3duO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvZHJvcGRvd24vaW5kZXguanMiLCJsZXQgZXZlbnRNaXhpbiA9IHJlcXVpcmUoTElCUyArICdldmVudE1peGluJyk7XHJcbmxldCBNb2RhbCA9IHJlcXVpcmUoQkxPQ0tTICsgJ21vZGFsJyk7XHJcbmxldCBTcGlubmVyID0gcmVxdWlyZShCTE9DS1MgKyAnc3Bpbm5lcicpO1xyXG5cclxubGV0IE1vZGFsU3Bpbm5lciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBTcGlubmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICBNb2RhbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgdGhpcy5lbGVtSWQgPSAnc3Bpbm5lcic7XHJcbiAgICB0aGlzLmhvc3QgPSBudWxsO1xyXG5cclxufTtcclxuTW9kYWxTcGlubmVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoTW9kYWwucHJvdG90eXBlKTtcclxuTW9kYWxTcGlubmVyLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IE1vZGFsU3Bpbm5lcjtcclxuXHJcbmZvciAobGV0IGtleSBpbiBTcGlubmVyLnByb3RvdHlwZSlcclxuICAgIE1vZGFsU3Bpbm5lci5wcm90b3R5cGVba2V5XSA9IFNwaW5uZXIucHJvdG90eXBlW2tleV07XHJcblxyXG5cclxuTW9kYWxTcGlubmVyLnByb3RvdHlwZS5zZXRFbGVtID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAoIXRoaXMuZWxlbSlcclxuICAgICAgICB0aGlzLmVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bpbm5lcicpO1xyXG4gICAgaWYgKCF0aGlzLmVsZW0pXHJcbiAgICAgICAgdGhpcy5lbGVtID0gdGhpcy5yZW5kZXJXaW5kb3coU3Bpbm5lci5odG1sKTtcclxuXHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnbW9kYWwnLCAnbW9kYWwtc3Bpbm5lcicpO1xyXG59O1xyXG5cclxuTW9kYWxTcGlubmVyLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgTW9kYWwucHJvdG90eXBlLnNob3cuYXBwbHkodGhpcyk7XHJcblxyXG4gICAgaWYgKCF0aGlzLmVsZW0pXHJcbiAgICAgICAgdGhpcy5zZXRFbGVtKCk7XHJcblxyXG4gICAgdGhpcy5zZXRMaXN0ZW5lcnMoKTtcclxuXHJcbiAgICBTcGlubmVyLnByb3RvdHlwZS5zaG93LmFwcGx5KHRoaXMpO1xyXG59O1xyXG5cclxuTW9kYWxTcGlubmVyLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgTW9kYWwucHJvdG90eXBlLmhpZGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgIFNwaW5uZXIucHJvdG90eXBlLmhpZGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufTtcclxuXHJcblxyXG5Nb2RhbFNwaW5uZXIucHJvdG90eXBlLmRlYWN0aXZhdGUgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgTW9kYWwucHJvdG90eXBlLmRlYWN0aXZhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufTtcclxuXHJcbk1vZGFsU3Bpbm5lci5wcm90b3R5cGUub25Ib3N0TG9hZGVkID0gZnVuY3Rpb24gKGhvc3QsIG9wdGlvbnMpIHtcclxuICAgIHRoaXMudHJpZ2dlcignc3Bpbm5lcl9ob3N0LWxvYWRlZCcsIHtcclxuICAgICAgICBob3N0LFxyXG4gICAgICAgIG9wdGlvbnNcclxuICAgIH0pO1xyXG59O1xyXG5cclxuXHJcblxyXG5mb3IgKGxldCBrZXkgaW4gZXZlbnRNaXhpbilcclxuICAgIE1vZGFsU3Bpbm5lci5wcm90b3R5cGVba2V5XSA9IGV2ZW50TWl4aW5ba2V5XTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTW9kYWxTcGlubmVyO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvbW9kYWwtc3Bpbm5lci9pbmRleC5qcyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi91c2VyL3N0eWxlLmxlc3Ncbi8vIG1vZHVsZSBpZCA9IDYxXG4vLyBtb2R1bGUgY2h1bmtzID0gMTEiLCJjb25zdCBQSSA9IE1hdGguUEk7XHJcbmNvbnN0IFBPTFlHT05fUEVSSU9EID0gNjA7XHJcbmNvbnN0IFVOV0FOVEVEX0FOR0xFX1JBVEUgPSAuMjtcclxuXHJcbmxldCBjYW52YXNXaWR0aCA9IDA7XHJcbmxldCBjYW52YXNIZWlnaHQgPSAwO1xyXG5sZXQgY2FudmFzQ2VudGVyO1xyXG5sZXQgc3RhcnRDaXJjbGVSYWRpdXM7XHJcblxyXG5sZXQgY2FudmFzO1xyXG5sZXQgY3R4O1xyXG5cclxuZnVuY3Rpb24gbW92ZVRvKHBvaW50KSB7XHJcbiAgICBjdHgubW92ZVRvKHBvaW50LngsIHBvaW50LnkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsaW5lVG8ocG9pbnQpIHtcclxuICAgIGN0eC5saW5lVG8ocG9pbnQueCwgcG9pbnQueSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENvb3JkcyhjZW50ZXIsIHJhZGl1cywgYW5nbGUpIHtcclxuICAgIHJldHVybiBuZXcgUG9pbnQoY2VudGVyLnggKyBNYXRoLmNvcyhhbmdsZSkgKiByYWRpdXMsXHJcbiAgICAgICAgY2VudGVyLnkgKyBNYXRoLnNpbihhbmdsZSkgKiByYWRpdXMpO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gUG9pbnQoeCwgeSkge1xyXG4gICAgdGhpcy54ID0geCB8fCAwO1xyXG4gICAgdGhpcy55ID0geSB8fCAwO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gUGFzc3BvcnRBbmltYXRpb24ob3B0aW9ucykge1xyXG4gICAgY2FudmFzID0gb3B0aW9ucy5jYW52YXNFbGVtO1xyXG4gICAgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG4gICAgdGhpcy5iZWZvcmVOZXdQb2x5Z29uTGVmdCA9IDE7XHJcbiAgICB0aGlzLnN0YXJ0QW5nbGUgPSAwO1xyXG4gICAgdGhpcy5zdGFydEFuZ2xlU3BlZWQgPSAuMDE7XHJcblxyXG4gICAgd2luZG93LnJlcXVlc3RBbmltRnJhbWUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICAgICAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICAgICAgICB3aW5kb3cub1JlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICAgICAgICB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgNCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICB9KSgpO1xyXG5cclxuICAgIHRoaXMucG9seWdvbnMgPSBbXTtcclxuICAgIGxldCBzZWxmID0gdGhpcztcclxuICAgIC8vIChmdW5jdGlvbiBhbmltbG9vcCh0aW1lKSB7XHJcbiAgICAvLyAgICAgc2VsZi51cGRhdGUoKTtcclxuICAgIC8vICAgICBzZWxmLmRyYXcoKTtcclxuICAgIC8vICAgICByZXF1ZXN0QW5pbUZyYW1lKGFuaW1sb29wLCBjYW52YXMpO1xyXG4gICAgLy8gfSkoKTtcclxuXHJcbiAgICBsZXQgc3RhcnQgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgIGxldCBVUERBVEVfVElNRSA9IDIwO1xyXG4gICAgKGZ1bmN0aW9uIGFuaW1sb29wKHRpbWUpIHtcclxuICAgICAgICBsZXQgdGltZVBhc3NlZCA9IHRpbWUgLSBzdGFydDtcclxuICAgICAgICBpZiAodGltZVBhc3NlZCA+PSBVUERBVEVfVElNRSkge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5pc1BsYXlpbmcpXHJcbiAgICAgICAgICAgICAgICBzZWxmLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBzdGFydCA9IHRpbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzZWxmLmlzUGxheWluZylcclxuICAgICAgICAgICAgc2VsZi5kcmF3KCk7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1GcmFtZShhbmltbG9vcCwgY2FudmFzKTtcclxuICAgIH0pKCk7XHJcbn1cclxuXHJcblBhc3Nwb3J0QW5pbWF0aW9uLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKF9jYW52YXNXaWR0aCwgX2NhbnZhc0hlaWdodCkge1xyXG4gICAgdGhpcy5pc1BsYXlpbmcgPSB0cnVlO1xyXG5cclxuICAgIHRoaXMucG9seWdvbnMgPSBbXTtcclxuICAgIHRoaXMuYmVmb3JlTmV3UG9seWdvbkxlZnQgPSAxO1xyXG5cclxuICAgIGNhbnZhc1dpZHRoID0gX2NhbnZhc1dpZHRoO1xyXG4gICAgY2FudmFzSGVpZ2h0ID0gX2NhbnZhc0hlaWdodDtcclxuICAgIGNhbnZhcy53aWR0aCA9IGNhbnZhc1dpZHRoO1xyXG4gICAgY2FudmFzLmhlaWdodCA9IGNhbnZhc0hlaWdodDtcclxuICAgIGNhbnZhc0NlbnRlciA9IG5ldyBQb2ludChjYW52YXNXaWR0aCAvIDIsIGNhbnZhc0hlaWdodCAvIDIpO1xyXG4gICAgc3RhcnRDaXJjbGVSYWRpdXMgPSBNYXRoLm1pbihjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0KTtcclxufTtcclxuXHJcblBhc3Nwb3J0QW5pbWF0aW9uLnByb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuaXNQbGF5aW5nID0gZmFsc2U7XHJcbn07XHJcblxyXG5QYXNzcG9ydEFuaW1hdGlvbi5wcm90b3R5cGUucGxheSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuaXNQbGF5aW5nID0gdHJ1ZTtcclxufTtcclxuXHJcblBhc3Nwb3J0QW5pbWF0aW9uLnByb3RvdHlwZS5jbGVhclNjcmVlbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGN0eC5zYXZlKCk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCIjMzgzODM4XCI7XHJcbiAgICBjdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCk7XHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG59O1xyXG5cclxuUGFzc3BvcnRBbmltYXRpb24ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuc3RhcnRBbmdsZSArPSB0aGlzLnN0YXJ0QW5nbGVTcGVlZDtcclxuICAgIHRoaXMuc3RhcnRBbmdsZSAlPSBQSSAqIDI7XHJcblxyXG4gICAgdGhpcy5iZWZvcmVOZXdQb2x5Z29uTGVmdC0tO1xyXG4gICAgaWYgKHRoaXMuYmVmb3JlTmV3UG9seWdvbkxlZnQgPD0gMCkge1xyXG4gICAgICAgIHRoaXMucG9seWdvbnMucHVzaChuZXcgUG9seWdvbih7XHJcbiAgICAgICAgICAgIGluaXRBbmdsZTogdGhpcy5zdGFydEFuZ2xlXHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIHRoaXMuYmVmb3JlTmV3UG9seWdvbkxlZnQgPSBQT0xZR09OX1BFUklPRDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnBvbHlnb25zLmZvckVhY2goKHBvbHlnb24sIGkpID0+IHtcclxuICAgICAgICBwb2x5Z29uLnVwZGF0ZSgpO1xyXG4gICAgICAgIGlmIChwb2x5Z29uLmlzRmluaXNoZWQpXHJcbiAgICAgICAgICAgIHRoaXMucG9seWdvbnMuc3BsaWNlKGktLSwgMSk7XHJcbiAgICB9KTtcclxuXHJcbn07XHJcblxyXG5QYXNzcG9ydEFuaW1hdGlvbi5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuY2xlYXJTY3JlZW4oKTtcclxuICAgIGZvciAobGV0IGkgPSB0aGlzLnBvbHlnb25zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxyXG4gICAgICAgIHRoaXMucG9seWdvbnNbaV0uZHJhdygpO1xyXG59O1xyXG5cclxuXHJcbmZ1bmN0aW9uIFBvbHlnb24ob3B0aW9ucykge1xyXG5cclxuICAgIHRoaXMuaW5pdEFuZ2xlID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5pbml0QW5nbGUpIHx8IDA7XHJcbiAgICB0aGlzLnZlcnRleENvdW50ID0gKG9wdGlvbnMgJiYgb3B0aW9ucy52ZXJ0ZXhDb3VudCkgfHwgNDtcclxuXHJcbiAgICB0aGlzLmNlbnRlciA9IGNhbnZhc0NlbnRlcjtcclxuICAgIHRoaXMud2lkdGggPSAuNjtcclxuICAgIHRoaXMucmFkaXVzID0gMDtcclxuICAgIHRoaXMuZW5kUmFkaXVzID0gTWF0aC5tYXgoY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCkgKiA2O1xyXG4gICAgdGhpcy5pc0ZpbmlzaGVkID0gZmFsc2U7XHJcbiAgICB0aGlzLm9wYWNpdHkgPSAwO1xyXG4gICAgdGhpcy5vcGFjaXR5VmVsb2NpdHkgPSAuMDAxO1xyXG4gICAgdGhpcy5tYXhPcGFjaXR5ID0gLjI7XHJcbiAgICB0aGlzLmRpc3RSYXRlID0gMDtcclxuXHJcbiAgICBsZXQgZ2xvYmFsU3BlZWRSYXRlID0gLjE3O1xyXG4gICAgdGhpcy5zcGVlZCA9IC4xICogZ2xvYmFsU3BlZWRSYXRlO1xyXG4gICAgdGhpcy5hY2NlbGVyYXRpb24gPSAuMDggKiBnbG9iYWxTcGVlZFJhdGU7XHJcbiAgICB0aGlzLmRpc3RSYXRlU3BlZWQgPSAuMDI1ICogZ2xvYmFsU3BlZWRSYXRlO1xyXG4gICAgdGhpcy5kaXN0UmF0ZUFjY2VsZXJhdGlvbiA9IC4wMSAqIGdsb2JhbFNwZWVkUmF0ZTtcclxuICAgIHRoaXMucm90YXRpb25TcGVlZCA9IC4wNSAqIGdsb2JhbFNwZWVkUmF0ZTtcclxuXHJcbiAgICB0aGlzLnJvdGF0aW9uQW5nbGUgPSBNYXRoLnJhbmRvbSgpICogUEkgKiAyO1xyXG5cclxuICAgIHRoaXMudmVydGV4QW5nbGVzID0gW107XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnZlcnRleENvdW50OyBpKyspXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhBbmdsZXNbaV0gPSAyICogUEkgLyB0aGlzLnZlcnRleENvdW50ICpcclxuICAgICAgICAgICAgKE1hdGgucmFuZG9tKCkgKiAoMSAtIDIgKiBVTldBTlRFRF9BTkdMRV9SQVRFKSArIFVOV0FOVEVEX0FOR0xFX1JBVEUpXHJcbiAgICAgICAgICAgICsgMiAqIFBJIC8gdGhpcy52ZXJ0ZXhDb3VudCAqIGk7XHJcbn1cclxuXHJcblxyXG5Qb2x5Z29uLnByb3RvdHlwZS5nZXRWZXJ0ZXhDb29yZHMgPSBmdW5jdGlvbiAoYW5nbGUpIHtcclxuICAgIHJldHVybiBnZXRDb29yZHMobmV3IFBvaW50KCksIHRoaXMucmFkaXVzLCBhbmdsZSk7XHJcbn07XHJcblxyXG5Qb2x5Z29uLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgdGhpcy5kaXN0UmF0ZSArPSB0aGlzLmRpc3RSYXRlU3BlZWQ7XHJcbiAgICB0aGlzLmRpc3RSYXRlU3BlZWQgLT0gdGhpcy5kaXN0UmF0ZVNwZWVkICogdGhpcy5kaXN0UmF0ZUFjY2VsZXJhdGlvbjtcclxuXHJcbiAgICB0aGlzLmNlbnRlciA9IGdldENvb3JkcyhjYW52YXNDZW50ZXIsIHN0YXJ0Q2lyY2xlUmFkaXVzICogKDEgLSB0aGlzLmRpc3RSYXRlKSwgdGhpcy5pbml0QW5nbGUpO1xyXG4gICAgdGhpcy5yYWRpdXMgKz0gdGhpcy5zcGVlZDtcclxuICAgIGlmICh0aGlzLnJhZGl1cyA+PSB0aGlzLmVuZFJhZGl1cykgdGhpcy5pc0ZpbmlzaGVkID0gdHJ1ZTtcclxuXHJcbiAgICB0aGlzLnNwZWVkICs9IHRoaXMuYWNjZWxlcmF0aW9uICogdGhpcy5zcGVlZDtcclxuICAgIHRoaXMud2lkdGggKz0gdGhpcy5hY2NlbGVyYXRpb24gKiB0aGlzLndpZHRoO1xyXG5cclxuICAgIHRoaXMub3BhY2l0eSArPSB0aGlzLm9wYWNpdHlWZWxvY2l0eTtcclxuICAgIGlmICh0aGlzLm9wYWNpdHkgPj0gdGhpcy5tYXhPcGFjaXR5KSB0aGlzLm9wYWNpdHkgPSB0aGlzLm1heE9wYWNpdHk7XHJcblxyXG4gICAgdGhpcy5yb3RhdGlvbkFuZ2xlIC09IHRoaXMucm90YXRpb25TcGVlZDtcclxufTtcclxuXHJcblBvbHlnb24ucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBjdHguc2F2ZSgpO1xyXG5cclxuICAgIGN0eC5zdHJva2VTdHlsZSA9IGByZ2JhKDI1NSwgMjU1LCAyNTUsICR7dGhpcy5vcGFjaXR5fSlgO1xyXG4gICAgY3R4LmxpbmVXaWR0aCA9IHRoaXMud2lkdGg7XHJcbiAgICBjdHgubGluZUpvaW4gPSAnbWl0dGVyJztcclxuICAgIGN0eC50cmFuc2xhdGUodGhpcy5jZW50ZXIueCwgdGhpcy5jZW50ZXIueSk7XHJcbiAgICBjdHgucm90YXRlKHRoaXMucm90YXRpb25BbmdsZSk7XHJcblxyXG5cclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIG1vdmVUbyh0aGlzLmdldFZlcnRleENvb3Jkcyh0aGlzLnZlcnRleEFuZ2xlc1swXSkpO1xyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLnZlcnRleENvdW50OyBpKyspXHJcbiAgICAgICAgbGluZVRvKHRoaXMuZ2V0VmVydGV4Q29vcmRzKHRoaXMudmVydGV4QW5nbGVzW2ldKSk7XHJcbiAgICBsaW5lVG8odGhpcy5nZXRWZXJ0ZXhDb29yZHModGhpcy52ZXJ0ZXhBbmdsZXNbMF0pKTtcclxuICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuXHJcbiAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG59O1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGFzc3BvcnRBbmltYXRpb247XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9wYXNzcG9ydC1hbmltYXRpb24vaW5kZXguanMiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFJQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3BKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBOzs7QUFFQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBOzs7Ozs7Ozs7QUN0UUE7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDYkE7Ozs7Ozs7OztBQ0FBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBOzs7Ozs7Ozs7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBSUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFBQTs7Ozs7OztBQzFEQTs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Iiwic291cmNlUm9vdCI6IiJ9