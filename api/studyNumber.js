var express = require('express');
var router = express.Router();
var StudyNumber = require('./models/studyNumber');

router.route('/')
  .get(function(req, res) {
    StudyNumber
      .find()

      .exec(function(err, studies) {
          if (err){
              console.error('Study Number get error:', err);
              return res.send(err);
          }

        res.json(studies);
      });
  });

module.exports = router;






