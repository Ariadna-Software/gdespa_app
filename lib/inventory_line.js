/*
 * =================================================
 * closure_line.js
 * All functions related to closure_line management in
 * database MYSQL
 * ==================================================
*/
var mysql = require('mysql'),
    dbCon = require('./db_connection');

var closureLineAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT cl.*, pw.name as pwName";
            sql += " FROM closure_line AS cl";
            sql += " LEFT JOIN pw ON pw.pwId = cl.pwId";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var closureLines = [];
                res.forEach(function (gdb) {
                    closureLines.push(fnClosureLineDbToJs(gdb));
                });
                done(null, closureLines);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT cl.*, pw.name as pwName";
            sql += " FROM closure_line AS cl";
            sql += " LEFT JOIN pw ON pw.pwId = cl.pwId";
            sql += " WHERE cl.closureLineId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var closureLines = [];
                res.forEach(function (gdb) {
                    closureLines.push(fnClosureLineDbToJs(gdb));
                });
                done(null, closureLines);
            });
        }, test);
    },
    getByClosureId: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT cl.*, pw.name as pwName";
            sql += " FROM closure_line AS cl";
            sql += " LEFT JOIN pw ON pw.pwId = cl.pwId";
            sql += " WHERE cl.closureId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var closureLines = [];
                res.forEach(function (gdb) {
                    closureLines.push(fnClosureLineDbToJs(gdb));
                });
                done(null, closureLines);
            });
        }, test);
    },
    post: function (closureLine, done, test) {
        // obtain db record
        var gdb = fnClosureLineJsToDb(closureLine);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO closure_line SET ?";
            sql = mysql.format(sql, gdb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                closureLine.closureLineId = res.insertId;
                done(null, fnClosureLineDbToJs(closureLine));
            });
        }, test);
    },
    put: function (closureLine, done, test) {
        var gdb = fnClosureLineJsToDb(closureLine);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE closure_line SET ? WHERE closureLineId = ?";
            sql = mysql.format(sql, [gdb, gdb.closureLineId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, fnClosureLineDbToJs(closureLine));
            });
        }, test);
    },
    delete: function (closureLine, done, test) {
        var gdb = fnClosureLineJsToDb(closureLine);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM closure_line WHERE closureLineId = ?";
            sql = mysql.format(sql, gdb.closureLineId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    }
};

// fnClosureLineDbToJs:
// transfors a db record into a js object
var fnClosureLineDbToJs = function (odb) {
    var o = odb;
    o.id = odb.closureLineId;
    o.pw = {
        id: odb.pwId,
        name: odb.pwName
    };
    //
    delete o.closureLineId;
    delete o.closureId;
    delete o.pwId;
    delete o.pwName;
    return o;
}

// fnClosureLineJsToDb
// transforms a js object into a db record
var fnClosureLineJsToDb = function (o) {
    // add db id
    var odb = o;
    odb.closureLineId = o.id;
    if (o.pw) odb.pwId = o.pw.id;
    // delete some properties
    delete odb.id;
    delete odb.pw;
    delete odb.pwName;
    return odb;
}


module.exports = closureLineAPI;