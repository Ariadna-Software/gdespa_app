/*
 * =================================================
 * mo_line.js
 * All functions related to mo_line management in
 * database MYSQL
 * ==================================================
 */
var mysql = require('mysql'),
    dbCon = require('./db_connection'),
    moment = require("moment"),
    async = require('async');

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
                fnActualizaPartesDesdeOrdenes(moLine.moId, function (err) {
                    if (err) return done(err);
                    done(null, fnMoLineDbToJs(moLine));
                });
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
                fnActualizaPartesDesdeOrdenes(moLine.moId, function (err) {
                    if (err) return done(err);
                    done(null, fnMoLineDbToJs(moLine));
                });
            });
        }, test);
    },
    delete: function (moLine, done, test) {
        var gdb = fnMoLineJsToDb(moLine);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT * FROM mo_line WHERE moLineId = ?";
            sql = mysql.format(sql, gdb.id);
            con.query(sql, function (err, res) {
                if (err) return done(err);
                var id = res[0].moId;
                var sql = "DELETE FROM mo_line WHERE moLineId = ?";
                sql = mysql.format(sql, gdb.id);
                con.query(sql, function(err){
                    dbCon.closeConnection(con);
                    if (err) return done(err);
                    fnActualizaPartesDesdeOrdenes(id, function (err) {
                        if (err) return done(err);
                        done(null);
                    });
                });
            });
        }, test);
    },
    actualizarPartes: function(id, done){
        fnActualizaPartesDesdeOrdenes(id, function(err){
            if (err) return done(err);
            done();
        });
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
var fnActualizaPartesDesdeOrdenes = function (moId, done) {
    dbCon.getConnection(function (err, con) {
        if (err) return done(err);
        con.beginTransaction(function (err) {
            if (err) { con.end(); return done(err) }
            var sql = "SELECT * FROM mo WHERE mo.moId = ?";
            sql = mysql.format(sql, moId);
            con.query(sql, function (err, rows) {
                if (err) {
                    con.end();
                    return done(err);
                }
                if (rows.length == 0) {
                    con.end();
                    return done(new Error('No se ha encontrado la orden ' + moId))
                }
                var mo = rows[0];
                async.series([
                    function (callback) {
                        fnCheckPw(mo, con, function (err) {
                            if (err) return callback(err);
                            callback();
                        });
                    },
                    function (callback) {
                        fnCheckChapter(mo, con, function (err) {
                            if (err) return callback(err);
                            callback();
                        });
                    },
                    function (callback) {
                        fnCheckPwLine(mo, con, function (err) {
                            if (err) return callback(err);
                            callback();
                        });
                    },
                    function (callback) {
                        fnCheckWo(mo, con, function (err) {
                            if (err) return callback(err);
                            callback();
                        });
                    },
                    function (callback) {
                        fnCheckWoLine(mo, con, function (err) {
                            if (err) return callback(err);
                            callback();
                        });
                    },
                    function(callback){
                        fnUpdateTotalPw(mo, con, function (err) {
                            if (err) return callback(err);
                            callback();
                        });
                    },
                    function(callback){
                        fnUpdateMo(mo, con, function (err) {
                            if (err) return callback(err);
                            callback();
                        });
                    }
                ]
                    , function (err) {
                        if (err) { con.rollback(); con.end(); return done(err); }
                        con.commit();
                        con.end();
                        done();
                    });
            });
        })
    }, false);
}

//fnUpdateTotalPw
var fnUpdateTotalPw = function(mo, con, done){
    var sql = "UPDATE";
    sql += " pw, (SELECT pwId, SUM(amount) AS total FROM pw_line WHERE NOT pwId IS NULL GROUP BY pwId) AS pwl";
    sql += " SET pw.total = pwl.total";
    sql += " WHERE pwl.pwId = pw.pwId";
    sql += " AND pw.pwId = ?";
    sql = mysql.format(sql, mo.pwId);
    con.query(sql, function(err){
        if (err) return done(err);
        done();
    })
}

// fnUpdateMo
var fnUpdateMo = function(mo, con, done){
    var sql = "UPDATE mo SET pwId = ?, chapterId = ?, pwLineId = ?, woId = ?, woLineId = ?";
    sql += " WHERE moId = ?";
    sql = mysql.format(sql, [mo.pwId, mo.chapterId, mo.pwLineId, mo.woId, mo.woLineId, mo.moId]);
    con.query(sql, function (err) {
        if (err) return done(err);
        done(); 
    });
}


// fnCheckPw
// Chequea que la obra de referencia del contador existe
// si no existe la crea y la devuelve
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
            sql += " CONCAT('ORDENES:', z.name, ' ', YEAR(mo.initDate)) AS `name`, 'Obra creada automaticamentente' AS description,";
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
                pw2.pwId = row.insertId;
                callback(null, pw2);
            });
        }
    ],
        function (err, pw) {
            if (err) return done(err);
            mo.pwId = pw.pwId;
            done(null, pw);
        });
};

