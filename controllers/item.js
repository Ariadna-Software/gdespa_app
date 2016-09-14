/*
 * item.js
 * handles item group related messages
*/
var express = require('express');
var router = express.Router();
var itemDb = require('../lib/item');
var auth = require('../lib/authorize');
var common = require('./common');

router.get('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var name = req.query.name;
    if (name) {
        itemDb.getByName(name, function (err, items) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(items);
            }
        }, test);
    } else {
        itemDb.get(function (err, items) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(items);
            }
        }, test);
    }
});

router.post('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var item = req.body;
    itemDb.post(item, function (err, items) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(items);
        }
    }, test);
});

router.get('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    itemDb.getById(id, function (err, items) {
        if (err) return res.status(500).send(err.message);
        if (items.length == 0) return res.status(404).send('User not found');
        res.json(items);
    }, test);
});

router.put('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var item = req.body;
    itemDb.put(item, function (err, item) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(item);
        }
    }, test);
});

router.delete('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var item = req.body;
    if (!item.id) {
        res.status(400).send('User with id needed in body');
    }
    itemDb.delete(item, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;