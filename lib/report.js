var mysql = require('mysql'),
    moment = require('moment'),
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
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var pws = fnWoDbToJs(res);
                done(null, pws);
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
    }
};

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
                e1: (v.e1  * 100) + "%",
                done1: (v.done1  * 100) + "%",
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