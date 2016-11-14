SELECT iin.itemInId, iin.storeId, iinl.itemId, iinl.quantity AS qin 
FROM item_in AS iin 
LEFT JOIN item_in_line AS iinl ON iinl.itemInId = iin.itemInId 
WHERE iin.storeId = 1 AND iinl.itemId = 17658 AND iin.dateIn > '2016-09-30 00:00:00.000'

SELECT iout.itemOutId, iout.storeId, iout.dateOut, ioutl.itemId, ioutl.quantity AS qout 
FROM item_out AS iout 
LEFT JOIN item_out_line AS ioutl 
ON ioutl.itemOutId = iout.itemOutId 
WHERE iout.storeId = 1 AND ioutl.itemId = 17658 AND iout.dateOut > '2016-09-30 00:00:00.000' 

