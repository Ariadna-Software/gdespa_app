SELECT mov.id, mov.id2, mov.dMov, mov.type, mov.inCharge, mov.quantity 
FROM 
(SELECT io.itemOutId AS id, iol.itemOutLineId AS id2, iol.itemId, dateOut AS dMov, 'SALIDA' AS TYPE,  w.name AS inCharge, quantity 
FROM item_out_line iol 
LEFT JOIN item_out AS io ON io.itemOutId = iol.itemOutId 
LEFT JOIN worker AS w ON w.workerId = io.workerId 
WHERE iol.itemId = '17650' AND io.dateOut > '2016-09-30 00:00:00.000' AND io.storeId = '1' 
UNION 
SELECT ii.itemInId AS id,iil.itemInLineId AS id2, iil.itemId, dateIn AS dMov, 'ENTRADA' AS TYPE,  w.name AS inCharge, quantity 
FROM item_in_line iil 
LEFT JOIN item_in AS ii ON ii.itemInId = iil.itemInId 
LEFT JOIN worker AS w ON w.workerId = ii.workerId 
WHERE iil.itemId = '17650'  AND ii.dateIn > '2016-09-30 00:00:00.000' AND ii.storeId = '1') AS mov 
ORDER BY mov.dMov