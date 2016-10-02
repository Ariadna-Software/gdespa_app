ALTER TABLE `gdespa`.`pw`   
  ADD COLUMN `endDate` DATE NULL AFTER `zoneId`;
ALTER TABLE `gdespa`.`pw`   
  ADD COLUMN `mainK` DECIMAL(5,2) NULL AFTER `endDate`;
UPDATE pw SET mainK = 1;  