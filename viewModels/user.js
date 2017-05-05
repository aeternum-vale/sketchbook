module.exports = function(user) {
	return {
		username: user.username,
		images: user.images,
		subscribes: user.subscribes,
		links: user.links
	};
}