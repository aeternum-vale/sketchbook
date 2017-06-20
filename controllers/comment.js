let Comment = require('models/comment');
let User = require('models/user');
let co = require('co');
let config = require('config');
let debug = require('debug')('app:comment:controller');
let HttpError = require('error').HttpError;

let isAuth = require('middleware/isAuth');
let addLoggedUser = require('middleware/addLoggedUser');
let addRefererParams = require('middleware/addRefererParams');
let checkUserData = require('libs/checkUserData');

let url = require('url');

function recieveCommentRequestListener(req, res, next) {

    let imageId = req.body.id;
    let text = req.body.text;

    if (!imageId || !text)
        return next(400);


    let errors = checkUserData.getErrorArray({
        comment: text
    });

    if (errors.length > 0)
        return next(new HttpError(400, errors[0].message))

    co(function*() {

        let comment = yield new Comment({
            text,
            author: res.loggedUser._id,
            image: imageId
        }).save();

        return comment;

    }).then(comment => {
        debug('new comment is added: %s', comment.text);
        res.json({
            commentId: comment._id
        });
    }).catch(err => {
        next(err);
    });

}

function deleteCommentRequestListener(req, res, next) {
    debug('deleting comment #' + req.body.commentId);

    co(function*() {

        let comment = yield Comment.findById(req.body.commentId).exec();
        yield comment.remove();

    }).then(() => {
        res.json({})
    }).catch(err => {
        next(err)
    });

}

exports.registerRoutes = function(app) {
    app.post('/comment', isAuth, addLoggedUser, recieveCommentRequestListener);
    app.delete('/comment', isAuth, deleteCommentRequestListener);
};
