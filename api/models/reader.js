var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ReaderSchema   = new Schema({
  date: Date,
  enabled: Boolean,

  deleted: Boolean
});

module.exports = mongoose.model('Reader', ReaderSchema, 'reader');
