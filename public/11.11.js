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

/***/ 40:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var SwitchButton = __webpack_require__(31);
	var getCorrectNounForm = __webpack_require__(32);

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

/***/ })

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTEuMTEuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvc2VuZFJlcXVlc3QuanM/OGEyNyoiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9zd2l0Y2gtYnV0dG9uL2luZGV4LmpzP2FhODYqKiIsIndlYnBhY2s6Ly8vRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvZ2V0Q29ycmVjdE5vdW5Gb3JtLmpzPzg4MzYqKiIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL3N1YnNjcmliZS1idXR0b24vaW5kZXguanM/YzJiMSJdLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgU2VydmVyRXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuU2VydmVyRXJyb3I7XHJcbmxldCBDbGllbnRFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5DbGllbnRFcnJvcjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJvZHlPYmosIG1ldGhvZCwgdXJsLCBjYikge1xyXG5cclxuXHJcbiAgICBsZXQgYm9keSA9ICcnO1xyXG4gICAgaWYgKCEodHlwZW9mIGJvZHlPYmogPT09ICdzdHJpbmcnKSkge1xyXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBib2R5T2JqKSB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICBpZiAoYm9keU9ialtrZXldKVxyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBrZXkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoKHR5cGVvZiBib2R5T2JqW2tleV0gPT09ICdvYmplY3QnKSA/IEpTT04uc3RyaW5naWZ5KGJvZHlPYmpba2V5XSkgOiBib2R5T2JqW2tleV0pO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAgICAgICAgICBib2R5ICs9IChib2R5ID09PSAnJyA/ICcnIDogJyYnKSArIHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZVxyXG4gICAgICAgIGJvZHkgPSBib2R5T2JqO1xyXG5cclxuXHJcbiAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICB4aHIub3BlbihtZXRob2QsIHVybCwgdHJ1ZSk7XHJcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xyXG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJYLVJlcXVlc3RlZC1XaXRoXCIsIFwiWE1MSHR0cFJlcXVlc3RcIik7XHJcblxyXG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlICE9IDQpIHJldHVybjtcclxuXHJcbiAgICAgICAgbGV0IHJlc3BvbnNlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5yZXNwb25zZVRleHQpXHJcbiAgICAgICAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNiKG5ldyBTZXJ2ZXJFcnJvcignU2VydmVyIGlzIG5vdCByZXNwb25kaW5nJykpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwKVxyXG4gICAgICAgICAgICBjYihudWxsLCByZXNwb25zZSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSA0MDAgJiYgdGhpcy5zdGF0dXMgPCA1MDApXHJcbiAgICAgICAgICAgIGNiKG5ldyBDbGllbnRFcnJvcihyZXNwb25zZS5tZXNzYWdlLCByZXNwb25zZS5kZXRhaWwsIHRoaXMuc3RhdHVzKSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSA1MDApXHJcbiAgICAgICAgICAgIGNiKG5ldyBTZXJ2ZXJFcnJvcihyZXNwb25zZS5tZXNzYWdlLCB0aGlzLnN0YXR1cykpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhgc2VuZGluZyBuZXh0IHJlcXVlc3Q6ICR7Ym9keX1gKTtcclxuICAgIHhoci5zZW5kKGJvZHkpO1xyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvc2VuZFJlcXVlc3QuanMiLCJsZXQgZXZlbnRNaXhpbiA9IHJlcXVpcmUoTElCUyArICdldmVudE1peGluJyk7XHJcblxyXG5sZXQgU3dpdGNoQnV0dG9uID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuZWxlbSA9IG9wdGlvbnMuZWxlbTtcclxuICAgIHRoaXMuZGF0YSA9IG9wdGlvbnMuZGF0YTtcclxuICAgIHRoaXMuZGF0YVN0ciA9IG9wdGlvbnMuZGF0YVN0ciB8fCAnaW1hZ2VJZCc7XHJcblxyXG4gICAgdGhpcy5hY3RpdmVUZXh0ID0gb3B0aW9ucy5hY3RpdmVUZXh0O1xyXG4gICAgdGhpcy5pbmFjdGl2ZVRleHQgPSBvcHRpb25zLmluYWN0aXZlVGV4dDtcclxuICAgIHRoaXMudGV4dEVsZW0gPSBvcHRpb25zLnRleHRFbGVtIHx8IHRoaXMuZWxlbTtcclxuXHJcbiAgICBTd2l0Y2hCdXR0b24ucHJvdG90eXBlLnNldC5jYWxsKHRoaXMsIHthY3RpdmU6ICEhdGhpcy5lbGVtLmRhdGFzZXQuYWN0aXZlfSk7XHJcbiAgICBjb25zb2xlLmxvZygnc3dpdGNoIGJ1dHRvbiBhY3RpdmU6JywgISF0aGlzLmVsZW0uZGF0YXNldC5hY3RpdmUpO1xyXG4gICAgdGhpcy5hdmFpbGFibGUgPSB0cnVlO1xyXG5cclxuICAgIHRoaXMuZWxlbS5vbmNsaWNrID0gZSA9PiB0aGlzLm9uQ2xpY2soZSk7XHJcbn07XHJcblxyXG5Td2l0Y2hCdXR0b24ucHJvdG90eXBlLm9uQ2xpY2sgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgbGV0IGludm9sdmVkRGF0YSA9IHRoaXMuZGF0YTtcclxuXHJcbiAgICBpZiAodGhpcy5hdmFpbGFibGUpIHtcclxuXHJcbiAgICAgICAgdGhpcy5hdmFpbGFibGUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnRvZ2dsZSgpO1xyXG5cclxuICAgICAgICByZXF1aXJlKExJQlMgKyAnc2VuZFJlcXVlc3QnKSh7XHJcbiAgICAgICAgICAgIFt0aGlzLmRhdGFTdHJdOiBpbnZvbHZlZERhdGFcclxuICAgICAgICB9LCAnUE9TVCcsIHRoaXMudXJsLCAoZXJyLCByZXNwb25zZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKCFlcnIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldChyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmF2YWlsYWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ3N3aXRjaC1idXR0b25fY2hhbmdlZCcsIHtcclxuICAgICAgICAgICAgICAgICAgICBbdGhpcy5kYXRhU3RyXTogaW52b2x2ZWREYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhID09PSBpbnZvbHZlZERhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmF2YWlsYWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b2dnbGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcblN3aXRjaEJ1dHRvbi5zZXRSZWxhdGlvbiA9IGZ1bmN0aW9uIChzd2l0Y2hCdXR0b24xLCBzd2l0Y2hCdXR0b24yKSB7XHJcbiAgICBzd2l0Y2hCdXR0b24xLm9uKCdzd2l0Y2gtYnV0dG9uX2NoYW5nZWQnLCBlID0+IHtcclxuICAgICAgICBzd2l0Y2hCdXR0b24yLnNldChlLmRldGFpbC5yZXNwb25zZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBzd2l0Y2hCdXR0b24yLm9uKCdzd2l0Y2gtYnV0dG9uX2NoYW5nZWQnLCBlID0+IHtcclxuICAgICAgICBzd2l0Y2hCdXR0b24xLnNldChlLmRldGFpbC5yZXNwb25zZSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcblN3aXRjaEJ1dHRvbi5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIGlmIChvcHRpb25zLmFjdGl2ZSlcclxuICAgICAgICB0aGlzLl9hY3RpdmF0ZSgpO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHRoaXMuX2RlYWN0aXZhdGUoKTtcclxufTtcclxuXHJcblN3aXRjaEJ1dHRvbi5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuYWN0aXZlKVxyXG4gICAgICAgIHRoaXMuc2V0KHthY3RpdmU6IGZhbHNlfSk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5zZXQoe2FjdGl2ZTogdHJ1ZX0pO1xyXG59O1xyXG5cclxuU3dpdGNoQnV0dG9uLnByb3RvdHlwZS5fYWN0aXZhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnYnV0dG9uX2FjdGl2ZScpO1xyXG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xyXG59O1xyXG5cclxuU3dpdGNoQnV0dG9uLnByb3RvdHlwZS5fZGVhY3RpdmF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdidXR0b25fYWN0aXZlJyk7XHJcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG59O1xyXG5cclxuU3dpdGNoQnV0dG9uLnByb3RvdHlwZS5zZXRJbWFnZUlkID0gZnVuY3Rpb24gKGltYWdlSWQpIHtcclxuICAgIHRoaXMuZGF0YSA9IGltYWdlSWQ7XHJcbn07XHJcblxyXG5mb3IgKGxldCBrZXkgaW4gZXZlbnRNaXhpbilcclxuICAgIFN3aXRjaEJ1dHRvbi5wcm90b3R5cGVba2V5XSA9IGV2ZW50TWl4aW5ba2V5XTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3dpdGNoQnV0dG9uO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3Mvc3dpdGNoLWJ1dHRvbi9pbmRleC5qcyIsImxldCBnZXRDb3JyZWN0Tm91bkZvcm0gPSBmdW5jdGlvbiAoc2luZ2xlRm9ybSwgYW1vdW50KSB7XHJcbiAgICByZXR1cm4gc2luZ2xlRm9ybSArICgoYW1vdW50ID09PSAxKSA/ICcnIDogJ3MnKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZ2V0Q29ycmVjdE5vdW5Gb3JtO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9nZXRDb3JyZWN0Tm91bkZvcm0uanMiLCJsZXQgU3dpdGNoQnV0dG9uID0gcmVxdWlyZShCTE9DS1MgKyAnc3dpdGNoLWJ1dHRvbicpO1xyXG5sZXQgZ2V0Q29ycmVjdE5vdW5Gb3JtID0gcmVxdWlyZShMSUJTICsgJ2dldENvcnJlY3ROb3VuRm9ybScpO1xyXG5cclxubGV0IFN1YnNjcmliZUJ1dHRvbiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBTd2l0Y2hCdXR0b24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHJcbiAgICB0aGlzLm91dGVyU3RhdEVsZW0gPSBvcHRpb25zLm91dGVyU3RhdEVsZW07XHJcblxyXG4gICAgdGhpcy5jb3VudGVyRWxlbSA9IHRoaXMub3V0ZXJTdGF0RWxlbSAmJiB0aGlzLm91dGVyU3RhdEVsZW0ucXVlcnlTZWxlY3RvcignLnN0YXRfX251bWJlcicpO1xyXG4gICAgdGhpcy5jb3VudGVyRGVzaWduYXRpb25FbGVtID0gdGhpcy5vdXRlclN0YXRFbGVtICYmIHRoaXMub3V0ZXJTdGF0RWxlbS5xdWVyeVNlbGVjdG9yKCcuc3RhdF9fY2FwdGlvbicpO1xyXG5cclxuICAgIHRoaXMuc3Vic2NyaWJlcnNBbW91bnQgPSAwO1xyXG4gICAgaWYgKHRoaXMuY291bnRlckVsZW0pXHJcbiAgICAgICAgdGhpcy5zdWJzY3JpYmVyc0Ftb3VudCA9ICt0aGlzLmNvdW50ZXJFbGVtLnRleHRDb250ZW50O1xyXG5cclxuICAgIHRoaXMudXJsID0gJy9zdWJzY3JpYmUnO1xyXG59O1xyXG5TdWJzY3JpYmVCdXR0b24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShTd2l0Y2hCdXR0b24ucHJvdG90eXBlKTtcclxuU3Vic2NyaWJlQnV0dG9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFN1YnNjcmliZUJ1dHRvbjtcclxuXHJcblN1YnNjcmliZUJ1dHRvbi5wcm90b3R5cGUuc2V0QW1vdW50ID0gZnVuY3Rpb24gKHN1YnNjcmliZXJzQW1vdW50KSB7XHJcbiAgICB0aGlzLnN1YnNjcmliZXJzQW1vdW50ID0gc3Vic2NyaWJlcnNBbW91bnQ7XHJcbiAgICBpZiAodGhpcy5jb3VudGVyRWxlbSlcclxuICAgICAgICB0aGlzLmNvdW50ZXJFbGVtLnRleHRDb250ZW50ID0gc3Vic2NyaWJlcnNBbW91bnQ7XHJcblxyXG4gICAgaWYgKHRoaXMuY291bnRlckRlc2lnbmF0aW9uRWxlbSlcclxuICAgICAgICB0aGlzLmNvdW50ZXJEZXNpZ25hdGlvbkVsZW0udGV4dENvbnRlbnQgPSBnZXRDb3JyZWN0Tm91bkZvcm0oJ3N1YnNjcmliZXInLCBzdWJzY3JpYmVyc0Ftb3VudCk7XHJcbn07XHJcblxyXG5TdWJzY3JpYmVCdXR0b24ucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLnNldEFtb3VudChvcHRpb25zLnN1YnNjcmliZXJzQW1vdW50KTtcclxuICAgIFN3aXRjaEJ1dHRvbi5wcm90b3R5cGUuc2V0LmNhbGwodGhpcywgb3B0aW9ucyk7XHJcbn07XHJcblxyXG5TdWJzY3JpYmVCdXR0b24ucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLmFjdGl2ZSlcclxuICAgICAgICB0aGlzLnNldCh7YWN0aXZlOiBmYWxzZSwgc3Vic2NyaWJlcnNBbW91bnQ6IHRoaXMuc3Vic2NyaWJlcnNBbW91bnQgLSAxfSk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5zZXQoe2FjdGl2ZTogdHJ1ZSwgc3Vic2NyaWJlcnNBbW91bnQ6IHRoaXMuc3Vic2NyaWJlcnNBbW91bnQgKyAxfSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFN1YnNjcmliZUJ1dHRvbjtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9zdWJzY3JpYmUtYnV0dG9uL2luZGV4LmpzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDL0NBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTs7O0FBRUE7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTs7Ozs7Ozs7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTs7Ozs7Iiwic291cmNlUm9vdCI6IiJ9