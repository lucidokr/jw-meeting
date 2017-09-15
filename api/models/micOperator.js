var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MicOperatorSchema   = new Schema({
    date: Date,
    podium: Boolean,
    left: Boolean,
    center: Boolean,
    right: Boolean,
    enabled: Boolean,
    deleted: Boolean
});

module.exports = mongoose.model('MicOperator', MicOperatorSchema, 'micOperator');
