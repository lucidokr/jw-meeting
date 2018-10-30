var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var StudentSchema   = new Schema({

  lastDate: Date,
  lastPrevDate: Date,
  lastSchool: Number,
  lastPrevSchool: Number,

  primarySchoolEnabled: Boolean,
  secondarySchoolEnabled: Boolean,
  thirdSchoolEnabled: Boolean,

  bibleReadingEnabled: Boolean,
  bibleReadingPrevDate: Date,
  bibleReadingDate: Date,
  bibleReadingLastSchool: Number,
  bibleReadingLastPrevSchool: Number,

  //BEFORE 2019
    initialCallEnabled: Boolean,
    initialCallPrevDate: Date,
    initialCallDate: Date,
    initialCallLastSchool: Number,
    initialCallLastPrevSchool: Number,

    returnVisitEnabled: Boolean,
    returnVisitPrevDate: Date,
    returnVisitDate: Date,
    returnVisitLastSchool: Number,
    returnVisitLastPrevSchool: Number,

    bibleStudyEnabled: Boolean,
    bibleStudyPrevDate: Date,
    bibleStudyDate: Date,
    bibleStudyLastSchool: Number,
    bibleStudyLastPrevSchool: Number,

    bibleReadingStudyNumber: {type: mongoose.Schema.Types.ObjectId, ref: 'StudyNumber'},
    bibleReadingPendingStudyNumber: {type: mongoose.Schema.Types.ObjectId, ref: 'StudyNumber'},

    studyNumber: {type: mongoose.Schema.Types.ObjectId, ref: 'StudyNumber'},
    pendingStudyNumber: {type: mongoose.Schema.Types.ObjectId, ref: 'StudyNumber'},


  // AFTER 2019
    ministryPartEnabled: Boolean,
    ministryPartPrevDate: Date,
    ministryPartDate: Date,
    ministryPartLastSchool: Number,
    ministryPartLastPrevSchool: Number,

    bibleReadingLesson: {type: mongoose.Schema.Types.ObjectId, ref: 'Lesson'},
    bibleReadingPendingLesson: {type: mongoose.Schema.Types.ObjectId, ref: 'Lesson'},

    lesson: {type: mongoose.Schema.Types.ObjectId, ref: 'Lesson'},
    pendingLesosn: {type: mongoose.Schema.Types.ObjectId, ref: 'Lesson'},


  talkEnabled: Boolean,
  // talkPrevDate: Date,
  // talkDate: Date,

  assistantEnabled: Boolean,
  assistantDate: Date,
  assistantLastSchool: Number,

  deleted: Boolean

});

module.exports = mongoose.model('Student', StudentSchema, 'student');
