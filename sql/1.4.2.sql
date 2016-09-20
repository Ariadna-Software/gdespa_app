CREATE TABLE `gdespa`.`wo_worker`(  
  `woWorkerId` INT(11) NOT NULL AUTO_INCREMENT,
  `woId` INT(11),
  `workerId` INT,
  `quantity` DECIMAL(5,2),
  `cost` DECIMAL(10,2),
  PRIMARY KEY (`woWorkerId`),
  CONSTRAINT `ref_wow_wo` FOREIGN KEY (`woId`) REFERENCES `gdespa`.`wo`(`woId`),
  CONSTRAINT `ref_wow_worker` FOREIGN KEY (`workerId`) REFERENCES `gdespa`.`worker`(`workerId`) ON DELETE CASCADE
);
ALTER TABLE `gdespa`.`wo_worker`   
  CHANGE `quantity` `quantity` DECIMAL(5,2) DEFAULT 0  NULL,
  CHANGE `cost` `cost` DECIMAL(10,2) DEFAULT 0  NULL;
ALTER TABLE `gdespa`.`wo_worker` DROP FOREIGN KEY `ref_wow_wo`;

ALTER TABLE `gdespa`.`wo_worker` ADD CONSTRAINT `ref_wow_wo` FOREIGN KEY (`woId`) REFERENCES `gdespa`.`wo`(`woId`) ON DELETE CASCADE;

ALTER TABLE `gdespa`.`wo_worker` DROP FOREIGN KEY `ref_wow_worker`;

ALTER TABLE `gdespa`.`wo_worker` ADD CONSTRAINT `ref_wow_worker` FOREIGN KEY (`workerId`) REFERENCES `gdespa`.`worker`(`workerId`) ON DELETE NO ACTION;
