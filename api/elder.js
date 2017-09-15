var express = require('express');
var router = express.Router();
var Elder = require('./models/elder');
var Brother = require('./models/brother');

router.route('/')
  .get(function(req, res) {
    Brother
      .find({congregation:req.decoded._doc.congregation._id, elder: {$exists: true, $ne: null}})
      .populate('elder')
      .or([
        { 'elder.deleted': {$exists:false} },
        { 'elder.deleted':{$exists:true, $ne:true} }
      ])
      .sort([['surname', 'ascending']])
      .exec(function(err, brothers) {
          if (err){
              console.error('Elder get error:', err);
              return res.send(err);
          }

        res.json(brothers);
      });
  });


router.route('/:brother_id')

  .post(function(req, res) {

    var elder = new Elder();

    elder = Object.assign(elder, req.body);

    elder.save(function(err, elder) {
        if (err){
            console.error('Elder create error:', err);
            return res.send(err);
        }

      Brother.findById(req.params.brother_id, function(err, brother) {
          if (err){
              console.error('Elder create error:', err);
              return res.send(err);
          }
        brother.elder = elder;
        brother.save(function(err) {
            if (err){
                console.error('Elder create error:', err);
                return res.send(err);
            }
          res.json({ message: 'Elder updated!' });
        });

      });
    });

  })
  .put(function(req, res) {
    Brother.findOne({'_id': req.params.brother_id})
      .populate('elder')
      .exec(function(err, brother) {
          if (err){
              console.error('Elder update error:', err);
              return res.send(err);
          }

        brother.elder = Object.assign(brother.elder, req.body);

        brother.elder.save(function(err) {
            if (err){
                console.error('Elder update error:', err);
                return res.send(err);
            }

          res.json({ message: 'Elder updated!' });
        });
      });
  })
  .delete(function(req, res) {
    Brother.findOne({'_id': req.params.brother_id}).exec(function(err, brother) {
        if (err){
            console.error('Elder delete error:', err);
            return res.send(err);
        }

      Elder.update({ _id: brother.elder }, { $set: { deleted: true }},function(err) {
          if (err){
              console.error('Elder delete error:', err);
              return res.send(err);
          }
        brother.elder = undefined;
        brother.save(function(err) {
            if (err){
                console.error('Elder delete error:', err);
                return res.send(err);
            }

          res.json({ message: 'Elder deleted' });
        });
      });


    });

  });



module.exports = router;






