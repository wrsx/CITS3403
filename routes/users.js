var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/control', function(req, res, next) {
  res.render('control', { title: 'StudyFinder - User Control',
                          name: 'control',
                          loggedIn: req.user,
                          name: req.user.firstname + " " + req.user.lastname,
                          age: 'should this be added at signup or be optionally added later?',
                          phone: 'should this be added at signup or be optionally added later?',
                          email: req.user.email
                        });
});

router.get('/matches', function(req, res, next) {
  res.render('matches', { title: 'StudyFinder - Your Matches',
                          name: 'matches',
                          loggedIn: req.user});
});

module.exports = router;
