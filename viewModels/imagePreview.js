let imagePaths = require('libs/imagePaths');
let getDateString = require('libs/getDateString');
let co = require('co');

module.exports = function(image) {

    return co(function*(){
        return {
            _id: image._id,
            author: image.author,
            comments: image.comments,
            commentsDesignationText: (image.comments.length === 1) ? 'comment' : 'comments',
            likes: image.likes,
            likesDesignationText: (image.likes.length === 1) ? 'like' : 'likes',
            previewUrl: yield imagePaths.getImagePreviewUrl(image._id),
            createDateStr: getDateString(image.created)
        };
    });


};