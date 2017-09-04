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
    fs.readFile(path.join(__dirname, 'mail/assegnation.html'), 'utf8', function (err,html) {
      if (err) {
        return console.log(err);
      }
      templateMail = html;
      // create reusable transporter object using the default SMTP transport
      transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "jwmeetingscorze@gmail.com",
          pass: "jw-meeting"
        }
      });
      send()
    });
  }else{
    send()
  }
}

router.route('/temp')
  .get(function(req, res) {
    WeekTemp
      .find()
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
      }
    });
  })

router.route('/')
  .get(function(req, res) {
    Week
      .find()
      .sort([['date', 'descending']])
      .exec(function(err, weeks) {
        if (err)
          res.send(err);

        res.json(weeks);
      });
  })
  .post(function(req, res) {

    var mailToSend = [];

    var updateWeek = function(week, nextWeek){
      console.log('Week', week.toString());
      if(week.type.meeting && !week.supervisor) {
        console.log('Date', week.date);
        console.log('President', week.president._id);
        console.log('Gems', week.gems.brother._id);
        console.log('Talk', week.talk.brother._id);
        var toFind = [
          {'_id': week.president._id},
          {'_id': week.gems.brother._id},
          {'_id': week.talk.brother._id},
          {'_id': week.initialPrayer._id},
          {'_id': week.finalPrayer._id},
          {'_id': week.congregationBibleStudy.brother._id},
          {'_id': week.congregationBibleStudy.reader._id},
          {'_id': week.bibleReading.primarySchool.student._id}
        ];
        if(week.secondarySchool){
          toFind.push({'_id': week.bibleReading.secondarySchool.student._id});
        }

        if(!week.presentationExercise.enabled){
          toFind.push({'_id': week.initialCall.primarySchool.student._id});
          toFind.push({'_id': week.initialCall.primarySchool.assistant._id});
          toFind.push({'_id': week.returnVisit.primarySchool.student._id});
          toFind.push({'_id': week.returnVisit.primarySchool.assistant._id});
          toFind.push({'_id': week.bibleStudy.primarySchool.student._id});
          if(!week.bibleStudy.primarySchool.isTalk)
            toFind.push({'_id': week.bibleStudy.primarySchool.assistant._id});
          if(week.secondarySchool){
            toFind.push({'_id': week.initialCall.secondarySchool.student._id});
            toFind.push({'_id': week.initialCall.secondarySchool.assistant._id});
            toFind.push({'_id': week.returnVisit.secondarySchool.student._id});
            toFind.push({'_id': week.returnVisit.secondarySchool.assistant._id});
            toFind.push({'_id': week.bibleStudy.secondarySchool.student._id});
            if(!week.bibleStudy.secondarySchool.isTalk)
              toFind.push({'_id': week.bibleStudy.secondarySchool.assistant._id});
          }
        }

        console.log("To find", toFind.length);

        Brother.find({
          $or: toFind
        })
          .populate('elder')
          .populate('servant')
          .populate('prayer')
          .populate('reader')
          .populate('student')
          .exec(function (err, brothers) {
            if (err)
              res.send(err);

            console.log('Length', brothers.length);

            async.each(brothers, function (brother, nextBrother) {
              var objToSave = [];

              if (brother.elder) {
                if (brother._id == week.president._id)
                  brother.elder.presidentDate = week.date;

                if (brother._id == week.gems.brother._id)
                  brother.elder.gemsDate = week.date;

                if (brother._id == week.talk.brother._id)
                  brother.elder.talkDate = week.date;

                if (brother._id == week.congregationBibleStudy.brother._id)
                  brother.elder.bibleStudyDate = week.date;

                objToSave.push(brother.elder);
              }
              if (brother.servant) {
                if (brother._id == week.gems.brother._id)
                  brother.servant.gemsDate = week.date;
                if (brother._id == week.talk.brother._id)
                  brother.servant.talkDate = week.date;
                objToSave.push(brother.servant)
              }
              if (brother.prayer) {
                if (brother._id == week.initialPrayer._id)
                  brother.prayer.date = week.date;

                if (brother._id == week.finalPrayer._id)
                  brother.prayer.date = week.date;

                objToSave.push(brother.prayer)
              }
              if (brother.reader) {
                if (brother._id == week.congregationBibleStudy.reader._id)
                  brother.reader.date = week.date;

                objToSave.push(brother.reader)
              }
              if (brother.student) {
                if (brother._id == week.bibleReading.primarySchool.student._id){
                  brother.student.lastDate = week.date
                  brother.student.bibleReadingPrevDate =  brother.student.bibleReadingDate;
                  brother.student.bibleReadingDate = week.date;
                  brother.student.lastSchool = 1;
                  brother.student.lastPrevSchool = (brother.student.lastSchool == 1 ? 1 : 2);
                  brother.student.bibleReadinglastPrevSchool = (brother.student.bibleReadingLastSchool == 1 ? 1 : 2);
                  brother.student.bibleReadingLastSchool = 1;
                  if(!week.bibleReading.primarySchool.pointChanged){
                    brother.student.bibleReadingPendingStudyNumber = brother.student.bibleReadingStudyNumber;
                  }else{
                    brother.student.bibleReadingPendingStudyNumber = week.bibleReading.primarySchool.student.student.bibleReadingPendingStudyNumber;
                  }
                  objToSave.push(brother.student);
                  if(brother.email && config.SEND_ASSEGNATION){
                    mailToSend.push({mail:brother.email, brother: brother.surname+ ' '+brother.name, assistant:'', type:"bibleReading", school:brother.student.lastSchool, date:week.date, point:brother.student.bibleReadingPendingStudyNumber})
                  }
                }

                if (week.secondarySchool && brother._id == week.bibleReading.secondarySchool.student._id){
                  brother.student.lastDate = week.date
                  brother.student.bibleReadingPrevDate =  brother.student.bibleReadingDate;
                  brother.student.bibleReadingDate = week.date;
                  brother.student.lastPrevSchool = (brother.student.lastSchool == 1 ? 1 : 2);
                  brother.student.lastSchool = 2;
                  brother.student.bibleReadinglastPrevSchool = (brother.student.bibleReadingLastSchool == 1 ? 1 : 2);
                  brother.student.bibleReadingLastSchool = 2;
                  if(!week.bibleReading.secondarySchool.pointChanged){
                    brother.student.bibleReadingPendingStudyNumber = brother.student.bibleReadingStudyNumber;
                  }else{
                    brother.student.bibleReadingPendingStudyNumber = week.bibleReading.secondarySchool.student.student.bibleReadingPendingStudyNumber;
                  }
                  // brother.student.bibleReadingPendingStudyNumber = brother.student.bibleReadingStudyNumber;
                  objToSave.push(brother.student)
                  if(brother.email && config.SEND_ASSEGNATION){
                    mailToSend.push({mail:brother.email, brother: brother.surname+ ' '+brother.name, assistant:'', type:"bibleReading", school:brother.student.lastSchool, date:week.date, point:brother.student.bibleReadingPendingStudyNumber})
                  }
                }
              }
              if (!week.presentationExercise.enabled){
                if (brother.student) {
                  var arr = ["initialCall", "returnVisit","bibleStudy"];
                  var schools = ["primarySchool", "secondarySchool"];
                  arr.forEach(function(partType){
                    schools.forEach(function(school){
                      if (brother._id == week[partType][school].student._id){
                        brother.student.lastDate = week.date;
                        brother.student[partType+"PrevDate"] = brother.student[partType+"Date"] ;
                        brother.student[partType+"Date"] = week.date;
                        brother.student[partType+"LastPrevSchool"] = (brother.student[partType+"LastSchool"] == 1 ? 1 : 2);
                        brother.student[partType+"LastSchool"] = (school=="primarySchool"?1:2);
                        brother.student.lastPrevSchool = (brother.student.lastSchool == 1 ? 1 : 2);
                        brother.student.lastSchool = (school=="primarySchool"?1:2);
                        if(!week[partType][school].pointChanged){
                          brother.student.pendingStudyNumber = brother.student.studyNumber;
                        }else{
                          brother.student.pendingStudyNumber = week[partType][school].student.student.pendingStudyNumber;
                        }

                        objToSave.push(brother.student)
                        if(brother.email && config.SEND_ASSEGNATION){
                          var obj = {mail:brother.email, brother: brother.surname+ ' '+brother.name, assistant:'', type:(week[partType][school].isTalk ? 'talk': partType), school:brother.student.lastSchool, date:week.date, point:brother.student.pendingStudyNumber};
                          obj.assistant = (week[partType][school].assistant ? week[partType][school].assistant.surname+ ' '+ week[partType][school].assistant.name : '')
                          mailToSend.push({mail:brother.email, brother: brother.surname+ ' '+brother.name, type:partType, school:brother.student.lastSchool, date:week.date, point:brother.student.pendingStudyNumber})
                        }
                      }
                      if (!week[partType][school].isTalk && brother._id == week[partType][school].assistant._id){
                        brother.student.assistantDate = week.date;
                        brother.student.assistantLastSchool = (school=="primarySchool"?1:2);
                        objToSave.push(brother.student)
                      }
                    })
                  })

                }
              }

              async.each(objToSave, function(obj, nextObj) {
                obj.save(function(err) {
                  if (err)
                    res.send(err);
                  console.log("Updated",brother.name+" "+brother.surname)
                  nextObj();
                });
              },function(err) {
                if( err ) {
                  console.log('Brother update failed');
                } else {
                  console.log("Finish to update", brother.name+" "+brother.surname);
                  nextBrother();
                }
              });

            }, function (err) {
              if (err) {
                console.log('Update week failed');
              } else {
                console.log("finish to update week", week.date);
                var tempWeek = new Week(week);
                tempWeek.completed = false;

                tempWeek.save(function(err) {
                  nextWeek();
                  if (err)
                    console.error(err);
                  else
                    console.log("Week saved")
                });

              }
            })

          });
        }else{
          var tempWeek = new Week(week);
          tempWeek.completed = true;

          tempWeek.save(function(err) {
            nextWeek();
            if (err)
              console.error(err);
            else
              console.log("Week saved")
          });
        }
      }

      async.each(req.body, function(week, nextWeek) {
        console.log("start to update week", week.date);
        updateWeek(week, nextWeek)
      },function(err) {
        if( err ) {
          console.log('Process failed');
        } else {

          res.json({ message: 'All weeks updated!' });

          var weekDate = new Date(req.body[0].date);
          WeekTemp.remove({"date": {"$gte": new Date(weekDate.getFullYear(), weekDate.getMonth(), 1), "$lt": new Date(weekDate.getFullYear(), weekDate.getMonth()+1, 6)}});
          console.log('All weeks updated');
          sendMails(mailToSend);

        }
      });

  });

