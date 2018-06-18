ALTER TABLE `gdespa_test`.`mo`   
  ADD COLUMN `reWork` BOOL DEFAULT FALSE NULL AFTER `woLineId`;

ALTER TABLE `gdespa_test`.`wo`   
  ADD COLUMN `reWork` BOOL DEFAULT FALSE NULL AFTER `plId`;