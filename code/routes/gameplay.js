var express = require('express');
// var table = require('../lib/tabledecks');
var router = express.Router();

/* GET home page. */
router.get('/page', function(req, res) {
  res.render('gameplay.ajax.jade', { title: 'Welcome',pagename:'gameplay' });
});

module.exports = router;
