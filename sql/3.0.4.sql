ALTER TABLE `wo_worker`   
  ADD COLUMN `extraHoursNight` DECIMAL(10,2) NULL AFTER `planHours`,
  ADD COLUMN `expenses` DECIMAL(10,2) NULL AFTER `extraHoursNight`;

CREATE TABLE `mo` (
  `moId` int(11) NOT NULL AUTO_INCREMENT,
  `initDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `workerId` int(11) DEFAULT NULL,
  `zoneId` int(11) DEFAULT NULL,
  `comments` text,
  `closureId` int(11) DEFAULT NULL,
  `teamId` int(11) DEFAULT NULL,
  PRIMARY KEY (`moId`),
  KEY `ref_mo_zone` (`zoneId`),
  KEY `ref_mo_worker` (`workerId`),
  KEY `ref_mo_closure` (`closureId`),
  KEY `ref_mo_team` (`teamId`),
  CONSTRAINT `ref_mo_closure` FOREIGN KEY (`closureId`) REFERENCES `closure` (`closureId`),
  CONSTRAINT `ref_mo_zone` FOREIGN KEY (`zoneId`) REFERENCES `zone` (`zoneId`),
  CONSTRAINT `ref_mo_team` FOREIGN KEY (`teamId`) REFERENCES `team` (`teamId`),
  CONSTRAINT `ref_mo_worker` FOREIGN KEY (`workerId`) REFERENCES `worker` (`workerId`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

CREATE TABLE `mo_line` (
  `moLineId` int(11) NOT NULL AUTO_INCREMENT,
  `moId` int(11) DEFAULT NULL,
  `meaId` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,  
  `quantity` decimal(6,2) DEFAULT NULL,
  `cost` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`moLineId`),
  KEY `ref_mol_mo` (`moId`),
  KEY `ref_mol_mea` (`meaId`),
  CONSTRAINT `ref_mol_mea` FOREIGN KEY (`meaId`) REFERENCES `mea` (`meaId`),
  CONSTRAINT `ref_mol_mo` FOREIGN KEY (`moId`) REFERENCES `mo` (`moId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

CREATE TABLE `mo_worker` (
  `moWorkerId` int(11) NOT NULL AUTO_INCREMENT,
  `moId` int(11) DEFAULT NULL,
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
  PRIMARY KEY (`moworkerId`),
  KEY `ref_mow_mo` (`moId`),
  KEY `ref_mow_worker` (`workerId`),
  CONSTRAINT `ref_mow_mo` FOREIGN KEY (`moId`) REFERENCES `mo` (`moId`) ON DELETE CASCADE,
  CONSTRAINT `ref_mow_worker` FOREIGN KEY (`workerId`) REFERENCES `worker` (`workerId`) ON DELETE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=latin1;
