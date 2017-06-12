let User = require('models/user');
let Image = require('models/image');
let userViewModel = require('viewModels/user');
let imagePreviewViewModel = require('viewModels/imagePreview');

let co = require('co');
let checkUserData = require('libs/checkUserData');
let PropertyError = require('error').PropertyError;
let duplicatingUniquePropertyError = require('error').duplicatingUniquePropertyError;
let LoginError = require('error').LoginError;
let HttpError = require('error').HttpError;
let InvalidImage = require('error').InvalidImage;

let config = require('config');
let debug = require('debug')('app:user:controller');
let imagePaths = require('libs/imagePaths');
let imageManipulation = require('libs/imageManipulation');
let path = require('path');
let fs = require('fs');
let url = require('url');

let addLoggedUser = require('middleware/addLoggedUser');
let addRefererParams = require('middleware/addRefererParams');
let isAuth = require('middleware/isAuth');

let formidable = require('formidable');
let form = new formidable.IncomingForm();
let uploadDir = path.resolve(config.get('userdata:dir'));
form.uploadDir = uploadDir;


function usersListRequestListener(req, res, next) {

    co(function*() {

        if (!User.indexesEnsured)
            yield User.ensureIndexes();

        return new Promise((resolve, reject) => {
            User.find({}, function(err, users) {
                if (err) reject(err);
                resolve(users);
            });
        });
    }).then(result => {
        res.json(result);
    }).catch(err => {
        next(err);
    });
}

function userProfileRequestListener(req, res, next) {
    co(function*() {

        if (!User.indexesEnsured)
            yield User.ensureIndexes();

        let pageUser = yield User.findOne({
            username: req.params.username
        }).populate('images').exec();

        if (!pageUser)
            throw new HttpError(404, 'this user doesn\'t exist');

        return pageUser;

    }).then(pageUser => {
        res.locals.pageUser = userViewModel(pageUser);


        if (res.loggedUser) {
            res.locals.ownPage = (res.loggedUser._id === pageUser._id);

            if (~pageUser.subscribers.indexOf(res.loggedUser._id))
                res.locals.isSubscribed = true;
        }

        res.locals.page = 'user';

        res.locals.pageUser.images.forEach(item => {
            item.previewUrl = imagePaths.getImagePreviewFileNameById(item._id);
        });

        res.render('user');
    }).catch(err => {
        next(err);
    });
}

function joinRequestListener(req, res, next) {
    debug('recieved registration request: %o', req.body);

    if (req.xhr || req.accepts('json,html') === 'json') {
        co(function*() {
            //console.log(mongoose.connection.readyState);
            let userData = {
                username: req.body.username,
                password: req.body.password,
                email: req.body.email
            };

            let result = checkUserData(userData);

            debug('data validation completed: %o', result);

            if (!result) {
                if (!User.indexesEnsured)
                    yield User.ensureIndexes();

                let oldUser = yield User.findOne({
                    username: userData.username
                }).exec();
                if (oldUser) throw new DuplicatingUniquePropertyError('username', 'this username is already taken');

                oldUser = yield User.findOne({
                    email: userData.email
                }).exec();
                if (oldUser) throw new DuplicatingUniquePropertyError('email', 'this e-mail is already registered');

                let newUser = new User(userData).save();

                return newUser;

            } else {
                throw new PropertyError(result.errors[0].name, result.errors[0].message);
            }

        }).then((user) => {
            debug('registration is successful. User id: %s', user._id);
            req.session.userId = user._id;

            res.json({
                success: true,
                url: '/'
            });
        }).catch(err => {

            if (err instanceof PropertyError)
                res.json({
                    success: false,
                    property: err.name,
                    message: err.message
                });
            else
                next(err);
        });
    } else
        res.redirect(303, '/');
}

function loginRequestListener(req, res, next) {
    debug('recieved login request: %o', req.body);
    let loginUser = req.body;

    if (req.xhr || req.accepts('json,html') === 'json') {
        co(function*() {

            if (!User.indexesEnsured)
                yield User.ensureIndexes();

            user = yield User.findOne({
                username: loginUser.username
            }).exec();

            if (!user) throw new LoginError('no such user');

            if (!user.checkPassword(loginUser.password)) throw new LoginError('invalid password');

            return user;


        }).then((user) => {
            debug('login is successful. User id: %s', user._id);
            req.session.userId = user._id;

            res.json({
                success: true,
                url: '/'
            });
        }).catch(err => {

            if (err instanceof LoginError)
                res.json({
                    success: false,
                    message: 'Invalid login data'
                });
            else
                next(err);
        });
    } else
        res.redirect(303, '/');
}

function logoutRequestListener(req, res, next) {
    if (req.session.userId)
        delete req.session.userId;

    res.clearCookie(config.get('cookie:session:key'));
    res.redirect(303, '/');
}

function authorizationRequestListener(req, res, next) {
    res.render('authorization', {
        page: 'authorization'
    });
}

