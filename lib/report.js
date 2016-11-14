var mysql = require('mysql'),
    moment = require('moment'),
    async = require('async');
dbCon = require('./db_connection');

// -------------------- MAIN API
var reportAPI = {
    getDeliveryById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT d.*, pw.name AS pwName, w.name AS workerName, s.name AS storeName,";
            sql += " i.name AS itemName, dl.estimate, dl.done, dl.quantity";
            sql += " FROM delivery AS d";
            sql += " LEFT JOIN pw AS pw ON pw.pwId = d.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = d.workerId";
            sql += " LEFT JOIN store AS s ON s.storeId = d.storeId";
            sql += " LEFT JOIN delivery_line AS dl ON dl.deliveryId = d.deliveryId";
            sql += " LEFT JOIN item AS i ON i.itemId = dl.itemId"
            sql += " WHERE d.deliveryId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var deliverys = fnDeliveryDbToJs(res);
                done(null, deliverys);
            });
        }, test);
    },
    getInventoryById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT inv.*, w.name AS workerName, s.name AS storeName,";
            sql += " i.name AS itemName";
            sql += " FROM inventory AS inv";
            sql += " LEFT JOIN worker AS w ON w.workerId = inv.workerId";
            sql += " LEFT JOIN store AS s ON s.storeId = inv.storeId";
            sql += " LEFT JOIN inventory_line AS invl ON invl.inventoryId = inv.inventoryId";
            sql += " LEFT JOIN item AS i ON i.itemId = invl.itemId"
            sql += " WHERE inv.inventoryId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var deliverys = fnInventoryDbToJs(res);
                done(null, deliverys);
            });
        }, test);
    },
    getPwR1ById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT pw.name AS pwName, pw.initDate, st.name AS STATUS, c.name AS company, pw.description, pw.reference AS refPw , z.name AS zoneName,pw.mainK,  w.name AS initInCharge, pw.total,";
            sql += " pwl.line AS pwlLine, cu.name AS cuName, pwl.cost AS pwlC, pwl.quantity AS pwlQ, pwl.k AS pwlK, pwl.amount AS pwlA,";
            sql += " cul.line AS culLine, i.name AS itemName, cul.quantity AS qUc, (cul.quantity * pwl.quantity) AS qPw, pwl.comments,";
            sql += " pwl.pwLineId, cul.cunitLineId"
            sql += " FROM pw AS pw";
            sql += " LEFT JOIN pw_line AS pwl ON pwl.pwId = pw.pwId";
            sql += " LEFT JOIN STATUS AS st ON st.statusId = pw.statusId";
            sql += " LEFT JOIN company AS c ON c.companyId = pw.companyId";
            sql += " LEFT JOIN zone AS z ON z.zoneId = pw.zoneId";
            sql += " LEFT JOIN worker AS w ON w.workerId = pw.initInCharge";
            sql += " LEFT JOIN cunit AS cu ON cu.cunitId = pwl.cunitId";
            sql += " LEFT JOIN cunit_line AS cul ON cul.cunitId = cu.cunitId";
            sql += " LEFT JOIN item AS i ON i.itemId = cul.itemId";
            sql += " WHERE pw.pwId = ?"
            sql += " ORDER BY pwl.line, pwl.pwLineId, cul.line, cul.cunitLineId";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var pws = fnPwR1DbToJs(res);
                done(null, pws);
            });
        }, test);
    },
    getItemInById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT"
            sql += " iin.itemInId, iin.storeId, s.name AS storeName, iin.workerId, w.name AS workerName,";
            sql += " iin.dateIn, iin.comments, iin.deliveryNote,";
            sql += " iinl.itemInLineId, i.name itemName, iinl.quantity";
            sql += " FROM item_in AS iin";
            sql += " LEFT JOIN worker AS w ON w.workerId = iin.workerId";
            sql += " LEFT JOIN store AS s ON s.storeId = iin.storeId";
            sql += " LEFT JOIN item_in_line AS iinl ON iinl.itemInId = iin.itemInId";
            sql += " LEFT JOIN item AS i ON i.itemId = iinl.itemId";
            sql += " WHERE iin.itemInId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var pws = fnItemInDbToJs(res);
                done(null, pws);
            });
        }, test);
    },
    getItemOutById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT";
            sql += " ion.itemOutId, ion.storeId, s.name AS storeName, ion.workerId, w.name AS workerName,";
            sql += " ion.dateOut, ion.comments,";
            sql += " ionl.itemOutLineId, i.name itemName, ionl.quantity";
            sql += " FROM item_out AS ion";
            sql += " LEFT JOIN worker AS w ON w.workerId = ion.workerId";
            sql += " LEFT JOIN store AS s ON s.storeId = ion.storeId";
            sql += " LEFT JOIN item_out_line AS ionl ON ionl.itemOutId = ion.itemOutId";
            sql += " LEFT JOIN item AS i ON i.itemId = ionl.itemId";
            sql += " WHERE ion.itemOutId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var pws = fnItemOutDbToJs(res);
                done(null, pws);
            });
        }, test);
    },
    getWoById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT wo.woId, wo.initDate, w.name AS workerName, pw.name AS pwName, wo.comments,";
            sql += " wol.woLineId, cu.name AS cuName, wol.estimate, wol.done, wol.quantity";
            sql += " FROM wo";
            sql += " LEFT JOIN pw ON pw.pwId = wo.pwId";
            sql += " LEFT JOIN worker AS w ON w.workerId = wo.workerId";
            sql += " LEFT JOIN wo_line AS wol ON wol.woId = wo.woId";
            sql += " LEFT JOIN cunit AS cu ON cu.cunitId = wol.cunitId";
            sql += " WHERE wo.woId = ?";
            sql += " AND wol.quantity > 0";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                if (err) return done(err);
                var pws = fnWoDbToJs(res);
                // obtain workers
                sql = "SELECT w.name AS worker, wok.quantity AS days";
                sql += " FROM wo AS wo";
                sql += " LEFT JOIN wo_worker AS wok ON wok.woId = wo.woId";
                sql += " LEFT JOIN worker AS w ON w.workerId = wok.workerId";
                sql += " WHERE wo.woId = ?";
                sql = mysql.format(sql, id);
                con.query(sql, function (err, res) {
                    dbCon.closeConnection(con);
                    if (err) return done(err);
                    pws.workers = res;
                    done(null, pws);
                });
            });
        }, test);
    },
    getClosureClosedById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT cl.closureId, cl.closureDate, w1.name workerName1, cl.comments AS comments1,";
            sql += " cll.closureLineId,  pw.name AS pwName, cll.estimate AS e1, cll.done AS done1, cll.amount,";
            sql += " wo.woId, w2.name AS workerName2, wo.initDate, wo.comments AS comments2,";
            sql += " wol.woLineId, cu.name AS cuName, wol.estimate AS e2, wol.done AS d2, wol.quantity";
            sql += " FROM closure AS cl";
            sql += " LEFT JOIN closure_line AS cll ON cll.closureId = cl.closureId";
            sql += " LEFT JOIN worker AS w1 ON w1.workerId = cl.workerId";
            sql += " LEFT JOIN pw AS pw ON pw.pwId = cll.pwId";
            sql += " LEFT JOIN wo AS wo ON wo.closureId = cl.closureId";
            sql += " LEFT JOIN wo_line AS wol ON wol.woId = wo.woId";
            sql += " LEFT JOIN worker AS w2 ON w2.workerId = wo.workerId";
            sql += " LEFT JOIN cunit AS cu ON cu.cunitId = wol.cunitId";
            sql += " WHERE cl.closureId = ? AND wol.quantity > 0";
            sql += " ORDER BY closureLineId, woId, woLineId;"
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var pws = fnClosureDbToJs(res);
                done(null, pws);
            });
        }, test);
    },
    getClosureOpenById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT cl.closureId, cl.closureDate, w1.name workerName1, cl.comments AS comments1,";
            sql += " cll.closureLineId,  pw.name AS pwName, cll.estimate AS e1, cll.done AS done1, cll.amount,";
            sql += " wo.woId, w2.name AS workerName2, wo.initDate, wo.comments AS comments2,";
            sql += " wol.woLineId, cu.name AS cuName, wol.estimate AS e2, wol.done AS d2, wol.quantity";
            sql += " FROM closure AS cl";
            sql += " LEFT JOIN closure_line AS cll ON cll.closureId = cl.closureId";
            sql += " LEFT JOIN worker AS w1 ON w1.workerId = cl.workerId";
            sql += " LEFT JOIN pw AS pw ON pw.pwId = cll.pwId";
            sql += " LEFT JOIN";
            sql += " (SELECT wo.*";
            sql += " FROM wo";
            sql += " LEFT JOIN closure AS c ON c.closureId = ?";
            sql += " WHERE wo.pwId IN (SELECT pwId FROM closure_line WHERE closureId = ?)";
            sql += " AND wo.initDate <= c.closureDate AND wo.closureId IS NULL)";
            sql += " AS wo ON wo.pwId = pw.pwId";
            sql += " LEFT JOIN wo_line AS wol ON wol.woId = wo.woId";
            sql += " LEFT JOIN worker AS w2 ON w2.workerId = wo.workerId";
            sql += " LEFT JOIN cunit AS cu ON cu.cunitId = wol.cunitId";
            sql += " WHERE cl.closureId = ? AND wol.quantity > 0";
            sql += " ORDER BY closureLineId, woId, woLineId;";
            sql = mysql.format(sql, [id, id, id]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var pws = fnClosureDbToJs(res);
                done(null, pws);
            });
        }, test);
    },
    getPwReporStatusMain: function (id, done, test) {
        async.parallel([
            function (callback) {
                fnPwReportStatusMain(id, function (err, res) {
                    if (err) return callback(err);
                    callback(null, res);
                })
            },
            function (callback) {
                fnPwReportStatusLine(id, function (err, res) {
                    if (err) return callback(err);
                    callback(null, res);
                })
            }
        ],
            function (err, results) {
                if (err) return done(err);
                // provisional, first object
                if (!results[0]) return done(null, null);
                var o = results[0];
                o.nreport = "ESTADO DE OBRA";
                o.culines = results[1];
                done(null, o);
            });
    },
    getPwReporConsumeMain: function (id, done, test) {
        async.parallel([
            function (callback) {
                fnPwReportStatusMain(id, function (err, res) {
                    if (err) return callback(err);
                    callback(null, res);
                })
            },
            function (callback) {
                fnPwReportConsumeLine1(id, function (err, res) {
                    if (err) return callback(err);
                    callback(null, res);
                })
            },
            function (callback) {
                fnPwReportConsumeLine2(id, function (err, res) {
                    if (err) return callback(err);
                    callback(null, res);
                })
            }
        ],
            function (err, results) {
                if (err) return done(err);
                // provisional, first object
                if (!results[0]) return done(null, null);
                var o = results[0];
                o.nreport = "CONSUMO EN OBRA";
                o.ilines = results[1];
                o.wlines = results[2];
                done(null, o);
            });
    },
    getReportStoreMain: function (id, done, test) {
        async.parallel([
            function (callback) {
                fnReportStoreMain(id, function (err, res) {
                    if (err) return callback(err);
                    callback(null, res);
                })
            },
            function (callback) {
                fnReportStoreLine(id, function (err, res) {
                    if (err) return callback(err);
                    callback(null, res);
                })
            }
        ],
            function (err, results) {
                if (err) return done(err);
                // provisional, first object
                if (!results[0]) return done(null, null);
                var o = results[0];
                o.nreport = "SITUACION DE ALMACEN";
                o.ilines = results[1];
                done(null, o);
            });
    },
    getReportItemMain: function (id, id2, done, test) {
        async.waterfall([
            function (callback) {
                fnReportItemMain(id, id2, function (err, res) {
                    if (err) return callback(err);
                    callback(null, res);
                })
            },
            function (arg1, callback) {
                fnReportItemLine(id, id2, arg1.lastInvDate, function (err, res) {
                    if (err) return callback(err);
                    var r2 = [];
                    var lStock = arg1.lastStock;
                    if (!lStock) {
                        lStock = 0;
                    }
                    res.forEach(function(i){
                        if (i.type == 'SALIDA'){
                            lStock -= i.quantity;
                        }else{
                            lStock += i.quantity;
                        }
                        i.lStock = lStock;
                        r2.push(i);
                    });
                    var rs = [];
                    rs.push(arg1);
                    rs.push(r2);
                    callback(null, rs);
                })
            }
        ],
            function (err, results) {
                if (err) return done(err);
                // provisional, first object
                if (!results[0]) return done(null, null);
                var o = results[0];
                o.nreport = "MOVIMENTOS DE ARTÍCULO";
                o.ilines = results[1];
                done(null, o);
            });
    }
};

