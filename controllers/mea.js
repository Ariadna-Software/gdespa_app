/*
 * mea.js
 * handles mea group related messages
*/
var express = require('express');
var router = express.Router();
var meaDb = require('../lib/mea');
var auth = require('../lib/authorize');
var common = require('./common');

router.get('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var name = req.query.name;
    if (name) {
        meaDb.getByName(name, function (err, meas) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(meas);
            }
        }, test);
    } else {
        meaDb.get(function (err, meas) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(meas);
            }
        }, test);
    }
});

router.get('/contadores/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    meaDb.getContadores(function (err, meas) {
        if (err) return res.status(500).send(err.message);
        if (meas.length == 0) return res.status(404).send('Measurer not found');
        res.json(meas);
    }, test);
});

router.get('/luminarias/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    meaDb.getLuminarias(function (err, meas) {
        if (err) return res.status(500).send(err.message);
        if (meas.length == 0) return res.status(404).send('Measurer not found');
        res.json(meas);
    }, test);
});

router.post('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var mea = req.body;
    meaDb.post(mea, function (err, meas) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(meas);
        }
    }, test);
});

router.get('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    meaDb.getById(id, function (err, meas) {
        if (err) return res.status(500).send(err.message);
        if (meas.length == 0) return res.status(404).send('Measurer not found');
        res.json(meas);
    }, test);
});

router.put('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var mea = req.body;
    meaDb.put(mea, function (err, mea) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(mea);
        }
    }, test);
});

router.delete('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var mea = req.body;
    if (!mea.id) {
        res.status(400).send('Measurer with id needed in body');
    }
    meaDb.delete(mea, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;