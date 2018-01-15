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
  initialSong:String,
  intervalSong:String,
  finalSong:String,
  initialPrayer: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
  finalPrayer: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
  president:{type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
  talk: {
    brother: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
    label: String
  },
  gems: {
    brother: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
    label: String
  },
  presentationExercise: {
    enabled: Boolean,
    brother: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
    label: String
  },
  bibleReading: any = {
    primarySchool:{
      student: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
      updated: Boolean,
      made: Number,
      pointCompleted: Boolean,
      pointChanged: Boolean
    },
    secondarySchool:{
      student: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
      updated: Boolean,
      made: Number,
      pointCompleted: Boolean,
      pointChanged: Boolean
    },
    label: String
  },
  initialCall: {
    primarySchool:{
      student: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
      assistant: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
      updated: Boolean,
      made: Number,
      pointCompleted: Boolean,
      gender: String,
      pointChanged: Boolean
    },
    secondarySchool:{
      student: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
      assistant: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
      updated: Boolean,
      made: Number,
      pointCompleted: Boolean,
      gender: String,
      pointChanged: Boolean
    },
    label: String,
    video: Boolean
  },
  returnVisit: {
    primarySchool:{
      student: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
      assistant: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
      updated: Boolean,
      made: Number,
      pointCompleted: Boolean,
      gender: String,
      pointChanged: Boolean
    },
    secondarySchool:{
      student: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
      assistant: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
      updated: Boolean,
      made: Number,
      pointCompleted: Boolean,
      gender: String,
      pointChanged: Boolean
    },
    label: String,
    video: Boolean
  },
  bibleStudy:{
    primarySchool:{
      student: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
      isTalk: Boolean,
      assistant: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
      updated: Boolean,
      made: Number,
      pointCompleted: Boolean,
      gender: String,
      pointChanged: Boolean
    },
    secondarySchool:{
      student: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
      isTalk: Boolean,
      assistant: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
      updated: Boolean,
      made: Number,
      pointCompleted: Boolean,
      gender: String,
      pointChanged: Boolean
    },
    label: String,
    video: Boolean
  },
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
