var mysql = require('mysql'),
    util = require('./util'),
    dbCon = require('./db_connection');

// -------------------- MAIN API
var pwbi1API = {
    getPws: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT";
            sql += " pw.pwId, pw.reference, pw.name AS pwName, pw.description, DATE_FORMAT(pw.initDate, '%Y-%m-%d') AS initDate, ";
            sql += " pw.statusId, st.name statusName, ";
            sql += " pw.zoneId, z.name AS zoneName,";
            sql += " pw.initInCharge AS initInChargeId, w.name AS initInChargeName ";
            sql += " FROM pw";
            sql += " LEFT JOIN `status` AS st ON st.statusId = pw.statusId";
            sql += " LEFT JOIN zone AS z ON z.zoneId = pw.zoneId";
            sql += " LEFT JOIN worker AS w ON w.workerId = pw.initInCharge";
            con.query(sql, function (err, regs) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, regs);
            });
        }, test);
    },
    getZones: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT zoneId, `name` AS zoneName FROM zone";
            con.query(sql, function (err, regs) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, regs);
            });
        }, test);
    },
    getStatus: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT statusId, `name` AS statusName FROM `status`";
            con.query(sql, function (err, regs) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, regs);
            });
        }, test);
    },
    getWorkers: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT workerId, `name` AS workerName FROM worker";
            con.query(sql, function (err, regs) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, regs);
            });
        }, test);
    },
    getDocsPw: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT";
            sql += " docId, DATE_FORMAT(docDate, '%Y-%m-%d') AS docDate, `name` AS docName, comments, pwId, docTypeId, ext, CONCAT(docId,'.',ext) AS fileName";
            sql += " FROM doc";
            sql += " WHERE NOT pwId IS NULL;";
            con.query(sql, function (err, regs) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, regs);
            });
        }, test);
    },
    getDocsTypes: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT ";
            sql += " docTypeId, `name` AS docTypeName, needToOpen, needToClose";
            sql += " FROM doc_type";
            con.query(sql, function (err, regs) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, regs);
            });
        }, test);
    },
    getChapters: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT";
            sql += " ch.chapterId, ch.order, ch.name AS chapterName, ch.comments";
            sql += " FROM chapter AS ch";
            con.query(sql, function (err, regs) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, regs);
            });
        }, test);
    },
    getPwLines: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT * FROM pw_line";
            con.query(sql, function (err, regs) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, regs);
            });
        }, test);
    },
    getCUnits: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT";
            sql += " cunitId, reference, `name` AS cunitName, description, cost";
            sql += " FROM cunit";
            con.query(sql, function (err, regs) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, regs);
            });
        }, test);
    },
    getCunitLines: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT * FROM cunit_line";
            con.query(sql, function (err, regs) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, regs);
            });
        }, test);
    },
    getItems: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT";
            sql += " itemId, reference, `name`AS itemName, description, COALESCE(ownItem, 0) AS ownItem";
            sql += " FROM item";
            con.query(sql, function (err, regs) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, regs);
            });
        }, test);
    },
    getWos: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT wo.*, DATE_FORMAT(wo.initDate,'%Y-%m-%d') AS initDateWo, w.name AS workerName";
            sql += " FROM wo";
            sql += " LEFT JOIN worker as w ON w.workerId = wo.workerId"
            con.query(sql, function (err, regs) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, regs);
            });
        }, test);
    },
    getTeams: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT * FROM team";
            con.query(sql, function (err, regs) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, regs);
            });
        }, test);
    },
    getWoLines: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT wol.*,";
            sql += " COALESCE(pwl.cost * pwl.k * 1, 0) AS pwlCost";
            sql += " FROM wo_line AS wol";
            sql += " LEFT JOIN pw_line AS pwl ON pwl.pwLineId = wol.pwLineId";
            sql += " WHERE wol.quantity <> 0";
            con.query(sql, function (err, regs) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, regs);
            });
        }, test);
    },
    getInvoices: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT *, DATE_FORMAT(invoiceDate, '%Y-%m-%d') AS invoiceDatePa FROM invoice";
            con.query(sql, function (err, regs) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, regs);
            });
        }, test);
    },   
    getWorkedHours: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT";
            sql += " DATE_FORMAT(wo.initDate,'%Y-%m-%d') AS initDate, z.zoneId, t.teamId, wo.pwId, ww.*";
            sql += " FROM wo_worker AS ww";
            sql += " LEFT JOIN wo ON wo.woId = ww.woId";
            sql += " LEFT JOIN team AS t ON t.teamId = wo.teamId";
            sql += " LEFT JOIN zone AS z ON z.zoneId = wo.zoneId";
            con.query(sql, function (err, regs) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, regs);
            });
        }, test);
    },   
    getTeamLines: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT * FROM team_line";
            con.query(sql, function (err, regs) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, regs);
            });
        }, test);
    },
    getLumHours: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT";
            sql += " DATE_FORMAT(mo.initDate,'%Y-%m-%d') AS initDate, z.zoneId, t.teamId, ww.*";
            sql += " FROM mo_worker AS ww";
            sql += " LEFT JOIN mo ON mo.moId = ww.moId";
            sql += " LEFT JOIN team AS t ON t.teamId = mo.teamId";
            sql += " LEFT JOIN zone AS z ON z.zoneId = mo.zoneId";
            sql += " WHERE mo.meaTypeId = 1";
            con.query(sql, function (err, regs) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, regs);
            });
        }, test);
    },   
    getContaHours: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT";
            sql += " DATE_FORMAT(mo.initDate,'%Y-%m-%d') AS initDate, z.zoneId, t.teamId, ww.*";
            sql += " FROM mo_worker AS ww";
            sql += " LEFT JOIN mo ON mo.moId = ww.moId";
            sql += " LEFT JOIN team AS t ON t.teamId = mo.teamId";
            sql += " LEFT JOIN zone AS z ON z.zoneId = mo.zoneId";
            sql += " WHERE mo.meaTypeId = 0";
            con.query(sql, function (err, regs) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, regs);
            });
        }, test);
    }, 
    getWoItems: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT"
            sql += " DATE_FORMAT(wo.initDate, '%Y-%m-%d') AS woDate, wo.woId, wo.pwId, wol.woLineId,";
            sql += " cu.cunitId, cu.name AS UcName, wol.quantity AS woQuantity,";
            sql += " cul.cunitLineId, i.itemId, i.name AS Item, cul.quantity AS cuQuantity,";
            sql += " COALESCE(wol.quantity * cul.quantity, 0) AS itemQuantity";
            sql += " FROM wo_line AS wol";
            sql += " LEFT JOIN wo ON wo.woId = wol.woId";
            sql += " LEFT JOIN cunit AS cu ON cu.cunitId = wol.cunitId";
            sql += " LEFT JOIN cunit_line AS cul ON cul.cunitId = cu.cunitId";
            sql += " LEFT JOIN item AS i ON i.itemId = cul.itemId";
            sql += " WHERE wol.quantity <> 0";
            con.query(sql, function (err, regs) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, regs);
            });
        }, test);
    }, 
    getPwItems: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT"; 
            sql += " pwl.pwId, pwl.pwLineId,";
            sql += " cu.cunitId, cu.name AS UcName, pwl.quantity AS pwQuantity,";
            sql += " cul.cunitLineId, i.itemId, i.name AS Item, cul.quantity AS cuQuantity,";
            sql += " COALESCE(pwl.quantity * cul.quantity, 0) AS itemQuantity";
            sql += " FROM pw_line AS pwl";
            sql += " LEFT JOIN pw ON pw.pwId = pwl.pwId";
            sql += " LEFT JOIN cunit AS cu ON cu.cunitId = pwl.cunitId";
            sql += " LEFT JOIN cunit_line AS cul ON cul.cunitId = cu.cunitId";
            sql += " LEFT JOIN item AS i ON i.itemId = cul.itemId";
            con.query(sql, function (err, regs) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, regs);
            });
        }, test);
    },
    getPl: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT pl.*, DATE_FORMAT(pl.initDate, '%Y-%m-%d') AS plDate FROM pl";
            con.query(sql, function (err, regs) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, regs);
            });
        }, test);
    },                
    getPlLines: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT * FROM pl_line";
            con.query(sql, function (err, regs) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                done(null, regs);
            });
        }, test);
    }    

}



module.exports = pwbi1API;