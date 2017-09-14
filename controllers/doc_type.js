/*
 * doc_type.js
 * handles docType group related messages
*/
var express = require('express');
var router = express.Router();
var docTypeDb = require('../lib/doc_type');
var auth = require('../lib/authorize');
var common = require('./common');

router.get('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var name = req.query.name;
    if (name) {
        docTypeDb.getByName(name, function (err, docTypes) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(docTypes);
            }
        }, test);
    } else {
        docTypeDb.get(function (err, docTypes) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(docTypes);
            }
        }, test);
    }
});

router.post('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var docType = req.body;
    docTypeDb.post(docType, function (err, docTypes) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(docTypes);
        }
    }, test);
});

router.get('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    docTypeDb.getById(id, function (err, docTypes) {
        if (err) return res.status(500).send(err.message);
        if (docTypes.length == 0) return res.status(404).send('Area type not found');
        res.json(docTypes);
    }, test);
});

router.put('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var docType = req.body;
    docTypeDb.put(docType, function (err, docType) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(docType);
        }
    }, test);
});

router.delete('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var docType = req.body;
    if (!docType.id) {
        res.status(400).send('Area type with id needed in body');
    }
    docTypeDb.delete(docType, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;