ALTER TABLE `doc`   
  ADD COLUMN `ext` VARCHAR(255) NULL AFTER `woId`, 
  ADD  KEY `idx_ext` (`ext`);

UPDATE doc SET ext = LOWER(SUBSTRING_INDEX(`file`,'.',-1));