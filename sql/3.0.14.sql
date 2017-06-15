ALTER TABLE `pw`   
  ADD COLUMN `zoneId2` INT(11) NULL AFTER `subZone`,
  ADD CONSTRAINT `ref_pw_zone2` FOREIGN KEY (`zoneId2`) REFERENCES `zone`(`zoneId`);
