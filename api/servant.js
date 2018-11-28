var express = require('express');
var router = express.Router();
var Servant = require('./models/servant');
var Brother = require('./models/brother');

/**
 * API FOR ALL SERVANTS OF A CONGREGATION
 */
router.route('/')
  .get(async(req, res) => {
    try{
      var servants = await Brother
        .find({congregation:req.decoded._doc.congregation._id, servant: {$exists: true, $ne: null}})
        .sort([['surname', 'ascending']])
        .populate('servant')
        .or([
          { 'servant.deleted': {$exists:false} },
          { 'servant.deleted':{$exists:true, $ne:true} }
        ])
      res.json(servants);
    }catch(e){
      console.error('Get servants error:', e);
      return res.status(500).send({success:false, error:500, message:"Get servants error", errorCode: e.toString()})
    }
  });

/**
 * API FOR A SPECIFIC SERVANT
 */
router.route('/:brother_id')
  .post(async(req, res) => {
    var servant = new Servant();
    servant = Object.assign(servant, req.body);
    try{
      await servant.save()
      var brother = await Brother.findById(req.params.brother_id)
      brother.servant = servant;
      await brother.save()
      res.json({ success: true, message: 'Servant created!' , brother: brother});
    }catch(e){
      console.error('Create servant error:', e);
      return res.status(500).send({success:false, error:500, message:"Create servant error", errorCode: e.toString()})
    }
  })
  .put(async(req, res) => {
    try{
      var brother = await Brother.findById(req.params.brother_id)
        .populate('servant')
      brother.servant = Object.assign(brother.servant, req.body);
      await brother.servant.save()
      res.json({ success:true, message: 'Servant updated!' });
    }catch(e){
      console.error('Update servant error:', e);
      return res.status(500).send({success:false, error:500, message:"Update servant error", errorCode: e.toString()})
    }
  })
  .delete(async(req, res) => {
    try{
      var brother = await Brother.findById(req.params.brother_id)
          .populate('servant')
      await Servant.update({ _id: brother.servant }, { $set: { deleted: true }})
      brother.servant = undefined;
      await brother.save();
      res.json({ success: true, message: 'Servant deleted!' });
    }catch(e){
      console.error('Servant delete error:', e);
      return res.status(500).send({success:false, error:500, message:"Servant delete error", errorCode: e.toString()})
    }
  });



module.exports = router;






