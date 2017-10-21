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

var MAIL = require('./mail/send-mail');

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
        Week
            .find({ congregation: req.decoded._doc.congregation._id })
            .sort([
                ['date', 'descending']
            ])
            .exec(function(err, weeks) {
                if (err) {
                    console.error('Week Meeting get error:', err);
                    return res.send(err);
                }

                res.json(weeks);
            });
    })
    .post(function(req, res) {

        var mailAssegnationToSend = [];
        var mailToSend = [];

        var updateWeek = function(week, nextWeek) {
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

                if (!week.presentationExercise.enabled) {
                    toFind.push({ '_id': week.initialCall.primarySchool.student._id });
                    toFind.push({ '_id': week.initialCall.primarySchool.assistant._id });
                    toFind.push({ '_id': week.returnVisit.primarySchool.student._id });
                    toFind.push({ '_id': week.returnVisit.primarySchool.assistant._id });
                    toFind.push({ '_id': week.bibleStudy.primarySchool.student._id });
                    if (!week.bibleStudy.primarySchool.isTalk)
                        toFind.push({ '_id': week.bibleStudy.primarySchool.assistant._id });
                    if (week.secondarySchool) {
                        toFind.push({ '_id': week.initialCall.secondarySchool.student._id });
                        toFind.push({ '_id': week.initialCall.secondarySchool.assistant._id });
                        toFind.push({ '_id': week.returnVisit.secondarySchool.student._id });
                        toFind.push({ '_id': week.returnVisit.secondarySchool.assistant._id });
                        toFind.push({ '_id': week.bibleStudy.secondarySchool.student._id });
                        if (!week.bibleStudy.secondarySchool.isTalk)
                            toFind.push({ '_id': week.bibleStudy.secondarySchool.assistant._id });
                    }
                } else {
                    toFind.push({ '_id': week.presentationExercise.brother._id });
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
                    .exec(function(err, brothers) {
                        if (err) {
                            console.error('Week Meeting create - Brother Find -  error:', err);
                            // return res.send(err);
                        }

                        console.log('Length', brothers.length);

                        async.each(brothers, function(brother, nextBrother) {
                            var objToSave = [];

                            var date = new Date(req.body[0].date);
                            var strDate = date.getMonth() + (date.getMonth() + 1) + "/" + date.getFullYear();

                            if (brother.elder) {
                                if (brother._id == week.president._id) {
                                    brother.elder.presidentDate = week.date;
                                }

                                if (brother._id == week.gems.brother._id)
                                    brother.elder.gemsDate = week.date;

                                if (brother._id == week.talk.brother._id)
                                    brother.elder.talkDate = week.date;

                                if (brother._id == week.congregationBibleStudy.brother._id)
                                    brother.elder.bibleStudyDate = week.date;

                                if (week.presentationExercise.enabled && brother._id == week.presentationExercise.brother._id)
                                    brother.elder.presentationExerciseDate = week.date;

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
                                    brother.servant.gemsDate = week.date;
                                }
                                if (brother._id == week.talk.brother._id) {
                                    brother.servant.talkDate = week.date;
                                }
                                if (week.presentationExercise.enabled && brother._id == week.presentationExercise.brother._id) {
                                    brother.servant.presentationExerciseDate = week.date;
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
                                    brother.prayer.date = week.date;
                                    if (brother.email && process.env.SEND_ASSEGNATION == "true") {
                                        mailToSend.push({
                                            to: brother.email,
                                            subject: "Preghiera iniziale - ",
                                            text: "Ciao " + brother.name + " " + brother.surname + ", ti è stata assegnata la preghiera iniziale dell'adunanza Vita Cristiana e Ministero che si svolgerà in data: " + strDate
                                        })
                                    }
                                }

                                if (brother._id == week.finalPrayer._id) {
                                    if (brother.email && process.env.SEND_ASSEGNATION == "true") {
                                        mailToSend.push({
                                            to: brother.email,
                                            subject: "Preghiera finale - ",
                                            text: "Ciao " + brother.name + " " + brother.surname + ", ti è stata assegnata la preghiera finale dell'adunanza Vita Cristiana e Ministero che si svolgerà in data: " + strDate
                                        })
                                    }
                                    brother.prayer.date = week.date;
                                }

                                objToSave.push(brother.prayer)
                            }
                            if (brother.reader) {
                                if (brother._id == week.congregationBibleStudy.reader._id)
                                    brother.reader.date = week.date;

                                objToSave.push(brother.reader)

                                if (brother.email && process.env.SEND_ASSEGNATION == "true") {
                                    mailToSend.push({
                                        to: brother.email,
                                        subject: "Lettura dello studio biblico - ",
                                        text: "Ciao " + brother.name + " " + brother.surname + ", ti è stata assegnata la lettura dello studio biblico in data: " + strDate
                                    })
                                }
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
                                    if (!week.bibleReading.primarySchool.pointChanged) {
                                        brother.student.bibleReadingPendingStudyNumber = brother.student.bibleReadingStudyNumber;
                                    } else {
                                        brother.student.bibleReadingPendingStudyNumber = week.bibleReading.primarySchool.student.student.bibleReadingPendingStudyNumber;
                                    }
                                    objToSave.push(brother.student);
                                    if (brother.email && process.env.SEND_ASSEGNATION == "true") {
                                        mailAssegnationToSend.push({ mail: brother.email, brother: brother.surname + ' ' + brother.name, assistant: '', type: "bibleReading", school: brother.student.lastSchool, date: week.date, point: brother.student.bibleReadingPendingStudyNumber })
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
                                    if (!week.bibleReading.secondarySchool.pointChanged) {
                                        brother.student.bibleReadingPendingStudyNumber = brother.student.bibleReadingStudyNumber;
                                    } else {
                                        brother.student.bibleReadingPendingStudyNumber = week.bibleReading.secondarySchool.student.student.bibleReadingPendingStudyNumber;
                                    }
                                    // brother.student.bibleReadingPendingStudyNumber = brother.student.bibleReadingStudyNumber;
                                    objToSave.push(brother.student)
                                    if (brother.email && config.SEND_ASSEGNATION) {
                                        mailAssegnationToSend.push({ mail: brother.email, brother: brother.surname + ' ' + brother.name, assistant: '', type: "bibleReading", school: brother.student.lastSchool, date: week.date, point: brother.student.bibleReadingPendingStudyNumber })
                                    }
                                }
                            }
                            if (!week.presentationExercise.enabled) {
                                if (brother.student) {
                                    var arr = ["initialCall", "returnVisit", "bibleStudy"];
                                    var schools = ["primarySchool", "secondarySchool"];
                                    arr.forEach(function(partType) {
                                        schools.forEach(function(school) {
                                            if (brother._id == week[partType][school].student._id) {
                                                brother.student.lastDate = week.date;
                                                brother.student[partType + "PrevDate"] = brother.student[partType + "Date"];
                                                brother.student[partType + "Date"] = week.date;
                                                brother.student[partType + "LastPrevSchool"] = (brother.student[partType + "LastSchool"] == 1 ? 1 : 2);
                                                brother.student[partType + "LastSchool"] = (school == "primarySchool" ? 1 : 2);
                                                brother.student.lastPrevSchool = (brother.student.lastSchool == 1 ? 1 : 2);
                                                brother.student.lastSchool = (school == "primarySchool" ? 1 : 2);
                                                if (!week[partType][school].pointChanged) {
                                                    brother.student.pendingStudyNumber = brother.student.studyNumber;
                                                } else {
                                                    brother.student.pendingStudyNumber = week[partType][school].student.student.pendingStudyNumber;
                                                }

                                                objToSave.push(brother.student)
                                                if (brother.email && process.env.SEND_ASSEGNATION == "true") {
                                                    var obj = { mail: brother.email, brother: brother.surname + ' ' + brother.name, assistant: '', type: (week[partType][school].isTalk ? 'talk' : partType), school: brother.student.lastSchool, date: week.date, point: brother.student.pendingStudyNumber };
                                                    obj.assistant = (week[partType][school].assistant ? week[partType][school].assistant.surname + ' ' + week[partType][school].assistant.name : '')
                                                    mailAssegnationToSend.push({ mail: brother.email, brother: brother.surname + ' ' + brother.name, type: partType, school: brother.student.lastSchool, date: week.date, point: brother.student.pendingStudyNumber })
                                                }
                                            }
                                            if (!week[partType][school].isTalk && brother._id == week[partType][school].assistant._id) {
                                                brother.student.assistantDate = week.date;
                                                brother.student.assistantLastSchool = (school == "primarySchool" ? 1 : 2);
                                                objToSave.push(brother.student)
                                            }
                                        })
                                    })

                                }
                            }

                            async.each(objToSave, function(obj, nextObj) {
                                obj.save(function(err) {
                                    if (err) {
                                        console.error('Week Meeting create - Brother Update error:', err, brother);
                                        // return res.send(err);
                                    } else {
                                        console.log("Updated", brother.name + " " + brother.surname)

                                    }
                                    nextObj();
                                });
                            }, function(err) {
                                if (err) {
                                    console.error('Week Meeting create - Brother Update error:', err, brother);
                                } else {
                                    console.log("Finish to update", brother.name + " " + brother.surname);
                                    nextBrother();
                                }
                            });

                        }, function(err) {
                            if (err) {
                                console.error('Week Meeting create - Week update error:', err);
                            } else {
                                console.log("finish to update week", week.date);
                                var tempWeek = new Week(week);
                                tempWeek.completed = false;

                                tempWeek.save(function(err) {
                                    nextWeek();
                                    if (err)
                                        console.error('Week Meeting create - Week save error:', err);
                                    else
                                        console.log("Week saved")
                                });

                            }
                        })

                    });
            } else {
                var tempWeek = new Week(week);
                tempWeek.completed = true;
                tempWeek.congregation = req.decoded._doc.congregation;
                tempWeek.save(function(err) {
                    nextWeek();
                    if (err)
                        console.error('Week Meeting create - Week save error:', err);
                    else
                        console.log("Week saved")
                });
            }
        }

        async.each(req.body, function(week, nextWeek) {
            console.log("start to update week", week.date);
            updateWeek(week, nextWeek)
        }, function(err) {
            if (err) {
                console.error('Week Meeting create - Week save error:', err);
            } else {

                var arr = [];
                for (var i = 0; i < req.body.length; i++) {
                    arr.push({ "_id": req.body[i]._id })
                }
                WeekTemp.remove({
                    $or: arr
                }, function(err, week) {
                    if (err) {
                        console.error('Week Meeting create - Week temp remove error:', err);
                        return res.send(err);
                    }

                    res.json({ message: 'All weeks updated!' });


                    MAIL.sendAssegnations(mailAssegnationToSend);


                    MAIL.sendMails(mailToSend);
                    var date = new Date(req.body[0].date);
                    var str = (date.getMonth() + 1) + "/" + date.getFullYear();
                    var strName = '';
                    if (req.decoded && req.decoded._doc && req.decoded._doc.brother && req.decoded._doc.brother.name)
                        strName = 'fratello ' + req.decoded._doc.brother.name + ' ' + req.decoded._doc.brother.surname;
                    else
                        strName = "sorvegliante dell'adunanza vita cristiana e ministero";


                    MAIL.sendToRole('Programma Vita Cristiana e Ministero inserito - ' + str,
                        'Il ' + strName + ' ha inserito il programma del mese di: ' + str,
                        req, ['schoolOverseer', 'viewer', 'president'])

                });


            }
        });

    });

