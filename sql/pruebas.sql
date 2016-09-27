SELECT s.*, i.name AS itemName, st.stock
FROM store AS s
LEFT JOIN item_stock AS st ON st.storeId = s.storeId
LEFT JOIN item AS i ON i.itemId = st.itemId

SELECT i.*, s.name AS storeName, st.stock
FROM item AS i
LEFT JOIN item_stock AS st ON st.itemId = i.itemId
LEFT JOIN store AS s ON s.storeId = st.storeId
WHERE NOT s.name IS NULL