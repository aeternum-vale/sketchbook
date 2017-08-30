let crypto = require('crypto');
let mongoose = require('libs/mongoose');
let autoIncrement = require('mongoose-auto-increment');
let Schema = mongoose.Schema;
let debug = require('debug')('app:model:user');

let userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        set: setUsername
    },

    lowerCaseUsername: {
        type: String,
        required: true,
        unique: true
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
        required: true,
        lowercase: true
    },

    name: String,

    surname: String,

    country: {
        type: Number,
        ref: 'Country'
    },

    hasAvatar: {
        type: Boolean,
        default: false
    },

    description: String,

    created: {
        type: Date,
        default: Date.now
    },

    links: [{
        host: String,
        href: String
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


userSchema.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

function setUsername(username) {
    this.lowerCaseUsername = username.toLowerCase();
    return username;
}

userSchema.virtual('password')
    .set(function (password) {

        for (let key in userSchema)
            console.log(`${key}=this ${userSchema[key] === this}`);


        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._plainPassword;
    });

userSchema.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

let User = mongoose.model('User', userSchema);
User.ensure = User.ensureIndexes;

module.exports = User;
