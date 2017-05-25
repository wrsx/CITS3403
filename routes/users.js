var express = require('express');
var router = express.Router();

var Account = require('../models/account');


/* GET users listing. */
router.get('/control', function(req, res, next) {
  res.render('control', { title: 'StudyFinder - User Control',
                          pagename: 'control',
                          loggedIn: req.user,
                          name: req.user.firstname + " " + req.user.lastname,
                          age: 'should this be added at signup or be optionally added later?',
                          phone: 'should this be added at signup or be optionally added later?',
                          email: req.user.username,
                          units: req.user.units,
                        });
});

router.get('/matches', function(req, res, next) {

  Account.find({}, function(err, users){
    var matchesusers = [];
    for(var k = 0 ; k < req.user.units.length ; k++ ){
      for( var i = 0 ; i < users.length ; i++){
        for( var j = 0 ; j < users[i].units.length ; j++ ){
          if ( req.user.units[k] == users[i].units[j] && users[i].units[j] !== '' && req.user.units[k] !== '' && req.user.username !== users[i].username ){
            if ( users[i].username !== req.user.username  ) {
              var currAvail = JSON.parse(req.user.availability);
              var userAvail = JSON.parse(users[i].availability);
              for(var m = 0 ; m < 7 ; m++){

                var userStart = new Date(Date.parse('01/01/2001 ' + currAvail[m].start));
  							var userEnd = new Date(Date.parse('01/01/2001 ' +  currAvail[m].end));
  							var guestStart = new Date(Date.parse('01/01/2001 ' + userAvail[m].start));
  							var guestEnd = new Date(Date.parse('01/01/2001 ' + userAvail[m].end));
                if( +userStart <= +guestEnd && +userEnd >= +guestStart){
                    matchesusers.push(users[i]);
                }
              }
            }
          }
        }
      }
    }

    uniqArray = matchesusers.filter(function(item,pos,self){
      return self.indexOf(item) == pos;
    })
    res.render('matches', { title: 'StudyFinder - Your Matches',
                            pagename: 'matches',
                            loggedIn: req.user,
                            matchlist: uniqArray});

  });

});

module.exports = router;
