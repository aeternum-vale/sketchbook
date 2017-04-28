var express = require('express');

var app = express();

var handlebars = require('express-handlebars')
	.create({ defaultLayout: 'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res){
	res.render('home');
});


app.get('/authorization', function(req, res) {
	res.render('authorization', { page: 'authorization'});
});


app.use(function(req, res){
	res.type('text/plain');
	res.status(404);
	res.send('404 Not Found');
});

app.use(function(err, req, res, next){
	console.error(err.stack);
	res.type('text/plain');
	res.status(500);
	res.send('500 Server Error');
});

app.listen(app.get('port'), function(){
	console.log('Express is running');
});

