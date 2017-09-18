/*
 * =================================================
 * invoice.js
 * All functions related to user group management in
 * database MYSQL
 * ==================================================
*/
var mysql = require('mysql'),
    util = require('./util'),
    dbCon = require('./db_connection');

var invoiceAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT i.*, pw.name as pwName FROM invoice as i LEFT JOIN pw ON pw.pwId = i.pwId";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnInvoiceDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT i.*, pw.name as pwName FROM invoice as i LEFT JOIN pw ON pw.pwId = i.pwId WHERE i.invoiceId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnInvoiceDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    getByPwId: function (pwId, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT i.*, pw.name as pwName FROM invoice as i LEFT JOIN pw ON pw.pwId = i.pwId WHERE i.pwId = ?";
            sql = mysql.format(sql, pwId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnInvoiceDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    post: function (invoice, done, test) {
        // obtain db record
        var gdb = fnInvoiceJsToDb(invoice);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO invoice SET ?";
            sql = mysql.format(sql, gdb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                invoice.invoiceId = res.insertId;
                done(null, fnInvoiceDbToJs(invoice));
            });
        }, test);
    },
    put: function (invoice, done, test) {
        var gdb = fnInvoiceJsToDb(invoice);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE invoice SET ? WHERE invoiceId = ?";
            sql = mysql.format(sql, [gdb, gdb.invoiceId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, fnInvoiceDbToJs(invoice));
            });
        }, test);
    },
    delete: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM invoice WHERE invoiceId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    }
};

// fnInvoiceDbToJs:
// transfors a db record into a js object
var fnInvoiceDbToJs = function (gdb) {
    gdb.invoiceDate = util.serverParseDate(gdb.invoiceDate);
    return gdb;
}

// fnInvoiceJsToDb
// transforms a js object into a db record
var fnInvoiceJsToDb = function (g) {
    return g;
}


module.exports = invoiceAPI;