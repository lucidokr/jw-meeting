
var express = require('express');
var app = express();
var router = express.Router();
var User = require('./models/user');
var Congregation = require('./models/congregation');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var randtoken = require('rand-token');

var refreshTokens = {};

var EXPIRES = 60*60*24*7;


app.set('superSecret', 'jwmeeting');
router.route('/login')
  .post(function(req, res) {

    // find the user
    User
    .find({username: req.body.username})
      .populate('congregation')
      .exec(function(err, users) {

          if (err) throw err;

          var user = users[0];
          if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
          } else if (user) {

            // check if password matches
            if (user.password != req.body.password) {
              res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {

              // if user is found and password is right
              // create a token
              var obj = user;
              delete obj.password;
              var token = jwt.sign(obj, app.get('superSecret'), {
                expiresIn : EXPIRES
              });

              var refreshToken = randtoken.uid(256)
              refreshTokens[refreshToken] = req.body.username;


              // return the information including token as JSON
              res.json({
                success: true,
                message: 'Token created!',
                token: token,
                refreshToken: refreshToken
              });
            }

          }

    });
  });

router.route('/refresh')
  .post(function(req, res) {

    User
      .find({username: req.body.username})
      .populate('congregation')
      .exec(function(err, users) {

        if (err) throw err;

        var user = users[0];
        var username = req.body.username;
        var refreshToken = req.body.refreshToken;
        if(refreshTokens[refreshToken] == username){
          var obj = user;
          delete obj.password;
          var token = jwt.sign(obj, app.get('superSecret'), {
            expiresIn : EXPIRES
          });
          res.json({
            success: true,
            message: 'Token refreshed!',
            token: token,
            refreshToken: refreshToken
          });
        }else {
          res.status(403).send({
            success: false,
            message: 'Invalid refresh token'
          })
        }
    });
  });


module.exports = router;