// ----
var fnPwReportStatusMain = function (id, done) {
    dbCon.getConnection(function (err, res) {
        if (err) return done(err);
        var con = res; // mysql connection
        var sql = "SELECT";
        sql += " pw.reference AS reference, pw.name AS pwname, pw.description AS description,";
        sql += " DATE_FORMAT(initDate, '%d/%m/%Y') AS initialDate, cmp.name AS company, w1.name AS initInCharge,";
        sql += " z.name AS zone, pw.mainK AS k, pw.total, s.name AS STATUS,";
        sql += " DATE_FORMAT(acepDate, '%d/%m/%Y') AS acepDate, w2.name AS acepInCharge, pw.acepRef,";
        sql += " DATE_FORMAT(finDate, '%d/%m/%Y') AS finDate, w3.name AS finInCharge, pw.finRef,";
        sql += " DATE_FORMAT(cerDate, '%d/%m/%Y') AS cerDate, w4.name AS cerInCharge, pw.cerRef,";
        sql += " DATE_FORMAT(invDate, '%d/%m/%Y') AS invDate, w5.name AS invInCharge, pw.invRef,";
        sql += " DATE_FORMAT(payDate, '%d/%m/%Y') AS payDate, w6.name AS payInCharge, pw.payRef,";
        sql += " ROUND(e.c,2) AS estimate, ROUND(d.c,2) AS done, ROUND((COALESCE(d.c,0) / COALESCE(e.c,1)*100), 2) AS percentage, ROUND(w.c,2) AS cost";
        sql += " FROM pw";
        sql += " LEFT JOIN company AS cmp ON cmp.companyId = pw.companyId";
        sql += " LEFT JOIN worker AS w1 ON w1.workerId = pw.initInCharge";
        sql += " LEFT JOIN worker AS w2 ON w2.workerId = pw.acepInCharge";
        sql += " LEFT JOIN worker AS w3 ON w3.workerId = pw.finInCharge";
        sql += " LEFT JOIN worker AS w4 ON w4.workerId = pw.cerInCharge";
        sql += " LEFT JOIN worker AS w5 ON w5.workerId = pw.invInCharge";
        sql += " LEFT JOIN worker AS w6 ON w6.workerId = pw.payInCharge";
        sql += " LEFT JOIN zone AS z ON z.zoneId = pw.zoneId";
        sql += " LEFT JOIN STATUS AS s ON s.statusId = pw.statusId"
        sql += " LEFT JOIN (SELECT pwl.pwId AS p, SUM(pwl.quantity * cu.cost) AS c FROM pw_line AS pwl LEFT JOIN cunit AS cu ON cu.cunitId = pwl.cunitId GROUP BY pwl.pwId) AS e ON e.p = pw.pwId";
        sql += " LEFT JOIN (SELECT wo.pwId AS p, SUM(wol.quantity * cu.cost) AS c FROM wo_line AS wol LEFT JOIN wo ON wol.woId = wo.woId LEFT JOIN cunit AS cu ON cu.cunitId = wol.cunitId GROUP BY wo.pwId) AS d ON d.p = pw.pwId";
        sql += " LEFT JOIN (SELECT wo.pwId AS p, SUM(wow.quantity * wow.cost) AS c FROM wo_worker AS wow INNER JOIN wo ON wo.woId = wow.woId GROUP BY wo.pwId) AS w ON w.p = pw.pwId";
        sql += " WHERE pw.pwId = ?"
        sql = mysql.format(sql, id);
        con.query(sql, function (err, res) {
            dbCon.closeConnection(con);
            if (err) return done(err);
            if (res.length == 0) {
                done(null, null);
            } else {
                done(null, res[0]);
            }
        });
    }, false);
}

