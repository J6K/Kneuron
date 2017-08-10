const router = require('express').Router();
const db = require('../db/models');

const fetchStudentCohorts = async (req, res) => {
  try {
    const studentCohorts = await db.Cohort.findAll({
      where: { teacher_id: req.params.teacher_id },
      include: [{
        model: db.StudentCohort,
      }],
    });
    res.status(200).send(studentCohorts);
  } catch (error) {
    res.status(500).send(error);
  }
};

const postStudentCohort = async (req, res) => {
  try {
    const cohort = await db.Cohort.findOne({ where: { code: req.body.code } });
    const studentCohort = await db.StudentCohort.create({
      cohort_id: cohort.id,
      student_id: req.body.student_id,
    });
    console.log('Cohort created!');
    res.status(200).send(studentCohort);
  } catch (error) {
    console.log('Error in postStudentCohort ', error);
    res.status(500).send(error.response);
  }
};

router.get('/:teacher_id', fetchStudentCohorts);
router.post('/', postStudentCohort);

module.exports = router;
