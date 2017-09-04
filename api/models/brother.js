var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BrotherSchema   = new Schema({

  name: String,
  surname: String,
  gender: String,
  email: String,

  deleted: Boolean,

  servant: {type: mongoose.Schema.Types.ObjectId, ref: 'Servant'},
  elder: {type: mongoose.Schema.Types.ObjectId, ref: 'Elder'},
  student: {type: mongoose.Schema.Types.ObjectId, ref: 'Student'},
  prayer: {type: mongoose.Schema.Types.ObjectId, ref: 'Prayer'},
  reader: {type: mongoose.Schema.Types.ObjectId, ref: 'Reader'},

  congregation: {type: mongoose.Schema.Types.ObjectId, ref: 'Congregation'}

});

module.exports = mongoose.model('Brother', BrotherSchema, 'brother');
