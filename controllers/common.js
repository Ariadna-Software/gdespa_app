/*
 * common.js
 * Common functions for all apis
*/
var authorize = require('../lib/authorize');

var commonApi = {
    chkApiKey: function (apk, done, test) {
        if (!apk) {
            return done(null, false);
        }
        authorize.checkApiKey(apk, function (err, res) {
            if (err) return done(err);
            done(null, res);
        }, test);
    },
    // midChkApiKey: 
    // verifies api_key as a middleware in routes
    midChkApiKey: function (req, res, next) {
        var test = req.query.test && (req.query.test == 'true');
        if (!req.query.api_key) {
            return res.status(401).send('Yo need an api_key to access');
        }
        var apk = req.query.api_key;
        authorize.checkApiKey(apk, function (err, chk) {
            if (err) return res.status(500).send(err.message);
            if (!chk) return res.status(401).send('Your api_key is incorrect or expired. Please, login again');
            next();
        }, test);
    }
};

module.exports = commonApi;
