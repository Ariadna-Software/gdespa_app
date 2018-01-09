var mysql = require('mysql'),
    dbCon = require('./db_connection'),
    fs = require('fs');
var XLSX = require('xlsx');
var path = require('path');
var moment = require('moment');

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
            var sql = "SELECT v.workerId AS vWokId, v.workerName AS vName, v.code, v.administrative, v.active, COALESCE(d.wDayType, 'SIN DATOS') AS vDay, DATE_FORMAT(v.vdate,'%Y-%m-%d') AS vDate, WEEK(v.vdate, 1) AS vWeek, d.* FROM ";
            sql += " (SELECT w.workerId, w.name AS workerName, w.administrative, w.active, w.code, d1.vdate  FROM ";
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
            sql += " IF(dt.dayTypeId =0, COALESCE(wow.normalHours, 0.00), 0.00) AS nH, IF(dt.dayTypeId =0, COALESCE(wow.extraHours, 0.00), 0.00) AS nEHD, IF(dt.dayTypeId =0, COALESCE(wow.extraHoursNight, 0.00), 0.00) AS nEHN, IF(dt.dayTypeId =0, COALESCE(wow.extraHoursMix, 0.00), 0.00) AS nEHM,";
            sql += " IF(dt.dayTypeId =1, COALESCE(wow.normalHours, 0.00), 0.00) AS sH, IF(dt.dayTypeId =1, COALESCE(wow.extraHours, 0.00), 0.00) AS sEHD, IF(dt.dayTypeId =1, COALESCE(wow.extraHoursNight, 0.00), 0.00) AS sEHN, IF(dt.dayTypeId =1, COALESCE(wow.extraHoursMix, 0.00), 0.00) AS sEHM,";
            sql += " IF(dt.dayTypeId =2, COALESCE(wow.normalHours, 0.00), 0.00) AS hH, IF(dt.dayTypeId =2, COALESCE(wow.extraHours, 0.00), 0.00) AS hEHD, IF(dt.dayTypeId =2, COALESCE(wow.extraHoursNight, 0.00), 0.00) AS hEHN, IF(dt.dayTypeId =2, COALESCE(wow.extraHoursMix, 0.00), 0.00) AS hEHM";
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
            sql += " IF(dt.dayTypeId =0, COALESCE(mow.normalHours, 0.00), 0.00) AS nH, IF(dt.dayTypeId =0, COALESCE(mow.extraHours, 0.00), 0.00) AS nEHD, IF(dt.dayTypeId =0, COALESCE(mow.extraHoursNight, 0.00), 0.00) AS nEHN, IF(dt.dayTypeId =0, COALESCE(mow.extraHoursMix, 0.00), 0.00) AS nEHM,";
            sql += " IF(dt.dayTypeId =1, COALESCE(mow.normalHours, 0.00), 0.00) AS sH, IF(dt.dayTypeId =1, COALESCE(mow.extraHours, 0.00), 0.00) AS sEHD, IF(dt.dayTypeId =1, COALESCE(mow.extraHoursNight, 0.00), 0.00) AS sEHN, IF(dt.dayTypeId =1, COALESCE(mow.extraHoursMix, 0.00), 0.00) AS sEHM,";
            sql += " IF(dt.dayTypeId =2, COALESCE(mow.normalHours, 0.00), 0.00) AS hH, IF(dt.dayTypeId =2, COALESCE(mow.extraHours, 0.00), 0.00) AS hEHD, IF(dt.dayTypeId =2, COALESCE(mow.extraHoursNight, 0.00), 0.00) AS hEHN, IF(dt.dayTypeId =2, COALESCE(mow.extraHoursMix, 0.00), 0.00) AS hEHM";
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
                //fs.writeFileSync('/tmp/jsHours.json', JSON.stringify(regs, null, 2));
                done(null, regs);
            });
        }, test);
    },
    getHoursXls: function (fromDate, toDate, regs, done) {
        // consolidate array
        var consolidate = fnConsolidateArray(regs);
        var file = fnExcelExport(fromDate, toDate, consolidate);
        done(null, file);
    }
}

