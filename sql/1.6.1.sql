ALTER TABLE `gdespa`.`user`   
  ADD COLUMN `seeZone` BOOL DEFAULT FALSE NULL AFTER `modWoClosed`;
ALTER TABLE `gdespa`.`user`   
  ADD COLUMN `zoneId` INT(11) NULL AFTER `seeZone`,
  ADD CONSTRAINT `rf_user_zone` FOREIGN KEY (`zoneId`) REFERENCES `gdespa`.`zone`(`zoneId`);
ALTER TABLE `gdespa`.`user`   
  ADD COLUMN `workOnlyZone` BOOL DEFAULT FALSE NULL AFTER `zoneId`;
ALTER TABLE `gdespa`.`store` ADD COLUMN `zoneId` INT(11) NULL AFTER `name`, 
  ADD CONSTRAINT `store_zone` FOREIGN KEY (`zoneId`) REFERENCES `gdespa`.`zone`(`zoneId`); 