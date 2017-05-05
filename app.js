require('app-module-path').addPath(__dirname);
let express = require('express');
let config = require('config');
let mongoose = require('libs/mongoose');
let co = require('co');

var app = express();

var handlebars = require('express-handlebars')
	.create({
		defaultLayout: 'main'
	});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', config.get('port'));

app.use(express.static(__dirname + '/public'));


app.use(require('body-parser').urlencoded({
	extended: true
}));

app.get('/', function(req, res) {
	res.render('home');
});


require('models/user');
app.get('/users', function(req, res, next) {

	mongoose.models.User.find({}, function(err, users) {
		if (err) return next(err);
		res.json(users);
	});

});

app.get('/authorization', function(req, res) {
	res.render('authorization', {
		page: 'authorization'
	});
});

app.post('/join', function(req, res) {
	console.log(req.body);

	if (req.xhr || req.accepts('json,html') === 'json') {

		co(function*() {
			console.log(mongoose.connection.readyState);

			yield mongoose.models.User.ensureIndexes();

			let newUser = new mongoose.models.User({
				username: req.body.username,
				password: req.body.password,
				email: req.body.email
			}).save();

			yield newUser;
		}).then(() => {
			res.json({
				success: true,
				url: '/'
			});
		}).catch(err => {
			res.json({
				success: false
			})
		});



	} else {
		res.redirect(303, '/');
	}

});

app.use(function(req, res) {
	res.type('text/plain');
	res.status(404);
	res.send('404 Not Found');
});

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.type('text/plain');
	res.status(500);
	res.send('500 Server Error');
});

app.listen(app.get('port'), function() {
	console.log('Express is running on port ' + config.get('port'));
});