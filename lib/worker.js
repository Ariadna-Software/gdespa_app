var mysql = require('mysql'),
    dbCon = require('./db_connection'),
    fs = require('fs');

// -------------------- MAIN API
var workerAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT w.*, u.name as userName, r.name as resName";
            sql += " FROM worker as w";
            sql += " LEFT JOIN user as u ON u.userId = w.userId"
            sql += " LEFT JOIN resource_type as r ON r.resTypeId = w.resTypeId";

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
    getWorker: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT w.*, u.name as userName, r.name as resName";
            sql += " FROM worker as w";
            sql += " LEFT JOIN user as u ON u.userId = w.userId"
            sql += " LEFT JOIN resource_type as r ON r.resTypeId = w.resTypeId";
            sql += " WHERE w.resTypeId = 0"
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
    getVehicle: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT w.*, u.name as userName, r.name as resName";
            sql += " FROM worker as w";
            sql += " LEFT JOIN user as u ON u.userId = w.userId"
            sql += " LEFT JOIN resource_type as r ON r.resTypeId = w.resTypeId";
            sql += " WHERE w.resTypeId = 1"
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
            var sql = "SELECT w.*, u.name as userName, r.name as resName";
            sql += " FROM worker as w";
            sql += " LEFT JOIN user as u ON u.userId = w.userId";
            sql += " LEFT JOIN resource_type as r ON r.resTypeId = w.resTypeId";
            if (name && (name != '*')) {
                sql += " WHERE w.name LIKE '%" + name + "%'";
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
            var sql = "SELECT w.*, u.name as userName, r.name as resName";
            sql += " FROM worker as w";
            sql += " LEFT JOIN user as u ON u.userId = w.userId"
            sql += " LEFT JOIN resource_type as r ON r.resTypeId = w.resTypeId";
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
    },
    getHours: function (fromDate, toDate, workerId, done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT v.workerId AS vWokId, v.workerName AS vName, v.administrative, v.active, COALESCE(d.wDayType, 'SIN DATOS') AS vDay, DATE_FORMAT(v.vdate,'%Y-%m-%d') AS vDate, WEEK(v.vdate, 1) AS vWeek, d.* FROM ";
            sql += " (SELECT w.workerId, w.name AS workerName, w.administrative, w.active, d1.vdate  FROM ";
            sql += " (SELECT ADDDATE(?, t2.i*100 + t1.i*10 + t0.i) vdate FROM";
            sql += " (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t0,";
            sql += " (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t1,";
            sql += " (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3) t2";
            sql += " ) AS d1,";
            sql += " worker AS w";
            sql += " WHERE w.resTypeId = 0) AS v";
            sql += " LEFT JOIN";
            sql += " (SELECT";
            sql += " w.name AS worker, w.workerId, wo.initDate,";
            sql += " YEAR(wo.initDate) AS wYear, WEEK(wo.initDate) AS wWeek, DATE_FORMAT(wo.initDate,'%Y-%m-%d') AS wDate,";
            sql += " dt.dayTypeId AS wDayTypeId, dt.name AS wDayType,";
            sql += " pw.name AS wPwName,";
            sql += " IF(dt.dayTypeId =0, COALESCE(wow.normalHours, 0.00), 0.00) AS nH, IF(dt.dayTypeId =0, COALESCE(wow.extraHours, 0.00), 0.00) AS nEHD, IF(dt.dayTypeId =0, COALESCE(wow.extraHoursNight, 0.00), 0.00) AS nEHN,";
            sql += " IF(dt.dayTypeId =1, COALESCE(wow.normalHours, 0.00), 0.00) AS sH, IF(dt.dayTypeId =1, COALESCE(wow.extraHours, 0.00), 0.00) AS sEHD, IF(dt.dayTypeId =1, COALESCE(wow.extraHoursNight, 0.00), 0.00) AS sEHN,";
            sql += " IF(dt.dayTypeId =2, COALESCE(wow.normalHours, 0.00), 0.00) AS hH, IF(dt.dayTypeId =2, COALESCE(wow.extraHours, 0.00), 0.00) AS hEHD, IF(dt.dayTypeId =2, COALESCE(wow.extraHoursNight, 0.00), 0.00) AS hEHN";
            sql += " FROM wo_worker AS wow";
            sql += " LEFT JOIN wo ON wo.woId = wow.woId";
            sql += " LEFT JOIN worker AS w ON w.workerId = wow.workerId";
            sql += " LEFT JOIN day_type AS dt ON dt.dayTypeId = wo.dayTypeId";
            sql += " LEFT JOIN pw ON pw.pwId = wo.pwId";
            sql += " WHERE w.resTypeId = 0";
            sql += " UNION";
            sql += " SELECT";
            sql += " w.name AS worker, w.workerId, mo.initDate,";
            sql += " YEAR(mo.initDate) AS wYear, WEEK(mo.initDate) AS wWeek, DATE_FORMAT(mo.initDate,'%Y-%m-%d') AS wDate,";
            sql += " dt.dayTypeId AS wDayTypeId, dt.name AS wDayType,";
            sql += " mea.name AS wPwName,";
            sql += " IF(dt.dayTypeId =0, COALESCE(mow.normalHours, 0.00), 0.00) AS nH, IF(dt.dayTypeId =0, COALESCE(mow.extraHours, 0.00), 0.00) AS nEHD, IF(dt.dayTypeId =0, COALESCE(mow.extraHoursNight, 0.00), 0.00) AS nEHN,";
            sql += " IF(dt.dayTypeId =1, COALESCE(mow.normalHours, 0.00), 0.00) AS sH, IF(dt.dayTypeId =1, COALESCE(mow.extraHours, 0.00), 0.00) AS sEHD, IF(dt.dayTypeId =1, COALESCE(mow.extraHoursNight, 0.00), 0.00) AS sEHN,";
            sql += " IF(dt.dayTypeId =2, COALESCE(mow.normalHours, 0.00), 0.00) AS hH, IF(dt.dayTypeId =2, COALESCE(mow.extraHours, 0.00), 0.00) AS hEHD, IF(dt.dayTypeId =2, COALESCE(mow.extraHoursNight, 0.00), 0.00) AS hEHN";
            sql += " FROM mo_worker AS mow";
            sql += " LEFT JOIN mo ON mo.moId = mow.moId";
            sql += " LEFT JOIN worker AS w ON w.workerId = mow.workerId";
            sql += " LEFT JOIN day_type AS dt ON dt.dayTypeId = mo.dayTypeId";
            sql += " LEFT JOIN mea_type AS mea ON mea.meaTypeId = mo.meaTypeId";
            sql += " WHERE w.resTypeId = 0) AS d ON (d.initDate = v.vdate AND d.workerId = v.workerId)";
            sql += " WHERE v.vdate BETWEEN ? AND ?";
            if (workerId && workerId != "0") {
                sql += " AND v.workerId = " + workerId;
            }
            sql += " AND (v.administrative = 0 AND v.active = 1)";
            sql += " ORDER BY v.workerId , WEEK(v.vdate, 1), v.vdate";
            sql = mysql.format(sql, [fromDate, fromDate, toDate]);
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                if (err) return done(err);
                var regs = fnWorkerHours(res)
                // fs.writeFileSync('/tmp/jsHours.json', JSON.stringify(regs, null, 2));
                done(null, regs);
            });
        }, test);
    }
}

