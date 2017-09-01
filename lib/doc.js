/*
 * =================================================
 * company.js
 * All functions related to user group management in
 * database MYSQL
 * ==================================================
*/
var mysql = require('mysql'),
    dbCon = require('./db_connection');

var companyAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT * FROM company";
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
            var sql = "SELECT * FROM company WHERE companyId = ?";
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
    post: function (company, done, test) {
        // obtain db record
        var gdb = fnCompanyJsToDb(company);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO company SET ?";
            sql = mysql.format(sql, gdb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                company.companyId = res.insertId;
                done(null, fnCompanyDbToJs(company));
            });
        }, test);
    },
    put: function (company, done, test) {
        var gdb = fnCompanyJsToDb(company);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE company SET ? WHERE companyId = ?";
            sql = mysql.format(sql, [gdb, gdb.companyId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, fnCompanyDbToJs(company));
            });
        }, test);
    },
    delete: function (company, done, test) {
        var gdb = fnCompanyJsToDb(company);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM company WHERE companyId = ?";
            sql = mysql.format(sql, gdb.companyId);
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
        id: gdb.companyId,
        name: gdb.name
    }
    return g;
}

// fnCompanyJsToDb
// transforms a js object into a db record
var fnCompanyJsToDb = function (g) {
    // add db id
    g.companyId = g.id;
    // delete some properties
    delete g.id;
    return g;
}


module.exports = companyAPI;