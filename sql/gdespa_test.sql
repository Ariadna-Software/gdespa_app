/*
SQLyog Community v12.2.4 (64 bit)
MySQL - 5.6.16 : Database - gdespa_test
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
USE `gdespa_test`;

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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

/*Data for the table `api_key` */

insert  into `api_key`(`apiKeyId`,`userId`,`getDateTime`,`expireDateTime`,`apiKey`) values (-99,-99,'2001-01-01 00:00:00','2100-01-01 00:00:00','*TS*KEY');

/*Table structure for table `import` */

DROP TABLE IF EXISTS `import`;

CREATE TABLE `import` (
  `code` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `import` */

insert  into `import`(`code`,`name`,`position`,`department`) values (0,'name','position','department');
insert  into `import`(`code`,`name`,`position`,`department`) values (2,'CASTREJON, TOMAS                   ','ALMACENISTA','ADMINISTRACION CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (7,'AGUILAR, VALENTINA                 ','ASISTENTE DE ALMACEN','ADMINISTRACION CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (236,'DE LEON, DAYAN                     ','AYUDANTE GENERAL','ADMINISTRACION CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (265,'MORAN, HERMOGENES                  ','AYUDANTE GENERAL','ADMINISTRACION CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (32,'RODRIGUEZ, SIMON                   ','CAPATAZ','ADMINISTRACION CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (162,'HERNANDEZ, DORIS                   ','OFICINISTA ADMINISTRATIVA','ADMINISTRACION CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (354,'SALAZAR, KATHERINE                 ','TPR','ADMINISTRACION CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (363,'TREJOS, HADAMEIBYS                 ','OFICINISTA ADMINISTRATIVA','ADMINISTRACION CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (168,'CASTRO, FELICIA                    ','SUPERVISOR','ADMINISTRACION CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (140,'ZAPATA, EVELYN                     ','ASISTENTE DE ALMACEN','ADMINISTRACION DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (59,'MOJICA, ROSA                       ','ASISTENTE DE CONTABILIDAD','ADMINISTRACION DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (213,'KUCHLER, CECILIA                   ','ASISTENTE DE CONTABILIDAD','ADMINISTRACION DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (319,'GUTIERREZ, YASMINA                 ','ASISTENTE TECNICO','ADMINISTRACION DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (164,'SANTAMARIA, EVELYN                 ','ENCARGADA DE COSTOS','ADMINISTRACION DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (56,'PALACIOS, ARMANDO                  ','ENCARGADO','ADMINISTRACION DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (254,'SAGEL, GASPAR                      ','ENCARGADO DE PROYETOS','ADMINISTRACION DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (54,'CASTRO, OSVALDO                    ','GERENTE DE OPERACIONES','ADMINISTRACION DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (63,'HOLDELN, WILLIAM                   ','GERENTE FINANCIERO','ADMINISTRACION DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (221,'PITTI, YESSICA                     ','OFICINISTA ADMINISTRATIVA','ADMINISTRACION DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (62,'JUSTAVINO, CARMEN                  ','RESPONSABLE DE ADMINISTRACION','ADMINISTRACION DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (163,'CASTILLO, JOSEPH                   ','TPR','ADMINISTRACION DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (47,'OROCU, CARLOS                      ','MANTENIMIENTO','ADMINISTRACION DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (336,'CABALLERO, HIGINIO                 ','ASISTENTE DE ALMACEN','ADMINISTRACION DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (356,'BEITIA, YAISETH                    ','ASISTENTE DE CONTABILIDAD','ADMINISTRACION DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (365,'ANGUIZOLA, MEYLIN                  ','TPR','ADMINISTRACION DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (20,'ORTIZ, ALVARO                      ','AYUDANTE GENERAL','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (21,'TORRES, EDUARDO                    ','AYUDANTE GENERAL','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (27,'LOPEZ, LUIS                        ','AYUDANTE GENERAL','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (158,'ARROCHA, LUIS                      ','AYUDANTE GENERAL','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (167,'VANEGA, ARQUIMEDES                 ','AYUDANTE GENERAL','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (171,'MORAN, MARLON                      ','AYUDANTE GENERAL','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (216,'ARROCHA, JUNIER                    ','AYUDANTE GENERAL','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (225,'FRANCO, EUFRASINO                  ','AYUDANTE GENERAL','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (227,'ARROCHA, KEVIN                     ','AYUDANTE GENERAL','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (232,'MARCUCCI, PAULINO                  ','AYUDANTE GENERAL','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (243,'FRANCO, ARMI                       ','AYUDANTE GENERAL','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (244,'URRIOLA, RODOLFO                   ','AYUDANTE GENERAL','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (245,'OSES, RICHARD                      ','AYUDANTE GENERAL','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (247,'ARCIA, BELISARIO                   ','AYUDANTE GENERAL','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (248,'GUEVARA, JOSE                      ','AYUDANTE GENERAL','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (256,'VARGAS, JORGE                      ','AYUDANTE GENERAL','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (267,'SIANCA, SALUSTIANO                 ','AYUDANTE GENERAL','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (43,'GODOY, ARIEL                       ','CAPATAZ','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (211,'ORTEGA, DIDIEL                     ','CAPATAZ','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (257,'GONZALEZ, AMABLE                   ','CAPATAZ','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (194,'GALIALE, EDILBERTO                 ','CONDUCTOR','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (9,'RIOS, JOSE                         ','ENCARGADO','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (17,'FLORES, JUAN                       ','LINIERO ELECTRICO','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (23,'CARRION, JOSE                      ','LINIERO ELECTRICO','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (26,'ADAMES, JORGE                      ','LINIERO ELECTRICO','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (91,'SANCHEZ, MANUEL                    ','LINIERO ELECTRICO','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (161,'ARCIA, MANUEL                      ','LINIERO ELECTRICO','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (242,'GONZALEZ, MIGUEL                   ','LINIERO ELECTRICO','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (24,'RODRIGUEZ, OSLEY                   ','LINIERO EN TENSION','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (25,'MOLINA, FABIO                      ','LINIERO EN TENSION','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (169,'CHIARI, RICARDO                    ','LINIERO EN TENSION','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (234,'CRUZ, CIRILO                       ','LINIERO EN TENSION','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (46,'OJO, DEYVIS                        ','MECANICO','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (146,'APARICIO, HECTOR                   ','OPERADOR DE GRUA','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (226,'BATISTA, ANIBAL                    ','OPERADOR DE GRUA','DESARROLLO CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (238,'TREJOS, JOSE                       ','ALMACENISTA','DESARROLLO DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (55,'GUTIERREZ, JOSE                    ','AYUDANTE GENERAL','DESARROLLO DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (58,'MARIN, RODERICK                    ','AYUDANTE GENERAL','DESARROLLO DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (60,'ATENCIO, MANUEL                    ','AYUDANTE GENERAL','DESARROLLO DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (90,'GONZALEZ, FELIX                    ','AYUDANTE GENERAL','DESARROLLO DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (65,'CASASOLA, DONNY                    ','CAPATAZ','DESARROLLO DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (68,'SANTIAGO, OMAR                     ','CAPATAZ','DESARROLLO DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (219,'CABALLERO, ALBERTO                 ','CONDUCTOR','DESARROLLO DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (78,'CONTRERAS, NESTOR                  ','ELECTRICISTA','DESARROLLO DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (61,'CHAVEZ, JOHN                       ','LINIERO ELECTRICO','DESARROLLO DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (64,'GONZALEZ, MARVIN                   ','LINIERO ELECTRICO','DESARROLLO DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (67,'CONCEPCION, EDWARD                 ','LINIERO ELECTRICO','DESARROLLO DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (66,'SALDA','LINIERO EN TENSION','DESARROLLO DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (145,'HERNANDEZ, ANGEL                   ','LINIERO EN TENSION','DESARROLLO DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (170,'RUBIO, SANTIAGO                    ','LINIERO EN TENSION','DESARROLLO DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (53,'PIMENTEL, RAUL                     ','MECANICO','DESARROLLO DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (69,'BOLA','OPERADOR DE GRUA','DESARROLLO DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (75,'GOMEZ, ELVIS                       ','OPERADOR DE GRUA','DESARROLLO DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (144,'MONTES, MAYKOL                     ','OPERADOR DE GRUA','DESARROLLO DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (266,'FUENTES, RODOLFO                   ','OPERADOR DE GRUA','DESARROLLO DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (349,'MIRANDA, ONESIMO                   ','OPERADOR DE GRUA','DESARROLLO DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (202,'BATISTA, OCTAVIO                   ','ASISTENTE TECNICO','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (222,'MONTENEGRO, DANIEL                 ','AYUDANTE GENERAL','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (192,'INDUNI, CESAR                      ','CAPATAZ','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (174,'GONZALEZ, ERIK                     ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (175,'REYES, MANUEL                      ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (177,'SANCHEZ, RONIS                     ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (179,'DE LEON, JEAN                      ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (180,'CARVAJAL, JUAN                     ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (181,'GONZALEZ, SERGIO                   ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (184,'GONZALEZ, FRANCISCO                ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (185,'MONTENEGRO, ALBERTH                ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (186,'CORDOBA, APARICIO                  ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (188,'NU','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (190,'MORENO, MELQUIADES                 ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (191,'BERNAL, ABELARDO                   ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (195,'MONTENEGRO, NEHEMIAS               ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (196,'MARTINEZ, HERNAN                   ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (197,'DE LEON, JOSE                      ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (198,'PEREZ, JHONNY                      ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (199,'SALDA','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (200,'CALDERON, AGUSTIN                  ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (201,'LOPEZ, SAMUEL                      ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (203,'BATISTA, LUIS                      ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (204,'HERNANDEZ, MARLON                  ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (205,'RODRIGUEZ, LEOPOLDO                ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (206,'RODRIGUEZ, YOVANY                  ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (207,'CASTILLO, LUIS                     ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (208,'CORTES, JERMAINE                   ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (210,'ARROYO, YONY                       ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (212,'GUDI','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (215,'VARELA, ARMANDO                    ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (217,'DE LEON, ROBERTO                   ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (235,'CIANCA, LUIS                       ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (268,'MARTINEZ, PRAXCEDEZ                ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (311,'MEDINA, JESUS                      ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (321,'BARRAGAN, JUSTO                    ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (189,'DEAGO, IRMA                        ','OFICINISTA ADMINISTRATIVA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (233,'VILLARREAL, ISAIAS                 ','OPERADOR DE GRUA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (359,'GOMEZ, FELIX                       ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (360,'NAVARRO, MARCOS                    ','CONDUCTOR','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (361,'MORENO, ARIEL                      ','ELECTRICISTA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (362,'RUIZ, RODRIGO                      ','OPERADOR DE GRUA','MEDIDORES CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (269,'RODRIGUEZ, ARNALDO                 ','CONDUCTOR','MEDIDORES CENTRALES ');
insert  into `import`(`code`,`name`,`position`,`department`) values (114,'RODRIGUEZ, KARINA                  ','ELECTRICISTA','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (48,'MOJICA, SAMUEL                     ','AYUDANTE GENERAL','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (249,'MONTEZUMA, RODRIGO                 ','AYUDANTE GENERAL','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (77,'ROVIRA, AZAEL                      ','ELECTRICISTA','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (108,'GONZALEZ, GABINO                   ','ELECTRICISTA','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (109,'ARAUZ, ERICK                       ','ELECTRICISTA','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (112,'NAVARRO, ERIC                      ','ELECTRICISTA','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (113,'URIBE, JOSE                        ','ELECTRICISTA','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (115,'CABALLERO, GENARO                  ','ELECTRICISTA','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (117,'NU','ELECTRICISTA','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (118,'GUERRA, YELSIN                     ','ELECTRICISTA','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (121,'JARA, JAIRO                        ','ELECTRICISTA','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (122,'CAPARROSO, JOSE                    ','ELECTRICISTA','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (124,'FULLER, BENIGNO                    ','ELECTRICISTA','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (125,'SANCHEZ, MARCELINO                 ','ELECTRICISTA','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (126,'ATENCIO, RORI                      ','ELECTRICISTA','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (136,'ORTIZ, RICARDO                     ','ELECTRICISTA','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (137,'AVILA, GILBERTO                    ','ELECTRICISTA','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (141,'MONTENEGRO, ABEL                   ','ELECTRICISTA','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (142,'ROSAS, HELMOND                     ','ELECTRICISTA','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (152,'ESPINOZA, JOHANA                   ','ELECTRICISTA','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (153,'MEDINA, JOSE                       ','ELECTRICISTA','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (241,'GONZALEZ, POMPILIO                 ','ELECTRICISTA','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (308,'LESCURE, YIBELIS                   ','ELECTRICISTA','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (320,'BEITIA, KEVIN                      ','ELECTRICISTA','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (80,'MONTES, RODERICK                   ','ENCARGADO','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (123,'QUINTERO, NORMAN                   ','OPERADOR DE GRUA','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (337,'TAPIA, XAVIER                      ','ELECTRICISTA','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (352,'MONTENEGRO, JULIAN                 ','ELECTRICISTA','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (353,'ARAUZ, JOSUE                       ','ELECTRICISTA','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (364,'SALDA','ELECTRICISTA','MEDIDORES DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (358,'RUIZ, RICARDO                      ','AYUDANTE GENERAL','OER  DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (228,'MACIAS, JOSE                       ','PERFORADORES','OER CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (229,'MACIAS, MANUEL                     ','PERFORADORES','OER CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (230,'PALMA, JOSE                        ','PERFORADORES','OER CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (231,'VICTORIA, EDGARDO                  ','PERFORADORES','OER CENTRALES');
insert  into `import`(`code`,`name`,`position`,`department`) values (338,'DEL LA CRUZ, ALVIN                 ','LINIERO ELECTRICO','OER CHORRERA');
insert  into `import`(`code`,`name`,`position`,`department`) values (339,'MURILLO, GUILLERMO                 ','LINIERO ELECTRICO','OER CHORRERA');
insert  into `import`(`code`,`name`,`position`,`department`) values (341,'VALDERRAMA, ISAI                   ','LINIERO ELECTRICO','OER CHORRERA');
insert  into `import`(`code`,`name`,`position`,`department`) values (342,'FRIAS, ELIAS                       ','LINIERO ELECTRICO','OER CHORRERA');
insert  into `import`(`code`,`name`,`position`,`department`) values (343,'SANTANA, GEORGE                    ','LINIERO EN TENSION','OER CHORRERA');
insert  into `import`(`code`,`name`,`position`,`department`) values (345,'CAMARGO, MIGUEL                    ','LINIERO EN TENSION','OER CHORRERA');
insert  into `import`(`code`,`name`,`position`,`department`) values (346,'SEGUNDO, ISMAEL                    ','LINIERO EN TENSION','OER CHORRERA');
insert  into `import`(`code`,`name`,`position`,`department`) values (347,'GRACIA, YENISBEL                   ','SUPERVISOR','OER CHORRERA');
insert  into `import`(`code`,`name`,`position`,`department`) values (351,'BERNAL, LORENZO                    ','CAPATAZ','OER CHORRERA');
insert  into `import`(`code`,`name`,`position`,`department`) values (224,'CAMARENA, GISSELL                  ','AYUDANTE GENERAL','OER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (264,'SANTAMARIA, DEIKER                 ','AYUDANTE GENERAL','OER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (322,'CASTRELLON, ALBIN                  ','AYUDANTE GENERAL','OER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (250,'ZARATE, HECTOR                     ','LINIERO ELECTRICO','OER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (251,'BOZZI, JOSE                        ','LINIERO ELECTRICO','OER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (252,'POLANCO, MARCELINO                 ','LINIERO ELECTRICO','OER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (253,'BODAN, ALFONSO                     ','LINIERO ELECTRICO','OER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (83,'QUINTERO, SAMUEL                   ','AYUDANTE GENERAL','OER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (94,'VEGA, ISRAEL                       ','AYUDANTE GENERAL','OER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (104,'BIRMINGHAN, JOSE                   ','AYUDANTE GENERAL','OER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (239,'PRADO, ROBINSON                    ','AYUDANTE GENERAL','OER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (262,'LIZONDRO, EDISON                   ','AYUDANTE GENERAL','OER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (312,'CASTILLO, LUIS                     ','AYUDANTE GENERAL','OER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (313,'GONZALEZ, JEAN                     ','AYUDANTE GENERAL','OER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (323,'VIQUEZ, ABDIEL                     ','AYUDANTE GENERAL','OER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (120,'ROBINSON, MAXWELL                  ','ELECTRICISTA','OER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (73,'TORREZ, JORGE   H                  ','ENCARGADO','OER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (107,'GONZALEZ, KEVIN                    ','LINIERO ELECTRICO','OER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (255,'ORTEGA, YORLINIS                   ','LINIERO ELECTRICO','OER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (309,'ESPINOZA, JOSE                     ','AYUDANTE GENERAL','OER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (148,'FRANCECHIS, JOSE                   ','AYUDANTE GENERAL','OER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (173,'GANTES, ARIEL                      ','AYUDANTE GENERAL','OER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (223,'JURADO, JEAN                       ','AYUDANTE GENERAL','OER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (160,'PINEDA, GRABIEL                    ','CONDUCTOR','OER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (128,'NASH, ROBERTO                      ','LINIERO ELECTRICO','OER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (348,'CERRACIN, ALVARO                   ','AYUDANTE GENERAL','OER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (350,'LOPEZ, MANUEL                      ','CAPATAZ','OER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (355,'IBARRA, ROGER                      ','AYUDANTE GENERAL','OER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (357,'MARTINEZ, JAVIER                   ','AYUDANTE GENERAL','OER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (159,'GONZALEZ, JONNATHAN                ','AYUDANTE GENERAL','TALLER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (52,'MU','SOLDADOR','TALLER DAVID');
insert  into `import`(`code`,`name`,`position`,`department`) values (240,'ANGULO, CARLOS                     ','SOLDADOR','TALLER DAVID');

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
) ENGINE=InnoDB AUTO_INCREMENT=153 DEFAULT CHARSET=utf8;

/*Data for the table `user` */

insert  into `user`(`userId`,`name`,`userGroupId`,`login`,`password`,`lang`) values (-99,'*TS*USER1',-99,'login','password','es');

/*Table structure for table `user_group` */

DROP TABLE IF EXISTS `user_group`;

CREATE TABLE `user_group` (
  `userGroupId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`userGroupId`)
) ENGINE=InnoDB AUTO_INCREMENT=131 DEFAULT CHARSET=utf8;

/*Data for the table `user_group` */

insert  into `user_group`(`userGroupId`,`name`) values (-99,'*TS*GROUP');

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
) ENGINE=InnoDB AUTO_INCREMENT=256 DEFAULT CHARSET=utf8;

/*Data for the table `worker` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