var fnWorkerHours = function (h) {
    var vH = [];
    var aWeek = -1;

    var acumDay = 0;
    var acumWeek = 0;

    if (h.length > 0) {
        h.forEach(function (v) {
            // ponemos los campos de hora nulos a cero
            if (!v.nH) v.nH = 0;
            if (!v.nEHD) v.nEHD = 0;
            if (!v.nEHN) v.nEHN = 0;

            if (!v.sH) v.sH = 0;
            if (!v.sEHD) v.sEHD = 0;
            if (!v.sEHN) v.sEHN = 0;

            if (!v.hH) v.hH = 0;
            if (!v.hEHD) v.hEHD = 0;
            if (!v.hEHN) v.hEHN = 0;

            // preparamos los excesos
            v.nXHD = 0; v.nXHN = 0;
            v.sXHD = 0; v.sXHN = 0;
            v.hXHD = 0; v.hXHN = 0;
            if (v.vWeek != aWeek) {
                aWeek = v.vWeek;
                acumDay = 0;
                acumWeek = 0;
            }
            acumDay += v.nEHD + v.nEHN + v.sEHD + v.sEHN + v.hEHD + v.hEHN;
            acumWeek += acumDay;
            // console.log("==============================================================================================================");
            // console.log("WRK: ", v.vName, " TDAY:", v.wDayTypeId, " DAY", v.vDate, " WEEK:", v.vWeek, " AD:", acumDay, " AW:", acumWeek);
            // console.log("nEHD: ", v.nEHD, " nEHN: ", v.nEHN, "sEHD: ", v.sEHD, " sEHN: ", v.sEHN, "hEHD: ", v.hEHD, " hEHN: ", v.hEHN);
            // console.log("nXHD: ", v.nXHD, " nXHN: ", v.nXHN, "sXHD: ", v.sXHD, " sXHN: ", v.sXHN, "hXHD: ", v.hXHD, " hXHN: ", v.hXHN);
            // console.log("--------------------------------------------------------------------------------------------------------------");

            var v2 = fnExtHours(v, acumDay, acumWeek);

            // console.log("nEHD: ", v2.nEHD, " nEHN: ", v2.nEHN, "sEHD: ", v2.sEHD, " sEHN: ", v2.sEHN, "hEHD: ", v2.hEHD, " hEHN: ", v2.hEHN);
            // console.log("nXHD: ", v2.nXHD, " nXHN: ", v2.nXHN, "sXHD: ", v2.sXHD, " sXHN: ", v2.sXHN, "hXHD: ", v2.hXHD, " hXHN: ", v2.hXHN);
            // console.log("==============================================================================================================");

            vH.push(v2);
            acumDay = 0;
        });
    }
    return vH;
}

