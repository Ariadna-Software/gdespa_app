SELECT 1 AS storeId, it.itemId, (COALESCE(i.qin, 0) -  COALESCE(o.qout, 0)) AS stock, it.name 
FROM item AS it 
LEFT JOIN 
(SELECT iin.storeId, iinl.itemId, SUM(iinl.quantity) AS qin 
FROM item_in AS iin 
LEFT JOIN item_in_line AS iinl ON iinl.itemInId = iin.itemInId 
WHERE iin.storeId = 1 AND iinl.itemId = 17650 AND iin.dateIn > '2016-09-30 00:00:00.000' 
GROUP BY storeId,itemId) AS i 
ON i.itemId = it.itemId 
LEFT JOIN (SELECT iout.storeId, ioutl.itemId, SUM(ioutl.quantity) AS qout 
FROM item_out AS iout 
LEFT JOIN item_out_line AS ioutl 
ON ioutl.itemOutId = iout.itemOutId 
WHERE iout.storeId = 1 AND ioutl.itemId = 17650 AND iout.dateOut > '2016-09-30 00:00:00.000' 
GROUP BY storeId, itemId) AS o  
ON o.itemId = it.itemId 
WHERE it.itemId = 17650