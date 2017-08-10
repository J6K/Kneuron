const router = require('express').Router();
const db = require('../db/models');

const postQuiz = async (req, res) => {
  try {
    const quiz = await db.Quiz.create(req.body);
    console.log('Quiz created!');
    res.status(200).send(quiz);
  } catch (error) {
    console.log('Error in postQuiz ', error);
    res.status(500).send(error);
  }
};

const updateQuiz = async (req, res) => {
  try {
    const quiz = await db.Quiz.findOne({ where: { id: req.params.quiz_id } });
    if (quiz) {
      const updatedQuiz = await quiz.update(req.body);
      console.log('Quiz updated!');
      res.status(200).send(updatedQuiz);
    } else {
      console.log('Quiz does not exist');
      res.status(404).send('Quiz does not exist');
    }
  } catch (error) {
    console.log('Error in updateQuiz ', error);
    res.status(500).send(error);
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const quiz = await db.Quiz.findOne({ where: { id: req.params.quiz_id } });
    if (quiz) {
      const deletedQuiz = await quiz.destroy({ force: true });
      console.log('Quiz deleted');
      res.status(200).send(deletedQuiz);
    } else {
      console.log('Quiz does not exist');
      res.status(404).send('Quiz does not exist');
    }
  } catch (error) {
    console.log('Error in deleteQuiz ', error);
    res.status(500).send(error);
  }
};

router.post('/', postQuiz);
router.put('/:quiz_id', updateQuiz);
router.delete('/:quiz_id', deleteQuiz);

module.exports = router;
