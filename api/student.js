var express = require('express');
var router = express.Router();
var Student = require('./models/student');
var History = require('./models/history');
var Brother = require('./models/brother');

/**
 * API FOR ALL STUDENTS OF A CONGREGATION
 */
router.route('/')
  .get(async(req, res) => {
    try{
      var students = await Brother
        .find({congregation:req.decoded._doc.congregation._id, student: {$exists: true, $ne: null}})
        .sort([['surname', 'ascending']])
        .populate('student')
        .or([
          { 'student.deleted': {$exists:false} },
          { 'student.deleted':{$exists:true, $ne:true} }
        ])
      res.json(students);
    }catch(e){
      console.error('Get students error:', e);
      return res.status(500).send({success:false, error:500, message:"Get students error", errorCode: e})
    }
  });

/**
 * API FOR A SPECIFIC STUDENT
 */
router.route('/:brother_id')
  .post(async(req, res) => {
    var student = new Student();
    student = Object.assign(student, req.body);
    try{
      await student.save()
      var brother = await Brother.findById(req.params.brother_id)
      brother.student = student;
      await brother.save()
      res.json({ success: true, message: 'Student created!' , brother: brother});
    }catch(e){
      console.error('Create student error:', e);
      return res.status(500).send({success:false, error:500, message:"Create student error", errorCode: e})
    }
  })
  .put(async(req, res) => {
    try{
      var brother = await Brother.findById(req.params.brother_id)
        .populate('student')
      brother.student = Object.assign(brother.student, req.body);
      await brother.student.save()
      res.json({ success:true, message: 'Student updated!' });
    }catch(e){
      console.error('Update student error:', e);
      return res.status(500).send({success:false, error:500, message:"Update student error", errorCode: e})
    }
  })
  .delete(async(req, res) => {
    try{
      var brother = await Brother.findById(req.params.brother_id)
          .populate('student')
      await Student.update({ _id: brother.student }, { $set: { deleted: true }})
      brother.student = undefined;
      await brother.save();
      res.json({ success: true, message: 'Student deleted!' });
    }catch(e){
      console.error('Student delete error:', e);
      return res.status(500).send({success:false, error:500, message:"Student delete error", errorCode: e})
    }
  });




module.exports = router;






