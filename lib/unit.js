/*
 * =================================================
 * unit.js
 * All functions related to user group management in
 * database MYSQL
 * ==================================================
*/
var mysql = require('mysql'),
    dbCon = require('./db_connection');

var unitAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT * FROM unit";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnCompanyDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT * FROM unit WHERE unitId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnCompanyDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    post: function (unit, done, test) {
        // obtain db record
        var gdb = fnCompanyJsToDb(unit);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO unit SET ?";
            sql = mysql.format(sql, gdb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                unit.unitId = res.insertId;
                done(null, fnCompanyDbToJs(unit));
            });
        }, test);
    },
    put: function (unit, done, test) {
        var gdb = fnCompanyJsToDb(unit);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE unit SET ? WHERE unitId = ?";
            sql = mysql.format(sql, [gdb, gdb.unitId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, fnCompanyDbToJs(unit));
            });
        }, test);
    },
    delete: function (unit, done, test) {
        var gdb = fnCompanyJsToDb(unit);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM unit WHERE unitId = ?";
            sql = mysql.format(sql, gdb.unitId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    }
};

// fnCompanyDbToJs:
// transfors a db record into a js object
var fnCompanyDbToJs = function (gdb) {
    var g = {
        id: gdb.unitId,
        name: gdb.name,
        abb: gdb.abb
    }
    return g;
}

// fnCompanyJsToDb
// transforms a js object into a db record
var fnCompanyJsToDb = function (g) {
    // add db id
    g.unitId = g.id;
    // delete some properties
    delete g.id;
    return g;
}


module.exports = unitAPI;