ALTER TABLE `gdespa`.`worker`   
  ADD COLUMN `blood_type` VARCHAR(255) NULL AFTER `department`;
ALTER TABLE `gdespa`.`worker`   
  CHANGE `blood_type` `bloodType` VARCHAR(255) CHARSET utf8 COLLATE utf8_general_ci NULL;
ALTER TABLE `gdespa`.`item`   
  ADD COLUMN `ownItem` BOOL NULL AFTER `image`,
  ADD COLUMN `minStock` DECIMAL(10,2) NULL AFTER `ownItem`;
ALTER TABLE `gdespa`.`item_in`   
  ADD COLUMN `deliveryNote` VARCHAR(255) NULL AFTER `comments`;
CREATE TABLE `gdespa`.`zone`(  
  `zoneId` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255),
  PRIMARY KEY (`zoneId`)
);
ALTER TABLE `gdespa`.`pw`   
  ADD COLUMN `zoneId` INT NULL AFTER `payRef`,
  ADD CONSTRAINT `ref_pw_zone` FOREIGN KEY (`zoneId`) REFERENCES `gdespa`.`zone`(`zoneId`);
