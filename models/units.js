var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Units = new Schema({
    unit: String,
    name: String
});

module.exports = mongoose.model('Units', Units, 'units');
