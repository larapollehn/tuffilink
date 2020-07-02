const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("Hello world GET");
});

router.post('/', function(req, res, next) {
  res.send("Hello world POST");
});

export default router;
