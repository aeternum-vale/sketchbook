webpackJsonp([5],{

/***/ 39:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var SwitchButton = __webpack_require__(31);

	var SubscribeButton = function SubscribeButton(options) {
	    SwitchButton.apply(this, arguments);

	    this.counterElem = options.counterElem;
	    this.subscribersAmount = 0;
	    if (this.counterElem) this.subscribersAmount = +this.counterElem.textContent;

	    this.url = '/subscribe';
	};
	SubscribeButton.prototype = Object.create(SwitchButton.prototype);
	SubscribeButton.prototype.constructor = SubscribeButton;

	SubscribeButton.prototype.setAmount = function (subscribersAmount) {
	    this.subscribersAmount = subscribersAmount;
	    if (this.counterElem) this.counterElem.textContent = subscribersAmount;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNS41LmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9zdWJzY3JpYmUtYnV0dG9uL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImxldCBTd2l0Y2hCdXR0b24gPSByZXF1aXJlKEJMT0NLUyArICdzd2l0Y2gtYnV0dG9uJyk7XHJcblxyXG5sZXQgU3Vic2NyaWJlQnV0dG9uID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIFN3aXRjaEJ1dHRvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cclxuICAgIHRoaXMuY291bnRlckVsZW0gPSBvcHRpb25zLmNvdW50ZXJFbGVtO1xyXG4gICAgdGhpcy5zdWJzY3JpYmVyc0Ftb3VudCA9IDA7XHJcbiAgICBpZiAodGhpcy5jb3VudGVyRWxlbSlcclxuICAgICAgICB0aGlzLnN1YnNjcmliZXJzQW1vdW50ID0gK3RoaXMuY291bnRlckVsZW0udGV4dENvbnRlbnQ7XHJcblxyXG4gICAgdGhpcy51cmwgPSAnL3N1YnNjcmliZSc7XHJcbn07XHJcblN1YnNjcmliZUJ1dHRvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFN3aXRjaEJ1dHRvbi5wcm90b3R5cGUpO1xyXG5TdWJzY3JpYmVCdXR0b24ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU3Vic2NyaWJlQnV0dG9uO1xyXG5cclxuU3Vic2NyaWJlQnV0dG9uLnByb3RvdHlwZS5zZXRBbW91bnQgPSBmdW5jdGlvbiAoc3Vic2NyaWJlcnNBbW91bnQpIHtcclxuICAgIHRoaXMuc3Vic2NyaWJlcnNBbW91bnQgPSBzdWJzY3JpYmVyc0Ftb3VudDtcclxuICAgIGlmICh0aGlzLmNvdW50ZXJFbGVtKVxyXG4gICAgICAgIHRoaXMuY291bnRlckVsZW0udGV4dENvbnRlbnQgPSBzdWJzY3JpYmVyc0Ftb3VudDtcclxufTtcclxuXHJcblN1YnNjcmliZUJ1dHRvbi5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuc2V0QW1vdW50KG9wdGlvbnMuc3Vic2NyaWJlcnNBbW91bnQpO1xyXG4gICAgU3dpdGNoQnV0dG9uLnByb3RvdHlwZS5zZXQuY2FsbCh0aGlzLCBvcHRpb25zKTtcclxufTtcclxuXHJcblN1YnNjcmliZUJ1dHRvbi5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuYWN0aXZlKVxyXG4gICAgICAgIHRoaXMuc2V0KHthY3RpdmU6IGZhbHNlLCBzdWJzY3JpYmVyc0Ftb3VudDogdGhpcy5zdWJzY3JpYmVyc0Ftb3VudCAtIDF9KTtcclxuICAgIGVsc2VcclxuICAgICAgICB0aGlzLnNldCh7YWN0aXZlOiB0cnVlLCBzdWJzY3JpYmVyc0Ftb3VudDogdGhpcy5zdWJzY3JpYmVyc0Ftb3VudCArIDF9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3Vic2NyaWJlQnV0dG9uO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL3N1YnNjcmliZS1idXR0b24vaW5kZXguanMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTs7Ozs7Iiwic291cmNlUm9vdCI6IiJ9