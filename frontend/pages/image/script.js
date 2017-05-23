"use strict";

import './style.less';

//let imageId = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);

require(BLOCKS + 'comment-send')('comment-send');
require(BLOCKS + 'comments-section')('comments-section');

let deleteImage = document.getElementById('delete-image-button');

deleteImage.onclick = function(e) {

	let xhr = new XMLHttpRequest();
	xhr.open('DELETE', '/image', true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

	xhr.onreadystatechange = function() {
		if (this.readyState != 4) return;
		if (this.status != 200) {
			alert("Error sending request");
			return;
		}

		let response = JSON.parse(this.responseText);
		if (response.success) {
			if (response.url)
				window.location = response.url;
		} else
			alert('Server error. Please retry later.')
	};

	xhr.send();
};