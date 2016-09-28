/*
 * =================================================
 * inventory_line.js
 * All functions related to inventory_line management in
 * database MYSQL
 * ==================================================
*/
var mysql = require('mysql'),
    dbCon = require('./db_connection');

var inventoryLineAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT il.*, i.name as itemName";
            sql += " FROM inventory_line AS il";
            sql += " LEFT JOIN item ON i.itemId = il.itemId";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var inventoryLines = [];
                res.forEach(function (gdb) {
                    inventoryLines.push(fnInventoryLineDbToJs(gdb));
                });
                done(null, inventoryLines);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT il.*, i.name as itemName";
            sql += " FROM inventory_line AS il";
            sql += " LEFT JOIN item ON i.itemId = il.itemId";
            sql += " WHERE il.inventoryLineId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var inventoryLines = [];
                res.forEach(function (gdb) {
                    inventoryLines.push(fnInventoryLineDbToJs(gdb));
                });
                done(null, inventoryLines);
            });
        }, test);
    },
    getByInventoryId: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT il.*, i.name as itemName";
            sql += " FROM inventory_line AS il";
            sql += " LEFT JOIN item ON i.itemId = il.itemId";
            sql += " WHERE il.inventoryId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var inventoryLines = [];
                res.forEach(function (gdb) {
                    inventoryLines.push(fnInventoryLineDbToJs(gdb));
                });
                done(null, inventoryLines);
            });
        }, test);
    },
    post: function (inventoryLine, done, test) {
        // obtain db record
        var gdb = fnInventoryLineJsToDb(inventoryLine);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO inventory_line SET ?";
            sql = mysql.format(sql, gdb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                inventoryLine.inventoryLineId = res.insertId;
                done(null, fnInventoryLineDbToJs(inventoryLine));
            });
        }, test);
    },
    put: function (inventoryLine, done, test) {
        var gdb = fnInventoryLineJsToDb(inventoryLine);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE inventory_line SET ? WHERE inventoryLineId = ?";
            sql = mysql.format(sql, [gdb, gdb.inventoryLineId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, fnInventoryLineDbToJs(inventoryLine));
            });
        }, test);
    },
    delete: function (inventoryLine, done, test) {
        var gdb = fnInventoryLineJsToDb(inventoryLine);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM inventory_line WHERE inventoryLineId = ?";
            sql = mysql.format(sql, gdb.inventoryLineId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    }
};

// fnInventoryLineDbToJs:
// transfors a db record into a js object
var fnInventoryLineDbToJs = function (odb) {
    var o = odb;
    o.id = odb.inventoryLineId;
    o.inventory = {
        id: odb.inventoryId,
    };
    o.item = {
        id: odb.itemId,
        name: odb.itemName
    };
    //
    delete o.inventoryLineId;
    delete o.inventoryId;
    delete o.itemId;
    delete o.itemName;
    return o;
}

// fnInventoryLineJsToDb
// transforms a js object into a db record
var fnInventoryLineJsToDb = function (o) {
    // add db id
    var odb = o;
    odb.inventoryLineId = o.id;
    if (o.inventory) odb.inventoryId = o.inventory.id;
    if (o.item) odb.itemId = o.item.id;
    // delete some properties
    delete odb.id;
    delete odb.item;
    delete odb.itemName;
    return odb;
}


module.exports = inventoryLineAPI;