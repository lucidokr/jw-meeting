var express = require('express');
var router = express.Router();
var Brother = require('./models/brother');
var Student = require('./models/student');
var Prayer = require('./models/prayer');
var Elder = require('./models/elder');
var Servant = require('./models/servant');
var History = require('./models/history');
var Reader = require('./models/reader');

router.route('/')
  .get(function(req, res) {
    Brother
      .find({congregation:req.decoded._doc.congregation._id})
      .or([
        { 'deleted':{$exists:false} },
        { 'deleted':{$exists:true, $ne:true }}
      ])
      .sort([['surname', 'ascending']])
      .populate('servant')
      .populate('elder')
      .populate('student')
      .populate('prayer')
      .populate('reader')
      .exec(function(err, brothers) {
          if (err){
              console.error('Brothers get error:', err);
              return res.status(500).send(err);
          }

        res.json(brothers);
      });
  })
  .post(function(req, res) {

    var brother = new Brother();
    brother = Object.assign(brother, req.body);
    brother.congregation = req.decoded._doc.congregation;
    brother.save(function(err) {
        if (err){
            console.error('Brother create error:', err);
            return res.send(err);
        }

      res.json({ message: 'Brother created!' , brother:brother});
    });

  });

router.route('/:brother_id')

  .get(function(req, res) {
    Brother.findById(req.params.brother_id, function(err, brother) {
        if (err){
            console.error('Brother get error:', err);
            return res.send(err);
        }
      res.json(brother);
    });
  })
  .put(function(req, res) {
    Brother.findById(req.params.brother_id, function(err, brother) {

        if (err){
            console.error('Brother update error:', err);
            return res.send(err);
        }

      brother = Object.assign(brother, req.body);

      // save the bear
      brother.save(function(err) {
          if (err){
              console.error('Brother update error:', err);
              return res.send(err);
          }

        res.json({ message: 'Brother updated!' });
      });

    });
  })
  .delete(function(req, res) {
    // Brother.update({ _id: id }, { $set: { size: 'large' }}, callback);
    Brother.findById(req.params.brother_id, function(err, brother) {

        if (err){
            console.error('Brother delete error:', err);
            return res.send(err);
        }

      brother.deleted = true;
      if(brother.student){
        Student.update({ _id: brother.student }, { $set: { deleted: true }}, function(){console.log("Student deleted")});
      }
      if(brother.elder){
        Elder.update({ _id: brother.elder }, { $set: { deleted: true }}, function(){console.log("Elder deleted")});
      }
      if(brother.servant){
        Servant.update({ _id: brother.servant }, { $set: { deleted: true }}, function(){console.log("Servant deleted")});
      }
      if(brother.reader){
        Reader.update({ _id: brother.reader }, { $set: { deleted: true }}, function(){console.log("Reader deleted")});
      }
      if(brother.prayer){
        Prayer.update({ _id: brother.prayer }, { $set: { deleted: true }}, function(){console.log("Prayer deleted")});
      }


      // save the bear
      brother.save(function(err) {
          if (err){
              console.error('Brother delete error:', err);
              return res.send(err);
          }

        res.json({ message: 'Successfully deleted' });
      });

    });
  });

module.exports = router;






