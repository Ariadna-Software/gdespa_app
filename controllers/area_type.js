/*
 * area_type.js
 * handles areaType group related messages
*/
var express = require('express');
var router = express.Router();
var areaTypeDb = require('../lib/area_type');
var auth = require('../lib/authorize');
var common = require('./common');

router.get('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var name = req.query.name;
    if (name) {
        areaTypeDb.getByName(name, function (err, areaTypes) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(areaTypes);
            }
        }, test);
    } else {
        areaTypeDb.get(function (err, areaTypes) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(areaTypes);
            }
        }, test);
    }
});

router.post('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var areaType = req.body;
    areaTypeDb.post(areaType, function (err, areaTypes) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(areaTypes);
        }
    }, test);
});

router.get('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    areaTypeDb.getById(id, function (err, areaTypes) {
        if (err) return res.status(500).send(err.message);
        if (areaTypes.length == 0) return res.status(404).send('Area type not found');
        res.json(areaTypes);
    }, test);
});

router.put('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var areaType = req.body;
    areaTypeDb.put(areaType, function (err, areaType) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(areaType);
        }
    }, test);
});

router.delete('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var areaType = req.body;
    if (!areaType.id) {
        res.status(400).send('Area type with id needed in body');
    }
    areaTypeDb.delete(areaType, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;