CREATE TABLE `gdespa`.`worker`(  
  `workerId` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255),
  `ssId` VARCHAR(255),
  `address` VARCHAR(255),
  `zip` VARCHAR(255),
  `city` VARCHAR(255),
  `province` VARCHAR(255),
  `state` VARCHAR(255),
  `userId` INT(11),
  PRIMARY KEY (`workerId`),
  CONSTRAINT `ref_user` FOREIGN KEY (`userId`) REFERENCES `gdespa`.`user`(`userId`)
);
ALTER TABLE `gdespa`.`worker`   
  ADD COLUMN `phone` VARCHAR(255) NULL AFTER `userId`,
  ADD COLUMN `email` VARCHAR(255) NULL AFTER `phone`;
  
 ALTER TABLE `gdespa`.`worker`   
  ADD COLUMN `code` INT(11) NULL AFTER `email`,
  ADD COLUMN `position` VARCHAR(255) NULL AFTER `code`,
  ADD COLUMN `department` VARCHAR(255) NULL AFTER `position`;

  INSERT INTO gdespa.worker (CODE, NAME, POSITION, department)
SELECT * FROM gdespa_test.import;

#-------------------
CREATE TABLE `gdespa_test`.`company`(  
  `companyId` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255),
  PRIMARY KEY (`companyId`)
);
CREATE TABLE `gdespa_test`.`store`(  
  `storeId` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255),
  PRIMARY KEY (`storeId`)
);

#----------------------
CREATE TABLE `gdespa_test`.`unit`(  
  `unitId` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255),
  `abb` VARCHAR(255),
  PRIMARY KEY (`unitId`)
);
# --------------------
CREATE TABLE `gdespa_test`.`item`(  
  `itemId` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255),
  `description` TEXT,
  `unitId` INT(11),
  `image` VARCHAR(255),
  PRIMARY KEY (`itemId`),
  CONSTRAINT `ref_item_unit` FOREIGN KEY (`unitId`) REFERENCES `gdespa_test`.`unit`(`unitId`)
);
ALTER TABLE `gdespa_test`.`item`   
  ADD COLUMN `reference` VARCHAR(255) NULL AFTER `itemId`;
#------------------------------
CREATE TABLE `gdespa`.`cunit`(  
  `cunitId` INT(11) NOT NULL AUTO_INCREMENT,
  `reference` VARCHAR(255),
  `name` VARCHAR(255),
  `description` TEXT,
  `image` VARCHAR(255),
  `cost` DECIMAL(12,2),
  PRIMARY KEY (`cunitId`)
);
#----------------------------------
CREATE TABLE `gdespa`.`cunit_line`(  
  `cunitLineId` INT(11) NOT NULL AUTO_INCREMENT,
  `cunitId` INT(11),
  `line` INT(11),
  `itemId` INT(11),
  `quantity` DECIMAL(5,2),
  PRIMARY KEY (`cunitLineId`),
  CONSTRAINT `ref_cuniLine_cunit` FOREIGN KEY (`cunitId`) REFERENCES `gdespa`.`cunit`(`cunitId`),
  CONSTRAINT `ref_cunitLine_item` FOREIGN KEY (`itemId`) REFERENCES `gdespa`.`item`(`itemId`)
);
#---------------------------------
ALTER TABLE `gdespa`.`cunit_line`   
  ADD COLUMN `unitId` INT(11) NULL AFTER `itemId`,
  ADD CONSTRAINT `ref_cunitLine_unit` FOREIGN KEY (`unitId`) REFERENCES `gdespa`.`unit`(`unitId`);
