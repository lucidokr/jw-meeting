var express = require('express');
var router = express.Router();
var Congregation = require('./models/congregation');

/**
 * API FOR ALL CONGREGATIONS
 */
router.route('/')
  .get(async(req, res) => {
    try{
      var congregations = await Congregation.find({})
      res.json(congregations);
    }catch(e){
      console.error('Get congregations error:', e);
      return res.status(500).send({success:false, error:500, message:"Get congregations error", errorCode: e})
    }
  });

/**
 * API FOR A SPECIFIC CONGREGATION
 */
router.route('/:congregation_id')
  .post(async(req, res) => {
    var congregation = new Congregation();
    congregation = Object.assign(congregation, req.body);
    try{
      await congregation.save()
      res.json({ success: true, message: 'Congregation created!' , congregation: congregation});
    }catch(e){
      console.error('Create congregation error:', e);
      return res.status(500).send({success:false, error:500, message:"Create congregation error", errorCode: e})
    }
  })
  .put(async(req, res) => {
    try{
      var congregation = await Congregation.findById(req.params.congregation_id)
      congregation = Object.assign(congregation, req.body);
      await congregation.save()
      res.json({ success:true, message: 'Congregation updated!' });
    }catch(e){
      console.error('Update Congregation error:', e);
      return res.status(500).send({success:false, error:500, message:"Update Congregation error", errorCode: e.toString()})
    }
  })
  .delete(async(req, res) => {
    try{
      var congregation = await Congregation.findById(req.params.congregation_id)
      await congregation.deleteOne({'_id': req.params.congregation_id})
      res.json({ success: true, message: 'Congregation deleted!' });
    }catch(e){
      console.error('Congregation delete error:', e);
      return res.status(500).send({success:false, error:500, message:"Congregation delete error", errorCode: e})
    }
  });




module.exports = router;






