var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ServantSchema   = new Schema({
  talkDate: Date,
  gemsDate: Date,
  talkEnabled: Boolean,
  gemsEnabled: Boolean,

  deleted: Boolean
});

module.exports = mongoose.model('Servant', ServantSchema, 'servant');
