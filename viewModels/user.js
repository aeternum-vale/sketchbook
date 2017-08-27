let imagePaths = require('libs/imagePaths');
let config = require('config');


/**
 * Returns viewModel for User
 *
 * @param {object} user
 * @param {number} loggedUserId
 * @return {object}
 */

module.exports = function (user, loggedUserId) {

    let avatarFileNames;
    let anonAvatarUrl = config.get('static:anonAvatarUrl');

    if (user.hasAvatar)
        avatarFileNames = imagePaths.getAvatarFileNamesById(user._id);

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
        isLoggedUser: (user._id === loggedUserId),
        images: user.images,
        likes: user.likes,
        comments: user.comments,
        avatarUrls: (user.hasAvatar) ? {
                big: `/${avatarFileNames.big}`,
                medium: `/${avatarFileNames.medium}`,
                small: `/${avatarFileNames.small}`
            } : {
                big: anonAvatarUrl,
                medium: anonAvatarUrl,
                small: anonAvatarUrl
            },
        url: `/user/${user.username}`
    };

    return userViewModel;
};