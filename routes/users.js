var express = require('express');
var router = express.Router();
var http = require('http');
var url = require('url');

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('success!');
});

module.exports = router;
