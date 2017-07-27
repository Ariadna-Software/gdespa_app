var mysql = require('mysql'),
    util = require('./util'),
    dbCon = require('./db_connection');

// -------------------- MAIN API
var insTypeAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT m.*";
            sql += " FROM ins_type as m";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var insTypes = [];
                res.forEach(function (udb) {
                    insTypes.push(fnMeaDbToJs(udb));
                });
                done(null, insTypes);
            });
        }, test);
    }, 
    getByName: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT m.*";
            sql += " FROM ins_type as m";
            if (name && (name != '*')){
                sql += " WHERE m.name LIKE '%" + name +"%'";
            }
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var insTypes = [];
                res.forEach(function (udb) {
                    insTypes.push(fnMeaDbToJs(udb));
                });
                done(null, insTypes);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT m.*";
            sql += " FROM ins_type as m";
            sql += " WHERE m.insTypeId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var insTypes = [];
                res.forEach(function (udb) {
                    insTypes.push(fnMeaDbToJs(udb));
                });
                done(null, insTypes);
            });
        }, test);
    },
    post: function (insType, done, test) {
        // controls insType properties
        if (!fnCheckInsType(insType)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnMeaJsToDb(insType);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO ins_type SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                insType.insTypeId = res.insertId;
                done(null, fnMeaDbToJs(insType));
            });
        }, test);
    },
    put: function (insType, done, test) {
        // controls insType properties
        if (!fnCheckInsType(insType)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        var udb = fnMeaJsToDb(insType);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE ins_type SET ? WHERE insTypeId = ?";
            sql = mysql.format(sql, [udb, udb.insTypeId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                // return object from db
                module.exports.getById(udb.insTypeId, function (err, res) {
                    if (err) return done(err);
                    done(null, res[0]);
                }, test);
            });
        }, test);
    },
    delete: function (insType, done, test) {
        var udb = fnMeaJsToDb(insType);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM ins_type WHERE insTypeId = ?";
            sql = mysql.format(sql, udb.insTypeId);
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
    u.id = u.insTypeId;
    // delete properties not needed
    delete u.insTypeId;
    return u;
}

// fnMeaJsToDb
// transforms a js object into a db record
var fnMeaJsToDb = function (u) {
    // add properties
    u.insTypeId = u.id;
    // delete some properties
    delete u.id;
    return u;
}

// fnCheckInsType
// checks if the object has old properties needed
var fnCheckInsType = function (u) {
    var check = true;
    check = (check && u.hasOwnProperty("id"));
    check = (check && u.hasOwnProperty("name"));
    return check;
}

module.exports = insTypeAPI;