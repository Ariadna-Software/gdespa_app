var mysql = require('mysql'),
    util = require('./util');
var dbCon = require('./db_connection');
var moLineDb = require('../lib/mo_line');
var async = require('async');

// -------------------- MAIN API
var moAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mo.*, w.name AS workerName, t.name AS teamName";
            sql += " FROM mo";
            sql += " LEFT JOIN worker AS w ON w.workerId = mo.workerId";
            sql += " LEFT JOIN team as t ON t.teamId = mo.teamId";
            sql += " WHERE mo.closureId IS NULL"
            sql += " ORDER BY mo.initDate DESC";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var mos = [];
                res.forEach(function (udb) {
                    mos.push(fnMoDbToJs(udb));
                });
                done(null, mos);
            });
        }, test);
    },
    getAll: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mo.*, w.name AS workerName, t.name as teamName";
            sql += " FROM mo";
            sql += " LEFT JOIN worker AS w ON w.workerId = mo.workerId";
            sql += " LEFT JOIN team as t ON t.teamId = mo.teamId";
            sql += " ORDER BY mo.initDate DESC";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var mos = [];
                res.forEach(function (udb) {
                    mos.push(fnMoDbToJs(udb));
                });
                done(null, mos);
            });
        }, test);
    },
    getByName: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mo.*, w.name AS workerName, t.name as teamName";
            sql += " FROM mo";
            sql += " LEFT JOIN worker AS w ON w.workerId = mo.workerId";
            sql += " LEFT JOIN team as t ON t.teamId = mo.teamId";
            if (name && (name != '*')) {
                sql += " WHERE w.name LIKE '%" + name + "%'";
                sql += " AND mo.closureId IS NULL"
            } else {
                sql += " WHERE mo.closureId IS NULL"
            }
            sql += " ORDER BY mo.initDate DESC";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var mos = [];
                res.forEach(function (udb) {
                    mos.push(fnMoDbToJs(udb));
                });
                done(null, mos);
            });
        }, test);
    },
    getByNameAll: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mo.*, pw.name AS pwName, w.name AS workerName, t.name AS teamName";
            sql += " FROM mo";
            sql += " LEFT JOIN worker AS w ON w.workerId = mo.workerId";
            sql += " LEFT JOIN team as t ON t.teamId = mo.teamId";
            if (name && (name != '*')) {
                sql += " WHERE pw.name LIKE '%" + name + "%'";
            }
            sql += " ORDER BY mo.initDate DESC";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var mos = [];
                res.forEach(function (udb) {
                    mos.push(fnMoDbToJs(udb));
                });
                done(null, mos);
            });
        }, test);
    },

    getContadores: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mo.*, w.name AS workerName, t.name AS teamName";
            sql += " FROM mo";
            sql += " LEFT JOIN worker AS w ON w.workerId = mo.workerId";
            sql += " LEFT JOIN team as t ON t.teamId = mo.teamId";
            sql += " WHERE mo.closureId IS NULL AND mo.meaTypeId = 0";
            sql += " ORDER BY mo.initDate DESC";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var mos = [];
                res.forEach(function (udb) {
                    mos.push(fnMoDbToJs(udb));
                });
                done(null, mos);
            });
        }, test);
    },
    getAllContadores: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mo.*, w.name AS workerName, t.name as teamName";
            sql += " FROM mo";
            sql += " LEFT JOIN worker AS w ON w.workerId = mo.workerId";
            sql += " LEFT JOIN team as t ON t.teamId = mo.teamId";
            sql += " WHERE mo.meaTypeId = 0";
            sql += " ORDER BY mo.initDate DESC";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var mos = [];
                res.forEach(function (udb) {
                    mos.push(fnMoDbToJs(udb));
                });
                done(null, mos);
            });
        }, test);
    },
    getByNameContadores: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mo.*, w.name AS workerName, t.name as teamName";
            sql += " FROM mo";
            sql += " LEFT JOIN worker AS w ON w.workerId = mo.workerId";
            sql += " LEFT JOIN team as t ON t.teamId = mo.teamId";
            if (name && (name != '*')) {
                sql += " WHERE w.name LIKE '%" + name + "%'";
                sql += " AND mo.closureId IS NULL AND mo.meaTypeId = 0"
            } else {
                sql += " WHERE mo.closureId IS NULL AND mo.meaTypeId = 0"
            }
            sql += " ORDER BY mo.initDate DESC";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var mos = [];
                res.forEach(function (udb) {
                    mos.push(fnMoDbToJs(udb));
                });
                done(null, mos);
            });
        }, test);
    },
    getByNameAllContadores: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mo.*, pw.name AS pwName, w.name AS workerName, t.name AS teamName";
            sql += " FROM mo";
            sql += " LEFT JOIN worker AS w ON w.workerId = mo.workerId";
            sql += " LEFT JOIN team as t ON t.teamId = mo.teamId";
            sql += " WNERE mo.meaTypeId = 0"
            if (name && (name != '*')) {
                sql += " AND pw.name LIKE '%" + name + "%'";
            }
            sql += " ORDER BY mo.initDate DESC";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var mos = [];
                res.forEach(function (udb) {
                    mos.push(fnMoDbToJs(udb));
                });
                done(null, mos);
            });
        }, test);
    },

    getLuminarias: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mo.*, w.name AS workerName, t.name AS teamName";
            sql += " FROM mo";
            sql += " LEFT JOIN worker AS w ON w.workerId = mo.workerId";
            sql += " LEFT JOIN team as t ON t.teamId = mo.teamId";
            sql += " WHERE mo.closureId IS NULL AND mo.meaTypeId = 1";
            sql += " ORDER BY mo.initDate DESC";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var mos = [];
                res.forEach(function (udb) {
                    mos.push(fnMoDbToJs(udb));
                });
                done(null, mos);
            });
        }, test);
    },
    getAllLuminarias: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mo.*, w.name AS workerName, t.name as teamName";
            sql += " FROM mo";
            sql += " LEFT JOIN worker AS w ON w.workerId = mo.workerId";
            sql += " LEFT JOIN team as t ON t.teamId = mo.teamId";
            sql += " WHERE mo.meaTypeId = 1";
            sql += " ORDER BY mo.initDate DESC";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var mos = [];
                res.forEach(function (udb) {
                    mos.push(fnMoDbToJs(udb));
                });
                done(null, mos);
            });
        }, test);
    },
    getByNameLuminarias: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mo.*, w.name AS workerName, t.name as teamName";
            sql += " FROM mo";
            sql += " LEFT JOIN worker AS w ON w.workerId = mo.workerId";
            sql += " LEFT JOIN team as t ON t.teamId = mo.teamId";
            if (name && (name != '*')) {
                sql += " WHERE w.name LIKE '%" + name + "%'";
                sql += " AND mo.closureId IS NULL AND mo.meaTypeId = 1"
            } else {
                sql += " WHERE mo.closureId IS NULL AND mo.meaTypeId = 1"
            }
            sql += " ORDER BY mo.initDate DESC";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var mos = [];
                res.forEach(function (udb) {
                    mos.push(fnMoDbToJs(udb));
                });
                done(null, mos);
            });
        }, test);
    },
    getByNameAllLuminarias: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mo.*, pw.name AS pwName, w.name AS workerName, t.name AS teamName";
            sql += " FROM mo";
            sql += " LEFT JOIN worker AS w ON w.workerId = mo.workerId";
            sql += " LEFT JOIN team as t ON t.teamId = mo.teamId";
            sql += " WNERE mo.meaTypeId = 1"
            if (name && (name != '*')) {
                sql += " AND pw.name LIKE '%" + name + "%'";
            }
            sql += " ORDER BY mo.initDate DESC";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var mos = [];
                res.forEach(function (udb) {
                    mos.push(fnMoDbToJs(udb));
                });
                done(null, mos);
            });
        }, test);
    },

    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mo.*, w.name AS workerName, t.name AS teamName";
            sql += " FROM mo";
            sql += " LEFT JOIN worker AS w ON w.workerId = mo.workerId";
            sql += " LEFT JOIN team as t ON t.teamId = mo.teamId";
            sql += " WHERE mo.moId = ?";
            sql += " ORDER BY mo.initDate DESC";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var mos = [];
                res.forEach(function (udb) {
                    mos.push(fnMoDbToJs(udb));
                });
                done(null, mos);
            });
        }, test);
    },
    getByClosureId: function (id, workerId, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mo.*, t.name AS teamName, w.name AS workerName, mt.name AS meaType";
            sql += " FROM mo";
            sql += " LEFT JOIN worker AS w ON w.workerId = mo.workerId";
            sql += " LEFT JOIN team AS t ON t.teamId = mo.teamId";
            sql += " LEFT JOIN mea_type AS mt ON mt.meaTypeId = mo.meaTypeId";
            sql += " WHERE mo.closureId = ?";
            sql += " ORDER BY mo.initDate DESC";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var mos = [];
                res.forEach(function (udb) {
                    mos.push(fnMoDbToJs(udb));
                });
                done(null, mos);
            });
        }, test);
    },
    getByClosureId2: function (id, workerId, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT mo.*, t.name AS teamName, w.name AS workerName, mt.name AS meaType";
            sql += " FROM mo";
            sql += " LEFT JOIN worker AS w ON w.workerId = mo.workerId";
            sql += " LEFT JOIN team AS t ON t.teamId = mo.teamId";
            sql += " LEFT JOIN closure AS c ON c.closureId = ?";
            sql += " LEFT JOIN mea_type AS mt ON mt.meaTypeId = mo.meaTypeId";
            sql += " WHERE mo.workerId = ?"
            sql += " AND mo.initDate <= c.closureDate";
            sql += " AND mo.closureId IS NULL";
            sql += " ORDER BY mo.initDate DESC";
            sql = mysql.format(sql, [id, workerId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var mos = [];
                res.forEach(function (udb) {
                    mos.push(fnMoDbToJs(udb));
                });
                done(null, mos);
            });
        }, test);
    },
    post: function (mo, done, test) {
        // controls mo properties
        if (!fnCheckMo(mo)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnMoJsToDb(mo);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO mo SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                mo.moId = res.insertId;
                done(null, fnMoDbToJs(mo));
            });
        }, test);
    },
    postGenerated: function (mo, done, test) {
        // controls mo properties
        if (!fnCheckMo(mo)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnMoJsToDb(mo);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO mo SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                if (err) return done(err);
                mo.moId = res.insertId;
                sql = "INSERT INTO mo_worker (moId, workerId)";
                sql += " SELECT " + mo.moId + " AS moId, tl.workerId";
                sql += " FROM team_line AS tl";
                sql += " WHERE tl.teamId = ?";
                sql = mysql.format(sql, mo.teamId);
                con.query(sql, function (err, res) {
                    dbCon.closeConnection(con);
                    if (err) return done(err);
                    done(null, fnMoDbToJs(mo));
                }, test);
            });
        }, test);
    },
    postGeneratedWorker: function (mo, done, test) {
        // controls mo properties
        if (!fnCheckMo(mo)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        // obtain db record
        var udb = fnMoJsToDb(mo);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO mo SET ?";
            sql = mysql.format(sql, udb);
            con.query(sql, function (err, res) {
                if (err) return done(err);
                mo.moId = res.insertId;
                sql = "INSERT INTO mo_worker (moId, workerId)";
                sql += " SELECT " + mo.moId + " AS moId, pww.workerId";
                sql += " FROM pw_worker AS pww";
                sql += " WHERE pww.pwId = ?";
                sql = mysql.format(sql, mo.pwId);
                con.query(sql, function (err, res) {
                    dbCon.closeConnection(con);
                    if (err) return done(err);
                    done(null, fnMoDbToJs(mo));
                }, test);
            });
        }, test);
    },
    put: function (mo, done, test) {
        // controls mo properties
        if (!fnCheckMo(mo)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        var udb = fnMoJsToDb(mo);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE mo SET ? WHERE moId = ?";
            sql = mysql.format(sql, [udb, udb.moId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                // return object from db
                module.exports.getById(udb.moId, function (err, res) {
                    if (err) return done(err);
                    moLineDb.actualizarPartes(udb.moId, function (err) {
                        if (err) return done(err);
                        done(null, res[0]);
                    });
                }, test);
            });
        }, test);
    },
    delete: function (mo, done, test) {
        var udb = fnMoJsToDb(mo);
        fnDeleteOrdenMo(udb.moId, function (err) {
            if (err) return done(err);
            done(null);
        });
    }
}

