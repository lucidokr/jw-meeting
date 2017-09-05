var express = require('express'),
    path = require('path'),
    fs = require('fs');
var compression = require('compression');
var mongoose   = require('mongoose');
var config = require('./api/env.json')[process.env.NODE_ENV || 'development'];
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var app = express();
var staticRoot = __dirname + '/dist/';
var router = express.Router();
var bodyParser = require('body-parser');
var Brother = require('./api/models/brother');


app.use(compression());
app.set('superSecret', config.secret);
app.set('port', (process.env.PORT || 3000));
app.use(express.static(staticRoot));
// Avoid redirect if on localhost developing
if (process.env.NODE_ENV  === 'production') {
  // Redirect http to https
  app.enable('trust proxy');
  app.use (function (req, res, next) {
    if (req.secure) {
      next();
    } else {
      res.redirect('https://' + req.headers.host + req.url);
    }
  });
}


router.use('/auth', require('./api/auth'));

app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, x-access-token, Content-Length, X-Requested-With');

    // if the request is not html then move along
    var accept = req.accepts('html', 'json', 'xml');
    if(accept !== 'html'){
      if (req.url.indexOf('/login')!=-1) return next();
      var token = req.headers['x-access-token'];

      // decode token
      if (token) {

        return jwt.verify(token, app.get('superSecret'), function(err, decoded) {
          if (err) {
            return res.status(403).send({
              success: false,
              message: 'Failed to authenticate'
            });
          } else {
            var dateNow = new Date();
            if((decoded.exp * 1000) < dateNow.getTime()){
              return res.status(403).send({
                success: false,
                message: 'Token expired'
              });
            }else{
              req.decoded = decoded;
              return next();
            }

          }
        });

      } else {

        return res.status(403).send({
          success: false,
          message: 'No token provided.'
        });

      }
    }

    var ext = path.extname(req.path);
    if (ext !== ''){
        return next();
    }

    if ('OPTIONS' === req.method) {
      res.send(200);
    }

    if(process.env.NODE_ENV &&  process.env.NODE_ENV != "development")
      fs.createReadStream(staticRoot + 'index.html').pipe(res);
});

mongoose.connect(config.MONGO_URI, {
  useMongoClient: true
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb'}));




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

app.use('/api', router);

app.listen(app.get('port'), function() {
  console.log('app running on port', app.get('port'));
});
console.log('Magic happens on port ' + app.get('port'));
