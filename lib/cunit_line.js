/*
 * =================================================
 * cunit_group.js
 * All functions related to cunit_line management in
 * database MYSQL
 * ==================================================
*/
var mysql = require('mysql'),
    dbCon = require('./db_connection');

var cUnitLineAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT cul.*, cu.name AS cUnitName, i.name AS itemName, u.Name AS unitName, u.abb AS unitAbb";
            sql += " FROM cunit_line AS cul";
            sql += " LEFT JOIN cunit AS cu ON cu.cunitId = cul.cunitId";
            sql += " LEFT JOIN item AS i ON i.itemId = cul.itemId";
            sql += " LEFT JOIN unit AS u ON u.unitId = cul.unitId";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fncUnitLineDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT cul.*, cu.name AS cUnitName, i.name AS itemName, u.Name AS unitName, u.abb AS unitAbb";
            sql += " FROM cunit_line AS cul";
            sql += " LEFT JOIN cunit AS cu ON cu.cunitId = cul.cunitId";
            sql += " LEFT JOIN item AS i ON i.itemId = cul.itemId";
            sql += " LEFT JOIN unit AS u ON u.unitId = cul.unitId";
            sql += " WHERE cul.cunitLineId = ?";
            sql += " ORDER BY cul.line";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fncUnitLineDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    getByCUnitId: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT cul.*, cu.name AS cUnitName, i.name AS itemName, u.Name AS unitName, u.abb AS unitAbb";
            sql += " FROM cunit_line AS cul";
            sql += " LEFT JOIN cunit AS cu ON cu.cunitId = cul.cunitId";
            sql += " LEFT JOIN item AS i ON i.itemId = cul.itemId";
            sql += " LEFT JOIN unit AS u ON u.unitId = cul.unitId";
            sql += " WHERE cu.cunitId = ?";
            sql += " ORDER BY cul.line";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fncUnitLineDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },    
    post: function (cUnitLine, done, test) {
        // obtain db record
        var gdb = fncUnitLineJsToDb(cUnitLine);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO cunit_line SET ?";
            sql = mysql.format(sql, gdb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                cUnitLine.cUnitLineId = res.insertId;
                done(null, fncUnitLineDbToJs(cUnitLine));
            });
        }, test);
    },
    put: function (cUnitLine, done, test) {
        var gdb = fncUnitLineJsToDb(cUnitLine);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE cunit_line SET ? WHERE cunitLineId = ?";
            sql = mysql.format(sql, [gdb, gdb.cUnitLineId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, fncUnitLineDbToJs(cUnitLine));
            });
        }, test);
    },
    delete: function (cUnitLine, done, test) {
        var gdb = fncUnitLineJsToDb(cUnitLine);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM cunit_line WHERE cunitLineId = ?";
            sql = mysql.format(sql, gdb.cUnitLineId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    }
};

// fncUnitLineDbToJs:
// transfors a db record into a js object
var fncUnitLineDbToJs = function (odb) {
    var o = {
        id: odb.cunitLineId,
        line: odb.line,
        quantity: odb.quantity,
        cUnit:{
            id: odb.cunitId,
            name: odb.cUnitName
        },
        unit:{
            id: odb.unitId,
            name: odb.unitName,
            abb: odb.unitAbb
        },
        item:{
            id: odb.itemId,
            name: odb.itemName
        }
    }
    return o;
}

// fncUnitLineJsToDb
// transforms a js object into a db record
var fncUnitLineJsToDb = function (o) {
    // add db id
    var odb = {};
    odb.cunitLineId = o.id;
    odb.cunitId = o.cUnit.id;
    odb.line = o.line;
    odb.itemId = o.item.id;
    odb.unitId = o.unit.id;
    odb.quantity = o.quantity;
    // delete some properties
    delete odb.id;
    delete odb.cUnit;
    delete odb.item;
    delete odb.unit;
    return odb;
}


module.exports = cUnitLineAPI;