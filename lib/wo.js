var mysql = require('mysql'),
    util = require('./util');
dbCon = require('./db_connection');

// -------------------- MAIN API
var woAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT wo.*, pw.name AS pwName, w.name AS workerName, pw.zoneId, pw.zoneId2";
            sql += " FROM wo";
            sql += " LEFT JOIN pw ON pw.pwId = wo.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = wo.workerId";
            sql += " WHERE wo.closureId IS NULL";
            sql += " ORDER BY wo.initDate DESC";
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
            var sql = "SELECT wo.*, pw.name AS pwName, w.name AS workerName, pw.zoneId, pw.zoneId2";
            sql += " FROM wo";
            sql += " LEFT JOIN pw ON pw.pwId = wo.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = wo.workerId";
            sql += " ORDER BY wo.initDate DESC";
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
            var sql = "SELECT wo.*, pw.name AS pwName, w.name AS workerName, pw.zoneId, pw.zoneId2";
            sql += " FROM wo";
            sql += " LEFT JOIN pw ON pw.pwId = wo.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = wo.workerId";
            if (name && (name != '*')) {
                sql += " WHERE pw.name LIKE '%" + name + "%'";
                sql += " AND wo.closureId IS NULL"
            } else {
                sql += " WHERE wo.closureId IS NULL"
            }
            sql += " ORDER BY wo.initDate DESC";
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
            sql += " ORDER BY wo.initDate DESC";
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
            sql += " ORDER BY wo.initDate DESC";
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
    getByTotalQuantityId: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT COALESCE(SUM(quantity),0) AS t FROM wo_line WHERE woId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, res);
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
            sql += " ORDER BY wo.initDate DESC";
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
    getByClosureId2: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT wo.*, pw.name AS pwName, w.name AS workerName";
            sql += " FROM wo";
            sql += " LEFT JOIN pw ON pw.pwId = wo.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = wo.workerId";
            sql += " LEFT JOIN closure AS c ON c.closureId = ?"
            sql += " WHERE wo.pwId IN (SELECT pwId FROM closure_line WHERE closureId = ?)";
            sql += " AND wo.initDate <= c.closureDate";
            sql += " AND wo.closureId IS NULL";
            sql += " ORDER BY wo.initDate DESC";
            sql = mysql.format(sql, [id, id]);
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
                sql = "INSERT INTO wo_line (woId, cunitId, estimate, done, quantity, chapterId, pwLineId)";
                sql += " SELECT ";
                sql +=  wo.woId + " AS woId, pwl.cunitId, pwl.quantity AS estimate, calc.done, 0,  pwl.chapterId, pwl.pwLineId";
                sql += " FROM pw_line AS pwl";
                sql += " LEFT JOIN ";
                sql += " (SELECT wol.pwLineId, SUM(wol.quantity) AS done FROM wo_line AS wol WHERE NOT pwLineId IS NULL GROUP BY wol.pwLineId)";
                sql += " AS calc ON calc.pwLineId = pwl.pwLineId";
                sql += " WHERE pwl.pwId = ?";
                sql = mysql.format(sql, wo.pwId);
                con.query(sql, function (err, res) {
                    if (err) return done(err);
                    if (wo.teamId) {
                        sql = "INSERT INTO wo_worker (woId, workerId)";
                        sql += " SELECT " + wo.woId + " AS woId, tl.workerId";
                        sql += " FROM team_line AS tl";
                        sql += " WHERE tl.teamId = ?";
                        sql = mysql.format(sql, wo.teamId);
                    } else {
                        sql = "INSERT INTO wo_worker (woId, workerId)";
                        sql += " SELECT " + wo.woId + " AS woId, pww.workerId";
                        sql += " FROM pw_worker AS pww";
                        sql += " WHERE pww.pwId = ?";
                        sql = mysql.format(sql, wo.pwId);
                    }
                    con.query(sql, function (err, res) {
                        dbCon.closeConnection(con);
                        if (err) return done(err);
                        done(null, fnWoDbToJs(wo));
                    }, test);
                }, test);
            });
        }, test);
    },
    postGeneratedWorker: function (wo, done, test) {
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
                sql = "INSERT INTO wo_worker (woId, workerId)";
                sql += " SELECT " + wo.woId + " AS woId, pww.workerId";
                sql += " FROM pw_worker AS pww";
                sql += " WHERE pww.pwId = ?";
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
    o.initDate = util.serverParseDate(o.initDate);
    o.endDate = util.serverParseDate(o.endDate);
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