/*
SQLyog Community
MySQL - 5.7.17-log : Database - gdespa_test
*********************************************************************
*/
CREATE TABLE `day_type` (
  `dayTypeId` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`dayTypeId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


insert  into `day_type`(`dayTypeId`,`name`) values (0,'NORMAL');
insert  into `day_type`(`dayTypeId`,`name`) values (1,'DOMINGO / DESCANSO');
insert  into `day_type`(`dayTypeId`,`name`) values (2,'FESTIVO / FERIADO');

ALTER TABLE `wo`   
  ADD COLUMN `dayTypeId` INT(11) NULL AFTER `teamId`,
  ADD CONSTRAINT `ref_wo_daytyoe` FOREIGN KEY (`dayTypeId`) REFERENCES `day_type`(`dayTypeId`);

ALTER TABLE `mo`   
  ADD COLUMN `dayTypeId` INT(11) NULL AFTER `teamId`,
  ADD CONSTRAINT `ref_mo_daytype` FOREIGN KEY (`dayTypeId`) REFERENCES `day_type`(`dayTypeId`);

UPDATE wo SET dayTypeId = 0;
UPDATE mo SET dayTypeId = 0;

ALTER TABLE `zone`   
  ADD COLUMN `woK` DECIMAL(5,2) NULL AFTER `name`,
  ADD COLUMN `moK` DECIMAL(5,2) NULL AFTER `woK`;

ALTER TABLE `mo_line`   
  ADD COLUMN `moK` DECIMAL(5,2) DEFAULT 1 NULL AFTER `cost`;