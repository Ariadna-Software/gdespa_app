var mysql = require('mysql'),
    util = require('./util'),
    dbCon = require('./db_connection');

// -------------------- MAIN API
var closureAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT cl.*, w.name AS workerName";
            sql += " FROM closure as cl";
            sql += " LEFT JOIN worker AS w ON w.workerId = cl.workerId";
            sql += " ORDER BY cl.closureDate DESC"
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var closures = [];
                res.forEach(function (udb) {
                    closures.push(fnClosureDbToJs(udb));
                });
                done(null, closures);
            });
        }, test);
    },
    getByName: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT cl.*, w.name AS workerName";
            sql += " FROM closure as cl";
            sql += " LEFT JOIN worker AS w ON w.workerId = cl.workerId";
            if (name && (name != '*')) {
                sql += " WHERE w.name LIKE '%" + name + "%'";
            }
            sql += " ORDER BY cl.closureDate DESC"
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var closures = [];
                res.forEach(function (udb) {
                    closures.push(fnClosureDbToJs(udb));
                });
                done(null, closures);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT cl.*, w.name AS workerName";
            sql += " FROM closure as cl";
            sql += " LEFT JOIN worker AS w ON w.workerId = cl.workerId";
            sql += " WHERE cl.closureId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var closures = [];
                res.forEach(function (udb) {
                    closures.push(fnClosureDbToJs(udb));
                });
                done(null, closures);
            });
        }, test);
    },
    getLastByPwId: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT *"
            sql += " FROM closure AS c";
            sql += " LEFT JOIN closure_line AS cl ON cl.closureId = c.closureId AND cl.pwId = ?";
            sql += " WHERE c.closureId IN (SELECT closureId FROM closure_line WHERE pwId = ?)";
            sql += " AND CLOSE = 1";
            sql += " ORDER BY closureDate DESC";
            sql += " LIMIT 1";
            sql = mysql.format(sql, [id, id]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, res);
            });
        }, test);
    },
    getReportClosures: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT c.closureId AS id, CONCAT(DATE_FORMAT(closureDate, '%d/%m/%Y'), ' ', w.name) AS name";
            sql += " FROM closure AS c";
            sql += " LEFT JOIN worker AS w ON w.workerId = c.workerId";
            sql += " WHERE c.close = 1";
            sql += " ORDER by closureDate DESC"
            con.query(sql, function (err, closures) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, closures);
            });
        }, test);
    },
    post: function (closure, done, test) {
        // controls closure properties
        if (!fnCheckClosure(closure)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnClosureJsToDb(closure);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO closure SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                if (err) return done(err);
                closure.closureId = res.insertId;
                sql = "INSERT INTO closure_line (closureId, pwId, estimate, done, amount)"
                sql += " SELECT ? AS closureId, pw.pwId, ROUND(COALESCE(d.c,0) / COALESCE(e.c,1), 2) AS estimate, ROUND(COALESCE(d.c,0) / COALESCE(e.c,1), 2) AS done, "
                sql += " pw.total * ROUND(COALESCE(d.c,0) / COALESCE(e.c,1), 2) AS amount";
                sql += " FROM pw";
                sql += " LEFT JOIN";
                sql += " (SELECT pwl.pwId AS p, SUM(pwl.quantity * cu.cost) AS c";
                sql += " FROM pw_line AS pwl";
                sql += " LEFT JOIN cunit AS cu ON cu.cunitId = pwl.cunitId";
                sql += " GROUP BY pwl.pwId) AS e ON e.p = pw.pwId";
                sql += " LEFT JOIN";
                sql += " (SELECT wo.pwId AS p, SUM(wol.quantity * cu.cost) AS c";
                sql += " FROM wo_line AS wol";
                sql += " LEFT JOIN wo ON wol.woId = wo.woId";
                sql += " LEFT JOIN cunit AS cu ON cu.cunitId = wol.cunitId";
                sql += " WHERE wo.initDate <= ? AND wo.closureId IS NULL"
                sql += " GROUP BY wo.pwId) AS d ON d.p = pw.pwId";
                sql += " WHERE pw.initInCharge = ?";
                sql += " AND ROUND(COALESCE(d.c,0) / COALESCE(e.c,1), 2) <= 1 AND ROUND(COALESCE(d.c,0) / COALESCE(e.c,1), 2) > 0";
                sql = mysql.format(sql, [closure.closureId, closure.closureDate, udb.workerId]);
                con.query(sql, function (err, res) {
                    dbCon.closeConnection(con);
                    if (err) return done(err);
                    done(null, fnClosureDbToJs(closure));
                });
            });
        }, test);
    },
    put: function (closure, done, test) {
        // controls closure properties
        if (!fnCheckClosure(closure)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        var udb = fnClosureJsToDb(closure);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE closure SET ? WHERE closureId = ?";
            sql = mysql.format(sql, [udb, udb.closureId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                // return object from db
                module.exports.getById(udb.closureId, function (err, res) {
                    if (err) return done(err);
                    done(null, res[0]);
                }, test);
            });
        }, test);
    },
    putClose: function (closure, done, test) {
        // controls closure properties
        if (!fnCheckClosure(closure)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        var udb = fnClosureJsToDb(closure);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE closure SET ? WHERE closureId = ?";
            sql = mysql.format(sql, [udb, udb.closureId]);
            con.query(sql, function (err, res) {
                if (err) return done(err);
                // update related wo
                sql = "UPDATE wo SET closureId = ? WHERE closureId IS NULL";
                sql += " AND wo.pwId IN (SELECT pwId FROM closure_line WHERE closureId = ?)"
                sql = mysql.format(sql, [udb.closureId, udb.closureId]);
                con.query(sql, function (err, res) {
                    if (err) return done(err);
                    con.query(sql, function (err, res) {
                        if (err) return done(err);
                        // update related wo
                        sql = "UPDATE mo SET closureId = ? WHERE closureId IS NULL";
                        sql += " AND mo.workerId = ?"
                        sql += " AND mo.initDate <= ?";
                        sql = mysql.format(sql, [udb.closureId, udb.workerId, udb.closureDate]);
                        con.query(sql, function (err, res) {
                            if (err) return done(err);
                            dbCon.closeConnection(con);
                            module.exports.getById(udb.closureId, function (err, res) {
                                if (err) return done(err);
                                done(null, res[0]);
                            }, test);
                        }, test);
                    });
                }, test);
            });
        }, test);
    },
    delete: function (closure, done, test) {
        var udb = fnClosureJsToDb(closure);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM closure WHERE closureId = ?";
            sql = mysql.format(sql, udb.closureId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    }
}

// ----------------- AUXILIARY FUNCTIONS
// fnClosureDbToJs:
// transfors a db record into a js object
var fnClosureDbToJs = function (odb) {
    var o = odb;
    // add some properties
    o.id = odb.closureId;
    o.worker = {
        id: odb.workerId,
        name: odb.workerName
    };
    // delete properties not needed
    delete o.closureId;
    delete odb.workerId;
    delete o.workerName;
    // format dates without time zone
    o.closureDate = util.serverParseDate(o.closureDate);
    return o;
}

// fnClosureJsToDb
// transforms a js object into a db record
var fnClosureJsToDb = function (o) {
    var odb = o;
    // add properties
    odb.closureId = o.id;
    if (o.worker) odb.workerId = o.worker.id;
    // delete some properties
    delete odb.id;
    delete odb.worker;
    return odb;
}

// fnCheckClosure
// checks if the object has old properties needed
var fnCheckClosure = function (u) {
    var check = true;
    check = (check && u.hasOwnProperty("id"));
    return check;
}

module.exports = closureAPI;