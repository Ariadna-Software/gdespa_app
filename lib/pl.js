var mysql = require('mysql'),
    util = require('./util');
dbCon = require('./db_connection');

// -------------------- MAIN API
var plAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT pl.*, pw.name AS pwName, w.name AS workerName, pw.zoneId, pw.zoneId2";
            sql += " FROM pl";
            sql += " LEFT JOIN pw ON pw.pwId = pl.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = pl.workerId";
            sql += " WHERE pl.plId NOT IN (SELECT plId FROM wo WHERE NOT plId IS NULL)";
            sql += " ORDER BY pl.initDate";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var pls = [];
                res.forEach(function (udb) {
                    pls.push(fnWoDbToJs(udb));
                });
                done(null, pls);
            });
        }, test);
    },
    getAll: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT pl.*, pw.name AS pwName, w.name AS workerName, pw.zoneId, pw.zoneId2";
            sql += " FROM pl";
            sql += " LEFT JOIN pw ON pw.pwId = pl.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = pl.workerId";
            sql += " ORDER BY pl.initDate";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var pls = [];
                res.forEach(function (udb) {
                    pls.push(fnWoDbToJs(udb));
                });
                done(null, pls);
            });
        }, test);
    },
    getByName: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT pl.*, pw.name AS pwName, w.name AS workerName, pw.zoneId, pw.zoneId2";
            sql += " FROM pl";
            sql += " LEFT JOIN pw ON pw.pwId = pl.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = pl.workerId";
            if (name && (name != '*')) {
                sql += " WHERE pw.name LIKE '%" + name + "%'";
                sql += " AND pl.closureId IS NULL"
            } else {
                sql += " WHERE pl.closureId IS NULL"
            }
            sql += " ORDER BY pl.initDate DESC";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var pls = [];
                res.forEach(function (udb) {
                    pls.push(fnWoDbToJs(udb));
                });
                done(null, pls);
            });
        }, test);
    },
    getByNameAll: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT pl.*, pw.name AS pwName, w.name AS workerName";
            sql += " FROM pl";
            sql += " LEFT JOIN pw ON pw.pwId = pl.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = pl.workerId";
            if (name && (name != '*')) {
                sql += " WHERE pw.name LIKE '%" + name + "%'";
            }
            sql += " ORDER BY pl.initDate DESC";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var pls = [];
                res.forEach(function (udb) {
                    pls.push(fnWoDbToJs(udb));
                });
                done(null, pls);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT pl.*, pw.name AS pwName, w.name AS workerName";
            sql += " FROM pl";
            sql += " LEFT JOIN pw ON pw.pwId = pl.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = pl.workerId";
            sql += " WHERE pl.plId = ?";
            sql += " ORDER BY pl.initDate DESC";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var pls = [];
                res.forEach(function (udb) {
                    pls.push(fnWoDbToJs(udb));
                });
                done(null, pls);
            });
        }, test);
    },
    getByTotalQuantityId: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT COALESCE(SUM(quantity),0) AS t FROM pl_line WHERE plId = ?";
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
            var sql = "SELECT pl.*, pw.name AS pwName, w.name AS workerName";
            sql += " FROM pl";
            sql += " LEFT JOIN pw ON pw.pwId = pl.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = pl.workerId";
            sql += " WHERE pl.closureId = ?";
            sql += " ORDER BY pl.initDate DESC";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var pls = [];
                res.forEach(function (udb) {
                    pls.push(fnWoDbToJs(udb));
                });
                done(null, pls);
            });
        }, test);
    },
    getByClosureId2: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT pl.*, pw.name AS pwName, w.name AS workerName";
            sql += " FROM pl";
            sql += " LEFT JOIN pw ON pw.pwId = pl.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = pl.workerId";
            sql += " LEFT JOIN closure AS c ON c.closureId = ?"
            sql += " WHERE pl.pwId IN (SELECT pwId FROM closure_line WHERE closureId = ?)";
            sql += " AND pl.initDate <= c.closureDate";
            sql += " AND pl.closureId IS NULL";
            sql += " ORDER BY pl.initDate DESC";
            sql = mysql.format(sql, [id, id]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var pls = [];
                res.forEach(function (udb) {
                    pls.push(fnWoDbToJs(udb));
                });
                done(null, pls);
            });
        }, test);
    },
    post: function (pl, done, test) {
        // controls pl properties
        if (!fnCheckWo(pl)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnWoJsToDb(pl);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO pl SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                pl.plId = res.insertId;
                done(null, fnWoDbToJs(pl));
            });
        }, test);
    },
    postGenerated: function (pl, done, test) {
        // controls pl properties
        if (!fnCheckWo(pl)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnWoJsToDb(pl);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO pl SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                if (err) return done(err);
                pl.plId = res.insertId;
                sql = "INSERT INTO pl_line (plId, cunitId, estimate, done, quantity, chapterId, pwLineId, prevPlanned, unitCost)";
                sql += " SELECT ";
                sql +=  pl.plId + " AS plId, pwl.cunitId, pwl.quantity AS estimate, calc.done, 0,  pwl.chapterId, pwl.pwLineId, pln.prevPlanned, COALESCE(cost * k, 0) as pwlCost";
                sql += " FROM pw_line AS pwl";
                sql += " LEFT JOIN ";
                sql += " (SELECT wol.pwLineId, SUM(wol.quantity) AS done FROM wo_line AS wol WHERE NOT pwLineId IS NULL GROUP BY wol.pwLineId)";
                sql += " AS calc ON calc.pwLineId = pwl.pwLineId";
                sql += " LEFT JOIN ("
                sql += " SELECT pll.pwLineId, COALESCE(SUM(pll.quantity), 0) AS prevPlanned ";
                sql += " FROM pl_line AS pll ";
                sql += " LEFT JOIN pl ON pl.plId = pll.plId";
                sql += " WHERE pl.initDate < ?";
                sql += " GROUP BY pwLineId) AS pln ON pln.pwLineId = pwl.pwLineId";
                sql += " WHERE pwl.pwId = ?";
                sql = mysql.format(sql,[udb.initDate, pl.pwId]);
                con.query(sql, function (err, res) {
                    if (err) return done(err);
                    done(null, { id: pl.plId });
                }, test);
            });
        }, test);
    },
    postGeneratedWorker: function (pl, done, test) {
        // controls pl properties
        if (!fnCheckWo(pl)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnWoJsToDb(pl);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO pl SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                if (err) return done(err);
                pl.plId = res.insertId;
                sql = "INSERT INTO pl_plrker (plId, plrkerId)";
                sql += " SELECT " + pl.plId + " AS plId, pww.plrkerId";
                sql += " FROM pw_plrker AS pww";
                sql += " WHERE pww.pwId = ?";
                sql = mysql.format(sql, pl.pwId);
                con.query(sql, function (err, res) {
                    dbCon.closeConnection(con);
                    if (err) return done(err);
                    done(null, fnWoDbToJs(pl));
                }, test);
            });
        }, test);
    },
    postCreateWoFromPl: function (plId, teamId, pwId, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO wo (pwId, initDate, endDate, workerId, comments, teamId, zoneId, plId)";
            sql += " SELECT pwId, initDate, endDate, workerId, comments, teamId, zoneId, plId";
            sql += " FROM pl";
            sql += " WHERE plId = ?";
            sql = mysql.format(sql, plId);
            con.query(sql, function (err, res) {
                if (err) {
                    con.end();
                    return done(err);
                }
                var woId = res.insertId;
                sql = "INSERT INTO wo_line (woId, cunitId, estimate, done, quantity, chapterId, pwLineId, planned, plLineId)";
                sql += " SELECT  ?, pll.cunitId, pll.estimate,dl.done, 0, pll.chapterId, pll.pwLineId, pll.quantity, pll.plLineId";
                sql += " FROM pl_line AS pll";
                sql += " LEFT JOIN (SELECT pwLineId, SUM(quantity) AS done";
                sql += " FROM wo_line";
                sql += " WHERE NOT pwLineId IS NULL";
                sql += " GROUP BY pwLineId) AS dl ON dl.pwLineId = pll.pwLineId";
                sql += " WHERE  pll.plId = ?";
                sql = mysql.format(sql, [woId, plId]);
                con.query(sql, function (err, res) {
                    if (err) return done(err);
                    if (teamId) {
                        sql = "INSERT INTO wo_worker (woId, workerId)";
                        sql += " SELECT " + woId + " AS woId, tl.workerId";
                        sql += " FROM team_line AS tl";
                        sql += " WHERE tl.teamId = ?";
                        sql = mysql.format(sql, teamId);
                    } else {
                        sql = "INSERT INTO wo_worker (woId, workerId)";
                        sql += " SELECT " + woId + " AS woId, pww.workerId";
                        sql += " FROM pw_worker AS pww";
                        sql += " WHERE pww.pwId = ?";
                        sql = mysql.format(sql, pwId);
                    }
                    con.query(sql, function (err, res) {
                        con.end();
                        if (err) return done(err);
                        done(null, { id: woId });
                    }, test);
                }, test);
            });
        }, test);
    },
    put: function (pl, done, test) {
        // controls pl properties
        if (!fnCheckWo(pl)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        var udb = fnWoJsToDb(pl);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE pl SET ? WHERE plId = ?";
            sql = mysql.format(sql, [udb, udb.plId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                // return object from db
                module.exports.getById(udb.plId, function (err, res) {
                    if (err) return done(err);
                    done(null, res[0]);
                }, test);
            });
        }, test);
    },
    delete: function (pl, done, test) {
        var udb = fnWoJsToDb(pl);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM pl WHERE plId = ?";
            sql = mysql.format(sql, udb.plId);
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
    o.id = odb.plId;
    o.pw = {
        id: odb.pwId,
        name: odb.pwName
    };
    o.worker = {
        id: odb.workerId,
        name: odb.workerName
    };
    // delete properties not needed
    delete o.plId;
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
    odb.plId = o.id;
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

module.exports = plAPI;