var express = require('express');
var router = express.Router();

var mysql = require('mysql'),
    dbCon = require('../lib/db_connection'),
    moment = require("moment"),
    async = require('async');

router.get('/crear-ordenes/:fecha1/:fecha2', function (req, res) {
    var txt = "Crear ordenes";
    var fecha1 = req.params.fecha1;
    var fecha2 = req.params.fecha2;
    if (!fecha1 || !fecha2) return res.json("La fecha me falta en formato 'YYYY-MM-DD'");
    dbCon.getConnection(function (err, con) {
        if (err) return res.json("Error: " + err.message);
        var sql = "SELECT * FROM mo WHERE initDate >= '" + fecha1 + "' AND initDate <= '" + fecha2 + "'";
        sql += " ORDER BY initDate";
        con.query(sql, function (err, rows) {
            con.end();
            if (err) return res.json("Error: " + err.message);
            console.log("T1: ", new Date());
            fnActualizaParte(rows, function(err){
                if (err) return res.json("Error: " + err.message);
                console.log("T2: ", new Date());
                res.json("Proceso terminado");
            });
        })
    }, false);
});

var fnActualizaParte = function (regs, done) {
    var treg = regs.length;
    var reg = 0;
    async.forEachSeries(regs, function (r, callback) {
        reg++;
        console.log(reg + " DE " + treg + " MOID: " + r.moId + " ");
        fnActualizaPartesDesdeOrdenes(r.moId, function (err) {
            if (err) return callback(err);
            callback();
        });
    }, function (err) {
        if (err) return done("Error: " + err.message);
        done();
    });
}



// -- New obras de ordenes
var fnActualizaPartesDesdeOrdenes = function (moId, done) {
    dbCon.getConnection(function (err, con) {
        if (err) return done(err);
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
                function (callback) {
                    fnUpdateTotalPw(mo, con, function (err) {
                        if (err) return callback(err);
                        callback();
                    });
                },
                function (callback) {
                    fnUpdateMo(mo, con, function (err) {
                        if (err) return callback(err);
                        callback();
                    });
                }
            ]
                , function (err) {
                    if (err) { con.end(); return done(err); }
                    con.end();
                    done();
                });
        });

    }, false);
}

//fnUpdateTotalPw
var fnUpdateTotalPw = function (mo, con, done) {
    var sql = "UPDATE";
    sql += " pw, (SELECT pwId, SUM(amount) AS total FROM pw_line WHERE NOT pwId IS NULL GROUP BY pwId) AS pwl";
    sql += " SET pw.total = pwl.total";
    sql += " WHERE pwl.pwId = pw.pwId";
    sql += " AND pw.pwId = ?";
    sql = mysql.format(sql, mo.pwId);
    con.query(sql, function (err) {
        if (err) return done(err);
        done();
    })
}

// fnUpdateMo
var fnUpdateMo = function (mo, con, done) {
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




module.exports = router;