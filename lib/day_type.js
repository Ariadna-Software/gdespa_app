var mysql = require('mysql'),
    util = require('./util'),
    dbCon = require('./db_connection');

// -------------------- MAIN API
var dayTypeAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT m.*";
            sql += " FROM day_type as m";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var dayTypes = [];
                res.forEach(function (udb) {
                    dayTypes.push(fnMeaDbToJs(udb));
                });
                done(null, dayTypes);
            });
        }, test);
    }, 
    getByName: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT m.*";
            sql += " FROM day_type as m";
            if (name && (name != '*')){
                sql += " WHERE m.name LIKE '%" + name +"%'";
            }
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var dayTypes = [];
                res.forEach(function (udb) {
                    dayTypes.push(fnMeaDbToJs(udb));
                });
                done(null, dayTypes);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT m.*";
            sql += " FROM day_type as m";
            sql += " WHERE m.dayTypeId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var dayTypes = [];
                res.forEach(function (udb) {
                    dayTypes.push(fnMeaDbToJs(udb));
                });
                done(null, dayTypes);
            });
        }, test);
    },
    post: function (dayType, done, test) {
        // controls dayType properties
        if (!fnCheckMea(dayType)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnMeaJsToDb(dayType);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO day_type SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                dayType.dayTypeId = res.insertId;
                done(null, fnMeaDbToJs(dayType));
            });
        }, test);
    },
    put: function (dayType, done, test) {
        // controls dayType properties
        if (!fnCheckMea(dayType)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        var udb = fnMeaJsToDb(dayType);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE day_type SET ? WHERE dayTypeId = ?";
            sql = mysql.format(sql, [udb, udb.dayTypeId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                // return object from db
                module.exports.getById(udb.dayTypeId, function (err, res) {
                    if (err) return done(err);
                    done(null, res[0]);
                }, test);
            });
        }, test);
    },
    delete: function (dayType, done, test) {
        var udb = fnMeaJsToDb(dayType);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM day_type WHERE dayTypeId = ?";
            sql = mysql.format(sql, udb.dayTypeId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    }
}

// ----------------- AUXILIARY FUNCTIONS
// fnMeaDbToJs:
// transfors a db record into a js object
var fnMeaDbToJs = function (u) {
    // add some properties
    u.id = u.dayTypeId;
    // delete properties not needed
    delete u.dayTypeId;
    return u;
}

// fnMeaJsToDb
// transforms a js object into a db record
var fnMeaJsToDb = function (u) {
    // add properties
    u.dayTypeId = u.id;
    // delete some properties
    delete u.id;
    return u;
}

// fnCheckMea
// checks if the object has old properties needed
var fnCheckMea = function (u) {
    var check = true;
    check = (check && u.hasOwnProperty("id"));
    check = (check && u.hasOwnProperty("reference"));
    check = (check && u.hasOwnProperty("name"));
    return check;
}

module.exports = dayTypeAPI;