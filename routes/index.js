var express = require('express');
// for passport
var passport = require('passport');
var Account = require('../models/account');
var Units = require('../models/units');
// end passport
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'StudyFinder - Home' , pagename: 'index', loggedIn: req.user});
});

/* POST home page. AKA Login */
router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/'); //TO DO: redirect this to users profile page
});

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
  var avail = JSON.stringify(req.body.avail);
  console.log((avail));
  Account.register(new Account({  firstname: req.body.firstname,
                                  lastname: req.body.lastname,
                                  username: req.body.username,
                                  availability: avail }),
                                  req.body.password,
                   function(err, account) {
                      if (err) {
                        console.log(err);
                        return res.render('signup', { account : account });
                      }
                      passport.authenticate('local')(req, res, function () {
                        res.redirect('/');
                      });
                   });
});

/* POST unit requests */
router.post('/sub-units', function(req, res) {
  req.user.units = req.body.units;
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


module.exports = router;
