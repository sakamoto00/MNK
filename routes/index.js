var express = require('express');
var router = express.Router();

/* GET index page. */
router.get('/', function(req, res) {
  res.render('login', { title: 'Monika Stars Team' });
});

module.exports = router;
