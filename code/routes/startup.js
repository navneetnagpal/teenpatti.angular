var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('startup', {  });
});
router.get('/page', function(req, res) {
  res.render('startup.ajax', {  });
});
module.exports = router;
