var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AcousticsSchema   = new Schema({
    date: Date,
    enabled: Boolean,
    deleted: Boolean
});

module.exports = mongoose.model('Acoustics', AcousticsSchema, 'acoustics');
