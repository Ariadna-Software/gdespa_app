/*
 * =================================================
 * item_in_line.js
 * All functions related to item_in_line management in
 * database MYSQL
 * ==================================================
*/
var mysql = require('mysql'),
    stockDb = require('./item_stock'),
    dbCon = require('./db_connection');


var itemInLineAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT inl.*, i.name as itemName";
            sql += " FROM item_in_line AS inl";
            sql += " LEFT JOIN item as i ON i.itemId = inl.itemId";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnItemInLineDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT inl.*, i.name as itemName";
            sql += " FROM item_in_line AS inl";
            sql += " LEFT JOIN item as i ON i.itemId = inl.itemId";
            sql += " WHERE inl.itemInLineId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnItemInLineDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    getByItemInId: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT inl.*, i.name as itemName";
            sql += " FROM item_in_line AS inl";
            sql += " LEFT JOIN item as i ON i.itemId = inl.itemId";
            sql += " WHERE inl.itemInId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnItemInLineDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    post: function (itemInLine, done, test) {
        // obtain db record
        var gdb = fnItemInLineJsToDb(itemInLine);
        var stk = {
            storeId: gdb.storeId,
            itemId: gdb.itemId
        };
        delete gdb.storeId;
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO item_in_line SET ?";
            sql = mysql.format(sql, gdb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                itemInLine.itemInLineId = res.insertId;
                // update stocks
                stockDb.postUpdateStock(stk, function (err, res) {
                    if (err) return done(err);
                    done(null, fnItemInLineDbToJs(itemInLine));
                })
            });
        }, test);
    },
    put: function (itemInLine, done, test) {
        var gdb = fnItemInLineJsToDb(itemInLine);
        var stk = {
            storeId: gdb.storeId,
            itemId: gdb.itemId
        };
        delete gdb.storeId;
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE item_in_line SET ? WHERE itemInLineId = ?";
            sql = mysql.format(sql, [gdb, gdb.itemInLineId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                stockDb.postUpdateStock(stk, function (err, res) {
                    if (err) return done(err);
                    done(null, fnItemInLineDbToJs(itemInLine));
                });
            });
        }, test);
    },
    delete: function (itemInLine, done, test) {
        var gdb = fnItemInLineJsToDb(itemInLine);
        var stk = null;
        dbCon.getConnection(function (err, con) {
            var sql = "SELECT iin.storeId, iinl.itemId";
            sql += " FROM item_in_line AS iinl";
            sql += " LEFT JOIN item_in AS iin ON iin.itemInId = iinl.itemInId";
            sql += " WHERE iinl.itemInLineId = ?";
            sql = mysql.format(sql, gdb.itemInLineId);
            con.query(sql, function (err, res) {
                if (err) return done(err);
                stk = {
                    storeId: res[0].storeId,
                    itemId: res[0].itemId
                };
            });
            dbCon.getConnection(function (err, res) {
                if (err) return done(err);
                var con = res; // mysql connection
                var sql = "DELETE FROM item_in_line WHERE itemInLineId = ?";
                sql = mysql.format(sql, gdb.itemInLineId);
                con.query(sql, function (err, res) {
                    dbCon.closeConnection(con);
                    if (err) return done(err);
                    // update stock
                    stockDb.postUpdateStock(stk, function (err, res) {
                        if (err) return done(err);
                        done(null);
                    });
                });
            }, test);
        }, test);
    }
};

// fnItemInLineDbToJs:
// transfors a db record into a js object
var fnItemInLineDbToJs = function (odb) {
    var o = odb;
    o.id = odb.itemInLineId;
    o.itemIn = {
        id: odb.itemInId
    };
    o.item = {
        id: odb.itemId,
        name: odb.itemName
    };
    //
    delete o.itemInLineId;
    delete o.itemInId;
    delete o.itemId;
    delete o.itemName;
    return o;
}

// fnItemInLineJsToDb
// transforms a js object into a db record
var fnItemInLineJsToDb = function (o) {
    // add db id
    var odb = o;
    odb.itemInLineId = o.id;
    if (o.itemIn) {
        odb.itemInId = o.itemIn.id;
        if (o.itemIn.store) {
            odb.storeId = o.itemIn.store.id;
        }
    }
    if (o.item) odb.itemId = o.item.id;
    // delete some properties
    delete odb.id;
    delete odb.item;
    delete odb.itemIn;
    return odb;
}


module.exports = itemInLineAPI;