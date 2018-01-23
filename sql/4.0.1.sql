/*
SQLyog Community
MySQL - 5.7.17-log : Database - gdespa_test
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`gdespa_test` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `gdespa_test`;

/*Table structure for table `pl` */

DROP TABLE IF EXISTS `pl`;

CREATE TABLE `pl` (
  `plId` INT(11) NOT NULL AUTO_INCREMENT,
  `initDate` DATE DEFAULT NULL,
  `endDate` DATE DEFAULT NULL,
  `workerId` INT(11) DEFAULT NULL,
  `pwId` INT(11) DEFAULT NULL,
  `comments` VARCHAR(20480) DEFAULT NULL,
  `thirdParty` TINYINT(1) DEFAULT '0',
  `thirdPartyCompany` VARCHAR(255) DEFAULT NULL,
  `teamId` INT(11) DEFAULT NULL,
  `dayTypeId` INT(11) DEFAULT NULL,
  `zoneId` INT(11) DEFAULT NULL,
  PRIMARY KEY (`plId`),
  KEY `ref_pl_pw` (`pwId`),
  KEY `ref_pl_worker` (`workerId`),
  KEY `ref_pl_team` (`teamId`),
  KEY `ref_pl_daytyoe` (`dayTypeId`),
  KEY `ref_pl_zone` (`zoneId`),
  CONSTRAINT `ref_pl_daytyoe` FOREIGN KEY (`dayTypeId`) REFERENCES `day_type` (`dayTypeId`),
  CONSTRAINT `ref_pl_pw` FOREIGN KEY (`pwId`) REFERENCES `pw` (`pwId`),
  CONSTRAINT `ref_pl_team` FOREIGN KEY (`teamId`) REFERENCES `team` (`teamId`),
  CONSTRAINT `ref_pl_worker` FOREIGN KEY (`workerId`) REFERENCES `worker` (`workerId`),
  CONSTRAINT `ref_pl_zone` FOREIGN KEY (`zoneId`) REFERENCES `zone` (`zoneId`)
) ENGINE=INNODB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

/*Table structure for table `pl_line` */

DROP TABLE IF EXISTS `pl_line`;

CREATE TABLE `pl_line` (
  `plLineId` INT(11) NOT NULL AUTO_INCREMENT,
  `plId` INT(11) DEFAULT NULL,
  `cunitId` INT(11) DEFAULT NULL,
  `estimate` DECIMAL(12,2) DEFAULT NULL,
  `done` DECIMAL(12,2) DEFAULT NULL,
  `quantity` DECIMAL(12,2) DEFAULT NULL,
  `chapterId` INT(11) DEFAULT NULL,
  `pwLineId` INT(11) DEFAULT NULL,
  PRIMARY KEY (`plLineId`),
  KEY `ref_pll_pl` (`plId`),
  KEY `ref_pll_cunit` (`cunitId`),
  KEY `ref_pll_chapter` (`chapterId`),
  KEY `rel_pll_pwl` (`pwLineId`),
  CONSTRAINT `ref_pll_chapter` FOREIGN KEY (`chapterId`) REFERENCES `chapter` (`chapterId`),
  CONSTRAINT `ref_pll_cunit` FOREIGN KEY (`cunitId`) REFERENCES `cunit` (`cunitId`),
  CONSTRAINT `ref_pll_pl` FOREIGN KEY (`plId`) REFERENCES `pl` (`plId`) ON DELETE CASCADE,
  CONSTRAINT `rel_pll_pwl` FOREIGN KEY (`pwLineId`) REFERENCES `pw_line` (`pwLineId`)
) ENGINE=INNODB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;



/* -- Create relationship with wo */
ALTER TABLE `wo`   
  ADD COLUMN `plId` INT(11) NULL AFTER `zoneId`,
  ADD CONSTRAINT `ref_wo-pl` FOREIGN KEY (`plId`) REFERENCES `pl`(`plId`);

/*-- Permission to see used plans*/
ALTER TABLE `user`   
  ADD COLUMN `perSeePlansClosed` BOOL DEFAULT FALSE NULL AFTER `perChangePwDate`;

/*-- New fields in worker order --*/
ALTER TABLE `wo_line`   
  ADD COLUMN `planned` DECIMAL(12,2) NULL AFTER `pwLineId`,
  ADD COLUMN `plLineId` INT(11) NULL AFTER `planned`,
  ADD CONSTRAINT `rel_wpl_pll` FOREIGN KEY (`plLineId`) REFERENCES `pl_line`(`plLineId`);

/* -- I missed default value  --*/
UPDATE wo_line SET planned = 0;
ALTER TABLE `wo_line`   
  CHANGE `planned` `planned` DECIMAL(12,2) DEFAULT 0 NULL;