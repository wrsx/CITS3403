var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
  firstname: String,
  lastname: String,
  age: String,
  phone: String,
  username: String,
  password: String,
  units: [String],
  availability: String
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
