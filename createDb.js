require('app-module-path').addPath(__dirname);
let co = require("co");

let mongoose = require('libs/mongoose');
mongoose.Promise = global.Promise;

let p0 = new Promise((resolve, reject) => {
	mongoose.connection.on('open', function() {
		var db = mongoose.connection.db;
		db.dropDatabase(function(err) {
			if (err) reject(err);
			resolve('success');
		});
	});
});

co(function*() {
	yield p0;

	require('models/user');

	yield mongoose.models.User.ensureIndexes();

	// let p1 = new mongoose.models.User({
	// 	username: 'govnodemon',
	// 	password: '12345'
	// }).save();

	// let p2 = new mongoose.models.User({
	// 	username: 'blorp',
	// 	password: '12345q'
	// }).save();

	// let results = yield Promise.all([p1, p2]);
	// return results;
}).then(results => {
	console.log(results);
	mongoose.disconnect();
}).catch(err => {
	console.log(err);
});



