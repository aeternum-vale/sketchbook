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

/*	let uploadInput = document.createElement('input');
	uploadInput.type = "file";
	uploadInput.accept = "image/*";

	let filePicker = document.getElementsByClassName('file-picker')[0];
	let fpButton = filePicker.querySelector('.file-picker__button');
	let fpFileName = filePicker.querySelector('.file-picker__filename');

	let uploadWindowCaller = document.getElementById('upload-button');
	let uploadButton = document.getElementById('upload');


	fpButton.onclick = function(e) {
		uploadInput.click();
	};

	uploadInput.onchange = function(e) {
		fpFileName.textContent = this.value;
	};


	uploadButton.click = function(e) {
		if (uploadInput.value) {
			let file = uploadInput.files[0];
			if (file) {
				upload(file);
			}
		}
	};*/



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


/*
	uploadButton.onclick = function(e) {

		return false;


	};*/
}