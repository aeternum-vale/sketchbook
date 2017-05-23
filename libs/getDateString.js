let config = require('config');
let moment = require('moment');

module.exports = function(date) {
	let created = moment(date);
	let daysPassed = moment().diff(created, 'days', true);

	let createDateStr;
	if (daysPassed >= config.get('image:relativeTimeLimitDays'))
		createDateStr = created.format("D MMM YYYY HH:mm");
	else
		createDateStr = created.fromNow();

	return createDateStr;
};