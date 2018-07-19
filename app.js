var express   = require('express');

var favicon   = require('serve-favicon'); // favicon for site
var path      = require('path');
var bodyParser= require('body-parser'); // parsing middleware

var app       = express();

app.use(express.static('public'));
app.set('views', __dirname + '/public/views');
app.set('view engine', 'ejs');
app.listen(3000);

app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('cookie-parser')());

app.get('/', 
	function(req, res) {
		res.render('index.ejs', {
			user: req.user
		})
	}
);