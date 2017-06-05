/*
 * mo_line.js
 * handles user group related messages
*/
var express = require('express');
var router = express.Router();
var moLineDb = require('../lib/mo_line'); // to access mysql db
var midCheck = require('./common').midChkApiKey;

router.get('/', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    moLineDb.get(function (err, lines) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(lines);
        }
    }, test);
});

router.post('/', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var moLine = req.body;
    moLineDb.post(moLine, function (err, lines) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(lines);
        }
    }, test);
});

router.get('/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    moLineDb.getById(id, function (err, lines) {
        if (err) return res.status(500).send(err.message);
        if (lines.length == 0) return res.status(404).send('Work order line not found');
        res.json(lines);
    }, test);
});

router.get('/mo/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    moLineDb.getByMoId(id, function (err, lines) {
        if (err) return res.status(500).send(err.message);
        res.json(lines);
    }, test);
});

router.get('/mo/worker/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    woLineDb.getByMoIdWorker(id, function (err, lines) {
        if (err) return res.status(500).send(err.message);
        res.json(lines);
    }, test);
});

router.put('/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var woLine = req.body;
    moLineDb.put(moLine, function (err, group) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(group);
        }
    }, test);
});

router.delete('/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var moLine = req.body;
    if (!moLine.id) {
        return res.status(400).send('Work order line with id in body needed');
    }
    moLineDb.delete(moLine, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;