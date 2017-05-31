/*
 * =================================================
 * team_line.js
 * All functions related to team_line management in
 * database MYSQL
 * ==================================================
*/
var mysql = require('mysql'),
    stockDb = require('./item_stock'),
    dbCon = require('./db_connection');


var teamLineAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT tl.*, w.name as workerName";
            sql += " FROM team_line AS tl";
            sql += " LEFT JOIN worker as w ON w.workerId = tl.workerId";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, res);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT tl.*, w.name as workerName";
            sql += " FROM team_line AS tl";
            sql += " LEFT JOIN worker as w ON w.workerId = tl.workerId";
            sql += " WHERE tl.teamLineId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, res);
            });
        }, test);
    },
    getByTeamId: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT tl.*, w.name as workerName";
            sql += " FROM team_line AS tl";
            sql += " LEFT JOIN worker as w ON w.workerId = tl.workerId";
            sql += " WHERE tl.teamId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, res);
            });
        }, test);
    },
    post: function (teamLine, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO team_line SET ?";
            sql = mysql.format(sql, teamLine);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                teamLine.teamLineId = res.insertId;
                done(null, teamLine);
            });
        }, test);
    },
    put: function (teamLine, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE team_line SET ? WHERE teamLineId = ?";
            sql = mysql.format(sql, [teamLine, teamLine.teamLineId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, teamLine);
            });
        }, test);
    },
    delete: function (teamLine, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var sql = "DELETE FROM team_line WHERE teamLineId = ?";
            sql = mysql.format(sql, team.teamLineId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, null);
            });
        }, test);
    }
};

module.exports = teamLineAPI;