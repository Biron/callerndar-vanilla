/***********************************
						APP BASIC SETUP
***********************************/
// Declaring dependencies
var express 		= require('express'),  				// Server declaring
		app	    		= express(),									// Creating server
		bodyParser	= require('body-parser'),			// module for parsing data from forms
		morgan			= require('morgan'),					// Logger
		path 				= require('path'),						// Module to worl with urls
		//mongoose		= require('mongoose'),				// Mongo db orm
		port 				= 9090;


// Handler for post requests
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(function(err, req, res, next) {
	if (req.xhr) {
  	res.status(500).send({ error: 'Something blew up!' });
	} else {
    next(err);
	}
});

app.use(function(err, req, res, next) {
	res.status(500);
  res.render('error', { error: err });
});


// CORS
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,  Authorization');
	next();
});

// logger
app.use(morgan('dev'));

// Database connect
//mongoose.connect(config.database);

// Static files
app.use(express.static(__dirname + '/build'));

/***********************************
						ROUTER
***********************************/
/*var apiRouter 	= require('./app/routes/app')(app, express);
app.use('/api', apiRouter);*/

// Base routing
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/build/index.html'));
});


/***********************************
						SERVER
***********************************/
app.listen(port);
console.log("Now we are on " + port);