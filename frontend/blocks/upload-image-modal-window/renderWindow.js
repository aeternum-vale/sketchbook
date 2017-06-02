module.exports = function(wrapper) {
	let uplWindow = document.createElement('DIV');
	uplWindow.className = 'window window_invisible modal-window upload-image-modal-window';
	uplWindow.id = 'upload-image-modal-window';
	uplWindow.innerHTML = 
	`<div class="header window__header">
		image uploading
	</div>
	<div class="panel window__panel">
		<div class="file-picker window__file-picker">
			<span class="file-picker__filename">no file chosen</span>
			<div class="button file-picker__button">choose file</div>
		</div>

		<textarea class="window__textarea" placeholder="description goes here…"></textarea>

		<span class="window__error-message"></span>

		<div class="button button__window upload-image-button">upload</div>
	</div>`;

	wrapper.appendChild(uplWindow);
	return uplWindow;
};