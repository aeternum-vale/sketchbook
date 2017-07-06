let Dropdown = require(BLOCKS + 'dropdown');
let subscribeButtonElem;


if (subscribeButtonElem = document.getElementById('subscribe-button')) {
	let SubscribeButton = require(BLOCKS + 'subscribe-button');
	let subscribeButton = new SubscribeButton({
		elem: subscribeButtonElem
	});

	let subscribersNumberElem = document.getElementById('subscribers-number');
	let subscribersNumber = +subscribersNumberElem.textContent;

	subscribeButton.on('change', function() {
		if (subscribeButton.active)
			subscribersNumberElem.textContent = ++subscribersNumber;
		else
			subscribersNumberElem.textContent = --subscribersNumber;
	});

}

let userMenuDropdown = new Dropdown({
	elem: document.getElementById('user-menu'),
	className: 'header-element'
});
