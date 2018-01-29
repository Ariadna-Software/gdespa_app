/*
 * abs_type.js
 * handles absType group related messages
*/
var express = require('express');
var router = express.Router();
var absTypeDb = require('../lib/abs_type');
var auth = require('../lib/authorize');
var common = require('./common');

router.get('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var name = req.query.name;
    if (name) {
        absTypeDb.getByName(name, function (err, absTypes) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(absTypes);
            }
        }, test);
    } else {
        absTypeDb.get(function (err, absTypes) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(absTypes);
            }
        }, test);
    }
});

router.post('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var absType = req.body;
    absTypeDb.post(absType, function (err, absTypes) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(absTypes);
        }
    }, test);
});

router.get('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    absTypeDb.getById(id, function (err, absTypes) {
        if (err) return res.status(500).send(err.message);
        if (absTypes.length == 0) return res.status(404).send('Area type not found');
        res.json(absTypes);
    }, test);
});

router.put('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var absType = req.body;
    absTypeDb.put(absType, function (err, absType) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(absType);
        }
    }, test);
});

router.delete('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var absType = req.body;
    if (!absType.id) {
        res.status(400).send('Area type with id needed in body');
    }
    absTypeDb.delete(absType, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;