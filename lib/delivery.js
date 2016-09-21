var mysql = require('mysql'),
    dbCon = require('./db_connection');

// -------------------- MAIN API
var deliveryAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT d.*, pw.name AS pwName, w.name AS workerName";
            sql += " FROM delivery AS d";
            sql += " LEFT JOIN pw AS pw ON pw.pwId = d.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = d.workerId";
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
            var sql = "SELECT d.*, pw.name AS pwName, w.name AS workerName";
            sql += " FROM delivery AS d";
            sql += " LEFT JOIN pw AS pw ON pw.pwId = d.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = d.workerId";
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
            var sql = "SELECT d.*, pw.name AS pwName, w.name AS workerName";
            sql += " FROM delivery AS d";
            sql += " LEFT JOIN pw AS pw ON pw.pwId = d.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = d.workerId";
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
            var sql = "SELECT d.*, pw.name AS pwName, w.name AS workerName";
            sql += " FROM delivery AS d";
            sql += " LEFT JOIN pw AS pw ON pw.pwId = d.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = d.workerId";
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
                sql += " SELECT " + delivery.deliveryId + " AS deliveryId, cul.itemId, (cul.quantity * pwl.quantity) AS estimate, 0 AS done, 0 AS quantity";
                sql += " FROM pw";
                sql += " LEFT JOIN pw_line AS pwl ON pwl.pwId = pw.pwId";
                sql += " LEFT JOIN cunit AS cu ON cu.cunitId = pwl.cunitId";
                sql += " LEFT JOIN cunit_line AS cul ON cul.cunitId = cu.cunitId";
                sql += " WHERE pw.pwId = ?";
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
    // delete properties not needed
    delete o.deliveryId;
    delete o.workerId;
    delete o.pwId;
    delete o.workerName;
    delete o.pwName;
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
    // delete some properties
    delete odb.id;
    delete odb.worker;
    delete odb.pw;
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