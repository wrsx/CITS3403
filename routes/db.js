var mongoose = require('mongoose');
var dbURI = 'mongodb://jimorey:jim123@ds117271.mlab.com:17271/studyfinderdb'
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
