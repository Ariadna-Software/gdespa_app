/*
 * team.js
 * handles team related messages
*/
var express = require('express');
var router = express.Router();
var teamDb = require('../lib/team');
var auth = require('../lib/authorize');
var common = require('./common');

router.get('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var name = req.query.name;
    if (name) {
        teamDb.getByName(name, function (err, teams) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(teams);
            }
        }, test);
    } else {
        teamDb.get(function (err, teams) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(teams);
            }
        }, test);
    }
});

router.post('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var team = req.body;
    teamDb.post(team, function (err, teams) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(teams);
        }
    }, test);
});

router.get('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    teamDb.getById(id, function (err, teams) {
        if (err) return res.status(500).send(err.message);
        if (teams.length == 0) return res.status(404).send('Team in not found');
        res.json(teams);
    }, test);
});

router.get('/zone/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    teamDb.getByZoneId(id, function (err, teams) {
        if (err) return res.status(500).send(err.message);
        if (teams.length == 0) return res.status(404).send('Team in not found');
        res.json(teams);
    }, test);
});

router.put('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var team = req.body;
    teamDb.put(team, function (err, team) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(team);
        }
    }, test);
});

router.delete('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var team = req.body;
    if (!team.id) {
        res.status(400).send('Team with id needed in body');
    }
    teamDb.delete(team, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;