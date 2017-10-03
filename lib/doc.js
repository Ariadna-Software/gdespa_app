/*
 * =================================================
 * doc.js
 * All functions related to document management in
 * database MYSQL
 * ==================================================
*/
var mysql = require('mysql'),
    dbCon = require('./db_connection'),
    fs = require("fs"),
    glob = require("glob"),
    path = require("path");

var docAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT d.*, pw.name as pwName, doc_type.name as typeName FROM doc As d LEFT JOIN pw ON pw.pwId = d.pwId LEFT JOIN doc_type ON doc_type.docTypeId = d.docTypeId ";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var docs = [];
                res.forEach(function (gdb) {
                    docs.push(fnCompanyDbToJs(gdb));
                });
                done(null, docs);
            });
        }, test);
    },
    getDocs: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT d.*, pw.name as pwName, doc_type.name as typeName FROM doc As d LEFT JOIN pw ON pw.pwId = d.pwId LEFT JOIN doc_type ON doc_type.docTypeId = d.docTypeId ";
            sql += " WHERE ext NOT IN ('jpg','png','gif');"
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var docs = [];
                res.forEach(function (gdb) {
                    docs.push(fnCompanyDbToJs(gdb));
                });
                done(null, docs);
            });
        }, test);
    },    
    getImages: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT d.*, pw.name as pwName, doc_type.name as typeName FROM doc As d LEFT JOIN pw ON pw.pwId = d.pwId LEFT JOIN doc_type ON doc_type.docTypeId = d.docTypeId ";
            sql += " WHERE ext IN ('jpg','png','gif');"
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var docs = [];
                res.forEach(function (gdb) {
                    docs.push(fnCompanyDbToJs(gdb));
                });
                done(null, docs);
            });
        }, test);
    },    
    getById: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT d.*, pw.name as pwName, doc_type.name as typeName FROM doc As d LEFT JOIN pw ON pw.pwId = d.pwId LEFT JOIN doc_type ON doc_type.docTypeId = d.docTypeId WHERE docId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var docs = [];
                res.forEach(function (gdb) {
                    docs.push(fnCompanyDbToJs(gdb));
                });
                done(null, docs);
            });
        }, test);
    },
    getByPwId: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT d.*, pw.name as pwName, doc_type.name as typeName FROM doc As d LEFT JOIN pw ON pw.pwId = d.pwId LEFT JOIN doc_type ON doc_type.docTypeId = d.docTypeId WHERE d.pwId = ? AND d.woId IS NULL";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var docs = [];
                res.forEach(function (gdb) {
                    docs.push(fnCompanyDbToJs(gdb));
                });
                done(null, docs);
            });
        }, test);
    },
    getByPwIdDocs: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT d.*, pw.name as pwName, doc_type.name as typeName FROM doc As d LEFT JOIN pw ON pw.pwId = d.pwId LEFT JOIN doc_type ON doc_type.docTypeId = d.docTypeId WHERE d.pwId = ? AND d.woId IS NULL";
            sql += " AND ext NOT IN ('jpg','png','gif');"
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var docs = [];
                res.forEach(function (gdb) {
                    docs.push(fnCompanyDbToJs(gdb));
                });
                done(null, docs);
            });
        }, test);
    },
    getByPwIdImages: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT d.*, pw.name as pwName, doc_type.name as typeName";
            sql += " FROM doc As d";
            sql += " LEFT JOIN wo ON wo.woId = d.woId";
            sql += " LEFT JOIN pw ON pw.pwId = wo.pwId";
            sql += " LEFT JOIN doc_type ON doc_type.docTypeId = d.docTypeId";
            sql += " WHERE pw.pwId = ?";
            sql += " AND ext IN ('jpg','png','gif');"
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var docs = [];
                res.forEach(function (gdb) {
                    docs.push(fnCompanyDbToJs(gdb));
                });
                done(null, docs);
            });
        }, test);
    },    
    getByWoId: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT d.*, pw.name as pwName, doc_type.name as typeName FROM doc As d LEFT JOIN pw ON pw.pwId = d.pwId LEFT JOIN doc_type ON doc_type.docTypeId = d.docTypeId WHERE d.woId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var docs = [];
                res.forEach(function (gdb) {
                    docs.push(fnCompanyDbToJs(gdb));
                });
                done(null, docs);
            });
        }, test);
    },
    getByWoIdImages: function (id, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT d.*, pw.name as pwName, doc_type.name as typeName FROM doc As d LEFT JOIN pw ON pw.pwId = d.pwId LEFT JOIN doc_type ON doc_type.docTypeId = d.docTypeId WHERE d.woId = ?";
            sql += " AND ext IN ('jpg','png','gif');"
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var docs = [];
                res.forEach(function (gdb) {
                    docs.push(fnCompanyDbToJs(gdb));
                });
                done(null, docs);
            });
        }, test);
    },    
    post: function (doc, done, test) {
        // obtain db record
        var gdb = fnCompanyJsToDb(doc);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var ext = doc.file.split('.').pop().toLowerCase();
            doc.ext = ext; // assing doc extension to a specific column
            var con = res; // mysql connection
            var sql = "INSERT INTO doc SET ?";
            sql = mysql.format(sql, gdb);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                doc.docId = res.insertId;
                var fromFile = path.join(__dirname, '../public/uploads/' + doc.file);
                var toFile = path.join(__dirname, '../public/docs/' + doc.docId + "." + ext);
                fs.renameSync(fromFile, toFile);
                done(null, fnCompanyDbToJs(doc));
            });
        }, test);
    },
    put: function (doc, done, test) {
        var gdb = fnCompanyJsToDb(doc);
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE doc SET ? WHERE docId = ?";
            sql = mysql.format(sql, [gdb, gdb.docId]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, fnCompanyDbToJs(doc));
            });
        }, test);
    },
    delete: function (id, file, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM doc WHERE docId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var ext = file.split('.').pop().toLowerCase();
                var filename = path.join(__dirname, '../public/docs/' + id + "." + ext);
                fs.unlinkSync(filename);
                done(null);
            });
        }, test);
    },
    deleteUploads: function (id, done, test) {
        // delete user files un uploads directory
        var appDir = path.dirname(require.main.filename);
        var pathToFiles = path.join(appDir, '/public/uploads/', id + "@*.*");
        glob(pathToFiles, function (err, files) {
            if (err) return done(err);
            files.forEach(function (f) {
                fs.unlinkSync(f);
            });
            done(null, "OK");
        });
    }
};

// fnCompanyDbToJs:
// transfors a db record into a js object
var fnCompanyDbToJs = function (gdb) {
    var g = gdb;
    return g;
}

// fnCompanyJsToDb
// transforms a js object into a db record
var fnCompanyJsToDb = function (g) {
    return g;
}


module.exports = docAPI;