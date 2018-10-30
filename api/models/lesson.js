var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var LessonSchema   = new Schema({
  number: Number,
  title: String
});

module.exports = mongoose.model('Lesson', LessonSchema, 'lesson');
