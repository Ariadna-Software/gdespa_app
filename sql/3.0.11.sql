CREATE TABLE `mea_type` (
  `meaTypeId` INT(11) NOT NULL,
  `name` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`meaTypeId`)
) ENGINE=INNODB DEFAULT CHARSET=latin1;

/*Data for the table `mea_type` */

INSERT  INTO `mea_type`(`meaTypeId`,`name`) VALUES (0,'CONTADORES');
INSERT  INTO `mea_type`(`meaTypeId`,`name`) VALUES (1,'LUMINARIA');

ALTER TABLE `mea`   
  ADD COLUMN `meaTypeId` INT(11) NULL AFTER `cost`,
  ADD CONSTRAINT `ref_mea_meaType` FOREIGN KEY (`meaTypeId`) REFERENCES `mea_type`(`meaTypeId`);

ALTER TABLE `mo`   
  ADD COLUMN `meaTypeId` INT(11) NULL AFTER `dayTypeId`,
  ADD CONSTRAINT `ref_mo_meaType` FOREIGN KEY (`meaTypeId`) REFERENCES `mea_type`(`meaTypeId`);

UPDATE mea SET meaTypeId = 0;
UPDATE mo SET meaTypeId = 0;