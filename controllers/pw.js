/*
 * pw.js
 * handles pw group related messages
*/
var express = require('express');
var router = express.Router();
var pwDb = require('../lib/pw');
var auth = require('../lib/authorize');
var common = require('./common');

router.get('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var name = req.query.name;
    if (name) {
        pwDb.getByName(name, function (err, pws) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(pws);
            }
        }, test);
    } else {
        pwDb.get(function (err, pws) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(pws);
            }
        }, test);
    }
});

router.get('/report_pw/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    pwDb.getReportPwStatus(function (err, closures) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(closures);
        }
    }, test);
});

router.post('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var pw = req.body;
    pwDb.post(pw, function (err, pws) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(pws);
        }
    }, test);
});

router.get('/active/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    pwDb.getActive(function (err, pws) {
        if (err) return res.status(500).send(err.message);
        res.json(pws);
    }, test);
});

router.get('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    pwDb.getById(id, function (err, pws) {
        if (err) return res.status(500).send(err.message);
        if (pws.length == 0) return res.status(404).send('Project not found');
        res.json(pws);
    }, test);
});

router.get('/recalc/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    pwDb.recalcById(id, function (err, pws) {
        if (err) return res.status(500).send(err.message);
        res.json(pws);
    }, test);
});

router.get('/zone/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    pwDb.getByZoneId(id, function (err, pws) {
        if (err) return res.status(500).send(err.message);
        res.json(pws);
    }, test);
});

router.get('/wo/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    pwDb.getWoByPw(id, function (err, pws) {
        if (err) return res.status(500).send(err.message);
        res.json(pws);
    }, test);
});

router.get('/per/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    pwDb.getPerById(id, function (err, pws) {
        if (err) return res.status(500).send(err.message);
        res.json(pws);
    }, test);
});

router.put('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var pw = req.body;
    pwDb.put(pw, function (err, pw) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(pw);
        }
    }, test);
});

router.put('/updateclosed/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    pwDb.putClosedPw(id, function (err, pw) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(pw);
        }
    }, test);
});


router.delete('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var pw = req.body;
    if (!pw.id) {
        res.status(400).send('Project with id needed in body');
    }
    pwDb.delete(pw, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;