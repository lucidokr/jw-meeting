var express = require('express');
var router = express.Router();
var Reader = require('./models/reader');
var Brother = require('./models/brother');

/**
 * API FOR ALL READERS OF A CONGREGATION
 */
router.route('/')
  .get(async(req, res) => {
    try{
      var readers = await Brother
        .find({congregation:req.decoded._doc.congregation._id, reader: {$exists: true, $ne: null}})
        .sort([['surname', 'ascending']])
        .populate('reader')
        .or([
          { 'reader.deleted': {$exists:false} },
          { 'reader.deleted':{$exists:true, $ne:true} }
        ])
      res.json(readers);
    }catch(e){
      console.error('Get readers error:', e);
      return res.status(500).send({success:false, error:500, message:"Get readers error", errorCode: e})
    }
  });

/**
 * API FOR A SPECIFIC READER
 */
router.route('/:brother_id')
  .post(async(req, res) => {
    var reader = new Reader();
    reader = Object.assign(reader, req.body);
    try{
      await reader.save()
      var brother = await Brother.findById(req.params.brother_id)
      brother.reader = reader;
      await brother.save()
      res.json({ success: true, message: 'Reader created!' , brother: brother});
    }catch(e){
      console.error('Get reader error:', e);
      return res.status(500).send({success:false, error:500, message:"Get reader error", errorCode: e})
    }
  })
  .put(async(req, res) => {
    try{
      var brother = await Brother.findById(req.params.brother_id)
        .populate('reader')
      brother.reader = Object.assign(brother.reader, req.body);
      await brother.reader.save()
      res.json({ success:true, message: 'Reader updated!' });
    }catch(e){
      console.error('Update reader error:', e);
      return res.status(500).send({success:false, error:500, message:"Update reader error", errorCode: e})
    }
  })
  .delete(async(req, res) => {
    try{
      var brother = await Brother.findById(req.params.brother_id)
          .populate('reader')
      await Reader.update({ _id: brother.reader }, { $set: { deleted: true }})
      brother.reader = undefined;
      await brother.save();
      res.json({ success: true, message: 'Reader deleted!' });
    }catch(e){
      console.error('Reader delete error:', e);
      return res.status(500).send({success:false, error:500, message:"Reader delete error", errorCode: e})
    }
  });

module.exports = router;






