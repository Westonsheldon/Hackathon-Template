var express = require('express');
var app = express();
var path = require('path');
var favicon   = require('serve-favicon'); // favicon for site
var bodyParser= require('body-parser'); // parsing middleware

//PUBLIC RESOURCES
app.use('/css/bootstrap', express.static( path.join(__dirname,'/node_modules/bootstrap/dist/css') ));
app.use('/js/bootstrap',  express.static( path.join(__dirname,'/node_modules/bootstrap/dist/js')  ));
app.use('/js/jquery',     express.static( path.join(__dirname,'/node_modules/jquery/dist')        ));
app.use('/',              express.static( path.join(__dirname,'/web/public')        ));

app.use(express.static('public'));

var morgan = require('morgan'); //web request logging
app.use(morgan('dev'))

app.set('view engine','ejs');
app.set('views', __dirname + '/public/views');

app.use(require(__dirname + '/core/routes.js')); //specifies the path for the api to function
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('cookie-parser')());

//COMM with Mindsphere
var msStartup = require('./core/controllers/mindsphere-startup-v3.js');
const tenant = 'demo';
msStartup.initialize(tenant);


app.listen(3000, function(){
  console.log('Example app listening on port 3000!');
})


process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

exports = app;