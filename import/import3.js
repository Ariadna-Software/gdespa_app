var xlsx = require("xlsx");
var book = xlsx.readFile("./importK.xls");
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
//s = 1;
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

var modCosto = function (lista, done) {
    async.each(lista, function (cu, callback) {
        console.log("OB: ", JSON.stringify(cu));
        pool.getConnection(function (err, conn) {
            if (err) return callback(err);
            var sql = "UPDATE cunit SET cost = ? WHERE reference = ?";
            sql = mysql.format(sql, [cu.cost, cu.reference]);
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

var i = 0;
var cunits = [];
while (i < 100000) {
    // Only first column
    i++;
    var c1 = sheet['D' + i];
    var c2 = sheet['C' + i];
    if (c1 && c2) {
        var cu = {
            reference: c1.v,
            cost: c2.v.replace(',','.')
        }
        cunits.push(cu);
    }
}

modCosto(cunits, function(err, res){
    if (err){
        console.log("ERR: ", err);
    }else{
        console.log("OK");
    }
})



