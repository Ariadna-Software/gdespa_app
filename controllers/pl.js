/*
 * pl.js
 * handles pl group related messages
*/
var express = require('express');
var router = express.Router();
var plDb = require('../lib/pl');
var auth = require('../lib/authorize');
var common = require('./common');

router.get('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var name = req.query.name;
    if (name) {
        plDb.getByName(name, function (err, pls) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(pls);
            }
        }, test);
    } else {
        plDb.get(function (err, pls) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(pls);
            }
        }, test);
    }
});

router.get('/all/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var name = req.query.name;
    if (name) {
        plDb.getByNameAll(name, function (err, pls) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(pls);
            }
        }, test);
    } else {
        plDb.getAll(function (err, pls) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(pls);
            }
        }, test);
    }
});

router.post('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var pl = req.body;
    plDb.postGeneratedWorker(pl, function (err, pls) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(pls);
        }
    }, test);
});

router.post('/generated/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var pl = req.body;
    plDb.postGenerated(pl, function (err, pls) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(pls);
        }
    }, test);
});

router.post('/create-wo/:plId', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var plId = req.params.plId;
    plDb.postCreateWoFromPl(plId, function (err, pls) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(pls);
        }
    }, test);
});

router.get('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    plDb.getById(id, function (err, pls) {
        if (err) return res.status(500).send(err.message);
        if (pls.length == 0) return res.status(404).send('Planned order not found');
        res.json(pls);
    }, test);
});

router.get('/total-quantity/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    plDb.getByTotalQuantityId(id, function (err, pls) {
        if (err) return res.status(500).send(err.message);
        res.json(pls);
    }, test);
});


router.get('/closure/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    plDb.getByClosureId(id, function (err, pls) {
        if (err) return res.status(500).send(err.message);
        res.json(pls);
    }, test);
});

router.get('/closure2/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    plDb.getByClosureId2(id, function (err, pls) {
        if (err) return res.status(500).send(err.message);
        res.json(pls);
    }, test);
});

router.put('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var pl = req.body;
    plDb.put(pl, function (err, pl) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(pl);
        }
    }, test);
});

router.delete('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var pl = req.body;
    if (!pl.id) {
        res.status(400).send('Planned order with id needed in body');
    }
    plDb.delete(pl, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;