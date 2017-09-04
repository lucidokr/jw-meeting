var express = require('express'),
    path = require('path'),
    fs = require('fs');

var app = express();
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  //intercepts OPTIONS method
  if ('OPTIONS' === req.method) {
    //respond with 200
    res.send(200);
  }
  else {
    //move on
    next();
  }
});

// var mongoose   = require('mongoose');

 var mongoose   = require('mongoose');
  mongoose.connect('mongodb://localhost:27017/jw-vitacristiana-ministero'); // connect to our database
 // mongoose.connect('mongodb://kristian:atlantis@ds153501.mlab.com:53501/jw-vitacristiana-ministero',{
 //   useMongoClient: true,
 //   /* other options */
 // }); // connect to our database

// call the packages we need
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb'}));

app.set('superSecret', config.secret); // secret variable

var port = 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});


var Brother = require('./api/models/brother');

router.use('/brother', require('./api/brother'));
router.use('/student', require('./api/student'));
router.use('/week', require('./api/week'));
router.use('/history', require('./api/history'));
router.use('/prayer', require('./api/prayer'));
router.use('/elder', require('./api/elder'));
router.use('/servant', require('./api/servant'));
router.use('/wtj', require('./api/wtj'));
router.use('/studyNumber', require('./api/studyNumber'));
router.use('/reader', require('./api/reader'));
router.use('/auth', require('./api/auth'));

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
