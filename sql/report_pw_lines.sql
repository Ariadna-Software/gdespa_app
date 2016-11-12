SELECT cu.name, pwl1.quantity AS estimate, COALESCE(wol1.quantity, 0) AS done,
ROUND(COALESCE((wol1.quantity / pwl1.quantity ) * 100, 0), 2) AS percentage
FROM
(SELECT pw.pwId, pwl.cunitId, SUM(quantity) AS quantity
FROM pw
LEFT JOIN pw_line AS pwl ON pwl.pwId = pw.pwId
GROUP BY pw.pwId, pwl.cunitId) AS pwl1
LEFT JOIN
(SELECT wo.pwId, wol.cunitId, SUM(quantity) AS quantity
FROM wo
LEFT JOIN wo_line AS wol ON wol.woId = wo.woId
GROUP BY wo.pwId, wol.cunitId) AS wol1
ON wol1.pwId = pwl1.pwId AND wol1.cunitId = pwl1.cunitId
LEFT JOIN cunit AS cu ON pwl1.cunitId = cu.cunitId

