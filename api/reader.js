var express = require('express');
var router = express.Router();
var Reader = require('./models/reader');
var Brother = require('./models/brother');

router.route('/')
  .get(function(req, res) {
    Brother
      .find({reader: {$exists: true, $ne: null}})
      .sort([['surname', 'ascending']])
      .populate('reader')
      .or([
        { 'reader.deleted': {$exists:false} },
        { 'reader.deleted':{$exists:true, $ne:true} }
      ])
      .exec(function(err, readers) {
        if (err)
          res.send(err);

        res.json(readers);
      });
  });


router.route('/:brother_id')

  .post(function(req, res) {

    var reader = new Reader();

    reader = Object.assign(reader, req.body);

    reader.save(function(err, newReader) {
      if (err)
        res.send(err);

      Brother.findById(req.params.brother_id, function(err, brother) {
        if (err)
          res.send(err);
        brother.reader = newReader;
        brother.save(function(err) {
          if (err)
            res.send(err);
          res.json({ message: 'Reader updated!', brother: brother});
        });

      });
    });

  })
  .put(function(req, res) {
    Brother.findOne({'_id': req.params.brother_id})
      .populate('reader')
      .exec(function(err, brother) {
        if (err)
          res.send(err);

        brother.reader = Object.assign(brother.reader, req.body);

        brother.reader.save(function(err) {
          if (err)
            res.send(err);

          res.json({ message: 'Reader updated!' });
        });
      });
  })
  .delete(function(req, res) {
    Brother.findOne({'_id': req.params.brother_id}).exec(function(err, brother) {
      if (err)
        res.send(err);

      Reader.update({ _id: brother.reader }, { $set: { deleted: true }},function(err) {
        if (err)
          res.send(err);
        brother.reader = undefined;
        brother.save(function(err) {
          if (err)
            res.send(err);
          res.json({ message: 'Reader deleted' });
        });
      });


    });

  });



module.exports = router;






