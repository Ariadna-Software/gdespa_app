var mysql = require('mysql'),
    dbCon = require('./db_connection');

// -------------------- MAIN API
var itemOutAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT item_out.*, s.name AS storeName, w.name AS workerName, pw.name AS pwName";
            sql += " FROM item_out";
            sql += " LEFT JOIN store AS s ON s.storeId = item_out.storeId";
            sql += " LEFT JOIN worker AS w ON w.workerId = item_out.workerId";
            sql += " LEFT JOIN pw AS pw ON pw.pwId = item_out.pwId";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var itemOuts = [];
                res.forEach(function (udb) {
                    itemOuts.push(fnItemOutDbToJs(udb));
                });
                done(null, itemOuts);
            });
        }, test);
    },
    getByName: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT item_out.*, s.name AS storeName, w.name AS workerName, pw.name AS pwName";
            sql += " FROM item_out";
            sql += " LEFT JOIN store AS s ON s.storeId = item_out.storeId";
            sql += " LEFT JOIN worker AS w ON w.workerId = item_out.workerId";
            sql += " LEFT JOIN pw AS pw ON pw.pwId = item_out.pwId";
            if (name && (name != '*')) {
                sql += " WHERE s.name LIKE '%" + name + "%'";
            }
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var itemOuts = [];
                res.forEach(function (udb) {
                    itemOuts.push(fnItemOutDbToJs(udb));
                });
                done(null, itemOuts);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT item_out.*, s.name AS storeName, w.name AS workerName, pw.name AS pwName";
            sql += " FROM item_out";
            sql += " LEFT JOIN store AS s ON s.storeId = item_out.storeId";
            sql += " LEFT JOIN worker AS w ON w.workerId = item_out.workerId";
            sql += " LEFT JOIN pw AS pw ON pw.pwId = item_out.pwId";
            sql += " WHERE item_out.itemOutId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var itemOuts = [];
                res.forEach(function (udb) {
                    itemOuts.push(fnItemOutDbToJs(udb));
                });
                done(null, itemOuts);
            });
        }, test);
    },
    post: function (itemOut, done, test) {
        // controls itemOut properties
        if (!fnCheckItemOut(itemOut)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnItemOutJsToDb(itemOut);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO item_out SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                itemOut.itemOutId = res.insertId;
                done(null, fnItemOutDbToJs(itemOut));
            });
        }, test);
    },
    put: function (itemOut, done, test) {
        // controls itemOut properties
        if (!fnCheckItemOut(itemOut)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        var udb = fnItemOutJsToDb(itemOut);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE item_out SET ? WHERE itemOutId = ?";
            sql = mysql.format(sql, [udb, udb.itemOutId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                // return object from db
                module.exports.getById(udb.itemOutId, function (err, res) {
                    if (err) return done(err);
                    done(null, res[0]);
                }, test);
            });
        }, test);
    },
    delete: function (itemOut, done, test) {
        var udb = fnItemOutJsToDb(itemOut);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM item_out WHERE itemOutId = ?";
            sql = mysql.format(sql, udb.itemOutId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    }
}

// ----------------- AUXILIARY FUNCTIONS
// fnItemOutDbToJs:
// transfors a db record into a js object
var fnItemOutDbToJs = function (odb) {
    var o = odb;
    // add some properties
    o.id = odb.itemOutId;
    o.store = {
        id: odb.storeId,
        name: odb.storeName
    };
    o.worker = {
        id: odb.workerId,
        name: odb.workerName
    };
    o.pw = {
        id: odb.pwId,
        name: odb.pwName
    };
    // delete properties not needed
    delete o.itemOutId;
    delete o.storeId;
    delete o.workerId;
    delete o.pwId;
    delete o.storeName;
    delete o.workerName;
    delete o.pwName;
    return o;
}

// fnItemOutJsToDb
// transforms a js object into a db record
var fnItemOutJsToDb = function (o) {
    var odb = o;
    // add properties
    odb.itemOutId = o.id;
    if (o.store) odb.storeId = o.store.id;
    if (o.worker) odb.workerId = o.worker.id;
    if (o.pw) odb.pwId = o.pw.id;
    // delete some properties
    delete odb.id;
    delete odb.store;
    delete odb.worker;
    delete odb.pwId;
    return odb;
}

// fnCheckItemOut
// checks if the object has old properties needed
var fnCheckItemOut = function (u) {
    var check = true;
    check = (check && u.hasOwnProperty("id"));
    return check;
}

module.exports = itemOutAPI;