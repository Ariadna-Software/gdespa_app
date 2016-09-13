/*
 * login.js
 * handles user group related messages
*/
var express = require('express');
var router = express.Router();
var userDb = require('../lib/user');
var auth = require('../lib/authorize');
var common = require('./common');

router.get('/', function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var login = req.query.login;
    var password = req.query.password;
    if (!(login && password)) {
        return res.status(400).send('A login and password needed');
    }
    auth.login(login, password, function (err, result) {
        if (err)
            return res.status(500).send(err.message);
        if (!(result.user || result.api_key))
            return res.status(401).send('Login / password incorrect');
        res.json(result);
    }, test);
});

module.exports = router;