var express = require('express');
var consts = require('../lib/consts');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: consts.title, serverUrl: consts.serverUrl, clientId: consts.clientId });
});

module.exports = router;