var fnPwReportStatusLine = function (id, done) {
    dbCon.getConnection(function (err, res) {
        if (err) return done(err);
        var con = res; // mysql connection
        var sql = "SELECT cu.name, pwl1.quantity AS estimate, COALESCE(wol1.quantity, 0) AS done,";
        sql += " ROUND(COALESCE((wol1.quantity / pwl1.quantity ) * 100, 0), 2) AS percentage";
        sql += " FROM";
        sql += " (SELECT pw.pwId, pwl.cunitId, SUM(quantity) AS quantity";
        sql += " FROM pw";
        sql += " LEFT JOIN pw_line AS pwl ON pwl.pwId = pw.pwId";
        sql += " GROUP BY pw.pwId, pwl.cunitId) AS pwl1";
        sql += " LEFT JOIN";
        sql += " (SELECT wo.pwId, wol.cunitId, SUM(quantity) AS quantity";
        sql += " FROM wo";
        sql += " LEFT JOIN wo_line AS wol ON wol.woId = wo.woId";
        sql += " GROUP BY wo.pwId, wol.cunitId) AS wol1";
        sql += " ON wol1.pwId = pwl1.pwId AND wol1.cunitId = pwl1.cunitId";
        sql += " LEFT JOIN cunit AS cu ON pwl1.cunitId = cu.cunitId";
        sql += " WHERE pwl1.pwId = ?"
        sql = mysql.format(sql, id);
        con.query(sql, function (err, res) {
            dbCon.closeConnection(con);
            if (err) return done(err);
            if (res.length == 0) {
                done(null, null);
            } else {
                done(null, res);
            }
        });
    }, false);
}