var fnExcelExport = function (fDate, tDate, regs) {
    // obtener el fichero del campo correspondiente de data
    var file = path.join(__dirname, '../public/reports/plantilla_horas.xlsx');
    var book = XLSX.readFile(file);
    var sheet_name = book.SheetNames[0];
    var sheet = book.Sheets[sheet_name];
    var i = 0;
    for (i2 = 0; i2 < regs.length; i2++) {
        r = regs[i2];
        i = i2 + 6;
        sheet["A" + i] = fnCell(r.code);
        sheet["B" + i] = fnCell(r.nH);
        sheet["C" + i] = fnCell(r.nEHD);
        sheet["D" + i] = fnCell(r.nEHM);
        sheet["E" + i] = fnCell(r.nEHN);
        sheet["F" + i] = fnCell(r.nXHD);
        sheet["G" + i] = fnCell(r.nXHM);
        sheet["H" + i] = fnCell(r.nXHN);
        // domingo
        sheet["P" + i] = fnCell(r.sH);
        sheet["R" + i] = fnCell(r.sEHD);
        sheet["S" + i] = fnCell(r.sEHM);
        sheet["T" + i] = fnCell(r.sEHN);
        sheet["U" + i] = fnCell(r.sXHD);
        sheet["V" + i] = fnCell(r.sXHM);
        sheet["W" + i] = fnCell(r.sXHN);
        // feriado
        sheet["Y" + i] = fnCell(r.hH);
        sheet["AA" + i] = fnCell(r.hEHD);
        sheet["AB" + i] = fnCell(r.hEHM);
        sheet["AC" + i] = fnCell(r.hEHN);
        sheet["AD" + i] = fnCell(r.hXHD);
        sheet["AE" + i] = fnCell(r.hXHM);
        sheet["AF" + i] = fnCell(r.hXHN);
    }
    var ref = "A1:AF" + i;
    var file = "/ficheros/exportaciones/hrs_" + moment(fDate).format('YYYYMMDD') + 
        "_" + moment(tDate).format('YYYYMMDD') + 
        "_" + moment(new Date()).format('YYYYMMDD') +
        ".xlsx";
    sheet["!ref"] = ref;
    XLSX.writeFile(book, path.join(__dirname, '../public' + file), {
        bookType: "xlsx"
    });
    return file;
}


var fnCell = function (n) {
    var cell = {
        t: "n",
        v: n,
        w: n.toString()
    }
    return cell;
}

var fnConsolidateArray = function (regs) {
    var consolidate = [];
    if (regs.length == 0) return consolidate;
    var consreg = fnConsReg();
    var antCode = 0;
    var primero = true;
    regs.forEach(function (r) {
        if (r.code != antCode) {
            if (!primero) {
                consolidate.push(consreg);
            }
            primero = false;
            consreg = fnConsReg();
            antCode = r.code;
        }
        consreg.code = r.code;
        consreg.nH += r.nH;
        consreg.nEHD += r.nEHD;
        consreg.nEHM += r.nEHM;
        consreg.nEHN += r.nEHN;
        consreg.nXHD += r.nXHD;
        consreg.nXHM += r.nXHM;
        consreg.nXHN += r.nXHN;
        consreg.sH += r.sH;
        consreg.sEHD += r.sEHD;
        consreg.sEHM += r.sEHM;
        consreg.sEHN += r.sEHN;
        consreg.sXHD += r.sXHD;
        consreg.sXHM += r.sXHM;
        consreg.sXHN += r.sXHN;
        consreg.hH += r.hH;
        consreg.hEHD += r.hEHD;
        consreg.hEHM += r.hEHM;
        consreg.hEHN += r.hEHN;
        consreg.hXHD += r.hXHD;
        consreg.hXHM += r.hXHM;
        consreg.hXHN += r.hXHN;
    });
    consolidate.push(consreg);
    return consolidate;
}

