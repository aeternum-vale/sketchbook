webpackJsonp([12],{

/***/ 50:
/***/ (function(module, exports) {

	'use strict';

	var DEFAULT_VALUE = 'no file chosen';
	var DEFAULT_FN_LENGTH = DEFAULT_VALUE.length;

	var FilePicker = function FilePicker(options) {
	    var _this = this;

	    this.fileNameLength = options.fileNameLength || DEFAULT_FN_LENGTH;

	    this.uploadInput = document.createElement('input');
	    this.uploadInput.type = "file";
	    this.uploadInput.accept = "image/*";

	    this.elem = options.elem;
	    this.fpButton = this.elem.querySelector('.file-picker__button');
	    this.fpFileName = this.elem.querySelector('.file-picker__filename');

	    this.fpButton.addEventListener('click', function (e) {
	        _this.uploadInput.click();
	    });

	    this.uploadInput.addEventListener('change', function (e) {
	        _this.setVisibleFileName();
	    });
	};

	FilePicker.prototype.setVisibleFileName = function () {
	    var filename = this.uploadInput.value.substring(this.uploadInput.value.lastIndexOf('\\') + 1);

	    var visibleFileName = undefined;
	    var partSize = ~ ~((this.fileNameLength - 1) / 2);

	    if (filename.length === 0) visibleFileName = DEFAULT_VALUE;else if (filename.length <= this.fileNameLength) {
	        this.fpFileName.title = '';
	        visibleFileName = filename;
	    } else {
	        this.fpFileName.title = filename;
	        visibleFileName = filename.slice(0, partSize) + '…' + filename.slice(-partSize);
	    }

	    this.fpFileName.textContent = visibleFileName;
	};

	FilePicker.prototype.getFile = function () {
	    return this.uploadInput.files[0];
	};

	FilePicker.prototype.clear = function () {
	    this.uploadInput.value = '';
	    this.fpFileName.textContent = DEFAULT_VALUE;
	};

	module.exports = FilePicker;

/***/ }),

/***/ 51:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var ServerError = __webpack_require__(15).ServerError;
	var ClientError = __webpack_require__(15).ClientError;

	module.exports = function (url, formData, cb) {
		var xhr = new XMLHttpRequest();
		xhr.upload.onprogress = function (event) {
			//console.log(event.loaded + ' / ' + event.total);
		};

		xhr.onload = xhr.onerror = function () {
			var response = undefined;

			if (this.responseText) response = JSON.parse(this.responseText);else {
				cb(new ServerError('Server is not responding'));
				return;
			}

			if (this.status >= 200 && this.status < 300) cb(null, response);

			if (this.status >= 400 && this.status < 500) cb(new ClientError(response.message));

			if (this.status >= 500) cb(new ServerError(response.message));
		};

		xhr.open("POST", url, true);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.send(formData);
	};

/***/ }),

