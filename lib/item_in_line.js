/*
 * =================================================
 * wo_line.js
 * All functions related to wo_line management in
 * database MYSQL
 * ==================================================
*/
var mysql = require('mysql'),
    dbCon = require('./db_connection');

var woLineAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT wol.woLineId, wol.woId, wol.cunitId, cu.name AS cunitName, wol.estimate, wol.done, wol.quantity";
            sql += " FROM wo_line AS wol";
            sql += " LEFT JOIN wo ON wo.woId = wol.woId";
            sql += " LEFT JOIN cunit AS cu ON cu.cunitId = wol.cunitId";
            sql += " LEFT JOIN (SELECT pwId, cunitId, SUM(quantity) AS estimate FROM pw_line GROUP BY pwId, cunitId) AS e ON (e.pwId = wo.pwId AND e.cunitId = wol.cunitId)";
            sql += " LEFT JOIN (SELECT pwId, cunitId, SUM(quantity) AS done FROM wo_line LEFT JOIN wo ON wo.woId = wo_line.woId GROUP BY pwId, cunitId) AS d ON (d.pwId = wo.pwId AND d.cunitId = wol.cunitId)";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnWoLineDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT wol.woLineId, wol.woId, wol.cunitId, cu.name AS cunitName, wol.estimate, wol.done, wol.quantity";
            sql += " FROM wo_line AS wol";
            sql += " LEFT JOIN wo ON wo.woId = wol.woId";
            sql += " LEFT JOIN cunit AS cu ON cu.cunitId = wol.cunitId";
            sql += " LEFT JOIN (SELECT pwId, cunitId, SUM(quantity) AS estimate FROM pw_line GROUP BY pwId, cunitId) AS e ON (e.pwId = wo.pwId AND e.cunitId = wol.cunitId)";
            sql += " LEFT JOIN (SELECT pwId, cunitId, SUM(quantity) AS done FROM wo_line LEFT JOIN wo ON wo.woId = wo_line.woId GROUP BY pwId, cunitId) AS d ON (d.pwId = wo.pwId AND d.cunitId = wol.cunitId)";
            sql += " WHERE wol.woLineId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnWoLineDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    getByWoId: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT wol.woLineId, wol.woId, wol.cunitId, cu.name AS cunitName, wol.estimate, wol.done, wol.quantity";
            sql += " FROM wo_line AS wol";
            sql += " LEFT JOIN wo ON wo.woId = wol.woId";
            sql += " LEFT JOIN cunit AS cu ON cu.cunitId = wol.cunitId";
            sql += " LEFT JOIN (SELECT pwId, cunitId, SUM(quantity) AS estimate FROM pw_line GROUP BY pwId, cunitId) AS e ON (e.pwId = wo.pwId AND e.cunitId = wol.cunitId)";
            sql += " LEFT JOIN (SELECT pwId, cunitId, SUM(quantity) AS done FROM wo_line LEFT JOIN wo ON wo.woId = wo_line.woId GROUP BY pwId, cunitId) AS d ON (d.pwId = wo.pwId AND d.cunitId = wol.cunitId)";
            sql += " WHERE wo.woId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnWoLineDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    post: function (woLine, done, test) {
        // obtain db record
        var gdb = fnWoLineJsToDb(woLine);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO wo_line SET ?";
            sql = mysql.format(sql, gdb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                woLine.woLineId = res.insertId;
                done(null, fnWoLineDbToJs(woLine));
            });
        }, test);
    },
    put: function (woLine, done, test) {
        var gdb = fnWoLineJsToDb(woLine);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE wo_line SET ? WHERE woLineId = ?";
            sql = mysql.format(sql, [gdb, gdb.woLineId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, fnWoLineDbToJs(woLine));
            });
        }, test);
    },
    delete: function (woLine, done, test) {
        var gdb = fnWoLineJsToDb(woLine);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM wo_line WHERE woLineId = ?";
            sql = mysql.format(sql, gdb.woLineId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    }
};

// fnWoLineDbToJs:
// transfors a db record into a js object
var fnWoLineDbToJs = function (odb) {
    var o = odb;
    o.id = odb.woLineId;
    o.wo = {
        id: odb.woId
    };
    o.cunit={
        id: odb.cunitId,
        name: odb.cunitName
    };
    //
    delete o.woLineId;
    delete o.woId;
    delete o.cunitId;
    delete o.cunitName;
    return o;
}

// fnWoLineJsToDb
// transforms a js object into a db record
var fnWoLineJsToDb = function (o) {
    // add db id
    var odb = o;
    odb.woLineId = o.id;
    if (o.wo) odb.woId = o.wo.id;
    if (o.cunit) odb.cunitId = o.cunit.id;
    // delete some properties
    delete odb.id;
    delete odb.cunit;
    delete odb.wo;
    delete odb.cunitName;
    return odb;
}


module.exports = woLineAPI;