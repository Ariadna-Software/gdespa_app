SELECT i.name AS item, s.name AS store, DATE_FORMAT(CURDATE(),'%d/%m/%Y') reportDate,
DATE_FORMAT(ist.lastInvDate,'%d/%m/%Y') AS lastInvDate, ist.lastStock, ist.stock
FROM item_stock AS ist
LEFT JOIN store AS s ON s.storeId = ist.storeId
LEFT JOIN item AS i ON i.itemId = ist.itemId
WHERE ist.itemId = 226 AND ist.storeId = 1


SELECT mov.dMov, mov.type, mov.inCharge, mov.quantity
FROM
(SELECT iol.itemId, dateOut AS dMov, "SALIDA" AS TYPE,  w.name AS inCharge, quantity 
FROM item_out_line iol
LEFT JOIN item_out AS io ON io.itemOutId = iol.itemOutId
LEFT JOIN worker AS w ON w.workerId = io.workerId
WHERE iol.itemId = 226 AND io.dateOut >= '2016-09-30' AND io.storeId = 1
UNION
SELECT iil.itemId, dateIn AS dMov, "ENTRADA" AS TYPE,  w.name AS inCharge, quantity 
FROM item_in_line iil
LEFT JOIN item_in AS ii ON ii.itemInId = iil.itemInId
LEFT JOIN worker AS w ON w.workerId = ii.workerId
WHERE iil.itemId = 226  AND ii.dateIn >= '2016-09-30' AND ii.storeId = 1) AS mov
ORDER BY mov.dMov



