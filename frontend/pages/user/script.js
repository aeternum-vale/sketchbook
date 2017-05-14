"use strict";

import './style.less';

let isLogged = false;



let userMenu = document.getElementsByClassName('user-menu')[0];
let linkListSwitch = document.getElementsByClassName('link-list-switch')[0];

if (!userMenu.classList.contains('user-menu_unlogged'))
	isLogged = true;

userMenu.onclick = function(e) {

	if (isLogged)
		this.classList.toggle('user-menu_active');
};

linkListSwitch.onclick = function(e) {
	this.classList.toggle('link-list-switch_active');
};



if (isLogged) {

	function upload(file) {

		var xhr = new XMLHttpRequest();

		xhr.upload.onprogress = function(event) {
			console.log(event.loaded + ' / ' + event.total);
		}

		xhr.onload = xhr.onerror = function() {
			if (this.status == 200) {
				console.log(xhr.responseText);
			} else {
				console.log("error " + this.status);
			}
		};

		xhr.open("POST", "/upload", true);
		//xhr.setRequestHeader('Content-Type', 'image/jpeg');
		//xhr.setRequestHeader('Content-Disposition','form-data; name="myfile"; filename="pic.jpg"');
		//xhr.setRequestHeader("Content-Type","application/octet-stream");
		//xhr.responseType = 'arraybuffer';
		var formData = new FormData();
		formData.append("image", file);
		xhr.send(formData);


		//xhr.send(file);

	}



	let uploadInput = document.createElement('input');
	uploadInput.type = "file";
	uploadInput.accept = "image/*";


	let uploadButton = document.getElementById('upload-button');


	uploadButton.onclick = function(e) {

		uploadInput.onchange = function(e) {
			if (uploadInput.value) {
				let file = uploadInput.files[0];
				if (file) {
					upload(file);
				}
			}
		}

		uploadInput.click();
	};
}