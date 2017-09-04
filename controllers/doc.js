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
    docDb.get(function (err, groups) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(groups);
        }
    }, test);
});

router.post('/', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var doc = req.body;
    docDb.post(doc, function (err, groups) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(groups);
        }
    }, test);
});

router.get('/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    docDb.getById(id, function (err, groups) {
        if (err) return res.status(500).send(err.message);
        if (groups.length == 0) return res.status(404).send('Document not found');
        res.json(groups);
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
    var id = req.params.id;
    var doc = req.body;
    if (!doc.id) {
        return res.status(400).send('Document with id in body needed');
    }
    docDb.delete(doc, function (err) {
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