webpackJsonp([11,13],{

/***/ 14:
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

	var ServerError = __webpack_require__(14).ServerError;
	var ClientError = __webpack_require__(14).ClientError;

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

/***/ 55:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var Modal = __webpack_require__(16);
	var FilePicker = __webpack_require__(50);
	var ClientError = __webpack_require__(14).ClientError;

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
	        __webpack_require__(51)("/image", formData, function (err, response) {

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

/***/ 56:
/***/ (function(module, exports) {

	module.exports = "<div class=\"window window_invisible modal modal-window upload-image-modal-window\" id=\"upload-image-modal-window\">\r\n\t<div class=\"header window__header\">\r\n\t\timage uploading\r\n\t</div>\r\n\t<div class=\"panel window__panel\">\r\n\t\t\r\n\t\t<div class=\"file-picker upload-image-modal-window__file-picker\" id=\"file-picker\">\r\n\t\t\t<span class=\"file-picker__filename\">no file chosen</span>\r\n\t\t\t<div class=\"button file-picker__button\">choose file</div>\r\n\t\t</div>\t\t<div class=\"textbox upload-image-modal-window__textarea textarea textbox_no-caption\">\r\n\t\t\t<div class=\"textbox__info\">\r\n\t\t\t\t\r\n\t\t\t\t<span class=\"textbox__error\"></span>\r\n\t\t\t</div>\r\n\t\t\t<textarea name=\"\" class=\"textbox__field\" placeholder=\"description goes here…\"></textarea>\r\n\t\t</div>\t\t<span class=\"window__error-message\"></span>\r\n        <div class=\"spinner upload-image-modal-window__spinner spinner_invisible\"></div>\r\n\t\t<div class=\"button upload-image-modal-window__button\">upload</div>\r\n\t</div>\r\n    <div class=\"icon-cross modal-close-button\"></div></div>";

/***/ })

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTEuMTEuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvY29tcG9uZW50RXJyb3JzLmpzP2FjYjUqKioiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy9maWxlLXBpY2tlci9pbmRleC5qcz9lOWQ3Iiwid2VicGFjazovLy9EOi9ZYW5kZXhEaXNrL3NrZXRjaGJvb2svbGlicy9zZW5kRm9ybURhdGEuanM/NjliYiIsIndlYnBhY2s6Ly8vLi4vYmxvY2tzL3VwbG9hZC1pbWFnZS1tb2RhbC13aW5kb3cvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL2Jsb2Nrcy91cGxvYWQtaW1hZ2UtbW9kYWwtd2luZG93L3dpbmRvdyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBDdXN0b21FcnJvcihtZXNzYWdlKSB7XHJcblx0dGhpcy5uYW1lID0gXCJDdXN0b21FcnJvclwiO1xyXG5cdHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcblxyXG5cdGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSlcclxuXHRcdEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIEN1c3RvbUVycm9yKTtcclxuXHRlbHNlXHJcblx0XHR0aGlzLnN0YWNrID0gKG5ldyBFcnJvcigpKS5zdGFjaztcclxufVxyXG5DdXN0b21FcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XHJcbkN1c3RvbUVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEN1c3RvbUVycm9yO1xyXG5cclxuXHJcbmZ1bmN0aW9uIENvbXBvbmVudEVycm9yKG1lc3NhZ2UsIHN0YXR1cykge1xyXG5cdEN1c3RvbUVycm9yLmNhbGwodGhpcywgbWVzc2FnZSB8fCAnQW4gZXJyb3IgaGFzIG9jY3VycmVkJyApO1xyXG5cdHRoaXMubmFtZSA9IFwiQ29tcG9uZW50RXJyb3JcIjtcclxuXHR0aGlzLnN0YXR1cyA9IHN0YXR1cztcclxufVxyXG5Db21wb25lbnRFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEN1c3RvbUVycm9yLnByb3RvdHlwZSk7XHJcbkNvbXBvbmVudEVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENvbXBvbmVudEVycm9yO1xyXG5cclxuZnVuY3Rpb24gQ2xpZW50RXJyb3IobWVzc2FnZSwgZGV0YWlsLCBzdGF0dXMpIHtcclxuXHRDb21wb25lbnRFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ0FuIGVycm9yIGhhcyBvY2N1cnJlZC4gQ2hlY2sgaWYgamF2YXNjcmlwdCBpcyBlbmFibGVkJywgc3RhdHVzKTtcclxuXHR0aGlzLm5hbWUgPSBcIkNsaWVudEVycm9yXCI7XHJcblx0dGhpcy5kZXRhaWwgPSBkZXRhaWw7XHJcbn1cclxuQ2xpZW50RXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb21wb25lbnRFcnJvci5wcm90b3R5cGUpO1xyXG5DbGllbnRFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDbGllbnRFcnJvcjtcclxuXHJcblxyXG5mdW5jdGlvbiBJbWFnZU5vdEZvdW5kKG1lc3NhZ2UpIHtcclxuICAgIENsaWVudEVycm9yLmNhbGwodGhpcywgbWVzc2FnZSB8fCAnSW1hZ2Ugbm90IGZvdW5kLiBJdCBwcm9iYWJseSBoYXMgYmVlbiByZW1vdmVkJywgbnVsbCwgNDA0KTtcclxuICAgIHRoaXMubmFtZSA9IFwiSW1hZ2VOb3RGb3VuZFwiO1xyXG59XHJcbkltYWdlTm90Rm91bmQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDbGllbnRFcnJvci5wcm90b3R5cGUpO1xyXG5JbWFnZU5vdEZvdW5kLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEltYWdlTm90Rm91bmQ7XHJcblxyXG5mdW5jdGlvbiBTZXJ2ZXJFcnJvcihtZXNzYWdlLCBzdGF0dXMpIHtcclxuXHRDb21wb25lbnRFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgJ1RoZXJlIGlzIHNvbWUgZXJyb3Igb24gdGhlIHNlcnZlciBzaWRlJywgc3RhdHVzKTtcclxuXHR0aGlzLm5hbWUgPSBcIlNlcnZlckVycm9yXCI7XHJcbn1cclxuU2VydmVyRXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb21wb25lbnRFcnJvci5wcm90b3R5cGUpO1xyXG5TZXJ2ZXJFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTZXJ2ZXJFcnJvcjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdENvbXBvbmVudEVycm9yLFxyXG5cdENsaWVudEVycm9yLFxyXG4gICAgSW1hZ2VOb3RGb3VuZCxcclxuXHRTZXJ2ZXJFcnJvclxyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL2xpYnMvY29tcG9uZW50RXJyb3JzLmpzIiwiY29uc3QgREVGQVVMVF9WQUxVRSA9ICdubyBmaWxlIGNob3Nlbic7XHJcbmNvbnN0IERFRkFVTFRfRk5fTEVOR1RIID0gREVGQVVMVF9WQUxVRS5sZW5ndGg7XHJcblxyXG5sZXQgRmlsZVBpY2tlciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgdGhpcy5maWxlTmFtZUxlbmd0aCA9IG9wdGlvbnMuZmlsZU5hbWVMZW5ndGggfHwgREVGQVVMVF9GTl9MRU5HVEg7XHJcblxyXG4gICAgdGhpcy51cGxvYWRJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICB0aGlzLnVwbG9hZElucHV0LnR5cGUgPSBcImZpbGVcIjtcclxuICAgIHRoaXMudXBsb2FkSW5wdXQuYWNjZXB0ID0gXCJpbWFnZS8qXCI7XHJcblxyXG4gICAgdGhpcy5lbGVtID0gb3B0aW9ucy5lbGVtO1xyXG4gICAgdGhpcy5mcEJ1dHRvbiA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuZmlsZS1waWNrZXJfX2J1dHRvbicpO1xyXG4gICAgdGhpcy5mcEZpbGVOYW1lID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5maWxlLXBpY2tlcl9fZmlsZW5hbWUnKTtcclxuXHJcbiAgICB0aGlzLmZwQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgdGhpcy51cGxvYWRJbnB1dC5jbGljaygpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy51cGxvYWRJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBlID0+IHtcclxuICAgICAgICB0aGlzLnNldFZpc2libGVGaWxlTmFtZSgpO1xyXG4gICAgfSk7XHJcblxyXG59O1xyXG5cclxuRmlsZVBpY2tlci5wcm90b3R5cGUuc2V0VmlzaWJsZUZpbGVOYW1lID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGZpbGVuYW1lID0gdGhpcy51cGxvYWRJbnB1dC52YWx1ZS5zdWJzdHJpbmcodGhpcy51cGxvYWRJbnB1dC52YWx1ZS5sYXN0SW5kZXhPZignXFxcXCcpICsgMSk7XHJcblxyXG4gICAgbGV0IHZpc2libGVGaWxlTmFtZTtcclxuICAgIGxldCBwYXJ0U2l6ZSA9IH5+KCh0aGlzLmZpbGVOYW1lTGVuZ3RoIC0gMSkgLyAyKTtcclxuXHJcbiAgICBpZiAoZmlsZW5hbWUubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIHZpc2libGVGaWxlTmFtZSA9IERFRkFVTFRfVkFMVUU7XHJcbiAgICBlbHNlIGlmIChmaWxlbmFtZS5sZW5ndGggPD0gdGhpcy5maWxlTmFtZUxlbmd0aCkge1xyXG4gICAgICAgIHRoaXMuZnBGaWxlTmFtZS50aXRsZSA9ICcnO1xyXG4gICAgICAgIHZpc2libGVGaWxlTmFtZSA9IGZpbGVuYW1lO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmZwRmlsZU5hbWUudGl0bGUgPSBmaWxlbmFtZTtcclxuICAgICAgICB2aXNpYmxlRmlsZU5hbWUgPSBmaWxlbmFtZS5zbGljZSgwLCBwYXJ0U2l6ZSkgKyAn4oCmJyArIGZpbGVuYW1lLnNsaWNlKC1wYXJ0U2l6ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5mcEZpbGVOYW1lLnRleHRDb250ZW50ID0gdmlzaWJsZUZpbGVOYW1lO1xyXG59O1xyXG5cclxuRmlsZVBpY2tlci5wcm90b3R5cGUuZ2V0RmlsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB0aGlzLnVwbG9hZElucHV0LmZpbGVzWzBdO1xyXG59O1xyXG5cclxuRmlsZVBpY2tlci5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLnVwbG9hZElucHV0LnZhbHVlID0gJyc7XHJcbiAgICB0aGlzLmZwRmlsZU5hbWUudGV4dENvbnRlbnQgPSBERUZBVUxUX1ZBTFVFO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGaWxlUGlja2VyO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vYmxvY2tzL2ZpbGUtcGlja2VyL2luZGV4LmpzIiwibGV0IFNlcnZlckVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLlNlcnZlckVycm9yO1xyXG5sZXQgQ2xpZW50RXJyb3IgPSByZXF1aXJlKExJQlMgKyAnY29tcG9uZW50RXJyb3JzJykuQ2xpZW50RXJyb3I7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1cmwsIGZvcm1EYXRhLCBjYikge1xyXG4gICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgLy8geGhyLnVwbG9hZC5vbnByb2dyZXNzID0gZXZlbnQgPT4ge1xyXG4gICAgLy8gXHQgICBjb25zb2xlLmxvZyhldmVudC5sb2FkZWQgKyAnIC8gJyArIGV2ZW50LnRvdGFsKTtcclxuICAgIC8vIH07XHJcblxyXG4gICAgeGhyLm9ubG9hZCA9IHhoci5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGxldCByZXNwb25zZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucmVzcG9uc2VUZXh0KVxyXG4gICAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjYihuZXcgU2VydmVyRXJyb3IoJ1NlcnZlciBpcyBub3QgcmVzcG9uZGluZycpKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCAzMDApXHJcbiAgICAgICAgICAgIGNiKG51bGwsIHJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDQwMCAmJiB0aGlzLnN0YXR1cyA8IDUwMClcclxuICAgICAgICAgICAgY2IobmV3IENsaWVudEVycm9yKHJlc3BvbnNlLm1lc3NhZ2UpKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDUwMClcclxuICAgICAgICAgICAgY2IobmV3IFNlcnZlckVycm9yKHJlc3BvbnNlLm1lc3NhZ2UpKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHhoci5vcGVuKFwiUE9TVFwiLCB1cmwsIHRydWUpO1xyXG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtUmVxdWVzdGVkLVdpdGgnLCAnWE1MSHR0cFJlcXVlc3QnKTtcclxuICAgIHhoci5zZW5kKGZvcm1EYXRhKTtcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEQ6L1lhbmRleERpc2svc2tldGNoYm9vay9saWJzL3NlbmRGb3JtRGF0YS5qcyIsImxldCBNb2RhbCA9IHJlcXVpcmUoQkxPQ0tTICsgJ21vZGFsJyk7XHJcbmxldCBGaWxlUGlja2VyID0gcmVxdWlyZShCTE9DS1MgKyAnZmlsZS1waWNrZXInKTtcclxubGV0IENsaWVudEVycm9yID0gcmVxdWlyZShMSUJTICsgJ2NvbXBvbmVudEVycm9ycycpLkNsaWVudEVycm9yO1xyXG5cclxuXHJcbmxldCBVcGxvYWRJbWFnZU1vZGFsV2luZG93ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIE1vZGFsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICB0aGlzLmF2YWlsYWJsZSA9IHRydWU7XHJcbiAgICB0aGlzLnN0YXR1cyA9IE1vZGFsLnN0YXR1c2VzLk1BSk9SO1xyXG59O1xyXG5VcGxvYWRJbWFnZU1vZGFsV2luZG93LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoTW9kYWwucHJvdG90eXBlKTtcclxuVXBsb2FkSW1hZ2VNb2RhbFdpbmRvdy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBVcGxvYWRJbWFnZU1vZGFsV2luZG93O1xyXG5cclxuXHJcblVwbG9hZEltYWdlTW9kYWxXaW5kb3cucHJvdG90eXBlLnNldEVsZW0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXBsb2FkLWltYWdlLW1vZGFsLXdpbmRvdycpO1xyXG4gICAgaWYgKCF0aGlzLmVsZW0pXHJcbiAgICAgICAgdGhpcy5lbGVtID0gdGhpcy5yZW5kZXJXaW5kb3cocmVxdWlyZShgaHRtbC1sb2FkZXIhLi93aW5kb3dgKSk7XHJcblxyXG4gICAgdGhpcy51cGxvYWRCdXR0b24gPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLnVwbG9hZC1pbWFnZS1tb2RhbC13aW5kb3dfX2J1dHRvbicpO1xyXG4gICAgdGhpcy5zcGlubmVyID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy51cGxvYWQtaW1hZ2UtbW9kYWwtd2luZG93X19zcGlubmVyJyk7XHJcblxyXG4gICAgdGhpcy51cGxvYWRJbWFnZUZpbGVQaWNrZXIgPSBuZXcgRmlsZVBpY2tlcih7XHJcbiAgICAgICAgZWxlbTogdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy5maWxlLXBpY2tlcicpXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmltYWdlRGVzY3JpcHRpb24gPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcigndGV4dGFyZWEudGV4dGJveF9fZmllbGQnKTtcclxuICAgIHRoaXMudXBsb2FkRXJyb3JNZXNzYWdlID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX2Vycm9yLW1lc3NhZ2UnKTtcclxuXHJcbiAgICB0aGlzLmVsZW0ub25jbGljayA9IGUgPT4ge1xyXG4gICAgICAgIHRoaXMub25FbGVtQ2xpY2soZSk7XHJcblxyXG4gICAgICAgIGlmIChlLnRhcmdldCA9PT0gdGhpcy51cGxvYWRCdXR0b24pIHtcclxuICAgICAgICAgICAgbGV0IGZpbGUgPSB0aGlzLnVwbG9hZEltYWdlRmlsZVBpY2tlci5nZXRGaWxlKCk7XHJcbiAgICAgICAgICAgIGlmIChmaWxlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFdhaXRpbmdNb2RlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwbG9hZEltYWdlKGZpbGUsIHRoaXMuaW1hZ2VEZXNjcmlwdGlvbi52YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnNldExpc3RlbmVycygpO1xyXG59O1xyXG5cclxuVXBsb2FkSW1hZ2VNb2RhbFdpbmRvdy5wcm90b3R5cGUudXBsb2FkSW1hZ2UgPSBmdW5jdGlvbiAoZmlsZSwgZGVzY3JpcHRpb24pIHtcclxuXHJcbiAgICBpZiAodGhpcy5hdmFpbGFibGUpIHtcclxuICAgICAgICBsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJpbWFnZVwiLCBmaWxlKTtcclxuICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJkZXNjcmlwdGlvblwiLCBkZXNjcmlwdGlvbik7XHJcblxyXG4gICAgICAgIHRoaXMuYXZhaWxhYmxlID0gZmFsc2U7XHJcbiAgICAgICAgcmVxdWlyZShMSUJTICsgJ3NlbmRGb3JtRGF0YScpKFwiL2ltYWdlXCIsIGZvcm1EYXRhLCAoZXJyLCByZXNwb25zZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgdGhpcy51bnNldFdhaXRpbmdNb2RlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCd1cGxvYWQtaW1hZ2UtbW9kYWwtd2luZG93X19pbWFnZS11cGxvYWRlZCcsIHtcclxuICAgICAgICAgICAgICAgIGltYWdlSWQ6IHJlc3BvbnNlLmltYWdlSWQsXHJcbiAgICAgICAgICAgICAgICBwcmV2aWV3VXJsOiByZXNwb25zZS5wcmV2aWV3VXJsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuVXBsb2FkSW1hZ2VNb2RhbFdpbmRvdy5wcm90b3R5cGUuc2V0V2FpdGluZ01vZGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLnVwbG9hZEJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidXR0b25faW52aXNpYmxlJyk7XHJcbiAgICB0aGlzLnNwaW5uZXIuY2xhc3NMaXN0LnJlbW92ZSgnc3Bpbm5lcl9pbnZpc2libGUnKTtcclxufTtcclxuXHJcblVwbG9hZEltYWdlTW9kYWxXaW5kb3cucHJvdG90eXBlLnVuc2V0V2FpdGluZ01vZGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLnVwbG9hZEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdidXR0b25faW52aXNpYmxlJyk7XHJcbiAgICB0aGlzLnNwaW5uZXIuY2xhc3NMaXN0LmFkZCgnc3Bpbm5lcl9pbnZpc2libGUnKTtcclxufTtcclxuXHJcblVwbG9hZEltYWdlTW9kYWxXaW5kb3cucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBNb2RhbC5wcm90b3R5cGUuc2hvdy5hcHBseSh0aGlzKTtcclxuXHJcbiAgICBpZiAoIXRoaXMuZWxlbSlcclxuICAgICAgICB0aGlzLnNldEVsZW0oKTtcclxuXHJcbiAgICB0aGlzLmNsZWFyKCk7XHJcblxyXG4gICAgdGhpcy51bnNldFdhaXRpbmdNb2RlKCk7XHJcblxyXG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3dpbmRvd19pbnZpc2libGUnKTtcclxufTtcclxuXHJcblVwbG9hZEltYWdlTW9kYWxXaW5kb3cucHJvdG90eXBlLmRlYWN0aXZhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnd2luZG93X2ludmlzaWJsZScpO1xyXG4gICAgTW9kYWwucHJvdG90eXBlLmRlYWN0aXZhdGUuYXBwbHkodGhpcyk7XHJcbn07XHJcblxyXG5VcGxvYWRJbWFnZU1vZGFsV2luZG93LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMudXBsb2FkSW1hZ2VGaWxlUGlja2VyLmNsZWFyKCk7XHJcbiAgICB0aGlzLmltYWdlRGVzY3JpcHRpb24udmFsdWUgPSAnJztcclxuICAgIHRoaXMuc2V0RXJyb3IoJycpO1xyXG59O1xyXG5cclxuVXBsb2FkSW1hZ2VNb2RhbFdpbmRvdy5wcm90b3R5cGUuc2V0RXJyb3IgPSBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgIHRoaXMudXBsb2FkRXJyb3JNZXNzYWdlLnRleHRDb250ZW50ID0gZXJyb3I7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFVwbG9hZEltYWdlTW9kYWxXaW5kb3c7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9ibG9ja3MvdXBsb2FkLWltYWdlLW1vZGFsLXdpbmRvdy9pbmRleC5qcyIsIm1vZHVsZS5leHBvcnRzID0gXCI8ZGl2IGNsYXNzPVxcXCJ3aW5kb3cgd2luZG93X2ludmlzaWJsZSBtb2RhbCBtb2RhbC13aW5kb3cgdXBsb2FkLWltYWdlLW1vZGFsLXdpbmRvd1xcXCIgaWQ9XFxcInVwbG9hZC1pbWFnZS1tb2RhbC13aW5kb3dcXFwiPlxcclxcblxcdDxkaXYgY2xhc3M9XFxcImhlYWRlciB3aW5kb3dfX2hlYWRlclxcXCI+XFxyXFxuXFx0XFx0aW1hZ2UgdXBsb2FkaW5nXFxyXFxuXFx0PC9kaXY+XFxyXFxuXFx0PGRpdiBjbGFzcz1cXFwicGFuZWwgd2luZG93X19wYW5lbFxcXCI+XFxyXFxuXFx0XFx0XFxyXFxuXFx0XFx0PGRpdiBjbGFzcz1cXFwiZmlsZS1waWNrZXIgdXBsb2FkLWltYWdlLW1vZGFsLXdpbmRvd19fZmlsZS1waWNrZXJcXFwiIGlkPVxcXCJmaWxlLXBpY2tlclxcXCI+XFxyXFxuXFx0XFx0XFx0PHNwYW4gY2xhc3M9XFxcImZpbGUtcGlja2VyX19maWxlbmFtZVxcXCI+bm8gZmlsZSBjaG9zZW48L3NwYW4+XFxyXFxuXFx0XFx0XFx0PGRpdiBjbGFzcz1cXFwiYnV0dG9uIGZpbGUtcGlja2VyX19idXR0b25cXFwiPmNob29zZSBmaWxlPC9kaXY+XFxyXFxuXFx0XFx0PC9kaXY+XFx0XFx0PGRpdiBjbGFzcz1cXFwidGV4dGJveCB1cGxvYWQtaW1hZ2UtbW9kYWwtd2luZG93X190ZXh0YXJlYSB0ZXh0YXJlYSB0ZXh0Ym94X25vLWNhcHRpb25cXFwiPlxcclxcblxcdFxcdFxcdDxkaXYgY2xhc3M9XFxcInRleHRib3hfX2luZm9cXFwiPlxcclxcblxcdFxcdFxcdFxcdFxcclxcblxcdFxcdFxcdFxcdDxzcGFuIGNsYXNzPVxcXCJ0ZXh0Ym94X19lcnJvclxcXCI+PC9zcGFuPlxcclxcblxcdFxcdFxcdDwvZGl2PlxcclxcblxcdFxcdFxcdDx0ZXh0YXJlYSBuYW1lPVxcXCJcXFwiIGNsYXNzPVxcXCJ0ZXh0Ym94X19maWVsZFxcXCIgcGxhY2Vob2xkZXI9XFxcImRlc2NyaXB0aW9uIGdvZXMgaGVyZeKAplxcXCI+PC90ZXh0YXJlYT5cXHJcXG5cXHRcXHQ8L2Rpdj5cXHRcXHQ8c3BhbiBjbGFzcz1cXFwid2luZG93X19lcnJvci1tZXNzYWdlXFxcIj48L3NwYW4+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzcGlubmVyIHVwbG9hZC1pbWFnZS1tb2RhbC13aW5kb3dfX3NwaW5uZXIgc3Bpbm5lcl9pbnZpc2libGVcXFwiPjwvZGl2PlxcclxcblxcdFxcdDxkaXYgY2xhc3M9XFxcImJ1dHRvbiB1cGxvYWQtaW1hZ2UtbW9kYWwtd2luZG93X19idXR0b25cXFwiPnVwbG9hZDwvZGl2PlxcclxcblxcdDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJpY29uLWNyb3NzIG1vZGFsLWNsb3NlLWJ1dHRvblxcXCI+PC9kaXY+PC9kaXY+XCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gRDovWWFuZGV4RGlzay9za2V0Y2hib29rL34vaHRtbC1sb2FkZXIhLi4vYmxvY2tzL3VwbG9hZC1pbWFnZS1tb2RhbC13aW5kb3cvd2luZG93XG4vLyBtb2R1bGUgaWQgPSA1NlxuLy8gbW9kdWxlIGNodW5rcyA9IDExIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQ2hIQTs7OzsiLCJzb3VyY2VSb290IjoiIn0=