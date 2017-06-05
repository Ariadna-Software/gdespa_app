/*
 * mo.js
 * handles mo group related messages
*/
var express = require('express');
var router = express.Router();
var moDb = require('../lib/mo');
var auth = require('../lib/authorize');
var common = require('./common');

router.get('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var name = req.query.name;
    if (name) {
        moDb.getByName(name, function (err, mos) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(mos);
            }
        }, test);
    } else {
        moDb.get(function (err, mos) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(mos);
            }
        }, test);
    }
});

router.get('/all/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var name = req.query.name;
    if (name) {
        moDb.getByNameAll(name, function (err, mos) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(mos);
            }
        }, test);
    } else {
        moDb.getAll(function (err, mos) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(mos);
            }
        }, test);
    }
});

router.post('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var mo = req.body;
    moDb.postGeneratedWorker(mo, function (err, mos) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(mos);
        }
    }, test);
});

router.post('/generated/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var mo = req.body;
    moDb.postGenerated(mo, function (err, mos) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(mos);
        }
    }, test);
});

router.get('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    moDb.getById(id, function (err, mos) {
        if (err) return res.status(500).send(err.message);
        if (mos.length == 0) return res.status(404).send('Work order not found');
        res.json(mos);
    }, test);
});

router.get('/closure/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    moDb.getByClosureId(id, function (err, mos) {
        if (err) return res.status(500).send(err.message);
        res.json(mos);
    }, test);
});

router.get('/closure2/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    moDb.getByClosureId2(id, function (err, mos) {
        if (err) return res.status(500).send(err.message);
        res.json(mos);
    }, test);
});

router.put('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var mo = req.body;
    moDb.put(mo, function (err, mo) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(mo);
        }
    }, test);
});

router.delete('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var mo = req.body;
    if (!mo.id) {
        res.status(400).send('Work order with id needed in body');
    }
    moDb.delete(mo, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;