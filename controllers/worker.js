/*
 * user.js
 * handles user group related messages
*/
var express = require('express');
var router = express.Router();
var workerDb = require('../lib/worker');
var auth = require('../lib/authorize');
var common = require('./common');

router.get('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var name = req.query.name;
    if (name) {
        workerDb.getByName(name, function (err, users) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(users);
            }
        }, test);
    } else {
        workerDb.get(function (err, users) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(users);
            }
        }, test);
    }
});

router.get('/worker', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    workerDb.getWorker(function (err, workers) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(workers);
        }
    }, test);
});


router.get('/hours', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var fromDate = req.query.fromDate;
    var toDate = req.query.toDate;
    var workerId = req.query.workerId;
    workerDb.getHours(fromDate, toDate, workerId, function (err, workers) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(workers);
        }
    }, test);
});

router.get('/hoursxls', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var fromDate = req.query.fromDate;
    var toDate = req.query.toDate;
    var workerId = req.query.workerId;
    workerDb.getHours(fromDate, toDate, workerId, function (err, workers) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            workerDb.getHoursXls(fromDate, toDate, workers, function(err, file){
                if (err) return res.status(500).send(err.message);
                res.json(file);
            })
            
        }
    }, test);
});


router.get('/vehicle', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    workerDb.getVehicle(function (err, vehicles) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(vehicles);
        }
    }, test);
});

router.post('/', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var user = req.body;
    workerDb.post(user, function (err, users) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(users);
        }
    }, test);
});

router.get('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    workerDb.getById(id, function (err, users) {
        if (err) return res.status(500).send(err.message);
        if (users.length == 0) return res.status(404).send('User not found');
        res.json(users);
    }, test);
});

router.put('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var user = req.body;
    workerDb.put(user, function (err, user) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(user);
        }
    }, test);
});

router.delete('/:id', common.midChkApiKey, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var user = req.body;
    if (!user.id) {
        res.status(400).send('User with id needed in body');
    }
    workerDb.delete(user, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

router.get('/login', function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var login = req.query.login,
        password = req.query.password;
    if (!(login && password)) {
        return res.status(400).send('A login and password needed');
    }
    auth.login(login, password, function (err, res) {
        if (err)
            return res.status(500).send(err.message);
        if (!(res.user || res.api_key))
            return res.status(401).send('Login / password incorrect');
        res.json(res);
    }, test);
});

module.exports = router;