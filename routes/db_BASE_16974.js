var mongoose = require('mongoose');
var dbURI = 'mongodb://erklik:tusif556571@ds147681.mlab.com:47681/cits3403mac'
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
