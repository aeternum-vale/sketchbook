webpackJsonp([6],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	__webpack_require__(48);

	var GlobalErrorHandler = __webpack_require__(21);
	var globalErrorHandler = new GlobalErrorHandler();
	var ClientError = __webpack_require__(22).ClientError;
	var subscribeButtonsArray = [];
	var SubscribeButton = undefined;

	if (window.isLogged) {

	    __webpack_require__.e/* nsure */(7, function (require) {
	        var Dropdown = __webpack_require__(35);

	        var userMenuDropdown = new Dropdown({
	            elem: document.getElementById('user-menu'),
	            className: 'header-element'
	        });

	        var subscribeButtonElemsArray = document.getElementsByClassName('cutaway__subscribe-button');

	        SubscribeButton = __webpack_require__(47);

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

	    __webpack_require__(32)({
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

/***/ 48:
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL2hvbWUvc2NyaXB0LmpzIiwid2VicGFjazovLy9EOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9jb21wb25lbnRFcnJvcnMuanM/YWNiNSoqIiwid2VicGFjazovLy9EOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9zZW5kUmVxdWVzdC5qcz84YTI3KiIsIndlYnBhY2s6Ly8vLi9ob21lL3N0eWxlLmxlc3MiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgJy4vc3R5bGUubGVzcyc7XHJcblxyXG5sZXQgR2xvYmFsRXJyb3JIYW5kbGVyID0gcmVxdWlyZShCTE9DS1MgKyAnZ2xvYmFsLWVycm9yLWhhbmRsZXInKTtcclxubGV0IGdsb2JhbEVycm9ySGFuZGxlciA9IG5ldyBHbG9iYWxFcnJvckhhbmRsZXIoKTtcclxubGV0IENsaWVudEVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLkNsaWVudEVycm9yO1xyXG5sZXQgc3Vic2NyaWJlQnV0dG9uc0FycmF5ID0gW107XHJcbmxldCBTdWJzY3JpYmVCdXR0b247XHJcblxyXG5pZiAod2luZG93LmlzTG9nZ2VkKSB7XHJcblxyXG4gICAgcmVxdWlyZS5lbnN1cmUoW0JMT0NLUyArICdkcm9wZG93bicsIEJMT0NLUyArICdzdWJzY3JpYmUtYnV0dG9uJ10sIGZ1bmN0aW9uIChyZXF1aXJlKSB7XHJcbiAgICAgICAgbGV0IERyb3Bkb3duID0gcmVxdWlyZShCTE9DS1MgKyAnZHJvcGRvd24nKTtcclxuXHJcbiAgICAgICAgbGV0IHVzZXJNZW51RHJvcGRvd24gPSBuZXcgRHJvcGRvd24oe1xyXG4gICAgICAgICAgICBlbGVtOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlci1tZW51JyksXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2hlYWRlci1lbGVtZW50J1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgc3Vic2NyaWJlQnV0dG9uRWxlbXNBcnJheSA9IGRvY3VtZW50XHJcbiAgICAgICAgICAgIC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjdXRhd2F5X19zdWJzY3JpYmUtYnV0dG9uJyk7XHJcblxyXG5cclxuICAgICAgICBTdWJzY3JpYmVCdXR0b24gPSByZXF1aXJlKEJMT0NLUyArICdzdWJzY3JpYmUtYnV0dG9uJyk7XHJcblxyXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoc3Vic2NyaWJlQnV0dG9uRWxlbXNBcnJheSwgYnV0dG9uID0+IHtcclxuICAgICAgICAgICAgc3Vic2NyaWJlQnV0dG9uc0FycmF5LnB1c2gobmV3IFN1YnNjcmliZUJ1dHRvbih7XHJcbiAgICAgICAgICAgICAgICBlbGVtOiBidXR0b24sXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBidXR0b24uZGF0YXNldC51c2VybmFtZSxcclxuICAgICAgICAgICAgICAgIGRhdGFTdHI6ICd1c2VybmFtZSdcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0gZWxzZSB7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoJy5jdXRhd2F5X19zdWJzY3JpYmUtYnV0dG9uJykpXHJcbiAgICAgICAgICAgIGdsb2JhbEVycm9ySGFuZGxlci5jYWxsKG5ldyBDbGllbnRFcnJvcihudWxsLCBudWxsLCA0MDEpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5sZXQgSG9tZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLmVsZW0gPSBvcHRpb25zLmVsZW07XHJcbiAgICB0aGlzLmN1dGF3YXlzV3JhcHBlciA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaG9tZV9fY3V0YXdheXMtd3JhcHBlcicpO1xyXG4gICAgdGhpcy5zcGlubmVyID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5ob21lX19zcGlubmVyJyk7XHJcbiAgICB0aGlzLmdob3N0Q3V0YXdheSA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuaG9tZV9fY3V0YXdheScpO1xyXG5cclxuICAgIHRoaXMuaXNBdmFpbGFibGUgPSB0cnVlO1xyXG4gICAgdGhpcy5yZXBvcnRlZEN1dGF3YXlzID0gQXJyYXkucHJvdG90eXBlLm1hcFxyXG4gICAgICAgIC5jYWxsKHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yQWxsKCcuaG9tZV9fY3V0YXdheScpLFxyXG4gICAgICAgICAgICBpdGVtID0+ICtpdGVtLmRhdGFzZXQudXNlcklkKTtcclxuXHJcbiAgICB0aGlzLm5vTW9yZUN1dGF3YXlzID0gIXRoaXMuZ2hvc3RDdXRhd2F5O1xyXG5cclxuICAgIHRoaXMudGltZXJJZCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICBpZiAoIXRoaXMubm9Nb3JlQ3V0YXdheXMpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNBdmFpbGFibGUpXHJcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5zY3JvbGxIZWlnaHQgPT09IGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0KVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0TmV3Q3V0YXdheSgpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMudGltZXJJZCk7XHJcbiAgICB9LCAzMDAwKTtcclxuXHJcblxyXG4gICAgd2luZG93Lm9uc2Nyb2xsID0gZSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNBdmFpbGFibGUgJiYgIXRoaXMubm9Nb3JlQ3V0YXdheXMpXHJcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5ib2R5LnNjcm9sbEhlaWdodCA9PT0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgK1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldE5ld0N1dGF3YXkoKTtcclxuICAgIH07XHJcblxyXG59O1xyXG5cclxuSG9tZS5wcm90b3R5cGUuZ2V0TmV3Q3V0YXdheSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuc3Bpbm5lci5jbGFzc0xpc3QucmVtb3ZlKCdzcGlubmVyX2ludmlzaWJsZScpO1xyXG4gICAgdGhpcy5pc0F2YWlsYWJsZSA9IGZhbHNlO1xyXG5cclxuICAgIHJlcXVpcmUoTElCUyArICdzZW5kUmVxdWVzdCcpKHtcclxuICAgICAgICAgICAgcmVwb3J0ZWRDdXRhd2F5czogdGhpcy5yZXBvcnRlZEN1dGF3YXlzXHJcbiAgICAgICAgfSwgJ1BPU1QnLCAnL2N1dGF3YXknLCAoZXJyLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBnbG9iYWxFcnJvckhhbmRsZXIuY2FsbChlcnIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygncmVzcG9uc2U6JywgcmVzcG9uc2UpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmlzTGFzdFNldCB8fCByZXNwb25zZS5jdXRhd2F5cy5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vTW9yZUN1dGF3YXlzID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHJlc3BvbnNlLmN1dGF3YXlzLmZvckVhY2goY3V0YXdheSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlcG9ydGVkQ3V0YXdheXMucHVzaChjdXRhd2F5LnVzZXIuX2lkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3V0YXdheXNXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZ2V0Q3V0YXdheUVsZW0oY3V0YXdheSkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgICAgICB0aGlzLnNwaW5uZXIuY2xhc3NMaXN0LmFkZCgnc3Bpbm5lcl9pbnZpc2libGUnKTtcclxuICAgICAgICAgICAgdGhpcy5pc0F2YWlsYWJsZSA9IHRydWU7XHJcblxyXG4gICAgICAgIH1cclxuICAgICk7XHJcblxyXG59O1xyXG5cclxuSG9tZS5wcm90b3R5cGUuZ2V0Q3V0YXdheUVsZW0gPSBmdW5jdGlvbiAoY3V0YXdheSkge1xyXG4gICAgbGV0IGN1dGF3YXlFbGVtID0gdGhpcy5naG9zdEN1dGF3YXkuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgY3V0YXdheUVsZW0uZGF0YXNldC51c2VySWQgPSBjdXRhd2F5LnVzZXIuX2lkO1xyXG4gICAgY3V0YXdheUVsZW0ucXVlcnlTZWxlY3RvcignLmN1dGF3YXlfX2hlYWRlci1sZWZ0LXNpZGUnKVxyXG4gICAgICAgIC5ocmVmID0gY3V0YXdheS51c2VyLnVybDtcclxuICAgIGN1dGF3YXlFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5jdXRhd2F5X191c2VybmFtZScpXHJcbiAgICAgICAgLnRleHRDb250ZW50ID0gY3V0YXdheS51c2VyLnVzZXJuYW1lO1xyXG4gICAgY3V0YXdheUVsZW0ucXVlcnlTZWxlY3RvcignLmN1dGF3YXlfX2F2YXRhcicpXHJcbiAgICAgICAgLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJyR7Y3V0YXdheS51c2VyLmF2YXRhclVybHMubWVkaXVtfScpYDtcclxuXHJcbiAgICBsZXQgc3Vic2NyaWJlQnV0dG9uID0gY3V0YXdheUVsZW0ucXVlcnlTZWxlY3RvcignLmN1dGF3YXlfX3N1YnNjcmliZS1idXR0b24nKTtcclxuXHJcbiAgICBzdWJzY3JpYmVCdXR0b24uZGF0YXNldC51c2VybmFtZSA9IGN1dGF3YXkudXNlci51c2VybmFtZTtcclxuXHJcbiAgICBjb25zb2xlLmxvZygnaXNOYXJyYXRvcicsIGN1dGF3YXkudXNlci5pc05hcnJhdG9yKTtcclxuICAgIGlmIChjdXRhd2F5LnVzZXIuaXNOYXJyYXRvcilcclxuICAgICAgICBzdWJzY3JpYmVCdXR0b24uZGF0YXNldC5hY3RpdmUgPSAndHJ1ZSc7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgc3Vic2NyaWJlQnV0dG9uLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1hY3RpdmUnKTtcclxuXHJcbiAgICBpZiAoU3Vic2NyaWJlQnV0dG9uKVxyXG4gICAgICAgIHN1YnNjcmliZUJ1dHRvbnNBcnJheS5wdXNoKG5ldyBTdWJzY3JpYmVCdXR0b24oe1xyXG4gICAgICAgICAgICBlbGVtOiBzdWJzY3JpYmVCdXR0b24sXHJcbiAgICAgICAgICAgIGRhdGE6IGN1dGF3YXkudXNlci51c2VybmFtZSxcclxuICAgICAgICAgICAgZGF0YVN0cjogJ3VzZXJuYW1lJ1xyXG4gICAgICAgIH0pKTtcclxuXHJcbiAgICBsZXQgY3V0YXdheVRvcCA9IGN1dGF3YXlFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5jdXRhd2F5X190b3AnKTtcclxuICAgIGxldCBjdXRhd2F5Qm90dG9tID0gY3V0YXdheUVsZW0ucXVlcnlTZWxlY3RvcignLmN1dGF3YXlfX2JvdHRvbScpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3V0YXdheVRvcC5jaGlsZHJlbi5sZW5ndGg7IGkrKylcclxuICAgICAgICBjdXRhd2F5VG9wLmNoaWxkcmVuW2ldLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9XHJcbiAgICAgICAgICAgIGB1cmwoJyR7Y3V0YXdheS5pbWFnZXNUb3BbaV0ucHJldmlld1VybH0nKWA7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXRhd2F5Qm90dG9tLmNoaWxkcmVuLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGN1dGF3YXlCb3R0b20uY2hpbGRyZW5baV0uc3R5bGUuYmFja2dyb3VuZEltYWdlID1cclxuICAgICAgICAgICAgYHVybCgnJHtjdXRhd2F5LmltYWdlc0JvdHRvbVtpXS5wcmV2aWV3VXJsfScpYDtcclxuXHJcbiAgICByZXR1cm4gY3V0YXdheUVsZW07XHJcblxyXG59O1xyXG5cclxubGV0IGhvbWUgPSBuZXcgSG9tZSh7XHJcbiAgICBlbGVtOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG9tZScpXHJcbn0pO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9ob21lL3NjcmlwdC5qcyIsImZ1bmN0aW9uIEN1c3RvbUVycm9yKG1lc3NhZ2UpIHtcclxuXHR0aGlzLm5hbWUgPSBcIkN1c3RvbUVycm9yXCI7XHJcblx0dGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuXHJcblx0aWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKVxyXG5cdFx0RXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgQ3VzdG9tRXJyb3IpO1xyXG5cdGVsc2VcclxuXHRcdHRoaXMuc3RhY2sgPSAobmV3IEVycm9yKCkpLnN0YWNrO1xyXG59XHJcbkN1c3RvbUVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcclxuQ3VzdG9tRXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ3VzdG9tRXJyb3I7XHJcblxyXG5cclxuZnVuY3Rpb24gQ29tcG9uZW50RXJyb3IobWVzc2FnZSwgc3RhdHVzKSB7XHJcblx0Q3VzdG9tRXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlIHx8ICdBbiBlcnJvciBoYXMgb2NjdXJyZWQnICk7XHJcblx0dGhpcy5uYW1lID0gXCJDb21wb25lbnRFcnJvclwiO1xyXG5cdHRoaXMuc3RhdHVzID0gc3RhdHVzO1xyXG59XHJcbkNvbXBvbmVudEVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ3VzdG9tRXJyb3IucHJvdG90eXBlKTtcclxuQ29tcG9uZW50RXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ29tcG9uZW50RXJyb3I7XHJcblxyXG5mdW5jdGlvbiBDbGllbnRFcnJvcihtZXNzYWdlLCBkZXRhaWwsIHN0YXR1cykge1xyXG5cdENvbXBvbmVudEVycm9yLmNhbGwodGhpcywgbWVzc2FnZSB8fCAnQW4gZXJyb3IgaGFzIG9jY3VycmVkLiBDaGVjayBpZiBqYXZhc2NyaXB0IGlzIGVuYWJsZWQnLCBzdGF0dXMpO1xyXG5cdHRoaXMubmFtZSA9IFwiQ2xpZW50RXJyb3JcIjtcclxuXHR0aGlzLmRldGFpbCA9IGRldGFpbDtcclxufVxyXG5DbGllbnRFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbXBvbmVudEVycm9yLnByb3RvdHlwZSk7XHJcbkNsaWVudEVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENsaWVudEVycm9yO1xyXG5cclxuXHJcbmZ1bmN0aW9uIEltYWdlTm90Rm91bmQobWVzc2FnZSkge1xyXG4gICAgQ2xpZW50RXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlIHx8ICdJbWFnZSBub3QgZm91bmQuIEl0IHByb2JhYmx5IGhhcyBiZWVuIHJlbW92ZWQnLCBudWxsLCA0MDQpO1xyXG4gICAgdGhpcy5uYW1lID0gXCJJbWFnZU5vdEZvdW5kXCI7XHJcbn1cclxuSW1hZ2VOb3RGb3VuZC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENsaWVudEVycm9yLnByb3RvdHlwZSk7XHJcbkltYWdlTm90Rm91bmQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gSW1hZ2VOb3RGb3VuZDtcclxuXHJcbmZ1bmN0aW9uIFNlcnZlckVycm9yKG1lc3NhZ2UsIHN0YXR1cykge1xyXG5cdENvbXBvbmVudEVycm9yLmNhbGwodGhpcywgbWVzc2FnZSB8fCAnVGhlcmUgaXMgc29tZSBlcnJvciBvbiB0aGUgc2VydmVyIHNpZGUnLCBzdGF0dXMpO1xyXG5cdHRoaXMubmFtZSA9IFwiU2VydmVyRXJyb3JcIjtcclxufVxyXG5TZXJ2ZXJFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbXBvbmVudEVycm9yLnByb3RvdHlwZSk7XHJcblNlcnZlckVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNlcnZlckVycm9yO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0Q29tcG9uZW50RXJyb3IsXHJcblx0Q2xpZW50RXJyb3IsXHJcbiAgICBJbWFnZU5vdEZvdW5kLFxyXG5cdFNlcnZlckVycm9yXHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9jb21wb25lbnRFcnJvcnMuanMiLCJsZXQgU2VydmVyRXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuU2VydmVyRXJyb3I7XHJcbmxldCBDbGllbnRFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5DbGllbnRFcnJvcjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJvZHlPYmosIG1ldGhvZCwgdXJsLCBjYikge1xyXG5cclxuXHJcbiAgICBsZXQgYm9keSA9ICcnO1xyXG4gICAgaWYgKCEodHlwZW9mIGJvZHlPYmogPT09ICdzdHJpbmcnKSkge1xyXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBib2R5T2JqKSB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICBpZiAoYm9keU9ialtrZXldKVxyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBrZXkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoKHR5cGVvZiBib2R5T2JqW2tleV0gPT09ICdvYmplY3QnKSA/IEpTT04uc3RyaW5naWZ5KGJvZHlPYmpba2V5XSkgOiBib2R5T2JqW2tleV0pO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAgICAgICAgICBib2R5ICs9IChib2R5ID09PSAnJyA/ICcnIDogJyYnKSArIHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZVxyXG4gICAgICAgIGJvZHkgPSBib2R5T2JqO1xyXG5cclxuXHJcbiAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICB4aHIub3BlbihtZXRob2QsIHVybCwgdHJ1ZSk7XHJcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xyXG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJYLVJlcXVlc3RlZC1XaXRoXCIsIFwiWE1MSHR0cFJlcXVlc3RcIik7XHJcblxyXG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlICE9IDQpIHJldHVybjtcclxuXHJcbiAgICAgICAgbGV0IHJlc3BvbnNlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5yZXNwb25zZVRleHQpXHJcbiAgICAgICAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNiKG5ldyBTZXJ2ZXJFcnJvcignU2VydmVyIGlzIG5vdCByZXNwb25kaW5nJykpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwKVxyXG4gICAgICAgICAgICBjYihudWxsLCByZXNwb25zZSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSA0MDAgJiYgdGhpcy5zdGF0dXMgPCA1MDApXHJcbiAgICAgICAgICAgIGNiKG5ldyBDbGllbnRFcnJvcihyZXNwb25zZS5tZXNzYWdlLCByZXNwb25zZS5kZXRhaWwsIHRoaXMuc3RhdHVzKSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSA1MDApXHJcbiAgICAgICAgICAgIGNiKG5ldyBTZXJ2ZXJFcnJvcihyZXNwb25zZS5tZXNzYWdlLCB0aGlzLnN0YXR1cykpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhgc2VuZGluZyBuZXh0IHJlcXVlc3Q6ICR7Ym9keX1gKTtcclxuICAgIHhoci5zZW5kKGJvZHkpO1xyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvc2VuZFJlcXVlc3QuanMiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vaG9tZS9zdHlsZS5sZXNzXG4vLyBtb2R1bGUgaWQgPSA0OFxuLy8gbW9kdWxlIGNodW5rcyA9IDYiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBSUE7QUFFQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ25KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDL0NBOzs7OyIsInNvdXJjZVJvb3QiOiIifQ==