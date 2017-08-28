webpackJsonp([5],{

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNS41LmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9zdWJzY3JpYmUtYnV0dG9uL2luZGV4LmpzIiwid2VicGFjazovLy9EOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9nZXRDb3JyZWN0Tm91bkZvcm0uanMiXSwic291cmNlc0NvbnRlbnQiOlsibGV0IFN3aXRjaEJ1dHRvbiA9IHJlcXVpcmUoQkxPQ0tTICsgJ3N3aXRjaC1idXR0b24nKTtcclxubGV0IGdldENvcnJlY3ROb3VuRm9ybSA9IHJlcXVpcmUoTElCUyArICdnZXRDb3JyZWN0Tm91bkZvcm0nKTtcclxuXHJcbmxldCBTdWJzY3JpYmVCdXR0b24gPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgU3dpdGNoQnV0dG9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblxyXG4gICAgdGhpcy5vdXRlclN0YXRFbGVtID0gb3B0aW9ucy5vdXRlclN0YXRFbGVtO1xyXG5cclxuICAgIHRoaXMuY291bnRlckVsZW0gPSB0aGlzLm91dGVyU3RhdEVsZW0gJiYgdGhpcy5vdXRlclN0YXRFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5zdGF0X19udW1iZXInKTtcclxuICAgIHRoaXMuY291bnRlckRlc2lnbmF0aW9uRWxlbSA9IHRoaXMub3V0ZXJTdGF0RWxlbSAmJiB0aGlzLm91dGVyU3RhdEVsZW0ucXVlcnlTZWxlY3RvcignLnN0YXRfX2NhcHRpb24nKTtcclxuXHJcbiAgICB0aGlzLnN1YnNjcmliZXJzQW1vdW50ID0gMDtcclxuICAgIGlmICh0aGlzLmNvdW50ZXJFbGVtKVxyXG4gICAgICAgIHRoaXMuc3Vic2NyaWJlcnNBbW91bnQgPSArdGhpcy5jb3VudGVyRWxlbS50ZXh0Q29udGVudDtcclxuXHJcbiAgICB0aGlzLnVybCA9ICcvc3Vic2NyaWJlJztcclxufTtcclxuU3Vic2NyaWJlQnV0dG9uLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoU3dpdGNoQnV0dG9uLnByb3RvdHlwZSk7XHJcblN1YnNjcmliZUJ1dHRvbi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTdWJzY3JpYmVCdXR0b247XHJcblxyXG5TdWJzY3JpYmVCdXR0b24ucHJvdG90eXBlLnNldEFtb3VudCA9IGZ1bmN0aW9uIChzdWJzY3JpYmVyc0Ftb3VudCkge1xyXG4gICAgdGhpcy5zdWJzY3JpYmVyc0Ftb3VudCA9IHN1YnNjcmliZXJzQW1vdW50O1xyXG4gICAgaWYgKHRoaXMuY291bnRlckVsZW0pXHJcbiAgICAgICAgdGhpcy5jb3VudGVyRWxlbS50ZXh0Q29udGVudCA9IHN1YnNjcmliZXJzQW1vdW50O1xyXG5cclxuICAgIGlmICh0aGlzLmNvdW50ZXJEZXNpZ25hdGlvbkVsZW0pXHJcbiAgICAgICAgdGhpcy5jb3VudGVyRGVzaWduYXRpb25FbGVtLnRleHRDb250ZW50ID0gZ2V0Q29ycmVjdE5vdW5Gb3JtKCdzdWJzY3JpYmVyJywgc3Vic2NyaWJlcnNBbW91bnQpO1xyXG59O1xyXG5cclxuU3Vic2NyaWJlQnV0dG9uLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgdGhpcy5zZXRBbW91bnQob3B0aW9ucy5zdWJzY3JpYmVyc0Ftb3VudCk7XHJcbiAgICBTd2l0Y2hCdXR0b24ucHJvdG90eXBlLnNldC5jYWxsKHRoaXMsIG9wdGlvbnMpO1xyXG59O1xyXG5cclxuU3Vic2NyaWJlQnV0dG9uLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5hY3RpdmUpXHJcbiAgICAgICAgdGhpcy5zZXQoe2FjdGl2ZTogZmFsc2UsIHN1YnNjcmliZXJzQW1vdW50OiB0aGlzLnN1YnNjcmliZXJzQW1vdW50IC0gMX0pO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHRoaXMuc2V0KHthY3RpdmU6IHRydWUsIHN1YnNjcmliZXJzQW1vdW50OiB0aGlzLnN1YnNjcmliZXJzQW1vdW50ICsgMX0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTdWJzY3JpYmVCdXR0b247XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3Mvc3Vic2NyaWJlLWJ1dHRvbi9pbmRleC5qcyIsImxldCBnZXRDb3JyZWN0Tm91bkZvcm0gPSBmdW5jdGlvbiAoc2luZ2xlRm9ybSwgYW1vdW50KSB7XHJcbiAgICByZXR1cm4gc2luZ2xlRm9ybSArICgoYW1vdW50ID09PSAxKSA/ICcnIDogJ3MnKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZ2V0Q29ycmVjdE5vdW5Gb3JtO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9nZXRDb3JyZWN0Tm91bkZvcm0uanMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBOzs7Ozs7Ozs7O0FDeENBO0FBQ0E7QUFDQTtBQUNBOzs7OzsiLCJzb3VyY2VSb290IjoiIn0=