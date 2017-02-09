/*
SQLyog Community v12.3.3 (64 bit)
MySQL - 5.7.14-log : Database - gdespa
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
) ENGINE=InnoDB AUTO_INCREMENT=740 DEFAULT CHARSET=utf8;

/*Table structure for table `closure` */

DROP TABLE IF EXISTS `closure`;

CREATE TABLE `closure` (
  `closureId` int(11) NOT NULL AUTO_INCREMENT,
  `closureDate` date DEFAULT NULL,
  `workerId` int(11) DEFAULT NULL,
  `comments` text,
  `close` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`closureId`),
  KEY `ref_closure_worker` (`workerId`),
  CONSTRAINT `ref_closure_worker` FOREIGN KEY (`workerId`) REFERENCES `worker` (`workerId`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8;

/*Table structure for table `closure_line` */

DROP TABLE IF EXISTS `closure_line`;

CREATE TABLE `closure_line` (
  `closureLineId` int(11) NOT NULL AUTO_INCREMENT,
  `closureId` int(11) DEFAULT NULL,
  `pwId` int(11) DEFAULT NULL,
  `estimate` decimal(5,2) DEFAULT NULL,
  `done` decimal(5,2) DEFAULT NULL,
  `amount` decimal(12,2) DEFAULT NULL,
  `lastClosure` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`closureLineId`),
  KEY `ref_closline_closure` (`closureId`),
  KEY `ref_closline_pw` (`pwId`),
  CONSTRAINT `ref_closline_closure` FOREIGN KEY (`closureId`) REFERENCES `closure` (`closureId`) ON DELETE CASCADE,
  CONSTRAINT `ref_closline_pw` FOREIGN KEY (`pwId`) REFERENCES `pw` (`pwId`)
) ENGINE=InnoDB AUTO_INCREMENT=857 DEFAULT CHARSET=utf8;

/*Table structure for table `company` */

DROP TABLE IF EXISTS `company`;

CREATE TABLE `company` (
  `companyId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`companyId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Table structure for table `cunit` */

DROP TABLE IF EXISTS `cunit`;

CREATE TABLE `cunit` (
  `cunitId` int(11) NOT NULL AUTO_INCREMENT,
  `reference` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `cost` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`cunitId`),
  UNIQUE KEY `idx_ref` (`reference`)
) ENGINE=InnoDB AUTO_INCREMENT=17354 DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB AUTO_INCREMENT=10584 DEFAULT CHARSET=utf8;

/*Table structure for table `delivery` */

DROP TABLE IF EXISTS `delivery`;