/***/ 55:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var Modal = __webpack_require__(17);
	var FilePicker = __webpack_require__(50);
	var ClientError = __webpack_require__(15).ClientError;

	var UploadImageModalWindow = function UploadImageModalWindow(options) {
	    Modal.apply(this, arguments);
	    this.available = true;
	    this.status = Modal.statuses.MAJOR;
	};
	UploadImageModalWindow.prototype = Object.create(Modal.prototype);
	UploadImageModalWindow.prototype.constructor = UploadImageModalWindow;

	UploadImageModalWindow.prototype.setElem = function () {
	    var _this = this;

	    this.elem = document.getElementById('upload-image-modal-window');
	    if (!this.elem) this.elem = this.renderWindow(__webpack_require__(56));

	    this.uploadButton = this.elem.querySelector('.upload-image-modal-window__button');

	    this.uploadImageFilePicker = new FilePicker({
	        elem: this.elem.querySelector('.file-picker')
	    });

	    this.imageDescription = this.elem.querySelector('textarea.textbox__field');
	    this.uploadErrorMessage = this.elem.querySelector('.window__error-message');

	    this.elem.onclick = function (e) {
	        _this.onElemClick(e);

	        if (e.target === _this.uploadButton) {
	            var file = _this.uploadImageFilePicker.getFile();
	            if (file) _this.uploadImage(file, _this.imageDescription.value);
	        }
	    };

	    this.setListeners();
	};

	UploadImageModalWindow.prototype.uploadImage = function (file, description) {
	    var _this2 = this;

	    if (this.available) {
	        var formData = new FormData();
	        formData.append("image", file);
	        formData.append("description", description);

	        this.available = false;
	        __webpack_require__(51)("/image", formData, function (err, response) {

	            if (err) {
	                if (err instanceof ClientError) _this2.setError(err.message);else _this2.error(err);
	                return;
	            }

	            _this2.available = true;

	            _this2.trigger('upload-image-modal-window__image-uploaded', {
	                imageId: response.imageId,
	                previewUrl: response.previewUrl
	            });
	            _this2.deactivate();
	        });
	    }
	};

	UploadImageModalWindow.prototype.show = function () {
	    Modal.prototype.show.apply(this);

	    if (!this.elem) this.setElem();

	    this.clear();

	    this.elem.classList.remove('window_invisible');
	};

	UploadImageModalWindow.prototype.deactivate = function () {
	    this.elem.classList.add('window_invisible');
	    Modal.prototype.deactivate.apply(this);
	};

	UploadImageModalWindow.prototype.clear = function () {
	    this.uploadImageFilePicker.clear();
	    this.imageDescription.value = '';
	    this.setError('');
	};

	UploadImageModalWindow.prototype.setError = function (error) {
	    this.uploadErrorMessage.textContent = error;
	};

	module.exports = UploadImageModalWindow;

/***/ }),

