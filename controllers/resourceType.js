/*
 * resourceType.js
 * handles user group related messages
*/
var express = require('express');
var router = express.Router();
var resourceTypeDb = require('../lib/resourceType'); // to access mysql db
var midCheck = require('./common').midChkApiKey;

router.get('/', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    resourceTypeDb.get(function (err, groups) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(groups);
        }
    }, test);
});

router.post('/', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var resourceType = req.body;
    resourceTypeDb.post(resourceType, function (err, groups) {
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
    resourceTypeDb.getById(id, function (err, groups) {
        if (err) return res.status(500).send(err.message);
        if (groups.length == 0) return res.status(404).send('Store not found');
        res.json(groups);
    }, test);
});

router.get('/newline/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    resourceTypeDb.getNewLineNumber(id, function (err, lines) {
        if (err) return res.status(500).send(err.message);
        res.json(lines);
    }, test);
});

router.get('/resourceTypesByPwId/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    resourceTypeDb.getResourceTypesByPwId(id, function (err, lines) {
        if (err) return res.status(500).send(err.message);
        res.json(lines);
    }, test);
});

router.put('/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var resourceType = req.body;
    resourceTypeDb.put(resourceType, function (err, group) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(group);
        }
    }, test);
});

router.delete('/:resourceTypeId', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var resourceTypeId = req.params.resourceTypeId;
    if (!resourceTypeId) {
        return res.status(400).send('ResourceType ID needed');
    }
    resourceTypeDb.delete(resourceTypeId, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;