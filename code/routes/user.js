var express = require('express');
var router = express.Router();
var utils = require('../lib/base/utils');
var DAL = require('../lib/dal');

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('respond with a resource');
});
router.post('/register', function(req, res) {
    var user;
    if (req.body.userName) {
        DAL.db.users.find({
            userName: req.body.userName
        }).toArray(function(err, users) {

            if (!users || users.length === 0) {
                user = {
                    displayName: req.body.userName,
                    userName: req.body.userName,
                    guid: utils.guid(),
                    chips: 2500000
                };
                DAL.db.users.insert(user);

            } else {
                user = users[0];
            }
            res.json({
                'status': 'success',
                data: user
            });
        });
    } else {
        res.json({
            status: 'failed'
        });
    }


});
router.post('/get', function(req, res) {
    var user;
    if (req.body.userName) {
        DAL.db.users.find({
            userName: req.body.userName
        }).toArray(function(err, users) {
            if (!users || users.length === 0) {
                res.json({
                    status: 'failed'
                });
            } else {
                user = users[0];
            }
            res.json({
                'status': 'success',
                data: user
            });
        });
    } else {
        res.json({
            status: 'failed'
        });
    }
});

module.exports = router;