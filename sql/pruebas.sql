SELECT DISTINCT 1 AS woId, cu.cunitId, calc.estimate, calc.done, 0 AS quantity
FROM pw
LEFT JOIN pw_line AS pwl ON pwl.pwId = pw.pwId
LEFT JOIN cunit AS cu ON cu.cunitId = pwl.cunitId
LEFT JOIN
(SELECT pwl.pwId, cu.cunitId AS id, cu.name, COALESCE(e.estimate,0) AS estimate, COALESCE(d.done,0) AS done
FROM pw_line AS pwl
LEFT JOIN cunit AS cu ON cu.cunitId = pwl.cunitId
LEFT JOIN (SELECT pwId, cunitId, SUM(quantity) AS estimate FROM pw_line GROUP BY pwId, cunitId) 
AS e ON (e.pwId = pwl.pwId AND e.cunitId = cu.cunitId)
LEFT JOIN (SELECT pwId, cunitId, SUM(quantity) AS done FROM wo_line LEFT JOIN wo ON wo.woId = wo_line.woId GROUP BY pwId, cunitId) 
AS d ON (d.pwId = pwl.pwId AND d.cunitId = cu.cunitId)) AS calc
ON calc.pwId = pw.pwId
WHERE pw.pwId = 12




SELECT cu.cunitId AS id, cu.name, COALESCE(e.estimate,0) AS estimate, COALESCE(d.done,0) AS done
FROM pw_line AS pwl
LEFT JOIN cunit AS cu ON cu.cunitId = pwl.cunitId
LEFT JOIN wo_line AS wol ON wol.cunitId = cu.cunitId
LEFT JOIN wo AS wo ON wo.woId = wol.woId
LEFT JOIN (SELECT pwId, cunitId, SUM(quantity) AS estimate FROM pw_line GROUP BY pwId, cunitId) 
AS e ON (e.pwId = pwl.pwId AND e.cunitId = cu.cunitId)
LEFT JOIN (SELECT pwId, cunitId, SUM(quantity) AS done FROM wo_line LEFT JOIN wo ON wo.woId = wo_line.woId GROUP BY pwId, cunitId) 
AS d ON (d.pwId = pwl.pwId AND d.cunitId = cu.cunitId)
WHERE pwl.pwId = 12
WHERE cu.cunitId = ?
AND pwl.pwId = ?

SELECT pwId, cunitId, SUM(quantity) AS estimate FROM pw_line GROUP BY pwId, cunitId
SELECT pwId, cunitId, SUM(quantity) AS done FROM wo_line LEFT JOIN wo ON wo.woId = wo_line.woId GROUP BY pwId, cunitId