// ----------------- AUXILIARY FUNCTIONS
// fnMoDbToJs:
// transfors a db record into a js object
var fnMoDbToJs = function (odb) {
    var o = odb;
    // add some properties
    o.id = odb.moId;
    o.pw = {
        id: odb.pwId,
        name: odb.pwName
    };
    o.worker = {
        id: odb.workerId,
        name: odb.workerName
    };
    // delete properties not needed
    delete o.moId;
    delete odb.pwId;
    delete odb.workerId;
    delete o.pwName;
    delete o.workerName;
    o.initDate = util.serverParseDate(o.initDate);
    o.endDate = util.serverParseDate(o.endDate);
    return o;
}

// fnMoJsToDb
// transforms a js object into a db record
var fnMoJsToDb = function (o) {
    var odb = o;
    // add properties
    odb.moId = o.id;
    if (o.pw) odb.pwId = o.pw.id;
    if (o.worker) odb.workerId = o.worker.id;
    // delete some properties
    delete odb.id;
    delete odb.pw;
    delete odb.worker;
    return odb;
}

// fnCheckMo
// checks if the object has old properties needed
var fnCheckMo = function (u) {
    var check = true;
    check = (check && u.hasOwnProperty("id"));
    return check;
}

//-- Relacionado con las ordenes creadas automáticamente.

