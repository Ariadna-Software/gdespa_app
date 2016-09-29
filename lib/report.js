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



module.exports = reportAPI;