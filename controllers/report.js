/*
 * report.js
 * handles report related messages
*/
var express = require('express');
var router = express.Router();
var reportDb = require('../lib/report');
var auth = require('../lib/authorize');
var common = require('./common');

router.get('/delivery/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    reportDb.getDeliveryById(id, function (err, reports) {
        if (err) return res.status(500).send(err.message);
        res.json(reports);
    }, test);
});

router.get('/inventory/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    reportDb.getInventoryById(id, function (err, reports) {
        if (err) return res.status(500).send(err.message);
        res.json(reports);
    }, test);
});

router.get('/pwR1/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    reportDb.getPwR1ById(id, function (err, reports) {
        if (err) return res.status(500).send(err.message);
        res.json(reports);
    }, test);
});


module.exports = router;