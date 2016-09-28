/*
 * closure_line.js
 * handles user group related messages
*/
var express = require('express');
var router = express.Router();
var closureLineDb = require('../lib/closure_line'); // to access mysql db
var midCheck = require('./common').midChkApiKey;

router.get('/', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    closureLineDb.get(function (err, lines) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(lines);
        }
    }, test);
});

router.post('/', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var closureLine = req.body;
    closureLineDb.post(closureLine, function (err, lines) {
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
    closureLineDb.getById(id, function (err, lines) {
        if (err) return res.status(500).send(err.message);
        if (lines.length == 0) return res.status(404).send('Work order line not found');
        res.json(lines);
    }, test);
});

router.get('/closure/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    closureLineDb.getByClosureId(id, function (err, lines) {
        if (err) return res.status(500).send(err.message);
        res.json(lines);
    }, test);
});

router.put('/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var closureLine = req.body;
    closureLineDb.put(closureLine, function (err, group) {
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
    var closureLine = req.body;
    if (!closureLine.id) {
        return res.status(400).send('Work order line with id in body needed');
    }
    closureLineDb.delete(closureLine, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;