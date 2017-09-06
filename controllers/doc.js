/*
 * doc.js
 * handles user group related messages
*/
var express = require('express');
var router = express.Router();
var docDb = require('../lib/doc'); // to access mysql db
var midCheck = require('./common').midChkApiKey;


router.get('/', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    docDb.get(function (err, docs) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(docs);
        }
    }, test);
});

router.post('/', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var doc = req.body;
    docDb.post(doc, function (err, docs) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(docs);
        }
    }, test);
});

router.get('/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    docDb.getById(id, function (err, docs) {
        if (err) return res.status(500).send(err.message);
        if (docs.length == 0) return res.status(404).send('Document not found');
        res.json(docs);
    }, test);
});

router.get('/byPwId/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    docDb.getByPwId(id, function (err, docs) {
        if (err) return res.status(500).send(err.message);
        res.json(docs);
    }, test);
});


router.put('/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var doc = req.body;
    docDb.put(doc, function (err, group) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(group);
        }
    }, test);
});

router.delete('/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var file = req.query.file;
    var id = req.params.id;
    if (!id || !file) {
        return res.status(400).send('Document with id and file name needed');
    }
    docDb.delete(id, file, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

router.delete('/uploads/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    if (!id) {
        return res.status(400).send('An id is needed');
    }
    docDb.deleteUploads(id, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;