
			       DECLARE vreferencia VARCHAR(255);
                               DECLARE vfechafinal DATE;
                               DECLARE vclienteId INT;
                               DECLARE vcontratoId INT;
                               DECLARE num INT DEFAULT 1;
                               
                               DECLARE antreferencia VARCHAR(255) DEFAULT '  ';
                               DECLARE antclienteId INT DEFAULT 0;
                               
                               DECLARE ntf BOOL;
                               
                
                               DECLARE cursor1 CURSOR FOR SELECT  contratoId, referencia, fechaFinal, clienteId FROM contratos ORDER BY clienteId ASC;
                               DECLARE CONTINUE HANDLER FOR NOT FOUND SET ntf=1;
                               
                               SET ntf = 0;
                               
                               OPEN cursor1;
                               
                               s_cursor: WHILE(ntf = 0) DO
                               
                               FETCH cursor1 INTO vcontratoId, vreferencia, vfechaFinal, vclienteId;
                                               
                               IF vreferencia = antreferencia AND vclienteId = antclienteId THEN
                               UPDATE contratos SET referencia = CONCAT(vreferencia,'.', num) WHERE clienteId = vclienteId AND contratoId = vcontratoId;
                               SET num = num+1;
                               
                               ELSE
                               SET num = 1;
                               
                               END IF;
                               
                               SET antreferencia = vreferencia;
                               SET antclienteId = vclienteId;
                               
                               
                               
                               IF ntf=1 THEN LEAVE s_cursor;
                               END IF;
                               
                               
                               
                               END WHILE s_cursor;
                               
                               CLOSE cursor1;

