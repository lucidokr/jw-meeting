var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ElderSchema   = new Schema({
  presidentDate: Date,
  presidentPrevDate: Date,
  talkDate: Date,
  talkPrevDate: Date,
  gemsDate: Date,
  gemsPrevDate: Date,
  bibleStudyDate: Date,
  bibleStudyPrevDate: Date,
  gemsEnabled: Boolean,
  talkEnabled: Boolean,
  presidentEnabled: Boolean,
  bibleStudyEnabled: Boolean,
  serviceOverseer: Boolean,
  schoolOverseer: Boolean,

  christianLivingPartEnabled: Boolean,
  christianLivingPartDate: Date,
  christianLivingPartPrevDate: Date,

  deleted: Boolean
});

module.exports = mongoose.model('Elder', ElderSchema, 'elder');
