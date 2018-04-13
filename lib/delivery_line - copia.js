/*
 * =================================================
 * delivery_line.js
 * All functions related to delivery_line management in
 * database MYSQL
 * ==================================================
*/
var mysql = require('mysql'),
    dbCon = require('./db_connection');

var deliveryLineAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT dl.*, i.name AS itemName, i.reference AS itemReference";
            sql += " FROM delivery_line AS dl";
            sql += " LEFT JOIN item AS i ON i.itemId = dl.itemId";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnDeliveryLineDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT dl.*, i.name AS itemName, i.reference AS itemReference";
            sql += " FROM delivery_line AS dl";
            sql += " LEFT JOIN item AS i ON i.itemId = dl.itemId";
            sql += " WHERE dl.deliveryLineId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnDeliveryLineDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    getByDeliveryId: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT dl.*, i.name AS itemName, i.reference AS itemReference";
            sql += " FROM delivery_line AS dl";
            sql += " LEFT JOIN item AS i ON i.itemId = dl.itemId";
            sql += " WHERE dl.deliveryId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnDeliveryLineDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    post: function (deliveryLine, done, test) {
        // obtain db record
        var gdb = fnDeliveryLineJsToDb(deliveryLine);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO delivery_line SET ?";
            sql = mysql.format(sql, gdb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                deliveryLine.deliveryLineId = res.insertId;
                done(null, fnDeliveryLineDbToJs(deliveryLine));
            });
        }, test);
    },
    put: function (deliveryLine, done, test) {
        var gdb = fnDeliveryLineJsToDb(deliveryLine);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE delivery_line SET ? WHERE deliveryLineId = ?";
            sql = mysql.format(sql, [gdb, gdb.deliveryLineId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, fnDeliveryLineDbToJs(deliveryLine));
            });
        }, test);
    },
    delete: function (deliveryLine, done, test) {
        var gdb = fnDeliveryLineJsToDb(deliveryLine);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM delivery_line WHERE deliveryLineId = ?";
            sql = mysql.format(sql, gdb.deliveryLineId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    }
};

// fnDeliveryLineDbToJs:
// transfors a db record into a js object
var fnDeliveryLineDbToJs = function (odb) {
    var o = odb;
    o.id = odb.deliveryLineId;
    o.delivery = {
        id: odb.deliveryId
    };
    o.item = {
        id: odb.itemId,
        name: odb.itemName,
        reference: odb.itemReference
    };
    //
    delete o.deliveryLineId;
    delete o.deliveryId;
    delete o.itemId;
    delete o.itemName;
    delete o.itemReference;
    return o;
}

// fnDeliveryLineJsToDb
// transforms a js object into a db record
var fnDeliveryLineJsToDb = function (o) {
    // add db id
    var odb = o;
    odb.deliveryLineId = o.id;
    if (o.delivery) odb.deliveryId = o.delivery.id;
    if (o.item) odb.itemId = o.item.id;
    // delete some properties
    delete odb.id;
    delete odb.item;
    delete odb.delivery;
    return odb;
}


module.exports = deliveryLineAPI;