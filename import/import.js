var xlsx = require("xlsx");
var book = xlsx.readFile("./import.xls");
var mysql = require("mysql");
var dbCon = require('../lib/db_connection');
var async = require("async");

var sheet_name = book.SheetNames[5];
console.log(sheet_name);
var sheet = book.Sheets[sheet_name];
var cellEmpty = false;
var codes = [];
var i = 10;
var sql = "";
var desc = " ACOPIO, SUMINISTRO Y TRANSPORTE DE MATERIALES.";
desc += " MONTAJE DEL CONJUNTO,  RETENSADO DE CONDUCTORES.";
desc += " APERTURA  Y CIERRE DONDE SE REQUIERA."
var isNumber = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

var altaCUnit = function (lista, done) {
    async.each(lista, function (cu, callback) {
        dbCon.getConnection(function (err, conn) {
            if (err) callback(err);
            var sql = "INSERT INTO cunit SET ? ON DUPLICATE KEY UPDATE ?";
            sql = mysql.format(sql, [cu, cu]);
            conn.query(sql, function (err) {
                dbCon.closeConnection(conn);
                if (err) return callback(err);
                callback();
            })
        })
    }, function (err) {
        if (err) return done(err);
        done();
    });
};

var altaCUnitLine = function (lista, done) {
    var cunit = null;
    var itemR = null;
    async.each(lista, function (cul, callback) {
        dbCon.getConnection(function (err, conn) {
            if (err) callback(err);
            // primero obtenemos la unidad constructiva
            var sql = "SELECT * FROM cunit WHERE reference = ?";
            sql = mysql.format(sql, cul.ref);
            conn.query(sql, function (err, res) {
                dbCon.closeConnection(conn);
                if (err) return callback(err);
                cunit = res[0];
                // damos de alta el artículo
                var item = {
                    reference: cul.ref2,
                    name: cul.name
                }
                dbCon.getConnection(function (err, conn) {
                    sql = "INSERT INTO item SET ? ON DUPLICATE KEY UPDATE ?";
                    sql = mysql.format(sql, [item, item]);
                    conn.query(sql, function (err) {
                        if (err) return callback(err);
                        // buscamos el artículo que hemos creado
                        sql = "SELECT * FROM item WHERE reference = ?";
                        sql = mysql.format(sql, cul.ref2);
                        conn.query(sql, function (err, res) {
                            if (err) return callback(err);
                            itemR = res[0];
                            // y ahora la linea de unidad
                            var clin = {
                                cunitId: cunit.cunitId,
                                line: cul.line,
                                itemId: itemR.itemId,
                                quantity: cul.quantity
                            };
                            sql = "INSERT INTO cunit_line SET ? ON DUPLICATE KEY UPDATE ?";
                            sql = mysql.format(sql, [clin, clin]);
                            conn.query(sql, function (err, res) {
                                dbCon.closeConnection(conn);
                                if (err) return callback(err);
                                callback();
                            });
                        });
                    })
                });
            })
        });

    }, function (err) {
        if (err) return done(err);
        done();
    });
};

var cunits = [];
while (i < 100000) {
    // Only first column
    i++;
    var c1 = sheet['A' + i];
    var c2 = sheet['B' + i];
    var c3 = sheet['G' + i];
    if (c1) {
        var cu = {
            reference: c1.v,
            name: c2.v,
            cost: c3.v,
            description: desc
        }
        cunits.push(cu);
    }
}

var i = 10
var uc = "";
var l = 0;
var cunits2 = [];
while (i < 100000) {
    // Only first column
    i++;
    var c1 = sheet['A' + i];
    if (c1) {
        uc = c1.v;
        l = 0;
    }
    var a1 = sheet['B' + i];
    var a2 = sheet['C' + i];
    var a3 = sheet['D' + i];
    if (a1 && isNumber(a1.v)) {
        l++;
        var cu2 = {
            ref: uc,
            line: l,
            ref2: a1.v,
            quantity: a2.v,
            name: a3.v
        }
        cunits2.push(cu2);
    }
}

async.series([function (callback) {
    altaCUnit(cunits, function (err, res) {
        if (err) {
            return callback(err);
        } else {
            console.log("FCREATE CU");
            callback();
        }
    });
}, function (callback) {
    altaCUnitLine(cunits2, function (err, res) {
        if (err) {
            return callback(err);
        } else {
            console.log("FCREATE ART / CUL");
            callback();
        }
    });
}], function (err) {
    if (err) {
        console.log("ERR: ", err);
    } else {
        console.log("FIN _ PRO");
    }
});

