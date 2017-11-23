/*
 * =================================================
 * invoice.js
 * All functions related to user group management in
 * database MYSQL
 * ==================================================
*/
var mysql = require('mysql'),
    util = require('./util'),
    dbCon = require('./db_connection');

var XLSX = require('xlsx');
var path = require('path');
var moment = require('moment');
var async = require('async');

var invoiceAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT i.*, pw.name as pwName FROM invoice as i LEFT JOIN pw ON pw.pwId = i.pwId";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnInvoiceDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT i.*, pw.name as pwName FROM invoice as i LEFT JOIN pw ON pw.pwId = i.pwId WHERE i.invoiceId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnInvoiceDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    getByPwId: function (pwId, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT i.*, pw.name as pwName FROM invoice as i LEFT JOIN pw ON pw.pwId = i.pwId WHERE i.pwId = ?";
            sql = mysql.format(sql, pwId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(fnInvoiceDbToJs(gdb));
                });
                done(null, groups);
            });
        }, test);
    },
    post: function (invoice, done, test) {
        // obtain db record
        var gdb = fnInvoiceJsToDb(invoice);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO invoice SET ?";
            sql = mysql.format(sql, gdb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                invoice.invoiceId = res.insertId;
                done(null, fnInvoiceDbToJs(invoice));
            });
        }, test);
    },
    postImportFile: function (data, done, test) {
        fnImportFile(data, function (err, data) {
            if (err) return done(err);
            done(null, data);
        })
    },
    postInvoicesUp: function (data, done, test) {
        fnUpInvoices(data, function (err, data) {
            if (err) return done(err);
            done(null, data);
        })
    },
    put: function (invoice, done, test) {
        var gdb = fnInvoiceJsToDb(invoice);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE invoice SET ? WHERE invoiceId = ?";
            sql = mysql.format(sql, [gdb, gdb.invoiceId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, fnInvoiceDbToJs(invoice));
            });
        }, test);
    },
    delete: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM invoice WHERE invoiceId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    }
};

var fnUpInvoices = function (data, done) {
    async.eachSeries(data,
        function (f, callback) {
            delete f.pwName;
            delete f.reference;
            if (f.pwId == 0) return callback();
            if (f.invoiceId == 0){
                invoiceAPI.post(f, function(err){
                    if (err) return callback(err);
                    callback();
                }, false)
            }else{
                invoiceAPI.put(f, function(err){
                    if (err) return callback(err);
                    callback();
                }, false)
            }
        },
        function (err) {
            if (err) return done(err);
            done(null, 'OK');
        })
}

// fnInvoiceDbToJs:
// transfors a db record into a js object
var fnInvoiceDbToJs = function (gdb) {
    gdb.invoiceDate = util.serverParseDate(gdb.invoiceDate);
    return gdb;
}

// fnInvoiceJsToDb
// transforms a js object into a db record
var fnInvoiceJsToDb = function (g) {
    return g;
}



