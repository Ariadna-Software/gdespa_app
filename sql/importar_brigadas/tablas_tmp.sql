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

/*Table structure for table `brme_centrales` */

DROP TABLE IF EXISTS `brme_centrales`;

CREATE TABLE `brme_centrales` (
  `codigo` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `zona` varchar(255) NOT NULL,
  `brigada` varchar(255) DEFAULT NULL,
  `coste` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `brme_centrales` */

insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (191,'ABELARDO BERNAL M','Medidiores Centrales','Bernal',4.53);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (200,'AGUSTIN CALDERON','Medidiores Centrales','Batista',4.28);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (185,'ALBERTH MONTENEGRO','Medidiores Centrales','Alberth',4.53);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (464,'ARCENIO ALVEO','Medidiores Centrales','Cortes',4.28);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (361,'ARIEL HUMBERTO MORENO R','Medidiores Centrales','Gudióo',4.28);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (269,'ARNALDO ANDRES RODRIGUEZ','Medidiores Centrales','Ronis',4.28);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (413,'CARLOS DEL ROSARIO','Medidiores Centrales','Canasta Centrales',4.53);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (192,'CESAR INDUNI','Medidiores Centrales','Administración',5.58);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (222,'DANIEL MONTENEGRO','Medidiores Centrales','Administración',5.58);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (174,'ERICK GONZALEZ','Medidiores Centrales','Erick',4.53);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (432,'ERNAM MARTINEZ','Medidiores Centrales','Ernan',4.53);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (359,'FELIX RICAUTE GOMEZ','Medidiores Centrales','Ernan',4.28);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (184,'FRANCISCO GONZALEZ','Medidiores Centrales','Francisco',4.53);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (459,'HECTOR NUóEZ','Medidiores Centrales','Hector',4.53);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (189,'IRMA DEAGO','Medidiores Centrales','Administración',4.53);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (462,'JERMAINE CORTES','Medidiores Centrales','Cortes',4.53);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (458,'JESUS MEDINA','Medidiores Centrales','Medina',4.53);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (198,'JHONNY PEREZ','Medidiores Centrales','Jhonny',4.53);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (210,'JOHNNY ARROYO','Medidiores Centrales','Jhonny A.',4.28);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (197,'JOSE DE LEON','Medidiores Centrales','Administración',5.58);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (469,'JOSE LORENZO MARTINES','Medidiores Centrales','Lorenzo',4.28);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (999,'JOSE LUIS LUGO','Medidiores Centrales','Administración',4.28);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (180,'JUAN CARVAJAL','Medidiores Centrales','Bernal',4.28);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (465,'JUAN JOSE AQUILAR','Medidiores Centrales','Hector',4.28);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (392,'JULIO REYES','Medidiores Centrales','Reyes',4.28);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (321,'JUSTO BARRAGAN QUEZADA','Medidiores Centrales','Saldaóa',4.28);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (205,'LEOPOLDO RODRIGUEZ','Medidiores Centrales','Leopoldo',4.53);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (235,'LUIS ALBERTO CIANCA','Medidiores Centrales','Alberth',4.28);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (207,'LUIS ARIEL CASTILLO','Medidiores Centrales','Castillo',4.53);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (203,'LUIS BATISTA','Medidiores Centrales','Batista',4.53);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (175,'MANUEL REYES','Medidiores Centrales','Reyes',4.53);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (204,'MARLON HERNANDEZ','Medidiores Centrales','Leopoldo',4.28);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (190,'MILQUIADES OMAR MORENO','Medidiores Centrales','Jhonny',4.28);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (195,'NEHEMIAS MONTENEGRO','Medidiores Centrales','Octavio',4.28);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (202,'OCTAVIO LUIS BATISTA','Medidiores Centrales','Octavio',4.53);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (463,'OMAR OLIVARES','Medidiores Centrales','Medina',4.28);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (212,'PEDRO GUDIóO','Medidiores Centrales','Gudióo',4.53);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (268,'PRAXCEDES MARTINEZ','Medidiores Centrales','Erick',4.28);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (199,'RICARDO SALDAóA','Medidiores Centrales','Saldaóa',4.53);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (217,'ROBERTO DE LEON BARRIA','Medidiores Centrales','Francisco',4.28);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (362,'RODRIGO ROLANDO RUIZ','Medidiores Centrales','Canasta Centrales',4.53);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (177,'RONIS SANCHEZ','Medidiores Centrales','Ronis',4.53);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (449,'SABDIEL MADRID','Medidiores Centrales','Jhonny A.',4.28);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (201,'SAMUEL LOPEZ','Medidiores Centrales','Samuel',4.53);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (181,'SERGIO GONZALEZ','Medidiores Centrales','Samuel',4.28);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (467,'TEOFILO MORROY','Medidiores Centrales','Lorenzo',4.28);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (408,'VICTOR MANUEL DE LEON','Medidiores Centrales','Canasta Centrales',4.28);
insert  into `brme_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (206,'YOVANNY RODRIGUEZ','Medidiores Centrales','Castillo',4.28);

/*Table structure for table `brme_david` */

DROP TABLE IF EXISTS `brme_david`;

CREATE TABLE `brme_david` (
  `codigo` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `zona` varchar(255) NOT NULL,
  `brigada` varchar(255) DEFAULT NULL,
  `coste` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `brme_david` */

insert  into `brme_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (80,'RODERICK MONTES','Chiriqui','Desconocida',10.46);
insert  into `brme_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (152,'JOHANA ESPINOZA','Chiriqui','Desconocida',4.53);
insert  into `brme_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (142,'HELMONT ROSAS','Chiriqui','Rosas',4.53);
insert  into `brme_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (109,'ERICK ARAUZ','Chiriqui','Rosas',4.28);
insert  into `brme_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (112,'ERICK NAVARRO','Chiriqui','Navarro',4.53);
insert  into `brme_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (470,'CESAR ARAUZ','Chiriqui','Navarro',4.28);
insert  into `brme_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (153,'JOSE MEDINA','Chiriqui','Medina',4.53);
insert  into `brme_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (308,'YIBELLIS LESCURE','Chiriqui','Medina',4.28);
insert  into `brme_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (113,'JOSE URIBE','Chiriqui','Uribe',4.53);
insert  into `brme_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (393,'JOSE PEREZ','Chiriqui','Uribe',4.28);
insert  into `brme_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (121,'JAIRO JARA','Chiriqui','Jara',4.53);
insert  into `brme_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (118,'YELSIN GUERRA','Chiriqui','Jara',4.28);
insert  into `brme_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (122,'JOSE CAPARROSO','Chiriqui','Caparroso',4.53);
insert  into `brme_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (352,'JULIAN MONTENEGRO','Chiriqui','Caparroso',4.28);
insert  into `brme_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (117,'JESUS NUñEZ','Chiriqui','Nuñez',4.53);
insert  into `brme_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (249,'RODRIGO MONTEZUMA','Chiriqui','Nuñez',4.28);
insert  into `brme_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (108,'GABINO GONZALEZ','Chiriqui','Gabino',4.53);
insert  into `brme_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (115,'GENARO CABALLERO','Chiriqui','Gabino',4.28);
insert  into `brme_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (126,'RORY ATENCIO','Chiriqui','Rory',4.53);
insert  into `brme_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (337,'XAVIER TAPIA','Chiriqui','Rory',4.28);
insert  into `brme_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (124,'BENIGNO FULLER','Chiriqui','Benigno',4.53);
insert  into `brme_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (353,'JOSSUE ARAUZ','Chiriqui','Benigno',4.28);
insert  into `brme_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (141,'ABEL MONTENEGRO','Chiriqui','Abel',4.53);
insert  into `brme_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (125,'MARCELINO SANCHEZ','Chiriqui','Abel',4.28);
insert  into `brme_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (77,'AZEL ROVIRA','Chiriqui','Canasta Chiriqui',4.53);
insert  into `brme_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (123,'NORMAN QUINTERO','Chiriqui','Canasta Chiriqui',4.88);

/*Table structure for table `brnr_centrales` */

DROP TABLE IF EXISTS `brnr_centrales`;

CREATE TABLE `brnr_centrales` (
  `codigo` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `zona` varchar(255) NOT NULL,
  `brigada` varchar(255) NOT NULL,
  `coste` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `brnr_centrales` */

insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (32,'RODRIGUEZ, SIMON','Centrales','Administracion',9.76);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (396,'AGUILAR, VALENTINA','Centrales','Almacen',5.58);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (168,'CASTRO, FELICIA','Centrales','Administracion',5.58);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (428,'CRUZ, GUILLERMO','Centrales','Administracion',4.53);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (426,'MARIN, LESBIA','Centrales','Almacen',5.58);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (43,'GODOY, ARIEL','Centrales','Administracion',10.46);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (354,'SALAZAR, KATHERINE','Centrales','Administracion',8.37);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (407,'QUINTERO, JUAN','Centrales','Almacen',4.28);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (415,'DE LORA, CARLOS','Centrales','Almacen',4.28);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (146,'APARICIO, HECTOR','Centrales','Osley',5.23);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (27,'LOPEZ, LUIS','Centrales','Osley',6.27);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (25,'MOLINA, FABIO','Centrales','Osley',6.97);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (24,'RODRIGUEZ, OSLEY','Centrales','Osley',7.67);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (91,'SANCHEZ, MANUEL','Centrales','Osley',4.53);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (26,'ADAMES, JORGE','Centrales','Adames',6.27);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (23,'CARRION, JOSE','Centrales','Adames',6.97);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (17,'FLORES, JUAN','Centrales','Adames',6.27);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (194,'GALIALE, EDILBERTO','Centrales','Adames',4.88);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (257,'GONZALEZ, AMABLE','Centrales','Amable',5.23);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (242,'GONZALEZ, MIGUEL','Centrales','Amable',4.88);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (232,'MARCUCCI, PAULINO','Centrales','Amable',4.28);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (231,'VICTORIA, EDGARDO','Centrales','Amable',4.28);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (448,'GONZALEZ, ALEXIS','Centrales','Tuoon',4.88);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (370,'TUoON, CARLOS','Centrales','Tuoon',5.58);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (20,'ORTIZ, ALVARO','Centrales','Tuoon',4.28);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (256,'VARGAS, JORGE','Centrales','Tuoon',4.28);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (247,'ARCIA, BELISARIO','Centrales','Tuoon',4.28);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (446,'CESAR CANO','Centrales','Tuoon',4.88);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (385,'APARICIO, HERMOGENES','Centrales','Alumbrado',4.88);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (383,'CARRION, ALVIN','Centrales','Alumbrado',4.88);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (46,'OJO, DEYVIS','Centrales','Groas',6.27);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (226,'BATISTA, ANIBAL','Centrales','Groas',6.62);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (447,'OBALDIA, CARLOS','Centrales','Groas',5.23);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (445,'BERNARDO BONILLA','Centrales','Groas',5.58);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (437,'RIQUELME, FRANCISCO','Centrales','Vaca',4.28);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (434,'RODRIGUEZ, BALBINO','Centrales','Vaca',4.28);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (438,'BARRIA, JOSE','Centrales','Vaca',4.28);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (435,'NEWMAN, HANSER','Centrales','Vaca',4.28);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (439,'SOLIS WILLIAM','Centrales','Vaca',4.28);
insert  into `brnr_centrales`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (436,'VACA, JOSE','Centrales','Vaca',4.28);

/*Table structure for table `brnr_david` */

DROP TABLE IF EXISTS `brnr_david`;

CREATE TABLE `brnr_david` (
  `codigo` int(11) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `zona` varchar(255) DEFAULT NULL,
  `brigada` varchar(255) DEFAULT NULL,
  `coste` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `brnr_david` */

insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (433,'EDGAD SANCHEZ','David','Operaciones',8.37);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (319,'YASMINA GUTIERREZ','David','Administracion',5.23);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (255,'YORLINIS ORTEGA','David','Administracion',4.53);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (164,'EVELYN SANTAMARIA','David','Administracion',4.53);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (73,'JORGE TORRES','David','Operaciones',6.97);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (163,'JOSEPH CASTILLO','David','TPR',6.97);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (37,'MEYLIN ANGUIZOLA','David','TPR',4.53);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (47,'CARLOS OROCU','David','Mantenimiento',2.14);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (221,'YESSICA PITTI','David','Almacen',4.28);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (238,'JOSE TREJO','David','Almacen',4.53);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (429,'EDUARDO ARAUZ','David','Almacen',8.71);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (253,'BODAN, ALFONSO','David','Bozzi',4.28);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (251,'BOZZI, JOSE','David','Bozzi',6.97);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (252,'POLANCO, MARCELINO','David','Bozzi',4.88);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (250,'ZARATE, HECTOR','David','Bozzi',4.71);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (264,'SANTAMARIA, DEIKER','David','Bozzi',4.28);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (322,'CASTRELLON, ALBIN','David','Bozzi',4.28);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (357,'MARTINEZ, JAVIER','David','Bozzi',4.28);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (414,'AVILES, DAVID','David','Bozzi',4.28);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (418,'POLANCO, FRANCISCO','David','Bozzi',4.53);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (419,'RODRIGUEZ, FRANKLIN','David','Bozzi',4.28);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (421,'BOZZI, ABDEL','David','Bozzi',4.71);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (452,'VLADIMIR ROJAS','David','Bozzi',4.28);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (451,'EDILBERTO DEL CID','David','Bozzi',4.28);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (450,'JAVIER GONZALEZ','David','Bozzi',4.28);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (67,'CONCEPCION, EDWARD','David','Omar',6.62);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (55,'GUTIERREZ, JOSE','David','Omar',6.27);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (68,'SANTIAGO, OMAR','David','Omar',8.37);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (75,'GOMEZ, ELVIS','David','Omar',5.23);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (312,'CASTILLO, LUIS','David','Omar',4.28);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (145,'ANGEL HERNANDEZ','David','Angel',7.67);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (420,'ISAIAS GUERRERO','David','Angel',6.27);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (399,'JUAN RODRIGUEZ','David','Angel',4.28);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (398,'NARCISO SANTOS','David','Angel',4.28);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (288,'MARTIN SANJUR','David','Angel',4.28);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (66,'JUVENAL SALDAoA','David','Juvenal',6.62);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (60,'MANUEL ATENCIO','David','Juvenal',5.23);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (266,'RODOLFO FUENTES','David','Juvenal',5.58);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (78,'NESTOR CONTRERAS','David','Juvenal',5.23);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (64,'MARVIN GONZALEZ','David','Juvenal',6.27);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (120,'ROBINSON MAXWELL','David','Donny',5.23);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (65,'DONNY CASASOLA','David','Donny',9.06);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (422,'JESUS CASTILLO','David','Donny',4.88);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (453,'EDGAR MORENO','David','Donny',4.53);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (94,'ISRAEL VEGA','David','Donny',4.28);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (456,'CARLOS ESPINOZA','David','Donny',4.28);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (307,'ARMUELLES, DIONISIO','David','Poda',4.88);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (314,'MARTINEZ, ANDRES','David','Poda',4.28);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (390,'JIMENEZ, JAIME','David','Poda',4.28);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (387,'HERRERA, EMILIO','David','Poda',4.28);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (294,'ARMUELLES, RICARDO','David','Poda',4.28);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (313,'GONZALEZ, JEAN','David','Grua',4.28);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (349,'MIRANDA, ONESIMO','David','Grua',5.58);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (378,'ANGUIZOLA JOSE','David','Grua',4.88);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (144,'MAYKOL MONTES','David','Grua',5.23);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (104,'BIRMINGHAN, JOSE','David','Luminaria',4.28);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (460,'PACIFICO VEGA','David','Luminaria',4.88);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (219,'ALBERTO CABALLERO','David','Luminaria',4.88);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (56,'ARMANDO PALACIO','David','Taller',10.46);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (52,'DONAL MUoOZ','David','Taller',4.88);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (159,'JONATHAN GONZALEZ','David','Taller',4.28);
insert  into `brnr_david`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (53,'RAUL PIMENTEL','David','Taller',6.97);

/*Table structure for table `falta_trabajadores` */

DROP TABLE IF EXISTS `falta_trabajadores`;

CREATE TABLE `falta_trabajadores` (
  `codigo` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `zona` varchar(255) NOT NULL,
  `brigada` varchar(255) DEFAULT NULL,
  `coste` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `falta_trabajadores` */

insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (464,'ARCENIO ALVEO','Medidiores Centrales','Cortes',4.28);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (413,'CARLOS DEL ROSARIO','Medidiores Centrales','Canasta Centrales',4.53);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (432,'ERNAM MARTINEZ','Medidiores Centrales','Ernan',4.53);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (459,'HECTOR NUóEZ','Medidiores Centrales','Hector',4.53);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (462,'JERMAINE CORTES','Medidiores Centrales','Cortes',4.53);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (458,'JESUS MEDINA','Medidiores Centrales','Medina',4.53);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (469,'JOSE LORENZO MARTINES','Medidiores Centrales','Lorenzo',4.28);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (999,'JOSE LUIS LUGO','Medidiores Centrales','Administración',4.28);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (465,'JUAN JOSE AQUILAR','Medidiores Centrales','Hector',4.28);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (392,'JULIO REYES','Medidiores Centrales','Reyes',4.28);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (463,'OMAR OLIVARES','Medidiores Centrales','Medina',4.28);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (449,'SABDIEL MADRID','Medidiores Centrales','Jhonny A.',4.28);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (467,'TEOFILO MORROY','Medidiores Centrales','Lorenzo',4.28);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (408,'VICTOR MANUEL DE LEON','Medidiores Centrales','Canasta Centrales',4.28);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (470,'CESAR ARAUZ','Chiriqui','Navarro',4.28);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (393,'JOSE PEREZ','Chiriqui','Uribe',4.28);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (396,'AGUILAR, VALENTINA','Centrales','Almacen',5.58);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (428,'CRUZ, GUILLERMO','Centrales','Administracion',4.53);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (407,'QUINTERO, JUAN','Centrales','Almacen',4.28);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (415,'DE LORA, CARLOS','Centrales','Almacen',4.28);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (385,'APARICIO, HERMOGENES','Centrales','Alumbrado',4.88);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (433,'EDGAD SANCHEZ','David','Operaciones',8.37);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (37,'MEYLIN ANGUIZOLA','David','TPR',4.53);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (429,'EDUARDO ARAUZ','David','Almacen',8.71);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (414,'AVILES, DAVID','David','Bozzi',4.28);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (418,'POLANCO, FRANCISCO','David','Bozzi',4.53);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (419,'RODRIGUEZ, FRANKLIN','David','Bozzi',4.28);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (421,'BOZZI, ABDEL','David','Bozzi',4.71);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (452,'VLADIMIR ROJAS','David','Bozzi',4.28);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (451,'EDILBERTO DEL CID','David','Bozzi',4.28);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (450,'JAVIER GONZALEZ','David','Bozzi',4.28);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (422,'JESUS CASTILLO','David','Donny',4.88);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (453,'EDGAR MORENO','David','Donny',4.53);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (456,'CARLOS ESPINOZA','David','Donny',4.28);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (314,'MARTINEZ, ANDRES','David','Poda',4.28);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (390,'JIMENEZ, JAIME','David','Poda',4.28);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (387,'HERRERA, EMILIO','David','Poda',4.28);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (378,'ANGUIZOLA JOSE','David','Grua',4.88);
insert  into `falta_trabajadores`(`codigo`,`nombre`,`zona`,`brigada`,`coste`) values (460,'PACIFICO VEGA','David','Luminaria',4.88);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