var fnExtHours = function (v, acumDay, acumWeek) {
    if (acumWeek > 9 && acumDay > 0) {
        if (acumWeek - acumDay <= 9) {
            // exceso de hoy
            var exec = acumWeek - 9;
            switch (v.wDayTypeId) {
                case 0:
                    if (v.nEHD >= exec) {
                        // exceso en diurnas
                        v.nXHD = exec; v.nEHD = v.nEHD - exec;
                        // todas las nocturnas ya son en exceso
                        v.nXHN = v.nEHN; v.nEHN = 0;
                    } else {
                        // exceso en nocturnas o por suma
                        v.nXHD = 0;
                        // todas las nocturnas ya son en exceso
                        v.nXHN = exec; v.nEHN = v.nEHN - exec;
                    }
                    break;
                case 1:
                    if (v.sEHD >= exec) {
                        // exceso en diurnas
                        v.sXHD = v.sEHD - exec; v.sEHD = exec;
                        // todas las nocturnas ya son en exceso
                        v.sXHN = v.sEHN; v.sEHN = 0;
                    } else {
                        // exceso en nocturnas o por suma
                        v.sXHD = 0;
                        // todas las nocturnas ya son en exceso
                        v.sXHN = v.sEHN - exec; v.sEHN = exec;
                    }
                    break;
                case 2:
                    if (v.hEHD >= exec) {
                        // exceso en diurnas
                        v.hXHD = v.hEHD - exec; v.hEHD = exec;
                        // todas las nocturnas ya son en exceso
                        v.hXHN = v.hEHN; v.hEHN = 0;
                    } else {
                        // exceso en nocturnas o por suma
                        v.hXHD = 0;
                        // todas las nocturnas ya son en exceso
                        v.hXHN = v.hEHN - exec; v.hEHN = exec;
                    }
                    break;
            }
        } else {
            // exceso de otros dias
            // caso más fácil porque todas las horas pasan a extrahordinarias
            switch (v.wDayTypeId) {
                case 0:
                    v.nXHD = v.nEHD; v.nXHN = v.EHN;
                    v.nEHD = 0; v.nEHN = 0;
                    break;
                case 1:
                    v.sXHD = v.sEHD; v.sXHN = v.sEHN;
                    v.sEHD = 0; v.sEHN = 0;
                    break;
                case 2:
                    v.hXHD = v.hEHD; v.hXHN = v.hEHN;
                    v.hEHD = 0; v.hEHN = 0;
                    break;
            }
        }
    } else if (acumDay > 3) {
        // el exceso es del día y este es su valor
        var exec = acumDay - 3;
        switch (v.wDayTypeId) {
            case 0:
                if (v.nEHD > 3) {
                    // exceso en diurnas
                    v.nXHD = exec; v.nEHD = v.nEHD - exec;
                    // todas las nocturnas ya son en exceso
                    v.nXHN = v.nEHN; v.nEHN = 0;
                } else {
                    // exceso en nocturnas o por suma
                    v.nXHD = 0;
                    // todas las nocturnas ya son en exceso
                    v.nXHN = exec; v.nEHN = v.nEHN - exec;
                }
                break;
            case 1:
                if (v.sEHD > 3) {
                    // exceso en diurnas
                    v.sXHD = v.sEHD - 3; v.sEHD = 3;
                    // todas las nocturnas ya son en exceso
                    v.sXHN = v.sEHN; v.sEHN = 0;
                } else {
                    // exceso en nocturnas o por suma
                    v.sXHD = 0;
                    // todas las nocturnas ya son en exceso
                    v.sXHN = v.sEHN - 3; v.sEHN = 3;
                }
                break;
            case 2:
                if (v.hEHD > 3) {
                    // exceso en diurnas
                    v.hXHD = v.hEHD - exec; v.hEHD = exec;
                    // todas las nocturnas ya son en exceso
                    v.hXHN = v.hEHN; v.hEHN = 0;
                } else {
                    // exceso en nocturnas o por suma
                    v.hXHD = 0;
                    // todas las nocturnas ya son en exceso
                    v.hXHN = v.hEHN - exec; v.hEHN = exec;
                }
                break;
        }
    }
    return v;
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