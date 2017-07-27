var mysql = require('mysql'),
    util = require('./util'),
    dbCon = require('./db_connection');

// -------------------- MAIN API
var workTypeAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT m.*";
            sql += " FROM work_type as m";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var workTypes = [];
                res.forEach(function (udb) {
                    workTypes.push(fnMeaDbToJs(udb));
                });
                done(null, workTypes);
            });
        }, test);
    }, 
    getByName: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT m.*";
            sql += " FROM work_type as m";
            if (name && (name != '*')){
                sql += " WHERE m.name LIKE '%" + name +"%'";
            }
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var workTypes = [];
                res.forEach(function (udb) {
                    workTypes.push(fnMeaDbToJs(udb));
                });
                done(null, workTypes);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT m.*";
            sql += " FROM work_type as m";
            sql += " WHERE m.workTypeId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var workTypes = [];
                res.forEach(function (udb) {
                    workTypes.push(fnMeaDbToJs(udb));
                });
                done(null, workTypes);
            });
        }, test);
    },
    post: function (workType, done, test) {
        // controls workType properties
        if (!fnCheckWorkType(workType)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnMeaJsToDb(workType);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO work_type SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                workType.workTypeId = res.insertId;
                done(null, fnMeaDbToJs(workType));
            });
        }, test);
    },
    put: function (workType, done, test) {
        // controls workType properties
        if (!fnCheckWorkType(workType)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        var udb = fnMeaJsToDb(workType);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE work_type SET ? WHERE workTypeId = ?";
            sql = mysql.format(sql, [udb, udb.workTypeId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                // return object from db
                module.exports.getById(udb.workTypeId, function (err, res) {
                    if (err) return done(err);
                    done(null, res[0]);
                }, test);
            });
        }, test);
    },
    delete: function (workType, done, test) {
        var udb = fnMeaJsToDb(workType);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM work_type WHERE workTypeId = ?";
            sql = mysql.format(sql, udb.workTypeId);
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
    u.id = u.workTypeId;
    // delete properties not needed
    delete u.workTypeId;
    return u;
}

// fnMeaJsToDb
// transforms a js object into a db record
var fnMeaJsToDb = function (u) {
    // add properties
    u.workTypeId = u.id;
    // delete some properties
    delete u.id;
    return u;
}

// fnCheckWorkType
// checks if the object has old properties needed
var fnCheckWorkType = function (u) {
    var check = true;
    check = (check && u.hasOwnProperty("id"));
    check = (check && u.hasOwnProperty("name"));
    return check;
}

module.exports = workTypeAPI;