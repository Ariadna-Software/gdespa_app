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

/*Table structure for table `parameters` */

DROP TABLE IF EXISTS `parameters`;

CREATE TABLE `parameters` (
  `parameterId` int(11) NOT NULL,
  `nEHD` decimal(7,4) DEFAULT NULL COMMENT 'Hora extra diurna en dia normal',
  `nEHN` decimal(7,4) DEFAULT NULL COMMENT 'Hora extra nocturna en dia normal',
  `neEHD` decimal(7,4) DEFAULT NULL COMMENT 'Hora extra diurna en dia normal en exceso',
  `neEHN` decimal(7,4) DEFAULT NULL COMMENT 'Hora extra nocturna en dia normal en exceso',
  `sNH` decimal(7,4) DEFAULT NULL COMMENT 'Hora normal en domingo / descanso',
  `sEHD` decimal(7,4) DEFAULT NULL COMMENT 'Hora extra diurna en festivo',
  `sEHN` decimal(7,4) DEFAULT NULL COMMENT 'Hora extra nocturna en domingo',
  `seEHD` decimal(7,4) DEFAULT NULL COMMENT 'Hora extra diurna en domingo y exceso',
  `seEHN` decimal(7,4) DEFAULT NULL COMMENT 'Hora extra nocturna en domingo y exceso',
  `hNH` decimal(7,4) DEFAULT NULL COMMENT 'Hora normal en feriado',
  `hEHD` decimal(7,4) DEFAULT NULL COMMENT 'Hora extra diurna en feriado',
  `hEHN` decimal(7,4) DEFAULT NULL COMMENT 'Hora extra nocturna en feriado',
  `heEHD` decimal(7,4) DEFAULT NULL COMMENT 'Hora extra diurna en exceso feriado',
  `heEHN` decimal(7,4) DEFAULT NULL COMMENT 'Hora extra nocturna en exceso feriado',
  PRIMARY KEY (`parameterId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `parameters` */

insert  into `parameters`(`parameterId`,`nEHD`,`nEHN`,`neEHD`,`neEHN`,`sNH`,`sEHD`,`sEHN`,`seEHD`,`seEHN`,`hNH`,`hEHD`,`hEHN`,`heEHD`,`heEHN`) values (0,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
