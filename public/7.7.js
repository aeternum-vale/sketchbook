webpackJsonp([7,5],{

/***/ 18:
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

/***/ 28:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNy43LmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2V2ZW50TWl4aW4uanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9kcm9wZG93bi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL3N3aXRjaC1idXR0b24vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9zdWJzY3JpYmUtYnV0dG9uL2luZGV4LmpzP2MyYjEiLCJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL2dldENvcnJlY3ROb3VuRm9ybS5qcz84ODM2Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuXHRvbjogZnVuY3Rpb24oZXZlbnROYW1lLCBjYikge1xyXG5cdFx0aWYgKHRoaXMuZWxlbSlcclxuXHRcdFx0dGhpcy5lbGVtLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYik7XHJcblx0XHRlbHNlXHJcblx0XHRcdHRoaXMubGlzdGVuZXJzLnB1c2goe1xyXG5cdFx0XHRcdGV2ZW50TmFtZSxcclxuXHRcdFx0XHRjYlxyXG5cdFx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHR0cmlnZ2VyOiBmdW5jdGlvbihldmVudE5hbWUsIGRldGFpbCkge1xyXG5cdFx0dGhpcy5lbGVtLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwge1xyXG5cdFx0XHRidWJibGVzOiB0cnVlLFxyXG5cdFx0XHRjYW5jZWxhYmxlOiB0cnVlLFxyXG5cdFx0XHRkZXRhaWw6IGRldGFpbFxyXG5cdFx0fSkpO1xyXG5cdH0sXHJcblxyXG5cdGVycm9yOiBmdW5jdGlvbihlcnIpIHtcclxuXHRcdHRoaXMuZWxlbS5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnZXJyb3InLCB7XHJcblx0XHRcdGJ1YmJsZXM6IHRydWUsXHJcblx0XHRcdGNhbmNlbGFibGU6IHRydWUsXHJcblx0XHRcdGRldGFpbDogZXJyXHJcblx0XHR9KSk7XHJcblx0fVxyXG5cclxuXHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9ldmVudE1peGluLmpzIiwibGV0IERyb3Bkb3duID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICB0aGlzLmVsZW0gPSBvcHRpb25zLmVsZW07XHJcbiAgICB0aGlzLml0ZW1MaXN0ID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5kcm9wZG93bl9faXRlbS1saXN0Jyk7XHJcbiAgICB0aGlzLmNsYXNzTmFtZSA9IG9wdGlvbnMuY2xhc3NOYW1lO1xyXG5cclxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XHJcblxyXG4gICAgLy8gdGhpcy5lbGVtLm9uY2xpY2sgPSBlID0+IHtcclxuICAgIC8vICAgICB0aGlzLnRvZ2dsZSgpO1xyXG4gICAgLy8gfTtcclxuXHJcbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5pdGVtTGlzdC5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZWxlbS5jb250YWlucyhlLnRhcmdldCkpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZSgpO1xyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmFjdGl2ZSlcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LCBmYWxzZSk7XHJcblxyXG5cclxuICAgIHRoaXMuQUVIYW5kbGVyID0gdGhpcy5BRUhhbmRsZXIuYmluZCh0aGlzKTtcclxuXHJcbn07XHJcblxyXG5Ecm9wZG93bi5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdkcm9wZG93bl9pbnZpc2libGUnKTtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKGAke3RoaXMuY2xhc3NOYW1lfV9hY3RpdmVgKTtcclxuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcclxufTtcclxuXHJcbkRyb3Bkb3duLnByb3RvdHlwZS5kZWFjdGl2YXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5pdGVtTGlzdC5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCB0aGlzLkFFSGFuZGxlciwgZmFsc2UpO1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ2Ryb3Bkb3duX2ZhZGluZy1vdXQnKTtcclxufTtcclxuXHJcbkRyb3Bkb3duLnByb3RvdHlwZS5BRUhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnZHJvcGRvd25fZmFkaW5nLW91dCcpO1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ2Ryb3Bkb3duX2ludmlzaWJsZScpO1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoYCR7dGhpcy5jbGFzc05hbWV9X2FjdGl2ZWApO1xyXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuICAgIHRoaXMuaXRlbUxpc3QucmVtb3ZlRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgdGhpcy5BRUhhbmRsZXIpO1xyXG59O1xyXG5cclxuRHJvcGRvd24ucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLmFjdGl2ZSlcclxuICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcclxuICAgIGVsc2VcclxuICAgICAgICB0aGlzLnNob3coKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRHJvcGRvd247XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9kcm9wZG93bi9pbmRleC5qcyIsImxldCBldmVudE1peGluID0gcmVxdWlyZShMSUJTICsgJ2V2ZW50TWl4aW4nKTtcclxuXHJcbmxldCBTd2l0Y2hCdXR0b24gPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgdGhpcy5lbGVtID0gb3B0aW9ucy5lbGVtO1xyXG4gICAgdGhpcy5kYXRhID0gb3B0aW9ucy5kYXRhO1xyXG4gICAgdGhpcy5kYXRhU3RyID0gb3B0aW9ucy5kYXRhU3RyIHx8ICdpbWFnZUlkJztcclxuXHJcbiAgICBTd2l0Y2hCdXR0b24ucHJvdG90eXBlLnNldC5jYWxsKHRoaXMsIHthY3RpdmU6ICEhdGhpcy5lbGVtLmRhdGFzZXQuYWN0aXZlfSk7XHJcbiAgICBjb25zb2xlLmxvZygnc3dpdGNoIGJ1dHRvbiBhY3RpdmU6JywgISF0aGlzLmVsZW0uZGF0YXNldC5hY3RpdmUpO1xyXG4gICAgdGhpcy5hdmFpbGFibGUgPSB0cnVlO1xyXG5cclxuICAgIHRoaXMuZWxlbS5vbmNsaWNrID0gZSA9PiB0aGlzLm9uQ2xpY2soZSk7XHJcbn07XHJcblxyXG5Td2l0Y2hCdXR0b24ucHJvdG90eXBlLm9uQ2xpY2sgPSBmdW5jdGlvbihlKSB7XHJcbiAgICBsZXQgaW52b2x2ZWREYXRhID0gdGhpcy5kYXRhO1xyXG5cclxuICAgIGlmICh0aGlzLmF2YWlsYWJsZSkge1xyXG5cclxuICAgICAgICB0aGlzLmF2YWlsYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlKCk7XHJcblxyXG4gICAgICAgIHJlcXVpcmUoTElCUyArICdzZW5kUmVxdWVzdCcpKHtcclxuICAgICAgICAgICAgW3RoaXMuZGF0YVN0cl06IGludm9sdmVkRGF0YVxyXG4gICAgICAgIH0sICdQT1NUJywgdGhpcy51cmwsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWVycikge1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlcignc3dpdGNoLWJ1dHRvbl9jaGFuZ2VkJywge1xyXG4gICAgICAgICAgICAgICAgICAgIFt0aGlzLmRhdGFTdHJdOiBpbnZvbHZlZERhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRhdGEgPT09IGludm9sdmVkRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuU3dpdGNoQnV0dG9uLnNldFJlbGF0aW9uID0gZnVuY3Rpb24gKHN3aXRjaEJ1dHRvbjEsIHN3aXRjaEJ1dHRvbjIpIHtcclxuICAgIHN3aXRjaEJ1dHRvbjEub24oJ3N3aXRjaC1idXR0b25fY2hhbmdlZCcsIGUgPT4ge1xyXG4gICAgICAgIHN3aXRjaEJ1dHRvbjIuc2V0KGUuZGV0YWlsLnJlc3BvbnNlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHN3aXRjaEJ1dHRvbjIub24oJ3N3aXRjaC1idXR0b25fY2hhbmdlZCcsIGUgPT4ge1xyXG4gICAgICAgIHN3aXRjaEJ1dHRvbjEuc2V0KGUuZGV0YWlsLnJlc3BvbnNlKTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuU3dpdGNoQnV0dG9uLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgaWYgKG9wdGlvbnMuYWN0aXZlKVxyXG4gICAgICAgIHRoaXMuX2FjdGl2YXRlKCk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5fZGVhY3RpdmF0ZSgpO1xyXG59O1xyXG5cclxuU3dpdGNoQnV0dG9uLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5hY3RpdmUpXHJcbiAgICAgICAgdGhpcy5zZXQoe2FjdGl2ZTogZmFsc2V9KTtcclxuICAgIGVsc2VcclxuICAgICAgICB0aGlzLnNldCh7YWN0aXZlOiB0cnVlfSk7XHJcbn07XHJcblxyXG5Td2l0Y2hCdXR0b24ucHJvdG90eXBlLl9hY3RpdmF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdidXR0b25fYWN0aXZlJyk7XHJcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XHJcbn07XHJcblxyXG5Td2l0Y2hCdXR0b24ucHJvdG90eXBlLl9kZWFjdGl2YXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2J1dHRvbl9hY3RpdmUnKTtcclxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XHJcbn07XHJcblxyXG5Td2l0Y2hCdXR0b24ucHJvdG90eXBlLnNldEltYWdlSWQgPSBmdW5jdGlvbiAoaW1hZ2VJZCkge1xyXG4gICAgdGhpcy5kYXRhID0gaW1hZ2VJZDtcclxufTtcclxuXHJcbmZvciAobGV0IGtleSBpbiBldmVudE1peGluKVxyXG4gICAgU3dpdGNoQnV0dG9uLnByb3RvdHlwZVtrZXldID0gZXZlbnRNaXhpbltrZXldO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTd2l0Y2hCdXR0b247XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9zd2l0Y2gtYnV0dG9uL2luZGV4LmpzIiwibGV0IFN3aXRjaEJ1dHRvbiA9IHJlcXVpcmUoQkxPQ0tTICsgJ3N3aXRjaC1idXR0b24nKTtcclxubGV0IGdldENvcnJlY3ROb3VuRm9ybSA9IHJlcXVpcmUoTElCUyArICdnZXRDb3JyZWN0Tm91bkZvcm0nKTtcclxuXHJcbmxldCBTdWJzY3JpYmVCdXR0b24gPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgU3dpdGNoQnV0dG9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblxyXG4gICAgdGhpcy5vdXRlclN0YXRFbGVtID0gb3B0aW9ucy5vdXRlclN0YXRFbGVtO1xyXG5cclxuICAgIHRoaXMuY291bnRlckVsZW0gPSB0aGlzLm91dGVyU3RhdEVsZW0gJiYgdGhpcy5vdXRlclN0YXRFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5zdGF0X19udW1iZXInKTtcclxuICAgIHRoaXMuY291bnRlckRlc2lnbmF0aW9uRWxlbSA9IHRoaXMub3V0ZXJTdGF0RWxlbSAmJiB0aGlzLm91dGVyU3RhdEVsZW0ucXVlcnlTZWxlY3RvcignLnN0YXRfX2NhcHRpb24nKTtcclxuXHJcbiAgICB0aGlzLnN1YnNjcmliZXJzQW1vdW50ID0gMDtcclxuICAgIGlmICh0aGlzLmNvdW50ZXJFbGVtKVxyXG4gICAgICAgIHRoaXMuc3Vic2NyaWJlcnNBbW91bnQgPSArdGhpcy5jb3VudGVyRWxlbS50ZXh0Q29udGVudDtcclxuXHJcbiAgICB0aGlzLnVybCA9ICcvc3Vic2NyaWJlJztcclxufTtcclxuU3Vic2NyaWJlQnV0dG9uLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoU3dpdGNoQnV0dG9uLnByb3RvdHlwZSk7XHJcblN1YnNjcmliZUJ1dHRvbi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTdWJzY3JpYmVCdXR0b247XHJcblxyXG5TdWJzY3JpYmVCdXR0b24ucHJvdG90eXBlLnNldEFtb3VudCA9IGZ1bmN0aW9uIChzdWJzY3JpYmVyc0Ftb3VudCkge1xyXG4gICAgdGhpcy5zdWJzY3JpYmVyc0Ftb3VudCA9IHN1YnNjcmliZXJzQW1vdW50O1xyXG4gICAgaWYgKHRoaXMuY291bnRlckVsZW0pXHJcbiAgICAgICAgdGhpcy5jb3VudGVyRWxlbS50ZXh0Q29udGVudCA9IHN1YnNjcmliZXJzQW1vdW50O1xyXG5cclxuICAgIGlmICh0aGlzLmNvdW50ZXJEZXNpZ25hdGlvbkVsZW0pXHJcbiAgICAgICAgdGhpcy5jb3VudGVyRGVzaWduYXRpb25FbGVtLnRleHRDb250ZW50ID0gZ2V0Q29ycmVjdE5vdW5Gb3JtKCdzdWJzY3JpYmVyJywgc3Vic2NyaWJlcnNBbW91bnQpO1xyXG59O1xyXG5cclxuU3Vic2NyaWJlQnV0dG9uLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgdGhpcy5zZXRBbW91bnQob3B0aW9ucy5zdWJzY3JpYmVyc0Ftb3VudCk7XHJcbiAgICBTd2l0Y2hCdXR0b24ucHJvdG90eXBlLnNldC5jYWxsKHRoaXMsIG9wdGlvbnMpO1xyXG59O1xyXG5cclxuU3Vic2NyaWJlQnV0dG9uLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5hY3RpdmUpXHJcbiAgICAgICAgdGhpcy5zZXQoe2FjdGl2ZTogZmFsc2UsIHN1YnNjcmliZXJzQW1vdW50OiB0aGlzLnN1YnNjcmliZXJzQW1vdW50IC0gMX0pO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHRoaXMuc2V0KHthY3RpdmU6IHRydWUsIHN1YnNjcmliZXJzQW1vdW50OiB0aGlzLnN1YnNjcmliZXJzQW1vdW50ICsgMX0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTdWJzY3JpYmVCdXR0b247XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3Mvc3Vic2NyaWJlLWJ1dHRvbi9pbmRleC5qcyIsImxldCBnZXRDb3JyZWN0Tm91bkZvcm0gPSBmdW5jdGlvbiAoc2luZ2xlRm9ybSwgYW1vdW50KSB7XHJcbiAgICByZXR1cm4gc2luZ2xlRm9ybSArICgoYW1vdW50ID09PSAxKSA/ICcnIDogJ3MnKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZ2V0Q29ycmVjdE5vdW5Gb3JtO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9nZXRDb3JyZWN0Tm91bkZvcm0uanMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7QUM3QkE7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3JEQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBOzs7QUFFQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBOzs7Ozs7Ozs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTs7Ozs7Ozs7OztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Iiwic291cmNlUm9vdCI6IiJ9