var express = require('express');
var router = express.Router();
var History = require('./models/history');


/**
 * API FOR HISTORY OF A CONGREGATION
 */
router.route('/')
  .get(async (req, res) =>  {
    try{
      var histories = await History
        .find()
        .populate('student') // space delimited path names
        // .populate('lesson')
        .or([
          { 'student.deleted': {$exists:false} },
          { 'student.deleted':{$exists:true, $ne:true} }
        ])
        histories = histories.filter(function(history) {
          return history.student.congregation == req.decoded._doc.congregation._id;
        });
        res.json(histories);
    }catch(e){
      console.error('Get histories error:', e);
      return res.status(500).send({success:false, error:500, message:"Get histories error", errorCode: e})
    }
  })
  .post(async (req, res) => {
    var history = new History();
    history.name = req.body.name;
    try{
      await history.save();
      res.json({ success:true, message: 'History created!' });
    }catch(e){
      console.error('Create history error:', e);
      return res.status(500).send({success:false, error:500, message:"Create history error", errorCode: e})
    }

  });

/**
 * API FOR STUDENT HISTORY
 */
router.route('/:student_id')
  .get(async(req, res) => {
    try{
      var histories = await History.find({student:req.params.student_id})
        .populate('student')
      res.json(histories);
    }catch(e){
      console.error('Get history student error:', e);
      return res.status(500).send({success:false, error:500, message:"Get history student  error", errorCode: e})
    }
  })
  .put(async(req, res) => {
    try{
      var history = await History.findById(req.params.student_id)
      history.name = req.body.name;
      history.surname = req.body.surname;
      await history.save();
      res.json({success:true, message: 'History updated!' });
    }catch(e){
      console.error('Update history student error:', e);
      return res.status(500).send({success:false, error:500, message:"Update history student  error", errorCode: e})
    }
  })
  .delete(async(req, res) => {
    try{
      await History.remove({
        _id: req.params.student_id
      });
      res.json({ success: true, message: 'History successfully deleted' });
    }catch(e){
      console.error('Delete history student error:', e);
      return res.status(500).send({success:false, error:500, message:"Delete history student  error", errorCode: e})
    }
  });

module.exports = router;






