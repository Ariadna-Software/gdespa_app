/*
 * item_out_line.js
 * handles user group related messages
*/
var express = require('express');
var router = express.Router();
var itemOutLineDb = require('../lib/item_out_line'); // to access mysql db
var midCheck = require('./common').midChkApiKey;

router.get('/', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    itemOutLineDb.get(function (err, lines) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(lines);
        }
    }, test);
});

router.post('/', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var woLine = req.body;
    itemOutLineDb.post(woLine, function (err, lines) {
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
    itemOutLineDb.getById(id, function (err, lines) {
        if (err) return res.status(500).send(err.message);
        if (lines.length == 0) return res.status(404).send('Item in line not found');
        res.json(lines);
    }, test);
});

router.get('/itemOut/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    itemOutLineDb.getByItemOutId(id, function (err, lines) {
        if (err) return res.status(500).send(err.message);
        res.json(lines);
    }, test);
});

router.put('/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var woLine = req.body;
    itemOutLineDb.put(woLine, function (err, group) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(group);
        }
    }, test);
});

router.delete('/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var woLine = req.body;
    if (!woLine.id) {
        return res.status(400).send('Item in line with id in body needed');
    }
    itemOutLineDb.delete(woLine, function (err) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;