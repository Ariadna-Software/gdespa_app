CREATE TABLE `gdespa`.`pw_worker`(  
  `pwWorkerId` INT(11) NOT NULL AUTO_INCREMENT,
  `pwId` INT(11),
  `workerId` INT(11),
  PRIMARY KEY (`pwWorkerId`),
  CONSTRAINT `ref_pww_pw` FOREIGN KEY (`pwId`) REFERENCES `gdespa`.`pw`(`pwId`) ON DELETE CASCADE,
  CONSTRAINT `ref_pww_worker` FOREIGN KEY (`workerId`) REFERENCES `gdespa`.`worker`(`workerId`) ON DELETE NO ACTION
);
