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
  `plId` int(11) NOT NULL AUTO_INCREMENT,
  `initDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `workerId` int(11) DEFAULT NULL,
  `pwId` int(11) DEFAULT NULL,
  `comments` varchar(20480) DEFAULT NULL,
  `thirdParty` tinyint(1) DEFAULT '0',
  `thirdPartyCompany` varchar(255) DEFAULT NULL,
  `teamId` int(11) DEFAULT NULL,
  `dayTypeId` int(11) DEFAULT NULL,
  `zoneId` int(11) DEFAULT NULL,
  PRIMARY KEY (`plId`),
  KEY `ref_pl_pw` (`pwId`),
  KEY `ref_pl_worker` (`workerId`),
  KEY `ref_pl_closure` (`closureId`),
  KEY `ref_pl_team` (`teamId`),
  KEY `ref_pl_daytyoe` (`dayTypeId`),
  KEY `ref_pl_zone` (`zoneId`),
  CONSTRAINT `ref_pl_daytyoe` FOREIGN KEY (`dayTypeId`) REFERENCES `day_type` (`dayTypeId`),
  CONSTRAINT `ref_pl_pw` FOREIGN KEY (`pwId`) REFERENCES `pw` (`pwId`),
  CONSTRAINT `ref_pl_team` FOREIGN KEY (`teamId`) REFERENCES `team` (`teamId`),
  CONSTRAINT `ref_pl_worker` FOREIGN KEY (`workerId`) REFERENCES `worker` (`workerId`),
  CONSTRAINT `ref_pl_zone` FOREIGN KEY (`zoneId`) REFERENCES `zone` (`zoneId`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

/*Table structure for table `pl_line` */

DROP TABLE IF EXISTS `pl_line`;

CREATE TABLE `pl_line` (
  `plLineId` int(11) NOT NULL AUTO_INCREMENT,
  `plId` int(11) DEFAULT NULL,
  `cunitId` int(11) DEFAULT NULL,
  `estimate` decimal(12,2) DEFAULT NULL,
  `done` decimal(12,2) DEFAULT NULL,
  `quantity` decimal(12,2) DEFAULT NULL,
  `chapterId` int(11) DEFAULT NULL,
  `pwLineId` int(11) DEFAULT NULL,
  PRIMARY KEY (`plLineId`),
  KEY `ref_pll_pl` (`plId`),
  KEY `ref_pll_cunit` (`cunitId`),
  KEY `ref_pll_chapter` (`chapterId`),
  KEY `rel_pll_pwl` (`pwLineId`),
  CONSTRAINT `ref_pll_chapter` FOREIGN KEY (`chapterId`) REFERENCES `chapter` (`chapterId`),
  CONSTRAINT `ref_pll_cunit` FOREIGN KEY (`cunitId`) REFERENCES `cunit` (`cunitId`),
  CONSTRAINT `ref_pll_pl` FOREIGN KEY (`plId`) REFERENCES `pl` (`plId`) ON DELETE CASCADE,
  CONSTRAINT `rel_pll_pwl` FOREIGN KEY (`pwLineId`) REFERENCES `pw_line` (`pwLineId`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