var fnPwReportConsumeLine1 = function (id, done) {
    dbCon.getConnection(function (err, res) {
        if (err) return done(err);
        var con = res; // mysql connection
        var sql = "SELECT i.name, SUM(iol.quantity) AS quantity";
        sql += " FROM item_out AS io";
        sql += " LEFT JOIN item_out_line AS iol ON iol.itemOutId = io.itemOutId";
        sql += " LEFT JOIN item AS i ON i.itemId = iol.itemId";
        sql += " WHERE io.pwId = ?";
        sql += " GROUP BY io.pwId, iol.itemId";
        sql += " ORDER BY i.name";
        sql = mysql.format(sql, id);
        con.query(sql, function (err, res) {
            dbCon.closeConnection(con);
            if (err) return done(err);
            if (res.length == 0) {
                done(null, null);
            } else {
                done(null, res);
            }
        });
    }, false);
}

var fnPwReportConsumeLine2 = function (id, done) {
    dbCon.getConnection(function (err, res) {
        if (err) return done(err);
        var con = res; // mysql connection
        var sql = "SELECT w.name, SUM(wow.quantity) AS quantity, SUM(wow.cost) AS cost";
        sql += " FROM wo";
        sql += " LEFT JOIN wo_worker AS wow ON wow.woId = wo.woId";
        sql += " LEFT JOIN worker AS w ON w.workerId = wow.workerId";
        sql += " WHERE wo.pwId = ?";
        sql += " GROUP BY wo.pwId, wow.workerId";
        sql += " ORDER BY w.name";
        sql = mysql.format(sql, id);
        con.query(sql, function (err, res) {
            dbCon.closeConnection(con);
            if (err) return done(err);
            if (res.length == 0) {
                done(null, null);
            } else {
                done(null, res);
            }
        });
    }, false);
}

