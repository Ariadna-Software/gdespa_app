/*
 * user_group.js
 * handles user group related messages
*/
var express = require('express');
var router = express.Router();
var userGroupDb = require('../lib/user_group'); // to access mysql db
var midCheck = require('./common').midChkApiKey;

router.get('/', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    userGroupDb.get(function (err, groups) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(groups);
        }
    }, test);
});

router.post('/', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var userGroup = req.body;
    userGroupDb.post(userGroup, function (err, groups) {
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
    userGroupDb.getById(id, function (err, groups) {
        if (err) return res.status(500).send(err.message);
        if (groups.length == 0) return res.status(404).send('User group not found');
        res.json(groups);
    }, test);
});

router.put('/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var userGroup = req.body;
    userGroupDb.put(userGroup, function (err, group) {
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
    var userGroup = req.body;
    if (!userGroup.id) {
        return res.status(400).send('User group with id in body needed');
    }
    userGroupDb.delete(userGroup, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;