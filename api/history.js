var express = require('express');
var router = express.Router();
var History = require('./models/history');

router.route('/')
  .get(function(req, res) {

    History
      .find()
      .populate('student') // space delimited path names
      .populate('studyNumber')
      .or([
        { 'student.deleted': {$exists:false} },
        { 'student.deleted':{$exists:true, $ne:true} }
      ])
      .exec(function(err, histories) {
          if (err){
              console.error('History get error:', err);
              return res.send(err);
          }

        histories = histories.filter(function(history) {
          return history.student.congregation == req.decoded._doc.congregation._id; // return only users with email matching 'type: "Gmail"' query
        });

        res.json(histories);
      });
  })
  .post(function(req, res) {

    var history = new History();      // create a new instance of the Bear model
    history.name = req.body.name;  // set the bears name (comes from the request)

    // save the bear and check for errors
    history.save(function(err) {
        if (err){
            console.error('History create error:', err);
            return res.send(err);
        }

      res.json({ message: 'History created!' });
    });

  });

router.route('/:student_id')
  .get(function(req, res) {
    History.find({student:req.params.student_id})
      .populate('student') // space delimited path names
      .populate('studyNumber')
      .exec(function(err, histories) {
          if (err){
              console.error('History student get error:', err);
              return res.send(err);
          }

        res.json(histories);
      });
  })
  .put(function(req, res) {
    History.findById(req.params.student_id, function(err, history) {

        if (err){
            console.error('History student update error:', err);
            return res.send(err);
        }

      history.name = req.body.name;  // update the bears info
      history.surname = req.body.surname;  // update the bears info

      // save the bear
      history.save(function(err) {
          if (err){
              console.error('History student update error:', err);
              return res.send(err);
          }

        res.json({ message: 'History updated!' });
      });

    });
  })
  .delete(function(req, res) {
    History.remove({
      _id: req.params.student_id
    }, function(err, history) {
        if (err){
            console.error('History student delete error:', err);
            return res.send(err);
        }

      res.json({ message: 'Successfully deleted' });
    });
  });

module.exports = router;






