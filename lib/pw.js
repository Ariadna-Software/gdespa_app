var mysql = require('mysql'),
    dbCon = require('./db_connection');

// -------------------- MAIN API
var pwAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT p.*, c.name AS companyName, w.name AS initInChargeName";
            sql += " FROM pw AS p";
            sql += " LEFT JOIN company AS c ON c.companyId = p.companyId";
            sql += " LEFT JOIN worker AS w ON w.workerId = p.initInCharge";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var pws = [];
                res.forEach(function (udb) {
                    pws.push(fnpwDbToJs(udb));
                });
                done(null, pws);
            });
        }, test);
    },
    getByName: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT p.*, c.name AS companyName, w.name AS initInChargeName";
            sql += " FROM pw AS p";
            sql += " LEFT JOIN company AS c ON c.companyId = p.companyId";
            sql += " LEFT JOIN worker AS w ON w.workerId = p.initInCharge";
            if (name && (name != '*')) {
                sql += " WHERE p.name LIKE '%" + name + "%'";
            }
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var pws = [];
                res.forEach(function (udb) {
                    pws.push(fnpwDbToJs(udb));
                });
                done(null, pws);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT p.*, c.name AS companyName, w.name AS initInChargeName";
            sql += " FROM pw AS p";
            sql += " LEFT JOIN company AS c ON c.companyId = p.companyId";
            sql += " LEFT JOIN worker AS w ON w.workerId = p.initInCharge";
            sql += " WHERE p.pwId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var pws = [];
                res.forEach(function (udb) {
                    pws.push(fnpwDbToJs(udb));
                });
                done(null, pws);
            });
        }, test);
    },
    post: function (pw, done, test) {
        // controls pw properties
        if (!fnCheckpw(pw)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnpwJsToDb(pw);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO pw SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                pw.pwId = res.insertId;
                done(null, fnpwDbToJs(pw));
            });
        }, test);
    },
    put: function (pw, done, test) {
        // controls pw properties
        if (!fnCheckpw(pw)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        var udb = fnpwJsToDb(pw);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE pw SET ? WHERE pwId = ?";
            sql = mysql.format(sql, [udb, udb.pwId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                // return object from db
                module.exports.getById(udb.pwId, function (err, res) {
                    if (err) return done(err);
                    done(null, res[0]);
                }, test);
            });
        }, test);
    },
    delete: function (pw, done, test) {
        var udb = fnpwJsToDb(pw);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM pw WHERE pwId = ?";
            sql = mysql.format(sql, udb.pwId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    }
}

// ----------------- AUXILIARY FUNCTIONS
// fnpwDbToJs:
// transfors a db record into a js object
var fnpwDbToJs = function (odb) {
    var o = odb;
    // add some properties
    o.id = odb.pwId;
    // properties as objects
    o.initInCharge = {
        id: odb.initInCharge,
        name: odb.initInChargeName
    },
    o.company = {
        id: odb.companyId,
        name: odb.companyName
    }
    // delete properties not in object
    delete o.pwId;
    delete o.initInChargeName;
    delete o.companyName;
    return o;
}

// fnpwJsToDb
// transforms a js object into a db record
var fnpwJsToDb = function (o) {
    var odb = o;
    // add properties
    odb.pwId = o.id;
    odb.initInCharge = o.initInCharge.id;
    odb.companyId = o.company.id;
    // delete properties not in db
    delete odb.id;
    delete odb.initInCharge;
    delete odb.company;
    return odb;
}

// fnCheckpw
// checks if the object has old properties needed
var fnCheckpw = function (o) {
    var check = true;
    check = (check && u.hasOwnProperty("id"));
    check = (check && u.hasOwnProperty("reference"));
    check = (check && u.hasOwnProperty("name"));
    return check;
}

module.exports = pwAPI;