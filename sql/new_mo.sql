/*
SQLyog Community v12.4.2 (64 bit)
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

/*Table structure for table `wo` */

DROP TABLE IF EXISTS `wo`;

CREATE TABLE `wo` (
  `woId` int(11) NOT NULL AUTO_INCREMENT,
  `initDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `workerId` int(11) DEFAULT NULL,
  `pwId` int(11) DEFAULT NULL,
  `comments` text,
  `closureId` int(11) DEFAULT NULL,
  `thirdParty` tinyint(1) DEFAULT '0',
  `thirdPartyCompany` varchar(255) DEFAULT NULL,
  `teamId` int(11) DEFAULT NULL,
  PRIMARY KEY (`woId`),
  KEY `ref_wo_pw` (`pwId`),
  KEY `ref_wo_worker` (`workerId`),
  KEY `ref_wo_closure` (`closureId`),
  KEY `ref_wo_team` (`teamId`),
  CONSTRAINT `ref_wo_closure` FOREIGN KEY (`closureId`) REFERENCES `closure` (`closureId`),
  CONSTRAINT `ref_wo_pw` FOREIGN KEY (`pwId`) REFERENCES `pw` (`pwId`),
  CONSTRAINT `ref_wo_team` FOREIGN KEY (`teamId`) REFERENCES `team` (`teamId`),
  CONSTRAINT `ref_wo_worker` FOREIGN KEY (`workerId`) REFERENCES `worker` (`workerId`)
) ENGINE=InnoDB AUTO_INCREMENT=880 DEFAULT CHARSET=utf8;

/*Table structure for table `wo_line` */

DROP TABLE IF EXISTS `wo_line`;

CREATE TABLE `wo_line` (
  `woLineId` int(11) NOT NULL AUTO_INCREMENT,
  `woId` int(11) DEFAULT NULL,
  `cunitId` int(11) DEFAULT NULL,
  `estimate` decimal(6,2) DEFAULT NULL,
  `done` decimal(6,2) DEFAULT NULL,
  `quantity` decimal(6,2) DEFAULT NULL,
  `chapterId` int(11) DEFAULT NULL,
  PRIMARY KEY (`woLineId`),
  KEY `ref_wol_wo` (`woId`),
  KEY `ref_wol_cunit` (`cunitId`),
  KEY `ref_wol_chapter` (`chapterId`),
  CONSTRAINT `ref_wol_chapter` FOREIGN KEY (`chapterId`) REFERENCES `chapter` (`chapterId`),
  CONSTRAINT `ref_wol_cunit` FOREIGN KEY (`cunitId`) REFERENCES `cunit` (`cunitId`),
  CONSTRAINT `ref_wol_wo` FOREIGN KEY (`woId`) REFERENCES `wo` (`woId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=46331 DEFAULT CHARSET=utf8;

/*Table structure for table `wo_worker` */

DROP TABLE IF EXISTS `wo_worker`;

CREATE TABLE `wo_worker` (
  `woWorkerId` int(11) NOT NULL AUTO_INCREMENT,
  `woId` int(11) DEFAULT NULL,
  `workerId` int(11) DEFAULT NULL,
  `quantity` decimal(5,2) DEFAULT '0.00',
  `cost` decimal(12,2) DEFAULT '0.00',
  `normalHours` decimal(10,2) DEFAULT NULL,
  `extraHours` decimal(10,2) DEFAULT NULL,
  `initialKm` decimal(10,2) DEFAULT NULL,
  `finalKm` decimal(10,2) DEFAULT NULL,
  `totalKm` decimal(10,2) DEFAULT NULL,
  `fuel` decimal(10,2) DEFAULT NULL,
  `planHours` decimal(10,2) DEFAULT NULL,
  `extraHoursNight` decimal(10,2) DEFAULT NULL,
  `expenses` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`woWorkerId`),
  KEY `ref_wow_wo` (`woId`),
  KEY `ref_wow_worker` (`workerId`),
  CONSTRAINT `ref_wow_wo` FOREIGN KEY (`woId`) REFERENCES `wo` (`woId`) ON DELETE CASCADE,
  CONSTRAINT `ref_wow_worker` FOREIGN KEY (`workerId`) REFERENCES `worker` (`workerId`) ON DELETE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4362 DEFAULT CHARSET=latin1;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
