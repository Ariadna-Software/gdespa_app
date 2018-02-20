UPDATE worker SET active = 1 WHERE resTypeId = 1;

ALTER TABLE `team`   
  ADD COLUMN `active` BOOL DEFAULT TRUE NULL AFTER `zoneId`;
  
 UPDATE team SET active = 1;