/*
 * =================================================
 * wo_worker.js
 * All functions related to wo_worker management in
 * database MYSQL
 * ==================================================
*/
var mysql = require('mysql'),
    dbCon = require('./db_connection');

var woWorkerAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT wow.*, w.name AS workerName";
            sql += " FROM wo_worker AS wow";
            sql += " LEFT JOIN wo AS wo ON wo.woId = wow.woId";
            sql += " LEFT JOIN worker AS w ON w.workerId = wow.workerId";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var woworkers = [];
                res.forEach(function (gdb) {
                    woworkers.push(fnWoWorkerDbToJs(gdb));
                });
                done(null, woworkers);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT wow.*, w.name AS workerName";
            sql += " FROM wo_worker AS wow";
            sql += " LEFT JOIN wo AS wo ON wo.woId = wow.woId";
            sql += " LEFT JOIN worker AS w ON w.workerId = wow.workerId";
            sql += " WHERE wow.woWorkerId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var woworkers = [];
                res.forEach(function (gdb) {
                    woworkers.push(fnWoWorkerDbToJs(gdb));
                });
                done(null, woworkers);
            });
        }, test);
    },
    getByWoId: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT wow.*, w.name AS workerName";
            sql += " FROM wo_worker AS wow";
            sql += " LEFT JOIN wo AS wo ON wo.woId = wow.woId";
            sql += " LEFT JOIN worker AS w ON w.workerId = wow.workerId";
            sql += " WHERE wo.woId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var woworkers = [];
                res.forEach(function (gdb) {
                    woworkers.push(fnWoWorkerDbToJs(gdb));
                });
                done(null, woworkers);
            });
        }, test);
    },
    post: function (woWorker, done, test) {
        // obtain db record
        var gdb = fnWoWorkerJsToDb(woWorker);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO wo_worker SET ?";
            sql = mysql.format(sql, gdb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                woWorker.woWorkerId = res.insertId;
                done(null, fnWoWorkerDbToJs(woWorker));
            });
        }, test);
    },
    put: function (woWorker, done, test) {
        var gdb = fnWoWorkerJsToDb(woWorker);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE wo_worker SET ? WHERE woWorkerId = ?";
            sql = mysql.format(sql, [gdb, gdb.woWorkerId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, fnWoWorkerDbToJs(woWorker));
            });
        }, test);
    },
    delete: function (woWorker, done, test) {
        var gdb = fnWoWorkerJsToDb(woWorker);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM wo_worker WHERE woWorkerId = ?";
            sql = mysql.format(sql, gdb.woWorkerId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    }
};

// fnWoWorkerDbToJs:
// transfors a db record into a js object
var fnWoWorkerDbToJs = function (odb) {
    var o = odb;
    o.id = odb.woWorkerId;
    o.wo = {
        id: odb.woId
    };
    o.worker = {
        id: odb.workerId,
        name: odb.workerName
    };
    delete o.woWorkerId;
    delete o.woId;
    delete o.workerName;
    delete o.workerId;
    return o;
}

// fnWoWorkerJsToDb
// transforms a js object into a db record
var fnWoWorkerJsToDb = function (o) {
    // add db id
    var odb = o;
    odb.woWorkerId = o.id;
    odb.woId = o.wo.id;
    if (odb.worker) odb.workerId = o.worker.id; // prevent error in delete 
    //
    delete odb.id;
    delete odb.wo;
    delete odb.worker;
    return odb;
}


module.exports = woWorkerAPI;