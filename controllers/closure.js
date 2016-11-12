/*
 * closure.js
 * handles closure group related messages
*/
var express = require('express');
var router = express.Router();
var closureDb = require('../lib/closure');
var auth = require('../lib/authorize');
var common = require('./common');

router.get('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var name = req.query.name;
    if (name) {
        closureDb.getByName(name, function (err, closures) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(closures);
            }
        }, test);
    } else {
        closureDb.get(function (err, closures) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(closures);
            }
        }, test);
    }
});

router.get('/report_closures/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    closureDb.getReportClosures(function (err, closures) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(closures);
        }
    }, test);
});

router.post('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var closure = req.body;
    closureDb.post(closure, function (err, closures) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(closures);
        }
    }, test);
});

router.get('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    closureDb.getById(id, function (err, closures) {
        if (err) return res.status(500).send(err.message);
        if (closures.length == 0) return res.status(404).send('Work order not found');
        res.json(closures);
    }, test);
});

router.get('/lastclose/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    closureDb.getLastByPwId(id, function (err, closures) {
        if (err) return res.status(500).send(err.message);
        res.json(closures);
    }, test);
});

router.put('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var closure = req.body;
    closureDb.put(closure, function (err, closure) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(closure);
        }
    }, test);
});

router.put('/close/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var closure = req.body;
    closureDb.putClose(closure, function (err, closure) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(closure);
        }
    }, test);
});

router.delete('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var closure = req.body;
    if (!closure.id) {
        res.status(400).send('Work order with id needed in body');
    }
    closureDb.delete(closure, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;