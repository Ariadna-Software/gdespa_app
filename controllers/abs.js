/*
 * abs.js
 * handles abs group related messages
*/
var express = require('express');
var router = express.Router();
var absDb = require('../lib/abs');
var auth = require('../lib/authorize');
var common = require('./common');

router.get('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var name = req.query.name;
    if (name) {
        absDb.getByName(name, function (err, abss) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(abss);
            }
        }, test);
    } else {
        absDb.get(function (err, abss) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(abss);
            }
        }, test);
    }
});

router.post('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var abs = req.body;
    absDb.post(abs, function (err, abss) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(abss);
        }
    }, test);
});

router.get('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    absDb.getById(id, function (err, abss) {
        if (err) return res.status(500).send(err.message);
        if (abss.length == 0) return res.status(404).send('Holiday not found');
        res.json(abss);
    }, test);
});

router.put('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var abs = req.body;
    absDb.put(abs, function (err, abs) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(abs);
        }
    }, test);
});

router.delete('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var abs = req.body;
    if (!abs.id) {
        res.status(400).send('Holiday with id needed in body');
    }
    absDb.delete(abs, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;