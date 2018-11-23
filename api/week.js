var express = require('express');
var router = express.Router();
var Week = require('./models/weekMeeting');
var WeekTemp = require('./models/weekMeetingTemp');
var async = require('async');
var Brother = require('./models/brother');
var History = require('./models/history');
var User = require('./models/user');
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

const MONTH_NAMES = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
];

const DAY_NAMES = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];

function sendEmailError(subject, err){
  var mailOptions = {
    brother: "Amministratore",
    to: "kristianl_91@hotmail.it",
    subject: subject,
    text: "<p style='color:red;'>"+err+"</p>"
  };
  MAIL.sendMail(mailOptions);
}

router.route('/')
    .get(async (req, res) => {
      try{
        var weeks = await Week
            .find({ congregation: req.decoded._doc.congregation._id })
            .sort([
                ['date', 'descending']
            ])
            .exec();
        res.send(weeks)
      }catch(e){
        return res.status(500).send(err);
      }
    })
    .post(async (req, res) => {

        var session = await Brother.startSession();
        session.startTransaction()
        console.log('Start session');
        const opts = { session };


        var mailAssegnationToSend = [];
        var mailToSend = [];

        for (let week of req.body){
          console.log('Week', JSON.stringify(week));
            if (week.type.meeting && !week.supervisor) {
                console.log('Date', week.date);
                console.log('President', week.president._id);
                console.log('Gems', week.gems.brother._id);
                console.log('Talk', week.talk.brother._id);
                console.log('Initial Prayer', week.initialPrayer._id);
                console.log('Final Prayer', week.finalPrayer._id);
                console.log('Congregation Bible Study', week.congregationBibleStudy.brother._id);
                console.log('Congregation Bible Study Reader', week.congregationBibleStudy.reader._id);
                console.log('Bible reading', week.bibleReading.primarySchool.student._id);
                var toFind = [
                    { '_id': week.president._id },
                    { '_id': week.gems.brother._id },
                    { '_id': week.talk.brother._id },
                    { '_id': week.initialPrayer._id },
                    { '_id': week.finalPrayer._id },
                    { '_id': week.congregationBibleStudy.brother._id },
                    { '_id': week.congregationBibleStudy.reader._id },
                    { '_id': week.bibleReading.primarySchool.student._id }
                ];

                for (var i = 0; i < week.christianLivingPart.length; i++) {
                    toFind.push({ '_id': week.christianLivingPart[i].brother._id });
                }

                if (week.secondarySchool) {
                    toFind.push({ '_id': week.bibleReading.secondarySchool.student._id });
                }

                //AFTER 2019
                week.ministryPart.forEach(function(part){
                  if(part.forStudent){
                    toFind.push({ '_id': part.primarySchool.student._id });
                    if(!part.isTalk)
                      toFind.push({ '_id': part.primarySchool.assistant._id });
                    if (week.secondarySchool) {
                      toFind.push({ '_id': part.secondarySchool.student._id });
                      if(!part.isTalk)
                        toFind.push({ '_id': part.secondarySchool.assistant._id });
                    }
                  }
                });

                console.log("To find", toFind.length);
                try{
                  var brothers = await Brother.find({
                      $or: toFind
                  }, null, opts)
                  .populate('elder')
                  .populate('servant')
                  .populate('prayer')
                  .populate('reader')
                  .populate('student')
                  .exec()


                  for (let brother of brothers){
                    var objToSave = [];
                    var date = new Date(week.date);
                    // var strDate = date.toLocaleString("it-it", { month: "long" });
                    var month = MONTH_NAMES[date.getMonth()];
                    var day = DAY_NAMES[date.getDay()-1];
                    var strDate = day+" " +date.getDate() + " " + month + " " + date.getFullYear();

                    if (brother.elder) {
                        if (brother._id == week.president._id) {
                            brother.elder.presidentPrevDate = brother.elder.presidentDate ;
                            brother.elder.presidentDate = week.date;
                        }

                        if (brother._id == week.gems.brother._id) {
                            brother.elder.gemsPrevDate = brother.elder.gemsDate;
                            brother.elder.gemsDate = week.date;
                          }

                        if (brother._id == week.talk.brother._id) {
                            brother.elder.talkPrevDate = brother.elder.talkDate;
                            brother.elder.talkDate = week.date;
                          }

                        if (brother._id == week.congregationBibleStudy.brother._id) {
                            brother.elder.bibleStudyPrevDate = brother.elder.bibleStudyDate;
                            brother.elder.bibleStudyDate = week.date;
                          }

                        for (var i = 0; i < week.christianLivingPart.length; i++) {
                            if (brother._id == week.christianLivingPart[i].brother._id) {
                                brother.elder.christianLivingPartPrevDate = brother.elder.christianLivingPartDate;
                                brother.elder.christianLivingPartDate = week.date;
                            }
                        }

                        objToSave.push(brother.elder);
                    }
                    if (brother.servant) {
                        if (brother._id == week.gems.brother._id) {
                            brother.servant.gemsPrevDate = brother.servant.gemsDate;
                            brother.servant.gemsDate = week.date;
                        }
                        if (brother._id == week.talk.brother._id) {
                            brother.servant.talkPrevDate = brother.servant.talkDate;
                            brother.servant.talkDate = week.date;
                        }

                        for (var i = 0; i < week.christianLivingPart.length; i++) {
                            if (brother._id == week.christianLivingPart[i].brother._id) {
                                brother.servant.christianLivingPartPrevDate = brother.servant.christianLivingPartDate;
                                brother.servant.christianLivingPartDate = week.date;
                            }
                        }
                        objToSave.push(brother.servant)
                    }
                    if (brother.prayer) {
                        if (brother._id == week.initialPrayer._id) {
                            brother.prayer.prevDate = brother.prayer.date;
                            brother.prayer.date = week.date;
                            if (brother.email && process.env.SEND_ASSEGNATION == "true") {
                                mailToSend.push({
                                    brother: brother.name+ ' '+ brother.surname,
                                    to: brother.email,
                                    subject: "Preghiera iniziale - "+strDate,
                                    text: "Ti è stata assegnata la preghiera iniziale dell'adunanza che si svolgerà il giorno " + strDate
                                });
                            }
                        }

                        if (brother._id == week.finalPrayer._id) {
                            if (brother.email && process.env.SEND_ASSEGNATION == "true") {
                                mailToSend.push({
                                    brother: brother.name+ ' '+ brother.surname,
                                    to: brother.email,
                                    subject: "Preghiera finale - "+strDate,
                                    text: "Ti è stata assegnata la preghiera finale dell'adunanza che si svolgerà il giorno " + strDate
                                });
                            }
                            brother.prayer.prevDate = brother.prayer.date;
                            brother.prayer.date = week.date;
                        }

                        objToSave.push(brother.prayer)
                    }
                    if (brother.reader) {
                        if (brother._id == week.congregationBibleStudy.reader._id) {
                            brother.reader.prevDate = brother.reader.date;
                            brother.reader.date = week.date;
                            if (brother.email && process.env.SEND_ASSEGNATION == "true") {
                              mailToSend.push({
                                  brother: brother.name+ ' '+ brother.surname,
                                  to: brother.email,
                                  subject: "Lettura dello studio biblico - "+strDate,
                                  text: "Ti è stata assegnata la lettura dello studio biblico dell'adunanza che si svolgerà il giorno " + strDate
                              })
                          }
                        }

                        objToSave.push(brother.reader)


                    }

                    if (brother.student) {
                        if (brother._id == week.bibleReading.primarySchool.student._id) {
                            brother.student.lastDate = week.date
                            brother.student.bibleReadingPrevDate = brother.student.bibleReadingDate;
                            brother.student.bibleReadingDate = week.date;
                            brother.student.lastSchool = 1;
                            brother.student.lastPrevSchool = (brother.student.lastSchool == 1 ? 1 : 2);
                            brother.student.bibleReadinglastPrevSchool = (brother.student.bibleReadingLastSchool == 1 ? 1 : 2);
                            brother.student.bibleReadingLastSchool = 1;
                            objToSave.push(brother.student);
                            if (brother.email && process.env.SEND_ASSEGNATION == "true") {
                                mailAssegnationToSend.push({
                                  mail: brother.email,
                                  brother: brother.surname + ' ' + brother.name,
                                  assistant: null,
                                  type: week.bibleReading.label,
                                  school: brother.student.lastSchool,
                                  date: strDate })
                            }
                        }

                        if (week.secondarySchool && brother._id == week.bibleReading.secondarySchool.student._id) {
                            brother.student.lastDate = week.date
                            brother.student.bibleReadingPrevDate = brother.student.bibleReadingDate;
                            brother.student.bibleReadingDate = week.date;
                            brother.student.lastPrevSchool = (brother.student.lastSchool == 1 ? 1 : 2);
                            brother.student.lastSchool = 2;
                            brother.student.bibleReadinglastPrevSchool = (brother.student.bibleReadingLastSchool == 1 ? 1 : 2);
                            brother.student.bibleReadingLastSchool = 2;
                            // brother.student.bibleReadingPendingStudyNumber = brother.student.bibleReadingStudyNumber;
                            objToSave.push(brother.student)
                            if (brother.email && process.env.SEND_ASSEGNATION == "true") {
                                // console.log("Bible reading study number:"+ brother.student.bibleReadingPendingStudyNumber);
                                mailAssegnationToSend.push({
                                  mail: brother.email,
                                  brother: brother.surname + ' ' + brother.name,
                                  assistant: null,
                                  type: week.bibleReading.label,
                                  school: brother.student.lastSchool,
                                  date: week.date
                                })
                            }
                        }
                    }

                      //AFTER 2019
                      var schools = ["primarySchool"];
                      if(week.secondarySchool){
                        schools.push("secondarySchool");
                      }
                      week.ministryPart.forEach(function(part){
                        if(part.forStudent){
                          schools.forEach(function(school) {
                            if (brother._id == part[school].student._id) {
                              brother.student.lastDate = week.date;
                              if(part[school].isTalk){
                                brother.student.talkPrevDate = brother.student.talkDate;
                                brother.student.talkDate = week.date;

                                brother.student.talkLastPrevSchool = (brother.student.talkLastSchool == 1 ? 1 : 2);;
                                brother.student.talkLastSchool = (school == "primarySchool" ? 1 : 2);
                              }else{
                                brother.student.ministryPartPrevDate = brother.student.ministryPartDate;
                                brother.student.ministryPartDate = week.date;

                                brother.student.ministryPartLastPrevSchool = (brother.student.lastSministryPartLastSchoolchool == 1 ? 1 : 2);;
                                brother.student.ministryPartLastSchool = (school == "primarySchool" ? 1 : 2);
                              }

                              objToSave.push(brother.student);
                                if (brother.email && process.env.SEND_ASSEGNATION == "true") {
                                    console.log("Assistant:"+ part[school].assistant);
                                    mailAssegnationToSend.push({
                                      mail: brother.email,
                                      brother: brother.name + ' ' + brother.surname,
                                      assistant: (part[school].assistant ? '<h3>Assistente: '+part[school].assistant.surname + ' ' + part[school].assistant.name+'</h3>' : null),
                                      type: part.html,
                                      school: brother.student.lastSchool,
                                      date: strDate
                                    });
                                }
                            }
                            if (!part.isTalk && brother._id == part[school].assistant._id) {
                                brother.student.assistantDate = week.date;
                                brother.student.assistantLastSchool = (school == "primarySchool" ? 1 : 2);
                                objToSave.push(brother.student)
                            }
                          });
                        }
                      });
                      for(let obj of objToSave){
                        try{
                          await obj.save(opts)
                          console.log("Updated", brother.name + " " + brother.surname)
                        }catch(e){
                          console.error('Week Meeting create - Brother Update error:', e, brother);
                          sendEmailError("Errore salvataggio fratello", e);
                          await session.abortTransaction();
                          session.endSession();
                          return res.status(500).send(e);
                        }
                      }
                      console.log("Finish to update", brother.name + " " + brother.surname);
                  }

                  console.log("finish to update week", week.date);
                  var tempWeek = new Week(week);
                  tempWeek.completed = false;

                  try{
                    await tempWeek.save(opts)
                    console.log("Week saved")
                  }catch(e){
                    console.error('Week Meeting create - Week save error:', e);
                    sendEmailError("Errore salvataggio settimana", e);
                    await session.abortTransaction();
                    session.endSession();
                    return res.status(500).send(e);
                  }


                }catch(e){
                  console.error('Week Meeting create - Brother Find -  error:', e);
                  sendEmailError("Errore ricerca fratelli", e);
                  await session.abortTransaction();
                  session.endSession();
                  return res.status(500).send(e);
                }
              }else {
                  var tempWeek = new Week(week);
                  tempWeek.completed = true;
                  tempWeek.congregation = req.decoded._doc.congregation;
                  try{
                    await tempWeek.save(opts)
                    console.log("Week saved")
                  }catch(e){
                    console.error('Week Meeting create - Week save error:', e);
                    sendEmailError("Errore salvataggio settimana", e);
                    await session.abortTransaction();
                    session.endSession();
                    return res.status(500).send(e);
                  }
              }
        }

        var arr = [];
        for (var i = 0; i < req.body.length; i++) {
            arr.push({ "_id": req.body[i]._id })
        }
        try{
          await WeekTemp.remove({$or: arr}, null, opts)
        }catch(e){
              console.error('Week Meeting create - Week temp remove error:', e);
              sendEmailError("Errore rimozione settimana temporanea", e);
              return res.status(500).send(e);
          }

        res.json({ message: 'All weeks updated!' });
        await session.commitTransaction();
        session.endSession();


        MAIL.sendAssegnations(mailAssegnationToSend);
        MAIL.sendMails(mailToSend);
        var date = new Date(req.body[0].date);
        var str = MONTH_NAMES[date.getMonth()] + " " + date.getFullYear();
        var strName = '';
        if (req.decoded && req.decoded._doc && req.decoded._doc.brother && req.decoded._doc.brother.name)
            strName = 'fratello ' + req.decoded._doc.brother.name + ' ' + req.decoded._doc.brother.surname;
        else
            strName = "sorvegliante dell'adunanza vita cristiana e ministero";

        MAIL.sendToRole('Programma Vita Cristiana e Ministero inserito - ' + str,
            'Il ' + strName + ' ha inserito il programma del mese di ' + str,
            req, ['schoolOverseer', 'viewer', 'president'])

    });

