/*
 * =================================================
 * pw_line.js
 * All functions related to pw_line management in
 * database MYSQL
 * ==================================================
*/
var mysql = require('mysql'),
    dbCon = require('./db_connection');

var pwLineAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT pwl.*, pw.name AS pwName, cu.name AS cuName";
            sql += " FROM pw_line AS pwl";
            sql += " LEFT JOIN pw AS pw ON pw.pwId = pwl.pwId";
            sql += " LEFT JOIN cunit AS cu ON cu.cunitId = pwl.cunitId";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnPwLineDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT pwl.*, pw.name AS pwName, cu.name AS cuName";
            sql += " FROM pw_line AS pwl";
            sql += " LEFT JOIN pw AS pw ON pw.pwId = pwl.pwId";
            sql += " LEFT JOIN cunit AS cu ON cu.cunitId = pwl.cunitId";
            sql += " WHERE pwl.pwLineId = ?";
            sql += " ORDER BY pwl.line";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnPwLineDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    getByPwId: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT pwl.*, pw.name AS pwName, cu.name AS cuName, ch.order as chapterOrder, ch.name AS chapterName, ch.comments AS chapterComments";
            sql += " FROM pw_line AS pwl";
            sql += " LEFT JOIN pw AS pw ON pw.pwId = pwl.pwId";
            sql += " LEFT JOIN cunit AS cu ON cu.cunitId = pwl.cunitId";
            sql += " LEFT JOIN chapter AS ch ON ch.chapterId = pwl.chapterId";
            sql += " WHERE pw.pwId = ?";
            sql += " ORDER BY ch.order, pwl.line";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnPwLineDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    getNewLineNumber: function (id, chapterId, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT COALESCE(MAX(line) + 0.1, 1.0) AS contador";
            sql += " FROM pw_line WHERE pwId = ? AND chapterId = ?";
            sql = mysql.format(sql, [id, chapterId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, res[0]);
            });
        }, test);
    },
    post: function (pwLine, done, test) {
        // obtain db record
        var gdb = fnPwLineJsToDb(pwLine);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO pw_line SET ?";
            sql = mysql.format(sql, gdb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                pwLine.pwLineId = res.insertId;
                pwLineAPI.updateTotal(pwLine.pwId, function (err) {
                    if (err) return done(err);
                    done(null, fnPwLineDbToJs(pwLine));
                }, test);
            });
        }, test);
    },
    put: function (pwLine, done, test) {
        var gdb = fnPwLineJsToDb(pwLine);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE pw_line SET ? WHERE pwLineId = ?";
            sql = mysql.format(sql, [gdb, gdb.pwLineId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                pwLineAPI.updateTotal(pwLine.pwId, function (err) {
                    if (err) return done(err);
                    done(null, fnPwLineDbToJs(pwLine));
                }, test);
            });
        }, test);
    },
    delete: function (pwLine, done, test) {
        var gdb = fnPwLineJsToDb(pwLine);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM pw_line WHERE pwLineId = ?";
            sql = mysql.format(sql, gdb.pwLineId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                pwLineAPI.updateTotal(pwLine.pwId, function (err) {
                    if (err) return done(err);
                    done(null);
                }, test);
            });
        }, test);
    },
    updateTotal: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE pw, pw_line";
            sql += " SET pw.total = (SELECT SUM(amount) FROM pw_line WHERE pw_line.pwId = pw.pwId) * pw.mainK";
            sql += " WHERE pw.pwId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    }
};

// fnPwLineDbToJs:
// transfors a db record into a js object
var fnPwLineDbToJs = function (odb) {
    var o = odb;
    o.id = odb.pwLineId;
    o.pw = {
        id: odb.pwId,
        name: odb.pwName
    };
    o.cunit = {
        id: odb.cunitId,
        name: odb.cuName
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
    delete o.pwLineId;
    delete o.pwName;
    delete o.pwId;
    delete o.cuName;
    delete o.cunitId;
    return o;
}

// fnPwLineJsToDb
// transforms a js object into a db record
var fnPwLineJsToDb = function (o) {
    // add db id
    var odb = o;
    odb.pwLineId = o.id;
    odb.pwId = o.pw.id;
    if (odb.cunit) odb.cunitId = o.cunit.id; // prevent error in delete 
    //
    delete odb.id;
    delete odb.pw;
    delete odb.cunit;
    return odb;
}


module.exports = pwLineAPI;