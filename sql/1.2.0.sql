#---- 
ALTER TABLE `gdespa`.`wo`   
  ADD COLUMN `closureId` INT(11) NULL,
  ADD CONSTRAINT `ref_wo_closure` FOREIGN KEY (`closureId`) REFERENCES `gdespa`.`closure`(`closureId`);
