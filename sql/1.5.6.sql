INSERT INTO item (reference, NAME)
SELECT reference, NAME FROM inv_david WHERE reference NOT IN (SELECT reference FROM item);

INSERT INTO item_stock(storeId, itemId, stock)
SELECT 1 AS storeId, i.itemId, ind.quantity AS stock
FROM inv_david AS ind
LEFT JOIN item AS i ON i.reference = ind.reference;