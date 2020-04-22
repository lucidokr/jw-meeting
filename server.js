var express = require('express'),
    path = require('path'),
    fs = require('fs');
var compression = require('compression');
var mongoose = require('mongoose')
if (!process.env.NODE_ENV || process.env.NODE_ENV == "development") {
    var config = require('./api/env.json')['development'];
    process.env.MONGO_DB_URI = config.MONGO_DB_URI;
    process.env.SECRET = config.SECRET;
    process.env.GMAIL_ACCOUNT = config.GMAIL_ACCOUNT;
    process.env.GMAIL_ACCOUNT_PASSWORD = config.GMAIL_ACCOUNT_PASSWORD;
    process.env.SEND_ASSEGNATION = config.SEND_ASSEGNATION;
}

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var app = express();

var staticRoot = __dirname + '/dist/';
var router = express.Router();
var bodyParser = require('body-parser');
var schedule = require('node-schedule');
var Week = require('./api/models/weekMeeting');
var MAIL = require('./api/mail/send-mailgun');
const MONTH_NAMES = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
];
const DAY_NAMES = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];


app.use(compression());
app.set('superSecret', process.env.SECRET);
app.set('port', (process.env.PORT || 3000));
app.use(express.static(staticRoot));
// Avoid redirect if on localhost developing
if (process.env.NODE_ENV === 'production') {
    // Redirect http to https
    app.enable('trust proxy');
    app.use(function(req, res, next) {
        if (req.secure) {
            next();
        } else {
            res.redirect('https://' + req.headers.host + req.url);
        }
    });
}


router.use('/auth', require('./api/auth'));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, x-access-token, Content-Length, X-Requested-With');

    // if the request is not html then move along
    var accept = req.accepts('html', 'json', 'xml');
    if (accept !== 'html') {
        if (req.url.indexOf('/login') != -1) return next();
        if (req.url.indexOf('alexa') != -1){
          return next();
        }
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
                    if ((decoded.exp * 1000) < dateNow.getTime()) {
                        return res.status(403).send({
                            success: false,
                            message: 'Token expired'
                        });
                    } else {
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
    if (ext !== '') {
        return next();
    }

    if ('OPTIONS' === req.method) {
        res.status(200).send();
    }
});

// async function run() {
//   // No need to `await` on this, mongoose 4 handles connection buffering
//   // internally
//   mongoose.connect(process.env.MONGO_DB_URI);

//   // Prints an array with 1 element, the above document
//   console.log(await Brother.find());
// }

// run();

mongoose.connect(process.env.MONGO_DB_URI,{ useNewUrlParser:true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));




router.use('/brother', require('./api/brother'));
router.use('/student', require('./api/student'));
router.use('/week', require('./api/week'));
router.use('/tempWeek', require('./api/weekTemp'));
router.use('/history', require('./api/history'));
router.use('/prayer', require('./api/prayer'));
router.use('/elder', require('./api/elder'));
router.use('/servant', require('./api/servant'));
router.use('/wtj', require('./api/wtj'));
router.use('/reader', require('./api/reader'));
router.use('/congregation', require('./api/congregation'));
// router.use('/alexa', require('./api/alexa'));

app.use('/api', router);

if (process.env.NODE_ENV && process.env.NODE_ENV != "development") {
    var http = require("http");
    setInterval(function() {
        http.get("http://jw-meeting.herokuapp.com");
    }, 1500000);
}

/**
 * ALEXA
 */

const expressAdapter = require('ask-sdk-express-adapter')
const Alexa = require('ask-sdk-core');
// const { SkillRequestSignatureVerifier, TimestampVerifier } = require('ask-sdk-express-adapter');

const LaunchRequestIntentHandler = require('./api/handlers/LaunchRequestIntentHandler.js');
const HelpIntentHandler = require('./api/handlers/HelpIntentHandler.js');
const CancelAndStopIntentHandler = require('./api/handlers/CancelAndStopIntentHandler.js');
const SessionEndedRequestHandler = require('./api/handlers/SessionEndedRequestHandler.js');
const ErrorHandler = require('./api/handlers/ErrorHandler.js');
const PresidentIntentHandler = require('./api/handlers/PresidentIntentHandler.js');
const ReaderIntentHandler = require('./api/handlers/ReaderIntentHandler.js');
const StudentIntentHandler = require('./api/handlers/StudentIntentHandler.js');

const skill = Alexa.SkillBuilders.custom()
.addRequestHandlers(
  LaunchRequestIntentHandler,
  PresidentIntentHandler,
  ReaderIntentHandler,
  StudentIntentHandler,
  HelpIntentHandler,
  CancelAndStopIntentHandler,
  SessionEndedRequestHandler,
)
.addErrorHandlers(ErrorHandler)
.create();

app.post('/alexa', async function(req, res) {

    if (!skill) {
      skill = Alexa.SkillBuilders.custom()
      .addRequestHandlers(
        LaunchRequestIntentHandler,
        PresidentIntentHandler,
        ReaderIntentHandler,
        StudentIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
      )
      .addErrorHandlers(ErrorHandler)
      .create();
    }
  try {
    await new expressAdapter.SkillRequestSignatureVerifier().verify(JSON.stringify(req.body), req.headers);
    await new expressAdapter.TimestampVerifier().verify(JSON.stringify(req.body));

    skill.invoke(req.body)
      .then(function(responseBody) {
        res.json(responseBody);
      })
      .catch(function(error) {
        console.log(error);
        res.status(400).send('Error during the request');
      });
  } catch (err) {
    console.log(err);
    res.status(400).send('Error during the request');
  }



});

app.listen(app.get('port'), function() {
  console.log('app running on port', app.get('port'));
});
console.log('Magic happens on port ' + app.get('port'));

// app.listen(3000);
