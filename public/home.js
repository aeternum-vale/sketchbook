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
/******/ 		6:0
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

	__webpack_require__(40);

	var GlobalErrorHandler = __webpack_require__(14);
	var globalErrorHandler = new GlobalErrorHandler();
	var ClientError = __webpack_require__(15).ClientError;
	var subscribeButtonsArray = [];
	var SubscribeButton = undefined;

	if (window.isLogged) {

	    __webpack_require__.e/* nsure */(7, function (require) {
	        var Dropdown = __webpack_require__(28);

	        var userMenuDropdown = new Dropdown({
	            elem: document.getElementById('user-menu'),
	            className: 'header-element'
	        });

	        var subscribeButtonElemsArray = document.getElementsByClassName('cutaway__subscribe-button');

	        SubscribeButton = __webpack_require__(39);

	        Array.prototype.forEach.call(subscribeButtonElemsArray, function (button) {
	            subscribeButtonsArray.push(new SubscribeButton({
	                elem: button,
	                data: button.dataset.username,
	                dataStr: 'username'
	            }));
	        });
	    });
	} else {
	    document.body.addEventListener('click', function (e) {
	        if (e.target.matches('.cutaway__subscribe-button')) globalErrorHandler.call(new ClientError(null, null, 401));
	    });
	}

	var Home = function Home(options) {
	    var _this = this;

	    this.elem = options.elem;
	    this.cutawaysWrapper = this.elem.querySelector('.home__cutaways-wrapper');
	    this.spinner = this.elem.querySelector('.home__spinner');
	    this.ghostCutaway = this.elem.querySelector('.home__cutaway');

	    this.isAvailable = true;
	    this.reportedCutaways = Array.prototype.map.call(this.elem.querySelectorAll('.home__cutaway'), function (item) {
	        return +item.dataset.userId;
	    });

	    this.noMoreCutaways = !this.ghostCutaway;

	    this.timerId = setInterval(function () {
	        if (!_this.noMoreCutaways) {
	            if (_this.isAvailable) if (document.body.scrollHeight === document.body.offsetHeight) _this.getNewCutaway();
	        } else clearInterval(_this.timerId);
	    }, 3000);

	    window.onscroll = function (e) {
	        if (_this.isAvailable && !_this.noMoreCutaways) if (document.body.scrollHeight === document.body.scrollTop + document.body.offsetHeight) _this.getNewCutaway();
	    };
	};

	Home.prototype.getNewCutaway = function () {
	    var _this2 = this;

	    this.spinner.classList.remove('spinner_invisible');
	    this.isAvailable = false;

	    __webpack_require__(25)({
	        reportedCutaways: this.reportedCutaways
	    }, 'POST', '/cutaway', function (err, response) {
	        if (err) {
	            globalErrorHandler.call(err);
	            return;
	        }

	        console.log('response:', response);

	        if (response.isLastSet || response.cutaways.length === 0) _this2.noMoreCutaways = true;

	        response.cutaways.forEach(function (cutaway) {
	            _this2.reportedCutaways.push(cutaway.user._id);
	            _this2.cutawaysWrapper.appendChild(_this2.getCutawayElem(cutaway));
	        });

	        _this2.spinner.classList.add('spinner_invisible');
	        _this2.isAvailable = true;
	    });
	};

	Home.prototype.getCutawayElem = function (cutaway) {
	    var cutawayElem = this.ghostCutaway.cloneNode(true);
	    cutawayElem.dataset.userId = cutaway.user._id;
	    cutawayElem.querySelector('.cutaway__header-left-side').href = cutaway.user.url;
	    cutawayElem.querySelector('.cutaway__username').textContent = cutaway.user.username;
	    cutawayElem.querySelector('.cutaway__avatar').style.backgroundImage = 'url(\'' + cutaway.user.avatarUrls.medium + '\')';

	    var subscribeButton = cutawayElem.querySelector('.cutaway__subscribe-button');

	    subscribeButton.dataset.username = cutaway.user.username;

	    console.log('isNarrator', cutaway.user.isNarrator);
	    if (cutaway.user.isNarrator) subscribeButton.dataset.active = 'true';else subscribeButton.removeAttribute('data-active');

	    if (SubscribeButton) subscribeButtonsArray.push(new SubscribeButton({
	        elem: subscribeButton,
	        data: cutaway.user.username,
	        dataStr: 'username'
	    }));

	    var cutawayTop = cutawayElem.querySelector('.cutaway__top');
	    var cutawayBottom = cutawayElem.querySelector('.cutaway__bottom');

	    for (var i = 0; i < cutawayTop.children.length; i++) {
	        cutawayTop.children[i].style.backgroundImage = 'url(\'' + cutaway.imagesTop[i].previewUrl + '\')';
	    }for (var i = 0; i < cutawayBottom.children.length; i++) {
	        cutawayBottom.children[i].style.backgroundImage = 'url(\'' + cutaway.imagesBottom[i].previewUrl + '\')';
	    }return cutawayElem;
	};

	var home = new Home({
	    elem: document.getElementById('home')
	});

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

