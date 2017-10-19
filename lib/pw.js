var mysql = require('mysql'),
    util = require('./util'),
    dbCon = require('./db_connection');

// -------------------- MAIN API
var pwAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT p.*, c.name AS companyName, w.name AS initInChargeName, s.name as statusName,";
            sql += " w1.name as acepInChargeName, w2.name as finInChargeName, w3.name as cerInChargeName,";
            sql += " w4.name as invInChargeName, w5.name as payInChargeName, z.name as zoneName, c.name AS companyName,";
            sql += " e.c as estimate, d.c as done, ROUND(COALESCE(d.c,0) / COALESCE(e.c,1), 2) as percentage, w.c AS cost";
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
            sql += " LEFT JOIN (SELECT pwl.pwId AS p, SUM(pwl.quantity * cu.cost) AS c FROM pw_line AS pwl LEFT JOIN cunit AS cu ON cu.cunitId = pwl.cunitId GROUP BY pwl.pwId) AS e ON e.p = p.pwId";
            sql += " LEFT JOIN (SELECT wo.pwId AS p, SUM(wol.quantity * cu.cost) AS c FROM wo_line AS wol LEFT JOIN wo ON wol.woId = wo.woId LEFT JOIN cunit AS cu ON cu.cunitId = wol.cunitId GROUP BY wo.pwId) AS d ON d.p = p.pwId";
            sql += " LEFT JOIN (SELECT wo.pwId AS p, SUM(wow.quantity * wow.cost) AS c FROM wo_worker AS wow INNER JOIN wo ON wo.woId = wow.woId GROUP BY wo.pwId) AS w ON w.p = p.pwId";
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
    getByZoneId: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT p.*, c.name AS companyName, w.name AS initInChargeName, s.name as statusName,";
            sql += " w1.name as acepInChargeName, w2.name as finInChargeName, w3.name as cerInChargeName,";
            sql += " w4.name as invInChargeName, w5.name as payInChargeName, z.name as zoneName, c.name AS companyName,";
            sql += " e.c as estimate, d.c as done, ROUND(COALESCE(d.c,0) / COALESCE(e.c,1), 2) as percentage, w.c AS cost";
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
            sql += " LEFT JOIN (SELECT pwl.pwId AS p, SUM(pwl.quantity * cu.cost) AS c FROM pw_line AS pwl LEFT JOIN cunit AS cu ON cu.cunitId = pwl.cunitId GROUP BY pwl.pwId) AS e ON e.p = p.pwId";
            sql += " LEFT JOIN (SELECT wo.pwId AS p, SUM(wol.quantity * cu.cost) AS c FROM wo_line AS wol LEFT JOIN wo ON wol.woId = wo.woId LEFT JOIN cunit AS cu ON cu.cunitId = wol.cunitId GROUP BY wo.pwId) AS d ON d.p = p.pwId";
            sql += " LEFT JOIN (SELECT wo.pwId AS p, SUM(wow.quantity * wow.cost) AS c FROM wo_worker AS wow INNER JOIN wo ON wo.woId = wow.woId GROUP BY wo.pwId) AS w ON w.p = p.pwId";
            sql += " WHERE p.zoneId = ?";
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
    getReportPwStatus: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT pwId as id, name FROM pw"
            con.query(sql, function (err, closures) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, closures);
            });
        }, test);
    },
    getActive: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT p.*, c.name AS companyName, w.name AS initInChargeName, s.name as statusName,";
            sql += " w1.name as acepInChargeName, w2.name as finInChargeName, w3.name as cerInChargeName,";
            sql += " w4.name as invInChargeName, w5.name as payInChargeName, z.name as zoneName, c.name AS companyName,";
            sql += " e.c as estimate, d.c as done, ROUND(COALESCE(d.c,0) / COALESCE(e.c,1), 2) as percentage, w.c AS cost";
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
            sql += " LEFT JOIN (SELECT pwl.pwId AS p, SUM(pwl.quantity * cu.cost) AS c FROM pw_line AS pwl LEFT JOIN cunit AS cu ON cu.cunitId = pwl.cunitId GROUP BY pwl.pwId) AS e ON e.p = p.pwId";
            sql += " LEFT JOIN (SELECT wo.pwId AS p, SUM(wol.quantity * cu.cost) AS c FROM wo_line AS wol LEFT JOIN wo ON wol.woId = wo.woId LEFT JOIN cunit AS cu ON cu.cunitId = wol.cunitId GROUP BY wo.pwId) AS d ON d.p = p.pwId";
            sql += " LEFT JOIN (SELECT wo.pwId AS p, SUM(wow.quantity * wow.cost) AS c FROM wo_worker AS wow INNER JOIN wo ON wo.woId = wow.woId GROUP BY wo.pwId) AS w ON w.p = p.pwId";
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
            sql += " w4.name as invInChargeName, w5.name as payInChargeName, z.name as zoneName, c.name AS companyName,";
            sql += " e.c as estimate, d.c as done, ROUND(COALESCE(d.c,0) / COALESCE(e.c,1), 2) as percentage, w.c AS cost";
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
            sql += " LEFT JOIN (SELECT pwl.pwId AS p, SUM(pwl.quantity * cu.cost) AS c FROM pw_line AS pwl LEFT JOIN cunit AS cu ON cu.cunitId = pwl.cunitId GROUP BY pwl.pwId) AS e ON e.p = p.pwId";
            sql += " LEFT JOIN (SELECT wo.pwId AS p, SUM(wol.quantity * cu.cost) AS c FROM wo_line AS wol LEFT JOIN wo ON wol.woId = wo.woId LEFT JOIN cunit AS cu ON cu.cunitId = wol.cunitId GROUP BY wo.pwId) AS d ON d.p = p.pwId";
            sql += " LEFT JOIN (SELECT wo.pwId AS p, SUM(wow.quantity * wow.cost) AS c FROM wo_worker AS wow INNER JOIN wo ON wo.woId = wow.woId GROUP BY wo.pwId) AS w ON w.p = p.pwId";
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
    recalcById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE pw_line AS pwl, cunit AS cu";
            sql += " SET pwl.cost = cu.cost, pwl.amount = ROUND(pwl.cost * pwl.quantity * k, 2)";
            sql += " WHERE pwl.pwId = ?";
            sql += " AND cu.cunitId = pwl.cunitId";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                sql = "UPDATE pw AS pw, pw_line AS pwl";
                sql += " SET pw.total = (SELECT SUM(amount) FROM pw_line WHERE pw_line.pwId = ?)";
                sql += " WHERE pw.pwId = ?";
                sql = mysql.format(sql, [id, id]);
                con.query(sql, function (err, res) {
                    dbCon.closeConnection(con);
                    if (err) return done(err);
                    done(null, null);
                });
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT p.*, c.name AS companyName, w.name AS initInChargeName, s.name as statusName,";
            sql += " w1.name as acepInChargeName, w2.name as finInChargeName, w3.name as cerInChargeName,";
            sql += " w4.name as invInChargeName, w5.name as payInChargeName, z.name as zoneName, c.name AS companyName,";
            sql += " e.c as estimate, d.c as done, ROUND(COALESCE(d.c,0) / COALESCE(e.c,1), 2) as percentage, w.c AS cost,";
            sql += " COALESCE(t0.prod) AS prod, COALESCE(t1.totalf, 0) AS totalf";
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
            sql += " LEFT JOIN (SELECT pwl.pwId AS p, SUM(pwl.quantity * cu.cost) AS c FROM pw_line AS pwl LEFT JOIN cunit AS cu ON cu.cunitId = pwl.cunitId GROUP BY pwl.pwId) AS e ON e.p = p.pwId";
            sql += " LEFT JOIN (SELECT wo.pwId AS p, SUM(wol.quantity * cu.cost) AS c FROM wo_line AS wol LEFT JOIN wo ON wol.woId = wo.woId LEFT JOIN cunit AS cu ON cu.cunitId = wol.cunitId GROUP BY wo.pwId) AS d ON d.p = p.pwId";
            sql += " LEFT JOIN (SELECT wo.pwId AS p, SUM(wow.quantity * wow.cost) AS c FROM wo_worker AS wow INNER JOIN wo ON wo.woId = wow.woId GROUP BY wo.pwId) AS w ON w.p = p.pwId";
            sql += " LEFT JOIN (SELECT";
            sql += " wo.pwId, COALESCE(SUM(wol.quantity * pwl.k * pwl.cost),0) AS prod";
            sql += " FROM wo_line AS wol";
            sql += " LEFT JOIN wo ON wo.woId = wol.woId";
            sql += " LEFT JOIN pw_line AS pwl ON pwl.pwLineId = wol.pwLineId";
            sql += " GROUP BY wo.pwId) AS t0 ON t0.pwId = p.pwId";
            sql += " LEFT JOIN (SELECT pwId, SUM(amount) AS totalf FROM invoice GROUP BY pwId)";
            sql += " AS t1 ON t1.pwId = p.pwId"
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
    getDocsNeedToOpen: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT COUNT(*) AS ndocs";
            sql += " FROM doc AS d";
            sql += " LEFT JOIN doc_type AS dt ON dt.docTypeId = d.docTypeId";
            sql += " WHERE  d.pwId = ? AND dt.needToOpen = 1";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, res);
            });
        }, test);
    },    
    getDocsNeedToClose: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT COUNT(*) AS ndocs";
            sql += " FROM doc AS d";
            sql += " LEFT JOIN doc_type AS dt ON dt.docTypeId = d.docTypeId";
            sql += " WHERE  d.pwId = ? AND dt.needToClose = 1";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, res);
            });
        }, test);
    },    
    getWoByPw: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT wo.*, w.name AS workerName, DATE_FORMAT(wo.initDate, '%Y-%m-%d') AS rDate";
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
    // putClosedPw
    // Updates a closed project (pw) making quantity in its lines (pw_line)
    // equales to quantity in worker order (wo)
    putClosedPw: function (id, done, test) {
        // controls pw properties
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE";
            sql += " pw_line AS c1,";
            sql += " (SELECT ";
            sql += " pwl.pwLineId, pwl.pwId,";
            sql += " pwl.cost, pwl.quantity, COALESCE(SUM(wol.quantity), 0) AS done";
            sql += " FROM pw_line AS pwl ";
            sql += " LEFT JOIN wo_line AS wol ON wol.pwLineId = pwl.pwLineId";
            sql += " GROUP BY pwl.pwLineId) AS c2";
            sql += " SET c1.quantity = c2.done";
            sql += " WHERE c1.pwLineId = c2.pwLineId";
            sql += " AND c1.pwId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                // return object from db
                if (err) return done(err);
                done(null, 'OK');
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
    delete o.statusName;
    delete o.zoneName;
    // format dates without time zone
    o.initDate = util.serverParseDate(o.initDate);
    o.acepDate = util.serverParseDate(o.acepDate);
    o.finDate = util.serverParseDate(o.finDate);
    o.cerDate = util.serverParseDate(o.cerDate);
    o.invDate = util.serverParseDate(o.invDate);
    o.payDate = util.serverParseDate(o.payDate);
    o.endDate = util.serverParseDate(o.endDate);
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