var fnDeleteOrdenMo = function (id, done) {
    dbCon.getConnection(function (err, con) {
        if (err) return done(err);
        con.beginTransaction(function (err) {
            if (err) { con.end(); return done(err) }
            var sql = "SELECT * FROM mo WHERE moId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, rows) {
                if (err) { con.end(); return done(err) }
                var mo = rows[0];
                async.series([
                    function (callback) {
                        fnDeleteMo(mo, con, function (err) {
                            if (err) return callback(err);
                            callback();
                        });
                    },
                    function (callback) {
                        fnDeleteMoWoLine(mo, con, function (err) {
                            if (err) return callback(err);
                            callback();
                        });
                    },
                    function (callback) {
                        fnDeleteMoWo(mo, con, function (err) {
                            if (err) return callback(err);
                            callback();
                        });
                    },
                    function (callback) {
                        fnDeleteMoPwLine(mo, con, function (err) {
                            if (err) return callback(err);
                            callback();
                        });
                    }
                ]
                    , function (err) {
                        if (err) { con.rollback(); con.end(); return done(err) }
                        con.commit();
                        con.end();
                        done();
                    })
            });
        });
    }, false);
}

var fnDeleteMo = function(mo, con, done){
    var sql = "DELETE FROM mo WHERE moId = ?";
    sql = mysql.format(sql, mo.moId);
    con.query(sql, function (err) {
        if (err) return done(err);
        done();
    })
    
}

var fnDeleteMoPwLine = function (mo, con, done) {
    var sql = "DELETE FROM pw_line WHERE pwLineId = ?";
    sql = mysql.format(sql, mo.pwLineId);
    con.query(sql, function (err) {
        if (err) return done(err);
        done();
    })
}

var fnDeleteMoWoLine = function (mo, con, done) {
    var sql = "DELETE FROM wo_line WHERE woLineId = ?";
    sql = mysql.format(sql, mo.woLineId);
    con.query(sql, function (err) {
        if (err) return done(err);
        done();
    })
}

var fnDeleteMoWo = function (mo, con, done) {
    var sql = "DELETE FROM wo WHERE woId = ?";
    sql = mysql.format(sql, mo.woId);
    con.query(sql, function (err) {
        if (err) return done(err);
        done();
    })
}


module.exports = moAPI;