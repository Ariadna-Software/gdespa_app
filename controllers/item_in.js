/*
 * item_in.js
 * handles item_in related messages
*/
var express = require('express');
var router = express.Router();
var itemInDb = require('../lib/item_in');
var auth = require('../lib/authorize');
var common = require('./common');

router.get('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var name = req.query.name;
    if (name) {
        itemInDb.getByName(name, function (err, item_ins) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(item_ins);
            }
        }, test);
    } else {
        itemInDb.get(function (err, item_ins) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(item_ins);
            }
        }, test);
    }
});

router.post('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var item_in = req.body;
    itemInDb.post(item_in, function (err, item_ins) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(item_ins);
        }
    }, test);
});

router.get('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    itemInDb.getById(id, function (err, item_ins) {
        if (err) return res.status(500).send(err.message);
        if (item_ins.length == 0) return res.status(404).send('Item in not found');
        res.json(item_ins);
    }, test);
});

router.put('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var item_in = req.body;
    itemInDb.put(item_in, function (err, item_in) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(item_in);
        }
    }, test);
});

router.delete('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var item_in = req.body;
    if (!item_in.id) {
        res.status(400).send('Item in with id needed in body');
    }
    itemInDb.delete(item_in, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;