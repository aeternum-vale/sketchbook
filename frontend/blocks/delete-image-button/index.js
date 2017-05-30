let DeleteImageButton = function(options) {
	this.elem = options.elem;

	this.elem .onclick = function(e) {
		require(LIBS + 'sendXHR')(null, 'DELETE', '/image', function(response) {
			if (response.success) {
				if (response.url)
					window.location = response.url;
			} else
				alert('Server error. Please retry later.')
		});
	};
}

module.exports = DeleteImageButton;