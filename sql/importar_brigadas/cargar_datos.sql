# dar de alta los trabajadores faltantes
INSERT INTO worker (`code`, `name`, cost)
SELECT codigo, nombre, coste FROM falta_trabajadores;
# update del campo coste en los trabajadores
UPDATE worker AS w, brme_centrales AS b
SET w.cost = b.coste WHERE w.code = b.codigo;
UPDATE worker AS w, brme_david AS b
SET w.cost = b.coste WHERE w.code = b.codigo;
UPDATE worker AS w, brnr_centrales AS b
SET w.cost = b.coste WHERE w.code = b.codigo;
UPDATE worker AS w, brnr_david AS b
SET w.cost = b.coste WHERE w.code = b.codigo;

# crear las brigadas según zonas (david_normal)
INSERT INTO team (zoneId, `name`)
SELECT DISTINCT 1, brigada AS `name` FROM brnr_david;
INSERT INTO team_line (teamId, workerId)
SELECT t.teamId, w.workerId
FROM brnr_david AS b
LEFT JOIN team AS t ON t.name = b.brigada AND t.zoneId = 1
LEFT JOIN worker AS w ON w.code = b.codigo;

# crear las brigadas según zonas (centrales normal)
INSERT INTO team (zoneId, `name`)
SELECT DISTINCT 2, brigada AS `name` FROM brnr_centrales;
INSERT INTO team_line (teamId, workerId)
SELECT t.teamId, w.workerId
FROM brnr_centrales AS b
LEFT JOIN team AS t ON t.name = b.brigada AND t.zoneId = 2
LEFT JOIN worker AS w ON w.code = b.codigo;

# crear las brigadas según zonas (david_medidores)
INSERT INTO team (zoneId, `name`)
SELECT DISTINCT 3, brigada AS `name` FROM brme_david;
INSERT INTO team_line (teamId, workerId)
SELECT t.teamId, w.workerId
FROM brme_david AS b
LEFT JOIN team AS t ON t.name = b.brigada AND t.zoneId = 3
LEFT JOIN worker AS w ON w.code = b.codigo;

# crear las brigadas según zonas (central_medidores)
INSERT INTO team (zoneId, `name`)
SELECT DISTINCT 4, brigada AS `name` FROM brme_centrales;
INSERT INTO team_line (teamId, workerId)
SELECT t.teamId, w.workerId
FROM brme_centrales AS b
LEFT JOIN team AS t ON t.name = b.brigada AND t.zoneId = 4
LEFT JOIN worker AS w ON w.code = b.codigo;
