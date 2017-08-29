let User = require('models/user');
let userViewModel = require('viewModels/user');
let co = require('co');
let debug = require('debug')('app:addLoggedUser');


module.exports = function (req, res, next) {
    if (req.session.userId)
        co(function*() {

            if (!User.indexesEnsured)
                yield User.ensureIndexes();
            let rawUser = yield User.findById(req.session.userId).exec();

            //debug('rawUser:', rawUser);
            return {
                userViewModel: yield userViewModel(rawUser),
                rawUser
            };

        }).then(result => {

            res.locals.loggedUser = result.userViewModel;
            res.loggedUser = result.rawUser;

            next();
        }).catch(err => {
            next(err);
        });
    else
        next();
};