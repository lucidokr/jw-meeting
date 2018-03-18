var express = require('express');
var router = express.Router();
var Week = require('./models/weekMeeting');
var WeekTemp = require('./models/weekMeetingTemp');
var async = require('async');
var Brother = require('./models/brother');
var User = require('./models/user');
var History = require('./models/history');
var XLSX = require('xlsx');
var nodemailer = require('nodemailer');
var fs = require('fs')
var path = require('path');
var MAIL = require('./mail/send-mailgun');

if (!process.env.NODE_ENV || process.env.NODE_ENV == "development") {
    var config = require('./env.json')['development'];
    process.env.MONGO_DB_URI = config.MONGO_DB_URI;
    process.env.SECRET = config.SECRET;
    process.env.GMAIL_ACCOUNT = config.GMAIL_ACCOUNT;
    process.env.GMAIL_ACCOUNT_PASSWORD = config.GMAIL_ACCOUNT_PASSWORD;
    process.env.SEND_ASSEGNATION = config.SEND_ASSEGNATION;
}

var templateMail = "";
var transporter = null;

router.route('/')
    .get(function(req, res) {
        WeekTemp
            .find({ congregation: req.decoded._doc.congregation._id })
            .populate('presentationExercise.brother')
            .populate('christianLivingPart.brother')
            .sort([
                ['date', 'ascending']
            ])
            .exec(function(err, weeks) {
                if (err) {
                    console.error('Weeks Meeting Temp get error:', err);
                    return res.send(err);
                }

                res.json(weeks);
            });
    })
    .post(function(req, res) {
        var updateWeek = function(week, nextWeek) {
            var tempWeek = new WeekTemp(week);
            tempWeek.congregation = req.decoded._doc.congregation;
            tempWeek.completed = false;

            tempWeek.save(function(err) {
                nextWeek();
                if (err) {
                    console.error('Weeks Meeting Temp update error:', err);
                } else
                    console.log("Week saved")
            });
        }
        async.each(req.body, function(week, nextWeek) {
            console.log("start to update week", week.date);
            updateWeek(week, nextWeek)
        }, function(err) {
            if (err) {
                console.error('Weeks Meeting Temp update error:', err);
            } else {
                res.json({ message: 'All weeks updated!' });
                console.log('All weeks updated');

                var date = new Date(req.body[0].date);
                var str = (date.getMonth() + 1) + "/" + date.getFullYear();

                MAIL.sendToRole('Programma Vita Cristiana inserito dal coordinatore',
                    'Il coordinatore ha inserito il programma del mese di: ' + str,
                    req, ['schoolOverseer'])

            }
        });
    })

router.route('/:week_id')

.get(function(req, res) {
        WeekTemp.find({ _id: req.params.week_id })
            .populate('initialPrayer')
            .populate('finalPrayer')
            .populate('president')
            .populate('talk.brother')
            .populate('gems.brother')
            .populate('presentationExercise.brother')
            .populate({ path: 'bibleReading.primarySchool.student', populate: { path: 'student', populate: [{ path: 'bibleReadingStudyNumber' }, { path: 'bibleReadingPendingStudyNumber' }] } })
            .populate({ path: 'bibleReading.secondarySchool.student', populate: { path: 'student', populate: [{ path: 'bibleReadingStudyNumber' }, { path: 'bibleReadingPendingStudyNumber' }] } })
            .populate({ path: 'initialCall.primarySchool.student', populate: { path: 'student', populate: [{ path: 'studyNumber' }, { path: 'pendingStudyNumber' }] } })
            .populate({ path: 'returnVisit.primarySchool.student', populate: { path: 'student', populate: [{ path: 'studyNumber' }, { path: 'pendingStudyNumber' }] } })
            .populate({ path: 'bibleStudy.primarySchool.student', populate: { path: 'student', populate: [{ path: 'studyNumber' }, { path: 'pendingStudyNumber' }] } })
            .populate('initialCall.primarySchool.assistant')
            .populate('returnVisit.primarySchool.assistant')
            .populate('bibleStudy.primarySchool.assistant')
            .populate({ path: 'initialCall.secondarySchool.student', populate: { path: 'student', populate: [{ path: 'studyNumber' }, { path: 'pendingStudyNumber' }] } })
            .populate({ path: 'returnVisit.secondarySchool.student', populate: { path: 'student', populate: [{ path: 'studyNumber' }, { path: 'pendingStudyNumber' }] } })
            .populate({ path: 'bibleStudy.secondarySchool.student', populate: { path: 'student', populate: [{ path: 'studyNumber' }, { path: 'pendingStudyNumber' }] } })
            .populate('initialCall.secondarySchool.assistant')
            .populate('returnVisit.secondarySchool.assistant')
            .populate('bibleStudy.secondarySchool.assistant')
            .populate('congregationBibleStudy.brother')
            .populate('congregationBibleStudy.reader')
            .populate('christianLivingPart.brother')


        .exec(function(err, week) {
            if (err) {
                console.error('Week Meeting Temp get error:', err);
            }

            res.json(week[0]);
        });
    })
    .put(function(req, res) {
        var newWeek = req.body;
        WeekTemp.findOneAndUpdate({ '_id': req.params.week_id }, newWeek, { upsert: true }, function(err, doc) {
            if (err) {
                console.error('Week Meeting Temp update error:', err);
            } else {
                res.json({ message: 'Temp weeks updated!' });
                console.log('Temp weeks updated');
            }
        });
    })

module.exports = router;
