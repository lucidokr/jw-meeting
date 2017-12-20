var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var WeekMicUshSchema   = new Schema(
{
  date: Date,
  type: Schema.Types.Mixed,
  usher:[{type: mongoose.Schema.Types.ObjectId, ref: 'Brother'}],
  micOperator: [{type: mongoose.Schema.Types.ObjectId, ref: 'Brother'}],
  acoustics: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'}
});

module.exports = mongoose.model('WeekMicUsh', WeekMicUshSchema, 'WeekMicUsh');
