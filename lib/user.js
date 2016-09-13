var mysql = require('mysql'),
    dbCon = require('./db_connection');

// -------------------- MAIN API
var userAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT u.*, g.name as groupName";
            sql += " FROM user as u";
            sql += " LEFT JOIN user_group as g ON g.userGroupId = u.userGroupId"
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var users = [];
                res.forEach(function (udb) {
                    users.push(fnUserDbToJs(udb));
                });
                done(null, users);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT u.*, g.name as groupName";
            sql += " FROM user as u";
            sql += " LEFT JOIN user_group as g ON g.userGroupId = u.userGroupId"
            sql += " WHERE u.userId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var users = [];
                res.forEach(function (udb) {
                    users.push(fnUserDbToJs(udb));
                });
                done(null, users);
            });
        }, test);
    },
    post: function (user, done, test) {
        // controls user properties
        if (!fnCheckUser(user)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnUserJsToDb(user);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO user SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                user.userId = res.insertId;
                done(null, fnUserDbToJs(user));
            });
        }, test);
    },
    put: function (user, done, test) {
        // controls user properties
        if (!fnCheckUser(user)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        var udb = fnUserJsToDb(user);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE user SET ? WHERE userId = ?";
            sql = mysql.format(sql, [udb, udb.userId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                // return object from db
                module.exports.getById(udb.userId, function (err, res) {
                    if (err) return done(err);
                    done(null, res[0]);
                }, test);
            });
        }, test);
    },
    delete: function (user, done, test) {
        var udb = fnUserJsToDb(user);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM user WHERE userId = ?";
            sql = mysql.format(sql, udb.userId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    }
}

// ----------------- AUXILIARY FUNCTIONS
// fnUserDbToJs:
// transfors a db record into a js object
var fnUserDbToJs = function (u) {
    // add some properties
    u.id = u.userId;
    u.userGroup = {
        id: u.userGroupId,
        name: u.groupName
    }
    // delete properties not needed
    delete u.userId;
    delete u.groupName;
    delete u.userGroupId;
    return u;
}

// fnUserJsToDb
// transforms a js object into a db record
var fnUserJsToDb = function (u) {
    // add properties
    u.userId = u.id;
    // we admit deleted without userGroup
    if (u.userGroup) {
        u.userGroupId = u.userGroup.id;
    }
    // delete some properties
    delete u.id;
    delete u.userGroup;
    return u;
}

// fnCheckUser
// checks if the object has old properties needed
var fnCheckUser = function (u) {
    var check = true;
    check = (check && u.hasOwnProperty("userGroup"));
    check = (check && u.hasOwnProperty("login"));
    check = (check && u.hasOwnProperty("password"));
    return check;
}

module.exports = userAPI;