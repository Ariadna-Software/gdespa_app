/*
SQLyog Community v12.2.4 (64 bit)
MySQL - 5.7.13-log : Database - gdespa
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`gdespa` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `gdespa`;

/*Table structure for table `api_key` */

DROP TABLE IF EXISTS `api_key`;

CREATE TABLE `api_key` (
  `apiKeyId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `getDateTime` datetime DEFAULT NULL,
  `expireDateTime` datetime DEFAULT NULL,
  `apiKey` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`apiKeyId`),
  KEY `ref_apikey_user` (`userId`),
  CONSTRAINT `ref_apikey_user` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8;

/*Data for the table `api_key` */

insert  into `api_key`(`apiKeyId`,`userId`,`getDateTime`,`expireDateTime`,`apiKey`) values 
(2,1,'2016-09-08 10:35:54','2016-09-08 15:35:54','pPr0k'),
(3,1,'2016-09-08 10:36:08','2016-09-08 15:36:08','Bgnk1'),
(4,1,'2016-09-08 10:36:20','2016-09-08 15:36:20','EQZOt'),
(5,1,'2016-09-08 10:36:56','2016-09-08 15:36:56','LxOUL'),
(6,1,'2016-09-08 11:00:53','2016-09-08 16:00:53','xvCGA'),
(7,1,'2016-09-08 11:02:00','2016-09-08 16:02:00','NqJmO'),
(8,1,'2016-09-08 11:02:13','2016-09-08 16:02:13','7XMpU'),
(9,1,'2016-09-08 11:02:16','2016-09-08 16:02:16','QfWvy'),
(10,1,'2016-09-08 11:05:41','2016-09-08 16:05:41','S3OM7'),
(11,1,'2016-09-08 11:07:13','2016-09-08 16:07:13','yZeG0'),
(12,1,'2016-09-08 11:07:23','2016-09-08 16:07:23','s6wpn'),
(13,1,'2016-09-08 11:10:32','2016-09-08 16:10:32','uT1JK'),
(14,1,'2016-09-08 11:10:42','2016-09-08 16:10:42','xoizR'),
(15,1,'2016-09-08 11:12:30','2016-09-08 16:12:30','NX15d'),
(16,1,'2016-09-08 11:12:59','2016-09-08 16:12:59','MAe80'),
(17,1,'2016-09-08 11:17:24','2016-09-08 16:17:24','iRWh1'),
(18,1,'2016-09-08 11:19:13','2016-09-08 16:19:13','DGwfH'),
(19,1,'2016-09-08 11:23:20','2016-09-08 16:23:20','46N5u'),
(20,1,'2016-09-08 11:24:53','2016-09-08 16:24:53','B0MUA'),
(21,1,'2016-09-08 11:26:08','2016-09-08 16:26:08','ByNxv'),
(22,1,'2016-09-08 11:33:55','2016-09-08 16:33:55','dFzCp'),
(23,1,'2016-09-08 11:41:45','2016-09-08 16:41:45','ODTSi'),
(24,1,'2016-09-08 11:41:51','2016-09-08 16:41:51','V9VN8'),
(25,1,'2016-09-08 11:41:52','2016-09-08 16:41:52','GO2Z6'),
(26,1,'2016-09-08 11:41:52','2016-09-08 16:41:52','WQIxx'),
(27,1,'2016-09-08 11:43:32','2016-09-08 16:43:32','Cw6Ut'),
(28,1,'2016-09-08 11:53:21','2016-09-08 16:53:21','Lpuif'),
(29,1,'2016-09-08 11:54:44','2016-09-08 16:54:44','jmnSg'),
(30,1,'2016-09-08 11:55:05','2016-09-08 16:55:05','sBUnj'),
(31,1,'2016-09-08 11:55:54','2016-09-08 16:55:54','qciXC'),
(32,1,'2016-09-08 11:56:21','2016-09-08 16:56:21','LtQyT'),
(33,1,'2016-09-08 11:56:22','2016-09-08 16:56:22','mgufk'),
(34,1,'2016-09-08 11:56:33','2016-09-08 16:56:33','2Ed4g'),
(35,1,'2016-09-08 11:56:44','2016-09-08 16:56:44','GUPOL'),
(36,1,'2016-09-08 11:56:46','2016-09-08 16:56:46','2hga5'),
(37,1,'2016-09-08 12:57:52','2016-09-08 17:57:52','GZmQk'),
(38,1,'2016-09-08 13:00:21','2016-09-08 18:00:21','zkcQi'),
(39,1,'2016-09-08 13:19:20','2016-09-08 18:19:20','rng8O'),
(40,1,'2016-09-08 13:19:28','2016-09-08 18:19:28','SxstO'),
(41,1,'2016-09-08 13:20:41','2016-09-08 18:20:41','ncwHv'),
(42,1,'2016-09-08 13:24:13','2016-09-08 18:24:13','AqW6F'),
(43,1,'2016-09-08 13:25:00','2016-09-08 18:25:00','dxlzG'),
(44,1,'2016-09-08 13:25:43','2016-09-08 18:25:43','ElSa7'),
(45,1,'2016-09-08 17:16:37','2016-09-08 22:16:37','OkYkG'),
(46,1,'2016-09-08 17:27:03','2016-09-08 22:27:03','p8xI3'),
(47,1,'2016-09-08 17:30:58','2016-09-08 22:30:58','bS8pL'),
(48,1,'2016-09-09 08:38:55','2016-09-09 13:38:55','iX3cD'),
(49,1,'2016-09-09 09:03:53','2016-09-09 14:03:53','NZLen'),
(50,1,'2016-09-09 09:05:40','2016-09-09 14:05:40','55E0D'),
(51,1,'2016-09-09 10:30:44','2016-09-09 15:30:44','cYi6b'),
(52,1,'2016-09-09 17:23:02','2016-09-09 22:23:02','NPfgO'),
(53,1,'2016-09-12 08:28:06','2016-09-12 13:28:06','M5LyS'),
(54,1,'2016-09-12 08:29:19','2016-09-12 13:29:19','rlm3u'),
(55,1,'2016-09-12 11:42:07','2016-09-12 16:42:07','KFdNm'),
(56,1,'2016-09-12 16:55:48','2016-09-12 21:55:48','dOx5E'),
(57,1,'2016-09-12 17:08:41','2016-09-12 22:08:41','hz3U1'),
(58,1,'2016-09-13 11:02:55','2016-09-13 16:02:55','COUtk'),
(59,1,'2016-09-13 16:05:16','2016-09-13 21:05:16','N2kvJ'),
(60,1,'2016-09-14 08:26:38','2016-09-14 13:26:38','lMxG7'),
(61,1,'2016-09-14 13:26:50','2016-09-14 18:26:50','tXAtH'),
(62,1,'2016-09-14 18:36:30','2016-09-14 23:36:30','49Pnz'),
(63,1,'2016-09-15 08:43:52','2016-09-15 13:43:52','DOgBe'),
(64,1,'2016-09-15 12:13:18','2016-09-15 17:13:18','8zkJw'),
(65,1,'2016-09-15 12:57:51','2016-09-15 17:57:51','282aV'),
(66,1,'2016-09-15 18:17:42','2016-09-15 23:17:42','HmkQV'),
(67,1,'2016-09-15 19:44:23','2016-09-16 00:44:23','MH1Nx'),
(68,1,'2016-09-15 19:57:22','2016-09-16 00:57:22','DlXIP'),
(69,1,'2016-09-15 20:05:48','2016-09-16 01:05:48','DaTZs'),
(70,1,'2016-09-16 01:24:10','2016-09-16 06:24:10','36MSB'),
(71,1,'2016-09-16 08:09:51','2016-09-16 13:09:51','zyfrw'),
(72,1,'2016-09-16 18:51:46','2016-09-16 23:51:46','bgpki'),
(73,1,'2016-09-17 02:12:53','2016-09-17 07:12:53','klSsN'),
(74,1,'2016-09-17 08:08:14','2016-09-17 13:08:14','QuyFm'),
(75,1,'2016-09-17 13:25:49','2016-09-17 18:25:49','mtrWS'),
(76,1,'2016-09-17 16:52:47','2016-09-17 21:52:47','RzqAR'),
(77,1,'2016-09-18 12:28:03','2016-09-18 17:28:03','0jllh'),
(78,1,'2016-09-19 01:49:31','2016-09-19 06:49:31','TPmfv');

/*Table structure for table `closure` */

DROP TABLE IF EXISTS `closure`;

CREATE TABLE `closure` (
  `closureId` int(11) NOT NULL AUTO_INCREMENT,
  `closureDate` date DEFAULT NULL,
  `workerId` int(11) DEFAULT NULL,
  `comments` text,
  PRIMARY KEY (`closureId`),
  KEY `ref_closure_worker` (`workerId`),
  CONSTRAINT `ref_closure_worker` FOREIGN KEY (`workerId`) REFERENCES `worker` (`workerId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `closure` */

insert  into `closure`(`closureId`,`closureDate`,`workerId`,`comments`) values 
(1,'2016-01-01',11,'Manual');

/*Table structure for table `closure_line` */

DROP TABLE IF EXISTS `closure_line`;

CREATE TABLE `closure_line` (
  `closureLineId` int(11) NOT NULL AUTO_INCREMENT,
  `closureId` int(11) DEFAULT NULL,
  `pwId` int(11) DEFAULT NULL,
  `estimate` decimal(5,2) DEFAULT NULL,
  `done` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`closureLineId`),
  KEY `ref_closline_closure` (`closureId`),
  KEY `ref_closline_pw` (`pwId`),
  CONSTRAINT `ref_closline_closure` FOREIGN KEY (`closureId`) REFERENCES `closure` (`closureId`),
  CONSTRAINT `ref_closline_pw` FOREIGN KEY (`pwId`) REFERENCES `pw` (`pwId`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

/*Data for the table `closure_line` */

insert  into `closure_line`(`closureLineId`,`closureId`,`pwId`,`estimate`,`done`) values 
(1,1,6,'0.00','0.00'),
(2,1,8,'0.50','0.50'),
(3,1,7,'0.00','0.00'),
(4,1,5,'0.70','0.70');

/*Table structure for table `company` */

DROP TABLE IF EXISTS `company`;

CREATE TABLE `company` (
  `companyId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`companyId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `company` */

insert  into `company`(`companyId`,`name`) values 
(1,'Gas Natural - Union Fenosa');

/*Table structure for table `cunit` */

DROP TABLE IF EXISTS `cunit`;

CREATE TABLE `cunit` (
  `cunitId` int(11) NOT NULL AUTO_INCREMENT,
  `reference` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `cost` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`cunitId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `cunit` */

insert  into `cunit`(`cunitId`,`reference`,`name`,`description`,`image`,`cost`) values 
(1,'MONT78999','Montaje de plano alto','Es montar el plano, pero arriba',NULL,'10.25'),
(2,'MT45555R','Montaje en plano bajo','El plano en bajo',NULL,'45.50'),
(3,'LM458888','Limpieza de cañerías','Se limpian cañerias como su nombre indica',NULL,'455.30'),
(6,'asd','dasda','asd',NULL,'12.00');

/*Table structure for table `cunit_line` */

DROP TABLE IF EXISTS `cunit_line`;

CREATE TABLE `cunit_line` (
  `cunitLineId` int(11) NOT NULL AUTO_INCREMENT,
  `cunitId` int(11) DEFAULT NULL,
  `line` int(11) DEFAULT NULL,
  `itemId` int(11) DEFAULT NULL,
  `unitId` int(11) DEFAULT NULL,
  `quantity` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`cunitLineId`),
  KEY `ref_cuniLine_cunit` (`cunitId`),
  KEY `ref_cunitLine_item` (`itemId`),
  KEY `ref_cunitLine_unit` (`unitId`),
  CONSTRAINT `ref_cuniLine_cunit` FOREIGN KEY (`cunitId`) REFERENCES `cunit` (`cunitId`),
  CONSTRAINT `ref_cunitLine_item` FOREIGN KEY (`itemId`) REFERENCES `item` (`itemId`),
  CONSTRAINT `ref_cunitLine_unit` FOREIGN KEY (`unitId`) REFERENCES `unit` (`unitId`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

/*Data for the table `cunit_line` */

insert  into `cunit_line`(`cunitLineId`,`cunitId`,`line`,`itemId`,`unitId`,`quantity`) values 
(7,2,10,1,1,'78.00'),
(8,2,NULL,1,1,'15.00'),
(9,1,1,2,1,'20.00'),
(10,1,2,1,1,'25.00'),
(11,3,1,1,1,'20.00');

/*Table structure for table `item` */

DROP TABLE IF EXISTS `item`;

CREATE TABLE `item` (
  `itemId` int(11) NOT NULL AUTO_INCREMENT,
  `reference` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `unitId` int(11) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`itemId`),
  KEY `ref_item_unit` (`unitId`),
  CONSTRAINT `ref_item_unit` FOREIGN KEY (`unitId`) REFERENCES `unit` (`unitId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `item` */

insert  into `item`(`itemId`,`reference`,`name`,`description`,`unitId`,`image`) values 
(1,'CFTT7889','Chapa de aluminio 33','Chapa por metros',1,NULL),
(2,'A7888','Poste 25m','Poste grande de narices',1,NULL);

/*Table structure for table `item_in` */

DROP TABLE IF EXISTS `item_in`;

CREATE TABLE `item_in` (
  `itemInId` int(11) NOT NULL AUTO_INCREMENT,
  `storeId` int(11) DEFAULT NULL,
  `dateIn` date DEFAULT NULL,
  `workerId` int(11) DEFAULT NULL,
  `comments` text,
  PRIMARY KEY (`itemInId`),
  KEY `ref_itemin_store` (`storeId`),
  KEY `ref_itemin_worker` (`workerId`),
  CONSTRAINT `ref_itemin_store` FOREIGN KEY (`storeId`) REFERENCES `store` (`storeId`),
  CONSTRAINT `ref_itemin_worker` FOREIGN KEY (`workerId`) REFERENCES `worker` (`workerId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `item_in` */

insert  into `item_in`(`itemInId`,`storeId`,`dateIn`,`workerId`,`comments`) values 
(1,1,'2016-01-01',11,'Esto es un comentario'),
(2,1,'2016-09-13',13,'Estas son las observaciones');

/*Table structure for table `item_in_line` */

DROP TABLE IF EXISTS `item_in_line`;

CREATE TABLE `item_in_line` (
  `itemInLineId` int(11) NOT NULL AUTO_INCREMENT,
  `itemInId` int(11) DEFAULT NULL,
  `itemId` int(11) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`itemInLineId`),
  KEY `ref_iteminline_item` (`itemId`),
  KEY `ref_iteminline_itemin` (`itemInId`),
  CONSTRAINT `ref_iteminline_item` FOREIGN KEY (`itemId`) REFERENCES `item` (`itemId`),
  CONSTRAINT `ref_iteminline_itemin` FOREIGN KEY (`itemInId`) REFERENCES `item_in` (`itemInId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `item_in_line` */

insert  into `item_in_line`(`itemInLineId`,`itemInId`,`itemId`,`quantity`) values 
(2,1,2,'2.00'),
(3,2,1,'2.00'),
(4,2,2,'10.00');

/*Table structure for table `item_out` */

DROP TABLE IF EXISTS `item_out`;

CREATE TABLE `item_out` (
  `itemOutId` int(11) NOT NULL AUTO_INCREMENT,
  `storeId` int(11) DEFAULT NULL,
  `pwId` int(11) DEFAULT NULL,
  `dateOut` date DEFAULT NULL,
  `workerId` int(11) DEFAULT NULL,
  `comments` text,
  PRIMARY KEY (`itemOutId`),
  KEY `ref_itemout_store` (`storeId`),
  KEY `ref_itemout_worker` (`workerId`),
  KEY `ref_itemout_pw` (`pwId`),
  CONSTRAINT `ref_itemout_pw` FOREIGN KEY (`pwId`) REFERENCES `pw` (`pwId`),
  CONSTRAINT `ref_itemout_store` FOREIGN KEY (`storeId`) REFERENCES `store` (`storeId`),
  CONSTRAINT `ref_itemout_worker` FOREIGN KEY (`workerId`) REFERENCES `worker` (`workerId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `item_out` */

/*Table structure for table `item_out_line` */

DROP TABLE IF EXISTS `item_out_line`;

CREATE TABLE `item_out_line` (
  `itemOutLineId` int(11) NOT NULL AUTO_INCREMENT,
  `itemOutId` int(11) DEFAULT NULL,
  `itemId` int(11) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`itemOutLineId`),
  KEY `ref_itemoutline_item` (`itemId`),
  KEY `ref_itemoutline_itemin` (`itemOutId`),
  CONSTRAINT `ref_itemoutline_item` FOREIGN KEY (`itemId`) REFERENCES `item` (`itemId`),
  CONSTRAINT `ref_itemoutline_itemin` FOREIGN KEY (`itemOutId`) REFERENCES `item_out` (`itemOutId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `item_out_line` */

/*Table structure for table `item_stock` */

DROP TABLE IF EXISTS `item_stock`;

CREATE TABLE `item_stock` (
  `itemStockId` int(11) NOT NULL AUTO_INCREMENT,
  `storeId` int(11) DEFAULT NULL,
  `itemId` int(11) DEFAULT NULL,
  `stock` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`itemStockId`),
  KEY `ref_stock_store` (`storeId`),
  KEY `ref_stock_item` (`itemId`),
  CONSTRAINT `ref_stock_item` FOREIGN KEY (`itemId`) REFERENCES `item` (`itemId`),
  CONSTRAINT `ref_stock_store` FOREIGN KEY (`storeId`) REFERENCES `store` (`storeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `item_stock` */

/*Table structure for table `pw` */

DROP TABLE IF EXISTS `pw`;

CREATE TABLE `pw` (
  `pwId` int(11) NOT NULL AUTO_INCREMENT,
  `statusId` int(11) DEFAULT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `initDate` date DEFAULT NULL,
  `initInCharge` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `defaultK` decimal(5,2) DEFAULT NULL,
  `total` decimal(12,2) DEFAULT NULL,
  `acepDate` date DEFAULT NULL,
  `acepInCharge` int(11) DEFAULT NULL,
  `acepRef` varchar(255) DEFAULT NULL,
  `finDate` date DEFAULT NULL,
  `finInCharge` int(11) DEFAULT NULL,
  `finRef` varchar(255) DEFAULT NULL,
  `cerDate` date DEFAULT NULL,
  `cerInCharge` int(11) DEFAULT NULL,
  `cerRef` varchar(255) DEFAULT NULL,
  `invDate` date DEFAULT NULL,
  `invInCharge` int(11) DEFAULT NULL,
  `invRef` varchar(255) DEFAULT NULL,
  `payDate` date DEFAULT NULL,
  `payInCharge` int(11) DEFAULT NULL,
  `payRef` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`pwId`),
  KEY `ref_pw_worker` (`initInCharge`),
  KEY `ref_pw_company` (`companyId`),
  KEY `ref_pw_status` (`statusId`),
  KEY `ref_pw_acep` (`acepInCharge`),
  KEY `ref_pw_fin` (`finInCharge`),
  KEY `ref_pw_inv` (`invInCharge`),
  KEY `ref_pw_pay` (`payInCharge`),
  KEY `ref_pw_cer` (`cerInCharge`),
  CONSTRAINT `ref_pw_acep` FOREIGN KEY (`acepInCharge`) REFERENCES `worker` (`workerId`),
  CONSTRAINT `ref_pw_cer` FOREIGN KEY (`cerInCharge`) REFERENCES `worker` (`workerId`),
  CONSTRAINT `ref_pw_company` FOREIGN KEY (`companyId`) REFERENCES `company` (`companyId`),
  CONSTRAINT `ref_pw_fin` FOREIGN KEY (`finInCharge`) REFERENCES `worker` (`workerId`),
  CONSTRAINT `ref_pw_inv` FOREIGN KEY (`invInCharge`) REFERENCES `worker` (`workerId`),
  CONSTRAINT `ref_pw_pay` FOREIGN KEY (`payInCharge`) REFERENCES `worker` (`workerId`),
  CONSTRAINT `ref_pw_status` FOREIGN KEY (`statusId`) REFERENCES `status` (`statusId`),
  CONSTRAINT `ref_pw_worker` FOREIGN KEY (`initInCharge`) REFERENCES `worker` (`workerId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

/*Data for the table `pw` */

insert  into `pw`(`pwId`,`statusId`,`reference`,`name`,`description`,`initDate`,`initInCharge`,`companyId`,`defaultK`,`total`,`acepDate`,`acepInCharge`,`acepRef`,`finDate`,`finInCharge`,`finRef`,`cerDate`,`cerInCharge`,`cerRef`,`invDate`,`invInCharge`,`invRef`,`payDate`,`payInCharge`,`payRef`) values 
(5,1,'4555','Limpia cañerias altas','Limpia cosas','2016-09-15',15,1,'1.50','2722.93','2016-09-07',15,'ASWSW','2016-09-15',15,'RTTT',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(6,0,'455878AJ','Montaje de catenaria 1/22',NULL,'2015-03-01',11,1,'1.00','255.00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(7,0,'E78899','Desdoble de las lineas altas en GOR aumentando el título hasta que pete a ver si lo consigo',NULL,'2016-09-10',14,1,'1.00','500.80',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(8,1,'RFD78885','Tendido en plano de cables para DONELA',NULL,'2016-09-01',11,1,'1.00','136.50','2016-09-30',11,'WSEER',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);

/*Table structure for table `pw_line` */

DROP TABLE IF EXISTS `pw_line`;

CREATE TABLE `pw_line` (
  `pwLineId` int(11) NOT NULL AUTO_INCREMENT,
  `pwId` int(11) DEFAULT NULL,
  `line` int(11) DEFAULT NULL,
  `cunitId` int(11) DEFAULT NULL,
  `cost` decimal(12,2) DEFAULT NULL,
  `quantity` decimal(5,2) DEFAULT NULL,
  `k` decimal(5,2) DEFAULT NULL,
  `amount` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`pwLineId`),
  KEY `ref_pwline_cunit` (`cunitId`),
  KEY `ref_pwline_pw` (`pwId`),
  CONSTRAINT `ref_pwline_cunit` FOREIGN KEY (`cunitId`) REFERENCES `cunit` (`cunitId`),
  CONSTRAINT `ref_pwline_pw` FOREIGN KEY (`pwId`) REFERENCES `pw` (`pwId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

/*Data for the table `pw_line` */

insert  into `pw_line`(`pwLineId`,`pwId`,`line`,`cunitId`,`cost`,`quantity`,`k`,`amount`) values 
(8,5,1,3,'455.30','1.00','1.00','455.30'),
(9,6,1,1,'10.25','16.00','1.00','164.00'),
(10,7,1,2,'45.50','20.00','1.00','90.10'),
(11,7,2,3,'455.30','30.00','1.00','455.30'),
(12,5,2,1,'10.25','1.00','1.50','15.38'),
(13,5,3,2,'45.50','33.00','1.50','2252.25'),
(14,8,1,2,'45.50','3.00','1.00','136.50'),
(15,6,NULL,2,'45.50','2.00','1.00','91.00');

/*Table structure for table `status` */

DROP TABLE IF EXISTS `status`;

CREATE TABLE `status` (
  `statusId` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`statusId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `status` */

insert  into `status`(`statusId`,`name`) values 
(0,'PRESUPUESTO'),
(1,'ACEPTADO'),
(2,'TERMINADO'),
(3,'CERTIFICADO'),
(4,'FACTURADO'),
(5,'PAGADO');

/*Table structure for table `store` */

DROP TABLE IF EXISTS `store`;

CREATE TABLE `store` (
  `storeId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`storeId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `store` */

insert  into `store`(`storeId`,`name`) values 
(1,'Almacén principal');

/*Table structure for table `unit` */

DROP TABLE IF EXISTS `unit`;

CREATE TABLE `unit` (
  `unitId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `abb` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`unitId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `unit` */

insert  into `unit`(`unitId`,`name`,`abb`) values 
(1,'metros','m'),
(2,'litros','l');

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `userGroupId` int(11) NOT NULL,
  `login` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `lang` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`userId`),
  KEY `rf_user_userGroup` (`userGroupId`),
  CONSTRAINT `rf_user_userGroup` FOREIGN KEY (`userGroupId`) REFERENCES `user_group` (`userGroupId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `user` */

insert  into `user`(`userId`,`name`,`userGroupId`,`login`,`password`,`lang`) values 
(1,'Administrador',1,'admin','admin','es');

/*Table structure for table `user_group` */

DROP TABLE IF EXISTS `user_group`;

CREATE TABLE `user_group` (
  `userGroupId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`userGroupId`)
) ENGINE=InnoDB AUTO_INCREMENT=159 DEFAULT CHARSET=utf8;

/*Data for the table `user_group` */

insert  into `user_group`(`userGroupId`,`name`) values 
(1,'Administradores'),
(158,'Primer grupo');

/*Table structure for table `wo` */

DROP TABLE IF EXISTS `wo`;

CREATE TABLE `wo` (
  `woId` int(11) NOT NULL AUTO_INCREMENT,
  `initDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `workerId` int(11) DEFAULT NULL,
  `pwId` int(11) DEFAULT NULL,
  `comments` text,
  PRIMARY KEY (`woId`),
  KEY `ref_wo_pw` (`pwId`),
  KEY `ref_wo_worker` (`workerId`),
  CONSTRAINT `ref_wo_pw` FOREIGN KEY (`pwId`) REFERENCES `pw` (`pwId`),
  CONSTRAINT `ref_wo_worker` FOREIGN KEY (`workerId`) REFERENCES `worker` (`workerId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

/*Data for the table `wo` */

insert  into `wo`(`woId`,`initDate`,`endDate`,`workerId`,`pwId`,`comments`) values 
(4,'2016-01-01','2016-01-30',13,5,'Tenemos comentarios'),
(7,'2016-09-17','2016-09-17',15,8,NULL);

/*Table structure for table `wo_line` */

DROP TABLE IF EXISTS `wo_line`;

CREATE TABLE `wo_line` (
  `woLineId` int(11) NOT NULL AUTO_INCREMENT,
  `woId` int(11) DEFAULT NULL,
  `cunitId` int(11) DEFAULT NULL,
  `estimate` decimal(5,2) DEFAULT NULL,
  `done` decimal(5,2) DEFAULT NULL,
  `quantity` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`woLineId`),
  KEY `ref_wol_wo` (`woId`),
  KEY `ref_wol_cunit` (`cunitId`),
  CONSTRAINT `ref_wol_cunit` FOREIGN KEY (`cunitId`) REFERENCES `cunit` (`cunitId`),
  CONSTRAINT `ref_wol_wo` FOREIGN KEY (`woId`) REFERENCES `wo` (`woId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

/*Data for the table `wo_line` */

insert  into `wo_line`(`woLineId`,`woId`,`cunitId`,`estimate`,`done`,`quantity`) values 
(9,4,1,'1.00','0.00','0.60'),
(11,4,2,'33.00','0.00','30.00'),
(13,7,2,'3.00','0.00','1.00'),
(14,7,2,'3.00','1.00','0.50');

/*Table structure for table `worker` */

DROP TABLE IF EXISTS `worker`;

CREATE TABLE `worker` (
  `workerId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `ssId` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `zip` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `code` int(11) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`workerId`),
  KEY `ref_user` (`userId`),
  CONSTRAINT `ref_user` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=214 DEFAULT CHARSET=utf8;

/*Data for the table `worker` */

insert  into `worker`(`workerId`,`name`,`ssId`,`address`,`zip`,`city`,`province`,`state`,`userId`,`phone`,`email`,`code`,`position`,`department`) values 
(11,'Juan Mer','4555','Calle Uruguay N.11 Oficina 101','46007','Valencia','Valencia','VAlencia',NULL,'668999','rafa@myariadna.com',33,'Cargo','Departa'),
(12,'name',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'position','department'),
(13,'CASTREJON, TOMAS                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,'ALMACENISTA','ADMINISTRACION CENTRALES'),
(14,'AGUILAR, VALENTINA                 ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,7,'ASISTENTE DE ALMACEN','ADMINISTRACION CENTRALES'),
(15,'DE LEON, DAYAN                     ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,236,'AYUDANTE GENERAL','ADMINISTRACION CENTRALES'),
(16,'MORAN, HERMOGENES                  ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,265,'AYUDANTE GENERAL','ADMINISTRACION CENTRALES'),
(17,'RODRIGUEZ, SIMON                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,32,'CAPATAZ','ADMINISTRACION CENTRALES'),
(18,'HERNANDEZ, DORIS                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,162,'OFICINISTA ADMINISTRATIVA','ADMINISTRACION CENTRALES'),
(19,'SALAZAR, KATHERINE                 ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,354,'TPR','ADMINISTRACION CENTRALES'),
(20,'TREJOS, HADAMEIBYS                 ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,363,'OFICINISTA ADMINISTRATIVA','ADMINISTRACION CENTRALES'),
(21,'CASTRO, FELICIA                    ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,168,'SUPERVISOR','ADMINISTRACION CENTRALES'),
(22,'ZAPATA, EVELYN                     ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,140,'ASISTENTE DE ALMACEN','ADMINISTRACION DAVID'),
(23,'MOJICA, ROSA                       ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,59,'ASISTENTE DE CONTABILIDAD','ADMINISTRACION DAVID'),
(24,'KUCHLER, CECILIA                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,213,'ASISTENTE DE CONTABILIDAD','ADMINISTRACION DAVID'),
(25,'GUTIERREZ, YASMINA                 ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,319,'ASISTENTE TECNICO','ADMINISTRACION DAVID'),
(26,'SANTAMARIA, EVELYN                 ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,164,'ENCARGADA DE COSTOS','ADMINISTRACION DAVID'),
(27,'PALACIOS, ARMANDO                  ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,56,'ENCARGADO','ADMINISTRACION DAVID'),
(28,'SAGEL, GASPAR                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,254,'ENCARGADO DE PROYETOS','ADMINISTRACION DAVID'),
(29,'CASTRO, OSVALDO                    ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,54,'GERENTE DE OPERACIONES','ADMINISTRACION DAVID'),
(30,'HOLDELN, WILLIAM                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,63,'GERENTE FINANCIERO','ADMINISTRACION DAVID'),
(31,'PITTI, YESSICA                     ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,221,'OFICINISTA ADMINISTRATIVA','ADMINISTRACION DAVID'),
(32,'JUSTAVINO, CARMEN                  ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,62,'RESPONSABLE DE ADMINISTRACION','ADMINISTRACION DAVID'),
(33,'CASTILLO, JOSEPH                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,163,'TPR','ADMINISTRACION DAVID'),
(34,'OROCU, CARLOS                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,47,'MANTENIMIENTO','ADMINISTRACION DAVID'),
(35,'CABALLERO, HIGINIO                 ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,336,'ASISTENTE DE ALMACEN','ADMINISTRACION DAVID'),
(36,'BEITIA, YAISETH                    ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,356,'ASISTENTE DE CONTABILIDAD','ADMINISTRACION DAVID'),
(37,'ANGUIZOLA, MEYLIN                  ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,365,'TPR','ADMINISTRACION DAVID'),
(38,'ORTIZ, ALVARO                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,20,'AYUDANTE GENERAL','DESARROLLO CENTRALES'),
(39,'TORRES, EDUARDO                    ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,21,'AYUDANTE GENERAL','DESARROLLO CENTRALES'),
(40,'LOPEZ, LUIS                        ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,27,'AYUDANTE GENERAL','DESARROLLO CENTRALES'),
(41,'ARROCHA, LUIS                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,158,'AYUDANTE GENERAL','DESARROLLO CENTRALES'),
(42,'VANEGA, ARQUIMEDES                 ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,167,'AYUDANTE GENERAL','DESARROLLO CENTRALES'),
(43,'MORAN, MARLON                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,171,'AYUDANTE GENERAL','DESARROLLO CENTRALES'),
(44,'ARROCHA, JUNIER                    ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,216,'AYUDANTE GENERAL','DESARROLLO CENTRALES'),
(45,'FRANCO, EUFRASINO                  ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,225,'AYUDANTE GENERAL','DESARROLLO CENTRALES'),
(46,'ARROCHA, KEVIN                     ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,227,'AYUDANTE GENERAL','DESARROLLO CENTRALES'),
(47,'MARCUCCI, PAULINO                  ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,232,'AYUDANTE GENERAL','DESARROLLO CENTRALES'),
(48,'FRANCO, ARMI                       ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,243,'AYUDANTE GENERAL','DESARROLLO CENTRALES'),
(49,'URRIOLA, RODOLFO                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,244,'AYUDANTE GENERAL','DESARROLLO CENTRALES'),
(50,'OSES, RICHARD                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,245,'AYUDANTE GENERAL','DESARROLLO CENTRALES'),
(51,'ARCIA, BELISARIO                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,247,'AYUDANTE GENERAL','DESARROLLO CENTRALES'),
(52,'GUEVARA, JOSE                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,248,'AYUDANTE GENERAL','DESARROLLO CENTRALES'),
(53,'VARGAS, JORGE                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,256,'AYUDANTE GENERAL','DESARROLLO CENTRALES'),
(54,'SIANCA, SALUSTIANO                 ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,267,'AYUDANTE GENERAL','DESARROLLO CENTRALES'),
(55,'GODOY, ARIEL                       ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,43,'CAPATAZ','DESARROLLO CENTRALES'),
(56,'ORTEGA, DIDIEL                     ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,211,'CAPATAZ','DESARROLLO CENTRALES'),
(57,'GONZALEZ, AMABLE                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,257,'CAPATAZ','DESARROLLO CENTRALES'),
(58,'GALIALE, EDILBERTO                 ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,194,'CONDUCTOR','DESARROLLO CENTRALES'),
(59,'RIOS, JOSE                         ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,'ENCARGADO','DESARROLLO CENTRALES'),
(60,'FLORES, JUAN                       ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,17,'LINIERO ELECTRICO','DESARROLLO CENTRALES'),
(61,'CARRION, JOSE                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,23,'LINIERO ELECTRICO','DESARROLLO CENTRALES'),
(62,'ADAMES, JORGE                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,26,'LINIERO ELECTRICO','DESARROLLO CENTRALES'),
(63,'SANCHEZ, MANUEL                    ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,91,'LINIERO ELECTRICO','DESARROLLO CENTRALES'),
(64,'ARCIA, MANUEL                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,161,'LINIERO ELECTRICO','DESARROLLO CENTRALES'),
(65,'GONZALEZ, MIGUEL                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,242,'LINIERO ELECTRICO','DESARROLLO CENTRALES'),
(66,'RODRIGUEZ, OSLEY                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,24,'LINIERO EN TENSION','DESARROLLO CENTRALES'),
(67,'MOLINA, FABIO                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,25,'LINIERO EN TENSION','DESARROLLO CENTRALES'),
(68,'CHIARI, RICARDO                    ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,169,'LINIERO EN TENSION','DESARROLLO CENTRALES'),
(69,'CRUZ, CIRILO                       ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,234,'LINIERO EN TENSION','DESARROLLO CENTRALES'),
(70,'OJO, DEYVIS                        ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,46,'MECANICO','DESARROLLO CENTRALES'),
(71,'APARICIO, HECTOR                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,146,'OPERADOR DE GRUA','DESARROLLO CENTRALES'),
(72,'BATISTA, ANIBAL                    ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,226,'OPERADOR DE GRUA','DESARROLLO CENTRALES'),
(73,'TREJOS, JOSE                       ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,238,'ALMACENISTA','DESARROLLO DAVID'),
(74,'GUTIERREZ, JOSE                    ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,55,'AYUDANTE GENERAL','DESARROLLO DAVID'),
(75,'MARIN, RODERICK                    ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,58,'AYUDANTE GENERAL','DESARROLLO DAVID'),
(76,'ATENCIO, MANUEL                    ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,60,'AYUDANTE GENERAL','DESARROLLO DAVID'),
(77,'GONZALEZ, FELIX                    ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,90,'AYUDANTE GENERAL','DESARROLLO DAVID'),
(78,'CASASOLA, DONNY                    ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,65,'CAPATAZ','DESARROLLO DAVID'),
(79,'SANTIAGO, OMAR                     ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,68,'CAPATAZ','DESARROLLO DAVID'),
(80,'CABALLERO, ALBERTO                 ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,219,'CONDUCTOR','DESARROLLO DAVID'),
(81,'CONTRERAS, NESTOR                  ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,78,'ELECTRICISTA','DESARROLLO DAVID'),
(82,'CHAVEZ, JOHN                       ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,61,'LINIERO ELECTRICO','DESARROLLO DAVID'),
(83,'GONZALEZ, MARVIN                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,64,'LINIERO ELECTRICO','DESARROLLO DAVID'),
(84,'CONCEPCION, EDWARD                 ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,67,'LINIERO ELECTRICO','DESARROLLO DAVID'),
(85,'SALDA',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,66,'LINIERO EN TENSION','DESARROLLO DAVID'),
(86,'HERNANDEZ, ANGEL                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,145,'LINIERO EN TENSION','DESARROLLO DAVID'),
(87,'RUBIO, SANTIAGO                    ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,170,'LINIERO EN TENSION','DESARROLLO DAVID'),
(88,'PIMENTEL, RAUL                     ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,53,'MECANICO','DESARROLLO DAVID'),
(89,'BOLA',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,69,'OPERADOR DE GRUA','DESARROLLO DAVID'),
(90,'GOMEZ, ELVIS                       ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,75,'OPERADOR DE GRUA','DESARROLLO DAVID'),
(91,'MONTES, MAYKOL                     ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,144,'OPERADOR DE GRUA','DESARROLLO DAVID'),
(92,'FUENTES, RODOLFO                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,266,'OPERADOR DE GRUA','DESARROLLO DAVID'),
(93,'MIRANDA, ONESIMO                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,349,'OPERADOR DE GRUA','DESARROLLO DAVID'),
(94,'BATISTA, OCTAVIO                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,202,'ASISTENTE TECNICO','MEDIDORES CENTRALES'),
(95,'MONTENEGRO, DANIEL                 ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,222,'AYUDANTE GENERAL','MEDIDORES CENTRALES'),
(96,'INDUNI, CESAR                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,192,'CAPATAZ','MEDIDORES CENTRALES'),
(97,'GONZALEZ, ERIK                     ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,174,'ELECTRICISTA','MEDIDORES CENTRALES'),
(98,'REYES, MANUEL                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,175,'ELECTRICISTA','MEDIDORES CENTRALES'),
(99,'SANCHEZ, RONIS                     ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,177,'ELECTRICISTA','MEDIDORES CENTRALES'),
(100,'DE LEON, JEAN                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,179,'ELECTRICISTA','MEDIDORES CENTRALES'),
(101,'CARVAJAL, JUAN                     ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,180,'ELECTRICISTA','MEDIDORES CENTRALES'),
(102,'GONZALEZ, SERGIO                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,181,'ELECTRICISTA','MEDIDORES CENTRALES'),
(103,'GONZALEZ, FRANCISCO                ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,184,'ELECTRICISTA','MEDIDORES CENTRALES'),
(104,'MONTENEGRO, ALBERTH                ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,185,'ELECTRICISTA','MEDIDORES CENTRALES'),
(105,'CORDOBA, APARICIO                  ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,186,'ELECTRICISTA','MEDIDORES CENTRALES'),
(106,'NU',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,188,'ELECTRICISTA','MEDIDORES CENTRALES'),
(107,'MORENO, MELQUIADES                 ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,190,'ELECTRICISTA','MEDIDORES CENTRALES'),
(108,'BERNAL, ABELARDO                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,191,'ELECTRICISTA','MEDIDORES CENTRALES'),
(109,'MONTENEGRO, NEHEMIAS               ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,195,'ELECTRICISTA','MEDIDORES CENTRALES'),
(110,'MARTINEZ, HERNAN                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,196,'ELECTRICISTA','MEDIDORES CENTRALES'),
(111,'DE LEON, JOSE                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,197,'ELECTRICISTA','MEDIDORES CENTRALES'),
(112,'PEREZ, JHONNY                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,198,'ELECTRICISTA','MEDIDORES CENTRALES'),
(113,'SALDA',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,199,'ELECTRICISTA','MEDIDORES CENTRALES'),
(114,'CALDERON, AGUSTIN                  ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,200,'ELECTRICISTA','MEDIDORES CENTRALES'),
(115,'LOPEZ, SAMUEL                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,201,'ELECTRICISTA','MEDIDORES CENTRALES'),
(116,'BATISTA, LUIS                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,203,'ELECTRICISTA','MEDIDORES CENTRALES'),
(117,'HERNANDEZ, MARLON                  ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,204,'ELECTRICISTA','MEDIDORES CENTRALES'),
(118,'RODRIGUEZ, LEOPOLDO                ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,205,'ELECTRICISTA','MEDIDORES CENTRALES'),
(119,'RODRIGUEZ, YOVANY                  ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,206,'ELECTRICISTA','MEDIDORES CENTRALES'),
(120,'CASTILLO, LUIS                     ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,207,'ELECTRICISTA','MEDIDORES CENTRALES'),
(121,'CORTES, JERMAINE                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,208,'ELECTRICISTA','MEDIDORES CENTRALES'),
(122,'ARROYO, YONY                       ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,210,'ELECTRICISTA','MEDIDORES CENTRALES'),
(123,'GUDI',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,212,'ELECTRICISTA','MEDIDORES CENTRALES'),
(124,'VARELA, ARMANDO                    ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,215,'ELECTRICISTA','MEDIDORES CENTRALES'),
(125,'DE LEON, ROBERTO                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,217,'ELECTRICISTA','MEDIDORES CENTRALES'),
(126,'CIANCA, LUIS                       ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,235,'ELECTRICISTA','MEDIDORES CENTRALES'),
(127,'MARTINEZ, PRAXCEDEZ                ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,268,'ELECTRICISTA','MEDIDORES CENTRALES'),
(128,'MEDINA, JESUS                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,311,'ELECTRICISTA','MEDIDORES CENTRALES'),
(129,'BARRAGAN, JUSTO                    ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,321,'ELECTRICISTA','MEDIDORES CENTRALES'),
(130,'DEAGO, IRMA                        ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,189,'OFICINISTA ADMINISTRATIVA','MEDIDORES CENTRALES'),
(131,'VILLARREAL, ISAIAS                 ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,233,'OPERADOR DE GRUA','MEDIDORES CENTRALES'),
(132,'GOMEZ, FELIX                       ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,359,'ELECTRICISTA','MEDIDORES CENTRALES'),
(133,'NAVARRO, MARCOS                    ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,360,'CONDUCTOR','MEDIDORES CENTRALES'),
(134,'MORENO, ARIEL                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,361,'ELECTRICISTA','MEDIDORES CENTRALES'),
(135,'RUIZ, RODRIGO                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,362,'OPERADOR DE GRUA','MEDIDORES CENTRALES'),
(136,'RODRIGUEZ, ARNALDO                 ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,269,'CONDUCTOR','MEDIDORES CENTRALES '),
(137,'RODRIGUEZ, KARINA                  ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,114,'ELECTRICISTA','MEDIDORES DAVID'),
(138,'MOJICA, SAMUEL                     ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,48,'AYUDANTE GENERAL','MEDIDORES DAVID'),
(139,'MONTEZUMA, RODRIGO                 ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,249,'AYUDANTE GENERAL','MEDIDORES DAVID'),
(140,'ROVIRA, AZAEL                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,77,'ELECTRICISTA','MEDIDORES DAVID'),
(141,'GONZALEZ, GABINO                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,108,'ELECTRICISTA','MEDIDORES DAVID'),
(142,'ARAUZ, ERICK                       ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,109,'ELECTRICISTA','MEDIDORES DAVID'),
(143,'NAVARRO, ERIC                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,112,'ELECTRICISTA','MEDIDORES DAVID'),
(144,'URIBE, JOSE                        ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,113,'ELECTRICISTA','MEDIDORES DAVID'),
(145,'CABALLERO, GENARO                  ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,115,'ELECTRICISTA','MEDIDORES DAVID'),
(146,'NU',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,117,'ELECTRICISTA','MEDIDORES DAVID'),
(147,'GUERRA, YELSIN                     ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,118,'ELECTRICISTA','MEDIDORES DAVID'),
(148,'JARA, JAIRO                        ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,121,'ELECTRICISTA','MEDIDORES DAVID'),
(149,'CAPARROSO, JOSE                    ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,122,'ELECTRICISTA','MEDIDORES DAVID'),
(150,'FULLER, BENIGNO                    ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,124,'ELECTRICISTA','MEDIDORES DAVID'),
(151,'SANCHEZ, MARCELINO                 ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,125,'ELECTRICISTA','MEDIDORES DAVID'),
(152,'ATENCIO, RORI                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,126,'ELECTRICISTA','MEDIDORES DAVID'),
(153,'ORTIZ, RICARDO                     ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,136,'ELECTRICISTA','MEDIDORES DAVID'),
(154,'AVILA, GILBERTO                    ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,137,'ELECTRICISTA','MEDIDORES DAVID'),
(155,'MONTENEGRO, ABEL                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,141,'ELECTRICISTA','MEDIDORES DAVID'),
(156,'ROSAS, HELMOND                     ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,142,'ELECTRICISTA','MEDIDORES DAVID'),
(157,'ESPINOZA, JOHANA                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,152,'ELECTRICISTA','MEDIDORES DAVID'),
(158,'MEDINA, JOSE                       ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,153,'ELECTRICISTA','MEDIDORES DAVID'),
(159,'GONZALEZ, POMPILIO                 ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,241,'ELECTRICISTA','MEDIDORES DAVID'),
(160,'LESCURE, YIBELIS                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,308,'ELECTRICISTA','MEDIDORES DAVID'),
(161,'BEITIA, KEVIN                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,320,'ELECTRICISTA','MEDIDORES DAVID'),
(162,'MONTES, RODERICK                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,80,'ENCARGADO','MEDIDORES DAVID'),
(163,'QUINTERO, NORMAN                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,123,'OPERADOR DE GRUA','MEDIDORES DAVID'),
(164,'TAPIA, XAVIER                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,337,'ELECTRICISTA','MEDIDORES DAVID'),
(165,'MONTENEGRO, JULIAN                 ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,352,'ELECTRICISTA','MEDIDORES DAVID'),
(166,'ARAUZ, JOSUE                       ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,353,'ELECTRICISTA','MEDIDORES DAVID'),
(167,'SALDA',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,364,'ELECTRICISTA','MEDIDORES DAVID'),
(168,'RUIZ, RICARDO                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,358,'AYUDANTE GENERAL','OER  DAVID'),
(169,'MACIAS, JOSE                       ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,228,'PERFORADORES','OER CENTRALES'),
(170,'MACIAS, MANUEL                     ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,229,'PERFORADORES','OER CENTRALES'),
(171,'PALMA, JOSE                        ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,230,'PERFORADORES','OER CENTRALES'),
(172,'VICTORIA, EDGARDO                  ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,231,'PERFORADORES','OER CENTRALES'),
(173,'DEL LA CRUZ, ALVIN                 ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,338,'LINIERO ELECTRICO','OER CHORRERA'),
(174,'MURILLO, GUILLERMO                 ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,339,'LINIERO ELECTRICO','OER CHORRERA'),
(175,'VALDERRAMA, ISAI                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,341,'LINIERO ELECTRICO','OER CHORRERA'),
(176,'FRIAS, ELIAS                       ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,342,'LINIERO ELECTRICO','OER CHORRERA'),
(177,'SANTANA, GEORGE                    ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,343,'LINIERO EN TENSION','OER CHORRERA'),
(178,'CAMARGO, MIGUEL                    ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,345,'LINIERO EN TENSION','OER CHORRERA'),
(179,'SEGUNDO, ISMAEL                    ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,346,'LINIERO EN TENSION','OER CHORRERA'),
(180,'GRACIA, YENISBEL                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,347,'SUPERVISOR','OER CHORRERA'),
(181,'BERNAL, LORENZO                    ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,351,'CAPATAZ','OER CHORRERA'),
(182,'CAMARENA, GISSELL                  ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,224,'AYUDANTE GENERAL','OER DAVID'),
(183,'SANTAMARIA, DEIKER                 ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,264,'AYUDANTE GENERAL','OER DAVID'),
(184,'CASTRELLON, ALBIN                  ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,322,'AYUDANTE GENERAL','OER DAVID'),
(185,'ZARATE, HECTOR                     ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,250,'LINIERO ELECTRICO','OER DAVID'),
(186,'BOZZI, JOSE                        ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,251,'LINIERO ELECTRICO','OER DAVID'),
(187,'POLANCO, MARCELINO                 ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,252,'LINIERO ELECTRICO','OER DAVID'),
(188,'BODAN, ALFONSO                     ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,253,'LINIERO ELECTRICO','OER DAVID'),
(189,'QUINTERO, SAMUEL                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,83,'AYUDANTE GENERAL','OER DAVID'),
(190,'VEGA, ISRAEL                       ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,94,'AYUDANTE GENERAL','OER DAVID'),
(191,'BIRMINGHAN, JOSE                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,104,'AYUDANTE GENERAL','OER DAVID'),
(192,'PRADO, ROBINSON                    ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,239,'AYUDANTE GENERAL','OER DAVID'),
(193,'LIZONDRO, EDISON                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,262,'AYUDANTE GENERAL','OER DAVID'),
(194,'CASTILLO, LUIS                     ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,312,'AYUDANTE GENERAL','OER DAVID'),
(195,'GONZALEZ, JEAN                     ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,313,'AYUDANTE GENERAL','OER DAVID'),
(196,'VIQUEZ, ABDIEL                     ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,323,'AYUDANTE GENERAL','OER DAVID'),
(197,'ROBINSON, MAXWELL                  ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,120,'ELECTRICISTA','OER DAVID'),
(198,'TORREZ, JORGE   H                  ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,73,'ENCARGADO','OER DAVID'),
(199,'GONZALEZ, KEVIN                    ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,107,'LINIERO ELECTRICO','OER DAVID'),
(200,'ORTEGA, YORLINIS                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,255,'LINIERO ELECTRICO','OER DAVID'),
(201,'ESPINOZA, JOSE                     ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,309,'AYUDANTE GENERAL','OER DAVID'),
(202,'FRANCECHIS, JOSE                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,148,'AYUDANTE GENERAL','OER DAVID'),
(203,'GANTES, ARIEL                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,173,'AYUDANTE GENERAL','OER DAVID'),
(204,'JURADO, JEAN                       ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,223,'AYUDANTE GENERAL','OER DAVID'),
(205,'PINEDA, GRABIEL                    ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,160,'CONDUCTOR','OER DAVID'),
(206,'NASH, ROBERTO                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,128,'LINIERO ELECTRICO','OER DAVID'),
(207,'CERRACIN, ALVARO                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,348,'AYUDANTE GENERAL','OER DAVID'),
(208,'LOPEZ, MANUEL                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,350,'CAPATAZ','OER DAVID'),
(209,'IBARRA, ROGER                      ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,355,'AYUDANTE GENERAL','OER DAVID'),
(210,'MARTINEZ, JAVIER                   ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,357,'AYUDANTE GENERAL','OER DAVID'),
(211,'GONZALEZ, JONNATHAN                ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,159,'AYUDANTE GENERAL','TALLER DAVID'),
(212,'MU',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,52,'SOLDADOR','TALLER DAVID'),
(213,'ANGULO, CARLOS                     ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,240,'SOLDADOR','TALLER DAVID');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
