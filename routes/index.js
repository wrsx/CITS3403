var express = require('express');
// for passport
var passport = require('passport');
var Account = require('../models/account');
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
  res.render('signup', { title: 'StudyFinder - Signup' , pagenamee: 'signup', loggedIn: false});
});

/* POST signup page. */
router.post('/signup', function(req, res) {
  Account.register(new Account({  username : req.body.username,
                                  firstname: req.body.firstname,
                                  lastname: req.body.lastname,
                                  university: req.body.university,
                                  email: req.body.email}),
                   req.body.password,
                   function(err, account) {
                      if (err) {
                        return res.render('signup', { account : account });
                      }
                      passport.authenticate('local')(req, res, function () {
                        res.redirect('/');
                      });
                   });
});

module.exports = router;
