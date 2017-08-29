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

	__webpack_require__(41);

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

	        SubscribeButton = __webpack_require__(40);

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

/***/ 41:
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAzYjhjYTdiYWZiMzQwMjk5Y2ZjNT9lZmJiKiIsIndlYnBhY2s6Ly8vLi9ob21lL3NjcmlwdC5qcyIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2dsb2JhbC1lcnJvci1oYW5kbGVyL2luZGV4LmpzP2IwMTYqIiwid2VicGFjazovLy9EOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9jb21wb25lbnRFcnJvcnMuanM/YWNiNSIsIndlYnBhY2s6Ly8vRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvc2VuZFJlcXVlc3QuanM/OGEyNyIsIndlYnBhY2s6Ly8vLi9ob21lL3N0eWxlLmxlc3MiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG4gXHR2YXIgcGFyZW50SnNvbnBGdW5jdGlvbiA9IHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXTtcbiBcdHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXSA9IGZ1bmN0aW9uIHdlYnBhY2tKc29ucENhbGxiYWNrKGNodW5rSWRzLCBtb3JlTW9kdWxlcykge1xuIFx0XHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcbiBcdFx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG4gXHRcdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDAsIGNhbGxiYWNrcyA9IFtdO1xuIFx0XHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcbiBcdFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pXG4gXHRcdFx0XHRjYWxsYmFja3MucHVzaC5hcHBseShjYWxsYmFja3MsIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSk7XG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcbiBcdFx0fVxuIFx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGlmKHBhcmVudEpzb25wRnVuY3Rpb24pIHBhcmVudEpzb25wRnVuY3Rpb24oY2h1bmtJZHMsIG1vcmVNb2R1bGVzKTtcbiBcdFx0d2hpbGUoY2FsbGJhY2tzLmxlbmd0aClcbiBcdFx0XHRjYWxsYmFja3Muc2hpZnQoKS5jYWxsKG51bGwsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHR9O1xuXG4gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuIFx0Ly8gXCIwXCIgbWVhbnMgXCJhbHJlYWR5IGxvYWRlZFwiXG4gXHQvLyBBcnJheSBtZWFucyBcImxvYWRpbmdcIiwgYXJyYXkgY29udGFpbnMgY2FsbGJhY2tzXG4gXHR2YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuIFx0XHQ2OjBcbiBcdH07XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuIFx0Ly8gVGhpcyBmaWxlIGNvbnRhaW5zIG9ubHkgdGhlIGVudHJ5IGNodW5rLlxuIFx0Ly8gVGhlIGNodW5rIGxvYWRpbmcgZnVuY3Rpb24gZm9yIGFkZGl0aW9uYWwgY2h1bmtzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmUgPSBmdW5jdGlvbiByZXF1aXJlRW5zdXJlKGNodW5rSWQsIGNhbGxiYWNrKSB7XG4gXHRcdC8vIFwiMFwiIGlzIHRoZSBzaWduYWwgZm9yIFwiYWxyZWFkeSBsb2FkZWRcIlxuIFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApXG4gXHRcdFx0cmV0dXJuIGNhbGxiYWNrLmNhbGwobnVsbCwgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gYW4gYXJyYXkgbWVhbnMgXCJjdXJyZW50bHkgbG9hZGluZ1wiLlxuIFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gIT09IHVuZGVmaW5lZCkge1xuIFx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXS5wdXNoKGNhbGxiYWNrKTtcbiBcdFx0fSBlbHNlIHtcbiBcdFx0XHQvLyBzdGFydCBjaHVuayBsb2FkaW5nXG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gW2NhbGxiYWNrXTtcbiBcdFx0XHR2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gXHRcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuIFx0XHRcdHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gXHRcdFx0c2NyaXB0LmNoYXJzZXQgPSAndXRmLTgnO1xuIFx0XHRcdHNjcmlwdC5hc3luYyA9IHRydWU7XG5cbiBcdFx0XHRzY3JpcHQuc3JjID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGNodW5rSWQgKyBcIi5cIiArICh7fVtjaHVua0lkXXx8Y2h1bmtJZCkgKyBcIi5qc1wiO1xuIFx0XHRcdGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgM2I4Y2E3YmFmYjM0MDI5OWNmYzUiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAnLi9zdHlsZS5sZXNzJztcclxuXHJcbmxldCBHbG9iYWxFcnJvckhhbmRsZXIgPSByZXF1aXJlKEJMT0NLUyArICdnbG9iYWwtZXJyb3ItaGFuZGxlcicpO1xyXG5sZXQgZ2xvYmFsRXJyb3JIYW5kbGVyID0gbmV3IEdsb2JhbEVycm9ySGFuZGxlcigpO1xyXG5sZXQgQ2xpZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ2xpZW50RXJyb3I7XHJcbmxldCBzdWJzY3JpYmVCdXR0b25zQXJyYXkgPSBbXTtcclxubGV0IFN1YnNjcmliZUJ1dHRvbjtcclxuXHJcbmlmICh3aW5kb3cuaXNMb2dnZWQpIHtcclxuXHJcbiAgICByZXF1aXJlLmVuc3VyZShbQkxPQ0tTICsgJ2Ryb3Bkb3duJywgQkxPQ0tTICsgJ3N1YnNjcmliZS1idXR0b24nXSwgZnVuY3Rpb24gKHJlcXVpcmUpIHtcclxuICAgICAgICBsZXQgRHJvcGRvd24gPSByZXF1aXJlKEJMT0NLUyArICdkcm9wZG93bicpO1xyXG5cclxuICAgICAgICBsZXQgdXNlck1lbnVEcm9wZG93biA9IG5ldyBEcm9wZG93bih7XHJcbiAgICAgICAgICAgIGVsZW06IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2VyLW1lbnUnKSxcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiAnaGVhZGVyLWVsZW1lbnQnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBzdWJzY3JpYmVCdXR0b25FbGVtc0FycmF5ID0gZG9jdW1lbnRcclxuICAgICAgICAgICAgLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2N1dGF3YXlfX3N1YnNjcmliZS1idXR0b24nKTtcclxuXHJcblxyXG4gICAgICAgIFN1YnNjcmliZUJ1dHRvbiA9IHJlcXVpcmUoQkxPQ0tTICsgJ3N1YnNjcmliZS1idXR0b24nKTtcclxuXHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChzdWJzY3JpYmVCdXR0b25FbGVtc0FycmF5LCBidXR0b24gPT4ge1xyXG4gICAgICAgICAgICBzdWJzY3JpYmVCdXR0b25zQXJyYXkucHVzaChuZXcgU3Vic2NyaWJlQnV0dG9uKHtcclxuICAgICAgICAgICAgICAgIGVsZW06IGJ1dHRvbixcclxuICAgICAgICAgICAgICAgIGRhdGE6IGJ1dHRvbi5kYXRhc2V0LnVzZXJuYW1lLFxyXG4gICAgICAgICAgICAgICAgZGF0YVN0cjogJ3VzZXJuYW1lJ1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSBlbHNlIHtcclxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgICAgICBpZiAoZS50YXJnZXQubWF0Y2hlcygnLmN1dGF3YXlfX3N1YnNjcmliZS1idXR0b24nKSlcclxuICAgICAgICAgICAgZ2xvYmFsRXJyb3JIYW5kbGVyLmNhbGwobmV3IENsaWVudEVycm9yKG51bGwsIG51bGwsIDQwMSkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmxldCBIb21lID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuZWxlbSA9IG9wdGlvbnMuZWxlbTtcclxuICAgIHRoaXMuY3V0YXdheXNXcmFwcGVyID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5ob21lX19jdXRhd2F5cy13cmFwcGVyJyk7XHJcbiAgICB0aGlzLnNwaW5uZXIgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmhvbWVfX3NwaW5uZXInKTtcclxuICAgIHRoaXMuZ2hvc3RDdXRhd2F5ID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5ob21lX19jdXRhd2F5Jyk7XHJcblxyXG4gICAgdGhpcy5pc0F2YWlsYWJsZSA9IHRydWU7XHJcbiAgICB0aGlzLnJlcG9ydGVkQ3V0YXdheXMgPSBBcnJheS5wcm90b3R5cGUubWFwXHJcbiAgICAgICAgLmNhbGwodGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5ob21lX19jdXRhd2F5JyksXHJcbiAgICAgICAgICAgIGl0ZW0gPT4gK2l0ZW0uZGF0YXNldC51c2VySWQpO1xyXG5cclxuICAgIHRoaXMubm9Nb3JlQ3V0YXdheXMgPSAhdGhpcy5naG9zdEN1dGF3YXk7XHJcblxyXG4gICAgdGhpcy50aW1lcklkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIGlmICghdGhpcy5ub01vcmVDdXRhd2F5cykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0F2YWlsYWJsZSlcclxuICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5ib2R5LnNjcm9sbEhlaWdodCA9PT0gZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXROZXdDdXRhd2F5KCk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcklkKTtcclxuICAgIH0sIDMwMDApO1xyXG5cclxuXHJcbiAgICB3aW5kb3cub25zY3JvbGwgPSBlID0+IHtcclxuICAgICAgICBpZiAodGhpcy5pc0F2YWlsYWJsZSAmJiAhdGhpcy5ub01vcmVDdXRhd2F5cylcclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0ID09PSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCArXHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5Lm9mZnNldEhlaWdodClcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0TmV3Q3V0YXdheSgpO1xyXG4gICAgfTtcclxuXHJcbn07XHJcblxyXG5Ib21lLnByb3RvdHlwZS5nZXROZXdDdXRhd2F5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5zcGlubmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3NwaW5uZXJfaW52aXNpYmxlJyk7XHJcbiAgICB0aGlzLmlzQXZhaWxhYmxlID0gZmFsc2U7XHJcblxyXG4gICAgcmVxdWlyZShMSUJTICsgJ3NlbmRSZXF1ZXN0Jykoe1xyXG4gICAgICAgICAgICByZXBvcnRlZEN1dGF3YXlzOiB0aGlzLnJlcG9ydGVkQ3V0YXdheXNcclxuICAgICAgICB9LCAnUE9TVCcsICcvY3V0YXdheScsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGdsb2JhbEVycm9ySGFuZGxlci5jYWxsKGVycik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZXNwb25zZTonLCByZXNwb25zZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2UuaXNMYXN0U2V0IHx8IHJlc3BvbnNlLmN1dGF3YXlzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgICAgIHRoaXMubm9Nb3JlQ3V0YXdheXMgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgcmVzcG9uc2UuY3V0YXdheXMuZm9yRWFjaChjdXRhd2F5ID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVwb3J0ZWRDdXRhd2F5cy5wdXNoKGN1dGF3YXkudXNlci5faWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXRhd2F5c1dyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5nZXRDdXRhd2F5RWxlbShjdXRhd2F5KSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3Bpbm5lci5jbGFzc0xpc3QuYWRkKCdzcGlubmVyX2ludmlzaWJsZScpO1xyXG4gICAgICAgICAgICB0aGlzLmlzQXZhaWxhYmxlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxuXHJcbn07XHJcblxyXG5Ib21lLnByb3RvdHlwZS5nZXRDdXRhd2F5RWxlbSA9IGZ1bmN0aW9uIChjdXRhd2F5KSB7XHJcbiAgICBsZXQgY3V0YXdheUVsZW0gPSB0aGlzLmdob3N0Q3V0YXdheS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICBjdXRhd2F5RWxlbS5kYXRhc2V0LnVzZXJJZCA9IGN1dGF3YXkudXNlci5faWQ7XHJcbiAgICBjdXRhd2F5RWxlbS5xdWVyeVNlbGVjdG9yKCcuY3V0YXdheV9faGVhZGVyLWxlZnQtc2lkZScpXHJcbiAgICAgICAgLmhyZWYgPSBjdXRhd2F5LnVzZXIudXJsO1xyXG4gICAgY3V0YXdheUVsZW0ucXVlcnlTZWxlY3RvcignLmN1dGF3YXlfX3VzZXJuYW1lJylcclxuICAgICAgICAudGV4dENvbnRlbnQgPSBjdXRhd2F5LnVzZXIudXNlcm5hbWU7XHJcbiAgICBjdXRhd2F5RWxlbS5xdWVyeVNlbGVjdG9yKCcuY3V0YXdheV9fYXZhdGFyJylcclxuICAgICAgICAuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgnJHtjdXRhd2F5LnVzZXIuYXZhdGFyVXJscy5tZWRpdW19JylgO1xyXG5cclxuICAgIGxldCBzdWJzY3JpYmVCdXR0b24gPSBjdXRhd2F5RWxlbS5xdWVyeVNlbGVjdG9yKCcuY3V0YXdheV9fc3Vic2NyaWJlLWJ1dHRvbicpO1xyXG5cclxuICAgIHN1YnNjcmliZUJ1dHRvbi5kYXRhc2V0LnVzZXJuYW1lID0gY3V0YXdheS51c2VyLnVzZXJuYW1lO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKCdpc05hcnJhdG9yJywgY3V0YXdheS51c2VyLmlzTmFycmF0b3IpO1xyXG4gICAgaWYgKGN1dGF3YXkudXNlci5pc05hcnJhdG9yKVxyXG4gICAgICAgIHN1YnNjcmliZUJ1dHRvbi5kYXRhc2V0LmFjdGl2ZSA9ICd0cnVlJztcclxuICAgIGVsc2VcclxuICAgICAgICBzdWJzY3JpYmVCdXR0b24ucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWFjdGl2ZScpO1xyXG5cclxuICAgIGlmIChTdWJzY3JpYmVCdXR0b24pXHJcbiAgICAgICAgc3Vic2NyaWJlQnV0dG9uc0FycmF5LnB1c2gobmV3IFN1YnNjcmliZUJ1dHRvbih7XHJcbiAgICAgICAgICAgIGVsZW06IHN1YnNjcmliZUJ1dHRvbixcclxuICAgICAgICAgICAgZGF0YTogY3V0YXdheS51c2VyLnVzZXJuYW1lLFxyXG4gICAgICAgICAgICBkYXRhU3RyOiAndXNlcm5hbWUnXHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgIGxldCBjdXRhd2F5VG9wID0gY3V0YXdheUVsZW0ucXVlcnlTZWxlY3RvcignLmN1dGF3YXlfX3RvcCcpO1xyXG4gICAgbGV0IGN1dGF3YXlCb3R0b20gPSBjdXRhd2F5RWxlbS5xdWVyeVNlbGVjdG9yKCcuY3V0YXdheV9fYm90dG9tJyk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXRhd2F5VG9wLmNoaWxkcmVuLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGN1dGF3YXlUb3AuY2hpbGRyZW5baV0uc3R5bGUuYmFja2dyb3VuZEltYWdlID1cclxuICAgICAgICAgICAgYHVybCgnJHtjdXRhd2F5LmltYWdlc1RvcFtpXS5wcmV2aWV3VXJsfScpYDtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1dGF3YXlCb3R0b20uY2hpbGRyZW4ubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgY3V0YXdheUJvdHRvbS5jaGlsZHJlbltpXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPVxyXG4gICAgICAgICAgICBgdXJsKCcke2N1dGF3YXkuaW1hZ2VzQm90dG9tW2ldLnByZXZpZXdVcmx9JylgO1xyXG5cclxuICAgIHJldHVybiBjdXRhd2F5RWxlbTtcclxuXHJcbn07XHJcblxyXG5sZXQgaG9tZSA9IG5ldyBIb21lKHtcclxuICAgIGVsZW06IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdob21lJylcclxufSk7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2hvbWUvc2NyaXB0LmpzIiwibGV0IEdsb2JhbEVycm9ySGFuZGxlciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGUgPT4ge1xyXG4gICAgICAgIGxldCBlcnJvciA9IGUuZGV0YWlsO1xyXG4gICAgICAgIHRoaXMuY2FsbChlcnJvcik7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbkdsb2JhbEVycm9ySGFuZGxlci5wcm90b3R5cGUuY2FsbCA9IGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgcmVxdWlyZS5lbnN1cmUoW0xJQlMgKyAnY29tcG9uZW50RXJyb3JzJywgQkxPQ0tTICsgJ21lc3NhZ2UtbW9kYWwtd2luZG93J10sIGZ1bmN0aW9uIChyZXF1aXJlKSB7XHJcbiAgICAgICAgbGV0IENvbXBvbmVudEVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLkNvbXBvbmVudEVycm9yO1xyXG4gICAgICAgIGxldCBNZXNzYWdlTW9kYWxXaW5kb3cgPSByZXF1aXJlKEJMT0NLUyArICdtZXNzYWdlLW1vZGFsLXdpbmRvdycpO1xyXG5cclxuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBDb21wb25lbnRFcnJvcikge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzID09PSA0MDEpIHtcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWRpcmVjdGVkX3VybCcsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9ICcvYXV0aG9yaXphdGlvbic7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWVzc2FnZU1vZGFsV2luZG93ID0gbmV3IE1lc3NhZ2VNb2RhbFdpbmRvdyh7bWVzc2FnZTogZXJyb3IubWVzc2FnZX0pO1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZU1vZGFsV2luZG93LmFjdGl2YXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdsb2JhbEVycm9ySGFuZGxlcjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL2dsb2JhbC1lcnJvci1oYW5kbGVyL2luZGV4LmpzIiwiZnVuY3Rpb24gQ3VzdG9tRXJyb3IobWVzc2FnZSkge1xyXG5cdHRoaXMubmFtZSA9IFwiQ3VzdG9tRXJyb3JcIjtcclxuXHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG5cclxuXHRpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpXHJcblx0XHRFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBDdXN0b21FcnJvcik7XHJcblx0ZWxzZVxyXG5cdFx0dGhpcy5zdGFjayA9IChuZXcgRXJyb3IoKSkuc3RhY2s7XHJcbn1cclxuQ3VzdG9tRXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpO1xyXG5DdXN0b21FcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDdXN0b21FcnJvcjtcclxuXHJcblxyXG5mdW5jdGlvbiBDb21wb25lbnRFcnJvcihtZXNzYWdlLCBzdGF0dXMpIHtcclxuXHRDdXN0b21FcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ0FuIGVycm9yIGhhcyBvY2N1cnJlZCcgKTtcclxuXHR0aGlzLm5hbWUgPSBcIkNvbXBvbmVudEVycm9yXCI7XHJcblx0dGhpcy5zdGF0dXMgPSBzdGF0dXM7XHJcbn1cclxuQ29tcG9uZW50RXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDdXN0b21FcnJvci5wcm90b3R5cGUpO1xyXG5Db21wb25lbnRFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDb21wb25lbnRFcnJvcjtcclxuXHJcbmZ1bmN0aW9uIENsaWVudEVycm9yKG1lc3NhZ2UsIGRldGFpbCwgc3RhdHVzKSB7XHJcblx0Q29tcG9uZW50RXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlIHx8ICdBbiBlcnJvciBoYXMgb2NjdXJyZWQuIENoZWNrIGlmIGphdmFzY3JpcHQgaXMgZW5hYmxlZCcsIHN0YXR1cyk7XHJcblx0dGhpcy5uYW1lID0gXCJDbGllbnRFcnJvclwiO1xyXG5cdHRoaXMuZGV0YWlsID0gZGV0YWlsO1xyXG59XHJcbkNsaWVudEVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29tcG9uZW50RXJyb3IucHJvdG90eXBlKTtcclxuQ2xpZW50RXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ2xpZW50RXJyb3I7XHJcblxyXG5cclxuZnVuY3Rpb24gSW1hZ2VOb3RGb3VuZChtZXNzYWdlKSB7XHJcbiAgICBDbGllbnRFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ0ltYWdlIG5vdCBmb3VuZC4gSXQgcHJvYmFibHkgaGFzIGJlZW4gcmVtb3ZlZCcsIG51bGwsIDQwNCk7XHJcbiAgICB0aGlzLm5hbWUgPSBcIkltYWdlTm90Rm91bmRcIjtcclxufVxyXG5JbWFnZU5vdEZvdW5kLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ2xpZW50RXJyb3IucHJvdG90eXBlKTtcclxuSW1hZ2VOb3RGb3VuZC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBJbWFnZU5vdEZvdW5kO1xyXG5cclxuZnVuY3Rpb24gU2VydmVyRXJyb3IobWVzc2FnZSwgc3RhdHVzKSB7XHJcblx0Q29tcG9uZW50RXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlIHx8ICdUaGVyZSBpcyBzb21lIGVycm9yIG9uIHRoZSBzZXJ2ZXIgc2lkZScsIHN0YXR1cyk7XHJcblx0dGhpcy5uYW1lID0gXCJTZXJ2ZXJFcnJvclwiO1xyXG59XHJcblNlcnZlckVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29tcG9uZW50RXJyb3IucHJvdG90eXBlKTtcclxuU2VydmVyRXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2VydmVyRXJyb3I7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRDb21wb25lbnRFcnJvcixcclxuXHRDbGllbnRFcnJvcixcclxuICAgIEltYWdlTm90Rm91bmQsXHJcblx0U2VydmVyRXJyb3JcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2NvbXBvbmVudEVycm9ycy5qcyIsImxldCBTZXJ2ZXJFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5TZXJ2ZXJFcnJvcjtcclxubGV0IENsaWVudEVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLkNsaWVudEVycm9yO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYm9keU9iaiwgbWV0aG9kLCB1cmwsIGNiKSB7XHJcblxyXG5cclxuICAgIGxldCBib2R5ID0gJyc7XHJcbiAgICBpZiAoISh0eXBlb2YgYm9keU9iaiA9PT0gJ3N0cmluZycpKSB7XHJcbiAgICAgICAgZm9yIChsZXQga2V5IGluIGJvZHlPYmopIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgIGlmIChib2R5T2JqW2tleV0pXHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGtleSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCgodHlwZW9mIGJvZHlPYmpba2V5XSA9PT0gJ29iamVjdCcpID8gSlNPTi5zdHJpbmdpZnkoYm9keU9ialtrZXldKSA6IGJvZHlPYmpba2V5XSk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICAgICAgICAgIGJvZHkgKz0gKGJvZHkgPT09ICcnID8gJycgOiAnJicpICsgdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlXHJcbiAgICAgICAgYm9keSA9IGJvZHlPYmo7XHJcblxyXG5cclxuICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgIHhoci5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKTtcclxuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XHJcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIlgtUmVxdWVzdGVkLVdpdGhcIiwgXCJYTUxIdHRwUmVxdWVzdFwiKTtcclxuXHJcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgIT0gNCkgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgcmVzcG9uc2U7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnJlc3BvbnNlVGV4dClcclxuICAgICAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY2IobmV3IFNlcnZlckVycm9yKCdTZXJ2ZXIgaXMgbm90IHJlc3BvbmRpbmcnKSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCAzMDApXHJcbiAgICAgICAgICAgIGNiKG51bGwsIHJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDQwMCAmJiB0aGlzLnN0YXR1cyA8IDUwMClcclxuICAgICAgICAgICAgY2IobmV3IENsaWVudEVycm9yKHJlc3BvbnNlLm1lc3NhZ2UsIHJlc3BvbnNlLmRldGFpbCwgdGhpcy5zdGF0dXMpKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDUwMClcclxuICAgICAgICAgICAgY2IobmV3IFNlcnZlckVycm9yKHJlc3BvbnNlLm1lc3NhZ2UsIHRoaXMuc3RhdHVzKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnNvbGUubG9nKGBzZW5kaW5nIG5leHQgcmVxdWVzdDogJHtib2R5fWApO1xyXG4gICAgeGhyLnNlbmQoYm9keSk7XHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9zZW5kUmVxdWVzdC5qcyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ob21lL3N0eWxlLmxlc3Ncbi8vIG1vZHVsZSBpZCA9IDQxXG4vLyBtb2R1bGUgY2h1bmtzID0gNiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUlBO0FBRUE7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNuSkE7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQy9DQTs7OzsiLCJzb3VyY2VSb290IjoiIn0=