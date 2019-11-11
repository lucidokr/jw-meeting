#!/usr/bin/env node

var Week = require('./api/models/weekMeeting');
var Brother = require('./api/models/brother');
var Prayer = require('./api/models/prayer');
var Reader = require('./api/models/reader');
var Student = require('./api/models/student');
const MONTH_NAMES = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
];
const DAY_NAMES = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
var MAIL = require('./api/mail/send-mailgun');
var mongoose = require('mongoose')

if (!process.env.NODE_ENV || process.env.NODE_ENV == "development") {
    var config = require('./api/env.json')['development'];
    process.env.MONGO_DB_URI = config.MONGO_DB_URI;
    process.env.SECRET = config.SECRET;
    process.env.GMAIL_ACCOUNT = config.GMAIL_ACCOUNT;
    process.env.GMAIL_ACCOUNT_PASSWORD = config.GMAIL_ACCOUNT_PASSWORD;
    process.env.SEND_ASSEGNATION = config.SEND_ASSEGNATION;
    process.env.SEND_ASSEGNATION_DAYS_BEFORE = config.SEND_ASSEGNATION_DAYS_BEFORE;
}

mongoose.connect(process.env.MONGO_DB_URI,{useNewUrlParser:true, useUnifiedTopology: true});

// JOB FOR SEND ASSEGNATIONS
async function sendMails(){
  console.log('Start send assegnations mail job');

  if(process.env.SEND_ASSEGNATION == "true"){
        var days = parseInt(process.env.SEND_ASSEGNATION_DAYS_BEFORE);
        var msDays = days * 24 * 60 * 60 * 1000
        try{
          var weeks = await Week
          .find({
            date:{
              $gte: new Date(),
              $lte: new Date(new Date().getTime() + msDays)
            }
          })
            .sort([
                ['date', 'descending']
            ])
            .populate('initialPrayer')
            .populate('finalPrayer')
            .populate('congregationBibleStudy.reader')
            .populate({ path: 'bibleReading.primarySchool.student', populate: { path: 'student'} })
            .populate({ path: 'bibleReading.secondarySchool.student', populate: { path: 'student'} })
            .populate({ path: 'ministryPart.primarySchool.student', populate: { path: 'student'} })
            .populate({ path: 'ministryPart.secondarySchool.student', populate: { path: 'student'} })
            .populate('ministryPart.secondarySchool.assistant')
            .populate('ministryPart.primarySchool.assistant')
        }catch(e){
          console.log("Error on find weeks", e)
          return;
        }
        console.log("Weeks found:", weeks.length)

        var schools = ["primarySchool"];
        var mailAssegnationToSend = [];
        var mailToSend = [];
        for (let week of weeks){
          var date = new Date(week.date);
          var month = MONTH_NAMES[date.getMonth()];
          var day = DAY_NAMES[date.getDay()-1];
          var strDate = day+" " +date.getDate() + " " + month + " " + date.getFullYear();

          var congregationName = "";
          if (week.congregation && week.congregation.name)
            congregationName = week.congregation.name;

          if(!week.mailSent){
            schools = ["primarySchool"];
            if(week.secondarySchool){
              schools.push("secondarySchool");
            }
            if (week.type.meeting && !week.supervisor) {
              var brother = week.initialPrayer;
              if (brother.email) {
                console.log("Assegnation to send:", brother.name + ' ' + brother.surname)
                mailToSend.push({
                    brother: brother.name+ ' '+ brother.surname,
                    to: brother.email,
                    subject: "Preghiera iniziale - "+strDate,
                    text: "Ti è stata assegnata la preghiera iniziale dell'adunanza che si svolgerà il giorno " + strDate
                });
              }
              brother = week.finalPrayer;
              if (brother.email) {
                console.log("Assegnation to send:", brother.name + ' ' + brother.surname)
                  mailToSend.push({
                    brother: brother.name+ ' '+ brother.surname,
                    to: brother.email,
                    subject: "Preghiera finale - "+strDate,
                    text: "Ti è stata assegnata la preghiera finale dell'adunanza che si svolgerà il giorno " + strDate
                });
              }

              brother = week.congregationBibleStudy.reader;
              if (brother.email) {
                console.log("Assegnation to send:", brother.name + ' ' + brother.surname)
                mailToSend.push({
                    brother: brother.name+ ' '+ brother.surname,
                    to: brother.email,
                    subject: "Lettura dello studio biblico - "+strDate,
                    text: "Ti è stata assegnata la lettura dello studio biblico dell'adunanza che si svolgerà il giorno " + strDate
                })
              }

              for(let school of schools){
                var brother = week.bibleReading[school].student;
                if (brother.email) {
                    console.log("Assegnation to send:", brother.name + ' ' + brother.surname)
                    mailAssegnationToSend.push({
                      mail: brother.email,
                      congregation: congregationName,
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
                    if (brother.email) {
                        console.log("Assegnation to send:", brother.name + ' ' + brother.surname)
                        mailAssegnationToSend.push({
                          mail: brother.email,
                          congregation: congregationName,
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
              console.log("Mail assegnation to send:", mailAssegnationToSend.length + mailToSend.length)
              if(mailAssegnationToSend.length > 0){
                MAIL.sendAssegnations(mailAssegnationToSend);
              }

              if(mailToSend.length > 0){
                MAIL.sendMails(mailToSend);
              }

              var tempWeek = new Week(week);
              tempWeek.mailSent = true;
              try{
                await tempWeek.save()
              }catch(e){
                console.log('Error on save week');
                console.log(e);
              }
            }
          } else {
            console.log('Mail assegnation already sent for the week date: '+strDate);
          }
        }
        console.log('Finish send assegnations mail job');
        console.log('---------------------------------');

  }else{
   console.log('Finish send assegnations mail job: configuration not enabled');
  }
}


// JOB FOR SEND ASSEGNATIONS
async function remind(){
  console.log('Start reminder assegnations job');

  if(process.env.SEND_ASSEGNATION == "true"){
        try{
          var weeks = await Week
          .find({
            date:{
              $gte: new Date(new Date().getTime()-((new Date().getDay()-1)*24*60*60*1000)),
              $lte: new Date(new Date().getTime()-((new Date().getDay()-7)*24*60*60*1000))
            }
          })
            .sort([
                ['date', 'descending']
            ])
            .populate('initialPrayer')
            .populate('finalPrayer')
            .populate('congregationBibleStudy.reader')
            .populate({ path: 'bibleReading.primarySchool.student', populate: { path: 'student'} })
            .populate({ path: 'bibleReading.secondarySchool.student', populate: { path: 'student'} })
            .populate({ path: 'ministryPart.primarySchool.student', populate: { path: 'student'} })
            .populate({ path: 'ministryPart.secondarySchool.student', populate: { path: 'student'} })
            .populate('ministryPart.secondarySchool.assistant')
            .populate('ministryPart.primarySchool.assistant')
        }catch(e){
          console.log("Error on find weeks", e)
          return;
        }
        console.log("Weeks found:", weeks.length)

        var schools = ["primarySchool"];
        var mailAssegnationReminderToSend = [];
        var mailToSend = [];
        for (let week of weeks){
          if(!week.reminderSent){
            var date = new Date(week.date);
            var month = MONTH_NAMES[date.getMonth()];
            var day = DAY_NAMES[date.getDay()-1];
            var strDate = day+" " +date.getDate() + " " + month + " " + date.getFullYear();

            schools = ["primarySchool"];
            if(week.secondarySchool){
              schools.push("secondarySchool");
            }
            if (week.type.meeting && !week.supervisor) {
              var brother = week.initialPrayer;
              if (brother.email) {
                console.log("Reminder to send:", brother.name + ' ' + brother.surname)
                mailToSend.push({
                    brother: brother.name+ ' '+ brother.surname,
                    to: brother.email,
                    subject: "Promemoria: Preghiera iniziale",
                    text: "Ti ricordiamo che hai la preghiera iniziale all'adunanza di questa settimana"
                });
              }
              brother = week.finalPrayer;
              if (brother.email) {
                console.log("Reminder to send:", brother.name + ' ' + brother.surname)
                  mailToSend.push({
                      brother: brother.name+ ' '+ brother.surname,
                      to: brother.email,
                      subject: "Promemoria: Preghiera finale",
                      text: "Ti ricordiamo che hai la preghiera finale all'adunanza di questa settimana"
                  });
              }

              brother = week.congregationBibleStudy.reader;
              if (brother.email) {
                console.log("Reminder to send:", brother.name + ' ' + brother.surname)
                mailToSend.push({
                    brother: brother.name+ ' '+ brother.surname,
                    to: brother.email,
                    subject: "Promemoria: Lettura dello studio biblico",
                    text: "Ti ricordiamo che hai la lettura dello studio biblico all'adunanza di questa settimana"
                })
              }

              for(let school of schools){
                var brother = week.bibleReading[school].student;
                if (brother.email) {
                    console.log("Reminder to send:", brother.name + ' ' + brother.surname)
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
                    if (brother.email) {
                        console.log("Reminder to send:", brother.name + ' ' + brother.surname)
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
              console.log("Mail reminder to send:", mailAssegnationReminderToSend.length + mailToSend.length)
              if(mailAssegnationReminderToSend.length > 0){
                MAIL.sendReminderAssegnations(mailAssegnationReminderToSend);
              }

              if(mailToSend.length > 0){
                MAIL.sendMails(mailToSend);
              }

              var tempWeek = new Week(week);
              tempWeek.reminderSent = true;
              try{
                await tempWeek.save()
              }catch(e){
                console.log('Error on save week');
                console.log(e);
              }
            }
          } else {
            console.log('Mail reminder already sent');
          }
        }
        console.log('Finish reminder assegnations job');
        console.log('---------------------------------');

  }else{
   console.log('Finish reminder assegnations job: configuration not enabled');
  }
}

async function startJob(){
  // await sendMails();
  await remind()
}

startJob();
