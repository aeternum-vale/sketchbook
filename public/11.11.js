webpackJsonp([11,5],{

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

/***/ 39:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var SwitchButton = __webpack_require__(31);
	var getCorrectNounForm = __webpack_require__(57);

	var SubscribeButton = function SubscribeButton(options) {
	    SwitchButton.apply(this, arguments);

	    this.outerStatElem = options.outerStatElem;

	    this.counterElem = this.outerStatElem && this.outerStatElem.querySelector('.stat__number');
	    this.counterDesignationElem = this.outerStatElem && this.outerStatElem.querySelector('.stat__caption');

	    this.subscribersAmount = 0;
	    if (this.counterElem) this.subscribersAmount = +this.counterElem.textContent;

	    this.url = '/subscribe';
	};
	SubscribeButton.prototype = Object.create(SwitchButton.prototype);
	SubscribeButton.prototype.constructor = SubscribeButton;

	SubscribeButton.prototype.setAmount = function (subscribersAmount) {
	    this.subscribersAmount = subscribersAmount;
	    if (this.counterElem) this.counterElem.textContent = subscribersAmount;

	    if (this.counterDesignationElem) this.counterDesignationElem.textContent = getCorrectNounForm('subscriber', subscribersAmount);
	};

	SubscribeButton.prototype.set = function (options) {
	    this.setAmount(options.subscribersAmount);
	    SwitchButton.prototype.set.call(this, options);
	};

	SubscribeButton.prototype.toggle = function () {
	    if (this.active) this.set({ active: false, subscribersAmount: this.subscribersAmount - 1 });else this.set({ active: true, subscribersAmount: this.subscribersAmount + 1 });
	};

	module.exports = SubscribeButton;

/***/ }),

