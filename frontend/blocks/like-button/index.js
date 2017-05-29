module.exports = function(options) {

	let elem = options.elem;

	let likeAmount = +elem.dataset.likeAmount;
	let active = !!elem.dataset.active;
	let available = true;

	function setLike() {
		elem.textContent = `like ${likeAmount}`;
	}

	function toggle() {
		if (active) {
			elem.classList.remove('button_active');
			elem.classList.remove('like-button_active');
			likeAmount--;
			active = false;
		} else {
			elem.classList.add('button_active');
			elem.classList.add('like-button_active');
			likeAmount++;
			active = true;
		}
		setLike();
	}

	elem.onclick = function(e) {

		if (available) {
			available = false;
			toggle();


			require(LIBS + 'sendXHR')(null, 'POST', '/like', function(response) {
				if (response.success) {
					available = true;
				} else {
					toggle();
					available = true;
					alert('Server error. Please retry later.');
				}
			});

		}

	};

}