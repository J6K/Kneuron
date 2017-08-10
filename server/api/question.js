const router = require('express').Router();
const db = require('../db/models');
const redis = require('../db/redis');

const postQuestion = async (req, res) => {
  try {
    const newQuestion = await db.Question.create(req.body);
    console.log('Question created');
    res.status(200).send(newQuestion);
  } catch (error) {
    console.log('Error in postQuestion');
    res.status(500).send(error);
  }
};

const updateQuestion = async (req, res) => {
  try {
    const question = await db.Question.findOne({ where: { id: req.params.question_id } });
    const updatedQuestion = await question.update(req.body);
    console.log('Question updated!');
    res.status(200).send(updatedQuestion);
  } catch (error) {
    console.log('Error in updateQuestion');
    res.status(500).send(error);
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const question = await db.Question.findOne({ where: { id: req.params.question_id } });
    const deletedQuestion = await question.destroy({ force: true });
    console.log('Question deleted!');
    res.status(200).send(deletedQuestion);
  } catch (error) {
    console.log('Error in deleteQuestion');
    res.status(500).send(error);
  }
};

router.post('/', postQuestion);
router.put('/:question_id', updateQuestion);
router.delete('/:question_id', deleteQuestion);

module.exports = router;