var fnReportStoreMain = function (id, done) {
    dbCon.getConnection(function (err, res) {
        if (err) return done(err);
        var con = res; // mysql connection
        var sql = "SELECT *, DATE_FORMAT(CURDATE(),'%d/%m/%Y') reportDate from store";
        sql += " WHERE storeId = ?"
        sql = mysql.format(sql, id);
        con.query(sql, function (err, res) {
            dbCon.closeConnection(con);
            if (err) return done(err);
            if (res.length == 0) {
                done(null, null);
            } else {
                done(null, res[0]);
            }
        });
    }, false);
}

var fnReportStoreLine = function (id, done) {
    dbCon.getConnection(function (err, res) {
        if (err) return done(err);
        var con = res; // mysql connection
        var sql = "SELECT i.name, DATE_FORMAT(lastInvDate, '%d/%m/%Y') lastInvDate,";
        sql += " lastStock, stock";
        sql += " FROM item_stock AS ist";
        sql += " LEFT JOIN item AS i ON i.itemId = ist.itemId";
        sql += " WHERE ist.storeId = ?";
        sql += " ORDER BY i.name";
        sql = mysql.format(sql, id);
        con.query(sql, function (err, res) {
            dbCon.closeConnection(con);
            if (err) return done(err);
            if (res.length == 0) {
                done(null, null);
            } else {
                done(null, res);
            }
        });
    }, false);
}

