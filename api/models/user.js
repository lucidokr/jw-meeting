var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
  username: String,
  password: String,
  role: String,
  congregation: {type: mongoose.Schema.Types.ObjectId, ref: 'Congregation'},
  brother:{type: mongoose.Schema.Types.ObjectId, ref: 'Brother'}
}), 'user');
