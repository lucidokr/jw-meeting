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

  talkEnabled: Boolean,
  // talkPrevDate: Date,
  // talkDate: Date,

  assistantEnabled: Boolean,
  assistantDate: Date,
  assistantLastSchool: Number,

  bibleReadingStudyNumber: {type: mongoose.Schema.Types.ObjectId, ref: 'StudyNumber'},
  bibleReadingPendingStudyNumber: {type: mongoose.Schema.Types.ObjectId, ref: 'StudyNumber'},

  studyNumber: {type: mongoose.Schema.Types.ObjectId, ref: 'StudyNumber'},
  pendingStudyNumber: {type: mongoose.Schema.Types.ObjectId, ref: 'StudyNumber'},

  deleted: Boolean

});

module.exports = mongoose.model('Student', StudentSchema, 'student');