var fnReportItemMain = function (id, id2, done) {
    dbCon.getConnection(function (err, res) {
        if (err) return done(err);
        var con = res; // mysql connection
        var sql = "SELECT i.name AS item, s.name AS store, DATE_FORMAT(CURDATE(),'%d/%m/%Y') reportDate,";
        sql += " DATE_FORMAT(ist.lastInvDate,'%d/%m/%Y') AS invDate, ist.lastStock, ist.stock, DATE_FORMAT(ist.lastInvDate, '%Y-%m-%d') as lastInvDate";
        sql += " FROM item_stock AS ist";
        sql += " LEFT JOIN store AS s ON s.storeId = ist.storeId";
        sql += " LEFT JOIN item AS i ON i.itemId = ist.itemId";
        sql += " WHERE ist.itemId = ? AND ist.storeId = ?";
        sql = mysql.format(sql, [id, id2]);
        con.query(sql, function (err, res) {
            dbCon.closeConnection(con);
            if (err) return done(err);
            if (res.length == 0) {
                done(null, null);
            } else {
                done(null, res[0]);
            }
        });
    }, false);
}

var fnReportItemLine = function (id, id2, date, done) {
    if (!date) {
        date = new Date(1, 1, 1);
    }
    dbCon.getConnection(function (err, res) {
        if (err) return done(err);
        var con = res; // mysql connection
        var sql = "SELECT DATE_FORMAT(mov.dMov,'%d/%m/%Y') AS dMov, mov.type, mov.inCharge, mov.quantity";
        sql += " FROM";
        sql += " (SELECT io.itemOutId as id, iol.itemId, dateOut AS dMov, 'SALIDA' AS TYPE,  w.name AS inCharge, quantity";
        sql += " FROM item_out_line iol";
        sql += " LEFT JOIN item_out AS io ON io.itemOutId = iol.itemOutId";
        sql += " LEFT JOIN worker AS w ON w.workerId = io.workerId";
        sql += " WHERE iol.itemId = ? AND io.dateOut > ? AND io.storeId = ?";
        sql = mysql.format(sql, [id, date, id2]);

        sql += " UNION";
        sql += " SELECT ii.itemInId as id, iil.itemId, dateIn AS dMov, 'ENTRADA' AS TYPE,  w.name AS inCharge, quantity";
        sql += " FROM item_in_line iil";
        sql += " LEFT JOIN item_in AS ii ON ii.itemInId = iil.itemInId";
        sql += " LEFT JOIN worker AS w ON w.workerId = ii.workerId";
        sql += " WHERE iil.itemId = ?  AND ii.dateIn > ? AND ii.storeId = ?) AS mov";
        sql += " ORDER BY mov.dMov";
        sql = mysql.format(sql, [id, date, id2]);

        con.query(sql, function (err, res) {
            dbCon.closeConnection(con);
            if (err) return done(err);
            if (res.length == 0) {
                done(null, null);
            } else {
                done(null, res);
            }
        });
    }, false);
}

