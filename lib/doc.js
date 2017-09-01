/*
 * =================================================
 * doc.js
 * All functions related to document management in
 * database MYSQL
 * ==================================================
*/
var mysql = require('mysql'),
    dbCon = require('./db_connection');

var docAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT d.*, pw.name as pwName FROM doc As d LEFT JOIN pw ON pw.pwId = d.pwId ";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var docs = [];
                res.forEach(function (gdb) {
                    docs.push(fnCompanyDbToJs(gdb));
                });
                done(null, docs);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT d.*, pw.name as pwName FROM doc As d LEFT JOIN pw ON pw.pwId = d.pwId WHERE docId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var docs = [];
                res.forEach(function (gdb) {
                    docs.push(fnCompanyDbToJs(gdb));
                });
                done(null, docs);
            });
        }, test);
    },
    post: function (doc, done, test) {
        // obtain db record
        var gdb = fnCompanyJsToDb(doc);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO doc SET ?";
            sql = mysql.format(sql, gdb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                doc.docId = res.insertId;
                done(null, fnCompanyDbToJs(doc));
            });
        }, test);
    },
    put: function (doc, done, test) {
        var gdb = fnCompanyJsToDb(doc);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE doc SET ? WHERE docId = ?";
            sql = mysql.format(sql, [gdb, gdb.docId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, fnCompanyDbToJs(doc));
            });
        }, test);
    },
    delete: function (doc, done, test) {
        var gdb = fnCompanyJsToDb(doc);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM doc WHERE docId = ?";
            sql = mysql.format(sql, gdb.docId);
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
    var g = gdb;
    return g;
}

// fnCompanyJsToDb
// transforms a js object into a db record
var fnCompanyJsToDb = function (g) {
    return g;
}


module.exports = docAPI;