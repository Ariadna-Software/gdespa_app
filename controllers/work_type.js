/*
 * work_type.js
 * handles workType group related messages
*/
var express = require('express');
var router = express.Router();
var workTypeDb = require('../lib/work_type');
var auth = require('../lib/authorize');
var common = require('./common');

router.get('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var name = req.query.name;
    if (name) {
        workTypeDb.getByName(name, function (err, workTypes) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(workTypes);
            }
        }, test);
    } else {
        workTypeDb.get(function (err, workTypes) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(workTypes);
            }
        }, test);
    }
});

router.post('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var workType = req.body;
    workTypeDb.post(workType, function (err, workTypes) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(workTypes);
        }
    }, test);
});

router.get('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    workTypeDb.getById(id, function (err, workTypes) {
        if (err) return res.status(500).send(err.message);
        if (workTypes.length == 0) return res.status(404).send('Work type not found');
        res.json(workTypes);
    }, test);
});

router.put('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var workType = req.body;
    workTypeDb.put(workType, function (err, workType) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(workType);
        }
    }, test);
});

router.delete('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var workType = req.body;
    if (!workType.id) {
        res.status(400).send('Work type with id needed in body');
    }
    workTypeDb.delete(workType, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;