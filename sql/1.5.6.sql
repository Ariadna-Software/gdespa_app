INSERT INTO item (reference, NAME)
SELECT reference, NAME FROM inv_david WHERE reference NOT IN (SELECT reference FROM item);