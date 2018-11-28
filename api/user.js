var express = require('express');
var router = express.Router();
var User = require('./models/user');

const modelName = "users"
const modelNameCamelCase = "Users"
/**
 * API FOR ALL USERS
 */
router.route('/')
  .get(async(req, res) => {
    try{
      var users = await User.find({})
      res.json(users);
    }catch(e){
      console.error("Get "+modelName+" error:", e);
      return res.status(500).send({success:false, error:500, message:"Get "+modelName+" error", errorCode: e.toString()})
    }
  })
  .post(async(req, res) => {
    var user = new User();
    user = Object.assign(user, req.body);
    try{
      await user.save()
      res.json({ success: true, message: modelNameCamelCase+' created!' , user: user});
    }catch(e){
      console.error('Create '+modelName+' error:', e);
      return res.status(500).send({success:false, error:500, message:"Create "+modelName+" error", errorCode: e.toString()})
    }
  });

/**
 * API FOR A SPECIFIC USER
 */
router.route('/:user_id')
  .put(async(req, res) => {
    try{
      var user = await User.findById(req.params.user_id)
      user = Object.assign(user, req.body);
      await user.save()
      res.json({ success:true, message: modelNameCamelCase+' updated!' });
    }catch(e){
      console.error('Update '+modelName+' error:', e);
      return res.status(500).send({success:false, error:500, message:"Update "+modelName+" error", errorCode: e.toString()})
    }
  })
  .delete(async(req, res) => {
    try{
      await User.deleteOne({'_id': req.params.user_id})
      res.json({ success: true, message: modelNameCamelCase+' deleted!' });
    }catch(e){
      console.error(modelName+' delete error:', e);
      return res.status(500).send({success:false, error:500, message: modelName+' delete error', errorCode: e.toString()})
    }
  });




module.exports = router;






