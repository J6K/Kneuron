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

const sendPictureToKairos = async (req, res) => {
  try {
    const kairosResult = await axios.post('https://api.kairos.com/enroll', {
      image: req.body.image,
      subject_id: req.body.subject_id,
      gallery_name: req.body.gallery_name,
    }, config);
    res.status(201).send(kairosResult);
  } catch (error) {
    res.status(error.statusCode).send(error);
  }
};

router.post('/', sendPictureToKairos);

module.exports = router;
