var mysql = require('mysql'),
    dbCon = require('./db_connection');

// -------------------- MAIN API
var woAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT wo.*, pw.name AS pwName, w.name AS workerName";
            sql += " FROM wo";
            sql += " LEFT JOIN pw ON pw.pwId = wo.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = wo.workerId";
            sql += " WHERE wo.closureId IS NULL"
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var wos = [];
                res.forEach(function (udb) {
                    wos.push(fnWoDbToJs(udb));
                });
                done(null, wos);
            });
        }, test);
    },
    getAll: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT wo.*, pw.name AS pwName, w.name AS workerName";
            sql += " FROM wo";
            sql += " LEFT JOIN pw ON pw.pwId = wo.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = wo.workerId";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var wos = [];
                res.forEach(function (udb) {
                    wos.push(fnWoDbToJs(udb));
                });
                done(null, wos);
            });
        }, test);
    },
    getByName: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT wo.*, pw.name AS pwName, w.name AS workerName";
            sql += " FROM wo";
            sql += " LEFT JOIN pw ON pw.pwId = wo.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = wo.workerId";
            if (name && (name != '*')) {
                sql += " WHERE pw.name LIKE '%" + name + "%'";
                sql += " AND wo.closureId IS NULL"
            } else {
                sql += " WHERE wo.closureId IS NULL"
            }
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var wos = [];
                res.forEach(function (udb) {
                    wos.push(fnWoDbToJs(udb));
                });
                done(null, wos);
            });
        }, test);
    },
    getByNameAll: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT wo.*, pw.name AS pwName, w.name AS workerName";
            sql += " FROM wo";
            sql += " LEFT JOIN pw ON pw.pwId = wo.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = wo.workerId";
            if (name && (name != '*')) {
                sql += " WHERE pw.name LIKE '%" + name + "%'";
            }
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var wos = [];
                res.forEach(function (udb) {
                    wos.push(fnWoDbToJs(udb));
                });
                done(null, wos);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT wo.*, pw.name AS pwName, w.name AS workerName";
            sql += " FROM wo";
            sql += " LEFT JOIN pw ON pw.pwId = wo.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = wo.workerId";
            sql += " WHERE wo.woId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var wos = [];
                res.forEach(function (udb) {
                    wos.push(fnWoDbToJs(udb));
                });
                done(null, wos);
            });
        }, test);
    },
    getByClosureId: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT wo.*, pw.name AS pwName, w.name AS workerName";
            sql += " FROM wo";
            sql += " LEFT JOIN pw ON pw.pwId = wo.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = wo.workerId";
            sql += " WHERE wo.closureId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var wos = [];
                res.forEach(function (udb) {
                    wos.push(fnWoDbToJs(udb));
                });
                done(null, wos);
            });
        }, test);
    },
    post: function (wo, done, test) {
        // controls wo properties
        if (!fnCheckWo(wo)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnWoJsToDb(wo);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO wo SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                wo.woId = res.insertId;
                done(null, fnWoDbToJs(wo));
            });
        }, test);
    },
    postGenerated: function (wo, done, test) {
        // controls wo properties
        if (!fnCheckWo(wo)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnWoJsToDb(wo);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO wo SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                if (err) return done(err);
                wo.woId = res.insertId;
                sql = "INSERT INTO wo_line (woId, cunitId, estimate, done, quantity)";
                sql += " SELECT " + wo.woId + " AS woId, cu.cunitId, pwl.quantity AS estimate, 0 AS done, 0 AS quantity";
                sql += " FROM pw";
                sql += " LEFT JOIN pw_line AS pwl ON pwl.pwId = pw.pwId";
                sql += " LEFT JOIN cunit AS cu ON cu.cunitId = pwl.cunitId";
                sql += " WHERE pw.pwId = ?";
                sql = mysql.format(sql, wo.pwId);
                con.query(sql, function (err, res) {
                    dbCon.closeConnection(con);
                    if (err) return done(err);
                    done(null, fnWoDbToJs(wo));
                }, test);
            });
        }, test);
    },
    put: function (wo, done, test) {
        // controls wo properties
        if (!fnCheckWo(wo)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        var udb = fnWoJsToDb(wo);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE wo SET ? WHERE woId = ?";
            sql = mysql.format(sql, [udb, udb.woId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                // return object from db
                module.exports.getById(udb.woId, function (err, res) {
                    if (err) return done(err);
                    done(null, res[0]);
                }, test);
            });
        }, test);
    },
    delete: function (wo, done, test) {
        var udb = fnWoJsToDb(wo);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM wo WHERE woId = ?";
            sql = mysql.format(sql, udb.woId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    }
}

// ----------------- AUXILIARY FUNCTIONS
// fnWoDbToJs:
// transfors a db record into a js object
var fnWoDbToJs = function (odb) {
    var o = odb;
    // add some properties
    o.id = odb.woId;
    o.pw = {
        id: odb.pwId,
        name: odb.pwName
    };
    o.worker = {
        id: odb.workerId,
        name: odb.workerName
    };
    // delete properties not needed
    delete o.woId;
    delete odb.pwId;
    delete odb.workerId;
    delete o.pwName;
    delete o.workerName;
    return o;
}

// fnWoJsToDb
// transforms a js object into a db record
var fnWoJsToDb = function (o) {
    var odb = o;
    // add properties
    odb.woId = o.id;
    if (o.pw) odb.pwId = o.pw.id;
    if (o.worker) odb.workerId = o.worker.id;
    // delete some properties
    delete odb.id;
    delete odb.pw;
    delete odb.worker;
    return odb;
}

// fnCheckWo
// checks if the object has old properties needed
var fnCheckWo = function (u) {
    var check = true;
    check = (check && u.hasOwnProperty("id"));
    return check;
}

module.exports = woAPI;