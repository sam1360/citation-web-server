const express = require('express');
const citations = require('../../lib/citationGeneration');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Citation web server api');
});

router.post('/', [], citations.generate);
module.exports = router;
