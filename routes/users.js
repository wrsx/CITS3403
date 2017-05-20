var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/control', function(req, res, next) {
  res.render('control', { title: 'StudyFinder - User Control' , name: 'control', loggedIn: true});
});

router.get('/matches', function(req, res, next) {
  res.render('matches', { title: 'StudyFinder - Your Matches' , name: 'matches', loggedIn: true});
});

module.exports = router;
