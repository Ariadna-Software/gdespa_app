ALTER TABLE `wo`   
  ADD COLUMN `zoneId` INT(11) NULL AFTER `dayTypeId`,
  ADD CONSTRAINT `ref_wo_zone` FOREIGN KEY (`zoneId`) REFERENCES `zone`(`zoneId`);

UPDATE wo, pw
SET wo.zoneId = pw.zoneId
WHERE wo.pwId = pw.pwId;