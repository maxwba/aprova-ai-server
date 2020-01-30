const express = require('express');

const router = express.Router();
/* GET home page test... */
router.get('/', (req, res) => {
  res.send('Express is running...');
});
module.exports = router;
