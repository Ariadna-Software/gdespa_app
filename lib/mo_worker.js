/*
 * =================================================
 * mo_worker.js
 * All functions related to mo_worker management in
 * database MYSQL
 * ==================================================
*/
var mysql = require('mysql'),
    dbCon = require('./db_connection');

var moWorkerAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mow.*, w.name AS workerName";
            sql += " FROM mo_worker AS mow";
            sql += " LEFT JOIN mo AS mo ON mo.moId = mow.moId";
            sql += " LEFT JOIN worker AS w ON w.workerId = mow.workerId";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var moworkers = [];
                res.forEach(function (gdb) {
                    moworkers.push(fnMoWorkerDbToJs(gdb));
                });
                done(null, moworkers);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mow.*, w.name AS workerName";
            sql += " FROM mo_worker AS mow";
            sql += " LEFT JOIN mo AS mo ON mo.moId = mow.moId";
            sql += " LEFT JOIN worker AS w ON w.workerId = mow.workerId";
            sql += " WHERE mow.moWorkerId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var moworkers = [];
                res.forEach(function (gdb) {
                    moworkers.push(fnMoWorkerDbToJs(gdb));
                });
                done(null, moworkers);
            });
        }, test);
    },
    getByMoId: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mow.*, w.name AS workerName";
            sql += " FROM mo_worker AS mow";
            sql += " LEFT JOIN mo AS mo ON mo.moId = mow.moId";
            sql += " LEFT JOIN worker AS w ON w.workerId = mow.workerId";
            sql += " WHERE mo.moId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var moworkers = [];
                res.forEach(function (gdb) {
                    moworkers.push(fnMoWorkerDbToJs(gdb));
                });
                done(null, moworkers);
            });
        }, test);
    },
    getByMoIdWorker: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mow.*, w.name AS workerName";
            sql += " FROM mo_worker AS mow";
            sql += " LEFT JOIN mo AS mo ON mo.moId = mow.moId";
            sql += " LEFT JOIN worker AS w ON w.workerId = mow.workerId";
            sql += " WHERE mo.moId = ? AND w.resTypeId = 0";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var moworkers = [];
                res.forEach(function (gdb) {
                    moworkers.push(fnMoWorkerDbToJs(gdb));
                });
                done(null, moworkers);
            });
        }, test);
    },    
    getByMoIdVehicle: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mow.*, w.name AS workerName";
            sql += " FROM mo_worker AS mow";
            sql += " LEFT JOIN mo AS mo ON mo.moId = mow.moId";
            sql += " LEFT JOIN worker AS w ON w.workerId = mow.workerId";
            sql += " WHERE mo.moId = ? AND w.resTypeId = 1";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var moworkers = [];
                res.forEach(function (gdb) {
                    moworkers.push(fnMoWorkerDbToJs(gdb));
                });
                done(null, moworkers);
            });
        }, test);
    },     
    post: function (moWorker, done, test) {
        // obtain db record
        var gdb = fnMoWorkerJsToDb(moWorker);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT cost FROM worker WHERE workerId = ?"
            sql = mysql.format(sql, gdb.workerId);
            con.query(sql, function (err, res) {
                if (err) return done(err);
                if (res.length == 1) gdb.cost = res[0].cost;
                sql = "INSERT INTO mo_worker SET ?";
                sql = mysql.format(sql, gdb);
                con.query(sql, function (err, res) {
                    dbCon.closeConnection(con);
                    if (err) return done(err);
                    moWorker.moWorkerId = res.insertId;
                    done(null, fnMoWorkerDbToJs(moWorker));
                });
            });
        }, test);
    },
    put: function (moWorker, done, test) {
        var gdb = fnMoWorkerJsToDb(moWorker);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT cost FROM worker WHERE workerId = ?"
            sql = mysql.format(sql, gdb.workerId);
            con.query(sql, function (err, res) {
                if (err) return done(err);
                if (res.length == 1) gdb.cost = res[0].cost;
                sql = "UPDATE mo_worker SET ? WHERE moWorkerId = ?";
                sql = mysql.format(sql, [gdb, gdb.moWorkerId]);
                con.query(sql, function (err, res) {
                    dbCon.closeConnection(con);
                    if (err) return done(err);
                    done(null, fnMoWorkerDbToJs(moWorker));
                });
            });                
        }, test);
    },
    delete: function (moWorker, done, test) {
        var gdb = fnMoWorkerJsToDb(moWorker);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM mo_worker WHERE moWorkerId = ?";
            sql = mysql.format(sql, gdb.moWorkerId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    }
};

// fnMoWorkerDbToJs:
// transfors a db record into a js object
var fnMoWorkerDbToJs = function (odb) {
    var o = odb;
    o.id = odb.moWorkerId;
    o.mo = {
        id: odb.moId
    };
    o.worker = {
        id: odb.workerId,
        name: odb.workerName
    };
    delete o.moWorkerId;
    delete o.moId;
    delete o.workerName;
    delete o.workerId;
    return o;
}

// fnMoWorkerJsToDb
// transforms a js object into a db record
var fnMoWorkerJsToDb = function (o) {
    // add db id
    var odb = o;
    odb.moWorkerId = o.id;
    if (o.mo) odb.moId = o.mo.id; // prevent error in delete
    if (odb.worker) odb.workerId = o.worker.id; // prevent error in delete 
    //
    delete odb.id;
    delete odb.mo;
    delete odb.worker;
    return odb;
}


module.exports = moWorkerAPI;