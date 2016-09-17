SELECT pw.pwId, e.c, d.c, ROUND(COALESCE(d.c,0) / COALESCE(e.c,1), 2)
FROM pw
LEFT JOIN 
(SELECT pwl.pwId AS p, SUM(pwl.quantity * cu.cost) AS c
FROM pw_line AS pwl
LEFT JOIN cunit AS cu ON cu.cunitId = pwl.cunitId
GROUP BY pwl.pwId) AS e ON e.p = pw.pwId
LEFT JOIN 
(SELECT wo.pwId AS p, SUM(wol.quantity * cu.cost) AS c
FROM wo_line AS wol
LEFT JOIN wo ON wol.woId = wo.woId
LEFT JOIN cunit AS cu ON cu.cunitId = wol.cunitId
GROUP BY wo.pwId) AS d ON d.p = pw.pwId