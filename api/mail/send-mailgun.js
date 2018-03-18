var mailgun = require("mailgun-js");
var User = require('../models/user');
var api_key = 'key-182e65a25ef6a1dd1302598d5954d622';
var DOMAIN = 'jw-meeting.com';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});
var fs = require('fs');
var path = require('path');

var MAIL = {
    template: null,

    getAssegnationTemplate: function(callback) {
        var that = this;
        fs.readFile(path.join(__dirname, 'assegnation2.html'), 'utf8', function(err, html) {
            if (err) {
                return console.log(err);
            }
            that.template = html;

            callback()
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
                that.sendToEmailAddress(data.subject, data.text, data.to)
            });
        }
    },

    sendToEmailAddress: function(subject, text, to) {

        // if (!this.transporter) {
        //     this.createTransporter();
        // }
        var mailOptions = {
            from: 'Adunanza Vita Cristiana e Ministero <noreply@'+DOMAIN+'>',
            to: to,
            subject: subject,
            text: text,
        };

        if (!process.env.NODE_ENV || process.env.NODE_ENV == "development") {
          mailOptions.to = 'lucido.kristian@gmail.com'
        }
        this.sendMail(mailOptions)

    },

    sendToRole: function(subject, text, req, roles) {
        var that = this;
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
                      from: 'Adunanza Vita Cristiana e Ministero <noreply@'+DOMAIN+'>',
                      to: arr.join(","),
                      subject: subject,
                      text: text,
                  };

                    if (!process.env.NODE_ENV || process.env.NODE_ENV == "development") {
                      mailOptions.to = 'lucido.kristian@gmail.com'
                    }
                    that.sendMail(mailOptions)
                }
            });

    },

    sendAssegnations: function(mails) {
        if (mails && mails.length > 0) {
            var that = this;
            mails.forEach(function(data) {
                if (data.type == "bibleReading") data.type = "Lettura biblica";
                if (data.type == "initialCall") data.type = "Primo contatto";
                if (data.type == "returnVisit") data.type = "Visita ulteriore";
                if (data.type == "bibleStudy") data.type = "Studio biblico";
                if (data.type == "talk") data.type = "Discorso";
                if (data.school == 1) data.school = "Sala principale";
                if (data.school == 2) data.school = "Classe supplementare 1";
                var date = new Date(data.date);
                data.date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
                that.sendAssegnation(data.mail, data.brother, data.assistant, data.date, data.point.number + ' - ' + data.point.title, data.type, data.school)
            })
        }
    },

    sendAssegnation: function(mail, brother, assistant, date, point, type, school) {

        function send() {

            if (!data) {
                var data = {
                    brother: brother || "Kristian Lucido",
                    assistant: assistant || "",
                    date: date || "10/10/17",
                    point: point || "6 - Enfasi Orale",
                    type: type || "Lettura biblica",
                    school: school || "Sala principale"
                };
            }

            var tempMail = this.template;
            Object.keys(data).forEach(function(k) {
                tempMail = tempMail.replace("{{" + k + "}}", data[k])
            });

            var mailOptions = {
                from: 'Adunanza Vita Cristiana e Ministero <noreply@'+DOMAIN+'>',
                to: mail,
                subject: 'Assegnazione ' + data.type + ' - ' + data.date,
                html: tempMail
            };


            if (!process.env.NODE_ENV || process.env.NODE_ENV == "development") {
                mailOptions.to = 'lucido.kristian@gmail.com'
            }

            this.sendMail(mailOptions)
        }

        // if (!this.template) {
            this.getAssegnationTemplate(send.bind(this));
        // } else {
            // send()
        // }
    }

}

module.exports = MAIL;