/***/ 40:
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBhMDIwZGNhYWY3YTFkZjExMmQwZCIsIndlYnBhY2s6Ly8vLi9ob21lL3NjcmlwdC5qcyIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2dsb2JhbC1lcnJvci1oYW5kbGVyL2luZGV4LmpzIiwid2VicGFjazovLy9EOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9jb21wb25lbnRFcnJvcnMuanMiLCJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL3NlbmRSZXF1ZXN0LmpzIiwid2VicGFjazovLy8uL2hvbWUvc3R5bGUubGVzcyJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbiBcdHZhciBwYXJlbnRKc29ucEZ1bmN0aW9uID0gd2luZG93W1wid2VicGFja0pzb25wXCJdO1xuIFx0d2luZG93W1wid2VicGFja0pzb25wXCJdID0gZnVuY3Rpb24gd2VicGFja0pzb25wQ2FsbGJhY2soY2h1bmtJZHMsIG1vcmVNb2R1bGVzKSB7XG4gXHRcdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuIFx0XHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcbiBcdFx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMCwgY2FsbGJhY2tzID0gW107XG4gXHRcdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuIFx0XHRcdGlmKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSlcbiBcdFx0XHRcdGNhbGxiYWNrcy5wdXNoLmFwcGx5KGNhbGxiYWNrcywgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKTtcbiBcdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuIFx0XHR9XG4gXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG4gXHRcdFx0XHRtb2R1bGVzW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHR9XG4gXHRcdH1cbiBcdFx0aWYocGFyZW50SnNvbnBGdW5jdGlvbikgcGFyZW50SnNvbnBGdW5jdGlvbihjaHVua0lkcywgbW9yZU1vZHVsZXMpO1xuIFx0XHR3aGlsZShjYWxsYmFja3MubGVuZ3RoKVxuIFx0XHRcdGNhbGxiYWNrcy5zaGlmdCgpLmNhbGwobnVsbCwgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdH07XG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4gXHQvLyBcIjBcIiBtZWFucyBcImFscmVhZHkgbG9hZGVkXCJcbiBcdC8vIEFycmF5IG1lYW5zIFwibG9hZGluZ1wiLCBhcnJheSBjb250YWlucyBjYWxsYmFja3NcbiBcdHZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG4gXHRcdDY6MFxuIFx0fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG4gXHQvLyBUaGlzIGZpbGUgY29udGFpbnMgb25seSB0aGUgZW50cnkgY2h1bmsuXG4gXHQvLyBUaGUgY2h1bmsgbG9hZGluZyBmdW5jdGlvbiBmb3IgYWRkaXRpb25hbCBjaHVua3NcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZSA9IGZ1bmN0aW9uIHJlcXVpcmVFbnN1cmUoY2h1bmtJZCwgY2FsbGJhY2spIHtcbiBcdFx0Ly8gXCIwXCIgaXMgdGhlIHNpZ25hbCBmb3IgXCJhbHJlYWR5IGxvYWRlZFwiXG4gXHRcdGlmKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMClcbiBcdFx0XHRyZXR1cm4gY2FsbGJhY2suY2FsbChudWxsLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBhbiBhcnJheSBtZWFucyBcImN1cnJlbnRseSBsb2FkaW5nXCIuXG4gXHRcdGlmKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSAhPT0gdW5kZWZpbmVkKSB7XG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdLnB1c2goY2FsbGJhY2spO1xuIFx0XHR9IGVsc2Uge1xuIFx0XHRcdC8vIHN0YXJ0IGNodW5rIGxvYWRpbmdcbiBcdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSBbY2FsbGJhY2tdO1xuIFx0XHRcdHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiBcdFx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gXHRcdFx0c2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcbiBcdFx0XHRzY3JpcHQuY2hhcnNldCA9ICd1dGYtOCc7XG4gXHRcdFx0c2NyaXB0LmFzeW5jID0gdHJ1ZTtcblxuIFx0XHRcdHNjcmlwdC5zcmMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgY2h1bmtJZCArIFwiLlwiICsgKHt9W2NodW5rSWRdfHxjaHVua0lkKSArIFwiLmpzXCI7XG4gXHRcdFx0aGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBhMDIwZGNhYWY3YTFkZjExMmQwZCIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICcuL3N0eWxlLmxlc3MnO1xyXG5cclxubGV0IEdsb2JhbEVycm9ySGFuZGxlciA9IHJlcXVpcmUoQkxPQ0tTICsgJ2dsb2JhbC1lcnJvci1oYW5kbGVyJyk7XHJcbmxldCBnbG9iYWxFcnJvckhhbmRsZXIgPSBuZXcgR2xvYmFsRXJyb3JIYW5kbGVyKCk7XHJcbmxldCBDbGllbnRFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5DbGllbnRFcnJvcjtcclxubGV0IHN1YnNjcmliZUJ1dHRvbnNBcnJheSA9IFtdO1xyXG5sZXQgU3Vic2NyaWJlQnV0dG9uO1xyXG5cclxuaWYgKHdpbmRvdy5pc0xvZ2dlZCkge1xyXG5cclxuICAgIHJlcXVpcmUuZW5zdXJlKFtCTE9DS1MgKyAnZHJvcGRvd24nLCBCTE9DS1MgKyAnc3Vic2NyaWJlLWJ1dHRvbiddLCBmdW5jdGlvbiAocmVxdWlyZSkge1xyXG4gICAgICAgIGxldCBEcm9wZG93biA9IHJlcXVpcmUoQkxPQ0tTICsgJ2Ryb3Bkb3duJyk7XHJcblxyXG4gICAgICAgIGxldCB1c2VyTWVudURyb3Bkb3duID0gbmV3IERyb3Bkb3duKHtcclxuICAgICAgICAgICAgZWxlbTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXItbWVudScpLFxyXG4gICAgICAgICAgICBjbGFzc05hbWU6ICdoZWFkZXItZWxlbWVudCdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0IHN1YnNjcmliZUJ1dHRvbkVsZW1zQXJyYXkgPSBkb2N1bWVudFxyXG4gICAgICAgICAgICAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY3V0YXdheV9fc3Vic2NyaWJlLWJ1dHRvbicpO1xyXG5cclxuXHJcbiAgICAgICAgU3Vic2NyaWJlQnV0dG9uID0gcmVxdWlyZShCTE9DS1MgKyAnc3Vic2NyaWJlLWJ1dHRvbicpO1xyXG5cclxuICAgICAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKHN1YnNjcmliZUJ1dHRvbkVsZW1zQXJyYXksIGJ1dHRvbiA9PiB7XHJcbiAgICAgICAgICAgIHN1YnNjcmliZUJ1dHRvbnNBcnJheS5wdXNoKG5ldyBTdWJzY3JpYmVCdXR0b24oe1xyXG4gICAgICAgICAgICAgICAgZWxlbTogYnV0dG9uLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogYnV0dG9uLmRhdGFzZXQudXNlcm5hbWUsXHJcbiAgICAgICAgICAgICAgICBkYXRhU3RyOiAndXNlcm5hbWUnXHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59IGVsc2Uge1xyXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICAgIGlmIChlLnRhcmdldC5tYXRjaGVzKCcuY3V0YXdheV9fc3Vic2NyaWJlLWJ1dHRvbicpKVxyXG4gICAgICAgICAgICBnbG9iYWxFcnJvckhhbmRsZXIuY2FsbChuZXcgQ2xpZW50RXJyb3IobnVsbCwgbnVsbCwgNDAxKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxubGV0IEhvbWUgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgdGhpcy5lbGVtID0gb3B0aW9ucy5lbGVtO1xyXG4gICAgdGhpcy5jdXRhd2F5c1dyYXBwZXIgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmhvbWVfX2N1dGF3YXlzLXdyYXBwZXInKTtcclxuICAgIHRoaXMuc3Bpbm5lciA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaG9tZV9fc3Bpbm5lcicpO1xyXG4gICAgdGhpcy5naG9zdEN1dGF3YXkgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmhvbWVfX2N1dGF3YXknKTtcclxuXHJcbiAgICB0aGlzLmlzQXZhaWxhYmxlID0gdHJ1ZTtcclxuICAgIHRoaXMucmVwb3J0ZWRDdXRhd2F5cyA9IEFycmF5LnByb3RvdHlwZS5tYXBcclxuICAgICAgICAuY2FsbCh0aGlzLmVsZW0ucXVlcnlTZWxlY3RvckFsbCgnLmhvbWVfX2N1dGF3YXknKSxcclxuICAgICAgICAgICAgaXRlbSA9PiAraXRlbS5kYXRhc2V0LnVzZXJJZCk7XHJcblxyXG4gICAgdGhpcy5ub01vcmVDdXRhd2F5cyA9ICF0aGlzLmdob3N0Q3V0YXdheTtcclxuXHJcbiAgICB0aGlzLnRpbWVySWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLm5vTW9yZUN1dGF3YXlzKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzQXZhaWxhYmxlKVxyXG4gICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0ID09PSBkb2N1bWVudC5ib2R5Lm9mZnNldEhlaWdodClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldE5ld0N1dGF3YXkoKTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVySWQpO1xyXG4gICAgfSwgMzAwMCk7XHJcblxyXG5cclxuICAgIHdpbmRvdy5vbnNjcm9sbCA9IGUgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmlzQXZhaWxhYmxlICYmICF0aGlzLm5vTW9yZUN1dGF3YXlzKVxyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5zY3JvbGxIZWlnaHQgPT09IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wICtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0KVxyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXROZXdDdXRhd2F5KCk7XHJcbiAgICB9O1xyXG5cclxufTtcclxuXHJcbkhvbWUucHJvdG90eXBlLmdldE5ld0N1dGF3YXkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLnNwaW5uZXIuY2xhc3NMaXN0LnJlbW92ZSgnc3Bpbm5lcl9pbnZpc2libGUnKTtcclxuICAgIHRoaXMuaXNBdmFpbGFibGUgPSBmYWxzZTtcclxuXHJcbiAgICByZXF1aXJlKExJQlMgKyAnc2VuZFJlcXVlc3QnKSh7XHJcbiAgICAgICAgICAgIHJlcG9ydGVkQ3V0YXdheXM6IHRoaXMucmVwb3J0ZWRDdXRhd2F5c1xyXG4gICAgICAgIH0sICdQT1NUJywgJy9jdXRhd2F5JywgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgZ2xvYmFsRXJyb3JIYW5kbGVyLmNhbGwoZXJyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlOicsIHJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5pc0xhc3RTZXQgfHwgcmVzcG9uc2UuY3V0YXdheXMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5ub01vcmVDdXRhd2F5cyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICByZXNwb25zZS5jdXRhd2F5cy5mb3JFYWNoKGN1dGF3YXkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXBvcnRlZEN1dGF3YXlzLnB1c2goY3V0YXdheS51c2VyLl9pZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1dGF3YXlzV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmdldEN1dGF3YXlFbGVtKGN1dGF3YXkpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgdGhpcy5zcGlubmVyLmNsYXNzTGlzdC5hZGQoJ3NwaW5uZXJfaW52aXNpYmxlJyk7XHJcbiAgICAgICAgICAgIHRoaXMuaXNBdmFpbGFibGUgPSB0cnVlO1xyXG5cclxuICAgICAgICB9XHJcbiAgICApO1xyXG5cclxufTtcclxuXHJcbkhvbWUucHJvdG90eXBlLmdldEN1dGF3YXlFbGVtID0gZnVuY3Rpb24gKGN1dGF3YXkpIHtcclxuICAgIGxldCBjdXRhd2F5RWxlbSA9IHRoaXMuZ2hvc3RDdXRhd2F5LmNsb25lTm9kZSh0cnVlKTtcclxuICAgIGN1dGF3YXlFbGVtLmRhdGFzZXQudXNlcklkID0gY3V0YXdheS51c2VyLl9pZDtcclxuICAgIGN1dGF3YXlFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5jdXRhd2F5X19oZWFkZXItbGVmdC1zaWRlJylcclxuICAgICAgICAuaHJlZiA9IGN1dGF3YXkudXNlci51cmw7XHJcbiAgICBjdXRhd2F5RWxlbS5xdWVyeVNlbGVjdG9yKCcuY3V0YXdheV9fdXNlcm5hbWUnKVxyXG4gICAgICAgIC50ZXh0Q29udGVudCA9IGN1dGF3YXkudXNlci51c2VybmFtZTtcclxuICAgIGN1dGF3YXlFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5jdXRhd2F5X19hdmF0YXInKVxyXG4gICAgICAgIC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCcke2N1dGF3YXkudXNlci5hdmF0YXJVcmxzLm1lZGl1bX0nKWA7XHJcblxyXG4gICAgbGV0IHN1YnNjcmliZUJ1dHRvbiA9IGN1dGF3YXlFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5jdXRhd2F5X19zdWJzY3JpYmUtYnV0dG9uJyk7XHJcblxyXG4gICAgc3Vic2NyaWJlQnV0dG9uLmRhdGFzZXQudXNlcm5hbWUgPSBjdXRhd2F5LnVzZXIudXNlcm5hbWU7XHJcblxyXG4gICAgY29uc29sZS5sb2coJ2lzTmFycmF0b3InLCBjdXRhd2F5LnVzZXIuaXNOYXJyYXRvcik7XHJcbiAgICBpZiAoY3V0YXdheS51c2VyLmlzTmFycmF0b3IpXHJcbiAgICAgICAgc3Vic2NyaWJlQnV0dG9uLmRhdGFzZXQuYWN0aXZlID0gJ3RydWUnO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHN1YnNjcmliZUJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtYWN0aXZlJyk7XHJcblxyXG4gICAgaWYgKFN1YnNjcmliZUJ1dHRvbilcclxuICAgICAgICBzdWJzY3JpYmVCdXR0b25zQXJyYXkucHVzaChuZXcgU3Vic2NyaWJlQnV0dG9uKHtcclxuICAgICAgICAgICAgZWxlbTogc3Vic2NyaWJlQnV0dG9uLFxyXG4gICAgICAgICAgICBkYXRhOiBjdXRhd2F5LnVzZXIudXNlcm5hbWUsXHJcbiAgICAgICAgICAgIGRhdGFTdHI6ICd1c2VybmFtZSdcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgbGV0IGN1dGF3YXlUb3AgPSBjdXRhd2F5RWxlbS5xdWVyeVNlbGVjdG9yKCcuY3V0YXdheV9fdG9wJyk7XHJcbiAgICBsZXQgY3V0YXdheUJvdHRvbSA9IGN1dGF3YXlFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5jdXRhd2F5X19ib3R0b20nKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1dGF3YXlUb3AuY2hpbGRyZW4ubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgY3V0YXdheVRvcC5jaGlsZHJlbltpXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPVxyXG4gICAgICAgICAgICBgdXJsKCcke2N1dGF3YXkuaW1hZ2VzVG9wW2ldLnByZXZpZXdVcmx9JylgO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3V0YXdheUJvdHRvbS5jaGlsZHJlbi5sZW5ndGg7IGkrKylcclxuICAgICAgICBjdXRhd2F5Qm90dG9tLmNoaWxkcmVuW2ldLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9XHJcbiAgICAgICAgICAgIGB1cmwoJyR7Y3V0YXdheS5pbWFnZXNCb3R0b21baV0ucHJldmlld1VybH0nKWA7XHJcblxyXG4gICAgcmV0dXJuIGN1dGF3YXlFbGVtO1xyXG5cclxufTtcclxuXHJcbmxldCBob21lID0gbmV3IEhvbWUoe1xyXG4gICAgZWxlbTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hvbWUnKVxyXG59KTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vaG9tZS9zY3JpcHQuanMiLCJsZXQgR2xvYmFsRXJyb3JIYW5kbGVyID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZSA9PiB7XHJcbiAgICAgICAgbGV0IGVycm9yID0gZS5kZXRhaWw7XHJcbiAgICAgICAgdGhpcy5jYWxsKGVycm9yKTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuR2xvYmFsRXJyb3JIYW5kbGVyLnByb3RvdHlwZS5jYWxsID0gZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICByZXF1aXJlLmVuc3VyZShbTElCUyArICdjb21wb25lbnRFcnJvcnMnLCBCTE9DS1MgKyAnbWVzc2FnZS1tb2RhbC13aW5kb3cnXSwgZnVuY3Rpb24gKHJlcXVpcmUpIHtcclxuICAgICAgICBsZXQgQ29tcG9uZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ29tcG9uZW50RXJyb3I7XHJcbiAgICAgICAgbGV0IE1lc3NhZ2VNb2RhbFdpbmRvdyA9IHJlcXVpcmUoQkxPQ0tTICsgJ21lc3NhZ2UtbW9kYWwtd2luZG93Jyk7XHJcblxyXG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIENvbXBvbmVudEVycm9yKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvci5zdGF0dXMgPT09IDQwMSkge1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZGlyZWN0ZWRfdXJsJywgd2luZG93LmxvY2F0aW9uLmhyZWYpO1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gJy9hdXRob3JpemF0aW9uJztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBtZXNzYWdlTW9kYWxXaW5kb3cgPSBuZXcgTWVzc2FnZU1vZGFsV2luZG93KHttZXNzYWdlOiBlcnJvci5tZXNzYWdlfSk7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlTW9kYWxXaW5kb3cuYWN0aXZhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2xvYmFsRXJyb3JIYW5kbGVyO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvZ2xvYmFsLWVycm9yLWhhbmRsZXIvaW5kZXguanMiLCJmdW5jdGlvbiBDdXN0b21FcnJvcihtZXNzYWdlKSB7XHJcblx0dGhpcy5uYW1lID0gXCJDdXN0b21FcnJvclwiO1xyXG5cdHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcblxyXG5cdGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSlcclxuXHRcdEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIEN1c3RvbUVycm9yKTtcclxuXHRlbHNlXHJcblx0XHR0aGlzLnN0YWNrID0gKG5ldyBFcnJvcigpKS5zdGFjaztcclxufVxyXG5DdXN0b21FcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XHJcbkN1c3RvbUVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEN1c3RvbUVycm9yO1xyXG5cclxuXHJcbmZ1bmN0aW9uIENvbXBvbmVudEVycm9yKG1lc3NhZ2UsIHN0YXR1cykge1xyXG5cdEN1c3RvbUVycm9yLmNhbGwodGhpcywgbWVzc2FnZSB8fCAnQW4gZXJyb3IgaGFzIG9jY3VycmVkJyApO1xyXG5cdHRoaXMubmFtZSA9IFwiQ29tcG9uZW50RXJyb3JcIjtcclxuXHR0aGlzLnN0YXR1cyA9IHN0YXR1cztcclxufVxyXG5Db21wb25lbnRFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEN1c3RvbUVycm9yLnByb3RvdHlwZSk7XHJcbkNvbXBvbmVudEVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENvbXBvbmVudEVycm9yO1xyXG5cclxuZnVuY3Rpb24gQ2xpZW50RXJyb3IobWVzc2FnZSwgZGV0YWlsLCBzdGF0dXMpIHtcclxuXHRDb21wb25lbnRFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ0FuIGVycm9yIGhhcyBvY2N1cnJlZC4gQ2hlY2sgaWYgamF2YXNjcmlwdCBpcyBlbmFibGVkJywgc3RhdHVzKTtcclxuXHR0aGlzLm5hbWUgPSBcIkNsaWVudEVycm9yXCI7XHJcblx0dGhpcy5kZXRhaWwgPSBkZXRhaWw7XHJcbn1cclxuQ2xpZW50RXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb21wb25lbnRFcnJvci5wcm90b3R5cGUpO1xyXG5DbGllbnRFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDbGllbnRFcnJvcjtcclxuXHJcblxyXG5mdW5jdGlvbiBJbWFnZU5vdEZvdW5kKG1lc3NhZ2UpIHtcclxuICAgIENsaWVudEVycm9yLmNhbGwodGhpcywgbWVzc2FnZSB8fCAnSW1hZ2Ugbm90IGZvdW5kLiBJdCBwcm9iYWJseSBoYXMgYmVlbiByZW1vdmVkJywgbnVsbCwgNDA0KTtcclxuICAgIHRoaXMubmFtZSA9IFwiSW1hZ2VOb3RGb3VuZFwiO1xyXG59XHJcbkltYWdlTm90Rm91bmQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDbGllbnRFcnJvci5wcm90b3R5cGUpO1xyXG5JbWFnZU5vdEZvdW5kLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEltYWdlTm90Rm91bmQ7XHJcblxyXG5mdW5jdGlvbiBTZXJ2ZXJFcnJvcihtZXNzYWdlLCBzdGF0dXMpIHtcclxuXHRDb21wb25lbnRFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ1RoZXJlIGlzIHNvbWUgZXJyb3Igb24gdGhlIHNlcnZlciBzaWRlJywgc3RhdHVzKTtcclxuXHR0aGlzLm5hbWUgPSBcIlNlcnZlckVycm9yXCI7XHJcbn1cclxuU2VydmVyRXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb21wb25lbnRFcnJvci5wcm90b3R5cGUpO1xyXG5TZXJ2ZXJFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTZXJ2ZXJFcnJvcjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdENvbXBvbmVudEVycm9yLFxyXG5cdENsaWVudEVycm9yLFxyXG4gICAgSW1hZ2VOb3RGb3VuZCxcclxuXHRTZXJ2ZXJFcnJvclxyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvY29tcG9uZW50RXJyb3JzLmpzIiwibGV0IFNlcnZlckVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLlNlcnZlckVycm9yO1xyXG5sZXQgQ2xpZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ2xpZW50RXJyb3I7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChib2R5T2JqLCBtZXRob2QsIHVybCwgY2IpIHtcclxuXHJcblxyXG4gICAgbGV0IGJvZHkgPSAnJztcclxuICAgIGlmICghKHR5cGVvZiBib2R5T2JqID09PSAnc3RyaW5nJykpIHtcclxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gYm9keU9iaikge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSAnJztcclxuICAgICAgICAgICAgaWYgKGJvZHlPYmpba2V5XSlcclxuICAgICAgICAgICAgICAgIHZhbHVlID0ga2V5ICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KCh0eXBlb2YgYm9keU9ialtrZXldID09PSAnb2JqZWN0JykgPyBKU09OLnN0cmluZ2lmeShib2R5T2JqW2tleV0pIDogYm9keU9ialtrZXldKTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgYm9keSArPSAoYm9keSA9PT0gJycgPyAnJyA6ICcmJykgKyB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2VcclxuICAgICAgICBib2R5ID0gYm9keU9iajtcclxuXHJcblxyXG4gICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgeGhyLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xyXG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcclxuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiWC1SZXF1ZXN0ZWQtV2l0aFwiLCBcIlhNTEh0dHBSZXF1ZXN0XCIpO1xyXG5cclxuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSAhPSA0KSByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCByZXNwb25zZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucmVzcG9uc2VUZXh0KVxyXG4gICAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjYihuZXcgU2VydmVyRXJyb3IoJ1NlcnZlciBpcyBub3QgcmVzcG9uZGluZycpKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMClcclxuICAgICAgICAgICAgY2IobnVsbCwgcmVzcG9uc2UpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPj0gNDAwICYmIHRoaXMuc3RhdHVzIDwgNTAwKVxyXG4gICAgICAgICAgICBjYihuZXcgQ2xpZW50RXJyb3IocmVzcG9uc2UubWVzc2FnZSwgcmVzcG9uc2UuZGV0YWlsLCB0aGlzLnN0YXR1cykpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPj0gNTAwKVxyXG4gICAgICAgICAgICBjYihuZXcgU2VydmVyRXJyb3IocmVzcG9uc2UubWVzc2FnZSwgdGhpcy5zdGF0dXMpKTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc29sZS5sb2coYHNlbmRpbmcgbmV4dCByZXF1ZXN0OiAke2JvZHl9YCk7XHJcbiAgICB4aHIuc2VuZChib2R5KTtcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL3NlbmRSZXF1ZXN0LmpzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2hvbWUvc3R5bGUubGVzc1xuLy8gbW9kdWxlIGlkID0gNDBcbi8vIG1vZHVsZSBjaHVua3MgPSA2Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBSUE7QUFFQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ25KQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDL0NBOzs7OyIsInNvdXJjZVJvb3QiOiIifQ==