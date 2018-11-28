var express = require('express');
var router = express.Router();
var Prayer = require('./models/prayer');
var Brother = require('./models/brother');

/**
 * API FOR ALL PRAYERS
 */
router.route('/')
  .get(async (req, res) => {
    try{
      var prayers = await Brother
        .find({congregation:req.decoded._doc.congregation._id, prayer: {$exists: true, $ne: null}})
        .sort([['surname', 'ascending']])
        .populate('prayer')
        .or([
          { 'prayer.deleted': {$exists:false} },
          { 'prayer.deleted':{$exists:true, $ne:true} }
        ])
      res.json(prayers);
    }catch(e){
      console.error('Get prayers error:', e);
      return res.status(500).send({success:false, error:500, message:"Get prayers error", errorCode: e.toString()})
    }
  });

/**
 * API FOR A SPECIFIC PRAYER
 */
router.route('/:brother_id')
  .post(async(req, res) => {
    var prayer = new Prayer();
    prayer = Object.assign(prayer, req.body);
    try{
      await prayer.save()
      var brother = await Brother.findById(req.params.brother_id)
      brother.prayer = prayer;
      await brother.save()
      res.json({ success: true, message: 'Prayer created!' , brother: brother});
    }catch(e){
      console.error('Get prayer error:', e);
      return res.status(500).send({success:false, error:500, message:"Get prayer error", errorCode: e.toString()})
    }
  })
  .put(async(req, res) => {
    try{
      var brother = await Brother.findById(req.params.brother_id)
        .populate('prayer')
      brother.prayer = Object.assign(brother.prayer, req.body);
      await brother.prayer.save()
      res.json({ success:true, message: 'Prayer updated!' });
    }catch(e){
      console.error('Update prayer error:', e);
      return res.status(500).send({success:false, error:500, message:"Update prayer error", errorCode: e.toString()})
    }
  })
  .delete(async(req, res) => {
    try{
      var brother = await Brother.findById(req.params.brother_id)
          .populate('prayer')
      await Prayer.update({ _id: brother.prayer }, { $set: { deleted: true }})
      brother.prayer = undefined;
      await brother.save();
      res.json({ success: true, message: 'Prayer deleted!' });
    }catch(e){
      console.error('Prayer delete error:', e);
      return res.status(500).send({success:false, error:500, message:"Prayer delete error", errorCode: e.toString()})
    }
  });



module.exports = router;






