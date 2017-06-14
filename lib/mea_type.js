var mysql = require('mysql'),
    util = require('./util'),
    dbCon = require('./db_connection');

// -------------------- MAIN API
var meaTypeAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT m.*";
            sql += " FROM mea_type as m";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var meaTypes = [];
                res.forEach(function (udb) {
                    meaTypes.push(fnMeaDbToJs(udb));
                });
                done(null, meaTypes);
            });
        }, test);
    }, 
    getByName: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT m.*";
            sql += " FROM mea_type as m";
            if (name && (name != '*')){
                sql += " WHERE m.name LIKE '%" + name +"%'";
            }
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var meaTypes = [];
                res.forEach(function (udb) {
                    meaTypes.push(fnMeaDbToJs(udb));
                });
                done(null, meaTypes);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT m.*";
            sql += " FROM mea_type as m";
            sql += " WHERE m.meaTypeId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var meaTypes = [];
                res.forEach(function (udb) {
                    meaTypes.push(fnMeaDbToJs(udb));
                });
                done(null, meaTypes);
            });
        }, test);
    },
    post: function (meaType, done, test) {
        // controls meaType properties
        if (!fnCheckMea(meaType)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnMeaJsToDb(meaType);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO mea_type SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                meaType.meaTypeId = res.insertId;
                done(null, fnMeaDbToJs(meaType));
            });
        }, test);
    },
    put: function (meaType, done, test) {
        // controls meaType properties
        if (!fnCheckMea(meaType)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        var udb = fnMeaJsToDb(meaType);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE mea_type SET ? WHERE meaTypeId = ?";
            sql = mysql.format(sql, [udb, udb.meaTypeId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                // return object from db
                module.exports.getById(udb.meaTypeId, function (err, res) {
                    if (err) return done(err);
                    done(null, res[0]);
                }, test);
            });
        }, test);
    },
    delete: function (meaType, done, test) {
        var udb = fnMeaJsToDb(meaType);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM mea_type WHERE meaTypeId = ?";
            sql = mysql.format(sql, udb.meaTypeId);
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
    u.id = u.meaTypeId;
    // delete properties not needed
    delete u.meaTypeId;
    return u;
}

// fnMeaJsToDb
// transforms a js object into a db record
var fnMeaJsToDb = function (u) {
    // add properties
    u.meaTypeId = u.id;
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

module.exports = meaTypeAPI;