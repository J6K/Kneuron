const db = require('../db/models');
const router = require('express').Router();

const fetchLectureResults = async (req, res) => {
  try {
    const lectureResults = await db.Lecture.findAll({
      where: { cohort_id: req.params.cohort_id },
      include: [{
        model: db.Result,
        where: { student_id: req.params.student_id },
      }],
    });
    lectureResults ? res.status(200).send(lectureResults) : res.status(404).send('No lecture results found');
  } catch (error) {
    console.log('Error in fetchLectureResults ', error);
    res.status(500).send(error);
  }
};

const postResults = async (req, res) => {
  try {
    const results = db.Result.create(req.body);
    results ? res.status(200).send(results) : res.status(500).send('Error in postResults');
  } catch (error) {
    console.log('Error in postResults ', error);
    res.status(500).send(error);
  }
};

router.get('/lectureResults/:cohort_id/:student_id', fetchLectureResults);
router.post('/', postResults);

module.exports = router;
