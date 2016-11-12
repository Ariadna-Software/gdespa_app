SELECT 
pw.reference AS reference, pw.name AS pwname, pw.description AS description,
DATE_FORMAT(initDate, '%d/%m/%Y') AS initialDate, cmp.name AS company, w1.name AS initInCharge,
z.name AS zone, pw.mainK AS k, pw.total, s.name AS STATUS,
DATE_FORMAT(acepDate, '%d/%m/%Y') AS acepDate, w2.name AS acepInCharge, pw.acepRef,
DATE_FORMAT(finDate, '%d/%m/%Y') AS finDate, w3.name AS finInCharge, pw.finRef,
DATE_FORMAT(cerDate, '%d/%m/%Y') AS cerDate, w4.name AS cerInCharge, pw.cerRef,
DATE_FORMAT(invDate, '%d/%m/%Y') AS invDate, w5.name AS invInCharge, pw.invRef,
DATE_FORMAT(payDate, '%d/%m/%Y') AS payDate, w6.name AS payInCharge, pw.payRef,
ROUND(e.c,2) AS estimate, ROUND(d.c,2) AS done, ROUND((COALESCE(d.c,0) / COALESCE(e.c,1)*100), 2) AS percentage, ROUND(w.c,2) AS cost
FROM pw
LEFT JOIN company AS cmp ON cmp.companyId = pw.companyId
LEFT JOIN worker AS w1 ON w1.workerId = pw.initInCharge
LEFT JOIN worker AS w2 ON w2.workerId = pw.acepInCharge
LEFT JOIN worker AS w3 ON w3.workerId = pw.finInCharge
LEFT JOIN worker AS w4 ON w4.workerId = pw.cerInCharge
LEFT JOIN worker AS w5 ON w5.workerId = pw.invInCharge
LEFT JOIN worker AS w6 ON w6.workerId = pw.payInCharge
LEFT JOIN zone AS z ON z.zoneId = pw.zoneId
LEFT JOIN STATUS AS s ON s.statusId = pw.statusId
LEFT JOIN (SELECT pwl.pwId AS p, SUM(pwl.quantity * cu.cost) AS c FROM pw_line AS pwl LEFT JOIN cunit AS cu ON cu.cunitId = pwl.cunitId GROUP BY pwl.pwId) AS e ON e.p = pw.pwId
LEFT JOIN (SELECT wo.pwId AS p, SUM(wol.quantity * cu.cost) AS c FROM wo_line AS wol LEFT JOIN wo ON wol.woId = wo.woId LEFT JOIN cunit AS cu ON cu.cunitId = wol.cunitId GROUP BY wo.pwId) AS d ON d.p = pw.pwId
LEFT JOIN (SELECT wo.pwId AS p, SUM(wow.quantity * wow.cost) AS c FROM wo_worker AS wow INNER JOIN wo ON wo.woId = wow.woId GROUP BY wo.pwId) AS w ON w.p = pw.pwId