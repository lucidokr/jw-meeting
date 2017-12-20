var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PgmMicUshSchema   = new Schema(
{
  congregation: {type: mongoose.Schema.Types.ObjectId, ref: 'Congregation'},
  name: String,
  weeks: {type: mongoose.Schema.Types.ObjectId, ref: 'WeekMicUsh'}
});

module.exports = mongoose.model('PgmMicUsh', PgmMicUshSchema, 'PgmMicUsh');
