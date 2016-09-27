INSERT INTO item_stock (storeId, itemId, stock)
SELECT 1 AS storeId, i.itemId, (COALESCE(i.qin, 0) -  COALESCE(o.qout, 0)) AS stock
FROM 
(SELECT iin.storeId, iinl.itemId, SUM(iinl.quantity) AS qin
FROM item_in AS iin
LEFT JOIN item_in_line AS iinl ON iinl.itemInId = iin.itemInId
WHERE iin.storeId = 1 AND iinl.itemId = 120
GROUP BY storeId,itemId) AS i
LEFT JOIN
(SELECT iout.storeId, ioutl.itemId, SUM(ioutl.quantity) AS qout
FROM item_out AS iout
LEFT JOIN item_out_line AS ioutl ON ioutl.itemOutId = iout.itemOutId
WHERE iout.storeId = 1 AND ioutl.itemId = 120
GROUP BY storeId, itemId) AS o
ON o.itemId = i.itemId
