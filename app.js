require('app-module-path').addPath(__dirname);
let express = require('express');
let config = require('config');
let co = require('co');
let HttpError = require('error').HttpError;

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


app.use(require('middleware/sendHttpError'));

app.get('/', function(req, res) {
	res.render('home');
});


app.get('/authorization', function(req, res) {
	res.render('authorization', {
		page: 'authorization'
	});
});

require('controllers/user').registerRoutes(app);

app.use(function(req, res, next) {
	next(new HttpError(404, 'Not Found'));
});

app.use(function(err, req, res, next) {

	if (typeof err == 'number') { // next(404);
		err = new HttpError(err);
	}

	if (err instanceof HttpError) {
		res.sendHttpError(err);
	} else {
		if (config.get('env') == 'development') {
			//express.errorHandler()(err, req, res, next);
			console.log(err);
		} else {
			//log.error(err);
			console.log(err);
			err = new HttpError(500);
			res.sendHttpError(err);
		}
	}


});

app.listen(app.get('port'), function() {
	console.log('Express is running on port ' + config.get('port'));
});