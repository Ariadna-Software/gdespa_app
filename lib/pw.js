var mysql = require('mysql'),
    dbCon = require('./db_connection');

// -------------------- MAIN API
var pwAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT p.*, c.name AS companyName, w.name AS initInChargeName, s.name as statusName,";
            sql += " w1.name as acepInChargeName, w2.name as finInChargeName, w3.name as cerInChargeName,";
            sql += " w4.name as invInChargeName, w5.name as payInChargeName, z.name as zoneName";
            sql += " FROM pw AS p";
            sql += " LEFT JOIN company AS c ON c.companyId = p.companyId";
            sql += " LEFT JOIN worker AS w ON w.workerId = p.initInCharge";
            sql += " LEFT JOIN worker AS w1 ON w1.workerId = p.acepInCharge";
            sql += " LEFT JOIN worker AS w2 ON w2.workerId = p.finInCharge";
            sql += " LEFT JOIN worker AS w3 ON w3.workerId = p.cerInCharge";
            sql += " LEFT JOIN worker AS w4 ON w4.workerId = p.invInCharge";
            sql += " LEFT JOIN worker AS w5 ON w5.workerId = p.payInCharge";
            sql += " LEFT JOIN status AS s ON s.statusId = p.statusId";
            sql += " LEFT JOIN zone AS z ON z.zoneId = p.zoneId";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var pws = [];
                res.forEach(function (udb) {
                    pws.push(fnpwDbToJs(udb));
                });
                done(null, pws);
            });
        }, test);
    },
    getActive: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT p.*, c.name AS companyName, w.name AS initInChargeName, s.name as statusName,";
            sql += " w1.name as acepInChargeName, w2.name as finInChargeName, w3.name as cerInChargeName,";
            sql += " w4.name as invInChargeName, w5.name as payInChargeName, z.name as zoneName";
            sql += " FROM pw AS p";
            sql += " LEFT JOIN company AS c ON c.companyId = p.companyId";
            sql += " LEFT JOIN worker AS w ON w.workerId = p.initInCharge";
            sql += " LEFT JOIN worker AS w1 ON w1.workerId = p.acepInCharge";
            sql += " LEFT JOIN worker AS w2 ON w2.workerId = p.finInCharge";
            sql += " LEFT JOIN worker AS w3 ON w3.workerId = p.cerInCharge";
            sql += " LEFT JOIN worker AS w4 ON w4.workerId = p.invInCharge";
            sql += " LEFT JOIN worker AS w5 ON w5.workerId = p.payInCharge";
            sql += " LEFT JOIN status AS s ON s.statusId = p.statusId";
            sql += " LEFT JOIN zone AS z ON z.zoneId = p.zoneId";
            sql += " WHERE p.statusId = 1";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var pws = [];
                res.forEach(function (udb) {
                    pws.push(fnpwDbToJs(udb));
                });
                done(null, pws);
            });
        }, test);
    },
    getByName: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT p.*, c.name AS companyName, w.name AS initInChargeName, s.name as statusName,";
            sql += " w1.name as acepInChargeName, w2.name as finInChargeName, w3.name as cerInChargeName,";
            sql += " w4.name as invInChargeName, w5.name as payInChargeName, z.name as zoneName";
            sql += " FROM pw AS p";
            sql += " LEFT JOIN company AS c ON c.companyId = p.companyId";
            sql += " LEFT JOIN worker AS w ON w.workerId = p.initInCharge";
            sql += " LEFT JOIN worker AS w1 ON w1.workerId = p.acepInCharge";
            sql += " LEFT JOIN worker AS w2 ON w2.workerId = p.finInCharge";
            sql += " LEFT JOIN worker AS w3 ON w3.workerId = p.cerInCharge";
            sql += " LEFT JOIN worker AS w4 ON w4.workerId = p.invInCharge";
            sql += " LEFT JOIN worker AS w5 ON w5.workerId = p.payInCharge";
            sql += " LEFT JOIN status AS s ON s.statusId = p.statusId";
            sql += " LEFT JOIN zone AS z ON z.zoneId = p.zoneId";
            if (name && (name != '*')) {
                sql += " WHERE p.name LIKE '%" + name + "%'";
            }
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var pws = [];
                res.forEach(function (udb) {
                    pws.push(fnpwDbToJs(udb));
                });
                done(null, pws);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT p.*, c.name AS companyName, w.name AS initInChargeName, s.name as statusName,";
            sql += " w1.name as acepInChargeName, w2.name as finInChargeName, w3.name as cerInChargeName,";
            sql += " w4.name as invInChargeName, w5.name as payInChargeName, z.name as zoneName";
            sql += " FROM pw AS p";
            sql += " LEFT JOIN company AS c ON c.companyId = p.companyId";
            sql += " LEFT JOIN worker AS w ON w.workerId = p.initInCharge";
            sql += " LEFT JOIN worker AS w1 ON w1.workerId = p.acepInCharge";
            sql += " LEFT JOIN worker AS w2 ON w2.workerId = p.finInCharge";
            sql += " LEFT JOIN worker AS w3 ON w3.workerId = p.cerInCharge";
            sql += " LEFT JOIN worker AS w4 ON w4.workerId = p.invInCharge";
            sql += " LEFT JOIN worker AS w5 ON w5.workerId = p.payInCharge";
            sql += " LEFT JOIN status AS s ON s.statusId = p.statusId";
            sql += " LEFT JOIN zone AS z ON z.zoneId = p.zoneId";            
            sql += " WHERE p.pwId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var pws = [];
                res.forEach(function (udb) {
                    pws.push(fnpwDbToJs(udb));
                });
                done(null, pws);
            });
        }, test);
    },
    getWoByPw: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT wo.*, w.name AS workerName";
            sql += " FROM wo";
            sql += " LEFT JOIN worker AS w ON w.workerId = wo.workerId";
            sql += " WHERE wo.pwId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, res);
            });
        }, test);
    },
    getPerById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT pw.pwId, e.c as estimate, d.c as done, ROUND(COALESCE(d.c,0) / COALESCE(e.c,1), 2) as percentage";
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
            sql += " GROUP BY wo.pwId) AS d ON d.p = pw.pwId";
            sql += " WHERE pw.pwId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, res);
            });
        }, test);
    },
    post: function (pw, done, test) {
        // controls pw properties
        if (!fnCheckpw(pw)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnpwJsToDb(pw);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO pw SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                pw.pwId = res.insertId;
                done(null, fnpwDbToJs(pw));
            });
        }, test);
    },
    put: function (pw, done, test) {
        // controls pw properties
        if (!fnCheckpw(pw)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        var udb = fnpwJsToDb(pw);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE pw SET ? WHERE pwId = ?";
            sql = mysql.format(sql, [udb, udb.pwId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                // return object from db
                if (err) return done(err);
                module.exports.getById(udb.pwId, function (err, res) {
                    if (err) return done(err);
                    done(null, res[0]);
                }, test);
            });
        }, test);
    },
    delete: function (pw, done, test) {
        var udb = fnpwJsToDb(pw);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM pw WHERE pwId = ?";
            sql = mysql.format(sql, udb.pwId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    }
}