// ----------------- AUXILIARY FUNCTIONS
// fnDeliveryDbToJs:
// transfors a db record into a js object
var fnDeliveryDbToJs = function (odb) {
    var o = {
        nreport: "RESERVAS / ENTREGAS",
    }
    if (odb.length == 0) return o;
    // There are records
    o.pw = odb[0].pwName;
    if (odb[0].lastDate)
        o.lastDate = moment(odb[0].lastDate).format('DD/MM/YYYY');
    if (odb[0].workerName)
        o.worker = odb[0].workerName;
    if (odb[0].storeName)
        o.store = odb[0].storeName;

    o.lines = [];
    odb.forEach(function (v) {
        var l = {
            item: v.itemName,
            estimate: v.estimate,
            done: v.done
        };
        o.lines.push(l);
    });
    return o;
}

// fnInventoryDbToJs:
// transfors a db record into a js object
var fnInventoryDbToJs = function (odb) {
    var o = {
        nreport: "TOMA DE INVENTARIO",
    }
    if (odb.length == 0) return o;
    // There are records
    if (odb[0].inventoryDate)
        o.inventoryDate = moment(odb[0].inventoryDate).format('DD/MM/YYYY');
    if (odb[0].workerName)
        o.worker = odb[0].workerName;
    if (odb[0].storeName)
        o.store = odb[0].storeName;
    if (odb[0].comments)
        o.comments = odb[0].comments;
    o.lines = [];
    odb.forEach(function (v) {
        var l = {
            item: v.itemName
        };
        o.lines.push(l);
    });
    return o;
}

// fnPwR1DbToJs:
// transfors a db record into a js object
var fnPwR1DbToJs = function (odb) {
    var o = {
        nreport: "INFORME PROPUESTA",
    }
    if (odb.length == 0) return o;
    // There are records
    o.pw = odb[0].pwName;
    if (odb[0].initDate)
        o.initDate = moment(odb[0].initDate).format('DD/MM/YYYY');
    if (odb[0].workerName)
        o.worker = odb[0].workerName;
    if (odb[0].initInCharge)
        o.initInCharge = odb[0].initInCharge;
    if (odb[0].description)
        o.description = odb[0].description;
    if (odb[0].refPw)
        o.reference = odb[0].refPw;
    if (odb[0].zoneName)
        o.zone = odb[0].zoneName;
    if (odb[0].mainK)
        o.globalK = odb[0].mainK;
    if (odb[0].total)
        o.total = odb[0].total;
    if (odb[0].STATUS)
        o.status = odb[0].STATUS;
    if (odb[0].company)
        o.company = odb[0].company;

    o.lines = [];
    var prevPwLineId = 0;
    var prevCunitLineId = 0;
    var l1 = null;
    var l2 = null;
    odb.forEach(function (v) {
        // change cuName and is not first
        if (v.pwLineId != prevPwLineId) {
            if (l1) {
                o.lines.push(l1);
            }
            l1 = {
                line: v.pwlLine,
                cunit: v.cuName,
                cost: v.pwlC,
                quantity: v.pwlQ,
                k: v.pwlK,
                amount: v.pwlA,
                comments: v.comments,
                items: []
            };
            prevPwLineId = v.pwLineId;
            prevCunitLineId = 0;
        }
        // change itemName and is not first
        if (v.cunitLineId != prevCunitLineId) {
            l2 = {
                line: "",
                item: v.itemName,
                qUc: v.qUc,
                qPw: v.qPw,
            };
            l1.items.push(l2);
            prevCunitLineId = v.cunitLineId;
        }
    });
    // load the last
    o.lines.push(l1);
    return o;
}

