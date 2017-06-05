var mysql = require('mysql'),
    util = require('./util');
dbCon = require('./db_connection');

// -------------------- MAIN API
var moAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mo.*, pw.name AS pwName, w.name AS workerName";
            sql += " FROM mo";
            sql += " LEFT JOIN pw ON pw.pwId = mo.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = mo.workerId";
            sql += " WHERE mo.closureId IS NULL"
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var mos = [];
                res.forEach(function (udb) {
                    mos.push(fnWoDbToJs(udb));
                });
                done(null, mos);
            });
        }, test);
    },
    getAll: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mo.*, pw.name AS pwName, w.name AS workerName";
            sql += " FROM mo";
            sql += " LEFT JOIN pw ON pw.pwId = mo.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = mo.workerId";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var mos = [];
                res.forEach(function (udb) {
                    mos.push(fnWoDbToJs(udb));
                });
                done(null, mos);
            });
        }, test);
    },
    getByName: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mo.*, pw.name AS pwName, w.name AS workerName";
            sql += " FROM mo";
            sql += " LEFT JOIN pw ON pw.pwId = mo.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = mo.workerId";
            if (name && (name != '*')) {
                sql += " WHERE pw.name LIKE '%" + name + "%'";
                sql += " AND mo.closureId IS NULL"
            } else {
                sql += " WHERE mo.closureId IS NULL"
            }
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var mos = [];
                res.forEach(function (udb) {
                    mos.push(fnWoDbToJs(udb));
                });
                done(null, mos);
            });
        }, test);
    },
    getByNameAll: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mo.*, pw.name AS pwName, w.name AS workerName";
            sql += " FROM mo";
            sql += " LEFT JOIN pw ON pw.pwId = mo.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = mo.workerId";
            if (name && (name != '*')) {
                sql += " WHERE pw.name LIKE '%" + name + "%'";
            }
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var mos = [];
                res.forEach(function (udb) {
                    mos.push(fnWoDbToJs(udb));
                });
                done(null, mos);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mo.*, pw.name AS pwName, w.name AS workerName";
            sql += " FROM mo";
            sql += " LEFT JOIN pw ON pw.pwId = mo.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = mo.workerId";
            sql += " WHERE mo.moId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var mos = [];
                res.forEach(function (udb) {
                    mos.push(fnWoDbToJs(udb));
                });
                done(null, mos);
            });
        }, test);
    },
    getByClosureId: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mo.*, pw.name AS pwName, w.name AS workerName";
            sql += " FROM mo";
            sql += " LEFT JOIN pw ON pw.pwId = mo.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = mo.workerId";
            sql += " WHERE mo.closureId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var mos = [];
                res.forEach(function (udb) {
                    mos.push(fnWoDbToJs(udb));
                });
                done(null, mos);
            });
        }, test);
    },
    getByClosureId2: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mo.*, pw.name AS pwName, w.name AS workerName";
            sql += " FROM mo";
            sql += " LEFT JOIN pw ON pw.pwId = mo.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = mo.workerId";
            sql += " LEFT JOIN closure AS c ON c.closureId = ?"
            sql += " WHERE mo.pwId IN (SELECT pwId FROM closure_line WHERE closureId = ?)";
            sql += " AND mo.initDate <= c.closureDate";
            sql += " AND mo.closureId IS NULL";
            sql = mysql.format(sql, [id, id]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var mos = [];
                res.forEach(function (udb) {
                    mos.push(fnWoDbToJs(udb));
                });
                done(null, mos);
            });
        }, test);
    },
    post: function (mo, done, test) {
        // controls mo properties
        if (!fnCheckWo(mo)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnWoJsToDb(mo);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO mo SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                mo.moId = res.insertId;
                done(null, fnWoDbToJs(mo));
            });
        }, test);
    },
    postGenerated: function (mo, done, test) {
        // controls mo properties
        if (!fnCheckWo(mo)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnWoJsToDb(mo);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO mo SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                if (err) return done(err);
                mo.moId = res.insertId;
                sql = "INSERT INTO mo_line (moId, cunitId, estimate, done, quantity, chapterId)";
                sql += " SELECT DISTINCT " + mo.moId + " AS moId, calc.cunitId, calc.estimate, calc.done, 0 AS quantity, calc.chapterId";
                sql += " FROM";
                sql += " (SELECT pwl.pwId, cu.cunitId, cu.name, COALESCE(e.estimate,0) AS estimate, COALESCE(d.done,0) AS done, pwl.chapterId";
                sql += " FROM pw_line AS pwl";
                sql += " LEFT JOIN cunit AS cu ON cu.cunitId = pwl.cunitId";
                sql += " LEFT JOIN (SELECT pwId, cunitId, SUM(quantity) AS estimate FROM pw_line GROUP BY pwId, chapterId, cunitId)";
                sql += " AS e ON (e.pwId = pwl.pwId AND e.cunitId = cu.cunitId)";
                sql += " LEFT JOIN (SELECT pwId, cunitId, SUM(quantity) AS done FROM mo_line LEFT JOIN mo ON mo.moId = mo_line.moId GROUP BY pwId, chapterId, cunitId)";
                sql += " AS d ON (d.pwId = pwl.pwId AND d.cunitId = cu.cunitId)) AS calc";
                sql += " WHERE calc.pwId = ?"
                sql = mysql.format(sql, mo.pwId);
                con.query(sql, function (err, res) {
                    if (err) return done(err);
                    if (mo.teamId) {
                        sql = "INSERT INTO mo_worker (moId, workerId)";
                        sql += " SELECT " + mo.moId + " AS moId, tl.morkerId";
                        sql += " FROM team_line AS tl";
                        sql += " WHERE tl.teamId = ?";
                        sql = mysql.format(sql, mo.teamId);
                    } else {
                        sql = "INSERT INTO mo_morker (moId, workerId)";
                        sql += " SELECT " + mo.moId + " AS moId, pww.workerId";
                        sql += " FROM pw_morker AS pww";
                        sql += " WHERE pww.pwId = ?";
                        sql = mysql.format(sql, mo.pwId);
                    }

                    con.query(sql, function (err, res) {
                        dbCon.closeConnection(con);
                        if (err) return done(err);
                        done(null, fnWoDbToJs(mo));
                    }, test);
                }, test);
            });
        }, test);
    },
    postGeneratedWorker: function (mo, done, test) {
        // controls mo properties
        if (!fnCheckWo(mo)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnWoJsToDb(mo);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO mo SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                if (err) return done(err);
                mo.moId = res.insertId;
                sql = "INSERT INTO mo_worker (moId, workerId)";
                sql += " SELECT " + mo.moId + " AS moId, pww.workerId";
                sql += " FROM pw_worker AS pww";
                sql += " WHERE pww.pwId = ?";
                sql = mysql.format(sql, mo.pwId);
                con.query(sql, function (err, res) {
                    dbCon.closeConnection(con);
                    if (err) return done(err);
                    done(null, fnWoDbToJs(mo));
                }, test);
            });
        }, test);
    },
    put: function (mo, done, test) {
        // controls mo properties
        if (!fnCheckWo(mo)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        var udb = fnWoJsToDb(mo);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE mo SET ? WHERE moId = ?";
            sql = mysql.format(sql, [udb, udb.moId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                // return object from db
                module.exports.getById(udb.moId, function (err, res) {
                    if (err) return done(err);
                    done(null, res[0]);
                }, test);
            });
        }, test);
    },
    delete: function (mo, done, test) {
        var udb = fnWoJsToDb(mo);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM mo WHERE moId = ?";
            sql = mysql.format(sql, udb.moId);
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
    o.id = odb.moId;
    o.pw = {
        id: odb.pwId,
        name: odb.pwName
    };
    o.worker = {
        id: odb.workerId,
        name: odb.workerName
    };
    // delete properties not needed
    delete o.moId;
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
    odb.moId = o.id;
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

module.exports = moAPI;