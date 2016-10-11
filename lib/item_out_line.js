/*
 * =================================================
 * item_out_line.js
 * All functions related to item_out_line management in
 * database MYSQL
 * ==================================================
*/
var mysql = require('mysql'),
    stockDb = require('./item_stock'),
    dbCon = require('./db_connection');

var itemOutLineAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT o.*, i.name as itemName";
            sql += " FROM item_out_line AS o";
            sql += " LEFT JOIN item as i ON i.itemId = o.itemId";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnItemOutLineDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT o.*, i.name as itemName";
            sql += " FROM item_out_line AS o";
            sql += " LEFT JOIN item as i ON i.itemId = o.itemId";
            sql += " WHERE o.itemOutLineId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnItemOutLineDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    getByItemOutId: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT o.*, i.name as itemName";
            sql += " FROM item_out_line AS o";
            sql += " LEFT JOIN item as i ON i.itemId = o.itemId";
            sql += " WHERE o.itemOutId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnItemOutLineDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    post: function (itemOutLine, done, test) {
        // obtain db record
        var gdb = fnItemOutLineJsToDb(itemOutLine);
        var stk = {
            storeId: gdb.storeId,
            itemId: gdb.itemId
        };
        delete gdb.storeId;
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO item_out_line SET ?";
            sql = mysql.format(sql, gdb);
            con.beginTransaction(function (err) {
                if (err) {
                    con.rollback(function () { });
                    return callback(err);
                }
                con.query(sql, function (err, res) {
                    if (err) {
                        con.rollback(function () { });
                        return callback(err);
                    }
                    itemOutLine.itemOutLineId = res.insertId;
                    stockDb.postUpdateStock(con, stk, function (err, res) {
                        if (err) return done(err); // rollback done by postUpdateStock
                        con.commit(function (err) {
                            if (err) {
                                con.rollback(function () { });
                                return callback(err);
                            }
                            done(null, fnItemOutLineDbToJs(itemOutLine));
                        })
                    })
                });
            });
        }, test);
    },
    put: function (itemOutLine, done, test) {
        var gdb = fnItemOutLineJsToDb(itemOutLine);
        var stk = {
            storeId: gdb.storeId,
            itemId: gdb.itemId
        };
        delete gdb.storeId;
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE item_out_line SET ? WHERE itemOutLineId = ?";
            sql = mysql.format(sql, [gdb, gdb.itemOutLineId]);
            con.beginTransaction(function (err) {
                if (err) return done(err);
                con.query(sql, function (err, res) {
                    if (err) {
                        con.rollback(function () { });
                        return callback(err);
                    }
                    // update stocks
                    stockDb.postUpdateStock(con, stk, function (err, res) {
                        if (err) return done(err); // roolback done by postUpdateStock
                        con.commit(function (err) {
                            if (err) {
                                con.rollback(function () { });
                                return callback(err);
                            }
                            done(null, fnItemOutLineDbToJs(itemOutLine));
                        });
                    })
                });
            })
        }, test);
    },
    delete: function (itemOutLine, done, test) {
        var gdb = fnItemOutLineJsToDb(itemOutLine);
        dbCon.getConnection(function (err, con) {
            var sql = "SELECT iout.storeId, ioutl.itemId";
            sql += " FROM item_out_line AS ioutl";
            sql += " LEFT JOIN item_out AS iout ON iout.itemOutId = ioutl.itemOutId";
            sql += " WHERE ioutl.itemOutLineId = ?";
            sql = mysql.format(sql, gdb.itemOutLineId);
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
                var sql = "DELETE FROM item_out_line WHERE itemOutLineId = ?";
                sql = mysql.format(sql, gdb.itemOutLineId);
                con.beginTransaction(function (err) {
                    if (err) return done(err);
                    con.query(sql, function (err, res) {
                        if (err) {
                            con.rollback(function () { });
                            return callback(err);
                        }
                        // update stock
                        stockDb.postUpdateStock(con, stk, function (err, res) {
                            if (err) return done(err); // rollback done by postUpdateStock
                            con.commit(function (err) {
                                if (err) {
                                    con.rollback(function () { });
                                    return callback(err);
                                }
                                done(null);
                            })
                        });
                    });
                })
            }, test);
        }, test);
    }
};

// fnItemOutLineDbToJs:
// transfors a db record into a js object
var fnItemOutLineDbToJs = function (odb) {
    var o = odb;
    o.id = odb.itemOutLineId;
    o.itemOut = {
        id: odb.itemOutId
    };
    o.item = {
        id: odb.itemId,
        name: odb.itemName
    };
    //
    delete o.itemOutLineId;
    delete o.itemOutId;
    delete o.itemId;
    delete o.itemName;
    return o;
}

// fnItemOutLineJsToDb
// transforms a js object into a db record
var fnItemOutLineJsToDb = function (o) {
    // add db id
    var odb = o;
    odb.itemOutLineId = o.id;
    if (o.itemOut) {
        odb.itemOutId = o.itemOut.id;
        if (o.itemOut.store) {
            odb.storeId = o.itemOut.store.id;
        }
    }
    if (o.item) odb.itemId = o.item.id;
    // delete some properties
    delete odb.id;
    delete odb.item;
    delete odb.itemOut;
    return odb;
}


module.exports = itemOutLineAPI;