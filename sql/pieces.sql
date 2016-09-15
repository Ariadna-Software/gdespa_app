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
#---------------------------------
CREATE TABLE `gdespa`.`pw`(  
  `pwId` INT(11) NOT NULL AUTO_INCREMENT,
  `reference` VARCHAR(255),
  `name` VARCHAR(255),
  `description` TEXT,
  `initDate` DATE,
  `initInCharge` INT(11),
  `companyId` INT(11),
  `defaultK` DECIMAL(5,2),
  `total` DECIMAL(12,2),
  PRIMARY KEY (`pwId`),
  CONSTRAINT `ref_pw_worker` FOREIGN KEY (`initInCharge`) REFERENCES `gdespa`.`worker`(`workerId`),
  CONSTRAINT `ref_pw_company` FOREIGN KEY (`companyId`) REFERENCES `gdespa`.`company`(`companyId`)
);
ALTER TABLE `gdespa`.`pw`   
  ADD COLUMN `status` VARCHAR(255) NULL AFTER `pwId`;
#----------------------
CREATE TABLE `gdespa`.`status`(  
  `statusId` INT(11),
  `name` VARCHAR(255)
);
ALTER TABLE `gdespa`.`status`   
  CHANGE `statusId` `statusId` INT(11) NOT NULL, 
  ADD PRIMARY KEY (`statusId`);

/*[19:35:25][85 ms]*/ INSERT INTO `gdespa`.`status` (`statusId`, `name`) VALUES ('0', 'PRESUPUESTO'); 
/*[19:35:32][55 ms]*/ INSERT INTO `gdespa`.`status` (`statusId`, `name`) VALUES ('1', 'ACEPTADO'); 
/*[19:35:41][105 ms]*/ INSERT INTO `gdespa`.`status` (`statusId`, `name`) VALUES ('2', 'TERMINADO'); 
/*[19:35:50][102 ms]*/ INSERT INTO `gdespa`.`status` (`statusId`, `name`) VALUES ('3', 'CERTIFICADO'); 
/*[19:35:56][53 ms]*/ INSERT INTO `gdespa`.`status` (`statusId`, `name`) VALUES ('4', 'FACTURADO'); 
/*[19:36:01][29 ms]*/ INSERT INTO `gdespa`.`status` (`statusId`, `name`) VALUES ('5', 'PAGADO'); 
ALTER TABLE `gdespa`.`pw`   
  CHANGE `status` `statusId` INT(11) NULL,
  ADD CONSTRAINT `ref_pw_status` FOREIGN KEY (`statusId`) REFERENCES `gdespa`.`status`(`statusId`);
