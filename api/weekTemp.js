var express = require('express');
var router = express.Router();
var Week = require('./models/weekMeeting');
var WeekTemp = require('./models/weekMeetingTemp');
var async = require('async');
var Brother = require('./models/brother');
var History = require('./models/history');
var XLSX = require('xlsx');
var nodemailer = require('nodemailer');
var fs = require('fs')
var path = require('path');

var config = require(path.join(__dirname, 'env.json'))[process.env.NODE_ENV || 'development'];

var templateMail = "";
var transporter = null;

var sendMails = function(mails){
  if(mails && mails.length > 0){
    mails.forEach(function(data){
      if(data.type=="bibleReading") data.type = "Lettura biblica";
      if(data.type=="initialCall") data.type = "Primo contatto";
      if(data.type=="returnVisit") data.type = "Visita ulteriore";
      if(data.type=="bibleStudy") data.type = "Studio biblico";
      if(data.type=="talk") data.type = "Discorso";
      if(data.school==1) data.school = "Sala principale";
      if(data.school==2) data.school = "Classe supplementare 1";
      var date = new Date(data.date);
      data.date = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
      sendMail(data.mail, data.brother, data.assistant, data.date, data.point.number+ ' - '+data.point.title, data.type, data.school)
    })
  }
}

var sendMail = function(mail, brother, assistant, date, point, type, school){

  function send(){
    if(!data){
      var data = {
        brother: brother || "Kristian Lucido",
        assistant: assistant || "",
        date: date || "10/10/17",
        point: point || "6 - Enfasi Orale",
        type: type || "Lettura biblica",
        school: school || "Sala principale"
      };
      console.log(data);
    }

    var tempMail = templateMail;
    Object.keys(data).forEach(function(k){
      tempMail = tempMail.replace("{{"+k+"}}",data[k])
    });

    var mailOptions = {
      from: 'Adunanza Vita Cristiana e Ministero <jwmeetingscorze@gmail.com>',
      to: mail,
      subject: 'Assegnazione '+data.type+' - '+data.date,
      html: tempMail
    };

// send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
    });
  }

  if(templateMail != "" || !transporter){
    fs.readFile(path.join(__dirname, 'mail/assegnation2.html'), 'utf8', function (err,html) {
      if (err) {
        return console.log(err);
      }
      templateMail = html;
      // create reusable transporter object using the default SMTP transport
      transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.GMAIL_ACCOUNT,
          pass: process.env.GMAIL_ACCOUNT_PASSWORD
        }
      });
      send()
    });
  }else{
    send()
  }
}

router.route('/')
    .get(function(req, res) {
        WeekTemp
            .find({congregation:req.decoded._doc.congregation._id})
            .populate('presentationExercise.brother')
            .populate('christianLivingPart.brother')
            .sort([['date', 'ascending']])
            .exec(function(err, weeks) {
                if (err)
                    res.send(err);

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
                if (err)
                    console.error(err);
                else
                    console.log("Week saved")
            });
        }
        async.each(req.body, function(week, nextWeek) {
            console.log("start to update week", week.date);
            updateWeek(week, nextWeek)
        },function(err) {
            if( err ) {
                console.log('Process failed');
            } else {
                res.json({ message: 'All weeks updated!' });
                console.log('All weeks updated');
                Brother
                    .find({})
                    .populate('elder')
                    .exec(function(err, brothers) {
                        if (err)
                            res.send(err);

                        var schoolOverseer
                        for(var i=0; i<brothers.length; i++){
                          if(brothers[i].elder && brothers[i].elder.schoolOverseer)
                            schoolOverseer = brothers[i];
                        }
                        if(schoolOverseer && schoolOverseer.email){
                            if(!transporter){
                                transporter = nodemailer.createTransport({
                                    service: "Gmail",
                                    auth: {
                                        user: process.env.GMAIL_ACCOUNT,
                                        pass: process.env.GMAIL_ACCOUNT_PASSWORD
                                    }
                                });
                            }
                            var date = new Date(req.body[0].date);
                            var str = (date.getMonth()+1)+"/"+date.getFullYear();
                            var mailOptions = {
                                from: 'Adunanza Vita Cristiana e Ministero <jwmeetingscorze@gmail.com>',
                                to: schoolOverseer.email,
                                subject: 'Programma inserito dal coordinatore',
                                text: 'Il coordinatore ha inserito il programma del mese di: ' +str,
                            };
                            if(!process.env.NODE_ENV || process.env.NODE_ENV == "development"){
                              mailOptions.to ='kristianl_91@hotmail.it'
                            }
                            transporter.sendMail(mailOptions, function(error, info){
                                if (error) {
                                    return console.log(error);
                                }
                                console.log('Message %s sent: %s', info.messageId, info.response);
                            });
                        }
                    });

            }
        });
    })

router.route('/:week_id')

    .get(function(req, res) {
        WeekTemp.find({_id:req.params.week_id})
            .populate('initialPrayer')
            .populate('finalPrayer')
            .populate('president')
            .populate('talk.brother')
            .populate('gems.brother')
            .populate('presentationExercise.brother')
            .populate({path : 'bibleReading.primarySchool.student', populate : {path : 'student', populate : [{path : 'bibleReadingStudyNumber'},{path : 'bibleReadingPendingStudyNumber'}]}})
            .populate({path : 'bibleReading.secondarySchool.student', populate : {path : 'student', populate : [{path : 'bibleReadingStudyNumber'},{path : 'bibleReadingPendingStudyNumber'}]}})
            .populate({path : 'initialCall.primarySchool.student', populate : {path : 'student', populate : [{path : 'studyNumber'},{path : 'pendingStudyNumber'}]}})
            .populate({path : 'returnVisit.primarySchool.student', populate : {path : 'student', populate : [{path : 'studyNumber'},{path : 'pendingStudyNumber'}]}})
            .populate({path : 'bibleStudy.primarySchool.student', populate : {path : 'student', populate : [{path : 'studyNumber'},{path : 'pendingStudyNumber'}]}})
            .populate('initialCall.primarySchool.assistant')
            .populate('returnVisit.primarySchool.assistant')
            .populate('bibleStudy.primarySchool.assistant')
            .populate({path : 'initialCall.secondarySchool.student', populate : {path : 'student', populate : [{path : 'studyNumber'},{path : 'pendingStudyNumber'}]}})
            .populate({path : 'returnVisit.secondarySchool.student', populate : {path : 'student', populate : [{path : 'studyNumber'},{path : 'pendingStudyNumber'}]}})
            .populate({path : 'bibleStudy.secondarySchool.student', populate : {path : 'student', populate : [{path : 'studyNumber'},{path : 'pendingStudyNumber'}]}})
            .populate('initialCall.secondarySchool.assistant')
            .populate('returnVisit.secondarySchool.assistant')
            .populate('bibleStudy.secondarySchool.assistant')
            .populate('congregationBibleStudy.brother')
            .populate('congregationBibleStudy.reader')
            .populate('christianLivingPart.brother')


            .exec(function (err, week) {
                if (err)
                    res.send(err);

                res.json(week[0]);
            });
    })
    .put(function(req, res){
      var newWeek = req.body;
        WeekTemp.findOneAndUpdate({'_id':req.params.week_id}, newWeek, {upsert:true}, function(err, doc){
            if (err)
                console.error(err);
            else{
                res.json({ message: 'Temp weeks updated!' });
                console.log('Temp weeks updated');
            }
        });
    })

module.exports = router;






