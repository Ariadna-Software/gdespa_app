var mysql = require('mysql'),
    dbCon = require('./db_connection');

// -------------------- MAIN API
var workerAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT w.*, u.name as userName";
            sql += " FROM worker as w";
            sql += " LEFT JOIN user as u ON u.userId = w.userId"
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var workers = [];
                res.forEach(function (udb) {
                    workers.push(fnworkerDbToJs(udb));
                });
                done(null, workers);
            });
        }, test);
    },
    getByName: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT w.*, u.name as userName";
            sql += " FROM worker as w";
            sql += " LEFT JOIN user as u ON u.userId = w.userId";
            if (name && (name != '*')){
                sql += " WHERE w.name LIKE '%" + name +"%'";
            }
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var workers = [];
                res.forEach(function (udb) {
                    workers.push(fnworkerDbToJs(udb));
                });
                done(null, workers);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT w.*, u.name as userName";
            sql += " FROM worker as w";
            sql += " LEFT JOIN user as u ON u.userId = w.userId"
            sql += " WHERE w.workerId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var workers = [];
                res.forEach(function (udb) {
                    workers.push(fnworkerDbToJs(udb));
                });
                done(null, workers);
            });
        }, test);
    },
    post: function (worker, done, test) {
        // controls worker properties
        if (!fnCheckUser(worker)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnworkerJsToDb(worker);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO worker SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                worker.workerId = res.insertId;
                done(null, fnworkerDbToJs(worker));
            });
        }, test);
    },
    put: function (worker, done, test) {
        // controls worker properties
        if (!fnCheckUser(worker)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        var udb = fnworkerJsToDb(worker);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE worker SET ? WHERE workerId = ?";
            sql = mysql.format(sql, [udb, udb.workerId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                // return object from db
                module.exports.getById(udb.workerId, function (err, res) {
                    if (err) return done(err);
                    done(null, res[0]);
                }, test);
            });
        }, test);
    },
    delete: function (worker, done, test) {
        var udb = fnworkerJsToDb(worker);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM worker WHERE workerId = ?";
            sql = mysql.format(sql, udb.workerId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    }
}

// ----------------- AUXILIARY FUNCTIONS
// fnworkerDbToJs:
// transfors a db record into a js object
var fnworkerDbToJs = function (w) {
    // add some properties
    w.id = w.workerId;
    w.user = {
        id: w.userId,
        name: w.userName
    }
    // delete properties not needed
    delete w.workerId;
    delete w.userName;
    delete w.userId;
    return w;
}

// fnworkerJsToDb
// transforms a js object into a db record
var fnworkerJsToDb = function (w) {
    // add properties
    w.workerId = w.id;
    // we admit deleted without associate user
    if (w.user) {
        w.userId = w.user.id;
    }
    // delete some properties
    delete w.id;
    delete w.user;
    return w;
}

// fnCheckUser
// checks if the object has old properties needed
var fnCheckUser = function (w) {
    var check = true;
    check = (check && w.hasOwnProperty("id"));
    check = (check && w.hasOwnProperty("name"));
    return check;
}

module.exports = workerAPI;