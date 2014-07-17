/**
 * Coder: Sean
 * Date: 14-7-14
 * Time: обнГ11:57
 */
var express = require('express');
var router = express.Router();
var http = require('http');
var url = require('url');

router.get('/', function(req, res) {
    res.render('home', { title: 'Home'});
});

module.exports = router;