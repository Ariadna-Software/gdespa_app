ALTER TABLE `parameters`   
  ADD COLUMN `ucContaLumId` INT(11) NULL AFTER `initControlDocs`,
  ADD CONSTRAINT `ref_uccontalum` FOREIGN KEY (`ucContaLumId`) REFERENCES `cunit`(`cunitId`);

ALTER TABLE `mo`   
  ADD COLUMN `pwId` INT(11) NULL AFTER `meaTypeId`,
  ADD COLUMN `chapterId` INT(11) NULL AFTER `pwId`,
  ADD COLUMN `pwLineId` INT(11) NULL AFTER `chapterId`,
  ADD COLUMN `woId` INT(11) NULL AFTER `pwLineId`,
  ADD CONSTRAINT `ref_mo_pw` FOREIGN KEY (`pwId`) REFERENCES `pw`(`pwId`),
  ADD CONSTRAINT `ref_mo_chapter` FOREIGN KEY (`chapterId`) REFERENCES `chapter`(`chapterId`),
  ADD CONSTRAINT `ref_mo_pwline` FOREIGN KEY (`pwLineId`) REFERENCES `pw_line`(`pwLineId`),
  ADD CONSTRAINT `ref_mo_wo` FOREIGN KEY (`woId`) REFERENCES `wo`(`woId`);
  
ALTER TABLE `mo`   
  ADD COLUMN `woLineId` INT(11) NULL AFTER `woId`,
  ADD CONSTRAINT `ref_mo_woline` FOREIGN KEY (`woLineId`) REFERENCES `wo_line`(`woLineId`);