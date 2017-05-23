module.exports = function (id) {
	let commentSendForm = document.getElementById(id);
	let commentSendButton = commentSendForm.querySelector('.comment-send__send-button');
	let commentSendTextarea = commentSendForm.querySelector('.comment-send__textarea');


	commentSendButton.onclick = function() {


		//alert(commentSendTextarea.value + " " + commentSendForm.dataset.imageId);

		let body = `text=${
         	encodeURIComponent(commentSendTextarea.value)}`;

		let xhr = new XMLHttpRequest();
		xhr.open("POST", '/comment', true);
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

			} else
				alert('Server error. Please retry later.')
		};

		xhr.send(body);
	}
};