router.route('/pgm/:year/:month')

.get(function(req, res) {

    var startMonth = req.params.month;
    var startYear = req.params.year;
    var endYear = parseInt(req.params.year);
    var endMonth = parseInt(req.params.month);
    if(startMonth == "12") {
      endMonth = "01";
      endYear++;
      endYear = endYear + "";
    }else{
      endMonth++;
      endMonth = endMonth + "";
    }
    if(startMonth.length == 1)
      startMonth = "0"+startMonth;

    if(endMonth.length == 1)
      endMonth = "0"+endMonth;

      // console.log(startYear+ "-" +startMonth)
      // console.log(endYear+ "-" +endMonth)
    Week
    // .where('date').gte(new Date(req.params.year, req.params.month, 6)).lte(new Date(req.params.year, req.params.month + 1, 3))
        .find({
            $and: [{
                "date": { $gte: new Date((startYear+"") + "-" + (startMonth+"") + "-02T23:00:00.000+0000") }
            }, {
                "date": { $lte: new Date((endYear+"") + "-" + (endMonth+"") + "-02T23:00:00.000+0000") }
            }]
        })
        // .find({})
        .populate('initialPrayer')
        .populate('finalPrayer')
        .populate('president')
        .populate('talk.brother')
        .populate('gems.brother')
        .populate('presentationExercise.brother')
        .populate({ path: 'bibleReading.primarySchool.student', populate: { path: 'student'} })
        .populate({ path: 'bibleReading.secondarySchool.student', populate: { path: 'student'} })
        .populate({ path: 'ministryPart.primarySchool.student', populate: { path: 'student'} })
        .populate({ path: 'ministryPart.primarySchool.student', populate: { path: 'student'}})
        .populate('ministryPart.secondarySchool.assistant')
        .populate('ministryPart.primarySchool.assistant')
        .populate('congregationBibleStudy.brother')
        .populate('congregationBibleStudy.reader')
        .populate('christianLivingPart.brother')
        .sort([
            ['date', 'ascending']
        ])


    .exec(function(err, weeks) {
        if (err){
          sendEmailError("Errore ottenimento programma", err);
          return res.status(500).send(err);
        }
        res.json(weeks);

    });
})