router.route('/pgm/:year/:month')

.get(function(req, res) {

    Week
    // .where('date').gte(new Date(req.params.year, req.params.month, 6)).lte(new Date(req.params.year, req.params.month + 1, 3))
        .find({
            $and: [{
                "date": { $gte: new Date(req.params.year + "-" + (parseInt(req.params.month)) + "-03T22:00:00.000+0000") }
            }, {
                "date": { $lte: new Date(req.params.year + "-" + (parseInt(req.params.month) + 1) + "-02T22:00:00.000+0000") }
            }]
        })
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
        .sort([
            ['date', 'ascending']
        ])


    .exec(function(err, weeks) {
        if (err)
            return res.send(err);
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
            if (err)
                res.send(err);
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
        var partTypes = ["bibleReading", "initialCall", "returnVisit", "bibleStudy"];
        var schools = ["primarySchool"];
        if (week.presentationExercise.enabled) {
            partTypes = ["bibleReading"]
        } else {
            if (week.secondarySchool) {
                schools.push("secondarySchool");
            }
        }

        var toFind = [];
        var historiesToSave = [];
        for (var i = 0; i < partTypes.length; i++) {
            for (var j = 0; j < schools.length; j++) {
                if (week[partTypes[i]][schools[j]].made != 0 && !week[partTypes[i]][schools[j]].updated) {

                    console.log('Student to Find', week[partTypes[i]][schools[j]].student.name);
                    toFind.push({ '_id': week[partTypes[i]][schools[j]].student._id })
                }
            }
        }


        Brother.find({
                $or: toFind
            })
            .populate('student')
            .exec(function(err, brothers) {
                if (err)
                    res.send(err);

                console.log('Length', brothers.length);

                async.each(brothers, function(brother, nextBrother) {

                    partTypes.forEach(function(partType) {
                        schools.forEach(function(school) {
                            if (brother._id == week[partType][school].student._id) {
                                var history = new History();
                                history.date = week.date;
                                history.student = week[partType][school].student;
                                if (partType == 'bibleReading') {
                                    history.studyNumber = brother.student.bibleReadingPendingStudyNumber;
                                } else {
                                    history.studyNumber = brother.student.pendingStudyNumber;
                                }
                                if (week[partType][school].made == 1) { //svolto
                                    if (week[partType][school].pointCompleted && !week[partType][school].pointChanged) { // punto superato  e punto non cambiato
                                        if (partType == 'bibleReading') {
                                            brother.student.bibleReadingStudyNumber = week[partType][school].student.student.bibleReadingStudyNumber;
                                        } else {
                                            brother.student.studyNumber = week[partType][school].student.student.studyNumber;
                                        }
                                    }
                                    // if(!week[partType][school].pointCompleted && week[partType][school].pointChanged) { // punto non superato  e punto cambiato
                                    //   if (partType == 'bibleReading') {
                                    //     brother.student.bibleReadingStudyNumber = week[partType][school].student.student.bibleReadingPendingStudyNumber;
                                    //   } else {
                                    //     brother.student.studyNumber = week[partType][school].student.student.pendingStudyNumber;
                                    //   }
                                    // }
                                    history.made = true;
                                    history.pointCompleted = week[partType][school].pointCompleted;
                                } else if (week[partType][school].made == 2) { //non svolto
                                    brother.student.lastDate = brother.student.lastPrevDate;
                                    brother.student[partType + "Date"] = brother.student[partType + "PrevDate"];
                                    brother.student.lastSchool = brother.student.lastPrevSchool;
                                    brother.student[partType + "LastSchool"] = brother.student[partType + "LastPrevSchool"];

                                    // se punto cambiato e il discorso non è stato svolto rimane il punto che aveva in precedenza
                                    // mentre se il punto non è stato cambiato il punto pending torna normale
                                    if (!week[partType][school].pointChanged) { //punto non cambiato
                                        if (partType == 'bibleReading') {
                                            brother.student.bibleReadingStudyNumber = brother.student.bibleReadingPendingStudyNumber;
                                        } else {
                                            brother.student.studyNumber = brother.student.pendingStudyNumber;
                                        }
                                    }
                                    history.made = false;
                                    history.pointCompleted = false;
                                }
                                historiesToSave.push(history);
                                week[partType][school].updated = true;
                            }
                        })
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
                                partTypes.forEach(function(partType) {
                                    schools.forEach(function(school) {
                                        if (!week[partType][school].updated)
                                            completed = false;
                                    })
                                });
                                tempWeek.completed = completed;
                                var w = tempWeek.toObject();
                                delete w._id;
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
