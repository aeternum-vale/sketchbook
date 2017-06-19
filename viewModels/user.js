let imagePaths = require('libs/imagePaths');

module.exports = function(user, loggedUserId) {

	let avatarFileNames;
	if (user.hasAvatar)
		avatarFileNames = imagePaths.getAvatarFileNamesById(user._id);
	else
        avatarFileNames = {
			big: '',
			medium: '',
			small: ''
		};

	let userViewModel = {
        _id: user._id,
		username: user.username,
    	name: user.name,
		surname: user.surname,
		country: user.country,
		hasAvatar: user.hasAvatar,
		description: user.description,
		created: user.created,
		links: user.links,
		subscribers: user.subscribers,
		subscriptions: user.subscriptions,
		isNarrator: !!(~user.subscribers.indexOf(loggedUserId)),
		isLoggedUser: !!(user._id === loggedUserId),
		images: user.images,
		likes: user.likes,
		comments: user.comments,
		avatarUrls: {
			big: `/${avatarFileNames.big}`,
			medium: `/${avatarFileNames.medium}`,
			small: `/${avatarFileNames.small}`
		},
		url: `/user/${user.username}`
	};

	return userViewModel;
};