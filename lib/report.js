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
        var l = {
            item: v.itemName.replace('"',''),
            quantity: v.quantity
        };
        o.lines.push(l);
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
        var l = {
            item: v.itemName.replace('"',''),
            quantity: v.quantity
        };
        o.lines.push(l);
    });
    return o;
}


module.exports = reportAPI;