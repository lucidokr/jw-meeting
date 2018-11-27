var express = require('express');
var router = express.Router();
var Elder = require('./models/elder');
var Brother = require('./models/brother');

router.route('/')
  .get(async (req, res) => {
    try{
      var brothers = await Brother
        .find({congregation:req.decoded._doc.congregation._id, elder: {$exists: true, $ne: null}})
        .populate('elder')
        .or([
          { 'elder.deleted': {$exists:false} },
          { 'elder.deleted':{$exists:true, $ne:true} }
        ])
        .sort([['surname', 'ascending']])

      res.json(brothers);
    }catch(e){
      console.error('Elders get error:', e);
      return res.status(500).send({success:false, error:500, message:"Elders get error", errorCode: e})
    }
  });


router.route('/:brother_id')

  .post(async(req, res) => {

    var elder = new Elder();
    elder = Object.assign(elder, req.body);
    try{
      await elder.save();
    }catch(e){
      console.error('Elder create error:', e);
      return res.status(500).send({success:false, error:500, message:"Elder create error", errorCode: e})
    }
    try{
      var brother = await Brother.findById(req.params.brother_id)
      brother.elder = elder;
      await brother.save();
      res.json({ success:true, message: 'Elder created!' });
    }catch(e){
      console.error('Elder create error:', e);
      return res.status(500).send({success:false, error:500, message:"Elder create error", errorCode: e})
    }
  })
  .put(async(req, res) =>  {
    try{
      var brother = await Brother.findById(req.params.brother_id)
          .populate('elder')
      brother.elder = Object.assign(brother.elder, req.body);
      await brother.elder.save()
      res.json({ success: true, message: 'Elder updated!' });
    }catch(e){
      console.error('Elder update error:', e);
      return res.status(500).send({success:false, error:500, message:"Elder update error", errorCode: e})
    }
  })
  .delete(async(req, res) => {
    try{
      var brother = await Brother.findById(req.params.brother_id)
          .populate('elder')
      await Elder.update({ _id: brother.elder }, { $set: { deleted: true }})
      brother.elder = undefined;
      await brother.save();
      res.json({ success: true, message: 'Elder deleted!' });
    }catch(e){
      console.error('Elder delete error:', e);
      return res.status(500).send({success:false, error:500, message:"Elder delete error", errorCode: e})
    }

  });



module.exports = router;






