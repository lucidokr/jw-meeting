var express = require('express');
var router = express.Router();
var Lesson = require('./models/lesson');

router.route('/')
  .get(function(req, res) {
    Lesson
      .find()
      .sort([
          ['number', 'ascending']
      ])
      .exec(function(err, studies) {
          if (err){
              console.error('Lesson get error:', err);
              return res.send(err);
          }

        res.json(studies);
      });
  });

module.exports = router;






