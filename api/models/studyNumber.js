var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var StudyNumberSchema   = new Schema({
  number: Number,
  title: String,
  forBibleReading: Boolean
});

module.exports = mongoose.model('StudyNumber', StudyNumberSchema, 'studyNumber');
