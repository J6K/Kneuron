const router = require('express').Router();
const db = require('../db/models');

router.post('/', (req, res, next) => {
  db.Cohort.findOne({ where: { code: req.body.code } })
    .then((data) => {
      db.StudentCohort.create({ cohort_id: data.id, student_id: req.body.student_id });
    })
    .catch(next);
});

module.exports = router;