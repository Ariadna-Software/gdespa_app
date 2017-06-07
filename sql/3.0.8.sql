ALTER TABLE `wo_line`   
  ADD COLUMN `pwLineId` INT(11) NULL AFTER `chapterId`,
  ADD CONSTRAINT `rel_wol_pwl` FOREIGN KEY (`pwLineId`) REFERENCES `pw_line`(`pwLineId`);
UPDATE 
wo_line AS wol, wo, pw_line AS pwl
SET wol.pwLineId = pwl.pwLineId
WHERE wol.woId = wo.woId
AND wo.pwId = pwl.pwId
AND wol.cunitId = pwl.cunitId;