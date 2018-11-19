var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var HistorySchema   = new Schema({
  date: Date,
  made: Boolean,
  student: {type: mongoose.Schema.Types.ObjectId, ref: 'Brother'},
  // lesson: {type: mongoose.Schema.Types.ObjectId, ref: 'Lesson'},

  deleted: Boolean
});

module.exports = mongoose.model('History', HistorySchema, 'history');
