var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UsherSchema   = new Schema({
    date: Date,
    opener: Boolean,
    enabled: Boolean,
    deleted: Boolean
});

module.exports = mongoose.model('Usher', UsherSchema, 'usher');
