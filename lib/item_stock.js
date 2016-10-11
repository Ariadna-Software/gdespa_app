var mysql = require('mysql'),
    dbCon = require('./db_connection');

// -------------------- MAIN API
var itemStockAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT is.*, s.name AS storeName, i.name AS itemName";
            sql += " FROM item_stock as is";
            sql += " LEFT JOIN store ON as s s.storeId = is.storeId";
            sql += " LEFT JOIN item AS i ON i.itemId = is.itemId";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var ist = [];
                res.forEach(function (udb) {
                    ist.push(fnStockDbToJs(udb));
                });
                done(null, ist);
            });
        }, test);
    },
    getByName: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT is.*, s.name AS storeName, i.name AS itemName";
            sql += " FROM item_stock as is";
            sql += " LEFT JOIN store ON as s s.storeId = is.storeId";
            sql += " LEFT JOIN item AS i ON i.itemId = is.itemId";
            if (name && (name != '*')) {
                sql += " WHERE i.name LIKE '%" + name + "%'";
            }
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var ist = [];
                res.forEach(function (udb) {
                    ist.push(fnStockDbToJs(udb));
                });
                done(null, ist);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT is.*, s.name AS storeName, i.name AS itemName";
            sql += " FROM item_stock as is";
            sql += " LEFT JOIN store ON as s s.storeId = is.storeId";
            sql += " LEFT JOIN item AS i ON i.itemId = is.itemId";
            sql += " WHERE is.itemStockId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var ist = [];
                res.forEach(function (udb) {
                    ist.push(fnStockDbToJs(udb));
                });
                done(null, ist);
            });
        }, test);
    },
    getByStoreId: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT s.*, i.name AS itemName, st.stock, st.lastInvDate, st.lastStock";
            sql += " FROM store AS s";
            sql += " LEFT JOIN item_stock AS st ON st.storeId = s.storeId";
            sql += " LEFT JOIN item AS i ON i.itemId = st.itemId";
            sql += " WHERE s.storeId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var ist = [];
                res.forEach(function (udb) {
                    var o = udb;
                    o.item = {
                        id: udb.itemId,
                        name: udb.itemName
                    };
                    delete udb.itemId;
                    delete udb.itemName;
                    ist.push(o);
                });
                done(null, ist);
            });
        }, test);
    },
    getByItemId: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT i.*, s.name AS storeName, st.stock, st.lastInvDate, st.lastStock";
            sql += " FROM item AS i";
            sql += " LEFT JOIN item_stock AS st ON st.itemId = i.itemId";
            sql += " LEFT JOIN store AS s ON s.storeId = st.storeId"
            sql += " WHERE NOT s.name IS NULL";
            sql += " AND i.itemId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var ist = [];
                res.forEach(function (udb) {
                    var o = udb;
                    o.store = {
                        id: udb.storeId,
                        name: udb.storeName
                    };
                    delete udb.storeId;
                    delete udb.storeName;
                    ist.push(o);
                });
                done(null, ist);
            });
        }, test);
    },
    post: function (wo, done, test) {
        // controls wo properties
        if (!fnCheckStock(wo)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnStockJsToDb(wo);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO item_stock SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                wo.itemStockId = res.insertId;
                done(null, fnStockDbToJs(wo));
            });
        }, test);
    },
    postUpdateStock: function (con, stk, done, test) {
        var sql = "SELECT * FROM item_stock WHERE storeId = ? AND itemId = ?";
        sql = mysql.format(sql, [stk.storeId, stk.itemId]);
        con.query(sql, function (err, res) {
            if (err) {
                // roll back transaction
                con.rollback(function () {
                    return done(err);
                })
            }
            if (res.length > 0 && res[0].lastInvDate) {
                // record exists
                stk.itemStockId = res[0].itemStockId;
                stk.lastStock = res[0].lastStock;
                itemStockAPI.postUpdateStockExists(con, stk, res[0].lastInvDate, function (err, res) {
                    if (err) return done(err);
                    done(null, null);
                }, test);
            } else {
                // new record or not inventoried
                itemStockAPI.postUpdateStockNew(con, stk, function (err, res) {
                    if (err) return done(err);
                    done(null, null);
                }, test);
            }
        });
    },
    postUpdateStockExists: function (con, stk, lastInvDate, done, test) {
        var sql = "SELECT " + stk.storeId + " AS storeId, it.itemId, (COALESCE(i.qin, 0) -  COALESCE(o.qout, 0)) AS stock";
        sql += " FROM item AS it";
        sql += " LEFT JOIN";
        sql += " (SELECT iin.storeId, iinl.itemId, SUM(iinl.quantity) AS qin";
        sql += " FROM item_in AS iin";
        sql += " LEFT JOIN item_in_line AS iinl ON iinl.itemInId = iin.itemInId";
        sql += " WHERE iin.storeId = ? AND iinl.itemId = ? AND iin.dateIn > ?";
        sql += " GROUP BY storeId,itemId) AS i";
        sql += " ON i.itemId = it.itemId"
        sql += " LEFT JOIN";
        sql += " (SELECT iout.storeId, ioutl.itemId, SUM(ioutl.quantity) AS qout";
        sql += " FROM item_out AS iout";
        sql += " LEFT JOIN item_out_line AS ioutl ON ioutl.itemOutId = iout.itemOutId";
        sql += " WHERE iout.storeId = ? AND ioutl.itemId = ? AND iout.dateOut > ?";
        sql += " GROUP BY storeId, itemId) AS o ";
        sql += " ON o.itemId = it.itemId";
        sql += " WHERE it.itemId = ?";
        sql = mysql.format(sql, [stk.storeId, stk.itemId, lastInvDate, stk.storeId, stk.itemId, lastInvDate, stk.itemId]);
        con.query(sql, function (err, res) {
            if (err) {
                con.rollback(function () {
                    return done(err);
                });
            }
            var calculatedStock = stk.lastStock * 1 + res[0].stock * 1;
            sql = "UPDATE item_stock SET stock = ? WHERE itemStockId = ?";
            sql = mysql.format(sql, [calculatedStock, stk.itemStockId]);
            con.query(sql, function (err, res) {
                if (err) {
                    con.rollback(function () {
                        return done(err);
                    });
                }
                done(null, null);
            })
        });
    },
    postUpdateStockNew: function (con, stk, done, test) {
        if (err) return done(err);
        var con = res; // mysql connection
        var sql = "SELECT " + stk.storeId + " AS storeId, it.itemId, (COALESCE(i.qin, 0) -  COALESCE(o.qout, 0)) AS stock";
        sql += " FROM item AS it";
        sql += " LEFT JOIN";
        sql += " (SELECT iin.storeId, iinl.itemId, SUM(iinl.quantity) AS qin";
        sql += " FROM item_in AS iin";
        sql += " LEFT JOIN item_in_line AS iinl ON iinl.itemInId = iin.itemInId";
        sql += " WHERE iin.storeId = ? AND iinl.itemId = ?";
        sql += " GROUP BY storeId,itemId) AS i";
        sql += " ON i.itemId = it.itemId"
        sql += " LEFT JOIN";
        sql += " (SELECT iout.storeId, ioutl.itemId, SUM(ioutl.quantity) AS qout";
        sql += " FROM item_out AS iout";
        sql += " LEFT JOIN item_out_line AS ioutl ON ioutl.itemOutId = iout.itemOutId";
        sql += " WHERE iout.storeId = ? AND ioutl.itemId = ?";
        sql += " GROUP BY storeId, itemId) AS o ";
        sql += " ON o.itemId = it.itemId";
        sql += " WHERE it.itemId = ?";
        sql = mysql.format(sql, [stk.storeId, stk.itemId, stk.storeId, stk.itemId, stk.itemId]);
        con.query(sql, function (err, res) {
            if (err) {
                con.rollback(function () {
                    return done(err);
                });
            }
            var reg = res[0];
            sql = "INSERT INTO item_stock SET ? ON DUPLICATE KEY UPDATE ?";
            sql = mysql.format(sql, [reg, reg]);
            con.query(sql, function (err, res) {
                if (err) {
                    con.rollback(function () {
                        return done(err);
                    });
                }
                done(null, null);
            })
        });
    },
    put: function (wo, done, test) {
        // controls wo properties
        if (!fnCheckStock(wo)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        var udb = fnStockJsToDb(wo);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE item_stock SET ? WHERE itemStockId = ?";
            sql = mysql.format(sql, [udb, udb.itemStockId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                // return object from db
                module.exports.getById(udb.itemStockId, function (err, res) {
                    if (err) return done(err);
                    done(null, res[0]);
                }, test);
            });
        }, test);
    },
    delete: function (wo, done, test) {
        var udb = fnStockJsToDb(wo);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE item_stock wo WHERE itemStockId = ?";
            sql = mysql.format(sql, udb.itemStockId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    }
}

// ----------------- AUXILIARY FUNCTIONS
// fnStockDbToJs:
// transfors a db record into a js object
var fnStockDbToJs = function (odb) {
    var o = odb;
    // add some properties
    o.id = odb.itemStockId;
    o.store = {
        id: odb.storeId,
        name: odb.storeName
    };
    o.item = {
        id: odb.itemId,
        name: odb.itemName
    };
    // delete properties not needed
    delete o.itemStockId;
    delete odb.storeId;
    delete odb.itemId;
    delete o.storeName;
    delete o.itemName;
    return o;
}

// fnStockJsToDb
// transforms a js object into a db record
var fnStockJsToDb = function (o) {
    var odb = o;
    // add properties
    odb.itemStockId = o.id;
    if (o.store) odb.storeId = o.store.id;
    if (o.item) odb.itemId = o.item.id;
    // delete some properties
    delete odb.id;
    delete odb.store;
    delete odb.item;
    return odb;
}

// fnCheckStock
// checks if the object has old properties needed
var fnCheckStock = function (u) {
    var check = true;
    check = (check && u.hasOwnProperty("id"));
    return check;
}

module.exports = itemStockAPI;