var fnConsReg = function () {
    var consreg = {
        code: 0,
        nH: 0, // horas descontadas (76) [Horas normales de trabajo]
        nEHD: 0, // (02) [Horas extras diurnas]
        nEHM: 0, // (03) [Horas extras en turno mixto]
        nEHN: 0, // (04) [Horas extras nocturnas]
        nXHD: 0, // (05) [Horas en exceso diurnas]
        nXHM: 0, // (06) [Horas en exceso mixto]
        nXHN: 0, // (07) [Horas en exceso nocturnas]
        sH: 0, //   (03) [Horas normales de trabajo] (DIA LIBRE)
        sEHD: 0, // (08) [Horas extras diurnas] (DIA LIBRE)
        sEHM: 0, // (09) [Horas extras en turno mixto] (DIA LIBRE)
        sEHN: 0, // (06) [Horas extras nocturnas] (DIA LIBRE)
        sXHD: 0, // (10) [Horas en exceso diurnas] (DIA LIBRE)
        sXHM: 0, // (11) [Horas en exceso mixto] (DIA LIBRE)
        sXHN: 0, // (12) [Horas en exceso nocturnas] (DIA LIBRE)
        hH: 0, //   (03) [Horas normales de trabajo] (FESTIVO)
        hEHD: 0, // (08) [Horas extras diurnas] (FESTIVO)
        hEHM: 0, // (09) [Horas extras en turno mixto] (FESTIVO)
        hEHN: 0, // (06) [Horas extras nocturnas] (FESTIVO)
        hXHD: 0, // (10) [Horas en exceso diurnas] (FESTIVO)
        hXHM: 0, // (11) [Horas en exceso mixto] (FESTIVO)
        hXHN: 0  // (12) [Horas en exceso nocturnas] (FESTIVO)
    }
    return consreg;
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
            if (!v.nEHM) v.nEHM = 0;

            if (!v.sH) v.sH = 0;
            if (!v.sEHD) v.sEHD = 0;
            if (!v.sEHN) v.sEHN = 0;
            if (!v.sEHM) v.sEHM = 0;

            if (!v.hH) v.hH = 0;
            if (!v.hEHD) v.hEHD = 0;
            if (!v.hEHN) v.hEHN = 0;
            if (!v.hEHM) v.hEHM = 0;

            // preparamos los excesos
            v.nXHD = 0; v.nXHN = 0; v.nXHM = 0;
            v.sXHD = 0; v.sXHN = 0; v.sXHM = 0;
            v.hXHD = 0; v.hXHN = 0; v.hXHM = 0;
            if (v.vWeek != aWeek) {
                aWeek = v.vWeek;
                acumDay = 0;
                acumWeek = 0;
            }
            acumDay += v.nEHD + v.nEHN + v.nEHM + v.sEHD + v.sEHN + v.sEHM + v.hEHD + v.hEHN + v.hEHM;
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
                        // todas las nocturnas y mixtas ya son en exceso
                        v.nXHN = v.nEHN; v.nEHN = 0;
                        v.nXHM = v.nEHM; v.nEHM = 0;
                    } else if (v.nEHM >= exec) {
                        // exceso en mixtas
                        v.nXHM = exec; v.nEHM = v.nEHM - exec;
                        // todas las nocturnas  ya son en exceso
                        v.nXHN = v.nEHN; v.nEHN = 0;
                    } else {
                        // exceso en nocturnas 
                        v.nXHN = exec; v.nEHN = v.nEHN - exec;
                        // considerar el caso negativo

                    }
                    break;
                case 1:
                    if (v.sEHD >= exec) {
                        // exceso en diurnas
                        v.sXHD = exec; v.sEHD = v.sEHD - exec;
                        // todas las nocturnas y mixtas ya son en exceso
                        v.sXHN = v.sEHN; v.sEHN = 0;
                        v.sXHM = v.sEHM; v.sEHM = 0;
                    } else if (v.sEHM >= exec) {
                        // exceso en mixtas
                        v.sXHM = exec; v.sEHM = v.sEHM - exec;
                        // todas las nocturnas ya son en exceso
                        v.sXHN = v.sEHN; v.sEHN = 0;
                    } else {
                        // exceso en nocturnas 
                        v.sXHN = exec; v.sEHN = v.sEHN - exec;
                        // caso negativo

                    }
                    break;
                case 2:
                    if (v.hEHD >= exec) {
                        // exceso en diurnas
                        v.hXHD = exec; v.hEHD = v.hEHD - exec;
                        // todas las nocturnas y mixtas ya son en exceso
                        v.hXHN = v.hEHN; v.hEHN = 0;
                        v.hXHM = v.hEHM; v.hEHM = 0;
                    } else if (v.sEHM >= exec) {
                        // exceso en mixtas
                        v.hXHM = exec; v.hEHM = v.hEHM - exec;
                        // todas las nocturnas ya son en exceso
                        v.hXHN = v.hEHN; v.hEHN = 0;
                    } else {
                        // exceso en nocturnas 
                        v.hXHN = exec; v.hEHN = v.hEHN - exec;
                        // caso negativo
                    }
                    break;
            }
        } else {
            // exceso de otros dias
            // caso más fácil porque todas las horas pasan a extrahordinarias
            switch (v.wDayTypeId) {
                case 0:
                    v.nXHD = v.nEHD; v.nXHN = v.EHN; v.nXHM = v.EHM;
                    v.nEHD = 0; v.nEHN = 0; v.nEHM = 0;
                    break;
                case 1:
                    v.sXHD = v.sEHD; v.sXHN = v.sEHN; v.sXHM = v.sEHM;
                    v.sEHD = 0; v.sEHN = 0; v.sEHM = 0;
                    break;
                case 2:
                    v.hXHD = v.hEHD; v.hXHN = v.hEHN; v.hXHM = v.hEHM;
                    v.hEHD = 0; v.hEHN = 0; v.hEHM = 0;
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
                    // todas las nocturnas y mixtas ya son en exceso
                    v.nXHN = v.nEHN; v.nEHN = 0;
                    v.nXHM = v.nEHM; v.nEHM = 0;
                } else if (v.nEHM > 3) {
                    // exceso en mixtas
                    v.nXHM = exec; v.nEHM = v.nEHM - exec;
                    // todas las nocturnas ya son en exceso
                    v.nXHN = v.nEHN; v.nEHN = 0;
                }
                else {
                    // exceso en nocturnas o por suma
                    v.nXHN = exec; v.nEHN = v.nEHN - exec;
                    // caso negativo
                }
                break;
            case 1:
                if (v.sEHD > 3) {
                    // exceso en diurnas
                    v.sXHD = exec; v.sEHD = v.sEHD - exec;
                    // todas las nocturnas y mixtas ya son en exceso
                    v.sXHN = v.sEHN; v.sEHN = 0;
                    v.sXHM = v.sEHM; v.sEHM = 0;
                } else if (v.sEHM > 3) {
                    // exceso en mixtas
                    v.sXHM = exec; v.sEHM = v.sEHM - exec;
                    // todas las nocturnas ya son en exceso
                    v.nXHN = v.nEHN; v.nEHN = 0;
                }
                else {
                    // exceso en nocturnas o por suma
                    v.sXHN = exec; v.sEHN = v.sEHN - exec;
                    // caso negativo
                }
                break;
            case 2:
                if (v.hEHD > 3) {
                    // exceso en diurnas
                    v.hXHD = exec; v.hEHD = v.hEHD - exec;
                    // todas las nocturnas y mixtas ya son en exceso
                    v.hXHN = v.hEHN; v.hEHN = 0;
                    v.hXHM = v.hEHM; v.hEHM = 0;
                } else if (v.hEHM > 3) {
                    // exceso en mixtas
                    v.hXHM = exec; v.hEHM = v.hEHM - exec;
                    // todas las nocturnas ya son en exceso
                    v.hXHN = v.hEHN; v.hEHN = 0;
                }
                else {
                    // exceso en nocturnas o por suma
                    v.hXHN = exec; v.hEHN = v.hEHN - exec;
                    // caso negativo
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