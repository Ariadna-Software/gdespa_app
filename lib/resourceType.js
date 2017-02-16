/*
 * =================================================
 * resourceType.js
 * All functions related to user group management in
 * database MYSQL
 * ==================================================
 */
var mysql = require('mysql'),
    dbCon = require('./db_connection');

var resourceTypeAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT * FROM resource_type";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(gdb);
                });
                done(null, groups);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT * FROM resource_type WHERE resourceTypeId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(gdb);
                });
                done(null, groups);
            });
        }, test);
    },
    post: function (resourceType, done, test) {
        // obtain db record
        var gdb = resourceType;
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO resource_type SET ?";
            sql = mysql.format(sql, gdb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                resourceType.resourceTypeId = res.insertId;
                done(null, resourceType);
            });
        }, test);
    },
    put: function (resourceType, done, test) {
        var gdb = resourceType;
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE resource_type SET ? WHERE resourceTypeId = ?";
            sql = mysql.format(sql, [gdb, gdb.resourceTypeId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, resourceType);
            });
        }, test);
    },
    delete: function (resourceTypeId, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM resource_type WHERE resourceTypeId = ?";
            sql = mysql.format(sql, resourceTypeId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    },
    getNewLineNumber: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT COALESCE(MAX(`order`) + 1, 1) AS contador";
            sql += " FROM resource_type WHERE pwId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, res[0]);
            });
        }, test);
    },
    getResourceTypesByPwId: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT *";
            sql += " FROM resource_type WHERE pwId = ?";
            sql += " ORDER BY `order`"
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, res);
            });
        }, test);
    }
};

module.exports = resourceTypeAPI;