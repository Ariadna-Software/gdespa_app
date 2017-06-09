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
            var sql = "SELECT mol.moLineId, mol.moId, mol.meaId, mea.name AS meaName, mol.price, mol.quantity, mol.cost, mol.moK";
            sql += " FROM mo_line AS mol";
            sql += " LEFT JOIN mo ON mo.moId = mol.moId";
            sql += " LEFT JOIN mea ON mea.meaId = mol.meaId";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnMoLineDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mol.moLineId, mol.moId, mol.meaId, mea.name AS meaName, mol.price, mol.quantity, mol.cost, mol.moK";
            sql += " FROM mo_line AS mol";
            sql += " LEFT JOIN mo ON mo.moId = mol.moId";
            sql += " LEFT JOIN mea ON mea.meaId = mol.meaId";
            sql += " WHERE mol.moLineId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnMoLineDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    getByMoId: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mol.moLineId, mol.moId, mol.meaId, mea.name AS meaName, mol.price, mol.quantity, mol.cost, mol.moK";
            sql += " FROM mo_line AS mol";
            sql += " LEFT JOIN mo ON mo.moId = mol.moId";
            sql += " LEFT JOIN mea ON mea.meaId = mol.meaId";
            sql += " WHERE mo.moId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnMoLineDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    post: function (moLine, done, test) {
        // obtain db record
        var gdb = fnMoLineJsToDb(moLine);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO mo_line SET ?";
            sql = mysql.format(sql, gdb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                moLine.moLineId = res.insertId;
                done(null, fnMoLineDbToJs(moLine));
            });
        }, test);
    },
    put: function (moLine, done, test) {
        var gdb = fnMoLineJsToDb(moLine);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE mo_line SET ? WHERE moLineId = ?";
            sql = mysql.format(sql, [gdb, gdb.moLineId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, fnMoLineDbToJs(moLine));
            });
        }, test);
    },
    delete: function (moLine, done, test) {
        var gdb = fnMoLineJsToDb(moLine);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM mo_line WHERE moLineId = ?";
            sql = mysql.format(sql, gdb.id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    }
};

// fnMoLineDbToJs:
// transfors a db record into a js object
var fnMoLineDbToJs = function (odb) {
    var o = odb;
    return o;
}

// fnMoLineJsToDb
// transforms a js object into a db record
var fnMoLineJsToDb = function (o) {
    // add db id
    var odb = o;
    return odb;
}


module.exports = moLineAPI;