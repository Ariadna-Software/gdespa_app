SELECT pw.pwId, pw.name AS pwName, pw.initDate, st.name AS STATUS, c.name AS company, pw.description, pw.reference AS refPw , z.name AS zoneName,pw.mainK,  w.name AS initInCharge, pw.total,
pwl.line AS pwlLine, cu.name AS cuName, pwl.cost AS pwlC, pwl.quantity AS pwlQ, pwl.k AS pwlK, pwl.amount AS pwlA,
cul.line AS culLine, i.name AS itemName, cul.quantity AS qUc, (cul.quantity * pwl.quantity) AS qPw, pwl.comments,
pwl.pwLineId, cul.cunitLineId, pwl.chapterId, ch.order, ch.name AS chapterName, ch.comments AS chapterComments
FROM pw AS pw
LEFT JOIN pw_line AS pwl ON pwl.pwId = pw.pwId
LEFT JOIN STATUS AS st ON st.statusId = pw.statusId
LEFT JOIN company AS c ON c.companyId = pw.companyId
LEFT JOIN zone AS z ON z.zoneId = pw.zoneId
LEFT JOIN worker AS w ON w.workerId = pw.initInCharge
LEFT JOIN cunit AS cu ON cu.cunitId = pwl.cunitId
LEFT JOIN cunit_line AS cul ON cul.cunitId = cu.cunitId
LEFT JOIN item AS i ON i.itemId = cul.itemId
LEFT JOIN chapter AS ch ON ch.chapterId = pwl.chapterId
WHERE pw.pwId = 1148
ORDER BY pw.pwId, ch.order, pwl.line, pwl.pwLineId, cul.line, cul.cunitLineId