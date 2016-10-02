var mysql = require('mysql'),
    stockDb = require('./item_stock'),
    async = require('async'),
    dbCon = require('./db_connection');

// -------------------- MAIN API
var deliveryAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT d.*, pw.name AS pwName, w.name AS workerName, s.name AS storeName";
            sql += " FROM delivery AS d";
            sql += " LEFT JOIN pw AS pw ON pw.pwId = d.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = d.workerId";
            sql += " LEFT JOIN store AS s ON s.storeId = d.storeId";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var deliverys = [];
                res.forEach(function (udb) {
                    deliverys.push(fnDeliveryDbToJs(udb));
                });
                done(null, deliverys);
            });
        }, test);
    },
    getByName: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT d.*, pw.name AS pwName, w.name AS workerName, s.name AS storeName";
            sql += " FROM delivery AS d";
            sql += " LEFT JOIN pw AS pw ON pw.pwId = d.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = d.workerId";
            sql += " LEFT JOIN store AS s ON s.storeId = d.storeId";
            if (name && (name != '*')) {
                sql += " WHERE w.name LIKE '%" + name + "%'";
            }
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var deliverys = [];
                res.forEach(function (udb) {
                    deliverys.push(fnDeliveryDbToJs(udb));
                });
                done(null, deliverys);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT d.*, pw.name AS pwName, w.name AS workerName, s.name AS storeName";
            sql += " FROM delivery AS d";
            sql += " LEFT JOIN pw AS pw ON pw.pwId = d.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = d.workerId";
            sql += " LEFT JOIN store AS s ON s.storeId = d.storeId";
            sql += " WHERE d.deliveryId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var deliverys = [];
                res.forEach(function (udb) {
                    deliverys.push(fnDeliveryDbToJs(udb));
                });
                done(null, deliverys);
            });
        }, test);
    },
    getByPwId: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT d.*, pw.name AS pwName, w.name AS workerName, s.name AS storeName";
            sql += " FROM delivery AS d";
            sql += " LEFT JOIN pw AS pw ON pw.pwId = d.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = d.workerId";
            sql += " LEFT JOIN store AS s ON s.storeId = d.storeId";
            sql += " WHERE pw.pwId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var deliverys = [];
                res.forEach(function (udb) {
                    deliverys.push(fnDeliveryDbToJs(udb));
                });
                done(null, deliverys);
            });
        }, test);
    },
    post: function (delivery, done, test) {
        // controls delivery properties
        if (!fnCheckDelivery(delivery)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnDeliveryJsToDb(delivery);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO delivery SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                delivery.deliveryId = res.insertId;
                done(null, fnDeliveryDbToJs(delivery));
            });
        }, test);
    },
    postGenerated: function (delivery, done, test) {
        // controls delivery properties
        if (!fnCheckDelivery(delivery)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnDeliveryJsToDb(delivery);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO delivery SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                if (err) return done(err);
                delivery.deliveryId = res.insertId;
                sql = "INSERT INTO delivery_line (deliveryId, itemId, estimate, done, quantity)"
                sql += " SELECT deliveryId, itemId, SUM(estimate) AS estimate, done, quantity";
                sql += " FROM";
                sql += " (SELECT " + delivery.deliveryId + " AS deliveryId, cul.itemId, (cul.quantity * pwl.quantity) AS estimate, 0 AS done, 0 AS quantity";
                sql += " FROM pw";
                sql += " LEFT JOIN pw_line AS pwl ON pwl.pwId = pw.pwId";
                sql += " LEFT JOIN cunit AS cu ON cu.cunitId = pwl.cunitId";
                sql += " LEFT JOIN cunit_line AS cul ON cul.cunitId = cu.cunitId";
                sql += " WHERE pw.pwId = ?";
                sql += " AND NOT cul.itemId IS NULL) AS prv";
                sql += " GROUP BY prv.itemId";
                sql = mysql.format(sql, delivery.pwId);
                con.query(sql, function (err, res) {
                    dbCon.closeConnection(con);
                    if (err) return done(err);
                    done(null, fnDeliveryDbToJs(delivery));
                }, test);
            });
        }, test);
    },
    put: function (delivery, done, test) {
        // controls delivery properties
        if (!fnCheckDelivery(delivery)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        var udb = fnDeliveryJsToDb(delivery);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE delivery SET ? WHERE deliveryId = ?";
            sql = mysql.format(sql, [udb, udb.deliveryId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                // return object from db
                module.exports.getById(udb.deliveryId, function (err, res) {
                    if (err) return done(err);
                    done(null, res[0]);
                }, test);
            });
        }, test);
    },
    putServe: function (delivery, done, test) {
        // controls delivery properties
        if (!fnCheckDelivery(delivery)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        var udb = fnDeliveryJsToDb(delivery);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE delivery SET ? WHERE deliveryId = ?";
            sql = mysql.format(sql, [udb, udb.deliveryId]);
            con.query(sql, function (err, res) {
                if (err) return done(err);
                deliveryAPI.createItemOutFromDelivery(udb, function (err, res) {
                    if (err) return done(err);
                    sql = "UPDATE delivery_line";
                    sql += " SET done = done + quantity, quantity = 0";
                    sql += " WHERE deliveryId = ?;"
                    sql = mysql.format(sql, udb.deliveryId);
                    con.query(sql, function (err, res) {
                        dbCon.closeConnection(con);
                        if (err) return done(err);
                        // return object from db
                        module.exports.getById(udb.deliveryId, function (err, res) {
                            if (err) return done(err);
                            done(null, res[0]);
                        }, test);
                    });
                }, test);
            });
        }, test);
    },
    delete: function (delivery, done, test) {
        var udb = fnDeliveryJsToDb(delivery);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM delivery WHERE deliveryId = ?";
            sql = mysql.format(sql, udb.deliveryId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    },
    createItemOutFromDelivery: function (delivery, done, test) {
        // first search for delivery lines concerned
        dbCon.getConnection(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM delivery_line";
            sql += " WHERE deliveryId = ?";
            sql += " AND quantity <> 0";
            sql = mysql.format(sql, delivery.deliveryId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                // nothing to do?
                if (res.length == 0) return done(null);
                var deliveryLines = res;
                // create item_out mainand lines
                deliveryAPI.createItemOutMain(delivery, deliveryLines, function (err, res) {
                    if (err) return done(err);
                    done(null);
                }, test);
            });
        }, test);
    },
    createItemOutMain: function (delivery, deliveryLines, done, test) {
        // construct db object itemOut from delivery
        var io = {
            storeId: delivery.storeId,
            pwId: delivery.pwId,
            dateOut: delivery.lastDate,
            workerId: delivery.workerId,
            comments: "Generada automáticamente desde la entrega: " + delivery.id
        }
        dbCon.getConnection(function (err, con) {
            if (err) return done(err);
            var sql = "INSERT INTO item_out SET ?";
            sql = mysql.format(sql, io);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                io.itemOutId = res.insertId;
                // create item_out_lines 
                deliveryAPI.createItemOutLines(io, deliveryLines, function (err, res) {
                    if (err) return done(err);
                    done(null);
                }, test);
            });
        }, test);
    },
    createItemOutLines: function (itemOut, deliveryLines, done, test) {
        async.each(deliveryLines, function (line, callback) {
            dbCon.getConnection(function (err, conn) {
                if (err) return callback(err);
                var iol = {
                    itemOutId: itemOut.itemOutId,
                    itemId: line.itemId,
                    quantity: line.quantity
                };
                var sql = "INSERT INTO item_out_line SET ?";
                sql = mysql.format(sql, iol);
                conn.query(sql, function (err) {
                    dbCon.closeConnection(conn);
                    if (err) return callback(err);
                    // update stocks
                    var stk = {
                        storeId: itemOut.storeId,
                        itemId: iol.itemId
                    };
                    stockDb.postUpdateStock(stk, function (err, res) {
                        if (err) return callback(err);
                        callback();
                    });
                });
            }, test);
        }, function (err) {
            if (err) return done(err);
            done();
        });
    }
}

