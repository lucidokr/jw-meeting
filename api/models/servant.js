var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ServantSchema   = new Schema({
  talkDate: Date,
  talkPrevDate: Date,
  gemsDate: Date,
  gemsPrevDate: Date,
  talkEnabled: Boolean,
  gemsEnabled: Boolean,
  christianLivingPartEnabled: Boolean,
  christianLivingPartDate: Date,
  christianLivingPartPrevDate: Date,

  deleted: Boolean
});

module.exports = mongoose.model('Servant', ServantSchema, 'servant');
