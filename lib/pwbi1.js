var mysql = require('mysql'),
    util = require('./util'),
    dbCon = require('./db_connection');

// -------------------- MAIN API
var pwbi1API = {
    getPws: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT";
            sql += " pw.pwId, pw.reference, pw.name AS pwName, ";
            sql += " pw.statusId, st.name statusName, "
            sql += " pw.zoneId, z.name AS zoneName,";
            sql += " pw.initInCharge AS initInChargeId, w.name AS initInChargeName ";
            sql += " FROM pw"
            sql += " LEFT JOIN `status` AS st ON st.statusId = pw.statusId";
            sql += " LEFT JOIN zone AS z ON z.zoneId = pw.zoneId";
            sql += " LEFT JOIN worker AS w ON w.workerId = pw.initInCharge";
            con.query(sql, function (err, regs) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, regs);
            });
        }, test);
    },
    getZones: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT zoneId, `name` AS zoneName FROM zone";
            con.query(sql, function (err, regs) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, regs);
            });
        }, test);
    },
    getStatus: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT statusId, `name` AS statusName FROM `status`";
            con.query(sql, function (err, regs) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, regs);
            });
        }, test);
    },
    getWorkers: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT workerId, `name` AS workerName FROM worker";
            con.query(sql, function (err, regs) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, regs);
            });
        }, test);
    },         
}



module.exports = pwbi1API;