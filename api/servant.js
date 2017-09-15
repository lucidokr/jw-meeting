var express = require('express');
var router = express.Router();
var Servant = require('./models/servant');
var Brother = require('./models/brother');

router.route('/')
  .get(function(req, res) {
    Brother
      .find({congregation:req.decoded._doc.congregation._id, servant: {$exists: true, $ne: null}})
      .sort([['surname', 'ascending']])
      .populate('servant')
      .or([
        { 'servant.deleted': {$exists:false} },
        { 'servant.deleted':{$exists:true, $ne:true} }
      ])
      .exec(function(err, servants) {
          if (err){
              console.error('Servant get error:', err);
              return res.send(err);
          }

        res.json(servants);
      });
  });


router.route('/:brother_id')

  .post(function(req, res) {

    var servant = new Servant();

    servant = Object.assign(servant, req.body);

    servant.save(function(err, servant) {
        if (err){
            console.error('Servant create error:', err);
            return res.send(err);
        }

      Brother.findById(req.params.brother_id, function(err, brother) {
          if (err){
              console.error('Servant create error:', err);
              return res.send(err);
          }
        brother.servant = servant;
        brother.save(function(err) {
            if (err){
                console.error('Servant create error:', err);
                return res.send(err);
            }
          res.json({ message: 'Servant updated!' });
        });

      });
    });

  })
  .put(function(req, res) {
    Brother.findOne({'_id': req.params.brother_id})
      .populate('servant')
      .exec(function(err, brother) {
          if (err){
              console.error('Servant update error:', err);
              return res.send(err);
          }

        brother.servant = Object.assign(brother.servant, req.body);

        brother.servant.save(function(err) {
            if (err){
                console.error('Servant update error:', err);
                return res.send(err);
            }

          res.json({ message: 'Servant updated!' });
        });
      });
  })
  .delete(function(req, res) {
    Brother.findOne({'_id': req.params.brother_id}).exec(function(err, brother) {
        if (err){
            console.error('Servant delete error:', err);
            return res.send(err);
        }

      Servant.update({ _id: brother.servant }, { $set: { deleted: true }},function(err) {
          if (err){
              console.error('Servant delete error:', err);
              return res.send(err);
          }
        brother.servant = undefined;
        brother.save(function(err) {
          if (err)
            res.send(err);
          res.json({ message: 'Servant deleted' });
        });
      });


    });

  });



module.exports = router;






