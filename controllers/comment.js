let Comment = require('models/comment');
let User = require('models/user');
let co = require('co');
let config = require('config');
let debug = require('debug')('app:comment:controller');
let HttpError = require('error').HttpError;

let isAuth = require('middleware/isAuth');
let addLoggedUser = require('middleware/addLoggedUser');
let addRefererParams = require('middleware/addRefererParams');

let url = require('url');

function recieveCommentRequestListener(req, res, next) {
    let imageId = req.refererParams.value;

    co(function*() {

        let comment = yield new Comment({
            text: req.body.text,
            author: res.loggedUser._id,
            image: imageId
        }).save();

        return comment;

    }).then(comment => {
        debug('new comment is added: %s', comment.text);
        res.json({
            success: true,
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
        res.json({
            success: true
        })
    }).catch(err => {
        next(err)
    });

}

exports.registerRoutes = function(app) {
    app.post('/comment', isAuth, addLoggedUser, addRefererParams, recieveCommentRequestListener);
    app.delete('/comment', isAuth, deleteCommentRequestListener);
};
