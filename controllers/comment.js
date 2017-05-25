let Comment = require('models/comment');
let co = require('co');
let config = require('config');
let debug = require('debug')('app:comment:controller');
let HttpError = require('error').HttpError;

let isAuth = require('middleware/isAuth');
let addLoggedUser = require('middleware/addLoggedUser');

let url = require('url');

function recieveCommentRequestListener(req, res, next) {

	if (!req.xhr) next();

	let imageId = require('libs/getImageIdByReferer')(req.headers.referer);

	co(function*() {
		if (!Comment.indexesEnsured)
			yield Comment.ensureIndexes();

		return new Comment({
			text: req.body.text,
			author: req.session.userId,
			image: imageId
		}).save();

	}).then(comment => {
		debug('new comment is added: %s', comment.text);
		res.json({
			success: true
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
	app.post('/comment', isAuth, recieveCommentRequestListener);
	app.delete('/comment', isAuth, deleteCommentRequestListener);
};