ALTER TABLE `item`   
  ADD COLUMN `cost` DECIMAL(12,2) NULL AFTER `minStock`;

CREATE TABLE `team`(  
  `teamId` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255),
  `workerInChargeId` INT(11),
  PRIMARY KEY (`teamId`),
  CONSTRAINT `ref_workerInCharge` FOREIGN KEY (`workerInChargeId`) REFERENCES `worker`(`workerId`)
);

CREATE TABLE `team_line`(  
  `teamLineId` INT(11) NOT NULL NOT NULL AUTO_INCREMENT,
  `teamId` INT(11),
  `workerId` INT(11),
  PRIMARY KEY (`teamLineId`),
  CONSTRAINT `ref_team` FOREIGN KEY (`teamId`) REFERENCES `team`(`teamId`) ON DELETE CASCADE,
  CONSTRAINT `ref_team_worker` FOREIGN KEY (`workerId`) REFERENCES `worker`(`workerId`)
);


ALTER TABLE `wo`   
  ADD COLUMN `teamId` INT(11) NULL AFTER `thirdPartyCompany`,
  ADD CONSTRAINT `ref_wo_team` FOREIGN KEY (`teamId`) REFERENCES `team`(`teamId`);