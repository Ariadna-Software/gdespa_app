var mysql = require('mysql'),
    util = require('./util'),
    dbCon = require('./db_connection');

// -------------------- MAIN API
var absAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT  ab.*,"
            sql += " DATE_FORMAT(ab.fromDate, '%Y-%m-%d') AS fromDateF, DATE_FORMAT(ab.toDate, '%Y-%m-%d') AS toDateF,";
            sql += " abt.name AS absTypeName, w.name AS workerName";
            sql += " FROM `abs` AS ab";
            sql += " LEFT JOIN abs_type AS abt ON abt.absTypeId = ab.absTypeId";
            sql += " LEFT JOIN worker AS w ON w.workerId = ab.workerId";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var abss = [];
                res.forEach(function (udb) {
                    abss.push(fnHolidayDbToJs(udb));
                });
                done(null, abss);
            });
        }, test);
    }, 
    getByName: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT  ab.*,"
            sql += " DATE_FORMAT(ab.fromDate, '%Y-%m-%d') AS fromDateF, DATE_FORMAT(ab.toDate, '%Y-%m-%d') AS toDateF,";
            sql += " abt.name AS absTypeName, w.name AS workerName";
            sql += " FROM `abs` AS ab";
            sql += " LEFT JOIN abs_type AS abt ON abt.absTypeId = ab.absTypeId";
            sql += " LEFT JOIN worker AS w ON w.workerId = ab.workerId";
            if (name && (name != '*')){
                sql += " WHERE ab.name LIKE '%" + name +"%'";
            }
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var abss = [];
                res.forEach(function (udb) {
                    abss.push(fnHolidayDbToJs(udb));
                });
                done(null, abss);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT  ab.*,"
            sql += " DATE_FORMAT(ab.fromDate, '%Y-%m-%d') AS fromDateF, DATE_FORMAT(ab.toDate, '%Y-%m-%d') AS toDateF,";
            sql += " abt.name AS absTypeName, w.name AS workerName";
            sql += " FROM `abs` AS ab";
            sql += " LEFT JOIN abs_type AS abt ON abt.absTypeId = ab.absTypeId";
            sql += " LEFT JOIN worker AS w ON w.workerId = ab.workerId";
            sql += " WHERE ab.absId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var abss = [];
                res.forEach(function (udb) {
                    abss.push(fnHolidayDbToJs(udb));
                });
                done(null, abss);
            });
        }, test);
    },
    post: function (abs, done, test) {
        // controls abs properties
        if (!fnCheckAreaType(abs)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnHolidayJsToDb(abs);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO abs SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                abs.absId = res.insertId;
                done(null, fnHolidayDbToJs(abs));
            });
        }, test);
    },
    put: function (abs, done, test) {
        // controls abs properties
        if (!fnCheckAreaType(abs)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        var udb = fnHolidayJsToDb(abs);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE abs SET ? WHERE absId = ?";
            sql = mysql.format(sql, [udb, udb.absId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                // return object from db
                module.exports.getById(udb.absId, function (err, res) {
                    if (err) return done(err);
                    done(null, res[0]);
                }, test);
            });
        }, test);
    },
    delete: function (abs, done, test) {
        var udb = fnHolidayJsToDb(abs);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM abs WHERE absId = ?";
            sql = mysql.format(sql, udb.absId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    }
}

// ----------------- AUXILIARY FUNCTIONS
// fnHolidayDbToJs:
// transfors a db record into a js object
var fnHolidayDbToJs = function (u) {
    // add some properties
    u.id = u.absId;
    // delete properties not needed
    delete u.absId;
    return u;
}

// fnHolidayJsToDb
// transforms a js object into a db record
var fnHolidayJsToDb = function (u) {
    // add properties
    u.absId = u.id;
    // delete some properties
    delete u.id;
    return u;
}

// fnCheckAreaType
// checks if the object has old properties needed
var fnCheckAreaType = function (u) {
    var check = true;
    check = (check && u.hasOwnProperty("id"));
    check = (check && u.hasOwnProperty("fromDate"));
    check = (check && u.hasOwnProperty("toDate"));
    check = (check && u.hasOwnProperty("absTypeId"));
    check = (check && u.hasOwnProperty("workerId"));
    return check;
}

module.exports = absAPI;