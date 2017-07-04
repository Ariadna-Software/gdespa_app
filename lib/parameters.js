/*
 * =================================================
 * parameters.js
 * All functions related to user group management in
 * database MYSQL
 * ==================================================
*/
var mysql = require('mysql'),
    dbCon = require('./db_connection');

var parametersAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT * FROM parameters";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnZoneDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT * FROM parameters WHERE parameterId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnZoneDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    post: function (parameters, done, test) {
        // obtain db record
        var gdb = fnZoneJsToDb(parameters);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO parameters SET ?";
            sql = mysql.format(sql, gdb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                parameters.parameterId = res.insertId;
                done(null, fnZoneDbToJs(parameters));
            });
        }, test);
    },
    put: function (parameters, done, test) {
        var gdb = fnZoneJsToDb(parameters);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE parameters SET ? WHERE parameterId = ?";
            sql = mysql.format(sql, [gdb, gdb.parameterId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, fnZoneDbToJs(parameters));
            });
        }, test);
    },
    delete: function (parameters, done, test) {
        var gdb = fnZoneJsToDb(parameters);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM parameters WHERE parameterId = ?";
            sql = mysql.format(sql, gdb.parameterId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    }
};

// fnZoneDbToJs:
// transfors a db record into a js object
var fnZoneDbToJs = function (gdb) {
    var g = gdb;
    return g;
}

// fnZoneJsToDb
// transforms a js object into a db record
var fnZoneJsToDb = function (g) {
    // add db id
    return g;
}


module.exports = parametersAPI;