// fnCheckChapter
// Chequea que la capítulo de referencia del contador existe
// si no existe la crea y la devuelve
var fnCheckChapter = function (mo, con, done) {
    if (mo.chapterId) return done(null, null);
    var chapterMonth = moment(mo.initDate).month() + 1;
    async.waterfall([
        function (callback) {
            var sql = "SELECT * FROM chapter WHERE pwId = ? AND `order` = ?";
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
            mo.chapterId = chapter.chapterId;
            done(null, chapter);
        });
}

// fnCheckPwLine
// Chequea que la linea de obra de referencia del contador existe
// si no existe la crea y la devuelve
var fnCheckPwLine = function (mo, con, done) {
    async.waterfall([
        function (callback) {
            var sql = "SELECT";
            sql += " 0 AS pwLineId, 0 AS pwId, 0 AS chapterId, 1 AS line, p.ucContaLumId AS cunitId, 1 AS cost,"
            sql += " m2.cost AS plannedQuantity, m2.cost AS quantity, 1 AS K, m2.cost AS amount,";
            sql += " CONCAT('ORDEN: ', m1.moId, ' DE ', DATE_FORMAT(m1.initDate,'%d/%m/%Y')) AS comments";
            sql += " FROM mo AS m1";
            sql += " LEFT JOIN (SELECT mol.moId, SUM(mol.cost) AS cost FROM mo_line AS mol GROUP BY mol.moId) AS m2";
            sql += " ON m2.moId = m1.moId";
            sql += " LEFT JOIN parameters AS p ON 1 = 1";
            sql += " WHERE m1.moId = ?";
            sql = mysql.format(sql, mo.moId);
            con.query(sql, function (err, rows) {
                if (err) return callback(err);
                if (rows.length == 0) return callback(new Error('No se ha podido construir la linea de obra asociada a moId: ' + mo.moId));
                callback(null, rows[0]);
            });
        },
        function (pwLine, callback) {
            pwLine.pwId = mo.pwId;
            pwLine.chapterId = mo.chapterId;
            if (mo.pwLineId) {
                pwLine.pwLineId = mo.pwLineId;
                var sql = "UPDATE pw_line SET ? WHERE pwLineId = ?";
                sql = mysql.format(sql, [pwLine, pwLine.pwLineId]);
                con.query(sql, function (err) {
                    if (err) return callback(err);
                    callback(null, pwLine);
                });
            } else {
                var sql = "INSERT INTO pw_line SET ?";
                sql = mysql.format(sql, pwLine);
                con.query(sql, function (err, result) {
                    if (err) return callback(err);
                    pwLine.pwLineId = result.insertId;
                    callback(null, pwLine);
                });
            }
        }
    ]
        , function (err, pwLine) {
            if (err) return done(err);
            mo.pwLineId = pwLine.pwLineId;
            done(null, pwLine);
        });
}

// fnCheckWo
// Comprueba que existe la cabecera del parte de trabajo relacionado
var fnCheckWo = function (mo, con, done) {
    if (!mo.pwId) return done(new Error('No se puede crear el parte, porque se desconoce la obra asociada a la orden ' + mo.moId));
    if (mo.woId) return done(null, null);
    async.waterfall([
        function (callback) {
            var sql = "SELECT";
            sql += " 0 AS woId, m1.initDate AS initDate, NULL AS endDate, m1.workerId, m1.pwId,";
            sql += " CONCAT('PARTE DE LA ORDEN: ', m1.moId, ' DE ', DATE_FORMAT(m1.initDate,'%d/%m/%Y')) AS comments,";
            sql += " NULL AS closureId, 0 AS thirdParty, NULL AS thirdPartyCompany, m1.teamId, 0 AS dayTypeId,";
            sql += " m1.zoneId, NULL AS plId";
            sql += " FROM mo AS m1";
            sql += " WHERE m1.moId = ?";
            sql = mysql.format(sql, mo.moId);
            con.query(sql, function (err, rows) {
                if (err) return callback(err);
                if (rows.length == 0) return callback(new Error('No se ha encontrado la orden ' + mo.moId));
                callback(null, rows[0]);
            })
        },
        function (wo, callback) {
            wo.pwId = mo.pwId;
            var sql = "INSERT INTO wo SET ?";
            sql = mysql.format(sql, wo);
            con.query(sql, function (err, result) {
                if (err) callback(err);
                wo.woId = result.insertId;
                callback(null, wo);
            });
        }
    ]
        , function (err, wo) {
            if (err) return done(err);
            mo.woId = wo.woId;
            done(null, wo);
        });
}

// fnCheckWoLine
// Chequea que la linea del parte de trabajo de referencia del contador existe
// si no existe la crea y la devuelve
var fnCheckWoLine = function (mo, con, done) {
    async.waterfall([
        function (callback) {
            var sql = "SELECT";
            sql += " 0 AS woLineId, 0 AS woId, p.ucContaLumId AS cunitId,";
            sql += " m2.cost AS estimate, 0 AS done, m2.cost AS quantity,";
            sql += " 0 AS chapterId, 0 AS pwLineId, m2.cost AS planned, null AS plLineId";
            sql += " FROM mo AS m1";
            sql += " LEFT JOIN (SELECT mol.moId, SUM(mol.cost) AS cost FROM mo_line AS mol GROUP BY mol.moId) AS m2";
            sql += " ON m2.moId = m1.moId";
            sql += " LEFT JOIN parameters AS p ON 1 = 1";
            sql += " WHERE m1.moId = ?";
            sql = mysql.format(sql, mo.moId);
            con.query(sql, function (err, rows) {
                if (err) return callback(err);
                if (rows.length == 0) return callback(new Error('No se ha podido construir la linea de parte de trabajo asociada a moId: ' + mo.moId));
                callback(null, rows[0]);
            });
        },
        function (woLine, callback) {
            woLine.woId = mo.woId;
            woLine.chapterId = mo.chapterId;
            woLine.pwLineId = mo.pwLineId;
            if (mo.woLineId) {
                woLine.woLineId = mo.woLineId;
                var sql = "UPDATE wo_line SET ? WHERE woLineId = ?";
                sql = mysql.format(sql, [woLine, woLine.woLineId]);
                con.query(sql, function (err) {
                    if (err) return callback(err);
                    callback(null, woLine);
                });
            } else {
                var sql = "INSERT INTO wo_line SET ?";
                sql = mysql.format(sql, woLine);
                con.query(sql, function (err, result) {
                    if (err) return callback(err);
                    woLine.woLineId = result.insertId;
                    callback(null, woLine);
                });
            }
        }
    ]
        , function (err, woLine) {
            if (err) return done(err);
            mo.woLineId = woLine.woLineId;
            done(null, woLine);
        });
}


var fnDeleteMoPwLine = function(mo, con, done) {
    var sql = "DELETE FROM pw_line WHERE pwLineId = ?";
    sql = mysql.format(sql, mo.pwLineId);
    con.query(sql, function(err){
        if (err) return done(err);
        done();
    })
}

var fnDeleteMoWoLine = function(mo, con, done) {
    var sql = "DELETE FROM wo_line WHERE woLineId = ?";
    sql = mysql.format(sql, mo.woLineId);
    con.query(sql, function(err){
        if (err) return done(err);
        done();
    })
}

var fnDeleteMoWo = function(mo, con, done) {
    var sql = "DELETE FROM wo WHERE woId = ?";
    sql = mysql.format(sql, mo.woId);
    con.query(sql, function(err){
        if (err) return done(err);
        done();
    })
}




module.exports = moLineAPI;