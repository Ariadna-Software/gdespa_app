SELECT
pw.pwId AS PWID, pw.reference AS Referencia, pw.name AS Obra, pw.description AS Descripcion,
pw.statusId AS STATUSID, s.name AS Estado,
DATE_FORMAT(initDate, '%Y-%m-%d') AS 'Fecha inicial',
pw.initInCharge AS INITINCHARGE, w.name AS 'Encargado inicial'
FROM pw
LEFT JOIN `status` AS s ON s.statusId = pw.statusId
LEFT JOIN worker AS w ON w.workerId = pw.initInCharge