/*
 * item_out.js
 * handles item_out related messages
*/
var express = require('express');
var router = express.Router();
var itemOutDb = require('../lib/item_out');
var auth = require('../lib/authorize');
var common = require('./common');

router.get('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var name = req.query.name;
    if (name) {
        itemOutDb.getByName(name, function (err, item_outs) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(item_outs);
            }
        }, test);
    } else {
        itemOutDb.get(function (err, item_outs) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(item_outs);
            }
        }, test);
    }
});

router.post('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var item_out = req.body;
    itemOutDb.post(item_out, function (err, item_outs) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(item_outs);
        }
    }, test);
});

router.get('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    itemOutDb.getById(id, function (err, item_outs) {
        if (err) return res.status(500).send(err.message);
        if (item_outs.length == 0) return res.status(404).send('Item out not found');
        res.json(item_outs);
    }, test);
});

router.put('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var item_out = req.body;
    itemOutDb.put(item_out, function (err, item_out) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(item_out);
        }
    }, test);
});

router.delete('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var item_out = req.body;
    if (!item_out.id) {
        res.status(400).send('Item out with id needed in body');
    }
    itemOutDb.delete(item_out, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;