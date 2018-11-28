var express = require('express');
var router = express.Router();
var Congregation = require('./models/congregation');


const modelName = "congregation"
const modelNameCamelCase = "Congregation"

/**
 * API FOR ALL CONGREGATIONS
 */
router.route('/')
  .get(async(req, res) => {
    try{
      var congregations = await Congregation.find({})
      res.json(congregations);
    }catch(e){
      console.error('Get '+modelName+' error:', e);
      return res.status(500).send({success:false, error:500, message:"Get "+modelName+" error", errorCode: e.toString()})
    }
  })
  .post(async(req, res) => {
    var congregation = new Congregation();
    congregation = Object.assign(congregation, req.body);
    try{
      await congregation.save()
      res.json({ success: true, message: modelNameCamelCase+' created!' , congregation: congregation});
    }catch(e){
      console.error('Create '+modelName+' error:', e);
      return res.status(500).send({success:false, error:500, message:"Create "+modelName+" error", errorCode: e.toString()})
    }
  });

/**
 * API FOR A SPECIFIC CONGREGATION
 */
router.route('/:congregation_id')
  .put(async(req, res) => {
    try{
      var congregation = await Congregation.findById(req.params.congregation_id)
      congregation = Object.assign(congregation, req.body);
      await congregation.save()
      res.json({ success:true, message: modelNameCamelCase+' updated!' });
    }catch(e){
      console.error('Update '+modelName+' error:', e);
      return res.status(500).send({success:false, error:500, message:"Update "+modelName+" error", errorCode: e.toString()})
    }
  })
  .delete(async(req, res) => {
    try{
      var congregation = await Congregation.findById(req.params.congregation_id)
      await congregation.deleteOne({'_id': req.params.congregation_id})
      res.json({ success: true, message: modelNameCamelCase+ ' deleted!' });
    }catch(e){
      console.error(modelNameCamelCase + ' delete error:', e);
      return res.status(500).send({success:false, error:500, message: modelNameCamelCase+ " delete error", errorCode: e.toString()})
    }
  });




module.exports = router;






