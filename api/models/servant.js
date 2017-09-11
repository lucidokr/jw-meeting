var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ServantSchema   = new Schema({
  talkDate: Date,
  gemsDate: Date,
  talkEnabled: Boolean,
  gemsEnabled: Boolean,
  christianLivingPartEnabled: Boolean,
  christianLivingPartDate: Date,
  christianLivingPartPrevDate: Date,

  presentationExerciseEnabled: Boolean,
  presentationExerciseDate: Date,
  presentationExercisePrevDate: Date,

  deleted: Boolean
});

module.exports = mongoose.model('Servant', ServantSchema, 'servant');
