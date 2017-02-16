/*
 * =================================================
 * chapter.js
 * All functions related to user group management in
 * database MYSQL
 * ==================================================
 */
var mysql = require('mysql'),
    dbCon = require('./db_connection');

var chapterAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT * FROM chapter";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(gdb);
                });
                done(null, groups);
            });
        }, test);
    },
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT * FROM chapter WHERE chapterId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var groups = [];
                res.forEach(function (gdb) {
                    groups.push(gdb);
                });
                done(null, groups);
            });
        }, test);
    },
    post: function (chapter, done, test) {
        // obtain db record
        var gdb = chapter;
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "INSERT INTO chapter SET ?";
            sql = mysql.format(sql, gdb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                chapter.chapterId = res.insertId;
                done(null, chapter);
            });
        }, test);
    },
    put: function (chapter, done, test) {
        var gdb = chapter;
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE chapter SET ? WHERE chapterId = ?";
            sql = mysql.format(sql, [gdb, gdb.chapterId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, chapter);
            });
        }, test);
    },
    delete: function (chapter, done, test) {
        var gdb = chapter;
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM chapter WHERE chapterId = ?";
            sql = mysql.format(sql, gdb.chapterId);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null);
            });
        }, test);
    },
    getNewLineNumber: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT COALESCE(MAX(`order`) + 1, 1) AS contador";
            sql += " FROM chapter WHERE pwId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, res[0]);
            });
        }, test);
    },
    getChaptersByPwId: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT *";
            sql += " FROM chapter WHERE pwId = ?";
            sql += " ORDER BY `order`"
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, res);
            });
        }, test);
    }
};

module.exports = chapterAPI;