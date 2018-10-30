var express = require('express');
var router = express.Router();
var Student = require('./models/student');
var History = require('./models/history');
var Brother = require('./models/brother');

router.route('/')
  .get(function(req, res) {
    Brother
      .find({congregation:req.decoded._doc.congregation._id, student: {$exists: true, $ne: null}})
      .sort([['surname', 'ascending']])
      .populate({
        path:     'student',
        model: 'Student',
        populate: [{
          path:  'studyNumber',
          model: 'StudyNumber'
        },{
          path:  'bibleReadingStudyNumber',
          model: 'StudyNumber'
        },{
          path:  'bibleReadingPendingStudyNumber',
          model: 'StudyNumber'
        },{
          path:  'pendingStudyNumber',
          model: 'StudyNumber'
        },{
          path:  'lesson',
          model: 'Lesson'
        },{
          path:  'bibleReadingLesson',
          model: 'Lesson'
        },{
          path:  'bibleReadingPendingLesson',
          model: 'Lesson'
        },{
          path:  'pendingLesson',
          model: 'Lesson'
        }]
      })
      .or([
        { 'student.deleted': {$exists:false} },
        { 'student.deleted':{$exists:true, $ne:true} }
      ])
      // .populate({
      //   path:  'student.bibleReadingStudyNumber',
      //   model: 'StudyNumber'
      // })
      // .populate('student.bibleReadingStudyNumber')
      // .populate('student.pendingStudyNumber')
      // .populate('student.bibleReadingPendingStudyNumber')
      .exec(function(err, students) {
          if (err){
              console.error('Get students error:', err);
              return res.send(err);
          }

        res.json(students);
      });
  });

// router.route('/copy')
//   .get(function(req, res) {
//     const cursor = Student.find({ }).cursor();
//     next(cursor.next);
//
//     function next(promise) {
//       promise.then(function(student){
//         if (student) {
//           var callback3 = function(){
//             next(cursor.next());
//           }
//           var callback2 = function(brother, newStudent){
//             brother.student = newStudent;
//             brother.save(function(err){
//               callback3();
//               console.log("completed:"+ newStudent.name + " " + newStudent.surname);
//             })
//           }
//           var callback = function(brother, student){
//
//             brother.student = new Student();
//             brother.student.lastDate = student.lastDate;
//             brother.student.lastPrevDate = student.lastPrevDate;
//
//             brother.student.primarySchoolEnabled = student.primarySchoolEnabled;
//             brother.student.secondarySchoolEnabled = student.secondarySchoolEnabled;
//             brother.student.thirdSchoolEnabled = student.thirdSchoolEnabled;
//
//             brother.student.bibleReadingEnabled = student.bibleReadingEnabled;
//             brother.student.bibleReadingPrevDate = student.bibleReadingPrevDate;
//             brother.student.bibleReadingDate = student.bibleReadingDate;
//
//             brother.student.initialCallEnabled = student.initialCallEnabled;
//             brother.student.initialCallPrevDate = student.initialCallPrevDate;
//             brother.student.initialCallDate = student.initialCallDate;
//
//             brother.student.returnVisitEnabled = student.returnVisitEnabled;
//             brother.student.returnVisitPrevDate = student.returnVisitPrevDate;
//             brother.student.returnVisitDate = student.returnVisitDate;
//
//             brother.student.bibleStudyEnabled = student.bibleStudyEnabled;
//             brother.student.bibleStudyPrevDate = student.bibleStudyPrevDate;
//             brother.student.bibleStudyDate = student.bibleStudyDate;
//
//             brother.student.talkEnabled = student.talkEnabled;
//             // talkPrevDate: Date,
//             // talkDate: Date,
//
//             brother.student.assistantEnabled = student.assistantEnabled;
//             brother.student.assistantDate = student.assistantDate;
//
//             brother.student.bibleReadingStudyNumber = student.bibleReadingStudyNumber;
//             brother.student.bibleReadingPendingStudyNumber = student.bibleReadingPendingStudyNumber;
//
//             brother.student.studyNumber = student.studyNumber;
//             brother.student.pendingStudyNumber = student.pendingStudyNumber;
//             brother.student.save(function(err, newStudent){
//               callback2(brother, newStudent)
//             })
//
//           }
//           // students.forEach(function(student){
//           console.log(student["name"] + " " + student["surname"]);
//           if(student.name && student.surname){
//             var brother = new Brother();
//             console.log(student.name + " " + student.surname);
//             brother.name = student.name;
//             brother.surname = student.surname;
//             brother.gender = student.gender;
//             brother.save(function(err, brother){
//               callback(brother, student)
//             })
//           }
//
//
//
//         }
//       })
//     }
//
//   });
//

router.route('/:brother_id')

  .post(function(req, res) {

    var student = new Student();

    student = Object.assign(student, req.body);

    student.save(function(err, student) {
      if (err)
        res.send(err);

      Brother.findById(req.params.brother_id, function(err, brother) {
          if (err){
              console.error('Sudent create error:', err);
              return res.send(err);
          }
        brother.student = student;
        brother.save(function(err, student) {
            if (err){
                console.error('Sudent create error:', err);
                return res.send(err);
            }
          res.json({ message: 'Student updated!' , student: student});
        });

      });
    });

  })
  .put(function(req, res) {
    Brother.findOne({'_id': req.params.brother_id})
      .populate({
        path:     'student',
        model: 'Student',
        populate: [{
          path:  'studyNumber',
          model: 'StudyNumber'
        },{
          path:  'bibleReadingStudyNumber',
          model: 'StudyNumber'
        },{
          path:  'bibleReadingPendingStudyNumber',
          model: 'StudyNumber'
        },{
          path:  'pendingStudyNumber',
          model: 'StudyNumber'
        },{
          path:  'lesson',
          model: 'Lesson'
        },{
          path:  'bibleReadingLesson',
          model: 'Lesson'
        },{
          path:  'bibleReadingPendingLesson',
          model: 'Lesson'
        },{
          path:  'pendingLesson',
          model: 'Lesson'
        }]
      })
      .exec(function(err, brother) {
          if (err){
              console.error('Sudent update error:', err);
              return res.send(err);
          }

        brother.student = Object.assign(brother.student, req.body);

        brother.student.save(function(err) {
            if (err){
                console.error('Sudent update error:', err);
                return res.send(err);
            }

          res.json({ message: 'Student updated!' });
        });
      });
  })
  .delete(function(req, res) {
    Brother.findOne({'_id': req.params.brother_id}).exec(function(err, brother) {
      if (err){
          console.error('Sudent delete error:', err);
        return res.send(err);
      }
      Student.update({ _id: brother.student }, { $set: { deleted: true }},function(err) {
        brother.student = undefined;
        brother.save(function(err) {
            if (err){
                console.error('Sudent delete error:', err);
                return res.send(err);
            }
          res.json({ message: 'Student deleted' });
        });
      });
    });
  });



module.exports = router;






