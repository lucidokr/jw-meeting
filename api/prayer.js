var express = require('express');
var router = express.Router();
var Prayer = require('./models/prayer');
var Brother = require('./models/brother');

router.route('/')
  .get(function(req, res) {
    Brother
      .find({congregation:req.decoded._doc.congregation._id, prayer: {$exists: true, $ne: null}})
      .sort([['surname', 'ascending']])
      .populate('prayer')
      .or([
        { 'prayer.deleted': {$exists:false} },
        { 'prayer.deleted':{$exists:true, $ne:true} }
      ])
      .exec(function(err, prayers) {
        if (err)
          res.send(err);

        res.json(prayers);
      });
  });


router.route('/:brother_id')

  .post(function(req, res) {

    var prayer = new Prayer();

    prayer = Object.assign(prayer, req.body);

    prayer.save(function(err, newPr) {
      if (err)
        res.send(err);

      Brother.findById(req.params.brother_id, function(err, brother) {
        if (err)
          res.send(err);
        brother.prayer = newPr;
        brother.save(function(err) {
          if (err)
            res.send(err);
          res.json({ message: 'Prayer updated!' ,brother: brother});
        });

      });
    });

  })
  .put(function(req, res) {
    Brother.findOne({'_id': req.params.brother_id})
      .populate('prayer')
      .exec(function(err, brother) {
        if (err)
          res.send(err);

        brother.prayer = Object.assign(brother.prayer, req.body);

        brother.prayer.save(function(err) {
          if (err)
            res.send(err);

          res.json({ message: 'Prayer updated!' });
        });
      });
  })
  .delete(function(req, res) {
    Brother.findOne({'_id': req.params.brother_id}).exec(function(err, brother) {
      if (err)
        res.send(err);

      Prayer.update({ _id: brother.prayer }, { $set: { deleted: true }},function(err) {
        if (err)
          res.send(err);
        brother.prayer = undefined;
        brother.save(function(err) {
          if (err)
            res.send(err);
          res.json({ message: 'Prayer deleted' });
        });
      });


    });

  });



module.exports = router;






