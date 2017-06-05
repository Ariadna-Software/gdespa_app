/*
 * =================================================
 * mo_line.js
 * All functions related to mo_line management in
 * database MYSQL
 * ==================================================
 */
var mysql = require('mysql'),
    dbCon = require('./db_connection');

var moLineAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mol.moLineId, mol.moId, mol.cunitId, cu.name AS cunitName, mol.estimate, mol.done, mol.quantity,";
            sql += " ch.order as chapterOrder, ch.name AS chapterName, ch.comments as chapterComments";
            sql += " FROM mo_line AS mol";
            sql += " LEFT JOIN mo ON mo.moId = mol.moId";
            sql += " LEFT JOIN cunit AS cu ON cu.cunitId = mol.cunitId";
            sql += " LEFT JOIN (SELECT pwId, cunitId, SUM(quantity) AS estimate FROM pw_line GROUP BY pwId, cunitId) AS e ON (e.pwId = mo.pwId AND e.cunitId = mol.cunitId)";
            sql += " LEFT JOIN (SELECT pwId, cunitId, SUM(quantity) AS done FROM mo_line LEFT JOIN mo ON mo.moId = mo_line.moId GROUP BY pwId, cunitId) AS d ON (d.pwId = mo.pwId AND d.cunitId = mol.cunitId)";
            sql += " LEFT JOIN chapter as ch ON ch.chapterId = mol.chapterId"
            sql += " ORDER BY ch.order";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnWoLineDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mol.moLineId, mol.moId, mol.cunitId, cu.name AS cunitName, mol.estimate, mol.done, mol.quantity,";
            sql += " ch.order as chapterOrder, ch.name AS chapterName, ch.comments as chapterComments";
            sql += " FROM mo_line AS mol";
            sql += " LEFT JOIN mo ON mo.moId = mol.moId";
            sql += " LEFT JOIN cunit AS cu ON cu.cunitId = mol.cunitId";
            sql += " LEFT JOIN (SELECT pwId, cunitId, SUM(quantity) AS estimate FROM pw_line GROUP BY pwId, cunitId) AS e ON (e.pwId = mo.pwId AND e.cunitId = mol.cunitId)";
            sql += " LEFT JOIN (SELECT pwId, cunitId, SUM(quantity) AS done FROM mo_line LEFT JOIN mo ON mo.moId = mo_line.moId GROUP BY pwId, cunitId) AS d ON (d.pwId = mo.pwId AND d.cunitId = mol.cunitId)";
            sql += " WHERE mol.moLineId = ?";
            sql += " LEFT JOIN chapter as ch ON ch.chapterId = mol.chapterId"
            sql += " ORDER BY ch.order";

            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnWoLineDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    getByWoId: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mol.moLineId, mol.moId, mol.cunitId, cu.name AS cunitName, mol.estimate, mol.done, mol.quantity,";
            sql += " ch.order as chapterOrder, ch.name AS chapterName, ch.comments as chapterComments";
            sql += " FROM mo_line AS mol";
            sql += " LEFT JOIN mo ON mo.moId = mol.moId";
            sql += " LEFT JOIN cunit AS cu ON cu.cunitId = mol.cunitId";
            sql += " LEFT JOIN (SELECT pwId, cunitId, SUM(quantity) AS estimate FROM pw_line GROUP BY pwId, cunitId) AS e ON (e.pwId = mo.pwId AND e.cunitId = mol.cunitId)";
            sql += " LEFT JOIN (SELECT pwId, cunitId, SUM(quantity) AS done FROM mo_line LEFT JOIN mo ON mo.moId = mo_line.moId GROUP BY pwId, cunitId) AS d ON (d.pwId = mo.pwId AND d.cunitId = mol.cunitId)";
            sql += " LEFT JOIN chapter as ch ON ch.chapterId = mol.chapterId"
            sql += " WHERE mo.moId = ?";
            sql += " ORDER BY ch.order";

            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnWoLineDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    post: function (moLine, done, test) {
        // obtain db record
        var gdb = fnWoLineJsToDb(moLine);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO mo_line SET ?";
            sql = mysql.format(sql, gdb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                moLine.moLineId = res.insertId;
                done(null, fnWoLineDbToJs(moLine));
            });
        }, test);
    },
    put: function (moLine, done, test) {
        var gdb = fnWoLineJsToDb(moLine);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE mo_line SET ? WHERE moLineId = ?";
            sql = mysql.format(sql, [gdb, gdb.moLineId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, fnWoLineDbToJs(moLine));
            });
        }, test);
    },
    delete: function (moLine, done, test) {
        var gdb = fnWoLineJsToDb(moLine);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM mo_line WHERE moLineId = ?";
            sql = mysql.format(sql, gdb.moLineId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    }
};

// fnWoLineDbToJs:
// transfors a db record into a js object
var fnWoLineDbToJs = function (odb) {
    var o = odb;
    o.id = odb.moLineId;
    o.mo = {
        id: odb.moId
    };
    o.cunit = {
        id: odb.cunitId,
        name: odb.cunitName
    };
    if (odb.chapterName){
        var composite = {
            chapterId: odb.chapterId,
            chapterName: odb.chapterName,
            chapterOrder: odb.chapterOrder,
            chapterComments: odb.chapterComments
        };
        o.composite = JSON.stringify(composite);
    }
    //
    delete o.moLineId;
    delete o.moId;
    delete o.cunitId;
    delete o.cunitName;
    return o;
}

// fnWoLineJsToDb
// transforms a js object into a db record
var fnWoLineJsToDb = function (o) {
    // add db id
    var odb = o;
    odb.moLineId = o.id;
    if (o.mo) odb.moId = o.mo.id;
    if (o.cunit) odb.cunitId = o.cunit.id;
    // delete some properties
    delete odb.id;
    delete odb.cunit;
    delete odb.mo;
    delete odb.cunitName;
    return odb;
}


module.exports = moLineAPI;