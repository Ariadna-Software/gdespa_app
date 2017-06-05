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

/*Table structure for table `carga_medidores` */

DROP TABLE IF EXISTS `carga_medidores`;

CREATE TABLE `carga_medidores` (
  `codigo` VARCHAR(255) NOT NULL,
  `nombre` VARCHAR(255) NOT NULL,
  `coste` DECIMAL(10,2) NOT NULL
) ENGINE=INNODB DEFAULT CHARSET=latin1;

/*Data for the table `carga_medidores` */

INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('1.1','Corte en Socket',3.69);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('1.2','Colocación de aparatos y enganche suministro Eventual baja tensión',10.08);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('1.3','Corte en Poste',6.05);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('1.4','Corte suministro Eventual sin aparatos baja tensión',6.05);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('1.5','Desconexión por Baja de Suministro',3.69);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('1.6','Orden de Retiro de Acometida',7.02);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('1.7','Reconexión en Poste',6.05);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('1.8','Reconexión en socket',3.69);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('1.9','Retirada de acometida y/o equipo de medida',7.02);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('2.1','Cambio de Medidor',3.72);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('2.2','Colocación de medidor',3.72);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('2.3','Insp. instal. serv. ind. Med.Indirecta',30.24);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('2.4','Insp. instal. serv. indiv. B.T',10.08);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('2.5','Inspección por anólisis de circuito',6.37);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('2.6','Levantamiento medidor baja tensión para verificación',3.72);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('2.7','Otras acciones en suministros',9.25);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('2.8','Reclamaciones por exceso de consumo Baja Tensión',6.18);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('2.9','Reclamaciones por inconvenientes con el Nivel de Tensión',6.18);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('2.1','Reclamaciones por mal funcionamiento del medidor',6.18);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('2.11','Reclamaciones por otras causas',6.18);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('2.12','Reubicación de acometida y/o equipo de medida',10.08);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('2.13','Rev. Sum. con Consumo Cero. Campaóa',9.25);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('2.14','Rev. Sum. con Med. Desconocido. Campaóa',9.25);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('2.15','Rev. Sum. Sin Sello Terminal. Campaóa',9.25);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('2.16','Rev. Sum. y Verif. Medidores Obsoletos. Campaóa',9.25);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('2.17','Rev. Suministro y Verificación  Medidor. Campaóas',9.25);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('2.18','Revisión a suministros atendidos por la BOL',9.25);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('2.19','Revisión de Suministro',9.25);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('2.2','Revisión de suministro. Campaóas',9.25);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('2.21','Revisión de suministro. Laboratorio',9.25);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('2.22','Revisión del Medidor',9.25);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('2.23','Revision factor de potencia',9.25);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('2.24','Revisión por Bolsa de Energóa. Campaóa',9.25);
INSERT  INTO `carga_medidores`(`codigo`,`nombre`,`coste`) VALUES ('2.25','Verificación de medidor',9.25);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;


INSERT INTO mea (reference, `name`, cost)
SELECT codigo, nombre, coste
FROM carga_medidores;