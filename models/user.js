var crypto = require('crypto');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
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
	age: Number,
	country: Schema.Types.ObjectId,
	city: String,

	description: String,
	created: {
		type: Date,
		default: Date.now
	},
	avatarPath: String,
	subscribersCount: Number,
	links: [Schema.Types.ObjectId],
	subscribes: [Schema.Types.ObjectId],
	images: [Schema.Types.ObjectId]

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

var User = mongoose.model('User', userSchema);
module.exports = User;