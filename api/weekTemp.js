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

/**
 * API FOR TEMPORARY WEEK MEETING OF A CONGREGATION
 */
router.route('/')
    .get(async (req, res) => {
      try{
        var weeks = await WeekTemp
            .find({ congregation: req.decoded._doc.congregation._id })
            .populate('christianLivingPart.brother')
            .sort([
                ['date', 'ascending']
            ])
        res.json(weeks);
      }catch(e){
        console.error('Get weekTemp error:', e);
        return res.status(500).send({success:false, error:500, message:"Get weekTemp error", errorCode: e.toString()})
      }
    })
    .post(async(req, res) => {
      for(let week of req.body){
        var tempWeek = new WeekTemp(week);
        tempWeek.congregation = req.decoded._doc.congregation;
        tempWeek.completed = false;
        try{
          await tempWeek.save()
          console.log("Week saved")
        }catch(e){
          console.error('Weeks Meeting Temp update error:', e);
          return res.status(500).send({success:false, error:500, message:"Weeks Meeting Temp update error", errorCode: e.toString()})
        }
      }
      res.json({ message: 'All weeks updated!' });
      console.log('All weeks updated');

      var date = new Date(req.body[0].date);
      var str = (date.getMonth() + 1) + "/" + date.getFullYear();

      MAIL.sendToRole('Programma Vita Cristiana inserito dal coordinatore',
          'Il coordinatore ha inserito il programma del mese di: ' + str,
          req, ['schoolOverseer'])
    })

/**
 * API FOR SPECIFIC WEEK MEETING TEMPORARY
 */
router.route('/:week_id')
  .get(async(req, res) => {
    try{
      var week = await WeekTemp.findOne({ _id: req.params.week_id })
      .populate('initialPrayer')
      .populate('finalPrayer')
      .populate('president')
      .populate('talk.brother')
      .populate('gems.brother')
      .populate('presentationExercise.brother')
      .populate({ path: 'ministryPart.primarySchool.student', populate: { path: 'student'} })
      .populate('ministryPart.primarySchool.assistant')
      .populate({ path: 'ministryPart.secondarySchool.student', populate: { path: 'student'} })
      .populate('ministryPart.secondarySchool.assistant')
      .populate('congregationBibleStudy.brother')
      .populate('congregationBibleStudy.reader')
      .populate('christianLivingPart.brother')
      res.json(week);
    }catch(e){
      console.error('Get week meeting temp error:', e);
      return res.status(500).send({success:false, error:500, message:"Get week meeting temp error", errorCode: e.toString()})
    }
  })
  .put(async(req, res) => {
      var newWeek = req.body;
      try{
        await WeekTemp.findOneAndUpdate({ '_id': req.params.week_id }, newWeek, { upsert: true })
        res.json({ success: true, message: 'Temp weeks updated!' });
      }catch(e){
        console.error('Update week meeting temp error:', e);
        return res.status(500).send({success:false, error:500, message:"Update week meeting temp error", errorCode: e.toString()})
      }
  })

module.exports = router;
