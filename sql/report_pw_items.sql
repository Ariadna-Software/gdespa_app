SELECT i.name, SUM(iol.quantity) AS quantity
FROM item_out AS io
LEFT JOIN item_out_line AS iol ON iol.itemOutId = io.itemOutId
LEFT JOIN item AS i ON i.itemId = iol.itemId
WHERE io.pwId = 46
GROUP BY io.pwId, iol.itemId
ORDER BY i.name;


