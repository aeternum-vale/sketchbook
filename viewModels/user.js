let imagePaths = require('libs/imagePaths');
let config = require('config');
let co = require('co');

/**
 * Returns viewModel for User
 *
 * @param {object} user
 * @param {number} loggedUserId
 * @return {object}
 */

module.exports = function (user, loggedUserId) {
    return co(function*() {
        let avatarFileNames;
        let anonAvatarUrl = config.get('static:anonAvatarUrl');

        if (user.hasAvatar)
            avatarUrls = yield imagePaths.getAvatarUrls(user._id);

        return {
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
            avatarUrls: (user.hasAvatar) ? avatarUrls : {
                    big: anonAvatarUrl,
                    medium: anonAvatarUrl,
                    small: anonAvatarUrl
                },
            url: `/user/${user.username}`
        };
    });


};