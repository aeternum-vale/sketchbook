let crypto = require('crypto');
let mongoose = require('libs/mongoose');
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
		type: Schema.Types.ObjectId,
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
		type: Schema.Types.ObjectId,
		ref: 'Link'
	}],

	subscribers: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],

	subscriptions: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],

	images: [{
		type: Schema.Types.ObjectId,
		ref: 'Image'
	}]

}, {
	autoIndex: false
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