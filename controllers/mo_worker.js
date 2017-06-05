/*
 * mo_worker.js
 * handles user group related messages
*/
var express = require('express');
var router = express.Router();
var moWorkerDb = require('../lib/mo_worker'); // to access mysql db
var midCheck = require('./common').midChkApiKey;

router.get('/', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    moWorkerDb.get(function (err, lines) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(lines);
        }
    }, test);
});

router.post('/', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var moWorker = req.body;
    moWorkerDb.post(moWorker, function (err, lines) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(lines);
        }
    }, test);
});

router.get('/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    moWorkerDb.getById(id, function (err, lines) {
        if (err) return res.status(500).send(err.message);
        if (lines.length == 0) return res.status(404).send('Worker line not found');
        res.json(lines);
    }, test);
});

router.get('/mo/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    moWorkerDb.getByMoId(id, function (err, lines) {
        if (err) return res.status(500).send(err.message);
        res.json(lines);
    }, test);
});

router.get('/mo/worker/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    moWorkerDb.getByMoIdWorker(id, function (err, lines) {
        if (err) return res.status(500).send(err.message);
        res.json(lines);
    }, test);
});

router.get('/mo/vehicle/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    moWorkerDb.getByMoIdVehicle(id, function (err, lines) {
        if (err) return res.status(500).send(err.message);
        res.json(lines);
    }, test);
});


router.put('/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var moWorker = req.body;
    moWorkerDb.put(moWorker, function (err, lines) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(lines);
        }
    }, test);
});

router.delete('/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var moWorker = req.body;
    if (!moWorker.id) {
        return res.status(400).send('Worker line with id in body needed');
    }
    moWorkerDb.delete(moWorker, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;