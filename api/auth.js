
var express = require('express');
var app = express();
var router = express.Router();
var User = require('./models/user');
var Congregation = require('./models/congregation');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var randtoken = require('rand-token');
const crypto = require('crypto');

var refreshTokens = {};

var EXPIRES = 60*60*24*7;


app.set('superSecret', process.env.SECRET);
router.route('/login')
  .post(async (req, res) =>  {

    try{
      // find the user
      var user = await User
      .findOne({username: req.body.username})
        .populate('congregation')
        .populate('brother')
    }catch(e){
      return res.status(500).send(e)
    }

    if (!user) {
      res.status(404).json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.status(403).json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var obj = user;
        delete obj.password;
        var token = jwt.sign(obj, app.get('superSecret'), {
          expiresIn : EXPIRES
        });

        crypto.randomBytes(256, (err, buf) => {
          if (err) throw err;

          var refreshToken = buf.toString('hex');
          refreshTokens[refreshToken] = req.body.username;

          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Token created!',
            token: token,
            refreshToken: refreshToken
          });
        });

      }

    }
  });

router.route('/refresh')
  .post(async (req, res) => {

    try{
    var user = await User
      .findOne({username: req.body.username})
      .populate('congregation')
    }catch(e){
      return res.status(500).send({success:false, error:500, message:"User not found", errorCode: e})
    }
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


module.exports = router;







