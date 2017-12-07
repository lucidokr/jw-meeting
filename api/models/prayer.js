var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PrayerSchema   = new Schema({
  date: Date,
  prevDate: Date,
  enabled: Boolean,

  deleted: Boolean
});

module.exports = mongoose.model('Prayer', PrayerSchema, 'prayer');
