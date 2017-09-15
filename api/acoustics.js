var express = require('express');
var router = express.Router();
var Acoustics = require('./models/acoustics');
var Brother = require('./models/brother');

router.route('/')
  .get(function(req, res) {
    Brother
      .find({congregation:req.decoded._doc.congregation._id, acoustics: {$exists: true, $ne: null}})
      .sort([['surname', 'ascending']])
      .populate('acoustics')
      .or([
        { 'acoustics.deleted': {$exists:false} },
        { 'acoustics.deleted':{$exists:true, $ne:true} }
      ])
      .exec(function(err, acoustics) {
        if (err)
          res.send(err);

        res.json(acoustics);
      });
  });


router.route('/:brother_id')

  .post(function(req, res) {

    var acoustics = new Acoustics();

      acoustics = Object.assign(acoustics, req.body);

      acoustics.save(function(err, servant) {
      if (err)
        res.send(err);

      Brother.findById(req.params.brother_id, function(err, brother) {
        if (err)
          res.send(err);
        brother.acoustics = acoustics;
        brother.save(function(err) {
          if (err)
            res.send(err);
          res.json({ message: 'Acoustics updated!' });
        });

      });
    });

  })
  .put(function(req, res) {
    Brother.findOne({'_id': req.params.brother_id})
      .populate('acoustics')
      .exec(function(err, brother) {
        if (err)
          res.send(err);

        brother.acoustics = Object.assign(brother.acoustics, req.body);

        brother.acoustics.save(function(err) {
          if (err)
            res.send(err);

          res.json({ message: 'Acoustics updated!' });
        });
      });
  })
  .delete(function(req, res) {
    Brother.findOne({'_id': req.params.brother_id}).exec(function(err, brother) {
      if (err)
        res.send(err);

      Acoustics.update({ _id: brother.acoustics }, { $set: { deleted: true }},function(err) {
        if (err)
          res.send(err);
        brother.acoustics = undefined;
        brother.save(function(err) {
          if (err)
            res.send(err);
          res.json({ message: 'Acoustics deleted' });
        });
      });


    });

  });



module.exports = router;






