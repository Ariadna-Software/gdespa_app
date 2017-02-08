var mysql = require('mysql'),
    inventoryDb = require('./inventory'),
    dbCon = require('./db_connection');

// -------------------- MAIN API
var itemInAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT item_in.*, s.name AS storeName, w.name AS workerName, s.zoneId";
            sql += " FROM item_in";
            sql += " LEFT JOIN store AS s ON s.storeId = item_in.storeId";
            sql += " LEFT JOIN worker AS w ON w.workerId = item_in.workerId";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var itemIns = [];
                res.forEach(function (udb) {
                    itemIns.push(fnItemInDbToJs(udb));
                });
                done(null, itemIns);
            });
        }, test);
    },
    getByName: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT item_in.*, s.name AS storeName, w.name AS workerName, s.zoneId";
            sql += " FROM item_in";
            sql += " LEFT JOIN store AS s ON s.storeId = item_in.storeId";
            sql += " LEFT JOIN worker AS w ON w.workerId = item_in.workerId";
            if (name && (name != '*')) {
                sql += " WHERE s.name LIKE '%" + name + "%'";
            }
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var itemIns = [];
                res.forEach(function (udb) {
                    itemIns.push(fnItemInDbToJs(udb));
                });
                done(null, itemIns);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT item_in.*, s.name AS storeName, w.name AS workerName, s.zoneId";
            sql += " FROM item_in";
            sql += " LEFT JOIN store AS s ON s.storeId = item_in.storeId";
            sql += " LEFT JOIN worker AS w ON w.workerId = item_in.workerId";
            sql += " WHERE item_in.itemInId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var itemIns = [];
                res.forEach(function (udb) {
                    itemIns.push(fnItemInDbToJs(udb));
                });
                done(null, itemIns);
            });
        }, test);
    },
    post: function (itemIn, done, test) {
        // controls itemIn properties
        if (!fnCheckItemIn(itemIn)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // Check if there are inventory after
        inventoryDb.checkInventoryAfter(itemIn.dateIn, itemIn.store.id, function (err, res) {
            if (err) return done(err);
            if (res) return done(new Error('Hay inventarios con posterioridad a esta fecha de salida'));
            // obtain db record
            var udb = fnItemInJsToDb(itemIn);
            dbCon.getConnection(function (err, res) {
                if (err) return done(err);
                var con = res; // mysql connection
                var sql = "INSERT INTO item_in SET ?";
                sql = mysql.format(sql, udb);
                con.query(sql, function (err, res) {
                    dbCon.closeConnection(con);
                    if (err) return done(err);
                    itemIn.itemInId = res.insertId;
                    done(null, fnItemInDbToJs(itemIn));
                });
            }, test);
        }, test);
    },
    put: function (itemIn, done, test) {
        // controls itemIn properties
        if (!fnCheckItemIn(itemIn)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        var udb = fnItemInJsToDb(itemIn);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE item_in SET ? WHERE itemInId = ?";
            sql = mysql.format(sql, [udb, udb.itemInId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                // return object from db
                module.exports.getById(udb.itemInId, function (err, res) {
                    if (err) return done(err);
                    done(null, res[0]);
                }, test);
            });
        }, test);
    },
    delete: function (itemIn, done, test) {
        var udb = fnItemInJsToDb(itemIn);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM item_in WHERE itemInId = ?";
            sql = mysql.format(sql, udb.itemInId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    }
}

// ----------------- AUXILIARY FUNCTIONS
// fnItemInDbToJs:
// transfors a db record into a js object
var fnItemInDbToJs = function (odb) {
    var o = odb;
    // add some properties
    o.id = odb.itemInId;
    o.store = {
        id: odb.storeId,
        name: odb.storeName
    };
    o.worker = {
        id: odb.workerId,
        name: odb.workerName
    };
    // delete properties not needed
    delete o.itemInId;
    delete o.storeId;
    delete o.workerId;
    delete o.storeName;
    delete o.workerName;
    return o;
}

// fnItemInJsToDb
// transforms a js object into a db record
var fnItemInJsToDb = function (o) {
    var odb = o;
    // add properties
    odb.itemInId = o.id;
    if (o.store) odb.storeId = o.store.id;
    if (o.worker) odb.workerId = o.worker.id;
    // delete some properties
    delete odb.id;
    delete odb.store;
    delete odb.worker;
    return odb;
}

// fnCheckItemIn
// checks if the object has old properties needed
var fnCheckItemIn = function (u) {
    var check = true;
    check = (check && u.hasOwnProperty("id"));
    return check;
}

module.exports = itemInAPI;