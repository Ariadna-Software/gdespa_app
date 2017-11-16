/*
 * work_type.js
 * handles workType group related messages
*/
var express = require('express');
var router = express.Router();
var pwbi1Db = require('../lib/pwbi1');
var common = require('./common');

router.get('/pws', function (req, res) {
    pwbi1Db.getPws((err, regs) => {
        if (err) return res.status(500).send(err.message);
        res.json(regs);
    });
});

router.get('/zones', function (req, res) {
    pwbi1Db.getZones((err, regs) => {
        if (err) return res.status(500).send(err.message);
        res.json(regs);
    });
});

router.get('/status', function (req, res) {
    pwbi1Db.getStatus((err, regs) => {
        if (err) return res.status(500).send(err.message);
        res.json(regs);
    });
});

router.get('/workers', function (req, res) {
    pwbi1Db.getWorkers((err, regs) => {
        if (err) return res.status(500).send(err.message);
        res.json(regs);
    });
});

router.get('/docspw', function (req, res) {
    pwbi1Db.getDocsPw((err, regs) => {
        if (err) return res.status(500).send(err.message);
        res.json(regs);
    });
});

router.get('/doctypes', function (req, res) {
    pwbi1Db.getDocsTypes((err, regs) => {
        if (err) return res.status(500).send(err.message);
        res.json(regs);
    });
});

module.exports = router;