// ----------------- AUXILIARY FUNCTIONS
// fnDeliveryDbToJs:
// transfors a db record into a js object
var fnDeliveryDbToJs = function (odb) {
    var o = odb;
    // add some properties
    o.id = odb.deliveryId;
    o.worker = {
        id: odb.workerId,
        name: odb.workerName
    };
    o.pw = {
        id: odb.pwId,
        name: odb.pwName
    };
    o.store = {
        id: odb.storeId,
        name: odb.storeName
    }
    // delete properties not needed
    delete o.deliveryId;
    delete o.workerId;
    delete o.pwId;
    delete o.storeId;
    delete o.workerName;
    delete o.pwName;
    delete o.storeName;
    return o;
}

// fnDeliveryJsToDb
// transforms a js object into a db record
var fnDeliveryJsToDb = function (o) {
    var odb = o;
    // add properties
    odb.deliveryId = o.id;
    if (o.worker) odb.workerId = o.worker.id;
    if (o.pw) odb.pwId = o.pw.id;
    if (o.store) odb.storeId = o.store.id;
    // delete some properties
    delete odb.id;
    delete odb.worker;
    delete odb.pw;
    delete odb.store;
    return odb;
}

// fnCheckDelivery
// checks if the object has old properties needed
var fnCheckDelivery = function (u) {
    var check = true;
    check = (check && u.hasOwnProperty("id"));
    return check;
}

module.exports = deliveryAPI;