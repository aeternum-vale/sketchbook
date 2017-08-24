let Comment = require('models/comment');
let User = require('models/user');


let truncatedUserViewModel = require('viewModels/truncatedUser');
let commentViewModel = require('viewModels/comment');


let imagePaths = require('libs/imagePaths');
let getDateString = require('libs/getDateString');
let getObjectParticularClone = require('libs/getObjectParticularClone');
let co = require('co');
let debug = require('debug')('app:viewModels:image')

module.exports = function(image, loggedUserId) {
    return co(function*() {

        let comments = yield Comment.find({
            _id: {
                $in: image.comments
            }
        }).exec();


        if (comments)
            for (let i = 0; i < comments.length; i++)
                comments[i] = yield commentViewModel(yield Comment.findById(comments[i]).exec(), loggedUserId);


        let likes = yield User.find({
            _id: {
                $in: image.likes
            }
        }, {
            'username': true
        }).exec();

        let imageViewModel = {
            _id: image._id,
            imgUrl: imagePaths.getImageUrl(image._id),
            isOwnImage: (loggedUserId === image.author),
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
