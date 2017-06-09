/*
 * day_type.js
 * handles dayType group related messages
*/
var express = require('express');
var router = express.Router();
var dayTypeDb = require('../lib/day_type');
var auth = require('../lib/authorize');
var common = require('./common');

router.get('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var name = req.query.name;
    if (name) {
        dayTypeDb.getByName(name, function (err, dayTypes) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(dayTypes);
            }
        }, test);
    } else {
        dayTypeDb.get(function (err, dayTypes) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(dayTypes);
            }
        }, test);
    }
});

router.post('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var dayType = req.body;
    dayTypeDb.post(dayType, function (err, dayTypes) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(dayTypes);
        }
    }, test);
});

router.get('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    dayTypeDb.getById(id, function (err, dayTypes) {
        if (err) return res.status(500).send(err.message);
        if (dayTypes.length == 0) return res.status(404).send('Day type not found');
        res.json(dayTypes);
    }, test);
});

router.put('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var dayType = req.body;
    dayTypeDb.put(dayType, function (err, dayType) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(dayType);
        }
    }, test);
});

router.delete('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var dayType = req.body;
    if (!dayType.id) {
        res.status(400).send('Day type with id needed in body');
    }
    dayTypeDb.delete(dayType, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;