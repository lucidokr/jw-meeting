var express = require('express');
var router = express.Router();
var MicOperator = require('./models/micOperator');
var Brother = require('./models/brother');

router.route('/')
  .get(function(req, res) {
    Brother
      .find({congregation:req.decoded._doc.congregation._id, micOperator: {$exists: true, $ne: null}})
      .sort([['surname', 'ascending']])
      .populate('micOperator')
      .or([
        { 'micOperator.deleted': {$exists:false} },
        { 'micOperator.deleted':{$exists:true, $ne:true} }
      ])
      .exec(function(err, micOperators) {
        if (err)
          res.send(err);

        res.json(micOperators);
      });
  });


router.route('/:brother_id')

  .post(function(req, res) {

    var micOperator = new MicOperator();

      micOperator = Object.assign(micOperator, req.body);

      micOperator.save(function(err, servant) {
      if (err)
        res.send(err);

      Brother.findById(req.params.brother_id, function(err, brother) {
        if (err)
          res.send(err);
        brother.micOperator = micOperator;
        brother.save(function(err) {
          if (err)
            res.send(err);
          res.json({ message: 'MicOperator updated!' });
        });

      });
    });

  })
  .put(function(req, res) {
    Brother.findOne({'_id': req.params.brother_id})
      .populate('micOperator')
      .exec(function(err, brother) {
        if (err)
          res.send(err);

        brother.micOperator = Object.assign(brother.micOperator, req.body);

        brother.micOperator.save(function(err) {
          if (err)
            res.send(err);

          res.json({ message: 'MicOperator updated!' });
        });
      });
  })
  .delete(function(req, res) {
    Brother.findOne({'_id': req.params.brother_id}).exec(function(err, brother) {
      if (err)
        res.send(err);

      MicOperator.update({ _id: brother.micOperator }, { $set: { deleted: true }},function(err) {
        if (err)
          res.send(err);
        brother.micOperator = undefined;
        brother.save(function(err) {
          if (err)
            res.send(err);
          res.json({ message: 'MicOperator deleted' });
        });
      });


    });

  });



module.exports = router;






