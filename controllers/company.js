/*
 * company.js
 * handles user group related messages
*/
var express = require('express');
var router = express.Router();
var companyDb = require('../lib/company'); // to access mysql db
var midCheck = require('./common').midChkApiKey;

router.get('/', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    companyDb.get(function (err, groups) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(groups);
        }
    }, test);
});

router.post('/', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var company = req.body;
    companyDb.post(company, function (err, groups) {
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
    companyDb.getById(id, function (err, groups) {
        if (err) return res.status(500).send(err.message);
        if (groups.length == 0) return res.status(404).send('Company not found');
        res.json(groups);
    }, test);
});

router.put('/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var company = req.body;
    companyDb.put(company, function (err, group) {
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
    var company = req.body;
    if (!company.id) {
        return res.status(400).send('Company with id in body needed');
    }
    companyDb.delete(company, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;