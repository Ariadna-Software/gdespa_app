/*
 * mea_type.js
 * handles meaType group related messages
*/
var express = require('express');
var router = express.Router();
var meaTypeDb = require('../lib/mea_type');
var auth = require('../lib/authorize');
var common = require('./common');

router.get('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var name = req.query.name;
    if (name) {
        meaTypeDb.getByName(name, function (err, meaTypes) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(meaTypes);
            }
        }, test);
    } else {
        meaTypeDb.get(function (err, meaTypes) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(meaTypes);
            }
        }, test);
    }
});

router.post('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var meaType = req.body;
    meaTypeDb.post(meaType, function (err, meaTypes) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(meaTypes);
        }
    }, test);
});

router.get('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    meaTypeDb.getById(id, function (err, meaTypes) {
        if (err) return res.status(500).send(err.message);
        if (meaTypes.length == 0) return res.status(404).send('Mea type not found');
        res.json(meaTypes);
    }, test);
});

router.put('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var meaType = req.body;
    meaTypeDb.put(meaType, function (err, meaType) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(meaType);
        }
    }, test);
});

router.delete('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var meaType = req.body;
    if (!meaType.id) {
        res.status(400).send('Mea type with id needed in body');
    }
    meaTypeDb.delete(meaType, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;