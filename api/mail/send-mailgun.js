if (!process.env.NODE_ENV || process.env.NODE_ENV == "development") {
  var config = require('../env.json')['development'];
  process.env.MONGO_DB_URI = config.MONGO_DB_URI;
  process.env.SECRET = config.SECRET;
  process.env.API_KEY_MAILGUN = config.API_KEY_MAILGUN;
  process.env.DOMAIN_MAILGUN = config.DOMAIN_MAILGUN;
  process.env.SEND_ASSEGNATION = config.SEND_ASSEGNATION;
}
var mailgun = require("mailgun-js");
var User = require('../models/user');
var mailgun = require('mailgun-js')({apiKey: process.env.API_KEY_MAILGUN, domain: process.env.DOMAIN_MAILGUN});
var fs = require('fs');
var path = require('path');
// var StudyNumber = require('../models/studyNumber');


var MAIL = {
    template: null,
    templateAssegnation: null,
    templateAssegnationReminder: null,

    getAssegnationTemplate: function(callback) {
        var that = this;
        fs.readFile(path.join(__dirname, 'mail-assegnation.html'), 'utf8', function(err, html) {
            if (err) {
                return console.log(err);
            }
            that.templateAssegnation = html;
            callback();
        });
    },

    getMailTemplate: function(callback) {
      var that = this;
      fs.readFile(path.join(__dirname, 'mail.html'), 'utf8', function(err, html) {
          if (err) {
              return console.log(err);
          }
          that.template = html;

          callback()
      });
  },

  getAssegnationReminderTemplate: function(callback) {
    var that = this;
    fs.readFile(path.join(__dirname, 'mail-assegnation-reminder.html'), 'utf8', function(err, html) {
        if (err) {
            return console.log(err);
        }
        that.templateAssegnationReminder = html;
        callback();
    });
},

    sendMail: function(mailOptions) {
      mailgun.messages().send(mailOptions, function (error, body) {
        if (error) {
          return console.log(error);
        }
        console.log(body);
      });
    },

    sendMails: function(list) {
        if (list && list.length > 0) {
            var that = this;
            list.forEach(function(data) {
                that.sendToEmailAddress(data.brother, data.subject, data.text, data.to)
            });
        }
    },

    sendToEmailAddress: function(brother, subject, text, to) {

        // if (!this.transporter) {
        //     this.createTransporter();
        // }
        var that = this;
        this.getMailTemplate(function(){
          var mailOptions = {
              from: 'Adunanza Vita Cristiana e Ministero <noreply@'+process.env.DOMAIN_MAILGUN+'>',
              to: to,
              subject: subject,
              html: that.template.replace("{{brother}}", brother).replace("{{message}}", text),
          };

          if (!process.env.NODE_ENV || process.env.NODE_ENV == "development") {
            mailOptions.to = 'kristianl_91@hotmail.it'
          }
          that.sendMail(mailOptions)
        });


    },

    sendToRole: function(subject, text, req, roles) {
        var that = this;

        this.getMailTemplate(function(){
          User
              .find({ congregation: req.decoded._doc.congregation._id })
              .populate('brother')
              .exec(function(err, users) {
                  var arr = [];
                  users.forEach(function(user) {
                      if (user.role.indexOf(roles) != -1) {
                          if (user.brother && user.brother.email)
                              arr.push(user.brother.email)
                      }
                  })

                  if (arr && arr.length > 0) {
                      // if (!that.transporter) {
                      //     that.createTransporter();
                      // }
                      var date = new Date(req.body[0].date);
                      var str = (date.getMonth() + 1) + "/" + date.getFullYear();

                      var mailOptions = {
                        from: 'Adunanza Vita Cristiana e Ministero <noreply@'+process.env.DOMAIN_MAILGUN+'>',
                        to: arr.join(","),
                        subject: subject,
                        html: that.template.replace("{{brother}}", "").replace("{{message}}", text),
                    };

                      if (!process.env.NODE_ENV || process.env.NODE_ENV == "development") {
                        mailOptions.to = 'kristianl_91@hotmail.it'
                      }
                      that.sendMail(mailOptions)
                  }
              });
          });

    },

    sendReminderAssegnations: function(mails) {
      if (mails && mails.length > 0) {
          var that = this;
          mails.forEach(function(data) {
              if (data.school == 1) data.school = "Sala principale";
              if (data.school == 2) data.school = "Classe supplementare 1";
              that.sendReminderAssegnation(data.mail, data.congregation, data.brother, data.assistant, data.date,  data.type, data.school);
          });
      }
    },

    sendAssegnations: function(mails) {
      if (mails && mails.length > 0) {
          var that = this;
          mails.forEach(function(data) {
              if (data.school == 1) data.school = "Sala principale";
              if (data.school == 2) data.school = "Classe supplementare 1";
              that.sendAssegnation(data.mail, data.congregation, data.brother, data.assistant, data.date,  data.type, data.school);
          });
      }
    },

    sendAssegnation: function(mail, congregation, brother, assistant, date, type, school) {

        function send() {

            if (!data) {
                var data = {
                    congregation: congregation || "Scorzé",
                    brother: brother || "Kristian Lucido",
                    assistant: assistant || "",
                    date: date || "10/10/17",
                    type: type || "Lettura biblica",
                    school: school || "Sala principale"
                };
            }

            var tempMail = this.templateAssegnation;
            Object.keys(data).forEach(function(k) {
              if(data[k]){
                tempMail = tempMail.replace("{{" + k + "}}", data[k])
              }else{
                tempMail = tempMail.replace("{{" + k + "}}", "")
              }
            });

            var mailOptions = {
                from: 'Adunanza Vita Cristiana e Ministero <noreply@'+process.env.DOMAIN_MAILGUN+'>',
                to: mail,
                subject: 'Assegnazione parte Vita Cristiana e Ministero - ' + data.date,
                html: tempMail
            };


            if (!process.env.NODE_ENV || process.env.NODE_ENV == "development") {
                mailOptions.to = 'kristianl_91@hotmail.it'
            }

            this.sendMail(mailOptions)
        }

        // if (!this.template) {
            this.getAssegnationTemplate(send.bind(this));
        // } else {
            // send()
        // }
    },

    sendReminderAssegnation: function(mail, congregation, brother, assistant, date, type, school) {

      function send() {

          if (!data) {
              var data = {
                  congregation: congregation || "Scorzé",
                  brother: brother || "Kristian Lucido",
                  assistant: assistant || "",
                  date: date || "10/10/17",
                  type: type || "Lettura biblica",
                  school: school || "Sala principale"
              };
          }

          var tempMail = this.templateAssegnationReminder;
          Object.keys(data).forEach(function(k) {
            if(data[k]){
              tempMail = tempMail.replace("{{" + k + "}}", data[k])
            }else{
              tempMail = tempMail.replace("{{" + k + "}}", "")
            }
          });

          var mailOptions = {
              from: 'Adunanza Vita Cristiana e Ministero <noreply@'+process.env.DOMAIN_MAILGUN+'>',
              to: mail,
              subject: 'Assegnazione parte Vita Cristiana e Ministero - ' + data.date,
              html: tempMail
          };


          if (!process.env.NODE_ENV || process.env.NODE_ENV == "development") {
              mailOptions.to = 'kristianl_91@hotmail.it'
          }

          this.sendMail(mailOptions)
      }

      // if (!this.template) {
          this.getAssegnationReminderTemplate(send.bind(this));
      // } else {
          // send()
      // }
  }

}

module.exports = MAIL;
