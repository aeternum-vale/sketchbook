module.exports = function(wrapper) {
	let msgWindow = document.createElement('DIV');
	msgWindow.className = 'window window_invisible modal-window message-modal-window';
	msgWindow.id = 'message-modal-window';
	msgWindow.innerHTML = 
	`<div class="header window__header">
	</div>
	
	<div class="panel window__panel">
		<div class="message-modal-window__message">
		</div>
	</div>`;

	wrapper.appendChild(msgWindow);
	return msgWindow;
};