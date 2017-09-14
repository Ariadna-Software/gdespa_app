var mysql = require('mysql'),
    util = require('./util'),
    dbCon = require('./db_connection');

// -------------------- MAIN API
var docTypeAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT m.*";
            sql += " FROM doc_type as m";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var docTypes = [];
                res.forEach(function (udb) {
                    docTypes.push(fnMeaDbToJs(udb));
                });
                done(null, docTypes);
            });
        }, test);
    }, 
    getByName: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT m.*";
            sql += " FROM doc_type as m";
            if (name && (name != '*')){
                sql += " WHERE m.name LIKE '%" + name +"%'";
            }
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var docTypes = [];
                res.forEach(function (udb) {
                    docTypes.push(fnMeaDbToJs(udb));
                });
                done(null, docTypes);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT m.*";
            sql += " FROM doc_type as m";
            sql += " WHERE m.docTypeId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var docTypes = [];
                res.forEach(function (udb) {
                    docTypes.push(fnMeaDbToJs(udb));
                });
                done(null, docTypes);
            });
        }, test);
    },
    post: function (docType, done, test) {
        // controls docType properties
        if (!fnCheckAreaType(docType)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnMeaJsToDb(docType);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO doc_type SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                docType.docTypeId = res.insertId;
                done(null, fnMeaDbToJs(docType));
            });
        }, test);
    },
    put: function (docType, done, test) {
        // controls docType properties
        if (!fnCheckAreaType(docType)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        var udb = fnMeaJsToDb(docType);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE doc_type SET ? WHERE docTypeId = ?";
            sql = mysql.format(sql, [udb, udb.docTypeId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                // return object from db
                module.exports.getById(udb.docTypeId, function (err, res) {
                    if (err) return done(err);
                    done(null, res[0]);
                }, test);
            });
        }, test);
    },
    delete: function (docType, done, test) {
        var udb = fnMeaJsToDb(docType);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM doc_type WHERE docTypeId = ?";
            sql = mysql.format(sql, udb.docTypeId);
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
    u.id = u.docTypeId;
    // delete properties not needed
    delete u.docTypeId;
    return u;
}

// fnMeaJsToDb
// transforms a js object into a db record
var fnMeaJsToDb = function (u) {
    // add properties
    u.docTypeId = u.id;
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

module.exports = docTypeAPI;