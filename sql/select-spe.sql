SELECT wol.woLineId, wol.woId, wol.cunitId, cu.name AS cunitName, e.estimate, d.done, wol.quantity
FROM wo_line AS wol
LEFT JOIN wo ON wo.woId = wol.woId
LEFT JOIN cunit AS cu ON cu.cunitId = wol.cunitId
LEFT JOIN (SELECT pwId, cunitId, SUM(quantity) AS estimate FROM pw_line GROUP BY pwId, cunitId) AS e ON (e.pwId = wo.pwId AND e.cunitId = wol.cunitId)
LEFT JOIN (SELECT pwId, cunitId, SUM(quantity) AS done FROM wo_line LEFT JOIN wo ON wo.woId = wo_line.woId GROUP BY pwId, cunitId) AS d ON (d.pwId = wo.pwId AND d.cunitId = wol.cunitId)
