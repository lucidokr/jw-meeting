var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var WeekMeetingSchema   = new Schema(
{
  congregation: {type: mongoose.Schema.Types.ObjectId, ref: 'Congregation'},
  date: Date,
  completed: Boolean,
  type: Schema.Types.Mixed,
  supervisor: Boolean,
  primarySchool:Boolean,
  secondarySchool:Boolean,
  weeklyBibleReading:String,
  initialSong:String,
  intervalSong:String,
  finalSong:String,
  initialPrayer: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
  finalPrayer: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
  president:{type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
  reminderSent: Boolean,
  mailSent: Boolean,
  talk: {
    brother: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
    label: String
  },
  gems: {
    brother: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
    label: String
  },
  bibleReading: any = {
    primarySchool:{
      student: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
      updated: Boolean,
      made: Number
    },
    secondarySchool:{
      student: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
      updated: Boolean,
      made: Number
    },
    label: String
  },
  ministryPart: [{
    primarySchool:{
      student: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
      assistant: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
      updated: Boolean,
      made: Number,
      gender: String,
    },
    secondarySchool:{
      student: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
      assistant: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
      updated: Boolean,
      made: Number,
      gender: String,
    },
    html: String,
    forStudent: Boolean,
    isTalk: Boolean
  }],
  christianLivingPart: [{
    brother: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
    president: Boolean,
    label: String
  }],
  congregationBibleStudy: {
    reader:{type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
    brother: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
    label: String
  }


});

module.exports = mongoose.model('WeekMeeting', WeekMeetingSchema, 'weekMeeting');
