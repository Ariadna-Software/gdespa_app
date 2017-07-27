var mysql = require('mysql'),
    util = require('./util'),
    dbCon = require('./db_connection');

// -------------------- MAIN API
var areaTypeAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT m.*";
            sql += " FROM area_type as m";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var areaTypes = [];
                res.forEach(function (udb) {
                    areaTypes.push(fnMeaDbToJs(udb));
                });
                done(null, areaTypes);
            });
        }, test);
    }, 
    getByName: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT m.*";
            sql += " FROM area_type as m";
            if (name && (name != '*')){
                sql += " WHERE m.name LIKE '%" + name +"%'";
            }
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var areaTypes = [];
                res.forEach(function (udb) {
                    areaTypes.push(fnMeaDbToJs(udb));
                });
                done(null, areaTypes);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT m.*";
            sql += " FROM area_type as m";
            sql += " WHERE m.areaTypeId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var areaTypes = [];
                res.forEach(function (udb) {
                    areaTypes.push(fnMeaDbToJs(udb));
                });
                done(null, areaTypes);
            });
        }, test);
    },
    post: function (areaType, done, test) {
        // controls areaType properties
        if (!fnCheckAreaType(areaType)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnMeaJsToDb(areaType);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO area_type SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                areaType.areaTypeId = res.insertId;
                done(null, fnMeaDbToJs(areaType));
            });
        }, test);
    },
    put: function (areaType, done, test) {
        // controls areaType properties
        if (!fnCheckAreaType(areaType)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        var udb = fnMeaJsToDb(areaType);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE area_type SET ? WHERE areaTypeId = ?";
            sql = mysql.format(sql, [udb, udb.areaTypeId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                // return object from db
                module.exports.getById(udb.areaTypeId, function (err, res) {
                    if (err) return done(err);
                    done(null, res[0]);
                }, test);
            });
        }, test);
    },
    delete: function (areaType, done, test) {
        var udb = fnMeaJsToDb(areaType);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM area_type WHERE areaTypeId = ?";
            sql = mysql.format(sql, udb.areaTypeId);
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
    u.id = u.areaTypeId;
    // delete properties not needed
    delete u.areaTypeId;
    return u;
}

// fnMeaJsToDb
// transforms a js object into a db record
var fnMeaJsToDb = function (u) {
    // add properties
    u.areaTypeId = u.id;
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

module.exports = areaTypeAPI;