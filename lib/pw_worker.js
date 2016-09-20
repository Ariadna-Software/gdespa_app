/*
 * =================================================
 * pw_worker.js
 * All functions related to pw_worker management in
 * database MYSQL
 * ==================================================
*/
var mysql = require('mysql'),
    dbCon = require('./db_connection');

var pwWorkerAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT pww.*, pw.name AS pwName, w.name AS workerName";
            sql += " FROM pw_worker AS pww";
            sql += " LEFT JOIN pw AS pw ON pw.pwId = pww.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = pww.workerId";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var pwworkers = [];
                res.forEach(function (gdb) {
                    pwworkers.push(fnPwWorkerDbToJs(gdb));
                });
                done(null, pwworkers);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT pww.*, pw.name AS pwName, w.name AS workerName";
            sql += " FROM pw_worker AS pww";
            sql += " LEFT JOIN pw AS pw ON pw.pwId = pww.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = pww.workerId";
            sql += " WHERE pww.pwWorkerId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var pwworkers = [];
                res.forEach(function (gdb) {
                    pwworkers.push(fnPwWorkerDbToJs(gdb));
                });
                done(null, pwworkers);
            });
        }, test);
    },
    getByPwId: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT pww.*, pw.name AS pwName, w.name AS workerName";
            sql += " FROM pw_worker AS pww";
            sql += " LEFT JOIN pw AS pw ON pw.pwId = pww.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = pww.workerId";
            sql += " WHERE pw.pwId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var pwworkers = [];
                res.forEach(function (gdb) {
                    pwworkers.push(fnPwWorkerDbToJs(gdb));
                });
                done(null, pwworkers);
            });
        }, test);
    },
    post: function (pwWorker, done, test) {
        // obtain db record
        var gdb = fnPwWorkerJsToDb(pwWorker);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO pw_worker SET ?";
            sql = mysql.format(sql, gdb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                pwWorker.pwWorkerId = res.insertId;
                done(null, fnPwWorkerDbToJs(pwWorker));
            });
        }, test);
    },
    put: function (pwWorker, done, test) {
        var gdb = fnPwWorkerJsToDb(pwWorker);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE pw_worker SET ? WHERE pwWorkerId = ?";
            sql = mysql.format(sql, [gdb, gdb.pwWorkerId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, fnPwWorkerDbToJs(pwWorker));
            });
        }, test);
    },
    delete: function (pwWorker, done, test) {
        var gdb = fnPwWorkerJsToDb(pwWorker);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM pw_worker WHERE pwWorkerId = ?";
            sql = mysql.format(sql, gdb.pwWorkerId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    }
};

// fnPwWorkerDbToJs:
// transfors a db record into a js object
var fnPwWorkerDbToJs = function (odb) {
    var o = odb;
    o.id = odb.pwWorkerId;
    o.pw = {
        id: odb.pwId,
        name: odb.pwName
    };
    o.worker = {
        id: odb.workerId,
        name: odb.workerName
    };
    delete o.pwWorkerId;
    delete o.pwName;
    delete o.pwId;
    delete o.workerName;
    delete o.workerId;
    return o;
}

// fnPwWorkerJsToDb
// transforms a js object into a db record
var fnPwWorkerJsToDb = function (o) {
    // add db id
    var odb = o;
    odb.pwWorkerId = o.id;
    odb.pwId = o.pw.id;
    if (odb.worker) odb.workerId = o.worker.id; // prevent error in delete 
    //
    delete odb.id;
    delete odb.pw;
    delete odb.worker;
    return odb;
}


module.exports = pwWorkerAPI;