// ----------------- AUXILIARY FUNCTIONS
// fnpwDbToJs:
// transfors a db record into a js object
var fnpwDbToJs = function (odb) {
    var o = odb;
    // add some properties
    o.id = odb.pwId;
    // properties as objects
    o.initInCharge = {
        id: odb.initInCharge,
        name: odb.initInChargeName
    },
        o.acepInCharge = {
            id: odb.acepInCharge,
            name: odb.acepInChargeName
        },
        o.finInCharge = {
            id: odb.finInCharge,
            name: odb.finInChargeName
        },
        o.cerInCharge = {
            id: odb.cerInCharge,
            name: odb.cerInChargeName
        },
        o.invInCharge = {
            id: odb.invInCharge,
            name: odb.invInChargeName
        },
        o.payInCharge = {
            id: odb.payInCharge,
            name: odb.payInChargeName
        },
        o.company = {
            id: odb.companyId,
            name: odb.companyName
        },
        o.status = {
            id: odb.statusId,
            name: odb.statusName
        },
        o.zone = {
            id: odb.zoneId,
            name: odb.zoneName
        }
    // delete properties not in object
    delete o.pwId;
    delete o.initInChargeName;
    delete o.companyName;
    delete o.statusName;
    delete o.zoneName;
    return o;
}

// fnpwJsToDb
// transforms a js object into a db record
var fnpwJsToDb = function (o) {
    var odb = o;
    // add properties
    odb.pwId = o.id;
    if (o.status) odb.statusId = o.status.id;
    if (o.initInCharge) odb.initInCharge = o.initInCharge.id;
    if (o.acepInCharge) odb.acepInCharge = o.acepInCharge.id;
    if (o.finInCharge) odb.finInCharge = o.finInCharge.id;
    if (o.cerInCharge) odb.cerInCharge = o.cerInCharge.id;
    if (o.invInCharge) odb.invInCharge = o.invInCharge.id;
    if (o.payInCharge) odb.payInCharge = o.payInCharge.id;
    if (o.company) odb.companyId = o.company.id;
    if (o.zone) odb.zoneId = o.zone.id;
    // delete properties not in db
    delete odb.id;
    // delete odb.initInCharge;
    delete odb.company;
    delete odb.status;
    delete odb.zone;
    return odb;
}

// fnCheckpw
// checks if the object has old properties needed
var fnCheckpw = function (o) {
    var check = true;
    check = (check && o.hasOwnProperty("id"));
    check = (check && o.hasOwnProperty("reference"));
    check = (check && o.hasOwnProperty("name"));
    return check;
}

module.exports = pwAPI;