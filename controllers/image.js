let Image = require('models/image');
let User = require('models/user');

let imagePreviewViewModel = require('viewModels/imagePreview');
let userViewModel = require('viewModels/user');
let imageViewModel = require('viewModels/image');

let co = require('co');
let config = require('config');
let debug = require('debug')('app:image:controller');
let HttpError = require('error').HttpError;
let fs = require('fs');
let http = require('http');
let path = require('path');
let imageManipulation = require('libs/imageManipulation');
let imagePaths = require('libs/imagePaths');
let getDateString = require('libs/getDateString');
let isAuth = require('middleware/isAuth');
let addLoggedUser = require('middleware/addLoggedUser');
let addRefererParams = require('middleware/addRefererParams');
let InvalidImage = require('error').InvalidImage;

let formidable = require('formidable');
let form = new formidable.IncomingForm();

let uploadDir = path.resolve(config.get('userdata:dir'));

let sendImageToServer = require('libs/sendImageToServer');
form.uploadDir = uploadDir;

function imageRequestListener(req, res, next) {
    co(function*() {
        let rawImage = yield Image.findById(req.params.id).exec();

        if (!rawImage)
            throw new HttpError(404, "Image not found");

        return imageViewModel(rawImage, res.loggedUser && res.loggedUser._id);
    }).then(image => {

        res.locals.image = image;
        res.locals.page = 'image';

        res.render('image');
    }).catch(err => {
        next(err);
    });
}

function uploadImageListRequestListener(req, res, next) {
    debug('The file is ready to be uploaded');

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

        let formPath = formData.files.image.path;
        let tempImagePath = `${formPath}.${config.get('userdata:image:ext')}`;
        let tempImagePreviewPath = `${formPath}${
            config.get('userdata:preview:postfix')
            }.${config.get('userdata:preview:ext')}`;

        yield imageManipulation.copy(formPath, tempImagePath,
            config.get('userdata:image:minWidth'), config.get('userdata:image:minHeight'));

        yield new Promise((resolve, reject) => {
            fs.unlink(formPath, function (err) {
                if (err) reject(err);
                resolve();
            });
        });

        yield imageManipulation.resize(tempImagePath,
            tempImagePreviewPath, config.get('userdata:preview:size'), config.get('userdata:preview:quality'));

        let newImage = yield new Image({
            author: req.session.userId,
            description: formData.fields.description
        }).save();

        let imageFileName = imagePaths
            .getImageFileNameById(newImage._id);
        let imagePreviewFileName = imagePaths
            .getImagePreviewFileNameById(newImage._id);
        let imagePath = path.join(uploadDir, imageFileName);
        let imagePreviewPath = path.join(uploadDir, imagePreviewFileName);

        yield new Promise((resolve, reject) => {
            fs.rename(tempImagePath, imagePath, function (err) {
                if (err) reject(err);
                resolve();
            });
        });

        yield new Promise((resolve, reject) => {
            fs.rename(tempImagePreviewPath, imagePreviewPath, function (err) {
                if (err) reject(err);
                resolve();
            });
        });

        yield sendImageToServer(imagePath, imageFileName);
        yield sendImageToServer(imagePreviewPath, imagePreviewFileName);

        return {
            imagePreviewFileName,
            id: newImage._id
        };

    }).then(result => {
        debug('added new image');
        res.json({
            previewUrl: result.imagePreviewFileName,
            imageId: result.id
        });
    }).catch(err => {
        if (err instanceof InvalidImage)
            next(new HttpError(400, 'Invalid image'));
        else
            next(err);
    });
}

function imageListRequestListener(req, res, next) {
    co(function*() {
        return new Promise((resolve, reject) => {
            Image.find({}, function (err, images) {
                if (err) reject(err);
                resolve(images);
            });
        });
    }).then(result => {
        res.json(result);
    }).catch(err => {
        next(err);
    });
}

function imageDeleteListRequestListener(req, res, next) {
    let imageId = req.body.id; //req.refererParams.value;

    if (!imageId)
        return next(400);

    debug('deleting image #' + imageId);
    co(function*() {
        let image = yield Image.findById(imageId).exec();

        if (!image)
            throw new HttpError(400);

        if (image.author !== res.loggedUser._id)
            throw new HttpError(403);

        yield image.remove();

    }).then(() => {
        debug('successful deleting');
        res.json({
            url: `/user/${res.loggedUser.username}`
        });
    }).catch(err => {
        next(err);
    });
}

