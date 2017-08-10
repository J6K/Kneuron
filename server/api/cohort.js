const router = require('express').Router();
const db = require('../db/models');
const faker = require('faker');
// const redis = require('../db/redis');
const util = require('./util');

// Controller
// Get All Cohorts For a Given Teacher with Async
const fetchCohorts = async (req, res) => {
  try {
    const teacher = await db.User.findOne({ where: { email: util.antiHasher(req.params.auth_token) } });
    // const teacher = await db.User.findOne({ where: { email: req.params.email } });
    if (teacher.userType === 0) {
      const teacherCohorts = await db.Cohort.findAll({ where: { teacher_id: teacher.id } });
      res.status(200).send(teacherCohorts);
    }
  } catch (error) {
    console.log('Error in fetchCohorts', error);
    res.status(500).send(error);
  }
};

const postCohort = async (req, res) => {
  try {
    const email = util.antiHasher(req.body.auth_token);
    const teacher = await db.User.findOne({ where: { email } });
    if (teacher.userType === 0) {
      const teacherCohort = await db.Cohort.findOne({
        where: {
          teacher_id: teacher.id,
          subject: req.body.subject.toUpperCase(),
        },
      });
      if (teacherCohort) {
        res.status(204).send(`${teacher.fName} ${teacher.lName} already has a ${teacherCohort.subject} cohort`);
      } else {
        const school = await db.School.findOne({ where: { code: req.body.schoolCode } });
        if (school) {
          req.body['teacher_id'] = teacher.id;
          req.body['time'] = req.body.time.toUpperCase();
          req.body['subject'] = req.body.subject.toUpperCase();
          req.body['code'] = `${faker.hacker.adjective()}${faker.hacker.noun()}`;
          req.body['school_id'] = school.id;
          const newCohort = await db.Cohort.create(req.body);
          if (newCohort) {
            res.status(201).send(newCohort);
          } else {
            res.status(404).send('Failed To Create New Cohort');
          }
        } else {
          res.status(500).send('Code does not match any schools code');
        }
      }
    } else {
      res.status(500).send('Not a teacher');
    }
  } catch (error) {
    console.log('Teacher Does Not Exist In The DB...', error);
    res.status(404).send(error);
  }
};

// Update a Cohort For a Given Teacher with Async
const updateCohort = async (req, res) => {
  try {
    const teacher = await db.User.findOne({ where: { email: util.antiHasher(req.body.auth_token) } });
    if (teacher) {
      const cohort = await db.Cohort.findOne({ where: { subject: req.body.ogSubject.toUpperCase(), teacher_id: teacher.id } });
      if (cohort) {
        cohort.subject = req.body.subject.toUpperCase();
        const updatedCohort = await db.Cohort.update({
          subject: cohort.subject,
          time: req.body.time,
        }, { where: { id: cohort.id } });
        if (updatedCohort) {
          res.status(201).send(updatedCohort);
        } else {
          res.status(500).send(`Couldn't update ${teacher.fName} ${teacher.lName}'s ${cohort.subject} cohort`);
        }
      } else {
        res.status(404).send(`${teacher.fName} ${teacher.lName}'s cohort doesn't exist in the DB or Network Error`);
      }
    } else {
      res.status(404).send(`Teacher By The Name Of ${req.body.fName} ${req.body.lName} Does Not Exist In The Db: `);
    }
  } catch (error) {
    console.log('Async Error, Check the logs and Backend: ', error);
    res.status(500).send(error);
  }
};

// Delete a Cohort For a Given Teacher with Async
const deleteCohort = async (req, res) => {
  try {
    const teacher = await db.User.findOne({ where: { email: util.antiHasher(req.params.auth_token) } });
    if (teacher) {
      const cohort = await db.Cohort.findOne({ where: { id: req.params.cohort_id } });
      if (cohort) {
        cohort.destroy({ force: true });
        console.log('Cohort Was Successfully Deleted: ', cohort);
        res.status(201).send(`${cohort} was destroyed from DB`);
      } else {
        console.log('Cohort with teacher_id and cohort_id not found');
        res.status(500).send('Cohort with teacher_id and cohort_id not found');
      }
    }
  } catch (error) {
    console.log('Error Deleting Selected Cohort... Cohort Does Not Exist: ', error);
    res.status(500).send(error);
  }
};
// Controller

router.get('/:auth_token', fetchCohorts);
router.post('/', postCohort);
router.put('/', updateCohort);
router.delete('/:auth_token/:cohort_id', deleteCohort);

module.exports = router;
