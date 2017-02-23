/*
 * wo_worker.js
 * handles user group related messages
*/
var express = require('express');
var router = express.Router();
var woWorkerDb = require('../lib/wo_worker'); // to access mysql db
var midCheck = require('./common').midChkApiKey;

router.get('/', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    woWorkerDb.get(function (err, lines) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(lines);
        }
    }, test);
});

router.post('/', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var woWorker = req.body;
    woWorkerDb.post(woWorker, function (err, lines) {
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
    woWorkerDb.getById(id, function (err, lines) {
        if (err) return res.status(500).send(err.message);
        if (lines.length == 0) return res.status(404).send('Worker line not found');
        res.json(lines);
    }, test);
});

router.get('/wo/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    woWorkerDb.getByWoId(id, function (err, lines) {
        if (err) return res.status(500).send(err.message);
        res.json(lines);
    }, test);
});

router.get('/wo/worker/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    woWorkerDb.getByWoIdWorker(id, function (err, lines) {
        if (err) return res.status(500).send(err.message);
        res.json(lines);
    }, test);
});

router.get('/wo/vehicle/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    woWorkerDb.getByWoIdVehicle(id, function (err, lines) {
        if (err) return res.status(500).send(err.message);
        res.json(lines);
    }, test);
});


router.put('/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var woWorker = req.body;
    woWorkerDb.put(woWorker, function (err, lines) {
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
    var woWorker = req.body;
    if (!woWorker.id) {
        return res.status(400).send('Worker line with id in body needed');
    }
    woWorkerDb.delete(woWorker, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;