/*
 * delivery.js
 * handles delivery related messages
*/
var express = require('express');
var router = express.Router();
var deliveryDb = require('../lib/delivery');
var auth = require('../lib/authorize');
var common = require('./common');

router.get('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var name = req.query.name;
    if (name) {
        deliveryDb.getByName(name, function (err, deliverys) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(deliverys);
            }
        }, test);
    } else {
        deliveryDb.get(function (err, deliverys) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(deliverys);
            }
        }, test);
    }
});

router.post('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var delivery = req.body;
    deliveryDb.post(delivery, function (err, deliverys) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(deliverys);
        }
    }, test);
});

router.post('/generated/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var delivery = req.body;
    deliveryDb.postGenerated(delivery, function (err, deliverys) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(deliverys);
        }
    }, test);
});

router.get('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    deliveryDb.getById(id, function (err, deliverys) {
        if (err) return res.status(500).send(err.message);
        if (deliverys.length == 0) return res.status(404).send('Delivery not found');
        res.json(deliverys);
    }, test);
});

router.get('/pw/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    deliveryDb.getByPwId(id, function (err, deliverys) {
        if (err) return res.status(500).send(err.message);
        res.json(deliverys);
    }, test);
});

router.put('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var delivery = req.body;
    deliveryDb.put(delivery, function (err, delivery) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(delivery);
        }
    }, test);
});

router.put('/serve/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var delivery = req.body;
    deliveryDb.putServe(delivery, function (err, delivery) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(delivery);
        }
    }, test);
});

router.delete('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var delivery = req.body;
    if (!delivery.id) {
        res.status(400).send('Delivery with id needed in body');
    }
    deliveryDb.delete(delivery, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;