router.route('/pgm/:year/:month')

  .post(function(req, res) {
    Week.find({"date": {"$gte": new Date(req.params.year, req.params.month, 1), "$lt": new Date(req.params.year, req.params.month+1, 6)}})
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
      .sort([['date', 'ascending']])


      .exec(function (err, weeks) {
        if (err)
          res.send(err);

        // var weekDate = new Date(req.body.date);
        // console.log(weekDate);
        // console.log(weekDate.getFullYear());
        // console.log(weekDate.getMonth());
        // WeekTemp.remove({"date": {"$gte": new Date(weekDate.getFullYear(), weekDate.getMonth(), 1), "$lt": new Date(weekDate.getFullYear(), weekDate.getMonth()+1, 6)}})


        res.json(weeks);

      });
  })

router.route('/:week_id')

  .get(function(req, res) {
    Week.find({_id:req.params.week_id})
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
        var mailToSend = [];
        var week = week[0];
        // if(config.SEND_ASSEGNATION){
        //   var brother = week.bibleReading.primarySchool.student;
        //   brother.email = "kristianl_91@hotmail.it";
        //   mailToSend.push({mail:brother.email, brother: brother.surname+ ' '+brother.name, assistant:'', type:"bibleReading", school:brother.student.lastSchool, date:week.date, point:brother.student.bibleReadingPendingStudyNumber})
        //   var brother = week.bibleReading.secondarySchool.student;
        //   brother.email = "kristianl_91@hotmail.it";
        //   mailToSend.push({mail:brother.email, brother: brother.surname+ ' '+brother.name, assistant:'', type:"bibleReading", school:brother.student.lastSchool, date:week.date, point:brother.student.bibleReadingPendingStudyNumber})
        //   if (!week.presentationExercise.enabled) {
        //       var arr = ["initialCall", "returnVisit", "bibleStudy"];
        //       var schools = ["primarySchool", "secondarySchool"];
        //       arr.forEach(function (partType) {
        //         schools.forEach(function (school) {
        //           var brother = week[partType][school].student;
        //           brother.email = "kristianl_91@hotmail.it";
        //             if (brother.email && config.SEND_ASSEGNATION) {
        //               var obj = {
        //                 mail: brother.email,
        //                 brother: brother.surname + ' ' + brother.name,
        //                 assistant: '',
        //                 type: (week[partType][school].isTalk ? 'talk' : partType),
        //                 school: brother.student.lastSchool,
        //                 date: week.date,
        //                 point: brother.student.pendingStudyNumber
        //               };
        //               obj.assistant = (week[partType][school].assistant ? week[partType][school].assistant.surname + ' ' + week[partType][school].assistant.name : '')
        //               mailToSend.push(obj)
        //           }
        //         })
        //       })
        //
        //   }
        //   sendMails(mailToSend);
        // }



      });
  })
  .put(function(req, res) {
    // Week.findById(req.params.week_id, function(err, week) {
    var week = req.body;
      var partTypes = ["bibleReading", "initialCall", "returnVisit","bibleStudy"];
      var schools = ["primarySchool"];
      if(week.presentationExercise.enabled){
        partTypes = ["bibleReading"]
      }else{
        if(week.secondarySchool){
          schools.push("secondarySchool");
        }
      }

          var toFind = [];
          var historiesToSave = [];
          for(var i = 0; i<partTypes.length;i++) {
            for(var j = 0; j<schools.length;j++) {
              if(week[partTypes[i]][schools[j]].made != 0 && !week[partTypes[i]][schools[j]].updated) {

                console.log('Student to Find', week[partTypes[i]][schools[j]].student.name);
                toFind.push({'_id': week[partTypes[i]][schools[j]].student._id})
              }
            }
          }

      console.log('Length', toFind.length);

          Brother.find({
            $or: toFind
          })
            .populate('student')
            .exec(function (err, brothers) {
              if (err)
                res.send(err);

              console.log('Length', brothers.length);

              async.each(brothers, function (brother, nextBrother) {

                partTypes.forEach(function(partType){
                  schools.forEach(function(school){
                    if (brother._id == week[partType][school].student._id){
                      var history = new History();
                      history.date = week.date;
                      history.student = week[partType][school].student;
                      if (partType == 'bibleReading') {
                        history.studyNumber = brother.student.bibleReadingPendingStudyNumber;
                      } else {
                        history.studyNumber = brother.student.pendingStudyNumber;
                      }
                      if(week[partType][school].made == 1){
                        if(week[partType][school].pointCompleted) {
                          if (partType == 'bibleReading') {
                            brother.student.bibleReadingStudyNumber = week[partType][school].student.student.bibleReadingStudyNumber;
                          } else {
                            brother.student.studyNumber = week[partType][school].student.student.studyNumber;
                          }
                        }
                        history.made = true;
                        history.pointCompleted = week[partType][school].pointCompleted;
                      }else if(week[partType][school].made == 2){
                        brother.student.lastDate = brother.student.lastPrevDate;
                        brother.student[partType+"Date"] = brother.student[partType+"PrevDate"];
                        brother.student.lastSchool = brother.student.lastPrevSchool;
                        brother.student[partType+"LastSchool"] = brother.student[partType+"LastPrevSchool"];
                        if(partType=='bibleReading'){
                          brother.student.bibleReadingStudyNumber = brother.student.bibleReadingPendingStudyNumber;
                        }else{
                          brother.student.studyNumber = brother.student.pendingStudyNumber;
                        }
                        history.made = false;
                        history.pointCompleted = false;
                      }
                      historiesToSave.push(history)
                      week[partType][school].updated = true;
                    }
                  })
                });

                brother.student.save(function(err) {
                  if (err)
                    res.send(err);
                  console.log("Finish to update: ",brother.name+" "+brother.surname)
                  nextBrother();
                });

              }, function (err) {
                if (err) {
                  console.log('Update week failed');
                } else {
                  async.each(historiesToSave, function (history, nextHistory) {

                    history.save(function(err) {
                      if (err)
                        res.send(err);
                      console.log("History added")
                      nextHistory();
                    });

                  }, function (err) {
                    if (err) {
                      console.log('Update week failed');
                    } else {
                      console.log("finish to update week", week.date);
                      var tempWeek = new Week(week);
                      var completed = true;
                      partTypes.forEach(function(partType){
                        schools.forEach(function(school){
                          if(!week[partType][school].updated)
                            completed = false;
                        })
                      });
                      tempWeek.completed = completed;
                      var w = tempWeek.toObject();
                      delete w._id;
                      //
                      Week.findOneAndUpdate({'_id':req.params.week_id}, w, {upsert:true}, function(err, doc){
                        if (err)
                          console.error(err);
                        else{
                          console.log("Week saved")
                          res.send(w);
                        }
                      });
                      // tempWeek.save(function(err) {
                      //   if (err)
                      //     console.error(err);
                      //   else
                      //     console.log("Week saved")
                      // });

                    }
                  })
                }
              })

            // });
    });
  })
  .delete(function(req, res) {
    Week.remove({
      _id: req.params.week_id
    }, function(err, week) {
      if (err)
        res.send(err);

      res.json({ message: 'Successfully deleted' });
    });
  });

module.exports = router;






