require('app-module-path').addPath(__dirname);
let express = require('express');
let config = require('config');
let co = require('co');
let HttpError = require('error').HttpError;
let debug = require('debug')('app');
let MongoSessionStore = require('session-mongoose')(require('connect'));
let sessionStore = new MongoSessionStore({
	url: config.get('mongo:uri')
});
let handlebars = require('express-handlebars')
	.create({
		defaultLayout: 'main'
	});

let app = express();
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', config.get('port'));

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/userdata'));

app.use(require('body-parser').urlencoded({
	extended: true
}));

app.use(require('cookie-parser')(config.get('cookie:secret')));
app.use(require('express-session')({
	resave: false,
	saveUninitialized: false,
	secret: config.get('cookie:secret'),
	cookie: config.get('cookie:options'),
	key: config.get('cookie:session:key'),
	store: sessionStore
}));

app.use(require('middleware/sendHttpError'));

app.get('/', function(req, res) {
	res.render('home');
});

require('controllers/user').registerRoutes(app);
require('controllers/image').registerRoutes(app);
require('controllers/comment').registerRoutes(app);
require('controllers/like').registerRoutes(app);

app.use(function(req, res, next) {
	next(404);
});

app.use(function(err, req, res, next) {

	if (typeof err == 'number') // next(404);
		err = new HttpError(err);

	if (err instanceof HttpError)
		res.sendHttpError(err);
	else {
		//if (config.get('env') == 'development') {
		//express.errorHandler()(err, req, res, next);

		debug(err);
		err = new HttpError(500);
		res.sendHttpError(err);
	}

});

app.listen(app.get('port'), function() {
	debug('Express is running on port ' + config.get('port'));
});