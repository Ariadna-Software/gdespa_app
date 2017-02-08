/*
 * =================================================
 * store.js
 * All functions related to user group management in
 * database MYSQL
 * ==================================================
*/
var mysql = require('mysql'),
    dbCon = require('./db_connection');

var storeAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT * FROM store";
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
            var sql = "SELECT * FROM store WHERE storeId = ?";
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
    post: function (store, done, test) {
        // obtain db record
        var gdb = fnCompanyJsToDb(store);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO store SET ?";
            sql = mysql.format(sql, gdb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                store.storeId = res.insertId;
                done(null, fnCompanyDbToJs(store));
            });
        }, test);
    },
    put: function (store, done, test) {
        var gdb = fnCompanyJsToDb(store);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE store SET ? WHERE storeId = ?";
            sql = mysql.format(sql, [gdb, gdb.storeId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, fnCompanyDbToJs(store));
            });
        }, test);
    },
    delete: function (store, done, test) {
        var gdb = fnCompanyJsToDb(store);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM store WHERE storeId = ?";
            sql = mysql.format(sql, gdb.storeId);
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
        id: gdb.storeId,
        name: gdb.name,
        zoneId: gdb.zoneId
    }
    return g;
}

// fnCompanyJsToDb
// transforms a js object into a db record
var fnCompanyJsToDb = function (g) {
    // add db id
    g.storeId = g.id;
    // delete some properties
    delete g.id;
    return g;
}


module.exports = storeAPI;