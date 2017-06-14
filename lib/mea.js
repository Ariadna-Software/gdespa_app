var mysql = require('mysql'),
    util = require('./util'),
    dbCon = require('./db_connection');

// -------------------- MAIN API
var meaAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT m.*, mt.name as meaType";
            sql += " FROM mea as m";
            sql += " LEFT JOIN mea_type AS mt ON mt.meaTypeId = m.meaTypeId"
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var meas = [];
                res.forEach(function (udb) {
                    meas.push(fnMeaDbToJs(udb));
                });
                done(null, meas);
            });
        }, test);
    }, 
    getContadores: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT m.*, mt.name as meaType";
            sql += " FROM mea as m";
            sql += " LEFT JOIN mea_type AS mt ON mt.meaTypeId = m.meaTypeId"             
            sql += " WHERE m.meaTypeId = 0";

            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var meas = [];
                res.forEach(function (udb) {
                    meas.push(fnMeaDbToJs(udb));
                });
                done(null, meas);
            });
        }, test);
    },
    getLuminarias: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT m.*, mt.name as meaType";
            sql += " FROM mea as m ";
            sql += " LEFT JOIN mea_type AS mt ON mt.meaTypeId = m.meaTypeId"         
            sql += " WHERE m.meaTypeId = 1";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var meas = [];
                res.forEach(function (udb) {
                    meas.push(fnMeaDbToJs(udb));
                });
                done(null, meas);
            });
        }, test);
    },        
    getByName: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT m.*, mt.name as meaType";
            sql += " FROM mea as m";
            sql += " LEFT JOIN mea_type AS mt ON mt.meaTypeId = m.meaTypeId"    
            if (name && (name != '*')){
                sql += " WHERE m.name LIKE '%" + name +"%'";
            }
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var meas = [];
                res.forEach(function (udb) {
                    meas.push(fnMeaDbToJs(udb));
                });
                done(null, meas);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT m.*, mt.name as meaType";
            sql += " FROM mea as m";
            sql += " LEFT JOIN mea_type AS mt ON mt.meaTypeId = m.meaTypeId" 
            sql += " WHERE m.meaId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var meas = [];
                res.forEach(function (udb) {
                    meas.push(fnMeaDbToJs(udb));
                });
                done(null, meas);
            });
        }, test);
    },
    post: function (mea, done, test) {
        // controls mea properties
        if (!fnCheckMea(mea)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnMeaJsToDb(mea);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO mea SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                mea.meaId = res.insertId;
                done(null, fnMeaDbToJs(mea));
            });
        }, test);
    },
    put: function (mea, done, test) {
        // controls mea properties
        if (!fnCheckMea(mea)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        var udb = fnMeaJsToDb(mea);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE mea SET ? WHERE meaId = ?";
            sql = mysql.format(sql, [udb, udb.meaId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                // return object from db
                module.exports.getById(udb.meaId, function (err, res) {
                    if (err) return done(err);
                    done(null, res[0]);
                }, test);
            });
        }, test);
    },
    delete: function (mea, done, test) {
        var udb = fnMeaJsToDb(mea);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM mea WHERE meaId = ?";
            sql = mysql.format(sql, udb.meaId);
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
    u.id = u.meaId;
    // delete properties not needed
    delete u.meaId;
    return u;
}

// fnMeaJsToDb
// transforms a js object into a db record
var fnMeaJsToDb = function (u) {
    // add properties
    u.meaId = u.id;
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

module.exports = meaAPI;