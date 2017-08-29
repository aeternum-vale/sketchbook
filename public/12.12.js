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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTIuMTIuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vYmxvY2tzL2ZpbGUtcGlja2VyL2luZGV4LmpzIiwid2VicGFjazovLy9EOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9zZW5kRm9ybURhdGEuanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy91cGxvYWQtaW1hZ2UtbW9kYWwtd2luZG93L2luZGV4LmpzIiwid2VicGFjazovLy8uLi9ibG9ja3MvdXBsb2FkLWltYWdlLW1vZGFsLXdpbmRvdy93aW5kb3ciXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgREVGQVVMVF9WQUxVRSA9ICdubyBmaWxlIGNob3Nlbic7XHJcbmNvbnN0IERFRkFVTFRfRk5fTEVOR1RIID0gREVGQVVMVF9WQUxVRS5sZW5ndGg7XHJcblxyXG5sZXQgRmlsZVBpY2tlciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgdGhpcy5maWxlTmFtZUxlbmd0aCA9IG9wdGlvbnMuZmlsZU5hbWVMZW5ndGggfHwgREVGQVVMVF9GTl9MRU5HVEg7XHJcblxyXG4gICAgdGhpcy51cGxvYWRJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICB0aGlzLnVwbG9hZElucHV0LnR5cGUgPSBcImZpbGVcIjtcclxuICAgIHRoaXMudXBsb2FkSW5wdXQuYWNjZXB0ID0gXCJpbWFnZS8qXCI7XHJcblxyXG4gICAgdGhpcy5lbGVtID0gb3B0aW9ucy5lbGVtO1xyXG4gICAgdGhpcy5mcEJ1dHRvbiA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuZmlsZS1waWNrZXJfX2J1dHRvbicpO1xyXG4gICAgdGhpcy5mcEZpbGVOYW1lID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5maWxlLXBpY2tlcl9fZmlsZW5hbWUnKTtcclxuXHJcbiAgICB0aGlzLmZwQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgdGhpcy51cGxvYWRJbnB1dC5jbGljaygpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy51cGxvYWRJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBlID0+IHtcclxuICAgICAgICB0aGlzLnNldFZpc2libGVGaWxlTmFtZSgpO1xyXG4gICAgfSk7XHJcblxyXG59O1xyXG5cclxuRmlsZVBpY2tlci5wcm90b3R5cGUuc2V0VmlzaWJsZUZpbGVOYW1lID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGZpbGVuYW1lID0gdGhpcy51cGxvYWRJbnB1dC52YWx1ZS5zdWJzdHJpbmcodGhpcy51cGxvYWRJbnB1dC52YWx1ZS5sYXN0SW5kZXhPZignXFxcXCcpICsgMSk7XHJcblxyXG4gICAgbGV0IHZpc2libGVGaWxlTmFtZTtcclxuICAgIGxldCBwYXJ0U2l6ZSA9IH5+KCh0aGlzLmZpbGVOYW1lTGVuZ3RoIC0gMSkgLyAyKTtcclxuXHJcbiAgICBpZiAoZmlsZW5hbWUubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIHZpc2libGVGaWxlTmFtZSA9IERFRkFVTFRfVkFMVUU7XHJcbiAgICBlbHNlIGlmIChmaWxlbmFtZS5sZW5ndGggPD0gdGhpcy5maWxlTmFtZUxlbmd0aCkge1xyXG4gICAgICAgIHRoaXMuZnBGaWxlTmFtZS50aXRsZSA9ICcnO1xyXG4gICAgICAgIHZpc2libGVGaWxlTmFtZSA9IGZpbGVuYW1lO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmZwRmlsZU5hbWUudGl0bGUgPSBmaWxlbmFtZTtcclxuICAgICAgICB2aXNpYmxlRmlsZU5hbWUgPSBmaWxlbmFtZS5zbGljZSgwLCBwYXJ0U2l6ZSkgKyAn4oCmJyArIGZpbGVuYW1lLnNsaWNlKC1wYXJ0U2l6ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5mcEZpbGVOYW1lLnRleHRDb250ZW50ID0gdmlzaWJsZUZpbGVOYW1lO1xyXG59O1xyXG5cclxuRmlsZVBpY2tlci5wcm90b3R5cGUuZ2V0RmlsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB0aGlzLnVwbG9hZElucHV0LmZpbGVzWzBdO1xyXG59O1xyXG5cclxuRmlsZVBpY2tlci5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLnVwbG9hZElucHV0LnZhbHVlID0gJyc7XHJcbiAgICB0aGlzLmZwRmlsZU5hbWUudGV4dENvbnRlbnQgPSBERUZBVUxUX1ZBTFVFO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGaWxlUGlja2VyO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL2ZpbGUtcGlja2VyL2luZGV4LmpzIiwibGV0IFNlcnZlckVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLlNlcnZlckVycm9yO1xyXG5sZXQgQ2xpZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ2xpZW50RXJyb3I7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVybCwgZm9ybURhdGEsIGNiKSB7XHJcblx0dmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdHhoci51cGxvYWQub25wcm9ncmVzcyA9IGV2ZW50ID0+IHtcclxuXHRcdC8vY29uc29sZS5sb2coZXZlbnQubG9hZGVkICsgJyAvICcgKyBldmVudC50b3RhbCk7XHJcblx0fTtcclxuXHJcblx0eGhyLm9ubG9hZCA9IHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XHJcblx0XHRsZXQgcmVzcG9uc2U7XHJcblxyXG5cdFx0aWYgKHRoaXMucmVzcG9uc2VUZXh0KVxyXG5cdFx0XHRyZXNwb25zZSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpO1xyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGNiKG5ldyBTZXJ2ZXJFcnJvcignU2VydmVyIGlzIG5vdCByZXNwb25kaW5nJykpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGlmICh0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCAzMDApXHJcbiAgICAgICAgICAgIGNiKG51bGwsIHJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDQwMCAmJiB0aGlzLnN0YXR1cyA8IDUwMClcclxuICAgICAgICAgICAgY2IobmV3IENsaWVudEVycm9yKHJlc3BvbnNlLm1lc3NhZ2UpKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDUwMClcclxuICAgICAgICAgICAgY2IobmV3IFNlcnZlckVycm9yKHJlc3BvbnNlLm1lc3NhZ2UpKTtcclxuXHRcdFxyXG5cdH07XHJcblxyXG5cdHhoci5vcGVuKFwiUE9TVFwiLCB1cmwsIHRydWUpO1xyXG5cdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLVJlcXVlc3RlZC1XaXRoJywgJ1hNTEh0dHBSZXF1ZXN0Jyk7XHJcblx0eGhyLnNlbmQoZm9ybURhdGEpO1xyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvc2VuZEZvcm1EYXRhLmpzIiwibGV0IE1vZGFsID0gcmVxdWlyZShCTE9DS1MgKyAnbW9kYWwnKTtcclxubGV0IEZpbGVQaWNrZXIgPSByZXF1aXJlKEJMT0NLUyArICdmaWxlLXBpY2tlcicpO1xyXG5sZXQgQ2xpZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ2xpZW50RXJyb3I7XHJcblxyXG5cclxubGV0IFVwbG9hZEltYWdlTW9kYWxXaW5kb3cgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgTW9kYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgIHRoaXMuYXZhaWxhYmxlID0gdHJ1ZTtcclxuICAgIHRoaXMuc3RhdHVzID0gTW9kYWwuc3RhdHVzZXMuTUFKT1I7XHJcbn07XHJcblVwbG9hZEltYWdlTW9kYWxXaW5kb3cucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShNb2RhbC5wcm90b3R5cGUpO1xyXG5VcGxvYWRJbWFnZU1vZGFsV2luZG93LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFVwbG9hZEltYWdlTW9kYWxXaW5kb3c7XHJcblxyXG5cclxuVXBsb2FkSW1hZ2VNb2RhbFdpbmRvdy5wcm90b3R5cGUuc2V0RWxlbSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1cGxvYWQtaW1hZ2UtbW9kYWwtd2luZG93Jyk7XHJcbiAgICBpZiAoIXRoaXMuZWxlbSlcclxuICAgICAgICB0aGlzLmVsZW0gPSB0aGlzLnJlbmRlcldpbmRvdyhyZXF1aXJlKGBodG1sLWxvYWRlciEuL3dpbmRvd2ApKTtcclxuXHJcbiAgICB0aGlzLnVwbG9hZEJ1dHRvbiA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcudXBsb2FkLWltYWdlLW1vZGFsLXdpbmRvd19fYnV0dG9uJyk7XHJcbiAgICB0aGlzLnNwaW5uZXIgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLnVwbG9hZC1pbWFnZS1tb2RhbC13aW5kb3dfX3NwaW5uZXInKTtcclxuXHJcbiAgICB0aGlzLnVwbG9hZEltYWdlRmlsZVBpY2tlciA9IG5ldyBGaWxlUGlja2VyKHtcclxuICAgICAgICBlbGVtOiB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLmZpbGUtcGlja2VyJylcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuaW1hZ2VEZXNjcmlwdGlvbiA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYS50ZXh0Ym94X19maWVsZCcpO1xyXG4gICAgdGhpcy51cGxvYWRFcnJvck1lc3NhZ2UgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLndpbmRvd19fZXJyb3ItbWVzc2FnZScpO1xyXG5cclxuICAgIHRoaXMuZWxlbS5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgdGhpcy5vbkVsZW1DbGljayhlKTtcclxuXHJcbiAgICAgICAgaWYgKGUudGFyZ2V0ID09PSB0aGlzLnVwbG9hZEJ1dHRvbikge1xyXG4gICAgICAgICAgICBsZXQgZmlsZSA9IHRoaXMudXBsb2FkSW1hZ2VGaWxlUGlja2VyLmdldEZpbGUoKTtcclxuICAgICAgICAgICAgaWYgKGZpbGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0V2FpdGluZ01vZGUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBsb2FkSW1hZ2UoZmlsZSwgdGhpcy5pbWFnZURlc2NyaXB0aW9uLnZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuc2V0TGlzdGVuZXJzKCk7XHJcbn07XHJcblxyXG5VcGxvYWRJbWFnZU1vZGFsV2luZG93LnByb3RvdHlwZS51cGxvYWRJbWFnZSA9IGZ1bmN0aW9uIChmaWxlLCBkZXNjcmlwdGlvbikge1xyXG5cclxuICAgIGlmICh0aGlzLmF2YWlsYWJsZSkge1xyXG4gICAgICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcImltYWdlXCIsIGZpbGUpO1xyXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcImRlc2NyaXB0aW9uXCIsIGRlc2NyaXB0aW9uKTtcclxuXHJcbiAgICAgICAgdGhpcy5hdmFpbGFibGUgPSBmYWxzZTtcclxuICAgICAgICByZXF1aXJlKExJQlMgKyAnc2VuZEZvcm1EYXRhJykoXCIvaW1hZ2VcIiwgZm9ybURhdGEsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnVuc2V0V2FpdGluZ01vZGUoKTtcclxuICAgICAgICAgICAgdGhpcy5hdmFpbGFibGUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ3VwbG9hZC1pbWFnZS1tb2RhbC13aW5kb3dfX2ltYWdlLXVwbG9hZGVkJywge1xyXG4gICAgICAgICAgICAgICAgaW1hZ2VJZDogcmVzcG9uc2UuaW1hZ2VJZCxcclxuICAgICAgICAgICAgICAgIHByZXZpZXdVcmw6IHJlc3BvbnNlLnByZXZpZXdVcmxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn07XHJcblxyXG5VcGxvYWRJbWFnZU1vZGFsV2luZG93LnByb3RvdHlwZS5zZXRXYWl0aW5nTW9kZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMudXBsb2FkQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2J1dHRvbl9pbnZpc2libGUnKTtcclxuICAgIHRoaXMuc3Bpbm5lci5jbGFzc0xpc3QucmVtb3ZlKCdzcGlubmVyX2ludmlzaWJsZScpO1xyXG59O1xyXG5cclxuVXBsb2FkSW1hZ2VNb2RhbFdpbmRvdy5wcm90b3R5cGUudW5zZXRXYWl0aW5nTW9kZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMudXBsb2FkQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2J1dHRvbl9pbnZpc2libGUnKTtcclxuICAgIHRoaXMuc3Bpbm5lci5jbGFzc0xpc3QuYWRkKCdzcGlubmVyX2ludmlzaWJsZScpO1xyXG59O1xyXG5cclxuVXBsb2FkSW1hZ2VNb2RhbFdpbmRvdy5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIE1vZGFsLnByb3RvdHlwZS5zaG93LmFwcGx5KHRoaXMpO1xyXG5cclxuICAgIGlmICghdGhpcy5lbGVtKVxyXG4gICAgICAgIHRoaXMuc2V0RWxlbSgpO1xyXG5cclxuICAgIHRoaXMuY2xlYXIoKTtcclxuXHJcbiAgICB0aGlzLnVuc2V0V2FpdGluZ01vZGUoKTtcclxuXHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnd2luZG93X2ludmlzaWJsZScpO1xyXG59O1xyXG5cclxuVXBsb2FkSW1hZ2VNb2RhbFdpbmRvdy5wcm90b3R5cGUuZGVhY3RpdmF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCd3aW5kb3dfaW52aXNpYmxlJyk7XHJcbiAgICBNb2RhbC5wcm90b3R5cGUuZGVhY3RpdmF0ZS5hcHBseSh0aGlzKTtcclxufTtcclxuXHJcblVwbG9hZEltYWdlTW9kYWxXaW5kb3cucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy51cGxvYWRJbWFnZUZpbGVQaWNrZXIuY2xlYXIoKTtcclxuICAgIHRoaXMuaW1hZ2VEZXNjcmlwdGlvbi52YWx1ZSA9ICcnO1xyXG4gICAgdGhpcy5zZXRFcnJvcignJyk7XHJcbn07XHJcblxyXG5VcGxvYWRJbWFnZU1vZGFsV2luZG93LnByb3RvdHlwZS5zZXRFcnJvciA9IGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgdGhpcy51cGxvYWRFcnJvck1lc3NhZ2UudGV4dENvbnRlbnQgPSBlcnJvcjtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVXBsb2FkSW1hZ2VNb2RhbFdpbmRvdztcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Jsb2Nrcy91cGxvYWQtaW1hZ2UtbW9kYWwtd2luZG93L2luZGV4LmpzIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxkaXYgY2xhc3M9XFxcIndpbmRvdyB3aW5kb3dfaW52aXNpYmxlIG1vZGFsIG1vZGFsLXdpbmRvdyB1cGxvYWQtaW1hZ2UtbW9kYWwtd2luZG93XFxcIiBpZD1cXFwidXBsb2FkLWltYWdlLW1vZGFsLXdpbmRvd1xcXCI+XFxyXFxuXFx0PGRpdiBjbGFzcz1cXFwiaGVhZGVyIHdpbmRvd19faGVhZGVyXFxcIj5cXHJcXG5cXHRcXHRpbWFnZSB1cGxvYWRpbmdcXHJcXG5cXHQ8L2Rpdj5cXHJcXG5cXHQ8ZGl2IGNsYXNzPVxcXCJwYW5lbCB3aW5kb3dfX3BhbmVsXFxcIj5cXHJcXG5cXHRcXHRcXHJcXG5cXHRcXHQ8ZGl2IGNsYXNzPVxcXCJmaWxlLXBpY2tlciB1cGxvYWQtaW1hZ2UtbW9kYWwtd2luZG93X19maWxlLXBpY2tlclxcXCIgaWQ9XFxcImZpbGUtcGlja2VyXFxcIj5cXHJcXG5cXHRcXHRcXHQ8c3BhbiBjbGFzcz1cXFwiZmlsZS1waWNrZXJfX2ZpbGVuYW1lXFxcIj5ubyBmaWxlIGNob3Nlbjwvc3Bhbj5cXHJcXG5cXHRcXHRcXHQ8ZGl2IGNsYXNzPVxcXCJidXR0b24gZmlsZS1waWNrZXJfX2J1dHRvblxcXCI+Y2hvb3NlIGZpbGU8L2Rpdj5cXHJcXG5cXHRcXHQ8L2Rpdj5cXHRcXHQ8ZGl2IGNsYXNzPVxcXCJ0ZXh0Ym94IHVwbG9hZC1pbWFnZS1tb2RhbC13aW5kb3dfX3RleHRhcmVhIHRleHRhcmVhIHRleHRib3hfbm8tY2FwdGlvblxcXCI+XFxyXFxuXFx0XFx0XFx0PGRpdiBjbGFzcz1cXFwidGV4dGJveF9faW5mb1xcXCI+XFxyXFxuXFx0XFx0XFx0XFx0XFxyXFxuXFx0XFx0XFx0XFx0PHNwYW4gY2xhc3M9XFxcInRleHRib3hfX2Vycm9yXFxcIj48L3NwYW4+XFxyXFxuXFx0XFx0XFx0PC9kaXY+XFxyXFxuXFx0XFx0XFx0PHRleHRhcmVhIG5hbWU9XFxcIlxcXCIgY2xhc3M9XFxcInRleHRib3hfX2ZpZWxkXFxcIiBwbGFjZWhvbGRlcj1cXFwiZGVzY3JpcHRpb24gZ29lcyBoZXJl4oCmXFxcIj48L3RleHRhcmVhPlxcclxcblxcdFxcdDwvZGl2PlxcdFxcdDxzcGFuIGNsYXNzPVxcXCJ3aW5kb3dfX2Vycm9yLW1lc3NhZ2VcXFwiPjwvc3Bhbj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcInNwaW5uZXIgdXBsb2FkLWltYWdlLW1vZGFsLXdpbmRvd19fc3Bpbm5lciBzcGlubmVyX2ludmlzaWJsZVxcXCI+PC9kaXY+XFxyXFxuXFx0XFx0PGRpdiBjbGFzcz1cXFwiYnV0dG9uIHVwbG9hZC1pbWFnZS1tb2RhbC13aW5kb3dfX2J1dHRvblxcXCI+dXBsb2FkPC9kaXY+XFxyXFxuXFx0PC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImljb24tY3Jvc3MgbW9kYWwtY2xvc2UtYnV0dG9uXFxcIj48L2Rpdj48L2Rpdj5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBEOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svfi9odG1sLWxvYWRlciEuLi9ibG9ja3MvdXBsb2FkLWltYWdlLW1vZGFsLXdpbmRvdy93aW5kb3dcbi8vIG1vZHVsZSBpZCA9IDU3XG4vLyBtb2R1bGUgY2h1bmtzID0gMTIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQ2hIQTs7OzsiLCJzb3VyY2VSb290IjoiIn0=