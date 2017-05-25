var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Experience = new Schema({
  exp_header: String,
  exp_body: String
});

var Account = new Schema({
  firstname: String,
  lastname: String,
  age: String,
  phone: String,
  username: String,
  password: String,
  units: [String],
  availability: String,
  experience: [Experience],
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
