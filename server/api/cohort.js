const router = require('express').Router();
const User = require('../db/models').User;
const Cohort = require('../db/models').Cohort;
const antiHasher = require('./util').antiHasher;
const async = require('asyncawait/async');
const await = require('asyncawait/await');




//Create A New Cohort For A Given Teacher wihtout Async
// router.post('/', (req, res, next) => {
//   User.findOne({where: { email: antiHasher(req.body.auth_token) }})
//     .then(teacher => {
//       console.log("Found Teacher: ", teacher);
//       console.log(antiHasher(req.body.auth_token));

//       Cohort.findOne({where: {teacher_id: teacher.id, subject: req.body.subject }})
//         .then(cohort => {
//           if(cohort){
//             console.log(`${teacher.fName} ${teacher.lName} already has a ${cohort.subject} cohort`, cohort);
//             res.status(204).send(`${teacher.fName} ${teacher.lName} already has a ${cohort.subject} cohort`);
//           } else {
//             console.log("Need to Create Class for teacher: ", antiHasher(req.body.auth_token));
//             Cohort.create({ subject: req.body.subject, teacher_id: teacher.id})
//               .then(newCohort => {
//                 console.log(`${teacher.fName} ${teacher.lName} just added a new ${newClass.subject} cohort to their schedule.`, newCohort);
//                 res.status(201).send(newCohort);
//               })
//               .catch(err => {
//                 console.log(err);
//               })
//           }
//         });
//     })
//     .catch(error => {
//       console.log('Teacher Does Not Exist In The DB...');
//       res.status(404).send();
//     })
// });


//Create a New Cohort with Async
router.post('/', async((req, res, next) => {
  //Find a Teacher by their email and see if they are in the DB or Not...
  const teacher = await(User.findOne({where: { email: antiHasher(req.body.auth_token) }}));
  if(teacher){
    //If Teacher Found the  Find Their Class where subject === req.body.subject and their teacherId: as their id
    console.log("Found Teacher: ", teacher);
    console.log(antiHasher(req.body.auth_token));
    const teacherCohort = await(Cohort.findOne({where: {teacherId: teacher.id, subject: req.body.subject, userId: teacher.id }}));
    if(teacherCohort){
      //If That class found then say class already exists
      console.log(`${teacher.fName} ${teacher.lName} already has a ${teacherCohort.subject} cohort`, teacherCohort);
      res.status(204).send(`${teacher.fName} ${teacher.lName} already has a ${teacherCohort.subject} cohort`);
    } else {
      //Else Create the Cohort
      console.log("Need to Create Cohort for teacher: ", antiHasher(req.body.auth_token));
      const newCohort = await(Cohort.create({ subject: req.body.subject, teacherId: teacher.id, userId: teacher.id}));
      console.log(`${teacher.fName} ${teacher.lName} just added a new ${newCohort.subject} cohort to their schedule.`, newCohort);
      res.status(201).send(newCohort);
    }
  } else {
    //Teacher wasn't found in DB
    console.log('Teacher Does Not Exist In The DB...');
    res.status(404).send();
  }
}));


//Get All Cohorts For A Given Teacher
router.get('/:auth_token', (req, res, next) => {
  User.findOne({where: { email: antiHasher(req.params.auth_token) }})
    .then(teacher => {
      Cohort.findAll({where: { teacherId: teacher.id }})
        .then(cohorts => {
          console.log(`${teacher.fName} ${teacher.lName}'s Cohorts Grabbed: `, cohorts);
          res.status(200).send(cohorts);
        })
        .catch(err => {
          console.log(`Coudn't Get ${teacher.fName}'s Cohorts Because: `, err);
          res.status(404).send();
        })
    })
    .catch(err => {
      console.log("That Teacher Does Not Exist In DB: ", err);
      res.status(404).send();
    })
});


//Delete A Given Cohort From A Teachers List of Cohorts
router.delete('/', (req, res, next) => {
  Cohort.findOne({where: {id: req.body.class_id}})
    .then(cohort => {
      console.log("Cohort Was Successfully Deleted: ", cohort);
      res.status(202).send(`${cohort} was marked for deletion...`);
      cohort.destroy({ force: true });
      res.status(204).send(`${cohort} was destroyed from DB`);
    })
    .catch(err => {
      console.log("Error Deleting Selected Cohort... Cohort Does Not Exist: ", err);
      res.status(404).send("Error Deleting Selected Cohort... Cohort Does Not Exist...");
    })
});


//Update Information Of A Given Cohort From A Given Teacher
router.put('/', (req, res, next) => {
  User.findOne({where: { email: antiHasher(req.body.auth_token) }})
    .then(teacher => {
      Cohort.findOne({where: {id: req.body.class_id, teacherId: teacher.id}})
      .then(cohort => {
        res.status(202).send(`${cohort} was marked for updating...`);
        cohort.subject = req.body.subject;
        Cohort.update({
          subject: cohort.subject
        }, {
          where: { id: cohort.id }
        })
        .then(result => {
          res.status(200).send(result);
        })
        .catch(error => {
          console.log(`Couldn't update ${teacher.fName} ${teacher.lName}'s ${cohort.subject} cohort because: `, error);
          res.status(204).send(`Couldn't update ${teacher.fName} ${teacher.lName}'s ${cohort.subject} cohort because: `, error);
        })
      })
      .catch(err => {
        console.log(`${teacher.fName} ${teacher.lName} doesn't exist in the DB or Network Error: `, err);
        res.status(404).send(`${teacher.fName} ${teacher.lName}'s cohort doesn't exist in the DB or Network Error: `, err)
      })
    })
    .catch(error => {
      console.log(`Teacher By The Name Of ${req.body.fName} ${req.body.lName} Does Not Exist In The Db: `, error);
      res.status(404).send(`Teacher By The Name Of ${req.body.fName} ${req.body.lName} Does Not Exist In The Db: `, error);
    });
});


module.exports = router;