/*
 * status.js
 * handles status group related messages
*/
var express = require('express');
var router = express.Router();
var statusDb = require('../lib/status');
var auth = require('../lib/authorize');
var common = require('./common');

router.get('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    statusDb.get(function (err, statuss) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(statuss);
        }
    }, test);
});

module.exports = router;