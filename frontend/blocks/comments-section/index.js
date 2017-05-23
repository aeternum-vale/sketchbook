function setOnClick(commentSectionId) {
	
	let commentSection = document.getElementById(commentSectionId);

	commentSection.onclick = function (e) {
		if (!e.target.classList.contains('comment__close-button')) return;

		let comment = e.target.closest('.comment');


		let body = `commentId=${
         	encodeURIComponent(comment.dataset.id)}`;

		let xhr = new XMLHttpRequest();
		xhr.open("DELETE", '/comment', true);
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

}

module.exports = setOnClick;