/*
 * cunit.js
 * handles cunit group related messages
*/
var express = require('express');
var router = express.Router();
var cunitDb = require('../lib/cunit');
var auth = require('../lib/authorize');
var common = require('./common');

router.get('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var block = req.query.perCunitBlock && (req.query.perCunitBlock == 'true');
    var name = req.query.name;
    if (name) {
        cunitDb.getByName(name, function (err, cunits) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(cunits);
            }
        }, test);
    } else {
        cunitDb.get(block, function (err, cunits) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(cunits);
            }
        }, test);
    }
});

router.get('/estdone', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var cunitId = req.query.cunitId;
    var pwId = req.query.pwId;
    if (!cunitId || !pwId) {
        return res.status(400).send("No unit and / or proposal identifiers");
    }
    cunitDb.getEstDone(cunitId, pwId, function (err, cunits) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(cunits);
        }
    }, test);
});

router.post('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var cunit = req.body;
    cunitDb.post(cunit, function (err, cunits) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(cunits);
        }
    }, test);
});

router.get('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    cunitDb.getById(id, function (err, cunits) {
        if (err) return res.status(500).send(err.message);
        if (cunits.length == 0) return res.status(404).send('Construction unit not found');
        res.json(cunits);
    }, test);
});

router.get('/pw/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    cunitDb.getByPw(id, function (err, cunits) {
        if (err) return res.status(500).send(err.message);
        if (cunits.length == 0) return res.status(404).send('Construction unit not found');
        res.json(cunits);
    }, test);
});

router.put('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var cunit = req.body;
    cunitDb.put(cunit, function (err, cunit) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(cunit);
        }
    }, test);
});

router.delete('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var cunit = req.body;
    if (!cunit.id) {
        res.status(400).send('Construction unit with id needed in body');
    }
    cunitDb.delete(cunit, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;