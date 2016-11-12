SELECT w.name, SUM(wow.quantity) AS quantity, SUM(wow.cost) AS cost
FROM wo
LEFT JOIN wo_worker AS wow ON wow.woId = wo.woId
LEFT JOIN worker AS w ON w.workerId = wow.workerId
WHERE wo.pwId = 13
GROUP BY wo.pwId, wow.workerId
ORDER BY w.name