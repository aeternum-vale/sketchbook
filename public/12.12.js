webpackJsonp([12],{

/***/ 51:
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

/***/ 52:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var ServerError = __webpack_require__(15).ServerError;
	var ClientError = __webpack_require__(15).ClientError;

	module.exports = function (url, formData, cb) {
	    var xhr = new XMLHttpRequest();
	    // xhr.upload.onprogress = event => {
	    // 	   console.log(event.loaded + ' / ' + event.total);
	    // };

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

/***/ 56:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var Modal = __webpack_require__(17);
	var FilePicker = __webpack_require__(51);
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
	    if (!this.elem) this.elem = this.renderWindow(__webpack_require__(57));

	    this.uploadButton = this.elem.querySelector('.upload-image-modal-window__button');
	    this.spinner = this.elem.querySelector('.upload-image-modal-window__spinner');

	    this.uploadImageFilePicker = new FilePicker({
	        elem: this.elem.querySelector('.file-picker')
	    });

	    this.imageDescription = this.elem.querySelector('textarea.textbox__field');
	    this.uploadErrorMessage = this.elem.querySelector('.window__error-message');

	    this.elem.onclick = function (e) {
	        _this.onElemClick(e);

	        if (e.target === _this.uploadButton) {
	            var file = _this.uploadImageFilePicker.getFile();
	            if (file) {
	                _this.setWaitingMode();
	                _this.uploadImage(file, _this.imageDescription.value);
	            }
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
	        __webpack_require__(52)("/image", formData, function (err, response) {

	            _this2.unsetWaitingMode();
	            _this2.available = true;

	            if (err) {
	                _this2.error(err);
	                return;
	            }

	            _this2.trigger('upload-image-modal-window__image-uploaded', {
	                imageId: response.imageId,
	                previewUrl: response.previewUrl
	            });
	            _this2.deactivate();
	        });
	    }
	};

	UploadImageModalWindow.prototype.setWaitingMode = function () {
	    this.uploadButton.classList.add('button_invisible');
	    this.spinner.classList.remove('spinner_invisible');
	};

	UploadImageModalWindow.prototype.unsetWaitingMode = function () {
	    this.uploadButton.classList.remove('button_invisible');
	    this.spinner.classList.add('spinner_invisible');
	};

	UploadImageModalWindow.prototype.show = function () {
	    Modal.prototype.show.apply(this);

	    if (!this.elem) this.setElem();

	    this.clear();

	    this.unsetWaitingMode();

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

/***/ 57:
/***/ (function(module, exports) {

	module.exports = "<div class=\"window window_invisible modal modal-window upload-image-modal-window\" id=\"upload-image-modal-window\">\r\n\t<div class=\"header window__header\">\r\n\t\timage uploading\r\n\t</div>\r\n\t<div class=\"panel window__panel\">\r\n\t\t\r\n\t\t<div class=\"file-picker upload-image-modal-window__file-picker\" id=\"file-picker\">\r\n\t\t\t<span class=\"file-picker__filename\">no file chosen</span>\r\n\t\t\t<div class=\"button file-picker__button\">choose file</div>\r\n\t\t</div>\t\t<div class=\"textbox upload-image-modal-window__textarea textarea textbox_no-caption\">\r\n\t\t\t<div class=\"textbox__info\">\r\n\t\t\t\t\r\n\t\t\t\t<span class=\"textbox__error\"></span>\r\n\t\t\t</div>\r\n\t\t\t<textarea name=\"\" class=\"textbox__field\" placeholder=\"description goes here…\"></textarea>\r\n\t\t</div>\t\t<span class=\"window__error-message\"></span>\r\n        <div class=\"spinner upload-image-modal-window__spinner spinner_invisible\"></div>\r\n\t\t<div class=\"button upload-image-modal-window__button\">upload</div>\r\n\t</div>\r\n    <div class=\"icon-cross modal-close-button\"></div></div>";

/***/ })

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTIuMTIuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2ZpbGUtcGlja2VyL2luZGV4LmpzP2U5ZDciLCJ3ZWJwYWNrOi8vL0Q6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL3NlbmRGb3JtRGF0YS5qcz82OWJiIiwid2VicGFjazovLy8uLi9ibG9ja3MvdXBsb2FkLWltYWdlLW1vZGFsLXdpbmRvdy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL3VwbG9hZC1pbWFnZS1tb2RhbC13aW5kb3cvd2luZG93Il0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IERFRkFVTFRfVkFMVUUgPSAnbm8gZmlsZSBjaG9zZW4nO1xyXG5jb25zdCBERUZBVUxUX0ZOX0xFTkdUSCA9IERFRkFVTFRfVkFMVUUubGVuZ3RoO1xyXG5cclxubGV0IEZpbGVQaWNrZXIgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgIHRoaXMuZmlsZU5hbWVMZW5ndGggPSBvcHRpb25zLmZpbGVOYW1lTGVuZ3RoIHx8IERFRkFVTFRfRk5fTEVOR1RIO1xyXG5cclxuICAgIHRoaXMudXBsb2FkSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG4gICAgdGhpcy51cGxvYWRJbnB1dC50eXBlID0gXCJmaWxlXCI7XHJcbiAgICB0aGlzLnVwbG9hZElucHV0LmFjY2VwdCA9IFwiaW1hZ2UvKlwiO1xyXG5cclxuICAgIHRoaXMuZWxlbSA9IG9wdGlvbnMuZWxlbTtcclxuICAgIHRoaXMuZnBCdXR0b24gPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmZpbGUtcGlja2VyX19idXR0b24nKTtcclxuICAgIHRoaXMuZnBGaWxlTmFtZSA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuZmlsZS1waWNrZXJfX2ZpbGVuYW1lJyk7XHJcblxyXG4gICAgdGhpcy5mcEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICAgIHRoaXMudXBsb2FkSW5wdXQuY2xpY2soKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMudXBsb2FkSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZXRWaXNpYmxlRmlsZU5hbWUoKTtcclxuICAgIH0pO1xyXG5cclxufTtcclxuXHJcbkZpbGVQaWNrZXIucHJvdG90eXBlLnNldFZpc2libGVGaWxlTmFtZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBmaWxlbmFtZSA9IHRoaXMudXBsb2FkSW5wdXQudmFsdWUuc3Vic3RyaW5nKHRoaXMudXBsb2FkSW5wdXQudmFsdWUubGFzdEluZGV4T2YoJ1xcXFwnKSArIDEpO1xyXG5cclxuICAgIGxldCB2aXNpYmxlRmlsZU5hbWU7XHJcbiAgICBsZXQgcGFydFNpemUgPSB+figodGhpcy5maWxlTmFtZUxlbmd0aCAtIDEpIC8gMik7XHJcblxyXG4gICAgaWYgKGZpbGVuYW1lLmxlbmd0aCA9PT0gMClcclxuICAgICAgICB2aXNpYmxlRmlsZU5hbWUgPSBERUZBVUxUX1ZBTFVFO1xyXG4gICAgZWxzZSBpZiAoZmlsZW5hbWUubGVuZ3RoIDw9IHRoaXMuZmlsZU5hbWVMZW5ndGgpIHtcclxuICAgICAgICB0aGlzLmZwRmlsZU5hbWUudGl0bGUgPSAnJztcclxuICAgICAgICB2aXNpYmxlRmlsZU5hbWUgPSBmaWxlbmFtZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5mcEZpbGVOYW1lLnRpdGxlID0gZmlsZW5hbWU7XHJcbiAgICAgICAgdmlzaWJsZUZpbGVOYW1lID0gZmlsZW5hbWUuc2xpY2UoMCwgcGFydFNpemUpICsgJ+KApicgKyBmaWxlbmFtZS5zbGljZSgtcGFydFNpemUpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZnBGaWxlTmFtZS50ZXh0Q29udGVudCA9IHZpc2libGVGaWxlTmFtZTtcclxufTtcclxuXHJcbkZpbGVQaWNrZXIucHJvdG90eXBlLmdldEZpbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gdGhpcy51cGxvYWRJbnB1dC5maWxlc1swXTtcclxufTtcclxuXHJcbkZpbGVQaWNrZXIucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy51cGxvYWRJbnB1dC52YWx1ZSA9ICcnO1xyXG4gICAgdGhpcy5mcEZpbGVOYW1lLnRleHRDb250ZW50ID0gREVGQVVMVF9WQUxVRTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRmlsZVBpY2tlcjtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy9maWxlLXBpY2tlci9pbmRleC5qcyIsImxldCBTZXJ2ZXJFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5TZXJ2ZXJFcnJvcjtcclxubGV0IENsaWVudEVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLkNsaWVudEVycm9yO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodXJsLCBmb3JtRGF0YSwgY2IpIHtcclxuICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgIC8vIHhoci51cGxvYWQub25wcm9ncmVzcyA9IGV2ZW50ID0+IHtcclxuICAgIC8vIFx0ICAgY29uc29sZS5sb2coZXZlbnQubG9hZGVkICsgJyAvICcgKyBldmVudC50b3RhbCk7XHJcbiAgICAvLyB9O1xyXG5cclxuICAgIHhoci5vbmxvYWQgPSB4aHIub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsZXQgcmVzcG9uc2U7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnJlc3BvbnNlVGV4dClcclxuICAgICAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY2IobmV3IFNlcnZlckVycm9yKCdTZXJ2ZXIgaXMgbm90IHJlc3BvbmRpbmcnKSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwKVxyXG4gICAgICAgICAgICBjYihudWxsLCByZXNwb25zZSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSA0MDAgJiYgdGhpcy5zdGF0dXMgPCA1MDApXHJcbiAgICAgICAgICAgIGNiKG5ldyBDbGllbnRFcnJvcihyZXNwb25zZS5tZXNzYWdlKSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSA1MDApXHJcbiAgICAgICAgICAgIGNiKG5ldyBTZXJ2ZXJFcnJvcihyZXNwb25zZS5tZXNzYWdlKSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICB4aHIub3BlbihcIlBPU1RcIiwgdXJsLCB0cnVlKTtcclxuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLVJlcXVlc3RlZC1XaXRoJywgJ1hNTEh0dHBSZXF1ZXN0Jyk7XHJcbiAgICB4aHIuc2VuZChmb3JtRGF0YSk7XHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9zZW5kRm9ybURhdGEuanMiLCJsZXQgTW9kYWwgPSByZXF1aXJlKEJMT0NLUyArICdtb2RhbCcpO1xyXG5sZXQgRmlsZVBpY2tlciA9IHJlcXVpcmUoQkxPQ0tTICsgJ2ZpbGUtcGlja2VyJyk7XHJcbmxldCBDbGllbnRFcnJvciA9IHJlcXVpcmUoTElCUyArICdjb21wb25lbnRFcnJvcnMnKS5DbGllbnRFcnJvcjtcclxuXHJcblxyXG5sZXQgVXBsb2FkSW1hZ2VNb2RhbFdpbmRvdyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBNb2RhbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgdGhpcy5hdmFpbGFibGUgPSB0cnVlO1xyXG4gICAgdGhpcy5zdGF0dXMgPSBNb2RhbC5zdGF0dXNlcy5NQUpPUjtcclxufTtcclxuVXBsb2FkSW1hZ2VNb2RhbFdpbmRvdy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKE1vZGFsLnByb3RvdHlwZSk7XHJcblVwbG9hZEltYWdlTW9kYWxXaW5kb3cucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVXBsb2FkSW1hZ2VNb2RhbFdpbmRvdztcclxuXHJcblxyXG5VcGxvYWRJbWFnZU1vZGFsV2luZG93LnByb3RvdHlwZS5zZXRFbGVtID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VwbG9hZC1pbWFnZS1tb2RhbC13aW5kb3cnKTtcclxuICAgIGlmICghdGhpcy5lbGVtKVxyXG4gICAgICAgIHRoaXMuZWxlbSA9IHRoaXMucmVuZGVyV2luZG93KHJlcXVpcmUoYGh0bWwtbG9hZGVyIS4vd2luZG93YCkpO1xyXG5cclxuICAgIHRoaXMudXBsb2FkQnV0dG9uID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy51cGxvYWQtaW1hZ2UtbW9kYWwtd2luZG93X19idXR0b24nKTtcclxuICAgIHRoaXMuc3Bpbm5lciA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcudXBsb2FkLWltYWdlLW1vZGFsLXdpbmRvd19fc3Bpbm5lcicpO1xyXG5cclxuICAgIHRoaXMudXBsb2FkSW1hZ2VGaWxlUGlja2VyID0gbmV3IEZpbGVQaWNrZXIoe1xyXG4gICAgICAgIGVsZW06IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuZmlsZS1waWNrZXInKVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5pbWFnZURlc2NyaXB0aW9uID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJ3RleHRhcmVhLnRleHRib3hfX2ZpZWxkJyk7XHJcbiAgICB0aGlzLnVwbG9hZEVycm9yTWVzc2FnZSA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcud2luZG93X19lcnJvci1tZXNzYWdlJyk7XHJcblxyXG4gICAgdGhpcy5lbGVtLm9uY2xpY2sgPSBlID0+IHtcclxuICAgICAgICB0aGlzLm9uRWxlbUNsaWNrKGUpO1xyXG5cclxuICAgICAgICBpZiAoZS50YXJnZXQgPT09IHRoaXMudXBsb2FkQnV0dG9uKSB7XHJcbiAgICAgICAgICAgIGxldCBmaWxlID0gdGhpcy51cGxvYWRJbWFnZUZpbGVQaWNrZXIuZ2V0RmlsZSgpO1xyXG4gICAgICAgICAgICBpZiAoZmlsZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRXYWl0aW5nTW9kZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGxvYWRJbWFnZShmaWxlLCB0aGlzLmltYWdlRGVzY3JpcHRpb24udmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5zZXRMaXN0ZW5lcnMoKTtcclxufTtcclxuXHJcblVwbG9hZEltYWdlTW9kYWxXaW5kb3cucHJvdG90eXBlLnVwbG9hZEltYWdlID0gZnVuY3Rpb24gKGZpbGUsIGRlc2NyaXB0aW9uKSB7XHJcblxyXG4gICAgaWYgKHRoaXMuYXZhaWxhYmxlKSB7XHJcbiAgICAgICAgbGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwiaW1hZ2VcIiwgZmlsZSk7XHJcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwiZGVzY3JpcHRpb25cIiwgZGVzY3JpcHRpb24pO1xyXG5cclxuICAgICAgICB0aGlzLmF2YWlsYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIHJlcXVpcmUoTElCUyArICdzZW5kRm9ybURhdGEnKShcIi9pbWFnZVwiLCBmb3JtRGF0YSwgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudW5zZXRXYWl0aW5nTW9kZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmF2YWlsYWJsZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcigndXBsb2FkLWltYWdlLW1vZGFsLXdpbmRvd19faW1hZ2UtdXBsb2FkZWQnLCB7XHJcbiAgICAgICAgICAgICAgICBpbWFnZUlkOiByZXNwb25zZS5pbWFnZUlkLFxyXG4gICAgICAgICAgICAgICAgcHJldmlld1VybDogcmVzcG9uc2UucHJldmlld1VybFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxufTtcclxuXHJcblVwbG9hZEltYWdlTW9kYWxXaW5kb3cucHJvdG90eXBlLnNldFdhaXRpbmdNb2RlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy51cGxvYWRCdXR0b24uY2xhc3NMaXN0LmFkZCgnYnV0dG9uX2ludmlzaWJsZScpO1xyXG4gICAgdGhpcy5zcGlubmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3NwaW5uZXJfaW52aXNpYmxlJyk7XHJcbn07XHJcblxyXG5VcGxvYWRJbWFnZU1vZGFsV2luZG93LnByb3RvdHlwZS51bnNldFdhaXRpbmdNb2RlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy51cGxvYWRCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnYnV0dG9uX2ludmlzaWJsZScpO1xyXG4gICAgdGhpcy5zcGlubmVyLmNsYXNzTGlzdC5hZGQoJ3NwaW5uZXJfaW52aXNpYmxlJyk7XHJcbn07XHJcblxyXG5VcGxvYWRJbWFnZU1vZGFsV2luZG93LnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgTW9kYWwucHJvdG90eXBlLnNob3cuYXBwbHkodGhpcyk7XHJcblxyXG4gICAgaWYgKCF0aGlzLmVsZW0pXHJcbiAgICAgICAgdGhpcy5zZXRFbGVtKCk7XHJcblxyXG4gICAgdGhpcy5jbGVhcigpO1xyXG5cclxuICAgIHRoaXMudW5zZXRXYWl0aW5nTW9kZSgpO1xyXG5cclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3dfaW52aXNpYmxlJyk7XHJcbn07XHJcblxyXG5VcGxvYWRJbWFnZU1vZGFsV2luZG93LnByb3RvdHlwZS5kZWFjdGl2YXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ3dpbmRvd19pbnZpc2libGUnKTtcclxuICAgIE1vZGFsLnByb3RvdHlwZS5kZWFjdGl2YXRlLmFwcGx5KHRoaXMpO1xyXG59O1xyXG5cclxuVXBsb2FkSW1hZ2VNb2RhbFdpbmRvdy5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLnVwbG9hZEltYWdlRmlsZVBpY2tlci5jbGVhcigpO1xyXG4gICAgdGhpcy5pbWFnZURlc2NyaXB0aW9uLnZhbHVlID0gJyc7XHJcbiAgICB0aGlzLnNldEVycm9yKCcnKTtcclxufTtcclxuXHJcblVwbG9hZEltYWdlTW9kYWxXaW5kb3cucHJvdG90eXBlLnNldEVycm9yID0gZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICB0aGlzLnVwbG9hZEVycm9yTWVzc2FnZS50ZXh0Q29udGVudCA9IGVycm9yO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBVcGxvYWRJbWFnZU1vZGFsV2luZG93O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL3VwbG9hZC1pbWFnZS1tb2RhbC13aW5kb3cvaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBjbGFzcz1cXFwid2luZG93IHdpbmRvd19pbnZpc2libGUgbW9kYWwgbW9kYWwtd2luZG93IHVwbG9hZC1pbWFnZS1tb2RhbC13aW5kb3dcXFwiIGlkPVxcXCJ1cGxvYWQtaW1hZ2UtbW9kYWwtd2luZG93XFxcIj5cXHJcXG5cXHQ8ZGl2IGNsYXNzPVxcXCJoZWFkZXIgd2luZG93X19oZWFkZXJcXFwiPlxcclxcblxcdFxcdGltYWdlIHVwbG9hZGluZ1xcclxcblxcdDwvZGl2PlxcclxcblxcdDxkaXYgY2xhc3M9XFxcInBhbmVsIHdpbmRvd19fcGFuZWxcXFwiPlxcclxcblxcdFxcdFxcclxcblxcdFxcdDxkaXYgY2xhc3M9XFxcImZpbGUtcGlja2VyIHVwbG9hZC1pbWFnZS1tb2RhbC13aW5kb3dfX2ZpbGUtcGlja2VyXFxcIiBpZD1cXFwiZmlsZS1waWNrZXJcXFwiPlxcclxcblxcdFxcdFxcdDxzcGFuIGNsYXNzPVxcXCJmaWxlLXBpY2tlcl9fZmlsZW5hbWVcXFwiPm5vIGZpbGUgY2hvc2VuPC9zcGFuPlxcclxcblxcdFxcdFxcdDxkaXYgY2xhc3M9XFxcImJ1dHRvbiBmaWxlLXBpY2tlcl9fYnV0dG9uXFxcIj5jaG9vc2UgZmlsZTwvZGl2PlxcclxcblxcdFxcdDwvZGl2PlxcdFxcdDxkaXYgY2xhc3M9XFxcInRleHRib3ggdXBsb2FkLWltYWdlLW1vZGFsLXdpbmRvd19fdGV4dGFyZWEgdGV4dGFyZWEgdGV4dGJveF9uby1jYXB0aW9uXFxcIj5cXHJcXG5cXHRcXHRcXHQ8ZGl2IGNsYXNzPVxcXCJ0ZXh0Ym94X19pbmZvXFxcIj5cXHJcXG5cXHRcXHRcXHRcXHRcXHJcXG5cXHRcXHRcXHRcXHQ8c3BhbiBjbGFzcz1cXFwidGV4dGJveF9fZXJyb3JcXFwiPjwvc3Bhbj5cXHJcXG5cXHRcXHRcXHQ8L2Rpdj5cXHJcXG5cXHRcXHRcXHQ8dGV4dGFyZWEgbmFtZT1cXFwiXFxcIiBjbGFzcz1cXFwidGV4dGJveF9fZmllbGRcXFwiIHBsYWNlaG9sZGVyPVxcXCJkZXNjcmlwdGlvbiBnb2VzIGhlcmXigKZcXFwiPjwvdGV4dGFyZWE+XFxyXFxuXFx0XFx0PC9kaXY+XFx0XFx0PHNwYW4gY2xhc3M9XFxcIndpbmRvd19fZXJyb3ItbWVzc2FnZVxcXCI+PC9zcGFuPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwic3Bpbm5lciB1cGxvYWQtaW1hZ2UtbW9kYWwtd2luZG93X19zcGlubmVyIHNwaW5uZXJfaW52aXNpYmxlXFxcIj48L2Rpdj5cXHJcXG5cXHRcXHQ8ZGl2IGNsYXNzPVxcXCJidXR0b24gdXBsb2FkLWltYWdlLW1vZGFsLXdpbmRvd19fYnV0dG9uXFxcIj51cGxvYWQ8L2Rpdj5cXHJcXG5cXHQ8L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiaWNvbi1jcm9zcyBtb2RhbC1jbG9zZS1idXR0b25cXFwiPjwvZGl2PjwvZGl2PlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9+L2h0bWwtbG9hZGVyIS4uL2Jsb2Nrcy91cGxvYWQtaW1hZ2UtbW9kYWwtd2luZG93L3dpbmRvd1xuLy8gbW9kdWxlIGlkID0gNTdcbi8vIG1vZHVsZSBjaHVua3MgPSAxMiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7OztBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDaEhBOzs7OyIsInNvdXJjZVJvb3QiOiIifQ==