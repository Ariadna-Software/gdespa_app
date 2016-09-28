/*
 * inventory.js
 * handles inventory group related messages
*/
var express = require('express');
var router = express.Router();
var inventoryDb = require('../lib/inventory');
var auth = require('../lib/authorize');
var common = require('./common');

router.get('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var name = req.query.name;
    if (name) {
        inventoryDb.getByName(name, function (err, inventorys) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(inventorys);
            }
        }, test);
    } else {
        inventoryDb.get(function (err, inventorys) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(inventorys);
            }
        }, test);
    }
});

router.post('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var inventory = req.body;
    inventoryDb.post(inventory, function (err, inventorys) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(inventorys);
        }
    }, test);
});

router.get('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    inventoryDb.getById(id, function (err, inventorys) {
        if (err) return res.status(500).send(err.message);
        if (inventorys.length == 0) return res.status(404).send('Work order not found');
        res.json(inventorys);
    }, test);
});

router.put('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var inventory = req.body;
    inventoryDb.put(inventory, function (err, inventory) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(inventory);
        }
    }, test);
});

router.put('/close/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var inventory = req.body;
    inventoryDb.putClose(inventory, function (err, inventory) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(inventory);
        }
    }, test);
});

router.delete('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var inventory = req.body;
    if (!inventory.id) {
        res.status(400).send('Work order with id needed in body');
    }
    inventoryDb.delete(inventory, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;