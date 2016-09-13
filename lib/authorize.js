var mysql = require('mysql'),
    moment = require('moment'),
    user = require('./user'),
    dbCon = require('./db_connection');

var authorizeAPI = {
    login: function (login, password, done, test) {
        var response = {
            user: null,
            api_key: null
        };
        dbCon.getConnection(function (err, con) {
            if (err) return done(err);
            // search for the user with that login / password
            var sql = "SELECT * from user WHERE login = ? AND password = ?";
            sql = mysql.format(sql, [login, password]);
            con.query(sql, function (err, res) {
                if (err) return done(err);
                if (res.length == 0) {
                    return done(null, response);
                }
                var userId = res[0].userId;
                // now get all user information
                user.getById(userId, function (err, res) {
                    if (err) return done(err);
                    response.user = res[0];
                    // create an api_key
                    response.api_key = fnRandomKey();
                    // eventually a new record is create in api_key table
                    var api_key_record = {
                        apiKeyId: 0,
                        userId: response.user.id,
                        getDateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                        expireDateTime: moment(new Date()).add(5, 'h').format('YYYY-MM-DD HH:mm:ss'),
                        apiKey: response.api_key
                    }
                    sql = mysql.format("INSERT INTO api_key SET ?", api_key_record);
                    con.query(sql, function (err, res) {
                        dbCon.closeConnection(con);
                        if (err) return done(err);
                        done(null, response);
                    });
                }, test);
            });
        }, test);
    },
    checkApiKey: function (key, done, test) {
        dbCon.getConnection(function (err, con) {
            if (err) return done(err);
            var cTime = moment(new Date).format('YYYY-MM-DD HH:mm:ss');
            var sql = "SELECT * FROM api_key WHERE apiKey = ? AND expireDateTime > ?";
            sql = mysql.format(sql, [key, cTime]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                if (res.length == 0) {
                    return done(null, false);
                } else {
                    return done(null, true);
                }
            })
        }, test);
    }
};

// -- Auxilary functions
// fnRandomKey
// It returns a random string 5 charactes long
var fnRandomKey = function () {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

module.exports = authorizeAPI;

