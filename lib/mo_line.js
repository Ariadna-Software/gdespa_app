/*
 * =================================================
 * mo_line.js
 * All functions related to mo_line management in
 * database MYSQL
 * ==================================================
 */
var mysql = require('mysql'),
    dbCon = require('./db_connection'),
    moment = require("moment");

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

// -- New obras de ordenes

var fnCheckPw = function (mo, con, done) {
    if (mo.pwId) return done(null, null);
    async.waterfall([
        function (callback) {
            var reference = "ORD-" + mo.zoneId + "-" + moment(mo.initDate).format("YYYY");
            var sql = "SELECT * FROM pw WHERE reference = ?";
            sql = mysql.format(sql, reference);
            con.query(sql, function (err, rows) {
                if (err) return callback(err);
                if (rows.length == 0) return callback(null, null);
                callback(null, rows[0]);
            })
        },
        function (pw, callback) {
            if (pw) return callback(null, pw, null);
            var sql = "SELECT";
            sql += " 0 AS pwId, 0 AS statusId, CONCAT('ORD', '-', mo.zoneId, '-', YEAR(mo.initDate)) AS reference,";
            sql += " CONCAT('ORDENES:', z.name, ' ', YEAR(mo.initDate)) AS `name`, 'Obra creada automaticamentente' AS decription,";
            sql += " mo.initDate, 1 AS companyId, 1 AS defaultK, 0 AS total, mo.workerId AS initInCharge, mo.zoneId";
            sql += " FROM mo";
            sql += " LEFT JOIN zone AS z ON z.zoneId = mo.zoneId";
            sql += " WHERE mo.moId = ?";
            sql = mysql.format(sql, mo.moId);
            con.query(sql, function (err, rows) {
                if (err) return callback(err);
                callback(null, null, rows[0]);
            });
        },
        function (pw1, pw2, callback) {
            if (pw1) return callback(null, pw1);
            var sql = "INSERT INTO pw SET ?";
            sql = mysql.format(sql, pw2);
            con.query(sql, function (err, row) {
                if (err) return callback(err);
                pw2.insertId = row.insertId;
                callback(null, pw2);
            });
        }
    ],
        function (err, pw) {
            if (err) return done(err);
            done(null, pw);
        });
};

var fnCheckChapter = function (mo, con, done) {
    if (mo.chapterId) return done(null, null);
    var chapterMonth = moment(mo.initDate).month() + 1;
    async.waterfall([
        function (callback) {
            var sql = "SELECT * FROM chapter WHERE pwId = ? AND order = ?";
            sql = mysql.format(sql, [mo.pwId, chapterMonth]);
            con.query(sql, function (err, rows) {
                if (err) return callback(err);
                if (rows.length == 0) return callback(null, null);
                callback(null, rows[0]);
            })
        },
        function (chapter, callback) {
            if (chapter) return callback(null, chapter, null);
            var chapter = {
                chapterId: 0,
                order: chapterMonth,
                name: 'ORDENES MES ' + chapterMonth,
                comments: 'Generado automáticamente a partir de los partes',
                pwId: mo.pwId
            }
            callback(null, null, chapter);
        },
        function (chapter1, chapter2, callback) {
            if (chapter1) return callback(null, chapter1);
            var sql = "INSERT INTO chapter SET ?";
            sql = mysql.format(sql, chapter2);
            con.query(sql, function (err, row) {
                if (err) callback(err);
                chapter2.chapterId = row.insertId;
                callback(null, chapter2);
            })
        }
    ]
        , function (err, chapter) {
            if (err) return done(err);
            done(null, chapter);
        });
}

var fnCheckPwLine = function (mo, con, done) {
    

}


module.exports = moLineAPI;