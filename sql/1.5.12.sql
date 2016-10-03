ALTER TABLE `gdespa`.`wo_line`   
  ADD COLUMN `line` DECIMAL(6,2) NULL AFTER `quantity`;
ALTER TABLE `gdespa`.`wo_line`   
  ADD  UNIQUE INDEX `idx_wo_line` (`line`);
ALTER TABLE `gdespa`.`pw_line`   
  ADD  UNIQUE INDEX `idx_pw_line` (`line`, `pwId`);
ALTER TABLE `gdespa`.`wo_line`   
  DROP INDEX `idx_wo_line`,
  ADD  UNIQUE INDEX `idx_wo_line` (`line`, `woId`);