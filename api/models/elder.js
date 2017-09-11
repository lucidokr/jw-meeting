var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ElderSchema   = new Schema({
  presidentDate: Date,
  talkDate: Date,
  gemsDate: Date,
  bibleStudyDate: Date,
  gemsEnabled: Boolean,
  talkEnabled: Boolean,
  presidentEnabled: Boolean,
  bibleStudyEnabled: Boolean,
  serviceOverseer: Boolean,
  schoolOverseer: Boolean,

  christianLivingPartEnabled: Boolean,
  christianLivingPartDate: Date,
  christianLivingPartPrevDate: Date,

  presentationExerciseEnabled: Boolean,
  presentationExerciseDate: Date,
  presentationExercisePrevDate: Date,

  deleted: Boolean
});

module.exports = mongoose.model('Elder', ElderSchema, 'elder');
