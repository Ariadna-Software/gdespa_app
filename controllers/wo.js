/*
 * wo.js
 * handles wo group related messages
*/
var express = require('express');
var router = express.Router();
var woDb = require('../lib/wo');
var auth = require('../lib/authorize');
var common = require('./common');

router.get('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var name = req.query.name;
    if (name) {
        woDb.getByName(name, function (err, wos) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(wos);
            }
        }, test);
    } else {
        woDb.get(function (err, wos) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(wos);
            }
        }, test);
    }
});

router.get('/all/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var name = req.query.name;
    if (name) {
        woDb.getByNameAll(name, function (err, wos) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(wos);
            }
        }, test);
    } else {
        woDb.getAll(function (err, wos) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(wos);
            }
        }, test);
    }
});

router.post('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var wo = req.body;
    woDb.post(wo, function (err, wos) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(wos);
        }
    }, test);
});

router.post('/generated/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var wo = req.body;
    woDb.postGenerated(wo, function (err, wos) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(wos);
        }
    }, test);
});

router.get('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    woDb.getById(id, function (err, wos) {
        if (err) return res.status(500).send(err.message);
        if (wos.length == 0) return res.status(404).send('Work order not found');
        res.json(wos);
    }, test);
});

router.get('/closure/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    woDb.getByClosureId(id, function (err, wos) {
        if (err) return res.status(500).send(err.message);
        res.json(wos);
    }, test);
});
router.put('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var wo = req.body;
    woDb.put(wo, function (err, wo) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(wo);
        }
    }, test);
});

router.delete('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var wo = req.body;
    if (!wo.id) {
        res.status(400).send('Work order with id needed in body');
    }
    woDb.delete(wo, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;