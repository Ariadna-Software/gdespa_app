UPDATE cunit, ucc_prices SET cost = price WHERE cunit.reference = ucc_prices.reference;

UPDATE pw_line, cunit SET pw_line.cost = cunit.cost WHERE pw_line.cunitId = cunit.cunitId;

UPDATE pw_line SET amount =  ROUND(cost * quantity * k, 2);

CREATE TABLE yakee
SELECT pw.pwId, SUM(amount) AS t2 
FROM pw_line, pw 
WHERE pw_line.pwId = pw.pwId
GROUP BY pw.pwid;

UPDATE pw, yakee SET total = mainK * t2 WHERE pw.pwId = yakee.pwId;

DROP TABLE yakee;