var fnImportFile = function (data, done) {
    // crear una lista vacía de posibles facturas
    var pfacs = [];
    var mens = "";
    // obtener el fichero del campo correspondiente de data
    var file = path.join(__dirname, '../public/uploads/' + data.filename);
    var book = XLSX.readFile(file);
    var sheet_name = book.SheetNames[data.sheetNumber];
    var sheet = book.Sheets[sheet_name];
    for (var i = data.firstDataRow * 1; i <= data.lastDataRow * 1; i++) {
        var mens2 = fnVerifyRow(sheet, i, data);
        if (mens2 != "") {
            mens += mens2;
            continue;
        }
        var invoiceNumber = sheet[data.nColInvoiceNumber + i].v;
        var invoiceDate = moment(ExcelDateToJSDate(sheet[data.nColInvoiceDate + i].v)).format('YYYY-MM-DD');
        var positive = 0;
        if (sheet[data.nColAmount + i]) positive = sheet[data.nColAmount + i].v * 1;
        var negative = 0;
        if (sheet[data.nColAmount2 + i]) negative = sheet[data.nColAmount2 + i].v * 1;
        var amount = positive - negative;
        var comments = sheet[data.nColComments + i].v;
        var reference = sheet[data.nColReference + i].v;
        var invoice = {
            invoiceId: 0,
            invoiceNumber: invoiceNumber,
            invoiceDate: invoiceDate,
            amount: amount,
            comments: comments,
            reference: reference
        }
        pfacs.push(invoice);
    }
    var pfacs2 = [];
    async.eachSeries(pfacs,
        function (invoice, callback) {
            // comprobar si existe la obra relacionada
            dbCon.getConnection(function (err, res) {
                if (err) return done(err);
                var con = res; // mysql connection
                var sql = "SELECT * FROM pw WHERE reference = ?";
                sql = mysql.format(sql, invoice.reference);
                con.query(sql, function (err, res) {
                    if (err) {
                        dbCon.closeConnection(con);
                        return callback(err);
                    }
                    if (res.length == 0) {
                        invoice.pwId = 0;
                        invoice.pwName = "";
                    } else {
                        invoice.pwId = res[0].pwId;
                        invoice.pwName = res[0].name;
                    }
                    // comprobar si existe ya esa factura
                    var sql = "SELECT * FROM invoice WHERE invoiceNumber = ? AND invoiceDate = ?";
                    sql = mysql.format(sql, [invoice.invoiceNumber, invoice.invoiceDate]);
                    con.query(sql, function (err, res) {
                        dbCon.closeConnection(con);
                        if (err) return callback(err);
                        if (res.length == 0) {
                            invoice.invoiceId = 0;
                        } else {
                            invoice.invoiceId = res[0].invoiceId;
                        }
                        pfacs2.push(invoice);
                        callback();
                    });
                });
            }, false);
        },
        function (err) {
            if (err) return done(err);
            done(null, { facs: pfacs2, mens: mens });
        });
}

var fnVerifyRow = function (sheet, i, data) {
    var mens = "";
    if (!sheet[data.nColInvoiceNumber + i]) mens += "La celda " + data.nColInvoiceNumber + i + " está vacía. La fila " + i + " no se procesará <br\>";
    if (!sheet[data.nColInvoiceDate + i]) mens += "La celda " + data.nColInvoiceDate + i + " está vacía. La fila " + i + " no se procesará <br\>";
    if (!sheet[data.nColReference + i]) mens += "La celda " + data.nColReference + i + " está vacía. La fila " + i + " no se procesará <br\>";
    return mens;
}

var ExcelDateToJSDate = function (serial) {
    var utc_days = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);

    var fractional_day = serial - Math.floor(serial) + 0.0000001;

    var total_seconds = Math.floor(86400 * fractional_day);

    var seconds = total_seconds % 60;

    total_seconds -= seconds;

    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;

    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}


module.exports = invoiceAPI;



/* 
        // Comprobar si existe la obra de referencia
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT * FROM pw WHERE reference = ?";
            sql = mysql.format(sql, invoice.reference);
            con.query(sql, function (err, res) {
                if (err) {
                    dbCon.closeConnection(con);
                    return done(err);
                }
                if (res.length == 0) {
                    invoice.pwId = 0;
                } else {
                    invoice.pwId = res[0].pwId;
                }
                // comprobar si existe ya esa factura
                var sql = "SELECT * FROM invoice WHERE invoiceNumber = ? AND invoiceDate = ?";
                sql = mysql.format(sql, [invoice.invoiceNumber, invoice.invoiceDate]);
                con.query(sql, function (err, res) {
                    dbCon.closeConnection(con);
                    if (err) return done(err);
                    if (res.length == 0) {
                        invoice.invoiceId = 0;
                    } else {
                        invoice.invoiceId = res[0].invoiceId;
                    }
                    // comprobar si existe ya esa factura
                });
            });
        }, test);
*/