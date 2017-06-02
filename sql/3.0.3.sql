ALTER TABLE `team`   
  ADD COLUMN `zoneId` INT(11) NULL AFTER `workerInChargeId`,
  ADD CONSTRAINT `ref_team_zone` FOREIGN KEY (`zoneId`) REFERENCES `zone`(`zoneId`);