CREATE TABLE `delivery` (
  `deliveryId` int(11) NOT NULL AUTO_INCREMENT,
  `pwId` int(11) DEFAULT NULL,
  `lastDate` date DEFAULT NULL,
  `workerId` int(11) DEFAULT NULL,
  `storeId` int(11) DEFAULT NULL,
  `comments` text,
  PRIMARY KEY (`deliveryId`),
  KEY `ref_dly_pw` (`pwId`),
  KEY `ref_dly_worker` (`workerId`),
  KEY `ref_dly_store` (`storeId`),
  CONSTRAINT `ref_dly_pw` FOREIGN KEY (`pwId`) REFERENCES `pw` (`pwId`),
  CONSTRAINT `ref_dly_store` FOREIGN KEY (`storeId`) REFERENCES `store` (`storeId`),
  CONSTRAINT `ref_dly_worker` FOREIGN KEY (`workerId`) REFERENCES `worker` (`workerId`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=latin1;

/*Table structure for table `delivery_line` */

DROP TABLE IF EXISTS `delivery_line`;

CREATE TABLE `delivery_line` (
  `deliveryLineId` int(11) NOT NULL AUTO_INCREMENT,
  `deliveryId` int(11) DEFAULT NULL,
  `itemId` int(11) DEFAULT NULL,
  `estimate` decimal(10,2) DEFAULT NULL,
  `done` decimal(10,2) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`deliveryLineId`),
  KEY `ref_dlyl_dly` (`deliveryId`),
  KEY `ref_dlyl_item` (`itemId`),
  CONSTRAINT `ref_dlyl_dly` FOREIGN KEY (`deliveryId`) REFERENCES `delivery` (`deliveryId`) ON DELETE CASCADE,
  CONSTRAINT `ref_dlyl_item` FOREIGN KEY (`itemId`) REFERENCES `item` (`itemId`)
) ENGINE=InnoDB AUTO_INCREMENT=3100 DEFAULT CHARSET=latin1;

/*Table structure for table `inv_david` */

DROP TABLE IF EXISTS `inv_david`;

CREATE TABLE `inv_david` (
  `reference` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `quantity` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`reference`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `inventory` */

DROP TABLE IF EXISTS `inventory`;

CREATE TABLE `inventory` (
  `inventoryId` int(11) NOT NULL AUTO_INCREMENT,
  `inventoryDate` date DEFAULT NULL,
  `storeId` int(11) DEFAULT NULL,
  `workerId` int(11) DEFAULT NULL,
  `comments` text,
  `close` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`inventoryId`),
  KEY `ref_inv_store` (`storeId`),
  KEY `ref_inv_worker` (`workerId`),
  CONSTRAINT `ref_inv_store` FOREIGN KEY (`storeId`) REFERENCES `store` (`storeId`),
  CONSTRAINT `ref_inv_worker` FOREIGN KEY (`workerId`) REFERENCES `worker` (`workerId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

/*Table structure for table `inventory_line` */

DROP TABLE IF EXISTS `inventory_line`;

CREATE TABLE `inventory_line` (
  `inventoryLineId` int(11) NOT NULL AUTO_INCREMENT,
  `inventoryId` int(11) DEFAULT NULL,
  `itemId` int(11) DEFAULT NULL,
  `oldStock` decimal(10,2) DEFAULT NULL,
  `newStock` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`inventoryLineId`),
  KEY `ref_invl_inv` (`inventoryId`),
  KEY `ref_invl_item` (`itemId`),
  CONSTRAINT `ref_invl_inv` FOREIGN KEY (`inventoryId`) REFERENCES `inventory` (`inventoryId`) ON DELETE CASCADE,
  CONSTRAINT `ref_invl_item` FOREIGN KEY (`itemId`) REFERENCES `item` (`itemId`)
) ENGINE=InnoDB AUTO_INCREMENT=1192 DEFAULT CHARSET=latin1;

/*Table structure for table `item` */

DROP TABLE IF EXISTS `item`;

CREATE TABLE `item` (
  `itemId` int(11) NOT NULL AUTO_INCREMENT,
  `reference` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `unitId` int(11) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `ownItem` tinyint(1) DEFAULT NULL,
  `minStock` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`itemId`),
  UNIQUE KEY `idx_ref` (`reference`),
  KEY `ref_item_unit` (`unitId`),
  CONSTRAINT `ref_item_unit` FOREIGN KEY (`unitId`) REFERENCES `unit` (`unitId`)
) ENGINE=InnoDB AUTO_INCREMENT=43496 DEFAULT CHARSET=utf8;

/*Table structure for table `item_in` */

DROP TABLE IF EXISTS `item_in`;

CREATE TABLE `item_in` (
  `itemInId` int(11) NOT NULL AUTO_INCREMENT,
  `storeId` int(11) DEFAULT NULL,
  `dateIn` date DEFAULT NULL,
  `workerId` int(11) DEFAULT NULL,
  `comments` text,
  `deliveryNote` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`itemInId`),
  KEY `ref_itemin_store` (`storeId`),
  KEY `ref_itemin_worker` (`workerId`),
  CONSTRAINT `ref_itemin_store` FOREIGN KEY (`storeId`) REFERENCES `store` (`storeId`),
  CONSTRAINT `ref_itemin_worker` FOREIGN KEY (`workerId`) REFERENCES `worker` (`workerId`)
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=utf8;

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
  CONSTRAINT `ref_iteminline_itemin` FOREIGN KEY (`itemInId`) REFERENCES `item_in` (`itemInId`) ON DELETE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=558 DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB AUTO_INCREMENT=268 DEFAULT CHARSET=utf8;

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
  CONSTRAINT `ref_itemoutline_itemin` FOREIGN KEY (`itemOutId`) REFERENCES `item_out` (`itemOutId`) ON DELETE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2874 DEFAULT CHARSET=utf8;

/*Table structure for table `item_stock` */

DROP TABLE IF EXISTS `item_stock`;

CREATE TABLE `item_stock` (
  `itemStockId` int(11) NOT NULL AUTO_INCREMENT,
  `storeId` int(11) DEFAULT NULL,
  `itemId` int(11) DEFAULT NULL,
  `stock` decimal(12,2) DEFAULT NULL,
  `lastInvDate` date DEFAULT NULL,
  `lastInvId` int(11) DEFAULT NULL,
  `lastStock` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`itemStockId`),
  UNIQUE KEY `idx_stock_store_item` (`storeId`,`itemId`),
  KEY `ref_stock_store` (`storeId`),
  KEY `ref_stock_item` (`itemId`),
  KEY `ref_stock_inv` (`lastInvId`),
  CONSTRAINT `ref_stock_inv` FOREIGN KEY (`lastInvId`) REFERENCES `inventory` (`inventoryId`),
  CONSTRAINT `ref_stock_item` FOREIGN KEY (`itemId`) REFERENCES `item` (`itemId`),
  CONSTRAINT `ref_stock_store` FOREIGN KEY (`storeId`) REFERENCES `store` (`storeId`)
) ENGINE=InnoDB AUTO_INCREMENT=426 DEFAULT CHARSET=utf8;

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
  `zoneId` int(11) DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `mainK` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`pwId`),
  UNIQUE KEY `idx_refernce` (`reference`),
  KEY `ref_pw_worker` (`initInCharge`),
  KEY `ref_pw_company` (`companyId`),
  KEY `ref_pw_status` (`statusId`),
  KEY `ref_pw_acep` (`acepInCharge`),
  KEY `ref_pw_fin` (`finInCharge`),
  KEY `ref_pw_inv` (`invInCharge`),
  KEY `ref_pw_pay` (`payInCharge`),
  KEY `ref_pw_cer` (`cerInCharge`),
  KEY `ref_pw_zone` (`zoneId`),
  CONSTRAINT `ref_pw_acep` FOREIGN KEY (`acepInCharge`) REFERENCES `worker` (`workerId`),
  CONSTRAINT `ref_pw_cer` FOREIGN KEY (`cerInCharge`) REFERENCES `worker` (`workerId`),
  CONSTRAINT `ref_pw_company` FOREIGN KEY (`companyId`) REFERENCES `company` (`companyId`),
  CONSTRAINT `ref_pw_fin` FOREIGN KEY (`finInCharge`) REFERENCES `worker` (`workerId`),
  CONSTRAINT `ref_pw_inv` FOREIGN KEY (`invInCharge`) REFERENCES `worker` (`workerId`),
  CONSTRAINT `ref_pw_pay` FOREIGN KEY (`payInCharge`) REFERENCES `worker` (`workerId`),
  CONSTRAINT `ref_pw_status` FOREIGN KEY (`statusId`) REFERENCES `status` (`statusId`),
  CONSTRAINT `ref_pw_worker` FOREIGN KEY (`initInCharge`) REFERENCES `worker` (`workerId`),
  CONSTRAINT `ref_pw_zone` FOREIGN KEY (`zoneId`) REFERENCES `zone` (`zoneId`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8;

/*Table structure for table `pw_line` */

DROP TABLE IF EXISTS `pw_line`;

CREATE TABLE `pw_line` (
  `pwLineId` int(11) NOT NULL AUTO_INCREMENT,
  `pwId` int(11) DEFAULT NULL,
  `line` decimal(4,1) DEFAULT NULL,
  `cunitId` int(11) DEFAULT NULL,
  `cost` decimal(12,2) DEFAULT NULL,
  `quantity` decimal(6,2) DEFAULT NULL,
  `k` decimal(5,2) DEFAULT NULL,
  `amount` decimal(12,2) DEFAULT NULL,
  `comments` text,
  PRIMARY KEY (`pwLineId`),
  KEY `ref_pwline_cunit` (`cunitId`),
  KEY `ref_pwline_pw` (`pwId`),
  CONSTRAINT `ref_pwline_cunit` FOREIGN KEY (`cunitId`) REFERENCES `cunit` (`cunitId`),
  CONSTRAINT `ref_pwline_pw` FOREIGN KEY (`pwId`) REFERENCES `pw` (`pwId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2667 DEFAULT CHARSET=utf8;

/*Table structure for table `pw_worker` */

DROP TABLE IF EXISTS `pw_worker`;

CREATE TABLE `pw_worker` (
  `pwWorkerId` int(11) NOT NULL AUTO_INCREMENT,
  `pwId` int(11) DEFAULT NULL,
  `workerId` int(11) DEFAULT NULL,
  PRIMARY KEY (`pwWorkerId`),
  KEY `ref_pww_pw` (`pwId`),
  KEY `ref_pww_worker` (`workerId`),
  CONSTRAINT `ref_pww_pw` FOREIGN KEY (`pwId`) REFERENCES `pw` (`pwId`) ON DELETE CASCADE,
  CONSTRAINT `ref_pww_worker` FOREIGN KEY (`workerId`) REFERENCES `worker` (`workerId`) ON DELETE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;

/*Table structure for table `status` */

DROP TABLE IF EXISTS `status`;

CREATE TABLE `status` (
  `statusId` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`statusId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `store` */

DROP TABLE IF EXISTS `store`;

CREATE TABLE `store` (
  `storeId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `zoneId` int(11) DEFAULT NULL,
  PRIMARY KEY (`storeId`),
  KEY `store_zone` (`zoneId`),
  CONSTRAINT `store_zone` FOREIGN KEY (`zoneId`) REFERENCES `zone` (`zoneId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Table structure for table `ucc_prices` */

DROP TABLE IF EXISTS `ucc_prices`;

CREATE TABLE `ucc_prices` (
  `reference` varchar(11) NOT NULL,
  `name` varchar(94) NOT NULL,
  `price` varchar(12) DEFAULT NULL,
  `price2` varchar(13) NOT NULL,
  `FIELD5` bit(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `unit` */

DROP TABLE IF EXISTS `unit`;

CREATE TABLE `unit` (
  `unitId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `abb` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`unitId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `userGroupId` int(11) NOT NULL,
  `login` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `lang` varchar(255) DEFAULT NULL,
  `perAdm` tinyint(1) DEFAULT NULL,
  `perGes` tinyint(1) DEFAULT NULL,
  `perStore` tinyint(1) DEFAULT NULL,
  `perReport` tinyint(1) DEFAULT '0',
  `pwGeneral` tinyint(1) DEFAULT '0',
  `woGeneral` tinyint(1) DEFAULT '0',
  `closureGeneral` tinyint(1) DEFAULT '0',
  `deliveryGeneral` tinyint(1) DEFAULT '0',
  `itemInGeneral` tinyint(1) DEFAULT '0',
  `itemOutGeneral` tinyint(1) DEFAULT '0',
  `inventoryGeneral` tinyint(1) DEFAULT '0',
  `modPw` tinyint(1) DEFAULT '0',
  `seeNotOwner` tinyint(1) DEFAULT '0',
  `modWoClosed` tinyint(1) DEFAULT '0',
  `seeZone` tinyint(1) DEFAULT '0',
  `zoneId` int(11) DEFAULT NULL,
  `workOnlyZone` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`userId`),
  KEY `rf_user_userGroup` (`userGroupId`),
  KEY `rf_user_zone` (`zoneId`),
  CONSTRAINT `rf_user_userGroup` FOREIGN KEY (`userGroupId`) REFERENCES `user_group` (`userGroupId`),
  CONSTRAINT `rf_user_zone` FOREIGN KEY (`zoneId`) REFERENCES `zone` (`zoneId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

/*Table structure for table `user_group` */

DROP TABLE IF EXISTS `user_group`;

CREATE TABLE `user_group` (
  `userGroupId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`userGroupId`)
) ENGINE=InnoDB AUTO_INCREMENT=164 DEFAULT CHARSET=utf8;

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
  PRIMARY KEY (`woId`),
  KEY `ref_wo_pw` (`pwId`),
  KEY `ref_wo_worker` (`workerId`),
  KEY `ref_wo_closure` (`closureId`),
  CONSTRAINT `ref_wo_closure` FOREIGN KEY (`closureId`) REFERENCES `closure` (`closureId`),
  CONSTRAINT `ref_wo_pw` FOREIGN KEY (`pwId`) REFERENCES `pw` (`pwId`),
  CONSTRAINT `ref_wo_worker` FOREIGN KEY (`workerId`) REFERENCES `worker` (`workerId`)
) ENGINE=InnoDB AUTO_INCREMENT=165 DEFAULT CHARSET=utf8;

/*Table structure for table `wo_line` */

DROP TABLE IF EXISTS `wo_line`;

CREATE TABLE `wo_line` (
  `woLineId` int(11) NOT NULL AUTO_INCREMENT,
  `woId` int(11) DEFAULT NULL,
  `cunitId` int(11) DEFAULT NULL,
  `estimate` decimal(6,2) DEFAULT NULL,
  `done` decimal(6,2) DEFAULT NULL,
  `quantity` decimal(6,2) DEFAULT NULL,
  PRIMARY KEY (`woLineId`),
  KEY `ref_wol_wo` (`woId`),
  KEY `ref_wol_cunit` (`cunitId`),
  CONSTRAINT `ref_wol_cunit` FOREIGN KEY (`cunitId`) REFERENCES `cunit` (`cunitId`),
  CONSTRAINT `ref_wol_wo` FOREIGN KEY (`woId`) REFERENCES `wo` (`woId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8238 DEFAULT CHARSET=utf8;

/*Table structure for table `wo_worker` */

DROP TABLE IF EXISTS `wo_worker`;

CREATE TABLE `wo_worker` (
  `woWorkerId` int(11) NOT NULL AUTO_INCREMENT,
  `woId` int(11) DEFAULT NULL,
  `workerId` int(11) DEFAULT NULL,
  `quantity` decimal(5,2) DEFAULT '0.00',
  `cost` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`woWorkerId`),
  KEY `ref_wow_wo` (`woId`),
  KEY `ref_wow_worker` (`workerId`),
  CONSTRAINT `ref_wow_wo` FOREIGN KEY (`woId`) REFERENCES `wo` (`woId`) ON DELETE CASCADE,
  CONSTRAINT `ref_wow_worker` FOREIGN KEY (`workerId`) REFERENCES `worker` (`workerId`) ON DELETE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=599 DEFAULT CHARSET=latin1;

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
  `bloodType` varchar(255) DEFAULT NULL,
  `cost` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`workerId`),
  KEY `ref_user` (`userId`),
  CONSTRAINT `ref_user` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=237 DEFAULT CHARSET=utf8;

/*Table structure for table `zone` */

DROP TABLE IF EXISTS `zone`;

CREATE TABLE `zone` (
  `zoneId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`zoneId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
