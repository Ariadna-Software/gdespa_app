var mysql = require('mysql'),
    util = require('./util'),
    dbCon = require('./db_connection');

// -------------------- MAIN API
var itemAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT i.*, u.name as unitName";
            sql += " FROM item as i";
            sql += " LEFT JOIN unit as u ON u.unitId = i.unitId"
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var items = [];
                res.forEach(function (udb) {
                    items.push(fnItemDbToJs(udb));
                });
                done(null, items);
            });
        }, test);
    }, 
    getByName: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT i.*, u.name as unitName";
            sql += " FROM item as i";
            sql += " LEFT JOIN unit as u ON u.unitId = i.unitId"
            if (name && (name != '*')){
                sql += " WHERE i.name LIKE '%" + name +"%'";
            }
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var items = [];
                res.forEach(function (udb) {
                    items.push(fnItemDbToJs(udb));
                });
                done(null, items);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT i.*, u.name as unitName";
            sql += " FROM item as i";
            sql += " LEFT JOIN unit as u ON u.unitId = i.unitId"
            sql += " WHERE i.itemId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var items = [];
                res.forEach(function (udb) {
                    items.push(fnItemDbToJs(udb));
                });
                done(null, items);
            });
        }, test);
    },
    post: function (item, done, test) {
        // controls item properties
        if (!fnCheckItem(item)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnItemJsToDb(item);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO item SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                item.itemId = res.insertId;
                done(null, fnItemDbToJs(item));
            });
        }, test);
    },
    put: function (item, done, test) {
        // controls item properties
        if (!fnCheckItem(item)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        var udb = fnItemJsToDb(item);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE item SET ? WHERE itemId = ?";
            sql = mysql.format(sql, [udb, udb.itemId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                // return object from db
                module.exports.getById(udb.itemId, function (err, res) {
                    if (err) return done(err);
                    done(null, res[0]);
                }, test);
            });
        }, test);
    },
    delete: function (item, done, test) {
        var udb = fnItemJsToDb(item);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM item WHERE itemId = ?";
            sql = mysql.format(sql, udb.itemId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    }
}

// ----------------- AUXILIARY FUNCTIONS
// fnItemDbToJs:
// transfors a db record into a js object
var fnItemDbToJs = function (u) {
    // add some properties
    u.id = u.itemId;
    u.unit = {
        id: u.unitId,
        name: u.unitName
    }
    // delete properties not needed
    delete u.itemId;
    delete u.unitName;
    delete u.unitId;
    // format date without time zone
    u.dateIn = util.serverParseDate(u.dateIn);
    return u;
}

// fnItemJsToDb
// transforms a js object into a db record
var fnItemJsToDb = function (u) {
    // add properties
    u.itemId = u.id;
    // we admit deleted without itemGroup
    if (u.unit) {
        u.unitId = u.unit.id;
    }
    // delete some properties
    delete u.id;
    delete u.unit;
    return u;
}

// fnCheckItem
// checks if the object has old properties needed
var fnCheckItem = function (u) {
    var check = true;
    check = (check && u.hasOwnProperty("id"));
    check = (check && u.hasOwnProperty("reference"));
    check = (check && u.hasOwnProperty("name"));
    return check;
}

module.exports = itemAPI;