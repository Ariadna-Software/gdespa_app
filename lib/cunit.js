var mysql = require('mysql'),
    dbCon = require('./db_connection');

// -------------------- MAIN API
var cunitAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT i.* FROM cunit as i";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var cunits = [];
                res.forEach(function (udb) {
                    cunits.push(fncunitDbToJs(udb));
                });
                done(null, cunits);
            });
        }, test);
    },
    getByName: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT i.* FROM cunit as i";
            if (name && (name != '*')) {
                sql += " WHERE i.name LIKE '%" + name + "%'";
            }
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var cunits = [];
                res.forEach(function (udb) {
                    cunits.push(fncunitDbToJs(udb));
                });
                done(null, cunits);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT i.* FROM cunit as i";
            sql += " WHERE i.cunitId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var cunits = [];
                res.forEach(function (udb) {
                    cunits.push(fncunitDbToJs(udb));
                });
                done(null, cunits);
            });
        }, test);
    },
    post: function (cunit, done, test) {
        // controls cunit properties
        if (!fnCheckCUnit(cunit)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fncunitJsToDb(cunit);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO cunit SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                cunit.cunitId = res.insertId;
                done(null, fncunitDbToJs(cunit));
            });
        }, test);
    },
    put: function (cunit, done, test) {
        // controls cunit properties
        if (!fnCheckCUnit(cunit)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        var udb = fncunitJsToDb(cunit);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE cunit SET ? WHERE cunitId = ?";
            sql = mysql.format(sql, [udb, udb.cunitId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                // return object from db
                module.exports.getById(udb.cunitId, function (err, res) {
                    if (err) return done(err);
                    done(null, res[0]);
                }, test);
            });
        }, test);
    },
    delete: function (cunit, done, test) {
        var udb = fncunitJsToDb(cunit);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM cunit WHERE cunitId = ?";
            sql = mysql.format(sql, udb.cunitId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    }
}

// ----------------- AUXILIARY FUNCTIONS
// fncunitDbToJs:
// transfors a db record into a js object
var fncunitDbToJs = function (u) {
    // add some properties
    u.id = u.cunitId;
    // delete properties not needed
    delete u.cunitId;
    return u;
}

// fncunitJsToDb
// transforms a js object into a db record
var fncunitJsToDb = function (u) {
    // add properties
    u.cunitId = u.id;
    // delete some properties
    delete u.id;
    return u;
}

// fnCheckCUnit
// checks if the object has old properties needed
var fnCheckCUnit = function (u) {
    var check = true;
    check = (check && u.hasOwnProperty("id"));
    check = (check && u.hasOwnProperty("reference"));
    check = (check && u.hasOwnProperty("name"));
    return check;
}

module.exports = cunitAPI;