module.exports = function(obj, properties) {
	let clone = {};
	properties.forEach(property => {
		clone[property] = obj[property];
	});
	return clone;
};