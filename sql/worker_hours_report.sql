SELECT w.name AS workerName, wo.initDate AS workDate,
z.name AS zoneName, pw.name AS pwName,
wok.quantity, wok.normalHours, wok.extraHours
FROM wo_worker AS wok
LEFT JOIN wo ON wo.woId = wok.woId
LEFT JOIN worker AS w ON w.workerId = wok.workerId
LEFT JOIN pw ON pw.pwId = wo.pwId
LEFT JOIN zone AS z ON z.zoneId = pw.zoneId
WHERE w.resTypeId = 0
ORDER BY w.name, wo.initDate, z.name, pw.name;

