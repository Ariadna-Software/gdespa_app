UPDATE item_stock AS s, inventory AS i, inventory_line AS l
SET s.lastInvDate = i.inventoryDate, s.lastInvId = i.inventoryId
WHERE s.storeId = 1
AND i.storeId = s.storeId
AND l.inventoryId = i.inventoryId