var express = require('express');
var router = express.Router();

var mysql = require('mysql'),
    dbCon = require('../lib/db_connection'),
    moment = require("moment"),
    async = require('async'),
    dbMoLine = require('../lib/mo_line');

router.get('/crear-ordenes/:fecha1/:fecha2', function (req, res) {
    var txt = "Crear ordenes";
    var fecha1 = req.params.fecha1;
    var fecha2 = req.params.fecha1;
    if (!fecha1 || !fecha2 ) return res.json("La fecha me falta en formato 'YYYY-MM-DD'");
    dbCon.getConnection(function (err, con) {
        if (err) return res.json("Error: " + err.message);
        var sql = "SELECT * FROM mo WHERE initDate >= '" + fecha1 + "' AND initDate <= '" + fecha2 + "'";
        sql += " ORDER BY initDate";
        con.query(sql, function (err, rows) {
            con.end();
            if (err) return res.json("Error: " + err.message);
            async.eachSeries(rows, function (r, callback) {
                dbMoLine.actualizarPartes(r.moId, function(err){
                    if (err) return callback(err);
                    callback();
                });
            }, function (err) {
                if (err) return res.json("Error: " + err.message);
                res.json(txt + " TERMINADO");
            });
        })
    }, false);
});

module.exports = router;