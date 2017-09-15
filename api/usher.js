var express = require('express');
var router = express.Router();
var Usher = require('./models/usher');
var Brother = require('./models/brother');

router.route('/')
  .get(function(req, res) {
    Brother
      .find({congregation:req.decoded._doc.congregation._id, usher: {$exists: true, $ne: null}})
      .sort([['surname', 'ascending']])
      .populate('usher')
      .or([
        { 'usher.deleted': {$exists:false} },
        { 'usher.deleted':{$exists:true, $ne:true} }
      ])
      .exec(function(err, ushers) {
        if (err)
          res.send(err);

        res.json(ushers);
      });
  });


router.route('/:brother_id')

  .post(function(req, res) {

    var usher = new Usher();

      usher = Object.assign(usher, req.body);

    usher.save(function(err, usher) {
      if (err)
        res.send(err);

      Brother.findById(req.params.brother_id, function(err, brother) {
        if (err)
          res.send(err);
        brother.usher = usher;
        brother.save(function(err) {
          if (err)
            res.send(err);
          res.json({ message: 'Usher updated!' });
        });

      });
    });

  })
  .put(function(req, res) {
    Brother.findOne({'_id': req.params.brother_id})
      .populate('usher')
      .exec(function(err, brother) {
        if (err)
          res.send(err);

        brother.usher = Object.assign(brother.usher, req.body);

        brother.usher.save(function(err) {
          if (err)
            res.send(err);

          res.json({ message: 'Usher updated!' });
        });
      });
  })
  .delete(function(req, res) {
    Brother.findOne({'_id': req.params.brother_id}).exec(function(err, brother) {
      if (err)
        res.send(err);

        Usher.update({ _id: brother.usher }, { $set: { deleted: true }},function(err) {
        if (err)
          res.send(err);
        brother.usher = undefined;
        brother.save(function(err) {
          if (err)
            res.send(err);
          res.json({ message: 'Usher deleted' });
        });
      });


    });

  });



module.exports = router;






