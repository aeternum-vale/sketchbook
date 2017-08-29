let getObjectParticularClone = require('libs/getObjectParticularClone');
let userViewModel = require('viewModels/user');
let co = require('co');

module.exports = function(user, loggedUserId) {
    return co(function*() {
        let truncatedUserNecessaryProperties = ['_id', 'username', 'url', 'avatarUrls', 'isNarrator', 'isLogged'];
        return getObjectParticularClone(yield userViewModel(user, loggedUserId), truncatedUserNecessaryProperties);
    });

};
