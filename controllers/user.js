let User = require('models/user');
let Image = require('models/image');
let userViewModel = require('viewModels/user');
let imageViewModel = require('viewModels/image');
let imagePreviewViewModel = require('viewModels/imagePreview');
let truncatedUserViewModel = require('viewModels/truncatedUser');

let co = require('co');
let checkUserData = require('libs/checkUserData');
let PropertyError = require('error').PropertyError;
let DuplicatingUniquePropertyError = require('error').DuplicatingUniquePropertyError;
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

let sendImageToServer = require('libs/imageServer').add;
let formidable = require('formidable');
let form = new formidable.IncomingForm();
let uploadDir = path.resolve(config.get('userdata:dir'));
form.uploadDir = uploadDir;

function random(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}


function usersListRequestListener(req, res, next) {
    co(function*() {
        return new Promise((resolve, reject) => {
            User.find({}, function (err, users) {
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

        let pageUser = yield User.findOne({
            username: req.params.username
        }).populate('images').exec();

        if (!pageUser)
            throw new HttpError(404, 'this user doesn\'t exist');

        let previewGalleryPromises = [];

        // for (let i = 0; i < pageUser.images.length; i++)
        //     previewGallery.push(yield imagePreviewViewModel(pageUser.images[i]));
        for (let i = 0; i < pageUser.images.length; i++)
            previewGalleryPromises.push(imagePreviewViewModel(pageUser.images[i]));

        let previewGallery = yield Promise.all(previewGalleryPromises);


        pageUser = yield userViewModel(pageUser, res.loggedUser && res.loggedUser._id);
        return {
            pageUser,
            previewGallery
        };

    }).then(result => {
        res.locals.pageUser = result.pageUser;
        res.locals.page = 'user';

        res.locals.pageUser.images = result.previewGallery;

        res.render('user');
    }).catch(err => {
        next(err);
    });
}

function joinRequestListener(req, res, next) {
    debug('recieved registration request: %o', req.body);

    co(function*() {
        //console.log(mongoose.connection.readyState);
        let userData = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        };

        let errors = checkUserData.getErrorArray(userData);

        debug('data validation completed: %o', errors);

        if (errors.length === 0) {
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

        } else
            throw new PropertyError(result.errors[0].property, result.errors[0].message);

    }).then((user) => {
        debug('registration is successful. User id: %s', user._id);
        req.session.userId = user._id;
        res.json({
            url: '/'
        });
    }).catch(err => {

        if (err instanceof PropertyError)
            next(new HttpError(400, err.message, {
                property: err.property
            }));
        else
            next(err);
    });

}

function loginRequestListener(req, res, next) {
    debug('recieved login request: %o', req.body);
    let loginUser = req.body;

    co(function*() {

        user = yield User.findOne({
            username: loginUser.username
        }).exec();

        if (!user)
            throw new LoginError();

        if (!user.checkPassword(loginUser.password))
            throw new LoginError();

        return user;

    }).then((user) => {
        debug('login is successful. User id: %s', user._id);
        req.session.userId = user._id;

        res.json({
            url: '/'
        });
    }).catch(err => {
        if (err instanceof LoginError)
            next(new HttpError(400, 'Invalid login data'));
        else
            next(err);
    });

}

function logoutRequestListener(req, res, next) {
    if (req.session.userId)
        delete req.session.userId;

    res.clearCookie(config.get('cookie:session:key'));
    res.redirect(303, '/');
}

function authorizationRequestListener(req, res, next) {

    co(function*() {
        const BACKGROUND_IMAGES_PREFERABLE_COUNT = 6;

        let imageCollectionSize = yield Image.find().count().exec();

        let backgroundImageCount = (imageCollectionSize < BACKGROUND_IMAGES_PREFERABLE_COUNT)
            ? imageCollectionSize : BACKGROUND_IMAGES_PREFERABLE_COUNT;
        let backgroundRawImages = yield Image
            .find()
            .skip(random(0, imageCollectionSize - backgroundImageCount))
            .limit(backgroundImageCount)
            .exec();

        let backgroundImagesUrlPromises = [];
        for (let i = 0; i < backgroundRawImages.length; i++)
            backgroundImagesUrlPromises.push(imagePaths.getImageUrl(backgroundRawImages[i]._id));

        return Promise.all(backgroundImagesUrlPromises);
        //TODO this is not very random

    }).then(backgroundImagesUrls => {
        res.locals.images = JSON.stringify(backgroundImagesUrls);
        res.locals.page = 'authorization';
        res.render('authorization');
    }).catch(err => {
        next(err);
    });

}

function subscribeRequestListener(req, res, next) {

    function subscribe(user) {
        return co(function*() {
            let subscribed = false;

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

                subscribed = true;
            }

            return {
                subscribed,
                initialSubscribersAmount: user.subscribers.length
            };
        });
    }

    let imageId = req.body.imageId;
    let username = req.body.username;

    if (!username && req.refererParams.field === 'user')
        username = req.refererParams.value;

    if (!imageId && !username)
        return next(404);

    co(function*() {

        let user;
        if (imageId) {
            let image = yield Image.findById(imageId).exec();
            if (!image)
                throw new HttpError(404);
            user = yield User.findById(image.author).exec();
        } else if (username) {
            user = yield User.findOne({
                username
            }).exec();
        }

        if (user._id === res.loggedUser._id)
            throw new HttpError(400, 'You\'re pathetic');

        return subscribe(user);

    }).then(result => {
        res.json({
            active: result.subscribed,
            subscribersAmount: result.initialSubscribersAmount + (result.subscribed ? 1 : -1)
        });
    }).catch(err => {
        next(err);
    });

}


function getCutaway(user, res) {

    const IMAGE_PREVIEW_COUNT = 12;
    const IMAGE_PREVIEW_VISIBLE_COUNT = 3;

    return co(function*() {
        let i = 0;

        let rawImages = yield Image.find({
            author: user._id
        }).limit(IMAGE_PREVIEW_COUNT).exec();

        //let images = rawImages.map(item => imagePreviewViewModel(item));

        let imagesPromises = [];
        for (let i = 0; i < rawImages.length; i++)
            imagesPromises.push(imagePreviewViewModel(rawImages[i]));

        let images = yield Promise.all(imagesPromises);


        while (images.length < IMAGE_PREVIEW_COUNT) {
            let curLength = images.length;
            for (i = 0; i < curLength; i++)
                if (images.length < IMAGE_PREVIEW_COUNT)
                    images.push(images[i]);
        }

        let imagesTop = [];
        let imagesBottom = [];
        let imagePreviewSideCount = ~~(IMAGE_PREVIEW_COUNT / 2);

        //4 5 6
        for (i = imagePreviewSideCount - IMAGE_PREVIEW_VISIBLE_COUNT;
             i < imagePreviewSideCount;
             i++)
            imagesTop.push(images[i]);
        //1 2 3
        for (i = 0; i < IMAGE_PREVIEW_VISIBLE_COUNT;
             i++)
            imagesTop.push(images[i]);
        //4 5 6
        for (i = imagePreviewSideCount - IMAGE_PREVIEW_VISIBLE_COUNT;
             i < imagePreviewSideCount;
             i++)
            imagesTop.push(images[i]);


        //7 8 9
        for (i = imagePreviewSideCount;
             i < imagePreviewSideCount + IMAGE_PREVIEW_VISIBLE_COUNT;
             i++)
            imagesBottom.push(images[i]);
        //10 11 12
        for (i = imagePreviewSideCount + IMAGE_PREVIEW_VISIBLE_COUNT;
             i < IMAGE_PREVIEW_COUNT;
             i++)
            imagesBottom.push(images[i]);
        //7 8 9
        for (i = imagePreviewSideCount;
             i < imagePreviewSideCount + IMAGE_PREVIEW_VISIBLE_COUNT;
             i++)
            imagesBottom.push(images[i]);

        return {
            user: yield truncatedUserViewModel(user,
                res.loggedUser && res.loggedUser._id),
            imagesTop,
            imagesBottom
        }
    });

}

function cutawayRequestListener(req, res, next) {


    let reportedCutaways = JSON.parse(req.body.reportedCutaways) || [];

    const CUTAWAYS_TO_SEND_COUNT = 2;

    co(function*() {
        let cutaways = [];

        let properUsersCount = yield User.find({
            _id: {$nin: reportedCutaways},
            'images.0': {
                $exists: true
            }
        }).count().exec();

        let isLastSet = properUsersCount <= CUTAWAYS_TO_SEND_COUNT;

        let cutawaysLeftToFind = properUsersCount;
        cutawaysLeftToFind = (cutawaysLeftToFind > CUTAWAYS_TO_SEND_COUNT)
            ? CUTAWAYS_TO_SEND_COUNT
            : cutawaysLeftToFind;

        while (cutawaysLeftToFind-- > 0) {

            properUsersCount = yield User.find({
                _id: {$nin: reportedCutaways},
                'images.0': {
                    $exists: true
                }
            }).count().exec();

            let nextProperUser = yield User.findOne({
                _id: {$nin: reportedCutaways},
                'images.0': {
                    $exists: true
                }
            }).skip(random(0, properUsersCount - 1)).exec();

            reportedCutaways.push(nextProperUser._id);
            cutaways.push(yield getCutaway(nextProperUser, res));
        }

        return {
            cutaways,
            isLastSet
        };
    }).then(result => {

        // let cutaways = rawCutaways.map(rawCutaway=>{return {
        //
        // }});


        res.send(result);

    }).catch(err => {
        next(err);
    });

}


function homeRequestListener(req, res, next) {


    const PREFERABLE_PAGE_CUTAWAY_COUNT = 2;
    let cutawayCount = PREFERABLE_PAGE_CUTAWAY_COUNT;

    co(function*() {
        let cutaways = [];

        let reprUsers = yield User.find({
            'images.0': {
                $exists: true
            }
        }).limit(cutawayCount).exec();

        cutawayCount = reprUsers.length;

        for (let i = 0; i < cutawayCount; i++)
            cutaways.push(yield getCutaway(reprUsers[i], res));

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

    co(function*() {

        let formData = yield new Promise((resolve, reject) => {
            form.parse(req, function (err, fields, files) {
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
            fs.unlink(formPath, function (err) {
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
            fs.unlink(tempAvatarPath, function (err) {
                if (err) reject(err);
                resolve();
            });
        });

        yield Promise.all([
            sendImageToServer(avatarPaths.big, avatarFileNames.big),
            sendImageToServer(avatarPaths.medium, avatarFileNames.medium),
            sendImageToServer(avatarPaths.small, avatarFileNames.small)
        ]);

        res.loggedUser.hasAvatar = true;
        yield res.loggedUser.save();

        return avatarFileNames.medium;

    }).then(mediumAvatarFileName => {

        res.json({
            url: `/${mediumAvatarFileName}`
        });

    }).catch(err => {
        if (err instanceof InvalidImage)
            next(new HttpError(400, err.message));
        else
            next(err);
    });
}

function avatarDeleteRequestListener(req, res, next) {
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

function setSettingsRequestListener(req, res, next) {
    function saveLink(link) {
        return co(function*() {
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
                linkObj
            });
        });
    }

    function saveDescription(description) {
        return co(function*() {
            let errors = checkUserData.getErrorArray({
                description
            });
            if (errors.length == 0) {

                res.loggedUser.description = description;
                yield res.loggedUser.save();

            } else
                throw new HttpError(400, errors[0].message);
        }).then(() => {
            res.json({});
        });
    }

    function changePassword(oldPassword, newPassword) {
        return co(function*() {
            if (!res.loggedUser.checkPassword(oldPassword))
                throw new PropertyError('old-password', 'incorrect password');

            res.loggedUser.password = newPassword;
            yield res.loggedUser.save();

        }).then(() => {
            res.json({});
        });
    }

    debug('new settings: %o', req.body);

    co(function*() {

        if (req.body.link)
            yield saveLink(req.body.link);

        if (req.body.description)
            yield saveDescription(req.body.description);

        if (req.body['old-password'] && req.body['new-password'])
            yield changePassword(req.body['old-password'], req.body['new-password']);

    }).catch(err => {
        if (err instanceof PropertyError)
            next(new HttpError(400, err.message, {
                property: err.property
            }));
        else
            next(err);
    });

}

function deleteSettingsRequestListener(req, res, next) {
    function deleteLink(link) {
        co(function*() {
            if (!isUrl(link))
                throw new HttpError(400, 'Invalid URL');

            for (let i = 0; i < res.loggedUser.links.length; i++)
                if (res.loggedUser.links[i].href === link) {
                    res.loggedUser.links.splice(i, 1);
                    break;
                }

            yield res.loggedUser.save();
        }).then(result => {
            res.json({});
        }).catch(err => {
            next(err);
        });
    }

    if (req.body.link)
        deleteLink(req.body.link);
}

exports.registerRoutes = function (app) {
    app.post('/join', joinRequestListener);
    app.post('/login', loginRequestListener);
    app.post('/subscribe', isAuth, addLoggedUser, addRefererParams, subscribeRequestListener);
    app.post('/avatar', isAuth, addLoggedUser, avatarUploadRequestListener);
    app.post('/settings', isAuth, addLoggedUser, setSettingsRequestListener);
    app.post('/cutaway', addLoggedUser, cutawayRequestListener);
    app.delete('/settings', isAuth, addLoggedUser, deleteSettingsRequestListener);
    app.delete('/avatar', isAuth, addLoggedUser, avatarDeleteRequestListener);
    app.get('/logout', logoutRequestListener);
    app.get('/users', usersListRequestListener);
    app.get('/user/:username', addLoggedUser, userProfileRequestListener);
    app.get('/authorization', authorizationRequestListener);
    app.get('/', addLoggedUser, homeRequestListener);
    app.get('/settings', isAuth, addLoggedUser, settingsRequestListener);
};
