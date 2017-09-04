var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CongregationSchema   = new Schema({
  name: String,
  meetingDay: Number
});

module.exports = mongoose.model('Congregation', CongregationSchema, 'congregation');
