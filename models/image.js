let mongoose = require('libs/mongoose');
let Schema = mongoose.Schema;

let imageSchema = new Schema({

	description: {
		type: String,
		max: 255
	},

	created: {
		type: Date,
		default: Date.now
	},

	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},

	comments: [{
		type: Schema.Types.ObjectId,
		ref: 'Comment'
	}],

	likes: [{
		type: Schema.Types.ObjectId,
		ref: 'Like'
	}]

}, {
	autoIndex: false
});

let Image = mongoose.model('Image', imageSchema);
Image.ensureIndexes().then(() => {
	Image.indexesEnsured = true;
}).catch((err) => {
	throw err;
});

module.exports = Image;