function subscribeRequestListener(req, res, next) {

    let index;
    if (req.refererParams.field === 'user') {
        let username = req.refererParams.value;

        co(function*() {

            let user = yield User.findOne({
                username
            }).exec();

            if (~user.subscribers.indexOf(res.loggedUser._id)) {

                yield user.update({
                    $pull: {
                        subscribers: res.loggedUser._id
                    }
                }).exec();

                yield res.loggedUser.update({
                    $pull: {
                        subscriptions: user._id
                    }
                }).exec();

            } else {

                yield user.update({
                    $addToSet: {
                        subscribers: res.loggedUser._id
                    }
                }).exec();

                yield res.loggedUser.update({
                    $addToSet: {
                        subscriptions: user._id
                    }
                }).exec();
            }

        }).then(result => {
            res.json({
                success: true
            });
        }).catch(err => {
            next(err);
        });

    } else if (req.refererParams.field === 'image') {

        let imageId = req.refererParams.value;

        co(function*() {

            let image = yield Image.findById(imageId).exec();

            let user = yield User.findById(image.author).exec();

            if (~user.subscribers.indexOf(res.loggedUser._id)) {

                yield user.update({
                    $pull: {
                        subscribers: res.loggedUser._id
                    }
                }).exec();

                yield res.loggedUser.update({
                    $pull: {
                        subscriptions: user._id
                    }
                }).exec();

            } else {

                yield user.update({
                    $addToSet: {
                        subscribers: res.loggedUser._id
                    }
                }).exec();

                yield res.loggedUser.update({
                    $addToSet: {
                        subscriptions: user._id
                    }
                }).exec();
            }

        }).then(result => {
            res.json({
                success: true
            });
        }).catch(err => {
            next(err);
        });

    } else
        next(404);
}

function homeRequestListener(req, res, next) {

    let getErrorArray = require('libs/checkUserData').getErrorArray;

    let errs = getErrorArray({
        'password': 'Zxc',
        'password-again': '',
        'email': 'as',
        'username': ''
    });

    debug(errs);



    const CUTAWAY_COUNT = 3;
    const IMAGE_PREVIEW_COUNT = 12;
    const IMAGE_PREVIEW_VISIBLE_COUNT = 3;

    co(function*() {

        let cutaways = [];
        let i = 0;
        let j = 0;

        //for (let i = 0; i < CUTAWAY_COUNT; i++)
        //	cutaways.push({});

        let reprUsers = yield User.find().limit(CUTAWAY_COUNT).exec();
        for (i = 0; i < CUTAWAY_COUNT; i++) {

            let rawImages = yield Image.find({
                author: reprUsers[i]._id
            }).limit(IMAGE_PREVIEW_COUNT).exec();

            let images = [];
            rawImages.forEach(item => {
                images.push(imagePreviewViewModel(item));
            });

            while (images.length < IMAGE_PREVIEW_COUNT) {
                let curLength = images.length;
                for (j = 0; j < curLength; j++)
                    if (images.length < IMAGE_PREVIEW_COUNT)
                        images.push(images[j]);
            }


            let imagesTop = [];
            let imagesBottom = [];
            let imagePreviewSideCount = ~~(IMAGE_PREVIEW_COUNT / 2);

            //4 5 6
            for (j = imagePreviewSideCount - IMAGE_PREVIEW_VISIBLE_COUNT; j < imagePreviewSideCount; j++)
                imagesTop.push(images[j]);
            //1 2 3
            for (j = 0; j < IMAGE_PREVIEW_VISIBLE_COUNT; j++)
                imagesTop.push(images[j]);
            //4 5 6
            for (j = imagePreviewSideCount - IMAGE_PREVIEW_VISIBLE_COUNT; j < imagePreviewSideCount; j++)
                imagesTop.push(images[j]);


            //7 8 9
            for (j = imagePreviewSideCount; j < imagePreviewSideCount + IMAGE_PREVIEW_VISIBLE_COUNT; j++)
                imagesBottom.push(images[j]);
            //10 11 12
            for (j = imagePreviewSideCount + IMAGE_PREVIEW_VISIBLE_COUNT; j < IMAGE_PREVIEW_COUNT; j++)
                imagesBottom.push(images[j]);
            //7 8 9
            for (j = imagePreviewSideCount; j < imagePreviewSideCount + IMAGE_PREVIEW_VISIBLE_COUNT; j++)
                imagesBottom.push(images[j]);

            cutaways.push({
                user: userViewModel(reprUsers[i]),
                imagesTop,
                imagesBottom
            });
        }

        return cutaways;

    }).then(cutaways => {

        res.locals.cutaways = cutaways;
        res.locals.page = 'home';
        res.render('home');

    }).catch(err => {
        next(err);
    });
}

function settingsRequestListener(req, res, next) {
    res.locals.page = 'settings';
    res.render('settings');
}


