var mysql = require('mysql'),
    dbCon = require('./db_connection');

// -------------------- MAIN API
var itemStoreAPI = {
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
                    ist.push(fnIstDbToJs(udb));
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
                    ist.push(fnIstDbToJs(udb));
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
                    ist.push(fnIstDbToJs(udb));
                });
                done(null, ist);
            });
        }, test);
    },
    post: function (wo, done, test) {
        // controls wo properties
        if (!fnCheckIst(wo)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnIstJsToDb(wo);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO item_stock SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                wo.itemStockId = res.insertId;
                done(null, fnIstDbToJs(wo));
            });
        }, test);
    },
    postUpdateStock: function (stk, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT " + stk.storeId + " AS storeId, i.itemId, (COALESCE(i.qin, 0) -  COALESCE(o.qout, 0)) AS stock";
            sql += " FROM";
            sql += " (SELECT iin.storeId, iinl.itemId, SUM(iinl.quantity) AS qin";
            sql += " FROM item_in AS iin";
            sql += " LEFT JOIN item_in_line AS iinl ON iinl.itemInId = iin.itemInId";
            sql += " WHERE iin.storeId = ? AND iinl.itemId = ?";
            sql += " GROUP BY storeId,itemId) AS i";
            sql += " LEFT JOIN";
            sql += " (SELECT iout.storeId, ioutl.itemId, SUM(ioutl.quantity) AS qout";
            sql += " FROM item_out AS iout";
            sql += " LEFT JOIN item_out_line AS ioutl ON ioutl.itemOutId = iout.itemOutId";
            sql += " WHERE iout.storeId = ? AND ioutl.itemId = ?";
            sql += " GROUP BY storeId, itemId) AS o";
            sql += " ON o.itemId = i.itemId";
            sql = mysql.format(sql, [stk.storeId, stk.itemId, stk.storeId, stk.itemId]);
            con.query(sql, function (err, res) {
                if (err) return done(err);
                var reg = res[0];
                sql = "INSERT INTO item_stock SET ? ON DUPLICATE KEY UPDATE ?";
                sql = mysql.format(sql, [reg, reg]);
                con.query(sql, function (err, res) {
                    dbCon.closeConnection(con);
                    if (err) return done(err);
                    done(null, null);
                })
            });
        }, test);
    },
    put: function (wo, done, test) {
        // controls wo properties
        if (!fnCheckIst(wo)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        var udb = fnIstJsToDb(wo);
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
        var udb = fnIstJsToDb(wo);
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
// fnIstDbToJs:
// transfors a db record into a js object
var fnIstDbToJs = function (odb) {
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

// fnIstJsToDb
// transforms a js object into a db record
var fnIstJsToDb = function (o) {
    var odb = o;
    // add properties
    odb.itemStoreId = o.id;
    if (o.store) odb.storeId = o.store.id;
    if (o.item) odb.itemId = o.item.id;
    // delete some properties
    delete odb.id;
    delete odb.store;
    delete odb.item;
    return odb;
}

// fnCheckIst
// checks if the object has old properties needed
var fnCheckIst = function (u) {
    var check = true;
    check = (check && u.hasOwnProperty("id"));
    return check;
}

module.exports = itemStoreAPI;