/***/ 57:
/***/ (function(module, exports) {

	'use strict';

	var getCorrectNounForm = function getCorrectNounForm(singleForm, amount) {
	    return singleForm + (amount === 1 ? '' : 's');
	};

	module.exports = getCorrectNounForm;

/***/ })

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTEuMTEuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvc2VuZFJlcXVlc3QuanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9zd2l0Y2gtYnV0dG9uL2luZGV4LmpzP2FhODYiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9zdWJzY3JpYmUtYnV0dG9uL2luZGV4LmpzP2MyYjEqIiwid2VicGFjazovLy9EOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9nZXRDb3JyZWN0Tm91bkZvcm0uanM/ODgzNioiXSwic291cmNlc0NvbnRlbnQiOlsibGV0IFNlcnZlckVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLlNlcnZlckVycm9yO1xyXG5sZXQgQ2xpZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ2xpZW50RXJyb3I7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChib2R5T2JqLCBtZXRob2QsIHVybCwgY2IpIHtcclxuXHJcblxyXG4gICAgbGV0IGJvZHkgPSAnJztcclxuICAgIGlmICghKHR5cGVvZiBib2R5T2JqID09PSAnc3RyaW5nJykpIHtcclxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gYm9keU9iaikge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSAnJztcclxuICAgICAgICAgICAgaWYgKGJvZHlPYmpba2V5XSlcclxuICAgICAgICAgICAgICAgIHZhbHVlID0ga2V5ICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KCh0eXBlb2YgYm9keU9ialtrZXldID09PSAnb2JqZWN0JykgPyBKU09OLnN0cmluZ2lmeShib2R5T2JqW2tleV0pIDogYm9keU9ialtrZXldKTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgYm9keSArPSAoYm9keSA9PT0gJycgPyAnJyA6ICcmJykgKyB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2VcclxuICAgICAgICBib2R5ID0gYm9keU9iajtcclxuXHJcblxyXG4gICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgeGhyLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xyXG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcclxuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiWC1SZXF1ZXN0ZWQtV2l0aFwiLCBcIlhNTEh0dHBSZXF1ZXN0XCIpO1xyXG5cclxuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSAhPSA0KSByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCByZXNwb25zZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucmVzcG9uc2VUZXh0KVxyXG4gICAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjYihuZXcgU2VydmVyRXJyb3IoJ1NlcnZlciBpcyBub3QgcmVzcG9uZGluZycpKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMClcclxuICAgICAgICAgICAgY2IobnVsbCwgcmVzcG9uc2UpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPj0gNDAwICYmIHRoaXMuc3RhdHVzIDwgNTAwKVxyXG4gICAgICAgICAgICBjYihuZXcgQ2xpZW50RXJyb3IocmVzcG9uc2UubWVzc2FnZSwgcmVzcG9uc2UuZGV0YWlsLCB0aGlzLnN0YXR1cykpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPj0gNTAwKVxyXG4gICAgICAgICAgICBjYihuZXcgU2VydmVyRXJyb3IocmVzcG9uc2UubWVzc2FnZSwgdGhpcy5zdGF0dXMpKTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc29sZS5sb2coYHNlbmRpbmcgbmV4dCByZXF1ZXN0OiAke2JvZHl9YCk7XHJcbiAgICB4aHIuc2VuZChib2R5KTtcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL3NlbmRSZXF1ZXN0LmpzIiwibGV0IGV2ZW50TWl4aW4gPSByZXF1aXJlKExJQlMgKyAnZXZlbnRNaXhpbicpO1xyXG5cclxubGV0IFN3aXRjaEJ1dHRvbiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLmVsZW0gPSBvcHRpb25zLmVsZW07XHJcbiAgICB0aGlzLmRhdGEgPSBvcHRpb25zLmRhdGE7XHJcbiAgICB0aGlzLmRhdGFTdHIgPSBvcHRpb25zLmRhdGFTdHIgfHwgJ2ltYWdlSWQnO1xyXG5cclxuICAgIFN3aXRjaEJ1dHRvbi5wcm90b3R5cGUuc2V0LmNhbGwodGhpcywge2FjdGl2ZTogISF0aGlzLmVsZW0uZGF0YXNldC5hY3RpdmV9KTtcclxuICAgIGNvbnNvbGUubG9nKCdzd2l0Y2ggYnV0dG9uIGFjdGl2ZTonLCAhIXRoaXMuZWxlbS5kYXRhc2V0LmFjdGl2ZSk7XHJcbiAgICB0aGlzLmF2YWlsYWJsZSA9IHRydWU7XHJcblxyXG4gICAgdGhpcy5lbGVtLm9uY2xpY2sgPSBlID0+IHRoaXMub25DbGljayhlKTtcclxufTtcclxuXHJcblN3aXRjaEJ1dHRvbi5wcm90b3R5cGUub25DbGljayA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIGxldCBpbnZvbHZlZERhdGEgPSB0aGlzLmRhdGE7XHJcblxyXG4gICAgaWYgKHRoaXMuYXZhaWxhYmxlKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYXZhaWxhYmxlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy50b2dnbGUoKTtcclxuXHJcbiAgICAgICAgcmVxdWlyZShMSUJTICsgJ3NlbmRSZXF1ZXN0Jykoe1xyXG4gICAgICAgICAgICBbdGhpcy5kYXRhU3RyXTogaW52b2x2ZWREYXRhXHJcbiAgICAgICAgfSwgJ1BPU1QnLCB0aGlzLnVybCwgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmICghZXJyKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXQocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCdzd2l0Y2gtYnV0dG9uX2NoYW5nZWQnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgW3RoaXMuZGF0YVN0cl06IGludm9sdmVkRGF0YSxcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yKGVycik7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSA9PT0gaW52b2x2ZWREYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5Td2l0Y2hCdXR0b24uc2V0UmVsYXRpb24gPSBmdW5jdGlvbiAoc3dpdGNoQnV0dG9uMSwgc3dpdGNoQnV0dG9uMikge1xyXG4gICAgc3dpdGNoQnV0dG9uMS5vbignc3dpdGNoLWJ1dHRvbl9jaGFuZ2VkJywgZSA9PiB7XHJcbiAgICAgICAgc3dpdGNoQnV0dG9uMi5zZXQoZS5kZXRhaWwucmVzcG9uc2UpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgc3dpdGNoQnV0dG9uMi5vbignc3dpdGNoLWJ1dHRvbl9jaGFuZ2VkJywgZSA9PiB7XHJcbiAgICAgICAgc3dpdGNoQnV0dG9uMS5zZXQoZS5kZXRhaWwucmVzcG9uc2UpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5Td2l0Y2hCdXR0b24ucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBpZiAob3B0aW9ucy5hY3RpdmUpXHJcbiAgICAgICAgdGhpcy5fYWN0aXZhdGUoKTtcclxuICAgIGVsc2VcclxuICAgICAgICB0aGlzLl9kZWFjdGl2YXRlKCk7XHJcbn07XHJcblxyXG5Td2l0Y2hCdXR0b24ucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLmFjdGl2ZSlcclxuICAgICAgICB0aGlzLnNldCh7YWN0aXZlOiBmYWxzZX0pO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHRoaXMuc2V0KHthY3RpdmU6IHRydWV9KTtcclxufTtcclxuXHJcblN3aXRjaEJ1dHRvbi5wcm90b3R5cGUuX2FjdGl2YXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ2J1dHRvbl9hY3RpdmUnKTtcclxuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcclxufTtcclxuXHJcblN3aXRjaEJ1dHRvbi5wcm90b3R5cGUuX2RlYWN0aXZhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnYnV0dG9uX2FjdGl2ZScpO1xyXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxufTtcclxuXHJcblN3aXRjaEJ1dHRvbi5wcm90b3R5cGUuc2V0SW1hZ2VJZCA9IGZ1bmN0aW9uIChpbWFnZUlkKSB7XHJcbiAgICB0aGlzLmRhdGEgPSBpbWFnZUlkO1xyXG59O1xyXG5cclxuZm9yIChsZXQga2V5IGluIGV2ZW50TWl4aW4pXHJcbiAgICBTd2l0Y2hCdXR0b24ucHJvdG90eXBlW2tleV0gPSBldmVudE1peGluW2tleV07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFN3aXRjaEJ1dHRvbjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL3N3aXRjaC1idXR0b24vaW5kZXguanMiLCJsZXQgU3dpdGNoQnV0dG9uID0gcmVxdWlyZShCTE9DS1MgKyAnc3dpdGNoLWJ1dHRvbicpO1xyXG5sZXQgZ2V0Q29ycmVjdE5vdW5Gb3JtID0gcmVxdWlyZShMSUJTICsgJ2dldENvcnJlY3ROb3VuRm9ybScpO1xyXG5cclxubGV0IFN1YnNjcmliZUJ1dHRvbiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBTd2l0Y2hCdXR0b24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHJcbiAgICB0aGlzLm91dGVyU3RhdEVsZW0gPSBvcHRpb25zLm91dGVyU3RhdEVsZW07XHJcblxyXG4gICAgdGhpcy5jb3VudGVyRWxlbSA9IHRoaXMub3V0ZXJTdGF0RWxlbSAmJiB0aGlzLm91dGVyU3RhdEVsZW0ucXVlcnlTZWxlY3RvcignLnN0YXRfX251bWJlcicpO1xyXG4gICAgdGhpcy5jb3VudGVyRGVzaWduYXRpb25FbGVtID0gdGhpcy5vdXRlclN0YXRFbGVtICYmIHRoaXMub3V0ZXJTdGF0RWxlbS5xdWVyeVNlbGVjdG9yKCcuc3RhdF9fY2FwdGlvbicpO1xyXG5cclxuICAgIHRoaXMuc3Vic2NyaWJlcnNBbW91bnQgPSAwO1xyXG4gICAgaWYgKHRoaXMuY291bnRlckVsZW0pXHJcbiAgICAgICAgdGhpcy5zdWJzY3JpYmVyc0Ftb3VudCA9ICt0aGlzLmNvdW50ZXJFbGVtLnRleHRDb250ZW50O1xyXG5cclxuICAgIHRoaXMudXJsID0gJy9zdWJzY3JpYmUnO1xyXG59O1xyXG5TdWJzY3JpYmVCdXR0b24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShTd2l0Y2hCdXR0b24ucHJvdG90eXBlKTtcclxuU3Vic2NyaWJlQnV0dG9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFN1YnNjcmliZUJ1dHRvbjtcclxuXHJcblN1YnNjcmliZUJ1dHRvbi5wcm90b3R5cGUuc2V0QW1vdW50ID0gZnVuY3Rpb24gKHN1YnNjcmliZXJzQW1vdW50KSB7XHJcbiAgICB0aGlzLnN1YnNjcmliZXJzQW1vdW50ID0gc3Vic2NyaWJlcnNBbW91bnQ7XHJcbiAgICBpZiAodGhpcy5jb3VudGVyRWxlbSlcclxuICAgICAgICB0aGlzLmNvdW50ZXJFbGVtLnRleHRDb250ZW50ID0gc3Vic2NyaWJlcnNBbW91bnQ7XHJcblxyXG4gICAgaWYgKHRoaXMuY291bnRlckRlc2lnbmF0aW9uRWxlbSlcclxuICAgICAgICB0aGlzLmNvdW50ZXJEZXNpZ25hdGlvbkVsZW0udGV4dENvbnRlbnQgPSBnZXRDb3JyZWN0Tm91bkZvcm0oJ3N1YnNjcmliZXInLCBzdWJzY3JpYmVyc0Ftb3VudCk7XHJcbn07XHJcblxyXG5TdWJzY3JpYmVCdXR0b24ucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLnNldEFtb3VudChvcHRpb25zLnN1YnNjcmliZXJzQW1vdW50KTtcclxuICAgIFN3aXRjaEJ1dHRvbi5wcm90b3R5cGUuc2V0LmNhbGwodGhpcywgb3B0aW9ucyk7XHJcbn07XHJcblxyXG5TdWJzY3JpYmVCdXR0b24ucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLmFjdGl2ZSlcclxuICAgICAgICB0aGlzLnNldCh7YWN0aXZlOiBmYWxzZSwgc3Vic2NyaWJlcnNBbW91bnQ6IHRoaXMuc3Vic2NyaWJlcnNBbW91bnQgLSAxfSk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5zZXQoe2FjdGl2ZTogdHJ1ZSwgc3Vic2NyaWJlcnNBbW91bnQ6IHRoaXMuc3Vic2NyaWJlcnNBbW91bnQgKyAxfSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFN1YnNjcmliZUJ1dHRvbjtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9zdWJzY3JpYmUtYnV0dG9uL2luZGV4LmpzIiwibGV0IGdldENvcnJlY3ROb3VuRm9ybSA9IGZ1bmN0aW9uIChzaW5nbGVGb3JtLCBhbW91bnQpIHtcclxuICAgIHJldHVybiBzaW5nbGVGb3JtICsgKChhbW91bnQgPT09IDEpID8gJycgOiAncycpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnZXRDb3JyZWN0Tm91bkZvcm07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2dldENvcnJlY3ROb3VuRm9ybS5qcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQy9DQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBOzs7QUFFQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBOzs7Ozs7Ozs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTs7Ozs7Ozs7OztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Iiwic291cmNlUm9vdCI6IiJ9