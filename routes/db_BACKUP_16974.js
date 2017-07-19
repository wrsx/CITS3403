var mongoose = require('mongoose');
<<<<<<< HEAD
var dbURI = 'mongodb://jimorey:jim123@ds117271.mlab.com:17271/studyfinderdb'
=======

//Uncomment to use remote database
var dbURI = 'mongodb://erklik:tusif556571@ds147681.mlab.com:47681/cits3403mac'
//Uncomment to use local databse
>>>>>>> c0fda53f01d142f449e488df2c61d906eb22e30c
//var dbURI = 'mongodb://localhost:27017/CITS3403'

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

var gracefulShutdown = function (msg, callback) {
  mongoose.connection.close(function () {
      console.log('Mongoose disconnected through' + msg);
        callback();
      });
};
