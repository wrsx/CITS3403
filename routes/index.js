var express = require('express');
// for passport
var passport = require('passport');
var Account = require('../models/account');
var Units = require('../models/units');
// end passport

var router = express.Router();


/* GET algorithm page*/
router.get('/algorithm', function(req, res, next) {
  res.render('algorithm', {title: 'StudyFinder - Algorithm', pagename: 'algorithm', loggedIn: req.user});
});

/* GET architecture/design/difficulties page*/
router.get('/design', function(req, res, next) {
  res.render('design', {title: 'StudyFinder - Design', pagename: 'design', loggedIn: req.user});
});

/* GET testing/validation page*/
router.get('/testing', function(req, res, next) {
  res.render('testing', {title: 'StudyFinder - Testing', pagename: 'testing', loggedIn: req.user});
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'StudyFinder - Home' , pagename: 'index', loggedIn: req.user});
});

/* POST home page. AKA Login */
router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/users/control');
});

function dayToNum(day){
  return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(day);
}

/* GET Logout */
router.get('/logout', function(req, res) {
  req.logout();
    res.redirect('/');
});

/* GET signup page. */
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'StudyFinder - Signup' , pagename: 'signup', loggedIn: false});
});

/* POST signup page. */
router.post('/signup', function(req, res) {
  var error = "";
  if (!(/^([A-Za-z])+$/.test(req.body.firstname)))
    error = "First Name may only contain letters. ie. \"John\"\n";
  if (!(/^([A-Za-z])+$/.test(req.body.lastname)))
    error = error + "Last Name may only contain letters. ie. \"Smith\"\n";
  if (!(/^\d{2}$/.test(req.body.age)))
    error = error + "Age may only contain two digits. ie. \"23\"\n";
  if (!(/^\d{8}@student\.uwa\.edu\.au$/.test(req.body.username)))
    error = error + "Email must be of the form: \"12345678@student.uwa.edu.au\"\n";
  if (!(/^(\w|\d){6,18}$/.test(req.body.password)))
    error = error + "Password must contain 6-18 alphanumeric characters. ie. \"pa$$w0rd\"\n";

  if(!error) {
    Account.register(
      new Account({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        age: req.body.age,
        username: req.body.username,
        phone: 'Please add your phone number!',
        availability: JSON.stringify(req.body.avail)
        }),
        req.body.password,
        function(err, account) {
          if (err) {
            console.log(err);
            return res.render('signup', { account : account });
          }
          passport.authenticate('local')(req, res, function () {
            res.redirect('/users/control');
            });
        });
  }
  else {
    console.log("\nERROR: " + error);
    res.redirect('/signup');
  }
});

/* POST unit requests */
router.post('/sub-units', function(req, res) {
  req.user.units = req.body.units;
  req.user.save();
  res.redirect('/users/control');
});

/* POST experience requests */
router.post('/sub-exp', function(req, res) {
  req.user.experience = [];
  if(typeof req.body.expContent != 'undefined') { //if any exp entries were sent
    if (req.body.expContent.constructor == Array) { // if we receive multiple exp entries
      console.log('Added multiple entry, size: ' + req.body.expHeader.length);
      for (var i = 0; i < req.body.expHeader.length; i++) {
        req.user.experience.push({exp_header: req.body.expHeader[i], exp_body: req.body.expContent[i]});
      }
    }
    else { //we receive only one entry, so we can just add it
      console.log('Added single entry');
      req.user.experience.push({exp_header: req.body.expHeader, exp_body: req.body.expContent});
    }
  }
  req.user.save();
  res.redirect('/users/control');
});

/* GET unit requests */
router.get('/search_unit', function(req, res) {
  var regex = new RegExp(req.query.query, 'i');
  var query = Units.find( {$or: [{unit: regex}, {name: regex}]});
  // Execute query in a callback and return users list
  query.exec(function(err, units) {
    if (!err) {
      //Build a result set
      var result = [];
      //Limit response to 12
      for (var i = 0; i < units.length; i++) {
        if (result.length < 12) {
          result.push(units[i].unit + " - " + units[i].name);
        }
      }
      res.send(result, {
        'Content-Type': 'application/json'
      }, 200);
    } else {
      res.send(JSON.stringify(err), {
        'Content-Type': 'application/json'
      }, 404);
    }
  });
});

router.post('/personaledit', function(req, res) {
  var error = "";
  if (!(/^([A-Za-z])+$/.test(req.body.firstname)))
    error = "First Name may only contain letters. ie. \"John\"\n";
  if (!(/^([A-Za-z])+$/.test(req.body.lastname)))
    error = error + "Last Name may only contain letters. ie. \"Smith\"\n";
  if (!(/^\d{2}$/.test(req.body.age)))
    error = error + "Age may only contain two digits. ie. \"23\"\n";
  if (!(/^(04\d{8}|Please add your phone number!|\s*)$/.test(req.body.phone)))
    error = error + "Phone must be a mobile number beginning with \"04\". ie. \"0400555666\"\n";

  if(!error) {
    req.user.firstname = req.body.firstname;
    req.user.lastname = req.body.lastname;
    req.user.age = req.body.age;
    req.user.phone = req.body.phone;
    req.user.save();
    res.redirect('/users/control');
  }
  else {
    console.log("\nERROR: " + error);
    res.redirect('/users/control');
  }
});


module.exports = router;
