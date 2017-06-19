let getObjectParticularClone = require('libs/getObjectParticularClone');
let userViewModel = require('viewModels/user');

module.exports = function(user, loggedUserId) {
    let truncatedUserNecessaryProperties = ['_id', 'username', 'url', 'avatarUrls', 'isNarrator', 'isLogged'];
    return getObjectParticularClone(userViewModel(user, loggedUserId), truncatedUserNecessaryProperties);
};
