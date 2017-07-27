/*
 * ins_type.js
 * handles insType group related messages
*/
var express = require('express');
var router = express.Router();
var insTypeDb = require('../lib/ins_type');
var auth = require('../lib/authorize');
var common = require('./common');

router.get('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var name = req.query.name;
    if (name) {
        insTypeDb.getByName(name, function (err, insTypes) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(insTypes);
            }
        }, test);
    } else {
        insTypeDb.get(function (err, insTypes) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(insTypes);
            }
        }, test);
    }
});

router.post('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var insType = req.body;
    insTypeDb.post(insType, function (err, insTypes) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(insTypes);
        }
    }, test);
});

router.get('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    insTypeDb.getById(id, function (err, insTypes) {
        if (err) return res.status(500).send(err.message);
        if (insTypes.length == 0) return res.status(404).send('Installation type not found');
        res.json(insTypes);
    }, test);
});

router.put('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var insType = req.body;
    insTypeDb.put(insType, function (err, insType) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(insType);
        }
    }, test);
});

router.delete('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var insType = req.body;
    if (!insType.id) {
        res.status(400).send('Installation type with id needed in body');
    }
    insTypeDb.delete(insType, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;