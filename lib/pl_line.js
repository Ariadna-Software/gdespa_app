/*
 * =================================================
 * pl_line.js
 * All functions related to pl_line management in
 * database MYSQL
 * ==================================================
 */
var mysql = require('mysql'),
    dbCon = require('./db_connection');

var plLineAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT pll.plLineId, pll.plId, pll.cunitId, cu.name AS cunitName, pll.estimate, pll.done, pll.quantity,";
            sql += " ch.order as chapterOrder, ch.name AS chapterName, ch.comments as chapterComments";
            sql += " FROM pl_line AS pll";
            sql += " LEFT JOIN pl ON pl.plId = pll.plId";
            sql += " LEFT JOIN cunit AS cu ON cu.cunitId = pll.cunitId";
            sql += " LEFT JOIN (SELECT pwId, cunitId, SUM(quantity) AS estimate FROM pw_line GROUP BY pwId, cunitId) AS e ON (e.pwId = pl.pwId AND e.cunitId = pll.cunitId)";
            sql += " LEFT JOIN (SELECT pwId, cunitId, SUM(quantity) AS done FROM pl_line LEFT JOIN pl ON pl.plId = pl_line.plId GROUP BY pwId, cunitId) AS d ON (d.pwId = pl.pwId AND d.cunitId = pll.cunitId)";
            sql += " LEFT JOIN chapter as ch ON ch.chapterId = pll.chapterId"
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
            var sql = "SELECT pll.plLineId, pll.plId, pll.cunitId, cu.name AS cunitName, pll.estimate, pll.done, pll.quantity,";
            sql += " ch.order as chapterOrder, ch.name AS chapterName, ch.comments as chapterComments";
            sql += " FROM pl_line AS pll";
            sql += " LEFT JOIN pl ON pl.plId = pll.plId";
            sql += " LEFT JOIN cunit AS cu ON cu.cunitId = pll.cunitId";
            sql += " LEFT JOIN (SELECT pwId, cunitId, SUM(quantity) AS estimate FROM pw_line GROUP BY pwId, cunitId) AS e ON (e.pwId = pl.pwId AND e.cunitId = pll.cunitId)";
            sql += " LEFT JOIN (SELECT pwId, cunitId, SUM(quantity) AS done FROM pl_line LEFT JOIN pl ON pl.plId = pl_line.plId GROUP BY pwId, cunitId) AS d ON (d.pwId = pl.pwId AND d.cunitId = pll.cunitId)";
            sql += " WHERE pll.plLineId = ?";
            sql += " LEFT JOIN chapter as ch ON ch.chapterId = pll.chapterId"
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
    getByPlId: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT pll.plLineId, pll.plId, pll.cunitId, cu.name AS cunitName, pll.estimate, pll.done, pll.quantity, pll.prevPlanned,";
            sql += " ch.order as chapterOrder, ch.name AS chapterName, ch.comments as chapterComments";
            sql += " FROM pl_line AS pll";
            sql += " LEFT JOIN pl ON pl.plId = pll.plId";
            sql += " LEFT JOIN cunit AS cu ON cu.cunitId = pll.cunitId";
            sql += " LEFT JOIN (SELECT pwId, cunitId, SUM(quantity) AS estimate FROM pw_line GROUP BY pwId, cunitId) AS e ON (e.pwId = pl.pwId AND e.cunitId = pll.cunitId)";
            sql += " LEFT JOIN (SELECT pwId, cunitId, SUM(quantity) AS done FROM pl_line LEFT JOIN pl ON pl.plId = pl_line.plId GROUP BY pwId, cunitId) AS d ON (d.pwId = pl.pwId AND d.cunitId = pll.cunitId)";
            sql += " LEFT JOIN chapter as ch ON ch.chapterId = pll.chapterId"
            sql += " WHERE pl.plId = ?";
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
    post: function (plLine, done, test) {
        // obtain db record
        var gdb = fnWoLineJsToDb(plLine);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO pl_line SET ?";
            sql = mysql.format(sql, gdb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                plLine.plLineId = res.insertId;
                done(null, fnWoLineDbToJs(plLine));
            });
        }, test);
    },
    put: function (plLine, done, test) {
        var gdb = fnWoLineJsToDb(plLine);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE pl_line SET ? WHERE plLineId = ?";
            sql = mysql.format(sql, [gdb, gdb.plLineId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, fnWoLineDbToJs(plLine));
            });
        }, test);
    },
    delete: function (plLine, done, test) {
        var gdb = fnWoLineJsToDb(plLine);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM pl_line WHERE plLineId = ?";
            sql = mysql.format(sql, gdb.plLineId);
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
    o.id = odb.plLineId;
    o.pl = {
        id: odb.plId
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
    delete o.plLineId;
    delete o.plId;
    delete o.cunitId;
    delete o.cunitName;
    return o;
}

// fnWoLineJsToDb
// transforms a js object into a db record
var fnWoLineJsToDb = function (o) {
    // add db id
    var odb = o;
    odb.plLineId = o.id;
    if (o.pl) odb.plId = o.pl.id;
    if (o.cunit) odb.cunitId = o.cunit.id;
    // delete some properties
    delete odb.id;
    delete odb.cunit;
    delete odb.pl;
    delete odb.cunitName;
    return odb;
}


module.exports = plLineAPI;