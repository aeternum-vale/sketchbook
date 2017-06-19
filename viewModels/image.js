let Comments = require('models/Comment');
let User = require('models/User');


let truncatedUserViewModel = require('viewModels/truncatedUser');


let imagePaths = require('libs/imagePaths');
let getDateString = require('libs/getDateString');
let getObjectParticularClone = require('libs/getObjectParticularClone');
let co = require('co');
let debug = require('debug')('app:viewModels:image')

module.exports = function(image, loggedUserId) {
	return co(function*() {

		let comments = yield Comments.find({
			_id: {
				$in: image.comments
			}
		}).exec();



		for (let i = 0; i < comments.length; i++) {
			comments[i].commentator = truncatedUserViewModel(yield User.findById(comments[i].author).exec(), loggedUserId);

			comments[i].createDateStr = getDateString(comments[i].created);
			comments[i].ownComment = !!(comments[i].author === loggedUserId);
		}

		let likes = yield User.find({
			_id: {
				$in: image.likes
			}
		}, {
			'username': true
		}).exec();


		let imageViewModel = {
			_id: image._id,
			imgUrl: '/' + imagePaths.getImageFileNameById(image._id),
			ownImage: !!(loggedUserId === image.author),
			isLiked: !!(~image.likes.indexOf(loggedUserId)),
			description: image.description,
			created: image.created,
			createDateStr: getDateString(image.created),
			author: truncatedUserViewModel(yield User.findById(image.author).exec(), loggedUserId),
			comments,
			likes
		};

		return imageViewModel;
	});
};
