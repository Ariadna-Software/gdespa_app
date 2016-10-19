# Artículos con * en la referencia de los que existe otro en la base de datos con la misma referncia sin asterisco
SELECT *
FROM item
WHERE reference IN (SELECT CONCAT('*',reference) FROM item);

#Artículos sin * en la referencia, pero que tienen un compañero conasterisco.
SELECT *
FROM item 
WHERE reference IN (SELECT SUBSTR(reference, 2)
FROM item
WHERE reference IN (SELECT CONCAT('*',reference) FROM item));

#UUCC en la que están los con *
SELECT DISTINCT cu.*
FROM cunit AS cu
LEFT JOIN cunit_line AS cul ON cul.cunitId = cu.cunitId
LEFT JOIN item AS i ON i.itemId = cul.itemId
WHERE i.reference IN (
SELECT reference
FROM item
WHERE reference IN (SELECT CONCAT('*',reference) FROM item));

#PW donde UUC con *
SELECT DISTINCT pw.* 
FROM pw
LEFT JOIN pw_line AS pwl ON pwl.pwId = pw.pwId
WHERE pwl.cunitId IN (SELECT DISTINCT cu.cunitId
FROM cunit AS cu
LEFT JOIN cunit_line AS cul ON cul.cunitId = cu.cunitId
LEFT JOIN item AS i ON i.itemId = cul.itemId
WHERE i.reference IN (
SELECT reference
FROM item
WHERE reference IN (SELECT CONCAT('*',reference) FROM item)));

#UUCC en la que están los sin *
SELECT DISTINCT cu.*
FROM cunit AS cu
LEFT JOIN cunit_line AS cul ON cul.cunitId = cu.cunitId
LEFT JOIN item AS i ON i.itemId = cul.itemId
WHERE i.reference IN (
SELECT reference
FROM item 
WHERE reference IN (SELECT SUBSTR(reference, 2)
FROM item
WHERE reference IN (SELECT CONCAT('*',reference) FROM item)));

#PW donde UUC con sin *
SELECT DISTINCT pw.* 
FROM pw
LEFT JOIN pw_line AS pwl ON pwl.pwId = pw.pwId
WHERE pwl.cunitId IN (SELECT DISTINCT cu.cunitId
FROM cunit AS cu
LEFT JOIN cunit_line AS cul ON cul.cunitId = cu.cunitId
LEFT JOIN item AS i ON i.itemId = cul.itemId
WHERE i.reference IN (
SELECT reference
FROM item 
WHERE reference IN (SELECT SUBSTR(reference, 2)
FROM item
WHERE reference IN (SELECT CONCAT('*',reference) FROM item))));

#Unidades constructivas en las que están cualquiera de ellos dos
SELECT DISTINCT cu.*
FROM cunit AS cu
LEFT JOIN cunit_line AS cul ON cul.cunitId = cu.cunitId
LEFT JOIN item AS i ON i.itemId = cul.itemId
WHERE i.reference IN (
SELECT reference
FROM item
WHERE reference IN (SELECT CONCAT('*',reference) FROM item)
UNION
SELECT SUBSTR(reference, 2)
FROM item
WHERE reference IN (SELECT CONCAT('*',reference) FROM item));

#PW donde UUC con  y sin *
SELECT DISTINCT pw.* 
FROM pw
LEFT JOIN pw_line AS pwl ON pwl.pwId = pw.pwId
WHERE pwl.cunitId IN (SELECT DISTINCT cu.cunitId
FROM cunit AS cu
LEFT JOIN cunit_line AS cul ON cul.cunitId = cu.cunitId
LEFT JOIN item AS i ON i.itemId = cul.itemId
WHERE i.reference IN (
SELECT reference
FROM item
WHERE reference IN (SELECT CONCAT('*',reference) FROM item)
UNION
SELECT SUBSTR(reference, 2)
FROM item
WHERE reference IN (SELECT CONCAT('*',reference) FROM item)));

