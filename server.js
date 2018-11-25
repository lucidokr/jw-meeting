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
var Brother = require('./api/models/brother');


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

mongoose.connect(process.env.MONGO_DB_URI);
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

app.use('/api', router);

app.listen(app.get('port'), function() {
    console.log('app running on port', app.get('port'));
});
console.log('Magic happens on port ' + app.get('port'));

if (process.env.NODE_ENV && process.env.NODE_ENV != "development") {
    var http = require("http");
    setInterval(function() {
        http.get("http://jw-meeting.herokuapp.com");
    }, 1500000);
}

// JOB FOR SEND ASSEGNATIONS
if(process.env.SEND_ASSEGNATION == "true"){
    var j = schedule.scheduleJob({hour: 10, minute: 00, dayOfWeek: 1}, async () => {
      console.log('Start reminder assegnationsjob');

      try{
        var weeks = await Week
          .sort([
              ['date', 'descending']
          ])
      }catch(e){
        return;
      }

      var schools = ["primarySchool"];
      var mailAssegnationReminderToSend = [];
      for (let week of weeks){
        var date = new Date(week.date);
        var month = MONTH_NAMES[date.getMonth()];
        var day = DAY_NAMES[date.getDay()-1];
        var strDate = day+" " +date.getDate() + " " + month + " " + date.getFullYear();

        schools = ["primarySchool"];
        if(week.secondarySchool){
          schools.push("secondarySchool");
        }
        var date = new Date();
        if(week.date.getTime() < date.getTime() && (week.date.getTime() + (6*24*60*60*1000)) > date.getTime() ){
          if (week.type.meeting && !week.supervisor) {
            for(let school of schools){
              var brother = week.bibleReading[school].student;
              if (brother.email && process.env.SEND_ASSEGNATION == "true") {
                  mailAssegnationReminderToSend.push({
                    mail: brother.email,
                    brother: brother.name + ' ' + brother.surname,
                    assistant: "",
                    type: week.bibleReading.label,
                    school: brother.student.lastSchool,
                    date: strDate
                  });
              }
              for(let part of week.ministryPart){
                if(part.forStudent){
                  var brother = part[school].student;
                  if (brother.email && process.env.SEND_ASSEGNATION == "true") {
                      mailAssegnationReminderToSend.push({
                        mail: brother.email,
                        brother: brother.name + ' ' + brother.surname,
                        assistant: (part[school].assistant ? '<h3>Assistente: '+part[school].assistant.surname + ' ' + part[school].assistant.name+'</h3>' : null),
                        type: part.html,
                        school: brother.student.lastSchool,
                        date: strDate
                      });
                  }
                }
              }
            }
            if(mailAssegnationReminderToSend.length > 0){
              MAIL.sendReminderAssegnations(mailAssegnationReminderToSend);
            }
          }
        }
      }

    });
}
