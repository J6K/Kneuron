const db = require('../db/models');
const router = require('express').Router();
const redis = require('../db/models');

const postTopic = async (req, res) => {
  try {
    const topic = await db.Topic.findOne({ where: { name: req.body.name } });
    if (topic === null) {
      const newTopic = await db.Topic.create(req.body);
      console.log('Topic created');
      res.status(200).send(newTopic);
    } else {
      console.log('Topic already exists: ', topic);
      res.status(200).send(topic);
    }
  } catch (error) {
    console.log('Error in postTopic');
    res.status(500).send('Error in postTopic');
  }
};

const updateTopic = async (req, res) => {
  try {
    const topic = await db.Topic.findOne({ where: { id: req.params.topic_id } });
    if (topic) {
      const updatedTopic = await topic.update(req.body);
      console.log('Topic updated');
      res.status(200).send(updatedTopic);
    } else {
      console.log('Topic not found');
      res.status(404).send('Topic not found');
    }
  } catch (error) {
    console.log('Error in updateTopic ', error);
    res.status(500).send('Error in updateTopic ');
  }
};

const deleteTopic = async (req, res) => {
  try {
    const topic = await db.Topic.findOne({ where: { id: req.params.topic_id } });
    if (topic) {
      const deletedTopic = await topic.destroy({ force: true });
      console.log('Topic deleted');
      res.status(200).send(deletedTopic);
    } else {
      console.log('Topic not found');
      res.status(404).send('Topic not found');
    }
  } catch (error) {
    console.log('Error in deleteTopic');
    res.status(500).send('Error in deleteTopic');
  }
};

router.post('/', postTopic);
router.put('/:topic_id', updateTopic);
router.delete('/:topic_id', deleteTopic);

module.exports = router;
