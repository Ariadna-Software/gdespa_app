var mysql = require('mysql'),
    async = require('async'),
    util = require('./util'),
    dbCon = require('./db_connection');

// -------------------- MAIN API
var inventoryAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT inv.*, w.name AS workerName, s.name AS storeName";
            sql += " FROM inventory as inv";
            sql += " LEFT JOIN worker AS w ON w.workerId = inv.workerId";
            sql += " LEFT JOIN store AS s ON s.storeId = inv.storeId";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var inventorys = [];
                res.forEach(function (udb) {
                    inventorys.push(fnInventoryDbToJs(udb));
                });
                done(null, inventorys);
            });
        }, test);
    },
    getByName: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT inv.*, w.name AS workerName, s.name AS storeName";
            sql += " FROM inventory as inv";
            sql += " LEFT JOIN worker AS w ON w.workerId = inv.workerId";
            sql += " LEFT JOIN store AS s ON s.storeId = inv.storeId";
            if (name && (name != '*')) {
                sql += " WHERE s.name LIKE '%" + name + "%'";
            }
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var inventorys = [];
                res.forEach(function (udb) {
                    inventorys.push(fnInventoryDbToJs(udb));
                });
                done(null, inventorys);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT inv.*, w.name AS workerName, s.name AS storeName";
            sql += " FROM inventory as inv";
            sql += " LEFT JOIN worker AS w ON w.workerId = inv.workerId";
            sql += " LEFT JOIN store AS s ON s.storeId = inv.storeId";
            sql += " WHERE inv.inventoryId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var inventorys = [];
                res.forEach(function (udb) {
                    inventorys.push(fnInventoryDbToJs(udb));
                });
                done(null, inventorys);
            });
        }, test);
    },
    post: function (inventory, done, test) {
        // controls inventory properties
        if (!fnCheckInventory(inventory)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // Check if there are movements after inventory
        inventoryAPI.checkMovementsAfter(inventory.inventoryDate, inventory.store.id, function (err, res) {
            if (err) return done(err);
            if (res) return done(new Error('Hay movimientos de entrada / salida posteriores a la fecha de inventario'));
            // obtain db record
            var udb = fnInventoryJsToDb(inventory);
            dbCon.getConnection(function (err, res) {
                if (err) return done(err);
                var con = res; // mysql connection
                var sql = "INSERT INTO inventory SET ?";
                sql = mysql.format(sql, udb);
                con.query(sql, function (err, res) {
                    if (err) return done(err);
                    inventory.inventoryId = res.insertId;
                    sql = "INSERT INTO inventory_line (inventoryId, itemId, oldStock, newStock)"
                    sql += " SELECT ? AS inventoryId, i.itemId, stock AS oldStock, stock AS newStock";
                    sql += " FROM item_stock AS i";
                    sql += " WHERE storeId = ?";
                    sql = mysql.format(sql, [inventory.inventoryId, inventory.storeId]);
                    con.query(sql, function (err, res) {
                        dbCon.closeConnection(con);
                        if (err) return done(err);
                        done(null, fnInventoryDbToJs(inventory));
                    });
                });
            }, test);
        }, test);
    },
    put: function (inventory, done, test) {
        // controls inventory properties
        if (!fnCheckInventory(inventory)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        var udb = fnInventoryJsToDb(inventory);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE inventory SET ? WHERE inventoryId = ?";
            sql = mysql.format(sql, [udb, udb.inventoryId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                // return object from db
                module.exports.getById(udb.inventoryId, function (err, res) {
                    if (err) return done(err);
                    done(null, res[0]);
                }, test);
            });
        }, test);
    },
    putClose: function (inventory, done, test) {
        // controls inventory properties
        if (!fnCheckInventory(inventory)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        var udb = fnInventoryJsToDb(inventory);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE inventory SET ? WHERE inventoryId = ?";
            sql = mysql.format(sql, [udb, udb.inventoryId]);
            con.query(sql, function (err, res) {
                if (err) return done(err);
                // update related item_stock
                sql = "UPDATE item_stock AS s, inventory AS i, inventory_line AS l";
                sql += " SET s.lastInvDate = i.inventoryDate, s.lastInvId = i.inventoryId, s.stock = l.newStock, s.lastStock = l.newStock";
                sql += " WHERE s.storeId = ?";
                sql += " AND i.storeId = s.storeId";
                sql += " AND l.inventoryId = i.inventoryId";
                sql += " AND s.itemId = l.itemId";
                sql = mysql.format(sql, udb.storeId);
                con.query(sql, function (err, res) {
                    if (err) return done(err);
                    dbCon.closeConnection(con);
                    module.exports.getById(udb.inventoryId, function (err, res) {
                        if (err) return done(err);
                        done(null, res[0]);
                    }, test);
                }, test);
            });
        }, test);
    },
    delete: function (inventory, done, test) {
        var udb = fnInventoryJsToDb(inventory);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM inventory WHERE inventoryId = ?";
            sql = mysql.format(sql, udb.inventoryId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    },
    checkMovementsAfter: function (date, storeId, done, test) {
        async.series([function (callback) {
            dbCon.getConnection(function (err, con) {
                var sql = "SELECT COUNT(*) AS num FROM item_out WHERE storeId = ? AND dateOut > ?";
                sql = mysql.format(sql, [storeId, date]);
                con.query(sql, function (err, res) {
                    dbCon.closeConnection(con);
                    if (err) return callback(err);
                    callback(null, res[0]);
                });
            }, test);
        }, function (callback) {
            dbCon.getConnection(function (err, con) {
                var sql = "SELECT COUNT(*) AS num FROM item_in WHERE storeId = ? AND dateIn > ?";
                sql = mysql.format(sql, [storeId, date]);
                con.query(sql, function (err, res) {
                    dbCon.closeConnection(con);
                    if (err) return callback(err);
                    callback(null, res[0]);
                });
            }, test);

        }], function (err, res) {
            if (err) return done(err);
            if (res[0].num > 0 || res[1].num > 0) {
                done(null, true);
            } else {
                done(null, false);
            }
        });
    },
    checkInventoryAfter: function (date, storeId, done, test) {
        dbCon.getConnection(function (err, con) {
            var sql = "SELECT COUNT(*) AS num FROM inventory WHERE storeId = ? AND inventoryDate >= ?";
            sql = mysql.format(sql, [storeId, date]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                if (res[0].num > 0){
                    done(null, true);
                }else{
                    done(null, false);
                }
            });
        }, test);
    }
}

