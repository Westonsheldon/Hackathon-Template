var express   = require('express');

var favicon   = require('serve-favicon'); // favicon for site
var path      = require('path');
var bodyParser= require('body-parser'); // parsing middleware

var moment = require('moment-timezone');

var ts = require('./dataDownload.js');

var app       = express();

app.use(express.static('public'));
app.set('views', __dirname + '/public/views');
app.set('view engine', 'ejs');
app.listen(3000);

app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('cookie-parser')());

app.get('/', 
	function(req, res) {
		let today = null;
		let yesterday = null;
		let thisWeek = null;
		let lastWeek = null;
		let thisMonth = null;
		let lastMonth = null;

		ts.getData(moment().subtract(100, 'day').startOf('day').toISOString(), moment().subtract(100, 'day').toISOString())
		.then(todayData => {
			today = todayData;
			return ts.getData(moment().subtract(101, 'day').startOf('day').toISOString(), moment().subtract(101, 'day').toISOString())
		})
		.then(yesterdayData => {
			yesterday = yesterdayData;
			res.render('index.ejs', {
				user: req.user,
				today: today,
				yesterday: yesterday
			})
		})
	}
);

app.get('/weekly', 
	function(req, res) {
		let thisWeek = null;
		let lastWeek = null;
		let thisMonth = null;
		let lastMonth = null;

		ts.getData(moment().subtract(100, 'day').startOf('week').toISOString(), moment().subtract(100, 'day').toISOString())
		.then(thisWeekData => {
			thisWeek = thisWeekData;
			return ts.getData(moment().subtract(101, 'day').startOf('week').toISOString(), moment().subtract(101, 'day').toISOString())
		})
		.then(lastWeekData => {
			lastWeek = lastWeekData;
			res.render('weekly.ejs', {
				user: req.user,
				thisWeek: thisWeek,
				lastWeek: lastWeek
			})
		})
	}
);

/*
startTime: moment().subtract(100, 'day').startOf('day').toISOString(),
endTime: moment().subtract(100, 'day').toISOString()

startTime: moment().subtract(100, 'day').startOf('week').toISOString(),
endTime: moment().subtract(100, 'day').toISOString()

startTime: moment().subtract(100, 'day').startOf('month').toISOString(),
endTime: moment().subtract(100, 'day').toISOString()
*/