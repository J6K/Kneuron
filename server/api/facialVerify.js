const router = require('express').Router();
const axios = require('axios');

const app_id = '59193b0b';
const app_key = '625d66480c5897855db7b295808b465b';
const config = {
  headers: {
    'Content-Type': 'application/json',
    'app_id': app_id,
    'app_key': app_key,
  },
};

const verifyFace = async (req, res) => {
  try {
    const result = await axios.post('https://api.kairos.com/verify', {
      image: req.body.image,
      subject_id: req.body.subject_id,
      gallery_name: req.body.gallery_name,
    }, config);
    result ? res.status(201).send(result) : res.status(404).send('Result not found');
  } catch (error) {
    console.log('Error in facial verify', error);
    res.status(500).send(error);
  }
};

router.post('/', verifyFace);

module.exports = router;