#!/usr/bin/env node

var Week = require('./api/models/weekMeeting');
var Brother = require('./api/models/brother');
var Student = require('./api/models/student');
const MONTH_NAMES = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
];
const DAY_NAMES = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
var MAIL = require('./api/mail/send-mailgun');
var mongoose = require('mongoose')


mongoose.connect(process.env.MONGO_DB_URI,{useNewUrlParser:true, useUnifiedTopology: true});

if (!process.env.NODE_ENV || process.env.NODE_ENV == "development") {
    var config = require('./api/env.json')['development'];
    process.env.MONGO_DB_URI = config.MONGO_DB_URI;
    process.env.SECRET = config.SECRET;
    process.env.GMAIL_ACCOUNT = config.GMAIL_ACCOUNT;
    process.env.GMAIL_ACCOUNT_PASSWORD = config.GMAIL_ACCOUNT_PASSWORD;
    process.env.SEND_ASSEGNATION = config.SEND_ASSEGNATION;
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
              if (brother.email && process.env.SEND_ASSEGNATION == "true") {
                console.log("Reminder to send:", brother.name + ' ' + brother.surname)
                mailToSend.push({
                    brother: brother.name+ ' '+ brother.surname,
                    to: brother.email,
                    subject: "Promemoria: Preghiera iniziale",
                    text: "Ti ricordiamo che hai la preghiera iniziale all'adunanza di questa settimana"
                });
              }
              brother = week.finalPrayer;
              if (brother.email && process.env.SEND_ASSEGNATION == "true") {
                console.log("Reminder to send:", brother.name + ' ' + brother.surname)
                  mailToSend.push({
                      brother: brother.name+ ' '+ brother.surname,
                      to: brother.email,
                      subject: "Promemoria: Preghiera finale",
                      text: "Ti ricordiamo che hai la preghiera finale all'adunanza di questa settimana"
                  });
              }

              brother = week.congregationBibleStudy.reader;
              if (brother.email && process.env.SEND_ASSEGNATION == "true") {
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
                if (brother.email && process.env.SEND_ASSEGNATION == "true") {
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
                    if (brother.email && process.env.SEND_ASSEGNATION == "true") {
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
                MAIL.sendMails(mailToSend);
                var tempWeek = new Week(week);
                tempWeek.reminderSent = true;
                try{
                  await tempWeek.save(opts)
                }catch(e){
                  console.log('Error on save week');
                  console.log(e);
                }
              }
            }
          } else {
            console.log('Mail reminder already sent');
          }
        }
        console.log('Finish reminder assegnations job');
        console.log('---------------------------------');

  }else{
   console.log('Finish reminder assegnations job: Not a Monday');
  }
}
remind()
