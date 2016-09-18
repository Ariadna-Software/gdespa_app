/*
 * item_stock.js
 * handles item_stock group related messages
*/
var express = require('express');
var router = express.Router();
var itemStockDb = require('../lib/item_stock');
var auth = require('../lib/authorize');
var common = require('./common');

router.get('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var name = req.query.name;
    if (name) {
        itemStockDb.getByName(name, function (err, item_stocks) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(item_stocks);
            }
        }, test);
    } else {
        itemStockDb.get(function (err, item_stocks) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(item_stocks);
            }
        }, test);
    }
});

router.post('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var item_stock = req.body;
    itemStockDb.post(item_stock, function (err, item_stocks) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(item_stocks);
        }
    }, test);
});

router.get('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    itemStockDb.getById(id, function (err, item_stocks) {
        if (err) return res.status(500).send(err.message);
        if (item_stocks.length == 0) return res.status(404).send('Item store not found');
        res.json(item_stocks);
    }, test);
});

router.put('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var item_stock = req.body;
    itemStockDb.put(item_stock, function (err, item_stock) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(item_stock);
        }
    }, test);
});

router.delete('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var item_stock = req.body;
    if (!item_stock.id) {
        res.status(400).send('Item store with id needed in body');
    }
    itemStockDb.delete(item_stock, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;