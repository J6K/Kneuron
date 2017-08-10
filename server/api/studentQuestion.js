const db = require('../db/models');
const router = require('express').Router();

const postStudentQuestion = async (req, res) => {
  try {
    const studentQuestion = await db.StudentQuestion.create(req.body);
    console.log('Student Question created');
    res.status(200).send(studentQuestion);
  } catch (error) {
    console.log('Error in postStudentQuestion');
    res.status(500).send(error);
  }
};

const deleteStudentQuestion = async (req, res) => {
  try {
    const studentQuestion = await db.StudentQuestion.findOne({ where: { id: req.params.SQ_id } });
    if (studentQuestion) {
      studentQuestion.destroy({ force: true });
      console.log('StudentQuestion deleted');
      res.status(200).send('StudentQuestion deleted');
    } else {
      console.log('StudentQuestion not found');
      res.status(404).send('StudentQuestion not found');
    }
  } catch (error) {
    console.log('Error in deleteStudentQuestion');
    res.status(500).send(error);
  }
};

router.post('/', postStudentQuestion);
router.delete('/:SQ_id', deleteStudentQuestion);

module.exports = router;