router.route('/:week_id')

.get(function(req, res) {
        Week.find({ _id: req.params.week_id })
            .populate('initialPrayer')
            .populate('finalPrayer')
            .populate('president')
            .populate('talk.brother')
            .populate('gems.brother')
            .populate({ path: 'bibleReading.primarySchool.student', populate: { path: 'student'} })
            .populate({ path: 'bibleReading.secondarySchool.student', populate: { path: 'student'} })
            .populate('congregationBibleStudy.brother')
            .populate('congregationBibleStudy.reader')
            .populate('christianLivingPart.brother')
            .populate({ path: 'ministryPart.primarySchool.student', populate: { path: 'student'} })
            .populate({ path: 'ministryPart.primarySchool.student', populate: { path: 'student'} })
            .populate('ministryPart.secondarySchool.assistant')
            .populate('ministryPart.primarySchool.assistant')


        .exec(function(err, week) {
            if (err){
              sendEmailError("Errore ottenimento settimana", err);
              res.send(err);
            }
            res.json(week[0]);
            // var mailAssegnationToSend = [];
            // var week = week[0];
            // if(process.env.SEND_ASSEGNATION == "true"){
            //   var brother = week.bibleReading.primarySchool.student;
            //   // brother.email = "lucido.kristian@gmail.com";
            //   if(brother.email){
            //     mailAssegnationToSend.push({mail:brother.email, brother: brother.surname+ ' '+brother.name, assistant:'', type:"bibleReading", school:brother.student.lastSchool, date:week.date, point:brother.student.bibleReadingPendingStudyNumber})
            //   }
            //   if (!week.presentationExercise.enabled) {

            //       brother = week.bibleReading.secondarySchool.student;
            //       // brother.email = "lucido.kristian@gmail.com";
            //       if(brother.email){
            //         mailAssegnationToSend.push({mail:brother.email, brother: brother.surname+ ' '+brother.name, assistant:'', type:"bibleReading", school:brother.student.lastSchool, date:week.date, point:brother.student.bibleReadingPendingStudyNumber})
            //       }
            //       var arr = ["initialCall", "returnVisit", "bibleStudy"];
            //       var schools = ["primarySchool", "secondarySchool"];
            //       arr.forEach(function (partType) {
            //         schools.forEach(function (school) {
            //           var brother = week[partType][school].student;
            //           // brother.email = "lucido.kristian@gmail.com";
            //             if (brother.email && process.env.SEND_ASSEGNATION == "true" && brother.student) {
            //               console.log("brother student name: ", brother.surname + ' ' + brother.name);
            //               console.log("brother student school: ", brother.student.lastSchool);
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
            //               mailAssegnationToSend.push(obj)
            //           }
            //         })
            //       })

            //   }
            //   MAIL.sendAssegnations(mailAssegnationToSend);
            // }
        });
    })
    .put(function(req, res) {
        // Week.findById(req.params.week_id, function(err, week) {
        var week = req.body;


        var toFind = [];
        var historiesToSave = [];
        var schools = ["primarySchool"];

        if (week.secondarySchool) {
            schools.push("secondarySchool");
        }
        schools.forEach(function(school){
          if (week.bibleReading[school].made != 0 && !week.bibleReading[school].updated) {
            console.log('Student to Find', week.bibleReading[school].student.name);
            toFind.push({ '_id': week.bibleReading[school].student._id })
          }
        });
        week.ministryPart.forEach(function(part){
          schools.forEach(function(school){
            if (part[school].made != 0 && !part[school].updated) {
              console.log('Student to Find', part[school].student.name);
              toFind.push({ '_id': part[school].student._id })
            }
          });
        });



        Brother.find({
                $or: toFind
            })
            .populate('student')
            .exec(function(err, brothers) {
                if (err)
                    res.send(err);

                console.log('Length', brothers.length);

                async.each(brothers, function(brother, nextBrother) {
                  var func = function(part, school, bibleReading){
                    var history = new History();
                    history.date = week.date;
                    history.student = part[school].student;
                    if (part[school].made == 1) { //svolto
                        history.made = true;
                    } else if (part[school].made == 2) { //non svolto
                        brother.student.lastDate = brother.student.lastPrevDate;
                        brother.student.lastSchool = brother.student.lastPrevSchool;
                        if(part[school].isTalk){
                          brother.student.talkLastSchool = brother.student.ministryPartLastPrevSchool;
                          brother.student.talkDate = brother.student.talkPrevDate;
                        }else{
                          brother.student.ministryPartLastSchool = brother.student.ministryPartLastPrevSchool;
                          brother.student.ministryPartDate = brother.student.ministryPartPrevDate;
                        }
                        history.made = false;
                    }
                    historiesToSave.push(history);
                    part[school].updated = true;
                  };
                  //AFTER 2019

                    schools.forEach(function(school) {
                      if (brother._id == week.bibleReading[school].student._id) {
                        func(week.bibleReading, school, true);
                      }
                    });
                    week.ministryPart.forEach(function(part){
                      if(part.forStudent){
                        schools.forEach(function(school) {
                          if (brother._id == part[school].student._id) {
                            func(part, school, false);
                          }
                        });
                      }
                    });

                    brother.student.save(function(err) {
                        if (err)
                            res.send(err);
                        console.log("Finish to update: ", brother.name + " " + brother.surname)
                        nextBrother();
                    });

                }, function(err) {
                    if (err) {
                        console.log('Update week failed');
                    } else {
                        async.each(historiesToSave, function(history, nextHistory) {

                            history.save(function(err) {
                                if (err)
                                    res.send(err);
                                console.log("History added")
                                nextHistory();
                            });

                        }, function(err) {
                            if (err) {
                                console.log('Update week failed');
                            } else {
                                console.log("finish to update week", week.date);
                                var tempWeek = new Week(week);
                                var completed = true;
                                schools.forEach(function(school) {
                                    if (!week.bibleReading[school].updated)
                                        completed = false;
                                })
                                week.ministryPart.forEach(function(part){
                                  if(part.forStudent){
                                    schools.forEach(function(school) {
                                      if (!part[school].updated && part[school].student.student)
                                        completed = false;
                                    });
                                  }
                                });

                                tempWeek.completed = completed;
                                var w = tempWeek.toObject();
                                delete w._id;
                                delete w.__v;
                                //
                                Week.findOneAndUpdate({ '_id': req.params.week_id }, w, { upsert: true }, function(err, doc) {
                                    if (err)
                                        console.error(err);
                                    else {
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