/***/ 56:
/***/ (function(module, exports) {

	module.exports = "<div class=\"window window_invisible modal modal-window upload-image-modal-window\" id=\"upload-image-modal-window\">\r\n\t<div class=\"header window__header\">\r\n\t\timage uploading\r\n\t</div>\r\n\t<div class=\"panel window__panel\">\r\n\t\t\r\n\t\t<div class=\"file-picker upload-image-modal-window__file-picker\" id=\"file-picker\">\r\n\t\t\t<span class=\"file-picker__filename\">no file chosen</span>\r\n\t\t\t<div class=\"button file-picker__button\">choose file</div>\r\n\t\t</div>\t\t<div class=\"textbox upload-image-modal-window__textarea textarea textbox_no-caption\">\r\n\t\t\t<div class=\"textbox__info\">\r\n\t\t\t\t\r\n\t\t\t\t<span class=\"textbox__error\"></span>\r\n\t\t\t</div>\r\n\t\t\t<textarea name=\"\" class=\"textbox__field\" placeholder=\"description goes here…\"></textarea>\r\n\t\t</div>\t\t<span class=\"window__error-message\"></span>\r\n\t\t<div class=\"button upload-image-modal-window__button\">upload</div>\r\n\t</div>\r\n    <div class=\"icon-cross modal-close-button\"></div></div>";

/***/ })

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTIuMTIuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2ZpbGUtcGlja2VyL2luZGV4LmpzP2U5ZDciLCJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL3NlbmRGb3JtRGF0YS5qcz82OWJiIiwid2VicGFjazovLy8uLi9ibG9ja3MvdXBsb2FkLWltYWdlLW1vZGFsLXdpbmRvdy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL3VwbG9hZC1pbWFnZS1tb2RhbC13aW5kb3cvd2luZG93Il0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IERFRkFVTFRfVkFMVUUgPSAnbm8gZmlsZSBjaG9zZW4nO1xyXG5jb25zdCBERUZBVUxUX0ZOX0xFTkdUSCA9IERFRkFVTFRfVkFMVUUubGVuZ3RoO1xyXG5cclxubGV0IEZpbGVQaWNrZXIgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgIHRoaXMuZmlsZU5hbWVMZW5ndGggPSBvcHRpb25zLmZpbGVOYW1lTGVuZ3RoIHx8IERFRkFVTFRfRk5fTEVOR1RIO1xyXG5cclxuICAgIHRoaXMudXBsb2FkSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG4gICAgdGhpcy51cGxvYWRJbnB1dC50eXBlID0gXCJmaWxlXCI7XHJcbiAgICB0aGlzLnVwbG9hZElucHV0LmFjY2VwdCA9IFwiaW1hZ2UvKlwiO1xyXG5cclxuICAgIHRoaXMuZWxlbSA9IG9wdGlvbnMuZWxlbTtcclxuICAgIHRoaXMuZnBCdXR0b24gPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmZpbGUtcGlja2VyX19idXR0b24nKTtcclxuICAgIHRoaXMuZnBGaWxlTmFtZSA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuZmlsZS1waWNrZXJfX2ZpbGVuYW1lJyk7XHJcblxyXG4gICAgdGhpcy5mcEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICAgIHRoaXMudXBsb2FkSW5wdXQuY2xpY2soKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMudXBsb2FkSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZXRWaXNpYmxlRmlsZU5hbWUoKTtcclxuICAgIH0pO1xyXG5cclxufTtcclxuXHJcbkZpbGVQaWNrZXIucHJvdG90eXBlLnNldFZpc2libGVGaWxlTmFtZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBmaWxlbmFtZSA9IHRoaXMudXBsb2FkSW5wdXQudmFsdWUuc3Vic3RyaW5nKHRoaXMudXBsb2FkSW5wdXQudmFsdWUubGFzdEluZGV4T2YoJ1xcXFwnKSArIDEpO1xyXG5cclxuICAgIGxldCB2aXNpYmxlRmlsZU5hbWU7XHJcbiAgICBsZXQgcGFydFNpemUgPSB+figodGhpcy5maWxlTmFtZUxlbmd0aCAtIDEpIC8gMik7XHJcblxyXG4gICAgaWYgKGZpbGVuYW1lLmxlbmd0aCA9PT0gMClcclxuICAgICAgICB2aXNpYmxlRmlsZU5hbWUgPSBERUZBVUxUX1ZBTFVFO1xyXG4gICAgZWxzZSBpZiAoZmlsZW5hbWUubGVuZ3RoIDw9IHRoaXMuZmlsZU5hbWVMZW5ndGgpIHtcclxuICAgICAgICB0aGlzLmZwRmlsZU5hbWUudGl0bGUgPSAnJztcclxuICAgICAgICB2aXNpYmxlRmlsZU5hbWUgPSBmaWxlbmFtZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5mcEZpbGVOYW1lLnRpdGxlID0gZmlsZW5hbWU7XHJcbiAgICAgICAgdmlzaWJsZUZpbGVOYW1lID0gZmlsZW5hbWUuc2xpY2UoMCwgcGFydFNpemUpICsgJ+KApicgKyBmaWxlbmFtZS5zbGljZSgtcGFydFNpemUpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZnBGaWxlTmFtZS50ZXh0Q29udGVudCA9IHZpc2libGVGaWxlTmFtZTtcclxufTtcclxuXHJcbkZpbGVQaWNrZXIucHJvdG90eXBlLmdldEZpbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gdGhpcy51cGxvYWRJbnB1dC5maWxlc1swXTtcclxufTtcclxuXHJcbkZpbGVQaWNrZXIucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy51cGxvYWRJbnB1dC52YWx1ZSA9ICcnO1xyXG4gICAgdGhpcy5mcEZpbGVOYW1lLnRleHRDb250ZW50ID0gREVGQVVMVF9WQUxVRTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRmlsZVBpY2tlcjtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9maWxlLXBpY2tlci9pbmRleC5qcyIsImxldCBTZXJ2ZXJFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5TZXJ2ZXJFcnJvcjtcclxubGV0IENsaWVudEVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLkNsaWVudEVycm9yO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1cmwsIGZvcm1EYXRhLCBjYikge1xyXG5cdHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHR4aHIudXBsb2FkLm9ucHJvZ3Jlc3MgPSBldmVudCA9PiB7XHJcblx0XHQvL2NvbnNvbGUubG9nKGV2ZW50LmxvYWRlZCArICcgLyAnICsgZXZlbnQudG90YWwpO1xyXG5cdH07XHJcblxyXG5cdHhoci5vbmxvYWQgPSB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0bGV0IHJlc3BvbnNlO1xyXG5cclxuXHRcdGlmICh0aGlzLnJlc3BvbnNlVGV4dClcclxuXHRcdFx0cmVzcG9uc2UgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KTtcclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRjYihuZXcgU2VydmVyRXJyb3IoJ1NlcnZlciBpcyBub3QgcmVzcG9uZGluZycpKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRpZiAodGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwKVxyXG4gICAgICAgICAgICBjYihudWxsLCByZXNwb25zZSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSA0MDAgJiYgdGhpcy5zdGF0dXMgPCA1MDApXHJcbiAgICAgICAgICAgIGNiKG5ldyBDbGllbnRFcnJvcihyZXNwb25zZS5tZXNzYWdlKSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSA1MDApXHJcbiAgICAgICAgICAgIGNiKG5ldyBTZXJ2ZXJFcnJvcihyZXNwb25zZS5tZXNzYWdlKSk7XHJcblx0XHRcclxuXHR9O1xyXG5cclxuXHR4aHIub3BlbihcIlBPU1RcIiwgdXJsLCB0cnVlKTtcclxuXHR4aHIuc2V0UmVxdWVzdEhlYWRlcignWC1SZXF1ZXN0ZWQtV2l0aCcsICdYTUxIdHRwUmVxdWVzdCcpO1xyXG5cdHhoci5zZW5kKGZvcm1EYXRhKTtcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL3NlbmRGb3JtRGF0YS5qcyIsImxldCBNb2RhbCA9IHJlcXVpcmUoQkxPQ0tTICsgJ21vZGFsJyk7XHJcbmxldCBGaWxlUGlja2VyID0gcmVxdWlyZShCTE9DS1MgKyAnZmlsZS1waWNrZXInKTtcclxubGV0IENsaWVudEVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLkNsaWVudEVycm9yO1xyXG5cclxuXHJcbmxldCBVcGxvYWRJbWFnZU1vZGFsV2luZG93ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIE1vZGFsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICB0aGlzLmF2YWlsYWJsZSA9IHRydWU7XHJcbiAgICB0aGlzLnN0YXR1cyA9IE1vZGFsLnN0YXR1c2VzLk1BSk9SO1xyXG59O1xyXG5VcGxvYWRJbWFnZU1vZGFsV2luZG93LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoTW9kYWwucHJvdG90eXBlKTtcclxuVXBsb2FkSW1hZ2VNb2RhbFdpbmRvdy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBVcGxvYWRJbWFnZU1vZGFsV2luZG93O1xyXG5cclxuXHJcblVwbG9hZEltYWdlTW9kYWxXaW5kb3cucHJvdG90eXBlLnNldEVsZW0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXBsb2FkLWltYWdlLW1vZGFsLXdpbmRvdycpO1xyXG4gICAgaWYgKCF0aGlzLmVsZW0pXHJcbiAgICAgICAgdGhpcy5lbGVtID0gdGhpcy5yZW5kZXJXaW5kb3cocmVxdWlyZShgaHRtbC1sb2FkZXIhLi93aW5kb3dgKSk7XHJcblxyXG4gICAgdGhpcy51cGxvYWRCdXR0b24gPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLnVwbG9hZC1pbWFnZS1tb2RhbC13aW5kb3dfX2J1dHRvbicpO1xyXG5cclxuICAgIHRoaXMudXBsb2FkSW1hZ2VGaWxlUGlja2VyID0gbmV3IEZpbGVQaWNrZXIoe1xyXG4gICAgICAgIGVsZW06IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuZmlsZS1waWNrZXInKVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5pbWFnZURlc2NyaXB0aW9uID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJ3RleHRhcmVhLnRleHRib3hfX2ZpZWxkJyk7XHJcbiAgICB0aGlzLnVwbG9hZEVycm9yTWVzc2FnZSA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcud2luZG93X19lcnJvci1tZXNzYWdlJyk7XHJcblxyXG4gICAgdGhpcy5lbGVtLm9uY2xpY2sgPSBlID0+IHtcclxuICAgICAgICB0aGlzLm9uRWxlbUNsaWNrKGUpO1xyXG5cclxuICAgICAgICBpZiAoZS50YXJnZXQgPT09IHRoaXMudXBsb2FkQnV0dG9uKSB7XHJcbiAgICAgICAgICAgIGxldCBmaWxlID0gdGhpcy51cGxvYWRJbWFnZUZpbGVQaWNrZXIuZ2V0RmlsZSgpO1xyXG4gICAgICAgICAgICBpZiAoZmlsZSlcclxuICAgICAgICAgICAgICAgIHRoaXMudXBsb2FkSW1hZ2UoZmlsZSwgdGhpcy5pbWFnZURlc2NyaXB0aW9uLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuc2V0TGlzdGVuZXJzKCk7XHJcbn07XHJcblxyXG5VcGxvYWRJbWFnZU1vZGFsV2luZG93LnByb3RvdHlwZS51cGxvYWRJbWFnZSA9IGZ1bmN0aW9uIChmaWxlLCBkZXNjcmlwdGlvbikge1xyXG5cclxuICAgIGlmICh0aGlzLmF2YWlsYWJsZSkge1xyXG4gICAgICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcImltYWdlXCIsIGZpbGUpO1xyXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcImRlc2NyaXB0aW9uXCIsIGRlc2NyaXB0aW9uKTtcclxuXHJcbiAgICAgICAgdGhpcy5hdmFpbGFibGUgPSBmYWxzZTtcclxuICAgICAgICByZXF1aXJlKExJQlMgKyAnc2VuZEZvcm1EYXRhJykoXCIvaW1hZ2VcIiwgZm9ybURhdGEsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgQ2xpZW50RXJyb3IpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRFcnJvcihlcnIubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmF2YWlsYWJsZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ3VwbG9hZC1pbWFnZS1tb2RhbC13aW5kb3dfX2ltYWdlLXVwbG9hZGVkJywge1xyXG4gICAgICAgICAgICAgICAgaW1hZ2VJZDogcmVzcG9uc2UuaW1hZ2VJZCxcclxuICAgICAgICAgICAgICAgIHByZXZpZXdVcmw6IHJlc3BvbnNlLnByZXZpZXdVcmxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn07XHJcblxyXG5VcGxvYWRJbWFnZU1vZGFsV2luZG93LnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgTW9kYWwucHJvdG90eXBlLnNob3cuYXBwbHkodGhpcyk7XHJcblxyXG4gICAgaWYgKCF0aGlzLmVsZW0pXHJcbiAgICAgICAgdGhpcy5zZXRFbGVtKCk7XHJcblxyXG4gICAgdGhpcy5jbGVhcigpO1xyXG5cclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3dfaW52aXNpYmxlJyk7XHJcbn07XHJcblxyXG5VcGxvYWRJbWFnZU1vZGFsV2luZG93LnByb3RvdHlwZS5kZWFjdGl2YXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ3dpbmRvd19pbnZpc2libGUnKTtcclxuICAgIE1vZGFsLnByb3RvdHlwZS5kZWFjdGl2YXRlLmFwcGx5KHRoaXMpO1xyXG59O1xyXG5cclxuVXBsb2FkSW1hZ2VNb2RhbFdpbmRvdy5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLnVwbG9hZEltYWdlRmlsZVBpY2tlci5jbGVhcigpO1xyXG4gICAgdGhpcy5pbWFnZURlc2NyaXB0aW9uLnZhbHVlID0gJyc7XHJcbiAgICB0aGlzLnNldEVycm9yKCcnKTtcclxufTtcclxuXHJcblVwbG9hZEltYWdlTW9kYWxXaW5kb3cucHJvdG90eXBlLnNldEVycm9yID0gZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICB0aGlzLnVwbG9hZEVycm9yTWVzc2FnZS50ZXh0Q29udGVudCA9IGVycm9yO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBVcGxvYWRJbWFnZU1vZGFsV2luZG93O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL3VwbG9hZC1pbWFnZS1tb2RhbC13aW5kb3cvaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBjbGFzcz1cXFwid2luZG93IHdpbmRvd19pbnZpc2libGUgbW9kYWwgbW9kYWwtd2luZG93IHVwbG9hZC1pbWFnZS1tb2RhbC13aW5kb3dcXFwiIGlkPVxcXCJ1cGxvYWQtaW1hZ2UtbW9kYWwtd2luZG93XFxcIj5cXHJcXG5cXHQ8ZGl2IGNsYXNzPVxcXCJoZWFkZXIgd2luZG93X19oZWFkZXJcXFwiPlxcclxcblxcdFxcdGltYWdlIHVwbG9hZGluZ1xcclxcblxcdDwvZGl2PlxcclxcblxcdDxkaXYgY2xhc3M9XFxcInBhbmVsIHdpbmRvd19fcGFuZWxcXFwiPlxcclxcblxcdFxcdFxcclxcblxcdFxcdDxkaXYgY2xhc3M9XFxcImZpbGUtcGlja2VyIHVwbG9hZC1pbWFnZS1tb2RhbC13aW5kb3dfX2ZpbGUtcGlja2VyXFxcIiBpZD1cXFwiZmlsZS1waWNrZXJcXFwiPlxcclxcblxcdFxcdFxcdDxzcGFuIGNsYXNzPVxcXCJmaWxlLXBpY2tlcl9fZmlsZW5hbWVcXFwiPm5vIGZpbGUgY2hvc2VuPC9zcGFuPlxcclxcblxcdFxcdFxcdDxkaXYgY2xhc3M9XFxcImJ1dHRvbiBmaWxlLXBpY2tlcl9fYnV0dG9uXFxcIj5jaG9vc2UgZmlsZTwvZGl2PlxcclxcblxcdFxcdDwvZGl2PlxcdFxcdDxkaXYgY2xhc3M9XFxcInRleHRib3ggdXBsb2FkLWltYWdlLW1vZGFsLXdpbmRvd19fdGV4dGFyZWEgdGV4dGFyZWEgdGV4dGJveF9uby1jYXB0aW9uXFxcIj5cXHJcXG5cXHRcXHRcXHQ8ZGl2IGNsYXNzPVxcXCJ0ZXh0Ym94X19pbmZvXFxcIj5cXHJcXG5cXHRcXHRcXHRcXHRcXHJcXG5cXHRcXHRcXHRcXHQ8c3BhbiBjbGFzcz1cXFwidGV4dGJveF9fZXJyb3JcXFwiPjwvc3Bhbj5cXHJcXG5cXHRcXHRcXHQ8L2Rpdj5cXHJcXG5cXHRcXHRcXHQ8dGV4dGFyZWEgbmFtZT1cXFwiXFxcIiBjbGFzcz1cXFwidGV4dGJveF9fZmllbGRcXFwiIHBsYWNlaG9sZGVyPVxcXCJkZXNjcmlwdGlvbiBnb2VzIGhlcmXigKZcXFwiPjwvdGV4dGFyZWE+XFxyXFxuXFx0XFx0PC9kaXY+XFx0XFx0PHNwYW4gY2xhc3M9XFxcIndpbmRvd19fZXJyb3ItbWVzc2FnZVxcXCI+PC9zcGFuPlxcclxcblxcdFxcdDxkaXYgY2xhc3M9XFxcImJ1dHRvbiB1cGxvYWQtaW1hZ2UtbW9kYWwtd2luZG93X19idXR0b25cXFwiPnVwbG9hZDwvZGl2PlxcclxcblxcdDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJpY29uLWNyb3NzIG1vZGFsLWNsb3NlLWJ1dHRvblxcXCI+PC9kaXY+PC9kaXY+XCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL34vaHRtbC1sb2FkZXIhLi4vYmxvY2tzL3VwbG9hZC1pbWFnZS1tb2RhbC13aW5kb3cvd2luZG93XG4vLyBtb2R1bGUgaWQgPSA1NlxuLy8gbW9kdWxlIGNodW5rcyA9IDEyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7O0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQ2pHQTs7OzsiLCJzb3VyY2VSb290IjoiIn0=