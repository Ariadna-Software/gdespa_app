/*
 * holiday.js
 * handles holiday group related messages
*/
var express = require('express');
var router = express.Router();
var holidayDb = require('../lib/holiday');
var auth = require('../lib/authorize');
var common = require('./common');

router.get('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var name = req.query.name;
    if (name) {
        holidayDb.getByName(name, function (err, holidays) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(holidays);
            }
        }, test);
    } else {
        holidayDb.get(function (err, holidays) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(holidays);
            }
        }, test);
    }
});

router.post('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var holiday = req.body;
    holidayDb.post(holiday, function (err, holidays) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(holidays);
        }
    }, test);
});

router.get('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    holidayDb.getById(id, function (err, holidays) {
        if (err) return res.status(500).send(err.message);
        if (holidays.length == 0) return res.status(404).send('Holiday not found');
        res.json(holidays);
    }, test);
});

router.put('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var holiday = req.body;
    holidayDb.put(holiday, function (err, holiday) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(holiday);
        }
    }, test);
});

router.delete('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var holiday = req.body;
    if (!holiday.id) {
        res.status(400).send('Holiday with id needed in body');
    }
    holidayDb.delete(holiday, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;