// fnItemInDbToJs:
// transfors a db record into a js object
var fnItemInDbToJs = function (odb) {
    var o = {
        nreport: "ENTRADA MERCANCIA",
    }
    if (odb.length == 0) return o;
    // There are records
    if (odb[0].dateIn)
        o.dateIn = moment(odb[0].dateIn).format('DD/MM/YYYY');
    if (odb[0].workerName)
        o.workerName = odb[0].workerName;
    if (odb[0].storeName)
        o.storeName = odb[0].storeName;
    if (odb[0].deliveryNote)
        o.deliveryNote = odb[0].deliveryNote;
    if (odb[0].comments)
        o.comments = odb[0].comments;
    o.lines = [];
    odb.forEach(function (v) {
        if (v.itemName) {
            var l = {
                item: v.itemName.replace('"', ''),
                quantity: v.quantity
            };
            o.lines.push(l);
        }
    });
    return o;
}

// fnItemOutDbToJs:
// transfors a db record into a js object
var fnItemOutDbToJs = function (odb) {
    var o = {
        nreport: "SALIDA MERCANCIA",
    }
    if (odb.length == 0) return o;
    // There are records
    if (odb[0].dateOut)
        o.dateOut = moment(odb[0].dateOut).format('DD/MM/YYYY');
    if (odb[0].workerName)
        o.workerName = odb[0].workerName;
    if (odb[0].storeName)
        o.storeName = odb[0].storeName;
    if (odb[0].comments)
        o.comments = odb[0].comments;
    o.lines = [];
    odb.forEach(function (v) {
        if (v.itemName) {
            var l = {
                item: v.itemName.replace('"', ''),
                quantity: v.quantity
            };
            o.lines.push(l);
        }
    });
    return o;
}

// fnWoDbToJs:
// transfors a db record into a js object
var fnWoDbToJs = function (odb) {
    var o = {
        nreport: "PARTE TRABAJO",
    }
    if (odb.length == 0) return o;
    // There are records
    if (odb[0].initDate)
        o.initDate = moment(odb[0].initDate).format('DD/MM/YYYY');
    if (odb[0].workerName)
        o.workerName = odb[0].workerName;
    if (odb[0].pwName)
        o.pwName = odb[0].pwName;
    if (odb[0].comments)
        o.comments = odb[0].comments;
    o.lines = [];
    odb.forEach(function (v) {
        if (v.cuName) {
            var l = {
                cunit: v.cuName.replace('"', ''),
                estimate: v.estimate,
                done: v.done,
                quantity: v.quantity
            };
            o.lines.push(l);
        }
    });
    return o;
}


// fnClosureDbToJs:
// transfors a db record into a js object
var fnClosureDbToJs = function (odb) {
    var o = {
        nreport: "INFORME CIERRE",
    }
    if (odb.length == 0) return o;
    // There are records
    if (odb[0].closureDate)
        o.closureDate = moment(odb[0].closureDate).format('DD/MM/YYYY');
    if (odb[0].workerName1)
        o.workerName1 = odb[0].workerName1;
    if (odb[0].comments1)
        o.comments1 = odb[0].comments1;
    o.lines = [];
    var prevClosureLineId = 0;
    var prevWoId = 0;
    var prevWoLineId = 0;
    var l1 = null;
    var l2 = null;
    var l3 = null;
    odb.forEach(function (v) {
        // 
        if (v.closureLineId != prevClosureLineId) {
            if (l1) {
                o.lines.push(l1);
            }
            l1 = {
                pwName: v.pwName,
                e1: (v.e1 * 100) + "%",
                done1: (v.done1 * 100) + "%",
                amount: v.amount,
                lines2: []
            };
            prevClosureLineId = v.closureLineId;
            prevWoId = 0;
            preWoLineId = 0;
        }
        // 
        if (v.woId != prevWoId) {
            l2 = {
                workerName2: v.workerName2,
                comments2: v.comments2,
                lines3: []
            };
            if (v.initDate)
                l2.initDate = moment(v.initDate).format('DD/MM/YYYY');
            l1.lines2.push(l2);
            prevWoId = v.woId;
            prevWoLineId = 0;
        }
        // 
        if (v.woLineId != prevWoLineId) {
            l3 = {
                cuName: v.cuName,
                e2: v.e2,
                d2: v.d2,
                quantity: v.quantity
            };
            l2.lines3.push(l3);
            prevWoLineId = v.woLineId;
        }
    });
    // load the last
    o.lines.push(l1);
    return o;
}

module.exports = reportAPI;