/*
 * =================================================
 * zone.js
 * All functions related to user group management in
 * database MYSQL
 * ==================================================
*/
var mysql = require('mysql'),
    dbCon = require('./db_connection');

var zoneAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT * FROM zone";
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
            var sql = "SELECT * FROM zone WHERE zoneId = ?";
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
    post: function (zone, done, test) {
        // obtain db record
        var gdb = fnZoneJsToDb(zone);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO zone SET ?";
            sql = mysql.format(sql, gdb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                zone.zoneId = res.insertId;
                done(null, fnZoneDbToJs(zone));
            });
        }, test);
    },
    put: function (zone, done, test) {
        var gdb = fnZoneJsToDb(zone);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE zone SET ? WHERE zoneId = ?";
            sql = mysql.format(sql, [gdb, gdb.zoneId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, fnZoneDbToJs(zone));
            });
        }, test);
    },
    delete: function (zone, done, test) {
        var gdb = fnZoneJsToDb(zone);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM zone WHERE zoneId = ?";
            sql = mysql.format(sql, gdb.zoneId);
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
    var g = {
        id: gdb.zoneId,
        name: gdb.name,
        woK: gdb.woK,
        moK: gdb.moK
    }
    return g;
}

// fnZoneJsToDb
// transforms a js object into a db record
var fnZoneJsToDb = function (g) {
    // add db id
    g.zoneId = g.id;
    // delete some properties
    delete g.id;
    return g;
}


module.exports = zoneAPI;