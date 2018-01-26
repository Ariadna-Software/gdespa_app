var mysql = require('mysql'),
    util = require('./util'),
    dbCon = require('./db_connection');

// -------------------- MAIN API
var holidayAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT h.*, dt.name as dayTypeName, DATE_FORMAT(h.holidayDate, '%Y-%m-%d') as holidayDateF";
            sql += " FROM holiday as h LEFT JOIN day_type as dt ON dt.dayTypeId = h.dayTypeId";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var holidays = [];
                res.forEach(function (udb) {
                    holidays.push(fnHolidayDbToJs(udb));
                });
                done(null, holidays);
            });
        }, test);
    }, 
    getByName: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT h.*, dt.name as dayTypeName, DATE_FORMAT(h.holidayDate, '%Y-%m-%d') as holidayDateF";
            sql += " FROM holiday as h LEFT JOIN day_type as dt ON dt.dayTypeId = h.dayTypeId";
            if (name && (name != '*')){
                sql += " WHERE h.name LIKE '%" + name +"%'";
            }
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var holidays = [];
                res.forEach(function (udb) {
                    holidays.push(fnHolidayDbToJs(udb));
                });
                done(null, holidays);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT h.*, dt.name as dayTypeName, DATE_FORMAT(h.holidayDate, '%Y-%m-%d') as holidayDateF";
            sql += " FROM holiday as h LEFT JOIN day_type as dt ON dt.dayTypeId = h.dayTypeId";
            sql += " WHERE h.holidayId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var holidays = [];
                res.forEach(function (udb) {
                    holidays.push(fnHolidayDbToJs(udb));
                });
                done(null, holidays);
            });
        }, test);
    },
    post: function (holiday, done, test) {
        // controls holiday properties
        if (!fnCheckAreaType(holiday)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnHolidayJsToDb(holiday);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO holiday SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                holiday.holidayId = res.insertId;
                done(null, fnHolidayDbToJs(holiday));
            });
        }, test);
    },
    put: function (holiday, done, test) {
        // controls holiday properties
        if (!fnCheckAreaType(holiday)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        var udb = fnHolidayJsToDb(holiday);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE holiday SET ? WHERE holidayId = ?";
            sql = mysql.format(sql, [udb, udb.holidayId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                // return object from db
                module.exports.getById(udb.holidayId, function (err, res) {
                    if (err) return done(err);
                    done(null, res[0]);
                }, test);
            });
        }, test);
    },
    delete: function (holiday, done, test) {
        var udb = fnHolidayJsToDb(holiday);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM holiday WHERE holidayId = ?";
            sql = mysql.format(sql, udb.holidayId);
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
    u.id = u.holidayId;
    // delete properties not needed
    delete u.holidayId;
    return u;
}

// fnHolidayJsToDb
// transforms a js object into a db record
var fnHolidayJsToDb = function (u) {
    // add properties
    u.holidayId = u.id;
    // delete some properties
    delete u.id;
    return u;
}

// fnCheckAreaType
// checks if the object has old properties needed
var fnCheckAreaType = function (u) {
    var check = true;
    check = (check && u.hasOwnProperty("id"));
    check = (check && u.hasOwnProperty("name"));
    return check;
}

module.exports = holidayAPI;