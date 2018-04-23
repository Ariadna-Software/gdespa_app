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

router.get('/chapters', function (req, res) {
    pwbi1Db.getChapters((err, regs) => {
        if (err) return res.status(500).send(err.message);
        res.json(regs);
    });
});

router.get('/pwlines', function (req, res) {
    pwbi1Db.getPwLines((err, regs) => {
        if (err) return res.status(500).send(err.message);
        res.json(regs);
    });
});

router.get('/cunits', function (req, res) {
    pwbi1Db.getCUnits((err, regs) => {
        if (err) return res.status(500).send(err.message);
        res.json(regs);
    });
});

router.get('/cunitlines', function (req, res) {
    pwbi1Db.getCunitLines((err, regs) => {
        if (err) return res.status(500).send(err.message);
        res.json(regs);
    });
});

router.get('/items', function (req, res) {
    pwbi1Db.getItems((err, regs) => {
        if (err) return res.status(500).send(err.message);
        res.json(regs);
    });
});

router.get('/wos', function (req, res) {
    pwbi1Db.getWos((err, regs) => {
        if (err) return res.status(500).send(err.message);
        res.json(regs);
    });
});

router.get('/teams', function (req, res) {
    pwbi1Db.getTeams((err, regs) => {
        if (err) return res.status(500).send(err.message);
        res.json(regs);
    });
});

router.get('/wolines', function (req, res) {
    pwbi1Db.getWoLines((err, regs) => {
        if (err) return res.status(500).send(err.message);
        res.json(regs);
    });
});

router.get('/invoices', function (req, res) {
    pwbi1Db.getInvoices((err, regs) => {
        if (err) return res.status(500).send(err.message);
        res.json(regs);
    });
});

router.get('/workedhours', function (req, res) {
    pwbi1Db.getWorkedHours((err, regs) => {
        if (err) return res.status(500).send(err.message);
        res.json(regs);
    });
});

router.get('/teamlines', function (req, res) {
    pwbi1Db.getTeamLines((err, regs) => {
        if (err) return res.status(500).send(err.message);
        res.json(regs);
    });
});

router.get('/lumhours', function (req, res) {
    pwbi1Db.getLumHours((err, regs) => {
        if (err) return res.status(500).send(err.message);
        res.json(regs);
    });
});

router.get('/contahours', function (req, res) {
    pwbi1Db.getContaHours((err, regs) => {
        if (err) return res.status(500).send(err.message);
        res.json(regs);
    });
});

router.get('/woitems', function (req, res) {
    pwbi1Db.getWoItems((err, regs) => {
        if (err) return res.status(500).send(err.message);
        res.json(regs);
    });
});

router.get('/pwitems', function (req, res) {
    pwbi1Db.getPwItems((err, regs) => {
        if (err) return res.status(500).send(err.message);
        res.json(regs);
    });
});

router.get('/pl', function (req, res) {
    pwbi1Db.getPl((err, regs) => {
        if (err) return res.status(500).send(err.message);
        res.json(regs);
    });
});

router.get('/pllines', function (req, res) {
    pwbi1Db.getPlLines((err, regs) => {
        if (err) return res.status(500).send(err.message);
        res.json(regs);
    });
});


router.get('/outitems', function (req, res) {
    pwbi1Db.getOutItems((err, regs) => {
        if (err) return res.status(500).send(err.message);
        res.json(regs);
    });
});
module.exports = router;