// ----------------- AUXILIARY FUNCTIONS
// fnInventoryDbToJs:
// transfors a db record into a js object
var fnInventoryDbToJs = function (odb) {
    var o = odb;
    // add some properties
    o.id = odb.inventoryId;
    o.worker = {
        id: odb.workerId,
        name: odb.workerName
    };
    o.store = {
        id: odb.storeId,
        name: odb.storeName
    };
    // delete properties not needed
    delete o.inventoryId;
    delete odb.workerId;
    delete o.workerName;
    delete o.storeId;
    delete o.storeName;
    // format date wihtout time zone
    o.inventoryDate = util.serverParseDate(o.inventoryDate);
    return o;
}

// fnInventoryJsToDb
// transforms a js object into a db record
var fnInventoryJsToDb = function (o) {
    var odb = o;
    // add properties
    odb.inventoryId = o.id;
    if (o.worker) odb.workerId = o.worker.id;
    if (o.store) odb.storeId = o.store.id;
    // delete some properties
    delete odb.id;
    delete odb.worker;
    delete odb.store;
    return odb;
}

// fnCheckInventory
// checks if the object has old properties needed
var fnCheckInventory = function (u) {
    var check = true;
    check = (check && u.hasOwnProperty("id"));
    return check;
}

module.exports = inventoryAPI;