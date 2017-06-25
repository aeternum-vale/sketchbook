let getDateString = require('libs/getDateString');

let User = require('models/User');
let co = require('co');
let truncatedUserViewModel = require('viewModels/truncatedUser');

module.exports = function(comment, loggedUserId) {

    return co(function*() {



        let commentViewModel = {
            _id: comment._id,
            created: comment.created,
            createDateStr: getDateString(comment.created),
            text: comment.text,
            commentator: truncatedUserViewModel(yield User.findById(comment.author).exec(), loggedUserId),
            isOwnComment: !!(loggedUserId === comment.author)
        };

        return commentViewModel;
    });
};
