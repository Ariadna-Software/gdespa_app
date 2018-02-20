var mysql = require('mysql'),
    inventoryDb = require('./inventory'),
    dbCon = require('./db_connection');

// -------------------- MAIN API
var teamAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT t.*,  w.name AS workerInChargeName, z.name AS zoneName";
            sql += " FROM team AS t";
            sql += " LEFT JOIN worker AS w ON w.workerId = t.workerInChargeId";
            sql += " LEFT JOIN zone AS z ON z.zoneId = t.zoneId";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, res);
            });
        }, test);
    },
    getActive: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT t.*,  w.name AS workerInChargeName, z.name AS zoneName";
            sql += " FROM team AS t";
            sql += " LEFT JOIN worker AS w ON w.workerId = t.workerInChargeId";
            sql += " LEFT JOIN zone AS z ON z.zoneId = t.zoneId";
            sql += " WHERE t.active = 1";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, res);
            });
        }, test);
    },    
    getReport: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT t.teamId as id, t.name";
            sql += " FROM team AS t";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, res);
            });
        }, test);
    },    
    getByName: function (name, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT t.*, w.name AS workerInChargeName, z.name AS zoneName";
            sql += " FROM team AS t";
            sql += " LEFT JOIN worker AS w ON w.workerId = t.workerInChargeId";
            sql += " LEFT JOIN zone AS z ON z.zoneId = t.zoneId";
            if (name && (name != '*')) {
                sql += " WHERE t.name LIKE '%" + name + "%'";
            }
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var teams = [];
                res.forEach(function (udb) {
                    teams.push(fnTeamDbToJs(udb));
                });
                done(null, teams);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT t.*, w.name AS workerInChargeName, z.name AS zoneName";
            sql += " FROM team AS t";
            sql += " LEFT JOIN worker AS w ON w.workerId = t.workerInChargeId";
            sql += " LEFT JOIN zone AS z ON z.zoneId = t.zoneId";
            sql += " WHERE t.teamId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, res);
            });
        }, test);
    },
    getByZoneId: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT t.*, w.name AS workerInChargeName, z.name AS zoneName";
            sql += " FROM team AS t";
            sql += " LEFT JOIN worker AS w ON w.workerId = t.workerInChargeId";
            sql += " LEFT JOIN zone AS z ON z.zoneId = t.zoneId";
            sql += " WHERE t.zoneId = ? AND t.active = 1";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, res);
            });
        }, test);
    },    
    post: function (team, done, test) {
        // controls team properties
        if (!fnCheckTeam(team)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO team SET ?";
            sql = mysql.format(sql, team);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                team.teamId = res.insertId;
                done(null, team);
            });
        }, test);
    },
    put: function (team, done, test) {
        // controls team properties
        if (!fnCheckTeam(team)) {
            return done(new Error("Wrong object. You may be missing some properties"));
        }
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE team SET ? WHERE teamId = ?";
            sql = mysql.format(sql, [team, team.teamId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                done(null, team);
            });
        }, test);
    },
    delete: function (team, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM team WHERE teamId = ?";
            sql = mysql.format(sql, team.id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    }
}

// fnCheckTeam
// checks if the object has old properties needed
var fnCheckTeam = function (u) {
    var check = true;
    check = (check && u.hasOwnProperty("teamId"));
    return check;
}

module.exports = teamAPI;