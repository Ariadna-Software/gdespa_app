CREATE TABLE `work_type`(  
  `workTypeId` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255),
  PRIMARY KEY (`workTypeId`)
);

CREATE TABLE `ins_type`(  
  `insTypeId` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255),
  PRIMARY KEY (`insTypeId`)
);

CREATE TABLE `area_type`(  
  `areaTypeId` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255),
  PRIMARY KEY (`areaTypeId`)
);

ALTER TABLE `pw`   
  ADD COLUMN `workTypeId` INT NULL AFTER `revUser`,
  ADD COLUMN `insTypeId` INT NULL AFTER `workTypeId`,
  ADD COLUMN `areaTypeId` INT NULL AFTER `insTypeId`,
  ADD CONSTRAINT `ref_pw_work` FOREIGN KEY (`workTypeId`) REFERENCES `work_type`(`workTypeId`),
  ADD CONSTRAINT `ref_pw_ins` FOREIGN KEY (`insTypeId`) REFERENCES `ins_type`(`insTypeId`),
  ADD CONSTRAINT `ref_pw_area` FOREIGN KEY (`areaTypeId`) REFERENCES `area_type`(`areaTypeId`);