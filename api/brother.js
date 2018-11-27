var express = require('express');
var router = express.Router();
var Brother = require('./models/brother');
var Student = require('./models/student');
var Prayer = require('./models/prayer');
var Elder = require('./models/elder');
var Servant = require('./models/servant');
var History = require('./models/history');
var Reader = require('./models/reader');

router.route('/')
  .get(async (req, res) => {

    try{
    var brothers = await Brother
      .find({congregation:req.decoded._doc.congregation._id})
      .or([
        { 'deleted':{$exists:false} },
        { 'deleted':{$exists:true, $ne:true }}
      ])
      .sort([['surname', 'ascending']])
      .populate('servant')
      .populate('elder')
      .populate('student')
      .populate('prayer')
      .populate('reader')
      res.json(brothers);
    }catch(e){
      console.error('Brothers get error:', e);
      return res.status(500).send({success:false, error:500, message:"Borthers not found", errorCode: e})
    }
  })
  .post(async (req, res) => {

    var brother = new Brother();
    brother = Object.assign(brother, req.body);
    brother.congregation = req.decoded._doc.congregation;
    try{
      await brother.save();
      res.json({ success:true, message: 'Brother created!' , brother:brother});
    }catch(e){
      console.error('Brother create error:', e);
      return res.status(500).send({success:false, error:500, message:"Brother not created", errorCode: e})
    }

  });

router.route('/:brother_id')

  .get(async (req, res) => {
    try{
      var brother = await Brother.findById(req.params.brother_id)
      res.json(brother);
    }catch(e){
      console.error('Brother find error:', e);
      return res.status(500).send({success:false, error:500, message:"Brother not found", errorCode: e})
    }
  })
  .put(async (req, res) => {
    try{
      var brother = await Brother.findById(req.params.brother_id)
    }catch(e){
      console.error('Brother update error:', e);
      return res.status(500).send({success:false, error:500, message:"Brother not found", errorCode: e})
    }
    brother = Object.assign(brother, req.body);

    try{
      await brother.save();
      res.json({ success:true, message: 'Brother updated!' });
    }catch(e){
      console.error('Brother update error:', e);
      return res.status(500).send({success:false, error:500, message:"Brother not updated", errorCode: e})
    }

  })
  .delete(async (req, res) => {
    try{
      var brother = await Brother.findById(req.params.brother_id)
    }catch(e){
      console.error('Brother delete error:', e);
      return res.status(500).send({success:false, error:500, message:"Brother not found", errorCode: e})
    }

    brother.deleted = true;
    if(brother.student){
      Student.update({ _id: brother.student }, { $set: { deleted: true }}, function(){console.log("Student deleted")});
    }
    if(brother.elder){
      Elder.update({ _id: brother.elder }, { $set: { deleted: true }}, function(){console.log("Elder deleted")});
    }
    if(brother.servant){
      Servant.update({ _id: brother.servant }, { $set: { deleted: true }}, function(){console.log("Servant deleted")});
    }
    if(brother.reader){
      Reader.update({ _id: brother.reader }, { $set: { deleted: true }}, function(){console.log("Reader deleted")});
    }
    if(brother.prayer){
      Prayer.update({ _id: brother.prayer }, { $set: { deleted: true }}, function(){console.log("Prayer deleted")});
    }
    try{
      await brother.save();
    }catch(e){
      console.error('Brother delete error:', e);
      return res.status(500).send({success:false, error:500, message:"Brother not deleted", errorCode: e})
    }

    res.json({success:true, message: 'Successfully deleted' });

  });

module.exports = router;






