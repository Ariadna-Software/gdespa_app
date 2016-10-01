var xlsx = require("xlsx");
var book = xlsx.readFile("./import.xls");
var mysql = require("mysql");
var dbCon = require('../lib/db_connection');
var async = require("async");

var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'aritel',
    database: 'gdespa'
});

var s = process.argv[2];
console.log("S: ", s);
// s = 4;
var sheet_name = book.SheetNames[s];
console.log(sheet_name);
var sheet = book.Sheets[sheet_name];
var cellEmpty = false;
var codes = [];

var sql = "";
var desc = " ACOPIO, SUMINISTRO Y TRANSPORTE DE MATERIALES.";
desc += " MONTAJE DEL CONJUNTO,  RETENSADO DE CONDUCTORES.";
desc += " APERTURA  Y CIERRE DONDE SE REQUIERA."
var isNumber = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

var altaCUnit = function (lista, done) {
    async.each(lista, function (cu, callback) {
        pool.getConnection(function (err, conn) {
            if (err) return callback(err);
            var sql = "INSERT INTO cunit SET ? ON DUPLICATE KEY UPDATE ?";
            sql = mysql.format(sql, [cu, cu]);
            conn.query(sql, function (err) {
                conn.release();
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
        console.log("OB1: ", JSON.stringify(cul));
        pool.getConnection(function (err, conn) {
            if (err) return callback(err);
            // primero obtenemos la unidad constructiva
            var sql = "SELECT * FROM cunit WHERE reference = ?";
            sql = mysql.format(sql, cul.ref);
            console.log("SQL: ", sql);
            conn.query(sql, function (err, res) {
                conn.release();
                if (err) return callback(err);
                console.log("OB2: ", JSON.stringify(cul));
                cunit = res[0];
                if (!cunit) {
                    console.log("REF: ", cul.ref);
                }
                // damos de alta el artículo
                var item = {
                    reference: cul.ref2,
                    name: cul.name
                }
                pool.getConnection(function (err, conn) {
                    if (err) return callback(err);
                    sql = "INSERT INTO item SET ? ON DUPLICATE KEY UPDATE ?";
                    sql = mysql.format(sql, [item, item]);
                    conn.query(sql, function (err) {
                        conn.release();
                        if (err) return callback(err);
                        pool.getConnection(function (err, conn) {
                            if (err) return callback(err);
                            // buscamos el artículo que hemos creado
                            sql = "SELECT * FROM item WHERE reference = ?";
                            sql = mysql.format(sql, cul.ref2);
                            conn.query(sql, function (err, res) {
                                conn.release();
                                if (err) return callback(err);
                                itemR = res[0];
                                // y ahora la linea de unidad
                                var clin = {
                                    cunitId: cunit.cunitId,
                                    line: cul.line,
                                    itemId: itemR.itemId,
                                    quantity: cul.quantity
                                };
                                pool.getConnection(function (err, conn) {
                                    if (err) return callback(err);
                                    sql = "INSERT INTO cunit_line SET ? ON DUPLICATE KEY UPDATE ?";
                                    sql = mysql.format(sql, [clin, clin]);
                                    conn.query(sql, function (err, res) {
                                        conn.release();
                                        if (err) return callback(err);
                                        console.log("OB2F ", JSON.stringify(cul));
                                        callback();
                                    });

                                })
                            });
                        })
                    })
                });
            })
        });

    }, function (err) {
        if (err) return done(err);
        done();
    });
};

var i = 9;
var cunits = [];
while (i < 100000) {
    // Only first column
    i++;
    var c1 = sheet['A' + i];
    var c2 = sheet['B' + i];
    var c3 = sheet['G' + i];
    if ((c1 && c1.v != '*') && c2) {
        var cu = {
            reference: c1.v,
            name: c2.v,
            description: desc
        }
        if (c3) {
            cu.cost = c3.v;
        }
        cunits.push(cu);
    }
}

var i = 9
var uc = "";
var l = 0;
var cunits2 = [];
while (i < 100000) {
    // Only first column
    i++;
    var c1 = sheet['A' + i];
    if (c1 && c1.v != '*') {
        uc = c1.v;
        l = 0;
    }
    var a1 = sheet['B' + i];
    var a2 = sheet['C' + i];
    var a3 = sheet['D' + i];
    if (a1 && isNumber(a1.v) && a2 && a3) {
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
        return;
    }
});

