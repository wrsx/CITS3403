var express = require('express');
var router = express.Router();

var Account = require('../models/account');


/* GET users listing. */
router.get('/control', ensureAuthenticated , function(req, res, next) {
  res.render('control', { title: 'StudyFinder - User Control',
                          pagename: 'control',
                          loggedIn: req.user,
                          name: req.user.firstname + ' ' + req.user.lastname,
                          firstname: req.user.firstname,
                          lastname: req.user.lastname,
                          age: req.user.age,
                          phone: req.user.phone,
                          email: req.user.username,
                          units: req.user.units,
                          noUnits: req.user.units.length,
                          experience: req.user.experience,
                          noExp: req.user.experience.length
                        });
});

router.post('/updateavailability' , ensureAuthenticated , function (req,res) {
  console.log(req.body.avail);
  console.log( JSON.stringify( req.body.avail ) );
  Account.findOneAndUpdate( {username: req.user.username} , { "availability" : JSON.stringify( req.body.avail ) }, function(err){
    if (err){
      console.log("ERROR");
    }
  });
  res.redirect('/users/control');
});



router.get('/matches', ensureAuthenticated , function(req, res, next) {

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

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/');
  }
}


module.exports = router;
