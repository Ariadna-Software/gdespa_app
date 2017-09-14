CREATE TABLE `doc_type`(  
  `docTypeId` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255),
  PRIMARY KEY (`docTypeId`)
);

ALTER TABLE `doc`   
  ADD COLUMN `docTypeId` INT(11) NULL AFTER `file`,
  ADD COLUMN `woId` INT(11) NULL AFTER `docTypeId`,
  ADD CONSTRAINT `ref_doc_type` FOREIGN KEY (`docTypeId`) REFERENCES `doc_type`(`docTypeId`),
  ADD CONSTRAINT `ref_doc_wo` FOREIGN KEY (`woId`) REFERENCES `wo`(`woId`);