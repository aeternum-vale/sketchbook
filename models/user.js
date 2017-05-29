let crypto = require('crypto');
let mongoose = require('libs/mongoose');
let autoIncrement = require('mongoose-auto-increment');
let Schema = mongoose.Schema;

let userSchema = new Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},

	hashedPassword: {
		type: String,
		required: true
	},

	salt: {
		type: String,
		required: true
	},

	email: {
		type: String,
		unique: true,
		required: true
	},

	name: String,

	surname: String,

	age: {
		type: Number,
		default: 0
	},

	country: {
		type: Number,
		ref: 'Country'
	},

	city: String,

	description: String,

	created: {
		type: Date,
		default: Date.now
	},

	avatarPath: String,

	links: [{
		type: Number,
		ref: 'Link'
	}],

	subscribers: [{
		type: Number,
		ref: 'User'
	}],

	subscriptions: [{
		type: Number,
		ref: 'User'
	}],

	images: [{
		type: Number,
		ref: 'Image'
	}],

	likes: [{
		type: Number,
		ref: 'Image'
	}], 

	comments: [{
		type: Number,
		ref: 'Comments'
	}]

}, {
	autoIndex: false
});

userSchema.plugin(autoIncrement.plugin, {
	model: 'User',
	startAt: 1
});

userSchema.methods.encryptPassword = function(password) {
	return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

userSchema.virtual('password')
	.set(function(password) {
		this._plainPassword = password;
		this.salt = Math.random() + '';
		this.hashedPassword = this.encryptPassword(password);
	})
	.get(function() {
		return this._plainPassword;
	});

userSchema.methods.checkPassword = function(password) {
	return this.encryptPassword(password) === this.hashedPassword;
}

let User = mongoose.model('User', userSchema);
User.ensureIndexes().then(() => {
	User.indexesEnsured = true;
}).catch((err) => {
	throw err;
});

module.exports = User;