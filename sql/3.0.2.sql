ALTER TABLE `item`   
  ADD COLUMN `cost` DECIMAL(12,2) NULL AFTER `minStock`;

CREATE TABLE `team`(  
  `teamId` INT(11) NOT NULL,
  `name` VARCHAR(255),
  `workerInChargeId` INT(11),
  PRIMARY KEY (`teamId`),
  CONSTRAINT `ref_workerInCharge` FOREIGN KEY (`workerInChargeId`) REFERENCES `worker`(`workerId`)
);

CREATE TABLE `team_line`(  
  `teamLineId` INT(11) NOT NULL,
  `teamId` INT(11),
  `workerId` INT(11),
  PRIMARY KEY (`teamLineId`),
  CONSTRAINT `ref_team` FOREIGN KEY (`teamId`) REFERENCES `team`(`teamId`),
  CONSTRAINT `ref_team_worker` FOREIGN KEY (`workerId`) REFERENCES `worker`(`workerId`)
);