function avatarUploadRequestListener(req, res, next) {
    if (!req.xhr) return next(404);

    co(function*() {

        let formData = yield new Promise((resolve, reject) => {
            form.parse(req, function(err, fields, files) {
                if (err) reject(303);

                resolve({
                    files,
                    fields
                });

            });
        });


        debug(formData);

        let formPath = formData.files.avatar.path;
        let tempAvatarPath = `${formPath}.${config.get('userdata:avatar:ext')}`;

        debug(tempAvatarPath);

        yield imageManipulation.copy(formPath, tempAvatarPath,
            config.get('userdata:avatar:big:size'), config.get('userdata:avatar:big:size'));

        yield new Promise((resolve, reject) => {
            fs.unlink(formPath, function(err) {
                if (err) reject(err);
                resolve();
            });
        });

        let avatarPaths = imagePaths.getAvatarPathsById(res.loggedUser._id);
        let avatarFileNames = imagePaths.getAvatarFileNamesById(res.loggedUser._id);


        debug(avatarPaths.big);

        yield Promise.all([
            imageManipulation.resize(tempAvatarPath, avatarPaths.big, config.get('userdata:avatar:big:size'), config.get('userdata:avatar:quality')),
            imageManipulation.resize(tempAvatarPath, avatarPaths.medium, config.get('userdata:avatar:medium:size'), config.get('userdata:avatar:quality')),
            imageManipulation.resize(tempAvatarPath, avatarPaths.small, config.get('userdata:avatar:small:size'), config.get('userdata:avatar:quality'))
        ]);


        yield new Promise((resolve, reject) => {
            fs.unlink(tempAvatarPath, function(err) {
                if (err) reject(err);
                resolve();
            });
        });


        res.loggedUser.hasAvatar = true;
        yield res.loggedUser.save();

        return avatarFileNames.medium;

    }).then(mediumAvatarFileName => {

        res.json({
            success: true,
            url: `/${mediumAvatarFileName}`
        });

    }).catch(err => {
        if (err instanceof InvalidImage)
            next(new HttpError(500, err.message));
        else
            next(err);
    });
}

function avatarDeleteRequestListener(req, res, next) {
    if (!req.xhr) return next(404);

    co(function*() {
        res.loggedUser.hasAvatar = false;
        yield res.loggedUser.save();
    }).then(() => {

        res.json({
            success: true
        });

    }).catch(err => {
        next(err);
    });
}

let isUrl = str => checkUserData.testProperty('url', str);

function socialPostRequestListener(req, res, next) {

    if (!req.xhr) return next(400);

    co(function*() {

        let link = req.body.link;

        if (!isUrl(link)) {
            link = 'https://' + link;

            if (!isUrl(link))
                throw new HttpError(400, 'Invalid URL');
        }

        let parsedUrl = url.parse(link);
        let host = parsedUrl.host;


        if (host.indexOf('www.') === 0)
            host = host.substring(4);

        if (parsedUrl.pathname.length <= 1) {
            let firstDotPos = host.indexOf('.');
            if (~host.indexOf('.', firstDotPos + 1))
                host = host.substring(firstDotPos + 1);
        }

        for (let i = 0; i < res.loggedUser.links.length; i++)
            if (res.loggedUser.links[i].host === host)
                throw new HttpError(400, 'You already have a link to this resource');

        let linkObj = {
            host: host,
            href: parsedUrl.href
        };

        res.loggedUser.links.push(linkObj);

        yield res.loggedUser.save();

        return linkObj;
    }).then(linkObj => {
        res.json({
            success: true,
            linkObj
        });
    }).catch(err => {
        next(err);
    });
}

function socialDeleteRequestListener(req, res, next) {
    if (!req.xhr) return next(400);

    co(function*() {
        let link = req.body.link;


        if (!isUrl(link))
            throw new HttpError(400, 'Invalid URL');


        for (let i = 0; i < res.loggedUser.links.length; i++)
            if (res.loggedUser.links[i].href === link) {
                res.loggedUser.links.splice(i, 1);
                break;
            }

        yield res.loggedUser.save();

    }).then(result => {

        res.json({
            success: true
        });

    }).catch(err => {
        next(err);
    });

}


exports.registerRoutes = function(app) {
    app.post('/join', joinRequestListener);
    app.post('/login', loginRequestListener);
    app.post('/subscribe', isAuth, addLoggedUser, addRefererParams, subscribeRequestListener);
    app.post('/avatar', isAuth, addLoggedUser, avatarUploadRequestListener);
    app.post('/social', isAuth, addLoggedUser, socialPostRequestListener);
    app.delete('/social', isAuth, addLoggedUser, socialDeleteRequestListener);
    app.delete('/avatar', isAuth, addLoggedUser, avatarDeleteRequestListener);
    app.get('/logout', logoutRequestListener);
    app.get('/users', usersListRequestListener);
    app.get('/user/:username', addLoggedUser, userProfileRequestListener);
    app.get('/authorization', authorizationRequestListener);
    app.get('/', addLoggedUser, homeRequestListener);
    app.get('/settings', isAuth, addLoggedUser, settingsRequestListener);
};