function likeRequestListener(req, res, next) {

    let imageId = req.body.imageId;
    if (!imageId) return next(400);

    co(function*() {

        let image = yield Image.findById(imageId).exec();
        if (!image)
            throw new HttpError(400);

        let userId = res.loggedUser._id;

        let index;
        debug(image.likes);
        if (~(index = image.likes.indexOf(userId)))
            image.likes.splice(index, 1);
        else
            image.likes.push(userId);
        yield image.save();
        debug(image.likes);

        if (~(index = res.loggedUser.likes.indexOf(imageId)))
            res.loggedUser.likes.splice(index, 1);
        else
            res.loggedUser.likes.push(imageId);
        yield res.loggedUser.save();

        // yield res.loggedUser.update({
        //     $addToSet: {
        //         likes: imageId
        //     }
        // }).exec();

        return {
            isLiked: !~index,
            likeAmount: image.likes.length
        };

    }).then(result => {

        res.json({
            active: result.isLiked,
            likeAmount: result.likeAmount
        });

    }).catch(err => {
        next(err);
    });
}


function getFeed(loggedUser) {
    return co(function*() {
        let rawFeed = [];

        let subs = loggedUser.subscriptions;

        for (let i = 0; i < subs.length; i++) {
            let imageIds = (yield User.findById(subs[i], {
                images: true
            }).exec()).images;

            for (let j = 0; j < imageIds.length; j++) {
                let image = yield Image.findById(imageIds[j]).exec();
                if (image)
                    rawFeed.push(image);
            }
        }

        rawFeed.sort((a, b) => {
            return (a.created < b.created);
        });

        let feed = [];
        for (let i = 0; i < rawFeed.length; i++)
            feed.push(yield imagePreviewViewModel(rawFeed[i]));

        debug('feed:', feed );

        //     rawFeed.map(item => {
        //     return (yield imagePreviewViewModel(item));
        // });

        for (let i = 0; i < feed.length; i++)
            feed[i].authorUsername = (yield User.findById(feed[i].author).exec()).username;

        return feed;
    });
}


function feedRequestListener(req, res, next) {
    getFeed(res.loggedUser).then(feed => {

        res.locals.page = 'feed';
        res.locals.feed = feed;
        res.render('feed');

    }).catch(err => {
        next(err);
    });
}


function galleryRequestListener(req, res, next) {

    if (!req.body.id)
        return next(400);

    let preloadEntityCount = config.get('image:preloadEntityCount') || 1;
    let id = +req.body.id;
    let isFeed = req.body.isFeed;
    let requireUserViewModel = req.body.requireUserViewModel;


    let loggedUserId;
    if (res.loggedUser)
        loggedUserId = res.loggedUser && res.loggedUser._id;

    co(function*() {

        let rawImage = yield Image.findById(id).exec();
        if (!rawImage)
            throw new HttpError(404);

        let image = yield imageViewModel(rawImage, loggedUserId);
        let author = yield User.findById(image.author._id).exec();
        let gallery;
        if (!isFeed)
            gallery = author.images;
        else {
            let feed = yield getFeed(res.loggedUser);
            gallery = feed.map(item => item._id);
        }

        let loggedUserViewModel;
        if (res.loggedUser)
            loggedUserViewModel = yield userViewModel(res.loggedUser, loggedUserId);

        let viewModels = {};
        if (~gallery.indexOf(image._id))
            viewModels[image._id] = image;

        return {
            image,
            viewModels,
            gallery,
            loggedUserViewModel
        };
    }).then(result => {

        let response = {
            viewModels: result.viewModels,
            gallery: result.gallery
        };
        if (requireUserViewModel)
            response.loggedUserViewModel = result.loggedUserViewModel;

        res.json(response);
    }).catch(err => {
        next(err);
    });
}

exports.registerRoutes = function (app) {
    app.post('/gallery', addLoggedUser, addRefererParams, galleryRequestListener);
    app.post('/image', isAuth, uploadImageListRequestListener);
    app.delete('/image', isAuth, addLoggedUser, addRefererParams, imageDeleteListRequestListener);
    app.get('/images', imageListRequestListener);
    app.get('/image/:id', addLoggedUser, imageRequestListener);
    app.post('/like', isAuth, addLoggedUser, likeRequestListener);
    app.get('/feed', isAuth, addLoggedUser, feedRequestListener);

};
