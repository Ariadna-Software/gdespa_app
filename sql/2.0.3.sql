CREATE TABLE `resource_type`(  
  `resTypeId` INT NOT NULL,
  `name` VARCHAR(255),
  PRIMARY KEY (`resTypeId`)
);

INSERT INTO `resource_type` (`resTypeId`, `name`) VALUES ('0', 'TRABAJADOR'); 
INSERT INTO `resource_type` (`resTypeId`, `name`) VALUES ('1', 'VEHICULO / MAQUINARIA'); 

ALTER TABLE `worker`   
  ADD COLUMN `resTypeId` INT(11) NULL AFTER `cost`,
  ADD COLUMN `license` VARCHAR(255) NULL AFTER `resTypeId`,
  ADD CONSTRAINT `ref_resource_type` FOREIGN KEY (`resTypeId`) REFERENCES `resource_type`(`resTypeId`);

UPDATE worker SET resTypeId = 0;